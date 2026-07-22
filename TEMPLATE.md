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
- [ ] (Optional, E2EE tools) Run [`supabase/vault_meta.sql`](supabase/vault_meta.sql) for per-app salt/verifier storage. **Do not** put crypto meta in `user_data.data`.
- [ ] (Optional) Rich text attachments: run [`supabase/template_attachments.sql`](supabase/template_attachments.sql) after init (renames `toolname_*` → your tool). Add an FK from `parent_id` to your domain table when you have one.
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

## iOS home-screen layout gotcha (READ THIS)

`index.html` uses `apple-mobile-web-app-status-bar-style=black-translucent` **without** `viewport-fit=cover`. That matches Loopy and Accesso: iOS keeps the layout viewport in the safe area, so page titles are not under the status bar / Dynamic Island.

Do **not** add `viewport-fit=cover` to the viewport meta unless you also inset the shell (and overlays) with `env(safe-area-inset-*)`. Cover alone makes Add-to-Home-Screen content sit too high.

## Pages gotcha (READ THIS)

A GitHub repo publishes exactly **one** Pages site. Every deploy to the `github-pages` environment **replaces the entire site**. If `tool/loopy` deploys today and `tool/foo` deploys tomorrow, `/tools/loopy/` will 404 until loopy is redeployed.

If two tools need Pages simultaneously, options in order of preference:

1. Use a **multi-tool coordinator** workflow that checks out sibling tool branches, builds each, and uploads one combined artifact (e.g. `site/loopy/` + `site/foo/`). See [`tool/accesso`](../../tree/tool/accesso) `.github/workflows/deploy-accesso-pages.yml` for the working pattern.
2. Give the second tool its own dedicated GitHub repo.
3. Host the second tool on Vercel / Cloudflare Pages / Netlify.

## Shared `user_data` + vault meta gotcha (READ THIS)

All tools on the same Supabase project share one `user_data` row per user. Prefs CAS must **preserve sibling keys** (`extractForeignPrefs` in [`prefs.js`](src/lib/prefs.js)). Dropping unknown keys historically wiped Accesso’s vault when Notas wrote theme/font/fab.

For E2EE salt / verifier / hint / idle:

- Store in **`public.vault_meta`** (`app_id` = your tool id, or `tool:<scopeId>` for multi-vault).
- Use [`vaultMetaApi.js`](src/lib/vaultMetaApi.js) + optional [`vaultMetaBackup.js`](src/lib/vaultMetaBackup.js) export/restore.
- Run [`supabase/vault_meta.sql`](supabase/vault_meta.sql) once on the shared project.
- **Never** put salt/verifier in `user_data.data`.

References: [`tool/accesso`](../../tree/tool/accesso) (single vault), [`tool/notas`](../../tree/tool/notas) (`notas:<lockboxId>`).

## Sync strategy (READ THIS)

Template prefs use **CAS** via `applySyncOp` / `pullSync` (theme, fontSize, fabCorner). Domain data (notes, vault items, favorites, …) needs a stricter recipe so a stale local snapshot cannot wipe cloud data:

1. **Mutating ops** — pull → decide → apply locally → push. Never push from a dirty local document without first reconciling remote.
2. **Conflict rules** — pick one per stream (e.g. Notas workspace **semver**, notes **updatedAt** + op type). Stale edits abort; missing deletes are no-ops.
3. **Login / cold start** — pull, seed empty, or honor an intentional wipe. Do not treat a fresh local seed as authoritative.
4. **Focus / visibility** — flush dirty pushes only. **Never** blind `applyRemote` that overwrites in-flight local edits.

Reference implementation: [`tool/notas`](../../tree/tool/notas) `src/lib/workspaceSyncOps.js` + `WorkspaceSync` / `NotesProvider` / `LockboxProvider`.

## App version (build-stamped)

Do **not** hardcode `0.1.0` in `App.jsx` / `MenuPanel`. Vite injects `VITE_APP_VERSION` as `package.json` version + short git SHA (e.g. `0.1.0+ed7b435`) via [`vite.config.js`](vite.config.js). Read it from [`src/env.js`](src/env.js) as `APP_VERSION` for:

- React Query persist `buster`
- Menu **About** row

Bump `package.json` `version` when the cached query shape changes in a breaking way; the SHA already changes every commit.

## WebAuthn user-handle gotcha (READ THIS)

WebAuthn `publicKey.user.id` (the **user handle**) is capped at **64 bytes**. Browsers reject enrollment with `User handle exceeds 64 bytes` if you go over.

A single UUID as UTF-8 is fine (~36 bytes) — that is what [`tool/accesso`](../../tree/tool/accesso) `src/lib/biometrics.js` uses for vault biometrics. Concatenating two UUIDs (e.g. `userId:lockboxId`) is ~73 bytes and **will fail**.

When the handle must encode more than one id, hash it instead of concatenating:

```js
async function webAuthnUserHandle(userId, scopeId) {
  const raw = new TextEncoder().encode(`${userId}:${scopeId}`)
  return new Uint8Array(await crypto.subtle.digest('SHA-256', raw)) // 32 bytes
}
```

Reference: [`tool/notas`](../../tree/tool/notas) lockbox biometrics (`src/lib/biometrics.js`).

## What to build next

The template ships with a bare skeleton (Home, Profile, Settings, DeckDemo, RichTextDemo). Common next steps:

- **Add a page** — create `src/pages/YourPage.jsx` + `.module.scss`, register the route in [NavigationProvider](src/providers/NavigationProvider.jsx), wrap the header in [PageHeader](src/patterns/PageHeader.jsx) + [PageShortcuts](src/patterns/PageShortcuts.jsx), and add a menu entry in [MenuPanel](src/patterns/MenuPanel.jsx) (or a `SettingsCard` in [Settings](src/pages/Settings.jsx)).
- **Rich text field** — drop in [`RichNoteEditor`](src/molecules/RichNoteEditor.jsx); persist with [`richBody.js`](src/lib/richBody.js) (`serializeRichBody` / `parseRichBody`). Demo: menu → **Rich text demo**.
- **File attachments (Supabase Storage)** — run [`supabase/template_attachments.sql`](supabase/template_attachments.sql), then call [`attachmentsApi.js`](src/lib/attachmentsApi.js) (`uploadAttachment`, `listAttachments`, …) with your domain `parentId`. Paste/drop from the editor is forwarded via `onFiles` — do not embed binaries in the TipTap JSON. Full notes + lockbox encryption: [`tool/notas`](../../tree/tool/notas) `NoteEdit.jsx`.
- **Add a synced field** — add the key to `PREFS_OWNED_KEYS` in [prefs.js](src/lib/prefs.js), an `opSet*` in [userDataOps.js](src/lib/userDataOps.js), push from the provider via `applySyncOp`, and teach [PrefsSync](src/providers/PrefsSync.jsx) how to apply the remote value on pull. See the `theme` / `fontSize` / `fabCorner` triple as the pattern to copy.
- **Add a synced list or map** — add a new `jsonb` column on `user_data` (loopy has several), extend `normalizePrefsRow` / op factories in [supabaseSync.js](src/lib/supabaseSync.js) + [userDataOps.js](src/lib/userDataOps.js), and mirror it into a dedicated provider. For per-domain CAS tables, copy the domain-stream helpers from the loopy branch.
- **Add an E2EE vault** — run [`supabase/vault_meta.sql`](supabase/vault_meta.sql), wire [`vaultMetaApi.js`](src/lib/vaultMetaApi.js) into a VaultProvider (copy from Accesso), and ship meta export/restore via [`vaultMetaBackup.js`](src/lib/vaultMetaBackup.js). Keep ciphertext in domain tables (`ciphertext` + `iv`), not in prefs.
- **Capture URLs from the SW** — layer `chrome.webNavigation.onCompleted` on top of the [background.js](background.js) stub. Loopy's background.js is the reference for a full capture + Supabase sync loop with `chrome.alarms`-driven pushes.

References: [`tool/loopy`](../../tree/tool/loopy) (synced lists / capture), [`tool/notas`](../../tree/tool/notas) (RTE + Storage attachments + lockboxes), [`tool/accesso`](../../tree/tool/accesso) (vault E2EE + vault_meta).
