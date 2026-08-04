import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  Globe,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Divider } from '@/molecules/Divider'
import {
  buildTree,
  compressPathNode,
  sortedChildren,
} from '@/lib/pathTree'
import {
  DELIVERY_KINDS,
  defaultEdsDomain,
  formatDeliveryKindBadge,
  normalizeDeliveryKind,
  normalizeEdsDomainOrigin,
  normalizeEdsDomains,
} from '@/lib/aemAuthorSites'
import {
  edsUeUiSiteKey,
  readEdsUeUi,
  writeEdsUeUi,
} from '@/lib/aemEdsUeUi'
import { buildEdsUePageLinks } from '@/lib/edsUePageLinks'
import { cx } from '@/lib/cx'
import styles from './EdsUeTree.module.scss'

function filterPathsByQuery(paths, query) {
  const q = String(query || '')
    .trim()
    .toLowerCase()
  if (!q) return paths
  const out = {}
  for (const [path, meta] of Object.entries(paths || {})) {
    const title = String(meta?.title || '').toLowerCase()
    const resourcePath = String(
      meta?.resourcePath || path || '',
    ).toLowerCase()
    if (resourcePath.includes(q) || title.includes(q) || path.toLowerCase().includes(q)) {
      out[path] = meta
    }
  }
  return out
}

function CompressedName({ parts, title }) {
  return (
    <>
      <span className={styles.treeName} title={parts.join('/')}>
        {parts.map((part, i) => (
          <span key={`${i}:${part}`}>
            {i > 0 && (
              <span className={styles.pathSep} aria-hidden="true">
                /
              </span>
            )}
            {part}
          </span>
        ))}
      </span>
      {title && <span className={styles.treeTitle}>{title}</span>}
    </>
  )
}

function ActionLink({ href, label, children }) {
  if (!href) {
    return <span className={styles.actionSpacer} aria-hidden="true" />
  }
  return (
    <a
      className={styles.actionBtn}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  )
}

function TreeNode({
  node,
  domain,
  allDomains,
  edsDomains,
  depth,
  collapsed,
  onToggle,
}) {
  const { tip, parts } = useMemo(() => compressPathNode(node), [node])
  const hasChildren = tip.children.size > 0
  const isCollapsed = hasChildren && collapsed.has(tip.fullPath)
  const visit = tip.visit
  const isLeaf = !!visit
  const title = visit?.title
  const pageKind = visit?.pageKind

  const links = useMemo(() => {
    if (!visit?.resourcePath) {
      return { edit: null, preview: null, live: null }
    }
    return buildEdsUePageLinks({
      domain,
      resourcePath: visit.resourcePath,
      pageKind: visit.pageKind,
      vanityPath: visit.vanityPath,
      allDomains,
      edsDomains,
    })
  }, [visit, domain, allDomains, edsDomains])

  return (
    <>
      <div
        className={styles.treeRow}
        style={{ '--tree-depth': depth }}
      >
        {hasChildren ? (
          <button
            type="button"
            className={styles.chevronBtn}
            onClick={() => onToggle(tip.fullPath)}
            aria-expanded={!isCollapsed}
            aria-label={
              isCollapsed ? `Expand ${parts.join('/')}` : `Collapse ${parts.join('/')}`
            }
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

        {isLeaf ? (
          <span className={styles.actionGroup}>
            <ActionLink href={links.edit} label="Edit">
              <Pencil size={12} aria-hidden="true" />
            </ActionLink>
            <ActionLink href={links.preview} label="Preview">
              <Eye size={12} aria-hidden="true" />
            </ActionLink>
            <ActionLink href={links.live} label="Live">
              <ExternalLink size={12} aria-hidden="true" />
            </ActionLink>
          </span>
        ) : (
          <span className={styles.actionGroup} aria-hidden="true">
            <span className={styles.actionSpacer} />
            <span className={styles.actionSpacer} />
            <span className={styles.actionSpacer} />
          </span>
        )}

        <span className={isLeaf ? styles.treeLeaf : styles.treePlain}>
          <CompressedName parts={parts} title={isLeaf ? title : undefined} />
          {pageKind === 'fragment' && (
            <span className={styles.fragBadge} title="Experience fragment">
              xf
            </span>
          )}
        </span>
      </div>

      {hasChildren && !isCollapsed && (
        <div className={styles.children}>
          {sortedChildren(tip).map((child) => (
            <TreeNode
              key={child.fullPath}
              node={child}
              domain={domain}
              allDomains={allDomains}
              edsDomains={edsDomains}
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

function hostnameOf(origin) {
  try {
    return new URL(origin).hostname
  } catch {
    return origin
  }
}

function EdsDomainsPanel({ domains, onChange, onClose }) {
  const [draft, setDraft] = useState('')
  const [error, setError] = useState(null)
  const list = normalizeEdsDomains(domains)

  function commit(next) {
    onChange?.(normalizeEdsDomains(next))
  }

  function handleAdd(e) {
    e.preventDefault()
    const origin = normalizeEdsDomainOrigin(draft)
    if (!origin) {
      setError('Enter a valid host or URL')
      return
    }
    if (list.some((d) => d.origin === origin)) {
      setError('Already added')
      return
    }
    setError(null)
    setDraft('')
    commit([
      ...list,
      { origin, isDefault: list.length === 0 },
    ])
  }

  function setDefault(origin) {
    commit(list.map((d) => ({ ...d, isDefault: d.origin === origin })))
  }

  function remove(origin) {
    commit(list.filter((d) => d.origin !== origin))
  }

  return (
    <div className={styles.domainsPanel} role="dialog" aria-label="EDS domains">
      <div className={styles.domainsPanelHead}>
        <span className={styles.domainsPanelTitle}>EDS domains</span>
        <button
          type="button"
          className={styles.domainsPanelClose}
          onClick={onClose}
          aria-label="Close domains"
          title="Close"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
      {list.length === 0 ? (
        <p className={styles.domainsEmpty}>
          Add an aem.live host or vanity (e.g. lifelock-stage.norton.com).
        </p>
      ) : (
        <ul className={styles.domainsList}>
          {list.map((d) => (
            <li key={d.origin} className={styles.domainsRow}>
              <label className={styles.domainsDefault}>
                <input
                  type="radio"
                  name="eds-domain-default"
                  checked={d.isDefault}
                  onChange={() => setDefault(d.origin)}
                  title="Default for Preview / Live"
                />
                <span className={styles.domainsHost} title={d.origin}>
                  {d.label || hostnameOf(d.origin)}
                </span>
              </label>
              <span
                className={styles.domainsKind}
                title={d.kind === 'eds' ? 'EDS (aem.live / aem.page)' : 'Vanity'}
              >
                {d.kind === 'eds' ? 'EDS' : 'Vanity'}
              </span>
              <button
                type="button"
                className={styles.domainsRemove}
                onClick={() => remove(d.origin)}
                aria-label={`Remove ${hostnameOf(d.origin)}`}
                title="Remove"
              >
                <Trash2 size={12} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <form className={styles.domainsAdd} onSubmit={handleAdd}>
        <input
          type="url"
          className={styles.domainsInput}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            if (error) setError(null)
          }}
          placeholder="https://main--repo--owner.aem.live"
          aria-label="Add EDS or vanity domain"
          autoComplete="off"
          spellCheck={false}
        />
        <Button type="submit" variant="ghost" size="sm" title="Add domain">
          <Plus size={14} aria-hidden="true" />
          Add
        </Button>
      </form>
      {error && <p className={styles.domainsError}>{error}</p>}
    </div>
  )
}

function formatScannedAt(iso) {
  if (!iso) return null
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return null
    return d.toLocaleString()
  } catch {
    return null
  }
}

function subtitleForDomain(domain) {
  if (!domain) return ''
  if (domain.kind === 'eds-ue' || domain.kind === 'eds-da') {
    const parts = [domain.owner, domain.repo, domain.ref].filter(Boolean)
    return parts.length ? parts.join('/') : domain.label || domain.id
  }
  try {
    if (domain.origin) return new URL(domain.origin).hostname
    if (domain.authorOrigin) return new URL(domain.authorOrigin).hostname
  } catch {
    /* fall through */
  }
  return domain.origin || domain.authorOrigin || domain.id
}

const KIND_RADIOS = DELIVERY_KINDS.map((kind) => ({
  value: kind,
  label: formatDeliveryKindBadge(kind) || kind,
}))

export function EdsUeTreeSlide({
  domain,
  deliveryKind,
  deliveryKindManual = false,
  edsDomains = [],
  allDomains,
  paths,
  scannedAt,
  scanning,
  error,
  onScan,
  onDeliveryKindChange,
  onEdsDomainsChange,
  canScan = true,
  sitePath,
  authorHost,
}) {
  const uiKey = edsUeUiSiteKey(authorHost, sitePath)
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [domainsOpen, setDomainsOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    const saved = readEdsUeUi(uiKey)
    return new Set(saved.collapsed)
  })
  const [query, setQuery] = useState(() => readEdsUeUi(uiKey).query)

  const domains = useMemo(
    () => normalizeEdsDomains(edsDomains),
    [edsDomains],
  )
  const defaultDomain = defaultEdsDomain(domains)

  // Persist search + collapse; slide remounts via key when site/host changes.
  useEffect(() => {
    writeEdsUeUi(uiKey, {
      query,
      collapsed: [...collapsed],
    })
  }, [uiKey, query, collapsed])

  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const treeKey = sitePath || domain?.id || 'site'
  const filteredPaths = useMemo(
    () => filterPathsByQuery(paths, query),
    [paths, query],
  )
  const tree = useMemo(
    () => buildTree(treeKey, filteredPaths),
    [treeKey, filteredPaths],
  )
  // Each paths entry is one scanned page/fragment leaf.
  const totalCount =
    paths && typeof paths === 'object' ? Object.keys(paths).length : 0
  const matchCount =
    filteredPaths && typeof filteredPaths === 'object'
      ? Object.keys(filteredPaths).length
      : 0
  const searching = query.trim().length > 0
  // While searching, keep the tree expanded so matches stay visible.
  const effectiveCollapsed = searching ? new Set() : collapsed
  const scannedLabel = formatScannedAt(scannedAt)
  const kindValue =
    normalizeDeliveryKind(deliveryKind) ||
    normalizeDeliveryKind(domain?.kind) ||
    'cloud'
  const typeLabel = formatDeliveryKindBadge(kindValue) || 'Cloud'
  const title =
    domain?.label?.trim() ||
    sitePath?.split('/').filter(Boolean).pop() ||
    subtitleForDomain(domain)
  const countLabel = searching
    ? `${matchCount} of ${totalCount}`
    : totalCount === 1
      ? '1 page'
      : `${totalCount} pages`
  const titleLine = `${title} (${typeLabel}) (${countLabel})`
  const pathLabel = sitePath || authorHost || subtitleForDomain(domain)
  const searchId = `eds-search-${String(sitePath || treeKey).replace(/\W+/g, '-')}`

  function onToggle(fullPath) {
    if (searching) return
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(fullPath)) next.delete(fullPath)
      else next.add(fullPath)
      return next
    })
  }

  function handleRefresh() {
    setMenuOpen(false)
    onScan?.()
  }

  function openDomainsPanel() {
    setMenuOpen(false)
    setDomainsOpen(true)
  }

  const domainsSummary = defaultDomain
    ? domains.length > 1
      ? `${hostnameOf(defaultDomain.origin)} · +${domains.length - 1}`
      : hostnameOf(defaultDomain.origin)
    : 'No EDS domains'

  return (
    <div className={styles.slideBody}>
      <header className={styles.slideHead}>
        <div className={styles.slideHeadTop}>
          <div className={styles.slideHeadText}>
            <h2 className={styles.slideLabel} title={titleLine}>
              {titleLine}
            </h2>
            <p className={styles.slidePath} title={pathLabel}>
              {pathLabel}
            </p>
            <button
              type="button"
              className={styles.domainsSummary}
              onClick={() => setDomainsOpen((v) => !v)}
              title="Manage EDS domains"
              aria-expanded={domainsOpen}
            >
              <Globe size={12} aria-hidden="true" />
              <span className={styles.domainsSummaryText}>{domainsSummary}</span>
            </button>
          </div>
          <div ref={menuRef} className={styles.menuWrap}>
            <Button
              variant="ghost"
              size="sm"
              className={styles.menuTrigger}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={`Actions for ${title}`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              title="Site actions"
            >
              <MoreHorizontal size={16} aria-hidden="true" />
            </Button>
            {menuOpen && (
              <div
                role="menu"
                className={styles.menu}
                aria-label={`${title} actions`}
              >
                <button
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  onClick={handleRefresh}
                  disabled={scanning || !canScan}
                  title={
                    !canScan
                      ? 'Scan runs in the Chrome extension'
                      : scannedLabel
                        ? `Last scanned ${scannedLabel}`
                        : 'Refresh pages for this site'
                  }
                >
                  <RefreshCw size={14} aria-hidden="true" />
                  <span>{scanning ? 'Scanning…' : 'Refresh'}</span>
                </button>
                {typeof onEdsDomainsChange === 'function' && (
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.menuItem}
                    onClick={openDomainsPanel}
                  >
                    <Globe size={14} aria-hidden="true" />
                    <span>Domains…</span>
                  </button>
                )}
                {typeof onDeliveryKindChange === 'function' && (
                  <>
                    <Divider className={styles.menuDivider} />
                    <fieldset className={styles.kindFieldset}>
                      <legend className={styles.kindLegend}>
                        Type
                        {deliveryKindManual ? ' (manual)' : ''}
                      </legend>
                      {KIND_RADIOS.map((opt) => (
                        <label
                          key={opt.value}
                          className={styles.kindOption}
                        >
                          <input
                            type="radio"
                            name={`kind-${searchId}`}
                            value={opt.value}
                            checked={kindValue === opt.value}
                            onChange={() => onDeliveryKindChange(opt.value)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </fieldset>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {domainsOpen && typeof onEdsDomainsChange === 'function' && (
          <EdsDomainsPanel
            domains={domains}
            onChange={onEdsDomainsChange}
            onClose={() => setDomainsOpen(false)}
          />
        )}

        <div className={styles.searchRow}>
          <Search
            size={14}
            aria-hidden="true"
            className={styles.searchIcon}
          />
          <input
            id={searchId}
            type="search"
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search path or page name…"
            aria-label={`Search pages in ${title}`}
            disabled={totalCount === 0 && !searching}
            autoComplete="off"
            spellCheck={false}
          />
          {searching && (
            <button
              type="button"
              className={styles.searchClear}
              onClick={() => setQuery('')}
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </header>

      <div className={styles.slideScroll}>
        {error && (
          <div className={styles.errorBlock}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}
        {!canScan && !error && (
          <p className={cx(styles.muted, styles.emptyTree)}>
            Author scan runs inside the Chrome extension. Open Loopy from an
            Author tab, then Refresh.
          </p>
        )}
        {canScan && !error && totalCount === 0 && !scanning && (
          <p className={cx(styles.muted, styles.emptyTree)}>
            {scannedAt
              ? 'No pages found. Check the site path, or refresh again.'
              : 'Not scanned yet. Press Refresh while Loopy is opened from the Author tab.'}
          </p>
        )}
        {canScan && !error && totalCount > 0 && searching && matchCount === 0 && (
          <p className={cx(styles.muted, styles.emptyTree)}>
            No pages match “{query.trim()}”.
          </p>
        )}
        {matchCount > 0 && (
          <TreeNode
            node={tree}
            domain={domain}
            allDomains={allDomains}
            edsDomains={domains}
            depth={0}
            collapsed={effectiveCollapsed}
            onToggle={onToggle}
          />
        )}
      </div>
    </div>
  )
}
