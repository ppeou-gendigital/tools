---
type: component
name: lower-footer
subtype: block
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "2498:2022"
status: published
behavior: false
iconCompositionOptOut: true
composes:
  - divider
  - logo-wrapper
  - content-body
  - menu-list
tokensConsumed:
  - --space-0
  - --space-2
  - --space-4
  - --space-7
  - --space-8
  - --opacity-50
  - --color-text-secondary
  - --color-text-inverse
  - --color-bg-inverse
  - --color-border-strong
  - --font-family-primary
---

# Lower Footer

Final low-emphasis utility band under the main footer. Mirrors
[Block / Lower Footer `3598:2174`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3598-2174&m=dev)
component set `2498:2022` and Spec
[`.Lower footer · spec` `4278:466`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4278-466&m=dev).

## Summary

`.c-lower-footer` stacks a top divider, Gen logo lockup + affiliation statement, copyright / trademark paragraph, and an optional policy link row. Theme light/dark is presentational; Desktop vs Mobile is CSS-responsive (wrap + right-bordered row vs 2-up columns). Not a replacement for upper footer navigation.

## Composes

Composes: divider, logo-wrapper, content-body, menu-list.

## Variant axes

| Axis | Values |
|---|---|
| Theme | `light`, `dark` |
| ShowLowerLinks | `true`, `false` |

Device (Desktop / Mobile) is implemented via CSS breakpoints, not a BEM axis.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Theme | enum | `theme` | no | `light` | `light` \| `dark` → `.c-lower-footer--theme-*` |
| 2 | Show lower links | boolean | `showLowerLinks` | no | `true` | Hides the link nav when false |
| 3 | — | image-url | `logoSrc` | no | `/assets/logos/gen-horizontal.svg` | Gen corporate mark |
| 4 | — | TEXT | `logoAlt` | no | `Gen` | |
| 5 | — | TEXT | `brandName` | no | `[Brand]` | Interpolated into statement |
| 6 | — | TEXT | `statement` | no | built | Affiliation sentence |
| 7 | — | number | `copyrightYear` | no | current year | Dynamic year |
| 8 | — | TEXT | `copyrightText` | no | built | Full legal paragraph |
| 9 | — | array | `links` | no | default 10 | `{ label, href }[]` → menu-list rows |
| 10 | — | TEXT | `navLabel` | no | `Legal and company links` | `aria-label` on `<nav>` |

## Tokens consumed

**Structural** — `--space-0`, `--space-2`, `--space-4`, `--space-7`, `--space-8`, `--opacity-50`.

**Color** — `--color-text-secondary`, `--color-text-inverse`, `--color-bg-inverse`, `--color-border-strong`.

**Typography** — `--font-family-primary` (sizes via content-body).

See themes/default/ for resolved values.

## Responsive behaviour

- **&lt; 768px** — logo ~38px; statement wraps under logo; links in a 2-column grid; menu-list right borders hidden.
- **≥ 768px** — logo ~72px; lockup row with `--space-7` gap; links wrap horizontally with right-border separators between items.

## States

Presentation only — link hover/focus owned by menu-list / browser defaults. No JS.

## Accessibility

- Root is `<footer>`.
- Link group is `<nav aria-label="…">` wrapping a `<ul role="list">` of menu-list rows with `role="listitem"`.
- Logo uses a native `img` with descriptive `alt` (or empty when named nearby).
- Copyright year is rendered dynamically — do not bake a static year into production copy.

## Design intent

Close every page with consistent legal, brand affiliation, and compliance links. Keep the band low-emphasis; do not use for primary navigation or marketing CTAs (upper footer / page body).

## Figma source

- [Block / Lower Footer `3598:2174`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3598-2174&m=dev)
- [Component set `2498:2022`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2498-2022&m=dev)
- [`.Lower footer · spec` `4278:466`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4278-466&m=dev)
