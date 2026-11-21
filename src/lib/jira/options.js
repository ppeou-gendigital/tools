// Mantine's MultiSelect wants `{ value, label }`. Everything else in this app —
// the local catalogs and the runner's `picker.*` responses — uses `{ id, name }`.
// Normalize both shapes in one place so a remote result can never be dropped
// just because it arrived in the runner's shape.

export function toOption(item) {
  const value = item?.value ?? item?.id
  if (value === undefined || value === null || value === '') return null

  return {
    value: String(value),
    label: String(item.label ?? item.name ?? value),
  }
}

export function dedupeOptions(list = []) {
  const seen = new Set()
  const result = []

  for (const item of Array.isArray(list) ? list : []) {
    const option = toOption(item)
    if (!option || seen.has(option.value)) continue
    seen.add(option.value)
    result.push(option)
  }

  return result
}

// Mantine's default filter only looks at `label`, so a remote result found by
// its id — a project key like WEBAVAST, a custom field id, a login — would be
// thrown away after the server already matched it. Match either side instead.
export function filterOptions({ options = [], search = '', limit = Infinity } = {}) {
  const needle = String(search ?? '').trim().toLowerCase()
  const result = []

  for (const option of Array.isArray(options) ? options : []) {
    if (result.length >= limit) break

    const label = String(option.label ?? '').toLowerCase()
    const value = String(option.value ?? '').toLowerCase()
    if (label.includes(needle) || value.includes(needle)) result.push(option)
  }

  return result
}
