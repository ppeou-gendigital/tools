---
type: component
name: trustpilot
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "2500:4244"
status: published
behavior: false
composes:
  - rating
tokensConsumed:
  - --space-3
  - --space-8
  - --border-radius-s
  - --color-bg-default
  - --color-text-primary
  - --color-text-secondary
  - --color-text-accent
  - --font-family-primary
  - --font-size-body-lg
  - --font-size-body-base
  - --font-size-body-sm
  - --font-weight-semibold
  - --font-weight-regular
---

# Trustpilot

Quoted-review cell pattern composing Rating Trustpilot stars. Mirrors
[Pattern / Trustpilot `2356:19641`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2356-19641&m=dev)
cell `2500:4244` and Spec
[`.Trustpilot Pattern · spec` `3969:12883`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3969-12883&m=dev).

Distinct from Rating’s Trustpilot Types (already shipped) — this unit is the review card.

## Summary

`.c-trustpilot` stacks title, optional product label, nested `rating` (`type=trustpilot`, score/count hidden), reviewer meta + verified cue, and quote body.

## Composes

Composes: rating.

## Variant axes

| Axis | Values |
|---|---|
| showProductLabel | true / false |
| showVerified | true / false |
| showQuote | true / false |
| value | 0–5 (0.5 steps) via nested rating |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | — | TEXT | `title` | no | `"Quote title"` | |
| 2 | — | TEXT | `productLabel` | no | — | |
| 3 | — | TEXT | `quoteBody` | no | — | |
| 4 | — | TEXT | `reviewerLine` | no | `"Reviewer · Date"` | |
| 5 | — | TEXT | `verifiedLabel` | no | `"Verified purchaser"` | |
| 6 | — | number | `value` | no | `5` | Nested rating |
| 7 | — | object | `ratingArgs` | yes | built by helper | Passed to `{{> rating}}` |

## Tokens consumed

Surface/padding/typography tokens above; star paints live on Rating.

## Responsive behaviour

Cell max-width ~304px; composed section stories use CSS grid (3 columns). Carousel JS out of scope.

## States

Presentation only — no interaction states.

## Accessibility

- Nested rating supplies accessible name (`Rated X out of 5 on Trustpilot`)
- Verified label is text (not colour-only) — contrast follow-up exists on Figma Spec

## Design intent

Surface individual Trustpilot-style testimonials; section teasers reuse Rating Teaser / Trustpilot Teaser molecules.

## Figma source

- [Pattern / Trustpilot `2356:19641`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2356-19641&m=dev)
- [Trustpilot Pattern cell `2500:4244`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2500-4244&m=dev)
- [`.Trustpilot Pattern · spec` `3969:12883`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3969-12883&m=dev)
