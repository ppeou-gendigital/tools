import { useEffect, useRef, useState } from 'react'
import { TicketPercent } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Divider } from '@/molecules/Divider'
import { writeActiveTabUrl } from '@/lib/activeTab'
import { isExtension } from '@/env'
import { cx } from '@/lib/cx'
import styles from './UrlParamsMenu.module.scss'

// Hardcoded options for the AEM Jump header dropdown. Kept as a plain
// declarative table so adding, removing, or renaming an option is a
// one-line edit. `action` is either 'set' (add or replace) or 'remove'.
const PROMO_OPTIONS = [
  {
    id: 'set-escper90',
    label: 'promocode=escper90',
    action: 'set',
    key: 'promocode',
    value: 'escper90',
  },
  {
    id: 'set-tv35',
    label: 'promocode=TV35',
    action: 'set',
    key: 'promocode',
    value: 'TV35',
  },
  {
    id: 'remove-promo',
    label: 'Remove promocode',
    action: 'remove',
    key: 'promocode',
  },
]

// Mutates a URL string by adding/replacing/removing a single query param.
// Uses URL / URLSearchParams so path and hash round-trip unchanged and
// unrelated params (e.g. foo=bar) are preserved verbatim. Returns the
// original string if the input isn't a parseable absolute URL.
function applyParam(url, opt) {
  try {
    const u = new URL(url)
    if (opt.action === 'set') u.searchParams.set(opt.key, opt.value)
    else if (opt.action === 'remove') u.searchParams.delete(opt.key)
    return u.toString()
  } catch {
    return url
  }
}

function isParseableUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Header dropdown that mutates the source URL in place — every rebase
// block on the page derives from the same `url` prop, so a single
// `onUrlChange` call fans out to all cards without extra plumbing.
export function UrlParamsMenu({ url, onUrlChange }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const disabled = !isParseableUrl(url)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function handlePick(opt) {
    if (disabled) return
    const next = applyParam(url, opt)
    onUrlChange?.(next)
    setOpen(false)
    // Extension popup: also navigate the current browser tab so the user
    // sees the promocode take effect on the page they were looking at.
    // Web surface has no tab-under-us to steer, so the input update above
    // is the whole story.
    if (isExtension()) {
      void writeActiveTabUrl(next)
    }
  }

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className={styles.trigger}
        aria-label="Edit URL parameters"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-disabled={disabled}
        title={disabled ? 'Enter a URL first' : 'Edit URL parameters'}
      >
        <TicketPercent size={14} aria-hidden="true" />
      </Button>

      {open && (
        <div role="menu" className={styles.menu} aria-label="URL parameters">
          {PROMO_OPTIONS.map((opt, i) => {
            const isRemove = opt.action === 'remove'
            const prev = PROMO_OPTIONS[i - 1]
            const showDivider = prev && prev.action !== 'remove' && isRemove
            return (
              <div key={opt.id}>
                {showDivider && <Divider />}
                <button
                  type="button"
                  role="menuitem"
                  className={cx(styles.item, isRemove && styles.itemRemove)}
                  onClick={() => handlePick(opt)}
                >
                  {opt.label}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
