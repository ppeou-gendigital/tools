---
type: component
name: menu-block
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1396:4886"
status: published
subtype: pattern
librarySource: brand
composes:
  - menu-list
tokensConsumed:
  - --border-radius-l
  - --color-bg-default
  - --color-border-subtle
  - --shadow-menu-block
  - --space-0
behavior: true
---

# Menu Block

Slot-based vertical menu chrome that stacks N `menu-list` rows with optional shadow and keyline. Mirrors [Web-ODS Shared Library MenuBlock](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1396-4886&m=dev) (Spec Frame `.Menu block · spec` `4647:135`).

## Summary

Menu block is the container pattern for menus: a rounded surface (`--border-radius-l`) that holds a vertical list of `menu-list` items. Simple type mins at 144px width; With caption mins at 228px. Drop shadow uses `--shadow-menu-block`; keyline uses `--color-border-subtle`. Default / anchored usage is static SSR; popup mode opts into `initMenuBlocks` for trigger toggle, keyboard navigation, and menu ARIA.

## Composes

Composes: menu-list.

## Variant axes

| Axis | Values |
|---|---|
| Type | Simple, With caption |
| Size | Large, Small |
| Show drop shadow | true, false (default true) |
| Show keyline | true, false (default true) |
| Mode | static, popup (code-only; drives JS + role guidance) |

With caption expects a leading Caption `menu-list` item in the slot. Size must match child item sizes.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Type | enum | type | yes | simple | `simple` \| `with-caption` |
| 2 | Size | enum | size | yes | large | Passed through to child menu-list items |
| 3 | Menu items | array | items | no | — | Array of menu-list args; each rendered via `{{> menu-list}}` |
| 4 | — | html | slotHtml | no | — | Escape hatch raw HTML for the list body |
| 5 | Show drop shadow | boolean | showDropShadow | no | true | Applies `--shadow-menu-block` |
| 6 | Show keyline | boolean | showKeyline | no | true | 1px border |
| 7 | — | enum | mode | no | static | `static` \| `popup` |
| 8 | — | string | id | no | — | Required for popup (`aria-controls` target) |
| 9 | — | boolean | hidden | no | false | Initial hidden for popup |
| 10 | — | string | listRole | no | list / menu | `list` when static; `menu` when popup |
| 11 | — | string | className | no | — | Extra classes on root |

## Tokens consumed

**Structural** — `--border-radius-l`, `--space-0`.

**Surface** — `--color-bg-default`, `--color-border-subtle`, `--shadow-menu-block`.

See this package's Design System token galleries and themes/default/ for resolved values.

## Responsive behaviour

Width hugs content with min-width floors (Simple 144px, With caption 228px). Height grows with stacked items. No breakpoint axis — consumers place the block in popup overlays or static side panels.

## States

- **Static** — always visible; no JS.
- **Popup closed / open** — `hidden` attribute + `aria-expanded` on the trigger; managed by `initMenuBlocks` when `data-mode="popup"`.
- Child row hover / selected / disabled / loading — owned by `menu-list`.

## Accessibility

- Static: root list uses `role="list"` (or consumer override); rows use `role="listitem"`.
- Popup: root uses `role="menu"`; rows use `role="menuitem"`; trigger must expose `aria-controls`, `aria-haspopup="menu"`, and `aria-expanded`.
- Keyboard (popup): Arrow Up/Down, Home/End, Escape closes, Tab wraps within items; focus moves to first enabled row on open.
- Focus management restores to the trigger on close.

## Design intent

Provide one chrome wrapper for contextual menus and inline option lists so product surfaces share the same shadow, keyline, and size floors without re-implementing list chrome per feature.

## JavaScript API

### Init signature

| option | type | default | description |
|---|---|---|---|
| — | — | — | _No init options._ `initMenuBlock(root)` / `initMenuBlocks(scope)` discover triggers via `aria-controls` matching the block `id` or `data-menu-block-trigger`. |

### Instance shape

```ts
{
  open(): void;
  close(): void;
  destroy(): void;
}
```

### Events

| name | detail | when fired |
|---|---|---|
| `other brand:menu-block:open` | `{ root }` | Popup opens |
| `other brand:menu-block:close` | `{ root }` | Popup closes |
| `other brand:menu-block:select` | `{ root, item }` | Row activated (click / Enter / Space) |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `hidden` | presence | Closed popup |
| `data-mode` | `static` \| `popup` | Authoring mode |
| `aria-expanded` | `true` \| `false` | On the trigger while popup is managed |

### Keyboard

| key | behavior |
|---|---|
| ArrowDown / ArrowUp | Move focus among enabled menuitems |
| Home / End | First / last enabled item |
| Escape | Close popup; restore focus to trigger |
| Tab / Shift+Tab | Wrap within menu items |
| Enter / Space | Activate focused item (`other brand:menu-block:select`) |

### SSR fallback

Without JS, a popup block with `hidden` stays closed; static blocks render fully. Consumers can omit `hidden` for always-visible menus.

## Notes & open questions

- Sticky caption TBD and empty-state TBD from Spec Notes — Designer Follow-Ups, non-blocking.
- Small Size touch-target may be under 44px — Spec Notes; Designer Follow-Up.

## Figma source

- [MenuBlock set `1396:4886`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1396-4886&m=dev)
- [Spec Frame `4647:135`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4647-135&m=dev)
- [Pattern / MenuBlock page `539:28419`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28419&m=dev)
