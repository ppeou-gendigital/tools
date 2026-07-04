import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'
import { normalizeVisitedByDomain } from '@/lib/visitedUrls'
import { isExtension } from '@/env'

const VisitedUrlsContext = createContext(null)

const STORAGE_KEY = 'loopy.visitedByDomain'

// Persisted map of AEM-matched tab visits, grouped by hostname:
//   { [hostname]: { paths: { [path]: PathValue }, updatedAt: '<iso>' } }
//
// Round-tripped through the shared normalizer on both read and write so
// background.js, PrefsSync, and the Visited URLs page all agree on shape.
//
// In the extension, the background service worker writes to the same
// storage key on every tracked navigation, so we subscribe to
// chrome.storage.onChanged and reflect those writes into React state live.
export function VisitedUrlsProvider({ children }) {
  const [byDomain, setByDomainState] = useState({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!mounted) return
      setByDomainState(normalizeVisitedByDomain(readJson(raw)))
      setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [])

  // Extension surface only: reflect background-worker writes into React.
  // The web build has no chrome.storage; the provider stays a plain state
  // holder that React callers own end-to-end.
  useEffect(() => {
    if (!isExtension()) return
    if (!chrome?.storage?.onChanged?.addListener) return
    const listener = (changes, area) => {
      if (area !== 'local') return
      if (!changes[STORAGE_KEY]) return
      const raw = changes[STORAGE_KEY].newValue
      setByDomainState(normalizeVisitedByDomain(readJson(raw)))
    }
    chrome.storage.onChanged.addListener(listener)
    return () => {
      chrome.storage.onChanged.removeListener(listener)
    }
  }, [])

  const persist = useCallback(async (next) => {
    await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(next ?? {}))
  }, [])

  // Absolute-set. Used by PrefsSync when applying a remote pull, and by
  // clear/remove helpers below.
  const setByDomain = useCallback(
    async (next) => {
      let resolved
      setByDomainState((prev) => {
        const raw = typeof next === 'function' ? next(prev) : next
        resolved = normalizeVisitedByDomain(raw)
        return resolved
      })
      await persist(resolved)
    },
    [persist],
  )

  const clearAll = useCallback(async () => {
    console.warn('[loopy] visited-urls: clearAll invoked', new Error().stack)
    setByDomainState({})
    await persist({})
  }, [persist])

  const clearDomain = useCallback(
    async (hostname) => {
      let resolved
      setByDomainState((prev) => {
        if (!(hostname in prev)) {
          resolved = prev
          return prev
        }
        const next = { ...prev }
        delete next[hostname]
        resolved = next
        return next
      })
      if (resolved && resolved !== undefined) {
        console.warn('[loopy] visited-urls: clearDomain', { hostname })
        await persist(resolved)
      }
    },
    [persist],
  )

  const removePath = useCallback(
    async (hostname, path) => {
      let resolved
      setByDomainState((prev) => {
        const bucket = prev[hostname]
        const prevPaths =
          bucket?.paths &&
          typeof bucket.paths === 'object' &&
          !Array.isArray(bucket.paths)
            ? bucket.paths
            : null
        if (!prevPaths || !(path in prevPaths)) {
          resolved = prev
          return prev
        }
        const nextPaths = { ...prevPaths }
        delete nextPaths[path]
        const next = { ...prev }
        if (Object.keys(nextPaths).length === 0) {
          delete next[hostname]
        } else {
          next[hostname] = {
            paths: nextPaths,
            updatedAt: new Date().toISOString(),
          }
        }
        resolved = next
        return next
      })
      if (resolved) {
        console.debug('[loopy] visited-urls: removePath', { hostname, path })
        await persist(resolved)
      }
    },
    [persist],
  )

  const value = useMemo(
    () => ({
      byDomain,
      setByDomain,
      clearAll,
      clearDomain,
      removePath,
      ready,
    }),
    [byDomain, setByDomain, clearAll, clearDomain, removePath, ready],
  )

  return (
    <VisitedUrlsContext.Provider value={value}>
      {children}
    </VisitedUrlsContext.Provider>
  )
}

export function useVisitedUrls() {
  const ctx = useContext(VisitedUrlsContext)
  if (!ctx) {
    throw new Error('useVisitedUrls must be used inside <VisitedUrlsProvider>')
  }
  return ctx
}

function readJson(raw) {
  if (raw == null) return {}
  if (typeof raw === 'object') return raw
  if (typeof raw !== 'string') return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}
