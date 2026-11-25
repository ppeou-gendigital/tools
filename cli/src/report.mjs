// REST → table adapter. The extension parses the issue-view HTML; here the
// same rows are built from a search payload, then handed to the very same
// applyResourceHours / buildTableHtml chain, so both clients cannot drift.
//
// The roll-up rule is copied deliberately: a subtask's remaining estimate lands
// in its own assignee's bucket, and a parent only appears when the query also
// returned the parent row (an issue matched solely as a subtask is dropped).

import { buildJql } from '../../src/lib/jira/jql.js'
import {
  COMMENT_EXPORT_FIELDS,
  COMMENT_EXPORT_FIELD_IDS,
} from '../../src/lib/jira/fields.js'
import { idsOf, mergeItems } from '../../src/lib/jira/filters.js'
import { normalizeResources } from '../../src/lib/jira/profiles.js'
import {
  applyResourceHours,
  countRows,
} from '../../src/lib/jira/export/rows.js'
import { buildTableHtml } from '../../src/lib/jira/export/table.js'
import { parseIssues } from '../../src/lib/jira/export/parse-issues.js'

const FRONTEND_ONLY_FIELDS = new Set(['issuekey', 'subtask'])

function assigneeName(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value.displayName ?? value.name ?? ''
}

// Everything the profile fetches plus what the roll-up needs. `parent` is what
// tells a subtask apart from a reportable issue.
export function capacityFields(selection) {
  const ids = idsOf(
    mergeItems(selection.fetchFields, selection.reportFields),
  ).filter((id) => !FRONTEND_ONLY_FIELDS.has(id))

  if (!ids.includes('parent')) ids.push('parent')
  return ids
}

export function rowsFromSearch(payload) {
  const issues = Array.isArray(payload?.issues) ? payload.issues : []

  // Parent keys are needed up front so a subtask seen first still rolls up.
  const parentKeys = new Set()
  for (const issue of issues) {
    if (issue?.key && !issue?.fields?.parent) parentKeys.add(issue.key)
  }

  const byKey = new Map()
  const ensure = (key) => {
    if (!byKey.has(key)) {
      byKey.set(key, {
        id: key,
        order: Number.POSITIVE_INFINITY,
        values: {},
        subtaskHours: {},
      })
    }
    return byKey.get(key)
  }

  issues.forEach((issue, order) => {
    if (!issue?.key) return
    const fields = issue.fields ?? {}
    const parentKey = fields.parent?.key ?? null

    if (parentKey) {
      if (!parentKeys.has(parentKey)) return
      const row = ensure(parentKey)
      const name = assigneeName(fields.assignee)
      const seconds = fields.timeestimate
      if (name && typeof seconds === 'number') {
        row.subtaskHours[name] = (row.subtaskHours[name] ?? 0) + seconds
      }
      return
    }

    const row = ensure(issue.key)
    row.order = order
    row.values = { ...fields, issuekey: issue.key }
  })

  const rows = [...byKey.values()]
    .filter((row) => Number.isFinite(row.order))
    .sort((a, b) => a.order - b.order)

  return { rows }
}

export function capacityTable({ selection, payload, origin }) {
  const { rows } = rowsFromSearch(payload)
  const resources = normalizeResources(selection.resources)
  const merged = applyResourceHours(rows, resources)

  const html = buildTableHtml({
    columns: [...selection.reportFields, ...resources],
    rows: merged,
    origin,
  })

  return {
    html,
    rows: merged,
    issues: merged.length,
    rowCount: countRows(merged),
    people: personTotals(merged, resources),
  }
}

// Remaining hours per resource, rounded like the sheet.
export function personTotals(rows, resources) {
  const seconds = {}
  for (const row of rows) {
    for (const [name, value] of Object.entries(row.subtaskHours ?? {})) {
      seconds[name] = (seconds[name] ?? 0) + value
    }
  }

  return resources.map((resource) => ({
    name: resource.name,
    hours: Math.round(((seconds[resource.name] ?? 0) / 3600) * 100) / 100,
  }))
}

// Mirrors the runner's field list for the tickets export.
export function commentFields() {
  const ids = new Set(
    COMMENT_EXPORT_FIELD_IDS.filter((id) => !FRONTEND_ONLY_FIELDS.has(id)),
  )
  ids.add('subtasks')
  return [...ids]
}

export function commentsTable({ payload, origin }) {
  const { rows } = parseIssues(payload)
  const html = buildTableHtml({
    columns: COMMENT_EXPORT_FIELDS,
    rows,
    origin,
  })

  return { html, rows, issues: rows.length, rowCount: countRows(rows) }
}

export function jqlFor(selection) {
  return buildJql(selection)
}

export function hasFilters(selection) {
  const filters = selection?.filters ?? {}
  return Object.values(filters).some(
    (items) => Array.isArray(items) && items.length > 0,
  )
}
