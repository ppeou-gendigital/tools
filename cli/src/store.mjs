// Local profile store. Files are byte-compatible with what the extension
// writes to a ticket, so a profile published from here opens in the extension
// and vice versa.
//
// Publication history lives in sources.json rather than inside the profile:
// the profile document stays a plain snapshot, matching the extension's
// `toExport` shape.

import fs from 'node:fs'
import path from 'node:path'

import { CliError } from './http.mjs'
import {
  normalizeResources,
  parseProfile,
  toExport,
} from '../../src/lib/jira/profiles.js'
import { profileFileName } from '../../src/lib/jira/remote.js'
import { FILTER_KEYS } from '../../src/lib/jira/filters.js'
import { profilesDir, sourcesPath } from './config.mjs'

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

export function loadSources(env = process.env) {
  const file = sourcesPath(env)
  if (!fs.existsSync(file)) return { version: 1, profiles: {} }
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'))
    return {
      version: 1,
      profiles: raw?.profiles && typeof raw.profiles === 'object' ? raw.profiles : {},
    }
  } catch {
    throw new CliError(`Could not read ${file}. Delete it to start over.`, {
      code: 'bad-sources',
    })
  }
}

export function saveSources(sources, env = process.env) {
  ensureDir(path.dirname(sourcesPath(env)))
  fs.writeFileSync(sourcesPath(env), `${JSON.stringify(sources, null, 2)}\n`)
}

export function listProfiles(env = process.env) {
  const dir = profilesDir(env)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => {
      const file = path.join(dir, name)
      try {
        const profile = parseProfile(JSON.parse(fs.readFileSync(file, 'utf8')), {
          fallbackName: name.replace(/\.json$/i, ''),
        })
        return { file, filename: name, profile }
      } catch (error) {
        return {
          file,
          filename: name,
          error: error?.message ?? 'unreadable profile',
        }
      }
    })
}

export function findProfile(ref, env = process.env) {
  if (!ref) throw new CliError('A profile name or id is required.', { code: 'usage' })
  const needle = String(ref).toLowerCase()

  const entries = listProfiles(env)
  const match =
    entries.find((entry) => entry.profile?.id === ref) ??
    entries.find((entry) => entry.profile?.name?.toLowerCase() === needle) ??
    entries.find((entry) => entry.filename.toLowerCase() === `${needle}.json`) ??
    entries.find((entry) => entry.profile?.name?.toLowerCase().includes(needle))

  if (!match || match.error) {
    const available = entries
      .filter((entry) => entry.profile)
      .map((entry) => entry.profile.name)
    throw new CliError(
      `No profile matches "${ref}".${available.length ? ` Known profiles: ${available.join(', ')}.` : ' Run `jira-capacity profiles pull` first.'}`,
      { code: 'no-profile' },
    )
  }

  return match
}

export function writeProfile(profile, env = process.env) {
  const filename = profileFileName(profile.name, profile.id)
  return writeProfileFile(profile, filename, env)
}

// Pull keeps the remote file name so a later push updates that same
// attachment instead of creating a second one.
export function writeProfileFile(profile, filename, env = process.env) {
  const dir = profilesDir(env)
  ensureDir(dir)

  const file = path.join(dir, path.basename(String(filename)))
  fs.writeFileSync(file, `${JSON.stringify(toExport(profile), null, 2)}\n`)
  return { file, filename: path.basename(file), profile }
}

export function removeProfileFile(file) {
  if (fs.existsSync(file)) fs.unlinkSync(file)
}

// One shape for `profiles list`, `profiles show`, and the skill's context step.
export function summarizeProfile(profile, sources, extra = {}) {
  const filters = profile.selection?.filters ?? {}
  const resources = normalizeResources(profile.selection?.resources ?? [])
  const published = publications(profile.id, sources)

  return {
    id: profile.id,
    name: profile.name,
    ...extra,
    updatedAt: profile.updatedAt ?? null,
    updatedBy: profile.updatedBy ?? '',
    projects: (filters.projects ?? []).map((item) => item.id),
    sprints: (filters.sprints ?? []).map((item) => ({
      id: item.id,
      name: item.name,
    })),
    filters: FILTER_KEYS.reduce((result, key) => {
      result[key] = (filters[key] ?? []).map((item) => ({
        id: item.id,
        name: item.name,
      }))
      return result
    }, {}),
    fields: {
      fetch: (profile.selection?.fetchFields ?? []).map((field) => ({
        id: field.id,
        name: field.name,
      })),
      report: (profile.selection?.reportFields ?? []).map((field) => ({
        id: field.id,
        name: field.name,
      })),
    },
    people: resources.map((resource) => resource.name),
    publications: published.map((entry) => ({
      target: entry.target,
      filename: entry.filename ?? '',
      version: entry.version ?? null,
      attachmentId: entry.attachmentId ?? null,
      syncedAt: entry.syncedAt ?? null,
    })),
    dirty: isDirty(profile, sources),
  }
}

export function publications(profileId, sources) {
  const entries = sources.profiles?.[profileId] ?? {}
  return Object.entries(entries).map(([target, meta]) => ({ target, ...meta }))
}

export function recordPublication(profileId, target, meta, env = process.env) {
  const sources = loadSources(env)
  const forProfile = sources.profiles[profileId] ?? {}
  sources.profiles[profileId] = {
    ...forProfile,
    [target]: { ...meta, syncedAt: meta.syncedAt ?? new Date().toISOString() },
  }
  saveSources(sources, env)
  return sources
}

export function forgetPublication(profileId, target, env = process.env) {
  const sources = loadSources(env)
  const forProfile = { ...(sources.profiles?.[profileId] ?? {}) }
  delete forProfile[target]
  sources.profiles[profileId] = forProfile
  saveSources(sources, env)
}

// A profile is dirty when it was edited after its newest publication, or has
// never been published at all.
export function isDirty(profile, sources) {
  const published = publications(profile.id, sources)
  if (published.length === 0) return true
  const newest = published
    .map((entry) => String(entry.syncedAt ?? ''))
    .sort()
    .at(-1)
  return String(profile.updatedAt ?? '') > String(newest ?? '')
}

export function describeTarget(target) {
  const [kind, rest] = String(target).split(':')
  return kind === 'confluence' ? `Confluence ${rest}` : `Jira ${rest}`
}

// `jira:KEY` or `confluence:PAGEID`, validated once so commands can share it.
// A full browse/page URL is accepted too, because that is what people paste.
export function parseTarget(value) {
  const raw = String(value ?? '').trim()
  const match = /^(jira|confluence):(.+)$/i.exec(raw)
  if (!match) {
    throw new CliError(
      'Ship to exactly one target: --to jira:WEBEXP-123 or --to confluence:1049602420.',
      { code: 'usage' },
    )
  }

  const kind = match[1].toLowerCase()
  let id = match[2].trim()

  if (/^https?:\/\//i.test(id)) {
    try {
      const url = new URL(id)
      if (kind === 'confluence') {
        id =
          url.searchParams.get('pageId') ||
          /\/pages\/(\d+)/.exec(url.pathname)?.[1] ||
          id
      } else {
        id = /\/browse\/([A-Za-z][A-Za-z0-9_]*-\d+)/.exec(url.pathname)?.[1] ?? id
      }
    } catch {
      // keep the raw value; the API call will produce the useful error
    }
  }

  return { kind, id, key: `${kind}:${id}` }
}
