---
type: component
name: image-wrapper
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "5428:53699"
status: published
iconCompositionOptOut: true
composes: []
tokensConsumed:
  - --border-radius-0
  - --space-0
  - --color-disabled-border
  - --color-text-inverse
  - --font-family-primary
  - --font-weight-regular
  - --font-size-label
  - --lineheight-label
  - --letterspacing-label
---

# Image Wrapper

Aspect-locked viewport for a single still image with Contain / Cover fit. Figma: [Molecule / Image Wrapper](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5428-53699&m=dev) (`5428:53699`). Spec Frame [`5653:1197`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5653-1197&m=dev). Matrix board `5444:81`.

## Summary

Presentational box with a transparent surface, square corners, and clipped overflow. Ratio sets the viewport `aspect-ratio`; Fit maps to `object-fit` on a native `img`. Demo fixtures are package-local under `assets/images/` (no cross-package inheritance). Sibling Figma **Image component** (ratio-only, no Fit) is not implemented in this unit — prefer Image wrapper whenever a viewport + fit contract is required.

## Composes

Composes: none.

## Variant axes

| Axis | Values |
|---|---|
| Ratio | `2-1`, `16-9`, `4-3`, `1-1`, `3-4`, `landscape` (3:2), `portrait` (2:3), `1-2`, `9-16` |
| Fit | `contain`, `cover` |

Default demo width 220px (`--image-wrapper-width`); height follows aspect-ratio. Consumers override width via CSS.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Ratio | enum | `ratio` | yes | `16-9` | See Variant axes |
| 2 | Fit | enum | `fit` | yes | `cover` | `contain` \| `cover` → `object-fit` |
| 3 | — | image-url | `src` | no | `""` | Empty → docs placeholder |
| 4 | — | text | `alt` | no | `""` | Descriptive, or `""` when decorative |
| 5 | — | text | `className` | no | `""` | Outer viewport only |

## Tokens consumed

**Structural** — `--border-radius-0`, `--space-0`.

**Placeholder** — `--color-disabled-border`, `--color-text-inverse`, `--font-family-primary`, `--font-weight-regular`, `--font-size-label`, `--lineheight-label`, `--letterspacing-label`.

See themes/default/ for resolved values. Aspect ratios and object-fit are hard-coded (not token-bound).

## Responsive behaviour

Viewport width is consumer-owned (default 220px for demos). Ratio locks height. Parent owns spacing and wrapping.

## States

- Default — image fills viewport per Ratio × Fit.
- Placeholder (no `src`) — Disabled/secondary fill + centred inverse label (docs only).
- Non-interactive — no hover / focus / active. Loading / error / lazy-load are consumer-owned.

## Accessibility

- Native `img` with meaningful `alt`, or `alt=""` when decorative.
- No custom roles. Never in the tab order; wrapping links own keyboard + focus.
- Text over Cover imagery is the parent’s WCAG responsibility.

## Design intent

Use for editorial, product, and hero stills inside cards, banners, and media slots. Do not use for brand logos (Logo wrapper), award logos (Award wrapper), single-color glyphs (Icon), or video / YouTube embeds ([Media](../media/spec.md)).

## Composition rules for consumers

This unit legitimately bypasses the icon-mask-wrapper contract because still imagery is multi-color raster artwork whose fills must be preserved. Consumers MUST use `{{> image-wrapper}}` (or the compiled equivalent) with a package-local `src` — never paint photographic / illustration content through `.c-icon` / `mask-image`.

## Purpose

- Use to frame a single image inside a fixed viewport so it scales without accidental distortion.
- Use Fit=`contain` when the whole image must stay visible; Fit=`cover` when the viewport must fill edge-to-edge.
- Pick Ratio to match the authored asset’s aspect.
- Do not stretch or squash — choose Contain or Cover only.
