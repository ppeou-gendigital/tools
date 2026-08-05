---
type: component
name: text-link
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1332:54878"
status: published
composes:
  - icon
tokensConsumed:
  - --color-text-brand
  - --color-text-primary
  - --color-text-secondary
  - --color-text-inverse
  - --color-disabled-text
  - --color-border-focus
  - --font-family-primary
  - --font-weight-regular
  - --font-weight-medium
  - --font-weight-semibold
  - --font-weight-bold
  - --font-size-body-xs
  - --font-size-body-sm
  - --font-size-body-base
  - --font-size-body-lg
  - --font-size-body-xl
  - --font-size-body-2xl
  - --font-size-body-3xl
  - --lineheight-body-xs
  - --lineheight-body-sm
  - --lineheight-body-base
  - --lineheight-body-lg
  - --lineheight-body-xl
  - --lineheight-body-2xl
  - --lineheight-body-3xl
  - --border-width-default
  - --space-1
---

# Text Link

Inline text-based interactive element for navigating from body copy. Figma: [Text link master](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-54878&m=dev) (`1332:54878`). Spec Frame [`1332:54773`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-54773&m=dev).

## Summary

One `.c-text-link` BEM block. Background × Size × Weight (56 buildable); interaction states via CSS pseudo-classes. Optional icon slot composes `{{> icon}}`.

## Composes

Composes: icon.

## Variant axes

| Axis | Values |
|---|---|
| Background | `light`, `dark` |
| Size | `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl` |
| Weight | `regular`, `medium`, `semibold`, `bold` |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Label | text | `label` | yes | — | Plain text |
| 2 | Background | enum | `background` | no | `light` | |
| 3 | Size | enum | `size` | no | `base` | Body typography ramp |
| 4 | Weight | enum | `weight` | no | `regular` | |
| 5 | href | text | `href` | yes* | — | Omitted when disabled |
| 6 | target | text | `target` | no | — | `_blank` → noopener |
| 7 | Disabled | boolean | `disabled` | no | `false` | |
| 8 | icon treatment | enum | `iconTreatment` | no | `none` | `none` \| `external` \| `inline` |
| 9 | — | text | `iconName` | when inline | — | Catalog key |
| 10 | — | enum | `iconPosition` | no | `trailing` | |
| 11 | Aria label | text | `ariaLabel` | no | — | |

## Tokens consumed

**Type** — `--font-size-body-*` / `--lineheight-body-*` / `--font-weight-*` / `--font-family-primary`.

**Paint** — `--color-text-brand`, `--color-text-secondary` (visited light), `--color-text-inverse` (dark), `--color-disabled-text`, `--color-border-focus`, `--border-width-default`, `--space-1`.

See themes/default/ for resolved values.

## Responsive behaviour

Sizes are not breakpoint-responsive — pick the tier that matches surrounding copy.

## States

- Hover / focus-visible / active — CSS pseudo-classes
- Visited — `:visited` / gallery `.is-visited`
- Disabled — `aria-disabled="true"` + no `href`

## Accessibility

- Always an `<a>`; disabled keeps `role="link"` with `tabindex="-1"`
- Focus ring via `--color-border-focus`
- Icon decorative (`aria-hidden`)

## Design intent

Low-emphasis navigation inside running text — not a Button substitute.
