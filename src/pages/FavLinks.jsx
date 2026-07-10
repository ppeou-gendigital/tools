import { useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  Check,
  ChevronDown,
  ChevronRight,
  Globe,
  Info,
  Pin,
  PinOff,
  Star,
  X,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Deck, Slide } from '@/blocks/Deck'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useFavorites } from '@/providers/FavoritesProvider'
import { usePinnedSites } from '@/providers/PinnedSitesProvider'
import { useTrackedHostnames } from '@/providers/TrackedHostnamesProvider'
import { useCurrentTabHost } from '@/hooks/useCurrentTabHost'
import { isJumpableUrl, readActiveTab } from '@/lib/activeTab'
import { getRebaseOrigin } from '@/lib/prefs'
import {
  canonicalizePattern,
  isValidPattern,
} from '@/lib/trackedHostnames'
import { cx } from '@/lib/cx'
import { isExtension } from '@/env'
import styles from './FavLinks.module.scss'

// Split a favorites paths object into a nested tree keyed by URL path
// segments. Same shape as SiteTree.buildTree, minus the visit metadata:
//
//   {
//     name:         'mysite.com',  // hostname at root; last segment elsewhere
//     fullPath:     '/',           // pathname from origin (no query)
//     bookmarked:   true|false,    // true when this exact path was favorited
//     variantKeys:  [],            // paths[] keys collapsed into this leaf
//                                  //   (>1 when query-string variants share
//                                  //   a pathname; used for delete)
//     children:     Map<string, Node>,
//   }
//
// Query-string variants at the same pathname collapse to a single leaf.
// Deleting a leaf drops every stored variant of that pathname — matches
// the "url-path (without query-param) is good" UX ask.
function buildFavTree(hostname, paths) {
  const root = {
    name: hostname,
    fullPath: '/',
    bookmarked: false,
    variantKeys: [],
    children: new Map(),
  }
  const entries =
    paths && typeof paths === 'object' && !Array.isArray(paths)
      ? Object.entries(paths)
      : []
  for (const [key] of entries) {
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
          bookmarked: false,
          variantKeys: [],
          children: new Map(),
        }
        node.children.set(seg, child)
      }
      node = child
    }
    node.bookmarked = true
    node.variantKeys.push(key)
  }
  return root
}

function sortedChildren(node) {
  return [...node.children.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  )
}

// Total number of bookmarked leaves in the tree — matches the flat count
// the header used to show.
function countBookmarked(root) {
  let n = 0
  const stack = [root]
  while (stack.length) {
    const cur = stack.pop()
    if (cur.bookmarked) n += 1
    for (const child of cur.children.values()) stack.push(child)
  }
  return n
}

// Recursive tree row. Depth drives the indent via a CSS var so the
// SCSS side stays declarative. Nodes with children get a chevron
// toggle; leaf nodes keep a spacer of the same width so labels line up
// in a column. Bookmarked nodes render as a link (path-only, no title)
// with a trailing delete button; intermediate folders are plain text.
function FavTreeNode({
  node,
  hostname,
  origin,
  depth,
  collapsed,
  onToggle,
  onRemove,
}) {
  const hasChildren = node.children.size > 0
  const isCollapsed = hasChildren && collapsed.has(node.fullPath)
  const clickable = node.bookmarked
  const href = clickable ? `${origin}${node.fullPath}` : null

  function handleRemove() {
    for (const key of node.variantKeys) {
      onRemove(hostname, key)
    }
  }

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
            title={href}
          >
            <span className={styles.treeName}>{node.name}</span>
          </a>
        ) : (
          <span className={styles.treePlain}>
            <span className={styles.treeName}>{node.name}</span>
          </span>
        )}

        {clickable ? (
          <button
            type="button"
            className={styles.treeDeleteBtn}
            onClick={handleRemove}
            aria-label={`Remove ${node.fullPath}`}
            title="Remove favorite"
          >
            <X size={14} aria-hidden="true" />
          </button>
        ) : (
          <span className={styles.chevronSpacer} aria-hidden="true" />
        )}
      </div>

      {hasChildren && !isCollapsed && (
        <div className={styles.children}>
          {sortedChildren(node).map((child) => (
            <FavTreeNode
              key={child.fullPath}
              node={child}
              hostname={hostname}
              origin={origin}
              depth={depth + 1}
              collapsed={collapsed}
              onToggle={onToggle}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </>
  )
}

// hostname -> { label, origin } lookup. AEM Jump entries opt-in a nicer
// label + origin; everything else falls back to raw hostname +
// https://<host>. Same shape as SiteTree so the two pages read the
// same way for a user.
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

// A per-domain slide: header (label + hostname + count) and the
// recursive tree body. Path-only labels — titles are intentionally
// suppressed at this level; the visual grouping under shared prefixes
// makes the working set of URLs read at a glance, and users who want
// the title can hover the link (browser tooltip carries the href).
function FavDomainSlide({ hostname, label, origin, bucket, onRemove }) {
  const [collapsed, setCollapsed] = useState(() => new Set())

  const tree = useMemo(
    () => buildFavTree(hostname, bucket?.paths),
    [hostname, bucket?.paths],
  )
  const bookmarkedCount = countBookmarked(tree)

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
          {bookmarkedCount === 1 ? '1 link' : `${bookmarkedCount} links`}
        </span>
      </div>
      <div className={styles.slideScroll}>
        {bookmarkedCount === 0 ? (
          <p className={cx(styles.muted, styles.emptyTree)}>
            No favorites for <code>{hostname}</code> yet.
          </p>
        ) : (
          <FavTreeNode
            node={tree}
            hostname={hostname}
            origin={origin}
            depth={0}
            collapsed={collapsed}
            onToggle={onToggle}
            onRemove={onRemove}
          />
        )}
      </div>
    </div>
  )
}

// The trailing "Manage pins" slide — the curation surface for the
// Fav Links deck. Two responsibilities, matching the scoped-down UX:
//
//   1. Toggle whether a domain shows up as its own slide (pin/unpin).
//      Unpinning does NOT delete favorites — the URLs stay in the
//      store so re-pinning restores the slide with its history intact.
//   2. Reorder pinned slides via up/down arrow buttons. Arrows only
//      render for pinned rows and disable at their respective edges
//      (top can't go up, bottom can't go down).
//
// Per-URL delete lives on the per-domain tree slide (X next to each
// bookmarked leaf); domain-level bulk delete is intentionally not
// exposed here — a user who wants to purge a domain unpins it, and
// deletes URLs individually if they want the underlying store cleared.
function ManagePinsSlide({
  rows,
  pinned,
  currentHost,
  onToggle,
  onMove,
}) {
  const isEmpty = rows.length === 0
  return (
    <div className={styles.slideBody}>
      <div className={styles.slideHead}>
        <Pin size={14} aria-hidden="true" className={styles.slideHeadIcon} />
        <div className={styles.slideHeadText}>
          <span className={styles.slideLabel}>Manage pins</span>
          <span className={styles.slideHost}>
            {isEmpty
              ? 'no favorites yet'
              : `${pinned.size} pinned / ${rows.length} total`}
          </span>
        </div>
      </div>
      <div className={styles.slideScroll}>
        {isEmpty ? (
          <EmptyState />
        ) : (
          <ul className={styles.pickerList}>
            {rows.map((row) => {
              const isPinned = pinned.has(row.hostname)
              const isCurrent = row.hostname === currentHost
              const isFirst = row.pinnedIndex === 0
              const isLast =
                row.pinnedIndex !== -1 && row.pinnedIndex === row.pinnedTotal - 1
              return (
                <li key={row.hostname}>
                  <div
                    className={cx(
                      styles.pickerRow,
                      isPinned && styles.pickerRowPinned,
                      isCurrent && styles.pickerRowCurrent,
                    )}
                  >
                    <button
                      type="button"
                      className={styles.pinToggleBtn}
                      onClick={() => onToggle(row.hostname)}
                      aria-pressed={isPinned}
                      title={isPinned ? 'Unpin from deck' : 'Pin to deck'}
                    >
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
                    <span className={styles.pickerText}>
                      <span className={styles.pickerLabel}>
                        {row.label}
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
                        {row.hostname}
                        {row.count > 0 && (
                          <>
                            {' · '}
                            {row.count === 1 ? '1 link' : `${row.count} links`}
                          </>
                        )}
                        {row.count === 0 && ' · no favorites yet'}
                      </span>
                    </span>
                    {isPinned && (
                      <>
                        <button
                          type="button"
                          className={styles.moveBtn}
                          onClick={() => onMove(row.hostname, -1)}
                          disabled={isFirst}
                          aria-label={`Move ${row.hostname} up`}
                          title={isFirst ? 'Already at top' : 'Move up'}
                        >
                          <ArrowUp size={14} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className={styles.moveBtn}
                          onClick={() => onMove(row.hostname, 1)}
                          disabled={isLast}
                          aria-label={`Move ${row.hostname} down`}
                          title={isLast ? 'Already at bottom' : 'Move down'}
                        >
                          <ArrowDown size={14} aria-hidden="true" />
                        </button>
                      </>
                    )}
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

function EmptyState() {
  const inExtension = isExtension()
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon} aria-hidden="true">
        <Star size={20} />
      </div>
      <p className={styles.muted}>
        {inExtension
          ? 'No favorites yet. Open a page you visit often and tap the bookmark icon above to save it here.'
          : 'No favorites yet. Bookmarking runs inside the Chrome extension — sign in there to sync favorites into the web app.'}
      </p>
    </div>
  )
}

export function FavLinks() {
  const {
    byDomain,
    addFavorite,
    removeFavorite,
    ready: favReady,
  } = useFavorites()
  const { domains } = useAemDomains()
  const { hosts, setHosts } = useTrackedHostnames()
  const {
    pinned,
    pinnedSet,
    toggle: togglePin,
    movePinned,
    ready: pinsReady,
  } = usePinnedSites()
  const currentHost = useCurrentTabHost()
  const [showInfo, setShowInfo] = useState(false)
  const [bookmarking, setBookmarking] = useState(false)
  // Transient inline confirmation for the bookmark action. Held long
  // enough to register the state change but short enough to feel snappy.
  const [flash, setFlash] = useState(null)

  const domainMeta = useMemo(() => buildDomainMeta(domains), [domains])

  // Every hostname the manage slide needs to think about. Union of:
  //   - favorited domains       (from the byDomain store)
  //   - pinned hostnames        (in case a pin exists without any favs
  //                              yet — rare but possible cross-device)
  //   - current tab's hostname  (so it can be pinned from here)
  const allSites = useMemo(() => {
    const seen = new Map()
    function add(hostname, bucket) {
      const key = hostname?.toLowerCase()
      if (!key) return
      if (seen.has(key)) return
      const meta = domainMeta.get(key)
      const paths =
        bucket?.paths &&
        typeof bucket.paths === 'object' &&
        !Array.isArray(bucket.paths)
          ? bucket.paths
          : {}
      seen.set(key, {
        hostname: key,
        bucket: bucket ?? null,
        label: meta?.label ?? key,
        origin: meta?.origin ?? `https://${key}`,
        count: Object.keys(paths).length,
      })
    }
    for (const [h, b] of Object.entries(byDomain)) add(h, b)
    for (const h of pinned) add(h, byDomain[h])
    if (currentHost) add(currentHost, byDomain[currentHost])
    return [...seen.values()]
  }, [byDomain, domainMeta, pinned, currentHost])

  // Deck slides — pinned domains only, in the user-specified pin order.
  // Current tab (if pinned) gets promoted to the front so opening the
  // page on a pinned site lands you on that site's slide immediately.
  // Unpinned rows never reach the deck; their favorites live in the
  // store until re-pinned.
  const deckSites = useMemo(() => {
    const bySite = new Map(allSites.map((s) => [s.hostname, s]))
    const pinnedSites = pinned
      .map((host) => bySite.get(host))
      .filter(Boolean)
    if (currentHost && pinnedSet.has(currentHost)) {
      const idx = pinnedSites.findIndex((s) => s.hostname === currentHost)
      if (idx > 0) {
        const [current] = pinnedSites.splice(idx, 1)
        pinnedSites.unshift(current)
      }
    }
    return pinnedSites
  }, [allSites, pinned, pinnedSet, currentHost])

  // Rows for the manage slide. Pinned domains keep their user order
  // (annotated with pinnedIndex + pinnedTotal so the ManagePinsSlide
  // can figure out which arrows to disable). Unpinned rows follow,
  // sorted by hostname so the list has a stable secondary order.
  const manageRows = useMemo(() => {
    const bySite = new Map(allSites.map((s) => [s.hostname, s]))
    const pinnedRows = pinned
      .map((host, i) => {
        const site = bySite.get(host)
        if (!site) return null
        return { ...site, pinnedIndex: i, pinnedTotal: pinned.length }
      })
      .filter(Boolean)
    const unpinnedRows = allSites
      .filter((s) => !pinnedSet.has(s.hostname))
      .sort((a, b) => {
        if (a.hostname === currentHost && b.hostname !== currentHost) return -1
        if (b.hostname === currentHost && a.hostname !== currentHost) return 1
        return a.hostname.localeCompare(b.hostname)
      })
      .map((s) => ({ ...s, pinnedIndex: -1, pinnedTotal: pinned.length }))
    return [...pinnedRows, ...unpinnedRows]
  }, [allSites, pinned, pinnedSet, currentHost])

  // Bookmark the current tab. Three side effects:
  //   1. Auto-track the domain (canonicalized include rule) if we don't
  //      already track it — so future visits also flow into the
  //      Visited URLs / Site Tree feeds without a separate opt-in.
  //   2. Add the URL to favorites, keyed by hostname + path+search.
  //   3. Auto-pin the domain if it isn't already. Without this, the
  //      user clicks bookmark and nothing visibly happens (the deck
  //      only shows pinned domains). Pinning here matches the intent:
  //      "I bookmarked this — I want to see it in the deck."
  async function handleBookmark() {
    if (bookmarking) return
    setBookmarking(true)
    setFlash(null)
    try {
      const info = await readActiveTab()
      if (!info || !isJumpableUrl(info.url)) {
        setFlash({ kind: 'error', message: "Can't bookmark this tab." })
        return
      }
      let hostname = ''
      let path = ''
      try {
        const parsed = new URL(info.url)
        hostname = parsed.hostname.toLowerCase()
        path = `${parsed.pathname || '/'}${parsed.search || ''}`
      } catch {
        setFlash({ kind: 'error', message: "Couldn't parse this tab's URL." })
        return
      }

      // Auto-track the domain via the same recipe as TrackThisSiteItem
      // so the two flows stay consistent (canonicalized pattern + valid
      // check + id assignment happens inside setHosts).
      const pattern = canonicalizePattern(info.url)
      if (isValidPattern(pattern) && !hosts[pattern]) {
        await setHosts((prev) => ({ ...prev, [pattern]: { mode: 'include' } }))
      }

      await addFavorite({
        hostname,
        path,
        title: info.title ?? '',
        addedAt: new Date().toISOString(),
      })
      if (!pinnedSet.has(hostname)) {
        await togglePin(hostname)
      }
      setFlash({ kind: 'ok', message: 'Bookmarked' })
    } catch (err) {
      console.warn('[loopy] bookmark failed:', err?.message ?? err)
      setFlash({ kind: 'error', message: 'Bookmark failed' })
    } finally {
      setBookmarking(false)
      // Clear the transient confirmation after a moment so it doesn't
      // linger between actions.
      setTimeout(() => setFlash(null), 1600)
    }
  }

  const canBookmark = isExtension()
  const ready = favReady && pinsReady

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Fav links</h1>
          {canBookmark && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={styles.iconBtn}
              aria-label="Bookmark current tab"
              title="Bookmark current tab"
              disabled={bookmarking}
            >
              {flash?.kind === 'ok' ? (
                <Check size={14} aria-hidden="true" />
              ) : (
                <Bookmark size={14} aria-hidden="true" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo((v) => !v)}
            className={styles.iconBtn}
            aria-label="About this page"
            aria-expanded={showInfo}
            aria-controls="fav-links-info"
            title="About"
          >
            <Info size={14} aria-hidden="true" />
          </Button>
          <PageShortcuts current="fav-links" className={styles.iconBtn} />
        </div>
        {showInfo && (
          <p id="fav-links-info" className={styles.subtitle}>
            Bookmark pages you&apos;re actively working on. Pinned sites
            get their own slide in the deck; the last slide is where you
            pin, unpin, and reorder them.
          </p>
        )}
        {flash?.kind === 'error' && (
          <p className={cx(styles.subtitle, styles.error)}>{flash.message}</p>
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
                data-fav-host={site.hostname}
              >
                <FavDomainSlide
                  hostname={site.hostname}
                  label={site.label}
                  origin={site.origin}
                  bucket={site.bucket}
                  onRemove={removeFavorite}
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
                rows={manageRows}
                pinned={pinnedSet}
                currentHost={currentHost}
                onToggle={togglePin}
                onMove={movePinned}
              />
            </Slide>
          </Deck>
        </div>
      )}
    </div>
  )
}
