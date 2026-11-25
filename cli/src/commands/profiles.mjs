// `profiles` command group: local store inspection, pull/push, and the
// field/people edits the skill proposes after a diff.

import { COMMON_FLAGS, parseArgs, requireValue } from '../args.mjs'
import { CliError } from '../http.mjs'
import {
  resolveFields,
  resolvePeople,
  resolveProjects,
  resolveSprint,
} from '../resolve.mjs'
import {
  findProfile,
  listProfiles,
  loadSources,
  parseTarget,
  publications,
  recordPublication,
  summarizeProfile,
  writeProfileFile,
} from '../store.mjs'
import { normalizeItems } from '../../../src/lib/jira/filters.js'
import { parseProfile, toExport } from '../../../src/lib/jira/profiles.js'
import {
  isJsonAttachment,
  profileFileName,
  safeFileName,
} from '../../../src/lib/jira/remote.js'
import { stampProfile } from '../stamp.mjs'

const PULL_FLAGS = { ...COMMON_FLAGS, from: 'string', 'dry-run': 'boolean' }
const PUSH_FLAGS = { ...COMMON_FLAGS, to: 'string', 'dry-run': 'boolean' }
const SET_FLAGS = {
  ...COMMON_FLAGS,
  name: 'string',
  project: 'repeat',
  type: 'repeat',
  status: 'repeat',
  resolution: 'repeat',
  sprint: 'string',
  'clear-sprint': 'boolean',
  'add-field': 'repeat',
  'remove-field': 'repeat',
  'add-person': 'repeat',
  'remove-person': 'repeat',
  'clear-people': 'boolean',
  'dry-run': 'boolean',
}

export async function runProfiles(argv, ctx) {
  const [action = 'list', ...rest] = argv

  switch (action) {
    case 'list':
      return list(rest, ctx)
    case 'show':
      return show(rest, ctx)
    case 'diff':
      return diff(rest, ctx)
    case 'pull':
      return pull(rest, ctx)
    case 'push':
      return push(rest, ctx)
    case 'set':
    case 'edit':
      return set(rest, ctx)
    case 'help':
    case '--help':
    case '-h':
      return help(ctx)
    default:
      throw usageError(`Unknown profiles action "${action}".`)
  }
}

function usageError(message) {
  const error = new CliError(message, { code: 'usage' })
  return error
}

/* --------------------------------- list -------------------------------- */

async function list(argv, ctx) {
  const { options } = parseArgs(argv, COMMON_FLAGS)
  if (options.help) return help(ctx)

  const sources = loadSources(ctx.env)
  const entries = listProfiles(ctx.env)
  const profiles = entries
    .filter((entry) => entry.profile)
    .map((entry) =>
      summarizeProfile(entry.profile, sources, {
        file: entry.file,
        filename: entry.filename,
      }),
    )
  const unreadable = entries
    .filter((entry) => entry.error)
    .map(({ file, filename, error }) => ({ file, filename, error }))

  ctx.out.result({ configDir: ctx.configDir, profiles, unreadable }, renderList)
}

function renderList({ configDir, profiles, unreadable }) {
  const lines = []

  if (profiles.length === 0) {
    lines.push(`No local profiles in ${configDir}.`)
    lines.push(
      'Pull one with: jira-capacity profiles pull --from confluence:<pageId>',
    )
  }

  for (const profile of profiles) {
    lines.push(`${profile.name}  (${profile.id})`)
    lines.push(`  file     ${profile.filename}`)
    lines.push(`  filters  ${describeFilters(profile)}`)
    lines.push(
      `  fields   ${profile.fields.report.length} report · ${profile.fields.fetch.length} fetch`,
    )
    lines.push(`  people   ${profile.people.join(', ') || '—'}`)
    lines.push(`  sync     ${describePublications(profile.publications)}`)
    lines.push(`  status   ${statusLabel(profile)}`)
  }

  for (const entry of unreadable ?? []) {
    lines.push(`! ${entry.filename}: ${entry.error}`)
  }

  return lines.join('\n')
}

function describeFilters(profile) {
  const parts = []
  if (profile.projects.length > 0) parts.push(profile.projects.join(', '))
  for (const sprint of profile.sprints) parts.push(`sprint ${sprint.name}`)
  const extra = ['types', 'statuses', 'resolutions']
    .map((key) => profile.filters[key]?.length ?? 0)
    .reduce((total, count) => total + count, 0)
  if (extra > 0) parts.push(`${extra} type/status filters`)
  return parts.join(' · ') || 'none'
}

function describePublications(publications = []) {
  if (publications.length === 0) return 'never published'
  return publications
    .map(
      (entry) =>
        `${entry.target}${entry.version ? ` v${entry.version}` : ''}${entry.syncedAt ? ` · ${entry.syncedAt}` : ''}`,
    )
    .join(' · ')
}

/* --------------------------------- show -------------------------------- */

async function show(argv, ctx) {
  const { positional, options } = parseArgs(argv, COMMON_FLAGS)
  if (options.help) return help(ctx)

  const entry = findProfile(requireValue(positional[0], 'Profile'), ctx.env)
  const sources = loadSources(ctx.env)
  const summary = summarizeProfile(entry.profile, sources, {
    file: entry.file,
    filename: entry.filename,
  })

  ctx.out.result(summary, renderShow)
}

function renderShow(profile) {
  const lines = []
  lines.push(`${profile.name}  (${profile.id})`)
  lines.push(`  file        ${profile.file}`)
  lines.push(`  updated     ${profile.updatedAt ?? '—'}${profile.updatedBy ? ` by ${profile.updatedBy}` : ''}`)

  for (const key of ['projects', 'sprints', 'types', 'statuses', 'resolutions']) {
    const values = profile.filters[key] ?? []
    if (values.length === 0) continue
    lines.push(
      `  ${key.padEnd(11)} ${values.map((item) => `${item.name} (${item.id})`).join(', ')}`,
    )
  }

  lines.push(
    `  report      ${profile.fields.report.map((field) => field.name).join(', ') || '—'}`,
  )
  lines.push(
    `  fetch       ${profile.fields.fetch.map((field) => field.name).join(', ') || '—'}`,
  )
  lines.push(`  people      ${profile.people.join(', ') || '—'}`)
  lines.push(`  sync        ${describePublications(profile.publications)}`)
  lines.push(`  status      ${statusLabel(profile)}`)
  return lines.join('\n')
}

function statusLabel(profile) {
  if (profile.publications.length === 0) return 'never published'
  return profile.dirty ? 'local changes (not published)' : 'current'
}

/* --------------------------------- diff -------------------------------- */

const FRONTEND_ONLY = new Set(['issuekey', 'subtask'])

async function diff(argv, ctx) {
  const { positional, options } = parseArgs(argv, COMMON_FLAGS)
  if (options.help) return help(ctx)

  const entry = findProfile(requireValue(positional[0], 'Profile'), ctx.env)
  const profile = entry.profile
  const jira = ctx.jira()

  const catalog = await jira.fieldCatalog()
  const liveById = new Map(catalog.map((field) => [field.id, field]))

  const selected = new Map()
  for (const field of [
    ...(profile.selection?.fetchFields ?? []),
    ...(profile.selection?.reportFields ?? []),
  ]) {
    if (!field?.id || selected.has(field.id)) continue
    selected.set(field.id, field)
  }

  const missingFields = []
  const renamedFields = []
  let checkedFields = 0

  for (const field of selected.values()) {
    if (FRONTEND_ONLY.has(field.id)) continue
    checkedFields += 1

    const live = liveById.get(field.id)
    if (!live) {
      missingFields.push({ id: field.id, name: field.name })
      continue
    }
    if (field.name && live.name && field.name !== live.name) {
      renamedFields.push({
        id: field.id,
        stored: field.name,
        live: live.name,
      })
    }
  }

  const resources = profile.selection?.resources ?? []
  const peopleOk = []
  const peopleMissing = []

  for (const resource of resources) {
    const name = resource.name ?? resource.id
    const matches = await jira.peopleSearch(String(name), { limit: 20 })
    const exact = matches.find(
      (person) =>
        person.name.toLowerCase() === String(name).toLowerCase() ||
        person.id.toLowerCase() === String(resource.id).toLowerCase(),
    )
    if (exact) peopleOk.push({ name: exact.name, id: exact.id })
    else {
      peopleMissing.push({
        name: String(name),
        suggestions: matches.slice(0, 3).map((person) => person.name),
      })
    }
  }

  const ok =
    missingFields.length === 0 &&
    renamedFields.length === 0 &&
    peopleMissing.length === 0

  ctx.out.result(
    {
      profile: { id: profile.id, name: profile.name, file: entry.file },
      fields: {
        checked: checkedFields,
        missing: missingFields,
        renamed: renamedFields,
      },
      people: {
        checked: resources.length,
        missing: peopleMissing,
        current: peopleOk,
      },
      ok,
    },
    renderDiff,
  )
}

function renderDiff(result) {
  const { profile, fields, people } = result
  const lines = [`Profile ${profile.name} (${profile.id})`]
  lines.push(
    `  fields   ${fields.checked} checked · ${fields.missing.length} missing · ${fields.renamed.length} renamed`,
  )
  for (const field of fields.missing) {
    lines.push(`    missing  ${field.id} — ${field.name}`)
  }
  for (const field of fields.renamed) {
    lines.push(`    renamed  ${field.id} — "${field.stored}" is now "${field.live}"`)
  }
  lines.push(
    `  people   ${people.checked} checked · ${people.missing.length} missing`,
  )
  for (const person of people.missing) {
    const hint = person.suggestions.length
      ? ` (closest: ${person.suggestions.join(', ')})`
      : ''
    lines.push(`    missing  ${person.name}${hint}`)
  }
  lines.push(`  result   ${result.ok ? 'in sync with Jira' : 'needs review'}`)
  return lines.join('\n')
}

/* --------------------------------- pull -------------------------------- */

async function pull(argv, ctx) {
  const { positional, options } = parseArgs(argv, PULL_FLAGS)
  if (options.help) return help(ctx)

  const ref = String(positional[0] ?? '').trim()
  const target = parseTarget(requireValue(options.from, '--from'))
  const dryRun = Boolean(options.dryRun)

  const attachments = await jsonAttachments(ctx, target)
  if (attachments.length === 0) {
    throw new CliError(
      `No JSON profile attachments on ${target.key}. Profiles are `.concat(
        '`*_<id>.json` files attached to a Jira ticket or a Confluence page.',
      ),
      { code: 'no-attachments' },
    )
  }

  const candidates = []
  const skipped = []
  for (const attachment of attachments) {
    const bytes = await downloadAttachment(ctx, target, attachment)
    let raw
    try {
      raw = JSON.parse(bytes.toString('utf8'))
    } catch {
      throw new CliError(
        `${attachment.filename} is not valid JSON; refusing to import it.`,
        { code: 'bad-profile' },
      )
    }

    if (!isProfileDocument(raw)) {
      skipped.push(attachment.filename)
      continue
    }

    const profile = parseProfile(raw, {
      fallbackName: attachment.filename.replace(/\.json$/i, ''),
    })
    candidates.push({ attachment, profile })
  }

  if (candidates.length === 0) {
    throw new CliError(
      `No JSON attachment on ${target.key} looks like a profile. Skipped: ${skipped.join(', ')}.`,
      { code: 'no-profiles' },
    )
  }

  const selected = ref
    ? candidates.filter(({ attachment, profile }) =>
        matchProfileRef(ref, attachment, profile),
      )
    : candidates

  if (selected.length === 0) {
    throw new CliError(
      `No attachment on ${target.key} matches "${ref}". Available: ${candidates
        .map(({ profile }) => profile.name)
        .join(', ')}.`,
      { code: 'no-match' },
    )
  }

  const existingIds = new Set(
    listProfiles(ctx.env)
      .map((entry) => entry.profile?.id)
      .filter(Boolean),
  )

  const imported = []
  for (const { attachment, profile } of selected) {
    const filename = safeFileName(attachment.filename)
    const action = existingIds.has(profile.id) ? 'updated' : 'created'

    if (!dryRun) {
      writeProfileFile(profile, filename, ctx.env)
      recordPublication(
        profile.id,
        target.key,
        {
          filename,
          attachmentId: attachment.id,
          version: attachment.version ?? null,
          remoteCreatedAt: attachment.created ?? null,
          syncedAt: new Date().toISOString(),
        },
        ctx.env,
      )
    }

    imported.push({
      action,
      id: profile.id,
      name: profile.name,
      filename,
      projects: (profile.selection?.filters?.projects ?? []).map(
        (item) => item.id,
      ),
    })
  }

  ctx.out.result(
    { target: target.key, dryRun, imported, skipped, configDir: ctx.configDir },
    renderPull,
  )
}

function isProfileDocument(raw) {
  return Boolean(
    raw &&
      typeof raw === 'object' &&
      !Array.isArray(raw) &&
      (raw.selection || raw.jira),
  )
}

function matchProfileRef(ref, attachment, profile) {
  const needle = ref.toLowerCase()
  const slug = needle.replace(/[^\w.-]+/g, '_')
  return (
    profile.id === ref ||
    profile.name.toLowerCase() === needle ||
    attachment.filename.toLowerCase().includes(slug)
  )
}

function renderPull({ target, dryRun, imported, skipped = [], configDir }) {
  const lines = [
    `${dryRun ? 'Would import' : 'Imported'} ${imported.length} profile${imported.length === 1 ? '' : 's'} from ${target}:`,
  ]
  for (const item of imported) {
    lines.push(
      `  ${item.action.padEnd(7)} ${item.name}  (${item.projects.join(', ') || 'no project'})  ${item.filename}`,
    )
  }
  for (const filename of skipped) {
    lines.push(`  ! skipped ${filename} (not a profile document)`)
  }
  if (!dryRun) lines.push(`Stored in ${configDir}/profiles.`)
  return lines.join('\n')
}

async function jsonAttachments(ctx, target) {
  if (target.kind === 'jira') {
    const attachments = await ctx.jira().listAttachments(target.id)
    return attachments.filter(isJsonAttachment)
  }

  await ctx.confluence().page(target.id)
  const attachments = await ctx.confluence().listAttachments(target.id)
  return attachments.filter(
    (attachment) => attachment.isJson || /\.json$/i.test(attachment.filename),
  )
}

async function downloadAttachment(ctx, target, attachment) {
  if (target.kind === 'jira') {
    return ctx.jira().downloadAttachment(attachment)
  }
  return ctx.confluence().downloadAttachment(attachment)
}

/* --------------------------------- push -------------------------------- */

async function push(argv, ctx) {
  const { positional, options } = parseArgs(argv, PUSH_FLAGS)
  if (options.help) return help(ctx)

  const entry = findProfile(requireValue(positional[0], 'Profile'), ctx.env)
  const target = parseTarget(requireValue(options.to, '--to'))
  const dryRun = Boolean(options.dryRun)

  const profile = structuredClone(entry.profile)
  const filename = profileFileName(profile.name, profile.id)
  const sources = loadSources(ctx.env)
  const previous = publications(profile.id, sources).find(
    (publication) => publication.target === target.key,
  )

  if (target.kind === 'jira') {
    return pushJira({
      ctx,
      entry,
      profile,
      filename,
      target,
      previous,
      dryRun,
    })
  }

  return pushConfluence({
    ctx,
    entry,
    profile,
    filename,
    target,
    previous,
    dryRun,
  })
}

async function pushJira({ ctx, entry, profile, filename, target, previous, dryRun }) {
  const jira = ctx.jira()
  const existing = await jira.listAttachments(target.id)
  const sameName = existing.filter(
    (attachment) =>
      attachment.filename === filename ||
      (previous?.attachmentId &&
        attachment.id === String(previous.attachmentId)),
  )

  if (dryRun) {
    ctx.out.result(
      {
        target: target.key,
        dryRun,
        filename,
        action: previous ? 'new version' : 'new attachment',
        replaces: sameName.map((attachment) => ({
          id: attachment.id,
          filename: attachment.filename,
        })),
      },
      renderPushDryRun,
    )
    return
  }

  await stampProfile(profile, ctx)
  const text = JSON.stringify(toExport(profile), null, 2)
  const uploaded = await jira.uploadAttachment(target.id, filename, text)

  const deleted = []
  const failed = []
  for (const attachment of sameName) {
    if (attachment.id === uploaded.id) continue
    try {
      await jira.deleteAttachment(attachment.id)
      deleted.push(attachment.filename)
    } catch (error) {
      failed.push(`${attachment.filename}: ${error?.message ?? error}`)
    }
  }

  writeProfileFile(profile, entry.filename, ctx.env)
  recordPublication(
    profile.id,
    target.key,
    {
      filename: uploaded.filename,
      attachmentId: uploaded.id,
      version: null,
      remoteCreatedAt: uploaded.created ?? null,
      syncedAt: new Date().toISOString(),
    },
    ctx.env,
  )

  ctx.out.result(
    {
      target: target.key,
      dryRun,
      filename: uploaded.filename,
      attachment: uploaded,
      replaced: deleted,
      failed,
    },
    renderPush,
  )
}

async function pushConfluence({ ctx, entry, profile, filename, target, previous, dryRun }) {
  const confluence = ctx.confluence()
  const page = await confluence.page(target.id)

  if (dryRun) {
    ctx.out.result(
      {
        target: target.key,
        title: page.title,
        dryRun,
        filename,
        action: previous ? 'new version' : 'new attachment',
      },
      renderPushDryRun,
    )
    return
  }

  await stampProfile(profile, ctx)
  const text = JSON.stringify(toExport(profile), null, 2)
  const uploaded = await confluence.uploadAttachment(
    target.id,
    filename,
    Buffer.from(text, 'utf8'),
    { comment: `Updated by jira-capacity CLI for ${profile.name}` },
  )

  writeProfileFile(profile, entry.filename, ctx.env)
  recordPublication(
    profile.id,
    target.key,
    {
      filename: uploaded.filename,
      attachmentId: uploaded.id,
      version: uploaded.version,
      remoteCreatedAt: null,
      syncedAt: new Date().toISOString(),
    },
    ctx.env,
  )

  ctx.out.result(
    {
      target: target.key,
      title: page.title,
      dryRun,
      filename: uploaded.filename,
      version: uploaded.version,
      attachment: uploaded,
    },
    renderPush,
  )
}

function renderPushDryRun(result) {
  const lines = [
    `Would push ${result.filename} to ${result.target}${result.title ? ` (${result.title})` : ''} as ${result.action}.`,
  ]
  for (const attachment of result.replaces ?? []) {
    lines.push(`  replace ${attachment.filename} (${attachment.id})`)
  }
  return lines.join('\n')
}

function renderPush(result) {
  const lines = [
    `Pushed ${result.filename} to ${result.target}${result.title ? ` (${result.title})` : ''}.`,
  ]
  if (result.version) lines.push(`  version  ${result.version}`)
  if (result.attachment?.id) lines.push(`  id       ${result.attachment.id}`)
  for (const name of result.replaced ?? []) {
    lines.push(`  replaced ${name}`)
  }
  for (const problem of result.failed ?? []) {
    lines.push(`  ! could not delete ${problem}`)
  }
  return lines.join('\n')
}

/* --------------------------------- set --------------------------------- */

async function set(argv, ctx) {
  const { positional, options } = parseArgs(argv, SET_FLAGS)
  if (options.help) return help(ctx)

  const entry = findProfile(requireValue(positional[0], 'Profile'), ctx.env)
  const profile = structuredClone(entry.profile)
  const selection = profile.selection ?? {}
  selection.filters = { ...(selection.filters ?? {}) }

  const changes = []
  const jira = () => ctx.jira()

  if (options.name) {
    profile.name = options.name.trim()
    changes.push(`name → ${profile.name}`)
  }

  if (options.project?.length) {
    selection.filters.projects = await resolveProjects(jira(), options.project)
    changes.push(
      `projects → ${selection.filters.projects.map((item) => item.id).join(', ')}`,
    )
  }

  for (const [flag, fieldName] of [
    ['type', 'issuetype'],
    ['status', 'status'],
    ['resolution', 'resolution'],
  ]) {
    const values = options[flag]
    if (!values?.length) continue
    selection.filters[`${flag}s`] = await resolveSuggestions(
      jira(),
      fieldName,
      values,
    )
    changes.push(
      `${flag}s → ${selection.filters[`${flag}s`].map((item) => item.name).join(', ')}`,
    )
  }

  if (options.clearSprint) {
    selection.filters.sprints = []
    changes.push('sprint → none')
  } else if (options.sprint) {
    const sprint = await resolveSprint(jira(), options.sprint)
    selection.filters.sprints = [sprint]
    changes.push(`sprint → ${sprint.name} (${sprint.id})`)
  }

  if (options.addField?.length) {
    const added = await resolveFields(jira(), options.addField)
    selection.fetchFields = appendItems(selection.fetchFields, added)
    selection.reportFields = appendItems(selection.reportFields, added)
    changes.push(`fields + ${added.map((field) => field.name).join(', ')}`)
  }

  if (options.removeField?.length) {
    const removed = await resolveFields(jira(), options.removeField)
    const ids = new Set(removed.map((field) => field.id))
    selection.fetchFields = (selection.fetchFields ?? []).filter(
      (field) => !ids.has(field.id),
    )
    selection.reportFields = (selection.reportFields ?? []).filter(
      (field) => !ids.has(field.id),
    )
    changes.push(`fields − ${removed.map((field) => field.name).join(', ')}`)
  }

  if (options.clearPeople) {
    selection.resources = []
    changes.push('people → none')
  }

  if (options.addPerson?.length) {
    const added = await resolvePeople(jira(), options.addPerson)
    selection.resources = appendPeople(selection.resources, added)
    changes.push(`people + ${added.map((person) => person.name).join(', ')}`)
  }

  if (options.removePerson?.length) {
    const names = new Set(
      options.removePerson.map((name) => String(name).trim().toLowerCase()),
    )
    selection.resources = (selection.resources ?? []).filter(
      (resource) =>
        !names.has(String(resource.name ?? '').toLowerCase()) &&
        !names.has(
          String(resource.id ?? '')
            .replace(/^resource:/, '')
            .toLowerCase(),
        ),
    )
    changes.push(`people − ${options.removePerson.join(', ')}`)
  }

  if (changes.length === 0) {
    throw usageError(
      'Nothing to change. Pass --sprint, --add-field, --add-person, --project, …',
    )
  }

  profile.selection = selection

  if (options.dryRun) {
    ctx.out.result(
      {
        dryRun: true,
        profile: { id: profile.id, name: profile.name },
        changes,
        summary: summarizeProfile(profile, loadSources(ctx.env), {
          file: entry.file,
          filename: entry.filename,
        }),
      },
      ({ profile: target, changes: list }) =>
        `Would update ${target.name}:\n${list.map((change) => `  ${change}`).join('\n')}`,
    )
    return
  }

  await stampProfile(profile, ctx)
  writeProfileFile(profile, entry.filename, ctx.env)

  ctx.out.result(
    {
      profile: { id: profile.id, name: profile.name, file: entry.file },
      changes,
      summary: summarizeProfile(profile, loadSources(ctx.env), {
        file: entry.file,
        filename: entry.filename,
      }),
    },
    ({ profile: target, changes: list }) =>
      `Updated ${target.name} (${target.id}) — local changes, not published:\n${list.map((change) => `  ${change}`).join('\n')}`,
  )
}

function appendItems(current = [], added = []) {
  const result = normalizeItems(current)
  for (const item of normalizeItems(added)) {
    if (!result.some((entry) => entry.id === item.id)) result.push(item)
  }
  return result
}

function appendPeople(current = [], added = []) {
  const result = [...(current ?? [])]
  for (const person of added) {
    if (result.some((resource) => resource.name === person.name)) continue
    result.push({ id: `resource:${person.id}`, name: person.name })
  }
  return result
}

async function resolveSuggestions(jira, fieldName, values = []) {
  const items = []
  for (const value of values) {
    const matches = await jira.suggest(fieldName, value)
    const exact =
      matches.find(
        (item) => item.name.toLowerCase() === String(value).toLowerCase(),
      ) ?? matches.find((item) => item.id === value)

    if (!exact) {
      const suggestions = matches.slice(0, 5).map((item) => item.name)
      throw new CliError(
        `No ${fieldName} matches "${value}".${suggestions.length ? ` Closest: ${suggestions.join(', ')}.` : ''}`,
        { code: 'no-value' },
      )
    }
    items.push(exact)
  }
  return normalizeItems(items)
}

/* --------------------------------- help -------------------------------- */

function help(ctx) {
  ctx.out.info(`Usage: jira-capacity profiles <action> [options]

Actions:
  list
      Show local profiles, their filters, and publication status.
  show <profile>
      Full filters, report/fetch fields, people, and sync history.
  diff <profile>
      Check selected fields and people against live Jira.
  pull [profile] --from jira:<KEY> | --from confluence:<PAGE>
      Import one or all JSON profile attachments. Existing ids are updated.
  push <profile> --to jira:<KEY> | --to confluence:<PAGE>
      Publish the profile as a new attachment or attachment version.
  set <profile> [changes]
      Edit a profile in place:
        --name <name>
        --project <KEY>          (repeatable)
        --type/--status/--resolution <name>
        --sprint <name|id>       --clear-sprint
        --add-field <id|name>    --remove-field <id|name>
        --add-person <name>      --remove-person <name>   --clear-people
        --dry-run

Every action accepts --json and --config-dir.`)
}
