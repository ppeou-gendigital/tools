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
- `vite.config.js` — `base: '/tools/foo/'`, `outDir: 'dist-web/foo'`, and PWA manifest `name` / `short_name` / `description`
- `index.html` / `popup.html` — `<title>` and `apple-mobile-web-app-title`
- `.github/workflows/deploy-TOOLNAME-pages.yml` → `deploy-foo-pages.yml` (updates branch trigger to `tool/foo`)
- `.github/workflows/release-TOOLNAME-extension.yml` → `release-foo-extension.yml` (updates tag prefix to `foo-v*`)
- Any remaining `TOOLNAME` / `toolname` in source files (storage keys, aria labels, console prefixes, About row name)

**Branch → Pages URL formula** (keep these aligned):

| Step | Value |
| ---- | ----- |
| Branch | `tool/foo` |
| `npm run init -- --name` | `foo` |
| Vite `base` / `outDir` | `/tools/foo/` · `dist-web/foo` |
| Live URL | `https://<user>.github.io/tools/foo/` |

Note: the URL uses the **repo name** (`tools`) + the **branch suffix** (`foo`), not the category prefix. `tool/foo` → `/tools/foo/`, never `/tool/foo/`.

Verify with `git diff` before committing.

## 3. Replace the icon

1. Drop your 128x128 SVG at `icons/tool.svg` (transparent background, viewBox="0 0 128 128"). The in-app [`Logo`](src/molecules/Logo.jsx) component reads this same file.
2. Regenerate PNGs (transparent extension **16 / 32 / 48 / 128** in `icons/`, opaque iOS/PWA **180 / 192 / 512** in `public/icons/`):
   ```bash
   npm run icons
   ```
   Opaque fill is required for iOS home-screen icons (transparent corners paint black) and PWA maskable icons.
3. Commit `icons/tool.svg`, the four extension PNGs, and the three `public/icons/` PNGs.

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

- **Web (GitHub Pages)**: push to `tool/foo` — the workflow at `.github/workflows/deploy-foo-pages.yml` builds and publishes to `/tools/foo/` on the repo's Pages site.
- **Extension (release)**: `git tag foo-v0.1.0 && git push --tags` — the release workflow builds `dist/`, zips it, and creates a GitHub Release with the zip attached.

## Install as a PWA

The web build ships as an installable Progressive Web App (`vite-plugin-pwa`: manifest + app-shell service worker). The Chrome extension build is unchanged and is not a PWA.

After deploy:

- **iPhone / iPad**: open the live URL in Safari → Share → **Add to Home Screen** (opens standalone).
- **Desktop Chrome / Edge**: use the install icon in the address bar, or the browser’s Install app menu.

## Pages gotcha (READ THIS)

A GitHub repo publishes exactly **one** Pages site. Every deploy to the `github-pages` environment **replaces the entire site**. If `tool/loopy` deploys today and `tool/foo` deploys tomorrow, `/tools/loopy/` will 404 until loopy is redeployed.

If two tools need Pages simultaneously, options in order of preference:

1. Use a **multi-tool coordinator** workflow that checks out sibling tool branches, builds each, and uploads one combined artifact (e.g. `site/loopy/` + `site/foo/`). See [`tool/accesso`](../../tree/tool/accesso) `.github/workflows/deploy-accesso-pages.yml` for the working pattern.
2. Give the second tool its own dedicated GitHub repo.
3. Host the second tool on Vercel / Cloudflare Pages / Netlify.

## What to build next

The template ships with a bare skeleton (Home, Profile, Settings, DeckDemo). Common next steps:

- **Add a page** — create `src/pages/YourPage.jsx` + `.module.scss`, register the route in [NavigationProvider](src/providers/NavigationProvider.jsx), wrap the header in [PageHeader](src/patterns/PageHeader.jsx) + [PageShortcuts](src/patterns/PageShortcuts.jsx), and add a menu entry in [MenuPanel](src/patterns/MenuPanel.jsx) (or a `SettingsCard` in [Settings](src/pages/Settings.jsx)).
- **Add a synced field** — add a normalizer in [prefs.js](src/lib/prefs.js), an `opSet*` in [userDataOps.js](src/lib/userDataOps.js), push from the provider via `applySyncOp`, and teach [PrefsSync](src/providers/PrefsSync.jsx) how to apply the remote value on pull. See the `theme` / `fontSize` / `fabCorner` triple as the pattern to copy.
- **Add a synced list or map** — add a new `jsonb` column on `user_data` (loopy has several), extend `normalizePrefsRow` / op factories in [supabaseSync.js](src/lib/supabaseSync.js) + [userDataOps.js](src/lib/userDataOps.js), and mirror it into a dedicated provider. For per-domain CAS tables, copy the domain-stream helpers from the loopy branch.
- **Capture URLs from the SW** — layer `chrome.webNavigation.onCompleted` on top of the [background.js](background.js) stub. Loopy's background.js is the reference for a full capture + Supabase sync loop with `chrome.alarms`-driven pushes.

Reference: [`tool/loopy`](../../tree/tool/loopy) is a real, shipped tool built on this template. Anything you're missing here — a synced list, a capture pipeline, per-domain compare-and-swap merges — is likely there in a fully working form.
