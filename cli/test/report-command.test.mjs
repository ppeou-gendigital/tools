import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { runReport } from '../src/commands/report.mjs'
import { findProfile, loadSources, writeProfile } from '../src/store.mjs'
import { createProfile } from '../../src/lib/jira/profiles.js'

const PAYLOAD = {
  issues: [
    {
      key: 'WEBEXP-1',
      fields: {
        summary: 'Parent',
        assignee: { displayName: 'Alice' },
        timeestimate: 3600,
      },
    },
    {
      key: 'WEBEXP-11',
      fields: {
        parent: { key: 'WEBEXP-1' },
        summary: 'Child',
        assignee: { displayName: 'Alice' },
        timeestimate: 3600,
      },
    },
  ],
}

function setup({ filters = { projects: [{ id: 'WEBEXP', name: 'WEBEXP' }] } } = {}) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'jira-capacity-report-'))
  const env = { JIRA_CAPACITY_HOME: home }
  const profile = createProfile({ name: 'Web' })
  profile.selection.filters = {
    projects: [],
    resolutions: [],
    sprints: [],
    types: [],
    statuses: [],
    ...filters,
  }
  profile.selection.resources = [{ id: 'resource:alice', name: 'Alice' }]
  writeProfile(profile, env)

  const calls = { jql: [], fields: [], counts: 0 }
  const jira = {
    count: async (jql) => {
      calls.counts += 1
      calls.jql.push(jql)
      return jql.includes('subTaskIssueTypes') ? 1 : PAYLOAD.issues.length
    },
    searchAll: async (jql, { fields }) => {
      calls.jql.push(jql)
      calls.fields.push(fields)
      return { issues: PAYLOAD.issues, total: PAYLOAD.issues.length }
    },
    sprintPicker: async () => [{ id: '123', name: 'Sprint 21' }],
    myself: async () => ({ displayName: 'Tester' }),
  }

  const results = []
  const ctx = {
    env,
    json: true,
    jiraBase: 'https://jira.example',
    jira: () => jira,
    out: {
      result: (value) => {
        results.push(value)
        return value
      },
      warn() {},
      debug() {},
      line() {},
      info() {},
    },
  }

  return { env, profile, calls, results, ctx, home }
}

test('report --out writes an HTML table and reports row counts', async () => {
  const { env, profile, calls, results, ctx, home } = setup()
  const out = path.join(home, 'report.xls')

  await runReport(
    ['--profile', 'Web', '--sprint', 'Sprint 21', '--out', out, '--save'],
    ctx,
  )

  const result = results.at(-1)
  assert.equal(result.issues, 1)
  assert.equal(result.rows, 1)
  assert.equal(result.saved, true)
  assert.equal(result.target, out)
  assert.ok(fs.existsSync(out))
  assert.match(fs.readFileSync(out, 'utf8'), /<table>/)

  assert.ok(calls.jql[0].includes('Sprint in (123)'))
  assert.ok(calls.fields[0].includes('parent'))
  assert.ok(calls.fields[0].includes('timeestimate'))
  assert.equal(calls.fields[0].includes('issuekey'), false)

  // --save moved the resolved sprint into the local profile.
  const saved = findProfile(profile.id, env).profile
  assert.deepEqual(saved.selection.filters.sprints, [
    { id: '123', name: 'Sprint 21' },
  ])
  assert.equal(saved.updatedBy, 'Tester')
})

test('dry-run counts only and writes nothing', async () => {
  const { calls, results, ctx, home } = setup()
  const out = path.join(home, 'dry.xls')

  await runReport(
    ['--profile', 'Web', '--sprint', 'Sprint 21', '--out', out, '--dry-run'],
    ctx,
  )

  const result = results.at(-1)
  assert.equal(result.dryRun, true)
  assert.equal(result.matches, 2)
  assert.equal(result.issues, 1)
  assert.equal(result.sprint.name, 'Sprint 21')
  assert.match(result.jql, /Sprint in \(123\)/)
  assert.equal(calls.counts, 2)
  assert.equal(calls.fields.length, 0)
  assert.equal(fs.existsSync(out), false)
})

test('a profile with no filters is refused before any search', async () => {
  const { calls, ctx } = setup({ filters: {} })

  await assert.rejects(
    runReport(['--profile', 'Web'], ctx),
    /no filters/,
  )
  assert.equal(calls.jql.length, 0)
})

test('--copy and --out together is a usage error', async () => {
  const { ctx } = setup()

  await assert.rejects(
    runReport(['--profile', 'Web', '--copy', '--out', 'x.xls'], ctx),
    /not both/,
  )
})

test('--save without a sprint flag leaves the profile untouched', async () => {
  const { env, profile, ctx, home } = setup()
  const before = findProfile(profile.id, env).profile.updatedAt

  await runReport(
    ['--profile', 'Web', '--out', path.join(home, 'noop.xls'), '--save'],
    ctx,
  )

  assert.equal(findProfile(profile.id, env).profile.updatedAt, before)
})

test('a successful run leaves sources untouched', async () => {
  const { env, profile, ctx, home } = setup()

  await runReport(
    ['--profile', 'Web', '--out', path.join(home, 'r.xls')],
    ctx,
  )

  assert.deepEqual(loadSources(env).profiles[profile.id] ?? {}, {})
})
