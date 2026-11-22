// Jira-backed profiles: ticket keys, attachment catalogs, change detection,
// and the profile entries created from a shared attachment. Pure helpers only —
// the network lives in the content-script runner.

import { toExport } from './profiles.js'

// Jira project keys are uppercase letters/digits/underscores, then -number.
const TICKET_KEY = /^[A-Z][A-Z0-9_]*-\d+$/
const JSON_MIME = /^(?:application\/(?:json|x-json)|text\/json)$/i

export const REMOTE_STATE = {
  checking: 'checking',
  current: 'current',
  changed: 'changed',
  missing: 'missing',
  error: 'error',
}

export function isTicketKey(value) {
  return TICKET_KEY.test(String(value ?? '').trim().toUpperCase())
}

// Accepts either a TagsInput array or a pasted string. Splits on commas,
// semicolons, and whitespace, uppercases, and drops duplicates.
export function parseTicketKeys(input) {
  const parts = (Array.isArray(input) ? input : [input])
    .flatMap((value) => String(value ?? '').split(/[\s,;]+/))
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean)

  const keys = []
  const invalid = []
  const seen = new Set()

  for (const value of parts) {
    if (!isTicketKey(value)) {
      if (!invalid.includes(value)) invalid.push(value)
      continue
    }
    if (seen.has(value)) continue
    seen.add(value)
    keys.push(value)
  }

  return { keys, invalid }
}

export function mergeRecentTickets(existing, keys, limit = 20) {
  const merged = []
  const seen = new Set()
  for (const value of [...(Array.isArray(keys) ? keys : []), ...(Array.isArray(existing) ? existing : [])]) {
    const key = String(value ?? '').trim().toUpperCase()
    if (!isTicketKey(key) || seen.has(key)) continue
    seen.add(key)
    merged.push(key)
  }
  return merged.slice(0, limit)
}

export function isJsonAttachment(attachment) {
  const filename = String(attachment?.filename ?? '')
  const mimeType = String(attachment?.mimeType ?? '')
  return /\.json$/i.test(filename) || JSON_MIME.test(mimeType)
}

// A profile is Jira-backed only when all three identifying pieces are present.
// Anything else (including profiles imported from local JSON files) is pruned.
export function hasJiraSource(entry) {
  const source = entry?.source
  return Boolean(
    source &&
      source.type === 'jira' &&
      source.issueKey &&
      source.attachmentId,
  )
}

export function pruneLocalProfiles(index) {
  const items = Array.isArray(index?.items) ? index.items : []
  const kept = items.filter(hasJiraSource)
  const removedIds = items
    .filter((item) => !hasJiraSource(item))
    .map((item) => item.id)
    .filter(Boolean)

  const previousActive = index?.activeId ?? ''
  const activeId = kept.some((item) => item.id === previousActive)
    ? previousActive
    : (kept[0]?.id ?? '')

  return { index: { activeId, items: kept }, removedIds }
}

// `current` means the exact attachment we imported is still there with the same
// timestamp. `changed` means the linked id is gone (or its metadata moved) but a
// file with the same name exists. `missing` means the file is gone entirely.
export function remoteState(source, attachments) {
  const list = Array.isArray(attachments) ? attachments : []
  const linked = list.find(
    (attachment) => String(attachment?.id) === String(source?.attachmentId),
  )

  if (linked) {
    const sameCreated =
      !source?.remoteCreatedAt ||
      !linked.created ||
      String(linked.created) === String(source.remoteCreatedAt)
    // A second file with the same name means a sync left a duplicate behind.
    const duplicates = list.filter(
      (attachment) =>
        attachment?.filename === source?.filename &&
        String(attachment?.id) !== String(linked.id),
    )
    return sameCreated && duplicates.length === 0
      ? REMOTE_STATE.current
      : REMOTE_STATE.changed
  }

  const sameName = list.find(
    (attachment) => attachment?.filename === source?.filename,
  )
  return sameName ? REMOTE_STATE.changed : REMOTE_STATE.missing
}

export function safeFileName(value, fallback = 'profile.json') {
  const name = String(value ?? '')
    .replace(/[^\w.-]+/g, '_')
    .replace(/^_+|_+$/g, '')
  if (!name) return fallback
  return /\.json$/i.test(name) ? name : `${name}.json`
}

// New profiles are named after the profile plus its stable id, e.g.
// WebExp_9f1c2a7e-1b2c-4d5e-8f90-123456789abc.json. The id makes the file
// unique without a timestamp; the readable prefix keeps the ticket's
// attachment list human-friendly.
export function profileFileName(name, id) {
  const base =
    String(name ?? '')
      .replace(/[^\w.-]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .replace(/\.json$/i, '')
      .slice(0, 80) || 'profile'
  const suffix =
    String(id ?? '')
      .replace(/[^\w.-]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'profile'
  return `${base}_${suffix}.json`
}

// Keep the file name stable across syncs so a ticket keeps one file per profile.
export function uploadFileName(entry) {
  const fromSource = entry?.source?.filename
  if (fromSource) return safeFileName(fromSource)
  const id = entry?.profile?.id
  if (id) return profileFileName(entry?.name, id)
  return safeFileName(`${entry?.name ?? 'profile'}.json`)
}

export function buildSnapshot(entry, selection, meta = {}) {
  if (!entry?.profile) return null
  return toExport({
    ...entry.profile,
    name: entry.name ?? entry.profile.name,
    selection: selection ?? entry.profile.selection,
    ...meta,
  })
}

export function sourceLabel(source) {
  if (!source) return ''
  return [source.issueKey, source.filename].filter(Boolean).join(' · ')
}
