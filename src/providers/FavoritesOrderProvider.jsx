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
  moveFavoriteDomain,
  normalizeFavoritesOrder,
} from '@/lib/favoritesOrder'
import {
  applySyncOp,
  enqueueSyncOp,
  opMoveFavoritesOrder,
  opSetFavoritesOrder,
} from '@/lib/supabaseSync'
import { useAuth } from '@/providers/AuthProvider'
import { isExtension } from '@/env'

const FavoritesOrderContext = createContext(null)

const STORAGE_KEY = 'loopy.favoritesOrder'

export function FavoritesOrderProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [order, setOrderState] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!mounted) return
      setOrderState(normalizeFavoritesOrder(raw))
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
      setOrderState(normalizeFavoritesOrder(changes[STORAGE_KEY].newValue))
    }
    chrome.storage.onChanged.addListener(listener)
    return () => {
      chrome.storage.onChanged.removeListener(listener)
    }
  }, [])

  const setOrder = useCallback(
    async (next, { fromRemote = false } = {}) => {
      let resolved
      setOrderState((prev) => {
        const raw = typeof next === 'function' ? next(prev) : next
        resolved = normalizeFavoritesOrder(raw)
        return resolved
      })
      await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(resolved ?? []))
      if (fromRemote || !userId) return
      try {
        await enqueueSyncOp({
          stream: 'prefs',
          key: 'favoritesOrder',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              op: opSetFavoritesOrder(resolved),
            }),
        })
      } catch (err) {
        console.warn('[loopy] favoritesOrder sync failed:', err?.message ?? err)
      }
    },
    [userId],
  )

  const moveDomain = useCallback(
    async (host, direction) => {
      const key = String(host ?? '').trim().toLowerCase()
      if (!key) return
      const delta = Math.sign(direction ?? 0)
      if (delta === 0) return
      const before = order
      let resolved
      setOrderState((prev) => {
        const seeded = prev.includes(key) ? prev : [...prev, key]
        resolved = moveFavoriteDomain(seeded, key, delta)
        return resolved
      })
      await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(resolved ?? []))
      if (!userId) return
      try {
        const row = await enqueueSyncOp({
          stream: 'prefs',
          key: 'favoritesOrder',
          fn: () =>
            applySyncOp({
              stream: 'prefs',
              userId,
              op: opMoveFavoritesOrder(key, delta),
            }),
        })
        const next = normalizeFavoritesOrder(row?.favoritesOrder)
        setOrderState(next)
        await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (err) {
        console.warn('[loopy] favoritesOrder move sync failed:', err?.message ?? err)
        setOrderState(before)
        await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(before))
      }
    },
    [userId, order],
  )

  const value = useMemo(
    () => ({ order, setOrder, moveDomain, ready }),
    [order, setOrder, moveDomain, ready],
  )

  return (
    <FavoritesOrderContext.Provider value={value}>
      {children}
    </FavoritesOrderContext.Provider>
  )
}

export function useFavoritesOrder() {
  const ctx = useContext(FavoritesOrderContext)
  if (!ctx) {
    throw new Error(
      'useFavoritesOrder must be used inside <FavoritesOrderProvider>',
    )
  }
  return ctx
}
