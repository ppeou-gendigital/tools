/** Locale-aware formatting helpers. */

import { getActivity } from '@/lib/catalog'
import { shortTimeZoneLabel } from '@/lib/timezone'

/** Human label for expense split_mode (`equal` | `custom`). */
export function labelForSplitMode(splitMode) {
  return splitMode === 'custom' ? 'Paying separately' : 'Paying equally'
}

export function formatMoney(cents, currency, locale) {
  const amount = (Number(cents) || 0) / 100
  try {
    return new Intl.NumberFormat(locale || undefined, {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount)
  } catch {
    return `${currency || ''} ${amount.toFixed(2)}`
  }
}

export function formatWallTime(iso, timeZone, locale) {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat(locale || undefined, {
      timeZone: timeZone || undefined,
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return new Date(iso).toLocaleTimeString()
  }
}

export function formatWallDate(isoOrDate, timeZone, locale) {
  if (!isoOrDate) return ''
  try {
    const d =
      typeof isoOrDate === 'string' && isoOrDate.length === 10
        ? new Date(`${isoOrDate}T12:00:00Z`)
        : new Date(isoOrDate)
    return new Intl.DateTimeFormat(locale || undefined, {
      timeZone: timeZone || undefined,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d)
  } catch {
    return String(isoOrDate)
  }
}

function civilDayKey(iso, timeZone) {
  if (!iso) return null
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timeZone || undefined,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date(iso))
    const y = parts.find((p) => p.type === 'year')?.value
    const m = parts.find((p) => p.type === 'month')?.value
    const d = parts.find((p) => p.type === 'day')?.value
    if (y && m && d) return `${y}-${m}-${d}`
  } catch {
    // fall through
  }
  return String(iso).slice(0, 10) || null
}

export function entryDayKey(entry) {
  if (entry.occursAt && entry.timezone) {
    const key = civilDayKey(entry.occursAt, entry.timezone)
    if (key) return key
  }
  if (entry.occursOn) return entry.occursOn
  if (entry.occursAt) return entry.occursAt.slice(0, 10)
  return 'undated'
}

/**
 * Schema for end-day timeline clones: lodging checkout or rental drop-off only.
 * Transit and other activities never get a synthetic end-day row.
 */
export function entryEndDayCloneSchema(entry) {
  const schema =
    entry?.schema || getActivity(entry?.activityId)?.schema || null
  if (schema === 'lodging' || schema === 'rental') return schema
  return null
}

/**
 * Checkout / drop-off civil day for multi-day lodging or rental.
 * Null for transit and everything else (even when endsAt is another day).
 */
export function entryCheckoutDayKey(entry) {
  if (!entryEndDayCloneSchema(entry)) return null
  if (!entry?.endsAt) return null
  const endTz = entry.endTimezone || entry.timezone
  const endKey = civilDayKey(entry.endsAt, endTz)
  if (!endKey) return null
  const startKey = entryDayKey(entry)
  if (!startKey || startKey === 'undated' || endKey === startKey) return null
  return endKey
}

function sameCivilDay(aIso, bIso, timeZone) {
  if (!aIso || !bIso) return false
  try {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: timeZone || undefined,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    return fmt.format(new Date(aIso)) === fmt.format(new Date(bIso))
  } catch {
    return aIso.slice(0, 10) === bIso.slice(0, 10)
  }
}

function formatWallDateTime(iso, timeZone, locale) {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat(locale || undefined, {
      timeZone: timeZone || undefined,
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return formatWallTime(iso, timeZone, locale)
  }
}

export function formatEntryTimeLine(entry, locale) {
  if (!entry.occursAt && !entry.endsAt) {
    return entry.occursOn ? formatWallDate(entry.occursOn, null, locale) : ''
  }
  const startTz = entry.startTimezone || entry.timezone
  const endTz = entry.endTimezone || entry.timezone

  // Timeline checkout appearance: show only the end wall time.
  if (entry.timelineRole === 'checkout' && entry.endsAt) {
    const label = shortTz(endTz || startTz, entry.endsAt)
    const time = formatWallTime(entry.endsAt, endTz || startTz, locale)
    return label ? `${time} ${label}`.trim() : time
  }

  const start = entry.occursAt
    ? formatWallTime(entry.occursAt, startTz, locale)
    : ''
  if (entry.endsAt && endTz && endTz !== startTz) {
    const end = formatWallTime(entry.endsAt, endTz, locale)
    const startLabel = shortTz(startTz, entry.occursAt)
    const endLabel = shortTz(endTz, entry.endsAt)
    return `${start} ${startLabel} → ${end} ${endLabel}`.trim()
  }
  if (entry.endsAt) {
    const tz = endTz || startTz
    const label = shortTz(tz, entry.occursAt || entry.endsAt)
    // Multi-night stay on check-in day: emphasize check-in; full range stays available in edit.
    if (!sameCivilDay(entry.occursAt, entry.endsAt, tz) && entryCheckoutDayKey(entry)) {
      const checkInLabel = shortTz(startTz, entry.occursAt)
      return checkInLabel ? `${start} ${checkInLabel}`.trim() : start
    }
    if (!sameCivilDay(entry.occursAt, entry.endsAt, tz)) {
      return `${formatWallDateTime(entry.occursAt, startTz, locale)} – ${formatWallDateTime(entry.endsAt, tz, locale)} ${label}`.trim()
    }
    const end = formatWallTime(entry.endsAt, tz, locale)
    return `${start} – ${end} ${label}`.trim()
  }
  const label = shortTz(startTz, entry.occursAt)
  return label ? `${start} ${label}`.trim() : start
}

/** Short zone label (JST, CDT, …) at the given instant for DST accuracy. */
function shortTz(tz, instant) {
  return shortTimeZoneLabel(tz, instant || null)
}

/** Parse "12.34" dollars into cents. */
export function dollarsToCents(raw) {
  const n = Number.parseFloat(String(raw).replace(/,/g, ''))
  if (!Number.isFinite(n) || n < 0) return null
  return Math.round(n * 100)
}

export function centsToDollarsInput(cents) {
  return ((Number(cents) || 0) / 100).toFixed(2)
}

/** Label for a journey member: You / display name / short user id. */
export function labelForMember(member, currentUserId) {
  if (!member?.userId) return ''
  if (currentUserId && member.userId === currentUserId) return 'You'
  const name = (member.displayName ?? '').trim()
  if (name) return name
  return member.userId.slice(0, 8)
}

/**
 * Label for a journey roster person.
 * Prefer live profiles.display_name (profileNames Map keyed by user id) for linked
 * members — roster displayName is often a stale invite-time copy.
 * Self → "You"; else profile / roster name; else short id.
 */
export function labelForJourneyPerson(person, currentUserId) {
  if (!person?.id) return ''
  if (currentUserId && person.linkedUserId === currentUserId) return 'You'
  const name = (person.displayName ?? '').trim()
  if (name) return name
  return person.id.slice(0, 8)
}

/** Label from a userId + optional displayNames Map. */
export function labelForUserId(userId, currentUserId, displayNames) {
  if (!userId) return ''
  return labelForMember(
    {
      userId,
      displayName: displayNames?.get?.(userId) ?? null,
    },
    currentUserId,
  )
}

/** Compact traveler count for timeline meta (names live in the people popover). */
export function formatParticipantHint(journeyPersonIds) {
  const ids = journeyPersonIds ?? []
  if (ids.length === 0) return ''
  if (ids.length === 1) return '1 traveler'
  return `${ids.length} travelers`
}

export function formatWhen(iso, locale) {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat(locale || undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return String(iso)
  }
}

/** Compact relative time for “Checked 5 secs ago” style meta. */
export function formatRelativeAgo(iso) {
  if (!iso) return ''
  try {
    const t = new Date(iso).getTime()
    if (Number.isNaN(t)) return ''
    const sec = Math.max(0, Math.round((Date.now() - t) / 1000))
    if (sec < 5) return 'just now'
    if (sec < 60) return `${sec} secs ago`
    const min = Math.round(sec / 60)
    if (min < 60) return min === 1 ? '1 min ago' : `${min} mins ago`
    const hr = Math.round(min / 60)
    if (hr < 48) return hr === 1 ? '1 hr ago' : `${hr} hrs ago`
    const day = Math.round(hr / 24)
    return day === 1 ? '1 day ago' : `${day} days ago`
  } catch {
    return ''
  }
}

/** Compact relative day for list meta (Today / Yesterday / short date). */
export function formatRelativeDay(iso, locale) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    const now = new Date()
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    )
    const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const dayDiff = Math.round(
      (startOfToday.getTime() - startOfDay.getTime()) / 86400000,
    )
    if (dayDiff === 0) return 'Today'
    if (dayDiff === 1) return 'Yesterday'
    if (dayDiff > 1 && dayDiff < 7) return `${dayDiff} days ago`
    return new Intl.DateTimeFormat(locale || undefined, {
      month: 'short',
      day: 'numeric',
      year:
        d.getFullYear() === now.getFullYear() ? undefined : 'numeric',
    }).format(d)
  } catch {
    return ''
  }
}
