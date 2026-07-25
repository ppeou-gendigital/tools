/**
 * Daily weather for itinerary geo entries (edge function → Open-Meteo).
 * Cache TTL 15 minutes; only days within a 7-day horizon are fetched.
 */

import { entryDayKey } from '@/lib/format'
import { civilDateKey } from '@/lib/journeyStatus'
import { supabase } from '@/lib/supabase'
import { hasGeoCoords } from '@/lib/timelineContext'

export const CACHE_TTL_MS = 15 * 60 * 1000
export const WEATHER_HORIZON_DAYS = 7

/** @type {Map<string, { at: number, value: object | null, error?: string }>} */
const cache = new Map()

export function roundCoord(n) {
  return Math.round(Number(n) * 1000) / 1000
}

/**
 * @param {number} lat
 * @param {number} lng
 * @param {string} date YYYY-MM-DD
 */
export function weatherKey(lat, lng, date) {
  return `${roundCoord(lat)}|${roundCoord(lng)}|${String(date || '').slice(0, 10)}`
}

/**
 * @param {string} dayKey YYYY-MM-DD
 * @param {number} days
 */
export function addDaysKey(dayKey, days) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dayKey || ''))
  if (!m) return null
  const dt = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
  dt.setUTCDate(dt.getUTCDate() + days)
  const y = dt.getUTCFullYear()
  const mo = String(dt.getUTCMonth() + 1).padStart(2, '0')
  const d = String(dt.getUTCDate()).padStart(2, '0')
  return `${y}-${mo}-${d}`
}

/**
 * Today … today+6 in the journey timezone.
 * @param {string} dayKey
 * @param {object | null | undefined} journey
 * @param {Date} [now]
 */
export function isWithinWeatherHorizon(dayKey, journey, now = new Date()) {
  if (!dayKey || dayKey === 'undated') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return false
  const tz = journey?.defaultTimezone || 'UTC'
  const today = civilDateKey(now, tz)
  if (dayKey < today) return false
  const end = addDaysKey(today, WEATHER_HORIZON_DAYS - 1)
  return Boolean(end && dayKey <= end)
}

/**
 * Geo + dated key for an entry (no horizon check). Used for cache / offline lookup.
 * @param {object} entry
 * @returns {{ lat: number, lng: number, date: string, key: string } | null}
 */
export function weatherKeyFromEntry(entry) {
  if (!hasGeoCoords(entry)) return null
  const date = entryDayKey(entry)
  if (!date || date === 'undated' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null
  }
  const lat = roundCoord(entry.lat)
  const lng = roundCoord(entry.lng)
  return { lat, lng, date, key: weatherKey(lat, lng, date) }
}

/**
 * @param {object} entry
 * @param {object | null | undefined} journey
 * @param {Date} [now]
 * @returns {{ lat: number, lng: number, date: string, key: string } | null}
 */
export function weatherLookupFromEntry(entry, journey, now = new Date()) {
  const base = weatherKeyFromEntry(entry)
  if (!base) return null
  if (!isWithinWeatherHorizon(base.date, journey, now)) return null
  return base
}

/**
 * Seed in-memory cache from an offline pack snapshot.
 * @param {Record<string, object> | null | undefined} weatherByKey
 */
export function hydrateWeatherCache(weatherByKey) {
  if (!weatherByKey || typeof weatherByKey !== 'object') return
  for (const [key, value] of Object.entries(weatherByKey)) {
    if (!value || typeof value !== 'object') continue
    const fetchedAt = value.fetchedAt ? Date.parse(value.fetchedAt) : NaN
    const at = Number.isFinite(fetchedAt) ? fetchedAt : Date.now()
    cache.set(key, { at, value })
  }
}

/**
 * @param {string} key
 * @returns {object | null}
 */
export function getCachedWeather(key) {
  const hit = cache.get(key)
  if (!hit?.value) return null
  return hit.value
}

/**
 * @param {object[]} entries
 * @param {object | null | undefined} journey
 * @param {{ now?: Date, force?: boolean }} [opts]
 * @returns {Promise<Record<string, object>>}
 */
export async function fetchWeatherForEntries(entries, journey, opts = {}) {
  const now = opts.now instanceof Date ? opts.now : new Date()
  const force = Boolean(opts.force)
  const list = Array.isArray(entries) ? entries : []

  /** @type {Map<string, { lat: number, lng: number, date: string }>} */
  const needed = new Map()
  for (const entry of list) {
    const lookup = weatherLookupFromEntry(entry, journey, now)
    if (!lookup) continue
    if (!needed.has(lookup.key)) {
      needed.set(lookup.key, {
        lat: lookup.lat,
        lng: lookup.lng,
        date: lookup.date,
      })
    }
  }

  const stale = []
  for (const [key, loc] of needed) {
    const hit = cache.get(key)
    const ageOk =
      hit &&
      !hit.error &&
      hit.value &&
      Date.now() - hit.at < CACHE_TTL_MS
    if (!force && ageOk) continue
    stale.push(loc)
  }

  if (stale.length) {
    try {
      const { data, error } = await supabase.functions.invoke('weather', {
        body: { locations: stale },
      })
      if (error) throw error
      if (data?.error) throw new Error(data.error)
      const results = Array.isArray(data?.results) ? data.results : []
      const at = Date.now()
      for (const row of results) {
        if (!row) continue
        const key = weatherKey(row.lat, row.lng, row.date)
        if (row.error && row.high == null && row.weatherCode == null) {
          cache.set(key, {
            at,
            value: null,
            error: row.error || 'Weather unavailable',
          })
          continue
        }
        const value = {
          lat: row.lat,
          lng: row.lng,
          date: row.date,
          high: row.high ?? null,
          low: row.low ?? null,
          weatherCode: row.weatherCode ?? null,
          summary: row.summary ?? summaryForCode(row.weatherCode),
          fetchedAt: row.fetchedAt || new Date(at).toISOString(),
          provider: row.provider || 'open-meteo',
        }
        cache.set(key, { at, value })
      }
    } catch (err) {
      const message = err?.message || 'Weather fetch failed'
      console.warn('[viaggio] weather:', message)
      for (const loc of stale) {
        const key = weatherKey(loc.lat, loc.lng, loc.date)
        if (!cache.has(key)) {
          cache.set(key, { at: Date.now(), value: null, error: message })
        }
      }
    }
  }

  /** @type {Record<string, object>} */
  const out = {}
  for (const key of needed.keys()) {
    const hit = cache.get(key)
    if (hit?.value) out[key] = hit.value
  }
  return out
}

/**
 * Prefetch map for offline packs (same shape as fetch result).
 * @param {object[]} entries
 * @param {object | null | undefined} journey
 */
export async function prefetchWeatherForPack(entries, journey) {
  return fetchWeatherForEntries(entries, journey, { force: true })
}

/**
 * Temperature unit from BCP-47 locale. US / Liberia / Myanmar → °F; else °C.
 * @param {string | null | undefined} locale
 * @returns {'C' | 'F'}
 */
export function temperatureUnitFromLocale(locale) {
  const tag = String(locale || '').trim().replace(/_/g, '-')
  if (!tag) return 'C'
  try {
    const loc = new Intl.Locale(tag)
    // Prefer explicit region (en-US); bare "en" stays °C unless maximized to US.
    const region = String(
      loc.region || (tag.includes('-') ? '' : loc.maximize().region) || '',
    ).toUpperCase()
    if (region === 'US' || region === 'LR' || region === 'MM') return 'F'
  } catch {
    if (/-(US|LR|MM)\b/i.test(tag)) return 'F'
  }
  return 'C'
}

/** @param {number} celsius */
export function celsiusToFahrenheit(celsius) {
  return Math.round((Number(celsius) * 9) / 5 + 32)
}

/**
 * Compact chip text, e.g. "22°C / 14°C" or "72°F / 57°F".
 * Open-Meteo values are Celsius; convert when unit is F.
 * @param {object | null | undefined} weather
 * @param {{ unit?: 'C' | 'F', locale?: string | null }} [opts]
 */
export function formatWeatherChip(weather, opts = {}) {
  if (!weather) return ''
  const unit =
    opts.unit === 'C' || opts.unit === 'F'
      ? opts.unit
      : temperatureUnitFromLocale(opts.locale)
  const toDisplay = (c) => {
    if (c == null || !Number.isFinite(Number(c))) return null
    const n = Math.round(Number(c))
    return unit === 'F' ? celsiusToFahrenheit(n) : n
  }
  const high = toDisplay(weather.high)
  const low = toDisplay(weather.low)
  const suffix = unit === 'F' ? '°F' : '°C'
  if (high != null && low != null) return `${high}${suffix} / ${low}${suffix}`
  if (high != null) return `${high}${suffix}`
  if (low != null) return `${low}${suffix}`
  return weather.summary ? String(weather.summary) : ''
}

/**
 * Lucide-friendly icon id from WMO code.
 * @param {number | null | undefined} code
 * @returns {'sun'|'cloud-sun'|'cloud'|'fog'|'drizzle'|'rain'|'snow'|'storm'|'cloud'}
 */
export function weatherIconKind(code) {
  const n = Number(code)
  if (!Number.isFinite(n)) return 'cloud'
  if (n === 0) return 'sun'
  if (n === 1 || n === 2) return 'cloud-sun'
  if (n === 3) return 'cloud'
  if (n === 45 || n === 48) return 'fog'
  if (n >= 51 && n <= 57) return 'drizzle'
  if (n >= 61 && n <= 67) return 'rain'
  if (n >= 71 && n <= 77) return 'snow'
  if (n >= 80 && n <= 82) return 'rain'
  if (n === 85 || n === 86) return 'snow'
  if (n >= 95 && n <= 99) return 'storm'
  return 'cloud'
}

/** @param {number | null | undefined} code */
export function summaryForCode(code) {
  const n = Number(code)
  if (!Number.isFinite(n)) return null
  if (n === 0) return 'Clear'
  if (n === 1) return 'Mainly clear'
  if (n === 2) return 'Partly cloudy'
  if (n === 3) return 'Overcast'
  if (n === 45 || n === 48) return 'Fog'
  if (n >= 51 && n <= 57) return 'Drizzle'
  if (n >= 61 && n <= 67) return 'Rain'
  if (n >= 71 && n <= 77) return 'Snow'
  if (n >= 80 && n <= 82) return 'Showers'
  if (n === 85 || n === 86) return 'Snow showers'
  if (n >= 95 && n <= 99) return 'Thunderstorm'
  return 'Weather'
}
