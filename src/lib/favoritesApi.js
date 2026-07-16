import { supabase } from '@/lib/supabase'
import { MAX_PATHS_PER_DOMAIN } from '@/lib/favorites'

// Max attempts for the CAS retry loop in applyDomainOp. Bumped from 3
// to 5 versus the old union-only upsert because the operator surface is
// wider now (add/remove/edit + row DELETE when nextPaths empties), so a
// pathological interleaving can chew a few more attempts before it
// converges. Still bounded — a runaway spin throws instead of hanging.
const CAS_MAX_ATTEMPTS = 5

// Postgres error code for unique_violation (returned when INSERT hits
// the (user_id, domain) primary key because another writer inserted
// between our read and our insert).
const PG_UNIQUE_VIOLATION = '23505'

// Coerce a jsonb field returned by supabase-js into a plain paths
// object. Rejects arrays and non-objects so a stray row can't corrupt
// our in-memory model.
function coercePathsObject(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  return raw
}

// Enforce the per-domain cap client-side too so a bug can't overflow
// the server-side trigger. Trims by addedAt (oldest first).
function capPaths(paths) {
  const entries = Object.entries(paths)
  if (entries.length <= MAX_PATHS_PER_DOMAIN) return paths
  entries.sort((a, b) => {
    const aAt = a[1]?.addedAt ?? ''
    const bAt = b[1]?.addedAt ?? ''
    return aAt < bAt ? 1 : aAt > bAt ? -1 : 0
  })
  const out = {}
  for (let i = 0; i < MAX_PATHS_PER_DOMAIN; i++) {
    const [k, v] = entries[i]
    out[k] = v
  }
  return out
}

// Cheap structural equality on two paths objects. Same key set + each
// value has the same title + addedAt. Used to short-circuit no-op ops
// (e.g. an add for a path that already exists with the same title) so
// we don't burn a round-trip on a write nobody needs.
function pathsEqual(a, b) {
  const ak = Object.keys(a)
  const bk = Object.keys(b)
  if (ak.length !== bk.length) return false
  for (const k of ak) {
    const av = a[k]
    const bv = b[k]
    if (!bv) return false
    if ((av?.title ?? '') !== (bv?.title ?? '')) return false
    if ((av?.addedAt ?? '') !== (bv?.addedAt ?? '')) return false
  }
  return true
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

// Atomic per-domain read-modify-write.
//
// applyFn: (currentPaths) => nextPaths — MUST be pure. Called with a
// fresh coerced object each attempt; return a new object (don't mutate
// the input). Returning the same paths (structurally) is a no-op and
// short-circuits without a write.
//
// Loop, up to CAS_MAX_ATTEMPTS:
//   1. SELECT paths, updated_at WHERE (user_id, domain).
//   2. nextPaths = capPaths(applyFn(currentPaths)).
//   3. Same as current -> return current bucket (no write).
//   4. Empty next + row exists -> DELETE WHERE updated_at = observed.
//   5. No row + non-empty next -> INSERT. unique_violation -> retry.
//   6. Row exists + non-empty next -> UPDATE WHERE updated_at = observed.
//   Any zero-row response means someone else beat us; loop.
//
// Guarantees:
//   - No lost updates. Two concurrent writers to the same domain
//     converge to a state that reflects both operators applied against
//     the winner's post-state.
//   - Fresh view returned. Caller can reconcile local from the returned
//     { paths, updatedAt } so the popup agrees with the row.
//   - Bounded work. CAS_MAX_ATTEMPTS caps the retry loop; runaway
//     contention throws instead of spinning.
export async function applyDomainOp(userId, domain, applyFn) {
  if (!userId) throw new Error('applyDomainOp: userId is required')
  if (!domain) throw new Error('applyDomainOp: domain is required')
  if (typeof applyFn !== 'function') {
    throw new Error('applyDomainOp: applyFn must be a function')
  }

  let lastError = null
  for (let attempt = 1; attempt <= CAS_MAX_ATTEMPTS; attempt++) {
    const { data: current, error: readErr } = await supabase
      .from('user_favorites')
      .select('paths, updated_at')
      .eq('user_id', userId)
      .eq('domain', domain)
      .maybeSingle()
    if (readErr) throw readErr

    const currentPaths = coercePathsObject(current?.paths)
    const observedUpdatedAt = current?.updated_at ?? null

    const rawNext = applyFn(currentPaths)
    const nextPaths = capPaths(coercePathsObject(rawNext))
    const isNoop = pathsEqual(currentPaths, nextPaths)

    if (isNoop) {
      return {
        domain,
        paths: currentPaths,
        updatedAt: observedUpdatedAt,
        existed: !!current,
        attempts: attempt,
        noop: true,
      }
    }

    const nextUpdatedAt = new Date().toISOString()
    const nextIsEmpty = Object.keys(nextPaths).length === 0

    // Case A: operator emptied the paths — drop the whole row.
    if (nextIsEmpty) {
      if (!current) {
        // Both sides empty; nothing to do.
        return {
          domain,
          paths: {},
          updatedAt: null,
          existed: false,
          attempts: attempt,
          noop: true,
        }
      }
      const { data: deleted, error: delErr } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('domain', domain)
        .eq('updated_at', observedUpdatedAt)
        .select('domain')
      if (delErr) throw delErr
      if (deleted && deleted.length > 0) {
        return {
          domain,
          paths: {},
          updatedAt: null,
          existed: false,
          attempts: attempt,
        }
      }
      lastError = new Error(
        `applyDomainOp: CAS miss on DELETE (${userId}, ${domain}) attempt ${attempt}`,
      )
      continue
    }

    // Case B: no row yet — insert.
    if (!current) {
      const { data: inserted, error: insertErr } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          domain,
          paths: nextPaths,
          updated_at: nextUpdatedAt,
        })
        .select('paths, updated_at')
        .maybeSingle()
      if (!insertErr && inserted) {
        return {
          domain,
          paths: coercePathsObject(inserted.paths),
          updatedAt: inserted.updated_at ?? nextUpdatedAt,
          existed: true,
          attempts: attempt,
        }
      }
      if (insertErr && insertErr.code !== PG_UNIQUE_VIOLATION) throw insertErr
      lastError = insertErr ?? new Error(
        `applyDomainOp: INSERT returned no row (${userId}, ${domain}) attempt ${attempt}`,
      )
      continue
    }

    // Case C: update existing row, gated on the observed updated_at.
    const { data: updated, error: updateErr } = await supabase
      .from('user_favorites')
      .update({ paths: nextPaths, updated_at: nextUpdatedAt })
      .eq('user_id', userId)
      .eq('domain', domain)
      .eq('updated_at', observedUpdatedAt)
      .select('paths, updated_at')
    if (updateErr) throw updateErr
    if (updated && updated.length > 0) {
      const row = updated[0]
      return {
        domain,
        paths: coercePathsObject(row.paths),
        updatedAt: row.updated_at ?? nextUpdatedAt,
        existed: true,
        attempts: attempt,
      }
    }
    lastError = new Error(
      `applyDomainOp: CAS miss on UPDATE (${userId}, ${domain}) attempt ${attempt}`,
    )
  }
  throw lastError ?? new Error(
    `applyDomainOp: CAS exhausted after ${CAS_MAX_ATTEMPTS} attempts (${userId}, ${domain})`,
  )
}

// Delete a single (user_id, domain) row unconditionally. Used when the
// caller already knows the row should go away (e.g. the domain-level
// "Clear this domain" button). applyDomainOp with an operator that
// returns {} is preferable when concurrency matters, but this variant
// is fine for user-initiated wipes.
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

// Nuke every user_favorites row for a user in one round-trip. Backs
// the Fav Links page's "Clear all" affordance. No CAS: the user's
// intent is unambiguous, and any in-flight CAS on a per-domain op will
// simply CAS-miss and surface as an error at the caller (which is fine
// since the row is gone anyway).
export async function deleteAllUserFavorites(userId) {
  if (!userId) throw new Error('deleteAllUserFavorites: userId is required')
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
  if (error) throw error
}
