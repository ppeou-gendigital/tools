import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'
import {
  applySyncOp,
  enqueueSyncOp,
  opSetFontSize,
} from '@/lib/supabaseSync'
import { useAuth } from '@/providers/AuthProvider'

const FontSizeContext = createContext(null)

const STORAGE_KEY = 'loopy.fontSize'
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

export function FontSizeProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [size, setSizeState] = useState(DEFAULT)
  const [ready, setReady] = useState(false)
  const skipSyncRef = useRef(false)
  const hydratedRef = useRef(false)
  const lastSyncedSizeRef = useRef(null)

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!mounted) return
      const parsed = stored != null ? Number.parseInt(stored, 10) : NaN
      const next = clamp(parsed)
      setSizeState(next)
      applyFontSize(next)
      setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    applyFontSize(size)
    asyncStorage.setItem(STORAGE_KEY, String(size))
    if (!hydratedRef.current) {
      hydratedRef.current = true
      lastSyncedSizeRef.current = size
      return
    }
    if (skipSyncRef.current) {
      skipSyncRef.current = false
      lastSyncedSizeRef.current = size
      return
    }
    // Skip when only userId changed (sign-in) — PrefsSync pull owns that.
    if (lastSyncedSizeRef.current === size) return
    lastSyncedSizeRef.current = size
    if (!userId) return
    enqueueSyncOp({
      stream: 'prefs',
      key: 'fontSize',
      fn: () =>
        applySyncOp({
          stream: 'prefs',
          userId,
          op: opSetFontSize(size),
        }),
    }).catch((err) => {
      console.warn('[loopy] fontSize sync failed:', err?.message ?? err)
    })
  }, [size, ready, userId])

  const setSize = useCallback((n, { fromRemote = false } = {}) => {
    if (fromRemote) skipSyncRef.current = true
    setSizeState(clamp(n))
  }, [])

  const decrease = useCallback(() => {
    setSizeState((v) => clamp(v - STEP))
  }, [])

  const increase = useCallback(() => {
    setSizeState((v) => clamp(v + STEP))
  }, [])

  const reset = useCallback(() => {
    setSizeState(DEFAULT)
  }, [])

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
  if (!ctx) {
    throw new Error('useFontSize must be used inside <FontSizeProvider>')
  }
  return ctx
}
