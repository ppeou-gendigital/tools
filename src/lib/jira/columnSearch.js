// Column (field) search for the fetch-field picker. The gadget endpoint that
// lists the columns has no server-side search, so the runner pulls the catalog
// once and ranks matches here before sending only the best few to the popup.
//
// Ranking matters because a real instance exposes ~1,600 columns: plain
// `indexOf` order puts "(deprecated) Status" ahead of "Status" and buries the
// field the user actually wanted.

export const COLUMN_RESULT_LIMIT = 50

// 0 exact, 1 prefix, 2 word start, 3 substring.
function score(haystack, needle) {
  const text = String(haystack ?? '').toLowerCase()
  const at = text.indexOf(needle)
  if (at === -1) return null
  if (at === 0) return text.length === needle.length ? 0 : 1
  return /[^a-z0-9]/.test(text[at - 1]) ? 2 : 3
}

function toItem({ label, value }) {
  return { id: String(value), name: String(label ?? value) }
}

export function searchColumns(columns, query = '', limit = COLUMN_RESULT_LIMIT) {
  const needle = String(query ?? '').trim().toLowerCase()
  const rows = Array.isArray(columns) ? columns : []

  if (!needle) {
    return rows
      .slice()
      .sort((a, b) => String(a.label ?? a.value).localeCompare(String(b.label ?? b.value)))
      .slice(0, limit)
      .map(toItem)
  }

  const ranked = []
  for (const column of rows) {
    // The label is what the user sees, so a label hit always outranks an id hit.
    const labelScore = score(column.label, needle)
    const valueScore = score(column.value, needle)
    if (labelScore === null && valueScore === null) continue

    ranked.push({
      column,
      score: labelScore ?? valueScore + 4,
      label: String(column.label ?? column.value),
    })
  }

  ranked.sort(
    (a, b) =>
      a.score - b.score ||
      a.label.length - b.label.length ||
      a.label.localeCompare(b.label),
  )

  return ranked.slice(0, limit).map(({ column }) => toItem(column))
}
