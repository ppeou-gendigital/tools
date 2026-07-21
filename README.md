# TOOLNAME

A Chrome extension **and** web app in one codebase. React (ES6, no TypeScript) + Vite + SCSS modules, with Supabase email-OTP auth and light/dark theming.

This is the **template** branch. Full-featured reference implementation: see the [`tool/loopy`](../../tree/tool/loopy) branch.

- **Manifest**: V3
- **UI**: React 19, hand-rolled components in SCSS Modules, Lucide icons
- **Auth + storage**: [Supabase](https://supabase.com/) (Auth + Postgres) — free tier
- **Build**: Vite + `@crxjs/vite-plugin`

---

## Spin up a new tool from this template

1. From a clone of this repo:
   ```bash
   git checkout template/base
   git checkout -b tool/foo
   node scripts/init-tool.mjs --name foo
   ```
   The init script sweeps `foo` into `package.json`, `manifest.json`, `vite.config.js`, `index.html`, `popup.html`, and the GH Actions workflow filenames.
2. Follow [TEMPLATE.md](TEMPLATE.md) for the remaining one-time steps (Supabase project, repo secrets, icon replacement).

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

After code changes:

- **Popup / React code** — CRXJS hot-reloads the popup; if it stalls, close and reopen it.
- **`manifest.json` / `background.js`** — click the reload icon on the extension card in `chrome://extensions/`.

Inspect:

- **Popup**: right-click the toolbar icon → **Inspect popup**.
- **Service worker**: `chrome://extensions/` → your tool → **Inspect views: service worker**.

---

## Scripts

| Command             | What it does                                                       |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | Vite dev server for the web build (`index.html`)                   |
| `npm run dev:ext`   | Extension build in watch mode → `dist/`                            |
| `npm run build`     | Production extension build → `dist/`                               |
| `npm run build:web` | Production web build → `dist-web/`                                 |
| `npm run lint`      | ESLint over `src/**/*.{js,jsx}`                                    |
| `npm run icons`     | Rasterize `icons/tool.svg` → transparent extension + opaque iOS/PWA PNGs |
| `npm run init`      | Rename the template to a new tool name (see below)                 |

---

## Project layout

```
TOOLNAME/
├── manifest.json               # MV3 manifest (host permission for supabase.co)
├── background.js               # MV3 service worker (minimal stub)
├── index.html                  # web entry
├── popup.html                  # extension popup entry (400x600 body)
├── vite.config.js              # single Vite config, mode = web | extension
├── src/
│   ├── main.jsx                # bootstraps React into #root
│   ├── App.jsx                 # providers + tiny in-memory router
│   ├── env.js                  # isExtension(), env accessors, dev auto-login
│   ├── lib/
│   │   ├── supabase.js         # createClient + storage adapter + PKCE
│   │   ├── supabaseSync.js     # CAS applySyncOp / pullSync / enqueueSyncOp
│   │   ├── userDataOps.js      # pure op factories for the prefs row
│   │   ├── storage.js          # chrome.storage.local <-> localStorage
│   │   ├── cx.js               # className concatenator
│   │   ├── queryClient.js      # React Query client
│   │   ├── queryPersister.js   # Async storage persister
│   │   ├── prefs.js            # normalizers for the user_data blob
│   │   └── userDataApi.js      # thin wrappers → supabaseSync
│   ├── providers/
│   │   ├── AuthProvider.jsx    # session, requestOtp, verifyOtp, signOut
│   │   ├── ThemeProvider.jsx   # light | dark | system; local + CAS push
│   │   ├── FontSizeProvider.jsx
│   │   ├── FabCornerProvider.jsx
│   │   ├── NavigationProvider.jsx  # in-memory router (no react-router)
│   │   └── PrefsSync.jsx       # pull-only on sign-in (providers push)
│   ├── molecules/              # Button, Input, Label, Logo, IconButton, MenuRow, Divider
│   ├── patterns/               # Card, MenuPanel, PageHeader, PageShortcuts, …
│   ├── blocks/                 # AuthGate, Deck, FloatingMenu, SignInForm
│   ├── templates/AppShell.jsx  # scrollable main + FloatingMenu FAB
│   ├── pages/                  # Home, Profile, Settings, DeckDemo
│   ├── hooks/useCornerDrag.js  # FAB corner-drag + snap
│   └── tokens/
│       ├── main.scss           # loads reset + tokens + base + layout
│       ├── _tokens.scss        # CSS vars for [data-theme="light"] and "dark"
│       ├── _reset.scss
│       ├── _mixins.scss        # focus-ring, stack, row
│       ├── _base.scss
│       └── _layout.scss
├── scripts/
│   ├── generate-icons.mjs      # dual pipeline: transparent ext + opaque iOS/PWA
│   └── init-tool.mjs           # rename template placeholders to your tool name
├── icons/                      # tool.svg + transparent extension PNGs (16–128)
└── public/icons/               # opaque iOS / PWA PNGs (180 / 192 / 512)
```

---

## Theming

`ThemeProvider` writes `data-theme="light"` or `"dark"` on `<html>`. All tokens (colors, spacing, radii) live in [`src/tokens/_tokens.scss`](src/tokens/_tokens.scss) as CSS custom properties, so components reference `var(--fg)` etc. and never branch on theme.

The three modes are **Light**, **Dark**, **System** (follows `prefers-color-scheme`). The preference is persisted via the same async storage adapter — `chrome.storage.local` in the extension, `localStorage` on the web.

---

## Viewport control

The two HTML entries set different `data-surface` attributes on `<html>`, and `_base.scss` sizes the root element accordingly. Everything below (`<body>`, `.shell`, `.main`) is just `100%` of its parent — only `<html>` decides the app's outer dimensions.

- `popup.html` → `data-surface="popup"` → `html { width: min(100dvw, 400px); height: min(100dvh, 600px) }` (in the real Chrome popup the viewport already IS 400×600, so the caps collapse to that exact size; in a browser preview they cap it)
- `index.html` → `data-surface="web"` → `html { width: 100dvw; height: 100dvh }` — fills the viewport, no caps

Pages own their own reading inset via `.is-fluid-width` / `.is-static-width` wrappers or a `padding` on the page's root element. `.main` never sets `max-width` or `margin: 0 auto`.

---

## Layout primitives

- **`AppShell`** ([src/templates/AppShell.jsx](src/templates/AppShell.jsx)) — grid header/main/footer that fills its parent.
- **`FloatingMenu`** ([src/blocks/FloatingMenu.jsx](src/blocks/FloatingMenu.jsx)) — draggable FAB that snaps to the nearest corner. Position is persisted via `FabCornerProvider` and synced across devices via `PrefsSync`. Uses the [`useCornerDrag`](src/hooks/useCornerDrag.js) hook, which is reusable on any element.
- **`MenuPanel`** ([src/patterns/MenuPanel.jsx](src/patterns/MenuPanel.jsx)) — the popover the FAB opens. Composes `AppearanceRow` (theme + font size), `AccountRow` (profile + settings + sign out), `DeckDemoItem`, `DevBadgeItem`, `AboutRow`. Add your tool's menu entries here.
- **`Deck`** + **`Slide`** ([src/blocks/Deck.jsx](src/blocks/Deck.jsx)) — horizontal, snap-scrolling deck container with responsive column spans. See [`DeckDemo`](src/pages/DeckDemo.jsx) for a live example.

---

## Supabase setup

Create a project at https://supabase.com (free tier — 50k MAU / 500MB Postgres).

### 1. Configure email OTP (6-digit code, not magic-link)

TOOLNAME uses `signInWithOtp` + `verifyOtp` with `type: 'email'`. The default Supabase email template uses a `ConfirmationURL` — replace it with the OTP token.

- **Dashboard** → **Authentication** → **Email Templates** → **Magic Link**
- Replace the body with something like:
  ```
  Your login code is: {{ .Token }}
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

### 4. User preferences table (`user_data`)

Backs the auto-sync layer in [PrefsSync.jsx](src/providers/PrefsSync.jsx). One row per user, with a single JSONB `data` column carrying the small prefs blob (`theme`, `fontSize`, `fabCorner`, `updatedAt`).

Add more JSONB columns as your tool grows (e.g. a synced list, a rules object). Keep each column's normalizer isolated so any single column can be promoted to a real table later without touching the others — the loopy branch does exactly that with three columns.

In **SQL Editor**, run:

```sql
create table public.user_data (
  id          uuid        primary key references auth.users(id) on delete cascade,
  data        jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.user_data enable row level security;

create policy "user_data self-read"   on public.user_data for select using (auth.uid() = id);
create policy "user_data self-insert" on public.user_data for insert with check (auth.uid() = id);
create policy "user_data self-update" on public.user_data for update using (auth.uid() = id) with check (auth.uid() = id);
```

Row-scoped RLS covers all columns automatically. No trigger needed — the app upserts on first change, so rows only exist for users who have actually signed in and touched a pref.

**Auto-sync behavior** (CAS via [src/lib/supabaseSync.js](src/lib/supabaseSync.js)):

- **On sign-in** [PrefsSync](src/providers/PrefsSync.jsx) pulls the row and applies it via provider setters with `{ fromRemote: true }`. Fields the user changed mid-fetch are skipped (dirty-key guard).
- **On any local change** (theme toggle, +/- font size, FAB corner drag) the owning provider writes local storage first, then pushes through `enqueueSyncOp` → `applySyncOp` with a pure op from [userDataOps.js](src/lib/userDataOps.js). CAS retries on `updated_at` so concurrent edits to other fields are preserved.

Recipe for a new synced field: add a normalizer in `prefs.js`, an `opSet*` factory in `userDataOps.js`, push from the provider, and teach PrefsSync's pull how to apply the remote value. For domain-keyed streams (favorites / visits), copy the helpers from [`tool/loopy`](../../tree/tool/loopy).

### 5. Dev auto-login (optional)

Skip the OTP UI during development. Uses Supabase's built-in **Test OTP** feature, so no fake accounts or mocked sessions — it's the real OTP flow against a whitelisted email that Supabase accepts a static code for.

1. **Dashboard** → **Authentication** → **Advanced Settings** → **Test OTPs**. Add a row, e.g. `dev@example.com` → `123456`. Save.
2. Create the account once: run the app, enter the test email in the sign-in form, then enter the static code. This inserts the user in `auth.users` and fires the `on_auth_user_created` trigger, giving you a `profiles` row.
3. Copy `.env` → `.env.local` (gitignored) and add:
   ```
   VITE_DEV_AUTOLOGIN_EMAIL=dev@example.com
   VITE_DEV_AUTOLOGIN_TOKEN=123456
   ```
4. Restart `npm run dev` / `npm run dev:ext`. Next reload you land straight on the Home page. A small **Dev** pill appears in the header so it's obvious the bypass is active.

Only active in dev builds. `import.meta.env.DEV` is statically `false` in `npm run build` / `npm run build:web`, so the whole branch is tree-shaken out of `dist/` and `dist-web/`.

---

## Permissions

The manifest declares:

- `storage` — for `chrome.storage.local` (session persistence, prefs).
- `host_permissions: ["https://*.supabase.co/*"]` — required for the popup to call Supabase's Auth and REST endpoints.

Add more as your tool needs them (`activeTab`, `tabs`, `scripting`, `webNavigation`, `alarms`, etc.) in [manifest.json](manifest.json). See the [`tool/loopy`](../../tree/tool/loopy) branch for a full-featured example.

---

## CI / GitHub Pages

Branch naming drives the live path. After `npm run init -- --name TOOLNAME`:

| | |
| --- | --- |
| Branch | `tool/TOOLNAME` |
| Vite `base` / `outDir` | `/tools/TOOLNAME/` · `dist-web/TOOLNAME` |
| Live URL | `https://<user>.github.io/tools/TOOLNAME/` |

- **Workflow**: [`.github/workflows/deploy-TOOLNAME-pages.yml`](.github/workflows/deploy-TOOLNAME-pages.yml)
- **Trigger**: push to `tool/TOOLNAME` (or manual `workflow_dispatch` from the Actions tab)
- **Build**: `npm run build:web` → `dist-web/TOOLNAME/` (nested so the uploaded artifact serves at `/tools/TOOLNAME/`)
- **Repo secrets required** (Settings → Secrets and variables → Actions):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- **Repo Pages settings**: Settings → Pages → Source = **GitHub Actions**

`scripts/init-tool.mjs` renames both this workflow file and the release workflow to match your tool's name, plus updates the branch triggers.

### Install as a PWA (web build only)

The web deploy is an installable Progressive Web App (manifest + service worker for the app shell). The Chrome extension build is unchanged and is not a PWA.

- **iPhone / iPad**: Safari → Share → **Add to Home Screen**.
- **Desktop Chrome / Edge**: address-bar install icon or Install app menu.
- **Updates:** [`src/pwaRegister.js`](src/pwaRegister.js) checks for a new service worker on app focus / visibility and reloads automatically (`registerType: 'autoUpdate'`). Home-screen apps have no hard-reload control; if a build still looks stuck after deploy, force-quit the PWA once and reopen.

### One Pages site per repo — important

A GitHub repo publishes exactly **one** Pages site. Every deploy to the `github-pages` environment **replaces the entire site**. If `tool/loopy` deploys today and `tool/foo` deploys tomorrow, `/tools/loopy/` will 404 until loopy is redeployed. The `/tools/<tool>/` subpath convention gives us clean, stable URLs but does *not* enable coexistence by itself.

If two tools need Pages simultaneously, options in order of preference:

1. Use a **multi-tool coordinator** workflow that checks out sibling branches, builds every tool, and uploads one combined artifact (see [`tool/accesso`](../../tree/tool/accesso) `deploy-accesso-pages.yml`).
2. Give the second tool its own dedicated GitHub repo.
3. Host the second tool on Vercel / Cloudflare Pages / Netlify.
