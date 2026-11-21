import test from 'node:test'
import assert from 'node:assert/strict'
import { COLUMN_RESULT_LIMIT, searchColumns } from './columnSearch.js'

const COLUMNS = [
  { label: '(deprecated) Status', value: 'customfield_1' },
  { label: 'Backstory', value: 'customfield_2' },
  { label: 'Status', value: 'status' },
  { label: 'Story Points', value: 'customfield_10008' },
  { label: 'Summary', value: 'summary' },
]

test('ranks exact and prefix matches ahead of substring matches', () => {
  const names = searchColumns(COLUMNS, 'status').map((field) => field.name)
  assert.deepEqual(names, ['Status', '(deprecated) Status'])
})

test('ranks word starts ahead of mid-word hits', () => {
  const names = searchColumns(COLUMNS, 'story').map((field) => field.name)
  assert.deepEqual(names, ['Story Points', 'Backstory'])
})

test('matches on the column id when the label does not', () => {
  const [match] = searchColumns(COLUMNS, 'customfield_10008')
  assert.deepEqual(match, { id: 'customfield_10008', name: 'Story Points' })
})

test('ignores case and surrounding whitespace', () => {
  assert.deepEqual(searchColumns(COLUMNS, '  STORY  ')[0].name, 'Story Points')
})

test('never throws on characters that are regex metacharacters', () => {
  assert.deepEqual(searchColumns(COLUMNS, '(').map((field) => field.name), [
    '(deprecated) Status',
  ])
})

test('caps the response so the popup never receives the whole catalog', () => {
  const many = Array.from({ length: 500 }, (_, index) => ({
    label: `Field ${index}`,
    value: `customfield_${index}`,
  }))
  assert.equal(searchColumns(many, 'Field').length, COLUMN_RESULT_LIMIT)
})

test('an empty query returns an alphabetical page, not API order', () => {
  const names = searchColumns(COLUMNS, '').map((field) => field.name)
  assert.deepEqual(names, [
    '(deprecated) Status',
    'Backstory',
    'Status',
    'Story Points',
    'Summary',
  ])
})
