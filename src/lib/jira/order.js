// Ordered list helpers for the report column and resource ordering controls.

export function moveItem(items, from, to) {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= items.length ||
    to >= items.length
  ) {
    return items
  }

  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

// Target index for a row dragged from `from` onto the `target` row. `edge` is
// the half of the target row the pointer is over: dropping on the top half
// inserts before it, the bottom half after it. The result accounts for the
// dragged row being removed first, so it can be passed straight to moveItem.
export function dropIndex(from, target, edge = 'after', length = 0) {
  if (length <= 0 || from < 0 || target < 0) return from

  let to = edge === 'before' ? target : target + 1
  if (from < to) to -= 1

  return Math.max(0, Math.min(to, length - 1))
}

export function removeItem(items, id) {
  return items.filter((item) => item.id !== id)
}

export function idsOf(items = []) {
  return items.map((item) => item.id)
}
