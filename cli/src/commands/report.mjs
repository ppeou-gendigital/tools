// `report` and `comments`: resolve a sprint, run one search, render through the
// extension's own table builder, and copy or write the result.

import { COMMON_FLAGS, parseArgs, requireValue } from '../args.mjs'
import { CliError } from '../http.mjs'
import { copyHtml, writeExcelHtml } from '../clipboard.mjs'
import {
  capacityFields,
  capacityTable,
  commentFields,
  commentsTable,
  hasFilters,
  jqlFor,
} from '../report.mjs'
import { resolveSprint } from '../resolve.mjs'
import { findProfile, loadSources, summarizeProfile, writeProfileFile } from '../store.mjs'
import { stampProfile } from '../stamp.mjs'
import { COMMENT_EXPORT_FIELDS } from '../../../src/lib/jira/fields.js'

const REPORT_FLAGS = {
  ...COMMON_FLAGS,
  profile: 'string',
  sprint: 'string',
  'clear-sprint': 'boolean',
  save: 'boolean',
  'dry-run': 'boolean',
  copy: 'boolean',
  out: 'string',
}

export async function runReport(argv, ctx, { mode = 'capacity' } = {}) {
  const { options } = parseArgs(argv, REPORT_FLAGS)
  if (options.help) return help(ctx, mode)

  const ref = requireValue(options.profile, '--profile')
  const entry = findProfile(ref, ctx.env)
  const profile = structuredClone(entry.profile)
  const selection = profile.selection

  if (!selection) {
    throw new CliError(`Profile "${profile.name}" has no selection.`, {
      code: 'bad-profile',
    })
  }

  const jira = ctx.jira()

  if (options.sprint) {
    const sprint = await resolveSprint(jira, options.sprint)
    selection.filters = {
      ...(selection.filters ?? {}),
      sprints: [sprint],
    }
  } else if (options.clearSprint) {
    selection.filters = { ...(selection.filters ?? {}), sprints: [] }
  }

  if (!hasFilters(selection)) {
    throw new CliError(
      'This profile has no filters, and an empty filter set would export the whole Jira instance. Add --sprint or edit the profile.',
      { code: 'no-filters' },
    )
  }

  if (options.copy && options.out) {
    throw new CliError('Choose one of --copy or --out, not both.', {
      code: 'usage',
    })
  }

  const jql = jqlFor(selection)
  const fields = mode === 'comments' ? commentFields() : capacityFields(selection)
  const resources = selection.resources ?? []
  const columns =
    mode === 'comments'
      ? COMMENT_EXPORT_FIELDS.map((field) => field.name)
      : [
          ...(selection.reportFields ?? []).map((field) => field.name),
          ...resources.map((resource) => resource.name),
        ]
  const sprint = selection.filters?.sprints?.[0] ?? null

  if (options.dryRun) {
    const total = await jira.count(jql)
    // Capacity rows are parent issues only, so the useful preview number is the
    // count after excluding subtasks. Comments render parents and children, so
    // the raw match count is already the right shape there.
    const issues =
      mode === 'comments'
        ? total
        : await jira.count(
            `${stripOrderBy(jql)} AND issuetype not in subTaskIssueTypes()`,
          )

    ctx.out.result(
      {
        mode,
        dryRun: true,
        profile: { id: profile.id, name: profile.name },
        sprint,
        jql,
        matches: total,
        issues,
        columns,
        people: resources.map((resource) => resource.name),
        copy: !options.out,
        out: options.out ?? null,
        save: Boolean(options.save),
      },
      renderDryRun,
    )
    return
  }

  const found = await jira.searchAll(jql, {
    fields,
    onPage: ({ loaded, total }) => ctx.out.debug(`  … ${loaded}/${total} issues`),
  })

  const payload = { issues: found.issues, total: found.total }
  const table =
    mode === 'comments'
      ? commentsTable({ payload, origin: ctx.jiraBase })
      : capacityTable({ selection, payload, origin: ctx.jiraBase })

  // The extension refuses an empty result instead of copying a header-only
  // table, so the CLI does the same: an empty export looks like a bug.
  if (table.issues === 0) {
    throw new CliError(
      `No issues matched ${jql}. Check the sprint, or run --dry-run to inspect the JQL.`,
      { code: 'no-issues' },
    )
  }

  let outFile = null
  let target = 'clipboard'
  if (options.out) {
    outFile = writeExcelHtml(options.out, table.html)
    target = outFile
  } else {
    await copyHtml(table.html)
  }

  // `--save` is about persisting a sprint choice, so it is a no-op (with a
  // warning) when no sprint flag was given; stamping the profile anyway would
  // wrongly mark it "local changes".
  const sprintChanged = Boolean(options.sprint || options.clearSprint)
  let saved = false
  if (options.save && sprintChanged) {
    await stampProfile(profile, ctx)
    writeProfileFile(profile, entry.filename, ctx.env)
    saved = true
  } else if (options.save) {
    ctx.out.warn('--save had nothing to store: pass --sprint or --clear-sprint.')
  }

  const noun = table.issues === 1 ? 'issue' : 'issues'
  const result = {
    mode,
    dryRun: false,
    profile: { id: profile.id, name: profile.name },
    sprint,
    jql,
    issues: table.issues,
    rows: table.rowCount,
    columns,
    people: table.people ?? [],
    target,
    saved,
    summary: `${options.out ? 'Wrote' : 'Copied'} ${table.rowCount} rows for ${table.issues} ${noun}${options.out ? ` to ${outFile}` : ' — paste into Excel'}.`,
    summaryProfile: summarizeProfile(profile, loadSources(ctx.env), {
      file: entry.file,
      filename: entry.filename,
    }),
  }

  ctx.out.result(result, renderReport)
}

function stripOrderBy(jql) {
  return String(jql ?? '').replace(/\s+ORDER\s+BY\s+[\s\S]*$/i, '')
}

function renderDryRun(result) {
  const lines = []
  lines.push(
    `${result.mode === 'comments' ? 'Tickets and comments' : 'Capacity'} preview — ${result.profile.name}`,
  )
  lines.push(`  sprint   ${result.sprint ? `${result.sprint.name} (${result.sprint.id})` : '—'}`)
  lines.push(`  jql      ${result.jql}`)
  lines.push(`  matches  ${result.matches}`)
  if (result.mode !== 'comments' && result.issues !== result.matches) {
    lines.push(`  rows     ${result.issues} parent issues (subtasks roll up)`)
  } else {
    lines.push(`  rows     ${result.issues}`)
  }
  lines.push(`  columns  ${result.columns.join(', ')}`)
  if (result.people.length > 0) {
    lines.push(`  people   ${result.people.join(', ')}`)
  }
  lines.push(
    `  output   ${result.out ? `file ${result.out}` : 'clipboard (--out to write a file)'}`,
  )
  if (result.save) lines.push('  save     sprint will be stored on the profile')
  return lines.join('\n')
}

function renderReport(result) {
  const lines = [result.summary]

  if (result.people?.length) {
    for (const person of result.people) {
      lines.push(`  ${String(person.hours).padStart(6)}h  ${person.name}`)
    }
  }

  if (result.saved) {
    lines.push(
      `Saved sprint ${result.sprint?.name ?? ''} to ${result.profile.name}.`,
    )
  }

  return lines.join('\n')
}

function help(ctx, mode) {
  const name = mode === 'comments' ? 'comments' : 'report'
  const what =
    mode === 'comments'
      ? 'tickets and comments'
      : 'the capacity sheet (remaining hours rolled up per resource)'

  ctx.out.info(`Usage: jira-capacity ${name} --profile <name> [options]

Exports ${what} and writes the HTML table to the clipboard.

Options:
  --profile <name>     Local profile name or id (required)
  --sprint <name|id>   Replace the profile's sprint for this run
  --clear-sprint       Remove the sprint filter for this run
  --save               Persist the sprint change to the local profile
  --dry-run            Show the resolved JQL and issue count; no clipboard
  --copy               Copy to the clipboard (default)
  --out <file>         Write an .xls (HTML) file instead of copying

Requires a JIRA_PAT (or \`jira-capacity auth set --jira <token>\`).`)
}
