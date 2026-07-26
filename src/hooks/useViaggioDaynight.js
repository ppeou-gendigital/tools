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

/**
 * Solar/geo daynight for Viaggio. Call inside Tools ThemeProvider.
 * Returns a stable-ish resolveDaynight whose identity bumps on boundary/coords
 * so the package ThemeProvider re-applies the resolved theme.
 *
 * Location is resolved non-interactively after the first ask so reopening the
 * app does not re-trigger the system permission dialog.
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
  const coordsRef = useRef(null)
  const firstAskDoneRef = useRef(false)

  useEffect(() => {
    coordsRef.current = coords
  }, [coords])

  const effectiveCoords = forceClock ? null : coords

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
