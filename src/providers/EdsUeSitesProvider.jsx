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
  AEM_AUTHOR_SITES_KEY,
  emptyAemAuthorSites,
  hostFromOrigin,
  normalizeAemAuthorSites,
  normalizeDeliveryKind,
  normalizeEdsDomains,
  siteSegment,
} from '@/lib/aemAuthorSites'
import {
  enqueueAemAuthorSiteOp,
  pullAemAuthorSites,
} from '@/lib/aemAuthorSitesApi'
import { useAuth } from '@/providers/AuthProvider'
import { isExtension } from '@/env'

const EdsUeSitesContext = createContext(null)

export function EdsUeSitesProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [byHost, setByHost] = useState(() => emptyAemAuthorSites())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(AEM_AUTHOR_SITES_KEY).then((raw) => {
      if (!mounted) return
      setByHost(normalizeAemAuthorSites(raw))
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
      if (!changes[AEM_AUTHOR_SITES_KEY]) return
      setByHost(normalizeAemAuthorSites(changes[AEM_AUTHOR_SITES_KEY].newValue))
    }
    chrome.storage.onChanged.addListener(listener)
    return () => {
      chrome.storage.onChanged.removeListener(listener)
    }
  }, [])

  const persistAll = useCallback(async (next) => {
    const resolved = normalizeAemAuthorSites(next)
    setByHost(resolved)
    await asyncStorage.setItem(AEM_AUTHOR_SITES_KEY, JSON.stringify(resolved))
    return resolved
  }, [])

  const patchHost = useCallback(
    async (authorHost, authorOrigin, mutator) => {
      const host =
        String(authorHost || '')
          .trim()
          .toLowerCase() || hostFromOrigin(authorOrigin)
      if (!host) return byHost

      let nextBucket
      let resolved
      setByHost((prev) => {
        const current = prev[host] || {
          authorOrigin: authorOrigin || '',
          sitesFetchedAt: null,
          updatedAt: null,
          sites: [],
        }
        nextBucket = mutator({
          ...current,
          authorOrigin: authorOrigin || current.authorOrigin || '',
        })
        resolved = normalizeAemAuthorSites({
          ...prev,
          [host]: nextBucket,
        })
        return resolved
      })
      await asyncStorage.setItem(
        AEM_AUTHOR_SITES_KEY,
        JSON.stringify(resolved ?? {}),
      )

      if (!userId || !nextBucket) return resolved
      try {
        const result = await enqueueAemAuthorSiteOp({
          userId,
          authorHost: host,
          op: () => nextBucket,
        })
        if (result?.bucket) {
          const synced = normalizeAemAuthorSites({
            ...resolved,
            [host]: result.bucket,
          })
          setByHost(synced)
          await asyncStorage.setItem(
            AEM_AUTHOR_SITES_KEY,
            JSON.stringify(synced),
          )
          return synced
        }
      } catch (err) {
        console.warn(
          '[loopy] aemAuthorSites sync failed:',
          err?.message ?? err,
        )
      }
      return resolved
    },
    [byHost, userId],
  )

  const setSitesList = useCallback(
    async (authorOrigin, sites, fetchedAt) => {
      const host = hostFromOrigin(authorOrigin)
      if (!host) return byHost
      return patchHost(host, authorOrigin, (bucket) => {
        const prevByPath = new Map(bucket.sites.map((s) => [s.path, s]))
        const nextSites = (sites || []).map((s) => {
          const prev = prevByPath.get(s.path)
          return {
            path: s.path,
            title: s.title || siteSegment(s.path) || s.path,
            pinned: prev?.pinned === true,
            // Kind / EDS domains from site slide — preserve across Fetch sites.
            deliveryKind: prev?.deliveryKind ?? null,
            deliveryKindManual: prev?.deliveryKindManual === true,
            edsDomains: prev?.edsDomains || [],
            pagesScannedAt: prev?.pagesScannedAt || null,
            nodes: prev?.pinned ? prev.nodes || [] : [],
          }
        })
        // Keep pinned sites that vanished from Author (still show until unpin).
        for (const prev of bucket.sites) {
          if (prev.pinned && !nextSites.some((s) => s.path === prev.path)) {
            nextSites.push(prev)
          }
        }
        return {
          ...bucket,
          authorOrigin,
          sitesFetchedAt: fetchedAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sites: nextSites,
        }
      })
    },
    [byHost, patchHost],
  )

  const togglePin = useCallback(
    async (authorOrigin, sitePath) => {
      const host = hostFromOrigin(authorOrigin)
      if (!host || !sitePath) return byHost
      return patchHost(host, authorOrigin, (bucket) => ({
        ...bucket,
        updatedAt: new Date().toISOString(),
        sites: bucket.sites.map((s) => {
          if (s.path !== sitePath) return s
          const pinned = !s.pinned
          return {
            ...s,
            pinned,
            nodes: pinned ? s.nodes || [] : [],
          }
        }),
      }))
    },
    [byHost, patchHost],
  )

  const setSitePages = useCallback(
    async (authorOrigin, sitePath, nodes, scannedAt, deliveryKind) => {
      const host = hostFromOrigin(authorOrigin)
      if (!host || !sitePath) return byHost
      const kind = normalizeDeliveryKind(deliveryKind)
      return patchHost(host, authorOrigin, (bucket) => ({
        ...bucket,
        updatedAt: new Date().toISOString(),
        sites: bucket.sites.map((s) => {
          if (s.path !== sitePath) return s
          // Manual override wins over auto-detect from Refresh.
          const nextKind = s.deliveryKindManual
            ? s.deliveryKind
            : kind || s.deliveryKind
          return {
            ...s,
            pinned: true,
            deliveryKind: nextKind,
            pagesScannedAt: scannedAt || new Date().toISOString(),
            nodes: Array.isArray(nodes) ? nodes : [],
          }
        }),
      }))
    },
    [byHost, patchHost],
  )

  const setSiteDeliveryKind = useCallback(
    async (authorOrigin, sitePath, deliveryKind) => {
      const host = hostFromOrigin(authorOrigin)
      const kind = normalizeDeliveryKind(deliveryKind)
      if (!host || !sitePath || !kind) return byHost
      return patchHost(host, authorOrigin, (bucket) => ({
        ...bucket,
        updatedAt: new Date().toISOString(),
        sites: bucket.sites.map((s) => {
          if (s.path !== sitePath) return s
          return {
            ...s,
            deliveryKind: kind,
            deliveryKindManual: true,
          }
        }),
      }))
    },
    [byHost, patchHost],
  )

  const setSiteEdsDomains = useCallback(
    async (authorOrigin, sitePath, edsDomains) => {
      const host = hostFromOrigin(authorOrigin)
      if (!host || !sitePath) return byHost
      const nextDomains = normalizeEdsDomains(edsDomains)
      return patchHost(host, authorOrigin, (bucket) => {
        const hasSite = bucket.sites.some((s) => s.path === sitePath)
        const sites = hasSite
          ? bucket.sites.map((s) => {
              if (s.path !== sitePath) return s
              return {
                ...s,
                pinned: true,
                edsDomains: nextDomains,
              }
            })
          : [
              ...bucket.sites,
              {
                path: sitePath,
                title: siteSegment(sitePath) || sitePath,
                pinned: true,
                deliveryKind: null,
                deliveryKindManual: false,
                edsDomains: nextDomains,
                pagesScannedAt: null,
                nodes: [],
              },
            ]
        return {
          ...bucket,
          updatedAt: new Date().toISOString(),
          sites,
        }
      })
    },
    [byHost, patchHost],
  )

  const ensureHostBucket = useCallback(
    async (authorOrigin) => {
      const host = hostFromOrigin(authorOrigin)
      if (!host) return null
      if (byHost[host]) return byHost[host]
      await patchHost(host, authorOrigin, (bucket) => ({
        ...bucket,
        authorOrigin,
        updatedAt: new Date().toISOString(),
      }))
      return (
        normalizeAemAuthorSites(
          await asyncStorage.getItem(AEM_AUTHOR_SITES_KEY),
        )[host] || null
      )
    },
    [byHost, patchHost],
  )

  const pullRemote = useCallback(async () => {
    if (!userId) return byHost
    try {
      const merged = await pullAemAuthorSites(userId, byHost)
      return persistAll(merged)
    } catch (err) {
      console.warn('[loopy] aemAuthorSites pull failed:', err?.message ?? err)
      return byHost
    }
  }, [userId, byHost, persistAll])

  const value = useMemo(
    () => ({
      byHost,
      ready,
      setSitesList,
      togglePin,
      setSitePages,
      setSiteDeliveryKind,
      setSiteEdsDomains,
      ensureHostBucket,
      pullRemote,
      persistAll,
    }),
    [
      byHost,
      ready,
      setSitesList,
      togglePin,
      setSitePages,
      setSiteDeliveryKind,
      setSiteEdsDomains,
      ensureHostBucket,
      pullRemote,
      persistAll,
    ],
  )

  return (
    <EdsUeSitesContext.Provider value={value}>
      {children}
    </EdsUeSitesContext.Provider>
  )
}

export function useEdsUeSites() {
  const ctx = useContext(EdsUeSitesContext)
  if (!ctx) {
    throw new Error(
      'useEdsUeSites must be used inside <EdsUeSitesProvider>',
    )
  }
  return ctx
}
