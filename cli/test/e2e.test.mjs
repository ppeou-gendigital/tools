// End-to-end against a local stand-in for Jira and Confluence. This exercises
// the HTTP layer, pagination, profile store, and both exports without needing a
// real PAT or touching the clipboard.

import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { main } from '../src/index.mjs'

const PROFILE = {
  schemaVersion: 1,
  id: 'profile-1',
  name: 'WebExp-RTB',
  origin: 'https://jira.example',
  createdAt: '2026-11-20T10:00:00.000Z',
  createdBy: 'Tester',
  updatedAt: '2026-11-20T10:00:00.000Z',
  updatedBy: 'Tester',
  selection: {
    filters: {
      projects: [{ id: 'WEBEXP', name: 'WEBEXP' }],
      resolutions: [],
      sprints: [],
      types: [],
      statuses: [],
    },
    fetchFields: [
      { id: 'issuekey', name: 'Issue Key' },
      { id: 'summary', name: 'Summary' },
      { id: 'assignee', name: 'Assignee' },
      { id: 'timeestimate', name: 'Remaining Estimate' },
    ],
    reportFields: [
      { id: 'issuekey', name: 'Issue Key' },
      { id: 'summary', name: 'Summary' },
      { id: 'assignee', name: 'Assignee' },
      { id: 'timeestimate', name: 'Remaining Estimate' },
    ],
    resources: [{ id: 'resource:akim', name: 'Alice Kim' }],
    orderBy: [],
  },
}

const ISSUES = [
  {
    key: 'WEBEXP-1',
    fields: {
      summary: 'Parent issue',
      status: { name: 'In Progress' },
      issuetype: { name: 'Story' },
      priority: { name: 'High' },
      assignee: { displayName: 'Alice Kim' },
      timeestimate: 7200,
      subtasks: [
        {
          key: 'WEBEXP-11',
          fields: {
            summary: 'Child issue',
            status: { name: 'Open' },
            priority: { name: 'Low' },
            issuetype: { name: 'Sub-task' },
          },
        },
      ],
    },
  },
  {
    key: 'WEBEXP-11',
    fields: {
      summary: 'Child issue',
      status: { name: 'Open' },
      issuetype: { name: 'Sub-task' },
      priority: { name: 'Low' },
      parent: { key: 'WEBEXP-1' },
      assignee: { displayName: 'Alice Kim' },
      timeestimate: 3600,
      comment: {
        total: 1,
        comments: [
          {
            author: { displayName: 'Alice Kim' },
            body: 'Working on it',
            created: '2026-11-21T10:00:00.000Z',
            updated: '2026-11-21T10:00:00.000Z',
          },
        ],
      },
    },
  },
]

const SPRINT = {
  id: '123',
  name: 'Sprint 21',
  state: 'future',
  startDate: '2026-11-24T00:00:00.000Z',
  endDate: '2026-12-05T00:00:00.000Z',
}

function json(res, status, body) {
  const text = JSON.stringify(body)
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(text)
}

function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost')

    if (req.headers.authorization !== 'Bearer test-token') {
      return json(res, 401, { errorMessages: ['unauthorized'] })
    }

    if (url.pathname === '/rest/api/2/myself') {
      return json(res, 200, { name: 'tester', displayName: 'Tester' })
    }

    if (url.pathname === '/rest/api/2/field') {
      return json(res, 200, [
        { id: 'summary', name: 'Summary' },
        { id: 'assignee', name: 'Assignee' },
        { id: 'timeestimate', name: 'Remaining Estimate' },
        { id: 'comment', name: 'Comment' },
        { id: 'customfield_10007', name: 'Sprint', custom: true },
      ])
    }

    if (url.pathname === '/rest/api/2/search') {
      const jql = url.searchParams.get('jql') ?? ''
      const max = Number(url.searchParams.get('maxResults') ?? 100)

      if (jql.includes('futureSprints()')) {
        return json(res, 200, {
          total: 3,
          issues: [{ key: 'WEBEXP-1', fields: { customfield_10007: [SPRINT] } }],
        })
      }
      if (max === 0) {
        const total = jql.includes('subTaskIssueTypes') ? 1 : ISSUES.length
        return json(res, 200, { total, issues: [] })
      }
      return json(res, 200, { total: ISSUES.length, issues: ISSUES })
    }

    if (url.pathname === '/rest/greenhopper/1.0/sprint/picker') {
      return json(res, 200, { allMatches: [SPRINT], suggestions: [] })
    }

    if (url.pathname.endsWith('/groupuserpicker')) {
      return json(res, 200, {
        users: { users: [{ name: 'akim', displayName: 'Alice Kim' }] },
      })
    }

    if (url.pathname === '/rest/api/2/projects/picker') {
      return json(res, 200, {
        projects: [{ key: 'WEBEXP', name: 'Web Experience', id: '43701' }],
      })
    }

    if (url.pathname === '/rest/agile/1.0/board') {
      return json(res, 200, {
        values: [{ id: 5, name: 'WEBEXP board', type: 'scrum' }],
      })
    }

    if (url.pathname === '/rest/agile/1.0/board/5/sprint') {
      return json(res, 200, { values: [SPRINT] })
    }

    if (url.pathname === '/rest/api/user/current') {
      return json(res, 200, { username: 'tester', displayName: 'Tester' })
    }

    if (url.pathname === '/rest/api/content/1049602420') {
      return json(res, 200, {
        id: '1049602420',
        title: 'Guide',
        space: { key: 'AEMeBiz' },
        version: { number: 6 },
      })
    }

    if (url.pathname === '/rest/api/content/1049602420/child/attachment') {
      if (req.method === 'POST') {
        req.resume()
        await new Promise((resolve) => req.on('end', resolve))
        return json(res, 200, {
          results: [
            {
              id: 'att-1',
              title: 'WebExp-RTB_profile-1.json',
              version: { number: 3 },
            },
          ],
        })
      }
      return json(res, 200, {
        results: [
          {
            id: 'att-1',
            title: 'WebExp-RTB_profile-1.json',
            extensions: { fileSize: 2048, mediaType: 'application/json' },
            version: {
              number: 2,
              when: '2026-11-20T10:00:00.000Z',
              by: { displayName: 'Tester' },
            },
            _links: {
              download:
                '/download/attachments/att-1/WebExp-RTB_profile-1.json',
            },
          },
        ],
      })
    }

    if (
      url.pathname ===
      '/rest/api/content/1049602420/child/attachment/att-1/data'
    ) {
      req.resume()
      await new Promise((resolve) => req.on('end', resolve))
      return json(res, 200, {
        id: 'att-1',
        title: 'WebExp-RTB_profile-1.json',
        version: { number: 3 },
      })
    }

    if (url.pathname.startsWith('/download/attachments/att-1/')) {
      return json(res, 200, PROFILE)
    }

    return json(res, 404, { message: `no route for ${url.pathname}` })
  })
}

function createIo(env) {
  let stdout = ''
  let stderr = ''
  return {
    env,
    reset() {
      stdout = ''
      stderr = ''
    },
    stdout: { write: (chunk) => (stdout += chunk) },
    stderr: { write: (chunk) => (stderr += chunk) },
    get output() {
      return { stdout, stderr }
    },
  }
}

async function run(io, args) {
  io.reset()
  const code = await main([...args, '--json'], io)
  const { stdout, stderr } = io.output
  let data = null
  try {
    data = JSON.parse(stdout)
  } catch {
    throw new Error(`stdout was not JSON (${code}): ${stdout}\n${stderr}`)
  }
  return data
}

test('local Jira/Confluence stand-in: pull, report, comments, push', async (t) => {
  const server = createServer()
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  t.after(() => server.close())

  const base = `http://127.0.0.1:${server.address().port}`
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'jira-capacity-e2e-'))
  const env = {
    JIRA_BASE_URL: base,
    CONFLUENCE_BASE_URL: base,
    JIRA_PAT: 'test-token',
    CONFLUENCE_PAT: 'test-token',
    JIRA_CAPACITY_HOME: home,
  }
  const io = createIo(env)

  const auth = await run(io, ['auth', 'status'])
  assert.equal(auth.tokens.jira.user, 'Tester')
  assert.equal(auth.tokens.confluence.user, 'Tester')

  const pulled = await run(io, [
    'profiles',
    'pull',
    '--from',
    'confluence:1049602420',
  ])
  assert.equal(pulled.imported.length, 1)
  assert.equal(pulled.imported[0].action, 'created')
  assert.ok(
    fs.existsSync(path.join(home, 'profiles', 'WebExp-RTB_profile-1.json')),
  )

  const diff = await run(io, ['profiles', 'diff', 'WebExp-RTB'])
  assert.equal(diff.ok, true)
  assert.equal(diff.fields.missing.length, 0)
  assert.equal(diff.people.missing.length, 0)

  const people = await run(io, ['people', 'search', 'Alice'])
  assert.equal(people.users[0].name, 'Alice Kim')
  assert.equal(people.users[0].id, 'akim')

  const projects = await run(io, ['projects', 'search', 'WEBEXP'])
  assert.equal(projects.projects[0].id, 'WEBEXP')
  assert.equal(projects.projects[0].name, 'Web Experience')

  const sprints = await run(io, [
    'sprints',
    '--project',
    'WEBEXP',
    '--state',
    'future',
  ])
  assert.equal(sprints.sprints[0].id, '123')
  assert.equal(sprints.sprints[0].name, 'Sprint 21')
  assert.equal(sprints.source, 'board')
  assert.equal(sprints.board.name, 'WEBEXP board')

  const preview = await run(io, [
    'report',
    '--profile',
    'WebExp-RTB',
    '--sprint',
    'Sprint 21',
    '--dry-run',
  ])
  assert.equal(preview.matches, 2)
  assert.equal(preview.issues, 1)
  assert.match(preview.jql, /Sprint in \(123\)/)

  const reportFile = path.join(home, 'capacity.xls')
  const report = await run(io, [
    'report',
    '--profile',
    'WebExp-RTB',
    '--sprint',
    'Sprint 21',
    '--out',
    reportFile,
    '--save',
  ])
  assert.equal(report.issues, 1)
  assert.equal(report.rows, 1)
  assert.equal(report.saved, true)
  assert.deepEqual(report.people, [{ name: 'Alice Kim', hours: 1 }])
  assert.match(fs.readFileSync(reportFile, 'utf8'), /<table>/)

  const commentsFile = path.join(home, 'comments.xls')
  const comments = await run(io, [
    'comments',
    '--profile',
    'WebExp-RTB',
    '--out',
    commentsFile,
  ])
  assert.equal(comments.rows, 2)
  assert.match(fs.readFileSync(commentsFile, 'utf8'), /Working on it/)

  const pushed = await run(io, [
    'profiles',
    'push',
    'WebExp-RTB',
    '--to',
    'confluence:1049602420',
  ])
  assert.equal(pushed.version, 3)
  assert.equal(pushed.title, 'Guide')

  const list = await run(io, ['profiles', 'list'])
  assert.equal(list.profiles[0].dirty, false)
  assert.equal(
    list.profiles[0].sprints[0].id,
    '123',
    '--save should persist the resolved sprint',
  )
  assert.equal(
    list.profiles[0].publications[0].target,
    'confluence:1049602420',
  )
})

// The bundled/execed entry point has its own "was I run directly?" guard; a
// regression there silently prints nothing, so cover it in a child process.
test('the executable entry point runs directly and separates stdout', async (t) => {
  const server = createServer()
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  t.after(() => server.close())

  const base = `http://127.0.0.1:${server.address().port}`
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'jira-capacity-exec-'))
  const env = {
    ...process.env,
    JIRA_BASE_URL: base,
    CONFLUENCE_BASE_URL: base,
    JIRA_PAT: 'test-token',
    CONFLUENCE_PAT: 'test-token',
    JIRA_CAPACITY_HOME: home,
  }
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const entry = path.join(root, 'src', 'index.mjs')

  const ok = await exec(entry, ['profiles', 'pull', '--from', 'confluence:1049602420', '--json'], env)
  assert.equal(ok.code, 0, ok.stderr)
  assert.equal(JSON.parse(ok.stdout).imported.length, 1)
  assert.equal(ok.stderr, '')

  const missing = await exec(entry, ['report', '--profile', 'nope', '--json'], env)
  assert.equal(missing.code, 1)
  const failure = JSON.parse(missing.stdout)
  assert.equal(failure.error.code, 'no-profile')

  const usage = await exec(entry, ['report', '--unknown', '--json'], env)
  assert.equal(usage.code, 2)
  assert.equal(JSON.parse(usage.stdout).error.code, 'usage')
})

function exec(entry, args, env) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [entry, ...args], {
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (chunk) => (stdout += chunk))
    child.stderr.on('data', (chunk) => (stderr += chunk))
    child.on('close', (code) => resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() }))
  })
}
