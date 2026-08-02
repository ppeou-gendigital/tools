---
type: token
name: iconography
figmaFileKey: 7NjgRv0ac9SNpgwEO7wmfe
figmaNodeId: "2:2583"
status: published
brand: LifeLock
---

# Iconography

Catalog-level spec for the **icon library** — naming convention, sizing
ladder, color application, and how the `Design System/Iconography`
gallery renders the canonical Web-ODS-Icons page (LifeLock theme
variant of each icon). This unit documents the *catalog as a design
token*; the consumable primitive that paints any catalog entry on a
surface is `Components/Icon` (governed by
`storybook-lifelock/src/components/icon/spec.md`).

## Summary

The icon catalog ships 415 SVGs grouped into 15 categories (`actions`,
`arrows-navigation`, `brand`, `communication`, `devices-hardware`,
`documents-media`, `external-brands`, `finance`, `generic`,
`help-support`, `objects`, `product-features`, `security`, `status`,
`users`). Every asset under `storybook-lifelock/assets/icons/<category>/`
is auto-discovered at build time by
[`_icon-catalog.js`](../../components/icon/_icon-catalog.js); there is
no per-icon registry to update by hand — landing a new SVG at the right
path is enough to make it appear in the catalog and the gallery.

Linked Figma node:
[Web-ODS-Icons → `2:2583`](https://www.figma.com/design/7NjgRv0ac9SNpgwEO7wmfe/Web-ODS-Icons?node-id=2-2583&m=dev).

## Layered model

```
Asset (SVG)               storybook/assets/icons/<category>/<simple|detailed>-<name>.svg
  └─ Catalog token         <category>/<simple|detailed>-<name>     ← name keys consumed by Components/Icon
       └─ Component        Molecules/Icon paints the catalog token via mask-image + currentColor
            └─ Gallery     Design System/Iconography browses every catalog token (category sidebar + search + copy)
```

The catalog itself is *primitives-only* — there is no semantic alias
layer above the per-asset token. Re-skinning happens via the
component's `color` axis, not via a re-mapping of the catalog token.

## Token values

The catalog defines four orthogonal value enumerations. The per-asset
list is dynamic (see `Discovery` below) and not enumerated here.

### Naming convention

| Slot | Allowed values | Notes |
|------|----------------|-------|
| `<category>` | `actions`, `arrows-navigation`, `brand`, `communication`, `devices-hardware`, `documents-media`, `external-brands`, `finance`, `generic`, `help-support`, `objects`, `product-features`, `security`, `status`, `users` (extensible — adding a folder under `assets/icons/` adds a category) | Lowercase kebab-case folder names. |
| `<style>` | `simple`, `detailed` | Pixel-fit styles. `simple-*` icons are designed for the smaller size ladder; `detailed-*` icons for the larger one. |
| `<name>` | kebab-case identifier | E.g. `add`, `search`, `home`, `help`. Authoring rule: the SVG file basename is `<style>-<name>.svg`. |

The full catalog token name reads `<category>/<style>-<name>` (e.g.
`actions/simple-add`, `objects/detailed-public`).

### Size ladder

| Style | Size values (px) | CSS hook |
|-------|------------------|----------|
| `simple-*` | `16`, `20`, `24`, `32`, `48` | `.c-icon--size-16` … `.c-icon--size-48` (sets `--icon-size`) |
| `detailed-*` | `40`, `48`, `64`, `72`, `80`, `96`, `144` | `.c-icon--size-40` … `.c-icon--size-144` (sets `--icon-size`) |

`48` is the shared rung between the two bands. The full ladder is
eleven unique sizes — `16 / 20 / 24 / 32 / 40 / 48 / 64 / 72 / 80 / 96
/ 144` — and is shared in code; pairing a `simple-*` icon at 144 px
(or a `detailed-*` icon at 16 px) loses the design intent.

### Color application

| Color value | CSS variable consumed | Surface reading |
|-------------|----------------------|-----------------|
| `current` | inherits ambient `currentColor` | default — paints whatever the parent surface paints |
| `default` | `--color-text-primary` | on neutral surfaces |
| `brand` | `--color-text-brand` | on brand-tinted surfaces |
| `accent` | `--color-text-accent` | on accent-tinted surfaces |
| `inverse` | `--color-text-inverse` | on dark / inverted surfaces |
| `success` | `--color-signal-success` | success / confirmation states |
| `critical` | `--color-signal-critical` | critical / destructive states |

The canonical
[`.Sticker Sheet / Icon mask wrapper`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=990-1808&m=dev)
on Web-ODS Shared Library pictures these `color` values across five
swatches: success-ink + default-ink (on a light surface), plus inverse
ink on accent / brand / success surfaces. `brand` and `critical` are
exposed for code consumers but not pictured in the sticker sheet.

### Discovery

Catalog membership is auto-discovered at build time:

```js
// storybook-lifelock/src/components/icon/_icon-catalog.js
import.meta.glob('../../../assets/icons/**/*.svg')
```

Adding `storybook-lifelock/assets/icons/<category>/<style>-<name>.svg`
is the only manual step required to land a new icon. The catalog, the
`Design System/Iconography` browse gallery, and the `name` axis on
`Molecules/Icon` all pick it up without further code changes.

### Gallery UX

`Design System/Iconography` uses the shared renderer at
`@aics/storybook-lifelock/src/tokens/iconography/icon-gallery.js` (same UI in
core + every first-party brand with icons):

- **Sidebar** — “All” or a multi-select combination of icon categories
  (folder names under `assets/icons/`), each with a live count.
- **Search** — AND-matched tokens against category, style
  (`simple` / `detailed`), short name, and full catalog key.
- **Click to copy** — clicking a card copies the catalog key
  (e.g. `actions/simple-search`) to the clipboard.
- Size, color, and frame demos stay on **`Molecules/Icon`**, not in
  this token gallery.

## CSS implementation pattern

```css
/* Component-local custom properties consumed by .c-icon */
:root {
  /* Set per-instance via the component's name + size axes */
  --icon-source: url("/assets/icons/<category>/<style>-<name>.svg");
  --icon-size:   24px;
}

.c-icon {
  inline-size:  var(--icon-size);
  block-size:   var(--icon-size);
  mask-image:   var(--icon-source);
  mask-size:    contain;
  background-color: currentColor; /* paints the silhouette */
}

.c-icon--color-default  { color: var(--color-text-primary); }
.c-icon--color-brand    { color: var(--color-text-brand); }
.c-icon--color-accent   { color: var(--color-text-accent); }
.c-icon--color-inverse  { color: var(--color-text-inverse); }
.c-icon--color-success  { color: var(--color-signal-success); }
.c-icon--color-critical { color: var(--color-signal-critical); }
```

The pipeline is intentionally **CSS `mask-image` + `currentColor`**:
one SVG re-skins under any token, including future brand modes,
without re-authoring the asset.

## Authoring guidelines

Mirrors
[Web-ODS-Icons → `2:1318`](https://www.figma.com/design/7NjgRv0ac9SNpgwEO7wmfe/Web-ODS-Icons?node-id=2-1318&m=dev)
("Icon Guidelines"). The tier vocabulary used in `2:1318` is a
*reference* for designers authoring artwork at each size — the
consumable API in code uses the `simple-*` / `detailed-*` band labels
published by Web-ODS Shared Library
[`990:1808`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=990-1808&m=dev).

### Level-of-detail

Designers author each icon at a target tier; the same SVG renders at
every size in code via `mask-size: contain`, but the artwork is
pixel-fit at its tier's reference size first.

| Tier | Reference size (px) | Stroke width | Colour count | Shape ratio (icon inside frame) | Default render size | Recommended max resize |
|------|---------------------|--------------|--------------|---------------------------------|---------------------|------------------------|
| `XS` | `16` | `1.5 px` | 1 | 12 × 12 inside 16 × 16 frame | `16` | `24` |
| `S` | `24` | `1.5 px` | 1 | 18 × 18 inside 24 × 24 frame | `24` | `32` |
| `M` | `48` | `2 px` | 1–2 | 36 × 36 inside 48 × 48 frame | `48` | `96` |
| `L` | `96` | `2 px` | 1–3 | 72 × 72 inside 96 × 96 frame | `96` | `144` |

`simple-*` artwork is authored at `XS` / `S` and pixel-fits at
`16 / 20 / 24 / 32 / 48`. `detailed-*` artwork is authored at `M` / `L`
and pixel-fits at `40 / 48 / 64 / 72 / 80 / 96 / 144`. The shared
rung at `48` is the upper bound for `simple-*` and the lower bound
for `detailed-*`.

### Frame envelopes

The four frame shapes are transparent positioning envelopes — they
shrink the painted glyph to a smaller inner shape and have no border,
no fill, no chrome. Padding is symmetric per side, computed against
`--icon-size`:

| Frame | Padding-block ratio | Padding-inline ratio | Inner @ 24 px | Inner @ 48 px |
|-------|---------------------|----------------------|---------------|---------------|
| `square` | `0.125` | `0.125` | 18 × 18 (3 px / side) | 36 × 36 (6 px / side) |
| `circle` | `0.0833` | `0.0833` | 20 × 20 (2 px / side) | 40 × 40 (4 px / side) |
| `vertical-rectangle` | `0.0833` | `0.1667` | 20 × 16 (2 block / 4 inline) | 40 × 32 (4 block / 8 inline) |
| `horizontal-rectangle` | `0.1667` | `0.0833` | 16 × 20 (4 block / 2 inline) | 32 × 40 (8 block / 4 inline) |

Below size 24 px the rectangle frames produce sub-pixel inset values
that browsers round inconsistently — designers should avoid `vertical-rectangle`
/ `horizontal-rectangle` envelopes below 24 px, or accept that the
inner glyph will visibly drift by one device pixel between renders.

## Design decisions

1. **Auto-discovery over hand-curated catalog.** Asset landing → token
   landing is a one-step change. There is no per-icon registry to
   maintain, no risk of "added a SVG, forgot to update the enum".
2. **Two pixel-fit styles, shared size ladder.** `simple-*` and
   `detailed-*` are presentation labels, not separate components. The
   shared eight-step `size` axis keeps the API symmetric while the
   pairing convention preserves design intent.
3. **`currentColor` is the default.** The most common consumer is "an
   icon next to text" — having the icon inherit the surrounding text
   colour is the right default. The named color values
   (`brand` / `accent` / `success` / `critical`) are escape hatches,
   not the normal path.
4. **Browse gallery is shared across Storybooks.** Category sidebar +
   search + click-to-copy lives in `@aics/storybook-lifelock`’s
   `icon-gallery.js`; each package passes its own local catalog so
   icons never inherit across brands. Color / size / frame stickers
   stay on `Molecules/Icon` (LifeLock).

## Notes & open questions

- **Catalog drift.** When new categories land, sidebar order follows
  alphabetical category folder names — re-verify against the
  canonical Figma sticker sheet if designers introduce a preferred
  order.

## Figma source

- [Web-ODS-Icons → `2:2583` (Iconography catalog)](https://www.figma.com/design/7NjgRv0ac9SNpgwEO7wmfe/Web-ODS-Icons?node-id=2-2583&m=dev)
  — canonical sticker sheet of every catalog asset (LifeLock theme).
- [Web-ODS-Icons → `2:1318` (Icon Guidelines)](https://www.figma.com/design/7NjgRv0ac9SNpgwEO7wmfe/Web-ODS-Icons?node-id=2-1318&m=dev)
  — authoring guidance: level-of-detail tiers, stroke widths, shape
  ratios, frame envelopes. Mirrored in `## Authoring guidelines` above.
- [Web-ODS Shared Library → `990:1808` (Icon mask wrapper sticker sheet)](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=990-1808&m=dev)
  — canonical sticker sheet for the *consumable* Icon primitive (the
  `Components/Icon` Sheet, governed by `src/components/icon/spec.md`).
