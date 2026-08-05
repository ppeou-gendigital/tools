---
type: component
name: rating
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "2355:19638"
status: published
behavior: false
iconCompositionOptOut: true
composes:
  - icon
  - text-link
tokensConsumed:
  - --color-text-primary
  - --color-text-inverse
  - --color-text-accent
  - --color-border-subtle
  - --space-1
  - --space-2
  - --space-3
  - --font-family-primary
  - --font-size-body-base
  - --font-size-body-lg
  - --lineheight-body-base
  - --lineheight-body-lg
  - --letterspacing-body-base
  - --letterspacing-body-lg
  - --font-weight-regular
---

# Rating

Display-only rating molecule with five Types (Teaser, Inline, Text-led,
Trustpilot, Trustpilot Teaser). Mirrors
[Pattern / Ratings](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2355-19638&m=dev)
(`2355:19638`) and Spec Frame
[`.Rating · spec`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4630-2285&m=dev)
(`4630:2285`). Distinct from Award item rating layouts.

## Summary

Rating communicates a 0–5 score (0.5 steps) with star glyphs, optional
numeric score, and optional review-count link. Trustpilot Types paint
brand-coloured star rows and set `iconCompositionOptOut: true` because
multi-color Trustpilot Star Combinations art cannot survive the
mask/`currentColor` pipeline.

## Composes

Composes: icon, text-link.

## Variant axes

| Axis | Values |
|---|---|
| Type | `teaser` / `inline` / `text-led` / `trustpilot` / `trustpilot-teaser` |
| Value | `0`–`5` step `0.5` |
| Device | `desktop` (24×24 stars) / `mobile` (16×16) — teaser + trustpilot* |
| Show score / Show count | booleans — teaser + trustpilot-teaser |
| Trailing | on/off — text-led |
| Background | `light` / `dark` — trustpilot-teaser |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Type | Enum | `type` | yes | `"teaser"` | |
| 2 | Value | Number | `value` | yes | `4.5` | 0–5 step 0.5 |
| 3 | Device | Enum | `device` | no | `"desktop"` | |
| 4 | Show score | Boolean | `showScore` | no | `true` | Teaser family |
| 5 | Show count | Boolean | `showCount` | no | `true` | Teaser family |
| 6 | Count | String | `countLabel` | no | `"(2,486)"` | |
| 7 | — | String | `countHref` | no | `"#"` | Code-only |
| 8 | Leading | String | `leadingText` | no | `"Rated"` | Text-led |
| 9 | Trailing | Boolean | `trailing` | no | `false` | Text-led |
| 10 | Trailing text | String | `trailingText` | no | `""` | |
| 11 | Background | Enum | `background` | no | `"light"` | Trustpilot teaser |

## Tokens consumed

**Structural** — `--space-1`, `--space-2`, `--space-3`.

**Typography** — body-base / body-lg size + line-height + letter-spacing pairs; `--font-family-primary`, `--font-weight-regular`.

**Color** — `--color-text-primary` (score + filled stars), `--color-border-subtle` (empty stars when value > 0), `--color-text-accent` (static count fallback), `--color-text-inverse` (dark teaser background). Trustpilot uses component CSS var `--c-rating-trustpilot`.

See themes/default/ for resolved values.

## Responsive behaviour

Device axis swaps star size (24 → 16) and score/count typography
(body-lg → body-base). Fluid inline; no breakpoint media queries required.

## States

None — presentation-only (no hover/focus/active paints, no JS).

## Accessibility

- Root `role="img"` with `aria-label` describing score out of 5.
- Stars and score are `aria-hidden`; count link is a real `text-link` when `countHref` is set.
- Touch targets for the count link follow Text link sizing.

## Design intent

Surface product / review ratings consistently across brands. Award item
keeps its own embedded rating layouts; this unit is the shared molecule
for standalone rating stamps.

## Composition rules for consumers

`iconCompositionOptOut: true` — Trustpilot Types intentionally use
brand-coloured star fills (approximating Figma Star Combinations). Do
not force those Types through the monochrome mask pipeline.

## Figma source

- Page: [Pattern / Ratings `2355:19638`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2355-19638&m=dev)
- Spec: [`.Rating · spec` `4630:2285`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4630-2285&m=dev)
- Boards: Teaser `2500:2927`, Inline `2500:2903`, Text-led `2500:2914`, Trustpilot `2969:1217`, Trustpilot Teaser `2974:5283`
