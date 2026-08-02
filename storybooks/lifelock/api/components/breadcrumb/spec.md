---
type: component
name: breadcrumb
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1260:8373"
status: draft
behavior: false
composes:
  - text-link
  - icon
tokensConsumed:
  - --space-1
  - --space-2
  - --font-family-primary
  - --font-size-body-sm
  - --lineheight-body-sm
  - --font-weight-regular
  - --font-weight-medium
  - --letterspacing-body-sm
  - --color-text-primary
  - --color-text-brand
  - --color-disabled-text
  - --color-border-focus
  - --border-radius-control
---

# Breadcrumb

Hierarchical trail that shows where a user is in a site's information
architecture and lets them step back to any ancestor with a single
click. Mirrors the master variant set on
[Web-ODS Shared Library / 1260:8373](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1260-8373&m=dev)
and the companion
[Spec Frame `1427:3565`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1427-3565&m=dev).

## Overview

_A wayfinding trail that anchors the current page in its parent
hierarchy and offers one-click ascent to any ancestor._

Breadcrumb is a secondary navigation pattern: it never replaces the
primary site nav, but it earns its keep on multi-level routes where a
single back-step isn't enough. It composes the `text-link` molecule
for every interactive ancestor and the `icon` partial for the
separators (and the optional home affordance), so it inherits every
LifeLock paint / state / focus contract those two units already ship.

## Purpose

**Use breadcrumb when**

- the current page sits at depth ≥ 2 inside a hierarchical route
- users routinely arrive deep-linked and need to ascend
- the trail itself is informative (category → sub-category → leaf)
- the parent levels are real pages with meaningful URLs

**Do not use breadcrumb when**

- the page sits at the root (`/`) or one level deep — the parent
  link in the primary nav already covers it
- the route is procedural (multi-step form, wizard) — use `stepper`
- the trail would only carry a single ancestor — surface a plain
  `text-link` instead
- the hierarchy isn't navigable (the listed ancestors don't have
  their own pages)

## Summary

`Patterns/Breadcrumb` is a stateless presentation pattern that
renders a `<nav>` wrapping an ordered `<ol>` list. Each intermediate
crumb composes the `text-link` partial at
`Size = sm, Weight = regular`; the final crumb is a plain
`<span aria-current="page">` (never a link). Separators compose the
`icon` partial with catalog key
`arrows-navigation/simple-chevron-right` at 16 px. The optional
collapsed state replaces every middle item with a **single static
placeholder** (`<span class="c-breadcrumb__ellipsis">`) whose
`title` tooltip and `aria-label` enumerate the hidden labels — the
pattern ships **no JavaScript layer**.

## Composes

Composes: text-link, icon.

- **text-link** — every intermediate crumb (and the leading-home
  shape of the first crumb on the collapsed variant) renders as
  `{{> text-link size="sm" weight="regular" …}}`. The link inherits
  every state paint (`:hover`, `:focus-visible`, `:active`,
  `:visited`, `aria-disabled`) from the molecule — breadcrumb adds
  no per-state overrides. See
  [`storybook-lifelock/src/components/text-link/spec.md`](../text-link/spec.md).
- **icon** — separators (`arrows-navigation/simple-chevron-right`,
  16 px), the home glyph (`objects/simple-home`, 16 px — used by
  both the icon-only first crumb and the collapsed-state leading
  home shape), and the collapsed-state ellipsis placeholder
  (`arrows-navigation/simple-more-horiz`, 20 px) all compose the
  `icon` partial with `color="current"` so each tracks the
  containing crumb's paint via `currentColor`. See
  [`storybook-lifelock/src/components/icon/spec.md`](../icon/spec.md)
  § "Composition rules for consumers".

## Variant axes

| Axis | Values |
|---|---|
| First as icon | No, Yes |
| Collapsed | No, Yes |
| Truncation | No, Yes |

2 × 2 × 2 = 8 buildable combinations on the Figma master
(`1260:8373`). All three axes are orthogonal — any combination ships.

### First-crumb rendering matrix

The first crumb's shape is the product of **two** axes, not one. The
matrix below is verified against the master variants on `1260:8373`
(read via Figma MCP `get_design_context` during this unit's
bootstrap):

| `firstAsIcon` | `collapsed` | First crumb shape |
|---|---|---|
| No | No | Plain text-link (`"Home"`) — **no icon** |
| No | Yes | Text-link with **leading home icon** + label (`"🏠 Home"`) |
| Yes | No | **Icon-only** home anchor (label → `aria-label`) |
| Yes | Yes | **Icon-only** home anchor (label → `aria-label`) |

The "First as icon = No, Collapsed = Yes" combination is the
non-obvious one — the master adds a leading home glyph next to the
first crumb's text label as a wayfinding aid (the trail loses the
middle, so the home anchor compensates). The code mirror honors that
verbatim; see Figma node `1260:8406` for the canonical reference.

### Other axis behaviour

- **Collapsed = Yes** replaces every crumb between the first and the
  last two with **one static `<span class="c-breadcrumb__ellipsis">`
  placeholder** (a 20 px square containing the
  `arrows-navigation/simple-more-horiz` glyph). The placeholder is
  NOT a button — it does not accept pointer activation or keyboard
  focus. Its `title` attribute carries the hidden labels as a
  hover tooltip; its `aria-label` carries the same labels prefixed
  by `hiddenPagesLabel` (default `"Hidden pages"`) for screen readers.
  The hidden middle items are **omitted from the DOM entirely** —
  collapsed mode is a one-way representation, not a hide/show
  toggle. Consumers who need expand-on-demand should render the
  trail with `collapsed=false` instead.
- **Truncation = Yes** caps the inline width of each crumb's label
  at `12ch` and ellipsizes overflow via
  `text-overflow: ellipsis`. The current page label receives the
  same cap. Truncation is purely visual — the full label stays in
  the DOM as the link text, so assistive tech reads the complete
  string.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Items | array | `items` | yes | `[]` | Ordered ancestors-to-current list. Each entry: `{ label: string, href?: string, ariaLabel?: string }`. The last entry becomes the `aria-current="page"` text node. When `collapsed=true` AND `items.length >= 4`, every entry between index 1 and `length - 2` is omitted from the DOM and represented by a single ellipsis placeholder. |
| 2 | First as icon | boolean | `firstAsIcon` | no | `false` | When `true`, the first item renders as an icon-only home anchor (label → `aria-label`). When `false` AND `collapsed=false`, the first crumb is a plain text-link (no icon). When `false` AND `collapsed=true`, the first crumb is a text-link with a leading home icon next to the label (matches Figma `1260:8406`). |
| 3 | Collapsed | boolean | `collapsed` | no | `false` | When `true` AND `items.length >= 4`, hides every item between index 1 and `length - 2` from the DOM and inserts a single ellipsis placeholder directly before the parent-of-current crumb. The placeholder is static (no JS) — its tooltip + `aria-label` enumerate the hidden labels. |
| 4 | Truncation | boolean | `truncation` | no | `false` | When `true`, caps each label at `max-inline-size: 12ch` and ellipsizes overflow. Applies to intermediate links and the current page text alike. |
| 5 | Aria label | text | `ariaLabel` | no | `"Breadcrumb"` | Bound to the root `<nav aria-label="…">`. Localize when shipping. |
| 6 | — | text | `hiddenPagesLabel` | no | `"Hidden pages"` | Code-only. Accessibility label string — the prefix for the ellipsis placeholder's `aria-label`, rendered as `"<hiddenPagesLabel>: <comma-separated hidden labels>"`. Only emitted when `collapsed=true`. No Figma component-property counterpart (an a11y string, not a designer-set value). Localize when shipping. |
| 7 | — | enum | `iconType` | no | `"objects/simple-home"` | Code-only. The icon catalog key used for BOTH the icon-only and leading-home shapes of the first crumb. No Figma component-property counterpart — in Figma the home glyph is an instance-swap of the Icon component, not an enum of catalog keys. Defaults to the canonical home glyph; override for category-specific anchors (e.g. `business/simple-storefront`). |
| 8 | — | text | `items[].kind` | — | — | Helper-derived. One of `link` / `current` / `separator` / `ellipsis`, assigned by `buildCrumbsFromItems` when it expands the consumer trail into the rendered sequence. Drives the per-crumb branch in `breadcrumb.hbs`. |
| 9 | — | text | `items[].label` | — | — | Consumer-set on `link` / `current` entries; the visible crumb text. |
| 10 | — | text | `items[].href` | — | — | Consumer-set on `link` entries; the crumb anchor target. |
| 11 | — | boolean | `items[].homeIconOnly` | — | — | Helper-derived. Set on the first crumb when `firstAsIcon=true`; renders the icon-only home anchor (label → `aria-label`). |
| 12 | — | boolean | `items[].leadingHomeIcon` | — | — | Helper-derived. Set on the first crumb when `collapsed=true` AND `firstAsIcon=false`; renders the leading home glyph beside the label. |
| 13 | — | text | `items[].ariaLabel` | — | — | Consumer-set (optional) on the first item; becomes the icon-only home anchor's accessible name when `homeIconOnly` is set. |
| 14 | — | text | `items[].hiddenLabels` | — | — | Helper-derived. Comma-joined labels of the folded middle items; carried on the `ellipsis` entry for the placeholder's `title` + `aria-label`. |
| 15 | — | text | `items[].hiddenPagesLabel` | — | — | Helper-derived from the top-level `hiddenPagesLabel` prop; prefixes the ellipsis placeholder's `aria-label`. |

## Tokens consumed

**Structural**

- `--space-1` — padding around the ellipsis placeholder's `<span>`
  wrapper (matches the Figma `PaginationControls` instance's
  `p-[var(--space/space-1,2px)]`); the root nav's `padding-block`
  (matches the master variant root's 2px vertical padding); AND the
  gap between the leading-home icon and its label on the
  `firstAsIcon=false, collapsed=true` first crumb (inherited from
  the `text-link` partial's icon-to-label gap).
- `--space-2` — gap between every crumb and its trailing separator
  icon, AND the root nav's `padding-inline` (matches the master
  variant root's 4px horizontal padding).

**Typography** (every value resolves via the composed `text-link`
partial's `Size = sm, Weight = regular | medium` paint stack)

- `--font-family-primary`
- `--font-size-body-sm`
- `--lineheight-body-sm`
- `--font-weight-regular` — intermediate link labels
- `--font-weight-medium` — the current page label
- `--letterspacing-body-sm` — +2% tracking on every crumb label,
  applied once on the root and inherited (matches the master's
  0.28px letter-spacing on 14px body-sm text)

**Color**

- `--color-text-primary` — current page label and the ellipsis
  placeholder glyph paint
- `--color-text-brand` — default paint for every intermediate
  link (inherited from `text-link`'s `Background = light` default);
  also the home-icon anchor's default paint when `firstAsIcon=true`
- `--color-disabled-text` — separator icon paint (low-emphasis
  trail furniture, reusing the canonical disabled-text grey
  `color/neutral/50` for visual subtlety even though the chevrons
  are not themselves a disabled control)

**Focus + interactive**

- `--color-border-focus` — focus ring on the home-icon `<a>`.
  Intermediate links inherit their own focus ring from `text-link`.
  The ellipsis placeholder is non-focusable and consumes no focus
  token.
- `--border-radius-control` — corner radius on the home-icon
  anchor's focus ring outline AND the ellipsis placeholder's
  rounded square (matches Figma `border-radius-s`).

See [`storybook-lifelock/.storybook/preview.scss`](../../../.storybook/preview.scss)
for global values; the per-token sources live under
[`storybook-lifelock/src/tokens/colors/_colors.scss`](../../tokens/colors/_colors.scss),
[`storybook-lifelock/src/tokens/typography/_typography.scss`](../../tokens/typography/_typography.scss),
and
[`storybook-lifelock/src/tokens/spacing/_spacing.scss`](../../tokens/spacing/_spacing.scss).

## Responsive behaviour

Breadcrumb is **fluid by default** — the root `<nav>` is
`display: inline-flex` with `flex-wrap: wrap`, so on a narrow
viewport the trail wraps to a second row instead of pushing the
container's inline-end edge. Use `truncation=true` to keep the trail
on a single line at the cost of mid-label ellipsis, OR use
`collapsed=true` to fold the middle out of the trail entirely (the
two settings can stack — `truncation=true, collapsed=true` ellipsizes
the visible ends AND folds the middle).

The pattern intentionally ships no `Breakpoint` axis on its Figma
master — every breakpoint resolves the same paint and gap stack;
mobile compaction happens by composing `collapsed=true` from the
parent layout, not by re-rendering the trail.

## States

- **default** — intermediate links paint `--color-text-brand`; the
  current page label paints `--color-text-primary` at
  `font-weight: medium`; separators and the ellipsis placeholder
  paint `--color-disabled-text` / `--color-text-primary`
  respectively.
- **hover** (per link) — inherited from `text-link` (`:hover`).
- **focus** (per link) — inherited from `text-link`
  (`:focus-visible`). The home-icon anchor paints its own ring via
  `outline: 2px solid var(--color-border-focus)` +
  `outline-offset: var(--space-1)` so the keyboard cue stays
  consistent with `text-link`.
- **pressed** (per link) — inherited from `text-link` (`:active`).
- **disabled** — not a supported state at the breadcrumb level
  today; the entire trail is always interactive. Individual
  intermediate links can be marked `disabled` by setting
  `items[i].disabled = true` and the underlying `text-link`
  handles the `aria-disabled="true"` + dropped-`href` markup. The
  current page entry is never a link (always a `<span>`), so
  `disabled` does not apply.
- **ellipsis placeholder** — not an interactive surface. The
  `<span>` is `cursor: help` so pointer users see the affordance
  the tooltip provides; there is no `:hover` paint flip and no
  focus ring.

## Accessibility

- Root is `<nav>` with `aria-label="Breadcrumb"` (overridable via
  `ariaLabel`) per WAI-ARIA Authoring Practices for the Breadcrumb
  pattern.
- Trail uses an ordered list (`<ol>` / `<li>`) so screen readers
  announce position ("1 of 4") and the visual order matches the DOM
  order.
- The current page entry is a `<span aria-current="page">` — never
  a link — so assistive tech announces it as the active location
  and keyboard users don't tab onto a self-referential link.
- Separator icons carry `aria-hidden="true"` via the composed `icon`
  partial; the chevron is decorative and would otherwise pollute
  the announced trail with "right pointer" noise.
- When `firstAsIcon=true`, the icon-only `<a>` carries an
  `aria-label` sourced from the item's original `label` (or its
  explicit `ariaLabel`) so the destination is still announced.
- When `collapsed=true`, the ellipsis placeholder is a
  `<span role="text">` carrying:
  - `title="<comma-separated hidden labels>"` — surfaces the
    hidden trail as a native browser tooltip on hover (no JS
    required).
  - `aria-label="<hiddenPagesLabel>: <comma-separated hidden labels>"` —
    screen readers announce the prefix + the labels. The default
    English prefix is `"Hidden pages"`; localize via the
    `hiddenPagesLabel` arg.
  
  The placeholder is intentionally not a `<button>` — there is no
  expand affordance, so making it focusable would only confuse
  keyboard users who tab onto it expecting an action. Consumers
  who need expand-on-demand should render with `collapsed=false`
  instead.
- Touch targets: the home-icon anchor meets the WCAG 2.5.5 / Apple
  HIG 44 × 44 minimum by way of
  `min-inline-size: 24px; min-block-size: 24px` plus the parent
  nav's `padding-block: var(--space-1)` (which adds another 2 px
  band each side to keep the visible glyph centered without
  inflating its visual weight).
- BreadcrumbList schema.org markup is intentionally **not** baked
  into the partial — consumers who want SEO breadcrumb rich results
  can wrap each `<li>` with `itemscope itemtype="https://schema.org/ListItem"`
  in their page template without re-authoring the BEM markup. The
  required tokens (`position`, `item`, `name`) all map cleanly onto
  the `items[]` array.

## Behaviour

_How the pattern renders for each combination of the three axes._

- **First as icon = No, Collapsed = No** — every crumb is a plain
  text-link; no icons appear anywhere in the trail.
- **First as icon = No, Collapsed = Yes** — the first crumb is a
  text-link with a **leading home icon** next to its label
  (auto-added wayfinding aid because the middle is hidden); every
  middle crumb collapses into one static `<span>` placeholder;
  the parent-of-current and current crumbs are still visible.
- **First as icon = Yes, Collapsed = No** — the first crumb is an
  icon-only `<a>` containing the home glyph; every other crumb is
  a plain text-link.
- **First as icon = Yes, Collapsed = Yes** — the first crumb is
  an icon-only home anchor; the middle collapses into the
  placeholder; the parent-of-current and current crumbs are still
  visible.
- **Truncation = Yes** — independent of the two axes above; purely
  CSS-driven. The DOM still carries the full label string; the
  visual width cap is the only difference.

The pattern has **no interactive surface beyond the underlying
links**. The collapsed-state ellipsis is a presentation aid (tooltip
+ aria-label), not a click target. There is no expand/collapse
behaviour, no event suite, and no JS module.

## Content guidance

- **Label length.** Aim for ≤ 24 characters per crumb. Anything
  longer either belongs in `truncation=true` (visual cap + full
  string in the DOM) or in `collapsed=true` (hide the noisy
  middle).
- **Capitalisation.** Sentence case for the visible label
  (`"Cloud solutions"`, not `"Cloud Solutions"` or
  `"CLOUD SOLUTIONS"`); match the title case of the destination
  page.
- **Home affordance.** Reach for `firstAsIcon=true` only when the
  ascending sequence is short enough that the icon's lack of a
  text anchor doesn't make the trail feel decapitated. On longer
  trails (≥ 4 crumbs), keep the home label visible — and in
  collapsed mode the leading home icon is auto-added next to the
  visible "Home" label so you get the wayfinding cue for free.
- **Current page text.** Use the page's actual `<h1>` text
  verbatim — every trail-to-page round trip should match.
- **Hidden labels list** (collapsed mode). The labels you ship in
  the hidden middle items will surface verbatim in the ellipsis
  tooltip and `aria-label` — keep them short and self-explanatory.
- **Localization.** `ariaLabel` and `hiddenPagesLabel` are both
  visible-to-AT-only strings; they MUST be localized alongside the
  visible crumb labels. Default English strings are placeholders
  and never ship as production copy in non-English locales.

## Design intent

Breadcrumb exists for **lateral re-orientation**, not navigation.
The user already knows where they are (the page's H1 says so);
what they need is a quick sideways glance at how they got there
and a single-click path to any ancestor. Every design choice
follows from that:

1. The current page is plain text, not a link — clicking
   self-referential links is a known dark pattern that wastes a
   page load and confuses assistive tech.
2. Separators are low-contrast (`--color-disabled-text`) and
   `aria-hidden="true"` — they're trail furniture, not data.
3. The trail composes `text-link` rather than re-inventing its
   own link element — every accessibility and state contract
   stays consistent across the design system.
4. The collapsed variant ships a **static placeholder**, not an
   expand button. Wayfinding patterns whose middle hides behind a
   click affordance break the "see where you are at a glance"
   promise — the user has to discover the click target, activate
   it, and re-read the trail before they can navigate. The static
   tooltip + aria-label surface the hidden labels without
   demanding action: pointer users hover, screen-reader users get
   the prefix announced, and keyboard users tab through the
   visible recovery path (first crumb → parent-of-current).
5. Truncation caps at `12ch` rather than a fixed pixel value so
   the cap tracks the user's preferred font size; readability
   stays consistent across zoom levels and reflow scenarios.
6. When `firstAsIcon=false, collapsed=true`, the first crumb
   auto-adds a leading home icon. This is the Figma source's
   verbatim behaviour (`1260:8406`) and a deliberate one — the
   user is looking at a wayfinding trail with most of its body
   hidden, so the home icon provides a familiar anchor at the
   start.

## Anatomy

_Six parts, every breadcrumb variant._

1. **Root** — `<nav class="c-breadcrumb" aria-label>` carrying the
   variant modifier classes (`--first-as-icon-yes|no`,
   `--collapsed-yes|no`, `--truncation-yes|no`).
2. **List** — `<ol class="c-breadcrumb__list">`, `display: inline-flex`,
   `flex-wrap: wrap`, `gap: var(--space-2)`, `padding: 0`,
   `margin: 0`, `list-style: none`.
3. **Crumb** — `<li class="c-breadcrumb__item">` wrapping either a
   composed `text-link` (plain or with leading home icon), an
   icon-only home anchor, or the current-page `<span>`.
4. **Separator** — `<li class="c-breadcrumb__item--separator" aria-hidden="true">`
   composing the `icon` partial with
   `name="arrows-navigation/simple-chevron-right" size="16" color="current" decorative=true`.
5. **Ellipsis placeholder** (collapsed variant only) —
   `<li class="c-breadcrumb__item--ellipsis"><span class="c-breadcrumb__ellipsis" role="text" title aria-label>`
   composing the `icon` partial with
   `name="arrows-navigation/simple-more-horiz" size="20" color="current" decorative=true`.
   Not interactive; surfaces hidden labels via `title` (tooltip)
   and `aria-label` (assistive tech).
6. **Current page** — `<span class="c-breadcrumb__current" aria-current="page">`
   in `font-weight: medium`, paints `--color-text-primary`.

## Figma source

- [`Breadcrumb 🟢` canvas — 539:28420](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28420&m=dev) — page-level canvas hosting the master + Spec Frame.
- [Master variant set — 1260:8373](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1260-8373&m=dev) — 8 buildable variants (First as icon × Collapsed × Truncation).
- [Spec Frame — 1427:3565](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1427-3565&m=dev) — `Breadcrumb — Overview`. The Spec Frame template row in [`figma-import-index.md`](../../figma-import-index.md) § "Spec Frame template" is currently empty, so Stage 0
  (`f2p-sync-figma-spec`) short-circuits with `verdict: no-spec-frame`; the
  regions listed below were read manually during this unit's bootstrap
  and authored into the H2s above. Subsequent syncs will re-import
  them automatically once the template row is populated.
- Spec Frame regions mirrored manually: `Purpose`, `Recommended anatomy`,
  `Behavior`, `Content guidance`, `Accessibility`, `Component configuration`
  (api-table: `localization`, `link count`, `icon type`, `aria label`),
  `Design system definition`.

## Notes & open questions

1. **Re-bake the Figma master under `THEME=LifeLock`.** The master
   variant set at `1260:8373` and every nested `text-link` instance
   currently resolve under `THEME=White Label` (intermediate-link
   paint reads `color/content/accent` = `#22869f` ocean-teal). The
   LifeLock-themed code mirror inherits its paint from the
   `text-link` partial's `Background = light` defaults
   (`--color-text-brand` → `--color-ocean-teal`), which matches the
   semantic intent but produces a different hex than the
   default theme render. Designer follow-up: re-publish the master
   variant set under `THEME = LifeLock` + `PLATFORM = LifeLock / Desktop`
   so a future sync's mode-verification verdict flips from
   `mode-mismatch` to `clean` (per
   [`storybook-lifelock-figma-modes.mdc`](../../../../.cursor/rules/storybook-lifelock-figma-modes.mdc)).
2. **Publish a Spec Frame component template** on Web-ODS Shared
   Library and add its `mainComponentId` to the Spec Frame template
   row in
   [`storybook-lifelock/src/figma-import-index.md`](../../figma-import-index.md).
   Until the row is populated, every Stage 0 invocation
   short-circuits with `verdict: no-spec-frame` and the
   Spec-Frame-owned H2s here (`## Overview`, `## Purpose`,
   `## Anatomy`, `## Behaviour`, `## Content guidance`,
   `## Accessibility`) cannot be re-synced automatically.
3. **Confirm the static-ellipsis interpretation.** The Figma master
   uses a `PaginationControls / Style=Square` instance for the
   collapsed-state placeholder — visually a button-like control,
   but the Spec Frame's Behavior region (when re-imported via
   Stage 0) may clarify whether the placeholder is intended to
   stay static (current implementation: tooltip + `aria-label`
   only) or to open a popover listing every hidden ancestor.
   Confirm before the next sync — if the popover reading wins,
   the trail will gain a `<button>` element, a JS module
   (`breadcrumb.js`), and a `lifelock:breadcrumb:open`
   CustomEvent contract; the H2s above will need to flip
   accordingly.
4. **Add a `--color-text-link-breadcrumb` semantic alias** (or
   confirm `--color-text-brand` is the right surface). The
   default theme Figma source paints intermediate links with
   `color/content/accent` rather than the standard `text-link`
   brand color — that's a designer choice that survives the
   LifeLock theme switch (the LifeLock equivalents differ: brand
   → ocean teal, accent → coral). The current code mirror picks
   `--color-text-brand` (ocean teal) because the coral paint
   would visually overwhelm a passive wayfinding trail; revisit
   if the designer wants the accent-coral treatment.
5. **Compose `pagination-controls` if it ships.** The Figma
   Collapsed variant uses a `PaginationControls / Style=Square`
   instance for the ellipsis placeholder. There is no
   `pagination-controls` LifeLock component today — the trail
   renders a plain `<span class="c-breadcrumb__ellipsis">`
   instead. If a `pagination-controls` molecule ships later, even
   in a non-interactive flavour, refactor the placeholder to
   compose it and drop the `.c-breadcrumb__ellipsis` selector.
