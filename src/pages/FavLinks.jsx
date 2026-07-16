import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Check,
  Eraser,
  Globe,
  Info,
  Pencil,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useFavorites } from '@/providers/FavoritesProvider'
import { useFavoritesOrder } from '@/providers/FavoritesOrderProvider'
import { getRebaseOrigin } from '@/lib/prefs'
import { cx } from '@/lib/cx'
import { isExtension } from '@/env'
import styles from './FavLinks.module.scss'

// Build a lookup: hostname -> { label, origin } used for friendlier
// group headers when the domain is a configured AEM environment.
// Mirrors the buildDomainMeta helper on Site Tree.
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

// Parse a user-entered URL into the (hostname, path+search+hash) shape
// the storage layer keys on. Returns null when the input isn't a real
// http(s) URL so the caller can surface an inline error instead of
// silently corrupting the store.
function parseEditedUrl(input) {
  const trimmed = String(input ?? '').trim()
  if (!trimmed) return null
  try {
    const u = new URL(trimmed)
    if (!/^https?:$/i.test(u.protocol)) return null
    const hostname = u.hostname.toLowerCase()
    if (!hostname) return null
    const path = `${u.pathname || '/'}${u.search || ''}${u.hash || ''}`
    return { hostname, path }
  } catch {
    return null
  }
}

// One favorited URL as a single-line grid row. Two visual states:
//   - View: the whole row is an anchor so clicking anywhere opens the
//     link in a new tab (matches Site Tree behavior). Hover reveals
//     edit + remove buttons.
//   - Edit: same grid slots, but title/URL become inputs and the
//     hover buttons flip to save (Check) + cancel (X). Save on Enter,
//     cancel on Escape.
//
// Both label spans carry a `title` HTML attribute so long values get a
// browser-native hover tooltip.
function FavRow({
  hostname,
  path,
  entry,
  origin,
  canModify,
  onRemove,
  onUpdate,
}) {
  const fullUrl = `${origin}${path}`
  const label = entry?.title?.trim() || '(untitled)'

  const [isEditing, setIsEditing] = useState(false)
  const [titleDraft, setTitleDraft] = useState(entry?.title ?? '')
  const [urlDraft, setUrlDraft] = useState(fullUrl)
  const [error, setError] = useState('')
  const titleInputRef = useRef(null)

  // Reset drafts whenever the underlying entry changes so a remote
  // update (e.g. PrefsSync applying a pulled snapshot) doesn't leave
  // a stale in-progress edit dangling.
  useEffect(() => {
    if (!isEditing) {
      setTitleDraft(entry?.title ?? '')
      setUrlDraft(fullUrl)
    }
  }, [entry?.title, fullUrl, isEditing])

  // Focus the title on entering edit mode so the user can start typing
  // immediately after clicking the pencil.
  useEffect(() => {
    if (isEditing) titleInputRef.current?.focus()
  }, [isEditing])

  function enterEdit(e) {
    e.preventDefault()
    e.stopPropagation()
    setTitleDraft(entry?.title ?? '')
    setUrlDraft(fullUrl)
    setError('')
    setIsEditing(true)
  }

  function cancelEdit() {
    setTitleDraft(entry?.title ?? '')
    setUrlDraft(fullUrl)
    setError('')
    setIsEditing(false)
  }

  function saveEdit() {
    const parsed = parseEditedUrl(urlDraft)
    if (!parsed) {
      setError('Enter a valid http(s) URL')
      return
    }
    onUpdate(hostname, path, {
      hostname: parsed.hostname,
      path: parsed.path,
      title: titleDraft.trim(),
    })
    setError('')
    setIsEditing(false)
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEdit()
    }
  }

  if (isEditing) {
    return (
      <div
        className={cx(styles.row, styles.rowEditing)}
        role="group"
        aria-label="Edit favorite"
      >
        <input
          ref={titleInputRef}
          type="text"
          className={cx(styles.rowInput, styles.rowTitle)}
          value={titleDraft}
          onChange={(e) => setTitleDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Title"
          aria-label="Title"
        />
        <input
          type="url"
          className={cx(styles.rowInput, styles.rowUrl)}
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="https://…"
          aria-label="URL"
          aria-invalid={!!error}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
        <span className={styles.rowActions}>
          <button
            type="button"
            className={cx(styles.rowIconBtn, styles.rowSave)}
            onClick={saveEdit}
            aria-label="Save changes"
            title="Save (Enter)"
          >
            <Check size={12} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.rowIconBtn}
            onClick={cancelEdit}
            aria-label="Cancel edit"
            title="Cancel (Esc)"
          >
            <X size={12} aria-hidden="true" />
          </button>
        </span>
        {error && (
          <span className={styles.rowError} role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }

  return (
    <a
      className={styles.row}
      href={fullUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
    >
      <span className={styles.rowTitle} title={label}>
        {label}
      </span>
      <span className={styles.rowUrl} title={fullUrl}>
        {fullUrl}
      </span>
      {canModify && (
        <span className={styles.rowActions}>
          <button
            type="button"
            className={styles.rowIconBtn}
            onClick={enterEdit}
            aria-label="Edit favorite"
            title="Edit"
          >
            <Pencil size={12} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.rowIconBtn}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onRemove(hostname, path)
            }}
            aria-label="Remove favorite"
            title="Remove favorite"
          >
            <X size={12} aria-hidden="true" />
          </button>
        </span>
      )}
    </a>
  )
}

// One domain group: sticky-ish header + rows. Header carries the
// friendly label, hostname, count, reorder buttons, and a "clear this
// domain" button. Rows come pre-filtered so the group is only rendered
// when at least one row survives the search.
function FavGroup({
  hostname,
  label,
  origin,
  rows,
  totalCount,
  index,
  lastIndex,
  canModify,
  onMoveUp,
  onMoveDown,
  onRemoveRow,
  onUpdateRow,
  onClearDomain,
}) {
  const filteredCount = rows.length
  const upDisabled = index === 0
  const downDisabled = index === lastIndex
  return (
    <section className={styles.group} aria-label={label}>
      <header className={styles.groupHead}>
        <Globe
          size={14}
          aria-hidden="true"
          className={styles.groupIcon}
        />
        <div className={styles.groupText}>
          <span className={styles.groupLabel}>{label}</span>
          <span className={styles.groupHost}>{hostname}</span>
        </div>
        <span className={styles.groupCount}>
          {filteredCount === totalCount
            ? totalCount === 1
              ? '1 link'
              : `${totalCount} links`
            : `${filteredCount} / ${totalCount}`}
        </span>
        <div className={styles.groupActions}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMoveUp(hostname)}
            disabled={upDisabled}
            aria-label={`Move ${label} up`}
            title="Move up"
            className={styles.iconBtn}
          >
            <ArrowUp size={14} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMoveDown(hostname)}
            disabled={downDisabled}
            aria-label={`Move ${label} down`}
            title="Move down"
            className={styles.iconBtn}
          >
            <ArrowDown size={14} aria-hidden="true" />
          </Button>
          {canModify && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClearDomain(hostname)}
              aria-label={`Remove all favorites for ${label}`}
              title="Remove all favorites for this domain"
              className={styles.iconBtn}
            >
              <Trash2 size={14} aria-hidden="true" />
            </Button>
          )}
        </div>
      </header>
      <ul className={styles.rows}>
        {rows.map(([path, entry]) => (
          <li key={path}>
            <FavRow
              hostname={hostname}
              path={path}
              entry={entry}
              origin={origin}
              canModify={canModify}
              onRemove={onRemoveRow}
              onUpdate={onUpdateRow}
            />
          </li>
        ))}
      </ul>
    </section>
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
          ? 'No favorites yet. Click the star in any page toolbar to save the current tab, or star a URL on the Site Tree page.'
          : 'No favorites yet. Saving runs inside the Chrome extension — sign in there to sync favorites into the web app.'}
      </p>
    </div>
  )
}

// Match a fav row against the search box. Case-insensitive substring
// match against the row's title, the reconstructed full URL, the
// group's friendly label (e.g. "EDS UE Stage"), and its hostname.
// Including the group fields means typing part of a domain name (or a
// configured AEM environment label) shows every favorite under that
// domain — which matches how users think about the list.
function rowMatchesQuery(query, entry, fullUrl, groupLabel, groupHost) {
  if (!query) return true
  const q = query.toLowerCase()
  if ((entry?.title ?? '').toLowerCase().includes(q)) return true
  if (fullUrl.toLowerCase().includes(q)) return true
  if ((groupLabel ?? '').toLowerCase().includes(q)) return true
  if ((groupHost ?? '').toLowerCase().includes(q)) return true
  return false
}

export function FavLinks() {
  const {
    byDomain,
    removeFavorite,
    updateFavorite,
    clearDomain,
    clearAll,
    ready: favReady,
    canModify,
  } = useFavorites()
  const {
    order,
    moveDomain,
    ready: orderReady,
  } = useFavoritesOrder()
  const { domains } = useAemDomains()

  const [query, setQuery] = useState('')
  const [showInfo, setShowInfo] = useState(false)

  const domainMeta = useMemo(() => buildDomainMeta(domains), [domains])

  // Ordered list of hostnames to render.
  //   1. Every hostname in `order` (in that sequence) that still has a
  //      bucket in byDomain.
  //   2. Any hostname in byDomain not yet in order, appended in
  //      freshest-first (updatedAt desc) tiebreak so brand-new domains
  //      show at the bottom without demanding an explicit reorder.
  const orderedHostnames = useMemo(() => {
    const seen = new Set()
    const out = []
    for (const host of order) {
      if (!(host in byDomain)) continue
      if (seen.has(host)) continue
      seen.add(host)
      out.push(host)
    }
    const remaining = Object.keys(byDomain).filter((h) => !seen.has(h))
    remaining.sort((a, b) => {
      const at = byDomain[a]?.updatedAt ?? ''
      const bt = byDomain[b]?.updatedAt ?? ''
      if (at !== bt) return at < bt ? 1 : -1
      return a.localeCompare(b)
    })
    for (const host of remaining) out.push(host)
    return out
  }, [order, byDomain])

  // Filter rows per group by the search query. Groups whose rows all
  // drop out are hidden so the page never shows an empty header. Each
  // group's rows come out newest-first so recent favorites lead.
  const visibleGroups = useMemo(() => {
    const groups = []
    for (const hostname of orderedHostnames) {
      const bucket = byDomain[hostname]
      const paths = bucket?.paths ?? {}
      const totalCount = Object.keys(paths).length
      if (totalCount === 0) continue

      const meta = domainMeta.get(hostname)
      const origin = meta?.origin ?? `https://${hostname}`
      const label = meta?.label ?? hostname

      const entries = Object.entries(paths).sort((a, b) => {
        const at = a[1]?.addedAt ?? ''
        const bt = b[1]?.addedAt ?? ''
        if (at !== bt) return at < bt ? 1 : -1
        return a[0].localeCompare(b[0])
      })

      const rows = entries.filter(([path, entry]) =>
        rowMatchesQuery(query, entry, `${origin}${path}`, label, hostname),
      )
      if (rows.length === 0) continue

      groups.push({
        hostname,
        label,
        origin,
        totalCount,
        rows,
      })
    }
    return groups
  }, [orderedHostnames, byDomain, domainMeta, query])

  const ready = favReady && orderReady
  const isEmpty = orderedHostnames.length === 0
  const noMatches = !isEmpty && visibleGroups.length === 0

  // Aggregate counts used by the confirm gate on "Clear all". Cheap to
  // recompute on every render given the 200-per-domain cap.
  const { totalDomains, totalPaths } = useMemo(() => {
    let paths = 0
    for (const host of orderedHostnames) {
      paths += Object.keys(byDomain[host]?.paths ?? {}).length
    }
    return { totalDomains: orderedHostnames.length, totalPaths: paths }
  }, [orderedHostnames, byDomain])

  function handleClearAll() {
    const ok = window.confirm(
      `Clear all favorites? This removes ${totalPaths} ${
        totalPaths === 1 ? 'entry' : 'entries'
      } across ${totalDomains} ${totalDomains === 1 ? 'domain' : 'domains'}.`,
    )
    if (!ok) return
    clearAll()
  }

  return (
    <div className={styles.page}>
      {/* Sticky wrapper — title row and the search row pin to the top
          of the scroll region as one bar. See the module.scss header
          comment for the layout rationale. */}
      <div className={styles.topbar}>
        <header className={styles.header}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>Fav links</h1>
            {!isEmpty && canModify && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className={styles.clearAllBtn}
                title="Clear all favorites"
              >
                <Eraser size={14} aria-hidden="true" />
                Clear all
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
              Click the star icon in any page toolbar to save the current
              tab. Reorder groups with the arrows. Search filters by
              title and URL.
            </p>
          )}
        </header>

        {ready && (
          <label className={styles.searchWrap}>
            <Search
              size={14}
              aria-hidden="true"
              className={styles.searchIcon}
            />
            <input
              type="search"
              className={styles.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, URL, or domain…"
              aria-label="Search favorites"
            />
            {query && (
              <button
                type="button"
                className={styles.searchClear}
                onClick={() => setQuery('')}
                aria-label="Clear search"
                title="Clear"
              >
                <X size={12} aria-hidden="true" />
              </button>
            )}
          </label>
        )}
      </div>

      {!ready ? (
        <p className={styles.muted}>Loading…</p>
      ) : isEmpty ? (
        <EmptyState />
      ) : noMatches ? (
        <p className={cx(styles.muted, styles.noMatches)}>
          No favorites match <code>{query}</code>.
        </p>
      ) : (
        <div className={styles.groups}>
          {visibleGroups.map((g, i) => (
            <FavGroup
              key={g.hostname}
              hostname={g.hostname}
              label={g.label}
              origin={g.origin}
              rows={g.rows}
              totalCount={g.totalCount}
              index={i}
              lastIndex={visibleGroups.length - 1}
              canModify={canModify}
              onMoveUp={(host) => moveDomain(host, -1)}
              onMoveDown={(host) => moveDomain(host, +1)}
              onRemoveRow={removeFavorite}
              onUpdateRow={updateFavorite}
              onClearDomain={clearDomain}
            />
          ))}
        </div>
      )}
    </div>
  )
}
