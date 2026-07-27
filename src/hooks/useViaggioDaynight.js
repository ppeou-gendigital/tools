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
 * Updates a stable resolver ref via syncResolve (no setState). Re-applies the
 * theme by writing documentElement directly via applyDaynight — never bumps
 * React state, so geo refresh cannot hit React #185 max update depth.
 *
 * @param {(resolve: () => 'light'|'dark') => void} syncResolve
 * @param {() => void} [applyDaynight]
 */
export function useViaggioDaynight(syncResolve, applyDaynight) {
  const { theme } = useTheme()
  const offline = useOfflineOptional()
  // Only treat explicit offline product modes as clock-forced — do not use
  // `online === false` alone (flaps during connectivity probes and remounts).
  const forceClock = Boolean(
    offline?.isOfflineMode || offline?.isOfflineEmpty,
  )

  const [coords, setCoordsState] = useState(null)
  const [tick, setTick] = useState(0)
  const coordsRef = useRef(null)
  const firstAskDoneRef = useRef(false)
  const forceClockRef = useRef(forceClock)
  const lastAppliedRef = useRef('')

  useEffect(() => {
    coordsRef.current = coords
  }, [coords])

  useEffect(() => {
    forceClockRef.current = forceClock
  }, [forceClock])

  const setCoords = useCallback((next) => {
    setCoordsState((prev) => (sameCoords(prev, next) ? prev : next))
  }, [])

  const resolve = useCallback(() => {
    const c = forceClockRef.current ? null : coordsRef.current
    const day =
      c != null ? isDaylight({ lat: c.lat, lng: c.lng }) : isClockDaylight()
    return day ? 'light' : 'dark'
  }, [])

  // Install stable resolver once; it always reads latest refs.
  useEffect(() => {
    syncResolve?.(resolve)
  }, [resolve, syncResolve])

  // Paint theme when inputs change — DOM only, no ThemeProvider setState.
  useEffect(() => {
    if (theme !== 'daynight') return
    const c = forceClock ? null : coords
    const resolved = resolve()
    const key = [
      forceClock ? 'clock' : 'geo',
      c ? `${c.lat},${c.lng}` : 'none',
      String(tick),
      resolved,
    ].join('|')
    if (lastAppliedRef.current === key) return
    lastAppliedRef.current = key
    applyDaynight?.()
  }, [theme, coords, tick, forceClock, resolve, applyDaynight])

  useEffect(() => {
    if (theme !== 'daynight' || forceClock) return

    let cancelled = false

    const refresh = async ({ allowFirstAsk = false } = {}) => {
      if (cancelled) return

      const cached = await loadCachedCoords()
      if (cancelled) return
      if (cached) setCoords(cached)

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
}

/** Mount inside Tools ThemeProvider to drive solar daynight. */
export function ViaggioDaynightBridge({ syncResolve, applyDaynight }) {
  useViaggioDaynight(syncResolve, applyDaynight)
  return null
}
