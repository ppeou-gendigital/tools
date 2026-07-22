import {
  VAULT_APP_ID,
  fetchVaultMeta,
  saveVaultMeta,
} from '@/lib/vaultMetaApi'

// Offline backup of vault_meta (salt / verifier / hint / idle).
// Does NOT include the passphrase or decrypted secrets. Restoring this
// after a wipe lets the same passphrase unlock existing ciphertext again.
//
// Full UI wiring: see tool/accesso VaultSettings / VaultUnlock, or
// tool/notas LockboxSettings for multi-vault backups.

export const VAULT_META_BACKUP_KIND = 'vault_meta_backup'
export const VAULT_META_BACKUP_VERSION = 1

export function vaultMetaBackupFilename(app = VAULT_APP_ID) {
  const stamp = new Date().toISOString().slice(0, 10)
  return `${app}-vault-meta-${stamp}.json`
}

export function downloadTextFile(filename, text, mime = 'application/json') {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function buildVaultMetaBackup(meta, options = {}) {
  if (!meta?.salt || !meta?.verifier?.ciphertext || !meta?.verifier?.iv) {
    throw new Error('No vault metadata to export. Set up the vault first.')
  }
  if (typeof meta.iterations !== 'number') {
    throw new Error('Vault metadata is incomplete (iterations missing).')
  }
  const appId = options.appId ?? VAULT_APP_ID
  const entry = {
    id: appId,
    appId,
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
    app: appId,
    exportedAt: options.exportedAt ?? new Date().toISOString(),
    vaults: [entry],
  }
}

export function parseVaultMetaBackup(raw, expectedApp = VAULT_APP_ID) {
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
      id: typeof v.id === 'string' ? v.id : expectedApp,
      appId: typeof v.appId === 'string' ? v.appId : expectedApp,
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

export async function exportVaultMetaBackup(userId, appId = VAULT_APP_ID) {
  const fetched = await fetchVaultMeta(userId, appId)
  const meta = fetched?.meta
  if (!meta) {
    throw new Error('No vault metadata found to export.')
  }
  const doc = buildVaultMetaBackup(meta, { appId })
  downloadTextFile(vaultMetaBackupFilename(appId), `${JSON.stringify(doc, null, 2)}\n`)
  return doc
}

export async function restoreVaultMetaBackup(
  userId,
  raw,
  appId = VAULT_APP_ID,
) {
  const doc = parseVaultMetaBackup(raw, appId)
  const entry = doc.vaults[0]
  if (!entry) throw new Error('Backup has no vault entry.')
  const patch = {
    salt: entry.salt,
    iterations: entry.iterations,
    verifier: entry.verifier,
    hint: entry.hint,
  }
  if (typeof entry.idleTimeoutMs === 'number') {
    patch.idleTimeoutMs = entry.idleTimeoutMs
  }
  const saved = await saveVaultMeta(userId, patch, appId)
  return { doc, saved }
}
