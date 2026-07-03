import { useMemo } from 'react'
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
import { Label } from '@/molecules/Label'
import { buildAemLinks } from '@/lib/aemLinks'
import { kindHasOrigin } from '@/lib/prefs'
import { isExtension } from '@/env'
import { cx } from '@/lib/cx'
import styles from './AemJumpBlock.module.scss'

// Icons + labels for the Jump-to grid. Kept alongside the block so the
// URL/link-builder layer (src/lib/aemLinks.js) stays presentation-free.
const LINK_ROWS = [
  { key: 'editor', label: 'Editor', icon: PencilLine },
  { key: 'preview', label: 'Preview', icon: Eye },
  { key: 'disable', label: 'Disabled (wcmmode)', icon: MonitorPlay },
  { key: 'properties', label: 'Page Properties', icon: FileSliders },
  { key: 'sites', label: 'Sites Console (item)', icon: LayoutList },
  { key: 'sitesRoot', label: 'Sites Console (root)', icon: FolderTree },
  { key: 'dam', label: 'Assets (folder)', icon: FolderOpen },
  { key: 'damRoot', label: 'Assets (root)', icon: Images },
  { key: 'assetDetails', label: 'Asset Details', icon: Image },
  { key: 'crx', label: 'CRX / DE', icon: Braces },
  { key: 'packmgr', label: 'Package Manager', icon: Package },
  { key: 'systemConsole', label: 'System Console', icon: Wrench },
  { key: 'osgiConsole', label: 'OSGi Config', icon: SlidersHorizontal },
  { key: 'siteAdmin', label: 'Site Admin (classic)', icon: LayoutGrid },
  { key: 'welcome', label: 'Welcome / Start', icon: Home },
  { key: 'i18n', label: 'i18n Translator', icon: Languages },
  { key: 'queryBuilder', label: 'Query Builder', icon: Search },
  { key: 'bundles', label: 'Bundles', icon: Boxes },
  { key: 'jmx', label: 'JMX', icon: Activity },
  { key: 'logsStatus', label: 'Logs (dump)', icon: ScrollText },
  { key: 'logsConfig', label: 'Logs (config)', icon: Settings2 },
  { key: 'miscadmin', label: 'Miscadmin', icon: Shield },
  { key: 'users', label: 'Users (Touch)', icon: Users },
  { key: 'usersClassic', label: 'Users (Classic)', icon: UserCog },
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

  const effectiveUrl = useMemo(
    () => computeUrl({ variant, origin, url }),
    [variant, origin, url],
  )

  const result = useMemo(() => {
    const trimmed = (effectiveUrl ?? '').trim()
    if (!trimmed) return { parsed: null, links: {}, error: null }
    try {
      return { ...buildAemLinks(trimmed), error: null }
    } catch (err) {
      return {
        parsed: null,
        links: {},
        error: err instanceof Error ? err.message : 'Invalid URL',
      }
    }
  }, [effectiveUrl])

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

  return (
    <section className={styles.block} aria-label={isSource ? 'Source URL' : domain?.label}>
      {!isSource && domain && (
        <header className={styles.blockHeader}>
          <h2 className={styles.blockTitle}>{domain.label}</h2>
          <div className={styles.chips}>
            <span className={cx(styles.chip, styles.chipKind)}>{domain.kind}</span>
            <span className={styles.chip}>{domain.role}</span>
            <span className={styles.chip}>{domain.env}</span>
          </div>
          {origin && <p className={styles.originLine}>{origin}</p>}
        </header>
      )}

      {isSource && (
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <Label htmlFor={fieldId}>AEM URL</Label>
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
          <Input
            id={fieldId}
            type="url"
            value={url ?? ''}
            onChange={(e) => onUrlChange?.(e.target.value)}
            placeholder="https://author.example.com/editor.html/content/..."
            spellCheck={false}
            autoComplete="off"
          />
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
              {availableLinks.map(({ key, label, icon: Icon }) => {
                const href = result.links[key]
                return (
                  <li key={key} className={styles.toolItem}>
                    <a
                      className={styles.toolBtn}
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
