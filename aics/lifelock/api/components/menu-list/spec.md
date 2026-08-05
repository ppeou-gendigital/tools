---
type: component
name: menu-list
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1396:5517"
status: published
behavior: false
composes:
  - icon
tokensConsumed:
  - --color-text-primary
  - --color-text-disabled
  - --color-bg-subtle
  - --color-bg-muted
  - --color-bg-default
  - --color-border-subtle
  - --color-border-strong-alt
  - --color-border-focus
  - --color-neutral-60
  - --font-family-primary
  - --font-size-body-base
  - --font-size-body-sm
  - --lineheight-body-base
  - --lineheight-body-sm
  - --letterspacing-body-base
  - --letterspacing-body-sm
  - --font-weight-regular
  - --font-weight-semibold
  - --space-2
  - --space-3
  - --space-4
  - --border-width-xs
  - --border-width-s
---

# Menu List

Atomic menu row primitive. Figma: [Pattern / MenuList](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4298-1925&m=dev) (set `1396:5517`; Spec Frame `.Menu list · spec` `4646:265`).

## Summary

BEM root `.c-menu-list` covers Type = Row / Divider / Caption × Size = Large / Small. Rows compose optional leading / trailing / loading icons via the `icon` partial. Hover is CSS `:hover` (Figma Hover axis is design-review only). Selected is a persistent prop. Consumed by menu-block and other menu-family containers.

## Composes

Composes: icon (leading, trailing, loading slots).

## Variant axes

| Axis | Values |
|---|---|
| Type | `row`, `divider`, `caption` |
| Size | `large`, `small` |
| State | `default`, `selected` (row only) |
| Left icon | `true`, `false` |
| Right icon | `true`, `false` |
| Loading icon | `true`, `false` (overrides right icon visually) |
| Show right border | `true`, `false` |
| Show divider above | `true`, `false` |
| Edge padding | `true`, `false` (default `true`) |

Figma Hover axis is not a code prop — paint via `:hover`.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Type | VARIANT | `type` | no | `"row"` | `row` \| `divider` \| `caption` |
| 2 | Size | VARIANT | `size` | no | `"large"` | Large 40px / Small 38px |
| 3 | State | VARIANT | `selected` | no | `false` | Row-only |
| 4 | Left icon | BOOLEAN | `leftIcon` | no | `false` | |
| 5 | Right icon | BOOLEAN | `rightIcon` | no | `false` | |
| 6 | Loading icon | BOOLEAN | `loadingIcon` | no | `false` | Sets `aria-busy`; uses `actions/simple-reload` |
| 7 | Show right border | BOOLEAN | `showRightBorder` | no | `false` | Horizontal-strip chrome |
| 8 | Show divider above | BOOLEAN | `showDividerAbove` | no | `false` | |
| 9 | Edge padding | BOOLEAN | `edgePadding` | no | `true` | `--space-4` inline |
| 10 | Text | TEXT | `text` | no | `"Menu item"` | Ignored for Divider |
| 11 | — | catalog-key | `leftIconName` | no | `status/simple-checkmark` | |
| 12 | — | catalog-key | `rightIconName` | no | `arrows-navigation/simple-chevron-right` | |
| 13 | — | boolean | `disabled` | no | `false` | |
| 14 | — | enum | `selectionMode` | no | `"choice"` | `choice` → `aria-selected`; `page` → `aria-current="page"` |
| 15 | — | url | `href` | no | `""` | When set, control is `<a>` |

## Tokens consumed

**Color** — `--color-text-primary`, `--color-text-disabled`, `--color-bg-subtle` (hover), `--color-bg-muted` (selected), `--color-border-subtle`, `--color-border-strong-alt` (right border), `--color-border-focus`, `--color-neutral-60` (caption — Spec content-muted stand-in).

**Typography** — `--font-family-primary`; body-base (Large row) / body-sm (Small row + Caption); semibold Caption.

**Spacing / border** — `--space-2` (icon gap), `--space-3` (block pad), `--space-4` (edge pad), `--border-width-xs` / `--border-width-s`.

See this package's Design System token galleries and themes/default/ for resolved values.

## Responsive behaviour

Fluid inline size (100% of parent). Density (Large / Small) is switched by the host container — the row does not reflow on breakpoints. Small is below the 44×44 touch minimum and is desktop-oriented.

## States

- **Hover** — CSS `:hover` on `.c-menu-list__control`
- **Focus** — `:focus-visible` 2px outline offset 2px
- **Selected** — `.is-selected` + ARIA
- **Loading** — `.is-loading` + trailing spinner + `aria-busy`
- **Disabled** — `.is-disabled` + `aria-disabled` / native `disabled`

## Accessibility

- Role inherits from container guidance: default row `role="menuitem"`; Caption `role="presentation"`; Divider `role="separator"` + `aria-hidden`
- Keyboard navigation is owned by the containing menu-block (popup mode)
- Contrast: label vs surface ≥ 4.5:1
- Reduced motion pauses loading spinner rotation
- RTL: leading/trailing icon slots flip with logical properties

## Design intent

Single-action menu row. Do not pack multi-action controls into one row — use Card / Table for that. Captions and Dividers are non-interactive structure only.

## Notes & open questions

- Spec Notes: Small touch-target below 44px — designer confirm desktop-only restriction.
- Loading spinner uses `actions/simple-reload` (no dedicated spinner glyph in catalog yet).

## Figma source

- [Pattern / MenuList](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4298-1925&m=dev)
- [MenuList set `1396:5517`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1396-5517&m=dev)
- [Spec Frame `4646:265`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4646-265&m=dev)
