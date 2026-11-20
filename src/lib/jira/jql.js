// JQL construction. Pure string work: the same builder feeds the issue-view
// export and the REST search, so the two exports can no longer drift apart.

const FILTER_CLAUSES = {
  projects: { clause: 'project', quote: true },
  resolutions: { clause: 'resolution', quote: true },
  sprints: { clause: 'Sprint', quote: false },
  types: { clause: 'issuetype', quote: true },
  statuses: { clause: 'status', quote: true },
}

// Clause order follows the previous implementation.
export const FILTER_ORDER = [
  'projects',
  'resolutions',
  'sprints',
  'types',
  'statuses',
]

export function quoteJql(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function valuesOf(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => (typeof item === 'string' ? item : item?.id))
    .filter((value) => value !== undefined && value !== null && value !== '')
}

export function buildJql({ filters = {}, orderBy = [] } = {}) {
  const clauses = []

  for (const key of FILTER_ORDER) {
    const values = valuesOf(filters[key])
    if (values.length === 0) continue

    const { clause, quote } = FILTER_CLAUSES[key]
    const list = values.map((value) => (quote ? quoteJql(value) : String(value)))
    clauses.push(`${clause} in (${list.join(', ')})`)
  }

  const order = (Array.isArray(orderBy) ? orderBy : [])
    .filter((entry) => entry?.id)
    .map((entry) => {
      const direction = String(entry.direction ?? 'ASC').toUpperCase()
      return `${quoteJql(entry.id)} ${direction === 'DESC' ? 'DESC' : 'ASC'}`
    })

  const filter = clauses.join(' AND ')
  if (order.length === 0) return filter
  return `${filter ? `${filter} ` : ''}ORDER BY ${order.join(', ')}`
}

export function hasFilters(filters = {}) {
  return FILTER_ORDER.some((key) => valuesOf(filters[key]).length > 0)
}
