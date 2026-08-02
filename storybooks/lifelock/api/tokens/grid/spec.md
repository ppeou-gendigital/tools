---
type: token
name: grid
figmaFileKey: Nshd9ukxIzpeUnzOXiWxUP
figmaNodeId: "18086:2008"
status: published
brand: LifeLock
---

# Grid

## Summary

The grid system — container widths, column counts, gutters, outer margins, and derived column widths — encoded as primitive Figma `Number` Variables and CSS custom properties in the `--grid-*` namespace, plus the system-wide `--grid-max-width` semantic alias per [`code-conventions.mdc`](../../../../.cursor/rules/code-conventions.mdc) § 7.3.

The four band thresholds (`--breakpoint-*`) and the underlying `@media` queries that select a band live in the sibling [`tokens/breakpoints/spec.md`](../breakpoints/spec.md). This unit owns everything that **happens inside** a band.

## Container model

The container is **fluid in SM/MD/LG and capped in XL** — content width grows from `--grid-content-<bp>` at the band's lower bound up to `viewport − 2 × --grid-margin-<bp>` at the upper bound; XL caps inner content at `--grid-max-width` (= `--grid-content-xl` = 1312px) with auto-margins absorbing any excess viewport. Column count, gutter, and outer margin are sized per band; column tracks within SM/MD/LG resolve fluidly via `grid-template-columns: repeat(N, 1fr)`.

```css
@media (max-width: 767px) {
  .container {
    width: 100%;
    margin-inline: auto;
    padding-inline: var(--grid-margin-sm);
    /* no max-width — container spans the viewport, content area is fluid */
  }
}
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    width: 100%;
    margin-inline: auto;
    padding-inline: var(--grid-margin-md);
    /* no max-width — container spans the viewport, content area is fluid */
  }
}
@media (min-width: 1024px) and (max-width: 1439px) {
  .container {
    width: 100%;
    margin-inline: auto;
    padding-inline: var(--grid-margin-lg);
    /* no max-width — container spans the viewport, content area is fluid */
  }
}
@media (min-width: 1440px) {
  .container {
    width: 100%;
    margin-inline: auto;
    padding-inline: var(--grid-margin-xl);
    max-width: var(--breakpoint-xl); /* caps inner content at --grid-content-xl (1312) */
  }
}
```

Spec rules:

- Container is fluid in SM/MD/LG: width = viewport, inner content area = `viewport − 2 × --grid-margin-<bp>`. The per-band `--grid-content-<bp>` token values are canonical reference values at the band's lower bound, not the actual content width inside the band.
- Within SM/MD/LG, column widths are derived from the fluid content area via `grid-template-columns: repeat(N, 1fr)`; the `--grid-column-width-<bp>` token values are canonical reference values at the band's lower bound (not the actual track width inside the band).
- Outer margins (`--grid-margin-<bp>`) are guaranteed at every viewport within the band — they sit on the container as `padding-inline`, not on the parent as auto-margin.
- At XL (vw ≥ 1440), the container caps at `max-width: var(--breakpoint-xl)` so inner content equals `--grid-content-xl` = `--grid-max-width` = 1312 px; auto-margins absorb excess viewport. Per [`code-conventions.mdc`](../../../../.cursor/rules/code-conventions.mdc) § 7.3, layouts use `max-width: var(--grid-max-width)` as the canonical container max.
- Below SM canonical (vw < 360), behavior is best-effort (container may overflow). 360 is the supported mobile floor.

## Token values

> **Figma type primer.** All values below are stored as Figma `Number` Variables. Px-valued tokens (container widths, gutters, margins) carry a length, but Figma has no native length-with-unit type — the consumer (CSS layer / Figma constraint binding) treats the `Number` as px. Column-count tokens are also `Number` (integer); the unit is "columns", not pixels.

True column widths are **derived** ((content − (cols − 1) × gutter) / cols) but ALSO surfaced as tokens (`--grid-column-width-<bp>`) so consumer SCSS can read them directly without recomputing.

### Container widths

| Value | Figma name | Figma type | CSS custom property | Notes |
|---|---|---|---|---|
| 328 | `grid/content/sm` (Primitive) | Number | `--grid-content-sm` | 360 − 2 × 16; reference content width at SM canonical viewport (band content is fluid) |
| 704 | `grid/content/md` (Primitive) | Number | `--grid-content-md` | 768 − 2 × 32 = 704; reference content width at MD canonical viewport (band content is fluid) |
| 936 | `grid/content/lg` (Primitive) | Number | `--grid-content-lg` | 1024 − 2 × 44 = 936; reference content width at LG canonical viewport (band content is fluid) |
| 1312 | `grid/content/xl` (Primitive) | Number | `--grid-content-xl` | 1440 − 2 × 64 = 1312; authoritative XL content cap |
| 1312 | `grid/max` (Semantic, → `grid/content/xl`) | Number (alias) | `--grid-max-width` | canonical container max for templates per `code-conventions.mdc` § 7.3 |

### Column counts (integer count, NOT a length)

| Value | Figma name | Figma type | CSS custom property | Notes |
|---|---|---|---|---|
| 4 | `grid/columns/sm` (Primitive) | Number (integer) | `--grid-columns-sm` | unit = "columns", not px; consumed by `grid-template-columns: repeat(var(--grid-columns-sm), 1fr)` |
| 12 | `grid/columns/md` (Primitive) | Number (integer) | `--grid-columns-md` | — |
| 12 | `grid/columns/lg` (Primitive) | Number (integer) | `--grid-columns-lg` | — |
| 12 | `grid/columns/xl` (Primitive) | Number (integer) | `--grid-columns-xl` | — |

### Gutters

| Value | Figma name | Figma type | CSS custom property |
|---|---|---|---|
| 12 | `grid/gutter/sm` (Primitive) | Number | `--grid-gutter-sm` |
| 16 | `grid/gutter/md` (Primitive) | Number | `--grid-gutter-md` |
| 24 | `grid/gutter/lg` (Primitive) | Number | `--grid-gutter-lg` |
| 32 | `grid/gutter/xl` (Primitive) | Number | `--grid-gutter-xl` |

### Outer margins

| Value | Figma name | Figma type | CSS custom property | Notes |
|---|---|---|---|---|
| 16 | `grid/margin/sm` (Primitive) | Number | `--grid-margin-sm` | — |
| 32 | `grid/margin/md` (Primitive) | Number | `--grid-margin-md` | — |
| 44 | `grid/margin/lg` (Primitive) | Number | `--grid-margin-lg` | off-8px-grid (intentional) |
| 64 | `grid/margin/xl` (Primitive) | Number | `--grid-margin-xl` | — |

### Column widths (derived; surfaced as tokens for consumer ergonomics)

| Value | Figma name | CSS custom property | Notes |
|---|---|---|---|
| 73 | `grid/column-width/sm` (Primitive) | `--grid-column-width-sm` | `(328 − 3 × 12) / 4 = 73` (rounding leftover; not 4-px-aligned — intentional); reference value at canonical vw, actual track width fluid via 1fr |
| 44 | `grid/column-width/md` (Primitive) | `--grid-column-width-md` | `(704 − 11 × 16) / 12 = 44`; reference value at canonical vw, actual track width fluid via 1fr |
| 56 | `grid/column-width/lg` (Primitive) | `--grid-column-width-lg` | `(936 − 11 × 24) / 12 = 56`; reference value at canonical vw, actual track width fluid via 1fr |
| 80 | `grid/column-width/xl` (Primitive) | `--grid-column-width-xl` | `(1312 − 11 × 32) / 12 = 80`; authoritative — XL is fixed |

## CSS implementation pattern

```css
:root {
  --grid-content-sm: 328px;
  --grid-content-md: 704px;
  --grid-content-lg: 936px;
  --grid-content-xl: 1312px;
  --grid-max-width:  var(--grid-content-xl); /* canonical container max */

  --grid-columns-sm: 4;
  --grid-columns-md: 12;
  --grid-columns-lg: 12;
  --grid-columns-xl: 12;

  --grid-gutter-sm: 12px;
  --grid-gutter-md: 16px;
  --grid-gutter-lg: 24px;
  --grid-gutter-xl: 32px;

  --grid-margin-sm: 16px;
  --grid-margin-md: 32px;
  --grid-margin-lg: 44px;
  --grid-margin-xl: 64px;

  --grid-column-width-sm: 73px;
  --grid-column-width-md: 44px;
  --grid-column-width-lg: 56px;
  --grid-column-width-xl: 80px;
}
```

## Page-layout helpers

Five helper classes ship alongside the tokens and surface the
**page-layout model** every Components / Layouts / Pages story (and
every production page) is built from (per
[`grid-as-default-context.mdc`](../../../../.cursor/rules/grid-as-default-context.mdc)).
They are the only class family declared by a token unit that other
units may freely consume.

**Body is full-bleed by default.** In Storybook,
`storybook-lifelock/.storybook/preview.scss` declares
`body { margin: 0; padding: 0; }` so every story renders at viewport
edge-to-edge unless it opts in to content-width framing. The same
applies in production code: the `<body>` element IS the page; there
is no outer `.l-page` wrapper. Content-width framing is opt-in via
`.l-fluid-width` (or `.l-static-width`); the grid quartet `.l-row` /
`.l-col` carries the responsive grid; `.l-full-bleed` is an opt-in
escape hatch for nested break-outs.

| Class | Role | Authoring posture |
|---|---|---|
| `.l-fluid-width` | Fluid content-width section. Per-band `padding-inline: var(--grid-margin-<bp>)` caps content to the band's reference inner width. At XL adds `max-inline-size: var(--breakpoint-xl)` so inner content = `--grid-content-xl` (1312 px) with auto-margins absorbing excess viewport. Content width grows fluidly with the viewport between band edges. | Section root for content that should sit inside the page-content width. Stories opt in via `parameters: { contentWidth: 'fluid' }` (which wraps the story) or by supplying their own `<div class="l-fluid-width">` per render. The canonical LifeLock posture. |
| `.l-static-width` | Static content-width section. Per-band `max-inline-size: var(--grid-content-<bp>)` + auto-margins; no `padding-inline`. Outer spacing is fluid (stair-step) — the inner content cap is fixed pixels per band. | Available for portability — no LifeLock consumer uses this today. Surfaces the alternate "fixed content / fluid margins" posture other sites in the platform may adopt. Stories opt in via `parameters: { contentWidth: 'static' }`. |
| `.l-full-bleed` | Escape-hatch back to viewport edge-to-edge from inside a `.l-fluid-width` section. SM/MD/LG: `margin-inline: calc(-1 * var(--grid-margin-<bp>))` negates the parent's `padding-inline`. XL: `margin-inline: calc((var(--grid-content-xl) - 100dvw) / 2)` absorbs both the auto-margin and the padding. Uses dynamic viewport units (`dvw`) so the break-out tracks the visible viewport — see decision #7. | Use only when a child of a `.l-fluid-width` section needs to break out (e.g. a hero image inside an article body). Top-level full-bleed sections do NOT need this class — they sit as direct children of body and inherit the full-bleed default. |
| `.l-row` | `display: grid` row; per-band `grid-template-columns: repeat(var(--grid-columns-<bp>), 1fr)` + `column-gap: var(--grid-gutter-<bp>)`. May live at body level (full-bleed), inside a `.l-fluid-width` / `.l-static-width`, or **co-declared on the same element** as `.l-fluid-width` for the compact `<div class="l-fluid-width l-row">` single-element form. | Wraps any group of children that should sit on the multi-column grid. |
| `.l-col` | Grid item; defaults to `grid-column: 1 / -1` (full row). Per-band span modifiers `.l-col--<bp>--<N>` set `grid-column: span <N>`; per-band start modifiers `.l-col--<bp>--start--<N>` set `grid-column-start: <N>`. Bands are mutually exclusive (no cascade), so a layer that spans differently per band declares a modifier per band. | Direct child of `.l-row`. |

Per-band CSS contract (mirrors `## CSS implementation pattern` in shape):

```css
/* sm — vw ≤ 767 (fluid) */
.l-fluid-width {
  width: 100%;
  margin-inline: auto;
  box-sizing: border-box;
  padding-inline: var(--grid-margin-sm);   /* 16 — content grows fluidly inside the band */
}
.l-static-width {
  margin-inline: auto;
  box-sizing: border-box;
  max-inline-size: var(--grid-content-sm); /* 328 — fixed cap; fluid outer auto-margins */
}
.l-full-bleed {
  width: 100dvw;
  margin-inline: calc(-1 * var(--grid-margin-sm)); /* negate parent .l-fluid-width padding */
}
.l-row {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns-sm), 1fr);   /* 4 fluid tracks */
  column-gap: var(--grid-gutter-sm);                            /* 12 */
}
.l-col              { grid-column: 1 / -1; }
.l-col--sm--1       { grid-column: span 1; }
/* … sm--2, sm--3, sm--4 */
.l-col--sm--start--1 { grid-column-start: 1; }
/* … sm--start--2, sm--start--3, sm--start--4 */

/* md — 768 ≤ vw ≤ 1023 (fluid) and lg — 1024 ≤ vw ≤ 1439 (fluid)
   follow the sm shape: padding-inline only on .l-fluid-width,
   max-inline-size only on .l-static-width, .l-full-bleed uses
   calc(-1 * var(--grid-margin-<bp>)) to negate the parent's padding,
   .l-row uses 1fr tracks against the fluid content area, and .l-col
   modifiers generate {1..12} + start--{1..12}. .l-fluid-width never
   declares a max-inline-size in sm/md/lg. */

/* xl — vw ≥ 1440 (.l-fluid-width caps at --breakpoint-xl so inner content = 1312) */
.l-fluid-width {
  width: 100%;
  margin-inline: auto;
  box-sizing: border-box;
  padding-inline: var(--grid-margin-xl);   /* 64 */
  max-inline-size: var(--breakpoint-xl);   /* 1440 — caps inner content at --grid-content-xl (1312) */
}
.l-static-width {
  margin-inline: auto;
  box-sizing: border-box;
  max-inline-size: var(--grid-content-xl); /* 1312 — same authoritative cap as XL .l-fluid-width content */
}
.l-full-bleed {
  width: 100dvw;
  margin-inline: calc((var(--grid-content-xl) - 100dvw) / 2); /* absorbs parent auto-margin + padding */
}
.l-row {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns-xl), 1fr); /* 12 tracks of fixed --grid-column-width-xl */
  column-gap: var(--grid-gutter-xl);                          /* 32 */
}
```

Design rules consumers honor:

- **Body is the page.** A unit that sits at the top level of a page (a hero band, a feature strip, a footer) needs NO wrapper — body is already full-bleed. Use `.l-fluid-width` (or `.l-static-width`) only when a section should be capped to the page-content width; use `.l-full-bleed` only as an escape-hatch from inside a capped section.
- **Compact single-element form.** When a section is just a row of grid items inside the page-content width, declare both helpers on the same element: `<div class="l-fluid-width l-row">…</div>`. Two-element form (`<div class="l-fluid-width"><div class="l-row">…</div></div>`) is also valid when an author wants a non-grid wrapper around the grid.
- **Fit-content components need no grid declaration.** Buttons, chips, badges, icons, brand logos, etc. sit fine as direct children of body (or of a `.l-fluid-width`), left-aligned to the inline-start. They do NOT need to be wrapped in `.l-row` or carry `.l-col--<bp>--<N>` modifiers.
- **Layout-level units wrap children in `.l-row`.** A layout root that maps onto the multi-column grid declares `.l-row` and assigns each direct child a per-band span modifier. Layout-level units that span a fixed number of columns themselves (rather than wrapping a row) MAY also be styled as a grid item via `.l-col--<bp>--<N>` when they sit inside an outer row.
- **Spacing tokens fill the gaps.** Anything that cannot be expressed via the grid (gaps between non-grid children, ad-hoc offsets) consumes the `--space-N` scale from [`tokens/spacing`](../spacing/spec.md) — never raw px.
- **Snap tolerance: 2 px.** When mapping a Figma layer's L/R bounds to code, if a bound falls within 2 px of a grid line (margin edge or column boundary for the band), snap to the grid line. Document the snap with an SCSS comment per [`code-conventions.mdc`](../../../../.cursor/rules/code-conventions.mdc) § 7.4.

## Design decisions

1. **Column-count split (SM = 4, MD/LG/XL = 12).** Mobile layouts target a 4-col grid at 360 px canonical viewport; tablet/desktop bands use the standard 12-col module.
2. **LG outer margin = 44 px.** On the 4 px primitive scale, off the 8 px secondary scale. Kept as-is on `--grid-margin-lg`. Grid tokens live in their own `--grid-*` namespace and do **not** alias the general `--space-*` scale; the value is owned by this spec only.
3. **`grid/max` Semantic alias.** Templates reference one canonical container max-width via `--grid-max-width` (= `--grid-content-xl` = 1312 px) per `code-conventions.mdc` § 7.3.
4. **Fluid container in SM/MD/LG, capped at XL.** Content area grows with the viewport across the SM/MD/LG ranges; XL caps inner content at `--grid-max-width` (1312px) with auto-margins absorbing the excess. Mirrors the Figma frame-name ranges (`Mobile - 360-767`, `Tablet - 768-1023`, `Small Desktop - 1024-1439`, `Desktop - 1440-1920+`) which carry an explicit `+` cap only on XL. The per-band `--grid-content-<bp>` and `--grid-column-width-<bp>` token values are canonical reference values at each band's lower bound, not the actual content/track width inside the band.
5. **Grid is a token, not a wrapper.** Per [`terminology.mdc`](../../../../.cursor/rules/terminology.mdc), `grid` is classified as a Token family. Layouts and pages consume `--grid-*` directly in their SCSS; there is no `c-grid` component or `.u-grid` utility class. A future `layouts/container/` unit may package the grid into a reusable wrapper, but the tokens themselves remain canonical.
6. **Body-default full-bleed, opt-in content-width.** The page-layout model is "body is the page" — `<body>` carries no margin or padding and any direct child spans the viewport edge-to-edge. There is no outer `.l-page` wrapper. Content-width framing is **opt-in** via `.l-fluid-width` (fluid content area, fixed `padding-inline` per band; the LifeLock posture) or `.l-static-width` (fixed `max-inline-size` per band, fluid outer auto-margins; available for portability across the platform). The grid quartet `.l-row` + `.l-col` (plus per-band span / start modifiers) carries the responsive grid, and `.l-row` may be co-declared on the same element as `.l-fluid-width` for the compact `<div class="l-fluid-width l-row">` single-element form. `.l-full-bleed` is a separate escape-hatch for the rare case where a child of a `.l-fluid-width` section needs to break back out to viewport edges (e.g. a hero image inside an article body). All five helpers ship inside this unit's `_grid.scss` because their semantics are inseparable from the per-band tokens — every padding, max-inline-size, gutter, and column-count value the helpers emit resolves directly against `--grid-*` and `--breakpoint-*` declared on `:root`. They sit in the `l-*` taxonomy slot per [`code-conventions.mdc`](../../../../.cursor/rules/code-conventions.mdc) § 1 and are the only non-utility class family other units may freely consume.
7. **Dynamic viewport units (`dvw`) on `.l-full-bleed`.** The escape-hatch helper uses `100dvw` (and the XL formula uses `(--grid-content-xl - 100dvw) / 2`) instead of `100vw`. The legacy `vw` unit resolves against the **large** viewport — the area the page covers when mobile browser chrome (Safari address bar, Android URL bar) is collapsed — so a full-bleed section sized at `100vw` ends up wider than the actually visible viewport while the chrome is shown, producing a one-frame horizontal scrollbar flash as the page loads and again whenever the chrome dismisses. `dvw` resolves against the **dynamic** (currently visible) viewport, eliminating that flash on every browser in the support matrix (Safari 15.4+, Chrome 108+, Firefox 101+). No effect on desktop browsers — `vw` and `dvw` resolve identically when no UA chrome is auto-collapsing.
