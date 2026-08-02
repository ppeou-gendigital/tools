---
type: token
name: breakpoints
figmaFileKey: Nshd9ukxIzpeUnzOXiWxUP
figmaNodeId: "0:31"
status: published
brand: LifeLock
---

# Breakpoints

## Summary

Four mutually-exclusive viewport bands — SM, MD, LG, XL — each owning a closed media-query range. The canonical viewport per band is the single representative width used by the Storybook viewport addon and Figma canvas frames. Encoded as primitive Figma `Number` Variables (`breakpoint/<bp>`) and CSS custom properties (`--breakpoint-<bp>`).

The breakpoints unit owns **only** the band thresholds and the four `--breakpoint-*` tokens. Every other responsive value (column counts, gutters, margins, container widths, derived column widths) lives in [`tokens/grid/spec.md`](../grid/spec.md).

## Breakpoint bands and media queries

Range-bounded, non-overlapping queries — each band targets exactly one viewport range, no cascading overrides between bands.

| Band | Media query | Canonical viewport |
|------|-------------|--------------------|
| SM | `@media (max-width: 767px) {}` | 360 |
| MD | `@media (min-width: 768px) and (max-width: 1023px) {}` | 768 |
| LG | `@media (min-width: 1024px) and (max-width: 1439px) {}` | 1024 |
| XL | `@media (min-width: 1440px) {}` | 1440 |

Bands are mutually exclusive — exactly one band matches at any given viewport. Each band declares its layout module from scratch; there is no mobile-first cascade between bands. The **canonical viewport** is the single representative width per band used by the Storybook viewport addon and Figma canvas frames. For MD/LG/XL it equals the band's lower threshold; for SM the canonical is 360 (the supported mobile floor) even though the SM band has no CSS lower bound.

> **Mixin layer.** Component / layout SCSS never writes raw `@media (...)` queries. Use the breakpoint mixins from the sibling [`_breakpoints.scss`](./_breakpoints.scss) (`@include sm { ... }`, `@include md { ... }`, etc.) — mixin names map 1:1 to the bands above. The literal media queries above show the underlying spec.

## Token values

> **Figma type primer.** Stored as Figma `Number` Variables. Px-valued tokens carry a length, but Figma has no native length-with-unit type — the consumer (CSS layer / Figma constraint binding) treats the `Number` as px.

### Breakpoint thresholds

| Value | Figma name | Figma type | CSS custom property | Notes |
|---|---|---|---|---|
| 360 | `breakpoint/sm` (Primitive) | Number | `--breakpoint-sm` | dual-purpose: SM canonical viewport; SM band has no CSS lower bound (uses `max-width: 767px`) |
| 768 | `breakpoint/md` (Primitive) | Number | `--breakpoint-md` | dual-purpose: MD media-query lower threshold AND canonical viewport |
| 1024 | `breakpoint/lg` (Primitive) | Number | `--breakpoint-lg` | dual-purpose: LG media-query lower threshold AND canonical viewport |
| 1440 | `breakpoint/xl` (Primitive) | Number | `--breakpoint-xl` | dual-purpose: XL media-query lower threshold AND canonical viewport |

## CSS implementation pattern

```css
:root {
  --breakpoint-sm: 360px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1440px;
}
```

The four `--breakpoint-*` custom properties are **documentation values** consumed by JavaScript / gallery code that needs to read the band thresholds (e.g. the Design System / Breakpoints gallery). CSS variables cannot be used inside `@media` conditions, so SCSS `_breakpoints.scss` mixins compile against literal Sass values that mirror these tokens 1:1.

## Storybook canonical viewports

Four named viewports register with the Storybook viewport addon (per [`storybook-conventions.mdc`](../../../../.cursor/rules/storybook-conventions.mdc) § "Viewport presets are mandatory"):

- `sm` — 360 × 740
- `md` — 768 × 1024
- `lg` — 1024 × 768
- `xl` — 1440 × 900

Widths match the breakpoint token values. Adding `xs` / `xxl` requires updating the sibling [`_breakpoints.scss`](./_breakpoints.scss), the matching `--breakpoint-*` custom properties in [`../grid/_grid.scss`](../grid/_grid.scss), the band-range tables in this `spec.md`, and [`storybook-lifelock/.storybook/preview.js`](../../../.storybook/preview.js) in the same sync. The story consumes those values directly from this `spec.md` at render time.

## Design decisions

1. **Range-bounded media queries.** No mobile-first cascade. Each band is a self-contained `@media` block accessed via the breakpoint mixins in `_breakpoints.scss`.
2. **Canonical viewport ≠ band lower bound for SM.** The SM band has no CSS lower bound (it uses `max-width: 767px`), but its canonical viewport is 360 px — the supported mobile floor. Below 360 px, behaviour is best-effort.
3. **Mixin names map 1:1 to bands.** `@include sm` matches viewports ≤ 767 px **only** (not "≥ 360 px"). The cascading `min-width` style is intentionally not provided.
