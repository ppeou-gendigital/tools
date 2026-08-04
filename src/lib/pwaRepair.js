const REPAIR_FLAG = 'loopy.repaired'

/**
 * Nuclear reset for this origin, then reload once.
 * Clears service workers, Cache Storage, localStorage, sessionStorage,
 * IndexedDB, and cookies — signs the user out and drops lastRoute / query cache.
 *
 * Re-sets a one-shot session flag after the wipe so auto-repair cannot loop.
 *
 * @param {{ force?: boolean }} [opts] — force=true ignores the one-shot session flag
 * @returns {{Promise<boolean>}} true if a reload was triggered
 */
export async function repairPwaShell({ force = false } = {}) {
  try {
    if (!force && sessionStorage.getItem(REPAIR_FLAG) === '1') return false
  } catch {
    /* private mode — still attempt repair */
  }

  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations()
      await Promise.all(regs.map((r) => r.unregister()))
    }
  } catch {
    /* ignore */
  }

  try {
    if (typeof caches !== 'undefined') {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
    }
  } catch {
    /* ignore */
  }

  try {
    if (typeof indexedDB !== 'undefined' && typeof indexedDB.databases === 'function') {
      const dbs = await indexedDB.databases()
      await Promise.all(
        (dbs ?? []).map(
          (db) =>
            new Promise((resolve) => {
              if (!db?.name) {
                resolve()
                return
              }
              const req = indexedDB.deleteDatabase(db.name)
              req.onsuccess = () => resolve()
              req.onerror = () => resolve()
              req.onblocked = () => resolve()
            }),
        ),
      )
    }
  } catch {
    /* ignore */
  }

  try {
    localStorage.clear()
  } catch {
    /* ignore */
  }

  try {
    sessionStorage.clear()
  } catch {
    /* ignore */
  }

  try {
    const cookies = document.cookie ? document.cookie.split(';') : []
    for (const part of cookies) {
      const name = part.split('=')[0]?.trim()
      if (!name) continue
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    }
  } catch {
    /* ignore */
  }

  // After the wipe, mark this tab so empty-root / crash auto-repair cannot loop.
  try {
    sessionStorage.setItem(REPAIR_FLAG, '1')
  } catch {
    /* ignore */
  }

  location.reload()
  return true
}

export function hasAttemptedPwaRepair() {
  try {
    return sessionStorage.getItem(REPAIR_FLAG) === '1'
  } catch {
    return false
  }
}
