import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'
import { normalizeAemDomains } from '@/lib/prefs'

const AemDomainsContext = createContext(null)

const STORAGE_KEY = 'loopy.aemDomains'

// Persisted list of AEM Jump domain entries. Shape is documented in
// src/lib/prefs.js -> normalizeAemDomains. The provider round-trips through
// the shared normalizer on both read and write so PrefsSync, Settings, and
// AemJump all see the same clean shape.
export function AemDomainsProvider({ children }) {
  const [domains, setDomainsState] = useState([])
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
      } else if (Array.isArray(raw)) {
        // chrome.storage.local returns the object as-is.
        parsed = raw
      }
      setDomainsState(normalizeAemDomains(parsed))
      setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [])

  const setDomains = useCallback(async (next) => {
    // Support both the value and updater forms so callers can do
    //   setDomains([...])              // absolute
    //   setDomains(prev => [...prev])  // functional, gets latest state
    // Persistence always runs against the normalized post-update value.
    let resolved
    setDomainsState((prev) => {
      const raw = typeof next === 'function' ? next(prev) : next
      resolved = normalizeAemDomains(raw)
      return resolved
    })
    await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(resolved ?? []))
  }, [])

  const value = useMemo(
    () => ({ domains, setDomains, ready }),
    [domains, setDomains, ready],
  )

  return (
    <AemDomainsContext.Provider value={value}>
      {children}
    </AemDomainsContext.Provider>
  )
}

export function useAemDomains() {
  const ctx = useContext(AemDomainsContext)
  if (!ctx) {
    throw new Error('useAemDomains must be used inside <AemDomainsProvider>')
  }
  return ctx
}
