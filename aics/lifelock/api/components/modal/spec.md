---
type: component
name: modal
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1344:18518"
status: published
subtype: pattern
librarySource: brand
composes:
  - button
  - icon
tokensConsumed:
  - --border-radius-dialog
  - --border-radius-s
  - --border-width-s
  - --color-bg-default
  - --color-bg-primary
  - --color-bg-subtle
  - --color-border-focus
  - --color-text-primary
  - --color-text-secondary
  - --font-family-primary
  - --font-size-h6
  - --font-size-body-base
  - --lineheight-h6
  - --lineheight-body-base
  - --letterspacing-h6
  - --letterspacing-body-base
  - --font-weight-bold
  - --font-weight-regular
  - --space-1
  - --space-3
  - --space-5
  - --space-7
behavior: true
---

# Modal

Interruptive dialog that blocks the page behind a 70% primary backdrop. Mirrors [Web-ODS Shared Library Modal](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1344-18518&m=dev) (Overview `1359:21341`).

## Summary

Modal presents a focused decision or acknowledgement. Three variants (Standard / Scrollable / Media) × three sizes (sm 320 / md 440 / lg 480). Footer follows the ODS single-primary rule: one Primary button plus an optional Text secondary. Close, Escape, and backdrop click dismiss. `initModals` provides focus trap and focus restore.

## Composes

Composes: button, icon.

## Variant axes

| Axis | Values |
|---|---|
| Variant | Standard, Scrollable, Media |
| Size | sm, md, lg |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Variant | enum | variant | yes | standard | `standard` \| `scrollable` \| `media` |
| 2 | Size | enum | size | yes | md | Card max-width 320 / 440 / 480 |
| 3 | — | string | title | no | Modal title | Header heading |
| 4 | — | string | body | no | — | Description paragraph |
| 5 | — | html | mediaHtml | no | — | Media variant slot |
| 6 | — | string | primaryLabel | no | Continue | Primary CTA |
| 7 | — | string | secondaryLabel | no | Cancel | Text secondary |
| 8 | — | boolean | showSecondary | no | true | |
| 9 | — | boolean | showClose | no | true | |
| 10 | — | boolean | open | no | false | Omits `hidden` when true |
| 11 | — | string | id | no | — | For `aria-controls` |
| 12 | — | string | className | no | — | |

## Tokens consumed

**Structural** — `--border-radius-dialog`, `--border-radius-s`, `--space-1`, `--space-3`, `--space-5`, `--space-7`.

**Surface** — `--color-bg-default`, `--color-bg-primary` (backdrop @ 70%), `--color-bg-subtle`, `--color-border-focus`.

**Typography** — `--font-family-primary`, `--font-size-h6`, `--font-size-body-base`, matching line-height / letter-spacing / weights; `--color-text-primary`, `--color-text-secondary`.

Card drop shadow uses Spec literal `0 8px 12px / 18%` (not `--shadow-default`).

## Responsive behaviour

Card is fluid up to the size max-width. Body scroll region on Scrollable caps height. Full-viewport fixed overlay; no breakpoint axis.

## States

- Closed (`hidden`) / open
- Focus trap while open
- Button hover/focus/active via composed Button CSS

## Accessibility

- `role="dialog"` + `aria-modal="true"` + labelledby/describedby
- Focus moves into the dialog on open; Tab wraps; Escape closes; focus returns to trigger
- Close control has accessible name

## Design intent

Block the page for a short, high-stakes decision. Prefer inline or sheets when background interaction must remain available.

## JavaScript API

### Init signature

| option | type | default | description |
|---|---|---|---|
| trigger | HTMLElement | auto | Override trigger discovery |
| initialFocus | HTMLElement | close / first focusable | Focus target on open |

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
| `lifelock:modal:open` | `{ root, source }` | Dialog opens |
| `lifelock:modal:close` | `{ root, source }` | Dialog closes |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `hidden` | presence | Closed |
| `aria-expanded` | true/false | On trigger |

### Keyboard

| key | behavior |
|---|---|
| Escape | Close |
| Tab / Shift+Tab | Trap focus inside card |

### SSR fallback

Without JS, an initially `open` modal stays visible; triggers do not toggle. Prefer progressive enhancement via `initModals`.

## Figma source

- [Modal set `1344:18518`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1344-18518&m=dev)
- [Modal — Overview `1359:21341`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1359-21341&m=dev)
- [Pattern / Modal page `539:28427`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28427&m=dev)
