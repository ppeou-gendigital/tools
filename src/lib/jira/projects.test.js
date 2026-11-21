import test from 'node:test'
import assert from 'node:assert/strict'
import { parseProjectPicker, normalizeProjectQuery, toProjectOption } from './projects.js'

test('takes the key and name from the picker payload', () => {
  assert.deepEqual(
    parseProjectPicker({
      projects: [
        {
          html: 'Avast/AVG&nbsp;(<strong>WEB</strong>AVAST)',
          name: 'Avast/AVG',
          key: 'WEBAVAST',
          id: '43701',
          avatar: 'https://jira.example.com/secure/projectavatar?pid=43701',
        },
      ],
      total: 9,
      header: 'Showing 1 of 9 matching projects',
    }),
    [{ id: 'WEBAVAST', name: 'Avast/AVG' }],
  )
})

test('keeps names with ampersands and punctuation intact', () => {
  assert.deepEqual(
    parseProjectPicker({
      projects: [
        {
          html: 'Analytics, Insights &amp; <strong>E</strong>xperimentation&nbsp;(AIE)',
          name: 'Analytics, Insights & Experimentation',
          key: 'AIE',
          id: '25805',
        },
      ],
    }),
    [{ id: 'AIE', name: 'Analytics, Insights & Experimentation' }],
  )
})

test('deduplicates by key and skips entries without a key', () => {
  assert.deepEqual(
    parseProjectPicker({
      projects: [
        { name: 'Web Experience', key: 'WEBEXP', id: '36100' },
        { name: 'Web Experience', key: 'WEBEXP', id: '36100' },
        { name: 'No key', id: '1' },
        { name: 'Blank key', key: '   ', id: '2' },
      ],
    }),
    [{ id: 'WEBEXP', name: 'Web Experience' }],
  )
})

test('falls back to the key when the name is missing or blank', () => {
  assert.deepEqual(
    parseProjectPicker({ projects: [{ key: 'WEBEXP' }, { key: 'ADS', name: '  ' }] }),
    [
      { id: 'WEBEXP', name: 'WEBEXP' },
      { id: 'ADS', name: 'ADS' },
    ],
  )
})

test('tolerates a missing or malformed payload', () => {
  assert.deepEqual(parseProjectPicker(), [])
  assert.deepEqual(parseProjectPicker(null), [])
  assert.deepEqual(parseProjectPicker({ projects: null }), [])
  assert.deepEqual(parseProjectPicker({ projects: 'nope' }), [])
})

test('reduces an issue key or browse URL to the project key', () => {
  assert.equal(normalizeProjectQuery('WEBAVAST'), 'WEBAVAST')
  assert.equal(normalizeProjectQuery('WEBAVAST-26648'), 'WEBAVAST')
  assert.equal(normalizeProjectQuery('webavast-26648'), 'webavast')
  assert.equal(
    normalizeProjectQuery('https://jira.corp.nortonlifelock.com/browse/WEBAVAST-26648'),
    'WEBAVAST',
  )
  assert.equal(
    normalizeProjectQuery('https://jira.corp.nortonlifelock.com/browse/WEBAVAST-26648/'),
    'WEBAVAST',
  )
  assert.equal(normalizeProjectQuery('web exp'), 'web exp')
})

test('takes the key straight out of a project URL', () => {
  assert.equal(
    normalizeProjectQuery('https://jira.corp.nortonlifelock.com/projects/WEBAVAST'),
    'WEBAVAST',
  )
  assert.equal(
    normalizeProjectQuery('https://jira.corp.nortonlifelock.com/projects/WEBEXP/summary'),
    'WEBEXP',
  )
  assert.equal(normalizeProjectQuery('/projects/WEBAVAST/'), 'WEBAVAST')
  assert.equal(
    normalizeProjectQuery('https://jira.corp.nortonlifelock.com/projects/WEBAVAST?foo=1#top'),
    'WEBAVAST',
  )
  assert.equal(normalizeProjectQuery('projects/WEBAVAST'), 'WEBAVAST')
})

test('shows the key beside a project whose name differs', () => {
  assert.deepEqual(toProjectOption({ id: 'WEBAVAST', name: 'Avast/AVG' }), {
    value: 'WEBAVAST',
    label: 'Avast/AVG (WEBAVAST)',
  })
})

test('does not repeat the key when name and id match or already carry it', () => {
  assert.deepEqual(toProjectOption({ id: 'ADS', name: 'ADS' }), {
    value: 'ADS',
    label: 'ADS',
  })
  assert.deepEqual(toProjectOption({ id: 'WEBEXP', name: 'Web Experience (WEBEXP)' }), {
    value: 'WEBEXP',
    label: 'Web Experience (WEBEXP)',
  })
})

test('falls back to the key when the name is missing', () => {
  assert.deepEqual(toProjectOption({ id: 'WEBEXP' }), {
    value: 'WEBEXP',
    label: 'WEBEXP',
  })
})
