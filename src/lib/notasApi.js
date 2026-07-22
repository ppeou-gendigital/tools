// Supabase CRUD for notas_* tables. Maps to/from the local workspace
// document shape used by NotesProvider.

import { supabase } from '@/lib/supabase'
import {
  isDefaultNotebookName,
  notebookIdsForNote,
  normalizeWorkspace,
} from '@/lib/workspaceModel'

/** Cached probe: does notas_notes still have legacy notebook_id? */
let legacyNotebookIdColumn = null
/** Cached probe: does notas_note_notebooks exist? null = unknown. */
let noteNotebooksTableAvailable = null

function maxIso(timestamps) {
  let best = null
  let bestMs = -Infinity
  for (const t of timestamps) {
    if (typeof t !== 'string' || !t) continue
    const ms = Date.parse(t)
    if (!Number.isFinite(ms)) continue
    if (ms > bestMs) {
      bestMs = ms
      best = t
    }
  }
  return best
}

export function workspaceContentFingerprint(ws) {
  const n = normalizeWorkspace(ws)
  return JSON.stringify({
    notebooks: n.notebooks,
    notes: n.notes,
    tags: n.tags,
    noteTags: n.noteTags,
    noteNotebooks: n.noteNotebooks,
    lockboxes: n.lockboxes,
  })
}

export function workspaceHasUserContent(ws) {
  const n = normalizeWorkspace(ws)
  return (
    n.notes.length > 0 ||
    n.tags.length > 0 ||
    n.lockboxes.length > 0 ||
    n.notebooks.length > 1 ||
    (n.notebooks[0] && !isDefaultNotebookName(n.notebooks[0].name))
  )
}

export function workspaceMaxUpdatedAt(ws) {
  const n = normalizeWorkspace(ws)
  return maxIso([
    n.revisedAt,
    ...n.notebooks.map((x) => x.updatedAt),
    ...n.notes.map((x) => x.updatedAt),
    ...n.lockboxes.map((x) => x.updatedAt),
  ])
}

function lockboxFromRow(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    salt: row.salt,
    iterations: row.iterations,
    verifier: { ciphertext: row.verifier_ct, iv: row.verifier_iv },
    hint: row.hint ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function notebookFromRow(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    defaultView: row.default_view,
    timelineField: row.timeline_field,
    lockboxId: row.lockbox_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function noteFromRow(row) {
  if (!row) return null
  const locked = Boolean(row.ciphertext && row.iv)
  return {
    id: row.id,
    // Legacy column may still exist until migrate_note_notebooks.sql runs.
    notebookId: row.notebook_id ?? undefined,
    title: row.title ?? (locked ? 'Locked note' : 'Untitled'),
    body: locked ? '' : (row.body ?? ''),
    pageNumber: row.page_number ?? 0,
    sortKey: row.sort_key ?? 0,
    lockboxId: row.lockbox_id,
    ciphertext: row.ciphertext ?? null,
    iv: row.iv ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function tagFromRow(row) {
  if (!row) return null
  return { id: row.id, name: row.name }
}

function noteTagFromRow(row) {
  if (!row) return null
  return { noteId: row.note_id, tagId: row.tag_id }
}

function noteNotebookFromRow(row) {
  if (!row) return null
  return { noteId: row.note_id, notebookId: row.notebook_id }
}

/** True when PostgREST/Postgres says the relation is missing (pre-migration). */
function isMissingRelationError(error) {
  if (!error) return false
  const code = String(error.code ?? '')
  const msg = String(error.message ?? '')
  const status = Number(error.status ?? error.statusCode ?? 0)
  return (
    code === '42P01' ||
    code === 'PGRST204' ||
    code === 'PGRST205' ||
    status === 404 ||
    /does not exist/i.test(msg) ||
    /could not find the table/i.test(msg) ||
    /could not find the .* column/i.test(msg) ||
    /schema cache/i.test(msg) ||
    /notas_note_notebooks/i.test(msg)
  )
}

async function hasNoteNotebooksTable() {
  if (noteNotebooksTableAvailable != null) return noteNotebooksTableAvailable
  const { error } = await supabase
    .from('notas_note_notebooks')
    .select('note_id')
    .limit(1)
  if (!error) {
    noteNotebooksTableAvailable = true
    return true
  }
  if (isMissingRelationError(error)) {
    noteNotebooksTableAvailable = false
    return false
  }
  // Unexpected error — don't cache; skip join table this pass.
  return false
}

/** Pull all notas_* rows for a user into a workspace document. */
export async function fetchRemoteWorkspace(userId) {
  if (!userId) return null

  const joinTableOk = await hasNoteNotebooksTable()
  const requests = [
    supabase.from('notas_lockboxes').select('*').eq('user_id', userId),
    supabase.from('notas_notebooks').select('*').eq('user_id', userId),
    supabase.from('notas_notes').select('*').eq('user_id', userId),
    supabase.from('notas_tags').select('*').eq('user_id', userId),
    supabase.from('notas_note_tags').select('*').eq('user_id', userId),
  ]
  if (joinTableOk) {
    requests.push(
      supabase
        .from('notas_note_notebooks')
        .select('*')
        .eq('user_id', userId),
    )
  }

  const results = await Promise.all(requests)
  const [lockboxes, notebooks, notes, tags, noteTags] = results
  const noteNotebooks = joinTableOk
    ? results[5]
    : { data: [], error: null }

  if (noteNotebooks.error && !isMissingRelationError(noteNotebooks.error)) {
    throw noteNotebooks.error
  }
  if (noteNotebooks.error && isMissingRelationError(noteNotebooks.error)) {
    noteNotebooksTableAvailable = false
  }

  for (const res of [lockboxes, notebooks, notes, tags, noteTags]) {
    if (res.error) throw res.error
  }

  const notebookRows = notebooks.data ?? []
  const noteRows = notes.data ?? []
  const tagRows = tags.data ?? []
  const lockboxRows = lockboxes.data ?? []
  const noteTagRows = noteTags.data ?? []
  const noteNotebookRows =
    noteNotebooks.error || !joinTableOk ? [] : (noteNotebooks.data ?? [])

  // No domain rows yet — caller should seed from local.
  if (
    notebookRows.length === 0 &&
    noteRows.length === 0 &&
    tagRows.length === 0 &&
    lockboxRows.length === 0
  ) {
    return null
  }

  const ws = {
    version: 1,
    activeNotebookId: null,
    pinnedNotebookIds: [],
    notebooks: notebookRows.map(notebookFromRow).filter(Boolean),
    notes: noteRows.map(noteFromRow).filter(Boolean),
    tags: tagRows.map(tagFromRow).filter(Boolean),
    noteTags: noteTagRows.map(noteTagFromRow).filter(Boolean),
    noteNotebooks: noteNotebookRows.map(noteNotebookFromRow).filter(Boolean),
    lockboxes: lockboxRows.map(lockboxFromRow).filter(Boolean),
    lockboxIdleTimeoutMs: null,
  }

  if (ws.notebooks.length === 0) {
    // Orphan notes without notebooks — treat as empty remote.
    return null
  }
  return normalizeWorkspace(ws)
}

function lockboxToRow(userId, lb) {
  return {
    id: lb.id,
    user_id: userId,
    name: lb.name,
    salt: lb.salt,
    iterations: lb.iterations,
    verifier_ct: lb.verifier.ciphertext,
    verifier_iv: lb.verifier.iv,
    hint: lb.hint,
    created_at: lb.createdAt,
    updated_at: lb.updatedAt,
  }
}

function notebookToRow(userId, nb) {
  return {
    id: nb.id,
    user_id: userId,
    name: nb.name,
    default_view: nb.defaultView,
    timeline_field: nb.timelineField,
    lockbox_id: nb.lockboxId,
    created_at: nb.createdAt,
    updated_at: nb.updatedAt,
  }
}

function primaryNotebookIdForNote(ws, noteId) {
  const ids = notebookIdsForNote(ws, noteId)
  if (ids.length > 0) return ids[0]
  return ws.notebooks[0]?.id ?? null
}

function noteToRow(userId, note, options = {}) {
  const locked = Boolean(note.ciphertext && note.iv)
  const row = {
    id: note.id,
    user_id: userId,
    title: note.title || (locked ? 'Locked note' : 'Untitled'),
    body: locked ? '' : (note.body ?? ''),
    page_number: note.pageNumber ?? 0,
    sort_key: note.sortKey ?? 0,
    lockbox_id: note.lockboxId,
    ciphertext: note.ciphertext,
    iv: note.iv,
    created_at: note.createdAt,
    updated_at: note.updatedAt,
  }
  // Legacy schemas require NOT NULL notebook_id until migrate_note_notebooks.sql.
  if (options.legacyNotebookId && options.notebookId) {
    row.notebook_id = options.notebookId
  }
  return row
}

/**
 * Legacy notebook_id on notas_notes is removed by migrate_note_notebooks.sql
 * when notas_note_notebooks is created. Infer from join-table presence —
 * do not SELECT notebook_id (400 after migration).
 */
async function notesHaveLegacyNotebookIdColumn() {
  if (legacyNotebookIdColumn != null) return legacyNotebookIdColumn
  if (await hasNoteNotebooksTable()) {
    legacyNotebookIdColumn = false
    return false
  }
  legacyNotebookIdColumn = true
  return true
}

function tagToRow(userId, tag) {
  return {
    id: tag.id,
    user_id: userId,
    name: tag.name,
  }
}

function noteTagToRow(userId, jt) {
  return {
    note_id: jt.noteId,
    tag_id: jt.tagId,
    user_id: userId,
  }
}

function noteNotebookToRow(userId, jt) {
  return {
    note_id: jt.noteId,
    notebook_id: jt.notebookId,
    user_id: userId,
  }
}

async function upsertRows(table, rows) {
  if (!rows.length) return
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' })
  if (error) throw error
}

async function upsertNoteTags(rows) {
  if (!rows.length) return
  const { error } = await supabase
    .from('notas_note_tags')
    .upsert(rows, { onConflict: 'note_id,tag_id' })
  if (error) throw error
}

async function upsertNoteNotebooks(rows) {
  if (!rows.length) return
  if (!(await hasNoteNotebooksTable())) return
  const { error } = await supabase
    .from('notas_note_notebooks')
    .upsert(rows, { onConflict: 'note_id,notebook_id' })
  if (error) {
    if (isMissingRelationError(error)) {
      noteNotebooksTableAvailable = false
      return
    }
    throw error
  }
}

async function deleteMissing(table, userId, idColumn, keepIds) {
  const { data, error } = await supabase
    .from(table)
    .select(idColumn)
    .eq('user_id', userId)
  if (error) throw error
  const remoteIds = (data ?? []).map((r) => r[idColumn])
  const toDelete = remoteIds.filter((id) => !keepIds.has(id))
  if (toDelete.length === 0) return
  // delete in chunks
  for (let i = 0; i < toDelete.length; i += 100) {
    const chunk = toDelete.slice(i, i + 100)
    const { error: delErr } = await supabase
      .from(table)
      .delete()
      .eq('user_id', userId)
      .in(idColumn, chunk)
    if (delErr) throw delErr
  }
}

async function deleteMissingNoteTags(userId, keepKeys) {
  const { data, error } = await supabase
    .from('notas_note_tags')
    .select('note_id, tag_id')
    .eq('user_id', userId)
  if (error) throw error
  const toDelete = (data ?? []).filter(
    (r) => !keepKeys.has(`${r.note_id}:${r.tag_id}`),
  )
  for (const row of toDelete) {
    const { error: delErr } = await supabase
      .from('notas_note_tags')
      .delete()
      .eq('user_id', userId)
      .eq('note_id', row.note_id)
      .eq('tag_id', row.tag_id)
    if (delErr) throw delErr
  }
}

async function deleteMissingNoteNotebooks(userId, keepKeys) {
  if (!(await hasNoteNotebooksTable())) return
  const { data, error } = await supabase
    .from('notas_note_notebooks')
    .select('note_id, notebook_id')
    .eq('user_id', userId)
  if (error) {
    if (isMissingRelationError(error)) {
      noteNotebooksTableAvailable = false
      return
    }
    throw error
  }
  const toDelete = (data ?? []).filter(
    (r) => !keepKeys.has(`${r.note_id}:${r.notebook_id}`),
  )
  for (const row of toDelete) {
    const { error: delErr } = await supabase
      .from('notas_note_notebooks')
      .delete()
      .eq('user_id', userId)
      .eq('note_id', row.note_id)
      .eq('notebook_id', row.notebook_id)
    if (delErr) throw delErr
  }
}

/**
 * Re-point legacy notas_notes.notebook_id away from deleted notebooks.
 * Never sets null — column is NOT NULL until migrate_note_notebooks.sql runs.
 */
async function reassignLegacyNoteNotebookIds(
  userId,
  keepNotebookIds,
  fallbackNotebookId,
) {
  if (!fallbackNotebookId || !keepNotebookIds.has(fallbackNotebookId)) return
  const { data, error } = await supabase
    .from('notas_notes')
    .select('id, notebook_id')
    .eq('user_id', userId)
  if (error) {
    if (
      isMissingRelationError(error) ||
      /notebook_id/i.test(String(error.message ?? '')) ||
      String(error.code ?? '') === '42703'
    ) {
      legacyNotebookIdColumn = false
      return
    }
    throw error
  }
  legacyNotebookIdColumn = true
  const staleIds = (data ?? [])
    .filter(
      (r) =>
        typeof r.notebook_id === 'string' &&
        r.notebook_id &&
        !keepNotebookIds.has(r.notebook_id),
    )
    .map((r) => r.id)
  for (let i = 0; i < staleIds.length; i += 100) {
    const chunk = staleIds.slice(i, i + 100)
    const { error: updErr } = await supabase
      .from('notas_notes')
      .update({ notebook_id: fallbackNotebookId })
      .eq('user_id', userId)
      .in('id', chunk)
    if (updErr) {
      if (
        isMissingRelationError(updErr) ||
        /notebook_id/i.test(String(updErr.message ?? '')) ||
        String(updErr.code ?? '') === '42703'
      ) {
        legacyNotebookIdColumn = false
        return
      }
      throw updErr
    }
  }
}

/**
 * Push a full workspace to notas_* tables (upsert + delete orphans).
 * FK-safe order: lockboxes → notebooks → notes → note_notebooks → tags → note_tags,
 * then reverse-order orphan deletes.
 */
export async function pushWorkspace(userId, workspace) {
  if (!userId) throw new Error('pushWorkspace: userId is required')
  const ws = normalizeWorkspace(workspace)
  const keepNotebookIds = new Set(ws.notebooks.map((n) => n.id))
  const keepNoteIds = new Set(ws.notes.map((n) => n.id))
  const keepTagIds = new Set(ws.tags.map((t) => t.id))
  const keepLockboxIds = new Set(ws.lockboxes.map((l) => l.id))
  const keepNoteTagKeys = new Set(
    ws.noteTags.map((jt) => `${jt.noteId}:${jt.tagId}`),
  )
  const keepNoteNotebookKeys = new Set(
    ws.noteNotebooks.map((jt) => `${jt.noteId}:${jt.notebookId}`),
  )
  const fallbackNotebookId = ws.notebooks[0]?.id ?? null
  const legacyNotebookId = await notesHaveLegacyNotebookIdColumn()

  await upsertRows(
    'notas_lockboxes',
    ws.lockboxes.map((lb) => lockboxToRow(userId, lb)),
  )
  await upsertRows(
    'notas_notebooks',
    ws.notebooks.map((nb) => notebookToRow(userId, nb)),
  )

  // Upsert notes with a valid legacy notebook_id when the column still exists.
  const noteRows = ws.notes.map((n) =>
    noteToRow(userId, n, {
      legacyNotebookId,
      notebookId: primaryNotebookIdForNote(ws, n.id) || fallbackNotebookId,
    }),
  )
  try {
    await upsertRows('notas_notes', noteRows)
  } catch (err) {
    // Column may have been dropped between probe and upsert.
    if (legacyNotebookId && /notebook_id/i.test(String(err?.message ?? ''))) {
      legacyNotebookIdColumn = false
      await upsertRows(
        'notas_notes',
        ws.notes.map((n) => noteToRow(userId, n, { legacyNotebookId: false })),
      )
    } else {
      throw err
    }
  }

  await upsertNoteNotebooks(
    ws.noteNotebooks.map((jt) => noteNotebookToRow(userId, jt)),
  )
  await upsertRows(
    'notas_tags',
    ws.tags.map((t) => tagToRow(userId, t)),
  )
  await upsertNoteTags(ws.noteTags.map((jt) => noteTagToRow(userId, jt)))

  // Orphans (reverse FK order). Reassign legacy FKs before deleting notebooks.
  await deleteMissingNoteTags(userId, keepNoteTagKeys)
  await deleteMissingNoteNotebooks(userId, keepNoteNotebookKeys)
  if (legacyNotebookId) {
    await reassignLegacyNoteNotebookIds(
      userId,
      keepNotebookIds,
      fallbackNotebookId,
    )
  }
  await deleteMissing('notas_notes', userId, 'id', keepNoteIds)
  await deleteMissing('notas_tags', userId, 'id', keepTagIds)
  await deleteMissing('notas_notebooks', userId, 'id', keepNotebookIds)
  await deleteMissing('notas_lockboxes', userId, 'id', keepLockboxIds)
}
