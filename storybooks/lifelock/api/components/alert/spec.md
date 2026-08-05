---
type: component
name: alert
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "537:28056"
status: published
behavior: true
composes:
  - icon
  - button
tokensConsumed:
  - --space-4
  - --space-5
  - --space-7
  - --space-8
  - --space-10
  - --space-13
  - --border-radius-0
  - --border-radius-l
  - --border-radius-control
  - --border-width-default
  - --color-border-focus
  - --font-family-primary
  - --font-size-body-base
  - --lineheight-body-base
  - --letterspacing-body-base
  - --font-weight-semibold
  - --font-size-body-sm
  - --lineheight-body-sm
  - --letterspacing-body-sm
  - --font-weight-regular
  - --color-text-primary
  - --color-text-inverse
  - --color-signal-info
  - --color-signal-info-subtle
  - --color-signal-critical
  - --color-signal-critical-subtle
  - --color-signal-warning
  - --color-signal-warning-subtle
  - --color-signal-success
  - --color-signal-success-subtle
  - --color-bg-muted
  - --color-bg-inverse-strong
  - --color-bg-brand
  - --color-bg-brand-soft
  - --shadow-default
---

# Alert

Unified account- or page-level status surface. Figma: [Pattern / Alerts](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=537-28056&m=dev) (`537:28056`). Spec Frame [`.Alert · spec`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5399-1816&m=dev) (`5399:1816`). Board `5358:1619`.

## Summary

One master replaces the former Banner / Toast / Passive sets. Tone × Hierarchy × Width are axes; Show icon / body / button / Dismissible / Elevation are booleans. Stories expose Default / Toast / Passive as arg-bundle presets.

## Composes

Composes: icon, button.

## Variant axes

| Axis | Values |
|---|---|
| Tone | `info`, `critical`, `attention`, `success`, `dark`, `brand` |
| Hierarchy | `low`, `high` |
| Width | `in-grid`, `full-bleed` |

Booleans (not axes): `showIcon`, `showBody`, `showButton`, `dismissible`, `elevation`.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Tone | enum | `tone` | no | `info` | Drives surface + default icon |
| 2 | Hierarchy | enum | `hierarchy` | no | `low` | Low = subtle; High = solid |
| 3 | Width | enum | `width` | no | `in-grid` | In-grid radius-l; full-bleed radius-0 + responsive pad |
| 4 | Show icon | boolean | `showIcon` | no | `true` | |
| 5 | Show body text | boolean | `showBody` | no | `true` | |
| 6 | Show button | boolean | `showButton` | no | `true` | Size S Button; style via hierarchy |
| 7 | Dismissible | boolean | `dismissible` | no | `false` | |
| 8 | Elevation | boolean | `elevation` | no | `false` | `--shadow-default` |
| 9 | Title | text | `title` | yes | — | Body-base/SemiBold |
| 10 | Description | text | `description` | no | — | Body-sm; gated by `showBody` |
| 11 | — | text | `ctaLabel` | no | `Action` | |
| 12 | — | text | `ctaHref` | no | — | When set, CTA is `<a class="btn">` |
| 13 | — | text | `icon` | no | — | Catalog key override |
| 14 | — | text | `dismissLabel` | no | `Dismiss` | |
| 15 | — | text | `className` | no | — | Outer escape hatch |

## Tokens consumed

**Structural** — `--space-4`, `--space-5`, `--space-7`, `--space-8`, `--space-10`, `--space-13`, `--border-radius-0`, `--border-radius-l`, `--border-radius-control`, `--shadow-default`.

**Typography** — `--font-family-primary`, `--font-size-body-base`, `--lineheight-body-base`, `--letterspacing-body-base`, `--font-weight-semibold`, `--font-size-body-sm`, `--lineheight-body-sm`, `--letterspacing-body-sm`, `--font-weight-regular`.

**Tone paints** — `--color-signal-*-subtle` / `--color-signal-*`, `--color-bg-muted`, `--color-bg-inverse-strong`, `--color-bg-brand`, `--color-bg-brand-soft`, `--color-text-primary`, `--color-text-inverse`.

See themes/default/ for resolved values.

## Responsive behaviour

In-grid uses fixed `--space-5` inline padding. Full-bleed binds inline padding to SM/MD/L/XL → `--space-5` / `--space-8` / `--space-10` / `--space-13` (16 / 32 / 44 / 64).

## States

- Default — tone × hierarchy paints
- Elevated — `--shadow-default` when `elevation`
- Live region — High + Critical → `role="alert"` / `aria-live="assertive"`; else `role="status"` / `polite`
- Dismissed — `initAlert` unmounts root and fires `lifelock:alert:dismiss`
- Hover / focus on CTA and dismiss only (native button states)

## Accessibility

- Icon is decorative (`aria-hidden`)
- Dismiss is a real `<button>` with accessible label
- Focus ring on interactive controls via `--color-border-focus`
- Attention High keeps primary text for contrast
- Never colour-only — icon + copy carry meaning

## Design intent

Single configurable alert for account/page signals. Prefer Low + in-grid for persistent banners; Elevation + dismiss for toasts; icon + body only for passive context.

## JavaScript API

### Init signature

| option | type | default | description |
|---|---|---|---|
| — | — | — | _No init options._ |

### Instance shape

```ts
{ destroy(): void }
```

### Events

| name | detail | when fired |
|---|---|---|
| `lifelock:alert:dismiss` | `{ root }` | Dismiss control activated |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `data-alert-initialized` | `true` | After `initAlert` |

### Keyboard

| key | behavior |
|---|---|
| Enter / Space | Activates focused dismiss button |

### SSR fallback

Without JS the dismiss control remains visible; the host must wire click handling. With `initAlert`, dismiss unmounts the alert.
