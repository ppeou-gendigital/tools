import { supabase } from '@/lib/supabase'

// CRUD wrappers over the `public.credentials` table. RLS enforces
// user_id == auth.uid() on every operation, so passing the wrong
// userId simply returns no rows — but we still guard the argument so
// unauthenticated calls fail loudly instead of silently writing a
// null-user row.
//
// All rows stay opaque here: this layer never touches the ciphertext
// or iv. Encryption happens in VaultProvider before we get here, and
// decryption happens in the list/edit pages after we return.

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

export async function createCredential(userId, { displayName, ciphertext, iv }) {
  if (!userId) throw new Error('createCredential: userId is required')
  if (!displayName?.trim()) throw new Error('createCredential: displayName is required')
  if (!ciphertext || !iv) throw new Error('createCredential: ciphertext + iv are required')
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('credentials')
    .insert({
      user_id: userId,
      display_name: displayName.trim(),
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

export async function updateCredential(id, patch) {
  if (!id) throw new Error('updateCredential: id is required')
  const next = {
    updated_at: new Date().toISOString(),
  }
  if (typeof patch.displayName === 'string') next.display_name = patch.displayName.trim()
  if (typeof patch.ciphertext === 'string') next.ciphertext = patch.ciphertext
  if (typeof patch.iv === 'string') next.iv = patch.iv
  const { data, error } = await supabase
    .from('credentials')
    .update(next)
    .eq('id', id)
    .select(COLUMNS)
    .single()
  if (error) throw error
  return data
}

export async function deleteCredential(id) {
  if (!id) throw new Error('deleteCredential: id is required')
  const { error } = await supabase.from('credentials').delete().eq('id', id)
  if (error) throw error
}
