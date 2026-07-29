import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Component, Sun } from 'lucide-react'
import {
  cellEdges,
  cellToOffset,
  formatFabCell,
  gridForWidth,
  localCellToStorage,
  pointToCell,
  readFabMetrics,
  storageCellToLocal,
} from '@tools/behavioral'
import { useFabCorner } from '@/providers/FabCornerProvider'
import styles from '@/pages/Page.module.scss'

const STORAGE_KEY = 'viaggio.ideasFabCell'
/** Mid-right in XL space — away from search band and zoom pocket. */
const DEFAULT_CELL = '11:8'
const DRAG_THRESHOLD = 5

function readStoredCell() {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
    return raw || DEFAULT_CELL
  } catch {
    return DEFAULT_CELL
  }
}

function writeStoredCell(token) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, token)
  } catch {
    /* ignore quota / private mode */
  }
}

function getShell() {
  return document.querySelector('[data-app-shell]')
}

/**
 * Map-only free-float Ideas control: sun FAB + count when collapsed;
 * list panel opens inward with the FAB anchored at the box corner.
 * Positioned on the app shell grid (same lattice as menu / AI FABs).
 */
export function FloatingIdeasButton({
  open,
  onOpenChange,
  count = 0,
  hidden = false,
  onFitAll,
  showFitAll = false,
  children,
}) {
  const { corner: menuCorner, aiCorner } = useFabCorner()
  const [storageToken, setStorageToken] = useState(readStoredCell)
  const [wrapSize, setWrapSize] = useState({ width: 390, height: 600 })
  const [metrics, setMetrics] = useState(() => readFabMetrics(null))
  const [dragOffset, setDragOffset] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [shellEl, setShellEl] = useState(null)
  const startRef = useRef(null)
  const movedRef = useRef(false)
  const fabRef = useRef(null)
  const skipClickRef = useRef(false)

  const measure = useCallback(() => {
    const shell = getShell()
    const el = fabRef.current
    if (!shell) return
    const rect = shell.getBoundingClientRect()
    setWrapSize({ width: rect.width, height: rect.height })
    setMetrics(readFabMetrics(el || shell))
  }, [])

  useLayoutEffect(() => {
    const shell = getShell()
    setShellEl(shell)
    if (!shell || hidden) return undefined
    measure()
    if (typeof ResizeObserver === 'undefined') {
      const onResize = () => measure()
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }
    const ro = new ResizeObserver(() => measure())
    ro.observe(shell)
    return () => ro.disconnect()
  }, [measure, storageToken, hidden])

  const grid = gridForWidth(wrapSize.width)
  const localCell = storageCellToLocal(storageToken, wrapSize.width)
  const menuLocal = storageCellToLocal(menuCorner, wrapSize.width)
  const aiLocal = storageCellToLocal(aiCorner, wrapSize.width)
  const offset = cellToOffset(
    localCell,
    wrapSize.width,
    wrapSize.height,
    grid,
    metrics,
  )
  const edges = cellEdges(localCell, grid)
  const stackedOnOther =
    formatFabCell(localCell) === formatFabCell(menuLocal) ||
    formatFabCell(localCell) === formatFabCell(aiLocal)

  const onPointerDown = useCallback(
    (e) => {
      if (e.button !== undefined && e.button !== 0) return
      const target = e.currentTarget
      try {
        target.setPointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
      measure()
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
      if (target && e?.pointerId !== undefined) {
        try {
          target.releasePointerCapture(e.pointerId)
        } catch {
          /* ignore */
        }
      }
      if (movedRef.current && target) {
        const rect = target.getBoundingClientRect()
        const shell = getShell()
        const parentRect = shell
          ? shell.getBoundingClientRect()
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
        const nextGrid = gridForWidth(width)
        const nextMetrics = readFabMetrics(target)
        const raw = pointToCell(cx, cy, width, height, nextGrid, nextMetrics)
        const menuKey = formatFabCell(storageCellToLocal(menuCorner, width))
        const aiKey = formatFabCell(storageCellToLocal(aiCorner, width))
        const rawKey = formatFabCell(raw)
        // Dropping onto menu/AI → nudge one step toward center instead of stealing.
        let next = raw
        if (rawKey === menuKey || rawKey === aiKey) {
          const midCol = (nextGrid.cols - 1) / 2
          const midRow = (nextGrid.rows - 1) / 2
          const dCol = raw.col <= midCol ? 1 : -1
          const dRow = raw.row <= midRow ? 1 : -1
          next = {
            col: Math.min(
              nextGrid.cols - 1,
              Math.max(0, raw.col + dCol),
            ),
            row: Math.min(
              nextGrid.rows - 1,
              Math.max(0, raw.row + dRow),
            ),
          }
          if (
            formatFabCell(next) === menuKey ||
            formatFabCell(next) === aiKey
          ) {
            next = {
              col: Math.min(
                nextGrid.cols - 1,
                Math.max(0, raw.col + dCol),
              ),
              row: raw.row,
            }
          }
        }
        const token = localCellToStorage(next, width)
        setStorageToken(token)
        writeStoredCell(token)
        skipClickRef.current = true
      }
      startRef.current = null
      setDragOffset(null)
      setIsDragging(false)
    },
    [aiCorner, menuCorner],
  )

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onOpenChange?.(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  if (hidden || !shellEl) return null

  const floatStyle = {
    left: `${offset.left}px`,
    top: `${offset.top}px`,
    ...(dragOffset
      ? { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }
      : stackedOnOther
        ? {
            transform: `translate(${
              localCell.col <= (grid.cols - 1) / 2
                ? metrics.fabSize + metrics.fabGap
                : -(metrics.fabSize + metrics.fabGap)
            }px, 0px)`,
          }
        : null),
  }

  const handleClick = () => {
    if (movedRef.current || skipClickRef.current) {
      skipClickRef.current = false
      return
    }
    onOpenChange?.(!open)
  }

  const countLabel = count > 99 ? '99+' : String(count)

  return createPortal(
    <div className={styles.mapIdeasLayer} data-ideas-fab-layer>
      <div
        className={styles.mapIdeasFloat}
        style={floatStyle}
        data-edge-x={edges.edgeX}
        data-edge-y={edges.edgeY}
        data-open={open ? 'true' : undefined}
        data-dragging={isDragging ? 'true' : undefined}
      >
        <button
          ref={fabRef}
          type="button"
          className={styles.mapIdeasFab}
          aria-label={open ? 'Collapse Ideas' : 'Ideas'}
          aria-expanded={open}
          aria-controls="map-ideas-body"
          title="Ideas"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishGesture}
          onPointerCancel={finishGesture}
          onClick={handleClick}
        >
          <Sun size={20} aria-hidden="true" />
          <span className={styles.mapIdeasFabBadge} aria-hidden="true">
            {countLabel}
          </span>
        </button>

        {open && !isDragging ? (
          <aside
            className={styles.mapIdeasPanel}
            aria-label="Ideas"
            id="map-ideas-panel"
          >
            <div className={styles.mapIdeasHeader}>
              <span className={styles.mapIdeasTitle}>Ideas</span>
              <span className={styles.mapIdeasCount}>{count}</span>
              <span className={styles.mapIdeasHeaderSpacer} />
              {showFitAll ? (
                <button
                  type="button"
                  className={styles.mapIdeasFitBtn}
                  onClick={onFitAll}
                  title="Show all Ideas on the map"
                  aria-label="Show all Ideas on the map"
                >
                  <Component size={14} aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <div id="map-ideas-body" className={styles.mapIdeasBody}>
              {children}
            </div>
          </aside>
        ) : null}
      </div>
    </div>,
    shellEl,
  )
}
