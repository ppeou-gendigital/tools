/**
 * Map Firebase AI / Gemini failures to short user-facing messages.
 */
export function mapAiError(err) {
  const raw = String(err?.message || err || 'AI request failed')
  const lower = raw.toLowerCase()

  if (
    lower.includes('app check') ||
    lower.includes('appcheck') ||
    (lower.includes('403') && lower.includes('attestation'))
  ) {
    return 'App Check blocked this request. Register a debug token locally or configure reCAPTCHA for production.'
  }
  if (
    lower.includes('resource-exhausted') ||
    lower.includes('429') ||
    lower.includes('quota') ||
    lower.includes('rate limit') ||
    lower.includes('rate-limit')
  ) {
    return 'AI rate limit reached. Wait a moment and try again.'
  }
  if (
    lower.includes('invalid_argument') ||
    lower.includes('invalid json payload') ||
    lower.includes('unknown name')
  ) {
    return 'AI request schema was rejected. Try again, or check the model/schema config.'
  }
  if (
    lower.includes('safety') ||
    lower.includes('blocked') ||
    lower.includes('prohibited')
  ) {
    return 'The model blocked this prompt. Rephrase and try again.'
  }
  if (lower.includes('firebase is not configured') || lower.includes('vite_firebase')) {
    return raw
  }
  if (lower.includes('json') || lower.includes('parse') || lower.includes('schema')) {
    return raw
  }
  return raw.length > 220 ? `${raw.slice(0, 220)}…` : raw
}

export class AiValidationError extends Error {
  constructor(message, { raw } = {}) {
    super(message)
    this.name = 'AiValidationError'
    this.raw = raw
  }
}
