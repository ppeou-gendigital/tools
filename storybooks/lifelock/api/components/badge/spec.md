---
type: component
name: badge
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1284:14251"
status: published
composes: []
tokensConsumed:
  - --color-signal-info
  - --color-signal-info-muted
  - --color-signal-info-subtle
  - --color-signal-success
  - --color-signal-success-muted
  - --color-signal-success-subtle
  - --color-signal-warning
  - --color-signal-warning-muted
  - --color-signal-warning-subtle
  - --color-signal-critical
  - --color-signal-critical-muted
  - --color-signal-critical-subtle
  - --color-text-primary
  - --color-text-secondary
  - --color-text-inverse
  - --color-bg-subtle
  - --color-bg-inverse-strong
  - --color-bg-brand
  - --color-bg-brand-soft
  - --color-text-brand
  - --color-border-brand
  - --border-radius-pill
  - --space-1
  - --space-3
  - --font-family-primary
  - --font-weight-semibold
  - --font-size-body-xs
  - --lineheight-body-xs
---

# Badge

Compact molecule for status, counts, and short text labels. Canonical
core unit on BEM `.c-badge`, mirrored from
[Web-ODS Shared Library / page 539:28416](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28416&m=dev)
(component set `1284:14251`, Spec `2959:441`). Brands inherit via
`onboarding` / `inherited-units.json` and supply theme tokens only.

## Summary

Three structural variants (`Dot` / `Count` / `Text`) × six colors
(Info / Success / Warning / Error / Brand / **Inverse**) × two
emphasis modes (Low / High) = **36** published variants. Paints bind
to the core theme contract (`--color-signal-*`, brand, inverse /
neutral surfaces) so White Label / other brand / LifeLock / other brand / other brand
re-skin without component forks.

## Composes

Composes: none.

## Variant axes

| Axis | Values |
|---|---|
| `variant` | `dot` (default — 8 × 8 px circle) / `count` (pill + `countValue`) / `text` (pill + uppercase `label`). BEM `.c-badge--<variant>`. |
| `color` | `info` / `success` / `warning` / `error` / `brand` / `inverse`. BEM `.c-badge--<color>`. Mirrors Figma Color on `1284:14251` (Inverse replaces the former LifeLock `gray` label). |
| `emphasis` | `low` (default) / `high`. BEM `.c-badge--<emphasis>`. |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Variant | VARIANT | `variant` | no | `"dot"` | `dot` / `count` / `text`. |
| 2 | Color | VARIANT | `color` | no | `"info"` | `info` / `success` / `warning` / `error` / `brand` / `inverse`. |
| 3 | Emphasis | VARIANT | `emphasis` | no | `"low"` | `low` / `high`. |
| 4 | Count value | TEXT | `countValue` | yes when `count` | `"3"` | Inside `.c-badge__value`. |
| 5 | Label | TEXT | `label` | yes when `text` | `"NEW"` | Inside `.c-badge__label`; SCSS uppercases. |
| — | — | String | `accessibleLabel` | no (`dot` only) | `""` | `role="img"` + `aria-label` when set; else `aria-hidden="true"`. |

## Tokens consumed

**Structural** — `count` / `text`: `border-radius: var(--border-radius-pill)`,
`padding: var(--space-1) var(--space-3)`. `dot`: 8 × 8 px, `border-radius: 50%`.

**Typography** — body-xs SemiBold (`--font-family-primary`,
`--font-weight-semibold`, `--font-size-body-xs`, `--lineheight-body-xs`).

**Per-color paint**

| Color | Low — Dot | High — Dot | Low — pill bg | Low — pill content | High — pill bg | High — pill content |
|---|---|---|---|---|---|---|
| `info` | `--color-signal-info-muted` | `--color-signal-info` | `--color-signal-info-subtle` | `--color-signal-info` | `--color-signal-info` | `--color-text-inverse` |
| `success` | `--color-signal-success-muted` | `--color-signal-success` | `--color-signal-success-subtle` | `--color-signal-success` | `--color-signal-success` | `--color-text-inverse` |
| `warning` | `--color-signal-warning-muted` | `--color-signal-warning` | `--color-signal-warning-subtle` | `--color-text-primary` | `--color-signal-warning` | `--color-text-primary` |
| `error` | `--color-signal-critical-muted` | `--color-signal-critical` | `--color-signal-critical-subtle` | `--color-signal-critical` | `--color-signal-critical` | `--color-text-inverse` |
| `brand` | `--color-border-brand` | `--color-bg-brand` | `--color-bg-brand-soft` | `--color-text-brand` | `--color-bg-brand` | `--color-text-inverse` |
| `inverse` | `--color-text-secondary` | `--color-bg-inverse-strong` | `--color-bg-subtle` | `--color-text-secondary` | `--color-bg-inverse-strong` | `--color-text-inverse` |

`warning` / `high` keeps dark text on yellow for WCAG contrast.

See brand `themes/default/` for resolved values against
@aics/storybook-lifelock.

## Responsive behaviour

Fit-content inline molecule. No breakpoint axis. Logical padding for RTL.

## States

| State | Mechanism | Notes |
|---|---|---|
| `default` | — | Presentation-only; no hover / focus / disabled paints or JS. |

## Accessibility

- **`dot`:** `aria-hidden="true"` by default; optional `accessibleLabel` → `role="img"`.
- **`count` / `text`:** visible text is the accessible name.
- **No focus ring** — wrap in an interactive control when needed.
- **Contrast:** `warning` / `high` carve-out; verify `inverse` / `low` on tinted hosts.

## Design intent

One BEM block for status dots, counts, and short marketing labels.
Stateless by design — compose with Button / Chip for interaction.
No size axis and no icon slot.

## Figma source

- Page: [`539:28416`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28416&m=dev)
- Component set: `1284:14251`
- Spec: `2959:441`
