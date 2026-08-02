---
type: component
name: accordion
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "2499:2626"
status: published
behavior: true
composes:
  - icon
tokensConsumed:
  - --color-text-primary
  - --color-text-secondary
  - --color-text-accent
  - --color-border-strong
  - --color-border-subtle
  - --color-border-focus
  - --color-canvas-subtle
  - --color-canvas-contrast
  - --color-bg-subtle
  - --color-disabled-text
  - --color-disabled-bg
  - --space-0
  - --space-1
  - --space-2
  - --space-3
  - --space-4
  - --space-5
  - --space-6
  - --border-radius-s
  - --border-radius-l
  - --border-width-xs
  - --border-width-s
  - --font-family-primary
  - --font-size-body-lg
  - --font-size-body-base
  - --font-size-body-sm
  - --font-size-h7
  - --lineheight-body-lg
  - --lineheight-body-base
  - --lineheight-body-sm
  - --lineheight-h7
  - --font-weight-regular
  - --font-weight-medium
  - --font-weight-semibold
---

# Accordion

Vertical stack of expand/collapse rows. Each row pairs a title (the
clickable header) with a body region that opens to reveal long-form
content — paragraph, bulleted list, inline learn-more link, image, or
video. Mirrors the canonical
[Web-ODS Shared Library → Pattern / Accordion](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28425&m=dev)
board (`2499:2626`), which publishes `accordion / group`
(`2499:2627`), `accordion / item`, and `accordion / card`.

## Summary

The Accordion is a progressive-disclosure pattern for vertically
stacked Q&A-style content. The component renders as a single
`.c-accordion` group wrapping one or more `.c-accordion__item` rows.
Every item is a native `<details>` / `<summary>` pair; co-located
`accordion.js` adds height animation, optional single-open enforcement,
and `lifelock:accordion:*` custom events. Appearance `card` maps to the
Figma `accordion / card` set (rounded `--color-bg-subtle` surfaces).

## Composes

Composes: icon (trailing chevron `arrows-navigation/simple-expand-more`,
optional leading icon via catalog key).

## Variant axes

| Axis | Values |
|---|---|
| `appearance` | `default` (divider rows) / `card` (rounded filled surfaces — Figma `accordion / card`) |
| `state` | `default` / `expanded` / `hover` / `focus` / `pressed` / `disabled` |
| `topDivider` | `true` / `false` (default) — group-level |
| `singleOpen` | `true` / `false` (default) — JS-only |
| `showDivider` | per-item bottom rule (default `true`; typically `false` under `card`) |
| `showIcon` | trailing chevron (default `true`) |
| `showLeadingIcon` | optional leading 24 px icon (default `false`) |
| `showBody` / `showList` / `showLink` / `showImage` / `showVideo` | content slots |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Items | Array | `items` | yes | `[]` | `{ id?, title, body?, linkLabel?, linkHref?, listItems?, imageSrc?, imageAlt?, videoSrc?, expanded?, disabled?, showDivider?, showIcon?, showLeadingIcon?, leadingIconName?, showBody?, showList?, showLink?, showImage?, showVideo?, state? }` |
| 2 | Appearance | Enum | `appearance` | no | `default` | `default` \| `card` |
| 3 | Top divider | Boolean | `topDivider` | no | `false` | |
| 4 | Single open | Boolean | `singleOpen` | no | `false` | |
| 5 | Group title | String | `groupTitle` | no | `null` | Optional `<h2>` |
| 6 | Name | String | `name` | no | `null` | Group id namespace |

## Tokens consumed

**Structural** — `--space-0`…`--space-6`, `--border-radius-s` /
`--border-radius-l`, `--border-width-xs` / `--border-width-s`.

**Typography** — `--font-family-primary`, `--font-weight-regular` /
`--font-weight-medium` / `--font-weight-semibold`, body-lg / body-base /
body-sm / h7 size + line-height pairs.

**Color** — `--color-text-primary` / `--secondary` / `--accent`,
`--color-border-strong` / `--subtle` / `--focus`,
`--color-canvas-subtle` / `--contrast`, `--color-bg-subtle`,
`--color-disabled-text` / `--bg`.

See themes/default/ for resolved values.

## Responsive behaviour

Intrinsically full-width; single-column at every breakpoint. Image /
video slots use `max-inline-size: 100%`. Placement on the page grid is
the consumer's responsibility.

## States

- **Default / Expanded** — persistent; expanded is `<details open>`.
- **Hover / Focus / Pressed** — CSS pseudo-classes; story freezes via `data-state`.
- **Disabled** — `data-disabled="true"`; JS short-circuits toggles.
- **Reduced motion** — skips height animation.

## Accessibility

- Native `<details>` / `<summary>` for keyboard, SR, and find-in-page.
- Chevron / leading icons are decorative (`aria-hidden`).
- Focus-visible outline uses `--color-border-focus`.
- Disabled items keep a readable label; summary uses `tabindex="-1"` when disabled.

## Design intent

Provide one shared progressive-disclosure pattern for FAQ / help /
terms content across default theme and first-party brands, with both the
classic divider list and the card surface from Figma.

## JavaScript API

### Init signature

| option | type | default | description |
|---|---|---|---|
| `singleOpen` | `boolean` | from `data-single-open` | Override single-open |
| `animate` | `boolean` | `true` | Height animation |
| `duration` | `number` | `200` | Animation ms |

### Instance shape

```ts
{
  destroy(): void;
  open(target: number | string): void;
  close(target: number | string): void;
  toggle(target: number | string): void;
  getOpen(): string[];
}
```

### Events

| name | detail | when fired |
|---|---|---|
| `lifelock:accordion:toggle` | `{ id, open, source }` | Every state change |
| `lifelock:accordion:opened` | `{ id, source }` | After open animation |
| `lifelock:accordion:closed` | `{ id, source }` | After close animation |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `data-state` | `hover` / `focus` / `pressed` | Story freezes |
| `data-disabled` | `true` | Disabled item |
| `data-single-open` | `true` | Group single-open |
| `data-animating` | `opening` / `closing` | During height transition |

### Keyboard

| key | behavior |
|---|---|
| `Enter` / `Space` | Toggle focused item |
| `Tab` | Move focus |

### SSR fallback

Without JS, native `<details>` still toggles. Height animation,
single-open, and custom events require `initAccordion` /
`initAccordions`.
