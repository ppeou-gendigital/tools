import { useEffect, useMemo, useRef, useState } from 'react'
import { FlaskConical, FlaskConicalOff, TicketPercent } from 'lucide-react'
import { Button } from '@/molecules/Button'
import { Divider } from '@/molecules/Divider'
import { writeActiveTabUrl } from '@/lib/activeTab'
import { buildAemLinks } from '@/lib/aemLinks'
import { isExtension } from '@/env'
import { cx } from '@/lib/cx'
import styles from './UrlParamsMenu.module.scss'

// Hardcoded promocode options for the dropdown. Kept as a plain declarative
// table so adding, removing, or renaming an option is a one-line edit.
// `action` is either 'set' (add or replace) or 'remove'.
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

// Ask the AEM link builder for the A/B toggle target + current state.
// Delegates to `buildAemLinks` so we inherit the same path-shaping logic
// used elsewhere — the toggle swaps to a `.html` preview URL because
// Target's mbox.js runs on the rendered page, not the editor.
function computeAbState(url) {
  if (typeof url !== 'string' || !url.trim()) return null
  try {
    const { parsed, links } = buildAemLinks(url)
    if (!parsed || !links?.abToggle) return null
    return {
      disabled: parsed.abTestDisabled === true,
      href: links.abToggle,
    }
  } catch {
    return null
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
//
// Groups two kinds of URL-param edits under one menu:
//   1. A/B testing toggle (moved here from the inline shortcuts strip so
//      "things that mutate URL params" all live in one place).
//   2. Promocode presets — set/replace/remove.
export function UrlParamsMenu({ url, onUrlChange }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const disabled = !isParseableUrl(url)
  const ab = useMemo(() => computeAbState(url), [url])

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

  // Both handlers share the same "commit + navigate" tail: point the input
  // at `next`, close the menu, and — in the extension — steer the current
  // browser tab so the change takes effect on the page the user is looking
  // at. Web surface has no tab-under-us to steer.
  function commit(next) {
    if (typeof next !== 'string' || !next) return
    onUrlChange?.(next)
    setOpen(false)
    if (isExtension()) void writeActiveTabUrl(next)
  }

  function handlePromo(opt) {
    if (disabled) return
    commit(applyParam(url, opt))
  }

  function handleAbToggle() {
    if (!ab?.href) return
    commit(ab.href)
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
          {ab && (
            <>
              <button
                type="button"
                role="menuitem"
                className={cx(styles.item, styles.itemWithIcon)}
                onClick={handleAbToggle}
              >
                {ab.disabled ? (
                  <FlaskConicalOff
                    size={14}
                    className={styles.itemIcon}
                    aria-hidden="true"
                  />
                ) : (
                  <FlaskConical
                    size={14}
                    className={styles.itemIcon}
                    aria-hidden="true"
                  />
                )}
                <span>
                  {ab.disabled ? 'Enable A/B testing' : 'Disable A/B testing'}
                </span>
              </button>
              <Divider />
            </>
          )}
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
                  onClick={() => handlePromo(opt)}
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
