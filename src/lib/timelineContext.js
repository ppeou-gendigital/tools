import { entryDayKey } from '@/lib/format'
import { civilDateKey, classifyJourney } from '@/lib/journeyStatus'

export function hasGeoCoords(entry) {
  return Number.isFinite(entry?.lat) && Number.isFinite(entry?.lng)
}

function entryTimeMs(entry) {
  if (entry?.occursAt) {
    const t = Date.parse(entry.occursAt)
    if (Number.isFinite(t)) return t
  }
  return null
}

function entryEndMs(entry) {
  if (entry?.endsAt) {
    const t = Date.parse(entry.endsAt)
    if (Number.isFinite(t)) return t
  }
  return null
}

function sortByOccurs(a, b) {
  const ta = entryTimeMs(a)
  const tb = entryTimeMs(b)
  if (ta != null && tb != null && ta !== tb) return ta - tb
  if (ta != null && tb == null) return -1
  if (ta == null && tb != null) return 1
  return String(a?.createdAt || '').localeCompare(String(b?.createdAt || ''))
}

/**
 * Resolve trip phase, today's timeline slice, geo waypoints, and the
 * "supposed to be" stop for an active journey.
 */
export function resolveTimelineContext({
  journey,
  entries = [],
  now = new Date(),
} = {}) {
  const phase = classifyJourney(journey)
  const tz = journey?.defaultTimezone || 'UTC'
  const todayKey = civilDateKey(now, tz)
  const nowMs = now instanceof Date ? now.getTime() : Date.parse(now)

  const list = Array.isArray(entries) ? [...entries] : []
  const todayEntries = list
    .filter((e) => entryDayKey(e) === todayKey)
    .sort(sortByOccurs)

  const geoWaypoints = todayEntries.filter(hasGeoCoords)

  const geoAll = list.filter(hasGeoCoords).sort(sortByOccurs)
  const geoToday = geoWaypoints

  let supposedEntry = null
  let supposedKind = null // 'now' | 'next'

  const pool = geoToday.length > 0 ? geoToday : geoAll

  if (phase === 'current' && pool.length > 0 && Number.isFinite(nowMs)) {
    // 1) In-progress: occursAt <= now < endsAt (or no endsAt → still "now" if started)
    const inProgress = pool.find((e) => {
      const start = entryTimeMs(e)
      if (start == null || start > nowMs) return false
      const end = entryEndMs(e)
      if (end == null) {
        // Lodging / open-ended: treat as now until a later geo stop starts.
        return true
      }
      return nowMs < end
    })

    if (inProgress) {
      // Prefer the latest started in-progress when several overlap.
      const overlapping = pool.filter((e) => {
        const start = entryTimeMs(e)
        if (start == null || start > nowMs) return false
        const end = entryEndMs(e)
        return end == null || nowMs < end
      })
      supposedEntry = overlapping[overlapping.length - 1] || inProgress
      supposedKind = 'now'
    } else {
      const upcoming = pool.find((e) => {
        const start = entryTimeMs(e)
        return start != null && start > nowMs
      })
      if (upcoming) {
        supposedEntry = upcoming
        supposedKind = 'next'
      } else {
        // Latest past geo stop today (or overall)
        supposedEntry = pool[pool.length - 1]
        supposedKind = 'now'
      }
    }

    // If we picked an open-ended "now" that already has a later started sibling, keep latest.
    if (
      supposedKind === 'now' &&
      supposedEntry &&
      entryEndMs(supposedEntry) == null
    ) {
      const laterStarted = pool.filter((e) => {
        const start = entryTimeMs(e)
        return (
          start != null &&
          start <= nowMs &&
          start >= (entryTimeMs(supposedEntry) ?? 0)
        )
      })
      if (laterStarted.length) {
        supposedEntry = laterStarted[laterStarted.length - 1]
      }
    }
  }

  const supposedStop =
    supposedEntry && hasGeoCoords(supposedEntry)
      ? {
          lat: supposedEntry.lat,
          lng: supposedEntry.lng,
          entry: supposedEntry,
          kind: supposedKind,
        }
      : null

  return {
    phase,
    todayKey,
    todayEntries,
    geoWaypoints,
    supposedEntry,
    supposedKind,
    supposedStop,
  }
}

/** Geo waypoints for an arbitrary day key (YYYY-MM-DD). */
export function geoWaypointsForDay(entries, dayKey) {
  if (!dayKey || dayKey === 'undated') return []
  return (entries || [])
    .filter((e) => entryDayKey(e) === dayKey && hasGeoCoords(e))
    .sort(sortByOccurs)
}

/** All geo-pinned stops in timeline order (any day). */
export function allGeoWaypoints(entries) {
  return (entries || []).filter(hasGeoCoords).sort(sortByOccurs)
}

/**
 * Distinct civil days that have at least one geo-pinned stop, ascending.
 * Excludes `undated`.
 */
export function listGeoDays(entries) {
  const map = new Map()
  for (const e of entries || []) {
    if (!hasGeoCoords(e)) continue
    const key = entryDayKey(e)
    if (!key || key === 'undated') continue
    const list = map.get(key) || []
    list.push(e)
    map.set(key, list)
  }
  return [...map.keys()]
    .sort()
    .map((dayKey) => ({
      dayKey,
      waypoints: (map.get(dayKey) || []).sort(sortByOccurs),
    }))
}

/**
 * Pick a sensible default day for the route bar.
 * - current + today has geo → today
 * - upcoming → first geo day
 * - past → last geo day
 * - else first geo day
 */
export function defaultRouteDayKey({ phase, todayKey, geoDays }) {
  const days = geoDays || []
  if (days.length === 0) return null
  if (
    phase === 'current' &&
    todayKey &&
    days.some((d) => d.dayKey === todayKey)
  ) {
    return todayKey
  }
  if (phase === 'past') return days[days.length - 1].dayKey
  return days[0].dayKey
}
