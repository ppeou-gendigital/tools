import {
  listNotasLockboxVaultMeta,
  notasLockboxAppId,
  saveNotasLockboxVaultMeta,
} from '@/lib/vaultMetaApi'

// Offline backup of Notas lockbox crypto (salt / verifier / hint).
// One file can hold every lockbox. Restoring after a wipe lets the same
// passphrases unlock existing note ciphertext again.

export const VAULT_META_BACKUP_KIND = 'vault_meta_backup'
export const VAULT_META_BACKUP_VERSION = 1
export const VAULT_META_BACKUP_APP = 'notas'

export function vaultMetaBackupFilename(app = VAULT_META_BACKUP_APP) {
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

export function buildNotasVaultMetaBackup(lockboxes, options = {}) {
  const list = Array.isArray(lockboxes) ? lockboxes : []
  const vaults = []
  for (const lb of list) {
    if (!lb?.id || typeof lb.salt !== 'string') continue
    if (typeof lb.iterations !== 'number') continue
    if (!lb.verifier?.ciphertext || !lb.verifier?.iv) continue
    const entry = {
      id: lb.id,
      appId: notasLockboxAppId(lb.id),
      name: typeof lb.name === 'string' ? lb.name : null,
      salt: lb.salt,
      iterations: lb.iterations,
      verifier: {
        ciphertext: lb.verifier.ciphertext,
        iv: lb.verifier.iv,
      },
    }
    if (lb.hint) entry.hint = lb.hint
    vaults.push(entry)
  }
  if (vaults.length === 0) {
    throw new Error('No lockbox metadata to export.')
  }
  return {
    version: VAULT_META_BACKUP_VERSION,
    kind: VAULT_META_BACKUP_KIND,
    app: VAULT_META_BACKUP_APP,
    exportedAt: options.exportedAt ?? new Date().toISOString(),
    vaults,
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
    if (typeof v.id !== 'string' || !v.id) {
      throw new Error(`Vault entry ${i}: id (lockbox uuid) is required.`)
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
      id: v.id,
      appId: typeof v.appId === 'string' ? v.appId : notasLockboxAppId(v.id),
      name: typeof v.name === 'string' ? v.name : null,
      salt: v.salt,
      iterations: v.iterations,
      verifier: {
        ciphertext: v.verifier.ciphertext,
        iv: v.verifier.iv,
      },
      hint: typeof v.hint === 'string' ? v.hint : null,
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

/**
 * Build backup from vault_meta (authoritative) merged with workspace names.
 */
export async function exportNotasVaultMetaBackup(userId, lockboxes = []) {
  const fromVault = await listNotasLockboxVaultMeta(userId)
  const byId = new Map()
  for (const lb of lockboxes) {
    if (lb?.id) byId.set(lb.id, lb)
  }
  const merged = []
  if (fromVault.size > 0) {
    for (const [id, meta] of fromVault) {
      const local = byId.get(id)
      merged.push({
        id,
        name: local?.name ?? null,
        salt: meta.salt,
        iterations: meta.iterations,
        verifier: meta.verifier,
        hint: meta.hint ?? local?.hint ?? null,
      })
    }
  } else {
    // Fallback: workspace still has crypto (pre-migration).
    for (const lb of lockboxes) merged.push(lb)
  }
  const doc = buildNotasVaultMetaBackup(merged)
  const text = `${JSON.stringify(doc, null, 2)}\n`
  downloadTextFile(vaultMetaBackupFilename('notas'), text)
  return doc
}

/**
 * Restore each lockbox crypto row into vault_meta.
 * Returns { restored, missingLocal } — missingLocal ids have no workspace
 * lockbox row (crypto restored anyway for later matching).
 */
export async function restoreNotasVaultMetaBackup(userId, raw, lockboxes = []) {
  const doc = parseVaultMetaBackup(raw, VAULT_META_BACKUP_APP)
  const localIds = new Set(
    (lockboxes ?? []).map((l) => l.id).filter(Boolean),
  )
  const restored = []
  const missingLocal = []
  for (const entry of doc.vaults) {
    await saveNotasLockboxVaultMeta(userId, {
      id: entry.id,
      salt: entry.salt,
      iterations: entry.iterations,
      verifier: entry.verifier,
      hint: entry.hint,
    })
    restored.push(entry)
    if (!localIds.has(entry.id)) missingLocal.push(entry)
  }
  return { doc, restored, missingLocal }
}
