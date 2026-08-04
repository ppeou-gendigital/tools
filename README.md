# Loopy

A Chrome extension **and** web app in one codebase. React (ES6, no TypeScript) + Vite + SCSS modules, with Supabase email-OTP auth and light/dark theming.

- **Manifest**: V3
- **UI**: React 19, hand-rolled components in SCSS Modules (shadcn/ui used only as visual reference), Lucide icons
- **Auth + storage**: [Supabase](https://supabase.com/) (Auth + Postgres) — free tier
- **Build**: Vite + `@crxjs/vite-plugin`
- **Web host**: [Firebase Hosting](https://project-loopy.web.app) (`project-loopy`)

---

## Quick start

1. **Create a Supabase project** (free) and set up the schema — see [Supabase setup](#supabase-setup) below.
2. Copy env vars:
   ```bash
   cp .env.example .env
   # then paste your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   ```
3. Install:
   ```bash
   npm install
   ```
4. Run one (or both):
   - **Web (dev server, hot reload)**: `npm run dev` → open the printed URL.
   - **Extension (watch build)**: `npm run dev:ext` → then load `dist/` unpacked in Chrome (see below).

---

## Load the extension in Chrome (development)

1. `npm run dev:ext` (leave running — it rebuilds on change).
2. Open `chrome://extensions/`.
3. Turn on **Developer mode** (toggle, top right).
4. Click **Load unpacked** and pick the `dist/` folder inside this repo.
5. "Loopy" appears in your toolbar. Pin it for convenience.

After code changes:

- **Popup / React code** — CRXJS hot-reloads the popup; if it stalls, close and reopen it.
- **`manifest.json` / `background.js`** — click the reload icon on the Loopy card in `chrome://extensions/`.

Inspect:

- **Popup**: right-click the Loopy toolbar icon → **Inspect popup**.
- **Service worker**: `chrome://extensions/` → Loopy → **Inspect views: service worker**.

---

## Scripts

| Command             | What it does                                                       |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | Vite dev server for the web build (`index.html`)                   |
| `npm run dev:ext`   | Extension build in watch mode → `dist/`                            |
| `npm run build`     | Production extension build → `dist/`                               |
| `npm run build:web` | Production web build → `dist-web/loopy`                            |
| `npm run deploy:web`| Production web build + deploy to Firebase Hosting                  |
| `npm run lint`      | ESLint over `src/**/*.{js,jsx}`                                    |

---

## Project layout

```
loopy/
├── manifest.json               # MV3 manifest (host permission for supabase.co)
├── background.js               # MV3 service worker (event-driven)
├── index.html                  # web entry
├── popup.html                  # extension popup entry (400x600 body)
├── vite.config.js              # single Vite config, mode = web | extension
├── src/
│   ├── main.jsx                # bootstraps React into #root
│   ├── App.jsx                 # providers + tiny in-memory router
│   ├── env.js                  # isExtension(), env accessors
│   ├── lib/
│   │   ├── supabase.js         # createClient + storage adapter + PKCE
│   │   ├── storage.js          # chrome.storage.local <-> localStorage
│   │   └── cx.js               # className concatenator
│   ├── providers/
│   │   ├── AuthProvider.jsx    # session, requestOtp, verifyOtp, signOut
│   │   └── ThemeProvider.jsx   # light | dark | system, persisted
│   ├── components/
│   │   ├── ui/                 # Button, Input, Label, Card + .module.scss
│   │   ├── AppShell.jsx        # grid header/main/footer
│   │   ├── AuthGate.jsx        # gates children behind a session
│   │   ├── SignInForm.jsx      # email -> 6-digit OTP -> verify
│   │   ├── ThemeToggle.jsx     # Sun/Moon/Monitor (lucide-react)
│   │   └── UserMenu.jsx        # email + sign out
│   ├── pages/
│   │   ├── Home.jsx            # authed landing
│   │   └── Profile.jsx         # reads/writes `profiles` table
│   └── styles/
│       ├── main.scss           # loads reset + tokens + base
│       ├── _tokens.scss        # CSS vars for [data-theme="light"] and "dark"
│       ├── _reset.scss
│       ├── _mixins.scss        # focus-ring, stack, row
│       └── _base.scss
```

---

## Theming

`ThemeProvider` writes `data-theme="light"` or `"dark"` on `<html>`. All tokens (colors, spacing, radii) live in [`src/styles/_tokens.scss`](src/styles/_tokens.scss) as CSS custom properties, so components reference `var(--fg)` etc. and never branch on theme.

The three modes are **Light**, **Dark**, **System** (follows `prefers-color-scheme`). The preference is persisted via the same async storage adapter — `chrome.storage.local` in the extension, `localStorage` on the web.

---

## Viewport control

The two HTML entries set different `data-surface` attributes on `<html>`, and `_base.scss` sizes the root element accordingly. Everything below (`<body>`, `.shell`, `.main`) is just `100%` of its parent — only `<html>` decides the app's outer dimensions.

- `popup.html` → `data-surface="popup"` → `html { width: min(100dvw, 400px); height: min(100dvh, 600px) }` (in the real Chrome popup the viewport already IS 400×600, so the caps collapse to that exact size; in a browser preview they cap it)
- `index.html` → `data-surface="web"` → `html { width: 100dvw; height: 100dvh }` — fills the viewport, no caps

Pages own their own reading inset via `.is-fluid-width` / `.is-static-width` wrappers or a `padding` on the page's root element. `.main` never sets `max-width` or `margin: 0 auto`.

---

## Supabase setup

Create a project at https://supabase.com (free tier — 50k MAU / 500MB Postgres).

### 1. Configure email OTP (6-digit code, not magic-link)

Loopy uses `signInWithOtp` + `verifyOtp` with `type: 'email'`. The default Supabase email template uses a `ConfirmationURL` — replace it with the OTP token.

- **Dashboard** → **Authentication** → **Email Templates** → **Magic Link**
- Replace the body with something like:
  ```
  Your Loopy login code is: {{ .Token }}
  It expires in 60 minutes.
  ```
- Save.

### 2. Grab your API keys

- **Dashboard** → **Project Settings** → **API**
- Copy `Project URL` → `VITE_SUPABASE_URL`
- Copy `anon public` key → `VITE_SUPABASE_ANON_KEY`

Both belong in `.env`. They're safe to ship in the client bundle; row-level security (below) is what protects your data.

### 3. Create the `profiles` table + RLS

In **SQL Editor**, run:

```sql
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  display_name text,
  updated_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "read own"   on public.profiles for select using (auth.uid() = id);
create policy "insert own" on public.profiles for insert with check (auth.uid() = id);
create policy "update own" on public.profiles for update using (auth.uid() = id);

-- Create a profile row automatically when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

That's it — sign up, check inbox for the code, paste it into the popup.

### 4. User preferences table (`loopy_user_prefs`)

Backs the auto-sync layer in [PrefsSync.jsx](src/providers/PrefsSync.jsx).
Loopy has its **own** table — `public.loopy_user_prefs` (`PREFS_TABLE` in
[`prefs.js`](src/lib/prefs.js)). One row per user (`id = auth.uid()`):

- `data` — owned shell prefs (`theme`, `fontSize`, `fabCorner`, `updatedAt`).
- `payload` — Loopy lists as one jsonb object with **snake_case** keys:
  - `aem_domains` — AEM Jump domain list
  - `tracked_hostnames` — visit-capture rule set (object keyed by pattern)
  - `pinned_sites` — Site Tree pin list
  - `favorites_order` — Fav Links domain display order

In-memory providers/ops still see camelCase fields
(`aemDomains`, `trackedHostnames`, …); [`supabaseSync.js`](src/lib/supabaseSync.js)
maps those ↔ `payload` on read/write.

Run [`supabase/loopy_user_prefs.sql`](supabase/loopy_user_prefs.sql) in
**SQL Editor** (safe to re-run).

**Legacy `user_data`:** older builds stored shell prefs in `user_data.data`
and Loopy lists as top-level columns (`aem_domains`, `tracked_hostnames`,
`pinned_sites`, `favorites_order`). Sync dual-reads that row when
`loopy_user_prefs` is missing, and best-effort dual-writes owned `data`
keys (preserving foreign keys via `extractForeignPrefs`) **plus** the
columnar list fields back to `user_data`. Keep `user_data` until every
tool on the project has cut over; do not drop it yet.

Favorites (`user_favorites`) and visits (`user_visits`) are separate
streams — this prefs migration does not change them.

### 4b. AEM Author sites catalogs (`loopy_aem_author_sites`)

Backs the **AEM EDS-UE** page: per Author host, the discovered `/content`
sites list, pin state, and pinned sites’ page catalogs (Query Builder).
**Not** visit history — catalogs sync separately from `user_visits`.

One row per `(user_id, author_host)` with `sites` jsonb,
`sites_fetched_at`, and CAS on `updated_at`.

Run [`supabase/loopy_aem_author_sites.sql`](supabase/loopy_aem_author_sites.sql)
in **SQL Editor** (safe to re-run). Local cache key: `loopy.aemAuthorSites`.
API: [`src/lib/aemAuthorSitesApi.js`](src/lib/aemAuthorSitesApi.js); pull on
sign-in via PrefsSync.

**Sync contract** — all Supabase I/O goes through [`src/lib/supabaseSync.js`](src/lib/supabaseSync.js):

- `applySyncOp({ stream, userId, key?, op })` — pure-operator CAS write
- `pullSync({ stream, userId, local? })` — force-network pull (merge for maps)

**Prefs (`stream: 'prefs'`)** use the same Fav Links recipe as favorites:

- Each provider (theme, font, FAB corner, AEM domains, tracked hosts, pinned
  sites, favorites order) owns its mutations: optimistic local write, then
  `applySyncOp` with a field-scoped operator from [`userDataOps.js`](src/lib/userDataOps.js)
  (`opTogglePinned`, `opSetTheme`, …). On CAS miss the op re-applies against
  the latest remote row so concurrent edits to *different* fields both survive.
  First insert seeds CAS from legacy `user_data` when the per-app row is missing.
- [`PrefsSync`](src/providers/PrefsSync.jsx) is **pull-only** on sign-in. Fields
  the user changed while the fetch was in flight are skipped (dirty-field
  guard) so a mid-pull pin is not wiped.

### 5. Visited URLs table (`user_visits`)

Backs the [Visited URLs page](src/pages/VisitedUrls.jsx). One row per
`(user_id, domain)` pair, `paths` is a **jsonb object keyed by path**
(the path string is the key; the value carries the per-visit metadata).
Splitting by domain keeps each upsert small — a single new visit
uploads only the one domain's row, not the whole history — and lets a
"clear this domain" action drop a single row. Storing paths in an
object (rather than an array) eliminates duplicates at the
data-structure level and makes cross-device merges an O(1) key lookup
instead of a scan.

In **SQL Editor**, run:

```sql
create table public.user_visits (
  user_id     uuid        not null references auth.users(id) on delete cascade,
  domain      text        not null,
  paths       jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (user_id, domain)
);

alter table public.user_visits enable row level security;

create policy "user_visits self-read"
  on public.user_visits for select using (auth.uid() = user_id);
create policy "user_visits self-insert"
  on public.user_visits for insert with check (auth.uid() = user_id);
create policy "user_visits self-update"
  on public.user_visits for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_visits self-delete"
  on public.user_visits for delete using (auth.uid() = user_id);

create index if not exists user_visits_user_domain_idx
  on public.user_visits (user_id, domain);

-- Cap per-row footprint. Client also enforces this before upsert.
-- Matches MAX_PATHS_PER_DOMAIN in src/lib/visitedUrls.js.
--
-- Implemented as a trigger, not a CHECK constraint: jsonb_object_keys
-- is set-returning and can't be used inline in a CHECK expression.
create or replace function public.enforce_user_visits_paths_cap()
returns trigger language plpgsql as $$
begin
  if jsonb_typeof(new.paths) <> 'object' then
    raise exception 'user_visits.paths must be a jsonb object (got %)',
      jsonb_typeof(new.paths);
  end if;
  if (select count(*) from jsonb_object_keys(new.paths)) > 200 then
    raise exception 'user_visits.paths exceeds 200 keys';
  end if;
  return new;
end;
$$;

drop trigger if exists user_visits_paths_cap_trg on public.user_visits;
create trigger user_visits_paths_cap_trg
  before insert or update on public.user_visits
  for each row execute function public.enforce_user_visits_paths_cap();
```

**Migration from the legacy array shape** — if the table was created
with the earlier `paths jsonb default '[]'` layout and the
`user_visits_paths_cap` CHECK constraint, the cleanest cutover is to
drop existing rows (the extension repopulates from live captures) and
swap the constraint for the trigger above:

```sql
truncate public.user_visits;

alter table public.user_visits
  drop constraint if exists user_visits_paths_cap;

alter table public.user_visits
  alter column paths set default '{}'::jsonb;

-- Then re-run the create-or-replace function + create-trigger block
-- from the setup SQL above.
```

The extension performs a matching one-shot local wipe on the next SW
boot (keyed by `loopy.visitsSchemaVersion === 2` in
`chrome.storage.local`), so no client-side migration code is needed —
old array-shaped payloads are simply discarded and the new object
shape is rebuilt from fresh captures.

**`domain`** stores the hostname (lowercased, e.g. `qa-webauthor.np.nortonlifelock.com`) so it matches what `new URL(url).hostname` returns and what we test against the [tracked hostnames](#tracked-hostnames) rule set.

**`paths`** shape — an object keyed by the path string (see [`src/lib/visitedUrls.js`](src/lib/visitedUrls.js)):

```jsonc
{
  "/editor.html/content/norton/…?search": {
    "title": "Editor - Norton Home",
    "matchedDomainId": "d_abc123",
    "firstVisitedAt": "2026-07-03T20:00:00Z",
    "lastVisitedAt":  "2026-07-03T20:15:00Z",
    "visitCount": 3
  },
  "/another/page": { … }
}
```

**Capture flow** (extension only; the web build has no `chrome.tabs`):

1. `background.js` subscribes to `chrome.webNavigation.onCompleted` and `chrome.webNavigation.onHistoryStateUpdated` (with `chrome.tabs.onUpdated` as a safety-net) so it sees the real URL — including SPA `pushState` navigations that never touch `chrome.tabs.url`.
2. It reads the [tracked-hostnames](#tracked-hostnames) rule list from `chrome.storage.local` (cached in worker memory as a compiled `{ includes, excludes }` regex set; invalidated via `chrome.storage.onChanged` when the list changes) and calls `matchTabToTrackedHost(url, rules)`.
3. On a matching hostname (at least one include hit and no exclude hit), it merges the visit into the domain's bucket in `loopy.visitedByDomain` — dedup is an O(1) `paths[path]` lookup, bumps `visitCount` + `lastVisitedAt`, evicts the oldest when the bucket exceeds 200 keys.
4. `VisitedUrlsProvider` mirrors the same key via `chrome.storage.onChanged`, so an open popup reflects background writes live.
5. Sync to Supabase is owned by the service worker (`chrome.alarms`-driven: a ~1s debounced push after each capture, plus a 5-minute periodic heartbeat) via [`syncVisits`](src/lib/visitsSync.js) → [`applySyncOp`](src/lib/supabaseSync.js) (`stream: 'visits'`). Capture merges are append/union (`opUnionVisitPaths`). User-initiated clears/removes on the Visited URLs page call the same CAS path (`opClearDomainPaths` / `opRemovePath`) so remote rows are deleted and the next sync cannot resurrect them.

Fragments (`#…`) are stripped before storage — they're UI state (editor panel, scroll target) and would spam the list with near-duplicates.

The AEM domain list is **not** consulted for capture. It stays exclusively behind the AEM Jump feature; users who want a bare hostname captured (without also configuring a full AEM Jump entry) add it as a tracked-host rule instead. The Visited URLs page still uses the AEM list opportunistically to give recognized hostnames a nicer label in the section header, but a match there isn't required for capture.

## Tracked hostnames

Capture is governed by an explicit rule set stored in `chrome.storage.local` under `loopy.trackedHostnames` and mirrored to `loopy_user_prefs.payload.tracked_hostnames` (dual-written to legacy `user_data.tracked_hostnames` during migration). The rule set is a **JSONB object keyed by the (canonicalized) pattern**; each value carries the rule's `id` and `mode`:

```jsonc
{
  "*.norton.*":    { "id": "h_abc", "mode": "include" },
  "ping.norton.*": { "id": "h_def", "mode": "exclude" }
}
```

Storing rules keyed by pattern is the same trick as the [`user_visits.paths`](src/lib/visitedUrls.js) refactor: duplicates are impossible by construction, cross-device merges collapse to `{ ...remote, ...local }`, and same-pattern-both-modes (which would always skip and is nonsensical) is blocked at the storage layer. The `id` field survives inside each value because `user_visits.paths[*].matchedDomainId` references it — editing a pattern in the UI keeps the same `id` so previously-captured visits stay linked to the (renamed) rule.

`mode` is `include` or `exclude`. A hostname is captured when it matches **at least one include** rule and **no exclude** rule. An empty include set disables capture entirely.

**Wildcard syntax**: patterns are simple globs with `*` matching one or more non-`.` characters — i.e. exactly one DNS label. Patterns are case-insensitive and anchored to the full hostname.

| Pattern            | `lifelock.norton.com` | `norton.com` | `ping.norton.com` | `deep.foo.norton.com` |
| ------------------ | :-------------------: | :----------: | :---------------: | :-------------------: |
| `*.norton.*`       | match                 | —            | match             | —                     |
| `norton.*`         | —                     | match        | —                 | —                     |
| `*.*.norton.*`     | —                     | —            | —                 | match                 |

**Managing rules**: open the popup, go to **Settings → Tracked hosts**. The page has an inline **Test a hostname** box (paste a hostname or full URL to see whether the current rules would capture it), and an **Import from AEM domains** button that seeds one exact-match include rule per unique hostname in your AEM Jump list — the fast onboarding path for users who upgrade from a build where capture was AEM-driven.

The editor keeps a small **draft list** of rows in local state so that partially-typed patterns can exist as blank rows without polluting the persisted object. Only rows whose pattern passes the normalizer (`canonicalizePattern` + `isValidPattern`) get committed to the store on each edit. Blank rows survive until you either finish typing or delete them.

Not supported in v1: `**` (multi-label wildcards) or full regex. The single-`*` glob covers the current use case; extend later if needed.

**Legacy array shape**: the module's normalizer (`normalizeTrackedHostnames`) still accepts the previous `[{ id, pattern, mode }]` array form and upgrades it to the object shape on read. Any local storage or server row that predates the object cutover will be silently normalized on next load.

### 6. Favorites table (`user_favorites`) + prefs `favorites_order`

Backs the [Fav Links page](src/pages/FavLinks.jsx). Split into two stores:

- **`user_favorites`** — the payload. One row per `(user_id, domain)` pair; `paths` is a **jsonb object keyed by path+search**. Modelled after `user_visits` so favorites can reuse the same per-domain CAS-merge sync pattern, but the per-favorite value is lighter — no visit counts, no first/last-visited timestamps, just the title captured at save time and an `addedAt` stamp used for freshness sorting. This stream is unchanged by the prefs-table migration.
- **`loopy_user_prefs.payload.favorites_order`** — the pref. An ordered jsonb array of lowercase hostnames that drives the Fav Links group display order. Behaves like `pinned_sites`: single-blob push, last-writer-wins, part of the regular prefs sync round-trip (dual-written to legacy `user_data.favorites_order`). Domains not listed here fall back to freshest-first at render time so newly saved domains show up without an explicit reorder step.

In **SQL Editor**, run the block below. It's written to be safely re-runnable (`create table if not exists`, `drop policy if exists` before each `create policy`, `add column if not exists`, and idempotent DDL for the index / function / trigger):

```sql
create table if not exists public.user_favorites (
  user_id     uuid        not null references auth.users(id) on delete cascade,
  domain      text        not null,
  paths       jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (user_id, domain)
);

alter table public.user_favorites enable row level security;

drop policy if exists "user_favorites self-read"   on public.user_favorites;
drop policy if exists "user_favorites self-insert" on public.user_favorites;
drop policy if exists "user_favorites self-update" on public.user_favorites;
drop policy if exists "user_favorites self-delete" on public.user_favorites;

create policy "user_favorites self-read"
  on public.user_favorites for select using (auth.uid() = user_id);
create policy "user_favorites self-insert"
  on public.user_favorites for insert with check (auth.uid() = user_id);
create policy "user_favorites self-update"
  on public.user_favorites for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_favorites self-delete"
  on public.user_favorites for delete using (auth.uid() = user_id);

create index if not exists user_favorites_user_domain_idx
  on public.user_favorites (user_id, domain);

-- Cap per-row footprint. Client also enforces this before upsert.
-- Matches MAX_PATHS_PER_DOMAIN in src/lib/favorites.js.
create or replace function public.enforce_user_favorites_paths_cap()
returns trigger language plpgsql as $$
begin
  if jsonb_typeof(new.paths) <> 'object' then
    raise exception 'user_favorites.paths must be a jsonb object (got %)',
      jsonb_typeof(new.paths);
  end if;
  if (select count(*) from jsonb_object_keys(new.paths)) > 200 then
    raise exception 'user_favorites.paths exceeds 200 keys';
  end if;
  return new;
end;
$$;

drop trigger if exists user_favorites_paths_cap_trg on public.user_favorites;
create trigger user_favorites_paths_cap_trg
  before insert or update on public.user_favorites
  for each row execute function public.enforce_user_favorites_paths_cap();

-- Legacy column (still dual-written during migration). Prefer
-- loopy_user_prefs.payload.favorites_order for new installs.
alter table public.user_data
  add column if not exists favorites_order jsonb not null default '[]'::jsonb;
```

**`paths`** shape — an object keyed by the path+search string (see [`src/lib/favorites.js`](src/lib/favorites.js)):

```jsonc
{
  "/products/product-a": {
    "title":   "Product A",
    "addedAt": "2026-07-15T18:20:00Z"
  },
  "/blog/how-it-works?ref=nav": { … }
}
```

**Save flow** — favorites are **online-only + optimistic UI**. The [`FavStar`](src/patterns/FavStar.jsx) button is disabled when signed-out (aria-label switches to "Sign in to save favorites") because we deliberately don't queue mutations locally — the whole write path assumes a live Supabase connection.

1. Every page's toolbar renders a [`FavStar`](src/patterns/FavStar.jsx) via [`PageShortcuts`](src/patterns/PageShortcuts.jsx). Clicking it reads the current tab via [`useCurrentTab`](src/hooks/useCurrentTabUrl.js) (which returns `{ url, title }` from `chrome.tabs.query` with a `chrome.scripting.executeScript` fallback for SPA `pushState` URLs) and toggles the entry. The star also appears on every Site Tree URL row so any tracked page can be saved without opening it first.
2. [`FavoritesProvider`](src/providers/FavoritesProvider.jsx) applies the change **to local state first** for instant feedback (writes into `chrome.storage.local[loopy.favorites]` and mirrors the key via `chrome.storage.onChanged` so an open popup reflects writes from other windows live).
3. In parallel, the provider queues a per-domain **read-modify-CAS** via [`applySyncOp`](src/lib/supabaseSync.js) (`stream: 'favorites'`). The CAS loop:
   1. `SELECT paths, updated_at WHERE (user_id, domain)`.
   2. Runs a pure operator from [`src/lib/favoritesOps.js`](src/lib/favoritesOps.js) (`opAddPath`, `opRemovePath`, `opSetTitle`, `opRenameWithinDomain`) against the fresh remote `paths` — never against a stale local snapshot.
   3. Writes back with `WHERE updated_at = <observed>`; on zero rows affected, re-reads and re-applies. Bounded by `CAS_MAX_ATTEMPTS`.
   4. When the operator empties the bucket, the row is `DELETE`d instead of `UPDATE`d.
4. On CAS success the local bucket is reconciled with the authoritative `{ paths, updated_at }` returned by the CAS. On failure the local bucket is reverted to its pre-op snapshot so the UI doesn't lie about durability.
5. Rapid-fire clicks on the same domain are serialized by `enqueueSyncOp` so a burst never fights its own CAS retries. Ops on different domains still run in parallel.
6. **Cross-domain edits** (rename that changes hostname) run as *add-on-new-host* then *remove-from-old-host*, so a mid-op interruption favors the destination and never orphans the entry.
7. **Clear all** issues one `DELETE ... WHERE user_id = $1` via `deleteSyncAll`.
8. Domain display order (`favorites_order`) syncs through the same prefs `applySyncOp` path (`opMoveFavoritesOrder` / `opSetFavoritesOrder`) — not a full-row snapshot push.

**Pull**: on sign-in, `pullSync({ stream: 'favorites' })` merges remote into local with `mergeFavoritesByDomain` (path-level union). Never absolute-replaces a domain bucket.

**Migration bridge**: the first sign-in after the favorites refactor does a one-shot union upload of any pre-existing local favorites before the merge pull. A `loopy.favorites.migrated` flag gates this; it is only set when every upload succeeds.

**Concurrency guarantees**: two devices saving different URLs on the same domain converge to a row containing both entries — the loser's CAS misses, it re-reads, re-applies its operator against the winner's post-state, and writes. `opRemovePath` is a no-op when the path is already absent, so a remove that lost a race against another remove is idempotent.

The Fav Links page renders one group per domain (custom order via arrow buttons; freshest-first tiebreak for domains not yet in the order array). Rows are single-line with a 30% title / URL split and hover tooltips. A search box above filters by title, URL, group label, or hostname (case-insensitive substring); groups whose rows all drop out are hidden until the query clears. Removing the last favorite on a domain drops the whole row so the list doesn't show an empty header. Edit / remove / clear-domain / clear-all controls all hide when signed-out (the read-only list itself still renders).

### 7. Dev auto-login (optional)

Skip the OTP UI during development. Uses Supabase's built-in **Test OTP** feature, so no fake accounts or mocked sessions — it's the real OTP flow against a whitelisted email that Supabase accepts a static code for.

1. **Dashboard** → **Authentication** → **Advanced Settings** → **Test OTPs**. Add a row, e.g. `dev@example.com` → `123456`. Save. (Supabase will *not* send an email to this address; `verifyOtp` just accepts the static code.)
2. Create the account once: run the app, enter the test email in the sign-in form, then enter the static code. This inserts the user in `auth.users` and fires the `on_auth_user_created` trigger, giving you a `profiles` row to develop against.
3. Copy `.env` → `.env.local` (gitignored) and add:
   ```
   VITE_DEV_AUTOLOGIN_EMAIL=dev@example.com
   VITE_DEV_AUTOLOGIN_TOKEN=123456
   ```
4. Restart `npm run dev` / `npm run dev:ext`. Next reload you land straight on the Home page. A small **Dev** pill appears in the header so it's obvious the bypass is active.

Only active in dev builds. `import.meta.env.DEV` is statically `false` in `npm run build` / `npm run build:web`, so the whole branch is tree-shaken out of `dist/` and `dist-web/` — the env vars can't ship to production even if you leave them in `.env.local`.

To disable, remove the two vars from `.env.local` (or delete `.env.local`) and restart the dev server.

---

## Permissions

The manifest declares:

- `activeTab` — access to the current tab's `url` / `title` when the user invokes the extension. No permission prompt.
- `storage` — for `chrome.storage.local` (session persistence).
- `tabs` — used by [`background.js`](background.js) to read `tab.url` and `tab.title` from `chrome.tabs.query`. Prompts the user on first install because the browser considers `tab.url` sensitive across all tabs.
- `webNavigation` — used by [`background.js`](background.js) to record visits whose hostname matches the user's AEM domain list. `chrome.webNavigation.onCompleted` and `chrome.webNavigation.onHistoryStateUpdated` fire with the *actual* navigated URL (including SPA `pushState` updates), unlike `chrome.tabs.onUpdated` which only exposes the last committed HTTP navigation. AEM's authoring UI rewrites the address bar via `pushState` — without `webNavigation`, we'd miss almost every intra-authoring navigation.
- `scripting` — used by [`src/lib/activeTab.js`](src/lib/activeTab.js) to inject a one-line `() => window.location.href` into the active tab as a fallback when `tab.url` is a stale bare origin. Same pushState problem, but from the popup's side: the AEM Jump input needs the URL the user actually sees, and `tabs.query` reports the pre-pushState URL.
- `host_permissions: ["https://*.supabase.co/*"]` — required for the popup to call Supabase's Auth and REST endpoints.

Add more later in [`manifest.json`](manifest.json) as features land.

---

## What's intentionally missing (TODO)

- Real icons — the extension currently uses Chrome's default puzzle-piece. Add `icons/16.png`, `32.png`, `48.png`, `128.png` in `public/icons/` and register them in `manifest.json` under `icons` and `action.default_icon`.
- Options page (`options_page`) and content scripts.
- Phone/SMS auth — not free on Supabase (requires paid Twilio-style provider).

---

## CI / Firebase Hosting

Primary web host: **Firebase Hosting** on project `project-loopy`.

- **Live URL**: https://project-loopy.web.app  
- **Workflow**: [`.github/workflows/deploy-loopy-firebase.yml`](.github/workflows/deploy-loopy-firebase.yml)  
- **Trigger**: push to `tool/loopy` (or manual `workflow_dispatch`)  
- **Local deploy**: `npm run deploy:web` (builds, then `firebase deploy --only hosting:loopy`)  
- **Config**: [`firebase.json`](firebase.json), [`.firebaserc`](.firebaserc) — hosting target `loopy` → site `project-loopy`  
- **Repo secrets** (Settings → Secrets and variables → Actions):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `FIREBASE_SERVICE_ACCOUNT` (JSON for `github-hosting-deploy@project-loopy.iam.gserviceaccount.com`)

### Supabase Auth allowlist

In the Loopy Supabase project → **Authentication → URL Configuration**:

- Add `https://project-loopy.web.app` (and later any custom domain) to **Redirect URLs**
- Prefer that URL as **Site URL** once you cut over from GitHub Pages

Email OTP (`verifyOtp`) does not require a magic-link redirect, but keeping the origin allowlisted avoids surprises if you add link-based flows later.

### Vite `base`

Web prod `base` defaults to `/` for Firebase (`https://project-loopy.web.app/`). Set `VITE_BASE` only if you intentionally deploy under a subpath (e.g. legacy Pages).

### Legacy GitHub Pages

- **Workflow**: [`.github/workflows/deploy-loopy-pages.yml`](.github/workflows/deploy-loopy-pages.yml) — **manual only** (`workflow_dispatch`)
- **Old URL**: https://ppeou-gendigital.github.io/tools/loopy/
- Dual-build Pages coexistence (loopy + accesso) still applies if you run that workflow.

### Install as a PWA (web build only)

The web deploy is an installable Progressive Web App (manifest + service worker for the app shell). The Chrome extension build is unchanged and is not a PWA.

- **iPhone / iPad (Safari):** open the live URL → Share → **Add to Home Screen**.
- **Android (Chrome):** open the live URL → browser menu → **Install app** / **Add to Home screen** when Chrome offers it.
- **Updates:** [`src/pwaRegister.js`](src/pwaRegister.js) checks for a new service worker on app focus / visibility and calls `updateSW(true)` when a waiting worker is ready (`registerType: 'autoUpdate'`), matching Viaggio. Home-screen apps have no hard-reload control; if the shell still won’t paint, the boot watchdog / [`BootErrorBoundary`](src/blocks/BootErrorBoundary.jsx) wipes site data once and reloads (or use **Reload app**).

---

## This branch

`loopy` lives on the branch `tool/loopy` in the [`tools`](../tools) meta-repo. Do **not** merge this branch into `main` or any other project branch — see the meta-repo's README for the branch-per-project rules.
