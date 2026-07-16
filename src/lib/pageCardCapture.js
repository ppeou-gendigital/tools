// Extension-side orchestrator for credit-card capture. Mirror of
// pageCapture.js — tab query + http(s) guard + inject scanner.

import { scanPageForCreditCard } from './pageCardScanner'

export class CardCaptureError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'CardCaptureError'
    this.code = code
  }
}

const HTTP_RE = /^https?:/i

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

  let injectionResult
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scanPageForCreditCard,
    })
    injectionResult = results?.[0]
  } catch (err) {
    throw new CardCaptureError(
      'inject-failed',
      err?.message
        ? `Could not read the page: ${err.message}`
        : 'Could not read the page.',
    )
  }

  const found = injectionResult?.result
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
