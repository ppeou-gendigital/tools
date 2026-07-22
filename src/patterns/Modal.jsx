import { useCallback, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cx } from '@/lib/cx'
import styles from './Modal.module.scss'

// A small, dependency-free modal. Portals to document.body so it
// escapes any parent stacking context (important because the FAB
// already sits on position: fixed and could otherwise overlap).
//
// - `open` toggles visibility. Nothing renders when `open` is false,
//   so callers can freely mount/unmount without teardown flicker.
// - `dismissible` gates the backdrop click and the Escape key. Set
//   it to false when the calling context has no meaningful "closed"
//   state (e.g. the credentials page while the vault is locked).
// - `title` is rendered as the modal header. Also becomes the ARIA
//   label so screen readers announce the dialog correctly.
export function Modal({
  open,
  onDismiss,
  dismissible = true,
  title,
  children,
  className,
}) {
  const panelRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const titleId = useId()

  const handleDismiss = useCallback(() => {
    if (!dismissible) return
    onDismiss?.()
  }, [dismissible, onDismiss])

  // Focus management: capture the previously-focused element on
  // open, restore it on close. Focus the first tabbable inside the
  // panel on mount, or the panel itself as a fallback.
  useEffect(() => {
    if (!open) return
    previouslyFocusedRef.current =
      typeof document !== 'undefined' ? document.activeElement : null
    const panel = panelRef.current
    if (!panel) return
    const first = panel.querySelector(
      'input, textarea, select, button, [tabindex]:not([tabindex="-1"])',
    )
    if (first instanceof HTMLElement) {
      first.focus()
    } else {
      panel.focus()
    }
    return () => {
      const prev = previouslyFocusedRef.current
      if (prev instanceof HTMLElement) {
        prev.focus()
      }
    }
  }, [open])

  // Body scroll lock. Preserves whatever inline overflow style was
  // there (rare but non-zero) so unmount restores it exactly.
  useEffect(() => {
    if (!open) return
    if (typeof document === 'undefined') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Escape to dismiss (only when dismissible). Tab / Shift+Tab focus
  // trap: cycles between the first and last tabbable inside the
  // panel so users can't accidentally focus the (invisible)
  // background page.
  useEffect(() => {
    if (!open) return
    if (typeof document === 'undefined') return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        handleDismiss()
        return
      }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusables = panel.querySelectorAll(
        'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) {
        e.preventDefault()
        panel.focus()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [open, handleDismiss])

  if (!open) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className={styles.backdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleDismiss()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cx(styles.panel, className)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {(title || dismissible) && (
          <div className={styles.header}>
            {title && (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            )}
            {dismissible && (
              <button
                type="button"
                className={styles.closeBtn}
                onClick={handleDismiss}
                aria-label="Close"
                title="Close"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}
