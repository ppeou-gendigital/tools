/**
 * Live flight status client (edge function → AeroDataBox / Aviationstack).
 * Persist the edge JSON blob on entry.details.flight_live; format in the UI.
 */

import { formatRelativeAgo } from '@/lib/format'
import {
  flightDateKey,
  normalizeAirline,
  normalizeFlightNumber,
} from '@/lib/flightIdentity'
import { supabase } from '@/lib/supabase'

const CACHE_TTL_MS = 12 * 60 * 1000

/** Stored on viaggio_entries.details */
export const FLIGHT_LIVE_KEY = 'flight_live'

/** Flat keys written by an earlier revision — stripped on next refresh. */
const LEGACY_FLAT_KEYS = [
  'dep_gate',
  'dep_terminal',
  'arr_gate',
  'arr_terminal',
  'flight_status',
  'delay_minutes',
  'status_checked_at',
]

/** @type {Map<string, { at: number, value: object | null, error?: string }>} */
const cache = new Map()

/**
 * @param {{ airline?: string, flightNumber?: string, flight_number?: string, date?: string }} input
 */
export function flightStatusCacheKey(input) {
  const airline = normalizeAirline(input.airline)
  const flightNumber = normalizeFlightNumber(
    input.flightNumber ?? input.flight_number,
    airline,
  )
  const date = String(input.date || '').slice(0, 10)
  return `${airline}|${flightNumber}|${date}`
}

/**
 * @param {object} entry — mapped viaggio entry
 * @returns {{ airline: string, flightNumber: string, date: string, entryId: string } | null}
 */
export function flightLookupFromEntry(entry) {
  if (!entry || entry.activityId !== 'flight') return null
  const details = entry.details || {}
  const airline = normalizeAirline(details.airline)
  const flightNumber = normalizeFlightNumber(details.flight_number, airline)
  const tz = entry.startTimezone || entry.timezone || null
  const date = flightDateKey(entry.occursAt, tz)
  if (!airline || !flightNumber || !date) return null
  return { airline, flightNumber, date, entryId: entry.id }
}

/**
 * @param {{ airline: string, flightNumber: string, date: string }} input
 * @param {{ force?: boolean }} [opts]
 * @returns {Promise<object | null>}
 */
export async function fetchFlightStatus(input, opts = {}) {
  const airline = normalizeAirline(input.airline)
  const flightNumber = normalizeFlightNumber(input.flightNumber, airline)
  const date = String(input.date || '').slice(0, 10)
  if (!airline || !flightNumber || !date) return null

  const key = flightStatusCacheKey({ airline, flightNumber, date })
  const hit = cache.get(key)
  if (!opts.force && hit && Date.now() - hit.at < CACHE_TTL_MS) {
    if (hit.error) throw new Error(hit.error)
    return hit.value
  }

  try {
    const { data, error } = await supabase.functions.invoke('flight-status', {
      body: { airline, flightNumber, date },
    })
    if (error) throw error
    if (data?.error) throw new Error(data.error)
    cache.set(key, { at: Date.now(), value: data })
    return data
  } catch (err) {
    const message = err?.message || 'Flight status failed'
    cache.set(key, { at: Date.now(), value: null, error: message })
    console.warn('[viaggio] flight status:', message)
    throw new Error(message)
  }
}

/**
 * Pull the status blob from a live edge response or entry.details.
 * @param {object | null | undefined} raw
 */
export function flightLiveFrom(raw) {
  if (!raw || typeof raw !== 'object') return null
  if (raw[FLIGHT_LIVE_KEY] && typeof raw[FLIGHT_LIVE_KEY] === 'object') {
    return raw[FLIGHT_LIVE_KEY]
  }
  // Live edge payload (or already-unwrapped blob)
  if (
    raw.status != null ||
    raw.depGate != null ||
    raw.checkedAt != null ||
    raw.provider != null
  ) {
    return raw
  }
  // Legacy flat detail keys
  if (
    raw.flight_status != null ||
    raw.dep_gate != null ||
    raw.dep_terminal != null ||
    raw.status_checked_at != null
  ) {
    return {
      status: raw.flight_status ?? null,
      delayMinutes:
        raw.delay_minutes != null && raw.delay_minutes !== ''
          ? Number(raw.delay_minutes)
          : null,
      depGate: raw.dep_gate ?? null,
      depTerminal: raw.dep_terminal ?? null,
      arrGate: raw.arr_gate ?? null,
      arrTerminal: raw.arr_terminal ?? null,
      scheduledDep: null,
      estimatedDep: null,
      scheduledArr: null,
      estimatedArr: null,
      checkedAt: raw.status_checked_at ?? null,
      provider: null,
    }
  }
  return null
}

/**
 * @param {object | null | undefined} raw
 */
export function normalizeStatusShape(raw) {
  const live = flightLiveFrom(raw)
  if (!live) return null
  return {
    status: live.status ?? null,
    delayMinutes: live.delayMinutes ?? null,
    depGate: live.depGate ?? null,
    depTerminal: live.depTerminal ?? null,
    arrGate: live.arrGate ?? null,
    arrTerminal: live.arrTerminal ?? null,
    scheduledDep: live.scheduledDep ?? null,
    estimatedDep: live.estimatedDep ?? null,
    scheduledArr: live.scheduledArr ?? null,
    estimatedArr: live.estimatedArr ?? null,
    checkedAt: live.checkedAt ?? null,
    provider: live.provider ?? null,
    date: live.date ?? null,
    flightIata: live.flightIata ?? null,
  }
}

/**
 * Merge live status into entry fields for upsertEntry.
 * Stores the full edge JSON on details.flight_live; formats in the UI.
 * @param {object} entry
 * @param {object} status — edge function payload
 */
export function applyFlightStatusToEntry(entry, status) {
  const candidateDep = status.estimatedDep || status.scheduledDep || null
  const candidateArr = status.estimatedArr || status.scheduledArr || null
  let occursAt = entry.occursAt || null
  let endsAt = entry.endsAt || null

  if (candidateDep || candidateArr) {
    const nextDep = candidateDep || occursAt
    const nextArr = candidateArr || endsAt
    const depMs = nextDep ? Date.parse(String(nextDep).replace(' ', 'T')) : NaN
    const arrMs = nextArr ? Date.parse(String(nextArr).replace(' ', 'T')) : NaN
    const timesOk =
      !Number.isNaN(depMs) &&
      (nextArr == null || Number.isNaN(arrMs) || arrMs >= depMs)
    const entryMs = occursAt ? Date.parse(occursAt) : NaN
    const sameTripWindow =
      Number.isNaN(entryMs) ||
      Number.isNaN(depMs) ||
      Math.abs(depMs - entryMs) <= 36 * 60 * 60 * 1000

    if (timesOk && sameTripWindow) {
      occursAt = toIsoMaybe(nextDep)
      endsAt = toIsoMaybe(nextArr)
    }
  }

  const details = { ...(entry.details || {}) }
  for (const key of LEGACY_FLAT_KEYS) delete details[key]
  details[FLIGHT_LIVE_KEY] = { ...status }

  return {
    occursAt,
    endsAt,
    details,
  }
}

/** AeroDataBox sometimes returns "2026-09-05 08:00Z" — normalize for DB. */
function toIsoMaybe(value) {
  if (value == null) return null
  const s = String(value).trim()
  if (!s) return null
  const normalized = s.includes('T') ? s : s.replace(' ', 'T')
  const ms = Date.parse(normalized)
  if (Number.isNaN(ms)) return s
  return new Date(ms).toISOString()
}

/**
 * Compact UI line, e.g. "Delayed 25m · Gate B12".
 * @param {object | null | undefined} statusOrDetails
 */
export function formatFlightStatusLine(statusOrDetails) {
  const status = normalizeStatusShape(statusOrDetails)
  if (!status) return ''
  const parts = []
  const st = String(status.status || '').toLowerCase()
  const delay =
    status.delayMinutes != null &&
    Number.isFinite(Number(status.delayMinutes)) &&
    Number(status.delayMinutes) > 0
      ? Number(status.delayMinutes)
      : null

  if (st === 'cancelled') parts.push('Cancelled')
  else if (st === 'diverted') parts.push('Diverted')
  else if (st === 'landed') parts.push('Landed')
  else if (st === 'active')
    parts.push(delay ? `In air · Delayed ${delay}m` : 'In air')
  else if (st === 'delayed' || delay) parts.push(`Delayed ${delay || '?'}m`)
  else if (st === 'scheduled') parts.push('On time')
  else if (st && st !== 'unknown') {
    parts.push(st.charAt(0).toUpperCase() + st.slice(1))
  }

  if (status.depGate) parts.push(`Gate ${status.depGate}`)
  else if (status.depTerminal) parts.push(`Terminal ${status.depTerminal}`)

  return parts.filter(Boolean).join(' · ')
}

/**
 * Rows for the status popover.
 * @param {object | null | undefined} statusOrDetails
 * @returns {{ label: string, value: string }[]}
 */
export function formatFlightStatusDetails(statusOrDetails) {
  const status = normalizeStatusShape(statusOrDetails)
  if (!status) return []

  const rows = []
  const line = formatFlightStatusLine(status)
  if (line) rows.push({ label: 'Status', value: line })

  if (status.depTerminal || status.depGate) {
    rows.push({
      label: 'Departure',
      value: [
        status.depTerminal && `Terminal ${status.depTerminal}`,
        status.depGate && `Gate ${status.depGate}`,
      ]
        .filter(Boolean)
        .join(' · '),
    })
  }
  if (status.arrTerminal || status.arrGate) {
    rows.push({
      label: 'Arrival',
      value: [
        status.arrTerminal && `Terminal ${status.arrTerminal}`,
        status.arrGate && `Gate ${status.arrGate}`,
      ]
        .filter(Boolean)
        .join(' · '),
    })
  }
  if (status.estimatedDep || status.scheduledDep) {
    rows.push({
      label: 'Departs',
      value: String(status.estimatedDep || status.scheduledDep),
    })
  }
  if (status.estimatedArr || status.scheduledArr) {
    rows.push({
      label: 'Arrives',
      value: String(status.estimatedArr || status.scheduledArr),
    })
  }
  if (status.provider) {
    rows.push({ label: 'Source', value: String(status.provider) })
  }
  if (status.checkedAt) {
    rows.push({
      label: 'Checked',
      value: formatRelativeAgo(status.checkedAt) || String(status.checkedAt),
    })
  }
  return rows
}
