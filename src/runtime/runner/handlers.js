// Request handlers executed inside the Jira tab. Each one returns plain data;
// the popup owns rendering, parsing, and the clipboard.

import { ENDPOINTS } from '../../lib/jira/config.js'
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

export const handlers = {
  'report.issueView': issueView,
  'issues.withComments': issuesWithComments,
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
