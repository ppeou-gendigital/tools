// Session-scoped async storage. Same shape as ./storage.js but binds to
// the browser's *session* tier instead of the persistent tier — the
// values here are cleared when the browser (extension) or tab (web)
// closes. Never a good place for anything you want to keep past a
// browser restart; the vault uses it precisely because we DON'T.
//
// Extension: `chrome.storage.session` — MV3-only, shared across popup
// + service worker + content scripts, quota is ~10 MB, never synced.
// Web:       `sessionStorage` — per-tab, per-origin, survives page
// reloads but not tab close.
//
// Values coming in / out are always strings. Callers JSON.stringify.

import { isExtension } from '@/env'

const useChromeStorage =
  isExtension() && !!chrome?.storage?.session

export const sessionAsyncStorage = {
  async getItem(key) {
    if (useChromeStorage) {
      try {
        const result = await chrome.storage.session.get(key)
        return result?.[key] ?? null
      } catch {
        return null
      }
    }
    try {
      return globalThis.sessionStorage?.getItem(key) ?? null
    } catch {
      return null
    }
  },

  async setItem(key, value) {
    if (useChromeStorage) {
      try {
        await chrome.storage.session.set({ [key]: value })
      } catch {
        // ignore quota / permission errors — cache is a soft optimization
      }
      return
    }
    try {
      globalThis.sessionStorage?.setItem(key, value)
    } catch {
      // ignore private-mode / quota errors
    }
  },

  async removeItem(key) {
    if (useChromeStorage) {
      try {
        await chrome.storage.session.remove(key)
      } catch {
        // ignore
      }
      return
    }
    try {
      globalThis.sessionStorage?.removeItem(key)
    } catch {
      // ignore
    }
  },
}
