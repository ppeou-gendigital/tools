// Small helpers for reading the browser tab that owns the popup.
//
// In Chrome, `chrome.tabs.query({ active: true, currentWindow: true })` from
// an extension popup returns the active tab of the browser window that
// spawned the popup — i.e. the tab the user was looking at when they clicked
// the toolbar icon. This is exactly the URL Loopy wants to seed its input
// with on open.

// Read the active tab's URL, or `null` if we can't (no permission, no
// `chrome.tabs`, non-extension surface, or an error thrown by the API).
export async function readActiveTabUrl() {
  try {
    if (typeof chrome === 'undefined' || !chrome?.tabs?.query) return null
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    return tabs?.[0]?.url ?? null
  } catch (err) {
    console.warn('[loopy] could not read active tab:', err?.message ?? err)
    return null
  }
}

// True for URLs Loopy can actually parse as an AEM target. Internal Chrome
// surfaces (chrome://, chrome-extension://, about:, view-source:, file:, …)
// are skipped so the popup doesn't try to parse "chrome://newtab" as an AEM
// URL and land in an error state.
export function isJumpableUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url)
}
