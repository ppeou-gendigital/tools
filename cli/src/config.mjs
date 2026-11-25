// Runtime settings for the CLI. Nothing here reads a file at import time: the
// paths are functions so a test (or `--config-dir`) can point them elsewhere.

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

export const DEFAULT_JIRA_BASE = 'https://jira.corp.nortonlifelock.com'
export const DEFAULT_CONFLUENCE_BASE =
  'https://confluence.corp.nortonlifelock.com'

// Where profiles, sources and (optionally) the PAT live.
export function configDir(env = process.env) {
  if (env.JIRA_CAPACITY_HOME) {
    return path.resolve(expandHome(env.JIRA_CAPACITY_HOME, env))
  }

  const base =
    env.XDG_CONFIG_HOME ||
    (process.platform === 'win32'
      ? env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
      : path.join(os.homedir(), '.config'))

  return path.join(base, 'jira-capacity')
}

export function profilesDir(env = process.env) {
  return path.join(configDir(env), 'profiles')
}

export function sourcesPath(env = process.env) {
  return path.join(configDir(env), 'sources.json')
}

export function configPath(env = process.env) {
  return path.join(configDir(env), 'config.json')
}

export function jiraBase(env = process.env) {
  return normalizeBase(
    env.JIRA_BASE_URL || env.JIRA_BASE || readConfig(env).baseUrls?.jira,
    DEFAULT_JIRA_BASE,
  )
}

export function confluenceBase(env = process.env) {
  return normalizeBase(
    env.CONFLUENCE_BASE_URL ||
      env.CONFLUENCE_BASE ||
      readConfig(env).baseUrls?.confluence,
    DEFAULT_CONFLUENCE_BASE,
  )
}

function expandHome(value, env = process.env) {
  const home = env.HOME || os.homedir()
  return String(value).replace(/^~(?=$|[\\/])/, home)
}

function trimSlash(value) {
  return String(value ?? '').replace(/\/+$/, '')
}

export function normalizeBase(value, fallback) {
  const raw = String(value ?? '').trim()
  if (!raw) return fallback
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return trimSlash(withScheme)
}

// `setup` takes whatever the user copied — a browse URL, a host with a path,
// or a bare host — and stores only the origin. Unlike normalizeBase this is
// strict: a typo becomes an error instead of a surprising base URL.
export function originOf(value) {
  const raw = String(value ?? '').trim()
  if (!raw) throw new Error('Enter a URL, for example https://jira.example.com')

  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) && !/^https?:\/\//i.test(raw)) {
    throw new Error(`"${raw}" is not an http(s) URL.`)
  }

  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  let url
  try {
    url = new URL(withScheme)
  } catch {
    throw new Error(`"${raw}" is not a URL.`)
  }

  if (!url.hostname) throw new Error(`"${raw}" is missing a host.`)
  return `${url.protocol}//${url.host}`
}

// config.json holds base URLs and, for people who do not want env vars, PATs.
// It is written 0600 on POSIX; on Windows the file inherits the profile ACL.
export function readConfig(env = process.env) {
  const file = configPath(env)
  try {
    if (!fs.existsSync(file)) return {}
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'))
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  } catch {
    return {}
  }
}

export function writeConfig(config, env = process.env) {
  const file = configPath(env)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 })
  if (process.platform !== 'win32') {
    try {
      fs.chmodSync(file, 0o600)
    } catch {
      // Some network mounts refuse chmod; the file is still written.
    }
  }
  return file
}
