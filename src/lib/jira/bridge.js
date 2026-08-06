import runnerScript from 'jira-runner-script'
import { BRIDGE_PORT_NAME, JIRA_TAB_URL_PATTERN } from './config'

const listeners = new Map()

let port = null
let injectPromise = null

function notify(type, detail) {
  const set = listeners.get(type)
  if (!set) return
  for (const cb of set) {
    try {
      cb({ detail })
    } catch (err) {
      console.error('[jira-bridge] listener error', err)
    }
  }
}

export function onBridgeMessage(type, callback) {
  if (!listeners.has(type)) listeners.set(type, new Set())
  listeners.get(type).add(callback)
  return () => listeners.get(type)?.delete(callback)
}

export function broadcastBridge(type, detail) {
  if (!port) {
    console.warn('[jira-bridge] no port; message dropped', type)
    return false
  }
  port.postMessage({ type, detail })
  return true
}

async function findJiraTab() {
  if (typeof chrome === 'undefined' || !chrome.tabs?.query) return null
  // Prefer the focused Jira tab; never fall back to a non-Jira page (that
  // yields cross-origin fetches without the user's Jira session → 401).
  const matched = await chrome.tabs.query({ url: JIRA_TAB_URL_PATTERN })
  if (!matched.length) return null
  const active = matched.find((t) => t.active)
  return active || matched[0]
}

function attachPort(nextPort) {
  port = nextPort
  port.onMessage.addListener((msg) => {
    if (!msg?.type) return
    notify(msg.type, msg.detail)
  })
  port.onDisconnect.addListener(() => {
    if (port === nextPort) port = null
  })
}

export async function ensureJiraBridge() {
  if (typeof chrome === 'undefined' || !chrome.runtime) {
    return { ok: false, reason: 'not-extension' }
  }

  if (!injectPromise) {
    injectPromise = (async () => {
      const connectListener = (p) => {
        if (p.name !== BRIDGE_PORT_NAME) return
        attachPort(p)
      }
      chrome.runtime.onConnect.addListener(connectListener)

      if (!runnerScript) {
        return { ok: false, reason: 'no-runner' }
      }
      const tab = await findJiraTab()
      if (!tab?.id) {
        return { ok: false, reason: 'no-tab' }
      }
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: [runnerScript],
      })
      return { ok: true, tabId: tab.id }
    })().catch((err) => {
      injectPromise = null
      throw err
    })
  }

  return injectPromise
}
