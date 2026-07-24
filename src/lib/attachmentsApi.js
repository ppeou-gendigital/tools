// File attachments → Supabase Storage + viaggio_attachments.
// Path convention (matches RLS): {entry_id}/{attachment_id}
// Optional expense_id links a receipt to a specific expense.

import { supabase } from '@/lib/supabase'
import { createId } from '@/lib/id'

export const ATTACHMENTS_BUCKET = 'viaggio-attachments'
export const ATTACHMENTS_TABLE = 'viaggio_attachments'
export const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024

const COLUMNS =
  'id, entry_id, expense_id, uploaded_by, file_name, mime_type, byte_size, storage_path, iv, created_at, updated_at'

function mapRow(row) {
  if (!row) return null
  return {
    id: row.id,
    entryId: row.entry_id,
    expenseId: row.expense_id ?? null,
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

/**
 * @param {string} entryId
 * @param {{ expenseId?: string | null }} [opts]
 */
export async function listAttachments(entryId, { expenseId } = {}) {
  if (!entryId) return []
  let q = supabase
    .from(ATTACHMENTS_TABLE)
    .select(COLUMNS)
    .eq('entry_id', entryId)
    .order('created_at', { ascending: true })
  if (expenseId) {
    q = q.eq('expense_id', expenseId)
  }
  const { data, error } = await q
  if (error) throw error
  return (data ?? []).map(mapRow).filter(Boolean)
}

/**
 * @param {object} opts
 * @param {string} opts.entryId
 * @param {string} opts.userId
 * @param {File|Blob} opts.file
 * @param {string} [opts.fileName]
 * @param {string|null} [opts.expenseId]
 */
export async function uploadAttachment({
  entryId,
  userId,
  file,
  fileName,
  expenseId = null,
}) {
  if (!userId) throw new Error('uploadAttachment: not signed in')
  if (!entryId) throw new Error('uploadAttachment: entryId required')
  if (!file) throw new Error('uploadAttachment: file required')

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
  const storagePath = `${entryId}/${id}`
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
      entry_id: entryId,
      expense_id: expenseId || null,
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
  return mapRow(data)
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
