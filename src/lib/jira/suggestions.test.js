import test from 'node:test'
import assert from 'node:assert/strict'
import { parseSuggestions } from './suggestions.js'

test('unquotes JQL values that contain spaces', () => {
  assert.deepEqual(
    parseSuggestions({
      results: [
        { value: 'Open', displayName: '<b>Open</b>' },
        { value: '"Open, Blocked"', displayName: '<b>Open</b>, Blocked' },
      ],
    }),
    [
      { id: 'Open', name: 'Open' },
      { id: 'Open, Blocked', name: 'Open, Blocked' },
    ],
  )
})

test('keeps punctuation and unescapes embedded quotes', () => {
  assert.deepEqual(
    parseSuggestions({
      results: [
        { value: '"ER&C Pending Response"' },
        { value: '"Fixed – With Artifact"' },
        { value: '"Say \\"hi\\" now"' },
      ],
    }),
    [
      { id: 'ER&C Pending Response', name: 'ER&C Pending Response' },
      { id: 'Fixed – With Artifact', name: 'Fixed – With Artifact' },
      { id: 'Say "hi" now', name: 'Say "hi" now' },
    ],
  )
})

test('deduplicates names case-insensitively', () => {
  assert.deepEqual(
    parseSuggestions({
      results: [{ value: 'Open' }, { value: '"Open"' }, { value: 'OPEN' }],
    }),
    [{ id: 'Open', name: 'Open' }],
  )
})

test('drops blanks and tolerates an empty response', () => {
  assert.deepEqual(parseSuggestions({ results: [{ value: '  ' }, {}] }), [])
  assert.deepEqual(parseSuggestions({}), [])
  assert.deepEqual(parseSuggestions(null), [])
  assert.deepEqual(parseSuggestions({ results: [] }), [])
})
