import { supabase } from '@/lib/supabase'

// Read the current user_data row. Returns null when no row exists yet
// (first-time users). `.maybeSingle()` avoids throwing on the empty case.
export async function fetchUserData(userId) {
  if (!userId) return null
  const { data, error } = await supabase
    .from('user_data')
    .select('data, updated_at')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

// Upsert the user's row with a fresh server-side updated_at. RLS makes
// sure the auth.uid() == id constraint holds; we still pass the id
// explicitly so an unauthenticated call fails loudly instead of silently
// writing a null-id row.
export async function saveUserData(userId, data) {
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
  return row
}
