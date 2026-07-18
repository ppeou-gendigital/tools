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
import {
  applySyncOp,
  deleteSyncAll,
  enqueueSyncOp,
  opClearDomainPaths,
  opRemovePath,
} from '@/lib/supabaseSync'
import { useAuth } from '@/providers/AuthProvider'
import { isExtension } from '@/env'

const VisitedUrlsContext = createContext(null)

const STORAGE_KEY = 'loopy.visitedByDomain'

// Persisted map of AEM-matched tab visits, grouped by hostname.
// User-initiated clears/removes sync through supabaseSync (same recipe
// as favorites). Capture merges are owned by the SW via syncVisits.
export function VisitedUrlsProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

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
    const snapshot = byDomain
    setByDomainState({})
    await persist({})
    if (!userId) return
    try {
      await deleteSyncAll({ stream: 'visits', userId })
    } catch (err) {
      console.warn('[loopy] visits clearAll sync failed:', err?.message ?? err)
      setByDomainState(snapshot)
      await persist(snapshot)
    }
  }, [persist, userId, byDomain])

  const clearDomain = useCallback(
    async (hostname) => {
      const host = String(hostname ?? '').trim().toLowerCase()
      if (!host) return
      let before = null
      let resolved
      setByDomainState((prev) => {
        if (!(host in prev)) {
          resolved = prev
          return prev
        }
        before = prev[host]
        const next = { ...prev }
        delete next[host]
        resolved = next
        return next
      })
      await persist(resolved)
      if (!userId || !before) return
      try {
        await enqueueSyncOp({
          stream: 'visits',
          key: host,
          fn: () =>
            applySyncOp({
              stream: 'visits',
              userId,
              key: host,
              op: opClearDomainPaths(),
            }),
        })
      } catch (err) {
        console.warn('[loopy] visits clearDomain sync failed:', err?.message ?? err)
        setByDomainState((prev) => {
          const next = { ...prev, [host]: before }
          persist(next)
          return next
        })
      }
    },
    [persist, userId],
  )

  const removePath = useCallback(
    async (hostname, path) => {
      const host = String(hostname ?? '').trim().toLowerCase()
      const p = String(path ?? '').trim()
      if (!host || !p) return
      let before = null
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
        before = {
          paths: { ...prevPaths },
          updatedAt: bucket.updatedAt,
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
      await persist(resolved)
      if (!userId || !before) return
      try {
        await enqueueSyncOp({
          stream: 'visits',
          key: host,
          fn: () =>
            applySyncOp({
              stream: 'visits',
              userId,
              key: host,
              op: opRemovePath(p),
            }),
        })
      } catch (err) {
        console.warn('[loopy] visits removePath sync failed:', err?.message ?? err)
        setByDomainState((prev) => {
          const next = { ...prev, [host]: before }
          persist(next)
          return next
        })
      }
    },
    [persist, userId],
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
