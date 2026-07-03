# Loopy

A Chrome extension **and** web app in one codebase. React (ES6, no TypeScript) + Vite + SCSS modules, with Supabase email-OTP auth and light/dark theming.

- **Manifest**: V3
- **UI**: React 19, hand-rolled components in SCSS Modules (shadcn/ui used only as visual reference), Lucide icons
- **Auth + storage**: [Supabase](https://supabase.com/) (Auth + Postgres) — free tier
- **Build**: Vite + `@crxjs/vite-plugin`

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
| `npm run build:web` | Production web build → `dist-web/`                                 |
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

### 4. User preferences table (`user_data`)

Backs the auto-sync layer. One row per user, holding a small JSON blob of
local prefs (theme, fontSize, fabCorner). In **SQL Editor**, run:

```sql
create table public.user_data (
  id         uuid primary key references auth.users(id) on delete cascade,
  data       jsonb        not null default '{}'::jsonb,
  updated_at timestamptz  not null default now()
);

alter table public.user_data enable row level security;

create policy "user_data self-read"   on public.user_data for select using (auth.uid() = id);
create policy "user_data self-insert" on public.user_data for insert with check (auth.uid() = id);
create policy "user_data self-update" on public.user_data for update using (auth.uid() = id) with check (auth.uid() = id);
```

No trigger — the app upserts on first change, so rows only exist for users
who have actually signed in and touched a pref.

**Auto-sync behavior** (see `src/providers/PrefsSync.jsx`):

- **On sign-in** the app fetches `user_data` and applies the remote values
  via the provider setters (remote wins). If there's no cloud row yet, the
  current local values become the sync baseline.
- **On any local change** (theme toggle, +/- font size, FAB corner drag) the
  app upserts the new blob after a 500ms debounce (local wins during the
  session). Rapid clicks coalesce into a single request.

Two guards prevent ping-pong: an "applying remote" flag skips the auto-push
that would otherwise fire from the setter calls during a pull, and a
`lastSynced` ref short-circuits the push effect when the current values
already match the cloud.

### 5. Dev auto-login (optional)

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
- `host_permissions: ["https://*.supabase.co/*"]` — required for the popup to call Supabase's Auth and REST endpoints.

Add more later in [`manifest.json`](manifest.json) as features land.

---

## What's intentionally missing (TODO)

- Real icons — the extension currently uses Chrome's default puzzle-piece. Add `icons/16.png`, `32.png`, `48.png`, `128.png` in `public/icons/` and register them in `manifest.json` under `icons` and `action.default_icon`.
- Options page (`options_page`) and content scripts.
- Phone/SMS auth — not free on Supabase (requires paid Twilio-style provider).

---

## This branch

`loopy` lives on the branch `tool/loopy` in the [`tools`](../tools) meta-repo. Do **not** merge this branch into `main` or any other project branch — see the meta-repo's README for the branch-per-project rules.
