import { JIRA_BASE_URL } from './config'

function getDisplayName(string) {
  const all = String(string)
    .replaceAll(/<[^>]*>/gi, '')
    .split(' (')
  all.pop()
  return all.join(' (')
}

async function jiraFetch(url, init) {
  const response = await fetch(url, { credentials: 'include', ...init })
  if (response.status === 401 || response.status === 403) {
    throw new Error(
      `Jira returned ${response.status}. Log in at ${JIRA_BASE_URL} in this browser, then retry.`,
    )
  }
  if (!response.ok) {
    throw new Error(`Jira request failed (${response.status})`)
  }
  return response
}

export const jiraApi = {
  sprint: {
    async search(text) {
      const url = new URL(
        `${JIRA_BASE_URL}/rest/greenhopper/1.0/sprint/picker`,
      )
      url.searchParams.set('excludeCompleted', 'false')
      url.searchParams.set('maxResults', '28')
      url.searchParams.set('query', text)
      try {
        const response = await jiraFetch(url.toString()).then((r) => r.json())
        const masterList = [
          ...(response.allMatches || []),
          ...(response.suggestions || []),
        ]
        const data = masterList
          .map((a) => ({
            ...a,
            datetime: new Date(String(a.date || '').replace('00:0Z', '00')),
          }))
          .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
          .map(({ id, name }) => ({ id, name }))
        return { data }
      } catch (error) {
        return { error, data: [] }
      }
    },
  },

  user: {
    async search(text) {
      const url = new URL(`${JIRA_BASE_URL}/rest/api/latest/groupuserpicker`)
      url.searchParams.set('showAvatar', 'true')
      url.searchParams.set('query', text)
      try {
        const response = await jiraFetch(url.toString()).then((r) => r.json())
        const users = response?.users?.users || []
        const data = users.map(
          ({ name: id, displayName: name, html, avatarUrl: icon }) => ({
            id,
            name,
            displayName: getDisplayName(html || name),
            icon,
          }),
        )
        return { data }
      } catch (error) {
        return { error, data: [] }
      }
    },
  },

  columns: {
    cachedData: undefined,
    filter(data, text) {
      const token = new RegExp(text, 'i')
      return data
        .filter(
          ({ label, value }) => token.test(label) || token.test(value),
        )
        .map(({ label: name, value: id }) => ({ id, name }))
    },
    async search(text) {
      try {
        if (!jiraApi.columns.cachedData) {
          const response = await jiraFetch(
            `${JIRA_BASE_URL}/rest/gadget/1.0/availableColumns`,
          ).then((r) => r.json())
          jiraApi.columns.cachedData = response.availableColumns || []
        }
        return {
          data: jiraApi.columns.filter(jiraApi.columns.cachedData, text),
        }
      } catch (error) {
        return { error, data: [] }
      }
    },
  },

  attachments: {
    async list(issueKey) {
      const url = new URL(
        `${JIRA_BASE_URL}/rest/api/2/issue/${encodeURIComponent(issueKey)}`,
      )
      url.searchParams.set('fields', 'attachment')
      try {
        const json = await jiraFetch(url.toString()).then((r) => r.json())
        const data = (json.fields?.attachment ?? []).map((a) => ({
          id: a.id,
          filename: a.filename,
          mimeType: a.mimeType,
          size: a.size,
          created: a.created,
          author: a.author?.displayName,
          contentUrl: a.content,
        }))
        return { data }
      } catch (error) {
        return { error, data: [] }
      }
    },

    async downloadJson(contentUrl) {
      try {
        const text = await jiraFetch(contentUrl).then((r) => r.text())
        try {
          return { data: JSON.parse(text) }
        } catch {
          return {
            error: new Error('Attachment is not valid JSON'),
            data: null,
          }
        }
      } catch (error) {
        return { error, data: null }
      }
    },

    async remove(attachmentId) {
      const url = `${JIRA_BASE_URL}/rest/api/2/attachment/${encodeURIComponent(attachmentId)}`
      try {
        await jiraFetch(url, { method: 'DELETE' })
        return { data: true }
      } catch (error) {
        return { error, data: false }
      }
    },

    async upload(issueKey, { filename, json }) {
      const url = `${JIRA_BASE_URL}/rest/api/2/issue/${encodeURIComponent(issueKey)}/attachments`
      const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: 'application/json',
      })
      const form = new FormData()
      form.append('file', blob, filename)
      try {
        const response = await jiraFetch(url, {
          method: 'POST',
          headers: { 'X-Atlassian-Token': 'no-check' },
          body: form,
        })
        const data = await response.json()
        const first = Array.isArray(data) ? data[0] : data
        return {
          data: first
            ? {
                id: first.id,
                filename: first.filename,
                mimeType: first.mimeType,
                size: first.size,
                created: first.created,
                contentUrl: first.content,
              }
            : null,
        }
      } catch (error) {
        return { error, data: null }
      }
    },
  },
}
