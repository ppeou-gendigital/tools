// `setup`: the human path to a working configuration. Ask for a URL and a PAT,
// prove them with the identity endpoint, show who answered, and only then
// write. Any command that needs Jira and finds no PAT runs this same flow
// inline (see `index.mjs`), so there is one implementation, not two.

import { COMMON_FLAGS, parseArgs } from '../args.mjs'
import {
  configPath,
  jiraBase,
  confluenceBase,
  originOf,
  readConfig,
  writeConfig,
} from '../config.mjs'
import { CliError, createClient } from '../http.mjs'
import { createJira } from '../jira.mjs'
import { createConfluence } from '../confluence.mjs'
import { savePat, savePatToKeychain } from '../credentials.mjs'
import { createPrompter } from '../prompt.mjs'

const SETUP_FLAGS = {
  ...COMMON_FLAGS,
  'jira-url': 'string',
  'jira-pat': 'string',
  'confluence-url': 'string',
  'confluence-pat': 'string',
  'skip-confluence': 'boolean',
  keychain: 'boolean',
  yes: 'boolean',
}

const MAX_ATTEMPTS = 5

export async function runSetup(
  argv,
  ctx,
  { prompter, interactive, jiraOnly = false } = {},
) {
  const { options } = parseArgs(argv, SETUP_FLAGS)
  if (options.help) return help(ctx)

  const ui = prompter ?? createPrompter()
  const canPrompt = interactive ?? Boolean(process.stdin.isTTY)
  const skipConfluence = jiraOnly || Boolean(options.skipConfluence)

  const jira = await collectJira({ ctx, ui, options, canPrompt })
  const confluence = skipConfluence
    ? null
    : await collectConfluence({ ctx, ui, options, canPrompt })

  // A human gets to see the URL and identity once more before anything is
  // written; a script passes --yes instead.
  if (canPrompt && !options.yes) {
    const save = await ui.confirm(
      `Save this configuration to ${configPath(ctx.env)}?`,
    )
    if (!save) {
      const result = { saved: false, configFile: configPath(ctx.env) }
      ctx.out.info('Nothing saved.')
      ctx.out.result(result, () => '')
      return result
    }
  }

  // Base URLs first: savePat rewrites config.json and keeps whatever is there.
  const config = readConfig(ctx.env)
  config.baseUrls = { ...(config.baseUrls ?? {}), jira: jira.url }
  if (confluence) {
    config.baseUrls = { ...config.baseUrls, confluence: confluence.url }
  }
  writeConfig(config, ctx.env)

  const storedIn = storeToken('jira', jira.token, options.keychain, ctx.env)
  if (confluence) {
    storeToken('confluence', confluence.token, options.keychain, ctx.env)
  }

  const result = {
    saved: true,
    configFile: configPath(ctx.env),
    storedIn,
    jira: {
      url: jira.url,
      user: jira.user.displayName ?? jira.user.name ?? 'authenticated',
      username: jira.user.name ?? null,
    },
    confluence: confluence
      ? {
          url: confluence.url,
          user:
            confluence.user.displayName ??
            confluence.user.username ??
            confluence.user.name ??
            'authenticated',
          username: confluence.user.username ?? confluence.user.name ?? null,
        }
      : null,
  }

  ctx.out.result(result, renderSetup)
  return result
}

// Offered by index.mjs when a command fails with `no-token` on a terminal.
export function setupHint() {
  return 'Run `jira-capacity setup`, or set JIRA_PAT (scripted: `jira-capacity auth set --jira -`).'
}

async function collectJira({ ctx, ui, options, canPrompt }) {
  if (!canPrompt && (options.jiraUrl === undefined || options.jiraPat === undefined)) {
    throw new CliError(
      '`setup` needs a terminal to ask for the URL and PAT. In a script, run `jira-capacity auth set --jira - --jira-base <url>`.',
      { code: 'usage' },
    )
  }

  let preferredUrl = jiraBase(ctx.env)

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const first = attempt === 0
    try {
      const rawUrl =
        canPrompt && !(first && options.jiraUrl !== undefined)
          ? await ui.ask('Jira URL', { defaultValue: preferredUrl })
          : options.jiraUrl
      const url = originOf(rawUrl)
      preferredUrl = url

      const token =
        canPrompt && !(first && options.jiraPat !== undefined)
          ? await ui.askHidden('Jira PAT (input hidden)')
          : await tokenFromOption(options.jiraPat, 'Jira', ui, canPrompt)

      if (!token) throw new Error('A Jira PAT is required.')

      ctx.out.info(`Checking ${url} …`)
      const user = await verifyJira(url, token)
      ctx.out.info(`✓ Connected as ${identity(user)} at ${url}`)
      return { url, token, user }
    } catch (error) {
      if (!canPrompt) throw asCliError(error)
      ctx.out.warn(`✗ ${error.message}`)
      const again = await ui.confirm('Try a different URL or token?')
      if (!again) {
        throw new CliError('Setup cancelled. Nothing was saved.', {
          code: 'setup-cancelled',
        })
      }
    }
  }

  throw new CliError('Too many failed attempts. Nothing was saved.', {
    code: 'setup-cancelled',
  })
}

async function collectConfluence({ ctx, ui, options, canPrompt }) {
  const explicit =
    options.confluenceUrl !== undefined || options.confluencePat !== undefined

  if (!explicit) {
    if (!canPrompt) return null
    const wanted = await ui.confirm(
      'Configure Confluence as well? (only needed for profile sync)',
      { defaultValue: false },
    )
    if (!wanted) return null
  }

  let preferredUrl = confluenceBase(ctx.env)

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const first = attempt === 0
    try {
      const rawUrl =
        canPrompt && !(first && options.confluenceUrl !== undefined)
          ? await ui.ask('Confluence URL', { defaultValue: preferredUrl })
          : options.confluenceUrl ?? preferredUrl
      const url = originOf(rawUrl)
      preferredUrl = url

      const token = canPrompt
        ? await ui.askHidden('Confluence PAT (input hidden)')
        : await tokenFromOption(
            options.confluencePat,
            'Confluence',
            ui,
            canPrompt,
          )

      if (!token) throw new Error('A Confluence PAT is required.')

      ctx.out.info(`Checking ${url} …`)
      const user = await verifyConfluence(url, token)
      ctx.out.info(`✓ Connected as ${identity(user)} at ${url}`)
      return { url, token, user }
    } catch (error) {
      if (!canPrompt) throw asCliError(error)
      ctx.out.warn(`✗ ${error.message}`)
      const again = await ui.confirm('Try a different URL or token?')
      if (!again) {
        throw new CliError('Setup cancelled. Nothing was saved.', {
          code: 'setup-cancelled',
        })
      }
    }
  }

  throw new CliError('Too many failed attempts. Nothing was saved.', {
    code: 'setup-cancelled',
  })
}

export async function verifyJira(url, token) {
  const jira = createJira(createClient({ baseUrl: url, token, label: 'Jira' }))
  const me = await jira.myself()
  if (!me || (!me.name && !me.displayName)) {
    throw new CliError(
      'Jira accepted the token but returned no user. Check the URL points at Jira.',
      { code: 'bad-response' },
    )
  }
  return me
}

export async function verifyConfluence(url, token) {
  const confluence = createConfluence(
    createClient({ baseUrl: url, token, label: 'Confluence' }),
  )
  const me = await confluence.currentUser()
  if (!me || (!me.username && !me.displayName && !me.name)) {
    throw new CliError(
      'Confluence accepted the token but returned no user. Check the URL points at Confluence.',
      { code: 'bad-response' },
    )
  }
  return me
}

function identity(user) {
  const display = user.displayName ?? user.name ?? 'authenticated'
  const name = user.name ?? user.username
  return name && name !== display ? `${display} (${name})` : display
}

async function tokenFromOption(value, label, ui, canPrompt) {
  if (value === undefined) return ''
  if (value !== '-') return String(value).trim()
  if (canPrompt) return ui.askHidden(`${label} PAT (input hidden)`)
  return readStdin()
}

async function readStdin() {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8').trim()
}

function storeToken(kind, token, keychain, env) {
  return keychain ? savePatToKeychain(kind, token, env) : savePat(kind, token, env)
}

function asCliError(error) {
  if (error instanceof CliError) return error
  return new CliError(error?.message ?? String(error), { code: 'bad-url' })
}

function renderSetup(result) {
  const lines = [
    `✓ ${result.jira.user}${result.jira.username ? ` (${result.jira.username})` : ''} at ${result.jira.url}`,
  ]
  if (result.confluence) {
    lines.push(
      `✓ ${result.confluence.user}${result.confluence.username ? ` (${result.confluence.username})` : ''} at ${result.confluence.url}`,
    )
  }
  lines.push(`Saved ${result.configFile} (PAT in ${result.storedIn}).`)
  lines.push('Next: jira-capacity profiles pull --from jira:<KEY>')
  return lines.join('\n')
}

function help(ctx) {
  ctx.out.info(`Usage: jira-capacity setup [options]

First-time configuration. Asks for the Jira URL and PAT, checks them against
/rest/api/2/myself, shows who answered, and only then writes config.json.
Confluence is optional and only needed for profile sync.

Any command that needs Jira offers this same setup when no PAT is configured.

Options:
  --jira-url <url>            Jira URL (a browse link is reduced to its origin)
  --jira-pat <token|->        Jira PAT; '-' reads stdin or prompts without echo
  --confluence-url <url>      Confluence URL (optional)
  --confluence-pat <token|->  Confluence PAT (optional)
  --skip-confluence           Never ask about Confluence
  --keychain                  Store PATs in the macOS Keychain
  --yes                       Save without the final confirmation
  --json                      One machine-readable document on stdout

Scripted alternative (no prompts): jira-capacity auth set --jira - --jira-base <url>`)
}