// Issue field catalog. `kind` is the contract between the two parsers and the
// table renderer, so a field is described once instead of in three places.
//
// Custom field ids are instance-specific. They are searched live from Jira by
// the fetch-field picker; unknown ids fall back to plain text via getField().

export const FIELD_KIND = {
  TEXT: 'text',
  KEY: 'key',
  USER: 'user',
  SECONDS: 'seconds',
  FLAG: 'flag',
  COMMENTS: 'comments',
}

export const ISSUE_FIELDS = [
  { id: 'issuekey', name: 'Issue Key', kind: FIELD_KIND.KEY },
  { id: 'issuetype', name: 'Type', kind: FIELD_KIND.TEXT },
  { id: 'status', name: 'Status', kind: FIELD_KIND.TEXT },
  { id: 'resolution', name: 'Resolution', kind: FIELD_KIND.TEXT },
  { id: 'priority', name: 'Priority', kind: FIELD_KIND.TEXT },
  { id: 'summary', name: 'Summary', kind: FIELD_KIND.TEXT },
  { id: 'assignee', name: 'Assignee', kind: FIELD_KIND.USER },
  { id: 'customfield_16064', name: 'QA Assignee', kind: FIELD_KIND.USER },
  { id: 'customfield_20600', name: 'QA Drop date', kind: FIELD_KIND.TEXT },
  { id: 'customfield_10008', name: 'Story Points', kind: FIELD_KIND.TEXT },
  { id: 'customfield_10006', name: 'Flagged', kind: FIELD_KIND.FLAG },
  { id: 'timeoriginalestimate', name: 'Original Estimate', kind: FIELD_KIND.SECONDS },
  { id: 'timeestimate', name: 'Remaining Estimate', kind: FIELD_KIND.SECONDS },
  { id: 'subtask', name: 'Sub Task', kind: FIELD_KIND.KEY },
  { id: 'comment', name: 'Comments', kind: FIELD_KIND.COMMENTS },
]

const BY_ID = new Map(ISSUE_FIELDS.map((field) => [field.id, field]))

export function getField(id) {
  return BY_ID.get(id) ?? { id, name: id, kind: FIELD_KIND.TEXT }
}

// Preserves the requested order and drops duplicates, so a selection can be
// stored as an ordered id list and rebuilt for rendering.
export function resolveFields(ids = []) {
  const seen = new Set()
  const fields = []
  for (const id of ids) {
    if (!id || seen.has(id)) continue
    seen.add(id)
    fields.push(getField(id))
  }
  return fields
}

export const DEFAULT_FETCH_FIELD_IDS = [
  'issuekey',
  'issuetype',
  'status',
  'summary',
  'assignee',
  'timeoriginalestimate',
  'timeestimate',
]

export const DEFAULT_REPORT_FIELD_IDS = [...DEFAULT_FETCH_FIELD_IDS]

// Fixed column set of the "tickets and comments" export, kept identical to the
// previous implementation.
export const COMMENT_EXPORT_FIELD_IDS = [
  'status',
  'issuetype',
  'priority',
  'issuekey',
  'customfield_10006',
  'summary',
  'assignee',
  'customfield_16064',
  'customfield_20600',
  'customfield_10008',
  'subtask',
  'timeoriginalestimate',
  'timeestimate',
  'comment',
]

export const COMMENT_EXPORT_FIELDS = resolveFields(COMMENT_EXPORT_FIELD_IDS)
