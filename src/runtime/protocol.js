// Wire protocol between the popup and the content script that runs on the
// Jira tab. Kept in its own module so neither side imports the other.

export const RUNNER_SOURCE = 'jira-capacity'

export const MESSAGE = {
  PING: 'ping',
  REPORT_ISSUE_VIEW: 'report.issueView',
  ISSUES_WITH_COMMENTS: 'issues.withComments',
  PICKER_SPRINT: 'picker.sprint',
  PICKER_USER: 'picker.user',
  PICKER_PROJECT: 'picker.project',
  PICKER_TYPES: 'picker.types',
  PICKER_STATUSES: 'picker.statuses',
  PICKER_RESOLUTIONS: 'picker.resolutions',
  PICKER_FIELDS: 'picker.fields',
}
