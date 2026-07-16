// Extension-side orchestrator for credit-card autofill. Mirror of
// pageAutofill.js — writes via pageCardFiller; also exposes a
// payment-form presence probe for the ambient toolbar button.

import { fillPageCreditCard } from './pageCardFiller'
import { pageHasPaymentForm } from './pageCardScanner'

export class CardAutofillError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'CardAutofillError'
    this.code = code
  }
}

const HTTP_RE = /^https?:/i

async function getHttpTab() {
  if (typeof chrome === 'undefined' || !chrome?.tabs || !chrome?.scripting) {
    throw new CardAutofillError(
      'no-api',
      'Autofill is only available in the extension build.',
    )
  }
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  })
  if (!tab?.id) throw new CardAutofillError('no-tab', 'No active tab.')
  const url = tab.url ?? ''
  if (!HTTP_RE.test(url)) {
    throw new CardAutofillError(
      'bad-scheme',
      'Autofill only works on http(s) pages.',
    )
  }
  return tab
}

// Returns true when the active tab looks like a checkout / payment
// form. Soft-fails to false on any inject or API error so the
// toolbar button simply stays hidden.
export async function activeTabHasPaymentForm() {
  try {
    if (typeof chrome === 'undefined' || !chrome?.tabs || !chrome?.scripting) {
      return false
    }
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })
    if (!tab?.id) return false
    const url = tab.url ?? ''
    if (!HTTP_RE.test(url)) return false
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: pageHasPaymentForm,
    })
    return Boolean(results?.[0]?.result)
  } catch {
    return false
  }
}

export async function autofillActiveTabCreditCard(card) {
  const tab = await getHttpTab()

  let injectionResult
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: fillPageCreditCard,
      args: [
        {
          cardholderName: card?.cardholderName ?? '',
          cardNumber: card?.cardNumber ?? '',
          expMonth: card?.expMonth ?? '',
          expYear: card?.expYear ?? '',
          cvv: card?.cvv ?? '',
          billingZip: card?.billingZip ?? '',
        },
      ],
    })
    injectionResult = results?.[0]
  } catch (err) {
    throw new CardAutofillError(
      'inject-failed',
      err?.message
        ? `Could not fill this page: ${err.message}`
        : 'Could not fill this page.',
    )
  }

  const res = injectionResult?.result ?? { matched: false }
  if (!res.matched) {
    throw new CardAutofillError(
      'no-fields',
      'No payment form found on this page.',
    )
  }
  return res
}
