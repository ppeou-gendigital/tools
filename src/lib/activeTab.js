// Tiny helper around chrome.tabs.query for the popup's "what page is
// the user actually looking at?" question. Returns null on any error,
// on non-http(s) schemes, or when the extension APIs aren't present
// (web build) — callers can treat null as "don't offer tab-scoped UI".

const HTTP_RE = /^https?:/i

export async function getActiveTabInfo() {
  if (typeof chrome === 'undefined' || !chrome?.tabs?.query) return null
  let tab
  try {
    const results = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })
    tab = results?.[0]
  } catch {
    return null
  }
  if (!tab) return null
  const url = tab.url ?? ''
  if (!HTTP_RE.test(url)) return null
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  return {
    tabId: tab.id ?? null,
    url,
    origin: parsed.origin,
    hostname: parsed.hostname.toLowerCase(),
    title: tab.title ?? '',
  }
}
