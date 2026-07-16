import { useCallback, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useAuth } from '@/providers/AuthProvider'
import { useFabCorner } from '@/providers/FabCornerProvider'
import { useFavorites } from '@/providers/FavoritesProvider'
import { useFavoritesOrder } from '@/providers/FavoritesOrderProvider'
import { useFontSize } from '@/providers/FontSizeProvider'
import { usePinnedSites } from '@/providers/PinnedSitesProvider'
import { useTheme } from '@/providers/ThemeProvider'
import { useTrackedHostnames } from '@/providers/TrackedHostnamesProvider'
import { useVisitedUrls } from '@/providers/VisitedUrlsProvider'
import { fetchUserData, saveUserData } from '@/lib/userDataApi'
import { fetchUserVisits, saveDomainVisits } from '@/lib/visitedUrlsApi'
import {
  applyDomainOp,
  fetchUserFavorites,
} from '@/lib/favoritesApi'
import { opUnionPaths } from '@/lib/favoritesOps'
import { syncVisits } from '@/lib/visitsSync'
import { normalizeFavoritesByDomain } from '@/lib/favorites'
import {
  normalizeFavoritesOrder,
  stableFavoritesOrderKey,
} from '@/lib/favoritesOrder'
import {
  normalizePinnedSites,
  stablePinnedKey,
} from '@/lib/pinnedSites'
import { normalizeAemDomains, normalizeRemotePrefs } from '@/lib/prefs'
import {
  normalizeTrackedHostnames,
  stableHostsKey,
} from '@/lib/trackedHostnames'
import { asyncStorage } from '@/lib/storage'
import { isExtension } from '@/env'

// Set to '1' in chrome.storage.local after we've uploaded any pre-
// refactor local favorites into the per-domain rows. Guards the
// one-shot migration bridge in the favorites initial pull.
const FAV_MIGRATED_KEY = 'loopy.favorites.migrated'

// Wait this long after the last local change before firing a prefs push.
// Coalesces bursts (e.g. multiple font-size clicks) into one request.
const PUSH_DEBOUNCE_MS = 500

// Stable stringify for list-shaped fields so prefsEqual can compare
// them without a full deep-equal helper. Array entries are shallow
// objects with a fixed key set, so JSON order matches when the shape
// matches. The tracked-hostnames store is an object keyed by pattern,
// so key ordering matters — use the shared stable-key helper for it.
function listKey(list) {
  return JSON.stringify(list ?? [])
}

function prefsEqual(a, b) {
  if (!a || !b) return false
  return (
    a.theme === b.theme &&
    a.fontSize === b.fontSize &&
    a.fabCorner === b.fabCorner &&
    listKey(a.aemDomains) === listKey(b.aemDomains) &&
    stableHostsKey(a.trackedHostnames) === stableHostsKey(b.trackedHostnames) &&
    stablePinnedKey(a.pinnedSites) === stablePinnedKey(b.pinnedSites) &&
    stableFavoritesOrderKey(a.favoritesOrder) ===
      stableFavoritesOrderKey(b.favoritesOrder)
  )
}

// Two-way sync between the local providers and Supabase.
//
// Prefs stream (theme, fontSize, fabCorner, aemDomains, tracked, pinned,
//               favoritesOrder) -> user_data:
//   - Pull on sign-in via fetchUserData, apply via setters.
//   - Push debounced on any local change (this component owns writes).
//
// Favorites stream (user_favorites table):
//   - Writes are owned by FavoritesProvider now: every add/remove/edit
//     runs a per-op read-modify-CAS via applyDomainOp against the
//     matching (user_id, domain) row. There's no debounced push here
//     anymore.
//   - This component's only remaining responsibility for favorites is
//     the initial pull on sign-in, plus a one-shot migration bridge
//     that uploads any pre-refactor local favorites the first time we
//     see a signed-in user with local data. After the migration flag
//     is set, the pull is a straight absolute-replace since the
//     provider guarantees local == last-server-view.
//
// Visits stream (user_visits table):
//   - Writes to Supabase are owned by the service worker, which runs
//     syncVisits after every capture and on a periodic chrome.alarms
//     schedule (see background.js). This keeps sync alive when the
//     popup is closed.
//   - The popup only *triggers* an on-demand sync via a message to the
//     SW when it mounts (so users see the latest remote state right
//     after opening Loopy) and, as a web-build fallback, calls
//     syncVisits directly since the web build has no SW.
//   - Remote-driven updates land in chrome.storage.local via the SW;
//     VisitedUrlsProvider's storage.onChanged listener reflects them
//     into React state automatically.
//
// Guards:
//   applyingRemoteRef: set while applying pulled prefs so the push
//                      effect doesn't echo them right back.
//   lastSyncedRef:     the last prefs blob we know matches the cloud.
export function PrefsSync() {
  const { user, loading: authLoading } = useAuth()
  const { theme, setTheme, ready: themeReady } = useTheme()
  const { size: fontSize, setSize: setFontSize, ready: fontReady } = useFontSize()
  const { corner: fabCorner, setCorner: setFabCorner, ready: fabReady } =
    useFabCorner()
  const {
    domains: aemDomains,
    setDomains: setAemDomains,
    ready: domainsReady,
  } = useAemDomains()
  const {
    hosts: trackedHostnames,
    setHosts: setTrackedHostnames,
    ready: trackedReady,
  } = useTrackedHostnames()
  const {
    pinned: pinnedSites,
    setPinned: setPinnedSites,
    ready: pinnedReady,
  } = usePinnedSites()
  const { ready: visitsReady, byDomain: visitedByDomain } = useVisitedUrls()
  const {
    byDomain: favByDomain,
    setByDomain: setFavByDomain,
    ready: favReady,
  } = useFavorites()
  const {
    order: favoritesOrder,
    setOrder: setFavoritesOrder,
    ready: favoritesOrderReady,
  } = useFavoritesOrder()
  const queryClient = useQueryClient()

  const lastSyncedRef = useRef(null)
  const pushTimerRef = useRef(null)
  const applyingRemoteRef = useRef(false)
  const initialPulledForUserRef = useRef(null)
  const visitsSyncedForUserRef = useRef(null)

  // Favorites: only tracks whether the initial pull has run for the
  // current user id. There's no baseline or timer because writes are
  // owned by FavoritesProvider (per-op CAS) — this component just
  // pulls a fresh snapshot into local on sign-in.
  const favInitialPulledForUserRef = useRef(null)

  const userId = user?.id ?? null
  const providersReady =
    themeReady &&
    fontReady &&
    fabReady &&
    domainsReady &&
    trackedReady &&
    pinnedReady &&
    visitsReady &&
    favReady &&
    favoritesOrderReady

  // Debug helper: expose sync internals + a manual push trigger to the
  // popup window. Handy while iterating; safe to leave in prod builds
  // (no perf cost, and only useful when someone opens the console).
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.__loopy = {
      userId,
      authLoading,
      providersReady,
      visitedByDomain,
      favByDomain,
      favoritesOrder,
      async pushAll() {
        if (!userId) {
          console.error('[loopy] __loopy.pushAll: no userId (not signed in)')
          return
        }
        const domains = Object.keys(visitedByDomain)
        for (const domain of domains) {
          const bucket = visitedByDomain[domain]
          const paths =
            bucket?.paths &&
            typeof bucket.paths === 'object' &&
            !Array.isArray(bucket.paths)
              ? bucket.paths
              : {}
          try {
            await saveDomainVisits(userId, domain, paths)
            console.log(
              '[loopy] __loopy.pushAll: OK',
              domain,
              `(${Object.keys(paths).length} paths)`,
            )
          } catch (err) {
            console.error('[loopy] __loopy.pushAll: FAILED', domain, err)
          }
        }
      },
      async fetchRemote() {
        if (!userId) return null
        try {
          return await fetchUserVisits(userId)
        } catch (err) {
          console.error('[loopy] __loopy.fetchRemote: FAILED', err)
          return null
        }
      },
      async triggerSync() {
        return requestVisitsSync(userId)
      },
    }
  }, [
    userId,
    authLoading,
    providersReady,
    visitedByDomain,
    favByDomain,
    favoritesOrder,
  ])

  // Apply a fetched prefs row. Splits between the prefs blob (data column),
  // the domain list (aem_domains column), the tracked-hostnames list
  // (tracked_hostnames column), the pinned-sites list (pinned_sites
  // column), and the favorites-order list (favorites_order column) since
  // they normalize independently.
  const applyRemotePrefs = useCallback(
    (row) => {
      const safePrefs = normalizeRemotePrefs(row?.data)
      const safeDomains = normalizeAemDomains(row?.aemDomains)
      const safeTracked = normalizeTrackedHostnames(row?.trackedHostnames)
      const safePinned = normalizePinnedSites(row?.pinnedSites)
      const safeFavOrder = normalizeFavoritesOrder(row?.favoritesOrder)
      applyingRemoteRef.current = true
      if (safePrefs.theme !== theme) setTheme(safePrefs.theme)
      if (safePrefs.fontSize !== fontSize) setFontSize(safePrefs.fontSize)
      if (safePrefs.fabCorner !== fabCorner) setFabCorner(safePrefs.fabCorner)
      if (listKey(safeDomains) !== listKey(aemDomains)) {
        setAemDomains(safeDomains)
      }
      if (stableHostsKey(safeTracked) !== stableHostsKey(trackedHostnames)) {
        setTrackedHostnames(safeTracked)
      }
      if (stablePinnedKey(safePinned) !== stablePinnedKey(pinnedSites)) {
        setPinnedSites(safePinned)
      }
      if (
        stableFavoritesOrderKey(safeFavOrder) !==
        stableFavoritesOrderKey(favoritesOrder)
      ) {
        setFavoritesOrder(safeFavOrder)
      }
      lastSyncedRef.current = {
        ...safePrefs,
        aemDomains: safeDomains,
        trackedHostnames: safeTracked,
        pinnedSites: safePinned,
        favoritesOrder: safeFavOrder,
      }
      queueMicrotask(() => {
        applyingRemoteRef.current = false
      })
    },
    [
      theme,
      setTheme,
      fontSize,
      setFontSize,
      fabCorner,
      setFabCorner,
      aemDomains,
      setAemDomains,
      trackedHostnames,
      setTrackedHostnames,
      pinnedSites,
      setPinnedSites,
      favoritesOrder,
      setFavoritesOrder,
    ],
  )

  useEffect(() => {
    if (!userId) {
      lastSyncedRef.current = null
      initialPulledForUserRef.current = null
      visitsSyncedForUserRef.current = null
      favInitialPulledForUserRef.current = null
      if (pushTimerRef.current) {
        clearTimeout(pushTimerRef.current)
        pushTimerRef.current = null
      }
    }
  }, [userId])

  // Initial prefs pull on sign-in. Runs once per user id; retried on
  // next render if the fetch fails.
  useEffect(() => {
    if (authLoading || !userId || !providersReady) return
    if (initialPulledForUserRef.current === userId) return
    initialPulledForUserRef.current = userId

    let cancelled = false
    ;(async () => {
      try {
        const prefsRow = await queryClient.fetchQuery({
          queryKey: ['user_data', userId],
          queryFn: () => fetchUserData(userId),
        })
        if (cancelled) return
        if (prefsRow) {
          applyRemotePrefs(prefsRow)
        } else {
          // No cloud prefs row yet: adopt current local as the baseline
          // so the next local change is what creates the row.
          lastSyncedRef.current = {
            theme,
            fontSize,
            fabCorner,
            aemDomains,
            trackedHostnames,
            pinnedSites,
            favoritesOrder,
          }
        }
      } catch (err) {
        if (cancelled) return
        initialPulledForUserRef.current = null
        console.warn('[loopy] prefs auto-pull failed:', err?.message ?? err)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, userId, providersReady])

  // Trigger a visits sync when the popup opens (once per user). In the
  // extension, this messages the SW which owns writes; the SW pulls,
  // merges, and pushes, then any changes flow back into local via
  // chrome.storage.onChanged. In the web build (no SW), we call the
  // shared syncVisits helper directly.
  useEffect(() => {
    if (authLoading || !userId || !providersReady) return
    if (visitsSyncedForUserRef.current === userId) return
    visitsSyncedForUserRef.current = userId
    requestVisitsSync(userId).catch((err) => {
      console.warn('[loopy] visits initial sync failed:', err?.message ?? err)
    })
  }, [authLoading, userId, providersReady])

  // Initial favorites pull on sign-in. Two modes:
  //
  //   First run per install (migration bridge):
  //     If chrome.storage.local doesn't have the migration flag yet
  //     AND local has favorites the server may not know about,
  //     upload each local domain via applyDomainOp(opUnionPaths) so
  //     nothing gets lost when we then absolute-replace local from
  //     remote. This handles users who bookmarked things under the
  //     previous debounced-push implementation that may have failed
  //     to sync.
  //
  //   Steady state:
  //     Absolute-replace local from remote. FavoritesProvider owns
  //     writes per-op, so local should already reflect the last
  //     successful server view; the pull just picks up anything a
  //     different device added since we last opened the popup.
  //
  // Runs once per user id.
  useEffect(() => {
    if (authLoading || !userId || !providersReady) return
    if (favInitialPulledForUserRef.current === userId) return
    favInitialPulledForUserRef.current = userId

    let cancelled = false
    ;(async () => {
      try {
        // 1. One-shot migration: upload local buckets that the old
        //    debounced-push implementation may have failed to send.
        const migratedRaw = await asyncStorage.getItem(FAV_MIGRATED_KEY)
        if (cancelled) return
        if (migratedRaw !== '1') {
          const localBefore = favByDomain
          const domainsWithLocal = Object.entries(localBefore)
            .filter(([, bucket]) => {
              const paths = bucket?.paths
              return (
                paths &&
                typeof paths === 'object' &&
                !Array.isArray(paths) &&
                Object.keys(paths).length > 0
              )
            })
            .map(([host, bucket]) => [host, bucket.paths])

          for (const [host, paths] of domainsWithLocal) {
            if (cancelled) return
            try {
              await applyDomainOp(userId, host, opUnionPaths(paths))
            } catch (err) {
              console.warn(
                '[loopy] favorites migration upload failed for',
                host,
                err?.message ?? err,
              )
            }
          }
          await asyncStorage.setItem(FAV_MIGRATED_KEY, '1')
        }

        // 2. Absolute-replace local from remote. React-query cache is
        //    updated so any component reading the query sees the same
        //    view. The functional setter guards against a concurrent
        //    optimistic edit made mid-fetch by FavoritesProvider —
        //    same-key remote paths win (server is authoritative), but
        //    any client-only entries added during the round-trip are
        //    preserved so the provider's own CAS can pick them up on
        //    the next mutation.
        const remoteRaw = await queryClient.fetchQuery({
          queryKey: ['user_favorites', userId],
          queryFn: () => fetchUserFavorites(userId),
        })
        if (cancelled) return
        const remote = normalizeFavoritesByDomain(remoteRaw)
        await setFavByDomain((current) => {
          const next = { ...remote }
          for (const [host, bucket] of Object.entries(current)) {
            if (host in next) continue
            next[host] = bucket
          }
          return next
        })
        queryClient.setQueryData(['user_favorites', userId], remote)
      } catch (err) {
        if (cancelled) return
        favInitialPulledForUserRef.current = null
        console.warn('[loopy] favorites auto-pull failed:', err?.message ?? err)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, userId, providersReady])

  // Auto-push prefs stream (debounced).
  //
  // The `lastSyncedRef === null` gate is load-bearing: the initial pull
  // is async, so this effect can run before the pull settles. If we
  // scheduled a push while the ref is null, we'd upload the pre-pull
  // local values and clobber the remote row 500ms later.
  useEffect(() => {
    if (!userId) return
    if (!providersReady) return
    if (lastSyncedRef.current === null) return
    if (applyingRemoteRef.current) return

    const current = {
      theme,
      fontSize,
      fabCorner,
      aemDomains,
      trackedHostnames,
      pinnedSites,
      favoritesOrder,
    }
    if (prefsEqual(current, lastSyncedRef.current)) return

    if (pushTimerRef.current) clearTimeout(pushTimerRef.current)
    pushTimerRef.current = setTimeout(async () => {
      pushTimerRef.current = null
      try {
        const nextData = {
          theme: current.theme,
          fontSize: current.fontSize,
          fabCorner: current.fabCorner,
          updatedAt: new Date().toISOString(),
        }
        const row = await saveUserData(userId, {
          data: nextData,
          aemDomains: current.aemDomains,
          trackedHostnames: current.trackedHostnames,
          pinnedSites: current.pinnedSites,
          favoritesOrder: current.favoritesOrder,
        })
        lastSyncedRef.current = current
        queryClient.setQueryData(['user_data', userId], row)
      } catch (err) {
        console.warn('[loopy] prefs auto-push failed:', err?.message ?? err)
      }
    }, PUSH_DEBOUNCE_MS)

    return () => {
      if (pushTimerRef.current) {
        clearTimeout(pushTimerRef.current)
        pushTimerRef.current = null
      }
    }
  }, [
    theme,
    fontSize,
    fabCorner,
    aemDomains,
    trackedHostnames,
    pinnedSites,
    favoritesOrder,
    userId,
    providersReady,
    queryClient,
  ])

  return null
}

// Ask the SW to run a visits sync. Extension only; web build falls
// back to running syncVisits inline (the web build shares the same
// Supabase client so writes still succeed).
async function requestVisitsSync(userId) {
  if (!userId) return null
  if (isExtension() && chrome?.runtime?.sendMessage) {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'loopy:sync-visits',
      })
      console.log('[loopy] visits sync (via SW):', response)
      return response
    } catch (err) {
      console.warn('[loopy] SW sync message failed, falling back:', err?.message ?? err)
    }
  }
  const result = await syncVisits(userId)
  console.log('[loopy] visits sync (inline):', result)
  return result
}
