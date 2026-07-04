import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eraser,
  Globe,
  History,
  Search,
  Trash2,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useVisitedUrls } from '@/providers/VisitedUrlsProvider'
import { getRebaseOrigin } from '@/lib/prefs'
import { formatWhen } from '@/lib/visitedUrls'
import { cx } from '@/lib/cx'
import { isExtension } from '@/env'
import styles from './VisitedUrls.module.scss'

// Build a lookup: hostname -> label (for the section header) and origin
// (for building the full "open" URL). Capture is driven by the tracked-
// hostnames list; AEM domains are consulted here only as an optional
// label enhancement. Any visit whose hostname doesn't match an AEM
// entry (the common case now) falls back to `hostname` as label and
// `https://<hostname>` as origin.
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
        kind: d.kind,
      })
    }
  }
  return meta
}

// Substring search over title + path so users can find a specific page
// they visited without remembering the exact URL. Case-insensitive.
function matchesQuery(entry, needle) {
  if (!needle) return true
  const hay = `${entry.title ?? ''} ${entry.path ?? ''}`.toLowerCase()
  return hay.includes(needle.toLowerCase())
}

export function VisitedUrls() {
  const { goBack, previousRouteLabel } = useNavigation()
  const { byDomain, clearAll, clearDomain, removePath, ready } =
    useVisitedUrls()
  const { domains } = useAemDomains()

  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState(() => new Set())

  const domainMeta = useMemo(() => buildDomainMeta(domains), [domains])

  // Section list: one per hostname, sorted by most-recent activity so the
  // freshest domain is at the top. Empty domains (no paths after filter)
  // are dropped so the search feels responsive.
  const sections = useMemo(() => {
    const needle = query.trim()
    const rows = Object.entries(byDomain).map(([hostname, bucket]) => {
      const pathObj =
        bucket?.paths &&
        typeof bucket.paths === 'object' &&
        !Array.isArray(bucket.paths)
          ? bucket.paths
          : {}
      const total = Object.keys(pathObj).length
      const filtered = Object.entries(pathObj)
        .map(([path, value]) => ({ path, ...value }))
        .filter((entry) => matchesQuery(entry, needle))
        .sort((a, b) => {
          const at = a.lastVisitedAt ?? ''
          const bt = b.lastVisitedAt ?? ''
          if (at === bt) return a.path < b.path ? -1 : a.path > b.path ? 1 : 0
          return at < bt ? 1 : -1
        })
      return { hostname, bucket, total, filtered }
    })
    rows.sort((a, b) => {
      const at = a.bucket.updatedAt ?? ''
      const bt = b.bucket.updatedAt ?? ''
      return at < bt ? 1 : at > bt ? -1 : 0
    })
    return needle
      ? rows.filter((r) => r.filtered.length > 0)
      : rows
  }, [byDomain, query])

  const totalPaths = useMemo(
    () =>
      Object.values(byDomain).reduce((sum, b) => {
        const paths =
          b?.paths && typeof b.paths === 'object' && !Array.isArray(b.paths)
            ? b.paths
            : {}
        return sum + Object.keys(paths).length
      }, 0),
    [byDomain],
  )
  const filteredTotal = useMemo(
    () => sections.reduce((sum, s) => sum + s.filtered.length, 0),
    [sections],
  )

  const totalDomains = Object.keys(byDomain).length
  const isEmpty = totalDomains === 0

  function toggle(hostname) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(hostname)) next.delete(hostname)
      else next.add(hostname)
      return next
    })
  }

  function handleClearAll() {
    const ok = window.confirm(
      `Clear all visited URLs? This removes ${totalPaths} entries across ${totalDomains} domains.`,
    )
    if (!ok) return
    clearAll()
  }

  function handleClearDomain(hostname, count) {
    const ok = window.confirm(
      `Clear all ${count} visited URLs for ${hostname}?`,
    )
    if (!ok) return
    clearDomain(hostname)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className={styles.back}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {previousRouteLabel ?? 'Back'}
        </Button>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Visited URLs</h1>
          <p className={styles.subtitle}>
            Pages you&apos;ve opened on your configured AEM domains. Updates
            live in the background as you browse.
          </p>
        </div>
        {!isEmpty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className={styles.clearAllBtn}
            title="Clear all visited URLs"
          >
            <Eraser size={14} aria-hidden="true" />
            Clear all
          </Button>
        )}
      </div>

      {!isEmpty && (
        <div className={styles.filters} role="search">
          <div className={styles.searchField}>
            <Search size={14} aria-hidden="true" className={styles.searchIcon} />
            <Input
              id="visited-search"
              name="visited-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or path…"
              aria-label="Search visited URLs"
              className={styles.searchInput}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div className={styles.count} aria-live="polite">
            {query.trim() ? `${filteredTotal}/${totalPaths}` : totalPaths}
          </div>
        </div>
      )}

      {!ready ? (
        <p className={styles.muted}>Loading…</p>
      ) : isEmpty ? (
        <EmptyState />
      ) : sections.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.muted}>No visits match your search.</p>
          <Button variant="ghost" size="sm" onClick={() => setQuery('')}>
            Clear search
          </Button>
        </div>
      ) : (
        <ul className={styles.sections}>
          {sections.map(({ hostname, total, filtered }) => {
            const meta = domainMeta.get(hostname)
            const label = meta?.label ?? hostname
            const origin = meta?.origin ?? `https://${hostname}`
            const isCollapsed = collapsed.has(hostname)
            return (
              <li key={hostname} className={styles.section}>
                <div className={styles.sectionHead}>
                  <button
                    type="button"
                    className={styles.sectionToggle}
                    onClick={() => toggle(hostname)}
                    aria-expanded={!isCollapsed}
                    aria-controls={`visited-list-${hostname}`}
                  >
                    {isCollapsed ? (
                      <ChevronRight size={14} aria-hidden="true" />
                    ) : (
                      <ChevronDown size={14} aria-hidden="true" />
                    )}
                    <Globe
                      size={14}
                      aria-hidden="true"
                      className={styles.sectionIcon}
                    />
                    <span className={styles.sectionLabel}>{label}</span>
                    <span className={styles.sectionHost}>{hostname}</span>
                  </button>
                  <span className={styles.sectionCount}>
                    {query.trim()
                      ? `${filtered.length}/${total}`
                      : total}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleClearDomain(hostname, total)}
                    className={cx(styles.actionBtn, styles.actionDelete)}
                    aria-label={`Clear ${label}`}
                    title="Clear this domain"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </Button>
                </div>
                {!isCollapsed && (
                  <ul
                    id={`visited-list-${hostname}`}
                    className={styles.pathList}
                  >
                    {filtered.map((entry) => (
                      <li key={entry.path} className={styles.pathRow}>
                        <a
                          className={styles.pathLink}
                          href={`${origin}${entry.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Open ${origin}${entry.path}`}
                        >
                          <span className={styles.pathTitle}>
                            {entry.title || (
                              <span className={styles.mutedInline}>
                                (no title)
                              </span>
                            )}
                          </span>
                          <span className={styles.pathText}>{entry.path}</span>
                        </a>
                        <span className={styles.pathMeta}>
                          <span className={styles.metaWhen}>
                            {formatWhen(entry.lastVisitedAt)}
                          </span>
                          {entry.visitCount > 1 && (
                            <span
                              className={styles.metaCount}
                              title={`Visited ${entry.visitCount} times`}
                            >
                              ×{entry.visitCount}
                            </span>
                          )}
                        </span>
                        <div className={styles.pathActions}>
                          <a
                            className={cx(styles.actionBtn, styles.iconLink)}
                            href={`${origin}${entry.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${entry.title || entry.path}`}
                            title="Open"
                          >
                            <ExternalLink size={14} aria-hidden="true" />
                          </a>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removePath(hostname, entry.path)}
                            className={cx(
                              styles.actionBtn,
                              styles.actionDelete,
                            )}
                            aria-label={`Delete ${entry.title || entry.path}`}
                            title="Delete"
                          >
                            <Trash2 size={14} aria-hidden="true" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      )}
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
          ? 'No visits yet. Open a tab on one of your AEM domains and it will show up here.'
          : 'No visits yet. Capture only runs inside the Chrome extension — sign in there to sync visits into the web app.'}
      </p>
    </div>
  )
}
