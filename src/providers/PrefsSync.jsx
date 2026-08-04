import { useEffect, useRef } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useFabCorner } from '@/providers/FabCornerProvider'
import { useFavorites } from '@/providers/FavoritesProvider'
import { useFavoritesOrder } from '@/providers/FavoritesOrderProvider'
import { useFontSize } from '@/providers/FontSizeProvider'
import { useEdsUeSites } from '@/providers/EdsUeSitesProvider'
import { usePinnedSites } from '@/providers/PinnedSitesProvider'
import { useTheme } from '@/providers/ThemeProvider'
import { useTrackedHostnames } from '@/providers/TrackedHostnamesProvider'
import { useVisitedUrls } from '@/providers/VisitedUrlsProvider'
import {
  applySyncOp,
  opUnionPaths,
  pullSync,
} from '@/lib/supabaseSync'
import { mergeFavoritesByDomain } from '@/lib/favorites'
import { syncVisits } from '@/lib/visitsSync'
import { asyncStorage } from '@/lib/storage'
import { isExtension } from '@/env'
import {
  normalizeFavoritesOrder,
  stableFavoritesOrderKey,
} from '@/lib/favoritesOrder'
import {
  normalizePinnedSites,
  stablePinnedKey,
} from '@/lib/pinnedSites'
import {
  normalizeTrackedHostnames,
  stableHostsKey,
} from '@/lib/trackedHostnames'
import { normalizeAemDomains } from '@/lib/prefs'

// Set to '1' after we've uploaded any pre-refactor local favorites.
const FAV_MIGRATED_KEY = 'loopy.favorites.migrated'

// PrefsSync is pull-only. Mutations go through supabaseSync from each
// provider (Fav Links recipe). This component:
//   1. pullSync prefs / favorites on sign-in (dirty-field skip for prefs)
//   2. one-shot favorites migration bridge
//   3. triggers visits sync on popup open
export function PrefsSync() {
  const { user, loading: authLoading } = useAuth()
  const { theme, setTheme, ready: themeReady } = useTheme()
  const { size: fontSize, setSize: setFontSize, ready: fontReady } =
    useFontSize()
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
  const { ready: visitsReady } = useVisitedUrls()
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
  const {
    ready: aemAuthorSitesReady,
    pullRemote: pullAemAuthorSitesRemote,
  } = useEdsUeSites()

  const initialPulledForUserRef = useRef(null)
  const visitsSyncedForUserRef = useRef(null)
  const favInitialPulledForUserRef = useRef(null)
  const aemAuthorSitesPulledForUserRef = useRef(null)

  // Live refs so pull can detect dirty fields after the fetch starts.
  const prefsRef = useRef(null)
  useEffect(() => {
    prefsRef.current = {
      theme,
      fontSize,
      fabCorner,
      aemDomains,
      trackedHostnames,
      pinnedSites,
      favoritesOrder,
    }
  }, [
    theme,
    fontSize,
    fabCorner,
    aemDomains,
    trackedHostnames,
    pinnedSites,
    favoritesOrder,
  ])

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
    favoritesOrderReady &&
    aemAuthorSitesReady

  useEffect(() => {
    if (!userId) {
      initialPulledForUserRef.current = null
      visitsSyncedForUserRef.current = null
      favInitialPulledForUserRef.current = null
      aemAuthorSitesPulledForUserRef.current = null
    }
  }, [userId])

  // Initial prefs pull — force network, skip fields dirtied mid-fetch.
  useEffect(() => {
    if (authLoading || !userId || !providersReady) return
    if (initialPulledForUserRef.current === userId) return
    initialPulledForUserRef.current = userId

    const snapshot = { ...prefsRef.current }
    let cancelled = false
    ;(async () => {
      try {
        // Force-network fetch of the remote row (no local merge yet).
        const remote = await pullSync({ stream: 'prefs', userId })
        if (cancelled) return
        if (!remote) return

        // Fields the user changed while the fetch was in flight stay local;
        // providers already CAS those via applySyncOp.
        const dirtyKeys = new Set()
        const live = prefsRef.current
        if (live.theme !== snapshot.theme) dirtyKeys.add('theme')
        if (live.fontSize !== snapshot.fontSize) dirtyKeys.add('fontSize')
        if (live.fabCorner !== snapshot.fabCorner) dirtyKeys.add('fabCorner')
        if (
          JSON.stringify(normalizeAemDomains(live.aemDomains)) !==
          JSON.stringify(normalizeAemDomains(snapshot.aemDomains))
        ) {
          dirtyKeys.add('aemDomains')
        }
        if (
          stableHostsKey(normalizeTrackedHostnames(live.trackedHostnames)) !==
          stableHostsKey(normalizeTrackedHostnames(snapshot.trackedHostnames))
        ) {
          dirtyKeys.add('trackedHostnames')
        }
        if (
          stablePinnedKey(normalizePinnedSites(live.pinnedSites)) !==
          stablePinnedKey(normalizePinnedSites(snapshot.pinnedSites))
        ) {
          dirtyKeys.add('pinnedSites')
        }
        if (
          stableFavoritesOrderKey(normalizeFavoritesOrder(live.favoritesOrder)) !==
          stableFavoritesOrderKey(
            normalizeFavoritesOrder(snapshot.favoritesOrder),
          )
        ) {
          dirtyKeys.add('favoritesOrder')
        }

        if (!dirtyKeys.has('theme') && remote.data.theme !== live.theme) {
          await setTheme(remote.data.theme, { fromRemote: true })
        }
        if (
          !dirtyKeys.has('fontSize') &&
          remote.data.fontSize !== live.fontSize
        ) {
          setFontSize(remote.data.fontSize, { fromRemote: true })
        }
        if (
          !dirtyKeys.has('fabCorner') &&
          remote.data.fabCorner !== live.fabCorner
        ) {
          await setFabCorner(remote.data.fabCorner, { fromRemote: true })
        }
        if (
          !dirtyKeys.has('aemDomains') &&
          JSON.stringify(remote.aemDomains) !==
            JSON.stringify(normalizeAemDomains(live.aemDomains))
        ) {
          await setAemDomains(remote.aemDomains, { fromRemote: true })
        }
        if (
          !dirtyKeys.has('trackedHostnames') &&
          stableHostsKey(remote.trackedHostnames) !==
            stableHostsKey(normalizeTrackedHostnames(live.trackedHostnames))
        ) {
          await setTrackedHostnames(remote.trackedHostnames, {
            fromRemote: true,
          })
        }
        if (
          !dirtyKeys.has('pinnedSites') &&
          stablePinnedKey(remote.pinnedSites) !==
            stablePinnedKey(normalizePinnedSites(live.pinnedSites))
        ) {
          await setPinnedSites(remote.pinnedSites, { fromRemote: true })
        }
        if (
          !dirtyKeys.has('favoritesOrder') &&
          stableFavoritesOrderKey(remote.favoritesOrder) !==
            stableFavoritesOrderKey(
              normalizeFavoritesOrder(live.favoritesOrder),
            )
        ) {
          await setFavoritesOrder(remote.favoritesOrder, { fromRemote: true })
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

  // Visits sync on popup open.
  useEffect(() => {
    if (authLoading || !userId || !providersReady) return
    if (visitsSyncedForUserRef.current === userId) return
    visitsSyncedForUserRef.current = userId
    requestVisitsSync(userId).catch((err) => {
      console.warn('[loopy] visits initial sync failed:', err?.message ?? err)
    })
  }, [authLoading, userId, providersReady])

  // AEM Author sites catalogs (EDS-UE) pull on sign-in.
  useEffect(() => {
    if (authLoading || !userId || !providersReady) return
    if (aemAuthorSitesPulledForUserRef.current === userId) return
    aemAuthorSitesPulledForUserRef.current = userId
    pullAemAuthorSitesRemote().catch((err) => {
      console.warn(
        '[loopy] aemAuthorSites initial pull failed:',
        err?.message ?? err,
      )
      aemAuthorSitesPulledForUserRef.current = null
    })
  }, [authLoading, userId, providersReady, pullAemAuthorSitesRemote])

  // Favorites pull (+ one-shot migration).
  useEffect(() => {
    if (authLoading || !userId || !providersReady) return
    if (favInitialPulledForUserRef.current === userId) return
    favInitialPulledForUserRef.current = userId

    let cancelled = false
    ;(async () => {
      try {
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

          let allOk = true
          for (const [host, paths] of domainsWithLocal) {
            if (cancelled) return
            try {
              await applySyncOp({
                stream: 'favorites',
                userId,
                key: host,
                op: opUnionPaths(paths),
              })
            } catch (err) {
              allOk = false
              console.warn(
                '[loopy] favorites migration upload failed for',
                host,
                err?.message ?? err,
              )
            }
          }
          if (allOk) {
            await asyncStorage.setItem(FAV_MIGRATED_KEY, '1')
          }
        }

        // Pull remote, then merge against the *latest* local map so an
        // optimistic star during the fetch is not discarded.
        const remote = await pullSync({
          stream: 'favorites',
          userId,
          local: {},
        })
        if (cancelled) return
        await setFavByDomain((current) =>
          mergeFavoritesByDomain(current, remote),
        )
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

  return null
}

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
      console.warn(
        '[loopy] SW sync message failed, falling back:',
        err?.message ?? err,
      )
    }
  }
  const result = await syncVisits(userId)
  console.log('[loopy] visits sync (inline):', result)
  return result
}
