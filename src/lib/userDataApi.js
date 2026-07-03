import { supabase } from '@/lib/supabase'

// Read the current user_data row. Returns null when no row exists yet
// (first-time users). `.maybeSingle()` avoids throwing on the empty case.
//
// The row has two independent JSONB columns:
//   data        — the prefs blob: { theme, fontSize, fabCorner, updatedAt }
//   aem_domains — the AEM Jump domain list (array of normalized entries)
//
// We surface `aem_domains` under a JS-friendly `aemDomains` key so callers
// can destructure { data, aemDomains } without the naming mismatch.
export async function fetchUserData(userId) {
  if (!userId) return null
  const { data: row, error } = await supabase
    .from('user_data')
    .select('data, aem_domains, updated_at')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  if (!row) return null
  return {
    data: row.data,
    aemDomains: row.aem_domains,
    updated_at: row.updated_at,
  }
}

// Upsert the user's row with a fresh server-side updated_at. Both columns
// are always written together — cheap given the payload sizes, and it keeps
// the auto-sync effect a single round-trip. RLS enforces auth.uid() == id;
// we still pass the id explicitly so an unauthenticated call fails loudly
// instead of silently writing a null-id row.
export async function saveUserData(userId, { data, aemDomains }) {
  if (!userId) throw new Error('saveUserData: userId is required')
  const payload = {
    id: userId,
    data,
    aem_domains: aemDomains ?? [],
    updated_at: new Date().toISOString(),
  }
  const { data: row, error } = await supabase
    .from('user_data')
    .upsert(payload, { onConflict: 'id' })
    .select('data, aem_domains, updated_at')
    .single()
  if (error) throw error
  return {
    data: row.data,
    aemDomains: row.aem_domains,
    updated_at: row.updated_at,
  }
}
