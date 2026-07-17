// Module-level dirty set for vault-item streams. Mutations mark a row
// dirty before the CAS push; VaultItemsSync skips dirty ids when
// reconciling a pull-on-unlock so in-flight edits are not overwritten.

const dirty = new Set()

function dirtyKey(stream, id) {
  return `${stream}:${id}`
}

export function markVaultItemDirty(stream, id) {
  if (!stream || !id) return
  dirty.add(dirtyKey(stream, id))
}

export function clearVaultItemDirty(stream, id) {
  if (!stream || !id) return
  dirty.delete(dirtyKey(stream, id))
}

export function isVaultItemDirty(stream, id) {
  if (!stream || !id) return false
  return dirty.has(dirtyKey(stream, id))
}

export function clearAllVaultItemDirty() {
  dirty.clear()
}

export function getDirtyVaultItemIds(stream) {
  const prefix = `${stream}:`
  const ids = new Set()
  for (const key of dirty) {
    if (key.startsWith(prefix)) ids.add(key.slice(prefix.length))
  }
  return ids
}
