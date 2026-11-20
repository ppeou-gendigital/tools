// Builds the HTML table that gets copied to the clipboard. Excel reads the
// markup directly, so cells stay plain <td> elements with the spreadsheet
// line-break style only where multi-line content is expected.

import { getField } from '../fields.js'
import { escapeHtml, renderCell } from './cells.js'

const SUBTASK_CELL_ATTRS =
  'class="top-align" valign="top" style="mso-vertical-align: top;"'

export function buildTableHtml({ columns = [], rows = [], origin = '' }) {
  const head = columns
    .map((column) => `<td>${escapeHtml(column.name ?? column.id)}</td>`)
    .join('')

  const body = rows
    .map((row) => {
      const parent = `<tr>${columns
        .map(
          (column) =>
            `<td>${renderCell(getField(column.id), row.values?.[column.id], { origin })}</td>`,
        )
        .join('')}</tr>`

      const children = (row.children ?? [])
        .map(
          (child) =>
            `<tr>${columns
              .map(
                (column) =>
                  `<td ${SUBTASK_CELL_ATTRS}>${renderCell(getField(column.id), child.values?.[column.id], { origin })}</td>`,
              )
              .join('')}</tr>`,
        )
        .join('')

      return parent + children
    })
    .join('')

  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`
}
