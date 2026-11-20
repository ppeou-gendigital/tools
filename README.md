# AEM Jump

Chrome extension (Manifest V3) that reads the current AEM author URL and lists
every useful destination for it: editor, preview, disabled mode, consoles,
page management, components/templates, and developer tools.

Built with React (plain JavaScript), Mantine, and Vite via
`@crxjs/vite-plugin`.

The popup uses a tight single-column layout: 300px wide and sized to its
content up to Chrome's 600px popup maximum (the toolbar and footer stick while
the document scrolls):

- search/filter (`/` to focus, `Esc` to clear)
- collapsible groups, persisted in `chrome.storage.local`
- drag groups by the handle in each header to reorder them; the order is
  persisted in `chrome.storage.local` as `aemJump.groupOrder` and reordering
  is paused while a filter is active
- pinnable links, persisted in `chrome.storage.local`
- Tabler icons and tooltips for every destination
- disabled destinations stay in place with a reason on hover
- single-key shortcuts for common destinations (`E` edit, `P` properties,
  `D` disabled, `C` CRX/DE, `S` sites, `A` assets, and more in tooltips)
- paste an AEM author URL when the current tab is a publish, preview, or
  non-AEM page
- theme switcher with four modes (light, dark, system, sunrise/sunset),
  persisted in `chrome.storage.local` as `aemJump.colorScheme`
  - `system` follows the OS `prefers-color-scheme` and updates live
  - `sunrise/sunset` uses light from 06:00–18:00 local time and dark otherwise,
    rechecked every minute
- arrow-key navigation across available links, `F` to pin/unpin

## Develop

```bash
npm install
npm run icons     # regenerate public/icons PNGs
npm run dev       # Vite dev server with extension HMR
npm test          # node:test table tests for the URL engine
npm run build     # production build into dist/
```

Load `dist/` via **chrome://extensions → Developer mode → Load unpacked**.
The popup is fixed at Chrome's maximum size, 800×600.

Preview the popup UI in a normal tab by serving `dist/` and opening
`popup.html?url=<encoded AEM URL>` (the Chrome API check is bypassed in that case).

```bash
python3 -m http.server 4173 --directory dist
# http://localhost:4173/popup.html?url=https%3A%2F%2Fauthor.example.com%2Feditor.html%2Fcontent%2Fmysite%2Fus%2Fen%2Fpage.html
```

## Adding a rewrite

Rules live in `src/lib/aem/rules.js`. A rule is:

```js
{
  id: 'myLink',            // unique
  group: 'page',           // must exist in groups.js
  label: 'My link',
  icon: 'pencil',          // key from icons.js
  shortcut: 'm',           // optional single letter, must be unique
  description: 'Optional subtitle',
  reason: (ctx) => 'Why this link is unavailable', // optional
  build: (ctx) => (ctx.hasResource ? `${ctx.origin}${ctx.path}.html` : null),
}
```

- Array position in `rules.js` is the order inside its group.
- Array position in `groups.js` is the group order.
- `build` returns `href` or `null`; `null` means "not applicable to this URL".
  The rule still renders, as a disabled button, so groups and link placement
  stay stable across URLs.
- `disabledReason` shown in the tooltip comes from `reason(ctx)` when provided,
  otherwise from the generic DAM/non-AEM fallbacks in `registry.js`.
- `shortcut` letters are shown in tooltips, exposed as `aria-keyshortcuts`,
  and validated for uniqueness at load time.
- No sorting, no `order` field — position is the data.

## Layout

```
src/lib/aem/
  parse.js      URL -> facts (traditional, AEM Cloud, Universal Editor)
  context.js    derived fields used by rules (path, item, q, disableQ, ...)
  guards.js     shared applicability checks
  groups.js     ordered groups
  rules.js      ordered rule registry (label, icon, shortcut, reason)
  icons.js      rule icon name -> Tabler component
  order.js      pure group reorder helpers (drag result -> stored order)
  registry.js   pure buildAemLinkGroups(url) -> { parsed, groups }
src/components/
  GroupCard.jsx collapsible group card
  LinkRow.jsx   icon-only link button, pin star, tooltip metadata
src/hooks/
  useChromeStorage.js  persisted UI state with a dev fallback
src/App.jsx     popup shell (chrome.tabs, search, favorites, keyboard)
src/theme.js    dense Mantine theme (orange accent, compact type)
src/styles.css  popup sizing and icon-grid/card styles
```
