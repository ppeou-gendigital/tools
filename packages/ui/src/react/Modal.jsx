import { useCallback, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cx } from './cx.js'

export function Modal({
  open,
  onDismiss,
  dismissible = true,
  title,
  children,
  className,
  wide = false,
}) {
  const panelRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const titleId = useId()

  const handleDismiss = useCallback(() => {
    if (!dismissible) return
    onDismiss?.()
  }, [dismissible, onDismiss])

  useEffect(() => {
    if (!open) return
    previouslyFocusedRef.current =
      typeof document !== 'undefined' ? document.activeElement : null
    const panel = panelRef.current
    if (!panel) return
    const first = panel.querySelector(
      'input, textarea, select, button, [tabindex]:not([tabindex="-1"])',
    )
    if (first instanceof HTMLElement) first.focus()
    else panel.focus()
    return () => {
      const prev = previouslyFocusedRef.current
      if (prev instanceof HTMLElement) prev.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open || typeof document === 'undefined') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open || typeof document === 'undefined') return
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
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [open, handleDismiss])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="ui-modal-backdrop"
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
        className={cx('ui-modal', wide && 'ui-modal--wide', className)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {(title || dismissible) && (
          <div className="ui-modal__header">
            {title && (
              <h2 id={titleId} className="ui-modal__title">
                {title}
              </h2>
            )}
            {dismissible && (
              <button
                type="button"
                className="ui-modal__close"
                onClick={handleDismiss}
                aria-label="Close"
                title="Close"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        <div className="ui-modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
