---
type: component
name: content-list
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "3483:3503"
status: published
composes:
  - icon
  - switch
  - checkbox
  - radio
tokensConsumed:
  - --color-text-primary
  - --color-bg-subtle
  - --font-family-primary
  - --font-size-body-sm
  - --lineheight-body-sm
  - --letterspacing-body-sm
  - --font-weight-regular
  - --space-0
  - --space-3
  - --space-7
  - --border-radius-l
---

# Content List

Pattern for bulleted, numbered, nested, and control-led list rows. Figma: [Pattern / ContentList](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3483-3503&m=dev) (page `3483:3503`; Spec Frames Unordered `3862:323`, Ordered `3863:370`, Nested `3864:413`, Content list item `3861:272`; item set `3483:3631`).

## Summary

A semantic `<ul>` / `<ol>` with BEM root `.c-content-list`. List arrangement (`listType`) picks unordered, ordered, or nested structure. Marker treatment (`marker`) and `surfaced` card chrome apply to unordered (and carry through nested children). Each row is a `.c-content-list__item` that may paint a text/icon marker or compose Switch / Checkbox / Radio. Typography is Body sm / base weight; ink is `--color-text-primary`.

## Composes

Composes: icon (icon-marker treatment), switch, checkbox, radio (control item types).

## Variant axes

| Axis | Values |
|---|---|
| listType | `unordered`, `ordered`, `nested` |
| marker | `bullet`, `icon` |
| surfaced | `true`, `false` |

Figma Unordered Spec Frame publishes Default (bullet) / Icon marker / Surfaced. Ordered Spec Frame publishes Default / Surfaced. Nested Spec Frame publishes ul-in-ul / ol-in-ol / ol-in-ul. Item `Type` axis on set `3483:3631`: Unordered | Ordered | Nested | Switch | Checkbox | Radio.

Defaults: `listType=unordered`, `marker=bullet`, `surfaced=false`.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | — | enum | `listType` | yes | `unordered` | → `<ul>` vs `<ol>`; nested still picks root tag |
| 2 | marker | enum | `marker` | no | `bullet` | `bullet` \| `icon`; icon only for text-marker rows |
| 3 | icon | catalog-key | `iconName` | no | `status/simple-checkmark-small` | Shared default for icon-marker rows when item omits `iconName` |
| 4 | surfaced | boolean | `surfaced` | no | `false` | Card chrome: `--color-bg-subtle`, `--space-7` pad, `--border-radius-l` |
| 5 | items | array | `items` | yes | — | Content list item rows |
| 6 | — | plain-text | `items[].text` | yes | — | Body copy |
| 7 | Type | enum | `items[].type` | no | inherits listType | `unordered` \| `ordered` \| `nested` \| `switch` \| `checkbox` \| `radio` |
| 8 | — | catalog-key | `items[].iconName` | no | — | Per-row icon override |
| 9 | — | boolean | `items[].checked` | no | `false` | Switch / checkbox / radio |
| 10 | — | array | `items[].children` | no | — | Nested child items (nested arrangement) |
| 11 | — | enum | `items[].childrenListType` | no | `unordered` | Child list tag when `children` present |
| 12 | — | text | `className` | no | `""` | Outer escape hatch |

## Tokens consumed

**Color** — `--color-text-primary` (body + markers); `--color-bg-subtle` (Surfaced chrome — Figma `Color/Background/secondary`).

**Typography** — `--font-family-primary`; `--font-size-body-sm` / `--lineheight-body-sm` / `--letterspacing-body-sm`; `--font-weight-regular`.

**Spacing / radius** — `--space-3` (item gap); `--space-7` (Surfaced padding + nested indent); `--space-0`; `--border-radius-l` (Surfaced).

See themes/default/ for resolved values.

## Responsive behaviour

Fluid width — `inline-size: 100%`. No breakpoint axis; lists reflow with parent column width. Nested child lists indent `--space-7` on the inline-start edge.

## States

- **Default** — only modelled visual state for static lists.
- **Hover / Focus / Pressed** — not modelled on the list; wrap inline links in Text link.
- **Control items** — Switch / Checkbox / Radio carry their own interaction states via the composed molecules.
- **Disabled / Loading** — not modelled at list level.

## Accessibility

- Real `<ul>` / `<ol>` + `<li>` — never stacked `<div>`s (including Surfaced).
- Text / bullet markers are decorative; native list semantics announce count.
- Icon markers are `aria-hidden="true"`; meaning lives in body text.
- Control rows use the composed molecule’s native `<input>` + label association (`accessibleLabel` when needed).
- Contrast: Body sm on white / `--color-bg-subtle` clears WCAG AA.
- No motion.

## Design intent

Content list is the unranked / ranked / nested list pattern for Web-ODS section copy. Prefer Content body for paragraphs; Content title for headings; Content block when composing a titled slotted section that may contain lists.

## Notes & open questions

- Figma ships **four** Spec symbols on the Content list page (Unordered / Ordered / Nested / Content list item). This unit merges them into one `spec.md`. Stage 0 first-match discovery will only see one instance — keep Spec Frame prose aligned manually across the four symbols when designers update them.
