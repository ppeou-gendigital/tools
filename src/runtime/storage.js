// chrome.storage.local wrapper with a localStorage fallback so `npm run dev`
// can render the popup in a normal tab.

const PREVIEW_PREFIX = 'jiraCapacity.preview.'

export function hasChromeStorage() {
  return typeof chrome !== 'undefined' && Boolean(chrome.storage?.local)
}

export async function readKey(key, fallback) {
  if (hasChromeStorage()) {
    const stored = await chrome.storage.local.get([key])
    return stored?.[key] === undefined ? fallback : stored[key]
  }

  try {
    const raw = localStorage.getItem(PREVIEW_PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeKey(key, value) {
  if (hasChromeStorage()) {
    chrome.storage.local.set({ [key]: value }).catch((error) => {
      console.error('[jira-capacity] failed to save', key, error)
    })
    return
  }

  try {
    localStorage.setItem(PREVIEW_PREFIX + key, JSON.stringify(value))
  } catch (error) {
    console.error('[jira-capacity] failed to save', key, error)
  }
}

export function removeKey(key) {
  if (hasChromeStorage()) {
    chrome.storage.local.remove(key)
    return
  }

  try {
    localStorage.removeItem(PREVIEW_PREFIX + key)
  } catch {
    // ignore
  }
}
