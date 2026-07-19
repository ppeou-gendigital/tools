# New tool checklist

Follow these steps once, in order, whenever you spin up a new tool from `template/base`. Everything is idempotent — re-run the init script or SQL blocks as many times as you want.

## 1. Branch off the template

```bash
git checkout template/base
git pull
git checkout -b tool/foo   # replace `foo` with your tool name (lowercase, hyphen-safe)
```

## 2. Rename placeholders

```bash
npm install
npm run init -- --name foo
```

The renamer touches:

- `package.json` — `name`
- `manifest.json` — `name`, `description`, `action.default_title`
- `vite.config.js` — `base: '/tools/foo/'` and `outDir: 'dist-web/foo'`
- `index.html` / `popup.html` — `<title>`
- `.github/workflows/deploy-accesso-pages.yml` → `deploy-foo-pages.yml` (updates branch trigger to `tool/foo`)
- `.github/workflows/release-accesso-extension.yml` → `release-foo-extension.yml` (updates tag prefix to `foo-v*`)
- Any remaining `accesso` / `accesso` in source files (storage keys, aria labels, console prefixes, About row name)

Verify with `git diff` before committing.

## 3. Replace the icon

1. Drop your 128x128 SVG at `icons/tool.svg` (transparent background, viewBox="0 0 128 128").
2. Regenerate the PNG sizes:
   ```bash
   npm run icons
   ```
   Extension sizes (16–128) stay transparent. Apple/PWA sizes (180, 192, 512) are filled opaque with the brand color so iOS home-screen icons do not show black corners.
3. Commit `icons/tool.svg` and the generated PNGs (extension + PWA sizes).

## 4. Set up Supabase

Follow [README.md → Supabase setup](README.md#supabase-setup):

- [ ] Create a Supabase project (free tier).
- [ ] Configure the email OTP template to use `{{ .Token }}`.
- [ ] Copy `.env.example` → `.env` and paste `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.
- [ ] Run the `profiles` table + RLS + `handle_new_user` trigger SQL.
- [ ] Run the `user_data` table + RLS SQL.
- [ ] (Optional) Configure a Test OTP and set `VITE_DEV_AUTOLOGIN_EMAIL` / `_TOKEN` in `.env.local` for dev auto-login.

## 5. Add repo secrets

If you plan to deploy via GitHub Actions, add these under **Settings → Secrets and variables → Actions**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Repo-scoped secrets are shared across all `tool/*` branches, so you only add them once per repo.

## 6. Verify locally

```bash
npm install
npm run dev          # web dev server (http://localhost:5173/)
npm run dev:ext      # watch build for the extension (load dist/ unpacked)
npm run build        # prod extension build
npm run build:web    # prod web build
npm run lint
```

All five should succeed on a fresh clone with a valid `.env`.

## 7. Deploy

- **Web (GitHub Pages)**: push to `tool/foo` — the workflow at `.github/workflows/deploy-foo-pages.yml` dual-builds this tool and its sibling(s), then publishes a combined artifact so `/tools/foo/` (and e.g. `/tools/loopy/`) stay live together.
- **Extension (release)**: `git tag foo-v0.1.0 && git push --tags` — the release workflow builds `dist/`, zips it, and creates a GitHub Release with the zip attached.

## Pages coexistence (READ THIS)

A GitHub repo publishes exactly **one** Pages site, and each deploy replaces the entire site. Coexistence works because every tool's Pages workflow builds **all** sibling tools into one artifact (`site/<tool>/` folders). Mirror that dual-build (or multi-build) pattern in every `deploy-*-pages.yml`, and add each `tool/<name>` branch to the `github-pages` environment's deployment branch policy.

If a tool should not share this site, give it its own dedicated GitHub repo (or host it on Vercel / Cloudflare Pages / Netlify).

## What to build next

The template ships with a bare skeleton (Home, Profile, Settings, DeckDemo). Common next steps:

- **Add a page** — create `src/pages/YourPage.jsx` + `.module.scss`, register the route in [NavigationProvider](src/providers/NavigationProvider.jsx), and add a `MenuRow` entry in [MenuPanel](src/patterns/MenuPanel.jsx) (or a `SettingsCard` in [Settings](src/pages/Settings.jsx)).
- **Add a synced field** — do **not** grow a monolithic PrefsSync push. Instead:
  1. Add a pure operator in [`userDataOps.js`](src/lib/userDataOps.js) that only touches your key(s) inside `data`.
  2. Have the provider call `applySyncOp({ stream: 'prefs', userId, op })` after an optimistic local write (support `{ fromRemote: true }` so pull does not echo).
  3. Extend [PrefsSync](src/providers/PrefsSync.jsx) pull to apply the field when it is not dirty mid-fetch.
  4. Add a normalizer in [prefs.js](src/lib/prefs.js) if the value needs clamping.
  See `theme` / `fontSize` / `fabCorner` / `opPatchVaultMeta` as the patterns to copy. Entry point: [`supabaseSync.js`](src/lib/supabaseSync.js).
- **Add a synced list or map** — prefer a new `jsonb` column on `user_data` (Loopy has several) and extend `applySyncOp` with a stream/column adapter, or keep it inside `data` with a field-scoped op. Mirror into a dedicated provider. Do not blind-upsert the whole `data` blob.
- **Add a synced vault table** — encrypted feature tables (`credentials` / `credit_cards` pattern): add a stream in [`supabaseSync.js`](src/lib/supabaseSync.js), pure ops in [`vaultItemOps.js`](src/lib/vaultItemOps.js), route writes through `enqueueSyncOp` + `applySyncOp`, optimistic cache via [`vaultItemsCache.js`](src/lib/vaultItemsCache.js), and pull-on-unlock via [`VaultItemsSync`](src/providers/VaultItemsSync.jsx) with dirty-id guards. Do not stuff ciphertext into the `user_data` prefs blob.
- **Capture URLs from the SW** — layer `chrome.webNavigation.onCompleted` on top of the [background.js](background.js) stub. Loopy's `supabaseSync` + `visitsSync` + background.js is the reference for per-domain CAS merges and `chrome.alarms`-driven pushes.

Reference: [`tool/loopy`](../../tree/tool/loopy) is a real, shipped tool built on this template. Its [`supabaseSync.js`](../../blob/tool/loopy/src/lib/supabaseSync.js) is the shared sync contract Acceso now mirrors for prefs.
