import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '@/lib/cx'
import styles from './Popover.module.scss'

// Lightweight anchored floating panel. Much smaller than <Modal> —
// no backdrop, no focus trap. Use it for transient pickers, hover
// menus, notes previews, etc. Anything modal-y (locking flow, forced
// choice) should still use <Modal>.
//
// Positioning: portals to document.body so the panel escapes any
// ancestor `overflow: hidden`. Position is derived from the anchor
// element's bounding rect and re-measured on scroll / resize while
// the popover is open. Flips above the anchor when there's more
// room above, and shifts horizontally when it would clip the
// viewport.
const VIEWPORT_MARGIN = 8
const ANCHOR_GAP = 6

export function Popover({
  open,
  anchorRef,
  onDismiss,
  ariaLabel,
  className,
  children,
}) {
  const panelRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const [coords, setCoords] = useState(null)

  // Measure and position on open / scroll / resize. useLayoutEffect
  // avoids a first-paint flicker at (0, 0).
  //
  // When `open` flips false the effect returns without measuring;
  // the panel is unmounted by the render below (createPortal returns
  // null), so stale coords don't matter and we don't need to reset
  // them here (which would flag the setState-in-effect lint anyway).
  useLayoutEffect(() => {
    if (!open) return
    const anchor = anchorRef?.current
    if (!anchor) return

    function measure() {
      const rect = anchor.getBoundingClientRect()
      const panel = panelRef.current
      // Fall back to a sensible default width if the panel hasn't
      // mounted yet; the second layout pass (after mount) corrects it.
      const panelWidth = panel?.offsetWidth ?? 220
      const panelHeight = panel?.offsetHeight ?? 100
      const vw = window.innerWidth
      const vh = window.innerHeight

      const spaceBelow = vh - rect.bottom
      const spaceAbove = rect.top
      const preferAbove =
        spaceBelow < panelHeight + ANCHOR_GAP + VIEWPORT_MARGIN &&
        spaceAbove > spaceBelow

      let top = preferAbove
        ? rect.top - panelHeight - ANCHOR_GAP
        : rect.bottom + ANCHOR_GAP
      let left = rect.left

      // Horizontal clipping guard: shift left when we'd overflow the
      // right edge, clamp to the left margin otherwise.
      if (left + panelWidth + VIEWPORT_MARGIN > vw) {
        left = vw - panelWidth - VIEWPORT_MARGIN
      }
      if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN

      // Vertical clamp in case both directions are cramped.
      if (top < VIEWPORT_MARGIN) top = VIEWPORT_MARGIN
      if (top + panelHeight + VIEWPORT_MARGIN > vh) {
        top = Math.max(VIEWPORT_MARGIN, vh - panelHeight - VIEWPORT_MARGIN)
      }

      setCoords({ top, left })
    }

    measure()
    // Re-measure once the panel has mounted with real dimensions.
    const rafId = requestAnimationFrame(measure)

    window.addEventListener('scroll', measure, true)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
    }
  }, [open, anchorRef])

  // Focus mgmt: move to the first interactive child on open, restore
  // the anchor on close.
  useEffect(() => {
    if (!open) return
    previouslyFocusedRef.current =
      typeof document !== 'undefined' ? document.activeElement : null
    // Wait a tick so the panel is in the DOM and coords are set.
    const id = requestAnimationFrame(() => {
      const panel = panelRef.current
      if (!panel) return
      const first = panel.querySelector(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      if (first instanceof HTMLElement) first.focus()
      else panel.focus()
    })
    return () => {
      cancelAnimationFrame(id)
      const prev = previouslyFocusedRef.current
      if (prev instanceof HTMLElement) prev.focus()
    }
  }, [open])

  // Dismiss on outside pointerdown / Escape. Attached in capture so
  // we win against nested popovers or button handlers that might
  // reopen us.
  useEffect(() => {
    if (!open) return
    if (typeof document === 'undefined') return

    function onPointerDown(e) {
      const panel = panelRef.current
      const anchor = anchorRef?.current
      if (panel && panel.contains(e.target)) return
      if (anchor && anchor.contains(e.target)) return
      onDismiss?.()
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onDismiss?.()
      }
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [open, onDismiss, anchorRef])

  if (!open) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-label={ariaLabel}
      tabIndex={-1}
      className={cx(styles.panel, className)}
      style={
        coords
          ? { top: `${coords.top}px`, left: `${coords.left}px`, visibility: 'visible' }
          : { top: '-9999px', left: '-9999px', visibility: 'hidden' }
      }
    >
      {children}
    </div>,
    document.body,
  )
}
