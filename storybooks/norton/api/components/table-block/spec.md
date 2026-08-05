---
type: component
name: table-block
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "5914:53"
status: published
behavior: false
composes:
  - table-cell
tokensConsumed:
  - --color-bg-primary
---

# Table Block

Composed table pattern that stacks Table cell instances in rows.
Mirrors
[Table block · content slot `5914:53`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5914-53&m=dev)
on Pattern / TableBlock (`4339:13402`) and Spec Frame
[`.Table block · content slot · spec` `6032:729`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=6032-729&m=dev).

**Out of scope:** `.Table block [DEPRECATED — use Table block · content slot]`.

## Summary

`.c-table-block` exposes a single content slot implemented as a `rows`
array of cell-arg objects (or `slotHtml`). Default demo is a 3-column
header row plus three body rows. Adjacent cells and rows overlap by
`-1px` so shared borders collapse to one line.

## Composes

Composes: table-cell.

## Variant axes

| Axis | Values |
|---|---|
| _(none on the block)_ | Structure is authored via `rows` / `slotHtml`. Cell Type × Align live on `table-cell`. |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Table content | SLOT | `rows` | no | demo matrix | Array of `{ cells: [table-cell args] }`. |
| 2 | — | TEXT | `slotHtml` | no | — | Escape hatch replacing `rows`. |
| — | — | OBJECT | `rows[].cells[]` | — | — | Per-cell args forwarded to `table-cell` (see that unit’s Properties). |

## Tokens consumed

**Surfaces** — `--color-bg-primary` on the content wrapper. Cell paints and
borders come from composed `table-cell`.

See this package's Design System token galleries and themes/default/ for resolved values.

## Responsive behaviour

Block is `fit-content` wide; wrap in a scroll container or page grid for
narrow viewports. No breakpoint axis on the content-slot symbol.

## States

Presentation-only static markup. No interaction JS.

## Accessibility

- Default markup uses div rows/cells for flexible composition. When
  shipping production tables, wrap or replace with native `<table>` /
  `<th>` / `<td>` as appropriate and keep cell content accessible.
- Decorative icons remain decorative via `table-cell`.

## Design intent

Give designers a drop-in table frame whose cells stay instances of
Table cell · content slot — no detach required. Stories document the
object model consumers pass for CMS / Handlebars composition.

## Figma source

- [Pattern / TableBlock page `4339:13402`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4339-13402&m=dev)
- [Table block · content slot `5914:53`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5914-53&m=dev)
- [Spec Frame `6032:729`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=6032-729&m=dev)
- Deprecated sets on the same page are intentionally not implemented.
