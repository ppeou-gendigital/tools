import {
  applySyncOp,
  enqueueSyncOp,
  opDeleteVaultItem,
  opUpsertVaultItem,
} from '@/lib/supabaseSync'
import { supabase } from '@/lib/supabase'

// CRUD wrappers over the `public.credentials` table. Reads stay as
// thin selects; writes go through supabaseSync (CAS + enqueue).
//
// All rows stay opaque here: this layer never touches the ciphertext
// or iv semantics. Encryption happens in VaultProvider before we get
// here, and decryption happens in the list/edit pages after we return.

const STREAM = 'credentials'
const COLUMNS = 'id, user_id, display_name, ciphertext, iv, created_at, updated_at'

export async function listCredentials(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('credentials')
    .select(COLUMNS)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchCredential(userId, id) {
  if (!userId) throw new Error('fetchCredential: userId is required')
  if (!id) throw new Error('fetchCredential: id is required')
  const { data, error } = await supabase
    .from('credentials')
    .select(COLUMNS)
    .eq('user_id', userId)
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data ?? null
}

export async function createCredential(
  userId,
  { id, displayName, ciphertext, iv },
) {
  if (!userId) throw new Error('createCredential: userId is required')
  if (!displayName?.trim()) {
    throw new Error('createCredential: displayName is required')
  }
  if (!ciphertext || !iv) {
    throw new Error('createCredential: ciphertext + iv are required')
  }
  const rowId = id ?? crypto.randomUUID()
  return enqueueSyncOp({
    stream: STREAM,
    key: rowId,
    fn: () =>
      applySyncOp({
        stream: STREAM,
        userId,
        rowId,
        op: opUpsertVaultItem({
          id: rowId,
          userId,
          displayName,
          ciphertext,
          iv,
        }),
      }),
  })
}

export async function updateCredential(
  userId,
  id,
  { displayName, ciphertext, iv },
) {
  if (!userId) throw new Error('updateCredential: userId is required')
  if (!id) throw new Error('updateCredential: id is required')
  return enqueueSyncOp({
    stream: STREAM,
    key: id,
    fn: () =>
      applySyncOp({
        stream: STREAM,
        userId,
        rowId: id,
        op: opUpsertVaultItem({
          id,
          userId,
          displayName,
          ciphertext,
          iv,
        }),
      }),
  })
}

export async function deleteCredential(userId, id) {
  if (!userId) throw new Error('deleteCredential: userId is required')
  if (!id) throw new Error('deleteCredential: id is required')
  return enqueueSyncOp({
    stream: STREAM,
    key: id,
    fn: () =>
      applySyncOp({
        stream: STREAM,
        userId,
        rowId: id,
        op: opDeleteVaultItem(),
      }),
  })
}
