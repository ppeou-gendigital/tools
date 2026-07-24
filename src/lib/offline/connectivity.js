/**
 * Browser online/offline signal for the offline mode fork.
 * Prefer this over ad-hoc navigator.onLine reads so listeners stay consistent.
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
      // ignore subscriber errors
    }
  }
}

let wired = false

function ensureWired() {
  if (wired || typeof window === 'undefined') return
  wired = true
  window.addEventListener('online', () => emit(true))
  window.addEventListener('offline', () => emit(false))
  // Some browsers lie about onLine until a focus; re-check on visibility.
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
