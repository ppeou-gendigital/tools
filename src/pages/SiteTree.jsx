import { useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Globe,
  History,
  Info,
  Pin,
  PinOff,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Deck, Slide } from '@/blocks/Deck'
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

// Split a paths object into a nested tree keyed by URL path segments.
//
// Input shape (see src/lib/visitedUrls.js):
//   paths = { '<pathname+search>': PathValue, ... }
//
// Output:
//   {
//     name: 'mysite.com',   // hostname at root; last segment elsewhere
//     fullPath: '/',        // pathname from origin (no query)
//     visit: PathValue|null,// only set when THIS exact pathname was visited
//     fullKey: '<key>'|null,// the paths[] key of the chosen visit (with search)
//     variantCount: 0,      // number of paths entries collapsed into this leaf
//                           //   (>1 when query-string variants share a pathname)
//     children: Map<string, Node>,
//   }
//
// Query-string variants at the same pathname collapse to a single leaf; the
// newest variant wins for the link target so clicking "reopens what you last
// saw" instead of a stale utm link.
function buildTree(hostname, paths) {
  const root = {
    name: hostname,
    fullPath: '/',
    visit: null,
    fullKey: null,
    variantCount: 0,
    children: new Map(),
  }
  const entries =
    paths && typeof paths === 'object' && !Array.isArray(paths)
      ? Object.entries(paths)
      : []
  for (const [key, value] of entries) {
    const qIdx = key.indexOf('?')
    const pathname = qIdx === -1 ? key : key.slice(0, qIdx)
    const segments = pathname.split('/').filter(Boolean)
    let node = root
    for (const seg of segments) {
      let child = node.children.get(seg)
      if (!child) {
        const parentPath = node.fullPath === '/' ? '' : node.fullPath
        child = {
          name: seg,
          fullPath: `${parentPath}/${seg}`,
          visit: null,
          fullKey: null,
          variantCount: 0,
          children: new Map(),
        }
        node.children.set(seg, child)
      }
      node = child
    }
    node.variantCount += 1
    const prev = node.visit
    const prevAt = prev?.lastVisitedAt ?? ''
    const nextAt = value?.lastVisitedAt ?? ''
    if (!prev || nextAt > prevAt) {
      node.visit = value
      node.fullKey = key
    }
  }
  return root
}

function sortedChildren(node) {
  return [...node.children.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  )
}

// Recursive tree row. Depth drives the indent via a CSS var so the SCSS side
// stays declarative. Nodes with children get a chevron toggle; leaf nodes
// keep a spacer of the same width so labels line up in a column.
function TreeNode({ node, origin, depth, collapsed, onToggle }) {
  const hasChildren = node.children.size > 0
  const isCollapsed = hasChildren && collapsed.has(node.fullPath)
  const clickable = !!node.visit
  const title = node.visit?.title
  const href = clickable ? `${origin}${node.fullKey ?? node.fullPath}` : null

  return (
    <>
      <div className={styles.treeRow} style={{ '--tree-depth': depth }}>
        {hasChildren ? (
          <button
            type="button"
            className={styles.chevronBtn}
            onClick={() => onToggle(node.fullPath)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? `Expand ${node.name}` : `Collapse ${node.name}`}
          >
            {isCollapsed ? (
              <ChevronRight size={14} aria-hidden="true" />
            ) : (
              <ChevronDown size={14} aria-hidden="true" />
            )}
          </button>
        ) : (
          <span className={styles.chevronSpacer} aria-hidden="true" />
        )}

        {clickable ? (
          <a
            className={styles.treeLink}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={title || href}
          >
            <span className={styles.treeName}>{node.name}</span>
            {title && <span className={styles.treeTitle}>{title}</span>}
          </a>
        ) : (
          <span className={styles.treePlain}>
            <span className={styles.treeName}>{node.name}</span>
          </span>
        )}

        {node.variantCount > 1 && (
          <span
            className={styles.variantBadge}
            title={`${node.variantCount} query-string variants`}
          >
            ×{node.variantCount}
          </span>
        )}
      </div>

      {hasChildren && !isCollapsed && (
        <div className={styles.children}>
          {sortedChildren(node).map((child) => (
            <TreeNode
              key={child.fullPath}
              node={child}
              origin={origin}
              depth={depth + 1}
              collapsed={collapsed}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </>
  )
}

// One slide's content: the hostname header + its recursive tree body. Kept
// as a separate component so the collapsed-Set state can be scoped per host
// (independent trees don't step on each other's expand state).
function SiteTreeSlide({ hostname, label, origin, bucket }) {
  const [collapsed, setCollapsed] = useState(() => new Set())

  const tree = useMemo(
    () => buildTree(hostname, bucket?.paths),
    [hostname, bucket?.paths],
  )
  const pathCount = tree
    ? countLeaves(tree) // includes any root visit
    : 0

  function onToggle(fullPath) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(fullPath)) next.delete(fullPath)
      else next.add(fullPath)
      return next
    })
  }

  return (
    <div className={styles.slideBody}>
      <div className={styles.slideHead}>
        <Globe size={14} aria-hidden="true" className={styles.slideHeadIcon} />
        <div className={styles.slideHeadText}>
          <span className={styles.slideLabel}>{label}</span>
          <span className={styles.slideHost}>{hostname}</span>
        </div>
        <span className={styles.slideCount}>
          {pathCount === 1 ? '1 page' : `${pathCount} pages`}
        </span>
      </div>
      <div className={styles.slideScroll}>
        {pathCount === 0 ? (
          <p className={cx(styles.muted, styles.emptyTree)}>
            No pages captured for this site yet. Open a tab on{' '}
            <code>{hostname}</code> and it will show up here.
          </p>
        ) : (
          <TreeNode
            node={tree}
            origin={origin}
            depth={0}
            collapsed={collapsed}
            onToggle={onToggle}
          />
        )}
      </div>
    </div>
  )
}

// Total number of distinct pathnames represented in the tree — matches the
// count you'd get by summing variantCount at every node.
function countLeaves(root) {
  let n = 0
  const stack = [root]
  while (stack.length) {
    const node = stack.pop()
    n += node.variantCount
    for (const child of node.children.values()) stack.push(child)
  }
  return n
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
                <SiteTreeSlide
                  hostname={site.hostname}
                  label={site.label}
                  origin={site.origin}
                  bucket={site.bucket}
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

