// Page-title helpers for visit capture.
//
// Chrome's tab.title is often a generic SPA shell label on Atlassian
// products ("Jira", "Confluence", "Agile Board - Jira") — especially
// when we record on the first navigation event, before the issue/page
// heading hydrates. These helpers:
//
//   1. Clean / score document titles so generic shells lose to real ones
//   2. Extract the visible ticket / page heading from the DOM (injected
//      via chrome.scripting.executeScript when host access is available)
//
// The inject function is self-contained (no closures) so Chrome can
// serialize it into the page context.

const GENERIC_TITLES = new Set([
  '',
  'jira',
  'confluence',
  'loading',
  'loading...',
  'home',
  'dashboard',
  'agile board',
  'board',
  'backlog',
  'your work',
  'for you',
])

const ATLASSIAN_SUFFIX =
  /\s*[-–|]\s*(jira(\s+service\s+management)?|confluence|atlassian)\s*$/i

const ISSUE_KEY_RE = /\b([A-Z][A-Z0-9]+-\d+)\b/

export function cleanDocumentTitle(raw) {
  if (typeof raw !== 'string') return ''
  let title = raw.replace(/\s+/g, ' ').trim()
  if (!title) return ''
  title = title.replace(ATLASSIAN_SUFFIX, '').trim()
  return title
}

export function isGenericTitle(raw) {
  const cleaned = cleanDocumentTitle(raw)
  if (!cleaned) return true
  const lower = cleaned.toLowerCase()
  if (GENERIC_TITLES.has(lower)) return true
  // "Agile Board - Jira" already stripped → "Agile Board"
  if (/^(agile\s+)?board$/i.test(cleaned)) return true
  if (/^issues?$/i.test(cleaned)) return true
  return false
}

// Higher is better. Used so a late-arriving real title can replace a
// shell label, but a later shell label can't clobber a good one.
export function titleScore(raw) {
  const cleaned = cleanDocumentTitle(raw)
  if (!cleaned || isGenericTitle(cleaned)) return 0
  let score = 1
  if (ISSUE_KEY_RE.test(cleaned)) score += 3
  if (cleaned.length >= 12) score += 1
  if (cleaned.length >= 28) score += 1
  if (cleaned.includes(' — ') || cleaned.includes(' - ')) score += 1
  return score
}

// Prefer the more specific title. On a tie, keep `current` (stable).
export function preferTitle(current, candidate) {
  const cur = typeof current === 'string' ? current : ''
  const next = typeof candidate === 'string' ? candidate : ''
  if (!next.trim()) return cur
  if (!cur.trim()) return cleanDocumentTitle(next) || next.trim()
  const curScore = titleScore(cur)
  const nextScore = titleScore(next)
  if (nextScore > curScore) {
    return cleanDocumentTitle(next) || next.trim()
  }
  // Same quality: prefer the cleaned form of current if candidate is
  // just a noisier variant of the same string.
  if (nextScore === curScore && nextScore > 0) {
    const cleanedNext = cleanDocumentTitle(next)
    const cleanedCur = cleanDocumentTitle(cur)
    if (cleanedNext && cleanedNext.length > cleanedCur.length) {
      return cleanedNext
    }
  }
  return cur
}

// Build "KEY — Summary" when we have both pieces and the summary
// doesn't already start with the key.
export function formatIssueTitle(key, summary) {
  const k = (key || '').replace(/\s+/g, ' ').trim()
  const s = (summary || '').replace(/\s+/g, ' ').trim()
  if (!k && !s) return ''
  if (!k) return s
  if (!s) return k
  if (s.toUpperCase().startsWith(k.toUpperCase())) return s
  return `${k} — ${s}`
}

// Origin pattern chrome.permissions understands for a tracked-host rule.
// Chrome match patterns only allow a single leading `*.` on the host
// (e.g. `*.atlassian.net`), not mid-label wildcards like `*.norton.*`.
// Exact host → https://host/* ; leading-wildcard host → https://*.rest/*
// Unmappable patterns return null — title enrichment still works via
// cleaned tab.title / title-change events without DOM scrape access.
export function originPermissionForPattern(pattern) {
  const p = String(pattern ?? '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
  if (!p || p.includes('/') || p.includes(':')) return null
  // Exact hostname: foo.bar.com
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(p)) return `https://${p}/*`
  // Single leading wildcard: *.bar.com (no other *)
  if (/^\*\.([a-z0-9-]+\.)*[a-z0-9-]+$/.test(p) && !p.slice(2).includes('*')) {
    return `https://${p}/*`
  }
  return null
}

// Ask Chrome for host access so background capture can scrape titles.
// Must be called from a user gesture (popup / options UI). Returns
// true when already granted or newly granted; false when denied /
// unavailable (web build, missing API).
export async function ensureOriginPermission(pattern) {
  const origin = originPermissionForPattern(pattern)
  if (!origin) return false
  if (typeof chrome === 'undefined' || !chrome?.permissions) return false
  try {
    const already = await chrome.permissions.contains({ origins: [origin] })
    if (already) return true
    return await chrome.permissions.request({ origins: [origin] })
  } catch (err) {
    console.warn(
      '[loopy] permissions.request failed:',
      origin,
      err?.message ?? err,
    )
    return false
  }
}

/**
 * Injected into the page. Must stay free of imports / closures.
 * Returns a best-effort human title string, or ''.
 */
export function extractPageTitleInPage() {
  const textOf = (el) => {
    if (!el) return ''
    return String(el.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const firstText = (selectors) => {
    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel)
        const t = textOf(el)
        if (t) return t
      } catch {
        // Invalid selector in older engines — skip.
      }
    }
    return ''
  }

  // --- Jira (Cloud + legacy) -------------------------------------------
  const jiraSummary = firstText([
    'h1[data-testid="issue.views.issue-base.foundation.summary.heading"]',
    '[data-testid="issue.views.issue-base.foundation.summary.heading"]',
    '#ghx-detail-view h1',
    '#summary-val',
    '#summary-val .edit-issue-field',
  ])
  const jiraKey = firstText([
    '[data-testid="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container"] a',
    '[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]',
    '#ghx-detail-view a[href*="/browse/"]',
    '#key-val',
  ])
  if (jiraSummary || jiraKey) {
    const key = (jiraKey || '').replace(/\s+/g, ' ').trim()
    const summary = (jiraSummary || '').replace(/\s+/g, ' ').trim()
    if (key && summary) {
      if (summary.toUpperCase().startsWith(key.toUpperCase())) return summary
      return `${key} — ${summary}`
    }
    return summary || key
  }

  // --- Confluence (Cloud + Server/DC) ----------------------------------
  const confluenceTitle = firstText([
    '#title-text',
    '#title-text a',
    'h1[data-test-id="title-text-field"]',
    '[data-testid="title-text"]',
    '[data-testid="page-title"]',
    'h1[data-testid="title-text"]',
    '.page-title h1',
    'h1.pageTitle',
  ])
  if (confluenceTitle) return confluenceTitle

  // --- Generic fallbacks -----------------------------------------------
  const og =
    document
      .querySelector('meta[property="og:title"]')
      ?.getAttribute('content')
      ?.replace(/\s+/g, ' ')
      .trim() || ''
  if (og) return og

  const h1 = firstText(['main h1', 'article h1', 'h1'])
  if (h1) return h1

  return String(document.title || '')
    .replace(/\s+/g, ' ')
    .trim()
}
