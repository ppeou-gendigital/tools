// Tiny argv parser. Every command declares the flags it accepts, so a typo
// fails with usage instead of being silently ignored.
//
// Flag kinds:
//   string   one value, last wins
//   boolean  no value
//   repeat   one value, collected into an array
//
// `--flag=value` and `--flag value` both work; `--` stops flag parsing.

const CAMEL = /-([a-z0-9])/g

function camelCase(name) {
  return name.replace(CAMEL, (_, char) => char.toUpperCase())
}

function fail(message) {
  const error = new Error(message)
  error.code = 'usage'
  throw error
}

export function parseArgs(argv = [], spec = {}) {
  const positional = []
  const options = {}

  for (const [name, kind] of Object.entries(spec)) {
    if (kind === 'repeat') options[camelCase(name)] = []
  }

  for (let index = 0; index < argv.length; index += 1) {
    const token = String(argv[index])
    if (token === '--') {
      positional.push(...argv.slice(index + 1))
      break
    }

    if (!token.startsWith('-') || token === '-') {
      positional.push(token)
      continue
    }

    const long = token.startsWith('--')
    const raw = long ? token.slice(2) : token.slice(1)
    if (!raw) fail('Empty option.')

    const [name, inline] = raw.split(/=(.*)/s)
    const key = camelCase(name)
    const kind = spec[key] ?? spec[name]

    if (!kind) {
      fail(`Unknown option ${long ? '--' : '-'}${name}. Run \`jira-capacity help\`.`)
    }

    if (kind === 'boolean') {
      if (inline !== undefined) {
        fail(`--${name} does not take a value.`)
      }
      options[key] = true
      continue
    }

    const value = inline !== undefined ? inline : argv[++index]
    if (value === undefined || String(value).startsWith('--')) {
      fail(`--${name} needs a value.`)
    }

    if (kind === 'repeat') {
      options[key].push(String(value))
    } else {
      options[key] = String(value)
    }
  }

  return { positional, options }
}

// Shared by every command so the help text and the parser cannot drift.
export const COMMON_FLAGS = {
  json: 'boolean',
  help: 'boolean',
  'config-dir': 'string',
  verbose: 'boolean',
}

export function requireValue(value, label) {
  if (value === undefined || value === null || String(value).trim() === '') {
    fail(`${label} is required.`)
  }
  return String(value).trim()
}

export function optionalInt(value, label) {
  if (value === undefined || value === '') return undefined
  const number = Number(value)
  if (!Number.isInteger(number) || number < 0) {
    fail(`${label} must be a whole number.`)
  }
  return number
}
