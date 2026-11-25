// Entry point. Global flags are read here, before the context exists, so
// `--config-dir` can move the store and `--json` can silence human output.

import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

import { CliError } from './http.mjs'
import { createContext } from './context.mjs'
import { runAuth } from './commands/auth.mjs'
import {
  runFields,
  runPeople,
  runProjects,
  runSprints,
} from './commands/lookup.mjs'
import { runProfiles } from './commands/profiles.mjs'
import { runReport } from './commands/report.mjs'
import { runSetup } from './commands/setup.mjs'
import { createPrompter } from './prompt.mjs'
import { VERSION } from './version.mjs'

function flagValues(argv, name) {
  const values = []
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (token === `--${name}`) values.push(argv[index + 1])
    else if (token.startsWith(`--${name}=`)) values.push(token.slice(name.length + 3))
  }
  return values.filter((value) => value !== undefined)
}

function hasFlag(argv, name) {
  return argv.includes(`--${name}`) || argv.includes(`--${name}=true`)
}

export async function main(argv = process.argv.slice(2), io = {}) {
  const env = { ...process.env, ...(io.env ?? {}) }
  const json = hasFlag(argv, 'json')
  const interactive = io.interactive ?? Boolean(process.stdin.isTTY)

  const configDir = flagValues(argv, 'config-dir').at(-1)
  if (configDir) env.JIRA_CAPACITY_HOME = configDir

  const makeContext = () =>
    createContext({
      env,
      json,
      verbose: hasFlag(argv, 'verbose'),
      stdout: io.stdout ?? process.stdout,
      stderr: io.stderr ?? process.stderr,
    })

  let ctx = makeContext()

  try {
    return await dispatch(argv, ctx, { interactive, prompter: io.prompter })
  } catch (error) {
    // A terminal gets a first-run offer instead of an error. The setup flow is
    // the same one `jira-capacity setup` runs; on success the original command
    // is retried once with a fresh context so the new base URL is picked up.
    const offerable =
      error?.code === 'no-token' &&
      error?.kind === 'jira' &&
      interactive &&
      !json

    if (!offerable) throw error

    const prompter = io.prompter ?? createPrompter()
    ctx.out.warn('Jira is not configured.')
    const wanted = await prompter.confirm('Set up Jira now?')
    if (!wanted) throw error

    const result = await runSetup([], ctx, {
      prompter,
      interactive: true,
      jiraOnly: true,
    })
    if (!result?.saved) return 1

    ctx = makeContext()
    return await dispatch(argv, ctx, { interactive, prompter })
  }
}

async function dispatch(
  argv,
  ctx,
  { interactive = false, prompter } = {},
) {
  const [command = '', ...rest] = argv
  const group = command.toLowerCase()

  switch (group) {
    case '':
    case 'help':
    case '--help':
    case '-h':
      usage(ctx)
      return group === '' ? 2 : 0
    case '--version':
    case 'version':
      ctx.out.info(VERSION)
      return 0
    case 'setup':
      await runSetup(rest, ctx, { prompter, interactive })
      return 0
    case 'profiles':
      await runProfiles(rest, ctx)
      return 0
    case 'report':
      await runReport(rest, ctx, { mode: 'capacity' })
      return 0
    case 'comments':
      await runReport(rest, ctx, { mode: 'comments' })
      return 0
    case 'sprints':
      await runSprints(rest, ctx)
      return 0
    case 'fields':
      await runFields(rest, ctx)
      return 0
    case 'people':
      await runPeople(rest, ctx)
      return 0
    case 'projects':
      await runProjects(rest, ctx)
      return 0
    case 'auth':
      await runAuth(rest, ctx)
      return 0
    default:
      throw new CliError(
        `Unknown command "${command}". Run \`jira-capacity help\`.`,
        { code: 'usage' },
      )
  }
}

function usage(ctx) {
  ctx.out.info(`jira-capacity ${VERSION} — Jira capacity and comments exports from a PAT

Usage:
  jira-capacity <command> [options]

Commands:
  setup                                    First-time URL + PAT configuration
  profiles list|show|diff|pull|push|set    Local profiles and sync
  report    --profile <name> [...]          Capacity sheet
  comments  --profile <name> [...]          Tickets and comments
  sprints   [--project KEY] [--state ...]   Sprint ids, names, dates
  fields    search <text>                   Field catalog search
  people    search <text>                   User search
  projects  search <text>                   Project search
  auth      status|set|clear                PAT status and storage
  help                                      This text
  version                                   CLI version

Examples:
  jira-capacity setup
  jira-capacity profiles pull --from confluence:1049602420
  jira-capacity sprints --project WEBEXP --state future
  jira-capacity report --profile WebExp-RTB --sprint "Sprint 21" --dry-run
  jira-capacity report --profile WebExp-RTB --sprint "Sprint 21"
  jira-capacity comments --profile WebExp-RTB --out comments.xls

Add --json to any command for one machine-readable document on stdout.
Without a PAT, \`setup\` (or the first command you run) asks for the URL and
token; JIRA_PAT and CONFLUENCE_PAT still work for scripts.`)
}

// Only run when executed directly, not when a test imports `main`. realpath
// matters on macOS, where /var/folders is a symlink to /private/var/folders.
const invoked = (() => {
  if (!process.argv[1]) return false
  try {
    const entry = fileURLToPath(import.meta.url)
    return fs.realpathSync(process.argv[1]) === fs.realpathSync(entry)
  } catch {
    return false
  }
})()

if (invoked) {
  main()
    .then((code) => {
      if (typeof code === 'number' && code !== 0) process.exitCode = code
    })
    .catch((error) => {
      const json = process.argv.includes('--json')
      const status = error?.code === 'usage' ? 2 : 1

      if (json) {
        process.stdout.write(
          `${JSON.stringify(
            {
              error: {
                message: error?.message ?? String(error),
                code: error?.code ?? 'error',
                status: error?.status ?? 0,
              },
            },
            null,
            2,
          )}\n`,
        )
      } else {
        process.stderr.write(`jira-capacity: ${error?.message ?? error}\n`)
        if (error?.code === 'usage') {
          process.stderr.write('Run `jira-capacity help` for usage.\n')
        }
      }
      process.exitCode = status
    })
}
