import { JIRA_BASE_URL } from './config'
import { copyFormattedText } from './clipboard'

const stringSecondToTimeConverter = (str) => {
  if (str) return Number(str) / 3600
  return ''
}

const stringTimeToLocalFormat = (str) =>
  str ? new Date(str).toLocaleString() : ''

const excelCellLineBreak = '<br style="mso-data-placement:same-cell;" />'

const columnRenderer = {
  issuekey: (data) =>
    `<a data-issue-key="${data}" href="${JIRA_BASE_URL}/browse/${data}">${data}</a>`,
  status: ({ name }) => name,
  issuetype: ({ name }) => name,
  priority: ({ name }) => name,
  comment: ({ comments, total }) => {
    if (total === 0) return ''
    return comments
      .map(({ author, updateAuthor, body, created, updated }) => {
        const arr = ['<div>', body, excelCellLineBreak, excelCellLineBreak]
        arr.push(
          `<span style="color: #555; text-align: right;">Created by ${author.displayName} on ${stringTimeToLocalFormat(created)}</span>`,
        )
        if (created !== updated) {
          arr.push(excelCellLineBreak)
          arr.push(
            `<span style="color: #555; text-align: right;">Updated by ${updateAuthor.displayName} on ${stringTimeToLocalFormat(updated)}</span>`,
          )
        }
        arr.push('</div>')
        return arr.join('')
      })
      .join('')
  },
  assignee: (data) => data?.displayName || '',
  customfield_10008: (data) => data || '',
  customfield_16064: (data) => data?.displayName || '',
  customfield_20600: (data) => data || '',
  customfield_10006: (data) =>
    data && data[0] && !data[0].disable ? data[0].value : '',
  summary: (data) => data || '',
  timeoriginalestimate: (data) => stringSecondToTimeConverter(data),
  timeestimate: (data) => stringSecondToTimeConverter(data),
  subtask: (data) =>
    data
      ? `<a data-issue-key="${data}" href="${JIRA_BASE_URL}/browse/${data}">${data}</a>`
      : '',
  default: (str) => str,
}

const COLUMNS = {
  STATUS: { id: 'status', name: 'Status' },
  ISSUE_TYPE: { id: 'issuetype', name: 'Type' },
  PRIORITY: { id: 'priority', name: 'Priority' },
  ISSUE_KEY: { id: 'issuekey', name: 'Issue Key' },
  SUMMARY: { id: 'summary', name: 'summary' },
  ASSIGNEE: { id: 'assignee', name: 'Assignee' },
  QA_ASSIGNEE: { id: 'customfield_16064', name: 'QA Assignee' },
  QA_DROP_DATE: { id: 'customfield_20600', name: 'QA Drop date' },
  STORY_POINTS: { id: 'customfield_10008', name: 'Story Points' },
  SUB_TASK: { id: 'subtask', name: 'Sub Task' },
  ORIGINAL_ESTIMATE: {
    id: 'timeoriginalestimate',
    name: 'Original Estimate',
  },
  REMAINING_ESTIMATE: { id: 'timeestimate', name: 'Remaining Estimate' },
  COMMENTS: { id: 'comment', name: 'Comments' },
  FLAGGED: { id: 'customfield_10006', name: 'Flagged' },
}

const fieldsForReport = [
  COLUMNS.STATUS,
  COLUMNS.ISSUE_TYPE,
  COLUMNS.PRIORITY,
  COLUMNS.ISSUE_KEY,
  COLUMNS.FLAGGED,
  COLUMNS.SUMMARY,
  COLUMNS.ASSIGNEE,
  COLUMNS.QA_ASSIGNEE,
  COLUMNS.QA_DROP_DATE,
  COLUMNS.STORY_POINTS,
  COLUMNS.SUB_TASK,
  COLUMNS.ORIGINAL_ESTIMATE,
  COLUMNS.REMAINING_ESTIMATE,
  COLUMNS.COMMENTS,
]

const createTable = (columns, data) =>
  new DOMParser().parseFromString(
    `
    <table>
    <thead>
      <tr>${columns.map(({ name }) => `<td>${name}</td>`).join('')}</tr>
    </thead>
    <tbody>${data
      .map(
        ({ fields: parent, subtasks }) =>
          `<tr>${columns
            .map(
              ({ id: field }) =>
                `<td class="top-align" valign="top" style="mso-vertical-align: top;">${(
                  columnRenderer[field] || columnRenderer.default
                )(parent[field])}</td>`,
            )
            .join('')}</tr>${subtasks
            .map(
              (subtask) =>
                `<tr>${columns
                  .map(
                    ({ id: field }) =>
                      `<td>${(
                        columnRenderer[field] || columnRenderer.default
                      )(subtask.fields[field], subtask)}</td>`,
                  )
                  .join('')}</tr>`,
            )
            .join('')}`,
      )
      .join('')}</tbody>
  </table>
`,
    'text/html',
  ).querySelector('table')

export async function convertCommentReport(r) {
  const zz = r.issues.reduce((p, issue, idx) => {
    const { fields, key } = issue
    issue.fields.issuekey = key
    p[key] = { fields, key, order: idx }
    return p
  }, {})

  Object.values(zz).forEach((issue) => {
    const { subtasks } = issue.fields
    issue.subtasks = (subtasks || []).map(({ key }) => {
      zz[key].fields.issuekey = issue.fields.issuekey
      zz[key].fields.subtask = key
      return zz[key]
    })
    ;(subtasks || []).forEach(({ key }) => {
      delete zz[key]
    })
  })

  const data = Object.values(zz).sort(({ order: a }, { order: b }) => a - b)
  const table = createTable(fieldsForReport, data)
  await copyFormattedText(table.outerHTML)
  return table
}
