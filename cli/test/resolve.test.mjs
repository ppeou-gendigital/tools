import test from 'node:test'
import assert from 'node:assert/strict'

import {
  resolveFields,
  resolvePeople,
  resolveProjects,
  resolveSprint,
} from '../src/resolve.mjs'

function fakeJira(overrides = {}) {
  return {
    sprintPicker: async () => [],
    fieldCatalog: async () => [],
    peopleSearch: async () => [],
    projectSearch: async () => [],
    suggest: async () => [],
    ...overrides,
  }
}

test('resolves an exact sprint name to its numeric id', async () => {
  const jira = fakeJira({
    sprintPicker: async () => [
      { id: '123', name: 'Sprint 21' },
      { id: '124', name: 'Sprint 210' },
    ],
  })

  assert.deepEqual(await resolveSprint(jira, 'Sprint 21'), {
    id: '123',
    name: 'Sprint 21',
  })
})

test('resolves a numeric sprint id and keeps the live name', async () => {
  const jira = fakeJira({
    sprintPicker: async () => [{ id: '123', name: 'Sprint 21' }],
  })

  assert.deepEqual(await resolveSprint(jira, '123'), {
    id: '123',
    name: 'Sprint 21',
  })
})

test('refuses an ambiguous sprint name and points at ids', async () => {
  const jira = fakeJira({
    sprintPicker: async () => [
      { id: '1', name: 'Sprint 1' },
      { id: '2', name: 'Sprint 1' },
    ],
  })

  await assert.rejects(resolveSprint(jira, 'Sprint 1'), /matches 2 sprints/)
})

test('suggests near sprint names when nothing matches', async () => {
  const jira = fakeJira({
    sprintPicker: async () => [{ id: '123', name: 'Sprint 21' }],
  })

  await assert.rejects(resolveSprint(jira, 'Sprint 22'), /Closest matches: Sprint 21/)
})

test('known field ids need no catalog request', async () => {
  const jira = fakeJira({
    fieldCatalog: async () => {
      throw new Error('catalog should not be called')
    },
  })

  assert.deepEqual(await resolveFields(jira, ['issuekey', 'Story Points']), [
    { id: 'issuekey', name: 'Issue Key' },
    { id: 'customfield_10008', name: 'Story Points' },
  ])
})

test('unknown field names come from the live catalog', async () => {
  const jira = fakeJira({
    fieldCatalog: async () => [
      { id: 'customfield_1', name: 'Team', custom: true },
    ],
  })

  assert.deepEqual(await resolveFields(jira, ['team']), [
    { id: 'customfield_1', name: 'Team' },
  ])
})

test('an unknown field fails with the search hint', async () => {
  const jira = fakeJira({ fieldCatalog: async () => [] })

  await assert.rejects(resolveFields(jira, ['nope']), /fields search nope/)
})

test('people must match by display name or username', async () => {
  const jira = fakeJira({
    peopleSearch: async () => [
      { id: 'akim', name: 'Alice Kim' },
      { id: 'bob', name: 'Bob Stone' },
    ],
  })

  assert.deepEqual(await resolvePeople(jira, ['alice kim']), [
    { id: 'akim', name: 'Alice Kim' },
  ])
  assert.deepEqual(await resolvePeople(jira, ['bob']), [
    { id: 'bob', name: 'Bob Stone' },
  ])
  await assert.rejects(resolvePeople(jira, ['Alic']), /Closest matches: Alice Kim/)
})

test('projects resolve by key or name', async () => {
  const jira = fakeJira({
    projectSearch: async () => [
      { id: 'WEBEXP', name: 'Web Experience' },
    ],
  })

  assert.deepEqual(await resolveProjects(jira, ['webexp']), [
    { id: 'WEBEXP', name: 'Web Experience' },
  ])
  assert.deepEqual(await resolveProjects(jira, ['Web Experience']), [
    { id: 'WEBEXP', name: 'Web Experience' },
  ])
})
