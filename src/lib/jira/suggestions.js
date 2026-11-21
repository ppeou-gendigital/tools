// JQL autocomplete suggestions. Unlike the catalog endpoints
// (`/rest/api/2/issuetype`, `/rest/api/2/status`, `/rest/api/2/resolution`),
// which ignore `?query=`, this one filters server-side: one small request per
// search (~0.1–0.3 KB, ~80 ms) instead of pulling and caching a catalog.
//
// It matches by prefix, not substring ("in prog" finds "In Progress"; "prog"
// finds nothing), and Jira caps the response at 15 values. Values come back as
// JQL literals, so a name with spaces or punctuation arrives quoted:
//   { value: '"In Progress"', displayName: '<b>In Progress</b>' }
// The id has to stay the bare name because that is what the JQL builder quotes
// and what saved profiles already contain.

function toName(value) {
  const text = String(value ?? '').trim()
  if (text.length < 2 || !text.startsWith('"') || !text.endsWith('"')) {
    return text
  }
  return text.slice(1, -1).replace(/\\"/g, '"').trim()
}

export function parseSuggestions(data) {
  const rows = Array.isArray(data?.results) ? data.results : []
  const seen = new Set()
  const items = []

  for (const row of rows) {
    const name = toName(row?.value)
    if (!name) continue

    const key = name.toLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    items.push({ id: name, name })
  }

  return items
}
