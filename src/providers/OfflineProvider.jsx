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
  buildWorkspaceOfflinePack,
  getWorkspaceOfflinePack,
  listWorkspaceOfflinePacks,
  removeWorkspaceOfflinePack,
} from '@/lib/offline/workspacePack'

const OfflineContext = createContext(null)

export function OfflineProvider({ children }) {
  const [online, setOnline] = useState(() => getIsOnline())
  const [packs, setPacks] = useState([])
  const [ready, setReady] = useState(false)

  const refreshPacks = useCallback(async () => {
    const list = await listWorkspaceOfflinePacks()
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

  useEffect(() => {
    if (!ready || !online) return
    let cancelled = false
    ;(async () => {
      const list = await listWorkspaceOfflinePacks()
      if (!cancelled) setPacks(list)
    })()
    return () => {
      cancelled = true
    }
  }, [online, ready])

  const makeAvailableOffline = useCallback(
    async (userId) => {
      const pack = await buildWorkspaceOfflinePack(userId)
      await refreshPacks()
      return pack
    },
    [refreshPacks],
  )

  const removeAvailableOffline = useCallback(
    async (userId) => {
      await removeWorkspaceOfflinePack(userId)
      await refreshPacks()
    },
    [refreshPacks],
  )

  const getPack = useCallback((userId) => getWorkspaceOfflinePack(userId), [])

  const isPackAvailable = useCallback(
    (userId) => packs.some((p) => p.scopeId === userId),
    [packs],
  )

  const primaryPack = packs[0] ?? null
  const isOfflineMode = ready && !online && packs.length > 0
  const isOfflineEmpty = ready && !online && packs.length === 0

  const value = useMemo(
    () => ({
      ready,
      online,
      packs,
      primaryPack,
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
      primaryPack,
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

export function useOfflineOptional() {
  return useContext(OfflineContext)
}
