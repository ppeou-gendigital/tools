# Loopy

A Chrome browser extension. _(More details coming soon — this is an early scaffold.)_

- **Manifest**: V3
- **Stack**: Vanilla JS, no build step, no dependencies
- **Status**: Skeleton — the popup can inspect the active tab and that's it

---

## Load it in Chrome (development)

1. Open `chrome://extensions/`.
2. Turn on **Developer mode** (toggle, top right).
3. Click **Load unpacked** and pick this directory (`loopy/`).
4. "Loopy" appears in your toolbar. Pin it for convenience.

After code changes:

- **Popup / content changes** — close and reopen the popup (or press Cmd+R with the popup's DevTools open).
- **`manifest.json` / `background.js` changes** — click the reload icon on the Loopy card in `chrome://extensions/`.

Inspect what's happening:

- **Popup**: right-click the Loopy toolbar icon -> **Inspect popup**.
- **Service worker**: `chrome://extensions/` -> Loopy -> **Inspect views: service worker**.

---

## Structure

```
loopy/
├── manifest.json        # MV3 manifest
├── background.js        # service worker (event-driven, no DOM)
├── popup/
│   ├── popup.html       # toolbar popup UI
│   ├── popup.css
│   └── popup.js
├── README.md
├── LICENSE
└── .gitignore
```

Add later, as needed:

- `content.js` + a `content_scripts` entry in `manifest.json` — code that runs inside web pages.
- `options/` + `options_page` field — a full-page settings UI.
- `icons/` (16, 32, 48, 128 px PNGs) + `icons` / `action.default_icon` fields — until you add these, Chrome uses a default puzzle-piece icon.

---

## Permissions

The manifest currently declares:

- `activeTab` — grants access to the current tab's `url` / `title` when the user invokes the extension. No permission prompt.
- `storage` — for `chrome.storage.local` / `chrome.storage.sync`. No permission prompt.

Add new permissions to `manifest.json` -> `permissions` (or `host_permissions` for cross-origin fetches) as features land.

---

## This branch

`loopy` lives on the branch `tool/loopy` in the [`tools`](../tools) meta-repo. Do **not** merge this branch into `main` or any other project branch — see the meta-repo's README for the branch-per-project rules.
