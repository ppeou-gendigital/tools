/**
 * Wall-clock hint for AI care prompts.
 */

/** @param {string | null | undefined} displayLocale */
/** @param {string | null | undefined} [timeZone] IANA zone override */
export function planningClockContext(displayLocale, timeZone = null) {
  let zone = String(timeZone || '').trim()
  if (!zone) {
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    } catch {
      zone = 'UTC'
    }
  }
  const now = new Date()
  let today
  let weekday
  try {
    today = new Intl.DateTimeFormat('en-CA', {
      timeZone: zone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now)
    weekday = new Intl.DateTimeFormat(displayLocale || 'en-US', {
      timeZone: zone,
      weekday: 'long',
    }).format(now)
  } catch {
    zone = 'UTC'
    today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now)
    weekday = new Intl.DateTimeFormat(displayLocale || 'en-US', {
      timeZone: 'UTC',
      weekday: 'long',
    }).format(now)
  }

  let deviceTimeZone = 'UTC'
  try {
    deviceTimeZone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    deviceTimeZone = 'UTC'
  }

  return {
    today,
    weekday,
    timeZone: zone,
    device_timeZone: deviceTimeZone,
  }
}
