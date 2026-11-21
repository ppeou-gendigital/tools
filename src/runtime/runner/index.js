// Content script entry. Runs only on the Jira host, so every request it makes
// carries that tab's session. Responds to the popup through chrome.tabs
// messaging.

import { MESSAGE, RUNNER_SOURCE } from '../protocol.js'
import { handle, warmFieldCache } from './handlers.js'

// The popup can re-inject this file when it finds no listener, so guard
// against registering the same listener twice.
const GUARD = '__jiraCapacityRunner'

if (!globalThis[GUARD]) {
  globalThis[GUARD] = true

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.source !== RUNNER_SOURCE) return false

    if (message.type === MESSAGE.PING) {
      sendResponse({
        ok: true,
        data: { origin: location.origin, ready: true },
      })
      return true
    }

    Promise.resolve()
      .then(() => handle(message.type, message.payload))
      .then((data) => sendResponse({ ok: true, data }))
      .catch((error) => {
        sendResponse({
          ok: false,
          error: {
            message: error?.message ?? 'Jira request failed.',
            code: error?.code ?? 'error',
          },
        })
      })

    // Keeps the message channel open for the async response.
    return true
  })

  // Issue types, statuses, and resolutions are searched live through JQL
  // autocomplete, so only the field catalog needs warming. It cannot be
  // searched server-side (~1,600 columns, ~90 KB), so pull it while the tab is
  // idle and the first keystroke in the field picker does not pay for it.
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => warmFieldCache(), { timeout: 10_000 })
  } else {
    setTimeout(() => warmFieldCache(), 2_000)
  }
}
