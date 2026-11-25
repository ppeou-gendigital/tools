import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import {
  findProfile,
  isDirty,
  listProfiles,
  loadSources,
  parseTarget,
  recordPublication,
  summarizeProfile,
  writeProfile,
  writeProfileFile,
} from '../src/store.mjs'
import { createProfile } from '../../src/lib/jira/profiles.js'

function tempEnv() {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'jira-capacity-test-'))
  return { JIRA_CAPACITY_HOME: home }
}

test('writes a profile and reads it back by name or id', () => {
  const env = tempEnv()
  const profile = createProfile({ name: 'Web Exp' })
  const written = writeProfile(profile, env)

  assert.ok(fs.existsSync(written.file))
  assert.equal(findProfile('Web Exp', env).profile.id, profile.id)
  assert.equal(findProfile(profile.id, env).profile.name, 'Web Exp')
  assert.equal(listProfiles(env).length, 1)
})

test('keeps the remote file name on pull', () => {
  const env = tempEnv()
  const profile = createProfile({ name: 'Shared' })
  const written = writeProfileFile(profile, 'Shared_team.json', env)

  assert.equal(written.filename, 'Shared_team.json')
  assert.equal(findProfile('Shared', env).filename, 'Shared_team.json')
})

test('publication makes a profile current until it is edited', () => {
  const env = tempEnv()
  const profile = createProfile({ name: 'Team' })
  writeProfile(profile, env)

  assert.equal(isDirty(profile, loadSources(env)), true)

  recordPublication(
    profile.id,
    'confluence:123',
    { filename: 'Team.json', version: 2 },
    env,
  )

  const sources = loadSources(env)
  assert.equal(isDirty(profile, sources), false)

  const edited = { ...profile, updatedAt: new Date(Date.now() + 60_000).toISOString() }
  assert.equal(isDirty(edited, sources), true)
})

test('summary reports filters, fields, people, and publications', () => {
  const env = tempEnv()
  const profile = createProfile({ name: 'Summary' })
  profile.selection.filters.projects = [{ id: 'WEBEXP', name: 'WEBEXP' }]
  profile.selection.resources = [{ id: 'resource:alice', name: 'Alice' }]
  recordPublication(profile.id, 'jira:WEBEXP-1', { filename: 'S.json' }, env)

  const summary = summarizeProfile(profile, loadSources(env), { filename: 'x.json' })

  assert.deepEqual(summary.projects, ['WEBEXP'])
  assert.deepEqual(summary.people, ['Alice'])
  assert.equal(summary.filename, 'x.json')
  assert.equal(summary.publications[0].target, 'jira:WEBEXP-1')
  assert.equal(summary.dirty, false)
})

test('parseTarget accepts keys, ids, and pasted URLs', () => {
  assert.deepEqual(parseTarget('jira:WEBEXP-123'), {
    kind: 'jira',
    id: 'WEBEXP-123',
    key: 'jira:WEBEXP-123',
  })
  assert.equal(
    parseTarget('confluence:https://confluence.example/pages/1049602420/Guide')
      .id,
    '1049602420',
  )
  assert.equal(
    parseTarget('jira:https://jira.example/browse/WEBEXP-9?filter=1').id,
    'WEBEXP-9',
  )
  assert.throws(() => parseTarget('WEBEXP-123'), /exactly one target/)
})
