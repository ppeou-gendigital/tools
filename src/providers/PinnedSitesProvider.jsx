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
  movePinned as movePinnedInList,
  normalizePinnedSites,
} from '@/lib/pinnedSites'
import {
  applySyncOp,
  enqueueSyncOp,
  opMovePinned,
  opSetPinnedSites,
  opTogglePinned,
} from '@/lib/supabaseSync'
import { useAuth } from '@/providers/AuthProvider'
import { isExtension } from '@/env'

const PinnedSitesContext = createContext(null)

const STORAGE_KEY = 'loopy.sitetreePinned'

export function PinnedSitesProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [pinned, setPinnedState] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!mounted) return
      setPinnedState(normalizePinnedSites(raw))
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
      setPinnedState(normalizePinnedSites(changes[STORAGE_KEY].newValue))
    }
    chrome.storage.onChanged.addListener(listener)
    return () => {
      chrome.storage.onChanged.removeListener(listener)
    }
  }, [])

  // Absolute-set. PrefsSync pull passes { fromRemote: true } to skip CAS.
  const setPinned = useCallback(
    async (next, { fromRemote = false } = {}) => {
      let resolved
      setPinnedState((prev) => {
        const raw = typeof next === 'function' ? next(prev) : next
        resolved = normalizePinnedSites(raw)
        return resolved
      })
      await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(resolved ?? []))
      if (fromRemote || !userId) return
      try {
        await enqueueSyncOp({
          stream: 'prefs',
          key: 'pinnedSites',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              op: opSetPinnedSites(resolved),
            }),
        })
      } catch (err) {
        console.warn('[loopy] pinnedSites sync failed:', err?.message ?? err)
      }
    },
    [userId],
  )

  const toggle = useCallback(
    async (host) => {
      const key = String(host ?? '').trim().toLowerCase()
      if (!key) return
      const before = pinned
      let resolved
      setPinnedState((prev) => {
        const idx = prev.indexOf(key)
        resolved =
          idx === -1 ? [...prev, key] : prev.filter((h) => h !== key)
        return normalizePinnedSites(resolved)
      })
      await asyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(normalizePinnedSites(resolved) ?? []),
      )
      if (!userId) return
      try {
        const row = await enqueueSyncOp({
          stream: 'prefs',
          key: 'pinnedSites',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              op: opTogglePinned(key),
            }),
        })
        const next = normalizePinnedSites(row?.pinnedSites)
        setPinnedState(next)
        await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (err) {
        console.warn('[loopy] pin toggle sync failed:', err?.message ?? err)
        setPinnedState(before)
        await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(before))
      }
    },
    [userId, pinned],
  )

  const movePinned = useCallback(
    async (host, direction) => {
      const before = pinned
      let resolved
      setPinnedState((prev) => {
        resolved = movePinnedInList(prev, host, direction)
        return resolved
      })
      await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(resolved ?? []))
      if (!userId) return
      try {
        const row = await enqueueSyncOp({
          stream: 'prefs',
          key: 'pinnedSites',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              op: opMovePinned(host, direction),
            }),
        })
        const next = normalizePinnedSites(row?.pinnedSites)
        setPinnedState(next)
        await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (err) {
        console.warn('[loopy] pin move sync failed:', err?.message ?? err)
        setPinnedState(before)
        await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(before))
      }
    },
    [userId, pinned],
  )

  const pinnedSet = useMemo(() => new Set(pinned), [pinned])

  const value = useMemo(
    () => ({ pinned, pinnedSet, setPinned, toggle, movePinned, ready }),
    [pinned, pinnedSet, setPinned, toggle, movePinned, ready],
  )

  return (
    <PinnedSitesContext.Provider value={value}>
      {children}
    </PinnedSitesContext.Provider>
  )
}

export function usePinnedSites() {
  const ctx = useContext(PinnedSitesContext)
  if (!ctx) {
    throw new Error(
      'usePinnedSites must be used inside <PinnedSitesProvider>',
    )
  }
  return ctx
}
