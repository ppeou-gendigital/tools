// Infer the relying-party (site) URL for credentials captured on an
// identity-provider / SSO login page. Many publishers redirect through
// a shared IdP (e.g. realm.hearstnp.com) whose tab hostname is useless
// for later autofill matching on the real site (houstonchronicle.com).
//
// Pure URL parsing — no DOM. Safe to call from the extension popup.

import { hostnameOf } from './urlMatch'

const HTTP_RE = /^https?:/i

function tryParseUrl(raw) {
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  try {
    const withScheme = HTTP_RE.test(trimmed) ? trimmed : `https://${trimmed}`
    return new URL(withScheme)
  } catch {
    return null
  }
}

// Nested OIDC-style returnUrl is often a path + query
// (`/connect/authorize/callback?client_id=...&redirect_uri=...`).
function paramsFromReturnUrl(returnUrl) {
  if (typeof returnUrl !== 'string' || !returnUrl) return null
  try {
    if (HTTP_RE.test(returnUrl)) {
      return new URL(returnUrl).searchParams
    }
    const qIndex = returnUrl.indexOf('?')
    if (qIndex < 0) return null
    return new URLSearchParams(returnUrl.slice(qIndex + 1))
  } catch {
    return null
  }
}

function siteFromHttpUrl(raw, tabHostname) {
  const parsed = tryParseUrl(raw)
  if (!parsed) return null
  const host = parsed.hostname?.toLowerCase()
  if (!host || host === tabHostname) return null
  return {
    url: parsed.href,
    origin: parsed.origin,
    hostname: host,
  }
}

// Hearst-style path segments are URL-safe base64 of tenant/site ids,
// e.g. /aG91c3RvbmNocm9uaWNsZS5jb20=/ → houstonchronicle.com
// Prefer public-looking hostnames over tenant ids like `hdn.houston`.
const COMMON_TLDS = new Set([
  'com',
  'org',
  'net',
  'edu',
  'gov',
  'io',
  'co',
  'us',
  'uk',
  'ca',
  'au',
  'de',
  'fr',
  'jp',
  'info',
  'biz',
  'app',
  'dev',
  'news',
])

function scoreHostname(host) {
  const parts = host.split('.')
  if (parts.length < 2) return -1
  const tld = parts[parts.length - 1]
  let score = parts.length
  if (COMMON_TLDS.has(tld)) score += 10
  // Penalize two-label hosts whose "tld" is a long non-public label
  // (tenant ids like hdn.houston).
  if (parts.length === 2 && tld.length > 3 && !COMMON_TLDS.has(tld)) {
    score -= 5
  }
  return score
}

function siteFromBase64Path(pathname, tabHostname) {
  if (typeof pathname !== 'string' || !pathname) return null
  const segments = pathname.split('/').filter(Boolean)
  let best = null
  let bestScore = -1
  for (const segment of segments) {
    let decoded
    try {
      const padded =
        segment + '='.repeat((4 - (segment.length % 4)) % 4)
      decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
    } catch {
      continue
    }
    // Prefer values that look like hostnames (contain a dot, no spaces).
    if (!decoded || decoded.includes(' ') || !decoded.includes('.')) {
      continue
    }
    if (!/^[a-z0-9.-]+$/i.test(decoded)) continue
    const host = decoded.toLowerCase()
    if (host === tabHostname) continue
    const score = scoreHostname(host)
    if (score > bestScore) {
      bestScore = score
      best = {
        url: `https://${host}/`,
        origin: `https://${host}`,
        hostname: host,
      }
    }
  }
  return bestScore >= 0 ? best : null
}

/**
 * Given the active tab URL, return the best credential site binding.
 * Prefers relying-party signals embedded in SSO/OIDC query params;
 * falls back to the tab's own origin/hostname.
 *
 * @param {string} tabUrl
 * @returns {{ url: string, origin: string, hostname: string }}
 */
export function inferCredentialSite(tabUrl) {
  const tab = tryParseUrl(tabUrl)
  if (!tab) {
    const host = hostnameOf(tabUrl)
    return {
      url: tabUrl || '',
      origin: host ? `https://${host}` : '',
      hostname: host || '',
    }
  }

  const tabHostname = tab.hostname.toLowerCase()
  const fallback = {
    url: tab.href,
    origin: tab.origin,
    hostname: tabHostname,
  }

  const returnUrl =
    tab.searchParams.get('returnUrl') ||
    tab.searchParams.get('returnurl') ||
    tab.searchParams.get('ReturnUrl')

  const nested = paramsFromReturnUrl(returnUrl)
  const redirectUri =
    nested?.get('redirect_uri') ||
    tab.searchParams.get('redirect_uri')
  const prevousLocation =
    nested?.get('prevousLocation') ||
    nested?.get('previousLocation') ||
    tab.searchParams.get('prevousLocation') ||
    tab.searchParams.get('previousLocation')

  const fromRedirect = siteFromHttpUrl(redirectUri, tabHostname)
  if (fromRedirect) {
    return {
      url: fromRedirect.origin,
      origin: fromRedirect.origin,
      hostname: fromRedirect.hostname,
    }
  }

  const fromPrev = siteFromHttpUrl(prevousLocation, tabHostname)
  if (fromPrev) {
    return {
      url: fromPrev.origin,
      origin: fromPrev.origin,
      hostname: fromPrev.hostname,
    }
  }

  const fromPath = siteFromBase64Path(tab.pathname, tabHostname)
  if (fromPath) return fromPath

  return fallback
}
