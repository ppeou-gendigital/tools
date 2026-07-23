/** Locale-aware formatting helpers. */

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

export function entryDayKey(entry) {
  if (entry.occursAt && entry.timezone) {
    try {
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: entry.timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(new Date(entry.occursAt))
      const y = parts.find((p) => p.type === 'year')?.value
      const m = parts.find((p) => p.type === 'month')?.value
      const d = parts.find((p) => p.type === 'day')?.value
      if (y && m && d) return `${y}-${m}-${d}`
    } catch {
      // fall through
    }
  }
  if (entry.occursOn) return entry.occursOn
  if (entry.occursAt) return entry.occursAt.slice(0, 10)
  return 'undated'
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
  const start = entry.occursAt
    ? formatWallTime(entry.occursAt, startTz, locale)
    : ''
  if (entry.endsAt && endTz && endTz !== startTz) {
    const end = formatWallTime(entry.endsAt, endTz, locale)
    const startLabel = shortTz(startTz)
    const endLabel = shortTz(endTz)
    return `${start} ${startLabel} → ${end} ${endLabel}`.trim()
  }
  if (entry.endsAt) {
    const tz = endTz || startTz
    if (!sameCivilDay(entry.occursAt, entry.endsAt, tz)) {
      return `${formatWallDateTime(entry.occursAt, startTz, locale)} – ${formatWallDateTime(entry.endsAt, tz, locale)}`.trim()
    }
    const end = formatWallTime(entry.endsAt, tz, locale)
    return `${start} – ${end}`.trim()
  }
  return start
}

function shortTz(tz) {
  if (!tz) return ''
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'short',
    }).formatToParts(new Date())
    return parts.find((p) => p.type === 'timeZoneName')?.value || tz
  } catch {
    return tz
  }
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

/** Label for a journey roster person. */
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

/** Compact participant list for timeline meta (≤3 names, else count). */
export function formatParticipantHint(
  journeyPersonIds,
  peopleById,
  currentUserId,
) {
  const ids = journeyPersonIds ?? []
  if (ids.length === 0) return ''
  if (ids.length > 3) return `${ids.length} travelers`
  return ids
    .map((id) =>
      labelForJourneyPerson(peopleById?.get?.(id) || { id }, currentUserId),
    )
    .filter(Boolean)
    .join(' · ')
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
