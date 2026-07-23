import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { loadCachedCoords, resolveCoords } from '@/lib/geoLocation'
import {
  isClockDaylight,
  isDaylight,
  msUntilNextClockBoundary,
  msUntilNextSolarBoundary,
} from '@/lib/solar'
import { asyncStorage } from '@/lib/storage'
import {
  applySyncOp,
  enqueueSyncOp,
  opSetTheme,
} from '@/lib/supabaseSync'
import { useAuth } from '@/providers/AuthProvider'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'viaggio.theme'
const THEMES = ['light', 'dark', 'system', 'daynight']

function resolveTheme(pref, coords) {
  if (pref === 'system') {
    const prefersDark =
      globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }
  if (pref === 'daynight') {
    const day =
      coords != null
        ? isDaylight({ lat: coords.lat, lng: coords.lng })
        : isClockDaylight()
    return day ? 'light' : 'dark'
  }
  return pref
}

function applyTheme(resolved) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = resolved
}

export function ThemeProvider({ children, defaultTheme = 'daynight' }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [pref, setPref] = useState(defaultTheme)
  const [coords, setCoords] = useState(null)
  const [ready, setReady] = useState(false)
  const [tick, setTick] = useState(0)
  const deniedRef = useRef(false)
  const coordsRef = useRef(null)

  useEffect(() => {
    coordsRef.current = coords
  }, [coords])

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!mounted) return
      const next = THEMES.includes(stored) ? stored : defaultTheme
      setPref(next)
      setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [defaultTheme])

  // Apply resolved theme whenever pref / coords / scheduled tick changes.
  useEffect(() => {
    if (!ready) return
    applyTheme(resolveTheme(pref, coords))
  }, [pref, coords, ready, tick])

  // OS system preference listener.
  useEffect(() => {
    if (pref !== 'system') return
    const mq = globalThis.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const handler = () => applyTheme(resolveTheme('system', null))
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [pref])

  // Day/night: cache → live geolocation → clock fallback.
  useEffect(() => {
    if (!ready || pref !== 'daynight') return

    let cancelled = false

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
  }, [pref, ready])

  // Schedule re-resolve at the next sunrise/sunset (or clock) boundary.
  useEffect(() => {
    if (!ready || pref !== 'daynight') return

    let timerId = 0
    let cancelled = false

    const arm = () => {
      if (cancelled) return
      const c = coordsRef.current
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
  }, [pref, ready, coords])

  const setTheme = useCallback(
    async (next, { fromRemote = false } = {}) => {
      if (!THEMES.includes(next)) return
      if (next === 'daynight') deniedRef.current = false
      setPref(next)
      await asyncStorage.setItem(STORAGE_KEY, next)
      if (fromRemote || !userId) return
      try {
        await enqueueSyncOp({
          stream: 'prefs',
          key: 'theme',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              op: opSetTheme(next),
            }),
        })
      } catch (err) {
        console.warn('[viaggio] theme sync failed:', err?.message ?? err)
      }
    },
    [userId],
  )

  const value = useMemo(
    () => ({
      theme: pref,
      // `tick` forces a re-resolve at sunrise/sunset (or clock) boundaries.
      resolvedTheme: resolveTheme(pref, coords),
      setTheme,
      ready,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tick is intentional
    [pref, coords, setTheme, ready, tick],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>')
  }
  return ctx
}
