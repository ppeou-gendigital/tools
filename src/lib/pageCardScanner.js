// Self-contained page-context scanner for payment / checkout forms.
// Injected via chrome.scripting.executeScript({ func }), so this
// function CANNOT import anything or close over app state — it is
// serialized and re-parsed inside the target page.
//
// Returns a captured field bag + docTitle, or null if no plausible
// card-number field was found. Never throws.
export function scanPageForCreditCard() {
  try {
    function isVisible(el) {
      if (!el) return false
      if (el.disabled) return false
      if (el.type === 'hidden') return false
      if (el.offsetParent === null) {
        const rects = el.getClientRects()
        if (rects.length === 0) return false
      }
      const style = window.getComputedStyle(el)
      if (style.visibility === 'hidden' || style.display === 'none') return false
      return true
    }

    function attrs(el) {
      const ac = (el.getAttribute('autocomplete') || '').toLowerCase()
      const name = (el.getAttribute('name') || '').toLowerCase()
      const id = (el.getAttribute('id') || '').toLowerCase()
      const placeholder = (el.getAttribute('placeholder') || '').toLowerCase()
      const aria = (el.getAttribute('aria-label') || '').toLowerCase()
      const joined = `${ac} ${name} ${id} ${placeholder} ${aria}`
      return { ac, name, id, placeholder, aria, joined }
    }

    function scoreNumber(el) {
      const { ac, joined } = attrs(el)
      if (ac === 'cc-number') return 0
      if (/cc[-_]?num|card[-_]?num|cardnumber|credit[-_]?card/.test(joined)) return 1
      return 10
    }

    function scoreName(el) {
      const { ac, joined } = attrs(el)
      if (ac === 'cc-name' || ac === 'cc-given-name' || ac === 'cc-family-name') return 0
      if (/cardholder|card[-_]?name|name[-_]?on[-_]?card|cc[-_]?name/.test(joined)) return 1
      return 10
    }

    function scoreCvv(el) {
      const { ac, joined } = attrs(el)
      if (ac === 'cc-csc' || ac === 'cc-cid') return 0
      if (/\bcvv\b|\bcvc\b|\bcsc\b|security[-_]?code|card[-_]?code/.test(joined)) return 1
      return 10
    }

    function scoreExpMonth(el) {
      const { ac, joined } = attrs(el)
      if (ac === 'cc-exp-month') return 0
      if (/exp.*month|cc[-_]?month|card[-_]?month/.test(joined)) return 1
      return 10
    }

    function scoreExpYear(el) {
      const { ac, joined } = attrs(el)
      if (ac === 'cc-exp-year') return 0
      if (/exp.*year|cc[-_]?year|card[-_]?year/.test(joined)) return 1
      return 10
    }

    function scoreExpCombined(el) {
      const { ac, joined } = attrs(el)
      if (ac === 'cc-exp') return 0
      if (/expir|cc[-_]?exp|card[-_]?exp/.test(joined) && !/month|year/.test(joined)) return 1
      return 10
    }

    function scoreZip(el) {
      const { ac, joined } = attrs(el)
      if (ac === 'postal-code' || ac === 'billing postal-code') return 0
      if (/billing.*(zip|postal)|postal.*code|zip[-_]?code/.test(joined)) return 1
      return 10
    }

    function pickBest(candidates, scoreFn) {
      const scored = candidates
        .map((el) => ({ el, score: scoreFn(el) }))
        .filter((x) => x.score < 10)
        .sort((a, b) => a.score - b.score)
      return scored[0]?.el ?? null
    }

    function readValue(el) {
      if (!el) return ''
      if (el.tagName === 'SELECT') {
        const opt = el.options?.[el.selectedIndex]
        return (opt?.value || opt?.text || '').trim()
      }
      return String(el.value || '').trim()
    }

    function parseCombinedExpiry(raw) {
      const s = String(raw || '').trim()
      if (!s) return { month: '', year: '' }
      const m = s.match(/^(\d{1,2})\s*[/.-]\s*(\d{2}|\d{4})$/)
      if (!m) return { month: '', year: '' }
      return { month: m[1].padStart(2, '0'), year: m[2] }
    }

    const inputs = Array.from(
      document.querySelectorAll('input, select'),
    ).filter(isVisible)

    const numberEl = pickBest(inputs, scoreNumber)
    if (!numberEl) return null

    const nameEl = pickBest(inputs, scoreName)
    const cvvEl = pickBest(inputs, scoreCvv)
    const monthEl = pickBest(inputs, scoreExpMonth)
    const yearEl = pickBest(inputs, scoreExpYear)
    const expEl = pickBest(inputs, scoreExpCombined)
    const zipEl = pickBest(inputs, scoreZip)

    let expMonth = readValue(monthEl)
    let expYear = readValue(yearEl)
    if ((!expMonth || !expYear) && expEl) {
      const parsed = parseCombinedExpiry(readValue(expEl))
      if (!expMonth) expMonth = parsed.month
      if (!expYear) expYear = parsed.year
    }

    return {
      cardholderName: readValue(nameEl),
      cardNumber: readValue(numberEl).replace(/\D+/g, ''),
      expMonth,
      expYear,
      cvv: readValue(cvvEl).replace(/\D+/g, ''),
      billingZip: readValue(zipEl),
      docTitle: document.title || '',
    }
  } catch {
    return null
  }
}

// Lightweight presence check used by the ambient Fill-card toolbar
// button. Same inject constraints as scanPageForCreditCard.
export function pageHasPaymentForm() {
  try {
    function isVisible(el) {
      if (!el) return false
      if (el.disabled) return false
      if (el.type === 'hidden') return false
      if (el.offsetParent === null) {
        const rects = el.getClientRects()
        if (rects.length === 0) return false
      }
      const style = window.getComputedStyle(el)
      if (style.visibility === 'hidden' || style.display === 'none') return false
      return true
    }

    const inputs = Array.from(document.querySelectorAll('input, select')).filter(
      isVisible,
    )
    for (const el of inputs) {
      const ac = (el.getAttribute('autocomplete') || '').toLowerCase()
      if (ac === 'cc-number' || ac === 'cc-csc' || ac === 'cc-exp' || ac === 'cc-exp-month') {
        return true
      }
      const joined = [
        ac,
        el.getAttribute('name') || '',
        el.getAttribute('id') || '',
        el.getAttribute('placeholder') || '',
        el.getAttribute('aria-label') || '',
      ]
        .join(' ')
        .toLowerCase()
      if (/cc[-_]?num|card[-_]?num|cardnumber|credit[-_]?card|\bcvv\b|\bcvc\b/.test(joined)) {
        return true
      }
    }
    return false
  } catch {
    return false
  }
}
