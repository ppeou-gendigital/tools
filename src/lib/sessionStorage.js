// Session-scoped async storage for lockbox passphrase cache.
// Cleared when the browser (extension) or tab (web) closes.

import { isExtension } from '@/env'

const useChromeStorage = isExtension() && !!chrome?.storage?.session

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
        // ignore
      }
      return
    }
    try {
      globalThis.sessionStorage?.setItem(key, value)
    } catch {
      // ignore
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
