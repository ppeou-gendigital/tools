---
type: component
name: button
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "2434:14483"
status: published
composes:
  - icon
tokensConsumed:
  - --button-primary-bg-default
  - --button-primary-bg-hover
  - --button-primary-bg-pressed
  - --button-primary-content-default
  - --button-primary-content-hover
  - --button-primary-content-pressed
  - --button-primary-border
  - --button-secondary-bg-default
  - --button-secondary-bg-hover
  - --button-secondary-bg-pressed
  - --button-secondary-content-default
  - --button-secondary-content-hover
  - --button-secondary-content-pressed
  - --button-secondary-border
  - --button-tertiary-bg-default
  - --button-tertiary-bg-hover
  - --button-tertiary-bg-pressed
  - --button-tertiary-content-default
  - --button-tertiary-content-hover
  - --button-tertiary-content-pressed
  - --button-tertiary-border
  - --button-inverse-bg-default
  - --button-inverse-bg-hover
  - --button-inverse-bg-pressed
  - --button-inverse-content-default
  - --button-inverse-content-hover
  - --button-inverse-content-pressed
  - --button-inverse-border
  - --button-text-bg-default
  - --button-text-bg-hover
  - --button-text-bg-pressed
  - --button-text-content-default
  - --button-text-content-hover
  - --button-text-content-pressed
  - --button-primary-ghost-bg-default
  - --button-primary-ghost-bg-hover
  - --button-primary-ghost-bg-pressed
  - --button-primary-ghost-content-default
  - --button-primary-ghost-content-hover
  - --button-primary-ghost-content-pressed
  - --button-primary-ghost-border
  - --button-secondary-ghost-bg-default
  - --button-secondary-ghost-bg-hover
  - --button-secondary-ghost-bg-pressed
  - --button-secondary-ghost-content-default
  - --button-secondary-ghost-content-hover
  - --button-secondary-ghost-content-pressed
  - --button-secondary-ghost-border
  - --button-gradient-bg-default
  - --button-gradient-bg-hover
  - --button-gradient-bg-pressed
  - --button-gradient-content-default
  - --button-gradient-content-hover
  - --button-gradient-content-pressed
  - --button-gradient-border
  - --button-disabled-bg
  - --button-disabled-content
  - --button-disabled-border
  - --button-focus-ring
  - --button-spinner-track
  - --button-spinner-fill
  - --button-radius
  - --button-radius-focus
  - --button-border-width-primary
  - --button-border-width-secondary
  - --button-border-width-ghost
  - --button-border-width-focus
  - --button-block-size-s
  - --button-block-size-m
  - --button-block-size-l
  - --button-block-size-xl
  - --button-min-inline-size
  - --button-padding-block-s
  - --button-padding-block-m
  - --button-padding-block-l
  - --button-padding-block-xl
  - --button-padding-inline-s
  - --button-padding-inline-m
  - --button-padding-inline-l
  - --button-padding-inline-xl
  - --button-gap
  - --button-icon-size-s
  - --button-icon-size-m
  - --button-icon-size-l
  - --button-icon-size-xl
  - --font-family-primary
  - --font-size-body-base
  - --font-size-body-sm
  - --font-weight-semibold
  - --lineheight-body-base
  - --lineheight-body-sm
---

# Button

Canonical call-to-action — single BEM root (`.btn`) covering eight
`Type` styles × four `Size` values × `iconButton`. Mirrors
[Web-ODS Shared Library → Button `2434:14483`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2434-14483&m=dev).
Layer-4 `--button-*` aliases live in `themes/default/_button.scss`
(default theme / brand themes); LifeLock keeps Figma-true paints in
`storybook-lifelock/src/tokens/button/`.

## Summary

One `.btn` block with `--style` / `--size` / `--icon-button` modifiers.
Interaction states paint via CSS pseudo-classes. `loading` is
code-only (`is-loading` + spinner + `aria-busy`).

## Composes

Composes: icon (leading / trailing / icon-only slots via `{{> icon}}`).

## Variant axes

| Axis | Values |
|---|---|
| `style` | `primary` / `secondary` / `tertiary` / `inverse` / `text` / `primary-ghost` / `secondary-ghost` / `gradient` |
| `size` | `s` / `m` / `l` (default) / `xl` |
| `iconButton` | `false` (default) / `true` |
| `state` | `default` / `hover` / `focus` / `pressed` / `disabled` (CSS only) |
| `loading` | `false` (default) / `true` (code-only) |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Label | Text | `label` | when not iconButton | `Button` | |
| 2 | Type | Enum | `style` | no | `primary` | Figma Type axis |
| 3 | Size | Enum | `size` | no | `l` | |
| 4 | Icon button | Boolean | `iconButton` | no | `false` | Requires `accessibleLabel` |
| 5 | — | Boolean | `loading` | no | `false` | Code-only |
| 6 | — | Boolean | `disabled` | no | `false` | |
| 7 | — | Boolean | `showLeadingIcon` | no | `false` | |
| 8 | — | String | `leadingIcon` | no | — | Catalog key |
| 9 | — | Boolean | `showTrailingIcon` | no | `false` | |
| 10 | — | String | `trailingIcon` | no | — | Catalog key |
| 11 | — | String | `accessibleLabel` | when iconButton | `null` | |
| 12 | — | Enum | `type` | no | `button` | HTML type |

## Tokens consumed

**Surfaces** — `--button-{style}-*` per Type (see frontmatter).

**Geometry** — `--button-block-size-*`, padding / gap / icon-size ladder,
`--button-radius*`, `--button-border-width-*`.

**Universal** — `--button-disabled-*`, `--button-focus-ring`, spinner pair.

See `themes/default/_button.scss` for default theme values.

## Responsive behaviour

Fit-content molecule. No breakpoint axis — size is authored.

## States

- `hover` / `focus-visible` / `active` — CSS pseudo-classes (+ `data-state` freeze for galleries)
- `disabled` — native `disabled` + universal disabled paints
- `loading` — `.is-loading`, spinner replaces leading icon

## Accessibility

- Native `<button>`; `aria-label` required for icon-only
- Focus ring via `:focus-visible` + `--button-focus-ring`
- `aria-busy` when loading; honour `prefers-reduced-motion`

## Design intent

Shared CTA primitive for all first-party brands. Brand themes supply
`--button-*` paints; markup and BEM stay identical.
