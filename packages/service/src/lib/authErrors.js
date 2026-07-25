/**
 * Turn Supabase Auth errors into user-facing copy.
 * OTP 500s often look like `{ message: "{}" }` in the client even when the
 * HTTP body is `{ msg: "Error sending confirmation email", ... }`.
 */

function looksEmpty(message) {
  if (message == null) return true
  const s = String(message).trim()
  return !s || s === '{}' || s === 'null' || s === '[object Object]'
}

function pickRawMessage(err) {
  for (const key of ['message', 'msg', 'error_description', 'error']) {
    const v = err?.[key]
    if (typeof v === 'string' && !looksEmpty(v)) return v
  }
  return null
}

const EMAIL_SEND_HINT =
  'Could not send the login email. In Supabase → Authentication → Emails, ' +
  'enable the email provider (or fix custom SMTP), then try again.'

export function formatAuthError(err, fallback) {
  if (!err) return fallback

  const status = err.status ?? err.statusCode
  const code = err.code ?? err.error_code
  const raw = pickRawMessage(err)
  const lower = (raw || '').toLowerCase()

  if (status === 429 || code === 'over_email_send_rate_limit') {
    return 'Too many codes requested. Wait a minute and try again.'
  }

  if (status === 422 || code === 'validation_failed') {
    return 'That email address looks invalid. Check it and try again.'
  }

  if (
    lower.includes('sending confirmation email') ||
    lower.includes('error sending') ||
    status === 500 ||
    code === 'unexpected_failure' ||
    looksEmpty(raw)
  ) {
    return EMAIL_SEND_HINT
  }

  if (raw) return raw
  return fallback
}
