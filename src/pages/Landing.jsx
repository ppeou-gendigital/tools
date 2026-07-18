import { useEffect, useMemo, useState } from 'react'
import { Info } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { AemJumpBlock } from '@/blocks/AemJumpBlock'
import { Deck, Slide } from '@/blocks/Deck'
import { FavLinksTreeSlide, PathTreeSlide } from '@/blocks/PathTree'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useFavorites } from '@/providers/FavoritesProvider'
import { useFavoritesOrder } from '@/providers/FavoritesOrderProvider'
import { useVisitedUrls } from '@/providers/VisitedUrlsProvider'
import { useCurrentTabHost } from '@/hooks/useCurrentTabHost'
import { isJumpableUrl, readActiveTabUrl } from '@/lib/activeTab'
import { getRebaseOrigin } from '@/lib/prefs'
import { cx } from '@/lib/cx'
import { isExtension } from '@/env'
import styles from './Landing.module.scss'

const SLIDE_SPAN = { span: 10, spanMd: 5, spanLg: 4, spanXl: 3 }

// Shared with AEM Jump so typing a URL on either page survives refresh on
// the web surface. Extension always seeds from the active tab instead.
const URL_STORAGE_KEY = 'loopy.aemJumpUrl'
const URL_WRITE_DEBOUNCE_MS = 300

function readInitialWebUrl() {
  try {
    const stored = globalThis.localStorage?.getItem(URL_STORAGE_KEY)
    if (typeof stored === 'string' && stored.trim()) return stored
  } catch {
    // localStorage can throw in private mode / sandboxed iframes.
  }
  return ''
}

function buildDomainMeta(domains) {
  const meta = new Map()
  for (const d of domains ?? []) {
    const origin = getRebaseOrigin(d)
    if (!origin) continue
    let hostname
    try {
      hostname = new URL(origin).hostname.toLowerCase()
    } catch {
      continue
    }
    if (!meta.has(hostname)) {
      meta.set(hostname, {
        label: d.label?.trim() || hostname,
        origin,
      })
    }
  }
  return meta
}

export function Landing() {
  const { domains } = useAemDomains()
  const { byDomain: favByDomain, ready: favReady } = useFavorites()
  const { order, ready: orderReady } = useFavoritesOrder()
  const { byDomain: visitsByDomain, ready: visitsReady } = useVisitedUrls()
  const currentHost = useCurrentTabHost()
  const [showInfo, setShowInfo] = useState(false)
  const [url, setUrl] = useState(() =>
    isExtension() ? '' : readInitialWebUrl(),
  )

  const domainMeta = useMemo(() => buildDomainMeta(domains), [domains])

  // Extension: seed once on open from the active tab.
  useEffect(() => {
    if (!isExtension()) return
    let mounted = true
    readActiveTabUrl().then((tabUrl) => {
      if (!mounted) return
      const next = isJumpableUrl(tabUrl) ? tabUrl : ''
      setUrl(next)
      if (!next) return
      requestAnimationFrame(() => {
        const el = document.getElementById('landing-aem-jump-url')
        if (el instanceof HTMLInputElement) {
          el.scrollLeft = el.scrollWidth
        }
      })
    })
    return () => {
      mounted = false
    }
  }, [])

  // Web: debounced persist so the URL survives a page refresh.
  useEffect(() => {
    if (isExtension()) return
    const t = setTimeout(() => {
      try {
        globalThis.localStorage?.setItem(URL_STORAGE_KEY, url)
      } catch {
        // ignore quota / private-mode errors
      }
    }, URL_WRITE_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [url])

  // Domain groups in the same order as the Fav Links page.
  const favGroups = useMemo(() => {
    const seen = new Set()
    const ordered = []
    for (const host of order) {
      if (!(host in favByDomain)) continue
      if (seen.has(host)) continue
      seen.add(host)
      ordered.push(host)
    }
    const remaining = Object.keys(favByDomain).filter((h) => !seen.has(h))
    remaining.sort((a, b) => {
      const at = favByDomain[a]?.updatedAt ?? ''
      const bt = favByDomain[b]?.updatedAt ?? ''
      if (at !== bt) return at < bt ? 1 : -1
      return a.localeCompare(b)
    })
    ordered.push(...remaining)

    return ordered
      .map((hostname) => {
        const bucket = favByDomain[hostname]
        const paths = bucket?.paths ?? {}
        const count = Object.keys(paths).length
        if (count === 0) return null
        const meta = domainMeta.get(hostname)
        return {
          hostname,
          paths,
          count,
          label: meta?.label ?? hostname,
          origin: meta?.origin ?? `https://${hostname}`,
        }
      })
      .filter(Boolean)
  }, [order, favByDomain, domainMeta])

  const siteMeta = currentHost
    ? domainMeta.get(currentHost) ?? {
        label: currentHost,
        origin: `https://${currentHost}`,
      }
    : null
  const siteBucket = currentHost ? visitsByDomain[currentHost] : null

  const ready = favReady && orderReady && visitsReady

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Landing</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo((v) => !v)}
            className={styles.iconBtn}
            aria-label="About this page"
            aria-expanded={showInfo}
            aria-controls="landing-info"
            title="About"
          >
            <Info size={14} aria-hidden="true" />
          </Button>
          <PageShortcuts current="landing" className={styles.iconBtn} />
        </div>
        {showInfo && (
          <p id="landing-info" className={styles.subtitle}>
            Jump from the current tab, browse favorites by display name, and
            inspect the site tree for the active hostname.
          </p>
        )}
      </header>

      {!ready ? (
        <p className={cx(styles.muted, styles.padded)}>Loading…</p>
      ) : (
        <div className={cx('is-fluid-width', styles.deckWrap)}>
          <Deck>
            <Slide {...SLIDE_SPAN}>
              <AemJumpBlock
                variant="source"
                url={url}
                onUrlChange={setUrl}
                inputId="landing-aem-jump-url"
              />
            </Slide>

            <Slide {...SLIDE_SPAN}>
              <FavLinksTreeSlide groups={favGroups} />
            </Slide>

            <Slide {...SLIDE_SPAN}>
              {currentHost && siteMeta ? (
                <PathTreeSlide
                  hostname={currentHost}
                  label={siteMeta.label}
                  origin={siteMeta.origin}
                  paths={siteBucket?.paths}
                  emptyMessage={
                    <>
                      No pages captured for{' '}
                      <code>{currentHost}</code> yet. Browse the site and
                      visits will show up here.
                    </>
                  }
                />
              ) : (
                <div className={styles.emptySlide}>
                  <p className={styles.muted}>
                    {isExtension()
                      ? 'Open a jumpable tab to see its site tree here.'
                      : 'Site tree for the current tab is available in the Chrome extension.'}
                  </p>
                </div>
              )}
            </Slide>
          </Deck>
        </div>
      )}
    </div>
  )
}
