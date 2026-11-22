import test from 'node:test'
import assert from 'node:assert/strict'
import {
  alignFieldOrder,
  applyFieldRows,
  toggleReportVisibility,
} from './fieldSelection.js'

const field = (id, name = id) => ({ id, name })

test('keeps the fetched order when the visible subset already matches', () => {
  const fetch = [
    field('summary'),
    field('rank'),
    field('issuekey'),
    field('assignee'),
  ]

  const aligned = alignFieldOrder(fetch, [field('summary'), field('issuekey')])

  assert.deepEqual(aligned.map((entry) => entry.id), [
    'summary',
    'rank',
    'issuekey',
    'assignee',
  ])
})

test('puts legacy report columns first, then fetch-only fields', () => {
  const aligned = alignFieldOrder(
    [field('issuekey'), field('rank'), field('summary'), field('status')],
    [field('summary'), field('issuekey')],
  )

  assert.deepEqual(aligned.map((entry) => entry.id), [
    'summary',
    'issuekey',
    'rank',
    'status',
  ])
})

test('adds a report column that is missing from the fetch list', () => {
  const aligned = alignFieldOrder(
    [field('issuekey')],
    [field('issuekey'), field('summary')],
  )

  assert.deepEqual(aligned.map((entry) => entry.id), ['issuekey', 'summary'])
})

test('aligning drops duplicates and keeps the report name', () => {
  const aligned = alignFieldOrder(
    [field('summary', 'Old Summary'), field('issuekey')],
    [field('summary', 'Summary')],
  )

  assert.deepEqual(aligned, [field('summary', 'Summary'), field('issuekey')])
})

test('applyFieldRows stores the list order and only visible report columns', () => {
  const rows = [field('summary'), field('rank'), field('issuekey')]
  const result = applyFieldRows(rows, new Set(['rank', 'summary']))

  assert.deepEqual(
    result.fetchFields.map((entry) => entry.id),
    ['summary', 'rank', 'issuekey'],
  )
  assert.deepEqual(
    result.reportFields.map((entry) => entry.id),
    ['summary', 'rank'],
  )
})

test('applyFieldRows ignores visible ids that are not in the list', () => {
  const result = applyFieldRows([field('a')], new Set(['a', 'ghost']))

  assert.deepEqual(
    result.reportFields.map((entry) => entry.id),
    ['a'],
  )
})

test('toggleReportVisibility flips membership without reordering', () => {
  const shown = toggleReportVisibility([field('a'), field('b')], 'c')
  assert.deepEqual([...shown], ['a', 'b', 'c'])

  const hidden = toggleReportVisibility([field('a'), field('b')], 'a')
  assert.deepEqual([...hidden], ['b'])
})
