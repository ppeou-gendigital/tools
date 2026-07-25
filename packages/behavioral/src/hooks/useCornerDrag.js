import { useCallback, useRef, useState } from 'react'
import { useFabCorner } from '@tools/service'

const DRAG_THRESHOLD = 5

function computeSnapCorner(centerX, centerY, containerWidth, containerHeight) {
  const isLeft = centerX < containerWidth / 2
  const isTop = centerY < containerHeight / 2
  return `${isTop ? 'top' : 'bottom'}-${isLeft ? 'left' : 'right'}`
}

export function useCornerDrag() {
  const { corner, setCorner } = useFabCorner()
  const [dragOffset, setDragOffset] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const startRef = useRef(null)
  const movedRef = useRef(false)

  const onPointerDown = useCallback((e) => {
    if (e.button !== undefined && e.button !== 0) return
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* ignore */ }
    startRef.current = { x: e.clientX, y: e.clientY, target: e.currentTarget }
    movedRef.current = false
    setDragOffset({ x: 0, y: 0 })
    setIsDragging(true)
  }, [])

  const onPointerMove = useCallback((e) => {
    if (!startRef.current) return
    const dx = e.clientX - startRef.current.x
    const dy = e.clientY - startRef.current.y
    if (!movedRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) movedRef.current = true
    setDragOffset({ x: dx, y: dy })
  }, [])

  const finishGesture = useCallback((e) => {
    if (!startRef.current) return
    const target = startRef.current.target
    const releasedPointer = e?.pointerId
    if (target && releasedPointer !== undefined) {
      try { target.releasePointerCapture(releasedPointer) } catch { /* ignore */ }
    }
    if (movedRef.current && target) {
      const rect = target.getBoundingClientRect()
      const parent = target.offsetParent
      const parentRect = parent
        ? parent.getBoundingClientRect()
        : {
            left: 0,
            top: 0,
            width: globalThis.innerWidth,
            height: globalThis.innerHeight,
          }
      const cx = rect.left + rect.width / 2 - parentRect.left
      const cy = rect.top + rect.height / 2 - parentRect.top
      setCorner(computeSnapCorner(cx, cy, parentRect.width, parentRect.height))
    }
    startRef.current = null
    setDragOffset(null)
    setIsDragging(false)
  }, [setCorner])

  const wasDragged = useCallback(() => movedRef.current, [])

  return {
    corner,
    dragOffset,
    isDragging,
    wasDragged,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finishGesture,
      onPointerCancel: finishGesture,
    },
  }
}
