---
type: component
name: stepper
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1386:867"
status: published
behavior: false
composes:
  - icon
tokensConsumed:
  - --color-bg-subtle
  - --color-bg-inverse
  - --color-bg-inverse-strong
  - --color-border-brand
  - --color-border-strong
  - --color-border-subtle
  - --color-text-primary
  - --color-text-secondary
  - --color-text-inverse
  - --font-family-primary
  - --font-weight-regular
  - --font-size-body-lg
  - --lineheight-body-lg
  - --letterspacing-body-lg
  - --font-size-tagline-sm
  - --lineheight-tagline-sm
  - --letterspacing-tagline-sm
  - --border-width-s
  - --border-width-hairline
  - --space-0
  - --space-3
  - --space-15
---

# Stepper

Ordered multi-step progress indicator for checkout flows, onboarding
wizards, and any experience that needs to show where the user is in a
sequence of up to six steps. Mirrors the Shared Library master on
[Web-ODS Shared Library / 1386:867](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1386-867&m=dev)
and the companion
[Spec Frame `3067:548`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3067-548&m=dev).

## Summary

`Molecules/Stepper` is a stateless presentation molecule that renders
an ordered list of up to six steps. Each step exposes a circular
indicator (number or checkmark), an optional text label, and a trailing
connector to the next visible step. Two layout directions (`horizontal`
/ `vertical`) share one `.c-stepper` BEM block. Step progress is
expressed entirely through which steps carry `state=default`,
`state=active`, or `state=complete` in the markup — there is no
JavaScript runtime.

## Composes

Composes: icon.

The **Complete** state replaces the step number with the registered
`icon` partial using catalog key `status/simple-checkmark` at 24 px
with `color="inverse"` so the glyph paints white on the
`--color-bg-inverse-strong` fill.

## Variant axes

| Axis | Values |
|---|---|
| `direction` | `horizontal` (default) / `vertical`. Drives `.c-stepper--direction-<direction>`. Horizontal distributes steps evenly across the inline axis (every step with a trailing connector grows; the final step hugs its content). Vertical stacks steps with 80 px row height between connectors. |
| `state` (per step) | `default` / `active` / `complete`. Drives `.c-stepper__step--state-<state>`. Applied per Step instance (`1386:803`). |
| `showStep2` … `showStep6` | Boolean visibility toggles. Step 1 is always visible. Hidden steps are omitted from the DOM. |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Direction | VARIANT | `direction` | no | `"horizontal"` | `horizontal` or `vertical`. |
| 2 | Show step 2 | BOOLEAN | `showStep2` | no | `true` | When `false`, step 2 and its connector are omitted. |
| 3 | Show step 3 | BOOLEAN | `showStep3` | no | `true` | Same contract as step 2. |
| 4 | Show step 4 | BOOLEAN | `showStep4` | no | `true` | Same contract as step 2. |
| 5 | Show step 5 | BOOLEAN | `showStep5` | no | `true` | Same contract as step 2. |
| 6 | Show step 6 | BOOLEAN | `showStep6` | no | `true` | Same contract as step 2. |
| 7 | State (per step) | VARIANT | `step<N>State` | no | `"default"` | One of `default` / `active` / `complete` for steps 1–6. |
| 8 | Number (per step) | TEXT | `step<N>Number` | no | `<N>` | Indicator digit for non-complete steps. |
| 9 | Show label (per step) | BOOLEAN | `step<N>ShowLabel` | no | `false` | When `true`, renders the label slot. |
| 10 | Label (per step) | TEXT | `step<N>Label` | no | `"Label"` | Plain text; renders only when `step<N>ShowLabel=true`. |
| 11 | Accessible name | TEXT | `ariaLabel` | no | — | Optional `aria-label` on the `<ol>` root when labels are hidden. |
| — | — | TEXT | `steps[].state` | — | `"default"` | Helper-derived. |
| — | — | BOOLEAN | `steps[].isActive` | — | `false` | Helper-derived; adds `aria-current="step"`. |
| — | — | BOOLEAN | `steps[].showLabel` | — | `false` | Helper-derived. |
| — | — | TEXT | `steps[].label` | — | `"Label"` | Helper-derived. |
| — | — | BOOLEAN | `steps[].showConnector` | — | — | Helper-derived. |
| — | — | TEXT | `steps[].number` | — | — | Helper-derived. |

## Tokens consumed

**Structural** — `--space-0`, `--space-3`, `--space-15`, `--border-width-s`, `--border-width-hairline`. Block-scoped knobs: `--c-stepper-indicator-size` (50 px), `--c-stepper-connector-offset` (24 px).

**Surfaces** — `--color-bg-subtle`, `--color-bg-inverse` (30 % via `color-mix`), `--color-bg-inverse-strong`.

**Borders** — `--color-border-brand`, `--color-border-subtle` (default connector), `--color-border-strong` at 30 % (active/complete connector).

**Typography** — `--font-family-primary`, `--font-weight-regular`, body-lg (number), tagline-sm (label).

**Content** — `--color-text-primary`, `--color-text-secondary`, `--color-text-inverse`.

See this package's Design System token galleries and themes/default/ for resolved values.

## Responsive behaviour

Fluid in the horizontal direction (`inline-size: 100%`) and intrinsic
vertically. No breakpoint axis on the master — pick `direction` and
step visibility at the layout level. Connector segments grow on the
primary axis.

## States

| State | Visual treatment | Mechanism |
|---|---|---|
| Default | Subtle surface circle + primary number | `.c-stepper__step--state-default` |
| Active | Brand border + inverse tinted fill + primary number | `.c-stepper__step--state-active` + `aria-current="step"` |
| Complete | Inverse-strong filled circle + white checkmark | `.c-stepper__step--state-complete` + icon partial |

## Accessibility

- Root renders as `<ol>`; each step is `<li>`.
- The active step carries `aria-current="step"`.
- When step labels are hidden, supply `ariaLabel` on the root.
- Connector lines are `aria-hidden="true"`.
- Complete-state checkmark uses `decorative=true`.

## Design intent

Stepper gives users a lightweight mental model of progress through a
known sequence. Caps at six steps. Does not handle navigation,
validation, or click interactions.

## Figma source

- [Stepper page canvas `1366:22777`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1366-22777&m=dev)
- [Stepper master variant set `1386:867`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1386-867&m=dev)
- [Step sub-component set `1386:803`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1386-803&m=dev)
- [Spec Frame `3067:548`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3067-548&m=dev)
