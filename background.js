// acceso service worker (Manifest V3).
//
// Service workers are event-driven and can be terminated any time Chrome
// isn't running an event handler. Do NOT rely on globals surviving between
// invocations — persist state via chrome.storage instead.
//
// This is a minimal starter. Layer your own listeners
// (chrome.webNavigation, chrome.tabs, chrome.alarms, etc.) on top as your
// tool grows. See the loopy branch for a full-featured example that adds
// URL capture and a debounced Supabase sync.

console.log('[acceso] service worker booted')

// Fires once per install/update. Handy for one-shot migrations or
// setting default chrome.storage values.
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[acceso] onInstalled:', details.reason)
})

// Simple message router. The popup can `chrome.runtime.sendMessage(...)`
// to trigger background work (e.g. long-running fetches, cross-tab sync).
// Return `true` from the handler to keep the message channel open for an
// async `sendResponse`.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message !== 'object') return false

  switch (message.type) {
    case 'acceso:ping':
      sendResponse({ ok: true, at: new Date().toISOString() })
      return false

    default:
      return false
  }
})
