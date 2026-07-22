const MIN = 60 * 1000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

export const LOCKBOX_IDLE_OPTIONS = [
  { value: 15 * MIN, label: '15 minutes' },
  { value: 30 * MIN, label: '30 minutes' },
  { value: 1 * HOUR, label: '1 hour' },
  { value: 2 * HOUR, label: '2 hours' },
  { value: 4 * HOUR, label: '4 hours' },
  { value: 8 * HOUR, label: '8 hours' },
  { value: 1 * DAY, label: '1 day' },
  { value: 3 * DAY, label: '3 days' },
  { value: 7 * DAY, label: '1 week' },
]

export const LOCKBOX_IDLE_DEFAULT_MS = 1 * DAY

export function normalizeIdleTimeoutMs(v) {
  const n = typeof v === 'number' ? v : Number.parseInt(v, 10)
  if (!Number.isFinite(n) || n <= 0) return LOCKBOX_IDLE_DEFAULT_MS
  if (LOCKBOX_IDLE_OPTIONS.some((o) => o.value === n)) return n
  let best = LOCKBOX_IDLE_OPTIONS[0].value
  let bestDelta = Math.abs(n - best)
  for (const opt of LOCKBOX_IDLE_OPTIONS) {
    const delta = Math.abs(n - opt.value)
    if (delta < bestDelta) {
      best = opt.value
      bestDelta = delta
    }
  }
  return best
}

export function labelForIdleTimeoutMs(ms) {
  return LOCKBOX_IDLE_OPTIONS.find((o) => o.value === ms)?.label ?? ''
}
