import { supabase } from '@/lib/supabase'
import { normalizePassphraseHint } from '@/lib/prefs'
import { normalizeIdleTimeoutMs } from '@/lib/vaultIdleOptions'

// Per-app vault crypto row in public.vault_meta.
// App id conventions:
//   'accesso'              — Accesso single vault
//   'notas:<lockboxUuid>'  — Notas lockbox crypto (see tool/notas vaultMetaApi)
// Never put salt/verifier in user_data.

export const VAULT_APP_ACCESSO = 'accesso'

export function vaultMetaQueryKey(userId, appId = VAULT_APP_ACCESSO) {
  return ['vault_meta', userId, appId]
}

/**
 * Normalize a DB row (or in-memory patch) into VaultProvider meta shape.
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
  const hint = normalizePassphraseHint(row.hint)
  const idleTimeoutMs = normalizeIdleTimeoutMs(
    row.idle_timeout_ms ?? row.idleTimeoutMs,
  )
  const meta = { salt, iterations, verifier, idleTimeoutMs }
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
    out.hint = normalizePassphraseHint(meta.hint)
  }
  if ('idleTimeoutMs' in meta || 'idle_timeout_ms' in meta) {
    out.idle_timeout_ms = normalizeIdleTimeoutMs(
      meta.idleTimeoutMs ?? meta.idle_timeout_ms,
    )
  }
  return out
}

export async function fetchVaultMeta(userId, appId = VAULT_APP_ACCESSO) {
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
export async function saveVaultMeta(
  userId,
  patch,
  appId = VAULT_APP_ACCESSO,
) {
  if (!userId) throw new Error('saveVaultMeta: userId is required')
  const dbPatch = toDbPatch(patch ?? {})
  if (Object.keys(dbPatch).length === 0) {
    const current = await fetchVaultMeta(userId, appId)
    return current
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

export async function deleteVaultMeta(userId, appId = VAULT_APP_ACCESSO) {
  if (!userId) return
  const { error } = await supabase
    .from('vault_meta')
    .delete()
    .eq('user_id', userId)
    .eq('app_id', appId)
  if (error) throw error
}

/**
 * Wipe Accesso ciphertext tables + vault_meta row, and strip legacy
 * user_data.data.vault so a fresh setup can mint a new salt.
 */
function isMissingTableError(error) {
  if (!error) return false
  const code = String(error.code ?? '')
  const msg = String(error.message ?? '')
  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    /does not exist/i.test(msg) ||
    /could not find the table/i.test(msg) ||
    /schema cache/i.test(msg)
  )
}

export async function wipeAccessoVaultData(userId) {
  if (!userId) throw new Error('wipeAccessoVaultData: userId is required')

  const { error: credErr } = await supabase
    .from('credentials')
    .delete()
    .eq('user_id', userId)
  if (credErr) throw credErr

  const { error: cardErr } = await supabase
    .from('credit_cards')
    .delete()
    .eq('user_id', userId)
  if (cardErr) throw cardErr

  try {
    await deleteVaultMeta(userId, VAULT_APP_ACCESSO)
  } catch (err) {
    if (!isMissingTableError(err)) throw err
    // vault_meta not created yet — credentials/cards wipe is enough.
  }

  // Best-effort: remove legacy vault key from shared prefs blob.
  const { data: prefs, error: prefsReadErr } = await supabase
    .from('user_data')
    .select('data')
    .eq('id', userId)
    .maybeSingle()
  if (prefsReadErr) throw prefsReadErr
  if (prefs?.data && typeof prefs.data === 'object' && 'vault' in prefs.data) {
    const next = { ...prefs.data }
    delete next.vault
    const { error: prefsWriteErr } = await supabase
      .from('user_data')
      .update({ data: next, updated_at: new Date().toISOString() })
      .eq('id', userId)
    if (prefsWriteErr) throw prefsWriteErr
  }
}
