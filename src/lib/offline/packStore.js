/**
 * Durable offline packs (IndexedDB).
 */

import { openDB } from 'idb'

const DB_NAME = 'notas.offline'
const DB_VERSION = 1
const STORE = 'packs'

function openPackDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'scopeId' })
        store.createIndex('bySyncedAt', 'syncedAt')
        store.createIndex('byKind', 'kind')
      }
    },
  })
}

export async function putPack(pack) {
  if (!pack?.scopeId) throw new Error('pack.scopeId is required')
  const db = await openPackDb()
  await db.put(STORE, pack)
  return pack
}

export async function getPack(scopeId) {
  if (!scopeId) return null
  const db = await openPackDb()
  return (await db.get(STORE, scopeId)) ?? null
}

export async function listPacks() {
  const db = await openPackDb()
  const all = await db.getAll(STORE)
  return all.sort((a, b) => String(b.syncedAt).localeCompare(String(a.syncedAt)))
}

export async function deletePack(scopeId) {
  if (!scopeId) return
  const db = await openPackDb()
  await db.delete(STORE, scopeId)
}
