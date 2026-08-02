---
type: component
name: label
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1408:443"
status: draft
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
  - --border-radius-pill
  - --space-1
  - --space-3
  - --font-family-primary
  - --font-weight-regular
  - --font-size-body-xs
  - --lineheight-body-xs
  - --letterspacing-body-xs
---

# Label

Compact pill component for tagging, categorisation, and lightweight
metadata. Mirrors the LifeLock-themed master variant set on
[Web-ODS Shared Library / 1408:443](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1408-443&m=dev)
— the master component set containing 44 published variants
(11 `Background` × 4 `Variant` transparency stops) plus the dedicated
Spec Frame at
[`2331:287`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2331-287&m=dev)
that documents the full design intent. The 11-colour ladder folds
across four emphasis levels (a solid surface plus three
opacity-dimmed transparencies) onto one `.c-label` BEM block.

## Summary

`Components/Label` is the LifeLock tagging primitive — a small pill
carrying a short text string with an optional leading icon. Unlike
`Components/Badge`, every Label variant carries readable text content
(no `dot` variant) and the colour ladder maps onto LifeLock's
surface-role tokens (`Background/{primary, secondary, brand,
brand-soft, accent, alpha, beta, gamma, delta, inverse,
inverse-strong}`) rather than the Signal semantic family. The pill
geometry is fixed: `padding: var(--space-1) var(--space-3)`,
`border-radius: var(--border-radius-pill)`, body-xs Regular
typography (12 px). Optional leading icon renders at 16 px and
inherits the label's content paint via `currentColor`. Four
`Variant` stops (`Solid` / `Transparent-30` / `Transparent-50` /
`Transparent-80`) flip the surface opacity from 100 % down to
30 / 50 / 80 % via `color-mix(in srgb, <bg> <stop>%, transparent)`,
while content paint stays fully opaque so readability is preserved
across every stop. Buildable variant count = `11 × 4 = 44` — every
combination ships on the Figma master.

## Composes

Composes: `icon`.

The leading icon slot composes the registered `icon` partial (no
inline SVG, no consumer-side `mask-image`) per
[`src/components/icon/spec.md`](../icon/spec.md) §
"Composition rules for consumers". The icon renders at 16 × 16 px
with `color="current"` so it inherits the label's content paint via
`currentColor` — no per-Background icon-color overrides are needed.
Consumers can either pass `showIcon=true` + an `icon` catalog key
(e.g. `"actions/simple-add"`) to opt in to the icon slot, or omit
both for a text-only pill.

## Figma description

> Label — compact pill for tagging, categorisation, and lightweight
> metadata. 11 backgrounds × 4 emphasis stops = 44 variants. All
> fills, padding, radius, typography, and per-emphasis opacity bind
> to Web-ODS Theme Variables and re-skin across White Label /
> other brand / LifeLock / other brand brand modes. Optional leading icon
> inherits the label's content paint.

Quoted from the canonical `Label` master variant set on Web-ODS
Shared Library
([`1408:443`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1408-443&m=dev)).
The LifeLock code mirror folds the multi-brand framing down to the
LifeLock theme — variable references resolve through
[`storybook-lifelock/src/tokens/colors/_colors.scss`](../../tokens/colors/_colors.scss)
Layer 2 surface-role aliases (`--color-bg-{default, subtle, brand,
brand-soft, accent, alpha, beta, gamma, delta, inverse,
inverse-strong}`) plus the LifeLock content / inverse text pair.

## Variant axes

| Axis | Values |
|---|---|
| `background` | `primary` / `secondary` / `brand` / `brand-soft` / `accent` / `alpha` / `beta` / `gamma` / `delta` / `inverse-primary` / `inverse-secondary`. Drives the `.c-label--background-<background>` BEM modifier. Mirrors Figma's `Background` axis on `1408:443`. The 11 values map 1:1 onto LifeLock's surface-role tokens (`--color-bg-*` Layer 2 aliases). |
| `variant` | `solid` (default — 100 % opaque surface) / `transparent-30` / `transparent-50` / `transparent-80`. Drives the `.c-label--variant-<variant>` BEM modifier. Mirrors Figma's `Variant` axis on `1408:443`. Implemented as `color-mix(in srgb, <bg> <stop>%, transparent)` so the surface dims while content paint stays at full opacity. |

All 44 `(background × variant)` combinations are buildable and all
ship on the Figma master.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Background | VARIANT | `background` | no | `"primary"` | One of `primary` / `secondary` / `brand` / `brand-soft` / `accent` / `alpha` / `beta` / `gamma` / `delta` / `inverse-primary` / `inverse-secondary`. Drives the `.c-label--background-<background>` BEM modifier and selects the surface paint + matching content paint from the per-background paint table. |
| 2 | Variant | VARIANT | `variant` | no | `"solid"` | One of `solid` / `transparent-30` / `transparent-50` / `transparent-80`. Drives the `.c-label--variant-<variant>` BEM modifier. Surface paint dims via `color-mix` to 100 / 30 / 50 / 80 %; content paint always stays opaque. |
| 3 | Text | TEXT | `text` | yes | `"label"` | The visible pill content rendered inside `.c-label__text`. Authors should keep this short (1–3 words / ≤ 20 chars) — long values still render but the pill will not wrap, instead growing horizontally. Bound to `--font-family-primary` + `--font-weight-regular` + `--font-size-body-xs` (12 px) + `--lineheight-body-xs` (18 px in LifeLock-mode; see § "Notes & open questions" re. the 16-vs-18 px line-height mismatch). |
| 4 | Show icon | BOOLEAN | `showIcon` | no | `false` | When `true`, renders a leading 16 × 16 px icon via the registered `icon` partial. When `false`, the icon slot is omitted entirely (no empty `<span>`, no padding). Equivalent to Figma's optional `Icon` slot toggle. |
| 5 | Icon | INSTANCE_SWAP | `icon` | no (`showIcon` only) | `"actions/simple-add"` | Catalog key passed to `iconUrl()` (e.g. `"info/simple-info"`, `"device/simple-vehicle"`). The icon partial paints in `currentColor` so it inherits the label's content paint — no per-Background icon-color overrides. Ignored when `showIcon = false`. |

## Tokens consumed

**Structural** — every variant paints
`border-radius: var(--border-radius-pill)` (9999 px — at the
22 px-tall pill this resolves to a perfect capsule), pads to
`var(--space-1) var(--space-3)` (2 px block / 8 px inline), and
inline-flex-centers its content slot. The icon slot ships a
`var(--space-1)` gap (2 px) between the icon and the text.

**Typography** — pill content reads `--font-family-primary` (LifeLock
mode resolves to Inter Tight; Figma's authored `font/family/label`
binds to Lexend on the source — the brand-mode swap is intentional)
+ `--font-weight-regular` (400) + `--font-size-body-xs` (12 px) +
`--lineheight-body-xs` (18 px) + `--letterspacing-body-xs`
(`0.02em`). The icon inherits `currentColor`.

**Per-background paint** — surface fill (`bg`) and content paint
(`content`) are picked per `background` from LifeLock's Layer 2
surface-role tokens; the four `variant` stops only affect the
surface opacity (via `color-mix`), never the content paint.

| Background | Surface fill | Content paint |
|---|---|---|
| `primary` | `--color-bg-default` (`#fff` white) | `--color-text-primary` (LifeLock dark green) |
| `secondary` | `--color-bg-subtle` (`#f8f8f7` near-white) | `--color-text-primary` |
| `brand` | `--color-bg-brand` (LifeLock dark green) | `--color-text-inverse` (`#fff` white) |
| `brand-soft` | `--color-bg-brand-soft` (sand) | `--color-text-primary` |
| `accent` | `--color-bg-accent` (ivory) | `--color-text-primary` |
| `alpha` | `--color-bg-alpha` (warm stone) | `--color-text-primary` |
| `beta` | `--color-bg-beta` (cool gray) | `--color-text-primary` |
| `gamma` | `--color-bg-gamma` (soft gray) | `--color-text-primary` |
| `delta` | `--color-bg-delta` (neutral-20) | `--color-text-primary` |
| `inverse-primary` | `--color-bg-inverse-strong` (off-black) | `--color-text-inverse` |
| `inverse-secondary` | `--color-bg-inverse` (ocean teal) | `--color-text-inverse` |

Per-variant opacity stops (applied to the surface fill via
`color-mix(in srgb, <bg-token> <stop>%, transparent)`):

| Variant | Surface opacity |
|---|---|
| `solid` | 100 % |
| `transparent-30` | 30 % |
| `transparent-50` | 50 % |
| `transparent-80` | 80 % |

See [`storybook-lifelock/src/tokens/colors/_colors.scss`](../../tokens/colors/_colors.scss)
for the canonical Layer 2 surface-role declarations, and
[`storybook-lifelock/src/tokens/typography/_typography.scss`](../../tokens/typography/_typography.scss),
[`storybook-lifelock/src/tokens/spacing/_spacing.scss`](../../tokens/spacing/_spacing.scss),
[`storybook-lifelock/src/tokens/borders/_borders.scss`](../../tokens/borders/_borders.scss)
for the primitive scales.

## Responsive behaviour

Label is a **fit-content** primitive — `display: inline-flex` +
`inline-size: fit-content` so the root sizes to its content slot +
per-side padding + the optional icon. It does not participate in
the page-layout grid directly; the hosting context (a card header,
a list row, a metadata strip) is responsible for placing the label
and reserving sufficient inline space.

There is no per-breakpoint variant axis — the label paints
identically at every band. Logical properties (`padding-block`,
`padding-inline`) make the component RTL-safe; pill geometry +
inline-flex centering survive direction flips with no overrides.
The icon slot sits before `.c-label__text` in DOM order so RTL flow
naturally places it to the visual right of the text.

## States

| State | Mechanism | Notes |
|---|---|---|
| `default` | absence of any pseudo-class / runtime class | The only paint state Label ships. |

Label is **stateless** — no `hover` / `focus` / `pressed` /
`disabled` paints, no JavaScript. It is a presentation-only molecule
that decorates surrounding content (cards, list rows, metadata
strips) rather than being a target of interaction itself. Consumers
wanting an interactive labelling affordance (e.g. a removable
filter pill) should compose a future `Components/Chip` or wrap the
label inside a `Components/Button` instead — Label stays small
precisely because it doesn't carry state machinery.

## Accessibility

- **Visible text is the accessible name.** The `text` prop's value
  renders verbatim inside `.c-label__text` and is its own
  accessible name — no `aria-label` override is needed or supported.
  Consumers wanting to add additional context ("Premium subscription
  tier" rather than just "Premium") should label the surrounding
  interactive control via `aria-label` / `aria-labelledby` rather
  than the label itself.
- **Icon is decorative.** When `showIcon = true`, the leading icon
  is rendered via the `icon` partial with `decorative=true`, so
  the icon's mask wrapper carries `aria-hidden="true"`. The text
  always carries the meaning — the icon is purely an affordance
  for visual scanability.
- **Contrast.** Every `(background, variant=solid)` paint pair must
  meet WCAG 2.1 AA contrast — 4.5 : 1 for body-xs (12 px) text
  against the surface paint. The 11 LifeLock-mapped backgrounds
  clear 4.5 : 1 with their paired content paint at `solid` opacity.
  At `transparent-30 / 50 / 80`, the effective contrast against the
  host surface depends on what the label sits on — surfaces with
  similar luminance to the dimmed pill colour can drop contrast
  below WCAG floors. See § "Notes & open questions" for the
  designer follow-up.
- **No focus ring.** Label is non-interactive (no `:hover` /
  `:focus-visible` paints). Consumers should never make a bare
  label keyboard-focusable — wrap it in an interactive control
  (button, link) and let that control own the focus ring.
- **Reduced motion.** No transitions or animations ship on this
  component, so `prefers-reduced-motion: reduce` is a no-op.

## Design intent

The Label primitive solves the cross-cutting "I need a small piece
of inline metadata" problem in one place — a category pill on a
product card, a tier marker next to a username, a tag in a search
result. Splitting it into `background × variant` axes keeps the
molecule's footprint tiny while giving designers a full surface-role
ladder (11 backgrounds spanning brand / accent / neutral / inverse
families) plus four emphasis stops (one solid, three transparency
levels) without inventing extra variants per surface.

The 11-colour ladder is intentionally broader than Badge's 6-colour
Signal family because Label's role is **decorative metadata**
rather than **semantic communication**. A `gamma` label doesn't
mean anything — it just renders in a particular palette tone the
designer picked to harmonise with the host surface. The Signal
ladder (info / success / warning / error) is the wrong vocabulary
for that — those colours carry semantic meaning that Label
explicitly does not. Consumers reaching for a status / state
affordance should pick `Components/Badge` instead.

The four transparency stops cover the same need at different scales:
`solid` for a punchy stand-alone pill; `transparent-30 / 50 / 80`
for layered metadata that sits on top of a hero image, a tinted
card, or a coloured surface where a fully-opaque pill would be too
loud. The single-property `color-mix` implementation lets every
brand-mode skin pick its own per-Background base colour while the
opacity ladder stays consistent across themes.

The deliberate non-goals are as important as the goals.
**No interaction.** Label never paints `:hover` / `:focus-visible`
/ `:active` — wrapping it in an interactive control is the right
posture when interaction is needed. **No size axis.** The Figma
master ships exactly one size; consumers wanting a different size
should reconsider whether a label is the right primitive.
**No trailing icon slot.** The Figma master only authors a leading
icon; trailing-icon affordances (close buttons, status indicators)
are out of scope for Label and belong on a future `Chip`.

## Figma source

- Canonical Label master variant set (Web-ODS Shared Library,
  `fileKey: 0o8SL5BEk8wHtgud00dRyg`):
  [`1408:443`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1408-443&m=dev).
- Spec Frame / Documentation Frame:
  [`2331:287`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2331-287&m=dev)
  (DS · Label / Documentation (SpecFrame)). Holds the full design
  intent — overview, when-to-use, anatomy, variant matrix, colour
  ladder, emphasis modes, behaviour matrix, usage / content
  guidance, accessibility, do / don't, API model, example
  combinations, acceptance criteria, themes.
- Page-level canvas:
  [`539:28415`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28415&m=dev)
  (the LifeLock-themed master variant set + the Spec Frame share
  this canvas).
- LifeLock theme mode for Variable value resolution lives on
  [Web-ODS-Theme](https://www.figma.com/design/Nshd9ukxIzpeUnzOXiWxUP/Web-ODS-Theme).
  The Layer 2 surface-role aliases on `Web-ODS-Theme` are the
  upstream of every per-Background paint the label consumes.

## Notes & open questions

- **Brand-mode theme mismatch.** The Figma master variant set
  `1408:443` was authored under a non-LifeLock theme — the
  `get_variable_defs` walk surfaces colours like `#0d4137` and
  `#2f303c` rather than LifeLock's `--color-lifelock-green`
  `#013638`. The code mirror maps the 11 Figma `Background` values
  onto LifeLock's surface-role tokens (`--color-bg-*` Layer 2
  aliases) so the LifeLock render expresses the same semantic
  role per variant — the visible hex differs from the
  cross-brand authored render, but the design intent (a brand pill,
  an accent pill, a neutral pill) survives the theme swap. Surface
  this as a designer follow-up to confirm whether the master should
  be re-baked under `THEME=LifeLock` so the divergence detector
  reads the LifeLock paint as in-sync.
- **`Color/Label/*` token family.** The Figma source binds
  per-Background content paints via a `Color/Label/content-<bg>`
  token family that does not yet exist in LifeLock's
  `_colors.scss`. The code mirror substitutes the canonical
  LifeLock content / inverse pair (`--color-text-primary` /
  `--color-text-inverse`) because every Figma `Color/Label/content-*`
  value resolves to either a near-white or a dark green / black,
  matching the same on / off-dark contrast LifeLock's two text
  tokens already encode. If a future spec requires per-Background
  custom paint (e.g. `accent` text in coral rather than dark green),
  publish a `Color/Label/content-<bg>` family on Web-ODS-Theme +
  add the matching `--color-text-label-<bg>` aliases to
  `_colors.scss` and migrate the per-Background paint table.
- **Line-height mismatch.** Figma's `font/line-height/label` binds
  to 16 px; LifeLock's `--lineheight-body-xs` resolves to 18 px.
  The 2 px difference makes the LifeLock-mode pill 22 px tall
  rather than the Figma-intended 20 px. The pill shape is preserved
  by `--border-radius-pill` (9999 px) at either height. The badge
  component carries the same 22-vs-20 px quirk — consistent with
  the LifeLock body-xs ladder. If pixel-perfect 20 px pills
  matter, publish a `--lineheight-label` token at 16 px on
  Web-ODS-Theme + bind the label's `line-height` to it.
- **Font-family swap.** Figma's `font/family/label` binds to
  Lexend; LifeLock's `--font-family-primary` resolves to Inter
  Tight. The substitution is intentional — LifeLock units paint
  in Inter Tight across the board to maintain typographic
  consistency. The label's body-xs Regular 12 px target is
  preserved across the swap.
- **Transparency contrast.** At `variant ∈ {transparent-30,
  transparent-50, transparent-80}`, the effective contrast
  between content paint and what the dimmed surface composites
  against depends on the host surface. Consumers placing
  transparent-variant labels on coloured / image backgrounds
  must validate WCAG 1.4.3 contrast against the resulting
  composited surface. Surface this as a designer follow-up to
  document the recommended host-surface ranges for each
  transparency stop (or to author a `solid-on-tinted-surface`
  rule that disables the transparency stops when the host is
  not white).
- **No size axis.** The Figma master ships one size only — the
  Spec Frame's variant inventory does not author a `Size` axis.
  If a future use case requires a smaller (icon-only inline) or
  larger (CTA-adjacent) label, open a follow-up to either grow
  the variant matrix or split Label into sibling component sets.
- **No interactive `Chip` variant.** Label is purely
  presentational. Designers occasionally use the same pill
  geometry for dismissible filter chips — that affordance belongs
  on a future `Components/Chip` rather than on Label. If demand
  surfaces, file a separate spec.
