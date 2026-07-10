import { supabase } from '@/lib/supabase'
import {
  MAX_PATHS_PER_DOMAIN,
  mergeFavoritePathObjects,
} from '@/lib/favorites'

// Max attempts for the CAS retry loop. Two concurrent writers converge
// in one attempt; three retries covers even pathological interleavings
// without spinning forever.
const CAS_MAX_ATTEMPTS = 3

// Postgres error code for unique_violation (returned when INSERT hits
// the (user_id, domain) primary key because another writer inserted
// between our read and our insert).
const PG_UNIQUE_VIOLATION = '23505'

// Coerce a jsonb field returned by supabase-js into a plain paths
// object. Rejects arrays (legacy shape) and non-objects so a stray row
// can't corrupt our in-memory model.
function coercePathsObject(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  return raw
}

// Enforce the per-domain cap client-side too so a bug can't overflow
// the server-side trigger. Returns a new object when trimming happens,
// otherwise the same reference.
function capPaths(paths) {
  const entries = Object.entries(paths)
  if (entries.length <= MAX_PATHS_PER_DOMAIN) return paths
  entries.sort((a, b) => {
    const aAt = a[1].addedAt ?? ''
    const bAt = b[1].addedAt ?? ''
    return aAt < bAt ? 1 : aAt > bAt ? -1 : 0
  })
  const out = {}
  for (let i = 0; i < MAX_PATHS_PER_DOMAIN; i++) {
    const [k, v] = entries[i]
    out[k] = v
  }
  return out
}

// Read every user_favorites row for a user, shaped back into the same
// { [domain]: { paths, updatedAt } } object the provider uses. Empty
// object when the user has no rows yet.
//
// Table schema (see README):
//   user_favorites (user_id uuid, domain text, paths jsonb, updated_at)
//   primary key (user_id, domain)
//   trigger enforcing jsonb_typeof(paths) = 'object' and <= 200 keys
export async function fetchUserFavorites(userId) {
  if (!userId) return {}
  const { data, error } = await supabase
    .from('user_favorites')
    .select('domain, paths, updated_at')
    .eq('user_id', userId)
  if (error) throw error
  const out = {}
  for (const row of data ?? []) {
    const domain = typeof row?.domain === 'string' ? row.domain : ''
    if (!domain) continue
    out[domain] = {
      paths: coercePathsObject(row.paths),
      updatedAt: row.updated_at ?? null,
    }
  }
  return out
}

// Upsert a single (user_id, domain) row with the caller's paths object.
// Callers that need atomic merge across concurrent writers should use
// upsertDomainFavoritesWithMerge instead. RLS enforces auth.uid() == user_id.
export async function saveDomainFavorites(userId, domain, paths) {
  if (!userId) throw new Error('saveDomainFavorites: userId is required')
  if (!domain) throw new Error('saveDomainFavorites: domain is required')
  const safePaths = coercePathsObject(paths)
  const payload = {
    user_id: userId,
    domain,
    paths: safePaths,
    updated_at: new Date().toISOString(),
  }
  const { data, error } = await supabase
    .from('user_favorites')
    .upsert(payload, { onConflict: 'user_id,domain' })
    .select('domain, paths, updated_at')
    .single()
  if (error) throw error
  return {
    domain: data.domain,
    paths: coercePathsObject(data.paths),
    updatedAt: data.updated_at ?? null,
  }
}

// Atomic per-domain merge: read the current row, union its paths with
// the caller's local paths, and write the merged result back — but only
// if the row's updated_at hasn't changed in the meantime (compare-and-
// swap). If another writer beat us, retry.
//
// Same guarantees as visitedUrlsApi.upsertDomainWithMerge, just against
// user_favorites: two devices favoriting different URLs on the same
// domain converge without lost updates.
export async function upsertDomainFavoritesWithMerge(userId, domain, localPaths) {
  if (!userId) {
    throw new Error('upsertDomainFavoritesWithMerge: userId is required')
  }
  if (!domain) {
    throw new Error('upsertDomainFavoritesWithMerge: domain is required')
  }
  const safeLocal = coercePathsObject(localPaths)

  let lastError = null
  for (let attempt = 1; attempt <= CAS_MAX_ATTEMPTS; attempt++) {
    const { data: current, error: readErr } = await supabase
      .from('user_favorites')
      .select('paths, updated_at')
      .eq('user_id', userId)
      .eq('domain', domain)
      .maybeSingle()
    if (readErr) throw readErr

    const remotePaths = coercePathsObject(current?.paths)
    const merged = capPaths(mergeFavoritePathObjects(remotePaths, safeLocal))
    const nextUpdatedAt = new Date().toISOString()

    if (!current) {
      const { data: inserted, error: insertErr } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          domain,
          paths: merged,
          updated_at: nextUpdatedAt,
        })
        .select('paths, updated_at')
        .maybeSingle()
      if (!insertErr && inserted) {
        return {
          domain,
          paths: coercePathsObject(inserted.paths),
          updatedAt: inserted.updated_at ?? nextUpdatedAt,
          attempts: attempt,
        }
      }
      if (insertErr && insertErr.code !== PG_UNIQUE_VIOLATION) throw insertErr
      lastError = insertErr
      continue
    }

    const { data: updated, error: updateErr } = await supabase
      .from('user_favorites')
      .update({ paths: merged, updated_at: nextUpdatedAt })
      .eq('user_id', userId)
      .eq('domain', domain)
      .eq('updated_at', current.updated_at)
      .select('paths, updated_at')
    if (updateErr) throw updateErr
    if (updated && updated.length > 0) {
      const row = updated[0]
      return {
        domain,
        paths: coercePathsObject(row.paths),
        updatedAt: row.updated_at ?? nextUpdatedAt,
        attempts: attempt,
      }
    }
    lastError = new Error(
      `CAS miss on (${userId}, ${domain}) attempt ${attempt}`,
    )
  }
  throw lastError ?? new Error('upsertDomainFavoritesWithMerge: unknown failure')
}

// Delete a single (user_id, domain) row. Called when the user clears a
// domain locally so the remote drops it too.
export async function deleteDomainFavorites(userId, domain) {
  if (!userId) throw new Error('deleteDomainFavorites: userId is required')
  if (!domain) throw new Error('deleteDomainFavorites: domain is required')
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('domain', domain)
  if (error) throw error
}

// Delete every row for the user. Used by the manage slide's "Clear all"
// action after wiping the local map.
export async function deleteAllUserFavorites(userId) {
  if (!userId) throw new Error('deleteAllUserFavorites: userId is required')
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
  if (error) throw error
}
