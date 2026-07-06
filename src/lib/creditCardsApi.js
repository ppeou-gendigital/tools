import { supabase } from '@/lib/supabase'

// CRUD wrappers over the `public.credit_cards` table. RLS enforces
// user_id == auth.uid() on every operation, so passing the wrong
// userId simply returns no rows — but we still guard the argument so
// unauthenticated calls fail loudly instead of silently writing a
// null-user row.
//
// Unlike credentials, `display_name` is optional here: the card name
// is the only plaintext field, and when the user leaves it blank we
// fall back to an "Issuer •••• last 4" label computed client-side
// after decrypt. The DB stores an empty string in that case so no
// bank name or card digits leak.
//
// All rows stay opaque here: this layer never touches the ciphertext
// or iv. Encryption happens in VaultProvider before we get here, and
// decryption happens in the list/edit pages after we return.

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

export async function createCreditCard(userId, { displayName, ciphertext, iv }) {
  if (!userId) throw new Error('createCreditCard: userId is required')
  if (!ciphertext || !iv) throw new Error('createCreditCard: ciphertext + iv are required')
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('credit_cards')
    .insert({
      user_id: userId,
      display_name: (displayName ?? '').trim(),
      ciphertext,
      iv,
      created_at: now,
      updated_at: now,
    })
    .select(COLUMNS)
    .single()
  if (error) throw error
  return data
}

export async function updateCreditCard(id, patch) {
  if (!id) throw new Error('updateCreditCard: id is required')
  const next = {
    updated_at: new Date().toISOString(),
  }
  if (typeof patch.displayName === 'string') next.display_name = patch.displayName.trim()
  if (typeof patch.ciphertext === 'string') next.ciphertext = patch.ciphertext
  if (typeof patch.iv === 'string') next.iv = patch.iv
  const { data, error } = await supabase
    .from('credit_cards')
    .update(next)
    .eq('id', id)
    .select(COLUMNS)
    .single()
  if (error) throw error
  return data
}

export async function deleteCreditCard(id) {
  if (!id) throw new Error('deleteCreditCard: id is required')
  const { error } = await supabase.from('credit_cards').delete().eq('id', id)
  if (error) throw error
}
