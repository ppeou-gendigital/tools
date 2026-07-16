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
import { isExtension } from '@/env'

const FavoritesOrderContext = createContext(null)

const STORAGE_KEY = 'loopy.favoritesOrder'

// Persisted ordered array of hostnames — the user-curated display
// sequence for domain groups on the Fav Links page.
//
// Behaves exactly like PinnedSitesProvider (single-blob, order-
// sensitive, syncs via user_data.favorites_order): last-writer-wins
// through PrefsSync alongside theme / font-size / pinned_sites.
//
// The Fav Links page is defensive: any hostname in `byDomain` not
// present here appends implicitly at render time (freshest-first),
// and any hostname here whose bucket disappeared is skipped. That
// means callers only ever call `moveDomain` for hostnames the user
// explicitly wants to reorder — no one has to "seed" new domains.
export function FavoritesOrderProvider({ children }) {
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

  // Extension surface: reflect writes from other popup instances (or
  // from PrefsSync in another window) into React state so a fresh
  // reorder shows up live without a reopen.
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

  // Absolute-set. Used by PrefsSync when applying a remote pull, and
  // internally by moveDomain below.
  const setOrder = useCallback(async (next) => {
    let resolved
    setOrderState((prev) => {
      const raw = typeof next === 'function' ? next(prev) : next
      resolved = normalizeFavoritesOrder(raw)
      return resolved
    })
    await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(resolved ?? []))
  }, [])

  // Move a hostname up (-1) or down (+1) in the order array. Delegates
  // to the pure helper so behavior is testable outside React.
  //
  // Auto-seeds the hostname into the array if it's not already there,
  // then applies the requested delta. That way clicking "up" on a
  // domain that has been rendering by implicit-append works as expected.
  const moveDomain = useCallback(
    async (host, direction) => {
      const key = String(host ?? '').trim().toLowerCase()
      if (!key) return
      const delta = Math.sign(direction ?? 0)
      if (delta === 0) return
      await setOrder((prev) => {
        const seeded = prev.includes(key) ? prev : [...prev, key]
        return moveFavoriteDomain(seeded, key, delta)
      })
    },
    [setOrder],
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
