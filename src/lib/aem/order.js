// Pure ordering helpers for the popup's drag-and-drop group list.

// Moves one entry between positions; returns a new array (or the input when
// the move is a no-op or out of range).
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

// Applies a stored id order to the groups. Ids missing from the stored order
// (new groups added after the user reordered) keep their registry order at the
// end instead of disappearing.
export function applyGroupOrder(groups, order) {
  if (!Array.isArray(order) || order.length === 0) return groups

  const rank = new Map(order.map((id, index) => [id, index]))
  return [...groups].sort((a, b) => {
    const rankA = rank.has(a.id) ? rank.get(a.id) : Number.MAX_SAFE_INTEGER
    const rankB = rank.has(b.id) ? rank.get(b.id) : Number.MAX_SAFE_INTEGER
    return rankA - rankB
  })
}
