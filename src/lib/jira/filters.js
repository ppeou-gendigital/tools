// Selection helpers shared by the storage layer and the UI. Selections are
// ordered arrays of { id, name } so a saved profile stays readable and the
// export order is the array order.

export const FILTER_KEYS = [
  'projects',
  'resolutions',
  'sprints',
  'types',
  'statuses',
]

export function emptyFilters() {
  return FILTER_KEYS.reduce((filters, key) => {
    filters[key] = []
    return filters
  }, {})
}

// Accepts { id, name } objects or bare ids/strings and returns clean items.
export function normalizeItems(items = []) {
  const seen = new Set()
  const result = []

  for (const item of Array.isArray(items) ? items : []) {
    const id = typeof item === 'string' ? item : item?.id
    if (!id || seen.has(id)) continue
    seen.add(id)
    const name =
      typeof item === 'string' ? item : (item.name ?? item.displayName ?? id)
    result.push({ id: String(id), name: String(name) })
  }

  return result
}

export function mergeItems(...lists) {
  return normalizeItems(lists.flat())
}

export function idsOf(items = []) {
  return normalizeItems(items).map((item) => item.id)
}

export function itemsForIds(ids = [], ...pools) {
  const byId = new Map(mergeItems(...pools).map((item) => [item.id, item]))
  return normalizeItems(
    ids.map((id) => byId.get(id) ?? { id, name: String(id) }),
  )
}

// MultiSelect works with ids; the stored shape stays ordered items.
export function setFilterValues(filters, key, ids, catalog = []) {
  return {
    ...filters,
    [key]: itemsForIds(ids, catalog, filters[key]),
  }
}

export function toggleFilterValue(filters, key, item) {
  const current = normalizeItems(filters[key])
  const exists = current.some((entry) => entry.id === item.id)
  return {
    ...filters,
    [key]: exists
      ? current.filter((entry) => entry.id !== item.id)
      : [...current, { id: String(item.id), name: String(item.name ?? item.id) }],
  }
}
