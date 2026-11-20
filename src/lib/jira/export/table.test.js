import test from 'node:test'
import assert from 'node:assert/strict'
import { buildTableHtml } from './table.js'
import { applyResourceHours, countRows } from './rows.js'

const ORIGIN = 'https://jira.example.com'

const COLUMNS = [
  { id: 'issuekey', name: 'Issue Key' },
  { id: 'summary', name: 'Summary' },
  { id: 'timeestimate', name: 'Remaining Estimate' },
]

test('renders a header row from the columns', () => {
  const html = buildTableHtml({ columns: COLUMNS, rows: [], origin: ORIGIN })
  assert.match(html, /<thead><tr><td>Issue Key<\/td><td>Summary<\/td><td>Remaining Estimate<\/td><\/tr><\/thead>/)
})

test('renders parent and subtask rows', () => {
  const html = buildTableHtml({
    columns: COLUMNS,
    origin: ORIGIN,
    rows: [
      {
        id: 'WEBEXP-1',
        values: { issuekey: 'WEBEXP-1', summary: 'Parent', timeestimate: 7200 },
        children: [
          {
            id: 'WEBEXP-2',
            values: { issuekey: 'WEBEXP-1', subtask: 'WEBEXP-2', summary: 'Child' },
          },
        ],
      },
    ],
  })

  assert.equal((html.match(/<tr>/g) ?? []).length, 3)
  assert.match(html, /href="https:\/\/jira.example.com\/browse\/WEBEXP-1"/)
  assert.match(html, /<td class="top-align" valign="top" style="mso-vertical-align: top;">/)
})

test('escapes values and column names', () => {
  const html = buildTableHtml({
    columns: [...COLUMNS, { id: 'x', name: '<b>Bold</b>' }],
    rows: [{ id: '1', values: { summary: '<script>alert(1)</script>' } }],
    origin: ORIGIN,
  })

  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)
  assert.match(html, /&lt;b&gt;Bold&lt;\/b&gt;/)
  assert.doesNotMatch(html, /<script>/)
})

test('resource hours land in their own columns and blank zeros', () => {
  const resources = [
    { id: 'resource:mkaplan', name: 'Michael Kaplan' },
    { id: 'resource:jdoe', name: 'Jane Doe' },
  ]
  const rows = applyResourceHours(
    [
      { id: 'WEBEXP-1', values: {}, subtaskHours: { 'Michael Kaplan': 7200 } },
      { id: 'WEBEXP-2', values: {}, subtaskHours: { 'Michael Kaplan': 0 } },
    ],
    resources,
  )

  assert.equal(rows[0].values['resource:mkaplan'], 2)
  assert.equal(rows[0].values['resource:jdoe'], '')
  assert.equal(rows[1].values['resource:mkaplan'], '')

  const html = buildTableHtml({
    columns: [{ id: 'resource:mkaplan', name: 'Michael Kaplan' }],
    rows,
    origin: ORIGIN,
  })
  assert.match(html, /<td>2<\/td>/)
})

test('countRows includes nested subtasks', () => {
  assert.equal(countRows([{ children: [{}, {}] }, {}]), 4)
})
