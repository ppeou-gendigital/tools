/**
 * FX helpers — Frankfurter (ECB) with CDN fallback for browsers that block it.
 * Rates are quoted as: 1 `base` = rates[code] `code`.
 */

/** Prefer .dev (CORS). Skip .app — 301 redirect often lacks CORS and breaks browsers. */
const FRANKFURTER_URLS = ['https://api.frankfurter.dev/v1/latest']

/**
 * Fallback when Frankfurter is blocked (Opera/Firefox tracking protection can hang
 * or fail .dev/.app). Same shape: 1 base = rates[code] foreign.
 */
const FALLBACK_RATE_URLS = [
  (base) =>
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base.toLowerCase()}.json`,
  (base) =>
    `https://latest.currency-api.pages.dev/v1/currencies/${base.toLowerCase()}.json`,
]

export const FRANKFURTER_SOURCE_URL = 'https://www.frankfurter.app/'
export const FALLBACK_SOURCE_URL =
  'https://github.com/fawazahmed0/exchange-api'

const FETCH_TIMEOUT_MS = 4000

/** @type {Map<string, { at: number, rates: Record<string, number>, asOf: string | null, sourceUrl: string }>} */
const cache = new Map()
const CACHE_MS = 1000 * 60 * 60 // 1 hour

async function fetchWithTimeout(url) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    return res
  } finally {
    clearTimeout(timer)
  }
}

async function fetchFrankfurterRates(from, toCodes) {
  const qs = `from=${encodeURIComponent(from)}&to=${encodeURIComponent(toCodes.join(','))}`
  let lastErr
  for (const base of FRANKFURTER_URLS) {
    try {
      const res = await fetchWithTimeout(`${base}?${qs}`)
      if (!res.ok) {
        lastErr = new Error(`FX rates unavailable (${res.status})`)
        continue
      }
      const body = await res.json()
      const raw = body?.rates && typeof body.rates === 'object' ? body.rates : {}
      const asOf =
        typeof body?.date === 'string' && body.date.trim()
          ? body.date.trim()
          : null
      return { rates: raw, asOf, sourceUrl: FRANKFURTER_SOURCE_URL }
    } catch (err) {
      lastErr = err
    }
  }
  throw lastErr || new Error('FX rates unavailable')
}

/** Parse fawazahmed0 currency-api JSON into uppercase rate map for `from`. */
function parseFallbackBody(body, from) {
  const key = String(from || '').toLowerCase()
  const nest = body?.[key]
  if (!nest || typeof nest !== 'object') return { rates: {}, asOf: null }
  const rates = {}
  for (const [code, value] of Object.entries(nest)) {
    const n = Number(value)
    if (Number.isFinite(n) && n > 0) rates[code.toUpperCase()] = n
  }
  const asOf =
    typeof body?.date === 'string' && body.date.trim() ? body.date.trim() : null
  return { rates, asOf }
}

async function fetchFallbackRates(from) {
  let lastErr
  for (const build of FALLBACK_RATE_URLS) {
    const url = build(from)
    try {
      const res = await fetchWithTimeout(url)
      if (!res.ok) {
        lastErr = new Error(`FX rates unavailable (${res.status})`)
        continue
      }
      const body = await res.json()
      const parsed = parseFallbackBody(body, from)
      if (Object.keys(parsed.rates).length === 0) {
        lastErr = new Error('FX rates empty')
        continue
      }
      return { ...parsed, sourceUrl: FALLBACK_SOURCE_URL }
    } catch (err) {
      lastErr = err
    }
  }
  throw lastErr || new Error('FX rates unavailable')
}

/**
 * Fetch rates for converting INTO `preferred` (1 preferred = rates[code] code…).
 * Returns a map of foreign→preferred multipliers (amount_preferred = amount_foreign * mult).
 */
export async function fetchRatesToPreferred(preferred, currencies) {
  const target = String(preferred || '').toUpperCase()
  const empty = {
    preferred: target,
    toPreferred: {},
    asOf: null,
    sourceUrl: FRANKFURTER_SOURCE_URL,
  }
  if (!target || !/^[A-Z]{3}$/.test(target)) {
    return empty
  }

  const sources = [
    ...new Set(
      (currencies || [])
        .map((c) => String(c || '').toUpperCase())
        .filter((c) => /^[A-Z]{3}$/.test(c) && c !== target),
    ),
  ]

  if (sources.length === 0) {
    return empty
  }

  const cacheKey = `${target}:${sources.slice().sort().join(',')}`
  const hit = cache.get(cacheKey)
  if (hit && Date.now() - hit.at < CACHE_MS) {
    return {
      preferred: target,
      toPreferred: hit.rates,
      asOf: hit.asOf,
      sourceUrl: hit.sourceUrl,
    }
  }

  let raw
  let asOf
  let sourceUrl = FRANKFURTER_SOURCE_URL
  try {
    ;({ rates: raw, asOf, sourceUrl } = await fetchFrankfurterRates(
      target,
      sources,
    ))
  } catch {
    ;({ rates: raw, asOf, sourceUrl } = await fetchFallbackRates(target))
  }

  // 1 target = rates[X] X  →  1 X = 1/rates[X] target
  const toPreferred = {}
  for (const code of sources) {
    const quoted = Number(raw[code])
    if (Number.isFinite(quoted) && quoted > 0) {
      toPreferred[code] = 1 / quoted
    }
  }

  cache.set(cacheKey, {
    at: Date.now(),
    rates: toPreferred,
    asOf,
    sourceUrl,
  })
  return {
    preferred: target,
    toPreferred,
    asOf,
    sourceUrl,
  }
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
