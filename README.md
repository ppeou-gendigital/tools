# jira-capacity

A Chrome extension **and** web app in one codebase. React (ES6, no TypeScript) + Vite + SCSS modules, with light/dark theming. Local-only — no login or remote database.

This is the **template** branch. Full-featured reference implementation: see the [`tool/loopy`](../../tree/tool/loopy) branch.

- **Manifest**: V3
- **UI**: React 19, hand-rolled components in SCSS Modules, Lucide icons
- **Storage**: `chrome.storage.local` (extension) / `localStorage` (web) for UI prefs
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
2. Follow [TEMPLATE.md](TEMPLATE.md) for the remaining one-time steps (icon replacement, optional Pages deploy).

---

## Quick start

1. Install:
   ```bash
   npm install
   ```
2. Run one (or both):
   - **Web (dev server, hot reload)**: `npm run dev` → open the printed URL.
   - **Extension (watch build)**: `npm run dev:ext` → then load `dist/` unpacked in Chrome (see below).

No `.env` file is required.

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
jira-capacity/
├── manifest.json               # MV3 manifest
├── background.js               # MV3 service worker (minimal stub)
├── index.html                  # web entry
├── popup.html                  # extension popup entry (400x600 body)
├── vite.config.js              # single Vite config, mode = web | extension
├── src/
│   ├── main.jsx                # bootstraps React into #root
│   ├── App.jsx                 # providers + tiny in-memory router
│   ├── env.js                  # isExtension(), APP_VERSION
│   ├── lib/
│   │   ├── storage.js          # chrome.storage.local <-> localStorage
│   │   ├── cx.js               # className concatenator
│   │   ├── queryClient.js      # React Query client
│   │   ├── queryPersister.js   # Async storage persister
│   │   └── prefs.js            # normalizers for theme / font / FAB prefs
│   ├── providers/
│   │   ├── ThemeProvider.jsx   # light | dark | system (local)
│   │   ├── FontSizeProvider.jsx
│   │   ├── FabCornerProvider.jsx
│   │   └── NavigationProvider.jsx  # in-memory router (no react-router)
│   ├── molecules/              # Button, Input, Label, Logo, IconButton, …
│   ├── patterns/               # Card, MenuPanel, PageHeader, PageShortcuts, …
│   ├── blocks/                 # Deck, FloatingMenu
│   ├── templates/AppShell.jsx  # scrollable main + FloatingMenu FAB
│   ├── pages/                  # Home, Settings, DeckDemo, RichTextDemo
│   ├── hooks/useCornerDrag.js  # FAB grid-drag + snap (re-export)
│   └── tokens/
├── packages/                   # @tools/ui, @tools/behavioral, @tools/service
├── scripts/
│   ├── generate-icons.mjs
│   └── init-tool.mjs
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

- `popup.html` → `data-surface="popup"` → `html { width: min(100dvw, 400px); height: min(100dvh, 600px) }`
- `index.html` → `data-surface="web"` → `html { width: 100dvw; height: 100dvh }`

Pages own their own reading inset via `.is-fluid-width` / `.is-static-width` wrappers or a `padding` on the page's root element. `.main` never sets `max-width` or `margin: 0 auto`.

---

## Layout primitives

- **`AppShell`** ([src/templates/AppShell.jsx](src/templates/AppShell.jsx)) — grid header/main/footer that fills its parent.
- **`FloatingMenu`** ([src/blocks/FloatingMenu.jsx](src/blocks/FloatingMenu.jsx)) — draggable FAB that snaps to a responsive grid cell (`col:row` in XL space). Position is persisted via `FabCornerProvider`. Uses the [`useCornerDrag`](src/hooks/useCornerDrag.js) hook.
- **`MenuPanel`** ([src/patterns/MenuPanel.jsx](src/patterns/MenuPanel.jsx)) — the popover the FAB opens. Composes `AppearanceRow` (theme + font size), `AccountRow` (settings), `AppNavItems`, `AboutRow`. Extend destinations in [AppNavItems](src/patterns/AppNavItems.jsx).
- **`Deck`** + **`Slide`** ([src/blocks/Deck.jsx](src/blocks/Deck.jsx)) — horizontal, snap-scrolling deck container. See [`DeckDemo`](src/pages/DeckDemo.jsx).
- **`RichNoteEditor`** ([src/molecules/RichNoteEditor.jsx](src/molecules/RichNoteEditor.jsx)) — TipTap text RTE; files via `onFiles` (local preview). Demo: [`RichTextDemo`](src/pages/RichTextDemo.jsx).

---

## Permissions

The manifest declares:

- `storage` — for `chrome.storage.local` (prefs, navigation, React Query cache).

Add more as your tool needs them (`activeTab`, `tabs`, `scripting`, `webNavigation`, `alarms`, etc.) in [manifest.json](manifest.json).

---

## CI / GitHub Pages

Branch naming drives the live path. After `npm run init -- --name jira-capacity`:

| | |
| --- | --- |
| Branch | `tool/jira-capacity` |
| Vite `base` / `outDir` | `/tools/jira-capacity/` · `dist-web/jira-capacity` |
| Live URL | `https://<user>.github.io/tools/jira-capacity/` |

- **Workflow**: [`.github/workflows/deploy-jira-capacity-pages.yml`](.github/workflows/deploy-jira-capacity-pages.yml) (if present)
- **Trigger**: push to `tool/jira-capacity` (or manual `workflow_dispatch`)
- **Build**: `npm run build:web` → `dist-web/jira-capacity/`
- **Repo Pages settings**: Settings → Pages → Source = **GitHub Actions**

### Install as a PWA (web build only)

The web deploy is an installable Progressive Web App (manifest + service worker for the app shell). The Chrome extension build is unchanged and is not a PWA.

- **iPhone / iPad**: Safari → Share → **Add to Home Screen**.
- **Desktop Chrome / Edge**: address-bar install icon or Install app menu.
- **Updates:** [`src/pwaRegister.js`](src/pwaRegister.js) checks for a new service worker on app focus / visibility and reloads automatically (`registerType: 'autoUpdate'`).
- **iOS layout:** keep the viewport meta **without** `viewport-fit=cover` (see comment in [`index.html`](index.html)).
