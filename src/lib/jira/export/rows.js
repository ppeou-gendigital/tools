// Row shaping helpers that sit between the parsers and the table builder.

import { formatHours } from './cells.js'

// Copies each person's rolled-up subtask hours from the issue-view parser into
// the resource column that matches their display name.
//
// The parser aggregates remaining estimates in seconds, while the sheet shows
// hours, so the conversion happens here. Zero hours are left blank, matching
// the previous sheet.
export function applyResourceHours(rows, resources = []) {
  return rows.map((row) => {
    const values = { ...row.values }
    for (const resource of resources) {
      const hours = formatHours(row.subtaskHours?.[resource.name])
      values[resource.id] = hours === '' || hours === 0 ? '' : hours
    }
    return { ...row, values }
  })
}

export function countRows(rows = []) {
  return rows.reduce((total, row) => total + 1 + (row.children?.length ?? 0), 0)
}
