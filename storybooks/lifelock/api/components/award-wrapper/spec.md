---
type: component
name: award-wrapper
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "3762:246"
status: published
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

# Award Wrapper

Fixed-aspect frame for a single award logo so a row of awards lines up cleanly. Figma: [Molecule / Award Wrapper](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3721-3904&m=dev) (variant board `3762:246`).

## Summary

Ratio-locked presentational box (transparent surface, square corners, clipped overflow) with a native `img` slot. When no logo is supplied, a documentation-only placeholder paints Figma `Color/Disabled/secondary` (theme `--color-disabled-border`) + inverse label text.

## Composes

Composes: none.

## Variant axes

| Axis | Values |
|---|---|
| Image ratio | `1:1`, `16:9`, `9:16` |

Fixed box sizes from Figma: `1:1` → 88×88 · `16:9` → 246×138 · `9:16` → 90×160.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Image ratio | enum | `imageRatio` | yes | `1:1` | `1:1` \| `16:9` \| `9:16` → BEM `--ratio-*` |
| 2 | — | image-url | `src` | no | `""` | Award logo URL; empty shows placeholder |
| 3 | — | text | `alt` | no | `""` | Descriptive alt, or `""` when named nearby |
| 4 | — | text | `className` | no | `""` | Outer box escape hatch only |

## Tokens consumed

**Structural** — `--border-radius-0`, `--space-0`.

**Placeholder** — `--color-disabled-border` (Figma Disabled/secondary), `--color-text-inverse`, `--font-family-primary`, `--font-weight-regular`, `--font-size-label`, `--lineheight-label`, `--letterspacing-label`.

See themes/default/ for resolved values.

## Responsive behaviour

Fixed pixel sizes per Image ratio; no breakpoint reflow. Parent layout owns spacing and wrapping of multiple instances.

## States

- Default (logo present) — transparent surface + `img` fill (`object-fit: contain`).
- Placeholder (no `src`) — Disabled/secondary fill (`--color-disabled-border`) + centred inverse label (docs / Storybook only).
- Non-interactive — no hover / focus / active paints; wrapping links own keyboard when linked.

## Accessibility

- Render logo as a native `img` with descriptive `alt` naming the award, or `alt=""` when the award is already named in adjacent text.
- No custom roles; meaning is carried by `alt`.
- Non-interactive — never in the tab order. If an award links out, the wrapping link owns keyboard + focus.
- Placeholder label is documentation-only and not shipped to users.

## Design intent

Use inside an Awards strip, footer trust row, or ratings block. Do not use for product / editorial / hero imagery (Media), non-award logos (Logo wrapper), or to lay out the whole row (compose several instances in a parent grid/flex).

## Overview

Use to frame a single award logo at a fixed aspect ratio so a row of awards lines up cleanly.

## When to use

- Image ratio `1:1` for square badges and seals, `16:9` for wide award lockups, and `9:16` for tall portrait marks.
- Inside an Awards strip, footer trust row, or ratings block where the parent owns spacing and wrapping.

## When not to use

- Product, editorial, or hero imagery — use the Media molecule.
- Brand or partner logos that are not awards — use the Logo wrapper.
- Laying out the whole award row — compose several Award wrapper instances inside a parent grid or flex row.

## Anatomy

1. **Surface** — ratio-locked box; transparent background; square corners; overflow clipped.
2. **Image slot** — award logo (`img`) filling the box.
3. **Placeholder** — when no logo, `--color-disabled-border` (Figma Disabled/secondary) fill with centred “Placeholder award logo” label in inverse content color (Label type ramp).
