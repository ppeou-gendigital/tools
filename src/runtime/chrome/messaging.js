// Popup side of the runner protocol: one request, one response, a timeout, and
// a single retry after re-injecting the content script when the tab was loaded
// before the extension was installed or reloaded.

import { RUNNER_SOURCE } from '../protocol.js'

const DEFAULT_TIMEOUT = 45_000

export class RunnerError extends Error {
  constructor(message, code = 'error') {
    super(message)
    this.name = 'RunnerError'
    this.code = code
  }
}

function send(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      const lastError = chrome.runtime.lastError
      if (lastError) {
        reject(new RunnerError(lastError.message, 'no-connection'))
        return
      }
      resolve(response)
    })
  })
}

function withTimeout(promise, timeout, type) {
  let timer
  const guard = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new RunnerError(`"${type}" timed out after ${timeout} ms.`, 'timeout'))
    }, timeout)
  })

  return Promise.race([promise, guard]).finally(() => clearTimeout(timer))
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// The content script is a crxjs loader chunk: injecting it returns before the
// real module has registered its listener. Poll briefly instead of failing on
// the first "receiving end does not exist".
async function requestWithRetry(tabId, type, payload) {
  let lastError
  for (const delay of [0, 100, 250, 500, 1000, 1500]) {
    if (delay > 0) await wait(delay)
    try {
      return await request(tabId, type, payload)
    } catch (error) {
      if (error.code !== 'no-connection') throw error
      lastError = error
    }
  }
  throw new RunnerError(
    'Could not reach the Jira helper. Reload the Jira tab and try again.',
    'no-connection',
  )
}

async function request(tabId, type, payload) {
  const response = await send(tabId, {
    source: RUNNER_SOURCE,
    type,
    payload,
  })

  if (!response) {
    throw new RunnerError('The Jira tab did not answer.', 'no-response')
  }
  if (!response.ok) {
    throw new RunnerError(
      response.error?.message ?? 'Jira request failed.',
      response.error?.code ?? 'error',
    )
  }
  return response.data
}

async function injectRunner(tabId) {
  if (!chrome.scripting?.executeScript) {
    throw new RunnerError(
      'Reload the Jira tab so the extension helper can run.',
      'no-connection',
    )
  }

  const files = chrome.runtime.getManifest().content_scripts?.[0]?.js ?? []
  if (files.length === 0) {
    throw new RunnerError(
      'The extension is missing its Jira helper. Reinstall it.',
      'no-connection',
    )
  }

  try {
    await chrome.scripting.executeScript({ target: { tabId }, files })
  } catch (error) {
    // Chrome refuses to inject outside the manifest's host permissions. Say
    // which origin was blocked instead of surfacing the raw API wording, since
    // the usual cause is a tab on a scheme/host the manifest does not list.
    if (/must request permission|Cannot access contents/i.test(error?.message ?? '')) {
      const tab = await chrome.tabs.get(tabId).catch(() => null)
      let origin = 'that tab'
      try {
        origin = new URL(tab?.url ?? '').origin
      } catch {
        // keep the generic label
      }
      throw new RunnerError(
        `Chrome blocked the Jira helper on ${origin}. Reload that tab and try again.`,
        'no-permission',
      )
    }
    throw error
  }
}

export async function callRunner(
  tabId,
  type,
  payload = {},
  { timeout = DEFAULT_TIMEOUT } = {},
) {
  try {
    return await withTimeout(request(tabId, type, payload), timeout, type)
  } catch (error) {
    if (error.code !== 'no-connection') throw error

    await injectRunner(tabId)
    return withTimeout(
      requestWithRetry(tabId, type, payload),
      timeout,
      type,
    )
  }
}
