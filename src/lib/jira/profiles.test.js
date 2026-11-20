import test from 'node:test'
import assert from 'node:assert/strict'
import { parseProfile, toExport, isLegacyProfile } from './profiles.js'
import { SCHEMA_VERSION } from './config.js'

const LEGACY_EXPORT = {
  jira: {
    projects: [{ id: 'WEBEXP', name: 'WEBEXP' }],
    resolutions: [],
    sprints: [{ id: 264165, name: 'WebExp2025-S11' }],
    types: [{ id: 'Bug', name: 'Bug' }],
    status: [{ id: 'In Progress', name: 'In Progress' }],
    columns: [
      { id: 'issuekey', name: 'Issue Key' },
      { id: 'summary', name: 'Summary' },
    ],
    users: [{ id: 'mkaplan', name: 'Michael Kaplan', displayName: 'Michael Kaplan' }],
    orderBy: [],
    lookupList: {
      projects: ['WEBEXP'],
      issueType: ['Bug', 'User Story'],
      issueStatus: ['Open', 'In Progress'],
      resolutions: ['Unresolved'],
      fields: [
        { id: 'issuekey', name: 'Issue Key' },
        { id: 'summary', name: 'Summary' },
        { id: 'timeestimate', name: 'Remaining Estimate' },
      ],
    },
  },
}

test('detects the previous export shape', () => {
  assert.equal(isLegacyProfile(LEGACY_EXPORT), true)
  assert.equal(isLegacyProfile({ selection: {} }), false)
})

test('migrates a legacy profile', () => {
  const profile = parseProfile(LEGACY_EXPORT, { fallbackName: 'old.json' })

  assert.equal(profile.schemaVersion, SCHEMA_VERSION)
  assert.equal(profile.name, 'old.json')
  assert.deepEqual(profile.available.projects, [{ id: 'WEBEXP', name: 'WEBEXP' }])
  assert.deepEqual(profile.available.types, [
    { id: 'Bug', name: 'Bug' },
    { id: 'User Story', name: 'User Story' },
  ])
  assert.deepEqual(
    profile.selection.filters.sprints,
    [{ id: '264165', name: 'WebExp2025-S11' }],
  )
  assert.deepEqual(
    profile.selection.reportFields.map((field) => field.id),
    ['issuekey', 'summary'],
  )
  assert.deepEqual(
    profile.selection.fetchFields.map((field) => field.id),
    ['issuekey', 'summary', 'timeestimate'],
  )
  assert.deepEqual(profile.selection.resources, [
    { id: 'resource:mkaplan', name: 'Michael Kaplan' },
  ])
})

test('normalizes a modern profile and survives a round trip', () => {
  const modern = {
    schemaVersion: 1,
    name: 'WebExp',
    origin: 'https://jira.example.com',
    available: { fields: [{ id: 'issuekey', name: 'Key' }] },
    selection: {
      filters: { projects: ['WEBEXP'] },
      fetchFields: ['issuekey', 'summary'],
      reportFields: [{ id: 'summary', name: 'Summary' }],
      resources: [{ id: 'resource:jdoe', name: 'Jane Doe' }],
      orderBy: [{ id: 'summary', direction: 'desc' }],
    },
  }

  const profile = parseProfile(modern)
  assert.deepEqual(profile.selection.filters.projects, [
    { id: 'WEBEXP', name: 'WEBEXP' },
  ])
  assert.equal(profile.selection.orderBy[0].direction, 'DESC')

  const exported = toExport(profile)
  assert.deepEqual(parseProfile(exported), profile)
})

test('rejects junk and future schemas', () => {
  assert.throws(() => parseProfile(null), /JSON object/)
  assert.throws(() => parseProfile([]), /JSON object/)
  assert.throws(
    () => parseProfile({ schemaVersion: SCHEMA_VERSION + 1 }),
    /newer than this extension/,
  )
})

test('resources never collide with field ids', () => {
  const profile = parseProfile({
    selection: { resources: [{ id: 'assignee', name: 'Assignee Person' }] },
  })
  assert.equal(profile.selection.resources[0].id, 'resource:assignee')
})
