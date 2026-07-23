/**
 * Medication schedule helpers: frequency, period windows, dose slots.
 */

export const FREQUENCIES = Object.freeze([
  'daily',
  'weekly',
  'monthly',
  'as_needed',
])

export const STATUSES = Object.freeze(['active', 'suspended', 'stopped'])

/**
 * Normalize schedule from payload or datafeed (supports legacy timesPerDay).
 */
export function normalizeSchedule(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      frequency: 'daily',
      timesPerPeriod: 1,
      times: ['08:00'],
      instructions: undefined,
    }
  }

  let frequency = String(raw.frequency || '').trim().toLowerCase()
  if (!FREQUENCIES.includes(frequency)) {
    frequency = 'daily'
  }

  const times = Array.isArray(raw.times)
    ? raw.times.map((t) => String(t).trim()).filter(Boolean)
    : []

  let timesPerPeriod =
    Number(raw.timesPerPeriod) ||
    Number(raw.timesPerDay) ||
    (times.length > 0 ? times.length : 1)
  if (!Number.isFinite(timesPerPeriod) || timesPerPeriod < 1) timesPerPeriod = 1
  timesPerPeriod = Math.min(12, Math.floor(timesPerPeriod))

  if (frequency === 'as_needed') {
    timesPerPeriod = 0
  }

  return {
    frequency,
    timesPerPeriod,
    times:
      frequency === 'daily' && times.length === 0 && timesPerPeriod > 0
        ? defaultDailyTimes(timesPerPeriod)
        : times,
    instructions: raw.instructions ? String(raw.instructions).trim() || undefined : undefined,
  }
}

function defaultDailyTimes(n) {
  if (n <= 1) return ['08:00']
  if (n === 2) return ['08:00', '20:00']
  if (n === 3) return ['08:00', '14:00', '20:00']
  const out = []
  for (let i = 0; i < n; i++) {
    const hour = Math.round(8 + (i * 12) / Math.max(1, n - 1))
    out.push(`${String(Math.min(22, hour)).padStart(2, '0')}:00`)
  }
  return out
}

/**
 * Resolve lifecycle status from payload + clear is_active column.
 */
export function resolveMedicationStatus(med) {
  const raw = String(med?.status || '').trim().toLowerCase()
  if (STATUSES.includes(raw)) return raw
  if (med?.isActive === false) return 'stopped'
  return 'active'
}

export function scheduleLabel(schedule) {
  const s = normalizeSchedule(schedule)
  if (s.frequency === 'as_needed') return 'As needed'
  const n = s.timesPerPeriod || 1
  if (s.frequency === 'daily') return n === 1 ? '1× daily' : `${n}× daily`
  if (s.frequency === 'weekly') return n === 1 ? '1× weekly' : `${n}× weekly`
  if (s.frequency === 'monthly') return n === 1 ? '1× monthly' : `${n}× monthly`
  return 'Scheduled'
}

/** Local calendar day / ISO week (Mon–Sun) / calendar month bounds. */
export function periodBounds(frequency, now = new Date()) {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)

  if (frequency === 'weekly') {
    const day = d.getDay() // 0 Sun … 6 Sat
    const mondayOffset = day === 0 ? -6 : 1 - day
    const start = new Date(d)
    start.setDate(d.getDate() + mondayOffset)
    const end = new Date(start)
    end.setDate(start.getDate() + 7)
    return { start, end, label: 'this week' }
  }

  if (frequency === 'monthly') {
    const start = new Date(d.getFullYear(), d.getMonth(), 1)
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    return { start, end, label: 'this month' }
  }

  // daily (and fallback)
  const start = d
  const end = new Date(d)
  end.setDate(d.getDate() + 1)
  return { start, end, label: 'today' }
}

export function dosesInPeriod(doses, { start, end }) {
  const t0 = start.getTime()
  const t1 = end.getTime()
  return (doses || [])
    .filter((dose) => {
      const t = new Date(dose.takenAt).getTime()
      return Number.isFinite(t) && t >= t0 && t < t1
    })
    .sort((a, b) => new Date(a.takenAt) - new Date(b.takenAt))
}

/**
 * Build N slots for the current period; first N doses fill slots in order.
 * @returns {{ index: number, label?: string, dose: object|null }[]}
 */
export function buildDoseSlots(schedule, doses, now = new Date()) {
  const s = normalizeSchedule(schedule)
  if (s.frequency === 'as_needed') return []

  const n = s.timesPerPeriod || 1
  const bounds = periodBounds(s.frequency, now)
  const inPeriod = dosesInPeriod(doses, bounds)
  const slots = []
  for (let i = 0; i < n; i++) {
    slots.push({
      index: i,
      label: s.frequency === 'daily' ? s.times[i] : undefined,
      dose: inPeriod[i] || null,
    })
  }
  return slots
}

export function formatDoseTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return ''
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export function formatDoseDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return ''
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
