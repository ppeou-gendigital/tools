import { useMemo, useState } from 'react'
import {
  Globe,
  History,
  Info,
  Pin,
  PinOff,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Deck, Slide } from '@/blocks/Deck'
import { PathTreeSlide } from '@/blocks/PathTree'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useVisitedUrls } from '@/providers/VisitedUrlsProvider'
import { usePinnedSites } from '@/providers/PinnedSitesProvider'
import { useCurrentTabHost } from '@/hooks/useCurrentTabHost'
import { getRebaseOrigin } from '@/lib/prefs'
import { cx } from '@/lib/cx'
import { isExtension } from '@/env'
import styles from './SiteTree.module.scss'

// Build a lookup: hostname -> { label, origin } for slide headers and link
// targets. Mirrors the same reasoning as the flat Visited URLs page: AEM
// domain entries opt-in a nicer label + origin; everything else falls back
// to the raw hostname and https://<hostname>.
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

// Trailing "Manage pins" slide — the curation surface. Lists every known
// hostname (visited hosts, currently-pinned hosts, plus the current tab's
// hostname when we can read it) and lets the user toggle pin state per
// site. Only pinned sites get their own tree slide in the deck; unpinned
// hosts stay in the storage layer but disappear from the deck.
//
// Current tab (if any) is highlighted at the top and always appears first
// so it's a two-click flow: open Site Tree → pin this site.
function ManagePinsSlide({ items, pinned, onToggle, currentHost }) {
  const isEmpty = items.length === 0
  return (
    <div className={styles.slideBody}>
      <div className={styles.slideHead}>
        <Pin
          size={14}
          aria-hidden="true"
          className={styles.slideHeadIcon}
        />
        <div className={styles.slideHeadText}>
          <span className={styles.slideLabel}>Manage pins</span>
          <span className={styles.slideHost}>
            {isEmpty
              ? 'no sites yet'
              : `${pinned.size} pinned / ${items.length} total`}
          </span>
        </div>
      </div>
      <div className={styles.slideScroll}>
        {isEmpty ? (
          <EmptyState />
        ) : (
          <ul className={styles.pickerList}>
            {items.map((item) => {
              const isPinned = pinned.has(item.hostname)
              const isCurrent = item.hostname === currentHost
              return (
                <li key={item.hostname}>
                  <button
                    type="button"
                    className={cx(
                      styles.pickerRow,
                      isPinned && styles.pickerRowPinned,
                      isCurrent && styles.pickerRowCurrent,
                    )}
                    onClick={() => onToggle(item.hostname)}
                    aria-pressed={isPinned}
                    title={isPinned ? 'Unpin from deck' : 'Pin to deck'}
                  >
                    <Globe
                      size={14}
                      aria-hidden="true"
                      className={styles.pickerIcon}
                    />
                    <span className={styles.pickerText}>
                      <span className={styles.pickerLabel}>
                        {item.label}
                        {isCurrent && (
                          <span
                            className={styles.currentBadge}
                            title="Current tab"
                          >
                            current
                          </span>
                        )}
                      </span>
                      <span className={styles.pickerHost}>
                        {item.hostname}
                        {item.count > 0 && (
                          <>
                            {' · '}
                            {item.count === 1 ? '1 page' : `${item.count} pages`}
                          </>
                        )}
                        {item.count === 0 && ' · no visits yet'}
                      </span>
                    </span>
                    {isPinned ? (
                      <Pin
                        size={14}
                        aria-hidden="true"
                        className={styles.pinIconActive}
                      />
                    ) : (
                      <PinOff
                        size={14}
                        aria-hidden="true"
                        className={styles.pinIconInactive}
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  const inExtension = isExtension()
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon} aria-hidden="true">
        <History size={20} />
      </div>
      <p className={styles.muted}>
        {inExtension
          ? 'No visits yet. Open a tab on one of your tracked sites and it will show up here.'
          : 'No visits yet. Capture runs inside the Chrome extension — sign in there to sync visits into the web app.'}
      </p>
    </div>
  )
}

export function SiteTree() {
  const { byDomain, ready: visitsReady } = useVisitedUrls()
  const { domains } = useAemDomains()
  const {
    pinnedSet: pinned,
    toggle: togglePin,
    ready: pinsReady,
  } = usePinnedSites()

  const domainMeta = useMemo(() => buildDomainMeta(domains), [domains])
  const currentHost = useCurrentTabHost()
  const [showInfo, setShowInfo] = useState(false)

  // Every hostname we know about — used to populate the Manage pins slide.
  // Union of three sources:
  //   - byDomain keys        (hostnames we've actually captured visits for)
  //   - pinned Set           (in case a pin was made before any visit landed)
  //   - currentHost          (so a fresh site is always pinnable from here)
  // Each entry carries the label / origin resolved via AEM domain metadata,
  // page count, and freshness so downstream sorting can pick any of them.
  const allSites = useMemo(() => {
    const seen = new Map()
    function add(hostname, bucket) {
      const key = hostname?.toLowerCase()
      if (!key) return
      if (seen.has(key)) return
      const pathObj =
        bucket?.paths &&
        typeof bucket.paths === 'object' &&
        !Array.isArray(bucket.paths)
          ? bucket.paths
          : {}
      const meta = domainMeta.get(key)
      seen.set(key, {
        hostname: key,
        bucket: bucket ?? null,
        label: meta?.label ?? key,
        origin: meta?.origin ?? `https://${key}`,
        count: Object.keys(pathObj).length,
        updatedAt: bucket?.updatedAt ?? '',
      })
    }
    for (const [h, b] of Object.entries(byDomain)) add(h, b)
    for (const h of pinned) add(h, byDomain[h])
    if (currentHost) add(currentHost, byDomain[currentHost])
    return [...seen.values()]
  }, [byDomain, domainMeta, pinned, currentHost])

  // Rows for the Manage pins slide. Ordering: current tab first (so pinning
  // the site you're on is a one-glance action), then pinned sites, then the
  // rest by freshness. Alphabetical tie-break keeps the list stable when
  // updatedAt is empty (fresh pin, never visited).
  const manageRows = useMemo(() => {
    return [...allSites].sort((a, b) => {
      if (a.hostname === currentHost && b.hostname !== currentHost) return -1
      if (b.hostname === currentHost && a.hostname !== currentHost) return 1
      const ap = pinned.has(a.hostname) ? 0 : 1
      const bp = pinned.has(b.hostname) ? 0 : 1
      if (ap !== bp) return ap - bp
      const at = a.updatedAt
      const bt = b.updatedAt
      if (at !== bt) return at < bt ? 1 : -1
      return a.hostname.localeCompare(b.hostname)
    })
  }, [allSites, pinned, currentHost])

  // Deck slides only for pinned sites. Current-tab pin (if any) is promoted
  // to the front so opening Site Tree on a pinned page lands you on that
  // page's tree without an extra swipe. This is the "if it is pinned, place
  // its slide first" behavior from the spec.
  const deckSites = useMemo(() => {
    const pinnedOnly = allSites.filter((s) => pinned.has(s.hostname))
    pinnedOnly.sort((a, b) => {
      if (a.hostname === currentHost && b.hostname !== currentHost) return -1
      if (b.hostname === currentHost && a.hostname !== currentHost) return 1
      const at = a.updatedAt
      const bt = b.updatedAt
      if (at !== bt) return at < bt ? 1 : -1
      return a.hostname.localeCompare(b.hostname)
    })
    return pinnedOnly
  }, [allSites, pinned, currentHost])

  const ready = visitsReady && pinsReady

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Site tree</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo((v) => !v)}
            className={styles.iconBtn}
            aria-label="About this page"
            aria-expanded={showInfo}
            aria-controls="site-tree-info"
            title="About"
          >
            <Info size={14} aria-hidden="true" />
          </Button>
          <PageShortcuts current="site-tree" className={styles.iconBtn} />
        </div>
        {showInfo && (
          <p id="site-tree-info" className={styles.subtitle}>
            Pin a few sites you check often. Their trees show up as slides
            here; the last slide is where you manage pins.
          </p>
        )}
      </header>

      {!ready ? (
        <p className={cx(styles.muted, styles.padded)}>Loading…</p>
      ) : (
        <div className={cx('is-fluid-width', styles.deckWrap)}>
          <Deck>
            {deckSites.map((site) => (
              <Slide
                key={site.hostname}
                span={10}
                spanMd={6}
                spanLg={5}
                spanXl={4}
                data-tree-host={site.hostname}
              >
                <PathTreeSlide
                  hostname={site.hostname}
                  label={site.label}
                  origin={site.origin}
                  paths={site.bucket?.paths}
                />
              </Slide>
            ))}
            <Slide
              key="__manage"
              span={10}
              spanMd={6}
              spanLg={5}
              spanXl={4}
            >
              <ManagePinsSlide
                items={manageRows}
                pinned={pinned}
                onToggle={togglePin}
                currentHost={currentHost}
              />
            </Slide>
          </Deck>
        </div>
      )}
    </div>
  )
}
