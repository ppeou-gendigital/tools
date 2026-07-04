import { useId, useMemo, useState } from 'react'
import {
  Activity,
  Boxes,
  Braces,
  Eye,
  FileSliders,
  FlaskConical,
  FlaskConicalOff,
  FolderOpen,
  FolderTree,
  Home,
  Image,
  Images,
  Info,
  Languages,
  LayoutGrid,
  LayoutList,
  MapPinCheck,
  MonitorPlay,
  Package,
  PencilLine,
  ScrollText,
  Search,
  Settings2,
  Shield,
  SlidersHorizontal,
  TriangleAlert,
  UserCog,
  Users,
  Wrench,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { buildAemLinks, parseAemUrl } from '@/lib/aemLinks'
import { readActiveTabUrl } from '@/lib/activeTab'
import { getRebaseOrigin } from '@/lib/prefs'
import { formatWhen } from '@/lib/visitedUrls'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { useVisitedUrls } from '@/providers/VisitedUrlsProvider'
import { isExtension } from '@/env'
import { cx } from '@/lib/cx'
import styles from './AemJumpBlock.module.scss'

// How many visited rows to render inline on the source card before we
// fall back to a "View all" link out to the full Visited URLs page.
// Kept intentionally small so the source card doesn't turn into a
// history browser — the dedicated page is a click away.
const VISITED_INLINE_LIMIT = 25

// Group -> CSS-module class. Kept out of the row table so LINK_ROWS stays
// declarative; each anchor gets both this class and the base `.toolBtn`.
const GROUP_CLASS = {
  page: styles.groupPage,
  project: styles.groupProject,
  aem: styles.groupAem,
  admin: styles.groupAdmin,
}

// Icons + labels for the Jump-to grid. Kept alongside the block so the
// URL/link-builder layer (src/lib/aemLinks.js) stays presentation-free.
//
// `group` buckets a tool into one of four visual categories so the icon
// grid gains a quick color legend. Tokens live in src/tokens/_tokens.scss
// under --jump-{page,project,aem,admin} with light/dark variants.
//   page     - page-scoped author tools     (editor / preview / properties / asset details)
//   project  - project/site scoped consoles (Sites / DAM)
//   aem      - AEM app-level surfaces       (welcome / i18n / users / miscadmin / site admin)
//   admin    - dev / ops consoles           (crx / osgi / logs / packmgr / jmx / query builder)
const LINK_ROWS = [
  { key: 'editor', label: 'Editor', icon: PencilLine, group: 'page' },
  { key: 'universalEditor', label: 'Universal Editor', icon: PencilLine, group: 'page' },
  { key: 'preview', label: 'Preview', icon: Eye, group: 'page' },
  { key: 'disable', label: 'Disabled (wcmmode)', icon: MonitorPlay, group: 'page' },
  { key: 'properties', label: 'Page Properties', icon: FileSliders, group: 'page' },
  { key: 'sites', label: 'Sites Console (item)', icon: LayoutList, group: 'project' },
  { key: 'sitesRoot', label: 'Sites Console (root)', icon: FolderTree, group: 'project' },
  { key: 'dam', label: 'Assets (folder)', icon: FolderOpen, group: 'project' },
  { key: 'damRoot', label: 'Assets (root)', icon: Images, group: 'project' },
  { key: 'assetDetails', label: 'Asset Details', icon: Image, group: 'page' },
  { key: 'crx', label: 'CRX / DE', icon: Braces, group: 'admin' },
  { key: 'packmgr', label: 'Package Manager', icon: Package, group: 'admin' },
  { key: 'systemConsole', label: 'System Console', icon: Wrench, group: 'admin' },
  { key: 'osgiConsole', label: 'OSGi Config', icon: SlidersHorizontal, group: 'admin' },
  { key: 'siteAdmin', label: 'Site Admin (classic)', icon: LayoutGrid, group: 'aem' },
  { key: 'welcome', label: 'Welcome / Start', icon: Home, group: 'aem' },
  { key: 'i18n', label: 'i18n Translator', icon: Languages, group: 'aem' },
  { key: 'queryBuilder', label: 'Query Builder', icon: Search, group: 'admin' },
  { key: 'bundles', label: 'Bundles', icon: Boxes, group: 'admin' },
  { key: 'jmx', label: 'JMX', icon: Activity, group: 'admin' },
  { key: 'logsStatus', label: 'Logs (dump)', icon: ScrollText, group: 'admin' },
  { key: 'logsConfig', label: 'Logs (config)', icon: Settings2, group: 'admin' },
  { key: 'miscadmin', label: 'Miscadmin', icon: Shield, group: 'aem' },
  { key: 'users', label: 'Users (Touch)', icon: Users, group: 'aem' },
  { key: 'usersClassic', label: 'Users (Classic)', icon: UserCog, group: 'aem' },
]

const PARSED_ROWS = [
  { key: 'origin', label: 'Origin' },
  { key: 'flavor', label: 'Flavor' },
  { key: 'mode', label: 'Mode' },
  { key: 'resourcePath', label: 'Resource path' },
  { key: 'siteName', label: 'Site name' },
  { key: 'urlParams', label: 'URL params' },
  { key: 'hash', label: 'Hash' },
]

// Compact "most-used" strip rendered above JUMP TO on the source block.
// Two of the entries are dynamic:
//   - abToggle:   icon + label flip based on `parsed.abTestDisabled`.
//   - editToggle: swaps between disabling (when currently in edit mode) and
//                 opening the editor (when in preview/disabled), reusing
//                 whatever the pipeline built for `disable` / `editor` /
//                 `universalEditor`.
// Entries with a null href are filtered out of the final list.
function computeShortcuts({ parsed, links }) {
  if (!parsed) return []

  const abDisabled = parsed.abTestDisabled === true
  const ab = {
    key: 'abToggle',
    label: abDisabled ? 'Enable A/B testing' : 'Disable A/B testing',
    icon: abDisabled ? FlaskConicalOff : FlaskConical,
    href: links.abToggle ?? null,
    group: 'admin',
  }

  const inEdit = parsed.mode === 'edit'
  const editHref = inEdit
    ? links.disable
    : (links.universalEditor ?? links.editor)
  const edit = {
    key: 'editToggle',
    label: inEdit ? 'Switch to Disabled (wcmmode)' : 'Edit',
    icon: inEdit ? MonitorPlay : PencilLine,
    href: editHref ?? null,
    group: 'page',
  }

  const staticRows = [
    {
      key: 'crx',
      label: 'CRX / DE',
      icon: Braces,
      href: links.crx ?? null,
      group: 'admin',
    },
    {
      key: 'damRoot',
      label: 'Assets (root)',
      icon: Images,
      href: links.damRoot ?? null,
      group: 'project',
    },
    {
      key: 'sitesRoot',
      label: 'Sites Console (root)',
      icon: FolderTree,
      href: links.sitesRoot ?? null,
      group: 'project',
    },
  ]

  return [ab, ...staticRows, edit].filter((s) => !!s.href)
}

// Build the effective URL a block should feed into buildAemLinks.
// - "source" variant: use the URL the user typed as-is.
// - "rebase" variant: keep the source's path / search / hash but swap the
//   host to the block's configured origin, so we can render the same jump
//   set for a different environment. Falls back to bare `${origin}/` when
//   the source URL is empty/invalid, so origin-only admin icons still show.
function computeUrl({ variant, origin, url }) {
  if (variant === 'source') return url
  if (!origin) return ''
  try {
    const src = new URL(url.trim())
    return `${origin}${src.pathname}${src.search}${src.hash}`
  } catch {
    return `${origin}/`
  }
}

// Reusable block that renders:
//   - (variant=source) a URL textbox + optional "Use current tab" button
//   - a Parsed section showing origin / resourcePath / siteName / params / hash
//   - a Jump-to icon grid built from buildAemLinks(effectiveUrl)
//
// The Source block owns the URL; rebase blocks receive that URL through
// props and swap origins internally.
export function AemJumpBlock({
  variant = 'source',
  domain = null,
  url,
  onUrlChange,
  inputId,
}) {
  const isSource = variant === 'source'
  const origin = getRebaseOrigin(domain)

  const { domains } = useAemDomains()

  const effectiveUrl = useMemo(
    () => computeUrl({ variant, origin, url }),
    [variant, origin, url],
  )

  // Match the effective URL against configured domains to decide whether
  // buildAemLinks should produce a Universal Editor jump (and, for a
  // local-SDK origin, use traditional-style paths).
  //
  //   1. `local-sdk` match by origin — the input is a paired localhost SDK
  //      row. `ueHost` comes from the sibling HTTPS-side `local-sdk` row
  //      (same siteName + imsOrg + authorOrigin); if no HTTPS peer is
  //      configured we fall back to the matched row's own host.
  //   2. `eds-ue` match by siteName — the existing Cloud-shell case.
  //
  // Everything else about URL shaping (Cloud shell vs. traditional paths,
  // canvas host, etc.) is driven by these options inside aemLinks.js.
  const edsUeOptions = useMemo(() => {
    const trimmed = (effectiveUrl ?? '').trim()
    if (!trimmed) return null

    let parsedOrigin = null
    let siteName = null
    try {
      const u = new URL(trimmed)
      parsedOrigin = u.origin
      siteName = parseAemUrl(u).siteName
    } catch {
      return null
    }

    if (parsedOrigin) {
      const sdk = domains.find(
        (d) =>
          d.kind === 'local-sdk' &&
          d.origin === parsedOrigin &&
          d.imsOrg &&
          d.authorOrigin,
      )
      if (sdk) {
        const httpsPeer = domains.find(
          (d) =>
            d.kind === 'local-sdk' &&
            d.siteName === sdk.siteName &&
            d.imsOrg === sdk.imsOrg &&
            d.authorOrigin === sdk.authorOrigin &&
            typeof d.origin === 'string' &&
            d.origin.startsWith('https:'),
        )
        let ueHost = null
        try {
          ueHost = new URL((httpsPeer ?? sdk).origin).host
        } catch {
          ueHost = null
        }
        return {
          imsOrg: sdk.imsOrg,
          authorOrigin: sdk.authorOrigin,
          ueHost,
          noShell: true,
        }
      }
    }

    if (!siteName) return null
    const target = siteName.toLowerCase()
    const match = domains.find(
      (d) =>
        d.kind === 'eds-ue' &&
        d.siteName === target &&
        d.imsOrg &&
        d.authorOrigin,
    )
    if (!match) return null
    return { imsOrg: match.imsOrg, authorOrigin: match.authorOrigin }
  }, [effectiveUrl, domains])

  const result = useMemo(() => {
    const trimmed = (effectiveUrl ?? '').trim()
    if (!trimmed) return { parsed: null, links: {}, error: null }
    try {
      return {
        ...buildAemLinks(trimmed, edsUeOptions ?? undefined),
        error: null,
      }
    } catch (err) {
      return {
        parsed: null,
        links: {},
        error: err instanceof Error ? err.message : 'Invalid URL',
      }
    }
  }, [effectiveUrl, edsUeOptions])

  const availableLinks = LINK_ROWS.filter(({ key }) => !!result.links[key])
  const shortcuts = useMemo(
    () => (isSource ? computeShortcuts(result) : []),
    [isSource, result],
  )

  // Visited URLs for the hostname currently in the input. Source-card
  // only: rebase cards already point at a specific env, so their
  // "history" would just be the source card duplicated N times.
  //
  // Hostname is derived from result.parsed.origin (populated whenever
  // the input parses cleanly) rather than result.parsed.host so we
  // match how the storage bucket keys are shaped in
  // normalizeVisitedByDomain (URL.hostname, lower-cased).
  const { byDomain } = useVisitedUrls()
  const { goVisitedUrls } = useNavigation()
  const visited = useMemo(() => {
    if (!isSource) return { rows: [], total: 0 }
    const originStr = result.parsed?.origin
    if (!originStr) return { rows: [], total: 0 }
    let hostname
    try {
      hostname = new URL(originStr).hostname.toLowerCase()
    } catch {
      return { rows: [], total: 0 }
    }
    const bucket = byDomain[hostname]
    const paths =
      bucket?.paths &&
      typeof bucket.paths === 'object' &&
      !Array.isArray(bucket.paths)
        ? bucket.paths
        : null
    if (!paths) return { rows: [], total: 0 }
    const entries = Object.entries(paths).map(([path, value]) => ({
      path,
      ...value,
    }))
    entries.sort((a, b) => {
      const at = a.lastVisitedAt ?? ''
      const bt = b.lastVisitedAt ?? ''
      if (at === bt) return a.path < b.path ? -1 : a.path > b.path ? 1 : 0
      return at < bt ? 1 : -1
    })
    return {
      rows: entries.slice(0, VISITED_INLINE_LIMIT),
      total: entries.length,
      hostname,
      origin: originStr,
    }
  }, [isSource, result.parsed, byDomain])

  const canUseCurrentTab =
    isSource &&
    isExtension() &&
    typeof chrome !== 'undefined' &&
    !!chrome?.tabs?.query

  async function handleUseCurrentTab() {
    const next = await readActiveTabUrl()
    if (next && onUrlChange) {
      onUrlChange(next)
      // Reveal the resource path (end of the URL) instead of the origin —
      // the input is narrow and defaults to scrollLeft=0, which looks
      // like the URL was truncated at the host.
      requestAnimationFrame(() => {
        const el = document.getElementById(fieldId)
        if (el instanceof HTMLInputElement) {
          el.scrollLeft = el.scrollWidth
        }
      })
    }
  }

  const fieldId = inputId ?? 'aem-jump-url'
  const infoId = useId()
  const [showInfo, setShowInfo] = useState(false)

  return (
    <section className={styles.block} aria-label={isSource ? 'Source URL' : domain?.label}>
      {!isSource && domain && (
        <header className={styles.blockHeader}>
          <div className={styles.blockTitleRow}>
            <h2 className={styles.blockTitle}>{domain.label}</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo((v) => !v)}
              className={styles.infoBtn}
              aria-label="About this environment"
              aria-expanded={showInfo}
              aria-controls={infoId}
              title="About"
            >
              <Info size={14} aria-hidden="true" />
            </Button>
          </div>
          {showInfo && (
            <div id={infoId} className={styles.blockInfo}>
              <div className={styles.chips}>
                <span className={cx(styles.chip, styles.chipKind)}>
                  {domain.kind}
                </span>
                <span className={styles.chip}>{domain.role}</span>
                <span className={styles.chip}>{domain.env}</span>
              </div>
              {origin && <p className={styles.originLine}>{origin}</p>}
            </div>
          )}
        </header>
      )}

      {isSource && (
        <div className={styles.field}>
          {canUseCurrentTab && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleUseCurrentTab}
              className={styles.currentTabBtn}
              aria-label="Use current tab URL"
              title="Use current tab URL"
            >
              <MapPinCheck size={16} aria-hidden="true" />
            </Button>
          )}
          <Input
            id={fieldId}
            type="url"
            value={url ?? ''}
            onChange={(e) => onUrlChange?.(e.target.value)}
            placeholder="https://author.example.com/editor.html/content/..."
            spellCheck={false}
            autoComplete="off"
            aria-label="AEM URL"
            className={styles.fieldInput}
          />
          {result.parsed && shortcuts.length > 0 && (
            <ul
              className={cx(styles.tools, styles.shortcutsInline)}
              aria-label="Shortcuts"
            >
              {shortcuts.map(({ key, label, icon: Icon, href, group }) => (
                <li key={key} className={styles.toolItem}>
                  <a
                    className={cx(styles.toolBtn, GROUP_CLASS[group])}
                    data-group={group}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    aria-label={label}
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {result.error && (
        <div className={styles.error}>
          <TriangleAlert size={12} aria-hidden="true" />
          <span>{result.error}</span>
        </div>
      )}

      {result.parsed && (
        <div className={styles.section} aria-label="Jump to">
          <h3 className={styles.sectionTitle}>Jump to</h3>
          {availableLinks.length === 0 ? (
            <p className={styles.muted}>No links available for this URL.</p>
          ) : (
            <ul className={styles.tools}>
              {availableLinks.map(({ key, label, icon: Icon, group }) => {
                const href = result.links[key]
                return (
                  <li key={key} className={styles.toolItem}>
                    <a
                      className={cx(styles.toolBtn, GROUP_CLASS[group])}
                      data-group={group}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={label}
                      aria-label={label}
                    >
                      <Icon size={20} aria-hidden="true" />
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {result.parsed && (
        <details className={styles.parsedDetails}>
          <summary className={styles.parsedSummary}>Parsed</summary>
          <dl className={styles.parsed}>
            {PARSED_ROWS.map(({ key, label }) => (
              <div key={key} className={styles.parsedRow}>
                <dt className={styles.parsedLabel}>{label}</dt>
                <dd className={styles.parsedValue}>
                  {result.parsed[key] || (
                    <span className={styles.muted}>—</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      )}

      {isSource && result.parsed && visited.rows.length > 0 && (
        <details className={styles.visitedDetails}>
          <summary className={styles.parsedSummary}>
            <span>Visited URLs</span>
            <span className={styles.visitedCount}>{visited.total}</span>
          </summary>
          <ul className={styles.visitedList}>
            {visited.rows.map((entry) => {
              const href = `${visited.origin}${entry.path}`
              return (
                <li key={entry.path} className={styles.visitedRow}>
                  <a
                    className={styles.visitedLink}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${href}`}
                  >
                    <span className={styles.visitedTitle}>
                      {entry.title || (
                        <span className={styles.muted}>(no title)</span>
                      )}
                    </span>
                    <span className={styles.visitedPath}>{entry.path}</span>
                  </a>
                  <span className={styles.visitedWhen}>
                    {formatWhen(entry.lastVisitedAt)}
                  </span>
                </li>
              )
            })}
          </ul>
          {visited.total > visited.rows.length && (
            <button
              type="button"
              className={styles.visitedMore}
              onClick={goVisitedUrls}
            >
              View all {visited.total} visits →
            </button>
          )}
        </details>
      )}
    </section>
  )
}
