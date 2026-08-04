import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import {
  Globe,
  Info,
  LoaderCircle,
  Pin,
  PinOff,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Deck, Slide } from '@/blocks/Deck'
import { EdsUeTreeSlide } from '@/blocks/EdsUeTree'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useEdsUeSites } from '@/providers/EdsUeSitesProvider'
import { useCurrentTab } from '@/hooks/useCurrentTabUrl'
import {
  hostFromOrigin,
  siteNodesToPaths,
  siteSegment,
} from '@/lib/aemAuthorSites'
import {
  EDS_UE_DOMAIN_SLIDE,
  activeSlideKeyFromDeck,
  readEdsUeDeckSlide,
  scrollDeckToSlide,
  writeEdsUeDeckSlide,
} from '@/lib/aemEdsUeUi'
import { fetchSitesForAuthor, scanSitePages } from '@/lib/aemSiteScan'
import { resolveAemDomainForSite } from '@/lib/edsUePageLinks'
import { ensureUrlOriginPermission } from '@/lib/hostPermission'
import { cx } from '@/lib/cx'
import { isExtension } from '@/env'
import styles from './AemEdsUe.module.scss'

function DomainHubSlide({
  authorHost,
  authorOrigin,
  bucket,
  busy,
  error,
  onFetchSites,
  onRefreshSites,
  onTogglePin,
  onRefreshSitePages,
}) {
  const sites = bucket?.sites ?? []
  const fetched = !!bucket?.sitesFetchedAt
  const pinnedCount = sites.filter((s) => s.pinned).length

  if (!authorHost || !authorOrigin) {
    return (
      <div className={styles.slideBody}>
        <div className={styles.slideHead}>
          <Globe size={14} aria-hidden="true" className={styles.slideHeadIcon} />
          <div className={styles.slideHeadText}>
            <span className={styles.slideLabel}>Author domain</span>
            <span className={styles.slideHost}>no Author tab detected</span>
          </div>
        </div>
        <div className={styles.slideScroll}>
          <p className={cx(styles.muted, styles.emptyTree)}>
            Open an AEM Author tab, click the Loopy toolbar icon while that tab
            is focused, then return here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.slideBody}>
      <div className={styles.slideHead}>
        <button
          type="button"
          className={styles.rowIconBtn}
          onClick={fetched ? onRefreshSites : onFetchSites}
          disabled={busy}
          title={fetched ? 'Refresh sites list' : 'Fetch sites'}
          aria-label={fetched ? 'Refresh sites list' : 'Fetch sites'}
        >
          <RefreshCw size={14} aria-hidden="true" />
        </button>
        <div className={styles.slideHeadText}>
          <span className={styles.slideLabel}>{authorHost}</span>
          <span className={styles.slideHost}>
            {fetched
              ? `${pinnedCount} pinned / ${sites.length} sites`
              : 'sites not fetched yet'}
          </span>
        </div>
      </div>
      <div className={styles.slideScroll}>
        {error && <p className={styles.errorText}>{error}</p>}
        {!fetched && (
          <div className={styles.empty}>
            <p className={styles.muted}>
              {error
                ? 'Fix the issue above, keep Author open, then try again.'
                : 'First time on this Author domain. Fetch the list of sites under'}
              {!error && (
                <>
                  <code> /content </code>
                  via Query Builder?
                </>
              )}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onFetchSites}
              disabled={busy}
            >
              <RefreshCw size={14} aria-hidden="true" />
              Fetch sites
            </Button>
          </div>
        )}
        {fetched && sites.length === 0 && (
          <p className={cx(styles.muted, styles.emptyTree)}>
            No sites found under /content. Check Author login or refresh.
          </p>
        )}
        {fetched && sites.length > 0 && (
          <ul className={styles.pickerList}>
            {sites.map((site) => {
              const seg = siteSegment(site.path) || site.path
              return (
                <li key={site.path}>
                  <div
                    className={cx(
                      styles.siteRow,
                      site.pinned && styles.siteRowPinned,
                    )}
                  >
                    <button
                      type="button"
                      className={styles.rowIconBtn}
                      onClick={() => onRefreshSitePages(site)}
                      disabled={busy}
                      title="Refresh pages for this site"
                      aria-label={`Refresh pages for ${seg}`}
                    >
                      <RefreshCw size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={styles.rowIconBtn}
                      onClick={() => onTogglePin(site)}
                      disabled={busy}
                      title={site.pinned ? 'Unpin from deck' : 'Pin to deck'}
                      aria-label={
                        site.pinned ? `Unpin ${seg}` : `Pin ${seg}`
                      }
                      aria-pressed={site.pinned}
                    >
                      {site.pinned ? (
                        <Pin size={14} aria-hidden="true" />
                      ) : (
                        <PinOff size={14} aria-hidden="true" />
                      )}
                    </button>
                    <span className={styles.pickerText}>
                      <span className={styles.pickerLabel}>{site.title}</span>
                      <span className={styles.pickerHost}>
                        {site.path}
                        {site.pagesScannedAt
                          ? ` · ${site.nodes?.length || 0} pages`
                          : ' · not scanned'}
                      </span>
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export function AemEdsUe() {
  const { domains } = useAemDomains()
  const {
    byHost,
    setSitesList,
    togglePin,
    setSitePages,
    setSiteDeliveryKind,
    setSiteEdsDomains,
    ready: sitesReady,
  } = useEdsUeSites()
  const tab = useCurrentTab()
  const deckRef = useRef(null)
  const restoringDeckRef = useRef(false)
  const [showInfo, setShowInfo] = useState(false)
  const [busyKind, setBusyKind] = useState(null) // 'sites' | 'pages'
  const [busyLabel, setBusyLabel] = useState('')
  const [hubError, setHubError] = useState(null)
  const [pageErrors, setPageErrors] = useState({})
  const inExtension = isExtension()

  let authorOrigin = null
  if (tab?.url) {
    try {
      authorOrigin = new URL(tab.url).origin
    } catch {
      authorOrigin = null
    }
  }
  const authorHost = authorOrigin ? hostFromOrigin(authorOrigin) : null
  const bucket = authorHost ? byHost[authorHost] : null
  const pinnedSites = (bucket?.sites ?? []).filter((s) => s.pinned)
  const pinnedPathsKey = pinnedSites.map((s) => s.path).join('\0')

  async function runBusy(kind, label, fn) {
    flushSync(() => {
      setBusyKind(kind)
      setBusyLabel(label)
      setHubError(null)
    })
    try {
      await fn()
    } finally {
      setBusyKind(null)
      setBusyLabel('')
    }
  }

  async function handleFetchSites() {
    if (!authorOrigin || !inExtension) return
    // FIRST await must be permissions.request so Chrome keeps the gesture.
    // Grants SW Query Builder access when tab injection isn't available
    // (e.g. Loopy opened as its own tab instead of the Author popup).
    const granted = await ensureUrlOriginPermission(authorOrigin)
    await runBusy('sites', authorHost, async () => {
      const result = await fetchSitesForAuthor(authorOrigin)
      if (!result.ok) {
        setHubError(
          result.error ||
            (granted
              ? 'Failed to fetch sites from Author.'
              : `Allow site access for ${authorOrigin}, keep Author open, then Fetch sites again.`),
        )
        return
      }
      await setSitesList(authorOrigin, result.sites, result.fetchedAt)
    })
  }

  async function handleTogglePin(site) {
    if (!authorOrigin) return
    await togglePin(authorOrigin, site.path)
  }

  async function handleDeliveryKindChange(site, kind) {
    if (!authorOrigin || !site?.path) return
    await setSiteDeliveryKind(authorOrigin, site.path, kind)
  }

  async function handleEdsDomainsChange(site, edsDomains) {
    if (!authorOrigin || !site?.path) return
    await setSiteEdsDomains(authorOrigin, site.path, edsDomains)
  }

  async function handleRefreshSitePages(site) {
    if (!authorOrigin || !inExtension) return
    const seg = siteSegment(site.path) || site.path
    // FIRST await — host permission for SW fallback when inject can't run.
    await ensureUrlOriginPermission(authorOrigin)
    await runBusy('pages', seg, async () => {
      setPageErrors((prev) => {
        const next = { ...prev }
        delete next[site.path]
        return next
      })
      // Ensure pinned so the catalog is retained.
      if (!site.pinned) await togglePin(authorOrigin, site.path)
      const result = await scanSitePages(authorOrigin, site.path)
      if (!result.ok) {
        setPageErrors((prev) => ({
          ...prev,
          [site.path]: result.error || 'Scan failed',
        }))
        setHubError(result.error || 'Scan failed')
        return
      }
      await setSitePages(
        authorOrigin,
        site.path,
        result.nodes,
        result.scannedAt,
        result.deliveryKind,
      )
    })
  }

  const ready = sitesReady
  const busy = !!busyKind

  // Restore last snapped slide for this Author host (default: first pin).
  useLayoutEffect(() => {
    if (!ready || !authorHost) return
    const deck = deckRef.current
    if (!deck) return

    const pinnedPaths = pinnedPathsKey
      ? pinnedPathsKey.split('\0').filter(Boolean)
      : []
    const saved = readEdsUeDeckSlide(authorHost)
    const pinnedSet = new Set(pinnedPaths)
    const target =
      saved && (saved === EDS_UE_DOMAIN_SLIDE || pinnedSet.has(saved))
        ? saved
        : pinnedPaths[0] || EDS_UE_DOMAIN_SLIDE

    restoringDeckRef.current = true
    scrollDeckToSlide(deck, target)
    // Snap can settle after layout; re-apply once more next frame.
    const id = requestAnimationFrame(() => {
      scrollDeckToSlide(deck, target)
      restoringDeckRef.current = false
    })
    return () => {
      cancelAnimationFrame(id)
      restoringDeckRef.current = false
    }
  }, [ready, authorHost, pinnedPathsKey])

  // Persist which slide is snapped while the user swipes the deck.
  useEffect(() => {
    if (!ready || !authorHost) return
    const deck = deckRef.current
    if (!deck) return

    let timer = 0
    const persist = () => {
      if (restoringDeckRef.current) return
      const key = activeSlideKeyFromDeck(deck)
      if (key) writeEdsUeDeckSlide(authorHost, key)
    }
    const onScroll = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(persist, 120)
    }
    deck.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      deck.removeEventListener('scroll', onScroll)
      persist()
    }
  }, [ready, authorHost, pinnedPathsKey])

  return (
    <div className={styles.page} aria-busy={busy}>
      {busy && (
        <div
          className={styles.scanOverlay}
          role="status"
          aria-live="polite"
          aria-label={
            busyKind === 'sites'
              ? `Fetching sites for ${busyLabel}`
              : `Scanning pages for ${busyLabel}`
          }
        >
          <div className={styles.scanOverlayCard}>
            <LoaderCircle
              size={22}
              aria-hidden="true"
              className={styles.scanSpinner}
            />
            <p className={styles.scanOverlayTitle}>
              {busyKind === 'sites' ? 'Fetching sites…' : 'Scanning pages…'}
            </p>
            <p className={styles.scanOverlayDetail}>{busyLabel}</p>
          </div>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>AEM EDS-UE</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo((v) => !v)}
            className={styles.iconBtn}
            aria-label="About this page"
            aria-expanded={showInfo}
            aria-controls="aem-eds-ue-info"
            title="About"
            disabled={busy}
          >
            <Info size={14} aria-hidden="true" />
          </Button>
          <PageShortcuts current="aem-eds-ue" className={styles.iconBtn} />
        </div>
        {showInfo && (
          <p id="aem-eds-ue-info" className={styles.subtitle}>
            Domain = current Author tab. Domain refresh only lists /content
            sites. Pin a site, then Refresh to scan pages (auto Cloud vs
            EDS-UE). Add EDS / vanity domains on the site slide for
            Preview/Live. Catalogs sync via loopy_aem_author_sites.
          </p>
        )}
      </header>

      {!ready ? (
        <p className={cx(styles.muted, styles.padded)}>Loading…</p>
      ) : (
        <div className={cx('is-fluid-width', styles.deckWrap)}>
          <Deck ref={deckRef}>
            {pinnedSites.map((site) => {
              const domainForLinks = resolveAemDomainForSite(
                authorHost,
                site.path,
                domains,
                site.deliveryKind,
              )
              if (domainForLinks) {
                domainForLinks.label =
                  site.title ||
                  siteSegment(site.path) ||
                  domainForLinks.label
                if (authorOrigin) {
                  domainForLinks.authorOrigin = authorOrigin
                  if (!domainForLinks.localSdk) {
                    domainForLinks.origin = authorOrigin
                  }
                }
              }
              return (
                <Slide
                  key={site.path}
                  span={10}
                  spanMd={6}
                  spanLg={5}
                  spanXl={4}
                  data-eds-slide={site.path}
                >
                  <EdsUeTreeSlide
                    key={`${authorHost}:${site.path}`}
                    domain={domainForLinks}
                    deliveryKind={site.deliveryKind}
                    deliveryKindManual={site.deliveryKindManual}
                    edsDomains={site.edsDomains}
                    allDomains={domains}
                    paths={siteNodesToPaths(site.nodes)}
                    scannedAt={site.pagesScannedAt}
                    scanning={busyKind === 'pages' && busyLabel === siteSegment(site.path)}
                    error={pageErrors[site.path]}
                    onScan={() => handleRefreshSitePages(site)}
                    onDeliveryKindChange={(kind) =>
                      handleDeliveryKindChange(site, kind)
                    }
                    onEdsDomainsChange={(next) =>
                      handleEdsDomainsChange(site, next)
                    }
                    canScan={inExtension && !busy}
                    sitePath={site.path}
                    authorHost={authorHost}
                  />
                </Slide>
              )
            })}
            <Slide
              key={EDS_UE_DOMAIN_SLIDE}
              span={10}
              spanMd={6}
              spanLg={5}
              spanXl={4}
              data-eds-slide={EDS_UE_DOMAIN_SLIDE}
            >
              <DomainHubSlide
                authorHost={authorHost}
                authorOrigin={authorOrigin}
                bucket={bucket}
                busy={busy}
                error={hubError}
                onFetchSites={handleFetchSites}
                onRefreshSites={handleFetchSites}
                onTogglePin={handleTogglePin}
                onRefreshSitePages={handleRefreshSitePages}
              />
            </Slide>
          </Deck>
        </div>
      )}
    </div>
  )
}
