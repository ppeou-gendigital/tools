import { useEffect, useState } from 'react'
import { Info, Settings as SettingsIcon, Sparkles } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { AemJumpBlock } from '@/blocks/AemJumpBlock'
import { ManageEnvironmentsBlock } from '@/blocks/ManageEnvironmentsBlock'
import { Deck, Slide } from '@/blocks/Deck'
import { useAemDomains } from '@/providers/AemDomainsProvider'
import { useNavigation } from '@/providers/NavigationProvider'
import { isDomainRenderable } from '@/lib/prefs'
import { asyncStorage } from '@/lib/storage'
import { cx } from '@/lib/cx'
import styles from './AemJump.module.scss'

const EXAMPLE_URL =
  'https://qa-webauthor.np.nortonlifelock.com/editor.html/content/norton/language-masters/en/home.html'

// Local-only cache of the last URL typed into the source card. Not synced
// via PrefsSync — this is scratch state per browser, not a preference.
const URL_STORAGE_KEY = 'loopy.aemJumpUrl'
const URL_WRITE_DEBOUNCE_MS = 300

export function AemJump() {
  const { goSettingsAemEnvironments } = useNavigation()
  const { domains, setDomains } = useAemDomains()
  const [url, setUrl] = useState(EXAMPLE_URL)
  const [urlReady, setUrlReady] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  // Hydrate from storage on mount. Falls through to EXAMPLE_URL on
  // first-time users or unreadable storage.
  useEffect(() => {
    let mounted = true
    asyncStorage.getItem(URL_STORAGE_KEY).then((stored) => {
      if (!mounted) return
      if (typeof stored === 'string' && stored.trim()) setUrl(stored)
      setUrlReady(true)
    })
    return () => {
      mounted = false
    }
  }, [])

  // Debounced persist so per-keystroke edits don't spam chrome.storage.
  // Gated on `urlReady` so the initial default doesn't clobber the stored
  // value before hydration finishes.
  useEffect(() => {
    if (!urlReady) return
    const t = setTimeout(() => {
      asyncStorage.setItem(URL_STORAGE_KEY, url)
    }, URL_WRITE_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [url, urlReady])

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
