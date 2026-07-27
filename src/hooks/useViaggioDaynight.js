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
 * CRITICAL — avoid React #185:
 * - `syncResolve` must install the function into a *ref* on the parent
 *   (or ThemeProvider's resolveDaynight ref). Never `setState(resolve)`.
 * - Theme paint goes through `applyDaynight` (DOM only), not ThemeProvider setState.
 * - This hook stores `syncResolve` / `applyDaynight` in refs so inline parent
 *   callbacks cannot re-trigger install/paint effects.
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
  const syncResolveRef = useRef(syncResolve)
  const applyDaynightRef = useRef(applyDaynight)
  syncResolveRef.current = syncResolve
  applyDaynightRef.current = applyDaynight

  useEffect(() => {
    coordsRef.current = coords
  }, [coords])

  useEffect(() => {
    forceClockRef.current = forceClock
  }, [forceClock])

  const setCoords = useCallback((next) => {
    setCoordsState((prev) => (sameCoords(prev, next) ? prev : next))
  }, [])

  // Stable identity — always reads latest refs.
  const resolve = useCallback(() => {
    const c = forceClockRef.current ? null : coordsRef.current
    const day =
      c != null ? isDaylight({ lat: c.lat, lng: c.lng }) : isClockDaylight()
    return day ? 'light' : 'dark'
  }, [])

  // Install once when resolve identity is ready; ignore syncResolve identity churn.
  useEffect(() => {
    syncResolveRef.current?.(resolve)
  }, [resolve])

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
    applyDaynightRef.current?.()
  }, [theme, coords, tick, forceClock, resolve])

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

/**
 * Mount inside Tools ThemeProvider to drive solar daynight.
 * Parent must pass a syncResolve that writes a ref — never setState(resolve).
 */
export function ViaggioDaynightBridge({ syncResolve, applyDaynight }) {
  useViaggioDaynight(syncResolve, applyDaynight)
  return null
}
