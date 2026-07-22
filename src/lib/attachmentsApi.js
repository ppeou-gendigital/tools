// File attachments → Supabase Storage + metadata table.
//
// After `npm run init -- --name foo`:
//   bucket  toolname-attachments → foo-attachments
//   table   toolname_attachments → foo_attachments
//
// `parent_id` is the owning row (note, card, …). Rename the column / FK in
// supabase/template_attachments.sql to match your domain table.
//
// Optional encryptBytes / decryptBytes hooks support client-side E2EE
// (see tool/notas LockboxProvider) — omit them for plaintext uploads.

import { supabase } from '@/lib/supabase'
import { createId } from '@/lib/id'

export const ATTACHMENTS_BUCKET = 'toolname-attachments'
export const ATTACHMENTS_TABLE = 'toolname_attachments'
export const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024

const COLUMNS =
  'id, user_id, parent_id, file_name, mime_type, byte_size, storage_path, iv, created_at, updated_at'

function mapRow(row) {
  if (!row) return null
  return {
    id: row.id,
    userId: row.user_id,
    parentId: row.parent_id,
    fileName: row.file_name,
    mimeType: row.mime_type,
    byteSize: Number(row.byte_size) || 0,
    storagePath: row.storage_path,
    iv: row.iv ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function listAttachments(userId, parentId) {
  if (!userId || !parentId) return []
  const { data, error } = await supabase
    .from(ATTACHMENTS_TABLE)
    .select(COLUMNS)
    .eq('user_id', userId)
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapRow).filter(Boolean)
}

/**
 * @param {object} opts
 * @param {string} opts.userId
 * @param {string} opts.parentId
 * @param {File|Blob} opts.file
 * @param {string} [opts.fileName]
 * @param {string|null} [opts.lockboxId]
 * @param {(lockboxId: string, bytes: Uint8Array) => Promise<{ ciphertext: Uint8Array, iv: string }>} [opts.encryptBytes]
 */
export async function uploadAttachment({
  userId,
  parentId,
  file,
  fileName,
  lockboxId = null,
  encryptBytes,
}) {
  if (!userId) throw new Error('uploadAttachment: not signed in')
  if (!parentId) throw new Error('uploadAttachment: parentId required')
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
  const storagePath = `${userId}/${parentId}/${id}`
  const rawBuf = new Uint8Array(await file.arrayBuffer())

  let uploadBody = rawBuf
  let contentType = mime
  let iv = null
  let byteSize = rawSize

  if (lockboxId) {
    if (typeof encryptBytes !== 'function') {
      throw new Error('Unlock before attaching encrypted files.')
    }
    const enc = await encryptBytes(lockboxId, rawBuf)
    uploadBody = enc.ciphertext
    iv = enc.iv
    contentType = 'application/octet-stream'
    byteSize = enc.ciphertext.byteLength
  }

  const { error: upErr } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .upload(storagePath, uploadBody, {
      contentType,
      upsert: false,
    })
  if (upErr) throw upErr

  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from(ATTACHMENTS_TABLE)
    .insert({
      id,
      user_id: userId,
      parent_id: parentId,
      file_name: name,
      mime_type: mime,
      byte_size: byteSize,
      storage_path: storagePath,
      iv,
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

export async function deleteAttachment(userId, attachment) {
  if (!userId || !attachment?.id) return
  const path = attachment.storagePath
  const { error } = await supabase
    .from(ATTACHMENTS_TABLE)
    .delete()
    .eq('user_id', userId)
    .eq('id', attachment.id)
  if (error) throw error
  if (path) {
    await supabase.storage.from(ATTACHMENTS_BUCKET).remove([path])
  }
}

export async function deleteAttachmentsForParent(userId, parentId) {
  if (!userId || !parentId) return
  const rows = await listAttachments(userId, parentId)
  if (rows.length === 0) return
  const paths = rows.map((r) => r.storagePath).filter(Boolean)
  const { error } = await supabase
    .from(ATTACHMENTS_TABLE)
    .delete()
    .eq('user_id', userId)
    .eq('parent_id', parentId)
  if (error) throw error
  if (paths.length > 0) {
    await supabase.storage.from(ATTACHMENTS_BUCKET).remove(paths)
  }
}

/**
 * @param {object} opts
 * @param {(lockboxId: string, bytes: Uint8Array, iv: string) => Promise<Uint8Array>} [opts.decryptBytes]
 * @param {string|null} [opts.lockboxId]
 */
export async function downloadAttachment({
  attachment,
  lockboxId = null,
  decryptBytes,
}) {
  if (!attachment?.storagePath) {
    throw new Error('downloadAttachment: missing path')
  }
  const { data, error } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .download(attachment.storagePath)
  if (error) throw error
  const buf = new Uint8Array(await data.arrayBuffer())

  if (attachment.iv) {
    if (!lockboxId || typeof decryptBytes !== 'function') {
      throw new Error('Unlock to download this file.')
    }
    const plain = await decryptBytes(lockboxId, buf, attachment.iv)
    return new Blob([plain], {
      type: attachment.mimeType || 'application/octet-stream',
    })
  }
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
