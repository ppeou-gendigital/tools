# acceso

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
| `npm run icons`     | Rasterize `icons/tool.svg` into the four PNG sizes                 |
| `npm run init`      | Rename the template to a new tool name (see below)                 |

---

## Project layout

```
acceso/
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
│   │   ├── storage.js          # chrome.storage.local <-> localStorage
│   │   ├── cx.js               # className concatenator
│   │   ├── queryClient.js      # React Query client
│   │   ├── queryPersister.js   # Async storage persister
│   │   ├── prefs.js            # normalizers for the user_data blob
│   │   └── userDataApi.js      # fetch/upsert user_data row
│   ├── providers/
│   │   ├── AuthProvider.jsx    # session, requestOtp, verifyOtp, signOut
│   │   ├── ThemeProvider.jsx   # light | dark | system, persisted
│   │   ├── FontSizeProvider.jsx
│   │   ├── FabCornerProvider.jsx
│   │   ├── NavigationProvider.jsx  # in-memory router (no react-router)
│   │   └── PrefsSync.jsx       # two-way sync theme/fontSize/fabCorner to Supabase
│   ├── molecules/              # Button, Input, Label, IconButton, MenuRow, Divider
│   ├── patterns/               # Card, MenuPanel, AccountRow, AppearanceRow, AboutRow, DevBadgeItem, DeckDemoItem
│   ├── blocks/                 # AuthGate, Deck, FloatingMenu, SignInForm
│   ├── templates/AppShell.jsx  # grid header/main/footer
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
│   ├── generate-icons.mjs      # rasterize tool.svg -> 4 PNGs
│   └── init-tool.mjs           # rename template placeholders to your tool name
└── icons/tool.svg              # source SVG for the four PNG sizes
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

acceso uses `signInWithOtp` + `verifyOtp` with `type: 'email'`. The default Supabase email template uses a `ConfirmationURL` — replace it with the OTP token.

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

The `data` blob also carries the vault metadata (`vault.salt`, `vault.iterations`, `vault.verifier`) that powers the app-wide E2EE vault — see [Vault (app-wide E2EE)](#vault-app-wide-e2ee) below.

**Auto-sync behavior** (see [src/providers/PrefsSync.jsx](src/providers/PrefsSync.jsx)):

- **On sign-in** the app fetches the row and applies it via the provider setters (remote wins). If there's no cloud row yet, the current local values become the sync baseline.
- **On any local change** (theme toggle, +/- font size, FAB corner drag) the app upserts after a 500ms debounce (local wins during the session). Rapid clicks coalesce into a single request.

Two guards prevent ping-pong: an "applying remote" flag skips the auto-push that would otherwise fire from the setter calls during a pull, and a `lastSynced` ref short-circuits the push effect when the current values already match the cloud.

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

## Vault (app-wide E2EE)

The vault is the app's **general-purpose end-to-end encryption layer** — one master passphrase per user, used by every feature that needs to store sensitive data. The passphrase never leaves the device. All ciphertext is AES-GCM 256 with a key derived from that passphrase via PBKDF2-SHA-256; the derived `CryptoKey` is non-extractable and lives only in memory.

Because the derivation is deterministic (passphrase + per-user salt → same 256-bit key on every device), the vault works transparently across the Chrome extension and the web app — sign in, enter the passphrase once, decrypt in memory. The same key protects every feature-specific table without any per-feature key management.

**Extending the vault** is straightforward: any new feature that needs E2EE storage adds its own Postgres table (schema is per-feature) with `ciphertext text` + `iv text` columns, protects it with the same self-RLS pattern, and calls `vault.encryptRecord(...)` / `vault.decryptRecord(...)` from [`VaultProvider`](src/providers/VaultProvider.jsx). No new passphrase, no new setup step, no new unlock flow — the existing overlay, idle-lock, and session cache all cover it for free.

**Credentials** is the first consumer of the vault and doubles as a worked example (see below). Future features (secure notes, encrypted files, saved sessions, etc.) plug into the same primitives.

> **Warning**: if you forget the master passphrase, every encrypted feature is unrecoverable. There is no reset — that is the point of E2EE. See [src/providers/VaultProvider.jsx](src/providers/VaultProvider.jsx) and [src/lib/vaultCrypto.js](src/lib/vaultCrypto.js).

### 1. Vault metadata (rides on `user_data.data`)

No dedicated table for vault meta — it piggybacks on the existing `user_data` row's `data` JSONB blob:

```json
{
  "theme": "system",
  "fontSize": 16,
  "fabCorner": "bottom-right",
  "vault": {
    "salt": "<base64 16 bytes>",
    "iterations": 310000,
    "verifier": { "ciphertext": "<base64>", "iv": "<base64>" },
    "idleTimeoutMs": 900000
  }
}
```

The `verifier` is a small known constant encrypted with the derived key. On unlock the app decrypts it and checks it matches, which is how we distinguish a wrong passphrase from a network error without ever storing the passphrase.

### 2. First consumer: the `credentials` table + RLS

Credentials is the reference implementation for a vault-backed feature. Its schema has one plaintext column (`display_name`, so the DB can sort and filter without unlocking) and one encrypted blob (`ciphertext` + `iv`) that holds everything sensitive.

In **SQL Editor**, run:

```sql
create table public.credentials (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  display_name  text        not null,
  ciphertext    text        not null,
  iv            text        not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index credentials_user_updated_idx
  on public.credentials (user_id, updated_at desc);

alter table public.credentials enable row level security;

create policy "credentials self-read"   on public.credentials for select using (auth.uid() = user_id);
create policy "credentials self-insert" on public.credentials for insert with check (auth.uid() = user_id);
create policy "credentials self-update" on public.credentials for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "credentials self-delete" on public.credentials for delete using (auth.uid() = user_id);
```

`ciphertext` and `iv` are base64. The encrypted plaintext is a JSON blob:

```json
{
  "urlOrApp": "https://gmail.com",
  "accounts": [{ "username": "...", "password": "..." }],
  "notes": "..."
}
```

Use this table as the template when you add another vault-backed feature: same `ciphertext` / `iv` columns, same self-RLS policies, whatever plaintext columns your feature needs for indexing.

### 3. Session caching + auto-lock

Typing the master passphrase every time the popup opens gets old fast. To keep the security model intact while cutting friction, the vault caches the passphrase in **session-scoped** browser storage: `chrome.storage.session` in the extension (shared between the popup and the MV3 service worker) and `sessionStorage` on the web build. Both tiers clear on browser close, so nothing survives a full quit.

The cached passphrase re-derives the same non-extractable AES key on next popup / tab load — the CryptoKey itself never leaves memory. See [src/lib/sessionStorage.js](src/lib/sessionStorage.js).

An **idle timeout** locks the vault after a configurable window of user inactivity (`pointerdown` / `keydown` / `visibilitychange` count as activity). The list of options and the default live in [src/lib/vaultIdleOptions.js](src/lib/vaultIdleOptions.js). The current selection is stored on `user_data.data.vault.idleTimeoutMs` (see the JSON above) so it syncs across devices, and can be changed from **Settings → Vault**.

Anything that ends the vault session — manual lock, sign-out, auth switch, browser close, or the timeout firing — clears the session cache, drops the in-memory `CryptoKey`, and evicts any decrypted data (currently the credentials query; future vault-backed queries should follow the same pattern) from React Query, so no plaintext lingers.

### 4. Auto-capture (extension only)

The **Capture** button on the Credentials list reads the username / password fields from the active tab and routes you into the credential edit form pre-filled with what it found — you always review and Save yourself, nothing is written silently.

- **Smart merge (hostname-based):** the detected URL is matched by hostname against your existing entries. No match → new credential seeded with URL + user + pass; hostname match + same username → the matched account's password is replaced; hostname match + new username → a new account is appended to the existing entry.
- **Nothing leaves the device:** the injected page scanner runs entirely in the target tab, and captured values travel through the same E2EE vault path as any manually-entered credential — the Credentials page never sees plaintext outside the user's session.
- **Manifest permissions:** requires `activeTab` (temporary tab access granted by the popup click) and `scripting` (to inject the scanner) in [manifest.json](manifest.json). No broad host_permissions are added — the extension can only touch the tab you're actively on.
- **Current limitations (v1):** single form per page, first visible password field, no iframe traversal, no two-step (email → next page → password) flows. See [src/lib/pageScanner.js](src/lib/pageScanner.js).

---

## Permissions

The manifest declares:

- `storage` — for `chrome.storage.local` / `chrome.storage.session` (prefs + session-scoped passphrase cache).
- `activeTab` — grants temporary access to the current tab after a popup gesture, used by the Credentials **Capture** button.
- `scripting` — required to inject the page scanner into the active tab (paired with `activeTab`).
- `host_permissions: ["https://*.supabase.co/*"]` — required for the popup to call Supabase's Auth and REST endpoints.

Add more as your tool needs them (`tabs`, `webNavigation`, `alarms`, etc.) in [manifest.json](manifest.json). See the [`tool/loopy`](../../tree/tool/loopy) branch for a full-featured example.

---

## CI / GitHub Pages

- **Workflow**: [`.github/workflows/deploy-acceso-pages.yml`](.github/workflows/deploy-acceso-pages.yml)
- **Trigger**: push to `tool/acceso` (or manual `workflow_dispatch` from the Actions tab)
- **Live URL**: `https://<user>.github.io/tools/acceso/`
- **Build**: `npm run build:web` → `dist-web/acceso/` (nested so the uploaded artifact serves at `/tools/acceso/`)
- **Repo secrets required** (Settings → Secrets and variables → Actions):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- **Repo Pages settings**: Settings → Pages → Source = **GitHub Actions**

`scripts/init-tool.mjs` renames both this workflow file and the release workflow to match your tool's name, plus updates the branch triggers.

### One Pages site per repo — important

A GitHub repo publishes exactly **one** Pages site. Every deploy to the `github-pages` environment **replaces the entire site**. If `tool/loopy` deploys today and `tool/foo` deploys tomorrow, `/tools/loopy/` will 404 until loopy is redeployed. The `/tools/<tool>/` subpath convention gives us clean, stable URLs but does *not* enable coexistence.

If two tools need Pages simultaneously, options in order of preference:

1. Give the second tool its own dedicated GitHub repo (recommended long-term).
2. Host the second tool on Vercel / Cloudflare Pages / Netlify.
3. Build a coordinator workflow that combines all tools' builds into one artifact (complex — not recommended unless the tool count grows).
