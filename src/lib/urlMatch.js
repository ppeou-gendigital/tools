// URL utilities shared by auto-capture and (eventually) any other
// feature that needs to compare credential URLs against a live tab
// URL. Match strategy: hostname-only, case-insensitive. That matches
// how browsers scope autofill (per-origin, ignoring path) but keeps
// entries stored as bare hostnames like `gmail.com` interoperable
// with full URLs like `https://gmail.com/inbox`.

const HTTP_RE = /^https?:\/\//i

// Try hard to pull a hostname out of whatever the user typed into
// the `urlOrApp` field. Handles fully-qualified URLs, bare hosts,
// and hosts with ports. Returns null on any parse failure (rather
// than throwing) so callers can chain safely.
export function hostnameOf(input) {
  if (typeof input !== 'string') return null
  const raw = input.trim()
  if (!raw) return null
  try {
    const withScheme = HTTP_RE.test(raw) ? raw : `https://${raw}`
    const host = new URL(withScheme).hostname
    return host ? host.toLowerCase() : null
  } catch {
    return null
  }
}

// Find the first credential whose `urlOrApp` resolves to the same
// hostname as `targetHostname`. Returns null when nothing matches or
// when the target is invalid. Case-insensitive; entries with no URL
// are skipped.
export function findMatchingCredential(credentials, targetHostname) {
  if (!targetHostname || !Array.isArray(credentials)) return null
  const target = targetHostname.toLowerCase()
  for (const cred of credentials) {
    if (!cred || cred.error) continue
    const host = hostnameOf(cred.urlOrApp)
    if (host && host === target) return cred
  }
  return null
}

// Same match logic as findMatchingCredential, but returns every hit
// in stable order. Used by the autofill button — when a page matches
// multiple credentials the user gets a picker instead of a silent
// first-match win.
export function findAllMatchingCredentials(credentials, targetHostname) {
  if (!targetHostname || !Array.isArray(credentials)) return []
  const target = targetHostname.toLowerCase()
  const out = []
  for (const cred of credentials) {
    if (!cred || cred.error) continue
    const host = hostnameOf(cred.urlOrApp)
    if (host && host === target) out.push(cred)
  }
  return out
}
