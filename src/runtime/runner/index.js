// Placeholder runner so the manifest's content script resolves while the
// runtime layer is being ported. Replaced by the real message server.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.source !== 'jira-capacity') return false
  if (message.type === 'ping') {
    sendResponse({ ok: true, data: { origin: location.origin } })
    return true
  }
  return false
})
