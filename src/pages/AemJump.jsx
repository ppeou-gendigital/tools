import { useEffect, useState } from 'react'
import {
  HardDriveDownload,
  HardDriveUpload,
  Info,
  Router,
  Settings as SettingsIcon,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/molecules/Button'
import { AemJumpBlock } from '@/blocks/AemJumpBlock'
import { ManageEnvironmentsBlock } from '@/blocks/ManageEnvironmentsBlock'
import { Deck, Slide } from '@/blocks/Deck'
import { PageShortcuts } from '@/patterns/PageShortcuts'
import { UrlParamsMenu } from '@/patterns/UrlParamsMenu'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { isExtension } from '@/env'
import { isJumpableUrl, readActiveTabUrl } from '@/lib/activeTab'
import { isDomainRenderable } from '@/lib/prefs'
import { cx } from '@/lib/cx'
import styles from './AemJump.module.scss'

const EXAMPLE_URL =
  'https://qa-webauthor.np.nortonlifelock.com/editor.html/content/norton/language-masters/en/home.html'

// Header-level quick launchers for common local AEM developer endpoints.
// Rendered as `<a target="_blank">` so cmd-click / middle-click open in a
// background tab natively — a plain button would swallow that behaviour.
const LOCAL_SHORTCUTS = [
  {
    href: 'http://localhost:4502',
    label: 'AEM Author (localhost:4502)',
    icon: HardDriveDownload,
  },
  {
    href: 'https://localhost:14502',
    label: 'AEM Author HTTPS (localhost:14502)',
    icon: Router,
  },
  {
    href: 'https://localhost:14500/ping',
    label: 'Dispatcher ping (localhost:14500)',
    icon: HardDriveUpload,
  },
]

// Web-only cache of the last URL typed into the source card. The extension
// popup never touches storage for this — it always seeds from the active
// tab on open, so there's nothing to remember.
const URL_STORAGE_KEY = 'loopy.aemJumpUrl'
const URL_WRITE_DEBOUNCE_MS = 300

function readInitialWebUrl() {
  try {
    const stored = globalThis.localStorage?.getItem(URL_STORAGE_KEY)
    if (typeof stored === 'string' && stored.trim()) return stored
  } catch {
    // localStorage can throw in private mode / sandboxed iframes.
  }
  return EXAMPLE_URL
}

export function AemJump() {
  const { goSettingsAemEnvironments } = useNavigation()
  const { domains, setDomains } = useAemDomains()
  // Two very different seed strategies depending on surface:
  //   - Extension popup: start empty, then fill from the active tab in the
  //     effect below. No storage involved on either side.
  //   - Web surface: fill synchronously from localStorage (or the example
  //     URL) so the input renders correctly on the first paint, no flash.
  const [url, setUrl] = useState(() =>
    isExtension() ? '' : readInitialWebUrl(),
  )
  const [showInfo, setShowInfo] = useState(false)

  // Extension: seed once on open from the active tab. Skipped entirely on
  // the web surface (no `chrome.tabs`, and the state is already hydrated).
  //
  // After seeding, scroll the input horizontally so the resource path (the
  // interesting part) is visible instead of just the origin. The input is
  // narrow (400px popup) and text inputs default to scrollLeft=0, so a
  // long URL like https://<host>/content/... otherwise looks truncated at
  // the origin — a common source of "did it pick up my URL?" confusion.
  useEffect(() => {
    if (!isExtension()) return
    let mounted = true
    readActiveTabUrl().then((tabUrl) => {
      if (!mounted) return
      const next = isJumpableUrl(tabUrl) ? tabUrl : ''
      setUrl(next)
      if (!next) return
      // Wait a frame for React to commit the new value into the DOM
      // before we reach for the input.
      requestAnimationFrame(() => {
        const el = document.getElementById('aem-jump-url')
        if (el instanceof HTMLInputElement) {
          el.scrollLeft = el.scrollWidth
        }
      })
    })
    return () => {
      mounted = false
    }
  }, [])

  // Web: debounced persist to localStorage so the URL survives a page
  // refresh. Extension never persists — the tab drives the seed instead.
  useEffect(() => {
    if (isExtension()) return
    const t = setTimeout(() => {
      try {
        globalThis.localStorage?.setItem(URL_STORAGE_KEY, url)
      } catch {
        // ignore quota / private-mode errors
      }
    }, URL_WRITE_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [url])

  // Renderable = has enough data to jump. Visibility is a separate,
  // user-controlled filter driven by the Manage slide at the end of the
  // deck; drafts stay edit-only in Settings.
  const renderable = domains.filter(isDomainRenderable)
  const visible = renderable.filter((d) => d.visible !== false)
  // Rows that can rebase get a real AemJumpBlock. eds-da has only
  // owner/repo/ref (no origin) so it stays on the placeholder track
  // until its link builders land.
  const jumpBlocks = visible.filter((d) => d.kind !== 'eds-da')
  const edsPending = visible.filter((d) => d.kind === 'eds-da')

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>AEM Jump</h1>
          {LOCAL_SHORTCUTS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              className={styles.shortcut}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              aria-label={label}
            >
              <Icon size={14} aria-hidden="true" />
            </a>
          ))}
          <UrlParamsMenu url={url} onUrlChange={setUrl} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo((v) => !v)}
            className={styles.iconBtn}
            aria-label="About this page"
            aria-expanded={showInfo}
            aria-controls="aem-jump-info"
            title="About"
          >
            <Info size={14} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goSettingsAemEnvironments}
            className={styles.iconBtn}
            aria-label="Manage AEM environments"
            title="Manage environments"
          >
            <SettingsIcon size={14} aria-hidden="true" />
          </Button>
          <PageShortcuts current="aem-jump" className={styles.iconBtn} />
        </div>
        {showInfo && (
          <p id="aem-jump-info" className={styles.subtitle}>
            Paste an AEM URL to jump between Editor, Sites, DAM, CRX/DE and
            admin consoles. Configured domains rebase the same URL onto
            other environments.
          </p>
        )}
      </header>

      <div className={cx('is-fluid-width', styles.deckWrap)}>
        <Deck>
          <Slide span={11} spanMd={6} spanLg={5} spanXl={4}>
            <AemJumpBlock
              variant="source"
              url={url}
              onUrlChange={setUrl}
              inputId="aem-jump-url"
            />
          </Slide>

          {jumpBlocks.map((d) => (
            <Slide key={d.id} span={11} spanMd={6} spanLg={5} spanXl={4}>
              <AemJumpBlock variant="rebase" domain={d} url={url} />
            </Slide>
          ))}

          {edsPending.map((d) => (
            <Slide key={d.id} span={11} spanMd={6} spanLg={5} spanXl={4}>
              <EdsPlaceholderCard domain={d} />
            </Slide>
          ))}

          <Slide span={11} spanMd={6} spanLg={5} spanXl={4}>
            <ManageEnvironmentsBlock
              domains={renderable}
              onChange={setDomains}
              onOpenSettings={goSettingsAemEnvironments}
            />
          </Slide>
        </Deck>
      </div>
    </div>
  )
}

// Only reached for kinds that don't yet have a jump-block renderer.
// Today that's just `eds-da` (owner/repo/ref only, no origin to rebase to).
function EdsPlaceholderCard({ domain }) {
  const subtitle = `${domain.owner}/${domain.repo}@${domain.ref}`
  const note = 'EDS jump icons are coming in a follow-up.'
  return (
    <section className={styles.placeholder} aria-label={domain.label}>
      <div className={styles.placeholderHead}>
        <Sparkles size={14} aria-hidden="true" />
        <h2 className={styles.placeholderTitle}>{domain.label}</h2>
        <span className={styles.placeholderChip}>{domain.kind}</span>
      </div>
      <p className={styles.placeholderSub}>{subtitle}</p>
      <p className={styles.placeholderNote}>{note}</p>
    </section>
  )
}
