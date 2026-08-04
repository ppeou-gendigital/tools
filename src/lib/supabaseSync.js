// Single public entry point for every Supabase sync path in Loopy.
//
// Callers (providers, PrefsSync, background SW) MUST use:
//   applySyncOp({ stream, userId, key?, op })
//   pullSync({ stream, userId, local?, dirtyKeys? })
//   deleteSyncDomain / deleteSyncAll  (bulk clears)
//   enqueueSyncOp({ stream, key, fn })  (per-key serialization)
//
// Recipe (Fav Links model):
//   1. Pure op(current) => next — safe to re-run on a newer remote row.
//   2. Provider does optimistic local first.
//   3. CAS on updated_at; on miss re-read + re-apply op.
//   4. Return authoritative view → provider reconciles or reverts.
//
// Streams:
//   'favorites' | 'visits'  — one row per (user_id, domain); op mutates paths
//   'prefs'                 — public.loopy_user_prefs; dual-reads legacy
//                             public.user_data when the per-app row is missing;
//                             dual-writes owned data + columnar lists back to
//                             user_data so older builds keep working until
//                             every tool migrates.
//                             In-memory row stays camelCase for providers/ops:
//                             { data, aemDomains, trackedHostnames,
//                               pinnedSites, favoritesOrder, payload?,
//                               updated_at }

import { supabase } from '@/lib/supabase'
import {
  MAX_PATHS_PER_DOMAIN as FAV_CAP,
  mergeFavoritesByDomain,
  normalizeFavoritesByDomain,
} from '@/lib/favorites'
import {
  MAX_PATHS_PER_DOMAIN as VISIT_CAP,
  mergePathObjects,
  mergeVisitedByDomain,
  normalizeVisitedByDomain,
} from '@/lib/visitedUrls'
import {
  extractForeignPrefs,
  extractOwnedPrefs,
  normalizeAemDomains,
  normalizeRemotePrefs,
  PREFS_OWNED_KEYS,
  PREFS_TABLE,
} from '@/lib/prefs'
import {
  normalizeFavoritesOrder,
  stableFavoritesOrderKey,
} from '@/lib/favoritesOrder'
import {
  normalizePinnedSites,
  stablePinnedKey,
} from '@/lib/pinnedSites'
import {
  normalizeTrackedHostnames,
  stableHostsKey,
} from '@/lib/trackedHostnames'

const CAS_MAX_ATTEMPTS = 5
const PG_UNIQUE_VIOLATION = '23505'

const STREAMS = {
  favorites: {
    table: 'user_favorites',
    queryKey: (userId) => ['user_favorites', userId],
    cap: FAV_CAP,
    sortKey: (v) => v?.addedAt ?? '',
  },
  visits: {
    table: 'user_visits',
    queryKey: (userId) => ['user_visits', userId],
    cap: VISIT_CAP,
    sortKey: (v) => v?.lastVisitedAt ?? v?.addedAt ?? '',
  },
  prefs: {
    table: PREFS_TABLE,
    queryKey: (userId) => ['user_prefs', userId, PREFS_TABLE],
  },
}

// Per-(stream,key) promise tails so rapid ops on the same unit serialize.
const opQueues = new Map()

function queueKey(stream, key) {
  return `${stream}:${key ?? '_row'}`
}

export function enqueueSyncOp({ stream, key, fn }) {
  const id = queueKey(stream, key)
  const prev = opQueues.get(id) ?? Promise.resolve()
  const next = prev.catch(() => {}).then(fn)
  opQueues.set(id, next)
  next.finally(() => {
    if (opQueues.get(id) === next) opQueues.delete(id)
  })
  return next
}

function coercePathsObject(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  return raw
}

function capPaths(paths, cap, sortKey) {
  const entries = Object.entries(paths)
  if (entries.length <= cap) return paths
  entries.sort((a, b) => {
    const aAt = sortKey(a[1])
    const bAt = sortKey(b[1])
    return aAt < bAt ? 1 : aAt > bAt ? -1 : 0
  })
  const out = {}
  for (let i = 0; i < cap; i++) {
    const [k, v] = entries[i]
    out[k] = v
  }
  return out
}

function pathsEqual(a, b) {
  const ak = Object.keys(a)
  const bk = Object.keys(b)
  if (ak.length !== bk.length) return false
  for (const k of ak) {
    const av = a[k]
    const bv = b[k]
    if (!bv) return false
    if (JSON.stringify(av) !== JSON.stringify(bv)) return false
  }
  return true
}

/** Map loopy_user_prefs.payload (snake_case) → in-memory camelCase fields. */
function listsFromPayload(payload) {
  const p =
    payload && typeof payload === 'object' && !Array.isArray(payload)
      ? payload
      : {}
  return {
    aemDomains: p.aem_domains ?? p.aemDomains,
    trackedHostnames: p.tracked_hostnames ?? p.trackedHostnames,
    pinnedSites: p.pinned_sites ?? p.pinnedSites,
    favoritesOrder: p.favorites_order ?? p.favoritesOrder,
  }
}

/** Serialize in-memory camelCase list fields → payload jsonb (snake_case). */
function listsToPayload(row) {
  return {
    aem_domains: row.aemDomains ?? [],
    tracked_hostnames: row.trackedHostnames ?? {},
    pinned_sites: row.pinnedSites ?? [],
    favorites_order: row.favoritesOrder ?? [],
  }
}

/** Map a loopy_user_prefs DB row → in-memory camelCase shape. */
function rowFromDb(row) {
  if (!row) return null
  const lists = listsFromPayload(row.payload)
  return {
    data: row.data,
    aemDomains: lists.aemDomains,
    trackedHostnames: lists.trackedHostnames,
    pinnedSites: lists.pinnedSites,
    favoritesOrder: lists.favoritesOrder,
    payload:
      row.payload && typeof row.payload === 'object' && !Array.isArray(row.payload)
        ? row.payload
        : {},
    updated_at: row.updated_at,
  }
}

/** Map a legacy user_data DB row (top-level columns) → in-memory shape. */
function rowFromLegacyDb(row) {
  if (!row) return null
  return {
    data: extractOwnedPrefs(row.data),
    aemDomains: row.aem_domains,
    trackedHostnames: row.tracked_hostnames,
    pinnedSites: row.pinned_sites,
    favoritesOrder: row.favorites_order,
    payload: {},
    updated_at: row.updated_at,
  }
}

function normalizePrefsRow(row) {
  const lists = listsFromPayload(row?.payload)
  const aemDomains = normalizeAemDomains(row?.aemDomains ?? lists.aemDomains)
  const trackedHostnames = normalizeTrackedHostnames(
    row?.trackedHostnames ?? lists.trackedHostnames,
  )
  const pinnedSites = normalizePinnedSites(
    row?.pinnedSites ?? lists.pinnedSites,
  )
  const favoritesOrder = normalizeFavoritesOrder(
    row?.favoritesOrder ?? lists.favoritesOrder,
  )
  return {
    data: normalizeRemotePrefs(row?.data),
    aemDomains,
    trackedHostnames,
    pinnedSites,
    favoritesOrder,
    payload: listsToPayload({
      aemDomains,
      trackedHostnames,
      pinnedSites,
      favoritesOrder,
    }),
    updated_at: row?.updated_at ?? null,
  }
}

function prefsRowsEqual(a, b) {
  if (!a || !b) return false
  // Compare only owned fields (+ Loopy lists). Sibling keys must not
  // force a rewrite.
  return (
    a.data.theme === b.data.theme &&
    a.data.fontSize === b.data.fontSize &&
    a.data.fabCorner === b.data.fabCorner &&
    JSON.stringify(a.aemDomains) === JSON.stringify(b.aemDomains) &&
    stableHostsKey(a.trackedHostnames) === stableHostsKey(b.trackedHostnames) &&
    stablePinnedKey(a.pinnedSites) === stablePinnedKey(b.pinnedSites) &&
    stableFavoritesOrderKey(a.favoritesOrder) ===
      stableFavoritesOrderKey(b.favoritesOrder)
  )
}

function ownedDataPayload(row) {
  return {
    theme: row.data.theme,
    fontSize: row.data.fontSize,
    fabCorner: row.data.fabCorner,
    updatedAt: new Date().toISOString(),
  }
}

function toDbPrefsPayload(userId, row) {
  return {
    id: userId,
    data: ownedDataPayload(row),
    payload: listsToPayload(row),
    updated_at: new Date().toISOString(),
  }
}

/** Replace sibling-tool keys on a legacy shared blob with the remote snapshot's. */
function applyRemoteForeignPrefs(data, remoteData) {
  for (const key of Object.keys(data)) {
    if (!PREFS_OWNED_KEYS.has(key)) delete data[key]
  }
  Object.assign(data, extractForeignPrefs(remoteData))
}

function inServiceWorker() {
  return (
    typeof ServiceWorkerGlobalScope !== 'undefined' &&
    typeof self !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof ServiceWorkerGlobalScope
  )
}

// Lazy so the service worker never pulls @tanstack/react-query into its bundle.
function touchQueryCache(stream, userId, data) {
  if (inServiceWorker()) return
  const cfg = STREAMS[stream]
  if (!cfg || !userId) return
  import('@/lib/queryClient')
    .then(({ queryClient }) => {
      queryClient.setQueryData(cfg.queryKey(userId), data)
    })
    .catch(() => {})
}

// ---------------------------------------------------------------------------
// Domain-table CAS (favorites + visits)
// ---------------------------------------------------------------------------

async function applyDomainPathsOp(stream, userId, domain, applyFn) {
  const cfg = STREAMS[stream]
  if (!cfg?.table) throw new Error(`applySyncOp: unknown stream ${stream}`)
  if (!userId) throw new Error('applySyncOp: userId is required')
  if (!domain) throw new Error('applySyncOp: key (domain) is required')
  if (typeof applyFn !== 'function') {
    throw new Error('applySyncOp: op must be a function')
  }

  let lastError = null
  for (let attempt = 1; attempt <= CAS_MAX_ATTEMPTS; attempt++) {
    const { data: current, error: readErr } = await supabase
      .from(cfg.table)
      .select('paths, updated_at')
      .eq('user_id', userId)
      .eq('domain', domain)
      .maybeSingle()
    if (readErr) throw readErr

    const currentPaths = coercePathsObject(current?.paths)
    const observedUpdatedAt = current?.updated_at ?? null

    const rawNext = applyFn(currentPaths)
    const nextPaths = capPaths(
      coercePathsObject(rawNext),
      cfg.cap,
      cfg.sortKey,
    )
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

    if (nextIsEmpty) {
      if (!current) {
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
        .from(cfg.table)
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
        `applySyncOp: CAS miss on DELETE (${stream}, ${domain}) attempt ${attempt}`,
      )
      continue
    }

    if (!current) {
      const { data: inserted, error: insertErr } = await supabase
        .from(cfg.table)
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
      lastError =
        insertErr ??
        new Error(
          `applySyncOp: INSERT returned no row (${stream}, ${domain}) attempt ${attempt}`,
        )
      continue
    }

    const { data: updated, error: updateErr } = await supabase
      .from(cfg.table)
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
      `applySyncOp: CAS miss on UPDATE (${stream}, ${domain}) attempt ${attempt}`,
    )
  }
  throw (
    lastError ??
    new Error(
      `applySyncOp: CAS exhausted after ${CAS_MAX_ATTEMPTS} attempts (${stream}, ${domain})`,
    )
  )
}

// ---------------------------------------------------------------------------
// Prefs dual-stack helpers (primary: PREFS_TABLE = loopy_user_prefs)
// ---------------------------------------------------------------------------

async function fetchUserPrefsRaw(userId) {
  const { data: row, error } = await supabase
    .from(PREFS_TABLE)
    .select('id, data, payload, updated_at')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return row
}

async function fetchLegacyPrefsRow(userId) {
  const { data: row, error } = await supabase
    .from('user_data')
    .select(
      'data, aem_domains, tracked_hostnames, pinned_sites, favorites_order, updated_at',
    )
    .eq('id', userId)
    .maybeSingle()
  if (error) {
    // Table missing or RLS — treat as no legacy row during greenfield setups.
    console.warn('[supabaseSync] legacy user_data read failed', error.message)
    return null
  }
  if (!row) return null
  return normalizePrefsRow(rowFromLegacyDb(row))
}

/**
 * Best-effort mirror of owned shell prefs + Loopy list columns into legacy
 * shared user_data so older builds keep seeing updates during migration.
 * Preserves foreign keys on `data`. Never throws — primary CAS already
 * succeeded on PREFS_TABLE.
 */
async function mirrorToLegacyUserData(userId, prefsRow) {
  try {
    const owned = ownedDataPayload(prefsRow)
    const columns = {
      aem_domains: prefsRow.aemDomains ?? [],
      tracked_hostnames: prefsRow.trackedHostnames ?? {},
      pinned_sites: prefsRow.pinnedSites ?? [],
      favorites_order: prefsRow.favoritesOrder ?? [],
    }
    const { data: raw, error: readErr } = await supabase
      .from('user_data')
      .select(
        'data, aem_domains, tracked_hostnames, pinned_sites, favorites_order, updated_at',
      )
      .eq('id', userId)
      .maybeSingle()
    if (readErr) {
      console.warn(
        '[supabaseSync] legacy user_data mirror read failed',
        readErr.message,
      )
      return
    }

    const now = new Date().toISOString()
    if (!raw) {
      const { error: insertErr } = await supabase.from('user_data').insert({
        id: userId,
        data: owned,
        ...columns,
        updated_at: now,
      })
      if (insertErr && insertErr.code !== PG_UNIQUE_VIOLATION) {
        console.warn(
          '[supabaseSync] legacy user_data mirror insert failed',
          insertErr.message,
        )
      }
      return
    }

    const nextData = {
      ...extractForeignPrefs(raw.data),
      ...owned,
    }
    const { error: updateErr } = await supabase
      .from('user_data')
      .update({ data: nextData, ...columns, updated_at: now })
      .eq('id', userId)
      .eq('updated_at', raw.updated_at)
    if (updateErr) {
      console.warn(
        '[supabaseSync] legacy user_data mirror update failed',
        updateErr.message,
      )
    }
  } catch (err) {
    console.warn(
      '[supabaseSync] legacy user_data mirror failed',
      err?.message ?? err,
    )
  }
}

// ---------------------------------------------------------------------------
// Prefs row CAS (primary: PREFS_TABLE = loopy_user_prefs)
// ---------------------------------------------------------------------------

async function applyPrefsOp(userId, applyFn) {
  if (!userId) throw new Error('applySyncOp: userId is required')
  if (typeof applyFn !== 'function') {
    throw new Error('applySyncOp: op must be a function')
  }

  let lastError = null
  for (let attempt = 1; attempt <= CAS_MAX_ATTEMPTS; attempt++) {
    const raw = await fetchUserPrefsRaw(userId)
    let current
    if (raw) {
      current = normalizePrefsRow(rowFromDb(raw))
    } else {
      // Seed CAS baseline from legacy shared row so first write does not
      // drop theme/font/fab or Loopy list columns pulled from user_data.
      current =
        (await fetchLegacyPrefsRow(userId)) ?? normalizePrefsRow(null)
    }
    const observedUpdatedAt = raw?.updated_at ?? null

    const applied = applyFn(current)
    const next = normalizePrefsRow(applied)
    if (prefsRowsEqual(current, next) && raw) {
      return { ...current, attempts: attempt, noop: true }
    }

    const payload = toDbPrefsPayload(userId, next)

    if (!raw) {
      const { data: inserted, error: insertErr } = await supabase
        .from(PREFS_TABLE)
        .insert(payload)
        .select('id, data, payload, updated_at')
        .maybeSingle()
      if (!insertErr && inserted) {
        const row = normalizePrefsRow(rowFromDb(inserted))
        touchQueryCache('prefs', userId, row)
        await mirrorToLegacyUserData(userId, row)
        return { ...row, attempts: attempt }
      }
      if (insertErr && insertErr.code !== PG_UNIQUE_VIOLATION) throw insertErr
      lastError =
        insertErr ??
        new Error(`applySyncOp: prefs INSERT failed attempt ${attempt}`)
      continue
    }

    const { data: updated, error: updateErr } = await supabase
      .from(PREFS_TABLE)
      .update({
        data: payload.data,
        payload: payload.payload,
        updated_at: payload.updated_at,
      })
      .eq('id', userId)
      .eq('updated_at', observedUpdatedAt)
      .select('id, data, payload, updated_at')
    if (updateErr) throw updateErr
    if (updated && updated.length > 0) {
      const row = normalizePrefsRow(rowFromDb(updated[0]))
      touchQueryCache('prefs', userId, row)
      await mirrorToLegacyUserData(userId, row)
      return { ...row, attempts: attempt }
    }
    lastError = new Error(
      `applySyncOp: prefs CAS miss attempt ${attempt}`,
    )
  }
  throw (
    lastError ??
    new Error(
      `applySyncOp: prefs CAS exhausted after ${CAS_MAX_ATTEMPTS} attempts`,
    )
  )
}

// ---------------------------------------------------------------------------
// Public: applySyncOp
// ---------------------------------------------------------------------------

/**
 * Apply a pure operator against a synced Supabase stream.
 *
 * @param {'favorites'|'visits'|'prefs'} stream
 * @param {string} userId
 * @param {string} [key] domain for favorites/visits
 * @param {(current) => next} op
 */
export async function applySyncOp({ stream, userId, key, op }) {
  if (stream === 'prefs') {
    return applyPrefsOp(userId, op)
  }
  if (stream === 'favorites' || stream === 'visits') {
    const result = await applyDomainPathsOp(stream, userId, key, op)
    // Best-effort: patch the domain into the cached byDomain map.
    if (!inServiceWorker()) {
      const qk = STREAMS[stream].queryKey(userId)
      import('@/lib/queryClient')
        .then(({ queryClient }) => {
          const prev = queryClient.getQueryData(qk)
          if (prev && typeof prev === 'object') {
            const next = { ...prev }
            if (!result.paths || Object.keys(result.paths).length === 0) {
              delete next[key]
            } else {
              next[key] = {
                paths: result.paths,
                updatedAt: result.updatedAt,
              }
            }
            queryClient.setQueryData(qk, next)
          }
        })
        .catch(() => {})
    }
    return result
  }
  throw new Error(`applySyncOp: unknown stream "${stream}"`)
}

/**
 * Convenience: merge local visit paths into remote (capture sync).
 */
export function opUnionVisitPaths(localPaths) {
  const safe =
    localPaths && typeof localPaths === 'object' && !Array.isArray(localPaths)
      ? localPaths
      : {}
  return (remotePaths) => mergePathObjects(remotePaths, safe)
}

/**
 * Convenience: clear all paths in a domain bucket (CAS → DELETE).
 */
export function opClearDomainPaths() {
  return () => ({})
}

// ---------------------------------------------------------------------------
// Public: delete helpers
// ---------------------------------------------------------------------------

export async function deleteSyncDomain({ stream, userId, key }) {
  if (!userId) throw new Error('deleteSyncDomain: userId is required')
  if (!key) throw new Error('deleteSyncDomain: key is required')
  if (stream !== 'favorites' && stream !== 'visits') {
    throw new Error(`deleteSyncDomain: unsupported stream "${stream}"`)
  }
  const { error } = await supabase
    .from(STREAMS[stream].table)
    .delete()
    .eq('user_id', userId)
    .eq('domain', key)
  if (error) throw error
  if (!inServiceWorker()) {
    const qk = STREAMS[stream].queryKey(userId)
    import('@/lib/queryClient')
      .then(({ queryClient }) => {
        const prev = queryClient.getQueryData(qk)
        if (prev && typeof prev === 'object') {
          const next = { ...prev }
          delete next[key]
          queryClient.setQueryData(qk, next)
        }
      })
      .catch(() => {})
  }
}

export async function deleteSyncAll({ stream, userId }) {
  if (!userId) throw new Error('deleteSyncAll: userId is required')
  if (stream !== 'favorites' && stream !== 'visits') {
    throw new Error(`deleteSyncAll: unsupported stream "${stream}"`)
  }
  const { error } = await supabase
    .from(STREAMS[stream].table)
    .delete()
    .eq('user_id', userId)
  if (error) throw error
  touchQueryCache(stream, userId, {})
}

// ---------------------------------------------------------------------------
// Public: pullSync
// ---------------------------------------------------------------------------

async function fetchDomainMap(stream, userId) {
  const cfg = STREAMS[stream]
  const { data, error } = await supabase
    .from(cfg.table)
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

async function fetchPrefsRow(userId) {
  const raw = await fetchUserPrefsRaw(userId)
  if (raw) return normalizePrefsRow(rowFromDb(raw))
  return fetchLegacyPrefsRow(userId)
}

/**
 * Force-network pull. Merges domain maps; for prefs applies remote fields
 * except those listed in dirtyKeys (local wins until applySyncOp lands).
 *
 * @returns merged/applied snapshot for the caller to persist locally
 */
export async function pullSync({ stream, userId, local, dirtyKeys } = {}) {
  if (!userId) throw new Error('pullSync: userId is required')

  if (stream === 'favorites') {
    const remote = normalizeFavoritesByDomain(await fetchDomainMap(stream, userId))
    const merged = mergeFavoritesByDomain(local ?? {}, remote)
    touchQueryCache(stream, userId, merged)
    return merged
  }

  if (stream === 'visits') {
    const remote = normalizeVisitedByDomain(await fetchDomainMap(stream, userId))
    const merged = mergeVisitedByDomain(local ?? {}, remote)
    touchQueryCache(stream, userId, merged)
    return merged
  }

  if (stream === 'prefs') {
    const remote = await fetchPrefsRow(userId)
    if (!remote) return local ? normalizePrefsRow(local) : null
    // No local / no dirtyKeys → return authoritative remote snapshot.
    if (local == null && (dirtyKeys == null || dirtyKeys.length === 0)) {
      touchQueryCache(stream, userId, remote)
      return remote
    }
    const dirty = dirtyKeys instanceof Set ? dirtyKeys : new Set(dirtyKeys ?? [])
    const base = local
      ? normalizePrefsRow(local)
      : normalizePrefsRow(null)
    const next = {
      ...base,
      data: { ...base.data },
      payload: { ...base.payload },
    }
    if (!dirty.has('theme') && !dirty.has('data')) {
      next.data.theme = remote.data.theme
    }
    if (!dirty.has('fontSize') && !dirty.has('data')) {
      next.data.fontSize = remote.data.fontSize
    }
    if (!dirty.has('fabCorner') && !dirty.has('data')) {
      next.data.fabCorner = remote.data.fabCorner
    }
    // Legacy shared-row foreign keys only matter when remote still carries them.
    if (!dirty.has('data')) {
      applyRemoteForeignPrefs(next.data, remote.data)
    }
    if (!dirty.has('aemDomains')) next.aemDomains = remote.aemDomains
    if (!dirty.has('trackedHostnames')) {
      next.trackedHostnames = remote.trackedHostnames
    }
    if (!dirty.has('pinnedSites')) next.pinnedSites = remote.pinnedSites
    if (!dirty.has('favoritesOrder')) {
      next.favoritesOrder = remote.favoritesOrder
    }
    next.updated_at = remote.updated_at
    const normalized = normalizePrefsRow(next)
    touchQueryCache(stream, userId, normalized)
    return normalized
  }

  throw new Error(`pullSync: unknown stream "${stream}"`)
}

// Re-export op factories so callers can import everything from one place.
export {
  opAddPath,
  opRemovePath,
  opSetTitle,
  opRenameWithinDomain,
  opUnionPaths,
} from '@/lib/favoritesOps'

export {
  opSetTheme,
  opSetFontSize,
  opSetFabCorner,
  opSetAemDomains,
  opSetTrackedHostnames,
  opSetPinnedSites,
  opTogglePinned,
  opMovePinned,
  opSetFavoritesOrder,
  opMoveFavoritesOrder,
} from '@/lib/userDataOps'
