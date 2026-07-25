function chromeLocal() {
  try {
    return globalThis.chrome?.storage?.local ?? null
  } catch {
    return null
  }
}

const chromeStorage = chromeLocal()

export const asyncStorage = {
  async getItem(key) {
    if (chromeStorage) {
      const result = await chromeStorage.get(key)
      return result?.[key] ?? null
    }
    try {
      return globalThis.localStorage?.getItem(key) ?? null
    } catch {
      return null
    }
  },
  async setItem(key, value) {
    if (chromeStorage) {
      await chromeStorage.set({ [key]: value })
      return
    }
    try {
      globalThis.localStorage?.setItem(key, value)
    } catch { /* ignore */ }
  },
  async removeItem(key) {
    if (chromeStorage) {
      await chromeStorage.remove(key)
      return
    }
    try {
      globalThis.localStorage?.removeItem(key)
    } catch { /* ignore */ }
  },
}
