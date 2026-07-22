import { supabase } from '@/lib/supabase'

// Per-app vault crypto row in public.vault_meta.
//
// After `npm run init` / init-tool, TOOLNAME becomes your kebab tool id
// (e.g. 'accesso'). Multi-vault tools can use 'TOOLNAME:<scopeId>' —
// see tool/notas (notas:<lockboxUuid>).
//
// Never put salt/verifier in user_data.data.

/** Replaced by init-tool.mjs → kebab tool name. */
export const VAULT_APP_ID = 'TOOLNAME'

export function vaultMetaQueryKey(userId, appId = VAULT_APP_ID) {
  return ['vault_meta', userId, appId]
}

function normalizeHint(v) {
  if (typeof v !== 'string') return null
  const trimmed = v.trim().replace(/\s+/g, ' ')
  if (!trimmed) return null
  return trimmed.slice(0, 80)
}

/**
 * Normalize a DB row into vault meta shape.
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
  const meta = {
    salt,
    iterations,
    verifier,
    idleTimeoutMs:
      typeof row.idle_timeout_ms === 'number'
        ? row.idle_timeout_ms
        : typeof row.idleTimeoutMs === 'number'
          ? row.idleTimeoutMs
          : null,
  }
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
  if ('idleTimeoutMs' in meta || 'idle_timeout_ms' in meta) {
    const n = meta.idleTimeoutMs ?? meta.idle_timeout_ms
    out.idle_timeout_ms = typeof n === 'number' ? n : null
  }
  return out
}

export async function fetchVaultMeta(userId, appId = VAULT_APP_ID) {
  if (!userId) return null
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

/**
 * Shallow-merge `patch` into the app's vault_meta row (insert if missing).
 * Requires salt + iterations + verifier on create.
 */
export async function saveVaultMeta(userId, patch, appId = VAULT_APP_ID) {
  if (!userId) throw new Error('saveVaultMeta: userId is required')
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
      idle_timeout_ms: dbPatch.idle_timeout_ms ?? null,
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

export async function deleteVaultMeta(userId, appId = VAULT_APP_ID) {
  if (!userId) return
  const { error } = await supabase
    .from('vault_meta')
    .delete()
    .eq('user_id', userId)
    .eq('app_id', appId)
  if (error) throw error
}
