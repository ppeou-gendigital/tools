// Cell rendering for the exported table. One formatter per field kind, shared
// by both exports.

import { FIELD_KIND } from '../fields.js'

const EXCEL_CELL_BREAK = '<br style="mso-data-placement:same-cell;" />'
const MUTED = 'color: #555; text-align: right;'

const ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ESCAPES[char])
}

// Jira reports estimates in seconds; the sheet shows hours.
export function formatHours(seconds) {
  if (seconds === null || seconds === undefined || seconds === '') return ''
  const value = Number(seconds)
  if (!Number.isFinite(value)) return ''
  return Math.round((value / 3600) * 100) / 100
}

function displayName(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value.displayName ?? value.name ?? value.key ?? ''
}

function textValue(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return value.name ?? value.value ?? ''
}

function renderKey(key, origin) {
  if (!key) return ''
  const href = `${origin}/browse/${encodeURIComponent(key)}`
  return `<a data-issue-key="${escapeHtml(key)}" href="${escapeHtml(href)}">${escapeHtml(key)}</a>`
}

function renderComments(comment) {
  const comments = comment?.comments ?? []
  if (!comment?.total || comments.length === 0) return ''

  return comments
    .map(({ author, updateAuthor, body, created, updated }) => {
      const parts = ['<div>', body ?? '', EXCEL_CELL_BREAK, EXCEL_CELL_BREAK]
      parts.push(
        `<span style="${MUTED}">Created by ${escapeHtml(displayName(author))} on ${escapeHtml(formatTimestamp(created))}</span>`,
      )
      if (updated && updated !== created) {
        parts.push(EXCEL_CELL_BREAK)
        parts.push(
          `<span style="${MUTED}">Updated by ${escapeHtml(displayName(updateAuthor))} on ${escapeHtml(formatTimestamp(updated))}</span>`,
        )
      }
      parts.push('</div>')
      return parts.join('')
    })
    .join('')
}

function formatTimestamp(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString()
}

// Flagged is an array of { value, disable } entries.
function flagValue(value) {
  if (!Array.isArray(value)) return ''
  const entry = value[0]
  if (!entry || entry.disable) return ''
  return entry.value ?? ''
}

export function renderCell(field, value, context = {}) {
  switch (field?.kind) {
    case FIELD_KIND.KEY:
      return renderKey(textValue(value), context.origin ?? '')
    case FIELD_KIND.USER:
      return escapeHtml(displayName(value))
    case FIELD_KIND.SECONDS: {
      const hours = formatHours(value)
      return hours === '' ? '' : String(hours)
    }
    case FIELD_KIND.FLAG:
      return escapeHtml(flagValue(value))
    case FIELD_KIND.COMMENTS:
      return renderComments(value)
    case FIELD_KIND.TEXT:
    default:
      return escapeHtml(textValue(value))
  }
}
