---
type: component
name: stepper
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1386:867"
status: draft
composes:
  - icon
tokensConsumed:
  - --color-bg-subtle
  - --color-bg-inverse
  - --color-bg-inverse-strong
  - --color-border-brand
  - --color-border-secondary
  - --color-border-tertiary
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
  - --border-width-default
  - --border-width-hairline
  - --space-0
  - --space-3
  - --space-15
---

# Stepper

Ordered multi-step progress indicator for checkout flows, onboarding
wizards, and any experience that needs to show where the user is in a
sequence of up to six steps. Mirrors the LifeLock-themed master variant
set on
[Web-ODS Shared Library / 1386:867](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1386-867&m=dev)
and the companion
[Spec Frame `1386:1325`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1386-1325&m=dev).

## Overview

_A multi-step progress indicator for sequential flows._

Stepper communicates where a user is within a bounded sequence — common
in checkout, onboarding, and setup wizards. Each step is a numbered or
completed circle connected to the next visible step.

## Summary

`Components/Stepper` is a stateless presentation molecule that renders
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
`--color-bg-inverse-strong` fill. See
[`storybook-lifelock/src/components/icon/spec.md`](../icon/spec.md) §
"Composition rules for consumers".

## Variant axes

| Axis | Values |
|---|---|
| `direction` | `horizontal` (default) / `vertical`. Drives `.c-stepper--direction-<direction>`. Horizontal distributes steps evenly across the inline axis (every step with a trailing connector grows; the final step hugs its content). Vertical stacks steps with 80 px row height between connectors. |
| `state` (per step) | `default` / `active` / `complete`. Drives `.c-stepper__step--state-<state>`. Not a Figma variant axis on the Stepper container — applied per Step instance (`1386:803`). Interaction is presentation-only; the consumer sets which step is active by passing markup/state props. |
| `showStep2` … `showStep6` | Boolean visibility toggles on the Stepper container (`1386:867`). Step 1 is always visible. Hidden steps are omitted from the DOM and the accessibility tree. |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Direction | VARIANT | `direction` | no | `"horizontal"` | `horizontal` or `vertical`. |
| 2 | Show step 2 | BOOLEAN | `showStep2` | no | `true` | When `false`, step 2 and its connector are omitted. |
| 3 | Show step 3 | BOOLEAN | `showStep3` | no | `true` | Same contract as step 2. |
| 4 | Show step 4 | BOOLEAN | `showStep4` | no | `true` | Same contract as step 2. |
| 5 | Show step 5 | BOOLEAN | `showStep5` | no | `true` | Same contract as step 2. |
| 6 | Show step 6 | BOOLEAN | `showStep6` | no | `true` | Same contract as step 2. |
| 7 | State (per step) | VARIANT | `step<N>State` | no | `"default"` | One of `default` / `active` / `complete` for steps 1–6. Active step should carry `aria-current="step"`. |
| 8 | Number (per step) | TEXT | `step<N>Number` | no | `<N>` | Indicator digit for non-complete steps. |
| 9 | Show label (per step) | BOOLEAN | `step<N>ShowLabel` | no | `false` | When `true`, renders the label slot below (horizontal) or beside (vertical) the indicator. |
| 10 | Label (per step) | TEXT | `step<N>Label` | no | `"Label"` | Plain text; renders only when `step<N>ShowLabel=true`. |
| 11 | Accessible name | TEXT | `ariaLabel` | no | — | Optional `aria-label` on the `<ol>` root when labels are hidden. |
| — | — | TEXT | `steps[].state` | — | `"default"` | Helper-derived. Per-step state (`default` / `active` / `complete`) the stories layer flattens from `step<N>State`; drives `.c-stepper__step--state-<state>`. |
| — | — | BOOLEAN | `steps[].isActive` | — | `false` | Helper-derived from `step<N>State === "active"`; adds `.c-stepper__step--current` + `aria-current="step"`. |
| — | — | BOOLEAN | `steps[].showLabel` | — | `false` | Helper-derived from `step<N>ShowLabel`; gates the label slot. |
| — | — | TEXT | `steps[].label` | — | `"Label"` | Helper-derived from `step<N>Label`; the visible label text. |
| — | — | BOOLEAN | `steps[].showConnector` | — | — | Helper-derived. Emits the decorative connector after every step except the last. |
| — | — | TEXT | `steps[].number` | — | — | Helper-derived from `step<N>Number`; the indicator digit for non-complete steps. |

## Tokens consumed

**Structural** — `--space-0`, `--space-3`, `--space-15` (80 px vertical row height between connectors), `--border-width-default` (connector line thickness). The component also declares two block-scoped local custom properties on `.c-stepper` — `--c-stepper-indicator-size` (50 px) and `--c-stepper-connector-offset` (24 px, vertically/horizontally centres the 2 px connector on the 50 px indicator) — these are internal layout knobs, not consumed design tokens.

**Surfaces** — `--color-bg-subtle` (Default indicator), `--color-bg-inverse` at 30 % via `color-mix` (Active indicator fill), `--color-bg-inverse-strong` (Complete indicator fill).

**Borders** — `--color-border-brand` (Active indicator stroke), `--color-border-tertiary` (Default trailing connector), `--color-border-secondary` at 30 % via `color-mix` (Active / Complete trailing connector).

**Typography** — `--font-family-primary`, `--font-weight-regular`, `--font-size-body-lg` / `--lineheight-body-lg` / `--letterspacing-body-lg` (indicator number), `--font-size-tagline-sm` / `--lineheight-tagline-sm` / `--letterspacing-tagline-sm` (optional label).

**Content** — `--color-text-primary` (indicator number), `--color-text-secondary` (label), `--color-text-inverse` (Complete checkmark via icon `color="inverse"`).

See this package's Design System token galleries and themes/default/ for resolved values.

## Responsive behaviour

The Stepper is fluid in the horizontal direction (`inline-size: 100%`)
and intrinsic in the vertical direction. Figma ships no breakpoint axis
on the Stepper master — pick `direction` and step visibility at the
layout level rather than expecting an internal breakpoint reflow.
Connector segments grow proportionally on the primary axis so the
control stretches inside `.l-fluid-width` page chrome.

## States

| State | Visual treatment | Mechanism |
|---|---|---|
| Default | Secondary surface circle + primary number | `.c-stepper__step--state-default` |
| Active | Brand border + inverse-secondary tinted fill + primary number | `.c-stepper__step--state-active` + `aria-current="step"` |
| Complete | Inverse-primary filled circle + white checkmark icon | `.c-stepper__step--state-complete` + icon partial |

Connectors after Active / Complete steps paint `--color-border-secondary`
at 30 % opacity; connectors after Default steps paint
`--color-border-tertiary`.

## Accessibility

- Root renders as `<ol>`; each step is `<li>`.
- The active step carries `aria-current="step"`.
- When step labels are hidden, supply `ariaLabel` on the root.
- Connector lines are `aria-hidden="true"` decorative elements.
- Steps hidden via `showStep2` … `showStep6` are removed from the DOM
  (and therefore the accessibility tree).
- Complete-state checkmark uses the icon partial with
  `decorative=true` because the step position communicates progress.

## Design intent

Stepper gives users a lightweight mental model of progress through a
known sequence. It deliberately caps at six steps — longer flows should
use a different pattern (e.g. a side nav or progress bar). The
component does not handle navigation, validation, or click interactions;
those belong in the surrounding page template or a future behaviour
layer.

## Anatomy

_Recommended anatomy for Stepper and Step._

| Part | Notes |
|---|---|
| Step container | One list item per visible step; carries state modifier + optional `aria-current`. |
| Trailing connector | Owned by the step it follows; omitted on the last visible step. Paints the owning step's state colour. Decorative only. |
| Indicator | 50 × 50 px circle — number or complete checkmark. |
| Step label | Optional tagline-sm text below (horizontal) or beside (vertical) the indicator. |

## Behaviour

- Steps 2–6 can be toggled off via `showStep2` … `showStep6`.
- Connectors trail the step that owns them; the last visible step never
  shows a trailing connector. A connector paints the colour of its
  owning step's state, so the segment leaving the Active / Complete step
  reads as dark.
- Horizontal layout distributes steps evenly across the inline axis: every step that owns a trailing connector grows so the connector fills the gap to the next step; the final step (no connector) hugs its content.
- Vertical layout stacks steps with fixed 80 px row height between
  connectors.

## Design system definition

Stepper is a form-adjacent molecule composed from bounded layout,
surface, border, and typography tokens. Complete steps compose the
shared icon primitive rather than inlining SVG.

## Notes & open questions

1. **Icon catalog key** — Figma references `icon/simple/checkmark`; the
   LifeLock icon catalog publishes `status/simple-checkmark`. Code uses
   the catalog key; confirm whether Figma Code Connect should alias the
   two names.
2. **Spec Frame opacity prose** — Tokenisation prose mentions
   `opacity-10` in places but live Figma instances use 30 % for Active
   fills and Active/Complete connectors. Code follows the Figma geometry.
3. **Spec Frame template** — Instance `1386:1325` is a hand-built frame;
   Stage 0 fingerprint re-sync stays back-compat until a published
   `Spec frame` template lands in `figma-import-index.md`.
4. **No click / navigation behaviour** — Stepper is presentation-only
   today. If product needs selectable steps, add a separate behaviour
   contract rather than overloading this molecule.
5. **Connector ownership** — the Spec Frame prose describes a *leading*
   connector owned by the following step; the Figma Step variant set
   and this code implement a *trailing* connector owned by the
   preceding step (so the segment leaving an Active/Complete step paints
   dark, matching the master variants). Visually identical; flagged for
   designer follow-up to align the Spec Frame wording.

## Figma source

- [Stepper page canvas `1366:22777`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1366-22777&m=dev)
- [Stepper master variant set `1386:867`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1386-867&m=dev)
- [Step sub-component set `1386:803`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1386-803&m=dev)
- [Spec Frame `1386:1325`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1386-1325&m=dev)
