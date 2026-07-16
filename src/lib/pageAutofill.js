// Extension-side orchestrator for the autofill flow. Mirror of
// src/lib/pageCapture.js — same tab query + http(s) guard + script
// injection, but writing values in via pageFiller instead of reading
// them out via pageScanner.

import { fillPageCredentials } from './pageFiller'

export class AutofillError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'AutofillError'
    this.code = code
  }
}

const HTTP_RE = /^https?:/i

// Fills the active tab's login form with the given username +
// password. Returns the injection result so the caller can flash a
// success / "didn't find fields" state.
export async function autofillActiveTab({ username, password }) {
  if (typeof chrome === 'undefined' || !chrome?.tabs || !chrome?.scripting) {
    throw new AutofillError(
      'no-api',
      'Autofill is only available in the extension build.',
    )
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  })
  if (!tab?.id) throw new AutofillError('no-tab', 'No active tab.')

  const url = tab.url ?? ''
  if (!HTTP_RE.test(url)) {
    throw new AutofillError(
      'bad-scheme',
      'Autofill only works on http(s) pages.',
    )
  }

  let injectionResult
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: fillPageCredentials,
      args: [{ username: username ?? '', password: password ?? '' }],
    })
    injectionResult = results?.[0]
  } catch (err) {
    // Same failure modes as capture: activeTab not granted, tab
    // restricted (chrome://, PDF viewer), or race with navigation.
    throw new AutofillError(
      'inject-failed',
      err?.message
        ? `Could not fill this page: ${err.message}`
        : 'Could not fill this page.',
    )
  }

  const res = injectionResult?.result ?? {
    matched: false,
    filledUsername: false,
    filledPassword: false,
  }
  if (!res.matched) {
    throw new AutofillError(
      'no-fields',
      'No login form found on this page.',
    )
  }
  return res
}
