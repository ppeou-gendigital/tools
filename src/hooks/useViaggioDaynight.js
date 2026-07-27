import { useCallback, useEffect, useRef, useState } from 'react'
import {
  hasGeoPrompted,
  loadCachedCoords,
  resolveCoords,
} from '@/lib/geoLocation'
import {
  isClockDaylight,
  isDaylight,
  msUntilNextClockBoundary,
  msUntilNextSolarBoundary,
} from '@/lib/solar'
import { useTheme } from '@tools/service'
import { useOfflineOptional } from '@/providers/OfflineProvider'

function sameCoords(a, b) {
  if (a == null && b == null) return true
  if (a == null || b == null) return false
  return Number(a.lat) === Number(b.lat) && Number(a.lng) === Number(b.lng)
}

/**
 * Solar/geo daynight for Viaggio. Call inside Tools ThemeProvider.
 *
 * Resolver identity stays stable via syncResolve(ref). Theme re-apply is driven
 * by bumpDaynight() when coords/tick/forceClock change — avoids React #185
 * max-update-depth from setState-on-every-resolve.
 *
 * Location is resolved non-interactively after the first ask so reopening the
 * app does not re-trigger the system permission dialog.
 *
 * @param {(resolve: () => 'light'|'dark') => void} syncResolve
 * @param {() => void} [bumpDaynight]
 */
export function useViaggioDaynight(syncResolve, bumpDaynight) {
  const { theme } = useTheme()
  const offline = useOfflineOptional()
  const forceClock =
    offline?.isOfflineMode ||
    offline?.isOfflineEmpty ||
    offline?.online === false

  const [coords, setCoordsState] = useState(null)
  const [tick, setTick] = useState(0)
  const coordsRef = useRef(null)
  const firstAskDoneRef = useRef(false)
  const forceClockRef = useRef(forceClock)
  const lastBumpKeyRef = useRef('')

  useEffect(() => {
    coordsRef.current = coords
  }, [coords])

  useEffect(() => {
    forceClockRef.current = forceClock
  }, [forceClock])

  const setCoords = useCallback((next) => {
    setCoordsState((prev) => (sameCoords(prev, next) ? prev : next))
  }, [])

  useEffect(() => {
    if (theme !== 'daynight' || forceClock) return

    let cancelled = false

    const refresh = async ({ allowFirstAsk = false } = {}) => {
      if (cancelled) return

      const cached = await loadCachedCoords()
      if (cancelled) return
      if (cached) setCoords(cached)

      // First daynight session with no cache: one interactive ask, then never
      // auto-prompt again (resolveCoords also persists geoPrompted).
      if (
        allowFirstAsk &&
        !firstAskDoneRef.current &&
        !cached &&
        !(await hasGeoPrompted())
      ) {
        firstAskDoneRef.current = true
        const next = await resolveCoords({ interactive: true })
        if (cancelled) return
        setCoords(next)
        return
      }

      const next = await resolveCoords({ interactive: false })
      if (cancelled) return
      setCoords(next)
    }

    void refresh({ allowFirstAsk: true })

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void refresh({ allowFirstAsk: false })
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [theme, forceClock, setCoords])

  useEffect(() => {
    if (theme !== 'daynight') return

    let timerId = 0
    let cancelled = false

    const arm = () => {
      if (cancelled) return
      const c = forceClockRef.current ? null : coordsRef.current
      const delay =
        c != null
          ? msUntilNextSolarBoundary(c.lat, c.lng)
          : msUntilNextClockBoundary()
      timerId = globalThis.setTimeout(() => {
        if (cancelled) return
        setTick((n) => n + 1)
        arm()
      }, delay)
    }

    arm()
    return () => {
      cancelled = true
      globalThis.clearTimeout(timerId)
    }
  }, [theme, coords, forceClock])

  const resolve = useCallback(() => {
    const c = forceClockRef.current ? null : coordsRef.current
    const day =
      c != null ? isDaylight({ lat: c.lat, lng: c.lng }) : isClockDaylight()
    return day ? 'light' : 'dark'
  }, [])

  // Keep Tools ThemeProvider's resolver ref pointed at latest logic.
  useEffect(() => {
    syncResolve?.(resolve)
  }, [resolve, syncResolve])

  // Re-apply theme when inputs that affect light/dark may have changed.
  // Deduplicate by key so Strict Mode double-effects don't epoch-storm.
  useEffect(() => {
    if (theme !== 'daynight') return
    const c = forceClock ? null : coords
    const key = [
      theme,
      forceClock ? 'clock' : 'geo',
      c ? `${c.lat},${c.lng}` : 'none',
      String(tick),
      resolve(),
    ].join('|')
    if (lastBumpKeyRef.current === key) return
    lastBumpKeyRef.current = key
    bumpDaynight?.()
  }, [theme, coords, tick, forceClock, resolve, bumpDaynight])
}

/** Mount inside Tools ThemeProvider to drive solar daynight. */
export function ViaggioDaynightBridge({ syncResolve, bumpDaynight }) {
  useViaggioDaynight(syncResolve, bumpDaynight)
  return null
}
