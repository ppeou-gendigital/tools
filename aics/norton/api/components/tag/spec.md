---
type: component
name: tag
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "6114:53"
status: published
behavior: false
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
  - --color-text-primary
  - --color-text-inverse
  - --border-radius-s
  - --space-1
  - --space-3
  - --font-family-primary
  - --font-weight-medium
  - --font-size-body-base
  - --lineheight-body-base
  - --letterspacing-body-base
---

# Tag

Squarer-cornered feature / key-info pill with an optional leading icon.
Mirrors
[Tag set `6114:53`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=6114-53&m=dev)
on [Pattern / Tag `6109:6522`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=6109-6522&m=dev)
and Spec Frame
[`.Tag · spec` `6328:54273`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=6328-54273&m=dev).

## Summary

`.c-tag` is a presentation molecule. Axes: Background × Fill × Strength.
Typography PRIMARY/Body-base/Prominent. Corners `--border-radius-s`.
Leading icon defaults on (`objects/simple-device-vehicle` at 16×16).

## Composes

Composes: icon.

## Variant axes

| Axis | Values |
|---|---|
| background | `primary`, `secondary`, `brand`, `brand-soft` (Figma Brand-lighter), `accent`, `alpha`, `beta`, `gamma` (Figma Gamma-base), `delta`, `inverse-primary`, `inverse-secondary` |
| fill | `solid`, `transparent`, `tint` |
| strength | `base`, `30`, `50`, `80` — Solid always `base`; Transparent/Tint use 30/50/80 |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Background | VARIANT | `background` | no | `"primary"` | |
| 2 | Fill | VARIANT | `fill` | no | `"solid"` | |
| 3 | Strength | VARIANT | `strength` | no | `"base"` | |
| 4 | Show icon | BOOLEAN | `showIcon` | no | `true` | |
| 5 | — | TEXT | `iconName` | no | `objects/simple-device-vehicle` | |
| 6 | — | TEXT | `text` | no | `"Tag"` | |

## Tokens consumed

**Surfaces** — `--color-bg-*` role ladder via color-mix for transparent/tint.

**Ink** — `--color-text-primary` / `--color-text-inverse`.

**Structural** — `--border-radius-s`, `--space-1`, `--space-3`, body-base type tokens, `--font-weight-medium`.

See this package's Design System token galleries and themes/default/ for resolved values.

## Responsive behaviour

Intrinsic hug content. No breakpoint axis.

## States

Presentation-only. No hover/focus/disabled paints on the published set.

## Accessibility

- Root is a `<span>` (non-interactive label).
- Leading icon is decorative (`decorative=true`).

## Design intent

Call out a feature or key info beside body copy. Distinct from Discount
label (promo) by radius-s + body-base/prominent + default icon.

## Figma source

- [Pattern / Tag page `6109:6522`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=6109-6522&m=dev)
- [Tag set `6114:53`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=6114-53&m=dev)
- [Spec Frame `6328:54273`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=6328-54273&m=dev)
