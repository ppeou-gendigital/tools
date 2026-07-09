import { supabase } from '@/lib/supabase'

// Read the current user_data row. Returns null when no row exists yet
// (first-time users). `.maybeSingle()` avoids throwing on the empty case.
//
// The row has four independent JSONB columns:
//   data              — the prefs blob: { theme, fontSize, fabCorner, updatedAt }
//   aem_domains       — the AEM Jump domain list (array of normalized entries)
//   tracked_hostnames — the visit-capture rule set (JSONB object keyed by pattern)
//   pinned_sites      — the Site Tree page's user-curated hostname pin list
//
// We surface the snake_case DB columns under JS-friendly camelCase keys so
// callers can destructure without the naming mismatch.
export async function fetchUserData(userId) {
  if (!userId) return null
  const { data: row, error } = await supabase
    .from('user_data')
    .select('data, aem_domains, tracked_hostnames, pinned_sites, updated_at')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  if (!row) return null
  return {
    data: row.data,
    aemDomains: row.aem_domains,
    trackedHostnames: row.tracked_hostnames,
    pinnedSites: row.pinned_sites,
    updated_at: row.updated_at,
  }
}

// Upsert the user's row with a fresh server-side updated_at. All columns
// are always written together — cheap given the payload sizes, and it
// keeps the auto-sync effect a single round-trip. RLS enforces
// auth.uid() == id; we still pass the id explicitly so an unauthenticated
// call fails loudly instead of silently writing a null-id row.
export async function saveUserData(
  userId,
  { data, aemDomains, trackedHostnames, pinnedSites },
) {
  if (!userId) throw new Error('saveUserData: userId is required')
  const payload = {
    id: userId,
    data,
    aem_domains: aemDomains ?? [],
    tracked_hostnames: trackedHostnames ?? {},
    pinned_sites: pinnedSites ?? [],
    updated_at: new Date().toISOString(),
  }
  const { data: row, error } = await supabase
    .from('user_data')
    .upsert(payload, { onConflict: 'id' })
    .select('data, aem_domains, tracked_hostnames, pinned_sites, updated_at')
    .single()
  if (error) throw error
  return {
    data: row.data,
    aemDomains: row.aem_domains,
    trackedHostnames: row.tracked_hostnames,
    pinnedSites: row.pinned_sites,
    updated_at: row.updated_at,
  }
}
