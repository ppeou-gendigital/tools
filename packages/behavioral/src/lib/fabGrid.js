import {
  FAB_GRIDS,
  FAB_GRID_XL,
  clampFabCell,
  formatFabCell,
  parseFabCell,
  remapFabCell,
} from '@tools/service/fabCell'

export {
  FAB_GRIDS,
  FAB_GRID_XL,
  clampFabCell,
  formatFabCell,
  parseFabCell,
  remapFabCell,
}

const BP_MD = 768
const BP_LG = 1024
const BP_XL = 1440

const DEFAULT_OFFSET_PX = 16
const DEFAULT_FAB_SIZE_PX = 48

/**
 * @param {number} width
 * @returns {'sm' | 'md' | 'lg' | 'xl'}
 */
export function breakpointForWidth(width) {
  if (width >= BP_XL) return 'xl'
  if (width >= BP_LG) return 'lg'
  if (width >= BP_MD) return 'md'
  return 'sm'
}

/**
 * @param {number} width
 */
export function gridForWidth(width) {
  return FAB_GRIDS[breakpointForWidth(width)]
}

/**
 * Resolve a CSS length (px/rem) against an element to device pixels.
 * @param {Element} el
 * @param {string} raw
 * @param {number} fallback
 */
function cssLengthPx(el, raw, fallback) {
  const v = String(raw || '').trim()
  if (!v) return fallback
  const n = Number.parseFloat(v)
  if (!Number.isFinite(n)) return fallback
  if (v.endsWith('px')) return n
  if (v.endsWith('rem')) {
    const root =
      typeof getComputedStyle === 'function'
        ? Number.parseFloat(
            getComputedStyle(document.documentElement).fontSize,
          )
        : 16
    return n * (Number.isFinite(root) && root > 0 ? root : 16)
  }
  if (v.endsWith('em') && el) {
    const base = Number.parseFloat(getComputedStyle(el).fontSize)
    return n * (Number.isFinite(base) && base > 0 ? base : 16)
  }
  return fallback
}

/**
 * @param {Element | null} [el] FAB button (preferred) or any themed element
 * @returns {{ offset: number, fabSize: number, fabGap: number }}
 */
export function readFabMetrics(el) {
  if (typeof getComputedStyle !== 'function' || !el) {
    return {
      offset: DEFAULT_OFFSET_PX,
      fabSize: DEFAULT_FAB_SIZE_PX,
      fabGap: 8,
    }
  }
  const cs = getComputedStyle(el)
  // Prefer CSS --fab-size. Only trust getBoundingClientRect when the element
  // is actually a FAB (shell width would collapse the snap lattice to a line).
  const isFabEl =
    el.classList?.contains('bh-fab') || el.classList?.contains('mapIdeasFab')
  const measured = isFabEl ? el.getBoundingClientRect?.().width : NaN
  return {
    offset: cssLengthPx(
      el,
      cs.getPropertyValue('--fab-corner-offset'),
      DEFAULT_OFFSET_PX,
    ),
    fabSize:
      Number.isFinite(measured) && measured > 0
        ? measured
        : cssLengthPx(
            el,
            cs.getPropertyValue('--fab-size'),
            DEFAULT_FAB_SIZE_PX,
          ),
    fabGap: cssLengthPx(el, cs.getPropertyValue('--fab-gap'), 8),
  }
}

/**
 * @param {{ col: number, row: number }} cell
 * @param {number} wrapW
 * @param {number} wrapH
 * @param {{ cols: number, rows: number }} grid
 * @param {{ offset: number, fabSize: number }} metrics
 * @returns {{ left: number, top: number }}
 */
export function cellToOffset(cell, wrapW, wrapH, grid, metrics) {
  const { offset, fabSize } = metrics
  const spanX = Math.max(0, wrapW - 2 * offset - fabSize)
  const spanY = Math.max(0, wrapH - 2 * offset - fabSize)
  const cellW = grid.cols <= 1 ? 0 : spanX / (grid.cols - 1)
  const cellH = grid.rows <= 1 ? 0 : spanY / (grid.rows - 1)
  const clamped = clampFabCell(cell, grid)
  return {
    left: offset + clamped.col * cellW,
    top: offset + clamped.row * cellH,
  }
}

/**
 * @param {number} x FAB center x relative to wrap
 * @param {number} y FAB center y relative to wrap
 */
export function pointToCell(x, y, wrapW, wrapH, grid, metrics) {
  const { offset, fabSize } = metrics
  const spanX = Math.max(1, wrapW - 2 * offset - fabSize)
  const spanY = Math.max(1, wrapH - 2 * offset - fabSize)
  const left = x - fabSize / 2
  const top = y - fabSize / 2
  const col =
    grid.cols <= 1
      ? 0
      : Math.round(((left - offset) / spanX) * (grid.cols - 1))
  const row =
    grid.rows <= 1
      ? 0
      : Math.round(((top - offset) / spanY) * (grid.rows - 1))
  return clampFabCell({ col, row }, grid)
}

/**
 * Menu panel opens toward viewport center.
 * @returns {{ edgeX: 'left' | 'right', edgeY: 'top' | 'bottom' }}
 */
export function cellEdges(cell, grid) {
  const midCol = (grid.cols - 1) / 2
  const midRow = (grid.rows - 1) / 2
  return {
    edgeX: cell.col <= midCol ? 'left' : 'right',
    edgeY: cell.row <= midRow ? 'top' : 'bottom',
  }
}

export function isMapPageActive() {
  if (typeof document === 'undefined') return false
  return Boolean(document.querySelector('[data-map-page]'))
}

/**
 * Previously soft-avoided chrome bands. Kept as an empty set so FABs can
 * snap to any cell; collision between FABs is handled via `occupied`.
 * @param {{ cols: number, rows: number }} [_grid]
 * @param {{ map?: boolean, bp?: string }} [_opts]
 * @returns {Set<string>}
 */
export function reservedCells(_grid, _opts = {}) {
  return new Set()
}

/**
 * @param {{ col: number, row: number }} cell
 * @param {{ cols: number, rows: number }} grid
 * @param {Set<string>} reserved
 * @param {Set<string>} [occupied] other FAB cells to avoid
 */
export function nearestFreeCell(cell, grid, reserved, occupied = new Set()) {
  const start = clampFabCell(cell, grid)
  const blocked = (c) => {
    const key = formatFabCell(c)
    return reserved.has(key) || occupied.has(key)
  }
  if (!blocked(start)) return start

  const maxR = Math.max(grid.cols, grid.rows)
  for (let r = 1; r <= maxR; r += 1) {
    /** @type {{ col: number, row: number, d: number }[]} */
    const ring = []
    for (let dc = -r; dc <= r; dc += 1) {
      for (let dr = -r; dr <= r; dr += 1) {
        if (Math.max(Math.abs(dc), Math.abs(dr)) !== r) continue
        const next = { col: start.col + dc, row: start.row + dr }
        if (
          next.col < 0 ||
          next.row < 0 ||
          next.col >= grid.cols ||
          next.row >= grid.rows
        ) {
          continue
        }
        if (blocked(next)) continue
        ring.push({
          ...next,
          d: Math.hypot(next.col - start.col, next.row - start.row),
        })
      }
    }
    if (ring.length) {
      ring.sort((a, b) => a.d - b.d || a.row - b.row || a.col - b.col)
      return { col: ring[0].col, row: ring[0].row }
    }
  }

  // Fallback: any unblocked cell, else original clamp.
  for (let row = 0; row < grid.rows; row += 1) {
    for (let col = 0; col < grid.cols; col += 1) {
      const next = { col, row }
      if (!blocked(next)) return next
    }
  }
  return start
}

/** XL storage token → cell in the active viewport grid. */
export function storageCellToLocal(token, width) {
  const grid = gridForWidth(width)
  const cell = parseFabCell(token) || { col: 0, row: 0 }
  return remapFabCell(clampFabCell(cell, FAB_GRID_XL), FAB_GRID_XL, grid)
}

/** Active-grid cell → XL storage token. */
export function localCellToStorage(cell, width) {
  const grid = gridForWidth(width)
  const xl = remapFabCell(clampFabCell(cell, grid), grid, FAB_GRID_XL)
  return formatFabCell(xl)
}
