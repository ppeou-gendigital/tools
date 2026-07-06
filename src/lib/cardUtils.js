// Pure helpers for the credit-card feature. No React, no async, no
// external deps — safe to import from anywhere (row, edit page,
// list page, unit tests later).
//
// Card brand detection is IIN-prefix based per the well-known ranges.
// This is best-effort: brands occasionally reissue prefixes and we
// don't try to keep up with every co-branded quirk. The output is
// only used for the row icon tint / filter chip — nothing security
// sensitive rides on it, and unknowns fall back to a neutral chip.

// Strip everything that isn't a digit. Users routinely paste numbers
// with spaces or dashes; we normalize once so downstream detection
// doesn't have to.
function digitsOnly(value) {
  return typeof value === 'string' ? value.replace(/\D+/g, '') : ''
}

export function detectBrand(cardNumber) {
  const d = digitsOnly(cardNumber)
  if (!d) return 'unknown'
  if (/^4\d{0,}$/.test(d)) return 'visa'
  if (/^(5[1-5]|2[2-7])\d*$/.test(d)) return 'mastercard'
  if (/^3[47]\d*$/.test(d)) return 'amex'
  if (/^(6011|65|64[4-9]|622)\d*$/.test(d)) return 'discover'
  if (/^35\d*$/.test(d)) return 'jcb'
  if (/^(30[0-5]|3095|36|38|39)\d*$/.test(d)) return 'diners'
  if (/^(62|81)\d*$/.test(d)) return 'unionpay'
  return 'unknown'
}

// Human label for a brand code. Used in the filter chip UI and in
// the "Issuer •••• 1234" fallback when no issuerBank has been set.
export function brandLabel(brand) {
  switch (brand) {
    case 'visa':
      return 'Visa'
    case 'mastercard':
      return 'Mastercard'
    case 'amex':
      return 'Amex'
    case 'discover':
      return 'Discover'
    case 'jcb':
      return 'JCB'
    case 'diners':
      return 'Diners'
    case 'unionpay':
      return 'UnionPay'
    default:
      return 'Card'
  }
}

export function last4(cardNumber) {
  const d = digitsOnly(cardNumber)
  if (d.length < 4) return ''
  return d.slice(-4)
}

// Group the raw number for display in the edit form. Amex uses a
// 4-6-5 layout (15 digits); everything else groups in 4s. We format
// whatever digits are there so the user sees the grouping progress
// as they type without us needing to validate length.
export function formatCardNumber(cardNumber) {
  const d = digitsOnly(cardNumber)
  if (!d) return ''
  const groups =
    detectBrand(d) === 'amex' ? [4, 6, 5] : [4, 4, 4, 4, 4]
  const out = []
  let i = 0
  for (const size of groups) {
    if (i >= d.length) break
    out.push(d.slice(i, i + size))
    i += size
  }
  if (i < d.length) out.push(d.slice(i))
  return out.join(' ')
}

// Row display: shroud everything except the last 4. Bullet grouping
// matches formatCardNumber's grouping so the two are visually
// consistent when placed side-by-side.
export function maskedCardNumber(cardNumber) {
  const d = digitsOnly(cardNumber)
  if (!d) return ''
  const tail = d.slice(-4)
  const head = d.slice(0, -4)
  if (!head) return tail
  const isAmex = detectBrand(d) === 'amex'
  const bulletGroups = isAmex ? [4, 6] : [4, 4, 4]
  let remaining = head.length
  const bulletParts = []
  for (const size of bulletGroups) {
    if (remaining <= 0) break
    const take = Math.min(size, remaining)
    bulletParts.push('•'.repeat(take))
    remaining -= take
  }
  if (remaining > 0) bulletParts.push('•'.repeat(remaining))
  return `${bulletParts.join(' ')} ${tail}`
}

// User-facing label for a card. Precedence:
//   1. Whatever the user typed into "card name"
//   2. "<issuerBank> •••• <last4>" when we have both
//   3. "<brandLabel> •••• <last4>" when we have a number but no bank
//   4. "<issuerBank>" when we only have the bank name
//   5. Neutral "Card" fallback
// Callers pass the decrypted plaintext plus the row's plaintext
// display_name; keeping all three inputs explicit means the same
// helper works from the list, the edit form, and future exports.
export function resolveDisplayName({ displayName, issuerBank, cardNumber }) {
  const trimmedName = typeof displayName === 'string' ? displayName.trim() : ''
  if (trimmedName) return trimmedName
  const bank = typeof issuerBank === 'string' ? issuerBank.trim() : ''
  const tail = last4(cardNumber)
  if (bank && tail) return `${bank} •••• ${tail}`
  if (tail) return `${brandLabel(detectBrand(cardNumber))} •••• ${tail}`
  if (bank) return bank
  return 'Card'
}
