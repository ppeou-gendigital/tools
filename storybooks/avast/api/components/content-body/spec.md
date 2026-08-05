---
type: component
name: content-body
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "3483:3453"
status: published
composes: []
tokensConsumed:
  - --font-family-primary
  - --color-text-primary
  - --font-weight-light
  - --font-weight-regular
  - --font-weight-medium
  - --font-weight-semibold
  - --font-weight-bold
  - --font-size-body-3xl
  - --lineheight-body-3xl
  - --letterspacing-body-3xl
  - --font-size-body-2xl
  - --lineheight-body-2xl
  - --letterspacing-body-2xl
  - --font-size-body-xl
  - --lineheight-body-xl
  - --letterspacing-body-xl
  - --font-size-body-lg
  - --lineheight-body-lg
  - --letterspacing-body-lg
  - --font-size-body-base
  - --lineheight-body-base
  - --letterspacing-body-base
  - --font-size-body-sm
  - --lineheight-body-sm
  - --letterspacing-body-sm
  - --font-size-body-xs
  - --lineheight-body-xs
  - --letterspacing-body-xs
---

# Content Body

Typography molecule for paragraph / body copy across the primary body size ramp. Figma: [Molecule / ContentBody](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3598-7414&m=dev) (component set `3483:3453`).

## Summary

A single `<p>` with BEM root `.c-content-body`. Style picks the body size token ladder (`body-3xl` … `body-xs`); Weight picks the font-weight semantic ladder (`subtle` … `strong`). Color is always Figma `Content/content-body` → `--color-text-primary`. 7 × 5 = 35 buildable variants.

## Composes

Composes: none.

## Variant axes

| Axis | Values |
|---|---|
| Style | `body-3xl`, `body-2xl`, `body-xl`, `body-lg`, `body-base`, `body-sm`, `body-xs` |
| Weight | `subtle`, `base`, `prominent`, `emphasis`, `strong` |

Figma labels `Body 3xl` … `Body xs` and `Subtle` … `Strong` map to the kebab values above. Default: Style=`body-3xl`, Weight=`base`.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Style | enum | `style` | yes | `body-3xl` | → BEM `--body-*` |
| 2 | Weight | enum | `weight` | yes | `base` | → BEM `--weight-*` |
| 3 | Text | text | `text` | yes | `Body text` | Paragraph content |
| 4 | — | text | `className` | no | `""` | Outer escape hatch |

## Tokens consumed

**Color** — `--color-text-primary` (Figma `Content/content-body`).

**Typography** — `--font-family-primary`; per Style `--font-size-body-*` / `--lineheight-body-*` / `--letterspacing-body-*`; per Weight `--font-weight-light` (subtle) / `--font-weight-regular` (base) / `--font-weight-medium` (prominent) / `--font-weight-semibold` (emphasis) / `--font-weight-bold` (strong).

See themes/default/ for resolved values.

## Responsive behaviour

Size and line-height tokens already reflow at the theme breakpoint layer (mobile vs desktop type ramps in `_tokens.scss`). The molecule itself does not add breakpoint modifiers.

## States

- Stateless — no hover / focus / active / disabled paints.
- Non-interactive — plain paragraph text; wrapping links own keyboard when linked.

## Accessibility

- Render as a native `<p>` with the authored `text` as content.
- No custom roles or ARIA; meaning is carried by the paragraph text.
- Never place interactive controls inside Content body; compose links as children of a wrapping interactive pattern when needed.
- Meet WCAG contrast for `--color-text-primary` on the surrounding canvas.

## Design intent

Use for running body copy that must follow the design-system body ramp. Prefer Content title for headings; Content list for bulleted / numbered lists; Content block when composing a slotted section.

## Overview

Presentational paragraph that maps Figma’s Style × Weight body typography matrix onto CSS custom properties so every brand theme can restyle size and weight without forking markup.

## When to use

- Body paragraphs, lead text, and supporting copy that should stay on the ODS body size / weight ladders.
- Inside Content block slots, cards, modals, and marketing sections where the parent owns layout.

## When not to use

- Headings — use Content title.
- Lists — use Content list.
- Buttons, labels, or UI chrome type — use those molecules’ own type tokens.
- One-off marketing display type that is not on the body ramp.

## Anatomy

1. **Paragraph** — single `<p class="c-content-body">` carrying Style and Weight modifiers and the `text` string.
