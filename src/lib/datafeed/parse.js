import {
  DATAFEED_TYPES,
  DATAFEED_VERSION,
  isDatafeedType,
  normalizeCredentialItem,
  normalizeCreditCardItem,
  validateCredentialItem,
  validateCreditCardItem,
} from '@/lib/datafeed/schema'

/**
 * Parse a JSON string (or already-parsed object) into a normalized
 * datafeed. Throws on envelope errors. Per-item problems are collected
 * in `errors` and those items are omitted from the result.
 *
 * @returns {{
 *   type: string,
 *   version: number,
 *   exportedAt: string | null,
 *   credentials: ReturnType<typeof normalizeCredentialItem>[],
 *   creditCards: ReturnType<typeof normalizeCreditCardItem>[],
 *   errors: string[],
 * }}
 */
export function parseDatafeed(input) {
  let doc = input
  if (typeof input === 'string') {
    try {
      doc = JSON.parse(input)
    } catch {
      throw new Error('Datafeed is not valid JSON')
    }
  }
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    throw new Error('Datafeed must be a JSON object')
  }
  if (doc.version !== DATAFEED_VERSION) {
    throw new Error(
      `Unsupported datafeed version (expected ${DATAFEED_VERSION}, got ${JSON.stringify(doc.version)})`,
    )
  }
  if (!isDatafeedType(doc.type)) {
    throw new Error(
      `Unsupported datafeed type (expected credentials | credit_cards | vault, got ${JSON.stringify(doc.type)})`,
    )
  }

  const errors = []
  let credentials = []
  let creditCards = []

  if (doc.type === DATAFEED_TYPES.CREDENTIALS) {
    credentials = normalizeList(
      doc.items,
      'items',
      normalizeCredentialItem,
      validateCredentialItem,
      errors,
    )
  } else if (doc.type === DATAFEED_TYPES.CREDIT_CARDS) {
    creditCards = normalizeList(
      doc.items,
      'items',
      normalizeCreditCardItem,
      validateCreditCardItem,
      errors,
    )
  } else {
    credentials = normalizeList(
      doc.credentials,
      'credentials',
      normalizeCredentialItem,
      validateCredentialItem,
      errors,
    )
    creditCards = normalizeList(
      doc.creditCards,
      'creditCards',
      normalizeCreditCardItem,
      validateCreditCardItem,
      errors,
    )
  }

  return {
    type: doc.type,
    version: DATAFEED_VERSION,
    exportedAt:
      typeof doc.exportedAt === 'string' && doc.exportedAt
        ? doc.exportedAt
        : null,
    credentials,
    creditCards,
    errors,
  }
}

function normalizeList(raw, label, normalize, validate, errors) {
  if (raw == null) return []
  if (!Array.isArray(raw)) {
    errors.push(`${label} must be an array`)
    return []
  }
  const out = []
  raw.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push(`${label}[${index}]: expected an object`)
      return
    }
    const item = normalize(entry)
    const err = validate(item, index)
    if (err) {
      errors.push(err)
      return
    }
    out.push(item)
  })
  return out
}
