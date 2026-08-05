---
type: component
name: breadcrumb
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1260:8373"
status: published
behavior: false
composes:
  - text-link
  - icon
tokensConsumed:
  - --space-1
  - --space-2
  - --space-3
  - --color-text-brand
  - --color-text-primary
  - --color-disabled-text
  - --color-border-focus
  - --font-family-primary
  - --font-size-body-sm
  - --lineheight-body-sm
  - --letterspacing-body-sm
  - --font-weight-bold
  - --border-radius-control
---

# Breadcrumb

Semantic wayfinding trail. Spec Frame [`.Breadcrumb · spec`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4560-48&m=dev) (`4560:48`) on page [`539:28420`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28420&m=dev). Visual set [`1260:8373`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1260-8373&m=dev).

## Summary

One `.c-breadcrumb` BEM block. `<nav><ol>` with composed text-link ancestors, chevron separators, optional home icon, and a static ellipsis when collapsed. No JS.

## Composes

Composes: text-link, icon.

## Variant axes

| Axis | Values |
|---|---|
| Collapsed | `false` (default), `true` — middle crumbs → static `…`; SM dual-list forces compact below 768px |

Booleans (not Figma axes): `firstAsIcon` (default `true`), `showCurrentPage` (default `true`). Truncation is per-item (`items[].truncate`), not a root axis.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Collapsed | boolean | `collapsed` | no | `false` | first + … + last |
| 2 | First as icon | boolean | `firstAsIcon` | no | `true` | Home via `objects/simple-home` |
| 3 | Show current page | boolean | `showCurrentPage` | no | `true` | Terminal Bold `aria-current="page"` |
| 4 | Items | array | `items` | yes | — | `{ label, href?, truncate?, ariaLabel? }[]` |
| 5 | Aria label | text | `ariaLabel` | no | `Breadcrumb` | On `<nav>` |

## Tokens consumed

**Structure** — `--space-3` list gap; `--space-1` / `--space-2` padding; `--bc-truncate-max: 16ch` (component custom property).

**Type / paint** — body-sm ramp, `--font-weight-bold` current, `--color-text-brand` home, `--color-disabled-text` separators, `--color-border-focus`.

## Responsive behaviour

Below 768px, dual-list hosts swap to the compact trail (first + … + last) regardless of `collapsed`. Prefer passing `collapsed=true` from the host on SM for a single DOM list.

## States

Interaction states live on composed text-link / home anchor. Ellipsis is static (title + aria-label only).

## Accessibility

- `<nav aria-label>` + ordered list
- Current page: `<span aria-current="page">` (never a link)
- Separators `aria-hidden`; chevron flips in RTL
- Collapsed ellipsis exposes hidden labels via `title` / `aria-label`

## Design intent

Wayfinding only — not a menu. No expandable / popover collapsed crumbs.
