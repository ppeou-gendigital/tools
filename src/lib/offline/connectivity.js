/**
 * Browser online/offline signal for the offline mode fork.
 */

function readOnline() {
  if (typeof navigator === 'undefined') return true
  return navigator.onLine !== false
}

let current = readOnline()
const listeners = new Set()

function emit(next) {
  if (next === current) return
  current = next
  for (const fn of listeners) {
    try {
      fn(current)
    } catch {
      /* ignore */
    }
  }
}

let wired = false

function ensureWired() {
  if (wired || typeof window === 'undefined') return
  wired = true
  window.addEventListener('online', () => emit(true))
  window.addEventListener('offline', () => emit(false))
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') emit(readOnline())
  })
}

export function getIsOnline() {
  ensureWired()
  return current
}

/** @param {(online: boolean) => void} fn */
export function subscribeIsOnline(fn) {
  ensureWired()
  listeners.add(fn)
  fn(current)
  return () => listeners.delete(fn)
}
