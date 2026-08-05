---
type: component
name: card
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "4695:33460"
status: published
behavior: false
iconCompositionOptOut: true
composes:
  - discount-label
  - content-title
  - content-body
  - text-link
  - icon
tokensConsumed:
  - --space-3
  - --space-4
  - --space-5
  - --border-radius-l
  - --color-text-inverse
  - --font-family-primary
  - --font-size-label
  - --font-weight-semibold
---

# Card

Media card with gradient scrim and inverse content. Mirrors
[Pattern / Card `4695:31653`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4695-31653&m=dev)
master `4695:33460` and Spec
[`.Card · spec` `5664:296`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5664-296&m=dev).

## Summary

`.c-card` layers a full-bleed image, scrim, top discount-label, content-title + content-body, category line, and text-link footer with trailing icon. Axes: Ratio × Alignment.

## Composes

Composes: discount-label, content-title, content-body, text-link, icon.

## Variant axes

| Axis | Values |
|---|---|
| ratio | `16-9`, `4-3`, `1-1`, `3-4`, `2-1` |
| alignment | `top-left`, `top-right`, `bottom-left`, `bottom-right` |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Ratio | VARIANT | `ratio` | no | `"16-9"` | |
| 2 | Alignment | VARIANT | `alignment` | no | `"bottom-left"` | Simple board |
| 3 | — | TEXT | `imageSrc` | no | `/assets/images/sample.jpg` | |
| 4 | — | TEXT | `label` / `title` / `body` / `category` / `footerLabel` | no | sample copy | |
| 5 | — | boolean | `showLabel` / `showCategory` / `showFooter` | no | `true` | |

## Tokens consumed

Structural radius/spacing; inverse text on scrim. Nested molecules bring their own tokens.

## Responsive behaviour

Aspect-ratio locks media plane; content overlays. Max width ~400px in demos.

## States

Presentation only.

## Accessibility

- Decorative image `alt=""`; meaningful title is the heading
- Footer is a real text-link
- `iconCompositionOptOut` — photo media is not mask-based

## Design intent

Promotional / editorial teaser cards with photography — not a generic container (Accordion Appearance=card is unrelated).

## Figma source

- [Pattern / Card `4695:31653`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4695-31653&m=dev)
- [Card master `4695:33460`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4695-33460&m=dev)
- [`.Card · spec` `5664:296`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5664-296&m=dev)
