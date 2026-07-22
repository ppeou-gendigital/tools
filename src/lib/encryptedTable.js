import { supabase } from '@/lib/supabase'
import { createId } from '@/lib/id'
import { decryptJson, encryptJson } from '@/lib/vaultCrypto'

/**
 * Generic list/create/update/soft-delete for Docto encrypted domain tables.
 */

export async function listActiveRows(table, patientId, orderCol = 'updated_at') {
  if (!patientId) return []
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('patient_id', patientId)
    .is('deleted_at', null)
    .order(orderCol, { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function decryptRows(key, rows, mapClear) {
  if (!key) return []
  const out = []
  for (const row of rows) {
    try {
      const payload =
        row.ciphertext && row.iv
          ? await decryptJson(key, row.ciphertext, row.iv)
          : {}
      out.push({ ...mapClear(row), ...payload, _row: row })
    } catch {
      out.push({
        ...mapClear(row),
        _decryptError: true,
        title: '(Unable to decrypt)',
        name: '(Unable to decrypt)',
      })
    }
  }
  return out
}

export async function insertEncrypted({
  table,
  userId,
  patientId,
  clearFields = {},
  payload,
  key,
  id,
}) {
  if (!userId || !patientId || !key) {
    throw new Error('insertEncrypted: missing userId, patientId, or key')
  }
  const { ciphertext, iv } = await encryptJson(key, payload ?? {})
  const now = new Date().toISOString()
  const row = {
    id: id || createId(),
    patient_id: patientId,
    created_by: userId,
    updated_by: userId,
    ciphertext,
    iv,
    created_at: now,
    updated_at: now,
    deleted_at: null,
    ...clearFields,
  }
  const { data, error } = await supabase.from(table).insert(row).select('*').maybeSingle()
  if (error) throw error
  return data
}

export async function updateEncrypted({
  table,
  userId,
  id,
  clearFields = {},
  payload,
  key,
}) {
  if (!userId || !id || !key) {
    throw new Error('updateEncrypted: missing userId, id, or key')
  }
  const patch = {
    updated_by: userId,
    updated_at: new Date().toISOString(),
    ...clearFields,
  }
  if (payload !== undefined) {
    const { ciphertext, iv } = await encryptJson(key, payload)
    patch.ciphertext = ciphertext
    patch.iv = iv
  }
  const { data, error } = await supabase
    .from(table)
    .update(patch)
    .eq('id', id)
    .select('*')
    .maybeSingle()
  if (error) throw error
  return data
}

export async function softDeleteRow(table, userId, id) {
  const { error } = await supabase
    .from(table)
    .update({
      deleted_at: new Date().toISOString(),
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) throw error
}
