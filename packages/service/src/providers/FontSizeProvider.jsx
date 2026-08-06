import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { asyncStorage } from '../lib/storage.js'

const FontSizeContext = createContext(null)
const MIN = 12
const MAX = 24
const DEFAULT = 16
const STEP = 2

function clamp(n) {
  if (!Number.isFinite(n)) return DEFAULT
  const clamped = Math.min(MAX, Math.max(MIN, n))
  const snapped = MIN + Math.round((clamped - MIN) / STEP) * STEP
  return Math.min(MAX, Math.max(MIN, snapped))
}

function applyFontSize(size) {
  if (typeof document === 'undefined') return
  document.documentElement.style.fontSize = `${size}px`
}

export function FontSizeProvider({ children, appId }) {
  const storageKey = `${appId}.fontSize`
  const [size, setSizeState] = useState(DEFAULT)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(storageKey).then((stored) => {
      if (!mounted) return
      const parsed = stored != null ? Number.parseInt(stored, 10) : NaN
      const next = clamp(parsed)
      setSizeState(next)
      applyFontSize(next)
      setReady(true)
    })
    return () => { mounted = false }
  }, [storageKey])

  useEffect(() => {
    if (!ready) return
    applyFontSize(size)
    asyncStorage.setItem(storageKey, String(size))
  }, [size, ready, storageKey])

  const setSize = useCallback((n) => {
    setSizeState(clamp(n))
  }, [])

  const decrease = useCallback(() => setSizeState((v) => clamp(v - STEP)), [])
  const increase = useCallback(() => setSizeState((v) => clamp(v + STEP)), [])
  const reset = useCallback(() => setSizeState(DEFAULT), [])

  const value = useMemo(
    () => ({
      size,
      min: MIN,
      max: MAX,
      canDecrease: size > MIN,
      canIncrease: size < MAX,
      setSize,
      decrease,
      increase,
      reset,
      ready,
    }),
    [size, setSize, decrease, increase, reset, ready],
  )

  return (
    <FontSizeContext.Provider value={value}>{children}</FontSizeContext.Provider>
  )
}

export function useFontSize() {
  const ctx = useContext(FontSizeContext)
  if (!ctx) throw new Error('useFontSize must be used inside <FontSizeProvider>')
  return ctx
}
