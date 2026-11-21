// Theme preference for the popup. `sunrise` follows the clock (light during
// the day, dark at night); `system` follows the OS. Main resolves the stored
// preference into a concrete Mantine color scheme, and the footer menu lets the
// user pick a different one.

export const THEME_MODES = ['light', 'dark', 'sunrise', 'system']

const SUNRISE_HOUR = 6
const SUNSET_HOUR = 18

export function isDaytime(date = new Date()) {
  const hour = date.getHours()
  return hour >= SUNRISE_HOUR && hour < SUNSET_HOUR
}

export function resolveColorScheme(mode, systemDark, now = new Date()) {
  if (mode === 'light') return 'light'
  if (mode === 'dark') return 'dark'
  if (mode === 'sunrise') return isDaytime(now) ? 'light' : 'dark'
  return systemDark ? 'dark' : 'light'
}
