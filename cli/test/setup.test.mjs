// `setup` and the first-run offer. Everything runs against a local stand-in, so
// no real PAT is involved and nothing touches the user's config.

import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'

import { main } from '../src/index.mjs'
import { runSetup } from '../src/commands/setup.mjs'
import { configPath, originOf, readConfig } from '../src/config.mjs'

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

async function startJira(t) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    const token = (req.headers.authorization ?? '').replace(/^Bearer /, '')

    if (url.pathname === '/rest/api/2/myself') {
      if (token !== 'good-token') {
        return send(res, 401, { errorMessages: ['unauthorized'] })
      }
      return send(res, 200, { name: 'tester', displayName: 'Tester' })
    }

    if (url.pathname === '/rest/api/2/projects/picker') {
      if (token !== 'good-token') {
        return send(res, 401, { errorMessages: ['unauthorized'] })
      }
      return send(res, 200, {
        projects: [{ key: 'WEBEXP', name: 'Web Experience' }],
      })
    }

    send(res, 404, { message: `no route for ${url.pathname}` })
  })

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  t.after(() => server.close())
  return `http://127.0.0.1:${server.address().port}`
}

function scriptedPrompter(answers) {
  const queue = [...answers]
  const log = []
  const next = () => {
    if (queue.length === 0) throw new Error('prompter ran out of answers')
    return queue.shift()
  }

  return {
    log,
    async ask(label, { defaultValue = '' } = {}) {
      log.push(`ask:${label}`)
      const answer = next()
      return answer === '' ? defaultValue : answer
    },
    async askHidden(label) {
      log.push(`hidden:${label}`)
      return next()
    },
    async confirm(label, { defaultValue = true } = {}) {
      log.push(`confirm:${label}`)
      const answer = next()
      return answer === '' ? defaultValue : /^y/i.test(String(answer))
    },
  }
}

function tempHome() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'jira-capacity-setup-'))
}

function fakeContext(env) {
  const lines = []
  return {
    env,
    lines,
    json: true,
    out: {
      result: (value) => value,
      info: (text) => lines.push(text),
      warn: (text) => lines.push(text),
      debug() {},
      line() {},
    },
  }
}

test('setup checks the token, shows the identity, and writes URL + PAT', async (t) => {
  const base = await startJira(t)
  const home = tempHome()
  const env = { JIRA_CAPACITY_HOME: home, JIRA_PAT: '' }
  const prompter = scriptedPrompter(['good-token', 'y'])

  const result = await runSetup(
    ['--jira-url', `${base}/browse/WEBEXP-1`, '--skip-confluence'],
    fakeContext(env),
    { prompter, interactive: true },
  )

  assert.equal(result.saved, true)
  assert.equal(result.jira.url, base, 'a browse URL is reduced to its origin')
  assert.equal(result.jira.user, 'Tester')

  const config = readConfig(env)
  assert.equal(config.baseUrls.jira, base)
  assert.equal(config.pats.jira, 'good-token')

  if (process.platform !== 'win32') {
    assert.equal(fs.statSync(configPath(env)).mode & 0o777, 0o600)
  }

  assert.ok(prompter.log.includes('hidden:Jira PAT (input hidden)'))
  assert.ok(prompter.log.some((entry) => entry.startsWith('confirm:Save this')))
})

test('a rejected token is retried, then setup leaves the old config alone', async (t) => {
  const base = await startJira(t)
  const home = tempHome()
  const env = { JIRA_CAPACITY_HOME: home, JIRA_PAT: '' }
  const prompter = scriptedPrompter(['bad-token', 'n'])

  await assert.rejects(
    runSetup(['--jira-url', base, '--skip-confluence'], fakeContext(env), {
      prompter,
      interactive: true,
    }),
    (error) => {
      assert.equal(error.code, 'setup-cancelled')
      return true
    },
  )

  assert.equal(fs.existsSync(configPath(env)), false)
})

test('declining the final confirmation saves nothing', async (t) => {
  const base = await startJira(t)
  const home = tempHome()
  const env = { JIRA_CAPACITY_HOME: home, JIRA_PAT: '' }

  const result = await runSetup(
    ['--jira-url', base, '--skip-confluence'],
    fakeContext(env),
    { prompter: scriptedPrompter(['good-token', 'n']), interactive: true },
  )

  assert.equal(result.saved, false)
  assert.equal(fs.existsSync(configPath(env)), false)
})

test('originOf accepts a bare host or a pasted link, and rejects anything else', () => {
  assert.equal(
    originOf('https://jira.example.com/browse/WEBEXP-1'),
    'https://jira.example.com',
  )
  assert.equal(originOf('jira.example.com/'), 'https://jira.example.com')
  assert.equal(originOf('http://host:8080/jira'), 'http://host:8080')
  assert.throws(() => originOf('ftp://jira.example.com'), /http\(s\)/)
  assert.throws(() => originOf('not a url'), /not a URL/)
  assert.throws(() => originOf(''), /Enter a URL/)
})

test('setup without a terminal points scripts at auth set', async () => {
  const env = { JIRA_CAPACITY_HOME: tempHome() }

  await assert.rejects(runSetup([], fakeContext(env), { interactive: false }), (error) => {
    assert.equal(error.code, 'usage')
    assert.match(error.message, /auth set --jira/)
    return true
  })
})

test('a command without a PAT offers setup and then continues', async (t) => {
  const base = await startJira(t)
  const home = tempHome()
  let stdout = ''
  let stderr = ''

  const io = {
    env: {
      JIRA_CAPACITY_HOME: home,
      JIRA_PAT: '',
      CONFLUENCE_PAT: '',
      JIRA_BASE_URL: '',
    },
    interactive: true,
    prompter: scriptedPrompter(['y', base, 'good-token', 'y']),
    stdout: { write: (chunk) => (stdout += chunk) },
    stderr: { write: (chunk) => (stderr += chunk) },
  }

  const code = await main(['projects', 'search', 'WEBEXP'], io)

  assert.equal(code, 0)
  assert.match(stdout, /Web Experience/)
  assert.match(stderr, /not configured/)
  assert.equal(readConfig(io.env).pats.jira, 'good-token')
})

test('without a terminal the no-token error names the setup command', async () => {
  const io = {
    env: {
      JIRA_CAPACITY_HOME: tempHome(),
      JIRA_PAT: '',
      CONFLUENCE_PAT: '',
    },
    interactive: false,
    stdout: { write() {} },
    stderr: { write() {} },
  }

  await assert.rejects(main(['projects', 'search', 'WEBEXP'], io), (error) => {
    assert.equal(error.code, 'no-token')
    assert.match(error.message, /jira-capacity setup/)
    return true
  })
})

test('--json never prompts, even on a terminal', async () => {
  const io = {
    env: {
      JIRA_CAPACITY_HOME: tempHome(),
      JIRA_PAT: '',
      CONFLUENCE_PAT: '',
    },
    interactive: true,
    prompter: scriptedPrompter([]),
    stdout: { write() {} },
    stderr: { write() {} },
  }

  await assert.rejects(
    main(['projects', 'search', 'WEBEXP', '--json'], io),
    (error) => error.code === 'no-token',
  )
})
