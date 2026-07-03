import { useMemo, useState } from 'react'
import { ArrowLeft, Check, Copy, ExternalLink, TriangleAlert } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Input } from '@/molecules/Input'
import { Label } from '@/molecules/Label'
import { useNavigation } from '@/providers/NavigationProvider'
import { buildAemLinks } from '@/lib/aemLinks'
import styles from './AemJump.module.scss'

const EXAMPLE_URL =
  'https://qa-webauthor.np.nortonlifelock.com/editor.html/content/norton/language-masters/en/home.html'

// Order + labels for the rendered link list. Kept next to the page (not in
// the lib) so the utility stays presentation-free.
const LINK_ROWS = [
  { key: 'editor', label: 'Editor' },
  { key: 'preview', label: 'Preview' },
  { key: 'disable', label: 'Disabled (wcmmode)' },
  { key: 'properties', label: 'Page Properties' },
  { key: 'sites', label: 'Sites Console (item)' },
  { key: 'sitesRoot', label: 'Sites Console (root)' },
  { key: 'dam', label: 'Assets (folder)' },
  { key: 'damRoot', label: 'Assets (root)' },
  { key: 'assetDetails', label: 'Asset Details' },
  { key: 'crx', label: 'CRX / DE' },
  { key: 'packmgr', label: 'Package Manager' },
  { key: 'systemConsole', label: 'System Console' },
  { key: 'osgiConsole', label: 'OSGi Config' },
]

const PARSED_ROWS = [
  { key: 'origin', label: 'Origin' },
  { key: 'resourcePath', label: 'Resource path' },
  { key: 'siteName', label: 'Site name' },
  { key: 'urlParams', label: 'URL params' },
  { key: 'hash', label: 'Hash' },
]

export function AemJump() {
  const { goHome } = useNavigation()
  const [url, setUrl] = useState(EXAMPLE_URL)
  const [copiedKey, setCopiedKey] = useState(null)

  // Trim before parsing so a stray leading/trailing space (very common
  // from paste) doesn't blow up the URL constructor.
  const result = useMemo(() => {
    const trimmed = url.trim()
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
  }, [url])

  async function copy(key, value) {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedKey(key)
      setTimeout(() => {
        setCopiedKey((k) => (k === key ? null : k))
      }, 1200)
    } catch {
      // Clipboard blocked (e.g. insecure context). Silently ignore — the
      // link itself is still openable, which is the main path.
    }
  }

  const availableLinks = LINK_ROWS.filter(({ key }) => !!result.links[key])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Button
          variant="ghost"
          size="sm"
          onClick={goHome}
          className={styles.back}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back
        </Button>
        <div className={styles.headerText}>
          <h1 className={styles.title}>AEM Jump</h1>
          <p className={styles.subtitle}>
            Paste an AEM URL to jump between Editor, Sites, DAM, CRX/DE and
            admin consoles.
          </p>
        </div>
      </header>

      <div className={styles.field}>
        <Label htmlFor="aem-url">AEM URL</Label>
        <Input
          id="aem-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://author.example.com/editor.html/content/..."
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {result.error && (
        <div className={styles.error}>
          <TriangleAlert size={12} aria-hidden="true" />
          <span>{result.error}</span>
        </div>
      )}

      {result.parsed && (
        <section className={styles.section} aria-label="Parsed URL">
          <h2 className={styles.sectionTitle}>Parsed</h2>
          <dl className={styles.parsed}>
            {PARSED_ROWS.map(({ key, label }) => (
              <div key={key} className={styles.parsedRow}>
                <dt className={styles.parsedLabel}>{label}</dt>
                <dd className={styles.parsedValue}>
                  {result.parsed[key] || <span className={styles.muted}>—</span>}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {result.parsed && (
        <section className={styles.section} aria-label="Jump to">
          <h2 className={styles.sectionTitle}>Jump to</h2>
          {availableLinks.length === 0 ? (
            <p className={styles.muted}>No links available for this URL.</p>
          ) : (
            <ul className={styles.links}>
              {availableLinks.map(({ key, label }) => {
                const href = result.links[key]
                const copied = copiedKey === key
                return (
                  <li key={key} className={styles.linkRow}>
                    <a
                      className={styles.linkAnchor}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className={styles.linkLabel}>{label}</span>
                      <span className={styles.linkUrl}>{href}</span>
                      <ExternalLink
                        size={12}
                        aria-hidden="true"
                        className={styles.linkIcon}
                      />
                    </a>
                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={() => copy(key, href)}
                      aria-label={copied ? `Copied ${label}` : `Copy ${label}`}
                    >
                      {copied ? (
                        <Check size={12} aria-hidden="true" />
                      ) : (
                        <Copy size={12} aria-hidden="true" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
