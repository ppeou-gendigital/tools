import { JIRA_BASE_URL } from './config'

export const JIRA_HOST = new URL(JIRA_BASE_URL).hostname

export function jiraProfileId(issueKey, filename) {
  return `${issueKey}::${filename}`
}

export function jiraProfileName(issueKey, filename) {
  return `${issueKey} · ${filename}`
}

/** Normalize optional Jira source meta for a profile list entry. */
export function normalizeProfileSource(source) {
  if (!source || typeof source !== 'object') return null
  const issueKey = String(source.issueKey || '').trim()
  const filename = String(source.filename || '').trim()
  if (!issueKey || !filename) return null
  return {
    issueKey,
    filename,
    attachmentId: source.attachmentId != null ? String(source.attachmentId) : '',
    host: String(source.host || JIRA_HOST),
  }
}

/**
 * Sync is allowed only when the profile has Jira source meta AND the active
 * browsing context host matches that ticket’s host (not merely JIRA_BASE_URL).
 * @param {object} profile
 * @param {string | null | undefined} activeHost — active tab hostname (extension) or page hostname (dev)
 */
export function canSyncWithJira(profile, activeHost) {
  const sourceHost = profile?.source?.host
  return Boolean(
    profile?.source?.issueKey &&
      profile?.source?.filename &&
      sourceHost &&
      activeHost &&
      sourceHost === activeHost,
  )
}

/** Hostname of the active browser tab, or `window.location` outside the extension. */
export async function getActiveTabHost() {
  try {
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })
      if (tab?.url) return new URL(tab.url).hostname
    }
  } catch {
    /* ignore missing permission / invalid URL */
  }
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return window.location.hostname
  }
  return null
}
