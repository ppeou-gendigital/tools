import { useCallback, useEffect, useRef, useState } from 'react'
import { loadCachedCoords, resolveCoords } from '@/lib/geoLocation'
import {
  isClockDaylight,
  isDaylight,
  msUntilNextClockBoundary,
  msUntilNextSolarBoundary,
} from '@/lib/solar'
import { useTheme } from '@tools/service'
import { useOfflineOptional } from '@/providers/OfflineProvider'

/**
 * Solar/geo daynight for Viaggio. Call inside Tools ThemeProvider.
 * Returns a stable-ish resolveDaynight whose identity bumps on boundary/coords
 * so the package ThemeProvider re-applies the resolved theme.
 *
 * @param {(resolve: () => 'light'|'dark') => void} syncResolve
 */
export function useViaggioDaynight(syncResolve) {
  const { theme } = useTheme()
  const offline = useOfflineOptional()
  const forceClock =
    offline?.isOfflineMode ||
    offline?.isOfflineEmpty ||
    offline?.online === false

  const [coords, setCoords] = useState(null)
  const [tick, setTick] = useState(0)
  const deniedRef = useRef(false)
  const coordsRef = useRef(null)

  useEffect(() => {
    coordsRef.current = coords
  }, [coords])

  const effectiveCoords = forceClock ? null : coords

  useEffect(() => {
    if (theme !== 'daynight' || forceClock) return

    let cancelled = false
    deniedRef.current = false

    const refresh = async ({ forcePrompt = false } = {}) => {
      if (cancelled) return
      const cached = await loadCachedCoords()
      if (cancelled) return
      if (cached) setCoords(cached)

      if (deniedRef.current && !forcePrompt && !cached) {
        setCoords(null)
        return
      }

      const next = await resolveCoords()
      if (cancelled) return
      if (next) {
        deniedRef.current = false
        setCoords(next)
      } else {
        if (!cached) deniedRef.current = true
        setCoords(cached)
      }
    }

    void refresh({ forcePrompt: true })

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void refresh({ forcePrompt: false })
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [theme, forceClock])

  useEffect(() => {
    if (theme !== 'daynight') return

    let timerId = 0
    let cancelled = false

    const arm = () => {
      if (cancelled) return
      const c = forceClock ? null : coordsRef.current
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
    const day =
      effectiveCoords != null
        ? isDaylight({ lat: effectiveCoords.lat, lng: effectiveCoords.lng })
        : isClockDaylight()
    return day ? 'light' : 'dark'
    // tick intentionally forces a new resolve identity at solar boundaries
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveCoords, tick])

  useEffect(() => {
    syncResolve?.(resolve)
  }, [resolve, syncResolve])
}

/** Mount inside Tools ThemeProvider to drive solar daynight. */
export function ViaggioDaynightBridge({ syncResolve }) {
  useViaggioDaynight(syncResolve)
  return null
}
