import { JIRA_BASE_URL } from './config'

const ISSUE_KEY_RE = /^[A-Z][A-Z0-9]+-\d+$/i

/**
 * Accept a bare issue key (`WEBEXP-99797`) or a browse URL for this Jira host.
 * @returns {string} Normalized uppercase key
 * @throws {Error} when the input cannot be parsed
 */
export function parseIssueKey(input) {
  const raw = String(input ?? '').trim()
  if (!raw) {
    throw new Error('Enter a Jira issue key or browse URL.')
  }

  if (ISSUE_KEY_RE.test(raw)) {
    return raw.toUpperCase()
  }

  let url
  try {
    url = new URL(raw)
  } catch {
    throw new Error(
      'Enter a key like WEBEXP-99797 or a browse URL for this Jira instance.',
    )
  }

  const base = new URL(JIRA_BASE_URL)
  if (url.origin !== base.origin) {
    throw new Error(`URL must be on ${base.host}.`)
  }

  const match = url.pathname.match(/\/browse\/([A-Z][A-Z0-9]+-\d+)/i)
  if (!match) {
    throw new Error('URL must look like …/browse/WEBEXP-99797.')
  }

  return match[1].toUpperCase()
}

export function isJsonAttachment({ filename, mimeType }) {
  const name = String(filename || '').toLowerCase()
  const mime = String(mimeType || '').toLowerCase()
  return mime === 'application/json' || name.endsWith('.json')
}
