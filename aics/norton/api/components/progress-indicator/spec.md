---
type: component
name: progress-indicator
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1380:1255"
status: published
composes: []
tokensConsumed:
  - --color-neutral-30
  - --color-off-black
  - --color-text-primary
  - --color-text-inverse
  - --font-family-primary
  - --font-size-body-sm
  - --font-size-body-xs
  - --font-size-body-base
  - --font-size-h6
  - --font-size-h4
  - --lineheight-body-sm
  - --lineheight-body-xs
  - --lineheight-body-base
  - --lineheight-h6
  - --lineheight-h4
  - --font-weight-semibold
  - --space-2
  - --space-4
  - --border-width-default
  - --border-width-emphasis
  - --progress-indicator-track-height
  - --progress-indicator-radius
  - --progress-indicator-label-letter-spacing
  - --progress-indicator-circular-size
  - --progress-indicator-circular-stroke
behavior: false
tokenReadiness: ready
---

# Progress Indicator

Determinate progress affordance — a track or ring filled proportionally to
the current value of a long-running operation. Three layouts share one BEM
root (`.c-progress-indicator`): two **linear** layouts (`inline`, `stacked`)
mirror the [Web-ODS Shared Library Linear master variant set](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1380-1255&m=dev)
and its [`Progress indicator — Overview`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1380-1478&m=dev) Spec Frame at `1380:1478`; one **circular**
layout mirrors the [other brand-mode `.Sticker Sheets/progress-indicator/other brand`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=615-80630&m=dev)
sibling at `615:80630` (the Circular master variant set lives on the same
canvas `539:28423` but the other brand sticker sheet is the source of truth for
other brand-resolved paint values).

## Summary

Progress indicator communicates the live value of a determinate task
to the user (file upload, multi-step form, onboarding stepper). The
control is **stateless** — the consumer authors the current value via
the `value` arg (0-100) and the component paints the corresponding
fill proportion. No `:hover` / `:focus-visible` / `:active` paints
and no JavaScript. Indeterminate / "spinner" operations are
intentionally not in scope — use a future `Spinner` primitive
instead.

Three structural layouts share one BEM root (`.c-progress-indicator`):

- `layout=inline` — *linear*. Label sits to the inline-start of the
  track on one row. Track fills the remaining inline space via flex.
- `layout=stacked` — *linear*. Label sits above the track. Track
  fills the full inline-size of the parent.
- `layout=circular` — *circular*. A ring drawn with two SVG circles
  (track + fill); the fill arc sweeps clockwise from 12 o'clock for
  `value%` of the circumference. The optional value text (e.g.
  `25%`) renders inside the ring. Sized by a discrete `size` axis
  (`xs`/`sm`/`md`/`lg`/`xxl`) so the ring + inner text scale
  together to the five Figma sticker-sheet stamps.

Two themes overlay every layout:

- `theme=light` — label / value text paints with the other brand
  dark-green content token; intended for use on neutral or light
  page surfaces.
- `theme=dark` — label / value text paints white; intended for use
  on dark page surfaces (e.g. inside a dark hero band or modal
  backdrop).

The label is optional. When omitted (or `showLabel=false`) the linear
layouts render the track and fill only; the circular layout renders
the ring without the inner value text — useful for compact contexts
where the surrounding UI already names the operation.

## Composes

Composes: none.

## Variant axes

| Axis | Values |
|---|---|
| Layout | inline, stacked, circular |
| Theme | light, dark |
| Progress | 0–100 (continuous; Figma publishes 10 % stepped previews for linear, two stamps `25` / `75` for circular) |
| Show label | true, false |
| Size *(circular only)* | xs, sm, md, lg, xxl |

The Figma master also publishes the `Label` text property — that maps
to the `label` arg in code (string content slot) rather than a
discrete BEM modifier.

The `Size` axis is **conditional** — it only applies when
`layout=circular`. Linear layouts ignore `size` and stay fluid
(`inline-size: 100%`). The five circular size stamps mirror the
other brand sticker-sheet diameters verbatim (`xs` 16 px, `sm` 24 px,
`md` 48 px, `lg` 96 px, `xxl` 256 px).

The `xs` size suppresses the inner value text regardless of
`showLabel`; the `sm` size keeps the numeric value but hides the `%`
unit — both mirror the Figma sticker sheet, which only stamps the
larger sizes with the full `<n>%` reading.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Layout | variant | `layout` | no | `stacked` | `inline` \| `stacked` \| `circular`. Drives `.c-progress-indicator--layout-<value>`. |
| 2 | Theme | variant | `theme` | no | `light` | `light` \| `dark`. Drives `.c-progress-indicator--theme-<value>`. |
| 3 | Progress | numeric | `value` | no | `50` | `0`-`100` inclusive. Clamped at render. Written into the inline CSS custom property `--progress-indicator-value` on the root; the linear SCSS sizes `.c-progress-indicator__fill` via `flex-basis: calc(var(--progress-indicator-value) * 1%)`. The circular SCSS feeds the same custom property into the SVG fill circle's `stroke-dasharray: var(--progress-indicator-value) 100` so the arc sweeps proportionally (the circle ships `pathLength="100"` so the dash array reads as a percent). |
| 4 | Label | text | `label` | no | `Label` | Linear layouts only — plain text rendered inside `.c-progress-indicator__label`, displayed uppercase via `text-transform: uppercase`. The circular layout ignores `label` and renders the numeric `value` (with optional `%`) inside the ring instead. |
| 5 | Show label | boolean | `showLabel` | no | `true` | Linear — when `false` (or `label` is empty), the `.c-progress-indicator__label` slot is omitted entirely so the gap collapses. Circular — when `false`, the inner value text (`<n>%`) is omitted; the ring renders alone. |
| 6 | Size | variant | `size` | no | `md` | `xs` \| `sm` \| `md` \| `lg` \| `xxl`. Drives `.c-progress-indicator--size-<value>`. Circular layout only — ignored when `layout` is `inline` or `stacked` (linear layouts are fluid `inline-size: 100%`). |
| 7 | — | text | `accessibleLabel` | no | — | Code-only. Optional `aria-label` to attach to the root when no visible label is shown. The visible `label` text otherwise becomes the accessible name via `aria-labelledby`. Always recommended for the circular layout because the inner value text is rendered as plain digits (the consumer typically supplies a richer accessible name like `"Setup progress, 50 percent complete"`). |
| 8 | — | numeric | `valueMin` | no | `0` | Code-only. `aria-valuemin` value. |
| 9 | — | numeric | `valueMax` | no | `100` | Code-only. `aria-valuemax` value. |
| 10 | — | text | `id` | no | — | Code-only. Suffixes the label node `id` + the root `aria-labelledby` (`progress-indicator-label-<id>`). Auto-falls back to `default` when omitted; pass a unique value per page when multiple linear indicators share a document. |

## Tokens consumed

**Surfaces** — `.c-progress-indicator__track` (linear) and
`.c-progress-indicator__ring-track` (circular) paint with `--color-neutral-30`
(the other brand-mode-resolved value of the Figma `Progress indicator/base`
component-knob token). `.c-progress-indicator__fill` (linear) and
`.c-progress-indicator__ring-fill` (circular) paint with `--color-off-black`
(the other brand-mode-resolved value of `Progress indicator/highlight`). See
§ "Notes & open questions" for the Designer Follow-Up to fold these into
a dedicated `--progress-indicator-*` other brand component-knob token surface.

**Content** — `.c-progress-indicator--theme-light .c-progress-indicator__label`
and `.c-progress-indicator--theme-light .c-progress-indicator__value`
paint with `--color-text-primary` (`--color-other brand-green`).
`.c-progress-indicator--theme-dark .c-progress-indicator__label` and
`.c-progress-indicator--theme-dark .c-progress-indicator__value`
paint with `--color-text-inverse` (white).

**Typography (linear label)** — uses `--font-family-primary` (Inter
Tight), `--font-size-body-sm` (14 px), `--lineheight-body-sm` (22 px),
and `--font-weight-semibold` (600). `text-transform: uppercase` is
applied in CSS. The Figma reference uses Lexend / Tagline / Small
SemiBold (14 px / 16 px / 0.6 px letter-spacing); other brand's
typography ramp uses Inter Tight and does not publish a Tagline scale,
so the closest other brand equivalent ships in code. A component-knob
`--progress-indicator-label-letter-spacing: 0.6px` lands on `:root`
so the visual ladder still matches the Figma reference.

**Typography (circular inner value text)** — `.c-progress-indicator__value`
uses `--font-family-primary` + `--font-weight-semibold` across every
size; the digit font-size / line-height scale per `size` axis per the
Figma sticker sheet:

| `size` | Digit font-size / line-height | `%` unit font-size / line-height | Tokens |
|---|---|---|---|
| `xs` | — (hidden) | — (hidden) | (no value text) |
| `sm` | 12 / 18 | — (hidden) | `--font-size-body-xs` / `--lineheight-body-xs` |
| `md` | 16 / 24 | 12 / 18 | `--font-size-body-base` + `--font-size-body-xs` |
| `lg` | 24 / 30 | 16 / 24 | `--font-size-h6` + `--font-size-body-base` |
| `xxl` | 36 / 44 | 16 / 24 | `--font-size-h4` + `--font-size-body-base` |

All five rows resolve to canonical other brand typography primitives; no
component-knobs needed for the circular inner-text ladder. The Figma
reference renders the digits in Lexend SemiBold; the same Lexend →
Inter Tight substitution the linear label uses applies here too.

**Geometry (linear)** — track height ships as a component-knob
`--progress-indicator-track-height: 2 px`; track + fill border radius
as `--progress-indicator-radius: 2 px`. Neither value exists in
other brand's primitive token ramps today (`--border-radius-*` is
role-keyed: control 4 / card 8 / dialog 16 / pill 9999; the Figma
Spec Frame references a `border-radius-xs` primitive that other brand
doesn't publish).

**Geometry (circular)** — the ring stroke uses the canonical other brand
border-width primitives directly: `--border-width-default` (2 px) for
sizes `xs` / `sm` / `md` / `lg`; `--border-width-emphasis` (4 px) for
size `xxl`. The five ring diameters (16 / 24 / 48 / 96 / 256 px)
mirror the Figma sticker sheet verbatim — none of those values exists
as a other brand primitive, so each `.c-progress-indicator--size-<n>`
rule writes the diameter into a component-knob
`--progress-indicator-circular-size` and the stroke width into
`--progress-indicator-circular-stroke`. The ring-fill `<circle>`
ships `pathLength="100"` and
`stroke-dasharray: var(--progress-indicator-value) 100` so the dash
length reads as a percent of the circumference regardless of radius
— no JavaScript circumference math required.

**Spacing** — `inline` layout uses `gap: var(--space-4)` (12 px)
between the label cell and the track per the Figma Spec Frame.
`stacked` layout uses `gap: var(--space-2)` (4 px) between the label
row and the track. `circular` layout uses no inter-child gap — the
ring and the inner value text overlap inside the same square via
absolute positioning.

See `storybook-other brand/src/tokens/colors/_colors.scss`,
`storybook-other brand/src/tokens/typography/_typography.scss`, and
`storybook-other brand/src/tokens/borders/_borders.scss` for the
canonical token values.

## Responsive behaviour

The linear layouts (`inline` / `stacked`) are **fluid** — they
stretch to the full inline-size of the parent container at every
breakpoint and ship no per-band breakpoint rules. Consumers that need
a narrower control wrap the component in a sized container
(`max-inline-size: <token>`); the track + fill geometry reflows
continuously inside it via flex sizing. Track height stays a constant
2 px at every breakpoint.

The `inline` layout reflows by allowing the label cell to wrap to a
second line above the track when the inline-size collapses below the
label's intrinsic width. Authors who need a guaranteed single-row
layout at narrow widths should pick `stacked` instead.

The `circular` layout is **discretely sized** — it paints at exactly
the diameter the `size` axis names (`xs` 16 px through `xxl` 256 px)
regardless of breakpoint. Authors who need an intermediate size pick
the next stamp up. There are no per-band size adjustments today
because the Figma sticker sheet only publishes the five stamps and
mixing intermediate diameters would break the visual ladder. A
future enhancement could expose `--progress-indicator-circular-size`
+ `--progress-indicator-circular-stroke` as authored knobs (already
in place) so consumers can stamp custom sizes at their own risk —
see § "Notes & open questions".

All inline-axis sizing uses logical properties (`padding-inline`,
`gap`) so the component flips cleanly under `dir="rtl"` with no
extra rules. The circular ring is naturally direction-neutral (a
circle has no inline / block axis bias).

## States

Progress indicator is **stateless** — no `:hover`, `:focus-visible`,
`:active`, or `:disabled` paints. The component is not interactive;
it reflects the application's progress state to the user but does
not accept input. State management lives in the consuming feature
(file upload, multi-step form), which updates the `value` prop as
the underlying operation advances.

The `Loading` axis the consuming Figma file sometimes pairs with this
component is intentionally not in scope — it's an indeterminate
operation cue, modelled separately as a future `Spinner` primitive
(or as a `loading` state on `Components/Button`, which already ships
in this package).

## Accessibility

- Root carries `role="progressbar"` to expose the determinate-progress
  semantic to assistive technologies.
- Root carries `aria-valuenow="<value>"`, `aria-valuemin="0"`, and
  `aria-valuemax="100"` so the live value is announced when the
  consumer programmatically updates `value`.
- **Linear layouts** — when `showLabel=true` and `label` is non-empty,
  the label node carries an `id` and the root carries
  `aria-labelledby="<id>"` so the label becomes the accessible name.
  When `showLabel=false`, the consumer supplies `accessibleLabel`
  and the root carries `aria-label="<accessibleLabel>"`.
- **Circular layout** — `accessibleLabel` is the canonical accessible
  name source. The inner value text (`<n>%`) is decorative —
  `.c-progress-indicator__value` is wrapped in `aria-hidden="true"`
  so screen readers don't announce the raw digits twice (once from
  the visible text and once from `aria-valuenow`). The consumer
  always supplies `accessibleLabel` for circular instances; the
  template renders a `aria-label="<accessibleLabel>"` attribute on
  the root.
- Contrast — both linear `.c-progress-indicator__fill` and circular
  `.c-progress-indicator__ring-fill` paint off-black (`#161616`)
  against the neutral-30 (`#b6b6b5`) track / ring-track, yielding a
  3.96:1 contrast ratio, meeting WCAG 2.2 SC 1.4.11 (Non-text
  Contrast, 3:1 minimum for UI components). Label / value-text
  contrast — light theme paints other brand-green (`#013638`) on light
  surfaces (≥ 13:1 vs `#fff`); dark theme paints white on dark
  surfaces (≥ 13:1 vs `#161616`).
- The root does not receive focus; the component is a presentation
  surface rather than an interactive control. The Tab key skips
  past it.
- `prefers-reduced-motion: reduce` does not currently apply — both
  the linear fill and the circular arc sweep snap to the new
  proportion whenever `value` updates rather than animating. If a
  future iteration adds a fill-width or arc-length transition, the
  SCSS wraps that transition in
  `@media (prefers-reduced-motion: no-preference)` per the precedent
  set by `c-alert--whole-clickable`.

## Design intent

Progress indicator is the lightest possible determinate-progress
affordance. The linear layouts are a 2 px track with a fill, paired
with an optional uppercase label; the circular layout is a 2 px
(4 px at XXL) ring with an optional inner percent reading. Both
share the same neutral-30 / off-black paint pair so the family reads
as one primitive at a glance.

The minimal geometry is intentional: progress indicators appear most
often in dense product surfaces (onboarding steppers, multi-step
forms, file-upload progress) where a fatter control would compete
with the content it accompanies. The uppercase label on the linear
layouts borrows the same kicker / tagline pattern the broader brand
uses for section labels, signalling "this is meta about the
operation, not part of the operation itself".

The `inline` vs `stacked` split exists so the same component can
slot into a stepper row (inline — short label + long track) and
into an upload card (stacked — full-width label above full-width
track) without spawning two BEM blocks. The `circular` layout
serves the third common shape — a fixed-size badge that fits inside
a card corner, a list-row icon slot, or the centre of a hero
illustration — where a horizontal track would not fit. Folding it
into the same BEM block as `layout = circular` (rather than spawning
a separate `Components/Progress circular`) mirrors the
three-sibling fold pattern proven by `c-alert`
(`banner / toast / passive`) — one component, one mental model, one
set of shared tokens.

The `theme=dark` variant exists because the other brand product surface
sometimes places progress indicators on dark hero / modal / nav
backdrops where the light-mode label / value colour would fail
contrast. The track and fill (and ring track and ring fill) currently
keep their light-surface values across both themes — see § "Notes &
open questions" for the Designer Follow-Up to define dark-surface
paint values.

## When to use

_Situations where a progress indicator is the right pattern._

- Use during multi-step flows so the user can sense how many steps remain.
- Use for known-duration work such as file upload, sync, or import.
- Use when progress is expressible as a deterministic fraction (n of m or %).
- Use as a quiet, persistent affordance in headers or wizard chrome.

## When not to use

_Situations where another pattern is a better fit._

- Do not use for indeterminate or unknown-duration work — use a spinner or skeleton.
- Do not use for richer multi-step navigation that needs step labels or click-to-jump — use a stepper.
- Do not use to communicate scoring, ratings, or quantities — use a meter, chart, or score component.

## Anatomy

_The three pieces a progress indicator exposes._

1. Label — short, all-caps text describing the current step or percent complete.
2. Track — the unfilled bar background; sized via the track-thickness token.
3. Active fill — the filled portion of the bar, sized via the Progress variant (proportional auto-layout).
4. Spacer — the empty remainder of the bar; together with the active fill, it gives the bar an exact percentage at any track width.

## Behaviour

_Configurable surfaces and runtime defaults the implementation should expose._

- Progress is a variant property with 11 discrete percentage steps (0–100% in 10% increments). Designers pick the value in the property panel.
- Internally the Track is a horizontal auto-layout frame with two children whose layoutGrow values are the chosen percentage and 100 minus that percentage — the fill stays mathematically exact regardless of track width.
- The label is fully configurable text — copy is owned by the parent flow.
- Track grows to fill the available horizontal space; height stays fixed via the track-thickness token.
- Reaching 100% should not auto-dismiss or trigger navigation; that remains the parent's responsibility.

## Usage guidance

_Practical guidance for product teams composing the progress indicator._

- Place near the top of the flow so the indicator stays visible above primary content.
- For long flows, keep the same instance and update only the label and fill so the bar feels continuous.
- Pair with a concise heading; the indicator label is supportive, not the main page title.
- Do not stack multiple progress indicators in the same view — use a single one for the active task.

## Content guidance

_How writers and product teams should populate the label._

- Prefer the pattern "STEP n OF m" or "QUESTION n OF m" in uppercase for short, scannable progress.
- Use percentage labels ("75% COMPLETE") only when the underlying value is a continuous percent.
- Keep label copy under ~20 characters so it never wraps in inline layouts.
- Match the tone and casing of the surrounding flow.

## Design requirements

_The minimum the component must support to be considered complete._

- Support a configurable label string.
- Support Inline and Stacked layouts.
- Support Light and Dark surface usage.
- Expose a Progress variant property with 11 percentage steps (0–100% in 10% increments) so designers can pick the fill level without touching layout values.
- All visual values bound to Web-ODS tokens — no hard-coded colours, spacings, or radii.

## Design system definition

_How the progress indicator fits into the wider design system contract._

The progress indicator is a form-adjacent molecule composed of bounded primitives — a track frame, a fill rectangle, a spacer, and a label text node — all bound to Web-ODS tokens so visual values change with brand mode without requiring a structural change. It exposes three variant axes (Layout × Theme × Progress), one text property (Label), and one boolean visibility property (Show label). Progress is encoded as proportional layoutGrow values so the fill width is exact at any container width. Implementations should treat the indicator as a presentational component with progress as a single controlled prop.

## Notes & open questions

- **other brand-mode Linear master still resolves to Norton blue.** The
  `Progress indicator — Overview` Spec Frame at `1380:1478` and the
  Linear master variant set at `1380:1255` both render under a
  non-other brand theme today — `Progress indicator/light/highlight`
  resolves to `#0009ec` (Norton blue), not a other brand token. The
  other brand-mode-resolved values used by this spec come from the
  sibling other brand-mode sticker sheet for the Circular variant at
  `615:80630`, where `Progress indicator/base` → `#b6b6b5`
  (neutral-30) and `Progress indicator/highlight` → `#161616`
  (off-black). Both linear and circular layouts share these paint
  values verbatim. Designer Follow-Up — rebake the Linear master
  under `THEME=other brand` so the canonical Spec Frame and master
  variant set carry the other brand paint values directly, then
  re-sync.
- **No other brand-mode sticker sheet for Linear.** The Circular variant
  publishes a `.Sticker Sheets/progress-indicator/other brand` frame at
  `615:80630`; Linear does not. Designer Follow-Up — add a other brand
  sticker sheet for the Linear master so the AllStyles gallery has
  a canonical Figma frame to mirror per breakpoint.
- **No other brand-mode Circular Spec Frame.** The Circular layout's
  reference is the `.Sticker Sheets/progress-indicator/other brand`
  sticker sheet at `615:80630` (a render frame), not a dedicated
  Spec Frame. The visual ladder (XS / S / M / L / XXL) is mirrored
  from the sticker sheet's stamp grid. Designer Follow-Up — publish
  a `Progress indicator — Circular Overview` Spec Frame so the
  Stage 0 four-way consistency check has a Spec Frame instance to
  parse for the circular layout's H2 sections too.
- **Component-knob tokens are component-local.** The four Figma
  Variables `Progress indicator/{light,dark}/{base,highlight,content}`
  describe a component-scoped token surface (the same role
  `--button-*` plays for Button). They currently ship as inline
  custom properties at the top of `progress-indicator.scss` rather
  than as a dedicated `storybook-other brand/src/tokens/progress-indicator/`
  partial. Designer Follow-Up — when a second component needs the
  same role-keyed tokens, promote them to a Layer 4 component-token
  partial alongside `_button.scss`.
- **Linear-only token gaps still apply.** `border-radius-xs` (2 px)
  and `track-height` (2 px) ship as component-local knobs
  (`--progress-indicator-radius`, `--progress-indicator-track-height`)
  because other brand's `--border-radius-*` ladder is role-keyed
  (control / card / dialog / pill) with no XS primitive. The
  circular layout side-steps this entirely by using the canonical
  `--border-width-default` (2 px) and `--border-width-emphasis`
  (4 px) primitives for its ring stroke — no new knob needed.
  Designer Follow-Up — add `--border-radius-xs: 2px` to the
  other brand primitives ramp (which would also remove
  `--progress-indicator-radius`), or formally adopt the role-keyed
  pattern that `_button.scss` uses for its component-knob surface.
- **Typography substitute: Tagline / Small SemiBold → Body-sm
  SemiBold + 0.6 px letter-spacing.** Linear-only. The Figma
  reference uses Lexend Tagline / Small (14 / 16 / 0.6 px), which
  is not present in other brand's Inter Tight ramp. The closest match
  in code is `--font-size-body-sm` (14 px) + `--lineheight-body-sm`
  (22 px) + `--font-weight-semibold` (600) + a component-knob
  `--progress-indicator-label-letter-spacing: 0.6px` + uppercase.
  Line-height drifts from 16 px to 22 px relative to Figma. The
  circular layout's inner-value text uses the canonical Inter Tight
  body / heading ramp directly and does not carry this gap. Designer
  Follow-Up — confirm whether the other brand typography ramp should
  ship a Tagline scale or whether Body-sm is the canonical match.
- **Circular size axis is discrete.** The `size` axis stamps at five
  fixed diameters mirroring the Figma sticker sheet (`xs` 16, `sm`
  24, `md` 48, `lg` 96, `xxl` 256). Consumers who need an
  intermediate size today can override
  `--progress-indicator-circular-size` and
  `--progress-indicator-circular-stroke` inline (the component-knob
  variables are public), but the inner-text font ladder will not
  rescale. Designer Follow-Up — confirm the five-stamp model is the
  long-term plan, or publish intermediate sticker stamps if product
  surfaces need them.
- **Circular animation not in scope.** The arc sweep snaps to the
  new `value` whenever the inline custom property updates; there is
  no `stroke-dashoffset` transition today. Designer Follow-Up — if
  consumers ask for a smoothly animating sweep, add a transition
  guarded by `@media (prefers-reduced-motion: no-preference)` per
  the precedent set by `c-alert--whole-clickable`.
- **Indeterminate / loading progress not in scope.** This component
  is determinate-only. An indeterminate operation cue belongs in a
  future `Components/Spinner` primitive (or as a `loading` state on
  `Components/Button`, which already ships in this package).
- **Spec Frame `1380:1478` ↔ spec.md (B) conflicts deliberately
  skipped on `2026-06-04` Spec Frame sync.** Four Spec-Frame-owned
  H2s diverge from the current spec.md content because spec.md has
  been deliberately extended beyond the Spec Frame's scope:
  - `## Variant axes` — Spec Frame lists Linear-only axes
    (`Layout = Inline / Stacked`); spec.md adds `circular` to the
    `Layout` axis and introduces a conditional `Size` axis
    (`xs`/`sm`/`md`/`lg`/`xxl`) for the other brand Circular sticker
    sheet fold-in.
  - `## States` — Spec Frame lists fill positions
    (Empty / Default / Complete / Disabled); spec.md describes the
    component's stateless nature (no `:hover` / `:focus-visible` /
    `:active` / `:disabled` paints).
  - `## Accessibility` — Spec Frame has 4 short generic bullets;
    spec.md has 8 detailed bullets including circular-specific
    `aria-hidden` handling for the inner value text, exact contrast
    ratios, focus skip, and `prefers-reduced-motion` policy.
  - `## Tokens consumed` — Spec Frame references multi-brand
    canonical tokens (Lexend `PRIMARY/H7/Bold`, `border-radius-xs`,
    `space-1` track thickness); spec.md documents the other brand
    substitutions (Inter Tight + `body-sm` + `--progress-indicator-label-letter-spacing`
    knob, `--progress-indicator-radius` knob, `--progress-indicator-track-height`
    knob) AND the full Circular layout's token surface (Geometry
    circular, Typography circular inner value text size→token
    mapping). Designer Follow-Up — update the Spec Frame's regions
    to match the current spec.md content, OR publish a separate
    other brand-mode Spec Frame that carries the other brand-resolved
    + Circular-extended truth.
- **Spec Frame `1380:1478` lacks a reserved `Last sync` text node.**
  The 2026-06-04 Spec Frame sync emitted `stamp-skipped:
  template-missing-node`. Designer Follow-Up — add a reserved
  `Last sync` text node to the Spec Frame instance (and to the
  published Spec Frame component template, when one is published)
  so per-unit Stage 0 runs can stamp `Last sync: <ISO> by <Author>`
  on the way out.
- **Spec Frame `1380:1478` is a hand-built `<frame>`, not an
  `<instance>` of a published template.** Stage 0's formal
  template-fingerprint-driven re-sync semantics are back-compat
  until a `Spec frame` Figma component template is published in
  `Web-ODS Shared Library` and registered in
  [`storybook-other brand/src/figma-import-index.md`](../../figma-import-index.md)
  § "Spec Frame template". Designer Follow-Up — publish the
  template + bootstrap
  `storybook-other brand/figma-snapshots/template-spec-frame.manifest.json`
  so every unit's Stage 0 picks up new template revisions cheaply.
- **`## Anatomy` kicker says "three pieces" but the body lists four
  items.** The Spec Frame's `Recommended anatomy` section-head
  subtitle reads "The three pieces a progress indicator exposes."
  but its body enumerates Label / Track / Active fill / Spacer
  (four). Designer Follow-Up — update the kicker to "four" (or drop
  Spacer from the body if it's an implementation-only concept).
- **Spec Frame `## Design requirements` is Linear-only.** The body
  enumerates "Inline and Stacked layouts" but the current spec.md
  + code ship a `circular` layout too. Designer Follow-Up — extend
  the Spec Frame's `Design requirements` bullets to mention
  Circular + the conditional Size axis, or publish a sibling
  `Progress indicator — Circular Overview` Spec Frame.

## Figma source

- [Web-ODS Shared Library : Progress indicator — Overview](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1380-1478&m=dev) (Spec Frame, Linear)
- [Web-ODS Shared Library : Progress indicator / Linear (master)](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1380-1255&m=dev) (Linear master variant set — renders under non-other brand theme today; see § "Notes & open questions" for the rebake follow-up)
- [Web-ODS Shared Library : .Sticker Sheets / progress-indicator / other brand](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=615-80630&m=dev) (Circular other brand-mode sticker sheet — canonical source for both the linear paint values and the full circular layout incl. the five `size` stamps XS / S / M / L / XXL)
