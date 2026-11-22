import test from 'node:test'
import assert from 'node:assert/strict'
import { createBlankProfile, parseProfile, toExport, isLegacyProfile } from './profiles.js'
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
  assert.deepEqual(
    profile.selection.fetchFields.find((field) => field.id === 'timeestimate'),
    { id: 'timeestimate', name: 'Remaining Estimate' },
  )
  assert.deepEqual(profile.selection.resources, [
    { id: 'resource:mkaplan', name: 'Michael Kaplan' },
  ])
  assert.equal('available' in profile, false)
})

test('normalizes a modern profile and survives a round trip', () => {
  const modern = {
    schemaVersion: 1,
    name: 'WebExp',
    origin: 'https://jira.example.com',
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

test('does not persist an option catalog', () => {
  const profile = parseProfile({
    available: {
      projects: [{ id: 'WEBEXP', name: 'Web Experience' }],
      fields: [{ id: 'summary', name: 'Summary' }],
    },
    selection: {
      filters: { projects: [{ id: 'WEBEXP', name: 'Web Experience' }] },
    },
  })

  const exported = toExport(profile)
  assert.equal('available' in exported, false)
  assert.deepEqual(exported.selection.filters.projects, [
    { id: 'WEBEXP', name: 'Web Experience' },
  ])
})

test('rejects junk and future schemas', () => {
  assert.throws(() => parseProfile(null), /JSON object/)
  assert.throws(() => parseProfile([]), /JSON object/)
  assert.throws(
    () => parseProfile({ schemaVersion: SCHEMA_VERSION + 1 }),
    /newer than this extension/,
  )
})

test('stamps identity and lifecycle metadata', () => {
  const profile = parseProfile({ name: 'WebExp' })

  assert.match(profile.id, /^[0-9a-f-]{36}$/)
  assert.ok(profile.createdAt)
  assert.equal(profile.updatedAt, profile.createdAt)
  assert.equal(profile.createdBy, '')
  assert.equal(profile.schemaVersion, SCHEMA_VERSION)

  const supplied = parseProfile({
    name: 'Shared',
    id: 'fixed-id',
    createdAt: '2026-01-01T00:00:00.000Z',
    createdBy: 'Jane Doe',
    updatedAt: '2026-02-01T00:00:00.000Z',
    updatedBy: 'John Doe',
  })
  assert.equal(supplied.id, 'fixed-id')
  assert.equal(supplied.createdBy, 'Jane Doe')
  assert.equal(supplied.updatedBy, 'John Doe')

  const roundTripped = parseProfile(toExport(supplied))
  assert.equal(roundTripped.id, 'fixed-id')
  assert.equal(roundTripped.createdAt, '2026-01-01T00:00:00.000Z')
  assert.equal(roundTripped.updatedAt, '2026-02-01T00:00:00.000Z')
  assert.equal(roundTripped.updatedBy, 'John Doe')
})

test('a profile created from scratch starts empty', () => {
  const profile = createBlankProfile({ name: 'WebExp' })

  assert.deepEqual(profile.selection.fetchFields, [])
  assert.deepEqual(profile.selection.reportFields, [])
  assert.deepEqual(profile.selection.resources, [])
  assert.deepEqual(profile.selection.filters.projects, [])
  assert.equal(profile.name, 'WebExp')
})

test('resources never collide with field ids', () => {
  const profile = parseProfile({
    selection: { resources: [{ id: 'assignee', name: 'Assignee Person' }] },
  })
  assert.equal(profile.selection.resources[0].id, 'resource:assignee')
})
