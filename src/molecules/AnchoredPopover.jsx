import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '@/lib/cx'
import styles from './AnchoredPopover.module.scss'

const GAP = 6
const VIEW_PAD = 8

function samePos(a, b) {
  return (
    a.top === b.top &&
    a.left === b.left &&
    a.width === b.width &&
    a.ready === b.ready
  )
}

/**
 * Portaled popover anchored to a trigger element with collision flip.
 * Use for contextual lists (expenses, people, chip pickers). Modals stay for blocking flows.
 */
export function AnchoredPopover({
  open,
  onClose,
  anchorRef,
  /** Extra element(s) that should not dismiss the popover (e.g. a separate trigger). */
  guardRef,
  /** Stretch panel width to match the anchor. */
  matchAnchorWidth = false,
  /** Size width to content instead of the default min-width. */
  fluid = false,
  title,
  children,
  className,
  align = 'end',
  role = 'dialog',
  'aria-label': ariaLabel,
}) {
  const panelRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0, width: null, ready: false })

  const place = useCallback(() => {
    const anchor = anchorRef?.current
    const panel = panelRef.current
    if (!anchor || !panel) return
    const a = anchor.getBoundingClientRect()
    const width = matchAnchorWidth ? a.width : null
    if (width != null) panel.style.width = `${width}px`
    else panel.style.width = ''

    const p = panel.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    let top = a.bottom + GAP
    if (top + p.height + VIEW_PAD > vh && a.top - GAP - p.height >= VIEW_PAD) {
      top = a.top - GAP - p.height
    }
    top = Math.max(VIEW_PAD, Math.min(top, vh - p.height - VIEW_PAD))

    // Near-full-width fluid panels (e.g. 92dvw on SM): center for equal side space.
    let left
    if (fluid && p.width >= vw * 0.8) {
      left = (vw - p.width) / 2
    } else if (align === 'start') {
      left = a.left
    } else if (align === 'center') {
      left = a.left + a.width / 2 - p.width / 2
    } else {
      left = a.right - p.width
    }
    left = Math.max(VIEW_PAD, Math.min(left, vw - p.width - VIEW_PAD))

    const next = { top, left, width, ready: true }
    setPos((prev) => (samePos(prev, next) ? prev : next))
  }, [anchorRef, align, matchAnchorWidth, fluid])

  useLayoutEffect(() => {
    if (!open) {
      // Bail out when already closed — avoid a setState on every parent re-render.
      setPos((s) => (s.ready === false ? s : { ...s, ready: false }))
      return
    }
    place()
    const panel = panelRef.current
    const onScroll = () => place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', onScroll, true)
    // Reposition when menu content size changes (replaces a `children` effect dep,
    // which recreated every parent render and could loop with setPos).
    let ro
    if (panel && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => place())
      ro.observe(panel)
    }
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', onScroll, true)
      ro?.disconnect()
    }
  }, [open, place])

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      const t = e.target
      if (!(t instanceof Node)) return
      if (panelRef.current?.contains(t)) return
      if (anchorRef?.current?.contains(t)) return
      if (guardRef?.current?.contains(t)) return
      // Nested portaled menus / file preview live outside this panel; keep open.
      if (
        t instanceof Element &&
        (t.closest('[data-anchored-popover]') ||
          t.closest('[data-file-preview]'))
      ) {
        return
      }
      onClose?.()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        // File preview handles Escape first (capture); skip if it is open.
        if (document.querySelector('[data-file-preview]')) return
        e.stopPropagation()
        onClose?.()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [open, onClose, anchorRef, guardRef])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      ref={panelRef}
      role={role}
      aria-label={ariaLabel || title}
      data-anchored-popover=""
      className={cx(styles.panel, fluid && styles.fluid, className)}
      style={{
        top: pos.top,
        left: pos.left,
        width: pos.width ?? undefined,
        maxWidth: pos.width != null ? pos.width : undefined,
        visibility: pos.ready ? 'visible' : 'hidden',
      }}
    >
      {title ? <div className={styles.title}>{title}</div> : null}
      {children}
    </div>,
    document.body,
  )
}
