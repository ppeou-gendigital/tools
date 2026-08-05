---
type: component
name: toggle
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1336:15559"
status: published
behavior: true
composes:
  - discount-label
tokensConsumed:
  - --space-2
  - --space-3
  - --space-4
  - --space-5
  - --space-7
  - --space-8
  - --border-width-xs
  - --border-width-s
  - --border-radius-s
  - --border-radius-l
  - --border-radius-pill
  - --color-text-primary
  - --color-text-secondary
  - --color-text-inverse
  - --color-bg-default
  - --color-bg-subtle
  - --color-bg-brand
  - --color-border-subtle
  - --color-border-strong
  - --color-border-focus
  - --color-signal-info
  - --button-primary-bg-default
  - --button-primary-content-default
  - --font-family-primary
  - --font-size-body-base
  - --font-weight-regular
  - --font-weight-medium
  - --font-weight-semibold
---

# Toggle

Three sibling control Types for binary or two-option choice. Distinct from Switch.
Mirrors [Pattern / Toggle `539:28414`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28414&m=dev)
and Spec [`.Toggle · spec` `4588:132`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4588-132&m=dev).

## Summary

`.c-toggle` Type=`link` (labels + track), `segmented` (bordered primary segment), `pill` (capsule with optional discount-label). `initToggle` emits `other brand:toggle:change`.

## Composes

Composes: discount-label (Pill only).

## Variant axes

| Axis | Values |
|---|---|
| type | `link`, `segmented`, `pill` |
| selected | Link: `off`\|`on`; Segmented/Pill: `a`\|`b` |
| state | `default`, `hover`, `pressed`, `focus`, `disabled` (gallery) |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Type | VARIANT | `type` | no | `"link"` | |
| 2 | Selected | VARIANT | `selected` | no | `"off"` / `"a"` | |
| 3 | — | TEXT | `labelA` / `labelB` | no | Off/On etc. | |
| 4 | Discount Label | BOOLEAN | `showDiscountLabel` | no | `true` | Pill |
| 5 | — | TEXT | `discountText` | no | `"Save 40%"` | Pill |
| 6 | — | boolean | `disabled` | no | `false` | |

## Tokens consumed

Button primary aliases for Segmented selected; track/pill surfaces; focus ring.

## Responsive behaviour

Inline flex; no breakpoint axis.

## States

- Selected via `data-selected` + `.is-selected` / `aria-pressed` / `aria-checked`
- Hover/focus/pressed via CSS + optional `data-state`
- Disabled via `.is-disabled`

## Accessibility

- Link: `aria-pressed` on control button
- Segmented/Pill: `role="radiogroup"` + `role="radio"`; arrow keys move selection

## Design intent

Choose between two peer options (plans, billing cadence) — not a form switch for settings (use Switch).

## JavaScript API

### Init signature

| option | type | default | description |
|---|---|---|---|
| selected | string | from `data-selected` | Initial value |
| onChange | function | — | Callback |

### Instance shape

```ts
{
  setSelected(value: string): void;
  getSelected(): string;
  destroy(): void;
}
```

### Events

| name | detail | when fired |
|---|---|---|
| `other brand:toggle:change` | `{ selected, root, source }` | Selection changes |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `data-selected` | off/on or a/b | After change |
| `aria-pressed` / `aria-checked` | true/false | On controls |

### Keyboard

| key | behavior |
|---|---|
| Space / Enter | Toggle link |
| Arrow keys | Move segmented/pill selection |

### SSR fallback

Static selected paint works without JS; clicks do not update without `initToggle`.

## Figma source

- [Pattern / Toggle `539:28414`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28414&m=dev)
- [`.Toggle · spec` `4588:132`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4588-132&m=dev)
