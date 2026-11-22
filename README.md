# Jira Capacity

Chrome extension (Manifest V3) that exports two spreadsheets from Jira as
formatted HTML on the clipboard, which Excel pastes as a real table:

- **Generate Capacity Report** — one row per issue, plus a column per person
  holding the remaining estimate of that person's subtasks.
- **Export Tickets and Comments** — one row per issue, its subtasks nested
  beneath it, with the full comment thread in the last column.

Built with React (plain JavaScript), Mantine, and Vite through
`@crxjs/vite-plugin`.

## The one hard constraint

**The popup only works when it is opened on a logged-in Jira tab.**

Every Jira request is executed by a content script running on that tab, so the
corporate SSO session in the browser is the only credential involved. There is
no manual-URL field, no cross-origin fallback, and no background worker holding
cookies. If the active tab is not `https://jira.corp.nortonlifelock.com/*`, the
popup refuses to export and explains why.

## Develop

```bash
npm install     # .npmrc sets legacy-peer-deps=true, see below
npm run dev     # Vite dev server (popup renders in a normal tab)
npm test        # node:test suite for the pure report engine
npm run build   # production build into dist/
```

Load `dist/` via **chrome://extensions → Developer mode → Load unpacked**, then
open the popup while a Jira tab is focused.

`.npmrc` disables peer resolution because `@vitejs/plugin-react` declares
optional Babel and React Compiler peers that npm 11 resolves to conflicting
majors. Neither transform is used here.

## Icons

The toolbar icon is Tabler's `table-bolt` in white on a violet `#5F3DC4` tile,
drawn on a 24-unit grid with `rx=5` and transparent corners:
`public/icons/icon.svg`. `npm run icons` rasterises it into the 16/32/48/128
PNGs referenced by `manifest.json`. The script drives headless Chrome and
`sips`, so it only runs on macOS.

The 16 px raster is an optical variant — same paths, but the glyph is enlarged
and its stroke thickened. Scaled straight down, the 2 px stroke collapses and
the table grid merges into a blob in the toolbar.

## Layout

```
src/lib/jira/          pure engine — no Chrome APIs, no network, tested
  config.js            host, endpoints, storage keys
  fields.js            field catalog + `kind`, default/comment column sets
  jql.js               one JQL builder for both exports
  filters.js           ordered { id, name } selection helpers
  profiles.js          profile parsing, legacy migration, resource keys
  remote.js            Jira attachment sharing, ticket keys, change detection
  order.js             move/remove for ordered lists
  export/
    parse-issueview.js  issue-view HTML table → rows + per-assignee seconds
    parse-issues.js     REST search payload → parent rows with children
    cells.js            one renderer per field kind, HTML escaping
    rows.js             resource hour rollup, row counting
    table.js            the HTML table copied to the clipboard
    fixtures/           trimmed real issue-view page + a search payload

src/runtime/           Chrome-facing glue
  protocol.js          message types shared by popup and runner
  http.js              same-origin fetch with signed-out detection
  runner/index.js      content-script entry (message server)
  runner/handlers.js   issue-view, search, and picker requests
  chrome/tab.js        active-tab gate
  chrome/messaging.js  request/response, timeout, inject-on-retry
  storage.js           chrome.storage.local + localStorage fallback
  clipboard.js         text/html clipboard write
  download.js          profile JSON export

src/state/             useProfiles, per-profile working config, remote status
src/components/        popup pieces
src/App.jsx            popup shell
```

The runner is a content script, so `@crxjs/vite-plugin` bundles it (with a
loader chunk) and adds it to `web_accessible_resources`. When the popup finds
no listener — typically a Jira tab that predates the extension install — it
re-injects the manifest's first content-script file once and retries.

The popup is 800 px wide and its height follows the content (Chrome caps it at
600 px, so the page scrolls). The three panels sit in a plain flex row: two fit
at once and the third is reached by horizontal scroll, and the Filters column
ends with the two export actions. A sticky footer holds the app badge/name and
a theme menu with Light, Dark, Sunrise/sunset (light 06:00–18:00), and System;
the default is System. The choice is global — not per profile — and persists in
`jiraCapacity.theme` through `chrome.storage.local`.

Every picker is a live search: nothing is preloaded, and results are found by
key, id, or name. In the Fields and Resources columns, picking a result appends
it to the ordered list below and clears the field for the next pick, so a
selection is rendered once (no chips above a duplicate list). Filters keep
their chip multi-selects because they have no ordered list.

Fields is a single ordered list: every row is fetched from Jira, and the eye
toggles whether that row becomes a column in the capacity report. Hidden rows
stay fetched, which keeps `assignee` and `timeestimate` available for the
subtask roll-up. A new pick lands at the bottom and is visible by default.
Drag a row by its left grip to reorder it; the grip also moves the row with
↑/↓ when focused. People is reordered the same way.

## Profiles

A profile is one JSON document attached to a Jira ticket. **Open from Jira** asks
for one or more ticket keys, lists their attachments, and imports every selected
JSON file as its own profile. The same ticket can hold several profile files.

A ticket with no profile can get one from the same dialog: type a name and press
**Create**. The extension uploads a starter document with no fields and no
filters, then opens it. This is the only way to start with no existing file;
read-only users who can import can still run reports, they just cannot create or
sync.

```json
{
  "schemaVersion": 1,
  "id": "9f1c2a7e-1b2c-4d5e-8f90-123456789abc",
  "name": "WebExp",
  "origin": "https://jira.corp.nortonlifelock.com",
  "createdAt": "2026-11-21T14:30:05.123Z",
  "createdBy": "Michael Kaplan",
  "updatedAt": "2026-11-21T15:02:11.940Z",
  "updatedBy": "Michael Kaplan",
  "selection": {
    "filters": {
      "projects": [], "resolutions": [], "sprints": [],
      "types": [], "statuses": []
    },
    "fetchFields": [{ "id": "summary", "name": "Summary" }],
    "reportFields": [{ "id": "summary", "name": "Summary" }],
    "resources": [{ "id": "resource:mkaplan", "name": "Michael Kaplan" }],
    "orderBy": [{ "id": "priority", "direction": "DESC" }]
  }
}
```

- `schemaVersion` stays 1 until a breaking change; the metadata fields above are
  additive.
- `id` is the logical profile identity. It survives renames, re-syncs, and
  copies to another ticket. A new attachment is named `<sanitized name>_<id>.json`,
  so two people creating "WebExp" on the same ticket cannot collide and the
  ticket list still reads sensibly. Later syncs replace that same file.
- `createdAt`/`createdBy` are stamped once. `updatedAt`/`updatedBy` are stamped
  on each upload; `createdBy` is also backfilled from the Jira attachment author
  when importing an older file that lacks it.
- **No option catalog is stored.** Every filter, field, and people picker
  searches Jira live, and each selected item carries its own `{ id, name }`, so
  labels survive without persisting hundreds of options. Older profiles may
  contain an `available` block; it is read once to resolve bare-id labels during
  import, then never written again.
- Edits live in `chrome.storage.local` under one key per profile entry, so the
  imported document is never mutated. Export and sync both write the current
  working copy, not the document that was originally imported.
- Each entry also stores its `source` (`issueKey`, `attachmentId`, `filename`,
  `remoteCreatedAt`). Entries without a Jira source are removed on load,
  including profiles imported from local JSON files by earlier builds. A profile
  that was just created on a ticket is linked immediately.
- **Sync to Jira… is always manual.** It checks the ticket first, warns when the
  attachment changed or disappeared, uploads the current profile, and only then
  deletes the previously linked attachment. Other files on the ticket are never
  touched. Editing a profile, exporting it, or switching profiles never writes
  to Jira; the only other write is the explicit **Create** action.
- A badge next to the profile picker reports whether the ticket attachment is
  up to date, changed, removed, or could not be checked. It refreshes when the
  popup opens or the profile changes, and clicking it checks again.
- Import accepts the JSON produced by the previous CRA build
  (`{ jira: { ..., lookupList: { ... } } }`) and migrates it: `lookupList.fields`
  becomes `fetchFields`, `jira.columns` becomes `reportFields`, `jira.users`
  becomes resources, and `jira.status` becomes `statuses`. This applies to files
  attached to a ticket as well.
- Resources are stored as `resource:<login>` so a person can never collide with
  a field id in the same row. Resource columns are matched to subtasks by
  **display name**, which is exactly what the issue-view assignee cell contains.
- Every filter picker is searched live, one request per search, not preloaded:
  projects, issue types, statuses, resolutions, field columns, people, and
  sprints. The popup sends the typed query to the runner on the Jira tab.
  Projects query `/rest/api/2/projects/picker` (server-side, `maxResults=50`,
  hard-capped by Jira at 100). Issue types, statuses, and resolutions query JQL
  autocomplete (`/rest/api/2/jql/autocompletedata/suggestions`, ~0.1–0.3 KB and
  ~80 ms per search). Columns (`/rest/gadget/1.0/availableColumns`) and people
  query the group/user picker; sprints the sprint picker. This keeps instances
  with hundreds or thousands of entries out of the popup and out of the saved
  profile.
- JQL autocomplete matches by **prefix** and Jira caps it at 15 values, so
  "in prog" finds "In Progress" but "prog" finds nothing; the catalog endpoints
  would have allowed substring matching but ignore `?query=` and return 240–380
  entries (~70–140 KB). Values arrive as JQL literals, quoted when they contain
  spaces, and are unquoted before use. Issue type, status, and resolution ids
  are stored as their **names** because that is what the JQL builder quotes and
  what imported profiles already contain.
- The catalogs are not small on a mature instance (measured: 242 issue types,
  380 statuses, 89 resolutions, 1,635 columns), which is why the profile-local
  copies went stale. Nothing is cached per tab anymore except the column list,
  which is warmed on idle because it cannot be searched server-side.
- The project picker returns real `key`, `id`, and `name` fields, so the key is
  stored as the project id — that is what the JQL builder quotes. The unfiltered
  list endpoint (`/rest/api/2/project`) ignores `query` and returns every
  project in a 340 KB array, so it is only useful for a full sync, never for
  typeahead. Searching by key works because the remote picker filters options
  on the value as well as the label; an issue key or browse URL
  (`WEBAVAST-26648`) is reduced to its project key before the request.
- `availableColumns` accepts no query parameter (checked against a live
  instance: `?query=`, `?search=`, `?q=` and five other spellings all return
  the full list), so the runner fetches the catalog once per Jira tab while the
  tab is idle, caches it, and ranks matches locally — exact, then prefix, then
  word-start, then substring — before returning the best 50.
- A legacy `available` block is read once during import to resolve bare ids into
  labels; it is never persisted. Selected items carry their own labels.

## Field kinds

`fields.js` describes every column once. `kind` drives both parsers and the
renderer, replacing the three duplicated column maps in the old build:

| kind       | Renderer                                        |
| ---------- | ----------------------------------------------- |
| `key`      | `<a data-issue-key href="{origin}/browse/…">`    |
| `user`     | `displayName`, else `name`                      |
| `seconds`  | seconds → hours, rounded to two decimals        |
| `flag`     | first enabled flagged value                     |
| `comments` | every comment, with Excel same-cell line breaks |
| `text`     | escaped text                                    |

To add a field: add one entry to `ISSUE_FIELDS` with its Jira id, label, and
kind, then include the id in `DEFAULT_*` / `COMMENT_EXPORT_FIELD_IDS` if it
should be on by default. Ids the catalog does not know still work — they render
as escaped text — which is what lets profile-provided custom fields through.

## Exports

Both exports share `buildJql`, `applyResourceHours`, and `buildTableHtml`.

**Capacity report**

1. `GET /rest/api/2/user/columns` saves the user's current column layout.
2. `PUT` the profile's `fetchFields` as the layout.
3. `GET /sr/jira.views…/SearchRequest.html?jqlQuery=…`.
4. `PUT` the original layout back — in a `finally`, so a failed report still
   restores the user's Jira UI.
5. Parse the `#issuetable` rows; subtask remaining estimates are summed per
   assignee (in seconds).
6. Convert to hours, drop zeros, append one column per resource, copy HTML.

**Tickets and comments**

1. `GET /rest/api/2/search` with `maxResults=1` to read `total`.
2. Page through the search 100 issues at a time with
   `fields=<comment set>,subtasks`.
3. Nest each subtask under its parent; subtask rows repeat the parent key and
   carry their own key in the Sub Task column.
4. Render the fixed `COMMENT_EXPORT_FIELDS` set and copy HTML.

Both flows require at least one filter; an empty filter set is rejected rather
than exporting the whole instance.

## Tests

`npm test` runs `node --test "src/lib/**/*.test.js"`. DOM parsing is tested
with `linkedom` against a real trimmed issue-view page in
`src/lib/jira/export/fixtures/`. The parsers deliberately use
`querySelector`/`children`/`getAttribute` rather than `tBodies`/`rows`/`cells`,
because linkedom does not implement those table extensions.
