/**
 * Native invite sharing helpers (mailto / sms / Web Share).
 * No server-side email or SMS — opens the user's own apps.
 *
 * Pass `appName` so tools get branded copy after init (TOOLNAME → Foo).
 */

export function buildInviteMessage(resourceTitle, url, appName = 'TOOLNAME') {
  const title = (resourceTitle || 'a workspace').trim()
  return `You're invited to join "${title}" on ${appName}.\n\n${url}`
}

export function buildInviteSubject(resourceTitle, appName = 'TOOLNAME') {
  const title = (resourceTitle || 'a workspace').trim()
  return `Join me on ${appName}: ${title}`
}

/** Open the system mail client with optional To + prefilled body. */
export function mailtoInvite({
  email,
  resourceTitle,
  url,
  appName = 'TOOLNAME',
}) {
  const subject = encodeURIComponent(
    buildInviteSubject(resourceTitle, appName),
  )
  const body = encodeURIComponent(
    buildInviteMessage(resourceTitle, url, appName),
  )
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
export function smsInvite({
  phone,
  resourceTitle,
  url,
  appName = 'TOOLNAME',
}) {
  const body = encodeURIComponent(
    buildInviteMessage(resourceTitle, url, appName),
  )
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
export async function nativeShareInvite({
  resourceTitle,
  url,
  appName = 'TOOLNAME',
}) {
  if (!canNativeShare()) return false
  const title = buildInviteSubject(resourceTitle, appName)
  const text = buildInviteMessage(resourceTitle, url, appName)
  try {
    await navigator.share({ title, text, url })
    return true
  } catch (err) {
    if (err?.name === 'AbortError') return true
    throw err
  }
}
