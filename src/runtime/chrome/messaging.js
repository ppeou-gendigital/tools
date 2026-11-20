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

  await chrome.scripting.executeScript({ target: { tabId }, files })
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
    return withTimeout(request(tabId, type, payload), timeout, type)
  }
}
