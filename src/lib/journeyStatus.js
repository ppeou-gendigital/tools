/** Journey lifecycle relative to a calendar “today”. */

export function todayUtcDate(now = new Date()) {
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}

export function parseOn(isoDate) {
  if (!isoDate) return null
  // startsOn / endsOn are calendar dates (YYYY-MM-DD)
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(isoDate))
  if (!m) return null
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
}

/**
 * current  — ongoing (no dates) or today is within [startsOn, endsOn]
 * upcoming — starts after today
 * past     — ended before today
 */
export function classifyJourney(journey, today = todayUtcDate()) {
  const start = parseOn(journey?.startsOn)
  const end = parseOn(journey?.endsOn)

  if (!start && !end) return 'current'
  if (start && start.getTime() > today.getTime()) return 'upcoming'
  if (end && end.getTime() < today.getTime()) return 'past'
  return 'current'
}

/** Civil YYYY-MM-DD for `now` in `timeZone` (fallback UTC). */
export function civilDateKey(now = new Date(), timeZone) {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timeZone || 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now instanceof Date ? now : new Date(now))
    const y = parts.find((p) => p.type === 'year')?.value
    const m = parts.find((p) => p.type === 'month')?.value
    const d = parts.find((p) => p.type === 'day')?.value
    if (y && m && d) return `${y}-${m}-${d}`
  } catch {
    // fall through
  }
  const d = now instanceof Date ? now : new Date(now)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
