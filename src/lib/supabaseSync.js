// Single public entry point for Supabase sync in Acceso.
//
// Callers (providers, PrefsSync, VaultItemsSync, VaultProvider, APIs) MUST use:
//   applySyncOp({ stream, userId, op, rowId? })
//   pullSync({ stream, userId })
//   enqueueSyncOp({ stream, key, fn })
//
// Recipe (same as Loopy Fav Links):
//   1. Pure op(current) => next — safe to re-run on a newer remote row.
//   2. Caller does optimistic local first.
//   3. CAS on updated_at; on miss re-read + re-apply op.
//   4. Return authoritative view → caller reconciles or reverts.
//
// Acceso streams:
//   'prefs'         — one user_data row; data JSONB holds theme/font/fab + vault meta
//   'credentials'   — row-level CAS on public.credentials
//   'credit_cards'  — row-level CAS on public.credit_cards

import { supabase } from '@/lib/supabase'
import { normalizeRemotePrefs } from '@/lib/prefs'

const CAS_MAX_ATTEMPTS = 5
const PG_UNIQUE_VIOLATION = '23505'

const VAULT_ITEM_COLUMNS =
  'id, user_id, display_name, ciphertext, iv, created_at, updated_at'

const STREAMS = {
  prefs: {
    kind: 'prefs',
    table: 'user_data',
    queryKey: (userId) => ['user_data', userId],
  },
  credentials: {
    kind: 'vaultItem',
    table: 'credentials',
    queryKey: (userId) => ['credentials', userId],
    detailKey: (userId, id) => ['credential', userId, id],
  },
  credit_cards: {
    kind: 'vaultItem',
    table: 'credit_cards',
    queryKey: (userId) => ['credit_cards', userId],
    detailKey: (userId, id) => ['credit_card', userId, id],
  },
}

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

function inServiceWorker() {
  return (
    typeof ServiceWorkerGlobalScope !== 'undefined' &&
    typeof self !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof ServiceWorkerGlobalScope
  )
}

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

function touchVaultItemCaches(stream, userId, { row, deletedId } = {}) {
  if (inServiceWorker()) return
  const cfg = STREAMS[stream]
  if (!cfg || cfg.kind !== 'vaultItem' || !userId) return
  import('@/lib/queryClient')
    .then(({ queryClient }) => {
      const listKey = cfg.queryKey(userId)
      const prev = queryClient.getQueryData(listKey)
      const list = Array.isArray(prev) ? prev : []

      if (deletedId) {
        queryClient.setQueryData(
          listKey,
          list.filter((r) => r.id !== deletedId),
        )
        queryClient.removeQueries({ queryKey: cfg.detailKey(userId, deletedId) })
        return
      }

      if (!row?.id) return
      const idx = list.findIndex((r) => r.id === row.id)
      const nextList =
        idx === -1
          ? [row, ...list]
          : list.map((r, i) => (i === idx ? row : r))
      // Keep list ordered by updated_at desc (matches list* APIs).
      nextList.sort((a, b) => {
        const at = a.updated_at ?? ''
        const bt = b.updated_at ?? ''
        return bt.localeCompare(at)
      })
      queryClient.setQueryData(listKey, nextList)
      queryClient.setQueryData(cfg.detailKey(userId, row.id), row)
    })
    .catch(() => {})
}

function normalizePrefsRow(row) {
  if (!row) return null
  const raw = row.data && typeof row.data === 'object' ? row.data : {}
  const prefs = normalizeRemotePrefs(raw)
  return {
    data: {
      ...raw,
      theme: prefs.theme,
      fontSize: prefs.fontSize,
      fabCorner: prefs.fabCorner,
    },
    updated_at: row.updated_at ?? null,
  }
}

function prefsDataEqual(a, b) {
  if (!a || !b) return false
  const ad = a.data ?? {}
  const bd = b.data ?? {}
  return (
    ad.theme === bd.theme &&
    ad.fontSize === bd.fontSize &&
    ad.fabCorner === bd.fabCorner &&
    JSON.stringify(ad.vault ?? null) === JSON.stringify(bd.vault ?? null)
  )
}

function normalizeVaultItemRow(row) {
  if (!row) return null
  return {
    id: row.id,
    user_id: row.user_id,
    display_name: row.display_name ?? '',
    ciphertext: row.ciphertext ?? '',
    iv: row.iv ?? '',
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
  }
}

function vaultItemEqual(a, b) {
  if (!a && !b) return true
  if (!a || !b) return false
  return (
    a.id === b.id &&
    a.user_id === b.user_id &&
    (a.display_name ?? '') === (b.display_name ?? '') &&
    a.ciphertext === b.ciphertext &&
    a.iv === b.iv
  )
}

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

    const current = normalizePrefsRow(
      raw ?? { data: {}, updated_at: null },
    )
    const observedUpdatedAt = raw?.updated_at ?? null

    const applied = applyFn(current)
    const next = normalizePrefsRow(applied)
    if (prefsDataEqual(current, next) && raw) {
      return { ...current, attempts: attempt, noop: true }
    }

    const nextUpdatedAt = new Date().toISOString()
    const payload = {
      id: userId,
      data: {
        ...next.data,
        updatedAt: nextUpdatedAt,
      },
      updated_at: nextUpdatedAt,
    }

    if (!raw) {
      const { data: inserted, error: insertErr } = await supabase
        .from('user_data')
        .insert(payload)
        .select('data, updated_at')
        .maybeSingle()
      if (!insertErr && inserted) {
        const row = normalizePrefsRow(inserted)
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
      const row = normalizePrefsRow(updated[0])
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

async function applyVaultItemOp(stream, userId, rowId, applyFn) {
  if (!userId) throw new Error('applySyncOp: userId is required')
  if (!rowId) throw new Error('applySyncOp: rowId is required')
  if (typeof applyFn !== 'function') {
    throw new Error('applySyncOp: op must be a function')
  }
  const cfg = STREAMS[stream]
  if (!cfg || cfg.kind !== 'vaultItem') {
    throw new Error(`applySyncOp: not a vault-item stream "${stream}"`)
  }

  let lastError = null
  for (let attempt = 1; attempt <= CAS_MAX_ATTEMPTS; attempt++) {
    const { data: raw, error: readErr } = await supabase
      .from(cfg.table)
      .select(VAULT_ITEM_COLUMNS)
      .eq('id', rowId)
      .eq('user_id', userId)
      .maybeSingle()
    if (readErr) throw readErr

    const current = normalizeVaultItemRow(raw)
    const observedUpdatedAt = raw?.updated_at ?? null

    const applied = applyFn(current)
    if (applied === null) {
      if (!raw) {
        touchVaultItemCaches(stream, userId, { deletedId: rowId })
        return { deleted: true, id: rowId, attempts: attempt, noop: true }
      }
      const { data: deleted, error: deleteErr } = await supabase
        .from(cfg.table)
        .delete()
        .eq('id', rowId)
        .eq('user_id', userId)
        .eq('updated_at', observedUpdatedAt)
        .select('id')
      if (deleteErr) throw deleteErr
      if (deleted && deleted.length > 0) {
        touchVaultItemCaches(stream, userId, { deletedId: rowId })
        return { deleted: true, id: rowId, attempts: attempt }
      }
      lastError = new Error(
        `applySyncOp: ${stream} delete CAS miss attempt ${attempt}`,
      )
      continue
    }

    const next = normalizeVaultItemRow(applied)
    if (!next?.id) {
      throw new Error(`applySyncOp: ${stream} op must return a row with id`)
    }
    if (vaultItemEqual(current, next) && raw) {
      return { ...current, attempts: attempt, noop: true }
    }

    const nextUpdatedAt = next.updated_at ?? new Date().toISOString()
    const payload = {
      id: next.id,
      user_id: userId,
      display_name: next.display_name ?? '',
      ciphertext: next.ciphertext,
      iv: next.iv,
      created_at: next.created_at ?? nextUpdatedAt,
      updated_at: nextUpdatedAt,
    }

    if (!raw) {
      const { data: inserted, error: insertErr } = await supabase
        .from(cfg.table)
        .insert(payload)
        .select(VAULT_ITEM_COLUMNS)
        .maybeSingle()
      if (!insertErr && inserted) {
        const row = normalizeVaultItemRow(inserted)
        touchVaultItemCaches(stream, userId, { row })
        return { ...row, attempts: attempt }
      }
      if (insertErr && insertErr.code !== PG_UNIQUE_VIOLATION) throw insertErr
      lastError =
        insertErr ??
        new Error(
          `applySyncOp: ${stream} INSERT failed attempt ${attempt}`,
        )
      continue
    }

    const { data: updated, error: updateErr } = await supabase
      .from(cfg.table)
      .update({
        display_name: payload.display_name,
        ciphertext: payload.ciphertext,
        iv: payload.iv,
        updated_at: payload.updated_at,
      })
      .eq('id', rowId)
      .eq('user_id', userId)
      .eq('updated_at', observedUpdatedAt)
      .select(VAULT_ITEM_COLUMNS)
    if (updateErr) throw updateErr
    if (updated && updated.length > 0) {
      const row = normalizeVaultItemRow(updated[0])
      touchVaultItemCaches(stream, userId, { row })
      return { ...row, attempts: attempt }
    }
    lastError = new Error(
      `applySyncOp: ${stream} CAS miss attempt ${attempt}`,
    )
  }
  throw (
    lastError ??
    new Error(
      `applySyncOp: ${stream} CAS exhausted after ${CAS_MAX_ATTEMPTS} attempts`,
    )
  )
}

/**
 * Apply a pure operator against a sync stream.
 *
 * @param {'prefs'|'credentials'|'credit_cards'} stream
 * @param {string} userId
 * @param {(current) => next} op
 * @param {string} [rowId] required for vault-item streams
 */
export async function applySyncOp({ stream, userId, op, rowId }) {
  if (stream === 'prefs') {
    return applyPrefsOp(userId, op)
  }
  if (stream === 'credentials' || stream === 'credit_cards') {
    return applyVaultItemOp(stream, userId, rowId, op)
  }
  throw new Error(`applySyncOp: unknown stream "${stream}"`)
}

async function fetchPrefsRow(userId) {
  const { data: row, error } = await supabase
    .from('user_data')
    .select('data, updated_at')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  if (!row) return null
  return normalizePrefsRow(row)
}

async function fetchVaultItemList(stream, userId) {
  const cfg = STREAMS[stream]
  const { data, error } = await supabase
    .from(cfg.table)
    .select(VAULT_ITEM_COLUMNS)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(normalizeVaultItemRow)
}

/**
 * Force-network pull of a stream (prefs row or vault-item list).
 */
export async function pullSync({ stream, userId } = {}) {
  if (!userId) throw new Error('pullSync: userId is required')
  if (stream === 'prefs') {
    const remote = await fetchPrefsRow(userId)
    if (remote) touchQueryCache(stream, userId, remote)
    return remote
  }
  if (stream === 'credentials' || stream === 'credit_cards') {
    const remote = await fetchVaultItemList(stream, userId)
    touchQueryCache(stream, userId, remote)
    return remote
  }
  throw new Error(`pullSync: unknown stream "${stream}"`)
}

export function getVaultItemStreamConfig(stream) {
  const cfg = STREAMS[stream]
  if (!cfg || cfg.kind !== 'vaultItem') return null
  return cfg
}

export {
  opSetTheme,
  opSetFontSize,
  opSetFabCorner,
  opPatchVaultMeta,
} from '@/lib/userDataOps'

export { opUpsertVaultItem, opDeleteVaultItem } from '@/lib/vaultItemOps'
