import { supabase } from '@/lib/supabase'

// Shared public.vault_meta table (same project as Accesso).
//
// App id conventions:
//   'accesso'              — Accesso single-vault meta
//   'notas:<lockboxUuid>'  — one row per Notas lockbox (salt/verifier/hint)
//
// Never store salt/verifier in user_data.data — sibling prefs CAS can wipe it.

export const VAULT_APP_NOTAS_PREFIX = 'notas:'

const HINT_MAX = 120

export function notasLockboxAppId(lockboxId) {
  if (!lockboxId || typeof lockboxId !== 'string') {
    throw new Error('notasLockboxAppId: lockboxId is required')
  }
  return `${VAULT_APP_NOTAS_PREFIX}${lockboxId}`
}

export function lockboxIdFromNotasAppId(appId) {
  if (typeof appId !== 'string' || !appId.startsWith(VAULT_APP_NOTAS_PREFIX)) {
    return null
  }
  const id = appId.slice(VAULT_APP_NOTAS_PREFIX.length)
  return id || null
}

function normalizeHint(v) {
  if (typeof v !== 'string') return null
  const trimmed = v.trim().replace(/\s+/g, ' ')
  if (!trimmed) return null
  return trimmed.slice(0, HINT_MAX)
}

/**
 * Normalize a DB row into lockbox crypto fields.
 * Returns null when salt/verifier are missing or malformed.
 */
export function normalizeVaultMetaRow(row) {
  if (!row || typeof row !== 'object') return null
  const salt = row.salt
  const iterations = row.iterations
  const verifier = row.verifier
  if (typeof salt !== 'string' || typeof iterations !== 'number') return null
  if (
    !verifier ||
    typeof verifier.ciphertext !== 'string' ||
    typeof verifier.iv !== 'string'
  ) {
    return null
  }
  const hint = normalizeHint(row.hint)
  const meta = { salt, iterations, verifier }
  if (hint) meta.hint = hint
  return meta
}

function toDbPatch(meta) {
  const out = {}
  if (typeof meta.salt === 'string') out.salt = meta.salt
  if (typeof meta.iterations === 'number') out.iterations = meta.iterations
  if (meta.verifier && typeof meta.verifier === 'object') {
    out.verifier = meta.verifier
  }
  if ('hint' in meta) {
    out.hint = normalizeHint(meta.hint)
  }
  return out
}

export async function fetchVaultMeta(userId, appId) {
  if (!userId) return null
  if (!appId) throw new Error('fetchVaultMeta: appId is required')
  const { data, error } = await supabase
    .from('vault_meta')
    .select(
      'user_id, app_id, salt, iterations, verifier, hint, idle_timeout_ms, created_at, updated_at',
    )
    .eq('user_id', userId)
    .eq('app_id', appId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return {
    row: data,
    meta: normalizeVaultMetaRow(data),
  }
}

/** All Notas lockbox crypto rows for a user → Map<lockboxId, meta>. */
export async function listNotasLockboxVaultMeta(userId) {
  const map = new Map()
  if (!userId) return map
  const { data, error } = await supabase
    .from('vault_meta')
    .select(
      'user_id, app_id, salt, iterations, verifier, hint, idle_timeout_ms, created_at, updated_at',
    )
    .eq('user_id', userId)
    .like('app_id', `${VAULT_APP_NOTAS_PREFIX}%`)
  if (error) throw error
  for (const row of data ?? []) {
    const lockboxId = lockboxIdFromNotasAppId(row.app_id)
    const meta = normalizeVaultMetaRow(row)
    if (lockboxId && meta) map.set(lockboxId, meta)
  }
  return map
}

export async function saveVaultMeta(userId, patch, appId) {
  if (!userId) throw new Error('saveVaultMeta: userId is required')
  if (!appId) throw new Error('saveVaultMeta: appId is required')
  const dbPatch = toDbPatch(patch ?? {})
  if (Object.keys(dbPatch).length === 0) {
    return fetchVaultMeta(userId, appId)
  }

  const existing = await fetchVaultMeta(userId, appId)
  const now = new Date().toISOString()

  if (!existing?.row) {
    if (
      typeof dbPatch.salt !== 'string' ||
      typeof dbPatch.iterations !== 'number' ||
      !dbPatch.verifier
    ) {
      throw new Error(
        'saveVaultMeta: salt, iterations, and verifier are required to create vault meta',
      )
    }
    const insert = {
      user_id: userId,
      app_id: appId,
      salt: dbPatch.salt,
      iterations: dbPatch.iterations,
      verifier: dbPatch.verifier,
      hint: dbPatch.hint ?? null,
      idle_timeout_ms: null,
      created_at: now,
      updated_at: now,
    }
    const { data, error } = await supabase
      .from('vault_meta')
      .insert(insert)
      .select(
        'user_id, app_id, salt, iterations, verifier, hint, idle_timeout_ms, created_at, updated_at',
      )
      .maybeSingle()
    if (error) throw error
    return { row: data, meta: normalizeVaultMetaRow(data) }
  }

  const next = {
    ...existing.row,
    ...dbPatch,
    updated_at: now,
  }
  const { data, error } = await supabase
    .from('vault_meta')
    .update({
      salt: next.salt,
      iterations: next.iterations,
      verifier: next.verifier,
      hint: next.hint ?? null,
      idle_timeout_ms: next.idle_timeout_ms ?? null,
      updated_at: now,
    })
    .eq('user_id', userId)
    .eq('app_id', appId)
    .select(
      'user_id, app_id, salt, iterations, verifier, hint, idle_timeout_ms, created_at, updated_at',
    )
    .maybeSingle()
  if (error) throw error
  return { row: data, meta: normalizeVaultMetaRow(data) }
}

export async function deleteVaultMeta(userId, appId) {
  if (!userId || !appId) return
  const { error } = await supabase
    .from('vault_meta')
    .delete()
    .eq('user_id', userId)
    .eq('app_id', appId)
  if (error) throw error
}

/** Delete every notas:<lockboxId> row whose id is not in keepLockboxIds. */
export async function deleteOrphanNotasLockboxVaultMeta(
  userId,
  keepLockboxIds,
) {
  if (!userId) return
  const keep = keepLockboxIds instanceof Set ? keepLockboxIds : new Set(keepLockboxIds)
  const { data, error } = await supabase
    .from('vault_meta')
    .select('app_id')
    .eq('user_id', userId)
    .like('app_id', `${VAULT_APP_NOTAS_PREFIX}%`)
  if (error) throw error
  const toDelete = (data ?? [])
    .map((r) => r.app_id)
    .filter((appId) => {
      const id = lockboxIdFromNotasAppId(appId)
      return id && !keep.has(id)
    })
  if (toDelete.length === 0) return
  const { error: delErr } = await supabase
    .from('vault_meta')
    .delete()
    .eq('user_id', userId)
    .in('app_id', toDelete)
  if (delErr) throw delErr
}

/**
 * Persist lockbox crypto into vault_meta (authoritative).
 * Still dual-written to notas_lockboxes columns for older clients.
 */
export async function saveNotasLockboxVaultMeta(userId, lockbox) {
  if (!userId) throw new Error('saveNotasLockboxVaultMeta: userId is required')
  if (!lockbox?.id) throw new Error('saveNotasLockboxVaultMeta: lockbox.id required')
  if (
    typeof lockbox.salt !== 'string' ||
    typeof lockbox.iterations !== 'number' ||
    !lockbox.verifier?.ciphertext ||
    !lockbox.verifier?.iv
  ) {
    throw new Error('saveNotasLockboxVaultMeta: incomplete crypto fields')
  }
  return saveVaultMeta(
    userId,
    {
      salt: lockbox.salt,
      iterations: lockbox.iterations,
      verifier: lockbox.verifier,
      hint: lockbox.hint ?? null,
    },
    notasLockboxAppId(lockbox.id),
  )
}
