// Deno Edge Function: daily weather forecast by lat/lng + date.
// Provider: Open-Meteo (no API key for non-commercial use).
//
// Deploy: supabase functions deploy weather
// Auth: Supabase gateway verify_jwt (Authorization + apikey).
//
// Body (single):
//   { lat, lng, date }
// Body (batch):
//   { locations: [{ lat, lng, date }, ...] }
//
// Response:
//   { results: [{ lat, lng, date, high, low, weatherCode, summary, fetchedAt, provider }] }

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

const OPEN_METEO =
  'https://api.open-meteo.com/v1/forecast'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const locations = normalizeLocations(body)
    if (!locations.length) {
      return json(
        { error: 'lat, lng, and date (YYYY-MM-DD) required' },
        400,
      )
    }
    if (locations.length > 40) {
      return json({ error: 'Too many locations (max 40)' }, 400)
    }

    const fetchedAt = new Date().toISOString()
    const byCoord = new Map<string, LocationReq[]>()
    for (const loc of locations) {
      const ck = `${loc.lat}|${loc.lng}`
      const list = byCoord.get(ck) || []
      list.push(loc)
      byCoord.set(ck, list)
    }

    const forecastByCoord = new Map<
      string,
      { daily: DailyBlock; lat: number; lng: number }
    >()

    await Promise.all(
      [...byCoord.keys()].map(async (ck) => {
        const [latS, lngS] = ck.split('|')
        const lat = Number(latS)
        const lng = Number(lngS)
        const daily = await fetchOpenMeteoDaily(lat, lng)
        if (daily) forecastByCoord.set(ck, { daily, lat, lng })
      }),
    )

    const results = []
    for (const loc of locations) {
      const ck = `${loc.lat}|${loc.lng}`
      const bundle = forecastByCoord.get(ck)
      if (!bundle) {
        results.push({
          lat: loc.lat,
          lng: loc.lng,
          date: loc.date,
          high: null,
          low: null,
          weatherCode: null,
          summary: null,
          fetchedAt,
          provider: 'open-meteo',
          error: 'upstream unavailable',
        })
        continue
      }
      const day = pickDaily(bundle.daily, loc.date)
      results.push({
        lat: loc.lat,
        lng: loc.lng,
        date: loc.date,
        high: day?.high ?? null,
        low: day?.low ?? null,
        weatherCode: day?.weatherCode ?? null,
        summary: day?.summary ?? null,
        fetchedAt,
        provider: 'open-meteo',
      })
    }

    return json({ results, fetchedAt, provider: 'open-meteo' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return json({ error: message }, 500)
  }
})

type LocationReq = { lat: number; lng: number; date: string }

type DailyBlock = {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
}

function normalizeLocations(body: Record<string, unknown>): LocationReq[] {
  const raw = Array.isArray(body.locations)
    ? body.locations
    : body.lat != null && body.lng != null
      ? [{ lat: body.lat, lng: body.lng, date: body.date }]
      : []

  const out: LocationReq[] = []
  const seen = new Set<string>()

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const row = item as Record<string, unknown>
    const lat = Number(row.lat)
    const lng = Number(row.lng)
    const date = String(row.date || '')
      .trim()
      .slice(0, 10)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) continue
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue
    const key = `${roundCoord(lat)}|${roundCoord(lng)}|${date}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ lat: roundCoord(lat), lng: roundCoord(lng), date })
  }
  return out
}

function roundCoord(n: number): number {
  return Math.round(n * 1000) / 1000
}

async function fetchOpenMeteoDaily(
  lat: number,
  lng: number,
): Promise<DailyBlock | null> {
  const url = new URL(OPEN_METEO)
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lng))
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min',
  )
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', '7')

  const upstream = await fetch(url.toString())
  const payload = await upstream.json().catch(() => null)
  if (!upstream.ok || !payload?.daily) {
    return null
  }
  return payload.daily as DailyBlock
}

function pickDaily(daily: DailyBlock, date: string) {
  const idx = (daily.time || []).indexOf(date)
  if (idx < 0) return null
  const weatherCode = Number(daily.weather_code?.[idx])
  const high = Number(daily.temperature_2m_max?.[idx])
  const low = Number(daily.temperature_2m_min?.[idx])
  return {
    weatherCode: Number.isFinite(weatherCode) ? weatherCode : null,
    high: Number.isFinite(high) ? Math.round(high) : null,
    low: Number.isFinite(low) ? Math.round(low) : null,
    summary: summaryForCode(weatherCode),
  }
}

/** WMO weather interpretation codes → short English label. */
function summaryForCode(code: number): string | null {
  if (!Number.isFinite(code)) return null
  if (code === 0) return 'Clear'
  if (code === 1) return 'Mainly clear'
  if (code === 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code === 45 || code === 48) return 'Fog'
  if (code >= 51 && code <= 57) return 'Drizzle'
  if (code >= 61 && code <= 67) return 'Rain'
  if (code >= 71 && code <= 77) return 'Snow'
  if (code >= 80 && code <= 82) return 'Showers'
  if (code === 85 || code === 86) return 'Snow showers'
  if (code >= 95 && code <= 99) return 'Thunderstorm'
  return 'Weather'
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
