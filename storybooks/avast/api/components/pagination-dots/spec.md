---
type: component
name: pagination-dots
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1278:1668"
status: published
composes: []
tokensConsumed:
  - --color-text-primary
  - --color-text-inverse
  - --color-bg-default
  - --color-border-subtle
  - --space-3
  - --border-radius-pill
  - --border-width-default
---

# Pagination Dots

Presentational pagination indicator: a horizontal row of small dots
where the active dot **expands** into a pill that announces the
current page. Mirrors the canonical
[Web-ODS Shared Library → Pagination dots master](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1278-1668&m=dev)
(`1278:1668`) and the
[light / dark preview composition](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1278-1877&m=dev)
(`1278:1877`). Core default theme unit; brand packages supply theme token values.

## Summary

The component renders a row of `count` inactive dots (8 × 8 px) plus
**one** expanding active pill (~24 × 8 px) at position `current`.
Inactive dots use neutral border-subtle fills on a light surface
(`appearance: light`) or content-inverse fills on a dark surface
(`appearance: dark`). The active pill always paints with the inverse
of the inactive dot for contrast. The component is **presentational
only** — it does not own page-change navigation. Consumers wrap it in
their own navigation control (a list of links, a button group, a JS
carousel) and re-render with an updated `current` prop on page change.
Linked Figma:
[`1278:1668`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1278-1668&m=dev).

## Composes

Composes: none. Dots are unstyled `<span>` elements painted via CSS.

## Variant axes

| Axis | Values |
|---|---|
| `count` | `2` … `8` integer. Total dot count. |
| `current` | `1` … `count` integer. Position of the active pill (1-indexed). |
| `appearance` | `light` (default) / `dark`. Repaints inactive vs active fills for the surface the component sits on. |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Count | Integer (2-8) | `count` | yes | `5` | Total number of dots rendered in the row. |
| 2 | Current | Integer (1-based) | `current` | yes | `1` | Position of the active expanding pill (1-indexed). Must be `>= 1` and `<= count`. |
| 3 | Appearance | Enum (`light` / `dark`) | `appearance` | no | `"light"` | `light` paints inactive dots `--color-border-subtle` + active pill `--color-text-primary`; `dark` paints inactive dots `--color-text-inverse` at 40 % opacity + active pill `--color-bg-default`. Designer follow-up: publish a dedicated `--color-pagination-dot-inactive-on-dark` semantic alias so the dark-mode wash doesn't bind to a foreground-role token at runtime opacity. |
| 4 | Accessible label | Text | `accessibleLabel` | no | `"Page {current} of {count}"` | Bound to the root `<nav>`'s `aria-label`. Tokens `{current}` and `{count}` interpolate at render time. |

## Tokens consumed

**Structural** — `--space-3` (8 px gap between dots — mirrors the Figma master `1278:1668` `gap: var(--space/space-3, 8px)`), `--border-radius-pill` (dot + pill corners), `--border-width-default` (focus ring when consumer wraps the component in an interactive control).

**Light appearance** — `--color-border-subtle` (inactive dot fill), `--color-text-primary` (active pill fill).

**Dark appearance** — `--color-text-inverse` (inactive dot fill at 40 % via `color-mix()`), `--color-bg-default` (active pill fill). Substitutes for a dedicated dark-surface inactive-dot semantic alias which other brand has not published; see properties table note.

## Responsive behaviour

The row paints at a fixed total inline size = `(count - 1) × 8px +
(count - 1) × 8px gap + active-pill-extra`. The active pill expands
inline; the surrounding dots do not reflow. RTL: gap + pill expansion
both use logical properties so the component reads natively under
`dir="rtl"`.

## States

This unit ships no interaction states. The semantic state is
captured in `aria-current="step"` on the active dot, and the root
`<nav>` announces the page position via `aria-label`.

## Accessibility

- Root element is `<nav>` with `aria-label="Page {current} of {count}"` (the literal interpolated label).
- Active dot carries `aria-current="step"`.
- Inactive dots are plain `<span>` (no interactive semantics).
- WCAG: every (appearance × position) combination meets AA non-text contrast on its target surface.

## Design intent

Use expanding-dot pagination for carousels, image galleries, and short
onboarding flows where total page count is small (≤ 8) and the visual
weight of a number-based pagination bar would dominate. For long page
counts use the canonical Pagination component (numbered).

## Notes & open questions

- **Dark-mode inactive-dot token substitution.** Same class of substitution as the Checkbox / Radio state-circle wash: the dark-mode inactive dots paint with `--color-text-inverse` at 40 % opacity via `color-mix()`, because other brand has no `--color-pagination-dot-inactive-on-dark` (or equivalent) semantic alias. Designer follow-up logged for a dedicated alias.
