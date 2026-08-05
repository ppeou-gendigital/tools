---
type: component
name: discount-label
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1408:443"
status: published
composes:
  - icon
tokensConsumed:
  - --color-bg-default
  - --color-bg-subtle
  - --color-bg-brand
  - --color-bg-brand-soft
  - --color-bg-accent
  - --color-bg-alpha
  - --color-bg-beta
  - --color-bg-gamma
  - --color-bg-delta
  - --color-bg-inverse
  - --color-bg-inverse-strong
  - --color-signal-success
  - --color-text-primary
  - --color-text-inverse
  - --border-radius-xl
  - --space-1
  - --space-3
  - --font-family-primary
  - --font-weight-semibold
  - --font-size-label
  - --lineheight-label
  - --letterspacing-label
---

# Discount Label

Compact pill for discount / promo metadata. Figma: [Pattern / DiscountLabel](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28415&m=dev) (set `1408:443`; Spec Frame `3024:48`).

## Summary

BEM root `.c-discount-label`. Axes: Background × Fill × Strength × Size. Typography is PRIMARY/Label/Emphasis (`--font-size-label` + `--font-weight-semibold`). Radius `--border-radius-xl`. Optional leading icon at 16×16 via Icon.

## Composes

Composes: icon.

## Variant axes

| Axis | Values |
|---|---|
| background | `primary`, `secondary`, `brand`, `brand-soft`, `accent`, `alpha`, `beta`, `gamma`, `delta`, `inverse-primary`, `inverse-secondary`, `success` |
| fill | `solid`, `transparent`, `tint` |
| strength | `base`, `30`, `50`, `80` |
| size | `small` |

Defaults: `background=primary`, `fill=solid`, `strength=base`, `size=small`. Solid always uses `strength=base`. Transparent / Tint use 30 / 50 / 80.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Background | enum | `background` | no | `primary` | Surface role |
| 2 | Fill | enum | `fill` | no | `solid` | Solid / Transparent / Tint |
| 3 | Strength | enum | `strength` | no | `base` | Opacity stop |
| 4 | Size | enum | `size` | no | `small` | Only Small published |
| 5 | — | plain-text | `text` | no | `label` | Pill copy |
| 6 | — | boolean | `showIcon` | no | `false` | Leading icon |
| 7 | — | catalog-key | `icon` | no | `actions/simple-add` | Icon catalog key |

## Tokens consumed

**Surface** — `--color-bg-*` role ladder + `--color-signal-success`.

**Ink** — `--color-text-primary` / `--color-text-inverse`.

**Type / space / radius** — label type tokens; `--space-1` / `--space-3`; `--border-radius-xl`.

See themes/default/ for resolved values.

## Responsive behaviour

Inline fit-content molecule. No breakpoint axis.

## States

Stateless — no hover / focus / pressed / disabled paints.

## Accessibility

- Root is a `<span>` (decorative metadata). Pair with surrounding copy that carries meaning.
- Leading icon is `aria-hidden` / decorative.

## Design intent

Discount label tags pricing / promo context. Prefer Badge for signal statuses (info / warning / error). Not a button or link.
