// Single source of truth for the vault auto-lock idle timeout. The
// picker on the VaultSettings page, the timer effect inside
// VaultProvider, and the normalizer for values coming back from
// Supabase all reference this list. Values are in milliseconds so
// they slot directly into `setTimeout`.
//
// Note: even a "1 week" timeout only lasts until the browser closes,
// because we cache the passphrase in session-scoped storage
// (chrome.storage.session / sessionStorage). The timeout is the
// inactivity ceiling; browser-close is a separate reset.

const MIN = 60 * 1000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

export const VAULT_IDLE_OPTIONS = [
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

export const VAULT_IDLE_DEFAULT_MS = 15 * MIN

// Clamp an incoming value (from user_data.data.vault.idleTimeoutMs)
// to the nearest allowed choice. A remote value written by a future
// version that adds new tiers will still land on the closest current
// tier, which is better than silently defaulting.
export function normalizeIdleTimeoutMs(v) {
  const n = typeof v === 'number' ? v : Number.parseInt(v, 10)
  if (!Number.isFinite(n) || n <= 0) return VAULT_IDLE_DEFAULT_MS
  if (VAULT_IDLE_OPTIONS.some((o) => o.value === n)) return n
  let best = VAULT_IDLE_OPTIONS[0].value
  let bestDelta = Math.abs(n - best)
  for (const opt of VAULT_IDLE_OPTIONS) {
    const delta = Math.abs(n - opt.value)
    if (delta < bestDelta) {
      best = opt.value
      bestDelta = delta
    }
  }
  return best
}

export function labelForIdleTimeoutMs(ms) {
  return VAULT_IDLE_OPTIONS.find((o) => o.value === ms)?.label ?? ''
}
