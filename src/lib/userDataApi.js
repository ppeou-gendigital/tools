import { supabase } from '@/lib/supabase'

// Read the current user_data row. Returns null when no row exists yet
// (first-time users). `.maybeSingle()` avoids throwing on the empty case.
//
// The row has one JSONB column:
//   data — the prefs blob: { theme, fontSize, fabCorner, updatedAt }
//
// Add more JSONB columns as your tool grows (e.g. a synced list, a rules
// object). Keep them independent so any single column can be promoted to
// a real table later without touching the others.
export async function fetchUserData(userId) {
  if (!userId) return null
  const { data: row, error } = await supabase
    .from('user_data')
    .select('data, updated_at')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  if (!row) return null
  return {
    data: row.data,
    updated_at: row.updated_at,
  }
}

// Upsert the user's row with a fresh server-side updated_at. RLS enforces
// auth.uid() == id; we still pass the id explicitly so an unauthenticated
// call fails loudly instead of silently writing a null-id row.
export async function saveUserData(userId, { data }) {
  if (!userId) throw new Error('saveUserData: userId is required')
  const payload = {
    id: userId,
    data,
    updated_at: new Date().toISOString(),
  }
  const { data: row, error } = await supabase
    .from('user_data')
    .upsert(payload, { onConflict: 'id' })
    .select('data, updated_at')
    .single()
  if (error) throw error
  return {
    data: row.data,
    updated_at: row.updated_at,
  }
}

// Persist a patch into the vault meta subtree of the shared
// `user_data.data` blob. Reads the current row first so we don't stomp
// prefs written by another tab, then shallow-merges the patch into
// `data.vault`, then upserts the merged blob.
//
// Shallow-merging means setup() can pass { salt, iterations, verifier }
// and VaultSettings can pass { idleTimeoutMs } without either
// clobbering the other. Vault writes are rare (setup, passphrase
// change, timeout preference), so the extra read is not on any hot
// path.
export async function saveVaultMeta(userId, patch) {
  if (!userId) throw new Error('saveVaultMeta: userId is required')
  const current = await fetchUserData(userId)
  const nextData = {
    ...(current?.data ?? {}),
    vault: {
      ...(current?.data?.vault ?? {}),
      ...patch,
    },
  }
  return saveUserData(userId, { data: nextData })
}
