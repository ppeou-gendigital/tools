---
type: component
name: award-item
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "2355:19639"
status: published
composes:
  - award-wrapper
  - icon
tokensConsumed:
  - --color-bg-primary
  - --color-text-primary
  - --color-text-secondary
  - --border-radius-s
  - --space-0
  - --space-1
  - --space-3
  - --font-family-primary
  - --font-size-body-base
  - --lineheight-body-base
  - --letterspacing-body-base
  - --font-size-body-sm
  - --lineheight-body-sm
  - --letterspacing-body-sm
  - --font-weight-regular
  - --font-weight-semibold
---

# Award Item

Pairs a single award logo with supporting copy across six layouts. Figma: [Pattern / Awards](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2355-19639&m=dev) (`2355:19639`). Spec Frame [`.Award item · spec`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3882-473&m=dev) (`3882:473`).

## Summary

Image ratio × Layout → 18 combinations. Image slot is always an Award Wrapper instance (resized per layout). Card surface, gap, padding, and radius stay constant. Trustpilot family is out of scope.

## Composes

Composes: award-wrapper, icon.

Stars render as five (or one) `{{> icon name="generic/simple-star-filled"}}` until RatingTeaser / RatingInline molecules onboard.

## Variant axes

| Axis | Values |
|---|---|
| Image ratio | `1:1`, `9:16`, `16:9` |
| Layout | `quote`, `title-rating`, `compact`, `compact-stacked`, `rating-stacked`, `title-description` |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Image ratio | enum | `imageRatio` | no | `1:1` | Passed to Award Wrapper |
| 2 | Layout | enum | `layout` | no | `quote` | Content arrangement |
| 3 | — | text | `src` | no | — | Award logo URL |
| 4 | — | text | `alt` | no | — | Logo alt (empty when named nearby) |
| 5 | — | text | `quoteText` | no | — | Quote layout |
| 6 | — | text | `source` | no | — | Quote / Title-rating attribution |
| 7 | — | text | `year` | no | — | Title-rating |
| 8 | — | text | `title` | no | — | Compact / Title-* layouts |
| 9 | — | text | `description` | no | — | Title-description |
| 10 | — | boolean | `showRating` | no | true for quote/title-rating | |
| 11 | — | text | `ratingValue` | no | `5.0` | Rating-stacked score |
| 12 | — | text | `className` | no | — | Outer card only |

## Tokens consumed

**Card** — `--color-bg-primary`, `--border-radius-s`, `--space-3`.

**Type** — body-sm / body-base ramp + `--color-text-primary` / `--color-text-secondary`.

**Hard-coded slots** — 56×56 / 37×66 / 88×50 (default); 136 long-edge for Title-description; content panel 220px; stars 24px.

See `themes/default/` for token values.

## Responsive behaviour

Presentational card; parent strip owns wrapping. Compact-stacked / Rating-stacked centre for narrow badges.

## States

- Default — image + content populated
- Empty / placeholder — Award Wrapper placeholder when `src` omitted
- No hover / focus / disabled / loading at Award item level

## Accessibility

- Award Wrapper owns logo alt
- Non-interactive container; wrap in `<a>` when navigable
- Star icons `aria-hidden`; rating group `role="img"` + `aria-label`

## Design intent

Display primitive for award logos + copy in trust rows and rating sections. Delegates image ratio / clipping to Award Wrapper. Trustpilot Micro wrap is a separate out-of-scope family.
