// Accesso vault datafeed v1 — shared constants and normalizers.
// Spec + samples live in /datafeed at the repo root.

export const DATAFEED_VERSION = 1

export const DATAFEED_TYPES = Object.freeze({
  CREDENTIALS: 'credentials',
  CREDIT_CARDS: 'credit_cards',
  VAULT: 'vault',
})

export function isDatafeedType(value) {
  return (
    value === DATAFEED_TYPES.CREDENTIALS ||
    value === DATAFEED_TYPES.CREDIT_CARDS ||
    value === DATAFEED_TYPES.VAULT
  )
}

export function normalizeCredentialItem(raw) {
  const displayName = String(raw?.displayName ?? '').trim()
  const accounts = Array.isArray(raw?.accounts)
    ? raw.accounts
        .map((a) => ({
          username: String(a?.username ?? ''),
          password: String(a?.password ?? ''),
        }))
        .filter((a) => a.username.length > 0 || a.password.length > 0)
    : []
  return {
    displayName,
    urlOrApp: String(raw?.urlOrApp ?? '').trim(),
    accounts:
      accounts.length > 0 ? accounts : [{ username: '', password: '' }],
    notes: String(raw?.notes ?? ''),
  }
}

export function normalizeCreditCardItem(raw) {
  const digits = String(raw?.cardNumber ?? '').replace(/\D+/g, '')
  return {
    displayName: String(raw?.displayName ?? '').trim(),
    cardholderName: String(raw?.cardholderName ?? '').trim(),
    cardNumber: digits,
    expMonth: String(raw?.expMonth ?? '').trim(),
    expYear: String(raw?.expYear ?? '').trim(),
    cvv: String(raw?.cvv ?? '').trim(),
    issuerBank: String(raw?.issuerBank ?? '').trim(),
    billingZip: String(raw?.billingZip ?? '').trim(),
    pin: String(raw?.pin ?? ''),
    notes: String(raw?.notes ?? ''),
    isFavorite: Boolean(raw?.isFavorite),
  }
}

export function validateCredentialItem(item, index) {
  if (!item.displayName) {
    return `credentials[${index}]: displayName is required`
  }
  return null
}

export function validateCreditCardItem(_item, _index) {
  // All card fields are optional at the schema layer (matches the app).
  // Empty cards are still allowed so a feed can reserve a slot.
  return null
}
