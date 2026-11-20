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

export function removeItem(items, id) {
  return items.filter((item) => item.id !== id)
}

export function idsOf(items = []) {
  return items.map((item) => item.id)
}
