// Content script entry. Runs only on the Jira host, so every request it makes
// carries that tab's session. Responds to the popup through chrome.tabs
// messaging.

import { MESSAGE, RUNNER_SOURCE } from '../protocol.js'
import { handle } from './handlers.js'

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
}
