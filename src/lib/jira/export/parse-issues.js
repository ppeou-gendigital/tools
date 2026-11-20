// REST search parser for the "tickets and comments" export. Covers both the
// Jira 2.x shape ({ issues: [{ key, fields }] }) and nested subtasks.

export function parseIssues(payload) {
  const issues = Array.isArray(payload?.issues) ? payload.issues : []

  const byKey = new Map()
  issues.forEach((issue, order) => {
    if (issue?.key) byKey.set(issue.key, { issue, order })
  })

  // Any issue referenced as a subtask is rendered under its parent instead of
  // as a top-level row.
  const childKeys = new Set()
  for (const { issue } of byKey.values()) {
    for (const subtask of issue.fields?.subtasks ?? []) {
      if (subtask?.key) childKeys.add(subtask.key)
    }
  }

  const rows = []
  for (const { issue, order } of [...byKey.values()].sort(
    (a, b) => a.order - b.order,
  )) {
    if (childKeys.has(issue.key)) continue

    const children = (issue.fields?.subtasks ?? [])
      .map((subtask) => byKey.get(subtask?.key))
      .filter(Boolean)
      .map(({ issue: child }) => ({
        id: child.key,
        // The sheet repeats the parent key on subtask rows so the column is
        // never empty; the subtask column carries the child key.
        values: { ...(child.fields ?? {}), issuekey: issue.key, subtask: child.key },
      }))

    rows.push({
      id: issue.key,
      order,
      values: { ...(issue.fields ?? {}), issuekey: issue.key },
      children,
    })
  }

  return { rows }
}
