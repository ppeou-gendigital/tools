import { useId, useMemo, useState } from 'react'
import {
  Activity,
  Boxes,
  Braces,
  Eye,
  FileSliders,
  FolderOpen,
  FolderTree,
  Focus,
  Home,
  Image,
  Images,
  Info,
  Languages,
  LayoutGrid,
  LayoutList,
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
import { kindHasOrigin } from '@/lib/prefs'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { isExtension } from '@/env'
import { cx } from '@/lib/cx'
import styles from './AemJumpBlock.module.scss'

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
  { key: 'resourcePath', label: 'Resource path' },
  { key: 'siteName', label: 'Site name' },
  { key: 'urlParams', label: 'URL params' },
  { key: 'hash', label: 'Hash' },
]

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

async function readActiveTabUrl() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    return tabs?.[0]?.url ?? null
  } catch (err) {
    console.warn('[loopy] could not read active tab:', err?.message ?? err)
    return null
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
  const origin = domain && kindHasOrigin(domain.kind) ? domain.origin : null

  const { domains } = useAemDomains()

  const effectiveUrl = useMemo(
    () => computeUrl({ variant, origin, url }),
    [variant, origin, url],
  )

  // If the effective URL's content path lives under a configured eds-ue
  // site, capture that domain's UE metadata so buildAemLinks can emit a
  // `universalEditor` link even when the input isn't already a UE URL.
  const edsUeOptions = useMemo(() => {
    const trimmed = (effectiveUrl ?? '').trim()
    if (!trimmed) return null
    let sn
    try {
      sn = parseAemUrl(trimmed).siteName
    } catch {
      return null
    }
    if (!sn) return null
    const target = sn.toLowerCase()
    const match = domains.find(
      (d) =>
        d.kind === 'eds-ue' &&
        d.siteName === target &&
        d.imsOrg &&
        d.authorOrigin,
    )
    if (!match) return null
    try {
      return {
        imsOrg: match.imsOrg,
        ueHost: new URL(match.authorOrigin).hostname,
      }
    } catch {
      return null
    }
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

  const canUseCurrentTab =
    isSource &&
    isExtension() &&
    typeof chrome !== 'undefined' &&
    !!chrome?.tabs?.query

  async function handleUseCurrentTab() {
    const next = await readActiveTabUrl()
    if (next && onUrlChange) onUrlChange(next)
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
          {canUseCurrentTab && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleUseCurrentTab}
              className={styles.currentTabBtn}
            >
              <Focus size={12} aria-hidden="true" />
              Use current tab
            </Button>
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
    </section>
  )
}
