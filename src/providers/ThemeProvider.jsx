import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'accesso.theme'
const THEMES = ['light', 'dark', 'system']

function resolveTheme(pref) {
  if (pref === 'system') {
    const prefersDark =
      globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }
  return pref
}

function applyTheme(resolved) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = resolved
}

export function ThemeProvider({ children, defaultTheme = 'system' }) {
  const [pref, setPref] = useState(defaultTheme)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!mounted) return
      const next = THEMES.includes(stored) ? stored : defaultTheme
      setPref(next)
      applyTheme(resolveTheme(next))
      setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [defaultTheme])

  useEffect(() => {
    if (!ready) return
    applyTheme(resolveTheme(pref))
  }, [pref, ready])

  useEffect(() => {
    if (pref !== 'system') return
    const mq = globalThis.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const handler = () => applyTheme(resolveTheme('system'))
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [pref])

  const setTheme = useCallback(async (next) => {
    if (!THEMES.includes(next)) return
    setPref(next)
    await asyncStorage.setItem(STORAGE_KEY, next)
  }, [])

  const value = useMemo(
    () => ({
      theme: pref,
      resolvedTheme: resolveTheme(pref),
      setTheme,
      ready,
    }),
    [pref, setTheme, ready],
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
