---
type: component
name: text-link
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1332:54878"
status: draft
composes:
  - icon
tokensConsumed:
  - --color-text-brand
  - --color-text-primary
  - --color-text-secondary
  - --color-text-inverse
  - --color-disabled-text
  - --color-border-focus
  - --font-family-primary
  - --font-weight-regular
  - --font-weight-medium
  - --font-weight-semibold
  - --font-weight-bold
  - --font-size-body-xs
  - --font-size-body-sm
  - --font-size-body-base
  - --font-size-body-lg
  - --font-size-body-xl
  - --font-size-body-2xl
  - --font-size-body-3xl
  - --lineheight-body-xs
  - --lineheight-body-sm
  - --lineheight-body-base
  - --lineheight-body-lg
  - --lineheight-body-xl
  - --lineheight-body-2xl
  - --lineheight-body-3xl
  - --border-width-default
  - --space-1
---

# Text Link

Inline text-based interactive element used within body copy to
navigate users to related content, pages, or actions. Mirrors the
LifeLock-themed master variant set on
[Web-ODS Shared Library / 1332:54878](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-54878&m=dev) —
the master component set publishing 336 variants
(2 `Background` x 6 `State` x 7 `Size` x 4 `Weight`) on the canonical
[Text link canvas](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-54772&m=dev).
The companion
[Spec frame `1332:54773`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-54773&m=dev)
governs every Spec-Frame-owned H2 below per
[`figma-spec-frame.mdc`](../../../../.cursor/rules/figma-spec-frame.mdc) §
"Region -> H2 mapping".

## Overview

_What a text link is and why it belongs in the design system._

Text links are inline interactive elements embedded directly within
paragraphs, labels, or supporting content. They provide a lightweight
way for users to navigate to related destinations or trigger
contextual actions while maintaining the rhythm and readability of
surrounding text. Unlike buttons, text links are intentionally
low-emphasis and should feel native to the content they live within.

## Purpose

_When to reach for the text link pattern._

- Provide contextual navigation within body content.
- Connect users to supporting information, related pages, or
  secondary actions.
- Maintain reading flow while exposing interactive destinations.
- Offer lightweight interaction without introducing button hierarchy
  or visual weight.

## Summary

`Components/Text link` is the LifeLock inline interactive primitive
for navigating to related content, pages, or actions from inside
running text. Unlike `Components/Button`, text links are
intentionally low-emphasis and feel native to the content they live
within. One `.c-text-link` BEM block carries the Figma master's
four orthogonal axes:

- **`background`** (Light / Dark) — controls the colour ramp the
  link paints against. Light is the default; Dark inverts every paint
  for use on `--color-bg-inverse-strong` / `--color-bg-cta-primary-default`
  surfaces.
- **`size`** (xs / sm / base / lg / xl / 2xl / 3xl) — maps onto the
  full LifeLock body typography ramp from `--font-size-body-xs`
  (12 px) through `--font-size-body-3xl` (24 px LG / 22 px SM).
- **`weight`** (regular / medium / semibold / bold) — exposes every
  Inter Tight weight the body family ships so authors can match the
  surrounding copy without nesting the link inside a styled span.
- **`state`** (default / hover / focus / pressed / disabled / visited)
  — paints via CSS pseudo-classes per
  [`component-anatomy.mdc`](../../../../.cursor/rules/component-anatomy.mdc) §
  "Five-dimension taxonomy". `disabled` is the only persistent state
  the markup distinguishes; `visited` is browser-managed via the
  `:visited` pseudo-class.

Buildable variant count = `2 x 7 x 4 = 56` (background x size x
weight; the six interaction states collapse to pseudo-classes; the
optional icon treatment is an orthogonal opt-in slot, not a variant
axis multiplier).

## Composes

Composes: icon.

The optional `icon treatment` slot composes the registered `icon`
partial when the consumer passes `iconTreatment: "external"`
(canonical `arrows-navigation/simple-link-external` glyph for links
that open a new tab) or `iconTreatment: "inline"` (consumer-supplied
catalog key via the `iconName` prop). When `iconTreatment: "none"`
(the default) no icon is rendered. The icon paints in
`currentColor` so it tracks every state change without per-state
overrides — see
[`storybook-lifelock/src/components/icon/spec.md`](../icon/spec.md) §
"Composition rules for consumers".

## Variant axes

| Axis | Values |
|---|---|
| `background` | `light` (default) / `dark`. Drives the `.c-text-link--background-<bg>` BEM modifier. Mirrors Figma's `Background` axis on `1332:54878`. |
| `size` | `xs` / `sm` / `base` (default) / `lg` / `xl` / `2xl` / `3xl`. Drives the `.c-text-link--size-<size>` BEM modifier. Maps to the LifeLock body typography ramp `--font-size-body-{size}` + `--lineheight-body-{size}`. Mirrors Figma's `Size` axis. |
| `weight` | `regular` (default) / `medium` / `semibold` / `bold`. Drives the `.c-text-link--weight-<weight>` BEM modifier. Maps to `--font-weight-{weight}`. Mirrors Figma's `Weight` axis. |
| `state` | `default` / `hover` / `focus` / `pressed` / `disabled` / `visited` — Figma documentation only; code paints these via CSS pseudo-classes (`:hover`, `:focus-visible`, `:active`, `:visited`) and the `aria-disabled="true"` attribute. The `disabled` boolean prop is the only persistent runtime state the markup carries. |

All `2 x 7 x 4 = 56` `(background x size x weight)` combinations are
buildable and all ship on the Figma master variant set. The
`Background = Dark` slice is provided for inverse surfaces such as
hero sections, banner footers, and the `--color-bg-inverse-strong`
canvas; it is not a separate component.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | `Label` | Text | `label` | yes | — | The visible text the user reads. Renders inside the `<a>` element. Plain text only; HTML inside the label is forbidden. |
| 2 | `Background` | Variant | `background` | no | `light` | Maps to `.c-text-link--background-<value>`. Use `dark` only when the link sits on `--color-bg-inverse-*` / `--color-bg-cta-*` surfaces. |
| 3 | `Size` | Variant | `size` | no | `base` | Maps to `.c-text-link--size-<value>`. Inherits the unit's body typography ramp; pick the value that matches the surrounding copy. |
| 4 | `Weight` | Variant | `weight` | no | `regular` | Maps to `.c-text-link--weight-<value>`. Pick the value that matches the surrounding copy's weight; do not use weight to imply emphasis on its own. |
| 5 | `href` | Text | `href` | yes (when not disabled) | — | Standard `<a href>`. When `disabled: true` the attribute is omitted and `role="link"` + `aria-disabled="true"` are applied. |
| 6 | `target` | Text | `target` | no | — | Standard `<a target>`. When `target="_blank"` the template auto-derives `rel="noopener noreferrer"` and forces `iconTreatment: "external"` unless the consumer explicitly overrides it. |
| 7 | `rel` | Text | `rel` | no | — | Standard `<a rel>`. Consumer-supplied `rel` values are merged with the auto-derived `noopener noreferrer` for `target="_blank"`. |
| 8 | `Disabled` | Boolean | `disabled` | no | `false` | When `true` the link paints in `--color-disabled-text`, drops the `href`, sets `aria-disabled="true"` + `tabindex="-1"`, and keeps `role="link"` so assistive tech still announces the role. |
| 9 | `icon treatment` | Variant | `iconTreatment` | no | `none` | One of `none` / `external` / `inline`. `external` renders the canonical `arrows-navigation/simple-link-external` glyph trailing the label. `inline` requires `iconName` and accepts `iconPosition`. |
| 10 | `iconName` | Text | `iconName` | yes (when `iconTreatment: "inline"`) | — | Catalog key for `Components/Icon`. Resolved via the registered `icon` partial; the icon inherits `currentColor` so it tracks every state. |
| 11 | `iconPosition` | Variant | `iconPosition` | no | `trailing` | One of `leading` / `trailing`. Only honoured when `iconTreatment: "inline"`; `external` always trails. |
| 12 | `visited state` | Variant | `visitedState` | no | `auto` | Presentational-only — NOT exposed as a Storybook control. Mirrors the Spec Frame's `visited state: configurable` API surface. `auto` (default) lets the browser paint the visited treatment via `:visited` against the user's history; `force` paints the visited treatment unconditionally via the template's `forceVisited` boolean (story-only) → `is-visited` class — useful for SSR previews, Storybook galleries, and snapshot tests where the browser hasn't yet computed the visited match. The visible label is unchanged in either mode. |
| — | — | Boolean | `forceVisited` | no | `false` | Presentational-only (story / SSR hook). When `true`, the template adds `is-visited` to paint the visited treatment without browser history. Implements the `force` value of `visitedState`; never exposed as a Storybook control. |
| 13 | `Aria label` | Text | `ariaLabel` | no | — | Optional override of the accessible name. Required when the visible label is not self-describing (for example `Read more` adjacent to a card title). When omitted, screen readers use the visible label. |
| 14 | `id` | Text | `id` | no | — | Optional `id` attribute for in-page anchors and JS hooks. |

`Label`, `href`, `target`, `rel`, `Disabled`, `Aria label`, and `id`
mirror the canonical Figma component-properties exposed on
`1332:54878`'s component-property panel. `Background`, `Size`,
`Weight`, `icon treatment`, and `iconPosition` mirror the four Figma
variant axes plus the leading-vs-trailing icon split.

## Tokens consumed

**Typography** — the `Size` axis selects one tier of the LifeLock
body typography ramp: `--font-size-body-xs`, `--font-size-body-sm`,
`--font-size-body-base`, `--font-size-body-lg`, `--font-size-body-xl`,
`--font-size-body-2xl`, `--font-size-body-3xl` paired with their
matching `--lineheight-body-*` tokens. The `Weight` axis selects
`--font-weight-regular` (default), `--font-weight-medium`,
`--font-weight-semibold`, or `--font-weight-bold`. The unit always
inherits `--font-family-primary` (Inter Tight on LifeLock).

**Per-background colour ramp** — every state paints `color` from
the `--color-text-*` family. On `Background = Light` the link
paints `--color-text-brand` for default / hover / pressed,
`--color-text-secondary` for visited, and `--color-disabled-text`
for disabled. On `Background = Dark` the link paints
`--color-text-inverse` for default / hover / pressed and visited,
keeping `--color-disabled-text` as the disabled paint. The
underline is drawn in the rest state (mirroring the THEME=LifeLock
rendering of the shared master); hover and pressed preserve the
same colour and keep the underline, with pressed adding an opacity
dip as the tactile cue.

**Focus** — `:focus-visible` paints a 2 px outline using
`--color-border-focus` offset by `--space-1` so the ring sits
clear of the underline glyph. Focus is a wholly additive cue;
no colour shifts on focus.

**Geometry** — `--border-width-default` (1 px) sets the underline
thickness. `--space-1` (4 px) sets the focus-ring offset and the
gap between the label and the icon when an icon treatment is
present.

See `storybook-lifelock/src/tokens/typography/_typography.scss`,
`storybook-lifelock/src/tokens/colors/_colors.scss`,
`storybook-lifelock/src/tokens/spacing/_spacing.scss`, and
`storybook-lifelock/src/tokens/borders/_borders.scss` for values.

## Responsive behaviour

Text links are inline content; they reflow with their parent
container and inherit the parent's text-flow direction (LTR / RTL)
and white-space treatment. Sizes are intentionally **not**
breakpoint-responsive — pick the size that matches the surrounding
body copy at each breakpoint via the parent's typographic scale,
not via a `Breakpoint` axis on the link itself.

Two reflow rules apply to the optional icon slot:

- The icon is rendered as an inline element so it wraps with the
  preceding word. When the label wraps mid-sentence, the icon stays
  attached to the final word of the label.
- The icon never collapses to icon-only; if `iconTreatment` is
  set, a `Label` is still required and the icon paints alongside
  the visible text.

The component does not impose a maximum width — it inherits its
container's width. Authors composing text links inside narrow
columns should rely on the parent's `overflow-wrap: break-word`
treatment; the unit does not own that decision.

## States

The component supports the five canonical interaction states plus
the browser-managed visited state. Mechanism per
[`component-anatomy.mdc`](../../../../.cursor/rules/component-anatomy.mdc) §
"Five-dimension taxonomy":

- **Default** — brand-coloured text with a rest-state underline
  (`--border-width-default` thickness, `0.2em` offset), matching
  the THEME=LifeLock rendering of the shared master. Mechanism:
  base styling on `.c-text-link`.
- **Hover** — underline persists; no colour shift. Mechanism:
  `:hover` pseudo-class.
- **Focus** — 2 px outline ring using `--color-border-focus`,
  offset by `--space-1`. Underline is also drawn so the link still
  reads as a link when keyboard-focused before any pointer enters.
  Mechanism: `:focus-visible` pseudo-class.
- **Pressed** — underline persists; opacity drops to `0.85` to give
  a tactile cue without a colour shift. Mechanism: `:active`
  pseudo-class.
- **Disabled** — link paints `--color-disabled-text`, the `href`
  attribute is omitted, `aria-disabled="true"` and `tabindex="-1"`
  are applied, and `pointer-events: none` is set so the cursor
  matches the unavailable affordance. Mechanism: `disabled`
  boolean prop. The `[aria-disabled="true"]` attribute selector
  carries the disabled paint.
- **Visited** — paints `--color-text-secondary` on `Background =
  Light` (a softer brand-adjacent grey) and stays
  `--color-text-inverse` on `Background = Dark`. Mechanism:
  `:visited` pseudo-class. Authors can force the visited treatment
  in Storybook via the `is-visited` class, but the runtime CSS
  honours the browser's history.

Hover-and-focus together compound their treatments — a focused
link being hovered shows both the focus ring and the underline.

## Accessibility

_Treat accessibility as part of the component contract — not a finishing touch._

- Ensure sufficient contrast between link text and surrounding
  content.
- Preserve visible focus indicators for keyboard navigation.
- Do not rely on color alone to communicate interactivity.
- Provide accessible names for icon-only or external-link
  treatments.
- Ensure touch targets meet minimum size requirements where links
  appear in mobile layouts.

### Implementation notes

The five canonical bullets above are the canonical Spec-Frame-owned
contract. The implementation honours each principle through the
following code mechanisms — these are non-conflicting elaborations
that document **how** the principles are met in this unit; they do
not override the Spec Frame's authoritative content above:

- **Semantic element** — always renders an `<a>` element. When
  `disabled: true` the `href` attribute is dropped to prevent
  navigation; the link keeps `role="link"` so assistive tech still
  announces the role.
- **Disabled handling** — `aria-disabled="true"` + `tabindex="-1"`
  on disabled links removes them from the keyboard tab order while
  preserving their semantic identity. Pointer events are blocked
  via CSS so click handlers also fire-no-op.
- **Focus management** — `:focus-visible` only — the focus ring
  does not appear on mouse-down. Ring colour
  (`--color-border-focus`) meets WCAG 2.2 AA contrast against both
  light and dark canvas surfaces.
- **Contrast** — every paint listed in
  [`## Tokens consumed`](#tokens-consumed) meets WCAG 2.2 AA at
  the `--font-size-body-base` ramp tier. The `xs` and `sm` tiers
  are below the WCAG large-text threshold and therefore must meet
  the stricter 4.5:1 contrast ratio; LifeLock's brand colours pass
  this on both backgrounds.
- **Underline as non-colour cue** — the underline is drawn in the
  rest state, satisfying WCAG 1.4.1 (Use of Colour) without
  relying on the brand-colour divergence alone. This matches the
  THEME=LifeLock rendering of the shared master (resolved
  2026-06-11; the earlier interaction-only underline matched the
  White Label mode).
- **Touch target** — the rendered `<a>` does not extend its hit
  area past the visible text; the underline is the only affordance
  cue. When stacking links in a list (for example a compact
  footer-link list), authors should use `Components/Link list`
  rather than packing standalone `Components/Text link` instances
  to maintain the WCAG 2.5.5 24 px minimum target size.
- **Reduced motion** — the underline appears instantly with no
  transition. The pressed-state opacity transition is shorter than
  120 ms so it complies with `prefers-reduced-motion: reduce`
  without an explicit override.
- **`aria-label` policy** — when the visible label is not
  self-describing (for example `Read more` adjacent to a card
  title), authors must set `ariaLabel` to a fully qualified phrase
  such as `Read more about identity-theft protection` so the
  screen-reader announcement is unambiguous in isolation.

## Design intent

`Components/Text link` exists for one reason: to let authors
embed an interactive navigation cue inside running content
without changing the typographic rhythm of the surrounding copy.
It is intentionally lower-emphasis than `Components/Button` — a
text link must feel native to the paragraph it lives in.

Three deliberate non-goals scope the unit:

- **Not a button**. Text links never carry actions that mutate
  state (form submit, modal open, dialog confirm). Those belong
  on `Components/Button`. If a designer asks for a text-styled
  button, the answer is `Type=Text` on `Components/Button`.
- **Not a navigation primitive**. Text links never appear in
  primary navigation surfaces (header, footer, side-nav).
  `Components/Nav link` and `Components/Link list` own those
  contexts and ship richer interaction states (current,
  selected, expanded).
- **Not stylable per-instance**. Authors compose with the four
  variant axes; they do not override colour, weight, or size via
  utility classes. The four-axis matrix is intentionally
  exhaustive so every legitimate use-case is expressible without
  custom CSS.

The Light / Dark `Background` axis exists because the four
LifeLock canvas families
(`primary` / `secondary` / `inverse` / `cta`) split into two
contrast families — every dark-canvas use of an inline link
collapses onto the same paint ramp regardless of which dark
canvas surface it sits on, so a single `dark` modifier covers
the whole family.

## Anatomy

_The four pieces every text link should expose._

1. A concise and descriptive text label.
2. A visual treatment that communicates interactivity.
3. A focus state for keyboard and assistive technology users.
4. Optional external-link or contextual icon treatment when
   required.

## Behaviour

_Configurable surfaces and runtime defaults the implementation should expose._

- Text links should support hover, focus, active, and visited states
  where applicable.
- Links should wrap naturally within multiline body content without
  breaking layout rhythm.
- Interactive styling should remain visible and distinguishable from
  surrounding text.
- External destinations may expose optional icon treatments or
  accessible helper text.
- Disabled links should not appear interactive or receive focus.
- Keyboard users must be able to navigate and activate links using
  standard browser behaviors.

## Content guidance

_How writers and content authors should populate breadcrumb labels._

- Use descriptive link text that communicates destination or
  outcome.
- Avoid generic labels like "click here" or "learn more" without
  context.
- Keep link labels concise and scannable within surrounding copy.
- Ensure links make sense when read independently by assistive
  technologies.
- Avoid over-linking dense paragraphs or turning entire sentences
  into links.

## Design system definition

_How the text link fits into the wider design system contract._

Text links are foundational navigation primitives used throughout
the product ecosystem. They support lightweight interaction
patterns within content-heavy experiences and complement
higher-emphasis entities like buttons and navigation components. In
implementation terms, text links should balance readability,
discoverability, accessibility, and consistent interaction
behavior across typography scales, themes, and layouts.

## Figma source

- Master variant set on
  [Web-ODS Shared Library / 1332:54878](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-54878&m=dev)
  (336 published variants — `2 x 6 x 7 x 4`).
- Canonical canvas
  [Text link / 1332:54772](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-54772&m=dev).
- Companion
  [Spec frame / 1332:54773](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-54773&m=dev)
  (governs every Spec-Frame-owned H2 above).
- Trailing icon glyph (when `iconTreatment: "external"`):
  `arrows-navigation/simple-link-external` from
  [Foundations-Iconography](https://www.figma.com/design/OKdhUs9kW8rEP4TnBDU8Se/Foundations-Iconography).

## Notes & open questions

- The `state: visited` treatment uses `--color-text-secondary` on
  `Background = Light` as a pragmatic substitute for a dedicated
  `--color-text-visited` token. If product analytics later show a
  meaningful "this is a re-visit" comprehension gap, designer
  follow-up: introduce `--color-text-visited` as a first-class
  token rather than overloading `--color-text-secondary`.
- The `Pressed` state currently lives on `:active` only. If
  product analytics later show users want a sticky "currently
  navigating" treatment, designer follow-up: add an
  `is-pressed` class hook so the state can be JS-controlled
  during async navigation.
- The Spec Frame's `## Component configuration` table lists 7
  rows (`href`, `target`, `rel`, `disabled`, `icon treatment`,
  `visited state`, `aria label`) using a 3-column shape (Property
  / Description / Value-or-example). The implementation's `##
  Properties` table follows
  [`component-anatomy.mdc`](../../../../.cursor/rules/component-anatomy.mdc) §
  Rule 7, which mandates 7 columns (# / Figma label / Content
  type / Code identifier / Required / Default / Notes), and
  carries 14 rows because it also enumerates the Figma variant
  axes (`Background`, `Size`, `Weight`) plus the
  implementation-required composition props (`Label`, `iconName`,
  `iconPosition`, `id`) that the Spec Frame's API-surface view
  intentionally omits. Designer follow-up: confirm whether the
  Spec Frame's 3-column shape is canonical for cross-package
  reuse, or whether a future Spec Frame revision should expand
  to the Rule 7 column set so the two surfaces converge.
- The Spec Frame's `visited state: configurable` row lands in
  the implementation as the `visitedState: "auto" | "force"`
  property. `auto` (default) defers to the browser's `:visited`
  pseudo-class against the user's history; `force` paints the
  visited treatment unconditionally via the `is-visited` class
  for SSR previews, Storybook galleries, and snapshot tests
  where the browser hasn't yet computed the visited match.
  Designer follow-up: review whether `force` should expose a
  per-instance opt-in mechanism beyond the existing
  Storybook-only `forceVisited` arg (e.g. a runtime API call) if
  product analytics later show a meaningful demand for
  authored-visited paints outside Storybook.
- The Spec Frame instance `1332:54773` lacks a published
  template parent (`mainComponentId`); it is a hand-built
  `<frame>` rather than an `<instance>` of a published
  `Spec frame` Figma component template per
  [`figma-spec-frame.mdc`](../../../../.cursor/rules/figma-spec-frame.mdc) §
  "Template discovery". Until the template is published in
  Web-ODS Shared Library and bootstrapped via
  `figma-snapshots/template-spec-frame.manifest.json`, the
  unit's Stage 0 fingerprint-driven re-syncs stay back-compat:
  `f2p-sync-figma-spec` short-circuits with `verdict:
  no-spec-frame` against the empty template row, and manual
  Spec Frame mirrors (like this one) carry a hash-only
  fingerprint computed from the instance's `get_metadata`
  response rather than from a template comparison.
- The Spec Frame's `## Recommended anatomy` "four pieces"
  body resolves cleanly against the LifeLock implementation:
  the **text label** is the `label` prop, the **visual
  treatment** is the per-state colour ramp + underline, the
  **focus state** is the `:focus-visible` outline, and the
  **optional icon treatment** is the `iconTreatment` slot. No
  reconciliation needed.
- The Spec Frame's `## Content guidance` `breadcrumb labels`
  phrasing in the section subtitle is a clear copy-paste
  artefact from a sibling `Components/Breadcrumb` Spec Frame —
  the bullet body is correctly scoped to text-link labels.
  Designer follow-up: re-author the subtitle to read "How
  writers and content authors should populate text-link
  labels" so the section's intent is unambiguous.
