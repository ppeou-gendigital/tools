---
type: component
name: media
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "3412:17329"
status: published
iconCompositionOptOut: true
composes: []
tokensConsumed:
  - --color-bg-subtle
  - --border-radius-l
  - --breakpoint-md
---

# Media

Single media viewport (image, MP4 video, or YouTube embed) inside a fixed 16:9 box. Figma: [Molecule / Media](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3412-17329&m=dev) (`3412:17329`). Spec Frame [`3443:11387`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3443-11387&m=dev). Component set `3438:54`.

## Summary

Presentational surface with `--color-bg-subtle` until media paints, `--border-radius-l`, and clipped overflow. Type swaps the native child (`img` / `video` / `iframe`); Width is parent-relative (`full` = 100%, `half` = 100% on mobile / 50% from md). Prefer [Image Wrapper](../image-wrapper/spec.md) when a flexible Ratio × Fit contract is required without video / YouTube.

## Composes

Composes: none.

## Variant axes

| Axis | Values |
|---|---|
| Type | `image`, `video`, `youtube` |
| Width | `full` (100%), `half` (100% → 50% from md) |

Default aspect-ratio `16 / 9` (overridable via `aspectRatio`). Default `objectFit` = `cover`.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Type | enum | `type` | yes | `image` | `image` \| `video` \| `youtube` |
| 2 | Width | enum | `width` | no | `full` | `full` \| `half` |
| 3 | — | text | `aspectRatio` | no | `16 / 9` | CSS aspect-ratio string |
| 4 | — | enum | `objectFit` | no | `cover` | `cover` \| `contain` \| `fill` \| `none` \| `scale-down` |
| 5 | — | image-url | `src` | no* | `""` | Required for image/video when not placeholder |
| 6 | — | text | `alt` | no* | `""` | Required for meaningful images |
| 7 | — | image-url | `poster` | no | `""` | Video still |
| 8 | — | boolean | `controls` | no | `true` | Video |
| 9 | — | boolean | `autoPlay` | no | `false` | Pair with `muted` |
| 10 | — | boolean | `muted` | no | `false` | Video |
| 11 | — | boolean | `loop` | no | `false` | Video |
| 12 | — | url | `url` | no* | `""` | YouTube URL |
| 13 | — | text | `videoId` | no* | `""` | Raw 11-char YouTube id |
| 14 | — | text | `title` | no* | `""` | iframe title (YouTube) |
| 15 | — | boolean | `allowFullScreen` | no | `true` | YouTube |
| 16 | — | text | `className` | no | `""` | Outer surface |

## Tokens consumed

**Surface** — `--color-bg-subtle`, `--border-radius-l`.

**Responsive** — half-width uses `768px` (= `--breakpoint-md`).

See themes/default/ for resolved values. Aspect-ratio and object-fit are hard-coded / prop-driven.

## Responsive behaviour

`width=full` always 100% of parent. `width=half` is 100% below md and 50% from md up. Ratio holds via CSS `aspect-ratio`.

## States

- Default — media fills the 16:9 surface; secondary background until paint.
- Image loading — native lazy loading.
- Video paused / playing — native transport when `controls` is on.
- YouTube — iframe focus + player-owned controls.
- Reduced motion — prefer poster + controls over autoplay; autoplay must be muted.
- Disabled — not modelled.

## Accessibility

- Native `img` / `video` / `iframe` only — never a div-as-media.
- Images require meaningful `alt` (or `""` when decorative).
- YouTube iframe requires descriptive `title`.
- No custom keyboard handlers; never `outline: none`.
- Autoplay is opt-in and should be muted.

## Design intent

One job: embed a single piece of media in a consistent 16:9 frame. Parent owns surrounding layout. Do not use for icons (Icon), brand logos (Logo Wrapper), awards (Award Wrapper), or flexible stills without video/YouTube (Image Wrapper).

## Composition rules for consumers

This unit bypasses the icon-mask-wrapper contract because media is multi-color raster / video content. Use `{{> media}}` with package-local or CDN `src` / YouTube URL — never paint through `.c-icon` / `mask-image`.

## Purpose

- Use for a single image, MP4, or YouTube embed inside Accordion / Card / Tabs / content / Hero.
- Use `width=full` for full-bleed; `width=half` for two-up from md.
- Do not use for decorative bleed backgrounds, icons, or multi-item galleries (compose several Media instances).
