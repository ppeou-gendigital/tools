# New tool checklist

Follow these steps once, in order, whenever you spin up a new tool from `template/base`. Everything is idempotent — re-run the init script as many times as you want.

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
- `.github/workflows/deploy-jira-capacity-pages.yml` → `deploy-foo-pages.yml` (updates branch trigger to `tool/foo`)
- `.github/workflows/release-jira-capacity-extension.yml` → `release-foo-extension.yml` (updates tag prefix to `foo-v*`)
- Any remaining `jira-capacity` / `jira-capacity` in source files (storage keys, aria labels, console prefixes, About row name)

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

1. Drop your 128x128 SVG at `icons/tool.svg` (transparent background, viewBox="0 0 128 128"). Prefer a **rounded square** mark (`rx≈28` on a 120×120 inset) — circles look fine in the extension toolbar, but favicons need soft corners. Match the fill to `--fab-bg` / `BRAND_BG` in [`scripts/generate-icons.mjs`](scripts/generate-icons.mjs).
2. Update the Lucide glyph in [`Logo`](src/molecules/Logo.jsx) and [`FloatingMenu`](src/blocks/FloatingMenu.jsx) to match the SVG icon.
3. Regenerate PNGs:
   ```bash
   npm run icons
   ```
   Writes:
   - transparent extension **16 / 32 / 48 / 128** → `icons/icon-*.png`
   - opaque iOS/PWA **180 / 192 / 512** → `public/icons/icon-*.png` (opaque fill required; transparent corners paint black on iOS)
   - favicon **16 / 32** → `public/favicon-*.png` (transparent canvas so rounded corners show in browser tabs)
4. Commit `icons/tool.svg`, the extension PNGs, `public/icons/*`, and `public/favicon-*.png`.

## 4. Verify locally

```bash
npm install
npm run dev          # web dev server (http://localhost:5173/)
npm run dev:ext      # watch build for the extension (load dist/ unpacked)
npm run build        # prod extension build
npm run build:web    # prod web build
npm run lint
```

All five should succeed on a fresh clone — no `.env` required.

## Shared UI packages

This template ships three local packages under [`packages/`](packages/README.md):

- `@tools/ui` — tokens + `ui-*` CSS + presentational React
- `@tools/behavioral` — AppShell / FloatingMenu / MenuPanel shells
- `@tools/service` — Theme / FontSize / FabCorner providers (local prefs)

Edit shared UI on `template/base` only. When migrating a `tool/*` app, sync `packages/` into that branch, `npm install`, then replace local copies one app at a time (see packages README).

## 5. Deploy

- **Web (GitHub Pages)**: push to `tool/foo` — the workflow at `.github/workflows/deploy-foo-pages.yml` builds and publishes to `/tools/foo/` on the repo's Pages site.
- **Extension (release)**: `git tag foo-v0.1.0 && git push --tags` — the release workflow builds `dist/`, zips it, and creates a GitHub Release with the zip attached.

## Install as a PWA

The web build ships as an installable Progressive Web App (`vite-plugin-pwa`: manifest + app-shell service worker). The Chrome extension build is unchanged and is not a PWA.

After deploy:

- **iPhone / iPad**: open the live URL in Safari → Share → **Add to Home Screen** (opens standalone).
- **Desktop Chrome / Edge**: use the install icon in the address bar, or the browser’s Install app menu.

## iOS home-screen layout gotcha (READ THIS)

`index.html` uses `apple-mobile-web-app-status-bar-style=black-translucent` **without** `viewport-fit=cover`. That matches Loopy and Accesso: iOS keeps the layout viewport in the safe area, so page titles are not under the status bar / Dynamic Island.

Do **not** add `viewport-fit=cover` to the viewport meta unless you also inset the shell (and overlays) with `env(safe-area-inset-*)`. Cover alone makes Add-to-Home-Screen content sit too high.

## Pages gotcha (READ THIS)

A GitHub repo publishes exactly **one** Pages site. Every deploy to the `github-pages` environment **replaces the entire site**. If `tool/loopy` deploys today and `tool/foo` deploys tomorrow, `/tools/loopy/` will 404 until loopy is redeployed.

If two tools need Pages simultaneously, options in order of preference:

1. Use a **multi-tool coordinator** workflow that checks out sibling tool branches, builds each, and uploads one combined artifact (e.g. `site/loopy/` + `site/foo/`). See [`tool/accesso`](../../tree/tool/accesso) `.github/workflows/deploy-accesso-pages.yml` for the working pattern.
2. Give the second tool its own dedicated GitHub repo.
3. Host the second tool on Vercel / Cloudflare Pages / Netlify.

## App version (build-stamped)

Do **not** hardcode `0.1.0` in `App.jsx` / `MenuPanel`. Vite injects `VITE_APP_VERSION` as `package.json` version + short git SHA (e.g. `0.1.0+ed7b435`) via [`vite.config.js`](vite.config.js). Read it from [`src/env.js`](src/env.js) as `APP_VERSION` for:

- React Query persist `buster`
- Menu **About** row

Bump `package.json` `version` when the cached query shape changes in a breaking way; the SHA already changes every commit.

## What to build next

The template ships with a bare skeleton (Home, Settings, DeckDemo, RichTextDemo). Common next steps:

- **Add a page** — create `src/pages/YourPage.jsx` + `.module.scss`, register the route in [NavigationProvider](src/providers/NavigationProvider.jsx), add it to [AppNavItems](src/patterns/AppNavItems.jsx) (feeds the page-header icon toolbar + FAB “App” section), wrap the header in [PageHeader](src/patterns/PageHeader.jsx) + [PageShortcuts](src/patterns/PageShortcuts.jsx), and/or add a `SettingsCard` in [Settings](src/pages/Settings.jsx). Last route is remembered in `jira-capacity:lastRoute` (renamed by init-tool). Home shows a list/tiles layout toggle (`jira-capacity:homeLayout`) as a reference pattern.
- **Rich text field** — drop in [`RichNoteEditor`](src/molecules/RichNoteEditor.jsx); persist with [`richBody.js`](src/lib/richBody.js) (`serializeRichBody` / `parseRichBody`). Demo: menu → **Rich text demo**.
- **Local prefs field** — persist via `asyncStorage` in a provider under `@tools/service` (see theme / font size / FAB corner).
- **Capture URLs from the SW** — layer `chrome.webNavigation.onCompleted` on top of the [background.js](background.js) stub.
