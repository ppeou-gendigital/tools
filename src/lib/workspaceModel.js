// Pure helpers for the notas workspace document (notebooks, notes, tags,
// lockbox metadata). No React, no I/O — safe to unit-test and reuse from
// providers + sync.

import { normalizeSemver, SEMVER_FRESH } from '@/lib/workspaceSemver'

export const WORKSPACE_STORAGE_KEY = 'notas:workspace'
export const LEGACY_NOTES_KEY = 'notas:notes'

export const VIEW_MODES = ['book', 'timeline', 'custom', 'tags']
export const TIMELINE_FIELDS = ['createdAt', 'updatedAt']

export const DEFAULT_NOTEBOOK_NAME = 'Napkin Notes'
export const LEGACY_DEFAULT_NOTEBOOK_NAME = 'My Notebook'

/** Stock default names (current + legacy) for empty-workspace detection. */
const DEFAULT_NOTEBOOK_NAMES = new Set([
  DEFAULT_NOTEBOOK_NAME,
  LEGACY_DEFAULT_NOTEBOOK_NAME,
])

export function isDefaultNotebookName(name) {
  return DEFAULT_NOTEBOOK_NAMES.has(String(name ?? '').trim())
}

// Always a UUID — required by public.notas_* uuid primary keys.
function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  // RFC4122 v4 fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export { createId }

function isoOrNow(v) {
  if (typeof v === 'string' && v && !Number.isNaN(Date.parse(v))) return v
  return new Date().toISOString()
}

function isoOrEpoch(v) {
  if (typeof v === 'string' && v && !Number.isNaN(Date.parse(v))) return v
  return new Date(0).toISOString()
}

export function normalizeViewMode(v) {
  return VIEW_MODES.includes(v) ? v : 'timeline'
}

export function normalizeTimelineField(v) {
  return TIMELINE_FIELDS.includes(v) ? v : 'updatedAt'
}

export function normalizeTagName(name) {
  return String(name ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 64)
}

export function normalizeNotebook(raw) {
  if (!raw || typeof raw !== 'object') return null
  const id = typeof raw.id === 'string' && raw.id ? raw.id : null
  if (!id) return null
  let name = String(raw.name ?? '').trim() || DEFAULT_NOTEBOOK_NAME
  // One-time rename of the old stock default.
  if (name === LEGACY_DEFAULT_NOTEBOOK_NAME) {
    name = DEFAULT_NOTEBOOK_NAME
  }
  return {
    id,
    name,
    createdAt: isoOrNow(raw.createdAt),
    updatedAt: isoOrNow(raw.updatedAt),
    defaultView: normalizeViewMode(raw.defaultView),
    timelineField: normalizeTimelineField(raw.timelineField),
    lockboxId:
      typeof raw.lockboxId === 'string' && raw.lockboxId
        ? raw.lockboxId
        : null,
  }
}

export function normalizeNote(raw) {
  if (!raw || typeof raw !== 'object') return null
  const id = typeof raw.id === 'string' && raw.id ? raw.id : null
  if (!id) return null

  const locked =
    typeof raw.ciphertext === 'string' &&
    raw.ciphertext &&
    typeof raw.iv === 'string' &&
    raw.iv

  const pageNumber = Number(raw.pageNumber)
  const sortKey = Number(raw.sortKey)

  return {
    id,
    title: locked
      ? typeof raw.title === 'string'
        ? raw.title
        : 'Locked note'
      : typeof raw.title === 'string'
        ? raw.title
        : '',
    body: locked ? '' : typeof raw.body === 'string' ? raw.body : '',
    createdAt: isoOrEpoch(raw.createdAt ?? raw.updatedAt),
    updatedAt: isoOrEpoch(raw.updatedAt),
    pageNumber: Number.isFinite(pageNumber) ? pageNumber : 0,
    sortKey: Number.isFinite(sortKey) ? sortKey : 0,
    lockboxId:
      typeof raw.lockboxId === 'string' && raw.lockboxId
        ? raw.lockboxId
        : null,
    ciphertext: locked ? raw.ciphertext : null,
    iv: locked ? raw.iv : null,
  }
}

export function normalizeTag(raw) {
  if (!raw || typeof raw !== 'object') return null
  const id = typeof raw.id === 'string' && raw.id ? raw.id : null
  if (!id) return null
  const name = normalizeTagName(raw.name)
  if (!name) return null
  return { id, name }
}

export function normalizeNoteTag(raw) {
  if (!raw || typeof raw !== 'object') return null
  const noteId = typeof raw.noteId === 'string' && raw.noteId ? raw.noteId : null
  const tagId = typeof raw.tagId === 'string' && raw.tagId ? raw.tagId : null
  if (!noteId || !tagId) return null
  return { noteId, tagId }
}

export function normalizeNoteNotebook(raw) {
  if (!raw || typeof raw !== 'object') return null
  const noteId = typeof raw.noteId === 'string' && raw.noteId ? raw.noteId : null
  const notebookId =
    typeof raw.notebookId === 'string' && raw.notebookId
      ? raw.notebookId
      : null
  if (!noteId || !notebookId) return null
  return { noteId, notebookId }
}

export function normalizeLockboxMeta(raw) {
  if (!raw || typeof raw !== 'object') return null
  const id = typeof raw.id === 'string' && raw.id ? raw.id : null
  if (!id) return null
  const salt = typeof raw.salt === 'string' && raw.salt ? raw.salt : null
  const iterations =
    typeof raw.iterations === 'number' && raw.iterations > 0
      ? raw.iterations
      : null
  const verifier = raw.verifier
  if (
    !salt ||
    !iterations ||
    !verifier ||
    typeof verifier.ciphertext !== 'string' ||
    typeof verifier.iv !== 'string'
  ) {
    return null
  }
  const name = String(raw.name ?? '').trim() || 'Lockbox'
  const hint =
    typeof raw.hint === 'string' && raw.hint.trim()
      ? raw.hint.trim().slice(0, 120)
      : null
  return {
    id,
    name,
    salt,
    iterations,
    verifier: { ciphertext: verifier.ciphertext, iv: verifier.iv },
    hint,
    createdAt: isoOrNow(raw.createdAt),
    updatedAt: isoOrNow(raw.updatedAt),
  }
}

export function emptyWorkspace() {
  // Epoch timestamps so a fresh-device stock seed never looks "newer" than
  // real cloud content (persist() stamps revisedAt=now on real edits).
  const epoch = new Date(0).toISOString()
  const notebookId = createId()
  return {
    version: 1,
    semver: SEMVER_FRESH,
    activeNotebookId: notebookId,
    // Bumped on every local persist (including deletes) so sync can tell
    // that a removal is newer than a stale remote snapshot.
    revisedAt: epoch,
    notebooks: [
      {
        id: notebookId,
        name: DEFAULT_NOTEBOOK_NAME,
        createdAt: epoch,
        updatedAt: epoch,
        defaultView: 'timeline',
        timelineField: 'updatedAt',
        lockboxId: null,
      },
    ],
    notes: [],
    tags: [],
    noteTags: [],
    noteNotebooks: [],
    lockboxes: [],
    lockboxIdleTimeoutMs: null,
    pinnedNotebookIds: [],
  }
}

/** Keep valid notebook ids; first entry = most recently pinned. */
export function normalizePinnedNotebookIds(raw, notebookIds) {
  if (!Array.isArray(raw)) return []
  const seen = new Set()
  const out = []
  for (const id of raw) {
    if (typeof id !== 'string' || !id || !notebookIds.has(id) || seen.has(id)) {
      continue
    }
    seen.add(id)
    out.push(id)
  }
  return out
}

/** Move `id` to the front (most recently pinned). */
export function pinNotebookId(pinnedIds, id) {
  if (!id) return Array.isArray(pinnedIds) ? [...pinnedIds] : []
  return [id, ...(Array.isArray(pinnedIds) ? pinnedIds : []).filter((x) => x !== id)]
}

export function unpinNotebookId(pinnedIds, id) {
  if (!Array.isArray(pinnedIds)) return []
  return pinnedIds.filter((x) => x !== id)
}

export function normalizeWorkspace(raw) {
  if (!raw || typeof raw !== 'object') return emptyWorkspace()

  let notebooks = Array.isArray(raw.notebooks)
    ? raw.notebooks.map(normalizeNotebook).filter(Boolean)
    : []
  if (notebooks.length === 0) {
    return emptyWorkspace()
  }

  const notebookIds = new Set(notebooks.map((n) => n.id))
  const fallbackNotebookId = notebooks[0].id

  const notes = Array.isArray(raw.notes)
    ? raw.notes.map(normalizeNote).filter(Boolean)
    : []

  const tags = Array.isArray(raw.tags)
    ? raw.tags.map(normalizeTag).filter(Boolean)
    : []
  const tagIds = new Set(tags.map((t) => t.id))
  const noteIds = new Set(notes.map((n) => n.id))

  const noteTags = Array.isArray(raw.noteTags)
    ? raw.noteTags
        .map(normalizeNoteTag)
        .filter((jt) => jt && noteIds.has(jt.noteId) && tagIds.has(jt.tagId))
    : []

  const membershipKeys = new Set()
  const noteNotebooks = []
  function addMembership(noteId, notebookId) {
    if (!noteIds.has(noteId) || !notebookIds.has(notebookId)) return
    const key = `${noteId}:${notebookId}`
    if (membershipKeys.has(key)) return
    membershipKeys.add(key)
    noteNotebooks.push({ noteId, notebookId })
  }

  if (Array.isArray(raw.noteNotebooks)) {
    for (const jt of raw.noteNotebooks) {
      const normalized = normalizeNoteNotebook(jt)
      if (normalized) addMembership(normalized.noteId, normalized.notebookId)
    }
  }

  // Legacy single notebookId on the note → join row.
  if (Array.isArray(raw.notes)) {
    for (const n of raw.notes) {
      if (!n || typeof n !== 'object') continue
      const noteId = typeof n.id === 'string' ? n.id : null
      const notebookId =
        typeof n.notebookId === 'string' && notebookIds.has(n.notebookId)
          ? n.notebookId
          : null
      if (noteId && notebookId) addMembership(noteId, notebookId)
    }
  }

  // Every note must belong to at least one notebook.
  for (const note of notes) {
    const hasMembership = noteNotebooks.some((jt) => jt.noteId === note.id)
    if (!hasMembership) addMembership(note.id, fallbackNotebookId)
  }

  const lockboxes = Array.isArray(raw.lockboxes)
    ? raw.lockboxes.map(normalizeLockboxMeta).filter(Boolean)
    : []
  const lockboxIds = new Set(lockboxes.map((l) => l.id))

  notebooks = notebooks.map((nb) => ({
    ...nb,
    lockboxId:
      nb.lockboxId && lockboxIds.has(nb.lockboxId) ? nb.lockboxId : null,
  }))

  const notesFixed = notes.map((n) => ({
    ...n,
    lockboxId:
      n.lockboxId && lockboxIds.has(n.lockboxId) ? n.lockboxId : null,
  }))

  let activeNotebookId =
    typeof raw.activeNotebookId === 'string' &&
    notebookIds.has(raw.activeNotebookId)
      ? raw.activeNotebookId
      : fallbackNotebookId

  const revisedAt =
    typeof raw.revisedAt === 'string' &&
    raw.revisedAt &&
    !Number.isNaN(Date.parse(raw.revisedAt))
      ? raw.revisedAt
      : null

  return {
    version: 1,
    semver: normalizeSemver(raw.semver),
    activeNotebookId,
    revisedAt,
    notebooks,
    notes: notesFixed,
    tags,
    noteTags,
    noteNotebooks,
    lockboxes,
    lockboxIdleTimeoutMs:
      typeof raw.lockboxIdleTimeoutMs === 'number'
        ? raw.lockboxIdleTimeoutMs
        : null,
    pinnedNotebookIds: normalizePinnedNotebookIds(
      raw.pinnedNotebookIds,
      notebookIds,
    ),
  }
}

/** Migrate legacy flat `notas:notes` array into a workspace document. */
export function migrateLegacyNotes(legacyRaw) {
  const ws = emptyWorkspace()
  const notebookId = ws.notebooks[0].id
  let parsed
  try {
    parsed = JSON.parse(legacyRaw)
  } catch {
    return ws
  }
  if (!Array.isArray(parsed)) return ws

  const notes = []
  const noteNotebooks = []
  parsed.forEach((raw, index) => {
    if (!raw || typeof raw !== 'object') return
    const id =
      typeof raw.id === 'string' && raw.id ? raw.id : createId()
    const updatedAt = isoOrEpoch(raw.updatedAt)
    notes.push({
      id,
      title: typeof raw.title === 'string' ? raw.title : 'Untitled',
      body: typeof raw.body === 'string' ? raw.body : '',
      createdAt: isoOrEpoch(raw.createdAt ?? raw.updatedAt),
      updatedAt,
      pageNumber: index + 1,
      sortKey: index,
      lockboxId: null,
      ciphertext: null,
      iv: null,
    })
    noteNotebooks.push({ noteId: id, notebookId })
  })
  ws.notes = notes
  ws.noteNotebooks = noteNotebooks
  return ws
}

export function serializeWorkspace(ws) {
  return JSON.stringify(normalizeWorkspace(ws))
}

export function parseWorkspaceJson(raw) {
  if (!raw) return null
  try {
    return normalizeWorkspace(JSON.parse(raw))
  } catch {
    return null
  }
}

export function notebookIdsForNote(workspace, noteId) {
  return (workspace.noteNotebooks || [])
    .filter((jt) => jt.noteId === noteId)
    .map((jt) => jt.notebookId)
}

export function notebooksForNote(workspace, noteId) {
  const ids = new Set(notebookIdsForNote(workspace, noteId))
  return workspace.notebooks.filter((n) => ids.has(n.id))
}

export function notesInNotebook(workspace, notebookId) {
  const ids = new Set(
    (workspace.noteNotebooks || [])
      .filter((jt) => jt.notebookId === notebookId)
      .map((jt) => jt.noteId),
  )
  return workspace.notes.filter((n) => ids.has(n.id))
}

/**
 * Split notes in a notebook into exclusive (only this notebook) vs shared
 * (also in at least one other notebook).
 */
export function classifyNotebookNotes(workspace, notebookId) {
  const members = notesInNotebook(workspace, notebookId)
  const exclusiveIds = []
  const sharedIds = []
  for (const note of members) {
    const count = notebookIdsForNote(workspace, note.id).length
    if (count <= 1) exclusiveIds.push(note.id)
    else sharedIds.push(note.id)
  }
  return {
    exclusiveIds,
    sharedIds,
    exclusiveCount: exclusiveIds.length,
    sharedCount: sharedIds.length,
    totalCount: members.length,
  }
}

export function tagIdsForNote(workspace, noteId) {
  return workspace.noteTags
    .filter((jt) => jt.noteId === noteId)
    .map((jt) => jt.tagId)
}

export function tagsForNote(workspace, noteId) {
  const ids = new Set(tagIdsForNote(workspace, noteId))
  return workspace.tags.filter((t) => ids.has(t.id))
}

export function effectiveLockboxId(workspace, note) {
  if (!note) return null
  if (note.lockboxId) return note.lockboxId
  const lockboxIds = notebookIdsForNote(workspace, note.id)
    .map((id) => workspace.notebooks.find((n) => n.id === id)?.lockboxId)
    .filter(Boolean)
  if (lockboxIds.length === 0) return null
  const unique = new Set(lockboxIds)
  if (unique.size !== 1) return null
  return lockboxIds[0]
}

function dayKey(iso) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return 'Unknown'
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Unknown'
  }
}

/**
 * Build list sections for a notebook view.
 * Returns [{ key, label, notes }]
 */
export function buildNoteSections(workspace, notebookId, options = {}) {
  const notebook = workspace.notebooks.find((n) => n.id === notebookId)
  if (!notebook) return []

  const view = normalizeViewMode(options.view ?? notebook.defaultView)
  const timelineField = normalizeTimelineField(
    options.timelineField ?? notebook.timelineField,
  )
  const tagFilterId = options.tagFilterId ?? null
  let notes = notesInNotebook(workspace, notebookId)

  if (view === 'tags' && tagFilterId) {
    if (tagFilterId === '__untagged__') {
      const tagged = new Set(
        workspace.noteTags
          .filter((jt) => notes.some((n) => n.id === jt.noteId))
          .map((jt) => jt.noteId),
      )
      notes = notes.filter((n) => !tagged.has(n.id))
    } else {
      const ids = new Set(
        workspace.noteTags
          .filter((jt) => jt.tagId === tagFilterId)
          .map((jt) => jt.noteId),
      )
      notes = notes.filter((n) => ids.has(n.id))
    }
  }

  if (view === 'book') {
    const sorted = [...notes].sort((a, b) => a.pageNumber - b.pageNumber)
    return [{ key: 'book', label: null, notes: sorted }]
  }

  if (view === 'custom') {
    const sorted = [...notes].sort((a, b) => a.sortKey - b.sortKey)
    return [{ key: 'custom', label: null, notes: sorted }]
  }

  if (view === 'timeline') {
    const sorted = [...notes].sort(
      (a, b) =>
        new Date(b[timelineField]).getTime() -
        new Date(a[timelineField]).getTime(),
    )
    const groups = new Map()
    for (const note of sorted) {
      const key = dayKey(note[timelineField])
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(note)
    }
    return [...groups.entries()].map(([label, groupNotes]) => ({
      key: label,
      label,
      notes: groupNotes,
    }))
  }

  // tags view without a single filter: group by tag
  if (view === 'tags' && !tagFilterId) {
    const sections = []
    const seen = new Set()
    for (const tag of [...workspace.tags].sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      const ids = new Set(
        workspace.noteTags
          .filter((jt) => jt.tagId === tag.id)
          .map((jt) => jt.noteId),
      )
      const groupNotes = notes.filter((n) => ids.has(n.id))
      if (groupNotes.length === 0) continue
      groupNotes.forEach((n) => seen.add(n.id))
      sections.push({
        key: tag.id,
        label: tag.name,
        notes: groupNotes.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        ),
      })
    }
    const untagged = notes.filter((n) => !seen.has(n.id))
    if (untagged.length > 0) {
      sections.push({
        key: '__untagged__',
        label: 'Untagged',
        notes: untagged.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        ),
      })
    }
    return sections
  }

  return [
    {
      key: 'all',
      label: null,
      notes: [...notes].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    },
  ]
}

export function renumberPages(notes) {
  return notes.map((n, i) => ({ ...n, pageNumber: i + 1 }))
}

export function reindexSortKeys(notes) {
  return notes.map((n, i) => ({ ...n, sortKey: i }))
}
