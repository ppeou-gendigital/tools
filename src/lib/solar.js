/**
 * Sunrise / sunset helpers for day/night theme resolution.
 * Uses the NOAA "official" zenith (90.833°) geometric + refraction model.
 */

const DEG = Math.PI / 180
const RAD = 180 / Math.PI
const ZENITH = 90.833

const CLOCK_DAY_START = 6
const CLOCK_DAY_END = 18

function dayOfYearLocal(date) {
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()
  const start = new Date(y, 0, 0)
  const day = new Date(y, m, d)
  return Math.round((day - start) / 86400000)
}

function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360
}

/**
 * Map a UT hour-of-day onto a Date near the local calendar day of `date`.
 * Events west of Greenwich often land on the next UTC calendar day; snap to
 * the occurrence closest to local noon so rise/set stay on the intended day.
 */
function utToDate(date, utHours) {
  const localNoon = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0,
    0,
  )
  const noonMs = localNoon.getTime()
  let ms =
    Date.UTC(
      localNoon.getUTCFullYear(),
      localNoon.getUTCMonth(),
      localNoon.getUTCDate(),
      0,
      0,
      0,
      0,
    ) +
    utHours * 3_600_000
  const window = 18 * 3_600_000
  while (ms < noonMs - window) ms += 86_400_000
  while (ms > noonMs + window) ms -= 86_400_000
  return new Date(ms)
}

/**
 * Compute sunrise or sunset for the local calendar day of `date`.
 * Returns null when the sun never rises / never sets that day.
 */
function calcSunEvent(lat, lng, date, isSunrise) {
  const N = dayOfYearLocal(date)
  const lngHour = lng / 15
  const t = isSunrise ? N + (6 - lngHour) / 24 : N + (18 - lngHour) / 24

  const M = 0.9856 * t - 3.289
  let L = M + 1.916 * Math.sin(M * DEG) + 0.02 * Math.sin(2 * M * DEG) + 282.634
  L = normalizeDegrees(L)

  let RA = RAD * Math.atan(0.91764 * Math.tan(L * DEG))
  RA = normalizeDegrees(RA)
  const Lquad = Math.floor(L / 90) * 90
  const RAquad = Math.floor(RA / 90) * 90
  RA = (RA + (Lquad - RAquad)) / 15

  const sinDec = 0.39782 * Math.sin(L * DEG)
  const cosDec = Math.cos(Math.asin(sinDec))
  const cosH =
    (Math.cos(ZENITH * DEG) - sinDec * Math.sin(lat * DEG)) /
    (cosDec * Math.cos(lat * DEG))

  if (cosH > 1) return { alwaysDown: true, time: null }
  if (cosH < -1) return { alwaysUp: true, time: null }

  let H = isSunrise ? 360 - RAD * Math.acos(cosH) : RAD * Math.acos(cosH)
  H /= 15

  const T = H + RA - 0.06571 * t - 6.622
  let UT = T - lngHour
  UT = ((UT % 24) + 24) % 24

  return {
    alwaysDown: false,
    alwaysUp: false,
    time: utToDate(date, UT),
  }
}

/** @returns {{ sunrise: Date|null, sunset: Date|null, alwaysUp: boolean, alwaysDown: boolean }} */
export function sunTimes(lat, lng, date = new Date()) {
  const rise = calcSunEvent(lat, lng, date, true)
  const set = calcSunEvent(lat, lng, date, false)
  if (rise.alwaysDown || set.alwaysDown) {
    return { sunrise: null, sunset: null, alwaysUp: false, alwaysDown: true }
  }
  if (rise.alwaysUp || set.alwaysUp) {
    return { sunrise: null, sunset: null, alwaysUp: true, alwaysDown: false }
  }

  let sunrise = rise.time
  let sunset = set.time
  if (sunrise && sunset && sunset.getTime() <= sunrise.getTime()) {
    sunset = new Date(sunset.getTime() + 86_400_000)
  }

  return {
    sunrise,
    sunset,
    alwaysUp: false,
    alwaysDown: false,
  }
}

export function isDaylight({ lat, lng, at = new Date() }) {
  const times = sunTimes(lat, lng, at)
  if (times.alwaysUp) return true
  if (times.alwaysDown) return false
  if (!times.sunrise || !times.sunset) return isClockDaylight(at)
  const t = at.getTime()
  return t >= times.sunrise.getTime() && t < times.sunset.getTime()
}

export function isClockDaylight(at = new Date()) {
  const h = at.getHours() + at.getMinutes() / 60 + at.getSeconds() / 3600
  return h >= CLOCK_DAY_START && h < CLOCK_DAY_END
}

/** Milliseconds until the next solar day/night boundary (min 1s, max ~24h). */
export function msUntilNextSolarBoundary(lat, lng, at = new Date()) {
  const times = sunTimes(lat, lng, at)
  if (times.alwaysUp || times.alwaysDown || !times.sunrise || !times.sunset) {
    return msUntilNextClockBoundary(at)
  }

  const t = at.getTime()
  const rise = times.sunrise.getTime()
  const set = times.sunset.getTime()

  let next
  if (t < rise) next = rise
  else if (t < set) next = set
  else {
    const tomorrow = new Date(
      at.getFullYear(),
      at.getMonth(),
      at.getDate() + 1,
      12,
      0,
      0,
      0,
    )
    const nextRise = sunTimes(lat, lng, tomorrow).sunrise
    next = nextRise ? nextRise.getTime() : t + msUntilNextClockBoundary(at)
  }

  return clampDelay(next - t)
}

export function msUntilNextClockBoundary(at = new Date()) {
  const y = at.getFullYear()
  const m = at.getMonth()
  const d = at.getDate()
  const h = at.getHours() + at.getMinutes() / 60 + at.getSeconds() / 3600
  let target
  if (h < CLOCK_DAY_START) {
    target = new Date(y, m, d, CLOCK_DAY_START, 0, 0, 0)
  } else if (h < CLOCK_DAY_END) {
    target = new Date(y, m, d, CLOCK_DAY_END, 0, 0, 0)
  } else {
    target = new Date(y, m, d + 1, CLOCK_DAY_START, 0, 0, 0)
  }
  return clampDelay(target.getTime() - at.getTime())
}

function clampDelay(ms) {
  if (!Number.isFinite(ms) || ms < 1000) return 1000
  // setTimeout is unreliable past ~24h; re-check at least daily
  return Math.min(ms, 24 * 60 * 60 * 1000)
}
