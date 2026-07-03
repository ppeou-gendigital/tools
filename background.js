// Loopy service worker (Manifest V3).
//
// Service workers are event-driven and can be terminated any time Chrome
// isn't running an event handler. Do NOT rely on globals surviving between
// invocations — persist state via chrome.storage instead.

chrome.runtime.onInstalled.addListener((details) => {
  console.log('[loopy] installed:', details.reason)
})

// Optional: "open in full tab" from a message the popup can send. Handy when
// the 400x600 popup feels cramped.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'loopy:open-in-tab') {
    chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') })
    sendResponse({ ok: true })
    return true
  }
  return undefined
})
