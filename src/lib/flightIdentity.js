/**
 * Normalize / parse flight identifiers for status lookup.
 */

import { AIRLINES } from '@/lib/airlines'

const IATA_RE = /^[A-Z0-9]{2}$/
const FLIGHT_IATA_RE = /^([A-Z]{2}|[A-Z][0-9]|[0-9][A-Z])\s*([0-9]{1,4}[A-Z]?)$/i

/** @param {string | null | undefined} raw */
export function normalizeAirline(raw) {
  const original = String(raw || '').trim()
  if (!original) return ''
  // Allow "TP · TAP Air Portugal" pasted labels → TP
  const beforeDot = original.split(/[·•|]/)[0]?.trim() || original
  const token = (beforeDot.split(/\s+/)[0] || '').toUpperCase()
  if (IATA_RE.test(token)) return token

  const lower = original.toLowerCase()
  const exact = AIRLINES.find(
    (a) => a.name.toLowerCase() === lower || a.iata.toLowerCase() === lower,
  )
  if (exact) return exact.iata
  const starts = AIRLINES.find(
    (a) =>
      a.name.toLowerCase().startsWith(lower) ||
      lower.startsWith(a.name.toLowerCase()),
  )
  if (starts) return starts.iata
  const includes = AIRLINES.find((a) => a.name.toLowerCase().includes(lower))
  if (includes && lower.length >= 3) return includes.iata

  if (IATA_RE.test(token.slice(0, 2))) return token.slice(0, 2)
  return ''
}

/**
 * Digits (+ optional suffix letter). Accepts "440" or "TP440".
 * @param {string | null | undefined} raw
 * @param {string | null | undefined} [airlineHint]
 */
export function normalizeFlightNumber(raw, airlineHint) {
  const s = String(raw || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
  if (!s) return ''

  const parsed = parseFlightIdentity(s, airlineHint)
  return parsed.flightNumber
}

/**
 * @param {string | null | undefined} flightRaw
 * @param {string | null | undefined} [airlineHint]
 * @returns {{ airline: string, flightNumber: string }}
 */
export function parseFlightIdentity(flightRaw, airlineHint) {
  const hint = normalizeAirline(airlineHint)
  const s = String(flightRaw || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')

  if (!s) return { airline: hint, flightNumber: '' }

  const m = s.match(FLIGHT_IATA_RE)
  if (m) {
    return {
      airline: normalizeAirline(m[1]) || hint,
      flightNumber: String(m[2] || '').replace(/^0+/, '') || m[2],
    }
  }

  // Pure number (optionally with trailing letter)
  const num = s.match(/^([0-9]{1,4}[A-Z]?)$/)
  if (num) {
    return {
      airline: hint,
      flightNumber: num[1].replace(/^0+(?=\d)/, '') || num[1],
    }
  }

  return { airline: hint, flightNumber: s }
}

/**
 * Normalize flight-related detail keys on save.
 * @param {Record<string, unknown>} details
 */
export function normalizeFlightDetails(details) {
  const next = { ...(details || {}) }
  const parsed = parseFlightIdentity(next.flight_number, next.airline)
  if (parsed.airline) next.airline = parsed.airline
  else delete next.airline
  if (parsed.flightNumber) next.flight_number = parsed.flightNumber
  else delete next.flight_number
  return next
}

/**
 * @param {{ airline?: string, flight_number?: string, from?: string, to?: string }} details
 */
export function suggestFlightTitle(details) {
  const airline = normalizeAirline(details?.airline)
  const num = normalizeFlightNumber(details?.flight_number, airline)
  const from = String(details?.from || '').trim()
  const to = String(details?.to || '').trim()
  const code = airline && num ? `${airline}${num}` : airline || num
  if (!code && !from && !to) return ''
  if (from && to) return code ? `${code} · ${from} → ${to}` : `${from} → ${to}`
  return code
}

/**
 * YYYY-MM-DD in the departure timezone (or UTC).
 * @param {string | null | undefined} occursAtIso
 * @param {string | null | undefined} timeZone
 */
export function flightDateKey(occursAtIso, timeZone) {
  if (!occursAtIso) return ''
  try {
    const d = new Date(occursAtIso)
    if (Number.isNaN(d.getTime())) return ''
    const tz = timeZone || 'UTC'
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(d)
    const y = parts.find((p) => p.type === 'year')?.value
    const m = parts.find((p) => p.type === 'month')?.value
    const day = parts.find((p) => p.type === 'day')?.value
    if (y && m && day) return `${y}-${m}-${day}`
  } catch {
    /* ignore */
  }
  return String(occursAtIso).slice(0, 10)
}
