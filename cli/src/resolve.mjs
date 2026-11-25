// Turns user input (names, ids) into the exact `{ id, name }` items the stored
// selection keeps. Everything here needs a live Jira client; nothing is cached.

import { CliError } from './http.mjs'
import { ISSUE_FIELDS } from '../../src/lib/jira/fields.js'
import { normalizeItems } from '../../src/lib/jira/filters.js'

function normalize(value) {
  return String(value ?? '').trim().toLowerCase()
}

const KNOWN_FIELDS = new Map(
  ISSUE_FIELDS.flatMap((field) => [
    [field.id.toLowerCase(), field],
    [field.name.toLowerCase(), field],
  ]),
)

// Accepts an id (`customfield_10006`), a display name (`Story Points`), or the
// built-in key (`issuekey`). Unknown values fail with a pointer to `fields`.
export async function resolveFields(jira, values = []) {
  const wanted = values.map((value) => String(value).trim()).filter(Boolean)
  if (wanted.length === 0) return []

  const needsCatalog = wanted.some((value) => !KNOWN_FIELDS.has(normalize(value)))
  const catalog = needsCatalog
    ? (await jira.fieldCatalog()).map((field) => ({
        id: field.id,
        name: field.name,
      }))
    : []

  return wanted.map((value) => {
    const known = KNOWN_FIELDS.get(normalize(value))
    if (known) return { id: known.id, name: known.name }

    const match =
      catalog.find((field) => field.id.toLowerCase() === normalize(value)) ??
      catalog.find((field) => field.name.toLowerCase() === normalize(value))

    if (!match) {
      throw new CliError(
        `No Jira field matches "${value}". Run \`jira-capacity fields search ${value}\` to see ids.`,
        { code: 'no-field' },
      )
    }
    return { id: match.id, name: match.name }
  })
}

// Exact display-name or username match. Near misses are listed so a typo is
// fixable without another round trip.
export async function resolvePeople(jira, values = []) {
  const names = values.map((value) => String(value).trim()).filter(Boolean)
  const people = []

  for (const name of names) {
    const matches = await jira.peopleSearch(name, { limit: 20 })
    const exact =
      matches.find((person) => normalize(person.name) === normalize(name)) ??
      matches.find((person) => normalize(person.id) === normalize(name))

    if (!exact) {
      const suggestions = matches
        .slice(0, 5)
        .map((person) => person.name)
        .join(', ')
      throw new CliError(
        `No Jira user is named "${name}".${suggestions ? ` Closest matches: ${suggestions}.` : ''}`,
        { code: 'no-person' },
      )
    }

    people.push({ id: exact.id, name: exact.name })
  }

  return people
}

// Sprint filters must store the numeric id because `buildJql` emits
// `Sprint in (123)`. A name is resolved through the same picker the extension
// uses, preferring an exact name match.
export async function resolveSprint(jira, value) {
  const raw = String(value ?? '').trim()
  if (!raw) throw new CliError('A sprint name or id is required.', { code: 'usage' })

  if (/^\d+$/.test(raw)) {
    const [match] = await jira.sprintPicker(raw)
    if (match && match.id === raw) return { id: match.id, name: match.name }
    return { id: raw, name: raw }
  }

  const matches = await jira.sprintPicker(raw, { limit: 28 })
  const exact = matches.filter(
    (sprint) => normalize(sprint.name) === normalize(raw),
  )

  if (exact.length === 1) return { id: exact[0].id, name: exact[0].name }
  if (exact.length > 1) {
    throw new CliError(
      `"${raw}" matches ${exact.length} sprints (${exact
        .map((sprint) => `${sprint.name} = ${sprint.id}`)
        .join(', ')}). Pass the id instead.`,
      { code: 'ambiguous-sprint' },
    )
  }

  const suggestions = matches.slice(0, 5).map((sprint) => sprint.name)
  throw new CliError(
    `No sprint is named "${raw}".${suggestions.length ? ` Closest matches: ${suggestions.join(', ')}.` : ''} Run \`jira-capacity sprints --project KEY --state future\`.`,
    { code: 'no-sprint' },
  )
}

// Project keys are case-insensitive in Jira but stored uppercase.
export async function resolveProjects(jira, values = []) {
  const keys = values.map((value) => String(value).trim()).filter(Boolean)
  const projects = []

  for (const key of keys) {
    const matches = await jira.projectSearch(key, { limit: 20 })
    const exact =
      matches.find((project) => normalize(project.id) === normalize(key)) ??
      matches.find((project) => normalize(project.name) === normalize(key))

    if (!exact) {
      throw new CliError(
        `No Jira project matches "${key}". Run \`jira-capacity projects search ${key}\`.`,
        { code: 'no-project' },
      )
    }
    projects.push({ id: exact.id.toUpperCase(), name: exact.name })
  }

  return normalizeItems(projects)
}
