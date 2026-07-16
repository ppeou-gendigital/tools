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
import { isExtension } from '@/env'

const PinnedSitesContext = createContext(null)

const STORAGE_KEY = 'loopy.sitetreePinned'

// Persisted sorted array of hostnames the user has explicitly pinned to
// the Site Tree page's deck. Pins are UI-only curation: they don't affect
// capture (that's the tracked-hostnames list) — they just decide which
// per-site tree slides show up on the Site Tree page.
//
// Round-trips through the shared normalizer on every read/write so
// PrefsSync, the SiteTree page, and any future consumer agree on a
// deterministic (sorted, deduped, lowercased) shape. The provider mirrors
// the TrackedHostnamesProvider pattern one-for-one so callers can be
// wired identically in PrefsSync.
export function PinnedSitesProvider({ children }) {
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

  // Extension surface: reflect writes from other popup instances (or from
  // PrefsSync in another window) into React state so a fresh pin shows up
  // live without a reopen.
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

  // Absolute-set. Used by PrefsSync when applying a remote pull, and
  // internally by toggle/setPinned below.
  const setPinned = useCallback(async (next) => {
    let resolved
    setPinnedState((prev) => {
      const raw = typeof next === 'function' ? next(prev) : next
      resolved = normalizePinnedSites(raw)
      return resolved
    })
    await asyncStorage.setItem(STORAGE_KEY, JSON.stringify(resolved ?? []))
  }, [])

  // Add-or-remove. New pins land at the end of the array so the user's
  // most recent pin action sits at the bottom of the Site Tree deck
  // (feels less disruptive than reshuffling the whole list). Removing
  // preserves the relative order of the survivors.
  const toggle = useCallback(
    async (host) => {
      const key = String(host ?? '').trim().toLowerCase()
      if (!key) return
      await setPinned((prev) => {
        const idx = prev.indexOf(key)
        if (idx === -1) return [...prev, key]
        return prev.filter((h) => h !== key)
      })
    },
    [setPinned],
  )

  // Move a hostname up (-1) or down (+1) in the pinned order. No-op if
  // the host isn't pinned or is already at the corresponding edge.
  // Delegates to the pure movePinned helper so behavior is testable
  // outside React.
  const movePinned = useCallback(
    async (host, direction) => {
      await setPinned((prev) => movePinnedInList(prev, host, direction))
    },
    [setPinned],
  )

  // Expose the Set view too — callers reach for `.has(host)` more often
  // than they iterate, and computing it once per state change avoids a
  // Set construction in every consumer's render.
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
