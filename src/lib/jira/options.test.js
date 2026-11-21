import test from 'node:test'
import assert from 'node:assert/strict'
import { dedupeOptions, filterOptions, toOption } from './options.js'

test('accepts the runner shape { id, name }', () => {
  assert.deepEqual(toOption({ id: 'Piseth.Peou', name: 'Piseth Peou' }), {
    value: 'Piseth.Peou',
    label: 'Piseth Peou',
  })
})

test('accepts the Mantine shape { value, label }', () => {
  assert.deepEqual(toOption({ value: 'summary', label: 'Summary' }), {
    value: 'summary',
    label: 'Summary',
  })
})

test('falls back to the id when a remote item has no name', () => {
  assert.deepEqual(toOption({ id: 'customfield_1' }), {
    value: 'customfield_1',
    label: 'customfield_1',
  })
})

test('rejects empty entries', () => {
  assert.equal(toOption(null), null)
  assert.equal(toOption({}), null)
  assert.equal(toOption({ id: '' }), null)
})

test('stringifies numeric sprint ids so they match the stored selection', () => {
  assert.deepEqual(toOption({ id: 264165, name: 'WebExp2025-S11' }), {
    value: '264165',
    label: 'WebExp2025-S11',
  })
})

test('merges both shapes and keeps the first label for a duplicate id', () => {
  assert.deepEqual(
    dedupeOptions([
      { value: 'summary', label: 'Summary' },
      { id: 'summary', name: 'Duplicate' },
      { id: 'customfield_1', name: 'Live only' },
    ]),
    [
      { value: 'summary', label: 'Summary' },
      { value: 'customfield_1', label: 'Live only' },
    ],
  )
})

test('tolerates a missing list', () => {
  assert.deepEqual(dedupeOptions(), [])
  assert.deepEqual(dedupeOptions(null), [])
})

const PROJECTS = [
  { value: 'WEBAVAST', label: 'Avast/AVG' },
  { value: 'WEBEXP', label: 'Web Experience' },
  { value: 'WEBST', label: 'Web Strategy' },
]

test('filters on the label', () => {
  assert.deepEqual(filterOptions({ options: PROJECTS, search: 'strategy' }), [
    { value: 'WEBST', label: 'Web Strategy' },
  ])
})

test('filters on the value so a project key finds its project', () => {
  assert.deepEqual(filterOptions({ options: PROJECTS, search: 'WEBAVAST' }), [
    { value: 'WEBAVAST', label: 'Avast/AVG' },
  ])
})

test('returns every option for an empty search and respects the limit', () => {
  assert.equal(filterOptions({ options: PROJECTS, search: '' }).length, 3)
  assert.equal(
    filterOptions({ options: PROJECTS, search: '', limit: 2 }).length,
    2,
  )
})

test('drops options that match neither side', () => {
  assert.deepEqual(filterOptions({ options: PROJECTS, search: 'zzz' }), [])
})
