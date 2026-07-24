/**
 * Build / refresh an Accesso vault offline pack.
 * Stores ciphertext rows + vault_meta only — never passphrase or plaintext secrets.
 */

import { listCredentials } from '@/lib/credentialsApi'
import { listCreditCards } from '@/lib/creditCardsApi'
import {
  VAULT_APP_ACCESSO,
  fetchVaultMeta,
  normalizeVaultMetaRow,
} from '@/lib/vaultMetaApi'
import { deletePack, getPack, listPacks, putPack } from '@/lib/offline/packStore'

export const VAULT_PACK_KIND = 'vault'
export const VAULT_PACK_SCHEMA = 1
export const TOOL_ID = 'accesso'

/**
 * @param {string} userId
 */
export async function buildVaultOfflinePack(userId) {
  if (!userId) throw new Error('buildVaultOfflinePack: userId is required')

  const [fetched, credentials, creditCards] = await Promise.all([
    fetchVaultMeta(userId, VAULT_APP_ACCESSO),
    listCredentials(userId),
    listCreditCards(userId),
  ])

  const vaultMeta = fetched?.meta ?? normalizeVaultMetaRow(fetched?.row)
  if (!vaultMeta) {
    throw new Error(
      'Vault is not set up yet. Create a passphrase before making it available offline.',
    )
  }

  /** @type {import('./packStore').OfflinePack} */
  const pack = {
    schemaVersion: VAULT_PACK_SCHEMA,
    toolId: TOOL_ID,
    scopeId: userId,
    kind: VAULT_PACK_KIND,
    title: 'My vault',
    syncedAt: new Date().toISOString(),
    vaultMeta: {
      salt: vaultMeta.salt,
      iterations: vaultMeta.iterations,
      verifier: vaultMeta.verifier,
      hint: vaultMeta.hint ?? null,
      idleTimeoutMs: vaultMeta.idleTimeoutMs,
    },
    // Opaque encrypted rows (same shape as Supabase selects).
    credentials: (credentials ?? []).map((row) => ({
      id: row.id,
      user_id: row.user_id,
      display_name: row.display_name ?? '',
      ciphertext: row.ciphertext,
      iv: row.iv,
      created_at: row.created_at,
      updated_at: row.updated_at,
    })),
    creditCards: (creditCards ?? []).map((row) => ({
      id: row.id,
      user_id: row.user_id,
      display_name: row.display_name ?? '',
      ciphertext: row.ciphertext,
      iv: row.iv,
      created_at: row.created_at,
      updated_at: row.updated_at,
    })),
  }

  await putPack(pack)
  return pack
}

export async function getVaultOfflinePack(userId) {
  const pack = await getPack(userId)
  if (!pack || pack.kind !== VAULT_PACK_KIND) return null
  return pack
}

export async function removeVaultOfflinePack(userId) {
  await deletePack(userId)
}

export async function listVaultOfflinePacks() {
  const all = await listPacks()
  return all.filter((p) => p.kind === VAULT_PACK_KIND)
}
