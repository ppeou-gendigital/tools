import { DATAFEED_TYPES, DATAFEED_VERSION } from '@/lib/datafeed/schema'

/**
 * Build a portable datafeed document from decrypted vault rows.
 * Omits ids / timestamps so the feed is re-importable elsewhere.
 */
export function buildCredentialsFeed(credentials, { exportedAt } = {}) {
  return {
    version: DATAFEED_VERSION,
    type: DATAFEED_TYPES.CREDENTIALS,
    exportedAt: exportedAt ?? new Date().toISOString(),
    items: (credentials ?? [])
      .filter((c) => c && !c.error)
      .map((c) => ({
        displayName: c.displayName ?? '',
        urlOrApp: c.urlOrApp ?? '',
        accounts: Array.isArray(c.accounts)
          ? c.accounts.map((a) => ({
              username: a?.username ?? '',
              password: a?.password ?? '',
            }))
          : [{ username: '', password: '' }],
        notes: c.notes ?? '',
      })),
  }
}

export function buildCreditCardsFeed(cards, { exportedAt } = {}) {
  return {
    version: DATAFEED_VERSION,
    type: DATAFEED_TYPES.CREDIT_CARDS,
    exportedAt: exportedAt ?? new Date().toISOString(),
    items: (cards ?? [])
      .filter((c) => c && !c.error)
      .map((c) => ({
        displayName: c.displayName ?? '',
        cardholderName: c.cardholderName ?? '',
        cardNumber: String(c.cardNumber ?? '').replace(/\D+/g, ''),
        expMonth: c.expMonth ?? '',
        expYear: c.expYear ?? '',
        cvv: c.cvv ?? '',
        issuerBank: c.issuerBank ?? '',
        billingZip: c.billingZip ?? '',
        pin: c.pin ?? '',
        notes: c.notes ?? '',
        isFavorite: Boolean(c.isFavorite),
      })),
  }
}

export function buildVaultFeed(credentials, cards, { exportedAt } = {}) {
  const at = exportedAt ?? new Date().toISOString()
  const credDoc = buildCredentialsFeed(credentials, { exportedAt: at })
  const cardDoc = buildCreditCardsFeed(cards, { exportedAt: at })
  return {
    version: DATAFEED_VERSION,
    type: DATAFEED_TYPES.VAULT,
    exportedAt: at,
    credentials: credDoc.items,
    creditCards: cardDoc.items,
  }
}

export function stringifyDatafeed(doc) {
  return `${JSON.stringify(doc, null, 2)}\n`
}
