import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { asyncStorage } from '@/lib/storage'
import { normalizeFavoritesByDomain } from '@/lib/favorites'
import {
  applySyncOp,
  deleteSyncAll,
  enqueueSyncOp,
  opAddPath,
  opClearDomainPaths,
  opRemovePath,
  opRenameWithinDomain,
  opSetTitle,
} from '@/lib/supabaseSync'
import { useAuth } from '@/providers/AuthProvider'
import { isExtension } from '@/env'

const FavoritesContext = createContext(null)

const STORAGE_KEY = 'loopy.favorites'

// Persisted map of user-bookmarked URLs, grouped by hostname:
//   { [hostname]: { paths: { [path]: FavValue }, updatedAt: '<iso>' } }
//
// Sync topology (see also README section 6):
//   Every mutation (add / remove / edit / clearDomain / clearAll) is
//   applied against LOCAL first for instant UI (optimistic), and in
//   the same call kicks off a per-domain CAS against
//   public.user_favorites. The CAS reads the latest remote row,
//   applies a pure operator, and writes back with a version guard on
//   updated_at. On success we reconcile the local bucket with the
//   authoritative server view. On failure we revert local to the
//   pre-op snapshot so the UI doesn't lie about durability.
//
// Concurrency: a per-domain in-flight promise map serializes ops on
// the same domain so rapid-fire clicks never race their own CAS
// retries.
//
// Signed-out / offline: `canModify` is false when there's no userId,
// which the FavStar and FavLinks page use to disable mutation UI. We
// don't attempt local-only writes because the app is online-only for
// this feature (per plan).
export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [byDomain, setByDomainState] = useState({})
  const [ready, setReady] = useState(false)

  // Ref shadow of byDomain so callback closures can read the freshest
  // value without becoming stale between renders. React batches
  // updates, and we need to snapshot "before" state at the moment the
  // op is invoked (for potential revert on remote failure).
  const byDomainRef = useRef(byDomain)
  useEffect(() => {
    byDomainRef.current = byDomain
  }, [byDomain])

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
  // Accepts either a value or a functional updater so callers running
  // during a network round-trip can merge against the latest state
  // without clobbering concurrent optimistic edits.
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

  const enqueueDomainOp = useCallback(
    (domain, fn) =>
      enqueueSyncOp({ stream: 'favorites', key: domain, fn }),
    [],
  )

  // Apply a local mutation (via updater fn) synchronously and persist.
  // Returns the resolved bucket for the touched hostname (or null if
  // the updater didn't change anything).
  const applyLocalMutation = useCallback(
    async (updater) => {
      let resolvedByDomain = null
      setByDomainState((prev) => {
        const next = updater(prev)
        if (next === prev) {
          resolvedByDomain = prev
          return prev
        }
        resolvedByDomain = next
        return next
      })
      if (resolvedByDomain) await persist(resolvedByDomain)
      return resolvedByDomain
    },
    [persist],
  )

  // Reconcile a single domain's local bucket with the authoritative
  // { paths, updatedAt } returned by applyDomainOp. If the server row
  // was deleted (empty paths), drop the bucket locally.
  const reconcileDomain = useCallback(
    async (hostname, result) => {
      await applyLocalMutation((prev) => {
        const next = { ...prev }
        if (!result || !result.paths || Object.keys(result.paths).length === 0) {
          if (!(hostname in next)) return prev
          delete next[hostname]
          return next
        }
        next[hostname] = {
          paths: result.paths,
          updatedAt: result.updatedAt ?? new Date().toISOString(),
        }
        return next
      })
    },
    [applyLocalMutation],
  )

  // Revert a domain's local bucket back to a pre-op snapshot. Used
  // when the CAS ultimately fails so the UI reflects durable state.
  const revertDomain = useCallback(
    async (hostname, before) => {
      await applyLocalMutation((prev) => {
        const next = { ...prev }
        if (before) {
          next[hostname] = before
        } else {
          delete next[hostname]
        }
        return next
      })
    },
    [applyLocalMutation],
  )

  // -- Mutations ---------------------------------------------------------

  const addFavorite = useCallback(
    async ({ hostname, path, title, addedAt } = {}) => {
      const host = String(hostname ?? '').trim().toLowerCase()
      const p = String(path ?? '').trim()
      if (!host || !p) return { error: 'invalid-args' }
      if (!userId) return { error: 'signed-out' }

      const beforeBucket = byDomainRef.current[host]
        ? {
            paths: { ...byDomainRef.current[host].paths },
            updatedAt: byDomainRef.current[host].updatedAt,
          }
        : null
      const stamp = addedAt || new Date().toISOString()
      const titleStr = String(title ?? '').trim()

      // Optimistic local mutation. Mirrors opAddPath so the visible
      // state agrees with what the CAS will produce.
      await applyLocalMutation((prev) => {
        const bucket = prev[host]
        const prevPaths =
          bucket?.paths && typeof bucket.paths === 'object' && !Array.isArray(bucket.paths)
            ? bucket.paths
            : {}
        const existing = prevPaths[p]
        const nextEntry = existing
          ? { ...existing, title: titleStr || existing.title || '' }
          : { title: titleStr, addedAt: stamp }
        const nextPaths = { ...prevPaths, [p]: nextEntry }
        return {
          ...prev,
          [host]: { paths: nextPaths, updatedAt: stamp },
        }
      })

      return enqueueDomainOp(host, async () => {
        try {
          const result = await applySyncOp({
            stream: 'favorites',
            userId,
            key: host,
            op: opAddPath(p, { title: titleStr, addedAt: stamp }),
          })
          await reconcileDomain(host, result)
          return { ok: true }
        } catch (err) {
          console.warn('[loopy] addFavorite CAS failed:', err?.message ?? err)
          await revertDomain(host, beforeBucket)
          return { error: err }
        }
      })
    },
    [userId, applyLocalMutation, enqueueDomainOp, reconcileDomain, revertDomain],
  )

  const removeFavorite = useCallback(
    async (hostname, path) => {
      const host = String(hostname ?? '').trim().toLowerCase()
      const p = String(path ?? '').trim()
      if (!host || !p) return { error: 'invalid-args' }
      if (!userId) return { error: 'signed-out' }

      const beforeBucket = byDomainRef.current[host]
        ? {
            paths: { ...byDomainRef.current[host].paths },
            updatedAt: byDomainRef.current[host].updatedAt,
          }
        : null

      await applyLocalMutation((prev) => {
        const bucket = prev[host]
        const prevPaths =
          bucket?.paths && typeof bucket.paths === 'object' && !Array.isArray(bucket.paths)
            ? bucket.paths
            : null
        if (!prevPaths || !(p in prevPaths)) return prev
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
        return next
      })

      return enqueueDomainOp(host, async () => {
        try {
          const result = await applySyncOp({
            stream: 'favorites',
            userId,
            key: host,
            op: opRemovePath(p),
          })
          await reconcileDomain(host, result)
          return { ok: true }
        } catch (err) {
          console.warn('[loopy] removeFavorite CAS failed:', err?.message ?? err)
          await revertDomain(host, beforeBucket)
          return { error: err }
        }
      })
    },
    [userId, applyLocalMutation, enqueueDomainOp, reconcileDomain, revertDomain],
  )

  const clearDomain = useCallback(
    async (hostname) => {
      const host = String(hostname ?? '').trim().toLowerCase()
      if (!host) return { error: 'invalid-args' }
      if (!userId) return { error: 'signed-out' }

      const beforeBucket = byDomainRef.current[host]
        ? {
            paths: { ...byDomainRef.current[host].paths },
            updatedAt: byDomainRef.current[host].updatedAt,
          }
        : null

      await applyLocalMutation((prev) => {
        if (!(host in prev)) return prev
        const next = { ...prev }
        delete next[host]
        return next
      })

      return enqueueDomainOp(host, async () => {
        try {
          await applySyncOp({
            stream: 'favorites',
            userId,
            key: host,
            op: opClearDomainPaths(),
          })
          return { ok: true }
        } catch (err) {
          console.warn('[loopy] clearDomain failed:', err?.message ?? err)
          await revertDomain(host, beforeBucket)
          return { error: err }
        }
      })
    },
    [userId, applyLocalMutation, enqueueDomainOp, revertDomain],
  )

  const clearAll = useCallback(async () => {
    if (!userId) return { error: 'signed-out' }
    // Snapshot everything for a possible revert. Cheap: bounded by
    // ~200 keys per domain * a modest number of domains.
    const snapshot = {}
    for (const [host, bucket] of Object.entries(byDomainRef.current)) {
      snapshot[host] = {
        paths: { ...bucket.paths },
        updatedAt: bucket.updatedAt,
      }
    }

    await applyLocalMutation(() => ({}))

    try {
      await deleteSyncAll({ stream: 'favorites', userId })
      return { ok: true }
    } catch (err) {
      console.warn('[loopy] clearAll failed:', err?.message ?? err)
      await applyLocalMutation(() => snapshot)
      return { error: err }
    }
  }, [userId, applyLocalMutation])

  // Edit an existing favorite. Handles three cases without leaving the
  // local store in a torn state:
  //   1. Title-only edit                  -> opSetTitle on the same domain.
  //   2. Path change within the same host -> opRenameWithinDomain.
  //   3. Hostname change (cross-domain)   -> add on newHost THEN remove
  //      from oldHost. Add first so a mid-op failure leaves the entry
  //      in the destination rather than losing it.
  //
  // `next = { hostname, path, title }`. All fields required.
  const updateFavorite = useCallback(
    async (oldHostname, oldPath, next) => {
      const oldHost = String(oldHostname ?? '').trim().toLowerCase()
      const oldP = String(oldPath ?? '').trim()
      if (!oldHost || !oldP) return { error: 'invalid-args' }
      const newHost = String(next?.hostname ?? '').trim().toLowerCase()
      const newP = String(next?.path ?? '').trim()
      if (!newHost || !newP) return { error: 'invalid-args' }
      if (!userId) return { error: 'signed-out' }
      const newTitle = String(next?.title ?? '').trim()

      const currentBucket = byDomainRef.current[oldHost]
      const oldEntry = currentBucket?.paths?.[oldP]
      if (!oldEntry) return { error: 'missing' }
      const preservedAddedAt = oldEntry.addedAt ?? new Date().toISOString()

      // ---- Case 1: title-only edit --------------------------------------
      if (oldHost === newHost && oldP === newP) {
        if ((oldEntry.title ?? '') === newTitle) return { ok: true }
        const beforeBucket = {
          paths: { ...currentBucket.paths },
          updatedAt: currentBucket.updatedAt,
        }
        await applyLocalMutation((prev) => {
          const bucket = prev[oldHost]
          if (!bucket?.paths?.[oldP]) return prev
          const nextPaths = {
            ...bucket.paths,
            [oldP]: { ...bucket.paths[oldP], title: newTitle },
          }
          return {
            ...prev,
            [oldHost]: {
              paths: nextPaths,
              updatedAt: new Date().toISOString(),
            },
          }
        })
        return enqueueDomainOp(oldHost, async () => {
          try {
            const result = await applySyncOp({
              stream: 'favorites',
              userId,
              key: oldHost,
              op: opSetTitle(oldP, newTitle),
            })
            await reconcileDomain(oldHost, result)
            return { ok: true }
          } catch (err) {
            console.warn('[loopy] updateFavorite (title) CAS failed:', err?.message ?? err)
            await revertDomain(oldHost, beforeBucket)
            return { error: err }
          }
        })
      }

      // ---- Case 2: same-domain rename -----------------------------------
      if (oldHost === newHost) {
        const beforeBucket = {
          paths: { ...currentBucket.paths },
          updatedAt: currentBucket.updatedAt,
        }
        await applyLocalMutation((prev) => {
          const bucket = prev[oldHost]
          if (!bucket?.paths?.[oldP]) return prev
          const nextPaths = { ...bucket.paths }
          delete nextPaths[oldP]
          const collision = nextPaths[newP]
          const mergedAddedAt =
            collision?.addedAt && collision.addedAt <= preservedAddedAt
              ? collision.addedAt
              : preservedAddedAt
          nextPaths[newP] = { title: newTitle, addedAt: mergedAddedAt }
          return {
            ...prev,
            [oldHost]: {
              paths: nextPaths,
              updatedAt: new Date().toISOString(),
            },
          }
        })
        return enqueueDomainOp(oldHost, async () => {
          try {
            const result = await applySyncOp({
              stream: 'favorites',
              userId,
              key: oldHost,
              op: opRenameWithinDomain(oldP, newP, newTitle),
            })
            await reconcileDomain(oldHost, result)
            return { ok: true }
          } catch (err) {
            console.warn('[loopy] updateFavorite (rename) CAS failed:', err?.message ?? err)
            await revertDomain(oldHost, beforeBucket)
            return { error: err }
          }
        })
      }

      // ---- Case 3: cross-domain rename ----------------------------------
      // Add-then-remove so a mid-op interruption favors the destination.
      const oldBefore = {
        paths: { ...currentBucket.paths },
        updatedAt: currentBucket.updatedAt,
      }
      const newBucketBefore = byDomainRef.current[newHost]
        ? {
            paths: { ...byDomainRef.current[newHost].paths },
            updatedAt: byDomainRef.current[newHost].updatedAt,
          }
        : null

      await applyLocalMutation((prev) => {
        const nextByDomain = { ...prev }

        const srcBucket = nextByDomain[oldHost]
        if (srcBucket?.paths?.[oldP]) {
          const remaining = { ...srcBucket.paths }
          delete remaining[oldP]
          if (Object.keys(remaining).length === 0) {
            delete nextByDomain[oldHost]
          } else {
            nextByDomain[oldHost] = {
              paths: remaining,
              updatedAt: new Date().toISOString(),
            }
          }
        }

        const targetBucket = nextByDomain[newHost] ?? {
          paths: {},
          updatedAt: new Date().toISOString(),
        }
        const collision = targetBucket.paths?.[newP]
        const mergedAddedAt =
          collision?.addedAt && collision.addedAt <= preservedAddedAt
            ? collision.addedAt
            : preservedAddedAt
        const targetPaths = {
          ...targetBucket.paths,
          [newP]: { title: newTitle, addedAt: mergedAddedAt },
        }
        nextByDomain[newHost] = {
          paths: targetPaths,
          updatedAt: new Date().toISOString(),
        }

        return nextByDomain
      })

      // Add on the new domain first. If this fails we still need to
      // revert BOTH sides of the local edit.
      const addPromise = enqueueDomainOp(newHost, async () => {
        return applySyncOp({
          stream: 'favorites',
          userId,
          key: newHost,
          op: opAddPath(newP, { title: newTitle, addedAt: preservedAddedAt }),
        })
      })

      let addResult
      try {
        addResult = await addPromise
      } catch (err) {
        console.warn('[loopy] updateFavorite (cross-add) CAS failed:', err?.message ?? err)
        await revertDomain(oldHost, oldBefore)
        await revertDomain(newHost, newBucketBefore)
        return { error: err }
      }
      await reconcileDomain(newHost, addResult)

      // Then remove from the old domain. If this fails, the entry
      // exists in both places; leave it that way (user can clean up)
      // rather than lose data.
      const removePromise = enqueueDomainOp(oldHost, async () => {
        return applySyncOp({
          stream: 'favorites',
          userId,
          key: oldHost,
          op: opRemovePath(oldP),
        })
      })
      try {
        const removeResult = await removePromise
        await reconcileDomain(oldHost, removeResult)
      } catch (err) {
        console.warn('[loopy] updateFavorite (cross-remove) CAS failed:', err?.message ?? err)
        return { error: err }
      }
      return { ok: true }
    },
    [userId, applyLocalMutation, enqueueDomainOp, reconcileDomain, revertDomain],
  )

  // Selector used by the star toggle button. Cheap: O(1) map lookup +
  // key check. Callers pass the reconstructed hostname + path+search
  // so the provider doesn't need URL parsing.
  const isFavorited = useCallback(
    (hostname, path) => {
      const host = String(hostname ?? '').trim().toLowerCase()
      const p = String(path ?? '').trim()
      if (!host || !p) return false
      const bucket = byDomain[host]
      if (!bucket?.paths || typeof bucket.paths !== 'object') return false
      return p in bucket.paths
    },
    [byDomain],
  )

  const canModify = Boolean(userId)

  const value = useMemo(
    () => ({
      byDomain,
      setByDomain,
      addFavorite,
      removeFavorite,
      updateFavorite,
      clearDomain,
      clearAll,
      isFavorited,
      ready,
      canModify,
    }),
    [
      byDomain,
      setByDomain,
      addFavorite,
      removeFavorite,
      updateFavorite,
      clearDomain,
      clearAll,
      isFavorited,
      ready,
      canModify,
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
