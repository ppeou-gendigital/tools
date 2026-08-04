import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { useFabCorner } from '@tools/service'
import {
  getFabBottomRightReserved,
  isBottomRightFabCollision,
  subscribeFabBottomRightReserved,
} from '../lib/fabOccupancy.js'
import {
  cellEdges,
  cellToOffset,
  formatFabCell,
  gridFromMetrics,
  localCellToStorage,
  parseFabCell,
  pointToCell,
  readFabMetrics,
  storageCellToLocal,
} from '../lib/fabGrid.js'

const DRAG_THRESHOLD = 5

/**
 * @param {{ fabId?: 'menu' | 'ai' }} [opts]
 */
export function useCornerDrag({ fabId = 'menu' } = {}) {
  const {
    corner: menuCorner,
    setCorner: setMenuCorner,
    aiCorner,
    setAiCorner,
    swapFabCorners,
  } = useFabCorner()

  const storageToken = fabId === 'ai' ? aiCorner : menuCorner
  const otherToken = fabId === 'ai' ? menuCorner : aiCorner

  const [wrapSize, setWrapSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 390,
    height: typeof window !== 'undefined' ? window.innerHeight : 844,
  })
  const [metrics, setMetrics] = useState(() => readFabMetrics(null))
  const [dragOffset, setDragOffset] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const startRef = useRef(null)
  const movedRef = useRef(false)
  const targetRef = useRef(null)

  const measure = useCallback((el) => {
    const parent = el?.offsetParent
    if (!parent) return
    const rect = parent.getBoundingClientRect()
    setWrapSize({ width: rect.width, height: rect.height })
    setMetrics(readFabMetrics(el))
  }, [])

  useLayoutEffect(() => {
    const el = targetRef.current
    if (!el) return undefined
    measure(el)
    const parent = el.offsetParent
    if (!parent || typeof ResizeObserver === 'undefined') {
      const onResize = () => measure(el)
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }
    const ro = new ResizeObserver(() => measure(el))
    ro.observe(parent)
    return () => ro.disconnect()
  }, [measure, storageToken])

  const bottomRightReserved = useSyncExternalStore(
    subscribeFabBottomRightReserved,
    getFabBottomRightReserved,
    () => false,
  )

  const grid = gridFromMetrics(wrapSize.width, wrapSize.height, metrics)
  const localCell = storageCellToLocal(storageToken, grid)
  const otherLocal = storageCellToLocal(otherToken, grid)
  // FormActionsFloat reserves BR — show last-col / one-row-up (prefs unchanged).
  const displayCell =
    bottomRightReserved && isBottomRightFabCollision(localCell, grid)
      ? {
          col: Math.min(localCell.col, grid.cols - 1),
          row: Math.max(0, grid.rows - 2),
        }
      : localCell
  const offset = cellToOffset(
    displayCell,
    wrapSize.width,
    wrapSize.height,
    grid,
    metrics,
  )
  const edges = cellEdges(displayCell, grid)
  const stacked =
    fabId === 'ai' && formatFabCell(localCell) === formatFabCell(otherLocal)

  const positionStyle = {
    left: `${offset.left}px`,
    top: `${offset.top}px`,
    right: 'auto',
    bottom: 'auto',
    ...(dragOffset
      ? { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }
      : stacked
        ? {
            transform: `translate(${
              displayCell.col <= (grid.cols - 1) / 2
                ? metrics.fabSize + metrics.fabGap
                : -(metrics.fabSize + metrics.fabGap)
            }px, 0px)`,
          }
        : null),
  }

  const onPointerDown = useCallback(
    (e) => {
      if (e.button !== undefined && e.button !== 0) return
      const target = e.currentTarget
      targetRef.current = target
      try {
        target.setPointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
      measure(target)
      startRef.current = { x: e.clientX, y: e.clientY, target }
      movedRef.current = false
      setDragOffset({ x: 0, y: 0 })
      setIsDragging(true)
    },
    [measure],
  )

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
          /* ignore */
        }
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
        const width = parentRect.width
        const height = parentRect.height
        const nextMetrics = readFabMetrics(target)
        const nextGrid = gridFromMetrics(width, height, nextMetrics)
        const raw = pointToCell(cx, cy, width, height, nextGrid, nextMetrics)
        const otherLocalCell = storageCellToLocal(otherToken, nextGrid)
        // Dropping onto the other FAB → swap.
        if (formatFabCell(raw) === formatFabCell(otherLocalCell)) {
          void swapFabCorners()
        } else {
          const storage = localCellToStorage(raw, nextGrid)
          if (fabId === 'ai') {
            void setAiCorner(storage)
          } else {
            void setMenuCorner(storage)
          }
        }
      }
      startRef.current = null
      setDragOffset(null)
      setIsDragging(false)
    },
    [
      fabId,
      otherToken,
      setAiCorner,
      setMenuCorner,
      swapFabCorners,
    ],
  )

  const wasDragged = useCallback(() => movedRef.current, [])

  const setTargetRef = useCallback(
    (node) => {
      targetRef.current = node
      if (node) measure(node)
    },
    [measure],
  )

  const corner = storageToken
  const cell = parseFabCell(formatFabCell(localCell))

  return {
    corner,
    cell,
    edgeX: edges.edgeX,
    edgeY: edges.edgeY,
    positionStyle,
    stacked,
    dragOffset,
    isDragging,
    wasDragged,
    setTargetRef,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finishGesture,
      onPointerCancel: finishGesture,
    },
  }
}
