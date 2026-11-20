import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveFields, getField, FIELD_KIND } from './fields.js'

test('resolveFields keeps order and drops duplicates', () => {
  const fields = resolveFields(['summary', 'issuekey', 'summary'])
  assert.deepEqual(
    fields.map((field) => field.id),
    ['summary', 'issuekey'],
  )
})

test('unknown custom fields fall back to plain text', () => {
  assert.deepEqual(getField('customfield_99999'), {
    id: 'customfield_99999',
    name: 'customfield_99999',
    kind: FIELD_KIND.TEXT,
  })
})

test('known kinds drive rendering', () => {
  assert.equal(getField('timeestimate').kind, FIELD_KIND.SECONDS)
  assert.equal(getField('assignee').kind, FIELD_KIND.USER)
  assert.equal(getField('comment').kind, FIELD_KIND.COMMENTS)
})
