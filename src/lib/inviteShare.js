/**
 * Native invite sharing helpers (mailto / sms / Web Share).
 * No server-side email or SMS — opens the user's own apps.
 */

export function buildInviteMessage(journeyTitle, url) {
  const title = (journeyTitle || 'a journey').trim()
  return `You're invited to join "${title}" on Viaggio.\n\n${url}`
}

export function buildInviteSubject(journeyTitle) {
  const title = (journeyTitle || 'a journey').trim()
  return `Join me on Viaggio: ${title}`
}

/** Open the system mail client with optional To + prefilled body. */
export function mailtoInvite({ email, journeyTitle, url }) {
  const subject = encodeURIComponent(buildInviteSubject(journeyTitle))
  const body = encodeURIComponent(buildInviteMessage(journeyTitle, url))
  const to = String(email || '')
    .trim()
    .replace(/\s+/g, '')
  const href = to
    ? `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`
    : `mailto:?subject=${subject}&body=${body}`
  window.location.href = href
}

/**
 * Open Messages with optional phone + body.
 * iOS prefers sms:phone&body= ; Android sms:phone?body=
 */
export function smsInvite({ phone, journeyTitle, url }) {
  const body = encodeURIComponent(buildInviteMessage(journeyTitle, url))
  const digits = String(phone || '').trim().replace(/[^\d+]/g, '')
  const isIOS =
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent)

  let href
  if (digits) {
    href = isIOS
      ? `sms:${digits}&body=${body}`
      : `sms:${digits}?body=${body}`
  } else {
    href = isIOS ? `sms:&body=${body}` : `sms:?body=${body}`
  }
  window.location.href = href
}

export function canNativeShare() {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function'
  )
}

/**
 * System share sheet. Returns true if share was invoked (including user cancel).
 * Returns false if Web Share is unavailable.
 */
export async function nativeShareInvite({ journeyTitle, url }) {
  if (!canNativeShare()) return false
  const title = buildInviteSubject(journeyTitle)
  const text = buildInviteMessage(journeyTitle, url)
  try {
    await navigator.share({ title, text, url })
    return true
  } catch (err) {
    // User dismissed the sheet — treat as handled, not an error.
    if (err?.name === 'AbortError') return true
    throw err
  }
}
