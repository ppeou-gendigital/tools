---
type: component
name: icon
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "984:863"
status: published
composes: []
tokensConsumed:
  - --icon-size
  - --icon-source
  - --color-text-primary
  - --color-text-brand
  - --color-text-accent
  - --color-text-inverse
  - --color-signal-success
  - --color-signal-critical
---

# Icon

Reusable icon primitive that paints an SVG silhouette in `currentColor`
via CSS `mask-image`. Mirrors the canonical
[Web-ODS Shared Library → Molecule / Icon Wrapper](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=984-863&m=dev)
(`984:863`) — sticker sheet [`984:2871`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=984-2871&m=dev),
Spec Frame [`3057:523`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3057-523&m=dev).

SVG assets are **package-local** (no cross-package icon fallback). Each
Storybook package discovers glyphs from its own `assets/icons/` via
`_icon-catalog.js`. Composed via `{{> icon name=… size=… color=…}}`.

## Summary

`Molecules/Icon` is the universal icon mask-wrapper primitive (BEM
`.c-icon`). It paints any catalog SVG as a `currentColor`-driven
silhouette so the same artwork re-skins under any theme without
re-authoring the SVG. Size ladder: Simple 16/20/24/32/48 and Detailed
40/48/64/72/80/96/144. Colour roles bind to semantic text/signal tokens.

## Composes

Composes: none.

## Variant axes

| Axis | Values |
|---|---|
| `name` | Catalog keys `"<category>/<simple\|detailed>-<name>"` (runtime via package `_icon-catalog.js`). |
| `size` | `16` / `20` / `24` / `32` / `40` / `48` / `64` / `72` / `80` / `96` / `144` → `.c-icon--<size>`. |
| `color` | `current` / `default` / `brand` / `accent` / `inverse` / `success` / `critical` → `.c-icon--<color>`. |
| `frame` | `none` (default) / `square` / `circle` / `vertical-rectangle` / `horizontal-rectangle` → `.c-icon--<frame>`. |
| `decorative` | `true` (default) / `false`. |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | — | String | `name` | yes | — | Catalog key. |
| 2 | Size | VARIANT | `size` | no | `"24"` | One of the eleven px steps. |
| 3 | Colour | VARIANT | `color` | no | `"current"` | Semantic paint or inherit. |
| 4 | Frame | VARIANT | `frame` | no | `"none"` | Transparent positioning envelope. |
| 5 | — | Boolean | `decorative` | no | `true` | `aria-hidden` vs `role="img"`. |
| — | — | String | `accessibleLabel` | when not decorative | `""` | `aria-label` when `decorative=false`. |

## Composition rules for consumers

`Molecules/Icon` IS the canonical Icon mask wrapper. Any unit that
displays a single-color glyph MUST use:

```handlebars
{{> icon name="<catalog-key>" size="<size>" color="<color>"}}
```

Forbidden in consumer `.hbs`: inline `<svg>` for catalog glyphs;
hand-rolled mask pipelines; CSS-pseudo-element icons.

Forbidden in consumer `.scss`: sizing the icon slot instead of the
partial `size` arg; setting `mask-image` / `mask-size` /
`background-color: currentColor` outside `.c-icon`.

**Double-count trap:** do not apply consumer-slot padding **and** pass
`size` equal to the padded outer control width. Map `size` from the
nested Icon INSTANCE px.

**Carve-out:** multi-color artwork → `iconCompositionOptOut: true` on
the consumer `spec.md`.

**Full-color brand marks** under `other-brands/`, `other-apps/`,
`social/`, and `payment/` (imported from Web-ODS-Icons
[Other Brands and apps](https://www.figma.com/design/7NjgRv0ac9SNpgwEO7wmfe/Web-ODS-Icons?node-id=2-2094&m=dev))
MUST NOT use `.c-icon` `mask-image` + `currentColor` — paints would be
discarded. Prefer:

```handlebars
<img src="{{iconUrl 'payment/visa-large'}}" alt="Visa">
```

Monochrome `external-brands/*` from the Iconography canvas remain the
mask-friendly set for UI chrome.

Enforced by [`f2p-audit-icon-composition`](../../../../.cursor/skills/f2p-audit-icon-composition/SKILL.md).

## Tokens consumed

**Structural** — `--icon-size`, `--icon-source`,
`--icon-frame-padding-block` / `--icon-frame-padding-inline`.

**Color** — `--color-text-primary`, `--color-text-brand`,
`--color-text-accent`, `--color-text-inverse`,
`--color-signal-success`, `--color-signal-critical`.

See `themes/default/_*.scss` (and brand theme overlays).

## Responsive behaviour

Intrinsic square box; no breakpoint axis.

## States

Presentational only — no hover / focus / pressed / disabled paints.

## Accessibility

- `decorative=true` (default) → `aria-hidden="true"`.
- `decorative=false` → `role="img"` + required `accessibleLabel`.
- Authors verify contrast at the rendered size; the component does not
  enforce WCAG.

## Design intent

One mask-wrapper for every single-color system glyph. Catalog growth
is asset-driven; the molecule stays axis-stable.

## Figma source

- Page [`984:863`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=984-863&m=dev)
- Component `Icon mask wrapper` [`988:1128`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=988-1128&m=dev)
- Sticker sheet [`984:2871`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=984-2871&m=dev)
- Spec Frame [`3057:523`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3057-523&m=dev)
- SVG catalog file: Web-ODS-Icons (`7NjgRv0ac9SNpgwEO7wmfe`) via `f2p-onboard-icon`

## Notes & open questions

- Frame padding ratios (vs `--icon-size`): square `0.125`, circle
  `0.0833`, vertical-rectangle `0.0833`/`0.1667`, horizontal-rectangle
  `0.1667`/`0.0833`. Avoid rectangle frames below size 24.
- Sticker Colour section ships five swatches; the code axis exposes the
  full semantic palette for consumers.
- Flag mask wrapper (`5250:792`) is a separate unit — out of scope here.
