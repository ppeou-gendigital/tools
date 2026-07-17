import {
  applySyncOp,
  enqueueSyncOp,
  opDeleteVaultItem,
  opUpsertVaultItem,
} from '@/lib/supabaseSync'
import { supabase } from '@/lib/supabase'

// CRUD wrappers over the `public.credit_cards` table. Reads stay as
// thin selects; writes go through supabaseSync (CAS + enqueue).
//
// Unlike credentials, `display_name` is optional here: the card name
// is the only plaintext field, and when the user leaves it blank we
// fall back to an "Issuer •••• last 4" label computed client-side
// after decrypt. The DB stores an empty string in that case so no
// bank name or card digits leak.
//
// All rows stay opaque here: this layer never touches the ciphertext
// or iv semantics. Encryption happens in VaultProvider before we get
// here, and decryption happens in the list/edit pages after we return.

const STREAM = 'credit_cards'
const COLUMNS = 'id, user_id, display_name, ciphertext, iv, created_at, updated_at'

export async function listCreditCards(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('credit_cards')
    .select(COLUMNS)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchCreditCard(userId, id) {
  if (!userId) throw new Error('fetchCreditCard: userId is required')
  if (!id) throw new Error('fetchCreditCard: id is required')
  const { data, error } = await supabase
    .from('credit_cards')
    .select(COLUMNS)
    .eq('user_id', userId)
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data ?? null
}

export async function createCreditCard(
  userId,
  { id, displayName, ciphertext, iv },
) {
  if (!userId) throw new Error('createCreditCard: userId is required')
  if (!ciphertext || !iv) {
    throw new Error('createCreditCard: ciphertext + iv are required')
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
          displayName: displayName ?? '',
          ciphertext,
          iv,
        }),
      }),
  })
}

export async function updateCreditCard(
  userId,
  id,
  { displayName, ciphertext, iv },
) {
  if (!userId) throw new Error('updateCreditCard: userId is required')
  if (!id) throw new Error('updateCreditCard: id is required')
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
          displayName: displayName ?? '',
          ciphertext,
          iv,
        }),
      }),
  })
}

export async function deleteCreditCard(userId, id) {
  if (!userId) throw new Error('deleteCreditCard: userId is required')
  if (!id) throw new Error('deleteCreditCard: id is required')
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
