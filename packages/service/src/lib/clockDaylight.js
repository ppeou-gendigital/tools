/** Simple clock fallback when solar/geo resolvers are not provided. */
export function isClockDaylight(date = new Date()) {
  const h = date.getHours()
  return h >= 6 && h < 18
}

export function msUntilNextClockBoundary(date = new Date()) {
  const next = new Date(date)
  const h = date.getHours()
  if (h < 6) {
    next.setHours(6, 0, 0, 0)
  } else if (h < 18) {
    next.setHours(18, 0, 0, 0)
  } else {
    next.setDate(next.getDate() + 1)
    next.setHours(6, 0, 0, 0)
  }
  return Math.max(1000, next.getTime() - date.getTime())
}
