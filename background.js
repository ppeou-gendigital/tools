// Loopy service worker (Manifest V3).
//
// Service workers are event-driven and can be terminated any time Chrome
// isn't running an event handler. Do NOT rely on globals surviving between
// invocations — persist state via chrome.storage instead.

chrome.runtime.onInstalled.addListener((details) => {
  console.log('[loopy] installed:', details.reason);
});

// Falls through to the popup defined in manifest.json. This listener only
// fires if you remove `action.default_popup`, keeping it here as a reference.
chrome.action.onClicked.addListener((tab) => {
  console.log('[loopy] action clicked on tab', tab.id);
});
