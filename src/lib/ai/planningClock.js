/**
 * Minimal wall-clock hint for AI planning prompts.
 * Civil “today” in the device timezone — the model resolves relative phrases.
 */

/** Wall-clock “today” for the device timezone. */
export function planningClockContext(displayLocale) {
  const timeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  const now = new Date()
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
  const weekday = new Intl.DateTimeFormat(displayLocale || 'en-US', {
    timeZone,
    weekday: 'long',
  }).format(now)

  return {
    today,
    weekday,
    timeZone,
  }
}
