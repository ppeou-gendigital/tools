---
type: component
name: divider
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "539:28432"
status: draft
composes: []
tokensConsumed:
  - --color-border-strong
  - --color-border-inverse
  - --border-width-hairline
  - --border-width-default
  - --border-width-emphasis
  - --space-3
  - --space-4
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
LifeLock-themed master variant sets on
[Web-ODS-Shared-Library / 539:28432](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28432&m=dev) —
the `Dividers 🟢` page hosts three sibling published variant sets
(`Divider / Horizontal`, `Divider / Vertical`, `Divider / Label`)
totalling 80 buildable variants. The three Figma sibling sets fold
onto **one** `.c-divider` BEM block by collapsing Figma's
"Divider treatment" into a single orthogonal `layout` axis.

## Summary

`Components/Divider` is the LifeLock content-separation primitive. The
`horizontal` variant paints a full-width horizontal rule between
stacked content blocks; the `vertical` variant paints a single inline
rule between horizontally-arranged content; the `label` variant paints
a horizontal rule with centred text breaking the line ("Or", "And",
"Section title") — used for visual sectioning that needs a name.
Four sizes (`xs` / `s` / `m` / `l`) ladder the rule weight from a
1 px hairline up to a 4 px emphasis weight; the boolean `inverse`
axis swaps the rule paint from `--color-border-strong` to
`--color-border-inverse` for use on dark surfaces. The `label`
variant adds a `typography` axis that selects among eight LifeLock
typography tokens for the centred label.

The Figma master ships three sibling sets totalling **80 variants**:
8 horizontal (`Size × Inverse`), 8 vertical (`Size × Inverse`), and
64 label (`Size × Inverse × Typography`). All 80 fold onto one
`.c-divider` BEM block via the four-axis collapse described in
§ "Variant axes" below.

## Composes

Composes: none.

## Variant axes

| Axis | Values |
|---|---|
| `layout` | `horizontal` (default — full-width horizontal rule painted as a `border-block-start` on a block-level root) / `vertical` (inline rule painted as a `border-inline-start` on an inline-block root sized by its parent's cross axis) / `label` (horizontal rule with centred text — root paints as an inline-flex row of `__rule--start` + `__label` + `__rule--end`). Drives the `.c-divider--<layout>` BEM modifier. Folds Figma's three sibling variant sets (`Divider / Horizontal`, `Divider / Vertical`, `Divider / Label`) onto one orthogonal axis. |
| `size` | `xs` (1 px hairline rule weight) / `s` (default — 2 px default rule weight) / `m` (3 px rule weight — literal pixel value, no matching design-system token, see § "Notes & open questions") / `l` (4 px emphasis rule weight). Drives the `.c-divider--size-<size>` BEM modifier. Mirrors Figma's `Size` axis on each sibling set. |
| `inverse` | `false` (default — rule paint binds to `--color-border-strong`, lifelock-green) / `true` (rule paint binds to `--color-border-inverse`, white). Drives the `.c-divider--inverse` BEM modifier (no value suffix — boolean). Mirrors Figma's `Inverse` axis. |
| `typography` | `body-sm-regular` (default — `--font-size-body-sm` + `--font-weight-regular`) / `body-sm-semibold` / `body-base-regular` / `body-base-semibold` (`--font-size-body-base` + `--font-weight-semibold`) / `body-lg-regular` / `body-lg-bold` (`--font-size-body-lg` + `--font-weight-bold`) / `h6-medium` (`--font-size-h6` + `--font-weight-medium`) / `h5-bold` (`--font-size-h5` + `--font-weight-bold`). Drives the `.c-divider--typography-<typography>` BEM modifier. **Combinatorial only when `layout=label`** — the modifier is built on every render for shape consistency, but only `.c-divider--label` consumes a `.c-divider__label` element where the typography paint applies. Mirrors Figma's `Typography` axis on the `Divider / Label` sibling set. |

Buildable variant count = `(2 horizontal-only sizes-without-typography × 2 inverse) + (2 vertical-only sizes-without-typography × 2 inverse) + (4 sizes × 2 inverse × 8 typography for label)` — but the canonical Figma master ships **80 variants** across the three sibling sets (8 + 8 + 64). The code mirror builds all four axes uniformly so consumers can render any (`layout × size × inverse × typography`) tuple; non-label layouts ignore `typography` because no `.c-divider__label` element renders.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Layout | VARIANT | `layout` | no | `"horizontal"` | One of `horizontal` / `vertical` / `label`. Drives the `.c-divider--<layout>` BEM modifier; selects which inner DOM the template renders (no element for horizontal / vertical, three-span flex row for label). |
| 2 | Size | VARIANT | `size` | no | `"s"` | One of `xs` / `s` / `m` / `l`. Drives the `.c-divider--size-<size>` BEM modifier. Maps Figma's rule-weight scale onto LifeLock's `--border-width-*` tokens (xs → `hairline`, s → `default`, l → `emphasis`); `m` falls back to the literal `3px` value because LifeLock's border-width ladder jumps `2 → 4` with no 3 px token — see § "Notes & open questions" for the gap discussion. |
| 3 | Inverse | VARIANT | `inverse` | no | `false` | Boolean. When `true`, drives the `.c-divider--inverse` BEM modifier and the rule paint binds to `--color-border-inverse` (white) for use on dark surfaces. When `false` (default), the rule paint binds to `--color-border-strong` (lifelock-green). |
| 4 | Typography | VARIANT | `typography` | no (when `layout = label`) | `"body-sm-regular"` | One of `body-sm-regular` / `body-sm-semibold` / `body-base-regular` / `body-base-semibold` / `body-lg-regular` / `body-lg-bold` / `h6-medium` / `h5-bold`. Drives the `.c-divider--typography-<typography>` BEM modifier. Combinatorial **only when `layout = label`** — the modifier renders on every variant but only `.c-divider--label` consumes a `.c-divider__label` element where the typography paint applies. Ignored when `layout ∈ {horizontal, vertical}`. |
| 5 | Label | TEXT | `label` | yes (when `layout = label`) | `"Or"` | Text content rendered inside `.c-divider__label`. Default `"Or"` mirrors the most common Figma authoring (between two stacked input groups on a sign-in form). Authors keep this to a short word or short phrase (≤ 24 characters) — longer labels reflow inside the flex centre and the two flanking rules shrink accordingly. Ignored when `layout ∈ {horizontal, vertical}`. |
| — | — | String | `accessibleLabel` | no | `""` | Optional override for screen-reader announcement. When set, the root `<div>` carries `aria-label="{{accessibleLabel}}"`; when unset (the typical case), the root carries `role="separator"` and the screen reader announces the implicit "separator" role with no name. For `layout = label`, the visible label text inside `.c-divider__label` is the accessible name without needing this override — screen readers read the text node verbatim. |

## Tokens consumed

**Structural** — every variant paints a single rule weight via one of
`--border-width-hairline` (1 px, `xs`), `--border-width-default`
(2 px, `s`), a literal `3px` (`m`, see § "Notes & open questions"),
or `--border-width-emphasis` (4 px, `l`). The `horizontal` layout
paints the rule as a `border-block-start` on a block-level root that
spans the full inline size of its container; the `vertical` layout
paints the rule as a `border-inline-start` on an inline-block root
that sizes to its parent's cross axis (consumers wanting a specific
vertical height set a `block-size` on the parent); the `label`
layout paints two pseudo-rules via `border-block-start` on two
`.c-divider__rule` flex children flanking the centred
`.c-divider__label`, with `gap: var(--space-3)` between the rules
and the label.

**Color** — rule paint binds to `--color-border-strong` (LifeLock
green via Layer 2 `Color/Border/primary`) by default and flips to
`--color-border-inverse` (white via Layer 2 `Color/Border/inverse`)
when `inverse=true`. The label text paint inherits its surrounding
content paint (`currentColor`) — consumers wanting a custom label
color set a `color` on the parent context rather than the divider
itself.

**Typography (label variant only)** — `.c-divider__label` paints
`--font-family-primary` always; size / line-height / letter-spacing /
weight resolve per the `typography` axis:

| Typography | Font size | Line height | Letter spacing | Font weight |
|---|---|---|---|---|
| `body-sm-regular` (default) | `--font-size-body-sm` (14 px) | `--lineheight-body-sm` (22 px) | `--letterspacing-body-sm` | `--font-weight-regular` (400) |
| `body-sm-semibold` | `--font-size-body-sm` | `--lineheight-body-sm` | `--letterspacing-body-sm` | `--font-weight-semibold` (600) |
| `body-base-regular` | `--font-size-body-base` (14 / 16 px) | `--lineheight-body-base` | `--letterspacing-body-base` | `--font-weight-regular` |
| `body-base-semibold` | `--font-size-body-base` | `--lineheight-body-base` | `--letterspacing-body-base` | `--font-weight-semibold` |
| `body-lg-regular` | `--font-size-body-lg` (16 / 18 px) | `--lineheight-body-lg` | `--letterspacing-body-lg` | `--font-weight-regular` |
| `body-lg-bold` | `--font-size-body-lg` | `--lineheight-body-lg` | `--letterspacing-body-lg` | `--font-weight-bold` (700) |
| `h6-medium` | `--font-size-h6` (24 px) | `--lineheight-h6` (30 px) | `--letterspacing-h6` | `--font-weight-medium` (500) |
| `h5-bold` | `--font-size-h5` (24 / 28 px) | `--lineheight-h5` | `--letterspacing-h5` | `--font-weight-bold` |

See [`storybook-lifelock/src/tokens/colors/_colors.scss`](../../tokens/colors/_colors.scss)
for the canonical Layer 2 border semantic declarations,
[`storybook-lifelock/src/tokens/borders/_borders.scss`](../../tokens/borders/_borders.scss)
for the role-keyed border-width primitives, and
[`storybook-lifelock/src/tokens/typography/_typography.scss`](../../tokens/typography/_typography.scss)
for the role-keyed type ramp.

## Responsive behaviour

Divider is a **layout-aware** primitive — the `horizontal` and
`label` layouts both paint `inline-size: 100%` so the root spans the
full content width of its parent without consumers having to set a
width. The `vertical` layout paints `inline-size: <rule-width>` +
`block-size: 100%` so the root sizes to its parent's cross axis;
consumers placing a vertical divider between two flex-row siblings
typically set `align-items: stretch` on the parent so the divider
fills the row's intrinsic height.

There is no per-breakpoint `layout` or `size` axis — divider paints
identically at every band. Logical properties (`border-block-start`
on `horizontal` and `label`; `border-inline-start` on `vertical`)
keep the geometry RTL-safe; the inline-flex centring on `label`
survives direction flips with no overrides.

The `label` variant's typography axis paints through the LifeLock
typography token ramp, which itself carries a binary 1024 px
breakpoint switch (per
[`storybook-lifelock/src/tokens/typography/spec.md`](../../tokens/typography/spec.md)
§ "Breakpoint model"). A `typography = body-base-regular` label
renders at 14 px below 1024 px and 16 px at 1024 px and up — the
divider's `.c-divider__label` element inherits the active token
value via `var(…)` without the divider unit declaring any media
queries of its own.

## States

| State | Mechanism | Notes |
|---|---|---|
| `default` | absence of any pseudo-class / runtime class | The only paint state Divider ships. |

Divider is **stateless** — no `hover` / `focus` / `pressed` /
`disabled` paints, no JavaScript. It is a presentation-only molecule
that separates surrounding content rather than being a target of
interaction itself. Consumers wanting an interactive divider (e.g. a
resizable split between two panes) should compose a different
primitive — Divider stays small precisely because it doesn't carry
state machinery.

## Accessibility

- **Implicit `role="separator"`.** The root `<div>` carries
  `role="separator"` so screen readers announce the rule as a
  semantic divider rather than a generic container. The
  `aria-orientation` attribute matches the layout: `"horizontal"`
  for `layout ∈ {horizontal, label}`, `"vertical"` for
  `layout = vertical`. Mirrors the Figma `Spec Frame` (`1344:2332`)
  § Accessibility region recommendation verbatim.
- **`layout = label`** — the visible label text inside
  `.c-divider__label` is the accessible name. Screen readers read
  the label verbatim alongside the implicit separator role
  ("separator, Or"). No `aria-label` override is needed; consumers
  wanting different announce text from the visible text override
  via the optional `accessibleLabel` prop.
- **`layout ∈ {horizontal, vertical}`** — divider has no visible
  text. Screen readers announce just the implicit role
  ("separator") with no name. When the surrounding context needs
  more semantic richness (e.g. a divider between two list sections
  that each have their own heading), consumers should rely on the
  surrounding headings + landmark structure rather than burdening
  the divider with `aria-label` boilerplate.
- **Contrast.** The default rule paint
  (`--color-border-strong`, LifeLock dark-green `#2f303c`) clears
  WCAG 1.4.11's 3:1 non-text contrast floor against every
  canonical light surface (`--color-bg-default`,
  `--color-bg-subtle`, `--color-bg-brand-soft`). The
  `inverse = true` paint (`--color-border-inverse`, white) clears
  3:1 against every canonical dark surface
  (`--color-bg-inverse-strong`, `--color-bg-brand`). The
  `xs / 1 px` rule is the lowest-mass paint in the matrix —
  prefer `s` or `m` on busier surfaces where the rule needs to
  read at glance.
- **No focus ring.** Divider is non-interactive (no `:hover` /
  `:focus-visible` paints). Consumers should never make a bare
  divider keyboard-focusable.
- **Reduced motion.** No transitions or animations ship on this
  component, so `prefers-reduced-motion: reduce` is a no-op.

## Design intent

The Divider primitive solves the cross-cutting "I need a thin
visual rule between sections" problem in one place — a horizontal
rule between two cards, a vertical rule between two columns, an
"Or" separator between two sign-in options. Splitting it into three
layouts under one BEM block keeps the molecule's footprint tiny
while letting every host pick the right shape: a `horizontal` rule
for stacked content, a `vertical` rule for horizontally-arranged
content, a `label` rule for visual sectioning that needs a name.

Four sizes give designers a ladder from the lightest possible visual
weight (a 1 px hairline, suitable for compact tables and dense
forms) up to a 4 px emphasis weight (suitable for high-contrast
section breaks on a marketing landing page). The boolean `inverse`
axis covers the dark-surface case in one toggle rather than asking
designers to invent a separate `inverse-divider` component.

The eight-typography axis on the `label` variant covers the full
LifeLock label ramp from a compact `body-sm-regular` annotation up
to an `h5-bold` section heading — the same axis a heading-style
divider needs to compose seamlessly with the surrounding typography
scale. Consumers building a "section title with rules" affordance
(common in marketing and pricing layouts) pick the typography that
matches the surrounding heading hierarchy.

The deliberate non-goals are as important as the goals.
**No interaction.** Divider never paints `:hover` /
`:focus-visible` / `:active` — wrapping it in an interactive control
is the right posture when interaction is needed. **No color axis.**
The rule paint is one of two semantic tokens (`strong` /
`inverse`) — consumers wanting brand-coloured rules or signal-tinted
rules should compose a different primitive or override paint on the
container, not ask Divider to grow a color axis. **No dashed or
dotted axis.** The Figma master ships solid rules only;
non-solid stroke styles are typically a sign the surface needs a
different visual treatment (a tab strip, a state indicator) rather
than a divider.

## Figma source

- Canonical `Divider / Horizontal` master variant set
  (Web-ODS Shared Library, `fileKey: 0o8SL5BEk8wHtgud00dRyg`):
  [`1344:2031`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1344-2031&m=dev) —
  8 variants (`Size × Inverse`).
- Canonical `Divider / Vertical` master variant set:
  [`1344:2052`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1344-2052&m=dev) —
  8 variants (`Size × Inverse`).
- Canonical `Divider / Label` master variant set:
  [`1344:2073`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1344-2073&m=dev) —
  64 variants (`Size × Inverse × Typography`).
- `Dividers 🟢` page-level CANVAS hosting all three sibling sets:
  [`539:28432`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28432&m=dev).
- Designer-authored `Spec frame` instance for this unit
  (informational — the Spec Frame template row in
  `figma-import-index.md` is empty so Stage 0 short-circuits with
  `verdict: no-spec-frame`; the instance content nonetheless
  informed the prose in this spec):
  [`1344:2332`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1344-2332&m=dev) —
  `Divider — Overview` with 11 named sections (`Purpose`,
  `Anatomy`, `Variants`, `Behavior`, `Spacing guidance`,
  `Accessibility`, `Content guidance`, `Design principles`,
  `Specification summary`, `Dos and don'ts`, `Variant inventory`).
- LifeLock theme mode for Variable value resolution lives on
  [Web-ODS-Theme](https://www.figma.com/design/Nshd9ukxIzpeUnzOXiWxUP/Web-ODS-Theme).
  The Layer 2 Border semantic aliases on `Web-ODS-Theme`
  (`Color/Border/primary` → `--color-border-strong`,
  `Color/Border/inverse` → `--color-border-inverse`) are the
  upstream of the divider's rule paint.

## Notes & open questions

- **3 px rule weight (`size = m`) is a token gap.** LifeLock's
  `--border-width-*` ladder declared in
  [`storybook-lifelock/src/tokens/borders/spec.md`](../../tokens/borders/spec.md)
  ships `hairline` (1 px), `default` (2 px), `emphasis` (4 px) —
  there is **no 3 px token** because the underlying Figma primitive
  scale skips 3 px (`border-width/{0,1,2,4,6,8}`). Divider's
  `size = m` ships the 3 px Figma value as a **literal pixel value**
  (`border-block-start-width: 3px;` rather than `var(--border-width-…)`)
  rather than triggering the formal token-gap AskQuestion round per
  [`spec-driven-sync.mdc#token-gaps`](../../../../.cursor/rules/spec-driven-sync.mdc#token-gaps),
  which only fires when spec.md references an **undeclared
  `--token-name`** (this is a missing token, not a missing
  reference). The Figma fidelity is preserved either way. **Designer
  follow-up:** consider whether to (a) drop `size = m` from
  LifeLock's axis and ship 3 sizes only, or (b) add a
  `--border-width-medium` (3 px) token to the canonical
  `border-width/*` Figma primitive scale and re-route the literal
  here. Option (b) lets the divider's three rule-bearing layouts
  consume a single token family with no carve-outs.
- **Typography axis is label-only.** The Figma `Divider / Horizontal`
  and `Divider / Vertical` sibling sets don't carry a `Typography`
  axis (no label content slot exists on those layouts), but the
  code mirror builds the `.c-divider--typography-<typography>`
  modifier on every render for shape consistency. The modifier is
  inert on `horizontal` / `vertical` — no `.c-divider__label`
  element renders, so no typography token consumes. This is a
  harmless redundancy that keeps the BEM class set uniform across
  layouts; alternative would be to gate the modifier render on
  `layout = label` which adds template branching for no visual
  benefit.
- **Vertical divider sizing posture.** The `vertical` layout paints
  `block-size: 100%` so the rule sizes to its parent's cross axis,
  but this only works inside a parent that establishes an intrinsic
  cross-axis size — typically a flex row with
  `align-items: stretch` or an explicit `block-size` on the parent.
  Consumers placing a vertical divider in an inline-flow context
  (between two inline-block siblings) should either wrap the
  divider in a sized container or use a `horizontal` divider
  rotated visually. Document this constraint in the gallery story
  prose so authors don't try to use vertical dividers in
  unsupported contexts.
- **No `dashed` / `dotted` stroke axis.** The Figma master ships
  solid rules only across all three sibling sets. If a future use
  case requires a dashed or dotted rule (e.g. a tear-line affordance
  on a coupon card, a placeholder rule on an empty list), surface
  it as a designer follow-up to either add a `stroke` axis to the
  Figma master or compose a different primitive — adding `stroke`
  to the existing 80-variant set would multiply variant count past
  the advisory cap in
  [`component-anatomy.mdc`](../../../../.cursor/rules/component-anatomy.mdc)
  § "Variant axis ordering and cap".
- **`label` variant centred alignment vs leading alignment.** The
  Figma master ships every `label` variant with the label centred
  between two equal-length flanking rules. Some marketing layouts
  prefer a leading-aligned label ("Section title ──────") with a
  full-width trailing rule. Surface as a designer follow-up to
  confirm whether a future `alignment` axis (`center` / `start` /
  `end`) is in scope; today, code mirrors Figma's centred-only
  posture exactly.
