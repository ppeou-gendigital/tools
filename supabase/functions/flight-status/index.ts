// Deno Edge Function: live flight status.
// Primary: AeroDataBox (RapidAPI) — flight number + date.
// Fallback: Aviationstack — real-time only (no flight_date on free).
//
// Deploy: supabase functions deploy flight-status
// Secrets:
//   AERODATABOX_API_KEY          (RapidAPI key — preferred)
//   AVIATIONSTACK_API_KEY        (optional fallback)
//   AERODATABOX_RAPIDAPI_HOST    (optional, default aerodatabox.p.rapidapi.com)
//
// Auth: Supabase gateway verify_jwt (Authorization + apikey).

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const aeroKey = Deno.env.get('AERODATABOX_API_KEY') ?? ''
    const aviationKey = Deno.env.get('AVIATIONSTACK_API_KEY') ?? ''
    const rapidHost =
      Deno.env.get('AERODATABOX_RAPIDAPI_HOST') ??
      'aerodatabox.p.rapidapi.com'

    if (!aeroKey && !aviationKey) {
      return json({ error: 'Flight status not configured' }, 503)
    }

    const body = await req.json().catch(() => ({}))
    const airline = String(body.airline || '')
      .trim()
      .toUpperCase()
    const flightNumber = String(body.flightNumber || body.flight_number || '')
      .trim()
      .toUpperCase()
      .replace(/^0+(?=\d)/, '')
    const date = String(body.date || '')
      .trim()
      .slice(0, 10)

    if (!airline || !flightNumber) {
      return json({ error: 'airline and flightNumber required' }, 400)
    }
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return json({ error: 'date must be YYYY-MM-DD' }, 400)
    }

    const flightIata = `${airline}${flightNumber}`
    const errors: string[] = []

    if (aeroKey && date) {
      const aero = await fetchAeroDataBox(aeroKey, rapidHost, flightIata, date)
      if (aero.ok && aero.normalized) {
        return json({
          ...aero.normalized,
          airline,
          flightNumber,
          flightIata,
          date,
          provider: 'aerodatabox',
        })
      }
      if (aero.errorMessage) errors.push(`AeroDataBox: ${aero.errorMessage}`)
    } else if (aeroKey && !date) {
      errors.push('AeroDataBox: date (YYYY-MM-DD) required')
    }

    if (aviationKey) {
      const stack = await fetchAviationstack(aviationKey, flightIata)
      if (stack.ok) {
        const rows = Array.isArray(stack.payload?.data) ? stack.payload.data : []
        const row = pickAviationstackRow(rows, date)
        if (row) {
          return json({
            ...normalizeAviationstackRow(row, date),
            airline,
            flightNumber,
            flightIata,
            provider: 'aviationstack',
          })
        }
        errors.push('Aviationstack: no matching flight')
      } else if (stack.errorMessage) {
        errors.push(`Aviationstack: ${stack.errorMessage}`)
      }
    }

    if (errors.length) {
      const quota = errors.some((e) => /429|quota|rate/i.test(e))
      return json({ error: errors.join(' · ') }, quota ? 429 : 502)
    }

    return json({
      status: 'unknown',
      delayMinutes: null,
      depGate: null,
      depTerminal: null,
      arrGate: null,
      arrTerminal: null,
      scheduledDep: null,
      estimatedDep: null,
      scheduledArr: null,
      estimatedArr: null,
      checkedAt: new Date().toISOString(),
      airline,
      flightNumber,
      date: date || null,
      flightIata,
      provider: null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return json({ error: message }, 500)
  }
})

/** GET /flights/number/{TP440}/{YYYY-MM-DD} — Tier 2 */
async function fetchAeroDataBox(
  apiKey: string,
  host: string,
  flightIata: string,
  date: string,
) {
  const url = new URL(
    `https://${host}/flights/number/${encodeURIComponent(flightIata)}/${date}`,
  )
  url.searchParams.set('withAircraftImage', 'false')
  url.searchParams.set('withLocation', 'false')
  url.searchParams.set('dateLocalRole', 'Departure')

  const upstream = await fetch(url.toString(), {
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': host,
    },
  })
  const payload = await upstream.json().catch(() => null)

  if (!upstream.ok) {
    const message =
      (payload && (payload.message || payload.error || payload.detail)) ||
      `Upstream ${upstream.status}`
    return {
      ok: false,
      errorMessage: String(message),
      normalized: null,
    }
  }

  const rows = Array.isArray(payload) ? payload : []
  if (!rows.length) {
    return { ok: false, errorMessage: 'no matching flight', normalized: null }
  }

  const row = rows[0] as Record<string, unknown>
  return {
    ok: true,
    errorMessage: null,
    normalized: normalizeAeroDataBoxRow(row, date),
  }
}

function normalizeAeroDataBoxRow(
  row: Record<string, unknown>,
  date: string,
) {
  const dep = (row.departure || {}) as Record<string, unknown>
  const arr = (row.arrival || {}) as Record<string, unknown>
  const scheduledDep = timeUtc(dep.scheduledTime)
  const estimatedDep = timeUtc(dep.revisedTime) || timeUtc(dep.predictedTime)
  const scheduledArr = timeUtc(arr.scheduledTime)
  const estimatedArr = timeUtc(arr.revisedTime) || timeUtc(arr.predictedTime)
  const delayMinutes = delayBetween(scheduledDep, estimatedDep)

  return {
    status: normalizeStatus(row.status, delayMinutes),
    delayMinutes,
    depGate: strOrNull(dep.gate),
    depTerminal: strOrNull(dep.terminal),
    arrGate: strOrNull(arr.gate),
    arrTerminal: strOrNull(arr.terminal),
    scheduledDep,
    estimatedDep: estimatedDep || scheduledDep,
    scheduledArr,
    estimatedArr: estimatedArr || scheduledArr,
    checkedAt: new Date().toISOString(),
    date,
  }
}

function timeUtc(slot: unknown): string | null {
  if (!slot || typeof slot !== 'object') return null
  const utc = (slot as { utc?: unknown }).utc
  return strOrNull(utc)
}

function delayBetween(
  scheduled: string | null,
  revised: string | null,
): number | null {
  if (!scheduled || !revised) return null
  const a = Date.parse(scheduled)
  const b = Date.parse(revised)
  if (Number.isNaN(a) || Number.isNaN(b)) return null
  const mins = Math.round((b - a) / 60000)
  return mins > 0 ? mins : mins < 0 ? mins : 0
}

async function fetchAviationstack(apiKey: string, flightIata: string) {
  const bases = [
    'https://api.aviationstack.com/v1/flights',
    'http://api.aviationstack.com/v1/flights',
  ]

  let lastError = 'Upstream failed'

  for (const base of bases) {
    const url = new URL(base)
    url.searchParams.set('access_key', apiKey)
    url.searchParams.set('flight_iata', flightIata)
    url.searchParams.set('limit', '10')

    const upstream = await fetch(url.toString())
    const payload = await upstream.json().catch(() => ({}))
    const apiErr = payload?.error
    const code = String(apiErr?.code || '')
    const message =
      apiErr?.info || apiErr?.message || `Upstream ${upstream.status}`

    if (apiErr) {
      lastError = message
      if (
        code === 'https_access_restricted' ||
        /https/i.test(String(message))
      ) {
        continue
      }
      return { ok: false, errorMessage: message, payload: null }
    }

    if (!upstream.ok) {
      lastError = message
      continue
    }

    return { ok: true, errorMessage: null, payload }
  }

  return { ok: false, errorMessage: lastError, payload: null }
}

function pickAviationstackRow(
  rows: Record<string, unknown>[],
  date: string,
): Record<string, unknown> | null {
  if (!rows.length) return null
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const match = rows.find((r) => String(r.flight_date || '') === date)
    if (match) return match
  }
  return rows[0]
}

function normalizeAviationstackRow(
  row: Record<string, unknown>,
  date: string,
) {
  const dep = (row.departure || {}) as Record<string, unknown>
  const arr = (row.arrival || {}) as Record<string, unknown>
  const delayRaw = dep.delay ?? arr.delay ?? null
  const delayMinutes =
    delayRaw == null || delayRaw === ''
      ? null
      : Number.isFinite(Number(delayRaw))
        ? Number(delayRaw)
        : null

  return {
    status: normalizeStatus(row.flight_status, delayMinutes),
    delayMinutes,
    depGate: strOrNull(dep.gate),
    depTerminal: strOrNull(dep.terminal),
    arrGate: strOrNull(arr.gate),
    arrTerminal: strOrNull(arr.terminal),
    scheduledDep: strOrNull(dep.scheduled),
    estimatedDep: strOrNull(dep.estimated || dep.actual),
    scheduledArr: strOrNull(arr.scheduled),
    estimatedArr: strOrNull(arr.estimated || arr.actual),
    checkedAt: new Date().toISOString(),
    date: strOrNull(row.flight_date) || date || null,
  }
}

function strOrNull(v: unknown): string | null {
  if (v == null) return null
  const s = String(v).trim()
  return s || null
}

function normalizeStatus(
  raw: unknown,
  delayMinutes: number | null,
): string {
  const s = String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
  if (s === 'cancelled' || s === 'canceled' || s === 'canceleduncertain') {
    return 'cancelled'
  }
  if (s === 'diverted') return 'diverted'
  if (s === 'landed' || s === 'arrived') return 'landed'
  if (
    s === 'active' ||
    s === 'enroute' ||
    s === 'en-route' ||
    s === 'departed' ||
    s === 'approaching'
  ) {
    return 'active'
  }
  if (s === 'incident') return 'incident'
  if (s === 'delayed' || (delayMinutes != null && delayMinutes > 0)) {
    return 'delayed'
  }
  if (
    s === 'scheduled' ||
    s === 'expected' ||
    s === 'checkin' ||
    s === 'boarding' ||
    s === 'gateclosed' ||
    s === 'ontime'
  ) {
    return 'scheduled'
  }
  return s || 'unknown'
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
