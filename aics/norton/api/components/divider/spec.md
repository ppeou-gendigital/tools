---
type: component
name: divider
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "539:28432"
status: published
composes: []
tokensConsumed:
  - --color-border-strong
  - --color-border-inverse
  - --color-text-secondary
  - --color-text-inverse
  - --border-width-xs
  - --border-width-s
  - --border-width-m
  - --space-3
  - --font-family-primary
  - --font-weight-regular
  - --font-weight-medium
  - --font-weight-semibold
  - --font-weight-bold
  - --font-size-body-sm
  - --font-size-body-base
  - --font-size-body-lg
  - --font-size-h5
  - --font-size-h6
  - --lineheight-body-sm
  - --lineheight-body-base
  - --lineheight-body-lg
  - --lineheight-h5
  - --lineheight-h6
  - --letterspacing-body-sm
  - --letterspacing-body-base
  - --letterspacing-body-lg
  - --letterspacing-h5
  - --letterspacing-h6
---

# Divider

Visual rule molecule for separating sections of content. Mirrors the
master variant sets on
[Web-ODS-Shared-Library / 539:28432](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28432&m=dev) —
the Dividers page hosts three sibling published variant sets
(`Divider / Horizontal`, `Divider / Vertical`, `Divider / Label`)
totalling 80 buildable variants. The three Figma sibling sets fold
onto **one** `.c-divider` BEM block via a single orthogonal `layout`
axis.

## Summary

`Molecules/Divider` is the default theme content-separation primitive.
The `horizontal` variant paints a full-width horizontal rule; the
`vertical` variant paints an inline rule sized to its parent's cross
axis; the `label` variant paints a horizontal rule with centred text
breaking the line. Four sizes (`xs` / `s` / `m` / `l`) ladder the
rule weight from 1 px to 4 px; the boolean `inverse` axis swaps rule
(and label) paint for dark surfaces. The `label` variant adds a
`typography` axis among eight Shared Library roles.

Outer padding around the rule is **owned by consumers** — the unit
does not invent vertical pad to match Figma demo frames (`space-3` /
`space-2` on horizontal/label demos; vertical demo 80×80).

## Composes

Composes: none.

## Variant axes

| Axis | Values |
|---|---|
| `layout` | `horizontal` (default) / `vertical` / `label`. Drives `.c-divider--<layout>`. Folds Figma's three sibling sets onto one axis. |
| `size` | `xs` (1 px → `--border-width-xs`) / `s` (default, 2 px → `--border-width-s`) / `m` (3 px literal — no contract step) / `l` (4 px → `--border-width-m`, not `--border-width-l` = 6 px). Drives `.c-divider--<size>`. |
| `inverse` | `false` (default — `--color-border-strong` / `--color-text-secondary`) / `true` (`--color-border-inverse` / `--color-text-inverse`). Drives `.c-divider--inverse`. |
| `typography` | `body-sm-regular` (default) / `body-sm-bold` / `body-base-regular` / `body-base-semibold` / `body-lg-regular` / `body-lg-bold` / `h6-medium` / `h5-bold`. Drives `.c-divider--<typography>`. Combinatorial only when `layout=label`. |

Canonical Figma master ships **80 variants** (8 + 8 + 64). Non-label
layouts ignore `typography`.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Layout | VARIANT | `layout` | no | `"horizontal"` | One of `horizontal` / `vertical` / `label`. |
| 2 | Size | VARIANT | `size` | no | `"s"` | One of `xs` / `s` / `m` / `l`. `m` uses literal `3px`. |
| 3 | Inverse | VARIANT | `inverse` | no | `false` | Boolean. |
| 4 | Typography | VARIANT | `typography` | no (when `layout = label`) | `"body-sm-regular"` | Figma `body-sm-bold` maps to `--font-weight-bold` (700). Combinatorial only for `layout=label`. |
| 5 | Label | TEXT | `label` | yes (when `layout = label`) | `"Or"` | Text inside `.c-divider__label`. |
| — | — | String | `accessibleLabel` | no | `""` | Optional `aria-label` on the root. |

## Tokens consumed

**Structural** — rule width via `--border-width-xs` (`xs`),
`--border-width-s` (`s`), literal `3px` (`m`), or `--border-width-m`
(`l`). Horizontal paints `border-block-start` on a block root;
vertical paints `border-inline-start` on an inline-block root;
label paints two `.c-divider__rule` flex children with
`gap: var(--space-3)`.

**Color** — rule: `--color-border-strong` (Figma `Color/Border/primary`
`#2f303c`) / `--color-border-inverse`. Label text:
`--color-text-secondary` / `--color-text-inverse` when inverse.

**Typography (label only)** — `--font-family-primary` plus per-axis
size / line-height / letter-spacing / weight from the default theme
ramp. See `themes/default/_tokens.scss` and
`_colors.scss` / `_borders.scss`.

| Typography | Font size | Line height | Letter spacing | Font weight |
|---|---|---|---|---|
| `body-sm-regular` (default) | `--font-size-body-sm` | `--lineheight-body-sm` | `--letterspacing-body-sm` | `--font-weight-regular` |
| `body-sm-bold` | `--font-size-body-sm` | `--lineheight-body-sm` | `--letterspacing-body-sm` | `--font-weight-bold` |
| `body-base-regular` | `--font-size-body-base` | `--lineheight-body-base` | `--letterspacing-body-base` | `--font-weight-regular` |
| `body-base-semibold` | `--font-size-body-base` | `--lineheight-body-base` | `--letterspacing-body-base` | `--font-weight-semibold` |
| `body-lg-regular` | `--font-size-body-lg` | `--lineheight-body-lg` | `--letterspacing-body-lg` | `--font-weight-regular` |
| `body-lg-bold` | `--font-size-body-lg` | `--lineheight-body-lg` | `--letterspacing-body-lg` | `--font-weight-bold` |
| `h6-medium` | `--font-size-h6` | `--lineheight-h6` | `--letterspacing-h6` | `--font-weight-medium` |
| `h5-bold` | `--font-size-h5` | `--lineheight-h5` | `--letterspacing-h5` | `--font-weight-bold` |

## Responsive behaviour

`horizontal` and `label` use `inline-size: 100%`. `vertical` uses
`block-size: 100%` inside a parent that establishes cross-axis size
(flex `align-items: stretch` or explicit `block-size`). No
per-breakpoint layout/size axis. Logical border properties keep RTL
safe. Label typography inherits the theme ramp's breakpoint switch
via `var(…)` with no unit-local media queries.

## States

| State | Mechanism | Notes |
|---|---|---|
| `default` | absence of any pseudo-class / runtime class | The only paint state. |

Divider is **stateless** — presentation-only.

## Accessibility

- Root carries `role="separator"` and `aria-orientation` matching
  layout (`horizontal` for horizontal/label; `vertical` for vertical).
- `layout=label` — visible label text is the accessible name; optional
  `accessibleLabel` overrides.
- Contrast: default rule (`--color-border-strong` `#2f303c`) clears
  WCAG 1.4.11 3:1 on light surfaces; inverse white clears 3:1 on dark
  surfaces.
- Non-interactive — no focus ring.

## Design intent

One molecule for thin visual rules between sections — horizontal,
vertical, or labelled — without growing a color or stroke axis.
Consumers own surrounding spacing. Deliberate non-goals: interaction,
brand/signal color axis, dashed/dotted stroke.

## Figma source

- Horizontal set [`1344:2031`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1344-2031&m=dev) — Size × Inverse (8).
- Vertical set [`1344:2052`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1344-2052&m=dev) — Size × Inverse (8).
- Label set [`1344:2073`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1344-2073&m=dev) — Size × Inverse × Typography (64).
- Page canvas [`539:28432`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28432&m=dev).
- Spec Frame instance [`3165:121`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3165-121&m=dev).

## Notes & open questions

- **3 px (`size = m`) is a token gap.** Core border ladder is
  `xs=1 / s=2 / m=4 / l=6`. Figma Size=m is 3 px — shipped as a
  literal. Designer follow-up: add a 3 px contract step or drop `m`
  from the axis.
- **Typography is label-only.** Modifier may render on every layout
  for BEM uniformity; only `.c-divider--label` consumes it.
- **Vertical sizing** requires a sized parent (see Responsive behaviour).
- **No dashed/dotted** stroke — Figma ships solid only.
- **Label alignment** is centre-only (matches Figma).
