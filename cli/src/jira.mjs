// Jira Data Center REST client. Deliberately thin: it maps endpoints to
// functions and leaves shape interpretation to the shared report engine.

import { CliError } from './http.mjs'
import {
  normalizeProjectQuery,
  parseProjectPicker,
} from '../../src/lib/jira/projects.js'

const PAGE_SIZE = 100
const MAX_PAGES = 500

export function createJira(client) {
  const { request } = client

  async function search(jql, { fields = [], startAt = 0, maxResults = PAGE_SIZE } = {}) {
    return request('/rest/api/2/search', {
      query: {
        jql,
        fields: fields.join(','),
        startAt,
        maxResults,
        validateQuery: 'false',
      },
    })
  }

  // Reads the total without pulling rows.
  async function count(jql) {
    const data = await search(jql, { maxResults: 0, fields: [] })
    return Number(data?.total ?? 0)
  }

  async function searchAll(jql, { fields = [], max = Infinity, onPage } = {}) {
    const issues = []
    let startAt = 0

    for (let page = 0; page < MAX_PAGES; page += 1) {
      const data = await search(jql, { fields, startAt, maxResults: PAGE_SIZE })
      const batch = Array.isArray(data?.issues) ? data.issues : []
      const total = Number(data?.total ?? batch.length)

      issues.push(...batch)
      onPage?.({ loaded: issues.length, total })

      startAt += batch.length
      if (batch.length === 0 || startAt >= total || issues.length >= max) break
    }

    return { issues, total: issues.length }
  }

  async function myself() {
    return request('/rest/api/2/myself')
  }

  async function fieldCatalog() {
    const fields = await request('/rest/api/2/field')
    return (Array.isArray(fields) ? fields : [])
      .filter((field) => field?.id && field?.name)
      .map((field) => ({
        id: field.id,
        name: field.name,
        custom: Boolean(field.custom),
      }))
  }

  async function sprintFieldId() {
    const fields = await fieldCatalog()
    const sprint = fields.find((field) => /^sprint$/i.test(field.name))
    if (!sprint) {
      throw new CliError(
        'This Jira has no field named "Sprint"; pass --sprint with an id instead.',
        { code: 'no-sprint-field' },
      )
    }
    return sprint.id
  }

  // Sprint-name lookup for `--sprint`. Greenhopper's picker is the same source
  // the extension's sprint field uses, and it needs no project scope.
  async function sprintPicker(query, { limit = 28, excludeCompleted = false } = {}) {
    const data = await request('/rest/greenhopper/1.0/sprint/picker', {
      query: {
        query,
        maxResults: limit,
        excludeCompleted: String(excludeCompleted),
      },
    })

    const seen = new Map()
    const matches = [...(data?.allMatches ?? []), ...(data?.suggestions ?? [])]
    for (const sprint of matches) {
      if (!sprint?.id || seen.has(String(sprint.id))) continue
      seen.set(String(sprint.id), {
        id: String(sprint.id),
        name: String(sprint.name ?? sprint.id),
        date: sprint.date ?? null,
      })
    }
    return [...seen.values()]
  }

  // Agile board API. Unlike a JQL search this lists sprints that have no issues
  // yet, which is exactly the "upcoming sprint" case. It is optional: older or
  // locked-down instances answer 404/403, and callers fall back to JQL.
  async function agileBoards(project, { limit = 50 } = {}) {
    const data = await request('/rest/agile/1.0/board', {
      query: { projectKeyOrId: project, maxResults: limit },
    })
    return (data?.values ?? []).map((board) => ({
      id: String(board.id),
      name: String(board.name ?? board.id),
      type: String(board.type ?? ''),
    }))
  }

  async function agileSprints(boardId, { state = 'future', limit = 50 } = {}) {
    const value = state === 'all' ? 'active,future' : state
    const data = await request(
      `/rest/agile/1.0/board/${encodeURIComponent(boardId)}/sprint`,
      { query: { state: value, maxResults: limit } },
    )
    return (data?.values ?? [])
      .filter((sprint) => sprint?.id)
      .map((sprint) => ({
        id: String(sprint.id),
        name: String(sprint.name ?? sprint.id),
        state: String(sprint.state ?? state).toLowerCase(),
        startDate: sprint.startDate ?? null,
        endDate: sprint.endDate ?? null,
        board: String(boardId),
      }))
  }

  // `state` is Jira's own vocabulary: active (open now) or future (not started).
  async function sprints(project, { state = 'future', limit = 50 } = {}) {
    const fieldId = await sprintFieldId()
    const scope = state === 'active' ? 'openSprints()' : 'futureSprints()'
    const scopeClause = String(project ?? '').trim()
      ? `project = ${String(project).trim()} AND sprint in ${scope}`
      : `sprint in ${scope}`
    const jql = `${scopeClause} ORDER BY created ASC`
    const data = await search(jql, {
      fields: [fieldId],
      maxResults: limit,
    })

    const seen = new Map()
    for (const issue of data?.issues ?? []) {
      const values = issue?.fields?.[fieldId] ?? []
      for (const sprint of Array.isArray(values) ? values : [values]) {
        if (!sprint?.id || seen.has(String(sprint.id))) continue
        seen.set(String(sprint.id), {
          id: String(sprint.id),
          name: String(sprint.name ?? sprint.id),
          state: String(sprint.state ?? state).toLowerCase(),
          startDate: sprint.startDate ?? null,
          endDate: sprint.endDate ?? null,
        })
      }
    }

    return [...seen.values()].sort((a, b) =>
      String(a.startDate ?? '').localeCompare(String(b.startDate ?? '')),
    )
  }

  async function peopleSearch(query, { limit = 50 } = {}) {
    const data = await request('/rest/api/latest/groupuserpicker', {
      query: { showAvatar: 'false', query, maxResults: limit },
    })
    return (data?.users?.users ?? []).slice(0, limit).map((user) => {
      const label =
        user.displayName ||
        String(user.html ?? '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim() ||
        user.name
      return {
        id: String(user.name ?? user.key ?? label),
        name: String(label),
      }
    })
  }

  // Jira Data Center's project picker is the only project endpoint that filters
  // server-side, and it answers with `{ projects: [{ key, name }] }`. Issue keys
  // and browse URLs are reduced to the project key first.
  async function projectSearch(query, { limit = 50 } = {}) {
    const data = await request('/rest/api/2/projects/picker', {
      query: { query: normalizeProjectQuery(query), maxResults: limit },
    })
    return parseProjectPicker(data).slice(0, limit)
  }

  // JQL autocomplete: server-side prefix matching for issuetype/status/
  // resolution names, which the catalog endpoints cannot filter.
  async function suggest(fieldName, fieldValue, { limit = 15 } = {}) {
    const data = await request('/rest/api/2/jql/autocompletedata/suggestions', {
      query: { fieldName, fieldValue },
    })
    return (data?.results ?? [])
      .map((row) => {
        const text = String(row?.value ?? '').trim()
        const name =
          text.startsWith('"') && text.endsWith('"')
            ? text.slice(1, -1).replace(/\\"/g, '"')
            : text
        return name ? { id: name, name } : null
      })
      .filter(Boolean)
      .slice(0, limit)
  }

  async function listAttachments(issueKey) {
    const data = await request(`/rest/api/2/issue/${encodeURIComponent(issueKey)}`, {
      query: { fields: 'attachment' },
    })
    return (data?.fields?.attachment ?? []).map((attachment) => ({
      id: String(attachment.id),
      filename: String(attachment.filename),
      size: Number(attachment.size ?? 0),
      mimeType: attachment.mimeType ?? '',
      created: attachment.created ?? null,
      author: attachment.author?.displayName ?? attachment.author?.name ?? '',
      content: attachment.content,
    }))
  }

  async function downloadAttachment(attachment) {
    return request(attachment.content, { expect: 'buffer' })
  }

  async function uploadAttachment(issueKey, filename, bytes, mimeType = 'application/json') {
    const form = new FormData()
    form.append('file', new Blob([bytes], { type: mimeType }), filename)

    const data = await request(
      `/rest/api/2/issue/${encodeURIComponent(issueKey)}/attachments`,
      {
        method: 'POST',
        body: form,
        headers: { 'X-Atlassian-Token': 'no-check' },
      },
    )

    const created = Array.isArray(data) ? data[0] : data
    if (!created?.id) {
      throw new CliError('Jira accepted the upload but returned no attachment.', {
        code: 'upload',
      })
    }

    return {
      id: String(created.id),
      filename: String(created.filename ?? filename),
      size: Number(created.size ?? 0),
      created: created.created ?? null,
    }
  }

  async function deleteAttachment(id) {
    await request(`/rest/api/2/attachment/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
    return String(id)
  }

  return {
    request,
    search,
    count,
    searchAll,
    myself,
    fieldCatalog,
    sprintFieldId,
    sprintPicker,
    sprints,
    peopleSearch,
    projectSearch,
    suggest,
    agileBoards,
    agileSprints,
    listAttachments,
    downloadAttachment,
    uploadAttachment,
    deleteAttachment,
  }
}
