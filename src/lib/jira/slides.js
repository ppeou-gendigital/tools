/** Jira workspace slides (tab strip + Deck). Order matches the old extension nav. */
export const JIRA_SLIDES = [
  { id: 'report', label: 'Report', go: 'goReport' },
  { id: 'sprints', label: 'Sprints', go: 'goSprints' },
  { id: 'columns', label: 'Columns', go: 'goColumns' },
  { id: 'users', label: 'Users', go: 'goUsers' },
  { id: 'issue-type', label: 'Type', go: 'goIssueType' },
  { id: 'issue-status', label: 'Status', go: 'goIssueStatus' },
  { id: 'resolutions', label: 'Resolutions', go: 'goResolutions' },
  { id: 'projects', label: 'Projects', go: 'goProjects' },
]

export const JIRA_SLIDE_IDS = new Set(JIRA_SLIDES.map((s) => s.id))

export function isJiraSlideRoute(route) {
  return JIRA_SLIDE_IDS.has(route)
}
