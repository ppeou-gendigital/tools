import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '@/lib/cx'
import styles from './AnchoredPopover.module.scss'

const GAP = 6
const VIEW_PAD = 8

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

    setPos({ top, left, width, ready: true })
  }, [anchorRef, align, matchAnchorWidth, fluid])

  useLayoutEffect(() => {
    if (!open) {
      setPos((s) => ({ ...s, ready: false }))
      return
    }
    place()
    const onScroll = () => place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open, place, children])

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target)) return
      if (anchorRef?.current?.contains(e.target)) return
      if (guardRef?.current?.contains(e.target)) return
      onClose?.()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
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
