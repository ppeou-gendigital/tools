import test from 'node:test'
import assert from 'node:assert/strict'
import { formatHours, renderCell, escapeHtml } from './cells.js'
import { getField } from '../fields.js'

const ORIGIN = 'https://jira.example.com'

test('formatHours converts seconds to a rounded hour value', () => {
  assert.equal(formatHours(7200), 2)
  assert.equal(formatHours(3600), 1)
  assert.equal(formatHours(5400), 1.5)
  assert.equal(formatHours(0), 0)
  assert.equal(formatHours(null), '')
  assert.equal(formatHours(''), '')
  assert.equal(formatHours('n/a'), '')
})

test('escapeHtml neutralizes markup', () => {
  assert.equal(escapeHtml('<img src=x onerror="a">'), '&lt;img src=x onerror=&quot;a&quot;&gt;')
})

test('text cells are escaped', () => {
  assert.equal(
    renderCell(getField('summary'), 'Meridian <broken> & "quoted"', { origin: ORIGIN }),
    'Meridian &lt;broken&gt; &amp; &quot;quoted&quot;',
  )
})

test('key cells become browse links', () => {
  assert.equal(
    renderCell(getField('subtask'), 'WEBEXP-123', { origin: ORIGIN }),
    '<a data-issue-key="WEBEXP-123" href="https://jira.example.com/browse/WEBEXP-123">WEBEXP-123</a>',
  )
  assert.equal(renderCell(getField('issuekey'), '', { origin: ORIGIN }), '')
})

test('user cells show the display name', () => {
  assert.equal(
    renderCell(getField('assignee'), { name: 'mkaplan', displayName: 'Michael Kaplan' }),
    'Michael Kaplan',
  )
  assert.equal(renderCell(getField('assignee'), 'Michael Kaplan'), 'Michael Kaplan')
  assert.equal(renderCell(getField('assignee'), null), '')
})

test('hour cells render as numbers', () => {
  assert.equal(renderCell(getField('timeestimate'), 7200), '2')
  assert.equal(renderCell(getField('timeestimate'), null), '')
})

test('flagged cells ignore disabled entries', () => {
  assert.equal(
    renderCell(getField('customfield_10006'), [{ value: 'Impediment' }]),
    'Impediment',
  )
  assert.equal(
    renderCell(getField('customfield_10006'), [{ value: 'Impediment', disable: true }]),
    '',
  )
  assert.equal(renderCell(getField('customfield_10006'), []), '')
})

test('comment cells expand every comment with spreadsheet-safe breaks', () => {
  const html = renderCell(getField('comment'), {
    total: 1,
    comments: [
      {
        author: { displayName: 'Jane <Doe>' },
        updateAuthor: { displayName: 'Jane <Doe>' },
        body: 'Looks <b>good</b>',
        created: '2025-05-28T15:45:00.000+0000',
        updated: '2025-05-28T15:45:00.000+0000',
      },
    ],
  })

  assert.match(html, /Looks <b>good<\/b>/)
  assert.match(html, /Created by Jane &lt;Doe&gt;/)
  assert.match(html, /mso-data-placement:same-cell/)
  assert.doesNotMatch(html, /Updated by/)
})

test('comment cells report edits separately', () => {
  const html = renderCell(getField('comment'), {
    total: 1,
    comments: [
      {
        author: { displayName: 'Jane' },
        updateAuthor: { displayName: 'John' },
        body: 'Edited',
        created: '2025-05-28T15:45:00.000+0000',
        updated: '2025-05-29T08:00:00.000+0000',
      },
    ],
  })

  assert.match(html, /Created by Jane/)
  assert.match(html, /Updated by John/)
})

test('empty comment sets render nothing', () => {
  assert.equal(renderCell(getField('comment'), { total: 0, comments: [] }), '')
  assert.equal(renderCell(getField('comment'), null), '')
})
