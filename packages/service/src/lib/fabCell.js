// FAB placement cells. Stored as "col:row" in XL grid space (12×16);
// runtime remaps into the active breakpoint grid.

export const FAB_GRIDS = {
  sm: { cols: 6, rows: 12 },
  md: { cols: 8, rows: 12 },
  lg: { cols: 10, rows: 14 },
  xl: { cols: 12, rows: 16 },
}

export const FAB_GRID_XL = FAB_GRIDS.xl

export const DEFAULT_MENU_CELL = '11:15'
export const DEFAULT_AI_CELL = '0:15'

const LEGACY_CORNERS = {
  'top-left': { col: 0, row: 0 },
  'top-right': { col: FAB_GRID_XL.cols - 1, row: 0 },
  'bottom-left': { col: 0, row: FAB_GRID_XL.rows - 1 },
  'bottom-right': {
    col: FAB_GRID_XL.cols - 1,
    row: FAB_GRID_XL.rows - 1,
  },
}

/**
 * @param {unknown} v
 * @returns {{ col: number, row: number } | null}
 */
export function parseFabCell(v) {
  if (typeof v !== 'string') return null
  const legacy = LEGACY_CORNERS[v]
  if (legacy) return { ...legacy }
  const m = /^(\d+):(\d+)$/.exec(v.trim())
  if (!m) return null
  const col = Number(m[1])
  const row = Number(m[2])
  if (!Number.isInteger(col) || !Number.isInteger(row)) return null
  return { col, row }
}

/**
 * @param {{ col: number, row: number }} cell
 */
export function formatFabCell(cell) {
  return `${cell.col}:${cell.row}`
}

/**
 * @param {{ col: number, row: number }} cell
 * @param {{ cols: number, rows: number }} grid
 */
export function clampFabCell(cell, grid = FAB_GRID_XL) {
  return {
    col: Math.min(grid.cols - 1, Math.max(0, cell.col)),
    row: Math.min(grid.rows - 1, Math.max(0, cell.row)),
  }
}

/**
 * Remap one axis with nearest-edge offset (FABs are edge furniture).
 * Exact center only falls back to proportional stretch.
 * @param {number} index
 * @param {number} fromCount
 * @param {number} toCount
 */
function remapAxisNearestEdge(index, fromCount, toCount) {
  if (toCount <= 1) return 0
  if (fromCount <= 1) return 0
  const fromMax = fromCount - 1
  const toMax = toCount - 1
  const fromStart = index
  const fromEnd = fromMax - index
  if (fromEnd < fromStart) return toMax - fromEnd
  if (fromStart < fromEnd) return fromStart
  // Exact center — proportional.
  return Math.round((index * toMax) / fromMax)
}

/**
 * @param {{ col: number, row: number }} cell
 * @param {{ cols: number, rows: number }} fromGrid
 * @param {{ cols: number, rows: number }} toGrid
 */
export function remapFabCell(cell, fromGrid, toGrid) {
  const col = remapAxisNearestEdge(cell.col, fromGrid.cols, toGrid.cols)
  const row = remapAxisNearestEdge(cell.row, fromGrid.rows, toGrid.rows)
  return clampFabCell({ col, row }, toGrid)
}

/** Normalize any stored value to an XL-space "col:row" token. */
export function normalizeFabCell(v) {
  const parsed = parseFabCell(v)
  if (!parsed) return DEFAULT_MENU_CELL
  return formatFabCell(clampFabCell(parsed, FAB_GRID_XL))
}

/** Horizontal opposite in XL space — keeps FABs from stacking on migrate. */
export function oppositeFabCell(token) {
  const cell = clampFabCell(
    parseFabCell(token) || parseFabCell(DEFAULT_MENU_CELL),
    FAB_GRID_XL,
  )
  return formatFabCell({
    col: FAB_GRID_XL.cols - 1 - cell.col,
    row: cell.row,
  })
}

/** AI FAB cell; missing/invalid → opposite of menu; never equal to menu. */
export function normalizeAiFabCell(v, menuToken) {
  const menu = normalizeFabCell(menuToken)
  const parsed = parseFabCell(v)
  if (parsed) {
    const token = formatFabCell(clampFabCell(parsed, FAB_GRID_XL))
    if (token !== menu) return token
  }
  return oppositeFabCell(menu)
}
