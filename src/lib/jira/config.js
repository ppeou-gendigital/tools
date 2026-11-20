// Shared constants. Nothing here touches Chrome or the network: the popup,
// the content-script runner, and the tests all import from this module.

export const JIRA_HOST = 'jira.corp.nortonlifelock.com'
export const JIRA_ORIGIN = `https://${JIRA_HOST}`

export const SCHEMA_VERSION = 1

export const STORAGE_KEYS = {
  profiles: 'jiraCapacity.profiles',
  working: (profileId) => `jiraCapacity.working.${profileId}`,
  ui: 'jiraCapacity.ui',
}

// Relative on purpose: the runner executes on the Jira origin, so the session
// cookies of that tab are the only credential involved.
export const ENDPOINTS = {
  sprintPicker: '/rest/greenhopper/1.0/sprint/picker',
  userPicker: '/rest/api/latest/groupuserpicker',
  availableColumns: '/rest/gadget/1.0/availableColumns',
  userColumns: '/rest/api/2/user/columns',
  issueSearch: '/rest/api/2/search',
  issueView:
    '/sr/jira.issueviews:searchrequest-html-current-fields/temp/SearchRequest.html',
}

export function isJiraUrl(value) {
  if (!value) return false
  try {
    return new URL(value).hostname === JIRA_HOST
  } catch {
    return false
  }
}

export function originOf(url) {
  try {
    return new URL(url).origin
  } catch {
    return JIRA_ORIGIN
  }
}
