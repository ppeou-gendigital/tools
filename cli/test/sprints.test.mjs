import test from 'node:test'
import assert from 'node:assert/strict'

import { runSprints } from '../src/commands/lookup.mjs'
import { CliError } from '../src/http.mjs'

function harness(jira) {
  const results = []
  const output = []
  const ctx = {
    env: {},
    json: true,
    jira: () => jira,
    out: {
      result: (value, render) => {
        results.push(value)
        if (typeof render === 'function') output.push(render(value))
        return value
      },
      info: (text) => output.push(text),
      warn() {},
      debug() {},
      line: (text) => output.push(text),
    },
  }
  return { ctx, results, output }
}

const SPRINT = {
  id: '123',
  name: 'Sprint 21',
  state: 'future',
  startDate: '2026-11-24T00:00:00.000Z',
  endDate: '2026-12-05T00:00:00.000Z',
}

test('prefers the board API so an empty upcoming sprint still appears', async () => {
  const calls = []
  const jira = {
    agileBoards: async (project) => {
      calls.push(['agileBoards', project])
      return [{ id: '5', name: 'WEBEXP board', type: 'scrum' }]
    },
    agileSprints: async (board, options) => {
      calls.push(['agileSprints', board, options.state])
      return [{ ...SPRINT, board }]
    },
    sprints: async () => {
      throw new Error('JQL fallback should not run')
    },
  }

  const { ctx, results } = harness(jira)
  await runSprints(['--project', 'webexp', '--state', 'future'], ctx)

  const result = results.at(-1)
  assert.equal(result.source, 'board')
  assert.equal(result.board.name, 'WEBEXP board')
  assert.equal(result.project, 'WEBEXP')
  assert.deepEqual(result.sprints.map((sprint) => sprint.id), ['123'])
  assert.deepEqual(calls, [
    ['agileBoards', 'WEBEXP'],
    ['agileSprints', '5', 'future'],
  ])
})

test('falls back to JQL when the Agile API is unavailable', async () => {
  const calls = []
  const jira = {
    agileBoards: async () => {
      throw new CliError('Jira did not find /rest/agile/1.0/board (404).', {
        code: 'not-found',
        status: 404,
      })
    },
    sprints: async (project, { state }) => {
      calls.push([project, state])
      return [SPRINT]
    },
  }

  const { ctx, results } = harness(jira)
  await runSprints(['--project', 'WEBEXP', '--state', 'future'], ctx)

  const result = results.at(-1)
  assert.equal(result.source, 'jql')
  assert.equal(result.board, null)
  assert.deepEqual(calls, [['WEBEXP', 'future']])
})

test('a bad PAT surfaces instead of silently falling back', async () => {
  const jira = {
    agileBoards: async () => {
      throw new CliError('Jira rejected the PAT (401).', {
        code: 'unauthorized',
        status: 401,
      })
    },
    sprints: async () => {
      throw new Error('JQL fallback should not run')
    },
  }

  const { ctx } = harness(jira)
  await assert.rejects(runSprints(['--project', 'WEBEXP'], ctx), /rejected the PAT/)
})

test('--state all asks the board for active and future sprints', async () => {
  const asked = []
  const jira = {
    agileBoards: async () => [{ id: '5', name: 'Board', type: 'scrum' }],
    agileSprints: async (board, { state }) => {
      asked.push(state)
      return []
    },
  }

  const { ctx, results } = harness(jira)
  await runSprints(['--project', 'WEBEXP', '--state', 'all'], ctx)

  assert.deepEqual(asked, ['all'])
  assert.deepEqual(results.at(-1).sprints, [])
})

test('rejects an invalid state and a non-key project', async () => {
  const jira = { agileBoards: async () => [], sprints: async () => [] }
  const { ctx } = harness(jira)

  await assert.rejects(runSprints(['--state', 'later'], ctx), /must be future, active, or all/)
  await assert.rejects(
    runSprints(['--project', 'not a key'], ctx),
    /does not look like a Jira project key/,
  )
})

test('the plain-text render names the board and warns about JQL', async () => {
  const jira = {
    agileBoards: async () => [{ id: '5', name: 'WEBEXP board', type: 'scrum' }],
    agileSprints: async (board) => [{ ...SPRINT, board }],
  }

  const { ctx, output } = harness(jira)
  await runSprints(['--project', 'WEBEXP'], ctx)
  assert.match(output.at(-1), /board WEBEXP board/)
  assert.match(output.at(-1), /Sprint 21/)
})
