import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'
import {
  addFavorite as addFavoriteToBucket,
  normalizeFavoritesByDomain,
} from '@/lib/favorites'
import { isExtension } from '@/env'

const FavoritesContext = createContext(null)

const STORAGE_KEY = 'loopy.favorites'

// Persisted map of user-bookmarked URLs, grouped by hostname:
//   { [hostname]: { paths: { [path]: FavValue }, updatedAt: '<iso>' } }
//
// Shape matches user_visits so the sync layer can reuse the same
// per-domain CAS pattern; see src/lib/favorites.js for the invariants.
//
// Unlike VisitedUrlsProvider, favorites are user-triggered (never
// written by the background worker), so this provider owns writes
// end-to-end. We still subscribe to chrome.storage.onChanged so a
// bookmark taken in one popup surfaces immediately in any other open
// window mirroring the same storage.
export function FavoritesProvider({ children }) {
  const [byDomain, setByDomainState] = useState({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!mounted) return
      setByDomainState(normalizeFavoritesByDomain(readJson(raw)))
      setReady(true)
    })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!isExtension()) return
    if (!chrome?.storage?.onChanged?.addListener) return
    const listener = (changes, area) => {
      if (area !== 'local') return
      if (!changes[STORAGE_KEY]) return
      const raw = changes[STORAGE_KEY].newValue
      setByDomainState(normalizeFavoritesByDomain(readJson(raw)))
    }
    chrome.storage.onChanged.addListener(listener)
    return () => {
      chrome.storage.onChanged.removeListener(listener)
    }
  }, [])

  const persist = useCallback(async (next) => {
    await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(next ?? {}))
  }, [])

  // Absolute-set. Used by PrefsSync when applying a remote pull.
  const setByDomain = useCallback(
    async (next) => {
      let resolved
      setByDomainState((prev) => {
        const raw = typeof next === 'function' ? next(prev) : next
        resolved = normalizeFavoritesByDomain(raw)
        return resolved
      })
      await persist(resolved)
    },
    [persist],
  )

  // Add one favorite. Hostname is lowercased for storage; the caller
  // is responsible for extracting hostname / path from a URL. Returns
  // once the write is durable so callers can chain UI feedback (e.g.
  // "Bookmarked!" toast) without racing the next render.
  const addFavorite = useCallback(
    async ({ hostname, path, title, addedAt }) => {
      const host = String(hostname ?? '').trim().toLowerCase()
      const p = String(path ?? '').trim()
      if (!host || !p) return
      let resolved
      setByDomainState((prev) => {
        const bucket = prev[host]
        const nextBucket = addFavoriteToBucket(bucket, {
          path: p,
          title: title ?? '',
          addedAt,
        })
        resolved = { ...prev, [host]: nextBucket }
        return resolved
      })
      if (resolved) await persist(resolved)
    },
    [persist],
  )

  // Remove one favorited path. If the domain has no other favs left
  // after the removal, drop the whole bucket so the deck doesn't show
  // an empty slide.
  const removeFavorite = useCallback(
    async (hostname, path) => {
      const host = String(hostname ?? '').trim().toLowerCase()
      const p = String(path ?? '').trim()
      if (!host || !p) return
      let resolved
      setByDomainState((prev) => {
        const bucket = prev[host]
        const prevPaths =
          bucket?.paths &&
          typeof bucket.paths === 'object' &&
          !Array.isArray(bucket.paths)
            ? bucket.paths
            : null
        if (!prevPaths || !(p in prevPaths)) {
          resolved = prev
          return prev
        }
        const nextPaths = { ...prevPaths }
        delete nextPaths[p]
        const next = { ...prev }
        if (Object.keys(nextPaths).length === 0) {
          delete next[host]
        } else {
          next[host] = {
            paths: nextPaths,
            updatedAt: new Date().toISOString(),
          }
        }
        resolved = next
        return next
      })
      if (resolved) await persist(resolved)
    },
    [persist],
  )

  const clearDomain = useCallback(
    async (hostname) => {
      const host = String(hostname ?? '').trim().toLowerCase()
      if (!host) return
      let resolved
      setByDomainState((prev) => {
        if (!(host in prev)) {
          resolved = prev
          return prev
        }
        const next = { ...prev }
        delete next[host]
        resolved = next
        return next
      })
      if (resolved) await persist(resolved)
    },
    [persist],
  )

  const clearAll = useCallback(async () => {
    setByDomainState({})
    await persist({})
  }, [persist])

  const value = useMemo(
    () => ({
      byDomain,
      setByDomain,
      addFavorite,
      removeFavorite,
      clearDomain,
      clearAll,
      ready,
    }),
    [
      byDomain,
      setByDomain,
      addFavorite,
      removeFavorite,
      clearDomain,
      clearAll,
      ready,
    ],
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites must be used inside <FavoritesProvider>')
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
