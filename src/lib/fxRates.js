/**
 * FX helpers via Frankfurter (ECB daily rates, no API key).
 * Rates are quoted as: 1 `base` = rates[code] `code`.
 */

const FRANKFURTER = 'https://api.frankfurter.app/latest'

/** @type {Map<string, { at: number, rates: Record<string, number> }>} */
const cache = new Map()
const CACHE_MS = 1000 * 60 * 60 // 1 hour

/**
 * Fetch rates for converting INTO `preferred` (1 preferred = rates[code] code…).
 * Returns a map of foreign→preferred multipliers (amount_preferred = amount_foreign * mult).
 */
export async function fetchRatesToPreferred(preferred, currencies) {
  const target = String(preferred || '').toUpperCase()
  if (!target || !/^[A-Z]{3}$/.test(target)) {
    return { preferred: target, toPreferred: {} }
  }

  const sources = [
    ...new Set(
      (currencies || [])
        .map((c) => String(c || '').toUpperCase())
        .filter((c) => /^[A-Z]{3}$/.test(c) && c !== target),
    ),
  ]

  if (sources.length === 0) {
    return { preferred: target, toPreferred: {} }
  }

  const cacheKey = `${target}:${sources.slice().sort().join(',')}`
  const hit = cache.get(cacheKey)
  if (hit && Date.now() - hit.at < CACHE_MS) {
    return { preferred: target, toPreferred: hit.rates }
  }

  // 1 target = rates[X] X  →  1 X = 1/rates[X] target
  const url = `${FRANKFURTER}?from=${encodeURIComponent(target)}&to=${encodeURIComponent(sources.join(','))}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`FX rates unavailable (${res.status})`)
  }
  const body = await res.json()
  const raw = body?.rates && typeof body.rates === 'object' ? body.rates : {}
  const toPreferred = {}
  for (const code of sources) {
    const quoted = Number(raw[code])
    if (Number.isFinite(quoted) && quoted > 0) {
      toPreferred[code] = 1 / quoted
    }
  }

  cache.set(cacheKey, { at: Date.now(), rates: toPreferred })
  return { preferred: target, toPreferred }
}

/** Convert integer minor units; returns null when no rate. */
export function convertCents(cents, fromCurrency, preferred, toPreferred) {
  const from = String(fromCurrency || '').toUpperCase()
  const to = String(preferred || '').toUpperCase()
  if (!from || !to) return null
  if (from === to) return Math.round(Number(cents) || 0)
  const mult = toPreferred?.[from]
  if (!Number.isFinite(mult) || mult <= 0) return null
  return Math.round((Number(cents) || 0) * mult)
}
