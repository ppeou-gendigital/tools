import { useCallback, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useAuth } from '@/providers/AuthProvider'
import { useFabCorner } from '@/providers/FabCornerProvider'
import { useFavorites } from '@/providers/FavoritesProvider'
import { useFontSize } from '@/providers/FontSizeProvider'
import { usePinnedSites } from '@/providers/PinnedSitesProvider'
import { useTheme } from '@/providers/ThemeProvider'
import { useTrackedHostnames } from '@/providers/TrackedHostnamesProvider'
import { useVisitedUrls } from '@/providers/VisitedUrlsProvider'
import { fetchUserData, saveUserData } from '@/lib/userDataApi'
import { fetchUserVisits, saveDomainVisits } from '@/lib/visitedUrlsApi'
import {
  deleteDomainFavorites,
  fetchUserFavorites,
  upsertDomainFavoritesWithMerge,
} from '@/lib/favoritesApi'
import { syncVisits } from '@/lib/visitsSync'
import {
  diffFavoritesByDomain,
  mergeFavoritesByDomain,
  normalizeFavoritesByDomain,
  stableFavoritesKey,
} from '@/lib/favorites'
import {
  normalizePinnedSites,
  stablePinnedKey,
} from '@/lib/pinnedSites'
import { normalizeAemDomains, normalizeRemotePrefs } from '@/lib/prefs'
import {
  normalizeTrackedHostnames,
  stableHostsKey,
} from '@/lib/trackedHostnames'
import { isExtension } from '@/env'

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
    stablePinnedKey(a.pinnedSites) === stablePinnedKey(b.pinnedSites)
  )
}

// Two-way sync between the local providers and Supabase.
//
// Prefs stream (theme, fontSize, fabCorner, aemDomains) -> user_data:
//   - Pull on sign-in via fetchUserData, apply via setters.
//   - Push debounced on any local change (this component owns writes).
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
  const queryClient = useQueryClient()

  const lastSyncedRef = useRef(null)
  const pushTimerRef = useRef(null)
  const applyingRemoteRef = useRef(false)
  const initialPulledForUserRef = useRef(null)
  const visitsSyncedForUserRef = useRef(null)

  // Favorites sync is owned by the popup (no SW involvement) since it's
  // low-volume and user-triggered. Baseline = last-known-in-sync snapshot;
  // dirty domains diff against it just like prefs.
  const favBaselineRef = useRef(null)
  const favPushTimerRef = useRef(null)
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
    favReady

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
  }, [userId, authLoading, providersReady, visitedByDomain])

  // Apply a fetched prefs row. Splits between the prefs blob (data column),
  // the domain list (aem_domains column), the tracked-hostnames list
  // (tracked_hostnames column), and the pinned-sites list (pinned_sites
  // column) since they normalize independently.
  const applyRemotePrefs = useCallback(
    (row) => {
      const safePrefs = normalizeRemotePrefs(row?.data)
      const safeDomains = normalizeAemDomains(row?.aemDomains)
      const safeTracked = normalizeTrackedHostnames(row?.trackedHostnames)
      const safePinned = normalizePinnedSites(row?.pinnedSites)
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
      lastSyncedRef.current = {
        ...safePrefs,
        aemDomains: safeDomains,
        trackedHostnames: safeTracked,
        pinnedSites: safePinned,
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
    ],
  )

  useEffect(() => {
    if (!userId) {
      lastSyncedRef.current = null
      initialPulledForUserRef.current = null
      visitsSyncedForUserRef.current = null
      favBaselineRef.current = null
      favInitialPulledForUserRef.current = null
      if (pushTimerRef.current) {
        clearTimeout(pushTimerRef.current)
        pushTimerRef.current = null
      }
      if (favPushTimerRef.current) {
        clearTimeout(favPushTimerRef.current)
        favPushTimerRef.current = null
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

  // Initial favorites pull on sign-in. Union-merges the remote snapshot
  // into local storage so bookmarks taken pre-sign-in survive the pull.
  // Then seeds the baseline ref so the push effect knows what "clean"
  // means. Runs once per user id.
  useEffect(() => {
    if (authLoading || !userId || !providersReady) return
    if (favInitialPulledForUserRef.current === userId) return
    favInitialPulledForUserRef.current = userId

    let cancelled = false
    ;(async () => {
      try {
        const remoteRaw = await queryClient.fetchQuery({
          queryKey: ['user_favorites', userId],
          queryFn: () => fetchUserFavorites(userId),
        })
        if (cancelled) return
        const remote = normalizeFavoritesByDomain(remoteRaw)
        const merged = mergeFavoritesByDomain(favByDomain, remote)
        // Only push a new snapshot into the provider if the merge changed
        // anything — avoids a redundant chrome.storage.local write and
        // the storage.onChanged echo it would trigger.
        if (stableFavoritesKey(merged) !== stableFavoritesKey(favByDomain)) {
          await setFavByDomain(merged)
        }
        favBaselineRef.current = merged
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

  // Auto-push favorites stream (debounced, per-dirty-domain CAS).
  //
  // Symmetric to the prefs push effect: `favBaselineRef.current === null`
  // gate keeps us from clobbering the remote before the initial pull
  // settles. Each dirty domain gets its own upsertDomainFavoritesWithMerge
  // call so two devices bookmarking different URLs on the same domain
  // converge without lost updates. Removed domains are deleted last.
  useEffect(() => {
    if (!userId) return
    if (!providersReady) return
    if (favBaselineRef.current === null) return

    const baseline = favBaselineRef.current
    if (stableFavoritesKey(favByDomain) === stableFavoritesKey(baseline)) {
      return
    }

    if (favPushTimerRef.current) clearTimeout(favPushTimerRef.current)
    favPushTimerRef.current = setTimeout(async () => {
      favPushTimerRef.current = null
      const { upserts, deletes } = diffFavoritesByDomain(favByDomain, baseline)
      // Build the next byDomain snapshot from the current local (not
      // baseline) so remote-only entries that arrive via CAS can be
      // reflected into the popup without also throwing away any local
      // domains that didn't need to be pushed.
      const nextByDomain = { ...favByDomain }
      try {
        for (const domain of upserts) {
          const bucket = favByDomain[domain]
          const paths =
            bucket?.paths &&
            typeof bucket.paths === 'object' &&
            !Array.isArray(bucket.paths)
              ? bucket.paths
              : {}
          const result = await upsertDomainFavoritesWithMerge(
            userId,
            domain,
            paths,
          )
          nextByDomain[domain] = {
            paths: result.paths,
            updatedAt: result.updatedAt,
          }
        }
        for (const domain of deletes) {
          await deleteDomainFavorites(userId, domain)
          delete nextByDomain[domain]
        }
        // Normalize once and use the same snapshot for both the local
        // write and the baseline so the next tick's stable-key compare
        // is a wash (avoids a re-push loop when CAS merges pulled in
        // remote-only paths).
        const normalizedNext = normalizeFavoritesByDomain(nextByDomain)
        favBaselineRef.current = normalizedNext
        if (
          stableFavoritesKey(normalizedNext) !== stableFavoritesKey(favByDomain)
        ) {
          await setFavByDomain(normalizedNext)
        }
        queryClient.setQueryData(['user_favorites', userId], normalizedNext)
      } catch (err) {
        console.warn('[loopy] favorites auto-push failed:', err?.message ?? err)
      }
    }, PUSH_DEBOUNCE_MS)

    return () => {
      if (favPushTimerRef.current) {
        clearTimeout(favPushTimerRef.current)
        favPushTimerRef.current = null
      }
    }
  }, [favByDomain, userId, providersReady, queryClient, setFavByDomain])

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
