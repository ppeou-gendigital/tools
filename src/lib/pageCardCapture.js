// Extension-side orchestrator for credit-card capture. Mirror of
// pageCapture.js — tab query + http(s) guard + inject scanner.
//
// Injects into every frame (`allFrames: true`) because checkout UIs
// often host the card form in an iframe (merchant or PSP). Cross-
// origin hosted fields that block injection still won't be readable;
// same-origin / injectable frames will.

import { scanPageForCreditCard } from './pageCardScanner'

export class CardCaptureError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'CardCaptureError'
    this.code = code
  }
}

const HTTP_RE = /^https?:/i

const CAPTURE_FIELDS = [
  'cardholderName',
  'cardNumber',
  'expMonth',
  'expYear',
  'cvv',
  'billingZip',
]

// Prefer the frame whose scan returned a card number and the most
// populated sibling fields (number alone beats a richer empty frame).
function pickBestCardCapture(results) {
  const candidates = (results ?? [])
    .map((r) => r?.result)
    .filter((r) => r?.cardNumber)
  if (candidates.length === 0) return null
  candidates.sort((a, b) => {
    const score = (x) => CAPTURE_FIELDS.reduce((n, k) => n + (x[k] ? 1 : 0), 0)
    return score(b) - score(a)
  })
  return candidates[0]
}

export async function capturePageCreditCard() {
  if (typeof chrome === 'undefined' || !chrome?.tabs || !chrome?.scripting) {
    throw new CardCaptureError(
      'no-api',
      'Auto-capture is only available in the extension build.',
    )
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  })
  if (!tab?.id) {
    throw new CardCaptureError('no-tab', 'No active tab.')
  }
  const url = tab.url ?? ''
  if (!HTTP_RE.test(url)) {
    throw new CardCaptureError(
      'bad-scheme',
      'Auto-capture only works on http(s) pages.',
    )
  }

  let found
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: scanPageForCreditCard,
    })
    found = pickBestCardCapture(results)
  } catch (err) {
    throw new CardCaptureError(
      'inject-failed',
      err?.message
        ? `Could not read the page: ${err.message}`
        : 'Could not read the page.',
    )
  }

  if (!found || !found.cardNumber) {
    throw new CardCaptureError(
      'no-fields',
      'No payment form found on this page.',
    )
  }

  let parsedUrl
  try {
    parsedUrl = new URL(url)
  } catch {
    throw new CardCaptureError('bad-url', 'Active tab has an invalid URL.')
  }

  return {
    url,
    origin: parsedUrl.origin,
    hostname: parsedUrl.hostname,
    title: found.docTitle || tab.title || '',
    cardholderName: found.cardholderName || '',
    cardNumber: found.cardNumber || '',
    expMonth: found.expMonth || '',
    expYear: found.expYear || '',
    cvv: found.cvv || '',
    billingZip: found.billingZip || '',
  }
}
