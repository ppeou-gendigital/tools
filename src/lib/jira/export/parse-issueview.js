// Issue-view HTML parser. The endpoint renders the current Jira columns as an
// HTML table; this turns it into rows keyed by field id.
//
// Takes a Document rather than an HTML string so it stays testable outside a
// browser (tests build one with linkedom). Table helpers (`tBodies`, `rows`,
// `cells`) are avoided on purpose: they are browser-only DOM extensions.

import { FIELD_KIND, getField } from '../fields.js'

export class ReportParseError extends Error {
  constructor(message, code = 'parse') {
    super(message)
    this.name = 'ReportParseError'
    this.code = code
  }
}

const SIGNED_OUT =
  /(?:id|name|class)="[^"]*login-form|Log in to Jira|You are not authenticated/i

function elementChildren(element, tagName) {
  return Array.from(element?.children ?? []).filter(
    (child) => child.tagName === tagName,
  )
}

function bodyRows(table) {
  const body = table.querySelector('tbody') ?? table
  return elementChildren(body, 'TR')
}

function rowCells(row) {
  return elementChildren(row, 'TD')
}

// Subtask rows prefix the summary with a link to the parent issue.
function cellText(cell) {
  const parent = cell.querySelector?.('.parentIssue')
  const text = parent
    ? (cell.textContent ?? '').replace(parent.textContent ?? '', '')
    : (cell.textContent ?? '')
  return text.replace(/\s+/g, ' ').trim()
}

function cellValue(cell, field) {
  const text = cellText(cell)
  if (field.kind === FIELD_KIND.SECONDS) {
    if (text === '') return null
    const seconds = Number(text)
    return Number.isFinite(seconds) ? seconds : null
  }
  return text
}

function columnId(cell) {
  const raw = (cell.getAttribute?.('class') ?? '').trim()
  return raw ? raw.split(/\s+/)[0] : ''
}

export function parseIssueView(doc) {
  const table = doc?.getElementById?.('issuetable')
  if (!table) {
    const html = doc?.documentElement?.outerHTML ?? ''
    if (SIGNED_OUT.test(html)) {
      throw new ReportParseError(
        'Jira returned the login page. Sign in to Jira in this tab and try again.',
        'signed-out',
      )
    }
    throw new ReportParseError(
      'Jira did not return an issue table. Check the filters, or reload the Jira tab.',
    )
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

  for (const [order, row] of bodyRows(table).entries()) {
    const key = row.getAttribute('data-issuekey')
    if (!key) continue

    const parentKey =
      row.querySelector?.('.parentIssue')?.textContent?.trim() || null

    const values = {}
    for (const cell of rowCells(row)) {
      const id = columnId(cell)
      if (!id) continue
      values[id] = cellValue(cell, getField(id))
    }

    if (parentKey) {
      const parent = ensure(parentKey)
      const assignee = values.assignee
      const hours = values.timeestimate
      // Roll a subtask's remaining estimate into its own assignee bucket.
      if (assignee && typeof hours === 'number') {
        parent.subtaskHours[assignee] =
          (parent.subtaskHours[assignee] ?? 0) + hours
      }
    } else {
      const parentRow = ensure(key)
      parentRow.order = order
      parentRow.values = values
    }
  }

  // Parents whose own row is missing (JQL excluded them) are dropped instead
  // of rendering a blank line.
  const rows = [...byKey.values()]
    .filter((row) => Number.isFinite(row.order))
    .sort((a, b) => a.order - b.order)

  return { rows }
}
