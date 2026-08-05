---
type: component
name: table-cell
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "5957:257"
status: published
behavior: false
composes:
  - icon
  - content-title
  - content-body
tokensConsumed:
  - --space-3
  - --border-width-xs
  - --color-bg-muted
  - --color-bg-primary
  - --color-border-subtle
  - --color-text-primary
---

# Table Cell

Slot-driven table cell molecule for composed data tables. Mirrors
[Table cell · content slot `5957:257`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5957-257&m=dev)
on Pattern / TableCell (`4339:13401`) and Spec Frame
[`.Table cell · content slot · spec` `5960:299`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5960-299&m=dev).

**Out of scope:** `.Table cell [DEPRECATED]` boards on the same page.

## Summary

`.c-table-cell` is a presentation molecule with Type (`header` / `body`)
and Align (`left` / `center` / `right`). Default text uses Content title
(H7 / emphasis) for Header and Content body (body-base / base) for Body.
Optional leading/trailing icons; Background and Borders toggles with
per-side border booleans. For table layout, consumers (or Table block)
overlap adjacent cells by `-1px` so shared borders collapse to one line.

## Composes

Composes: icon, content-title, content-body.

## Variant axes

| Axis | Values |
|---|---|
| `type` | `header` / `body` |
| `align` | `left` / `center` / `right` |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Type | VARIANT | `type` | no | `"body"` | `header` or `body`. |
| 2 | Align | VARIANT | `align` | no | `"left"` | Content alignment. |
| 3 | Background | BOOLEAN | `background` | no | `true` | Header → `--color-bg-muted`; Body → `--color-bg-primary`. |
| 4 | Borders | BOOLEAN | `borders` | no | `true` | Master gate for per-side borders. |
| 5 | Top border | BOOLEAN | `topBorder` | no | `true` | |
| 6 | Right border | BOOLEAN | `rightBorder` | no | `true` | |
| 7 | Bottom border | BOOLEAN | `bottomBorder` | no | `true` | |
| 8 | Left border | BOOLEAN | `leftBorder` | no | `true` | |
| 9 | Leading icon | BOOLEAN | `leadingIcon` | no | `false` | Demo default `true` to match Figma sticker. |
| 10 | Trailing icon | BOOLEAN | `trailingIcon` | no | `false` | |
| 11 | — | TEXT | `leadingIconName` | no | `objects/simple-device-vehicle` | Catalog key. |
| 12 | — | TEXT | `trailingIconName` | no | `objects/simple-device-vehicle` | Catalog key. |
| 13 | — | TEXT | `label` | no | `"Header"` / `"Cell text"` | Default plain-text slot. |
| 14 | — | TEXT | `contentHtml` | no | — | Escape hatch; skips default title/body. |
| 15 | — | TEXT | `width` | no | — | Optional demo width. |

## Tokens consumed

**Structural** — `--space-3` (padding + gap), `--border-width-xs` (1 px borders).

**Surfaces** — `--color-bg-muted` (header), `--color-bg-primary` (body).

**Borders** — `--color-border-subtle` (Figma tertiary).

**Content** — `--color-text-primary` (icons). Typography tokens come from composed content-title / content-body.

See this package's Design System token galleries and themes/default/ for resolved values.

## Responsive behaviour

Cells are content-sized by default. Table block / consumer grids set
column widths. No breakpoint axis on the content-slot set.

## States

Presentation-only. No hover / focus / disabled paints on the content-slot
set. Interaction belongs to surrounding table behaviour if needed later.

## Accessibility

- Cell root is a `<div>` for flexible composition inside table-block rows
  (not a native `<td>` — consumers may wrap in semantic table markup).
- Icons are decorative (`aria-hidden` + `decorative=true`).
- Prefer meaningful text in `label` / `contentHtml`.

## Design intent

Atomic cell for designers to drop any content into a typed, aligned
frame with optional chrome. Pair with Table block for multi-cell demos.

## Figma source

- [Pattern / TableCell page `4339:13401`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4339-13401&m=dev)
- [Table cell · content slot `5957:257`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5957-257&m=dev)
- [Spec Frame `5960:299`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5960-299&m=dev)
- Deprecated sets on the same page are intentionally not implemented.
