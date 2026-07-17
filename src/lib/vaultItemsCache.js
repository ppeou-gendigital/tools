// Optimistic React Query helpers for vault-item list + detail keys.
// Used by CredentialEdit / CreditCardEdit / CreditCards before the
// CAS push; revert restores a snapshot taken beforehand.

import { getVaultItemStreamConfig } from '@/lib/supabaseSync'

export function snapshotVaultItemCaches(queryClient, stream, userId, id) {
  const cfg = getVaultItemStreamConfig(stream)
  if (!cfg || !userId) return null
  const listKey = cfg.queryKey(userId)
  const detailKey = id ? cfg.detailKey(userId, id) : null
  return {
    listKey,
    detailKey,
    list: queryClient.getQueryData(listKey),
    detail: detailKey ? queryClient.getQueryData(detailKey) : undefined,
    hadDetail: detailKey
      ? queryClient.getQueryData(detailKey) !== undefined
      : false,
  }
}

export function revertVaultItemCaches(queryClient, snapshot) {
  if (!snapshot) return
  if (snapshot.list === undefined) {
    queryClient.removeQueries({ queryKey: snapshot.listKey })
  } else {
    queryClient.setQueryData(snapshot.listKey, snapshot.list)
  }
  if (!snapshot.detailKey) return
  if (!snapshot.hadDetail) {
    queryClient.removeQueries({ queryKey: snapshot.detailKey })
  } else {
    queryClient.setQueryData(snapshot.detailKey, snapshot.detail)
  }
}

export function optimisticUpsertVaultItem(queryClient, stream, userId, row) {
  const cfg = getVaultItemStreamConfig(stream)
  if (!cfg || !userId || !row?.id) return
  const listKey = cfg.queryKey(userId)
  const prev = queryClient.getQueryData(listKey)
  const list = Array.isArray(prev) ? prev : []
  const idx = list.findIndex((r) => r.id === row.id)
  const nextList =
    idx === -1 ? [row, ...list] : list.map((r, i) => (i === idx ? row : r))
  nextList.sort((a, b) => {
    const at = a.updated_at ?? ''
    const bt = b.updated_at ?? ''
    return bt.localeCompare(at)
  })
  queryClient.setQueryData(listKey, nextList)
  queryClient.setQueryData(cfg.detailKey(userId, row.id), row)
}

export function optimisticRemoveVaultItem(queryClient, stream, userId, id) {
  const cfg = getVaultItemStreamConfig(stream)
  if (!cfg || !userId || !id) return
  const listKey = cfg.queryKey(userId)
  const prev = queryClient.getQueryData(listKey)
  const list = Array.isArray(prev) ? prev : []
  queryClient.setQueryData(
    listKey,
    list.filter((r) => r.id !== id),
  )
  queryClient.removeQueries({ queryKey: cfg.detailKey(userId, id) })
}

/**
 * Merge a force-pulled remote list into the cache, preserving dirty
 * local rows (in-flight creates/updates) and dropping non-dirty rows
 * that no longer exist remotely.
 *
 * Pass `localList` snapped *before* pullSync — pullSync overwrites the
 * query cache, so reading getQueryData afterward would lose dirty creates.
 */
export function reconcileVaultItemList(
  queryClient,
  stream,
  userId,
  remoteList,
  dirtyIds,
  localList,
) {
  const cfg = getVaultItemStreamConfig(stream)
  if (!cfg || !userId) return
  const listKey = cfg.queryKey(userId)
  const local = Array.isArray(localList)
    ? localList
    : Array.isArray(queryClient.getQueryData(listKey))
      ? queryClient.getQueryData(listKey)
      : []
  const remoteById = new Map((remoteList ?? []).map((r) => [r.id, r]))
  const dirty = dirtyIds instanceof Set ? dirtyIds : new Set(dirtyIds ?? [])

  const merged = []
  const seen = new Set()

  for (const row of remoteList ?? []) {
    if (dirty.has(row.id)) {
      const localRow = local.find((r) => r.id === row.id)
      merged.push(localRow ?? row)
    } else {
      merged.push(row)
      queryClient.setQueryData(cfg.detailKey(userId, row.id), row)
    }
    seen.add(row.id)
  }

  // Keep local-only dirty creates that have not landed remotely yet.
  for (const row of local) {
    if (!seen.has(row.id) && dirty.has(row.id)) {
      merged.push(row)
      seen.add(row.id)
    }
  }

  merged.sort((a, b) => {
    const at = a.updated_at ?? ''
    const bt = b.updated_at ?? ''
    return bt.localeCompare(at)
  })
  queryClient.setQueryData(listKey, merged)

  // Drop detail caches for rows removed remotely (and not dirty).
  for (const row of local) {
    if (!remoteById.has(row.id) && !dirty.has(row.id)) {
      queryClient.removeQueries({ queryKey: cfg.detailKey(userId, row.id) })
    }
  }
}
