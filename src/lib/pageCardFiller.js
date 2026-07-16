// Self-contained page-context filler for payment / checkout forms.
// Injected via chrome.scripting.executeScript({ func, args }).
// Mirror of pageFiller.js field-detection heuristics so a
// scan-then-fill round-trip targets the same inputs.
//
// Contract:
//   args: [{
//     cardholderName, cardNumber, expMonth, expYear, cvv, billingZip
//   }]
//   return { matched, filled: { name, number, expMonth, expYear, cvv, zip } }
export function fillPageCreditCard({
  cardholderName = '',
  cardNumber = '',
  expMonth = '',
  expYear = '',
  cvv = '',
  billingZip = '',
} = {}) {
  try {
    function isVisible(el) {
      if (!el) return false
      if (el.disabled) return false
      if (el.type === 'hidden') return false
      if (el.readOnly) return false
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
      return { ac, joined }
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

    function writeValue(el, value) {
      if (!el || value == null || value === '') return false
      const str = String(value)
      if (el.tagName === 'SELECT') {
        const options = Array.from(el.options || [])
        const match =
          options.find((o) => o.value === str) ||
          options.find((o) => o.value === str.padStart(2, '0')) ||
          options.find((o) => o.text.trim() === str) ||
          options.find((o) => o.value.endsWith(str) || o.text.includes(str))
        if (!match) return false
        el.value = match.value
        el.dispatchEvent(new Event('input', { bubbles: true }))
        el.dispatchEvent(new Event('change', { bubbles: true }))
        return true
      }
      const proto = window.HTMLInputElement.prototype
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
      el.focus()
      if (setter) {
        setter.call(el, str)
      } else {
        el.value = str
      }
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
      el.blur()
      return true
    }

    function formatCombinedExpiry(month, year) {
      const m = String(month || '').trim()
      const y = String(year || '').trim()
      if (!m || !y) return ''
      const mm = m.padStart(2, '0').slice(0, 2)
      const yy = y.length >= 4 ? y.slice(-2) : y
      return `${mm} / ${yy}`
    }

    const inputs = Array.from(
      document.querySelectorAll('input, select'),
    ).filter(isVisible)

    const numberEl = pickBest(inputs, scoreNumber)
    if (!numberEl) {
      return {
        matched: false,
        filled: {
          name: false,
          number: false,
          expMonth: false,
          expYear: false,
          cvv: false,
          zip: false,
        },
      }
    }

    const nameEl = pickBest(inputs, scoreName)
    const cvvEl = pickBest(inputs, scoreCvv)
    const monthEl = pickBest(inputs, scoreExpMonth)
    const yearEl = pickBest(inputs, scoreExpYear)
    const expEl = pickBest(inputs, scoreExpCombined)
    const zipEl = pickBest(inputs, scoreZip)

    const digits = String(cardNumber || '').replace(/\D+/g, '')
    const filled = {
      name: writeValue(nameEl, cardholderName),
      number: writeValue(numberEl, digits),
      expMonth: false,
      expYear: false,
      cvv: writeValue(cvvEl, String(cvv || '').replace(/\D+/g, '')),
      zip: writeValue(zipEl, billingZip),
    }

    filled.expMonth = writeValue(monthEl, expMonth)
    filled.expYear = writeValue(yearEl, expYear)
    if ((!filled.expMonth || !filled.expYear) && expEl) {
      const combined = formatCombinedExpiry(expMonth, expYear)
      if (combined && writeValue(expEl, combined)) {
        filled.expMonth = true
        filled.expYear = true
      }
    }

    return { matched: true, filled }
  } catch {
    return {
      matched: false,
      filled: {
        name: false,
        number: false,
        expMonth: false,
        expYear: false,
        cvv: false,
        zip: false,
      },
    }
  }
}
