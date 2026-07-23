/**
 * IANA timezone helpers + wall-clock ↔ UTC conversion.
 * datetime-local values are treated as wall time in a chosen zone,
 * not the browser's local zone.
 */

let cachedZones = null

export function listTimeZones() {
  if (cachedZones) return cachedZones
  try {
    if (typeof Intl.supportedValuesOf === 'function') {
      cachedZones = Intl.supportedValuesOf('timeZone')
      return cachedZones
    }
  } catch {
    // fall through
  }
  cachedZones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'America/Mexico_City',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Madrid',
    'Europe/Rome',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Asia/Shanghai',
    'Asia/Singapore',
    'Asia/Bangkok',
    'Australia/Sydney',
    'Pacific/Auckland',
  ]
  return cachedZones
}

/** Filter IANA zones by free-text query (city / region / offset hint). */
export function filterTimeZones(query, limit = 12) {
  const zones = listTimeZones()
  const q = String(query || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
  if (!q) {
    // Prefer common travel zones first when empty
    const preferred = [
      'America/Chicago',
      'America/New_York',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Europe/Madrid',
      'Asia/Tokyo',
      'Asia/Singapore',
      'Australia/Sydney',
      'UTC',
    ]
    const rest = zones.filter((z) => !preferred.includes(z))
    return [...preferred.filter((z) => zones.includes(z)), ...rest].slice(
      0,
      limit,
    )
  }
  const scored = []
  for (const z of zones) {
    const lower = z.toLowerCase()
    const city = lower.split('/').pop() || lower
    let score = 0
    if (lower === q || city === q) score = 100
    else if (city.startsWith(q)) score = 80
    else if (lower.startsWith(q)) score = 70
    else if (city.includes(q)) score = 50
    else if (lower.includes(q)) score = 30
    if (score) scored.push({ z, score })
  }
  scored.sort((a, b) => b.score - a.score || a.z.localeCompare(b.z))
  return scored.slice(0, limit).map((s) => s.z)
}

function pad(n) {
  return String(n).padStart(2, '0')
}

/**
 * Convert datetime-local string (YYYY-MM-DDTHH:mm) interpreted in `timeZone`
 * into a UTC ISO string.
 */
export function wallTimeToUtcIso(dateTimeLocal, timeZone) {
  if (!dateTimeLocal) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(dateTimeLocal)
  if (!m) return null
  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  const hour = Number(m[4])
  const minute = Number(m[5])
  const tz = timeZone || 'UTC'

  let utc = Date.UTC(year, month - 1, day, hour, minute, 0)

  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })

  function partsOf(ms) {
    const map = Object.fromEntries(
      dtf
        .formatToParts(new Date(ms))
        .filter((p) => p.type !== 'literal')
        .map((p) => [p.type, p.value]),
    )
    return {
      year: Number(map.year),
      month: Number(map.month),
      day: Number(map.day),
      hour: Number(map.hour),
      minute: Number(map.minute),
      second: Number(map.second),
    }
  }

  for (let i = 0; i < 4; i += 1) {
    const p = partsOf(utc)
    const asUtc = Date.UTC(
      p.year,
      p.month - 1,
      p.day,
      p.hour,
      p.minute,
      p.second,
    )
    const wanted = Date.UTC(year, month - 1, day, hour, minute, 0)
    const diff = wanted - asUtc
    if (diff === 0) break
    utc += diff
  }

  return new Date(utc).toISOString()
}

/** Format a UTC instant as datetime-local wall time in `timeZone`. */
export function utcIsoToWallTime(iso, timeZone) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timeZone || 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(d)
    const get = (type) => parts.find((p) => p.type === type)?.value
    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`
  } catch {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
}

export function shortTimeZoneLabel(timeZone) {
  if (!timeZone) return ''
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short',
    }).formatToParts(new Date())
    return parts.find((p) => p.type === 'timeZoneName')?.value || timeZone
  } catch {
    return timeZone
  }
}
