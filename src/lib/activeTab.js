// Small helpers for reading the browser tab that owns the popup.
//
// In Chrome, `chrome.tabs.query({ active: true, currentWindow: true })` from
// an extension popup returns the active tab of the browser window that
// spawned the popup — i.e. the tab the user was looking at when they clicked
// the toolbar icon. This is exactly the URL Loopy wants to seed its input
// with on open.

// Read the active tab's URL, or `null` if we can't (no permission, no
// `chrome.tabs`, non-extension surface, or an error thrown by the API).
//
// Two-stage resolver:
//
//   1. chrome.tabs.query — Chrome's tab record. Fast, no page-context
//      access, but reports the URL of the last **committed HTTP
//      navigation**, not the URL currently in the address bar. Apps that
//      use `history.pushState` (AEM's classic authoring UI, most SPAs)
//      will therefore report a stale/bare origin here.
//   2. chrome.scripting.executeScript — injects a tiny function into the
//      page and reads `location.href` from the page's own JS context.
//      This is the URL the user actually sees. We only fall through to
//      it when the tab query returned a "bare" URL (empty path or just
//      `/`) so the common case stays a single API call.
//
// The scripting call requires the `scripting` manifest permission plus
// either host access to the tab's origin or an `activeTab` grant (which
// is implicit when the user clicks the toolbar icon).
export async function readActiveTabUrl() {
  if (typeof chrome === 'undefined' || !chrome?.tabs?.query) return null

  const tab = await findActiveTab()
  if (!tab) return null

  const fromTabsApi = pickUrl(tab.url) ?? pickUrl(tab.pendingUrl)
  // If the tab record already includes a real path, trust it. Cheaper
  // than a scripting round-trip and avoids the permission surface where
  // possible.
  if (fromTabsApi && urlDepth(fromTabsApi) > 0) {
    console.debug('[loopy] active tab (from tabs.query):', fromTabsApi)
    return fromTabsApi
  }

  const fromPage = await readLocationFromPage(tab.id)
  if (fromPage) {
    console.debug('[loopy] active tab (from scripting):', fromPage)
    return fromPage
  }

  // Last resort: whatever tabs.query gave us, even if bare.
  console.debug('[loopy] active tab (fallback bare url):', fromTabsApi)
  return fromTabsApi
}

// Find the currently active tab across a couple of query strategies so
// multi-window setups (or DevTools-as-window edge cases) still resolve
// to a real browser tab.
async function findActiveTab() {
  const candidates = [
    await queryTab({ active: true, currentWindow: true }),
    await queryTab({ active: true, lastFocusedWindow: true }),
  ]
  // First non-null tab wins. If we later need smarter tie-breaking
  // (e.g. prefer the one whose URL has a real path), plug it in here.
  return candidates.find(Boolean) ?? null
}

async function queryTab(criteria) {
  try {
    const tabs = await chrome.tabs.query(criteria)
    return tabs?.[0] ?? null
  } catch (err) {
    console.warn('[loopy] tabs.query failed:', criteria, err?.message ?? err)
    return null
  }
}

// Inject a one-liner into the page's main world and read location.href.
// Handles the AEM / SPA case where tab.url is a stale bare origin but
// the address bar (and location.href) show the current pushState URL.
async function readLocationFromPage(tabId) {
  if (typeof tabId !== 'number') return null
  if (!chrome?.scripting?.executeScript) return null
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      // Function is serialized into the page — no closures over the
      // extension context. Keeps it a pure "read window.location.href".
      func: () => window.location.href,
    })
    const value = results?.[0]?.result
    return pickUrl(value)
  } catch (err) {
    // Common failure modes: no host permission for chrome:// pages,
    // Chrome Web Store, PDF viewer, extension pages. All expected;
    // fall back to whatever tabs.query gave us.
    console.debug(
      '[loopy] scripting.executeScript unavailable:',
      err?.message ?? err,
    )
    return null
  }
}

function pickUrl(v) {
  if (typeof v !== 'string') return null
  const trimmed = v.trim()
  return trimmed.length > 0 ? trimmed : null
}

// A very rough "how much URL is here" score. Full URLs with a path or
// search score higher than bare origins, so the resolver can decide
// whether the tabs.query answer is worth trusting.
function urlDepth(u) {
  try {
    const p = new URL(u)
    return (
      (p.pathname && p.pathname !== '/' ? p.pathname.length : 0) +
      p.search.length +
      p.hash.length
    )
  } catch {
    return 0
  }
}

// True for URLs Loopy can actually parse as an AEM target. Internal Chrome
// surfaces (chrome://, chrome-extension://, about:, view-source:, file:, …)
// are skipped so the popup doesn't try to parse "chrome://newtab" as an AEM
// URL and land in an error state.
export function isJumpableUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url)
}

// Navigate the active tab to `url`. Symmetric writer to `readActiveTabUrl`
// above: uses the same tab-finding strategy so multi-window setups resolve
// to the tab that spawned the popup. Returns true on success, false when
// there's no chrome.tabs, no tab, or the update call rejects.
//
// Only http(s) targets are honored. chrome://, file://, etc. are refused
// so a stray click can't yank the user out of a real tab into an internal
// surface.
export async function writeActiveTabUrl(url) {
  if (typeof chrome === 'undefined' || !chrome?.tabs?.update) return false
  if (!isJumpableUrl(url)) return false
  const tab = await findActiveTab()
  if (!tab?.id) return false
  try {
    await chrome.tabs.update(tab.id, { url })
    return true
  } catch (err) {
    console.warn('[loopy] tabs.update failed:', err?.message ?? err)
    return false
  }
}
