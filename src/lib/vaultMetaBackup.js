import {
  VAULT_APP_ACCESSO,
  fetchVaultMeta,
  saveVaultMeta,
} from '@/lib/vaultMetaApi'
import { downloadTextFile } from '@/lib/datafeed/download'

// Offline backup of vault_meta (salt / verifier / hint / idle).
// Does NOT include passphrase or decrypted secrets. Restoring this after
// a prefs wipe lets the same passphrase unlock existing ciphertext again.

export const VAULT_META_BACKUP_KIND = 'vault_meta_backup'
export const VAULT_META_BACKUP_VERSION = 1
export const VAULT_META_BACKUP_APP = 'accesso'

export function vaultMetaBackupFilename(app = VAULT_META_BACKUP_APP) {
  const stamp = new Date().toISOString().slice(0, 10)
  return `${app}-vault-meta-${stamp}.json`
}

export function buildAccessoVaultMetaBackup(meta, options = {}) {
  if (!meta?.salt || !meta?.verifier?.ciphertext || !meta?.verifier?.iv) {
    throw new Error('No vault metadata to export. Set up the vault first.')
  }
  if (typeof meta.iterations !== 'number') {
    throw new Error('Vault metadata is incomplete (iterations missing).')
  }
  const entry = {
    id: VAULT_APP_ACCESSO,
    appId: VAULT_APP_ACCESSO,
    salt: meta.salt,
    iterations: meta.iterations,
    verifier: {
      ciphertext: meta.verifier.ciphertext,
      iv: meta.verifier.iv,
    },
  }
  if (meta.hint) entry.hint = meta.hint
  if (typeof meta.idleTimeoutMs === 'number') {
    entry.idleTimeoutMs = meta.idleTimeoutMs
  }
  return {
    version: VAULT_META_BACKUP_VERSION,
    kind: VAULT_META_BACKUP_KIND,
    app: VAULT_META_BACKUP_APP,
    exportedAt: options.exportedAt ?? new Date().toISOString(),
    vaults: [entry],
  }
}

export function parseVaultMetaBackup(raw, expectedApp = VAULT_META_BACKUP_APP) {
  const doc = typeof raw === 'string' ? JSON.parse(raw) : raw
  if (!doc || typeof doc !== 'object') {
    throw new Error('Backup file is not a JSON object.')
  }
  if (doc.kind !== VAULT_META_BACKUP_KIND) {
    throw new Error(
      `Not a vault-meta backup (kind=${String(doc.kind ?? 'missing')}).`,
    )
  }
  if (doc.version !== VAULT_META_BACKUP_VERSION) {
    throw new Error(`Unsupported backup version: ${String(doc.version)}`)
  }
  if (doc.app !== expectedApp) {
    throw new Error(
      `This backup is for "${doc.app}", not "${expectedApp}".`,
    )
  }
  if (!Array.isArray(doc.vaults) || doc.vaults.length === 0) {
    throw new Error('Backup contains no vault entries.')
  }
  const vaults = doc.vaults.map((v, i) => {
    if (!v || typeof v !== 'object') {
      throw new Error(`Vault entry ${i} is invalid.`)
    }
    if (typeof v.salt !== 'string' || !v.salt) {
      throw new Error(`Vault entry ${i}: salt is required.`)
    }
    if (typeof v.iterations !== 'number') {
      throw new Error(`Vault entry ${i}: iterations is required.`)
    }
    if (
      !v.verifier ||
      typeof v.verifier.ciphertext !== 'string' ||
      typeof v.verifier.iv !== 'string'
    ) {
      throw new Error(`Vault entry ${i}: verifier ciphertext/iv required.`)
    }
    return {
      id: typeof v.id === 'string' ? v.id : VAULT_APP_ACCESSO,
      appId:
        typeof v.appId === 'string' ? v.appId : VAULT_APP_ACCESSO,
      name: typeof v.name === 'string' ? v.name : null,
      salt: v.salt,
      iterations: v.iterations,
      verifier: {
        ciphertext: v.verifier.ciphertext,
        iv: v.verifier.iv,
      },
      hint: typeof v.hint === 'string' ? v.hint : null,
      idleTimeoutMs:
        typeof v.idleTimeoutMs === 'number' ? v.idleTimeoutMs : undefined,
    }
  })
  return {
    version: doc.version,
    kind: doc.kind,
    app: doc.app,
    exportedAt: doc.exportedAt ?? null,
    vaults,
  }
}

export async function exportAccessoVaultMetaBackup(userId) {
  const fetched = await fetchVaultMeta(userId, VAULT_APP_ACCESSO)
  const meta = fetched?.meta
  if (!meta) {
    throw new Error('No Accesso vault metadata found to export.')
  }
  const doc = buildAccessoVaultMetaBackup(meta)
  const text = `${JSON.stringify(doc, null, 2)}\n`
  downloadTextFile(vaultMetaBackupFilename('accesso'), text)
  return doc
}

/**
 * Overwrite Accesso vault_meta from a backup document/string.
 * Caller should clear session cache and force re-unlock afterward.
 */
export async function restoreAccessoVaultMetaBackup(userId, raw) {
  const doc = parseVaultMetaBackup(raw, VAULT_META_BACKUP_APP)
  const entry = doc.vaults[0]
  if (!entry) throw new Error('Backup has no Accesso vault entry.')
  const patch = {
    salt: entry.salt,
    iterations: entry.iterations,
    verifier: entry.verifier,
    hint: entry.hint,
  }
  if (typeof entry.idleTimeoutMs === 'number') {
    patch.idleTimeoutMs = entry.idleTimeoutMs
  }
  const saved = await saveVaultMeta(userId, patch, VAULT_APP_ACCESSO)
  return { doc, saved }
}
