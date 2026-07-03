// Unified async storage that works in both the extension (chrome.storage.local)
// and the web build (localStorage). Shaped to satisfy supabase-js's
// `SupportedStorage` interface — all methods return Promises so the same
// adapter can be used everywhere.

import { isExtension } from '@/env'

const useChromeStorage = isExtension() && !!chrome?.storage?.local

export const asyncStorage = {
  async getItem(key) {
    if (useChromeStorage) {
      const result = await chrome.storage.local.get(key)
      return result?.[key] ?? null
    }
    try {
      return globalThis.localStorage?.getItem(key) ?? null
    } catch {
      return null
    }
  },

  async setItem(key, value) {
    if (useChromeStorage) {
      await chrome.storage.local.set({ [key]: value })
      return
    }
    try {
      globalThis.localStorage?.setItem(key, value)
    } catch {
      // ignore quota / private-mode errors
    }
  },

  async removeItem(key) {
    if (useChromeStorage) {
      await chrome.storage.local.remove(key)
      return
    }
    try {
      globalThis.localStorage?.removeItem(key)
    } catch {
      // ignore
    }
  },
}
