// Project search uses Jira DC's project picker
// (`GET /rest/api/2/projects/picker`), the only endpoint on this instance that
// filters server-side: `/rest/api/2/project` ignores `query` and returns all
// 460+ projects in a 340 KB array. The picker answers with real `key` and `id`
// fields, so the id used in JQL never has to be recovered from display text:

// { "projects": [{ "key": "WEBAVAST", "name": "Avast/AVG", "id": "43701", … }] }
export function parseProjectPicker(payload = {}) {
  const seen = new Set()
  const projects = []

  for (const project of Array.isArray(payload?.projects) ? payload.projects : []) {
    const key = String(project?.key ?? '').trim()
    if (!key || seen.has(key)) continue

    seen.add(key)
    projects.push({ id: key, name: String(project?.name ?? '').trim() || key })
  }

  return projects
}

// Accepts a project key, an issue key (WEBAVAST-26648), or a Jira URL and
// reduces it to the project part the picker understands:
//   /projects/WEBAVAST, /projects/WEBAVAST/summary  -> WEBAVAST
//   /browse/WEBAVAST-26648                          -> WEBAVAST
export function normalizeProjectQuery(query = '') {
  const text = String(query ?? '')
    .trim()
    .replace(/[?#].*$/, '')
    .replace(/\/+$/, '')

  if (!text) return ''

  // The new project URL carries the key itself, so no lookup is needed.
  const projectPath = text.match(/(?:^|\/)projects\/([A-Za-z][A-Za-z0-9_]*)(?:\/|$)/i)
  if (projectPath) return projectPath[1]

  const issuePath = text.match(/(?:^|\/)([A-Za-z][A-Za-z0-9_]*)-(\d+)(?:\/|$)/)
  if (issuePath) return issuePath[1]

  return text
}

// A project's id is its Jira key (WEBAVAST) while its name is free-form
// ("Avast/AVG"), and the key is what the JQL builder quotes. Showing both makes
// the stored id visible and keeps a search by key explainable.
export function toProjectOption({ id, name } = {}) {
  const key = String(id ?? '')
  const text = String(name ?? key)

  if (!key || text === key || text.endsWith(`(${key})`)) {
    return { value: key || text, label: text }
  }

  return { value: key, label: `${text} (${key})` }
}
