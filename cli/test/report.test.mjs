import test from 'node:test'
import assert from 'node:assert/strict'

import {
  capacityFields,
  capacityTable,
  personTotals,
  rowsFromSearch,
} from '../src/report.mjs'
import { createSelection } from '../../src/lib/jira/profiles.js'
import { resolveFields } from '../../src/lib/jira/fields.js'

const FIELDS = ['issuekey', 'summary', 'timeestimate']

function selection() {
  return createSelection({
    filters: { projects: [{ id: 'WEBEXP', name: 'WEBEXP' }] },
    fetchFields: resolveFields(FIELDS),
    reportFields: resolveFields(FIELDS),
    resources: [
      { id: 'resource:alice', name: 'Alice' },
      { id: 'resource:bob', name: 'Bob' },
    ],
  })
}

const payload = {
  issues: [
    {
      key: 'WEBEXP-1',
      fields: {
        summary: 'Parent one',
        assignee: { displayName: 'Alice' },
        timeestimate: 7200,
      },
    },
    {
      key: 'WEBEXP-2',
      fields: { summary: 'Parent two', assignee: { displayName: 'Alice' } },
    },
    // Subtask before its parent in the payload.
    {
      key: 'WEBEXP-11',
      fields: {
        parent: { key: 'WEBEXP-1' },
        summary: 'Child one',
        assignee: { displayName: 'Alice' },
        timeestimate: 3600,
      },
    },
    {
      key: 'WEBEXP-12',
      fields: {
        parent: { key: 'WEBEXP-1' },
        summary: 'Child two',
        assignee: { displayName: 'Bob' },
        timeestimate: 1800,
      },
    },
    {
      key: 'WEBEXP-99',
      fields: {
        parent: { key: 'WEBEXP-9' },
        summary: 'Orphan subtask',
        assignee: { displayName: 'Bob' },
        timeestimate: 600,
      },
    },
  ],
}

test('capacityFields adds parent and drops frontend-only ids', () => {
  const fields = capacityFields(selection())

  assert.ok(fields.includes('parent'))
  assert.equal(fields.includes('issuekey'), false)
  assert.equal(fields.includes('subtask'), false)
})

test('subtask hours roll up by assignee on the parent row', () => {
  const { rows } = rowsFromSearch(payload)

  assert.deepEqual(
    rows.map((row) => row.id),
    ['WEBEXP-1', 'WEBEXP-2'],
  )
  assert.equal(rows[0].subtaskHours.Alice, 3600)
  assert.equal(rows[0].subtaskHours.Bob, 1800)
  assert.equal(rows[1].subtaskHours.Alice, undefined)
})

test('a subtask whose parent is not in the result is dropped', () => {
  const { rows } = rowsFromSearch(payload)

  assert.equal(rows.some((row) => row.id === 'WEBEXP-99'), false)
  assert.equal(rows.some((row) => row.id === 'WEBEXP-9'), false)
})

test('capacityTable renders one column per resource and no child rows', () => {
  const table = capacityTable({
    selection: selection(),
    payload,
    origin: 'https://jira.example',
  })

  assert.equal(table.issues, 2)
  assert.equal(table.rowCount, 2)
  assert.match(table.html, />1</)
  assert.match(table.html, />0.5</)
  assert.match(table.html, /Alice/)
  assert.deepEqual(table.people, [
    { name: 'Alice', hours: 1 },
    { name: 'Bob', hours: 0.5 },
  ])
})

test('personTotals survives a row with no subtasks', () => {
  const totals = personTotals(
    [{ values: {}, subtaskHours: {} }],
    [{ id: 'resource:alice', name: 'Alice' }],
  )

  assert.deepEqual(totals, [{ name: 'Alice', hours: 0 }])
})

test('an empty payload yields an empty table', () => {
  const table = capacityTable({
    selection: selection(),
    payload: { issues: [] },
    origin: 'https://jira.example',
  })

  assert.equal(table.issues, 0)
  assert.equal(table.rowCount, 0)
})
