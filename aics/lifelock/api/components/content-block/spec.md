---
type: component
name: content-block
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "3483:3418"
status: published
composes:
  - content-title
  - content-body
  - text-link
  - button
  - content-list
tokensConsumed:
  - --color-bg-primary
  - --color-text-primary
  - --space-3
  - --space-7
---

# Content Block

Section container that pairs a heading with optional supporting text and a flexible content slot. Figma: [Pattern / ContentBlock](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3483-3418&m=dev) (page `3483:3418`; Content Slot `3483:3468`; Spec Frame `.Content block · spec` `3869:73`).

## Summary

A flat white section with BEM root `.c-content-block`. Owns surface (`--color-bg-primary`), padding (`--space-7`), and gap (`--space-3`) only. Title row hosts Content title (H3 default / H0 display) plus one optional title-row affordance — Text link (`showLink`) or icon Button (`showButton`), never both. Optional body uses Content body at Body 3xl. The content slot may hold paragraphs, Content list, media, or nested composition.

## Composes

Composes: content-title, content-body, text-link, button, content-list (slot demos).

## Variant axes

| Axis | Values |
|---|---|
| titleStyle | `h3`, `h0` |
| showLink | `true`, `false` |
| showButton | `true`, `false` |
| showBody | `true`, `false` |

Defaults: `titleStyle=h3`, `showLink=false`, `showButton=false`, `showBody=true`. `showLink` and `showButton` are mutually exclusive — when both true, `showLink` wins.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | title | plain-text | `title` | yes | `Section title` | Content title string |
| 2 | — | enum | `titleStyle` | no | `h3` | Content title Style step: `h3` \| `h0` |
| 3 | — | enum | `titleTag` | no | `h2` | Semantic heading tag (`h1`–`h6`) |
| 4 | bodyText | plain-text | `bodyText` | no | — | Supporting Body 3xl paragraph |
| 5 | showLink | boolean | `showLink` | no | `false` | Title-row Text link |
| 6 | — | plain-text | `linkLabel` | no | `View all` | Text link label when `showLink` |
| 7 | — | url | `linkHref` | no | `#` | Text link href |
| 8 | showButton | boolean | `showButton` | no | `false` | Title-row icon Button |
| 9 | — | catalog-key | `buttonIcon` | no | `arrows-navigation/simple-more` | Icon-only Button leading icon |
| 10 | — | plain-text | `buttonAccessibleLabel` | no | `More options` | `aria-label` for icon-only Button |
| 11 | children | rich-text | `slotHtml` | no | — | Flexible content slot (pre-rendered HTML) |
| 12 | — | boolean | `showBody` | no | `true` | When false, omit body paragraph |
| 13 | — | text | `className` | no | `""` | Outer escape hatch |

## Tokens consumed

**Surface** — `--color-bg-primary` (Figma `Color/Background/primary`).

**Spacing** — `--space-7` (container padding); `--space-3` (row gap).

**Ink** — delegated to composed Content title / Content body (`--color-text-primary`).

See themes/default/ for resolved values.

## Responsive behaviour

Fluid width — stretches to parent. No breakpoint axis. Title row uses space-between; long titles wrap; the optional action stays on the inline-end edge when space allows.

## States

- **Default** — resting title, optional body, slotted content.
- **Title-row link** — Text link owns Default / Hover / Focus-visible / Pressed / Visited.
- **Title-row button** — Button owns Default / Hover / Focus-visible / Pressed / Disabled.
- **Container hover / pressed / disabled / loading / empty** — not modelled.

## Accessibility

- Semantic order: title → body → slot.
- Title is a real heading (`titleTag`); visual Style (H0/H3) is independent of level.
- `showLink` renders a real `<a>` via Text link.
- `showButton` renders a real `<button>` with `aria-label` (icon-only).
- One affordance per title row keeps tab order predictable.
- No motion on the container.

## Design intent

Content block is the Web-ODS section container for titled content. Do not use for a single isolated heading or paragraph — reach for Content title or Content body. Do not use as an elevated card — it is a flat white container. Prefer Content list inside the slot for bullets / numbered lists.
