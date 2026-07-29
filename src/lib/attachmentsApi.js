// File attachments → Supabase Storage + viaggio_attachments.
// Paths (new): {journey_id}/{attachment_id}
// Legacy: {entry_id}/{attachment_id}, {journey_id}/expense/{expense_id}/{attachment_id}
// Links: viaggio_attachment_entries / viaggio_attachment_expenses (0–N each).

import { supabase } from '@/lib/supabase'
import { createId } from '@/lib/id'

export const ATTACHMENTS_BUCKET = 'viaggio-attachments'
export const ATTACHMENTS_TABLE = 'viaggio_attachments'
export const ATTACHMENT_ENTRIES_TABLE = 'viaggio_attachment_entries'
export const ATTACHMENT_EXPENSES_TABLE = 'viaggio_attachment_expenses'
export const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024

const COLUMNS =
  'id, entry_id, journey_id, expense_id, uploaded_by, file_name, mime_type, byte_size, storage_path, iv, created_at, updated_at'

const SELECT_WITH_LINKS = `${COLUMNS}, viaggio_attachment_entries(entry_id), viaggio_attachment_expenses(expense_id)`

function isMissingAttachmentLinksRelation(error) {
  const msg = String(error?.message || error?.details || '').toLowerCase()
  const code = String(error?.code || '')
  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    msg.includes('viaggio_attachment_entries') ||
    msg.includes('viaggio_attachment_expenses') ||
    msg.includes('could not find the table') ||
    msg.includes('does not exist')
  )
}

function mapRow(row) {
  if (!row) return null
  const entryIdsFromJoin = (row.viaggio_attachment_entries || [])
    .map((r) => r.entry_id)
    .filter(Boolean)
  const expenseIdsFromJoin = (row.viaggio_attachment_expenses || [])
    .map((r) => r.expense_id)
    .filter(Boolean)
  const entryIds =
    entryIdsFromJoin.length > 0
      ? entryIdsFromJoin
      : row.entry_id
        ? [row.entry_id]
        : []
  const expenseIds =
    expenseIdsFromJoin.length > 0
      ? expenseIdsFromJoin
      : row.expense_id
        ? [row.expense_id]
        : []
  return {
    id: row.id,
    entryId: entryIds[0] || row.entry_id || null,
    journeyId: row.journey_id ?? null,
    expenseId: expenseIds[0] || row.expense_id || null,
    entryIds,
    expenseIds,
    uploadedBy: row.uploaded_by,
    fileName: row.file_name,
    mimeType: row.mime_type,
    byteSize: Number(row.byte_size) || 0,
    storagePath: row.storage_path,
    iv: row.iv ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function loadLinksForIds(attachmentIds) {
  const ids = [...new Set((attachmentIds || []).filter(Boolean))]
  if (!ids.length) {
    return { entryByAtt: new Map(), expenseByAtt: new Map() }
  }
  const entryByAtt = new Map()
  const expenseByAtt = new Map()

  const { data: entryLinks, error: e1 } = await supabase
    .from(ATTACHMENT_ENTRIES_TABLE)
    .select('attachment_id, entry_id')
    .in('attachment_id', ids)
  if (e1) {
    if (!isMissingAttachmentLinksRelation(e1)) throw e1
  } else {
    for (const row of entryLinks ?? []) {
      const list = entryByAtt.get(row.attachment_id) || []
      list.push(row.entry_id)
      entryByAtt.set(row.attachment_id, list)
    }
  }

  const { data: expenseLinks, error: e2 } = await supabase
    .from(ATTACHMENT_EXPENSES_TABLE)
    .select('attachment_id, expense_id')
    .in('attachment_id', ids)
  if (e2) {
    if (!isMissingAttachmentLinksRelation(e2)) throw e2
  } else {
    for (const row of expenseLinks ?? []) {
      const list = expenseByAtt.get(row.attachment_id) || []
      list.push(row.expense_id)
      expenseByAtt.set(row.attachment_id, list)
    }
  }

  return { entryByAtt, expenseByAtt }
}

function mergeLinks(mapped, entryByAtt, expenseByAtt) {
  if (!mapped) return null
  const fromEntries = entryByAtt.get(mapped.id) || []
  const fromExpenses = expenseByAtt.get(mapped.id) || []
  const entryIds =
    fromEntries.length > 0
      ? fromEntries
      : mapped.entryId
        ? [mapped.entryId]
        : mapped.entryIds || []
  const expenseIds =
    fromExpenses.length > 0
      ? fromExpenses
      : mapped.expenseId
        ? [mapped.expenseId]
        : mapped.expenseIds || []
  return {
    ...mapped,
    entryIds,
    expenseIds,
    entryId: entryIds[0] || null,
    expenseId: expenseIds[0] || null,
  }
}

async function mapRowsWithLinks(rows) {
  const list = (rows ?? []).map(mapRow).filter(Boolean)
  if (!list.length) return []
  // Prefer join payload when present
  if (
    rows?.[0]?.viaggio_attachment_entries != null ||
    rows?.[0]?.viaggio_attachment_expenses != null
  ) {
    return list
  }
  const { entryByAtt, expenseByAtt } = await loadLinksForIds(list.map((r) => r.id))
  return list.map((r) => mergeLinks(r, entryByAtt, expenseByAtt))
}

/**
 * @param {string} id
 */
export async function getAttachment(id) {
  if (!id) return null
  let { data, error } = await supabase
    .from(ATTACHMENTS_TABLE)
    .select(SELECT_WITH_LINKS)
    .eq('id', id)
    .maybeSingle()
  if (error && isMissingAttachmentLinksRelation(error)) {
    ;({ data, error } = await supabase
      .from(ATTACHMENTS_TABLE)
      .select(COLUMNS)
      .eq('id', id)
      .maybeSingle())
  }
  if (error) throw error
  const mapped = mapRow(data)
  if (!mapped) return null
  if (
    data?.viaggio_attachment_entries != null ||
    data?.viaggio_attachment_expenses != null
  ) {
    return mapped
  }
  const { entryByAtt, expenseByAtt } = await loadLinksForIds([mapped.id])
  return mergeLinks(mapped, entryByAtt, expenseByAtt)
}

/**
 * All attachments for a journey (with link ids).
 * @param {string} journeyId
 */
export async function listAttachmentsForJourney(journeyId) {
  if (!journeyId) return []
  let { data, error } = await supabase
    .from(ATTACHMENTS_TABLE)
    .select(SELECT_WITH_LINKS)
    .eq('journey_id', journeyId)
    .order('created_at', { ascending: true })
  if (error && isMissingAttachmentLinksRelation(error)) {
    ;({ data, error } = await supabase
      .from(ATTACHMENTS_TABLE)
      .select(COLUMNS)
      .eq('journey_id', journeyId)
      .order('created_at', { ascending: true }))
  }
  if (error) throw error
  return mapRowsWithLinks(data)
}

/**
 * @param {string | null | undefined} entryId
 * @param {{ expenseId?: string | null, journeyId?: string | null, journeyOnly?: boolean }} [opts]
 */
export async function listAttachments(entryId, { expenseId, journeyId, journeyOnly } = {}) {
  if (expenseId) {
    const ids = new Set()
    const { data: links, error: linkErr } = await supabase
      .from(ATTACHMENT_EXPENSES_TABLE)
      .select('attachment_id')
      .eq('expense_id', expenseId)
    if (linkErr) {
      if (!isMissingAttachmentLinksRelation(linkErr)) throw linkErr
    } else {
      for (const r of links ?? []) ids.add(r.attachment_id)
    }

    const { data: legacy, error: legacyErr } = await supabase
      .from(ATTACHMENTS_TABLE)
      .select(COLUMNS)
      .eq('expense_id', expenseId)
      .order('created_at', { ascending: true })
    if (legacyErr) throw legacyErr
    for (const r of legacy ?? []) ids.add(r.id)

    if (!ids.size) return []
    const { data, error } = await supabase
      .from(ATTACHMENTS_TABLE)
      .select(COLUMNS)
      .in('id', [...ids])
      .order('created_at', { ascending: true })
    if (error) throw error
    return mapRowsWithLinks(data)
  }

  if (entryId) {
    const ids = new Set()
    const { data: links, error: linkErr } = await supabase
      .from(ATTACHMENT_ENTRIES_TABLE)
      .select('attachment_id')
      .eq('entry_id', entryId)
    if (linkErr) {
      if (!isMissingAttachmentLinksRelation(linkErr)) throw linkErr
    } else {
      for (const r of links ?? []) ids.add(r.attachment_id)
    }

    const { data: legacy, error: legacyErr } = await supabase
      .from(ATTACHMENTS_TABLE)
      .select(COLUMNS)
      .eq('entry_id', entryId)
      .order('created_at', { ascending: true })
    if (legacyErr) throw legacyErr
    for (const r of legacy ?? []) ids.add(r.id)

    if (!ids.size) return []
    const { data, error } = await supabase
      .from(ATTACHMENTS_TABLE)
      .select(COLUMNS)
      .in('id', [...ids])
      .order('created_at', { ascending: true })
    if (error) throw error
    return mapRowsWithLinks(data)
  }

  if (journeyId) {
    const all = await listAttachmentsForJourney(journeyId)
    if (journeyOnly) {
      return all.filter(
        (a) => (a.entryIds?.length || 0) === 0 && (a.expenseIds?.length || 0) === 0,
      )
    }
    return all
  }

  return []
}

/**
 * @param {string} attachmentId
 * @param {{ entryIds?: string[], expenseIds?: string[] }} links
 */
export async function setAttachmentLinks(
  attachmentId,
  { entryIds = [], expenseIds = [] } = {},
) {
  if (!attachmentId) throw new Error('setAttachmentLinks: attachmentId required')
  const { data, error } = await supabase.rpc('set_attachment_links', {
    p_attachment_id: attachmentId,
    p_entry_ids: entryIds.length ? entryIds : [],
    p_expense_ids: expenseIds.length ? expenseIds : [],
  })
  if (error) throw error
  const mapped = mapRow(data)
  return {
    ...mapped,
    entryIds: [...entryIds],
    expenseIds: [...expenseIds],
    entryId: entryIds[0] || null,
    expenseId: expenseIds[0] || null,
  }
}

/**
 * @param {object} opts
 * @param {string} opts.journeyId
 * @param {string} opts.userId
 * @param {File|Blob} opts.file
 * @param {string} [opts.fileName]
 * @param {string|null} [opts.entryId] — convenience: single activity link
 * @param {string|null} [opts.expenseId] — convenience: single expense link
 * @param {string[]} [opts.entryIds]
 * @param {string[]} [opts.expenseIds]
 */
export async function uploadAttachment({
  entryId = null,
  journeyId = null,
  userId,
  file,
  fileName,
  expenseId = null,
  entryIds,
  expenseIds,
}) {
  if (!userId) throw new Error('uploadAttachment: not signed in')
  if (!journeyId) {
    throw new Error('uploadAttachment: journeyId required')
  }
  if (!file) throw new Error('uploadAttachment: file required')

  const resolvedEntryIds = [
    ...new Set(
      (entryIds?.length ? entryIds : entryId ? [entryId] : []).filter(Boolean),
    ),
  ]
  const resolvedExpenseIds = [
    ...new Set(
      (expenseIds?.length ? expenseIds : expenseId ? [expenseId] : []).filter(
        Boolean,
      ),
    ),
  ]

  const name =
    fileName ||
    (typeof file.name === 'string' && file.name ? file.name : 'attachment')
  const mime =
    (typeof file.type === 'string' && file.type) ||
    'application/octet-stream'
  const rawSize = file.size ?? 0
  if (rawSize > MAX_ATTACHMENT_BYTES) {
    throw new Error(
      `File too large (max ${Math.round(MAX_ATTACHMENT_BYTES / (1024 * 1024))} MB).`,
    )
  }

  const id = createId()
  const storagePath = `${journeyId}/${id}`
  const rawBuf = new Uint8Array(await file.arrayBuffer())

  const { error: upErr } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .upload(storagePath, rawBuf, {
      contentType: mime,
      upsert: false,
    })
  if (upErr) throw upErr

  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from(ATTACHMENTS_TABLE)
    .insert({
      id,
      entry_id: null,
      journey_id: journeyId,
      expense_id: null,
      uploaded_by: userId,
      file_name: name,
      mime_type: mime,
      byte_size: rawSize,
      storage_path: storagePath,
      created_at: now,
      updated_at: now,
    })
    .select(COLUMNS)
    .maybeSingle()

  if (error) {
    await supabase.storage.from(ATTACHMENTS_BUCKET).remove([storagePath])
    throw error
  }

  const mapped = mapRow(data)
  if (resolvedEntryIds.length || resolvedExpenseIds.length) {
    try {
      return await setAttachmentLinks(mapped.id, {
        entryIds: resolvedEntryIds,
        expenseIds: resolvedExpenseIds,
      })
    } catch (linkErr) {
      // Soft-fail links if RPC/junctions missing: keep file row.
      if (!isMissingAttachmentLinksRelation(linkErr)) {
        // Also accept RPC missing
        const msg = String(linkErr?.message || '').toLowerCase()
        if (!msg.includes('set_attachment_links') && !msg.includes('function')) {
          await deleteAttachment(mapped)
          throw linkErr
        }
      }
      return {
        ...mapped,
        entryIds: resolvedEntryIds,
        expenseIds: resolvedExpenseIds,
        entryId: resolvedEntryIds[0] || null,
        expenseId: resolvedExpenseIds[0] || null,
      }
    }
  }
  return {
    ...mapped,
    entryIds: [],
    expenseIds: [],
  }
}

export async function deleteAttachment(attachment) {
  if (!attachment?.id) return
  const path = attachment.storagePath
  const { error } = await supabase
    .from(ATTACHMENTS_TABLE)
    .delete()
    .eq('id', attachment.id)
  if (error) throw error
  if (path) {
    await supabase.storage.from(ATTACHMENTS_BUCKET).remove([path])
  }
}

export async function downloadAttachment(attachment) {
  if (!attachment?.storagePath) {
    throw new Error('downloadAttachment: missing path')
  }
  const { data, error } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .download(attachment.storagePath)
  if (error) throw error
  const buf = new Uint8Array(await data.arrayBuffer())
  return new Blob([buf], {
    type: attachment.mimeType || 'application/octet-stream',
  })
}

export function formatByteSize(n) {
  const size = Number(n) || 0
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function isImageMime(mime) {
  return typeof mime === 'string' && mime.startsWith('image/')
}

/**
 * @param {string | null | undefined} mimeType
 * @param {string | null | undefined} fileName
 * @returns {'image' | 'pdf' | null}
 */
export function previewKind(mimeType, fileName = '') {
  const mime = String(mimeType || '').toLowerCase()
  const name = String(fileName || '').toLowerCase()
  if (mime.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/.test(name)) {
    return 'image'
  }
  if (mime === 'application/pdf' || name.endsWith('.pdf')) return 'pdf'
  return null
}

export function canPreviewAttachment(attachment) {
  return !!previewKind(attachment?.mimeType, attachment?.fileName)
}

/**
 * Download attachment bytes and expose a temporary object URL.
 * Caller must call `revoke()` when done.
 * @param {object} attachment
 * @returns {Promise<{ blob: Blob, url: string, revoke: () => void }>}
 */
export async function openAttachmentBlob(attachment) {
  const blob = await downloadAttachment(attachment)
  const url = URL.createObjectURL(blob)
  return {
    blob,
    url,
    revoke: () => URL.revokeObjectURL(url),
  }
}

/**
 * Trigger a browser download for an attachment.
 * @param {object} attachment
 */
export async function saveAttachmentDownload(attachment) {
  const { url, revoke } = await openAttachmentBlob(attachment)
  try {
    const a = document.createElement('a')
    a.href = url
    a.download = attachment.fileName || 'attachment'
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
  } finally {
    // Delay revoke so the download can start.
    setTimeout(revoke, 1000)
  }
}
