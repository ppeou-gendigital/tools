---
type: component
name: sheet
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "539:28430"
status: published
behavior: true
composes:
  - button
  - icon
tokensConsumed:
  - --color-bg-primary
  - --color-bg-inverse
  - --color-text-primary
  - --color-text-secondary
  - --color-text-accent
  - --color-border-subtle
  - --color-border-focus
  - --border-radius-l
  - --border-radius-s
  - --border-radius-pill
  - --border-width-s
  - --space-1
  - --space-2
  - --space-3
  - --space-5
  - --space-7
  - --font-family-primary
  - --font-size-h6
  - --lineheight-h6
  - --letterspacing-h6
  - --font-weight-semibold
  - --font-size-body-base
  - --lineheight-body-base
  - --letterspacing-body-base
  - --font-size-body-sm
  - --lineheight-body-sm
  - --font-weight-regular
---

# Sheet

Edge sheet and bottom drawer pattern. Mirrors
[Pattern / Sheets + Drawer](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28430&m=dev)
(`539:28430`) and Spec Frame
[`.Sheet · spec`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4522-67&m=dev)
(`4522:67`). Bottom layout is the Drawer; one BEM root `.c-sheet`.

## Summary

Sheet presents secondary tasks (filters, details, confirmations) as a
panel docked to the left, right, or bottom edge. Modal mode paints an
inverse backdrop at 75% opacity, traps focus, and dismisses on Escape /
backdrop / close. Non-modal mode omits the backdrop and pointer-events
chrome so the page remains interactive beside the panel.

## Composes

Composes: button, icon.

## Variant axes

| Axis | Values |
|---|---|
| Layout | `left` / `right` / `bottom` (drawer) |
| Mode | `modal` / `non-modal` |
| Size | `compact` / `medium` / `large` |
| CTA | `two` / `one` / `none` |
| Button layout | `inline` / `stacked` — **bottom only** |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Layout | Enum | `layout` | yes | `"left"` | |
| 2 | Mode | Enum | `mode` | yes | `"modal"` | |
| 3 | Size | Enum | `size` | yes | `"compact"` | Side: 280/360/480. Bottom max-width 360/600/1200 |
| 4 | CTA | Enum | `cta` | yes | `"two"` | |
| 5 | Button layout | Enum | `buttonLayout` | no | `"inline"` | Bottom only |
| 6 | Title | String | `title` | no | `"Sheet title"` | |
| 7 | Body | String | `body` | no | — | Or `bodyHtml` |
| 8 | Supporting text | String | `supportingText` | no | `""` | |
| 9 | Primary | String | `primaryLabel` | no | `"Apply"` | |
| 10 | Secondary | String | `secondaryLabel` | no | `"Cancel"` | When CTA=two |
| 11 | — | Boolean | `open` | no | `false` | Code |
| 12 | — | String | `id` | yes for triggers | — | Code |

## Tokens consumed

**Surface** — `--color-bg-primary` (card), `--color-bg-inverse` at 75%
(modal backdrop via `color-mix`).

**Structural** — `--border-radius-l` (open-edge rounding), `--space-5` /
`--space-7` gaps/padding, shadow literal `0 8px 24px / 18%`.

**Typography / chrome** — H6 title, body-base description, accent close
icon, focus ring `--color-border-focus`.

See themes/default/ for resolved values.

## Responsive behaviour

Side sheets stretch full viewport block-size; bottom sheets cap height
with `min(90dvh, …)`. Consumer owns page placement; the unit is
`position: fixed` when open.

## States

- Open / closed via `hidden` + JS `open()` / `close()`.
- Modal: Escape, backdrop click, close button.
- Non-modal: Escape + close button; no backdrop dismiss.

## Accessibility

- `role="dialog"`; `aria-modal="true"` only in modal mode.
- Focus trap + restore focus in modal mode (same contract as Modal).
- Close control labelled; title wired via `aria-labelledby`.

## Design intent

One pattern for side sheets and bottom drawers so brands share one
implementation. Native mobile sheet gestures are out of scope for v1;
optional drag-handle markup is presentational only.

## JavaScript API

### Init signature

| option | type | default | description |
|---|---|---|---|
| `trigger` | `HTMLElement \| null` | auto via `aria-controls` | |
| `initialFocus` | `HTMLElement \| null` | close or first focusable | |

### Instance shape

```ts
type SheetInstance = {
  open(source?: string): void;
  close(source?: string): void;
  destroy(): void;
};
function initSheet(root: HTMLElement, options?: object): SheetInstance | null;
function initSheets(scope?: ParentNode): SheetInstance[];
```

### Events

| name | detail | when fired |
|---|---|---|
| `lifelock:sheet:open` | `{ source, root }` | After open |
| `lifelock:sheet:close` | `{ source, root }` | After close |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `hidden` | present / absent | Closed / open |
| `data-mode` | `modal` \| `non-modal` | Authored |
| `aria-expanded` on trigger | `true` \| `false` | JS |

### Keyboard

| key | behavior |
|---|---|
| `Escape` | Close |
| `Tab` / `Shift+Tab` | Focus trap (modal) |

### SSR fallback

Markup renders closed (`hidden`) or open; without JS, triggers do not
toggle and focus trap does not run.

## Figma source

- Page: [`539:28430`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28430&m=dev)
- Spec: [`4522:67`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4522-67&m=dev)
- Boards: Left `1336:16314`, Right `1336:16412`, Bottom `1336:16510`
