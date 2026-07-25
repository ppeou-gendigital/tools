# Shared packages (`@tools/*`)

Source of truth for the tools family UI framework. Authored on `template/base`, then synced into each `tool/*` branch.

| Package | Role |
|---------|------|
| [`@tools/ui`](./ui) | Tokens, `ui-*` CSS classes, presentational React (Button, Card, Modal, …) |
| [`@tools/behavioral`](./behavioral) | Slot/config shells (AppShell, FloatingMenu, MenuPanel, AuthGate, …) |
| [`@tools/service`](./service) | Auth + prefs providers (`appId`, injectable sync) |

## App usage

```js
import '@tools/ui/css'
import '@tools/behavioral/css'
import { Button, Logo } from '@tools/ui'
import { AppShell, FloatingMenu, MenuPanel } from '@tools/behavioral'
import { ThemeProvider, AuthProvider } from '@tools/service'
```

Each tool depends via:

```json
"@tools/ui": "file:./packages/ui",
"@tools/behavioral": "file:./packages/behavioral",
"@tools/service": "file:./packages/service"
```

## Sync into a tool branch

From a `tool/*` worktree (after packages land on `template/base`):

```bash
# example: copy packages from the template worktree
rsync -a --delete ../template-base/packages/ ./packages/
npm install
```

Then swap imports (or keep thin re-export shims as in `template/base`) and delete local duplicates when ready.

## Branding

Override FAB / logo color in the app:

```scss
:root {
  --fab-bg: #d946ef;
  --fab-bg-hover: #c026d3;
}
```

## AppShell FAB clearance

Default: no bottom padding under main. Only Viaggio should pass `fabClearance` on `<AppShell>` (see `@tools/behavioral` README).
