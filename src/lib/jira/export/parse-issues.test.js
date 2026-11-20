import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { parseIssues } from './parse-issues.js'

const payload = JSON.parse(
  readFileSync(new URL('./fixtures/issues.json', import.meta.url), 'utf8'),
)

test('emits parents in payload order and nests their subtasks', () => {
  const { rows } = parseIssues(payload)

  assert.deepEqual(
    rows.map((row) => row.id),
    ['WEBEXP-95471', 'WEBEXP-95523'],
  )
  assert.deepEqual(
    rows[0].children.map((child) => child.id),
    ['WEBEXP-95583'],
  )
})

test('subtask rows repeat the parent key and own key', () => {
  const { rows } = parseIssues(payload)
  const child = rows[0].children[0]

  assert.equal(child.values.issuekey, 'WEBEXP-95471')
  assert.equal(child.values.subtask, 'WEBEXP-95583')
  assert.equal(child.values.summary, 'Update the dictionary values')
})

test('a subtask might appear before its parent in the payload', () => {
  const { rows } = parseIssues(payload)
  // WEBEXP-95583 is the first issue in the fixture.
  assert.equal(rows[0].id, 'WEBEXP-95471')
  assert.equal(rows.some((row) => row.id === 'WEBEXP-95583'), false)
})

test('unknown subtask references are ignored', () => {
  const { rows } = parseIssues(payload)
  const parent = rows.find((row) => row.id === 'WEBEXP-95523')

  assert.deepEqual(
    parent.children.map((child) => child.id),
    ['WEBEXP-95608'],
  )
})

test('handles an empty result', () => {
  assert.deepEqual(parseIssues({ total: 0, issues: [] }), { rows: [] })
  assert.deepEqual(parseIssues(null), { rows: [] })
})
