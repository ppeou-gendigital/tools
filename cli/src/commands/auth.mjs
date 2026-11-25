// `auth`: show where each PAT comes from, store one, or clear one.
//
// Tokens are never echoed. `status` names the source, and the optional live
// check only prints the authenticated display name.

import { COMMON_FLAGS, parseArgs, requireValue } from '../args.mjs'
import { CliError, createClient } from '../http.mjs'
import {
  clearPat,
  patLabel,
  resolvePat,
  savePat,
  savePatToKeychain,
} from '../credentials.mjs'
import { createConfluence } from '../confluence.mjs'
import { createJira } from '../jira.mjs'
import { configPath, confluenceBase, jiraBase, readConfig, writeConfig } from '../config.mjs'

const STATUS_FLAGS = { ...COMMON_FLAGS, offline: 'boolean' }
const SET_FLAGS = {
  ...COMMON_FLAGS,
  jira: 'string',
  confluence: 'string',
  keychain: 'boolean',
  'jira-base': 'string',
  'confluence-base': 'string',
}
const CLEAR_FLAGS = {
  ...COMMON_FLAGS,
  jira: 'boolean',
  confluence: 'boolean',
  all: 'boolean',
}

export async function runAuth(argv, ctx) {
  const [action = 'status', ...rest] = argv

  switch (action) {
    case 'status':
      return status(rest, ctx)
    case 'set':
    case 'login':
      return set(rest, ctx)
    case 'clear':
    case 'logout':
      return clear(rest, ctx)
    case 'help':
    case '--help':
    case '-h':
      return help(ctx)
    default:
      throw new CliError(`Unknown auth action "${action}".`, { code: 'usage' })
  }
}

async function status(argv, ctx) {
  const { options } = parseArgs(argv, STATUS_FLAGS)
  if (options.help) return help(ctx)

  const result = {
    configFile: configPath(ctx.env),
    baseUrls: { jira: jiraBase(ctx.env), confluence: confluenceBase(ctx.env) },
    tokens: {
      jira: describe('jira', ctx.env, Boolean(options.offline)),
      confluence: describe('confluence', ctx.env, Boolean(options.offline)),
    },
  }

  const live = await Promise.all([
    probe('jira', result.tokens.jira, ctx),
    probe('confluence', result.tokens.confluence, ctx),
  ])
  result.tokens.jira.user = live[0].user
  result.tokens.jira.error = live[0].error
  result.tokens.confluence.user = live[1].user
  result.tokens.confluence.error = live[1].error

  ctx.out.result(result, renderStatus)
}

function describe(kind, env, offline) {
  const resolved = resolvePat(kind, env)
  return {
    configured: Boolean(resolved.token),
    source: resolved.source || null,
    checked: !offline,
    user: null,
    error: null,
  }
}

async function probe(kind, tokenInfo, ctx) {
  if (!tokenInfo.configured || !tokenInfo.checked) {
    return { user: null, error: null }
  }

  const resolved = resolvePat(kind, ctx.env)
  try {
    if (kind === 'jira') {
      const jira = createJira(
        createClient({
          baseUrl: jiraBase(ctx.env),
          token: resolved.token,
          label: 'Jira',
        }),
      )
      const me = await jira.myself()
      return { user: me?.displayName ?? me?.name ?? 'authenticated', error: null }
    }

    const confluence = createConfluence(
      createClient({
        baseUrl: confluenceBase(ctx.env),
        token: resolved.token,
        label: 'Confluence',
      }),
    )
    const me = await confluence.currentUser()
    return {
      user: me?.displayName ?? me?.username ?? me?.name ?? 'authenticated',
      error: null,
    }
  } catch (error) {
    return { user: null, error: error?.message ?? String(error) }
  }
}

function renderStatus(result) {
  const lines = [`config     ${result.configFile}`]

  for (const kind of ['jira', 'confluence']) {
    const token = result.tokens[kind]
    lines.push('')
    lines.push(`${patLabel(kind).padEnd(10)} ${result.baseUrls[kind]}`)
    if (!token.configured) {
      lines.push(
        `  PAT      missing — run \`jira-capacity setup\`, or set ${kind === 'jira' ? 'JIRA_PAT' : 'CONFLUENCE_PAT'}.`,
      )
      continue
    }
    lines.push(`  PAT      ${token.source}`)
    if (token.error) lines.push(`  live     failed: ${token.error}`)
    else if (token.user) lines.push(`  live     ${token.user}`)
    else if (!token.checked) lines.push('  live     skipped (--offline)')
  }

  return lines.join('\n')
}

async function set(argv, ctx) {
  const { options } = parseArgs(argv, SET_FLAGS)
  if (options.help) return help(ctx)

  const jiraToken =
    options.jira !== undefined ? await readToken(options.jira, 'Jira') : ''
  const confluenceToken =
    options.confluence !== undefined
      ? await readToken(options.confluence, 'Confluence')
      : ''

  if (!jiraToken && !confluenceToken && !options.jiraBase && !options.confluenceBase) {
    throw new CliError(
      'Nothing to store. Pass --jira <token>, --confluence <token>, or a base URL.',
      { code: 'usage' },
    )
  }

  if (options.jiraBase || options.confluenceBase) {
    const config = readConfig(ctx.env)
    config.baseUrls = { ...(config.baseUrls ?? {}) }
    if (options.jiraBase) config.baseUrls.jira = options.jiraBase
    if (options.confluenceBase) config.baseUrls.confluence = options.confluenceBase
    writeConfig(config, ctx.env)
  }

  const stored = []
  for (const [kind, token] of [
    ['jira', jiraToken],
    ['confluence', confluenceToken],
  ]) {
    if (!token) continue
    const where = options.keychain
      ? savePatToKeychain(kind, token, ctx.env)
      : savePat(kind, token, ctx.env)
    stored.push({ kind, where })
  }

  // Only warn about history when a token really came from argv.
  const inlineSecret =
    [options.jira, options.confluence].some(
      (value) => value && value !== '-',
    ) && stored.length > 0

  ctx.out.result(
    { configFile: configPath(ctx.env), stored, inlineSecret },
    ({ configFile, stored: entries, inlineSecret: warnHistory }) => {
      const lines = entries.map(
        (entry) => `${patLabel(entry.kind)} PAT stored in ${entry.where}.`,
      )
      if (entries.length === 0) lines.push(`Updated ${configFile}.`)
      else lines.push(`Config: ${configFile}`)
      if (warnHistory) {
        lines.push(
          'Note: a token passed as an argument stays in shell history. Prefer JIRA_PAT/CONFLUENCE_PAT, or run with `--jira -` to paste it without echo.',
        )
      }
      return lines.join('\n')
    },
  )
}

async function readToken(value, label) {
  const token = requireValue(value, `${label} token`)
  if (token !== '-') return token

  const raw = (process.stdin.isTTY
    ? await promptHidden(`${label} PAT (input hidden): `)
    : await readStdin()
  ).trim()

  if (!raw) {
    throw new CliError(`No ${label} token arrived on stdin.`, { code: 'no-token' })
  }
  return raw
}

// Piped input, which is what a script or an agent uses.
async function readStdin() {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

// A terminal gets the same treatment as a password prompt: readline still
// needs an output stream, so it gets a sink and the prompt goes to stderr
// directly. That hides the echo without depending on `stty`.
async function promptHidden(prompt) {
  const { Writable } = await import('node:stream')
  const { createInterface } = await import('node:readline/promises')

  const sink = new Writable({
    write(_chunk, _encoding, callback) {
      callback()
    },
  })
  const rl = createInterface({
    input: process.stdin,
    output: sink,
    terminal: true,
  })

  process.stderr.write(prompt)
  try {
    const answer = await rl.question('')
    process.stderr.write('\n')
    return answer
  } finally {
    rl.close()
    sink.end()
  }
}

function clear(argv, ctx) {
  const { options } = parseArgs(argv, CLEAR_FLAGS)
  if (options.help) return help(ctx)

  const kinds = []
  if (options.all || (!options.jira && !options.confluence)) {
    kinds.push('jira', 'confluence')
  } else {
    if (options.jira) kinds.push('jira')
    if (options.confluence) kinds.push('confluence')
  }

  const cleared = kinds.map((kind) => ({
    kind,
    removed: clearPat(kind, ctx.env),
  }))

  ctx.out.result(
    { cleared },
    ({ cleared: entries }) =>
      entries
        .map(
          (entry) =>
            `${patLabel(entry.kind)} PAT ${entry.removed ? 'removed' : 'was not stored'}.`,
        )
        .join('\n'),
  )
}

function help(ctx) {
  ctx.out.info(`Usage: jira-capacity auth <action> [options]

Actions:
  status [--offline]
      Show the base URLs, which layer supplies each PAT, and who it
      authenticates as. --offline skips the live check.
  set [--jira <token|->] [--confluence <token|->] [--keychain]
      Store PATs. \`-\` reads the token from stdin, or prompts without echo
      when stdin is a terminal. --keychain uses the macOS Keychain instead
      of config.json.
      --jira-base <url> / --confluence-base <url> override the defaults.
  clear [--jira] [--confluence] [--all]
      Remove stored PATs (environment variables are untouched).

Precedence: JIRA_PAT / CONFLUENCE_PAT, then config.json, then Keychain.

For guided first-time configuration (URL + PAT + live check), run
\`jira-capacity setup\`.`)
}
