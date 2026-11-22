// Request handlers executed inside the Jira tab. Each one returns plain data;
// the popup owns rendering, parsing, and the clipboard.

import { ENDPOINTS, isJiraUrl } from '../../lib/jira/config.js'
import { searchColumns } from '../../lib/jira/columnSearch.js'
import { parseSuggestions } from '../../lib/jira/suggestions.js'
import { parseProjectPicker, normalizeProjectQuery } from '../../lib/jira/projects.js'
import {
  requestJson,
  requestOk,
  requestText,
  HttpError,
} from '../http.js'

const SEARCH_PAGE_SIZE = 100
const SPRINT_PAGE_SIZE = 28

function urlFor(path, params = {}) {
  const url = new URL(path, location.origin)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, value)
  }
  return url.toString()
}

function stripHtml(value) {
  return String(value ?? '').replace(/<[^>]*>/g, '')
}

/* ------------------------------- columns ------------------------------- */

async function getColumnIds() {
  const columns = await requestJson(ENDPOINTS.userColumns)
  return (Array.isArray(columns) ? columns : [])
    .map((column) => column?.value)
    .filter(Boolean)
}

async function putColumnIds(ids) {
  await requestOk(ENDPOINTS.userColumns, {
    method: 'PUT',
    headers: {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/json',
      'x-requested-with': 'XMLHttpRequest',
    },
    body: JSON.stringify({ columns: ids }),
  })
}

/* -------------------------------- report -------------------------------- */

// The issue-view endpoint renders whatever columns are stored on the user's
// profile, so the requested set is swapped in and always swapped back.
export async function issueView({ jql, columns = [] } = {}) {
  if (!jql) throw new HttpError('Build a filter before exporting.', { code: 'no-jql' })

  const original = await getColumnIds()
  const requested = columns.filter(Boolean)

  try {
    if (requested.length > 0) await putColumnIds(requested)
    const html = await requestText(
      urlFor(ENDPOINTS.issueView, { jqlQuery: jql }),
    )
    return { html }
  } finally {
    try {
      await putColumnIds(original)
    } catch (error) {
      // The report itself may still be usable; never mask the original error.
      console.warn('[jira-capacity] could not restore column layout', error)
    }
  }
}

export async function issuesWithComments({ jql, fields = [] } = {}) {
  if (!jql) throw new HttpError('Build a filter before exporting.', { code: 'no-jql' })

  const requested = new Set(
    fields.filter((id) => id && id !== 'issuekey' && id !== 'subtask'),
  )
  requested.add('subtasks')
  const fieldList = [...requested].join(',')

  const first = await search(jql, 'status', 1, 0)
  const total = Number(first?.total ?? 0)
  if (total === 0) return { issues: [], total: 0 }

  const issues = []
  for (let startAt = 0; startAt < total; startAt += SEARCH_PAGE_SIZE) {
    const page = await search(jql, fieldList, SEARCH_PAGE_SIZE, startAt)
    const batch = page?.issues ?? []
    issues.push(...batch)
    // Jira can cap maxResults below the requested size; stop on an empty page
    // instead of looping forever.
    if (batch.length === 0) break
  }

  return { issues, total }
}

function search(jql, fields, maxResults, startAt) {
  return requestJson(
    urlFor(ENDPOINTS.issueSearch, {
      jql,
      fields,
      maxResults,
      startAt,
    }),
  )
}

/* -------------------------------- pickers -------------------------------- */

function sprintTime(sprint) {
  const raw = String(sprint?.date ?? '')
  // Jira emits "...T01:00:0Z" (single-digit seconds).
  const normalized = raw.replace(/T(\d{2}:\d{2}):(\d)Z$/, 'T$1:0$2Z')
  const time = Date.parse(normalized)
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time
}

export async function sprintPicker({ query = '' } = {}) {
  const data = await requestJson(
    urlFor(ENDPOINTS.sprintPicker, {
      excludeCompleted: 'false',
      maxResults: SPRINT_PAGE_SIZE,
      query,
    }),
  )

  const matches = [...(data?.allMatches ?? []), ...(data?.suggestions ?? [])]
  const seen = new Set()
  return matches
    .filter((sprint) => {
      if (!sprint?.id || seen.has(sprint.id)) return false
      seen.add(sprint.id)
      return true
    })
    .sort((a, b) => sprintTime(a) - sprintTime(b))
    .map(({ id, name }) => ({ id: String(id), name: String(name ?? id) }))
}

export async function userPicker({ query = '' } = {}) {
  const data = await requestJson(
    urlFor(ENDPOINTS.userPicker, { showAvatar: 'true', query }),
  )

  return (data?.users?.users ?? []).map((user) => {
    const name = user.displayName || stripHtml(user.html) || user.name
    return {
      id: String(user.name),
      name: String(name),
      icon: user.avatarUrl ?? null,
    }
  })
}

let availableColumnsCache = null
let availableColumnsRequest = null

// One fetch per Jira tab, shared by the idle prefetch and the picker so a
// keystroke that lands mid-prefetch joins the in-flight request instead of
// starting a second one.
function loadAvailableColumns() {
  if (availableColumnsCache) return Promise.resolve(availableColumnsCache)

  if (!availableColumnsRequest) {
    availableColumnsRequest = requestJson(ENDPOINTS.availableColumns)
      .then((data) => {
        availableColumnsCache = Array.isArray(data?.availableColumns)
          ? data.availableColumns
          : []
        return availableColumnsCache
      })
      .finally(() => {
        // Dropped on success too: the cache above is the fast path, and a
        // failed attempt should be retried rather than remembered.
        availableColumnsRequest = null
      })
  }

  return availableColumnsRequest
}

// Called from the content-script bootstrap while the tab is idle. On a real
// instance the catalog is ~90 KB, so paying for it up front keeps the first
// keystroke in the field picker local.
export function warmFieldCache() {
  return loadAvailableColumns().catch(() => {
    // Nobody asked for this fetch, so a failure is silent; the picker will
    // surface the error (and retry) when the user actually searches.
  })
}

export async function projectPicker({ query = '' } = {}) {
  const data = await requestJson(
    urlFor(ENDPOINTS.projectPicker, {
      query: normalizeProjectQuery(query),
      maxResults: 50,
    }),
  )

  return parseProjectPicker(data)
}

// Issue types, statuses, and resolutions use Jira's JQL autocomplete instead of
// their catalog endpoints: those ignore `?query=` and return 240–380 entries,
// while autocomplete filters server-side and answers in ~80 ms with a few
// hundred bytes. Nothing is preloaded or cached, so every search hits Jira.
// The trade-off is prefix matching and Jira's 15-value cap.
function suggestionPicker(fieldName) {
  return async function suggestionsPicker({ query = '' } = {}) {
    const text = String(query ?? '').trim()
    if (!text) return []

    const data = await requestJson(
      urlFor(ENDPOINTS.jqlSuggestions, {
        fieldName,
        fieldValue: text,
      }),
    )

    return parseSuggestions(data)
  }
}

export const typesPicker = suggestionPicker('issuetype')
export const statusesPicker = suggestionPicker('status')
export const resolutionsPicker = suggestionPicker('resolution')

export async function fieldsPicker({ query = '' } = {}) {
  const columns = await loadAvailableColumns()
  return searchColumns(columns, query)
}

/* ----------------------------- attachments ----------------------------- */

// The signed-in Jira user, cached per tab. Used to stamp createdBy/updatedBy
// into profile files; failures are not cached so a re-login recovers.
let currentUserCache = null
let currentUserRequest = null

export function currentUser() {
  if (currentUserCache) return Promise.resolve(currentUserCache)
  if (!currentUserRequest) {
    currentUserRequest = requestJson(ENDPOINTS.myself)
      .then((user) => {
        currentUserCache = {
          name: String(user?.name ?? ''),
          displayName: String(user?.displayName ?? user?.name ?? ''),
        }
        return currentUserCache
      })
      .finally(() => {
        currentUserRequest = null
      })
  }
  return currentUserRequest
}

const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024

function normalizeAttachment(issueKey, attachment) {
  return {
    id: String(attachment?.id ?? ''),
    issueKey,
    filename: String(attachment?.filename ?? ''),
    size: Number(attachment?.size ?? 0),
    mimeType: String(attachment?.mimeType ?? ''),
    created: String(attachment?.created ?? ''),
    author:
      attachment?.author?.displayName ?? attachment?.author?.name ?? '',
    content: String(attachment?.content ?? ''),
  }
}

// Loads the attachment list for several tickets in parallel. A ticket that
// fails (missing, no permission, or a signed-out session) reports its own error
// instead of failing the whole batch.
export async function listAttachments({ keys = [] } = {}) {
  const unique = [...new Set(
    (Array.isArray(keys) ? keys : [])
      .map((key) => String(key ?? '').trim().toUpperCase())
      .filter(Boolean),
  )]

  return Promise.all(
    unique.map(async (key) => {
      try {
        const issue = await requestJson(
          urlFor(`${ENDPOINTS.issue}/${encodeURIComponent(key)}`, {
            fields: 'summary,attachment',
          }),
        )
        const attachments = Array.isArray(issue?.fields?.attachment)
          ? issue.fields.attachment
          : []
        return {
          key,
          summary: String(issue?.fields?.summary ?? ''),
          attachments: attachments.map((attachment) =>
            normalizeAttachment(key, attachment),
          ),
        }
      } catch (error) {
        return {
          key,
          summary: '',
          attachments: [],
          error: `${key}: ${error?.message ?? 'Jira could not read this ticket.'}`,
        }
      }
    }),
  )
}

export async function downloadAttachments({ items = [] } = {}) {
  return Promise.all(
    (Array.isArray(items) ? items : []).map(async (item) => {
      const attachmentId = String(item?.attachmentId ?? '')
      const filename = String(item?.filename ?? '')
      try {
        const raw = String(item?.content ?? '')
        // Jira usually returns an absolute URL, but a relative one is valid too.
        const content = raw ? new URL(raw, location.origin).toString() : ''
        if (!isJiraUrl(content)) {
          throw new HttpError('Attachment is not hosted on the Jira server.', {
            code: 'bad-url',
          })
        }
        const text = await requestText(content)
        if (text.length > MAX_ATTACHMENT_BYTES) {
          throw new HttpError('Attachment is larger than 2 MB.', {
            code: 'too-large',
          })
        }
        return {
          issueKey: item?.issueKey,
          attachmentId,
          filename,
          text,
        }
      } catch (error) {
        return {
          issueKey: item?.issueKey,
          attachmentId,
          filename,
          error: error?.message ?? 'Attachment download failed.',
        }
      }
    }),
  )
}

export async function uploadAttachment({ issueKey, filename, text } = {}) {
  if (!issueKey) {
    throw new HttpError('Pick a Jira ticket before syncing.', { code: 'no-ticket' })
  }
  if (!filename) {
    throw new HttpError('The profile needs a file name.', { code: 'no-filename' })
  }

  const form = new FormData()
  form.append(
    'file',
    new Blob([String(text ?? '')], { type: 'application/json' }),
    filename,
  )

  const data = await requestJson(
    `${ENDPOINTS.issue}/${encodeURIComponent(issueKey)}/attachments`,
    {
      method: 'POST',
      // Jira rejects XSRF-less multipart posts, and this header is how the web
      // UI itself opts out.
      headers: { 'X-Atlassian-Token': 'no-check' },
      body: form,
    },
  )

  const created = Array.isArray(data) ? data[0] : data
  if (!created?.id) {
    throw new HttpError('Jira did not return the uploaded attachment.', {
      code: 'upload-failed',
    })
  }
  return normalizeAttachment(issueKey, created)
}

export async function deleteAttachment({ id } = {}) {
  if (!id) throw new HttpError('No attachment was selected.', { code: 'no-id' })
  await requestOk(`${ENDPOINTS.attachment}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  return { id: String(id) }
}

export const handlers = {
  'report.issueView': issueView,
  'issues.withComments': issuesWithComments,
  'attachment.list': listAttachments,
  'attachment.download': downloadAttachments,
  'attachment.upload': uploadAttachment,
  'attachment.delete': deleteAttachment,
  'user.myself': currentUser,
  'picker.sprint': sprintPicker,
  'picker.user': userPicker,
  'picker.project': projectPicker,
  'picker.types': typesPicker,
  'picker.statuses': statusesPicker,
  'picker.resolutions': resolutionsPicker,
  'picker.fields': fieldsPicker,
}

export function handle(type, payload) {
  const handler = handlers[type]
  if (!handler) {
    throw new HttpError(`Unknown request "${type}".`, { code: 'unknown-request' })
  }
  return handler(payload ?? {})
}
