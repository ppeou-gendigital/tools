export const emptyJiraConfig = () => ({
  projects: [],
  resolutions: [],
  sprints: [],
  types: [],
  status: [],
  columns: [],
  users: [],
  orderBy: [],
  lookupList: {
    projects: [],
    resolutions: [],
    issueStatus: [],
    issueType: [],
    fields: [],
  },
})

export const emptyProfileMeta = () => ({
  list: [],
  selected: '',
})

/** Normalize imported JSON into `{ jira }` shape. */
export function normalizeProfileConfig(raw) {
  const base = emptyJiraConfig()
  const jira = raw?.jira && typeof raw.jira === 'object' ? raw.jira : raw
  if (!jira || typeof jira !== 'object') {
    return { jira: base }
  }
  return {
    jira: {
      ...base,
      ...jira,
      lookupList: {
        ...base.lookupList,
        ...(jira.lookupList && typeof jira.lookupList === 'object'
          ? jira.lookupList
          : {}),
      },
    },
  }
}

export function valueToLookupList(values) {
  return (values || []).map((key) =>
    typeof key === 'string' ? { id: key, name: key } : key,
  )
}
