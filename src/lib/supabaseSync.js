// Single public entry point for every Supabase sync path in the template.
//
// Callers (providers, PrefsSync) MUST use:
//   applySyncOp({ stream, userId, key?, op })
//   pullSync({ stream, userId, local?, dirtyKeys? })
//   enqueueSyncOp({ stream, key, fn })  (per-key serialization)
//
// Recipe:
//   1. Pure op(current) => next — safe to re-run on a newer remote row.
//   2. Provider does optimistic local first.
//   3. CAS on updated_at; on miss re-read + re-apply op.
//   4. Return authoritative view → provider reconciles or reverts.
//
// Streams shipped in the template:
//   'prefs' — one user_data row; op mutates the camelCase row
//
// To add a domain-keyed stream (favorites / visits style), copy the
// domain-table CAS helpers from tool/loopy's supabaseSync.js and register
// the stream in STREAMS below.

import { supabase } from '@/lib/supabase'
import {
  extractForeignPrefs,
  normalizeRemotePrefs,
  PREFS_OWNED_KEYS,
} from '@/lib/prefs'

const CAS_MAX_ATTEMPTS = 5
const PG_UNIQUE_VIOLATION = '23505'

const STREAMS = {
  prefs: {
    table: 'user_data',
    queryKey: (userId) => ['user_data', userId],
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

function rowFromDb(row) {
  if (!row) return null
  return {
    data: row.data,
    updated_at: row.updated_at,
  }
}

function normalizePrefsRow(row) {
  return {
    data: normalizeRemotePrefs(row?.data),
    updated_at: row?.updated_at ?? null,
  }
}

function prefsRowsEqual(a, b) {
  if (!a || !b) return false
  // Compare only owned fields. Sibling keys must not force a rewrite.
  return (
    a.data.theme === b.data.theme &&
    a.data.fontSize === b.data.fontSize &&
    a.data.fabCorner === b.data.fabCorner
  )
}

function toDbPrefsPayload(userId, row) {
  const data = {
    ...extractForeignPrefs(row.data),
    theme: row.data.theme,
    fontSize: row.data.fontSize,
    fabCorner: row.data.fabCorner,
    updatedAt: new Date().toISOString(),
  }
  return {
    id: userId,
    data,
    updated_at: new Date().toISOString(),
  }
}

/** Replace sibling-tool keys on `data` with the remote snapshot's. */
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
// Prefs row CAS
// ---------------------------------------------------------------------------

async function applyPrefsOp(userId, applyFn) {
  if (!userId) throw new Error('applySyncOp: userId is required')
  if (typeof applyFn !== 'function') {
    throw new Error('applySyncOp: op must be a function')
  }

  let lastError = null
  for (let attempt = 1; attempt <= CAS_MAX_ATTEMPTS; attempt++) {
    const { data: raw, error: readErr } = await supabase
      .from('user_data')
      .select('data, updated_at')
      .eq('id', userId)
      .maybeSingle()
    if (readErr) throw readErr

    const current = normalizePrefsRow(rowFromDb(raw))
    const observedUpdatedAt = raw?.updated_at ?? null

    const applied = applyFn(current)
    const next = normalizePrefsRow(applied)
    if (prefsRowsEqual(current, next) && raw) {
      return { ...current, attempts: attempt, noop: true }
    }

    const payload = toDbPrefsPayload(userId, next)

    if (!raw) {
      const { data: inserted, error: insertErr } = await supabase
        .from('user_data')
        .insert(payload)
        .select('data, updated_at')
        .maybeSingle()
      if (!insertErr && inserted) {
        const row = normalizePrefsRow(rowFromDb(inserted))
        touchQueryCache('prefs', userId, row)
        return { ...row, attempts: attempt }
      }
      if (insertErr && insertErr.code !== PG_UNIQUE_VIOLATION) throw insertErr
      lastError =
        insertErr ??
        new Error(`applySyncOp: prefs INSERT failed attempt ${attempt}`)
      continue
    }

    const { data: updated, error: updateErr } = await supabase
      .from('user_data')
      .update(payload)
      .eq('id', userId)
      .eq('updated_at', observedUpdatedAt)
      .select('data, updated_at')
    if (updateErr) throw updateErr
    if (updated && updated.length > 0) {
      const row = normalizePrefsRow(rowFromDb(updated[0]))
      touchQueryCache('prefs', userId, row)
      return { ...row, attempts: attempt }
    }
    lastError = new Error(`applySyncOp: prefs CAS miss attempt ${attempt}`)
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
 * @param {'prefs'} stream
 * @param {string} userId
 * @param {string} [key] unused for prefs; reserved for domain streams
 * @param {(current) => next} op
 */
export async function applySyncOp({ stream, userId, op }) {
  if (stream === 'prefs') {
    return applyPrefsOp(userId, op)
  }
  throw new Error(
    `applySyncOp: unknown stream "${stream}". Template ships 'prefs' only — see tool/loopy for domain streams.`,
  )
}

// ---------------------------------------------------------------------------
// Public: pullSync
// ---------------------------------------------------------------------------

async function fetchPrefsRow(userId) {
  const { data: row, error } = await supabase
    .from('user_data')
    .select('data, updated_at')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  if (!row) return null
  return normalizePrefsRow(rowFromDb(row))
}

/**
 * Force-network pull. For prefs, applies remote fields except those listed
 * in dirtyKeys (local wins until applySyncOp lands).
 *
 * @returns merged/applied snapshot for the caller to persist locally
 */
export async function pullSync({ stream, userId, local, dirtyKeys } = {}) {
  if (!userId) throw new Error('pullSync: userId is required')

  if (stream === 'prefs') {
    const remote = await fetchPrefsRow(userId)
    if (!remote) return local ? normalizePrefsRow(local) : null
    // No local / no dirtyKeys → return authoritative remote snapshot.
    if (local == null && (dirtyKeys == null || dirtyKeys.length === 0)) {
      touchQueryCache(stream, userId, remote)
      return remote
    }
    const dirty = dirtyKeys instanceof Set ? dirtyKeys : new Set(dirtyKeys ?? [])
    const base = local ? normalizePrefsRow(local) : normalizePrefsRow(null)
    const next = { ...base, data: { ...base.data } }
    if (!dirty.has('theme') && !dirty.has('data')) {
      next.data.theme = remote.data.theme
    }
    if (!dirty.has('fontSize') && !dirty.has('data')) {
      next.data.fontSize = remote.data.fontSize
    }
    if (!dirty.has('fabCorner') && !dirty.has('data')) {
      next.data.fabCorner = remote.data.fabCorner
    }
    // Never dirty sibling keys — always take them from remote.
    if (!dirty.has('data')) {
      applyRemoteForeignPrefs(next.data, remote.data)
    }
    next.updated_at = remote.updated_at
    const normalized = normalizePrefsRow(next)
    touchQueryCache(stream, userId, normalized)
    return normalized
  }

  throw new Error(
    `pullSync: unknown stream "${stream}". Template ships 'prefs' only — see tool/loopy for domain streams.`,
  )
}

// Re-export op factories so callers can import everything from one place.
export { opSetTheme, opSetFontSize, opSetFabCorner } from '@/lib/userDataOps'
