---
type: component
name: content-title
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "3483:3436"
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
  - --font-size-h0
  - --lineheight-h0
  - --letterspacing-h0
  - --font-size-h1
  - --lineheight-h1
  - --letterspacing-h1
  - --font-size-h2
  - --lineheight-h2
  - --letterspacing-h2
  - --font-size-h3
  - --lineheight-h3
  - --letterspacing-h3
  - --font-size-h4
  - --lineheight-h4
  - --letterspacing-h4
  - --font-size-h5
  - --lineheight-h5
  - --letterspacing-h5
  - --font-size-h6
  - --lineheight-h6
  - --letterspacing-h6
  - --font-size-h7
  - --lineheight-h7
  - --letterspacing-h7
---

# Content Title

Typography molecule for section and page headings. Figma: [Molecule / ContentTitle](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3598-7174&m=dev) (component set `3483:3436`, Spec Frame `3637:48`).

## Summary

A single semantic heading element with BEM root `.c-content-title`. Style picks the heading size ramp (`h0` … `h7`); Weight picks the Lexend cut (`subtle` … `strong`, default **`emphasis`** / SemiBold). Color is always Figma `Content/content-title` → `--color-text-primary`. Spec Frame documents 8 × 5 = 40 buildable variants. Semantic `tag` (`h1`–`h6`) is independent of the visual Style step.

## Composes

Composes: none.

## Variant axes

| Axis | Values |
|---|---|
| Style | `h0`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `h7` |
| Weight | `subtle`, `base`, `prominent`, `emphasis`, `strong` |

Figma labels `H0` … `H7` and `Subtle` … `Strong` (Light / Regular / Medium / SemiBold / Bold) map to the kebab values above. Default: Style=`h0`, Weight=`emphasis`.

Canvas also exposes `Style=H8` variants; Spec Frame and the token contract stop at H7 — H8 is deferred until Spec Frame + `--*-h8` tokens land.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Style | enum | `style` | yes | `h0` | → BEM `--h*` |
| 2 | Weight | enum | `weight` | yes | `emphasis` | → BEM `--weight-*`; SemiBold default |
| 3 | Text | text | `text` | yes | `Heading` | Heading string |
| 4 | — | enum | `tag` | no | `h2` | Semantic element `h1`–`h6` \| `p`; independent of Style |
| 5 | — | text | `className` | no | `""` | Outer escape hatch |

## Tokens consumed

**Color** — `--color-text-primary` (Figma `Content/content-title`).

**Typography** — `--font-family-primary` (Figma `font/family/primary/heading`); per Style `--font-size-h*` / `--lineheight-h*` / `--letterspacing-h*`; per Weight `--font-weight-light` (subtle) / `--font-weight-regular` (base) / `--font-weight-medium` (prominent) / `--font-weight-semibold` (emphasis) / `--font-weight-bold` (strong).

See themes/default/ for resolved values.

## Responsive behaviour

Size and line-height tokens already reflow at the theme breakpoint layer (mobile vs desktop type ramps in `_tokens.scss`). The molecule itself does not add breakpoint modifiers.

## States

- Stateless — no hover / focus / active / disabled paints.
- Non-interactive — plain heading text.

## Accessibility

- Render a real heading (`tag` → `<h1>`–`<h6>`) chosen by the document outline, not the visual Style step alone.
- Visual step ≠ heading level — Style and `tag` are independent; an `h2`-sized title can be the page’s `<h1>`.
- One `<h1>` per page; nest without skipping levels.
- Meet WCAG contrast for `--color-text-primary` on the surrounding canvas.

## Design intent

Use for page titles, section headers, and card titles on the ODS heading ramp. Prefer Content body for paragraphs; Label for UI chrome type.

## Overview

Presentational heading that maps Figma’s Style × Weight heading matrix onto CSS custom properties so every brand theme can restyle size and weight without forking markup.

## When to use

- Section or page headings that anchor content beneath them.
- Establishing hierarchy between a page title and nested headings.
- Hero / landing Display moments (`h0`).

## When not to use

- Body copy, captions, taglines — use Content body or Label.
- Fake emphasis inside a sentence — use Weight or Label.
- Larger Style purely for visual weight when the outline needs a deeper level.

## Anatomy

1. **Heading** — single element (`.c-content-title`) carrying Style and Weight modifiers, `tag`, and the `text` string.
