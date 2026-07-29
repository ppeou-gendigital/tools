/** Session-only reservation of the bottom-right FAB corner (not persisted). */

let bottomRightReserved = false
const listeners = new Set()

export function getFabBottomRightReserved() {
  return bottomRightReserved
}

export function setFabBottomRightReserved(next) {
  const value = Boolean(next)
  if (value === bottomRightReserved) return
  bottomRightReserved = value
  for (const listener of listeners) listener()
}

export function subscribeFabBottomRightReserved(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * True when a FAB cell collides with a 2-wide bottom-right float.
 * @param {{ col: number, row: number }} cell
 * @param {{ cols: number, rows: number }} grid
 */
export function isBottomRightFabCollision(cell, grid) {
  if (!cell || !grid) return false
  return cell.row === grid.rows - 1 && cell.col >= grid.cols - 2
}
