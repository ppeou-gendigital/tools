// Extension-side orchestrator for the auto-capture flow. Wraps the
// chrome.tabs + chrome.scripting plumbing so the React page just gets
// a Promise-returning function and a tagged error to switch on.
//
// Only usable from the extension build (popup or MV3 service worker).
// Callers must gate on isExtension() from src/env.js.

import { scanPageForCredentials } from './pageScanner'
import { inferCredentialSite } from './ssoSiteUrl'

// Tagged error so the UI can distinguish "nothing to capture on this
// page" (informational, common) from a real permission / API failure
// (rare, deserves a scarier message).
export class CaptureError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'CaptureError'
    this.code = code
  }
}

const HTTP_RE = /^https?:/i

export async function capturePageCredentials() {
  if (typeof chrome === 'undefined' || !chrome?.tabs || !chrome?.scripting) {
    throw new CaptureError(
      'no-api',
      'Auto-capture is only available in the extension build.',
    )
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  })
  if (!tab?.id) {
    throw new CaptureError('no-tab', 'No active tab.')
  }
  const url = tab.url ?? ''
  if (!HTTP_RE.test(url)) {
    throw new CaptureError(
      'bad-scheme',
      'Auto-capture only works on http(s) pages.',
    )
  }

  let injectionResult
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scanPageForCredentials,
    })
    injectionResult = results?.[0]
  } catch (err) {
    // Most commonly: activeTab hasn't been granted (chrome://, PDF
    // viewer, some restricted origins), or the page navigated away
    // between the tab query and the script injection.
    throw new CaptureError(
      'inject-failed',
      err?.message
        ? `Could not read the page: ${err.message}`
        : 'Could not read the page.',
    )
  }

  const found = injectionResult?.result
  if (!found) {
    throw new CaptureError(
      'no-fields',
      'No login form found on this page.',
    )
  }

  // Prefer relying-party host when the tab is an SSO/IdP page that
  // embeds redirect_uri / returnUrl (e.g. realm.hearstnp.com →
  // houstonchronicle.com). Falls back to the tab origin otherwise.
  const site = inferCredentialSite(url)
  if (!site.hostname) {
    throw new CaptureError('bad-url', 'Active tab has an invalid URL.')
  }

  return {
    url: site.url || url,
    origin: site.origin,
    hostname: site.hostname,
    title: found.docTitle || tab.title || '',
    username: found.username || '',
    password: found.password || '',
  }
}
