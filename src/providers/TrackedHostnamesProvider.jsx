import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'
import { normalizeTrackedHostnames } from '@/lib/trackedHostnames'

const TrackedHostnamesContext = createContext(null)

const STORAGE_KEY = 'loopy.trackedHostnames'

// Persisted map of hostname-capture rules, keyed by the pattern string.
// Shape (documented in src/lib/trackedHostnames.js):
//
//   {
//     "*.norton.*":    { id: "h_abc", mode: "include" },
//     "ping.norton.*": { id: "h_def", mode: "exclude" },
//   }
//
// This is the sole decision engine for whether the SW captures a tab
// visit; the AEM domain list is not consulted for capture.
//
// Round-trips through the shared normalizer on both read and write so
// PrefsSync, the TrackedHosts page, and background.js all see the same
// clean shape. The normalizer accepts the legacy array shape too, so
// stale local storage or server rows written before the object cutover
// still upgrade cleanly on next read.
export function TrackedHostnamesProvider({ children }) {
  const [hosts, setHostsState] = useState({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!mounted) return
      let parsed = null
      if (typeof raw === 'string') {
        try {
          parsed = JSON.parse(raw)
        } catch {
          parsed = null
        }
      } else if (raw && typeof raw === 'object') {
        // chrome.storage.local returns the value as-is (object or array).
        parsed = raw
      }
      setHostsState(normalizeTrackedHostnames(parsed))
      setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [])

  const setHosts = useCallback(async (next) => {
    // Support both the value and updater forms so callers can do
    //   setHosts({...})              // absolute
    //   setHosts(prev => ({...}))    // functional, gets latest state
    // Persistence always runs against the normalized post-update value.
    let resolved
    setHostsState((prev) => {
      const raw = typeof next === 'function' ? next(prev) : next
      resolved = normalizeTrackedHostnames(raw)
      return resolved
    })
    await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(resolved ?? {}))
  }, [])

  const value = useMemo(
    () => ({ hosts, setHosts, ready }),
    [hosts, setHosts, ready],
  )

  return (
    <TrackedHostnamesContext.Provider value={value}>
      {children}
    </TrackedHostnamesContext.Provider>
  )
}

export function useTrackedHostnames() {
  const ctx = useContext(TrackedHostnamesContext)
  if (!ctx) {
    throw new Error(
      'useTrackedHostnames must be used inside <TrackedHostnamesProvider>',
    )
  }
  return ctx
}
