import { isJiraUrl, originOf } from '../../lib/jira/config.js'
import { callRunner } from './messaging.js'
import { MESSAGE } from '../protocol.js'

export function extensionAvailable() {
  return typeof chrome !== 'undefined' && Boolean(chrome.tabs)
}

export async function getActiveTab() {
  if (!extensionAvailable()) return null
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab ?? null
}

// The extension only works on a logged-in Jira tab: that tab is what executes
// the requests, so anything else is a hard stop rather than a fallback.
export async function resolveJiraTab() {
  if (!extensionAvailable()) {
    return {
      error: 'unavailable',
      message:
        'Chrome extension APIs are not available. Load the built extension from chrome://extensions.',
    }
  }

  const tab = await getActiveTab()
  if (!tab?.url) {
    return { error: 'no-tab', message: 'Could not read the active tab.' }
  }
  if (!isJiraUrl(tab.url)) {
    return {
      error: 'not-jira',
      message: 'Open the extension while a Jira tab is focused.',
      url: tab.url,
    }
  }

  return { tab, origin: originOf(tab.url) }
}

export function pingRunner(tabId) {
  return callRunner(tabId, MESSAGE.PING, {}, { timeout: 5_000 })
}
