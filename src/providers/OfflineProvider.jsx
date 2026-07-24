import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getIsOnline, subscribeIsOnline } from '@/lib/offline/connectivity'
import {
  buildJourneyOfflinePack,
  getJourneyOfflinePack,
  listJourneyOfflinePacks,
  removeJourneyOfflinePack,
} from '@/lib/offline/journeyPack'

const OfflineContext = createContext(null)

export function OfflineProvider({ children }) {
  const [online, setOnline] = useState(() => getIsOnline())
  const [packs, setPacks] = useState([])
  const [ready, setReady] = useState(false)

  const refreshPacks = useCallback(async () => {
    const list = await listJourneyOfflinePacks()
    setPacks(list)
    return list
  }, [])

  useEffect(() => {
    let mounted = true
    const unsub = subscribeIsOnline((next) => {
      if (mounted) setOnline(next)
    })
    ;(async () => {
      try {
        await refreshPacks()
      } finally {
        if (mounted) setReady(true)
      }
    })()
    return () => {
      mounted = false
      unsub()
    }
  }, [refreshPacks])

  // When coming back online, refresh the pack index (data still rebuilt via pin).
  useEffect(() => {
    if (!ready || !online) return
    let cancelled = false
    ;(async () => {
      const list = await listJourneyOfflinePacks()
      if (!cancelled) setPacks(list)
    })()
    return () => {
      cancelled = true
    }
  }, [online, ready])

  const makeAvailableOffline = useCallback(
    async (journeyId, { userId } = {}) => {
      const pack = await buildJourneyOfflinePack(journeyId, { userId })
      await refreshPacks()
      return pack
    },
    [refreshPacks],
  )

  const removeAvailableOffline = useCallback(
    async (journeyId) => {
      await removeJourneyOfflinePack(journeyId)
      await refreshPacks()
    },
    [refreshPacks],
  )

  const getPack = useCallback((journeyId) => getJourneyOfflinePack(journeyId), [])

  const isPackAvailable = useCallback(
    (journeyId) => packs.some((p) => p.scopeId === journeyId),
    [packs],
  )

  /** Offline product path: no network and at least one pinned journey. */
  const isOfflineMode = ready && !online && packs.length > 0
  /** No network and nothing pinned — show a dedicated empty state, not OTP. */
  const isOfflineEmpty = ready && !online && packs.length === 0

  const value = useMemo(
    () => ({
      ready,
      online,
      packs,
      isOfflineMode,
      isOfflineEmpty,
      refreshPacks,
      makeAvailableOffline,
      removeAvailableOffline,
      getPack,
      isPackAvailable,
    }),
    [
      ready,
      online,
      packs,
      isOfflineMode,
      isOfflineEmpty,
      refreshPacks,
      makeAvailableOffline,
      removeAvailableOffline,
      getPack,
      isPackAvailable,
    ],
  )

  return (
    <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
  )
}

export function useOffline() {
  const ctx = useContext(OfflineContext)
  if (!ctx) {
    throw new Error('useOffline must be used inside <OfflineProvider>')
  }
  return ctx
}

/** Safe for providers that may mount above OfflineProvider. */
export function useOfflineOptional() {
  return useContext(OfflineContext)
}
