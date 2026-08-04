// Optional host-permission helpers for Author / site scans.
// Must be called from a user gesture (button click) when requesting.
//
// Chrome gotcha: do NOT await anything (including permissions.contains)
// before permissions.request — that drops the user-gesture token and the
// prompt fails silently / returns false. Also, showing the permission
// dialog from an action popup often closes the popup; callers should
// prefer requesting from a full tab, or tell the user to retry Scan.

import { isExtension } from '@/env'

/** Build a match pattern (`https://host/*`) from an absolute origin URL. */
export function originMatchPattern(originUrl) {
  if (typeof originUrl !== 'string' || !originUrl.trim()) return null
  try {
    const u = new URL(originUrl.trim())
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    return `${u.origin}/*`
  } catch {
    return null
  }
}

/**
 * Patterns to request for an Author origin. Exact host always; Cloud AEM
 * also requests the wildcard so one grant covers every author env.
 */
export function originMatchPatterns(originUrl) {
  const exact = originMatchPattern(originUrl)
  if (!exact) return []
  const patterns = [exact]
  try {
    const host = new URL(originUrl.trim()).hostname.toLowerCase()
    if (host.endsWith('.adobeaemcloud.com')) {
      patterns.push('https://*.adobeaemcloud.com/*')
    }
  } catch {
    // ignore
  }
  return patterns
}

/** Silent check — safe to await; does not need a user gesture. */
export async function hasUrlOriginPermission(originUrl) {
  const patterns = originMatchPatterns(originUrl)
  if (patterns.length === 0) return false
  if (!isExtension() || typeof chrome === 'undefined' || !chrome?.permissions) {
    return false
  }
  try {
    return await chrome.permissions.contains({ origins: patterns })
  } catch {
    return false
  }
}

/**
 * Ensure the extension has host access for `originUrl`.
 * Call this as the first await in a click handler (no prior awaits).
 * Returns true when already granted or newly granted.
 */
export async function ensureUrlOriginPermission(originUrl) {
  const patterns = originMatchPatterns(originUrl)
  if (patterns.length === 0) return false
  if (!isExtension() || typeof chrome === 'undefined' || !chrome?.permissions) {
    return false
  }
  try {
    // request() alone: already-granted origins resolve true with no prompt.
    // Do not await contains() first — that breaks the user-gesture chain.
    return await chrome.permissions.request({ origins: patterns })
  } catch (err) {
    console.warn(
      '[loopy] permissions.request failed:',
      patterns,
      err?.message ?? err,
    )
    // Popup may have been torn down mid-prompt; re-check silently.
    try {
      return await chrome.permissions.contains({ origins: patterns })
    } catch {
      return false
    }
  }
}

/**
 * True when this document is the browser-action popup (not a full tab).
 * Permission dialogs from popups usually dismiss the popup.
 */
export async function isExtensionPopup() {
  if (!isExtension() || typeof chrome === 'undefined') return false
  try {
    if (typeof chrome.tabs?.getCurrent !== 'function') return true
    const tab = await chrome.tabs.getCurrent()
    return !tab?.id
  } catch {
    return true
  }
}

/** Open popup.html as a normal tab so permission prompts can complete. */
export async function openExtensionInTab() {
  if (!isExtension() || !chrome?.runtime?.sendMessage) return false
  try {
    await chrome.runtime.sendMessage({ type: 'loopy:open-in-tab' })
    return true
  } catch (err) {
    console.warn('[loopy] open-in-tab failed:', err?.message ?? err)
    return false
  }
}
