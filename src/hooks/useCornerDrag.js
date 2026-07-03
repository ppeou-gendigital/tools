import { useCallback, useRef, useState } from 'react'
import { useFabCorner } from '@/providers/FabCornerProvider'

// Below this pixel distance, the gesture is treated as a click. Any movement
// larger than this is committed as a drag and the click handler is suppressed.
const DRAG_THRESHOLD = 5

function computeSnapCorner(centerX, centerY, containerWidth, containerHeight) {
  const isLeft = centerX < containerWidth / 2
  const isTop = centerY < containerHeight / 2
  return `${isTop ? 'top' : 'bottom'}-${isLeft ? 'left' : 'right'}`
}

/**
 * Draggable-with-snap-to-corner hook for a fixed-position element.
 *
 * Corner state is owned by FabCornerProvider so remote-sync code can also
 * write it. This hook is now a thin gesture layer that calls setCorner()
 * on snap.
 *
 * Returns:
 *   corner:      current corner id ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right')
 *   dragOffset:  { x, y } while dragging, null otherwise. Consumer applies as inline transform.
 *   isDragging:  boolean, true while a pointer is captured.
 *   wasDragged:  sync fn returning true if the last pointerup came from a real drag
 *                (used to suppress the follow-up click event).
 *   bind:        props to spread onto the draggable element.
 */
export function useCornerDrag() {
  const { corner, setCorner } = useFabCorner()
  const [dragOffset, setDragOffset] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const startRef = useRef(null)
  const movedRef = useRef(false)

  const onPointerDown = useCallback((e) => {
    if (e.button !== undefined && e.button !== 0) return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Some environments (older Firefox on non-primary pointers) throw here;
      // capture is a nice-to-have, not required for correctness.
    }
    startRef.current = { x: e.clientX, y: e.clientY, target: e.currentTarget }
    movedRef.current = false
    setDragOffset({ x: 0, y: 0 })
    setIsDragging(true)
  }, [])

  const onPointerMove = useCallback((e) => {
    if (!startRef.current) return
    const dx = e.clientX - startRef.current.x
    const dy = e.clientY - startRef.current.y
    if (!movedRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      movedRef.current = true
    }
    setDragOffset({ x: dx, y: dy })
  }, [])

  const finishGesture = useCallback(
    (e) => {
      if (!startRef.current) return
      const target = startRef.current.target
      const releasedPointer = e?.pointerId
      if (target && releasedPointer !== undefined) {
        try {
          target.releasePointerCapture(releasedPointer)
        } catch {
          // Ignore; pointer may have already been released.
        }
      }
      if (movedRef.current && target) {
        // Snap is computed inside the button's *offsetParent* — the closest
        // positioned ancestor (in our case `.shell`). That way the four
        // corners map to the app's frame, not the browser viewport. This is
        // what makes the top corners reachable when the extension popup is
        // previewed inside a full-size browser window.
        const rect = target.getBoundingClientRect()
        const parent = target.offsetParent
        const parentRect = parent
          ? parent.getBoundingClientRect()
          : {
              left: 0,
              top: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            }
        const cx = rect.left + rect.width / 2 - parentRect.left
        const cy = rect.top + rect.height / 2 - parentRect.top
        const next = computeSnapCorner(
          cx,
          cy,
          parentRect.width,
          parentRect.height,
        )
        setCorner(next)
      }
      startRef.current = null
      setDragOffset(null)
      setIsDragging(false)
    },
    [setCorner],
  )

  const onPointerUp = finishGesture
  const onPointerCancel = finishGesture

  const wasDragged = useCallback(() => movedRef.current, [])

  return {
    corner,
    dragOffset,
    isDragging,
    wasDragged,
    bind: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
  }
}
