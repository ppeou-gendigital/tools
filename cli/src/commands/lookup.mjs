// Read-only lookups: sprints, fields, people, projects. These mirror the
// extension's pickers so the skill can resolve names before touching a profile.

import { COMMON_FLAGS, parseArgs, requireValue } from '../args.mjs'
import { CliError } from '../http.mjs'

const SPRINT_FLAGS = {
  ...COMMON_FLAGS,
  project: 'string',
  board: 'string',
  state: 'string',
  limit: 'string',
}

const SEARCH_FLAGS = { ...COMMON_FLAGS, limit: 'string' }

export async function runSprints(argv, ctx) {
  const { options } = parseArgs(argv, SPRINT_FLAGS)
  if (options.help) return sprintsHelp(ctx)

  const state = (options.state ?? 'future').toLowerCase()
  if (!['future', 'active', 'all'].includes(state)) {
    throw new CliError('--state must be future, active, or all.', {
      code: 'usage',
    })
  }

  const limit = clampLimit(options.limit, 50)
  const jira = ctx.jira()
  const project = options.project?.trim().toUpperCase() ?? ''
  if (project && !/^[A-Z][A-Z0-9_]*$/.test(project)) {
    throw new CliError(
      `"${options.project}" does not look like a Jira project key.`,
      { code: 'usage' },
    )
  }

  // Prefer the board API: it also lists a sprint that has no issues yet, which
  // the JQL fallback cannot see. Any failure falls through silently; the JQL
  // result is still correct, just blind to empty sprints.
  const agile = await sprintsFromBoard(jira, {
    project,
    board: options.board?.trim() ?? '',
    state,
    limit,
  })

  const { sprints, source, board } =
    agile ?? (await sprintsFromJql(jira, { project, state, limit }))

  ctx.out.result({ project, state, board, source, sprints }, renderSprints)
}

async function sprintsFromBoard(jira, { project, board, state, limit }) {
  const boardId = /^\d+$/.test(board) ? board : ''
  if (!boardId && !project) return null

  try {
    let target = null
    if (boardId) {
      target = { id: boardId, name: boardId }
    } else {
      const boards = await jira.agileBoards(project)
      target =
        boards.find((entry) => entry.type === 'scrum') ?? boards[0] ?? null
      if (!target) return null
    }

    const sprints = (await jira.agileSprints(target.id, { state, limit }))
      .sort(compareSprints)
      .slice(0, limit)

    return { sprints, source: 'board', board: target }
  } catch (error) {
    if (!(error instanceof CliError)) throw error
    if (error.code === 'unauthorized') throw error
    return null
  }
}

async function sprintsFromJql(jira, { project, state, limit }) {
  const states = state === 'all' ? ['active', 'future'] : [state]
  const seen = new Map()

  for (const value of states) {
    const sprints = await jira.sprints(project, { state: value, limit })
    for (const sprint of sprints) {
      if (!seen.has(sprint.id)) seen.set(sprint.id, sprint)
    }
  }

  return {
    sprints: [...seen.values()].sort(compareSprints).slice(0, limit),
    source: 'jql',
    board: null,
  }
}

function compareSprints(a, b) {
  return String(a.startDate ?? '').localeCompare(String(b.startDate ?? ''))
}

function renderSprints({ project, state, board, source, sprints }) {
  if (sprints.length === 0) {
    const where = project ? ` for ${project}` : ''
    const hint =
      source === 'jql'
        ? '\nA sprint with no issues yet is invisible to JQL. If you know its name, pass it to --sprint.'
        : ''
    return `No ${state === 'all' ? '' : `${state} `}sprints${where}.${hint}`
  }

  const scope = project ? ` for ${project}` : ''
  const from = board ? ` · board ${board.name}` : ''
  const lines = [
    `${state === 'all' ? 'Active and future' : state} sprints${scope}${from}:`,
  ]
  for (const sprint of sprints) {
    const dates = [sprint.startDate?.slice(0, 10), sprint.endDate?.slice(0, 10)]
      .filter(Boolean)
      .join(' → ')
    lines.push(
      `  ${sprint.name.padEnd(28)} ${String(sprint.state ?? '').padEnd(7)} ${dates.padEnd(24)} id ${sprint.id}`,
    )
  }
  if (source === 'jql') {
    lines.push(
      'Note: listed from a JQL search, so a sprint with no issues yet is missing.',
    )
  }
  return lines.join('\n')
}

export async function runFields(argv, ctx) {
  const [action = 'search', ...rest] = argv
  if (action === 'help' || action === '--help' || action === '-h') {
    return fieldsHelp(ctx)
  }
  if (action !== 'search' && action !== 'list') {
    throw new CliError(`Unknown fields action "${action}".`, { code: 'usage' })
  }

  const { positional, options } = parseArgs(rest, SEARCH_FLAGS)
  if (options.help) return fieldsHelp(ctx)

  const query = String(positional[0] ?? '').trim()
  const limit = clampLimit(options.limit, 25)
  const catalog = await ctx.jira().fieldCatalog()

  const matches = rank(catalog, query, (field) => [field.id, field.name]).slice(
    0,
    limit,
  )

  ctx.out.result(
    { query, fields: matches.map(({ field, reason }) => ({ ...field, match: reason })) },
    ({ query: q, fields }) => {
      if (fields.length === 0) return `No fields match "${q}".`
      return [
        `${fields.length} field${fields.length === 1 ? '' : 's'} matching "${q}":`,
        ...fields.map(
          (field) =>
            `  ${field.id.padEnd(22)} ${field.name}${field.custom ? '  (custom)' : ''}`,
        ),
      ].join('\n')
    },
  )
}

export async function runPeople(argv, ctx) {
  const [action = 'search', ...rest] = argv
  if (action === 'help' || action === '--help' || action === '-h') {
    return peopleHelp(ctx)
  }
  if (action !== 'search' && action !== 'list') {
    throw new CliError(`Unknown people action "${action}".`, { code: 'usage' })
  }

  const { positional, options } = parseArgs(rest, SEARCH_FLAGS)
  if (options.help) return peopleHelp(ctx)

  const query = requireValue(positional[0], 'A name to search for')
  const limit = clampLimit(options.limit, 25)
  const users = await ctx.jira().peopleSearch(query, { limit })

  ctx.out.result(
    { query, users },
    ({ query: q, users: people }) => {
      if (people.length === 0) return `No Jira users match "${q}".`
      return [
        `${people.length} user${people.length === 1 ? '' : 's'} matching "${q}":`,
        ...people.map((person) => `  ${person.name.padEnd(32)} ${person.id}`),
      ].join('\n')
    },
  )
}

export async function runProjects(argv, ctx) {
  const [action = 'search', ...rest] = argv
  if (action === 'help' || action === '--help' || action === '-h') {
    return projectsHelp(ctx)
  }
  if (action !== 'search' && action !== 'list') {
    throw new CliError(`Unknown projects action "${action}".`, { code: 'usage' })
  }

  const { positional, options } = parseArgs(rest, SEARCH_FLAGS)
  if (options.help) return projectsHelp(ctx)

  const query = requireValue(positional[0], 'A project key or name')
  const limit = clampLimit(options.limit, 25)
  const projects = await ctx.jira().projectSearch(query, { limit })

  ctx.out.result(
    { query, projects },
    ({ query: q, projects: list }) => {
      if (list.length === 0) return `No Jira projects match "${q}".`
      return [
        `${list.length} project${list.length === 1 ? '' : 's'} matching "${q}":`,
        ...list.map((project) => `  ${project.id.padEnd(12)} ${project.name}`),
      ].join('\n')
    },
  )
}

function clampLimit(value, fallback) {
  if (value === undefined || value === '') return fallback
  const number = Number(value)
  if (!Number.isInteger(number) || number <= 0 || number > 500) {
    throw new CliError('--limit must be a whole number between 1 and 500.', {
      code: 'usage',
    })
  }
  return number
}

// Exact, then prefix, then word-start, then substring — the same ranking the
// extension applies locally.
function rank(items, query, keysOf) {
  const needle = query.toLowerCase()
  const scored = []

  for (const item of items) {
    const keys = keysOf(item).filter(Boolean).map((value) => String(value).toLowerCase())
    if (!needle) {
      scored.push({ field: item, reason: 'all', score: 4 })
      continue
    }

    let score = -1
    let reason = ''
    for (const key of keys) {
      if (key === needle) {
        score = 0
        reason = 'exact'
        break
      }
      if (key.startsWith(needle)) {
        score = Math.max(score, 1)
        reason = reason || 'prefix'
      } else if (key.split(/[\s_.-]+/).some((word) => word.startsWith(needle))) {
        score = Math.max(score, 2)
        reason = reason || 'word'
      } else if (key.includes(needle)) {
        score = Math.max(score, 3)
        reason = reason || 'substring'
      }
    }

    if (score >= 0) scored.push({ field: item, reason, score })
  }

  return scored
    .sort(
      (a, b) =>
        a.score - b.score ||
        String(a.field.name ?? '').localeCompare(String(b.field.name ?? '')),
    )
    .map(({ field, reason }) => ({ field, reason }))
}

function sprintsHelp(ctx) {
  ctx.out.info(`Usage: jira-capacity sprints [--project KEY] [--board ID] [--state future|active|all]

Lists sprint ids, names, dates, and state. With --project, the project's scrum
board is used, so a sprint that has no issues yet still appears. On instances
without the Agile API it falls back to a JQL search (empty sprints invisible).

Names are display-only: profiles store the numeric id because JQL needs it.`)
}

function fieldsHelp(ctx) {
  ctx.out.info(`Usage: jira-capacity fields search <text>

Searches the live field catalog by id or display name.`)
}

function peopleHelp(ctx) {
  ctx.out.info(`Usage: jira-capacity people search <text>

Searches assignable Jira users by display name or username.`)
}

function projectsHelp(ctx) {
  ctx.out.info(`Usage: jira-capacity projects search <text>

Searches Jira projects by key or name.`)
}
