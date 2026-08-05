---
type: component
name: logo-wrapper
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "3768:2718"
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

# Logo Wrapper

Aspect-locked frame for a single brand logo so it scales without distortion. Figma: [Molecule / Logo Wrapper](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3768-2718&m=dev) (`3768:2718`). Spec Frame [`3846:98`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3846-98&m=dev). Sticker board `3792:48`.

## Summary

Presentational box with a transparent surface, square corners, and clipped overflow. LockUp selects the fixed aspect ratio; a native `img` fills the box with `object-fit: contain`. Multi-color brand artwork must **not** use the Icon mask pipeline — this unit opts out via `iconCompositionOptOut: true`. Logo SVG fixtures are package-local under `assets/logos/` (no cross-package inheritance).

## Composes

Composes: none.

## Variant axes

| Axis | Values |
|---|---|
| LockUp | `horizontal`, `stacked`, `checkmark` |

Aspect ratios (hard-coded, not token-bound): Horizontal ≈1040:237 · Stacked ≈265:237 · Checkmark ≈238:237. Default demo height 88px (sticker); override via `--logo-wrapper-height` or CSS on the root.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | LockUp | enum | `lockUp` | yes | `horizontal` | `horizontal` \| `stacked` \| `checkmark` |
| 2 | — | image-url | `src` | no | `""` | Brand logo URL; empty shows docs placeholder |
| 3 | — | text | `alt` | no | `""` | Brand name, or `""` when named nearby |
| 4 | — | text | `className` | no | `""` | Outer box escape hatch only |

Colour=`Full Colour` is asset-driven (not a BEM axis). Logo-set tokens (`LOGO_SET` / …) are deferred — pass `src` explicitly.

## Tokens consumed

**Structural** — `--border-radius-0`, `--space-0`.

**Placeholder** — `--color-disabled-border`, `--color-text-inverse`, `--font-family-primary`, `--font-weight-regular`, `--font-size-label`, `--lineheight-label`, `--letterspacing-label`.

See themes/default/ for resolved values.

## Responsive behaviour

Aspect lock only; height is consumer-owned (default 88px). Parent layout owns spacing and wrapping of multiple instances.

## States

- Default (logo present) — transparent surface + `img` fill.
- Placeholder (no `src`) — Disabled/secondary fill + centred inverse label (docs / Storybook only).
- Non-interactive — no hover / focus / active paints; wrapping links own keyboard when linked.

## Accessibility

- Render logo as a native `img` with descriptive `alt` naming the brand, or `alt=""` when the brand is already named nearby.
- No custom roles; meaning is carried by `alt`.
- Non-interactive — never in the tab order. If the logo links home, the wrapping link owns keyboard + focus.
- Placeholder label is documentation-only and not shipped to users.

## Design intent

Use for brand / partner logos in headers, footers, and co-brand rows. Do not use for award logos (Award Wrapper), single-color glyphs (Icon), or product / hero imagery (Media).

## Composition rules for consumers

This unit legitimately bypasses the icon-mask-wrapper contract because logos are multi-color artwork whose fills must be preserved. Consumers MUST use `{{> logo-wrapper}}` (or the compiled equivalent) with a package-local `src` — never paint a brand logo through `.c-icon` / `mask-image`.

## Purpose

- Use to frame a single brand logo at a fixed aspect ratio so it scales cleanly without distortion.
- Use LockUp=`horizontal` for the full logo-plus-wordmark in headers and wide footers.
- Use LockUp=`stacked` for a compact vertical lockup where horizontal space is tight.
- Use LockUp=`checkmark` for the brand symbol alone (favicon / dense UI).
- Do not use for award or trust logos — use the Award wrapper.
- Do not use for product, editorial, or hero imagery — use the Media molecule.
- Do not lay out a whole partner row with one instance — compose several Logo wrappers in a parent grid/flex.
