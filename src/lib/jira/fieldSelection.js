// The Fields column is one ordered list. `fetchFields` is everything Jira
// returns; `reportFields` marks which of those fields appear in the exported
// table. List order is report order, and hiding a field keeps its position so
// it can be shown again without reshuffling the list.

import { idsOf, normalizeItems } from './filters.js'

// Fetched fields keep their stored order, but the visible subset must read in
// the same order as `reportFields` (which profiles may have reordered before
// the two lists were merged). Only the visible projection is compared, so a
// hidden row in the middle never moves to the bottom.
export function alignFieldOrder(fetchFields = [], reportFields = []) {
  const fetch = normalizeItems(fetchFields)
  const report = normalizeItems(reportFields)
  const reportIds = new Set(report.map((field) => field.id))
  const visible = fetch.filter((field) => reportIds.has(field.id))
  const aligned =
    visible.length === report.length &&
    visible.every((field, index) => field.id === report[index].id)

  if (aligned) {
    // Order already agrees; keep every row in place and just prefer the report
    // label for the visible ones.
    const reportById = new Map(report.map((field) => [field.id, field]))
    return fetch.map((field) => reportById.get(field.id) ?? field)
  }

  // Legacy (or a report column missing from the fetch list): report columns
  // first in their existing order, then whatever was fetched but not reported.
  return normalizeItems([
    ...report,
    ...fetch.filter((field) => !reportIds.has(field.id)),
  ])
}

// One ordered list, two stored arrays: everything is fetched, only the marked
// ids become report columns (in list order).
export function applyFieldRows(rows = [], visibleIds = new Set()) {
  const fields = normalizeItems(rows)
  const visible = new Set(visibleIds)

  return {
    fetchFields: fields,
    reportFields: fields.filter((field) => visible.has(field.id)),
  }
}

// Eye toggle: flips membership without reordering. Returns a new Set so callers
// can pass the previous visibility straight through.
export function toggleReportVisibility(reportFields = [], id) {
  const visible = new Set(idsOf(reportFields))
  if (visible.has(id)) {
    visible.delete(id)
  } else {
    visible.add(id)
  }
  return visible
}
