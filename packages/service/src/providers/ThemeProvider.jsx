import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { asyncStorage } from '../lib/storage.js'
import { isClockDaylight, msUntilNextClockBoundary } from '../lib/clockDaylight.js'

const ThemeContext = createContext(null)

const BASE_THEMES = ['light', 'dark', 'system']

function resolveTheme(pref, { resolveDaynight } = {}) {
  if (pref === 'system') {
    const prefersDark =
      globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }
  if (pref === 'daynight') {
    if (typeof resolveDaynight === 'function') return resolveDaynight()
    return isClockDaylight() ? 'light' : 'dark'
  }
  return pref
}

function applyTheme(resolved) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = resolved
  document.documentElement.style.colorScheme = resolved
}

/**
 * @param {object} props
 * @param {string} props.appId
 * @param {string} [props.defaultTheme]
 * @param {boolean} [props.enableDaynight]
 * @param {() => 'light'|'dark'} [props.resolveDaynight]
 */
export function ThemeProvider({
  children,
  appId,
  defaultTheme = 'system',
  enableDaynight = false,
  resolveDaynight,
}) {
  const themes = useMemo(
    () => (enableDaynight ? [...BASE_THEMES, 'daynight'] : BASE_THEMES),
    [enableDaynight],
  )
  const storageKey = `${appId}.theme`

  const [pref, setPref] = useState(defaultTheme)
  const [ready, setReady] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(storageKey).then((stored) => {
      if (!mounted) return
      const next = themes.includes(stored) ? stored : defaultTheme
      setPref(next)
      applyTheme(resolveTheme(next, { resolveDaynight }))
      setReady(true)
    })
    return () => { mounted = false }
    // hydrate once per storage key / theme list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, defaultTheme, themes])

  useEffect(() => {
    if (!ready) return
    applyTheme(resolveTheme(pref, { resolveDaynight }))
  }, [pref, ready, tick, resolveDaynight])

  useEffect(() => {
    if (pref !== 'system') return
    const mq = globalThis.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const handler = () => applyTheme(resolveTheme('system'))
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [pref])

  // Clock-based daynight boundary timer when no custom resolver is provided.
  useEffect(() => {
    if (!ready || pref !== 'daynight' || resolveDaynight) return
    const id = setTimeout(() => setTick((t) => t + 1), msUntilNextClockBoundary())
    return () => clearTimeout(id)
  }, [ready, pref, tick, resolveDaynight])

  const setTheme = useCallback(
    async (next) => {
      if (!themes.includes(next)) return
      setPref(next)
      await asyncStorage.setItem(storageKey, next)
    },
    [themes, storageKey],
  )

  const value = useMemo(
    () => ({
      theme: pref,
      resolvedTheme: resolveTheme(pref, { resolveDaynight }),
      setTheme,
      ready,
      themes,
    }),
    [pref, setTheme, ready, themes, resolveDaynight],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
