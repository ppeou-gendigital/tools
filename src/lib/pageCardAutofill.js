// Extension-side orchestrator for credit-card autofill. Mirror of
// pageAutofill.js — writes via pageCardFiller; also exposes a
// payment-form presence probe for the ambient toolbar button.
//
// Uses `allFrames: true` so checkout forms hosted in iframes are
// detected. Fill probes every frame, then writes into only the best
// match so card data is not sprayed into unrelated iframes.

import { fillPageCreditCard } from './pageCardFiller'
import {
  pageHasPaymentForm,
  scanPageForCreditCard,
} from './pageCardScanner'

export class CardAutofillError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'CardAutofillError'
    this.code = code
  }
}

const HTTP_RE = /^https?:/i

const SCORE_FIELDS = [
  'cardholderName',
  'cardNumber',
  'expMonth',
  'expYear',
  'cvv',
  'billingZip',
]

// Pick the frame whose scanner found a card-number field. Prefer
// frames that already have values filled in (partial checkout), then
// the lowest frameId (main frame wins ties).
function pickBestPaymentFrame(results) {
  const candidates = (results ?? []).filter((r) => r?.result)
  if (candidates.length === 0) return null
  candidates.sort((a, b) => {
    const score = (x) =>
      SCORE_FIELDS.reduce((n, k) => n + (x.result[k] ? 1 : 0), 0)
    const d = score(b) - score(a)
    if (d !== 0) return d
    return a.frameId - b.frameId
  })
  return candidates[0]
}

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
      target: { tabId: tab.id, allFrames: true },
      func: pageHasPaymentForm,
    })
    return (results ?? []).some((r) => Boolean(r?.result))
  } catch {
    return false
  }
}

export async function autofillActiveTabCreditCard(card) {
  const tab = await getHttpTab()

  let res
  try {
    const scans = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: scanPageForCreditCard,
    })
    const best = pickBestPaymentFrame(scans)
    if (!best) {
      throw new CardAutofillError(
        'no-fields',
        'No payment form found on this page.',
      )
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id, frameIds: [best.frameId] },
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
    res = results?.[0]?.result ?? { matched: false }
  } catch (err) {
    if (err instanceof CardAutofillError) throw err
    throw new CardAutofillError(
      'inject-failed',
      err?.message
        ? `Could not fill this page: ${err.message}`
        : 'Could not fill this page.',
    )
  }

  if (!res.matched) {
    throw new CardAutofillError(
      'no-fields',
      'No payment form found on this page.',
    )
  }
  return res
}
