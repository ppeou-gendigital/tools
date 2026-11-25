// PAT lookup and storage.
//
// Order is deliberately boring: environment first (CI and agent sandboxes),
// then config.json, then the macOS Keychain. A token is never printed by any
// command; only its source and length are reported.

import { execFileSync } from 'node:child_process'

import { readConfig, writeConfig } from './config.mjs'

export const PAT_KINDS = ['jira', 'confluence']

const ENV_NAMES = {
  jira: ['JIRA_PAT', 'JIRA_TOKEN'],
  confluence: ['CONFLUENCE_PAT', 'CONFLUENCE_TOKEN'],
}

const LABELS = { jira: 'Jira', confluence: 'Confluence' }

function keychainService(kind) {
  return `jira-capacity:${kind}`
}

function keychainAccount(env) {
  return env.USER || env.USERNAME || 'jira-capacity'
}

function keychainRead(kind, env) {
  if (process.platform !== 'darwin') return ''
  try {
    return execFileSync(
      'security',
      [
        'find-generic-password',
        '-a',
        keychainAccount(env),
        '-s',
        keychainService(kind),
        '-w',
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim()
  } catch {
    return ''
  }
}

export function keychainWrite(kind, token, env = process.env) {
  if (process.platform !== 'darwin') return false
  execFileSync(
    'security',
    [
      'add-generic-password',
      '-a',
      keychainAccount(env),
      '-s',
      keychainService(kind),
      '-w',
      token,
      '-U',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  )
  return true
}

export function keychainDelete(kind, env = process.env) {
  if (process.platform !== 'darwin') return false
  try {
    execFileSync(
      'security',
      [
        'delete-generic-password',
        '-a',
        keychainAccount(env),
        '-s',
        keychainService(kind),
      ],
      { stdio: ['ignore', 'ignore', 'ignore'] },
    )
    return true
  } catch {
    return false
  }
}

// Returns the first configured token plus where it came from, so `auth status`
// can explain which layer is winning.
export function resolvePat(kind, env = process.env) {
  for (const name of ENV_NAMES[kind] ?? []) {
    const value = String(env[name] ?? '').trim()
    if (value) return { token: value, source: `$${name}` }
  }

  const config = readConfig(env)
  const stored = String(config.pats?.[kind] ?? '').trim()
  if (stored) return { token: stored, source: 'config.json' }

  const keychain = keychainRead(kind, env)
  if (keychain) return { token: keychain, source: 'macOS Keychain' }

  return { token: '', source: '' }
}

export function savePat(kind, token, env = process.env) {
  const value = String(token ?? '').trim()
  if (!value) throw new Error(`Refusing to store an empty ${LABELS[kind]} PAT.`)

  const config = readConfig(env)
  config.pats = { ...(config.pats ?? {}), [kind]: value }
  writeConfig(config, env)

  // A config copy would shadow the Keychain on the next read, so keep the two
  // stores mutually exclusive.
  keychainDelete(kind, env)
  return 'config.json'
}

export function savePatToKeychain(kind, token, env = process.env) {
  const value = String(token ?? '').trim()
  if (!value) throw new Error(`Refusing to store an empty ${LABELS[kind]} PAT.`)
  if (!keychainWrite(kind, value, env)) {
    throw new Error('The Keychain is only available on macOS.')
  }

  const config = readConfig(env)
  if (config.pats?.[kind]) {
    config.pats = { ...config.pats }
    delete config.pats[kind]
    if (Object.keys(config.pats).length === 0) delete config.pats
    writeConfig(config, env)
  }
  return 'macOS Keychain'
}

export function clearPat(kind, env = process.env) {
  const config = readConfig(env)
  if (config.pats?.[kind]) {
    config.pats = { ...config.pats }
    delete config.pats[kind]
    if (Object.keys(config.pats).length === 0) delete config.pats
    writeConfig(config, env)
  }
  return keychainDelete(kind, env)
}

export function patEnvHint(kind) {
  const names = ENV_NAMES[kind] ?? []
  return `Run \`jira-capacity setup\`, or set ${names.join(' or ')} (scripted: \`jira-capacity auth set --${kind} -\`).`
}

export function patLabel(kind) {
  return LABELS[kind] ?? kind
}
