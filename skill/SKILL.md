---
name: jira-capacity
description: Generate a Jira capacity report or a tickets-and-comments export for a sprint, without the Chrome extension. Use when the user asks for "jira capacity", "sprint capacity", "capacity report", "remaining hours per person", "who has capacity", or an Excel-ready Jira ticket/comment export.
---

# Jira capacity (CLI + PAT)

This skill drives `jira-capacity`, a single-file CLI that reuses the Chrome
extension's report engine. It runs on the developer's machine, searches Jira
with their PAT, and puts an HTML table on the clipboard so Excel rebuilds real
cells on paste.

## Before you start

1. **The CLI must be installed.** Check with `jira-capacity version`. If that
   fails, look for `~/.local/bin/jira-capacity` (macOS/Linux) or
   `%LOCALAPPDATA%\Programs\jira-capacity\jira-capacity.cmd` (Windows). If it
   is missing, offer `install.sh` / `install.ps1` from the skill artefacts.
   Do not install software without asking.
2. **Jira access must be configured.** Run `jira-capacity auth status --json`.
   - `tokens.jira.configured: false` → stop. Ask the user to run
     `jira-capacity setup` in their terminal: it asks for the Jira URL
     (pre-filled) and a PAT, proves them by fetching their own Jira user, and
     writes nothing until they confirm. Never ask for a token in chat, and
     never echo one.
   - `tokens.jira.error` set → the token expired or the URL points somewhere
     else. Report the error verbatim and ask them to re-run `setup`.
   - A `no-token` error means the command ran without a terminal prompt (which
     is what happens when you run it). Relay the `setup` instruction and wait;
     do not fall back to `auth set` unless they ask for the scripted path.
3. **Every command accepts `--json`.** Use it for anything you need to reason
   about; stdout is then one JSON document and progress goes to stderr.

## Conversation flow

The goal is **one consolidated confirmation**, not a question per command.

### 1. Pick the profile

```bash
jira-capacity profiles list --json
```

Match the request to a profile by project key or name. Profiles live in
`~/.config/jira-capacity/profiles` (`%APPDATA%\jira-capacity\profiles` on
Windows) and are byte-compatible with the extension.

- One clear match → use it.
- Several plausible profiles → ask which one, showing project + sprint +
  people.
- None → ask the user to name the ticket or Confluence page that publishes it,
  then `jira-capacity profiles pull --from jira:<KEY>` (or
  `confluence:<PAGE>`). Publishing is how teammates share profiles.

### 2. Resolve the sprint

```bash
jira-capacity sprints --project <KEY> --state future --json
```

- "Upcoming sprint" means the future sprint with the earliest `startDate`.
- With `--project`, this reads the project's scrum board, so a sprint that has
  no issues yet is still listed. `source: "jql"` in the JSON means the board API
  was unavailable and empty sprints are invisible — say so if the list is empty.
- If it returns nothing, try `--state active`. If several sprints start on the
  same date, ask.
- Confirm the **name and dates** with the user. Sprint names are not unique
  across boards, so pass the name the user recognises; the CLI resolves it to
  the numeric id that JQL needs.
- If the user names a sprint that is not listed (an empty one), pass it to
  `--sprint` anyway and let the CLI resolve it.

### 3. Check the profile against Jira

```bash
jira-capacity profiles diff <profile> --json
```

`ok: true` means every selected field still exists and every person is still
assignable. Otherwise:

- Missing fields → propose removing them (or the current replacement, when the
  diff shows a rename).
- Missing people → propose removing them or replacing with a suggested match.
- Apply accepted changes with `profiles set` (this edits the local profile
  only; it does not publish):

```bash
jira-capacity profiles set <profile> \
  --add-field "Story Points" --remove-field customfield_99999 \
  --add-person "Jane Doe" --remove-person "Old Name"
```

Never add or remove fields/people the user did not agree to.

### 4. Preview, then confirm

```bash
jira-capacity report --profile <profile> --sprint "<Sprint name>" --dry-run --json
```

Present a compact summary: sprint + dates, `matches` (JQL total), `issues`
(parent rows; subtasks roll up), the report columns, and the resource list.
Ask: **"Run this and copy it to the clipboard?"**

### 5. Run it

```bash
jira-capacity report --profile <profile> --sprint "<Sprint name>" --json
```

Then tell the user:

> Copied 428 rows for 24 issues — paste into Excel.

Include the per-person totals from `people` when they are useful. Do **not**
print issue rows or the table body; the clipboard is the deliverable.

If the user explicitly said the sprint change should stick, include `--save`
on this run. `--save` writes the resolved sprint (and any field/people edits)
back to the local profile and marks it **local changes**; it does not publish.
Otherwise the sprint is per-run only, so "upcoming sprint" never silently reuses
last sprint's value.

### 6. Tickets and comments

Same flow, different command:

```bash
jira-capacity comments --profile <profile> --sprint "<Sprint name>" --dry-run --json
jira-capacity comments --profile <profile> --sprint "<Sprint name>" --json
```

Use this when the user asks for tickets, comments, or a status export rather
than hours.

## If the clipboard is not the right target

The clipboard belongs to the machine running the CLI. If the agent is working
over SSH or in a container, the user will not see it. In that case, or when the
user asks for a file:

```bash
jira-capacity report --profile <profile> --sprint "<Sprint name>" --out ~/Downloads/capacity.xls
```

`--out` writes an `.xls` (HTML) file Excel opens directly. Confirm the absolute
path in the reply. Do not create report files inside the repository unless the
user asks for that.

## Publishing profiles

Publishing is always an explicit, single-target action:

```bash
jira-capacity profiles push <profile> --to jira:<KEY>
jira-capacity profiles push <profile> --to confluence:<PAGE_ID>
```

- Jira: uploads the profile file and removes the previous same-name attachment
  (Jira has no attachment versions).
- Confluence: adds a new version of the same attachment.
- Ask which target when the user says "publish" without one. Never push as a
  side effect of generating a report.

**Visibility caveat:** the Chrome extension only reads profiles attached to
Jira tickets. A profile published only to Confluence is usable by this CLI but
invisible to the extension. Say so if the user is choosing a target for a team.

## Hard rules

- Never print, echo, or log a PAT. `auth status` reports only the source.
- Never print JQL result rows or the HTML table; report counts and totals.
- Never invent sprint ids, field ids, or people. Resolve them with `sprints`,
  `fields search`, or `people search`.
- Never run `profiles push` without an explicit request and an explicit
  `--to` target.
- Do not use `--save` unless the user asked for the change to persist.
- A profile with no filters is refused by design; add `--sprint` or edit the
  profile instead of exporting the whole instance.
- If `--copy` fails (headless session, missing clipboard tool), retry once with
  `--out` and tell the user where the file is.

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `Jira rejected the PAT (401)` | Token expired, or the URL is another instance. Ask the user to re-run `jira-capacity setup`. |
| `Jira refused the request (403)` | The PAT's user lacks permission for the project/page. |
| `Jira returned the login page` | The base URL is not the REST host, or the token is invalid. Re-run `setup`; a browse URL is reduced to its origin automatically. |
| `No profile matches "…"` | Run `profiles list`; pull the profile from its Jira ticket or Confluence page. |
| `No sprint is named "…"` | Run `sprints --project KEY --state future` and use the exact name or the id. An empty sprint is invisible to the JQL fallback; use `--board <id>` or pass its id. |
| `Could not write … to the clipboard` | Headless/remote session or no `xclip`/`wl-copy`. Use `--out`. |
| `profile has no filters` | The stored profile lost its filters; add `--project`/`--sprint` via `profiles set`. |
| Row count lower than issue count | Capacity rows are parents; subtask estimates roll into their assignee's column. |

## Command reference

| Command | Purpose |
| --- | --- |
| `setup` | First-time Jira URL + PAT, verified against `/rest/api/2/myself` |
| `profiles list` | Local profiles, filters, sync status |
| `profiles show <name>` | Full filters, fields, people, publications |
| `profiles diff <name>` | Missing/renamed fields and people vs live Jira |
| `profiles pull [name] --from jira:KEY\|confluence:PAGE` | Import shared profile JSON |
| `profiles push <name> --to jira:KEY\|confluence:PAGE` | Publish one target |
| `profiles set <name> …` | Local edits (sprint, fields, people, filters) |
| `sprints [--project KEY] [--board ID] [--state future\|active\|all]` | Sprint ids, names, dates |
| `fields search <text>` | Field ids by id or name |
| `people search <text>` | Assignable users |
| `projects search <text>` | Project keys |
| `report --profile <name> [--sprint S] [--save] [--dry-run] [--copy\|--out F]` | Capacity sheet |
| `comments --profile <name> [--sprint S] [--save] [--dry-run] [--copy\|--out F]` | Tickets + comments |
| `auth status\|set\|clear` | PAT source, storage, live check |
