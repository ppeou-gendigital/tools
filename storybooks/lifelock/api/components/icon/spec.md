---
type: component
name: icon
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "990:1808"
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
[Web-ODS Shared Library → Icon mask wrapper](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=990-1808&m=dev)
sticker sheet (LifeLock theme). The catalog of SVG assets the
component paints is governed separately by the iconography token
(`src/tokens/iconography/spec.md` → Web-ODS-Icons / `2:2583`) and is
auto-discovered by `_icon-catalog.js` from every SVG under
`storybook-lifelock/assets/icons/<category>/`, so the number of icons /
categories grows as the asset extraction lands more files — there is
no per-icon list to update by hand. Composed by every consumer that
ships an icon — buttons, links, chips, accordions, banners — via the
registered Handlebars partial `{{> icon name=… size=… color=…}}`. The
exact composition contract — what consumers MUST do, what they MUST
NOT do, and the documented carve-out for multi-color brand artwork —
is codified in the `## Composition rules for consumers` section
below.

## Summary

`Components/Icon` is the universal icon primitive. It paints any SVG
from the catalog as a `currentColor`-driven silhouette using CSS
`mask-image`, so the same artwork re-skins under any token, brand, or
state without re-authoring the SVG. Linked Figma node:
[`990:1808`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=990-1808&m=dev)
on **Web-ODS Shared Library** — the `.Sticker Sheet / Icon mask wrapper`
that publishes the size ladder (Simple 16/20/24/32, Detailed
40/48/64/80) and the canonical Color section (ink-only success /
default plus inverse-on-accent / inverse-on-brand / inverse-on-success
surfaces).

## Composes

Composes: none.

## Figma description

> Apply a system colour appropriate to the surface the icon is placed on.

Quoted verbatim from the canonical `.Sticker Sheet / Icon mask wrapper`
on Web-ODS Shared Library
([`990:1808`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=990-1808&m=dev)).
In practice that resolves to two patterns the sticker sheet publishes
side-by-side: ink-only intent colours (`success`, `default`) on a light
surface, and inverse ink (`--color-text-inverse`) on tinted
surfaces (`--color-highlight-accent`, `--color-background-brand`,
`--color-signal-success`).

## Variant axes

| Axis | Values |
|---|---|
| `name` | 290 catalog keys of the form `"<category>/<simple\|detailed>-<name>"` (e.g. `"actions/simple-add"`, `"objects/simple-home"`, `"help-support/detailed-help"`). The full list is enumerated at runtime by `_icon-catalog.js`. |
| `size` | `16` / `20` / `24` / `32` / `48` (designed for `simple-*` variants) and `40` / `48` / `64` / `72` / `80` / `96` / `144` (designed for `detailed-*` variants). `48` is shared between both bands. The eleven unique values yield eleven `.c-icon--size-*` modifiers. |
| `color` | `current` (inherits `currentColor`) / `default` / `brand` / `accent` / `inverse` / `success` / `critical` |
| `frame` | `none` (default — paints just the glyph) / `square` / `circle` / `vertical-rectangle` / `horizontal-rectangle`. Transparent positioning envelope that shrinks the painted glyph to a smaller inner shape via `mask-clip: content-box` + computed `padding-block` / `padding-inline`. No border, no fill. |

`simple-*` icons are pixel-fit at 16 / 20 / 24 / 32 / 48 px; `detailed-*`
icons carry more line work and are pixel-fit at 40 / 48 / 64 / 72 / 80 /
96 / 144 px. The `size` enum is shared so a consumer can ask for any
size with any icon, but pairing a `detailed-*` icon at 16 px (or a
`simple-*` icon at 144 px) loses the design intent. The `frame` axis is
orthogonal — any frame combines with any size — but vertical /
horizontal rectangle frames at sizes below 24 px produce sub-pixel
padding values; authors should avoid those combinations.

## Fixture keys → BEM

| Fixture key | Binds to |
|---|---|
| `name` | Resolved to a `/assets/icons/<category>/<name>.svg` URL via the `iconUrl` Handlebars helper, then surfaced as the `--icon-source` CSS custom property on the root `<span>`. |
| `size` | Appended as `c-icon--size-<value>` modifier on the root, sets `--icon-size`. |
| `color` | Appended as `c-icon--color-<value>` modifier on the root, sets `color` (which the mask paints via `background-color: currentColor`). |
| `frame` | When omitted or `'none'`, no class is added — the root paints the glyph edge-to-edge (today's behavior). When set to one of the four frame shapes, appended as `c-icon--frame-<value>` modifier; the modifier sets `--icon-frame-padding-block` / `--icon-frame-padding-inline` (via `calc(var(--icon-size) * <ratio>)`) and the mask shrinks to the resulting content box. |
| `decorative` | When `true`, root carries `aria-hidden="true"` and `accessibleLabel` is ignored. When `false`, root carries `role="img"` and `aria-label="{{accessibleLabel}}"`. |
| `accessibleLabel` | Bound to the root's `aria-label` when `decorative=false`. Required in that case; ignored otherwise. |

## Composition rules for consumers

`Components/Icon` IS the canonical "Icon mask wrapper" — the
`<span class="c-icon …">` element this primitive renders mirrors
Web-ODS Shared Library / `.Sticker Sheet / Icon mask wrapper` (`990:1808`)
node-for-node. Its own root span owns the size box, the
`mask-image` pipeline, and the `currentColor` paint.

**Hard composition rule.** Any unit that needs to display a
single-color icon-style glyph MUST embed it via the registered
Handlebars partial:

```handlebars
{{> icon name="<catalog-key>" size="<size>" color="<color>"}}
```

Forbidden in the consumer's `.hbs`:

- Inline `<svg>` markup for a glyph the icon catalog already ships.
- Hand-rolled `<span>` / `<i>` elements that re-implement the
  `mask-image` + `currentColor` pipeline.
- CSS-pseudo-element icons (`::before { content: "" … }` with a
  background-image of an SVG asset).

Forbidden in the consumer's `.scss`:

- Setting `width` / `height` / `inline-size` / `block-size` on any
  element that the consumer's template renders `{{> icon ...}}` into
  (typical names: `__icon`, `__leading-icon`, `__trailing-icon`,
  `__chevron`, `__arrow`, `__caret`). Size belongs on the partial
  call's `size` argument, never on the consumer's slot.
- Setting `mask-image`, `mask-size`, `background-color: currentColor`,
  `-webkit-mask-*` on any consumer selector. Those properties belong
  to `.c-icon` and only to `.c-icon`.

**Documented carve-out — multi-color brand artwork.** The
`Components/Brand logo` (and any future country-flag-style primitive)
ships its own `<img>` element because the SVG fills carry intentional
multi-color content the mask pipeline would discard. Such consumers
declare `iconCompositionOptOut: true` in their spec.md frontmatter
and document the rationale in their own `## Composition rules for
consumers` section. The audit reads the flag and skips the unit.

**How sizes flow.** The eleven canonical sizes
(`16 / 20 / 24 / 32 / 40 / 48 / 64 / 72 / 80 / 96 / 144`) come from
this primitive's own `## Variant axes` `size` enum. Consumers pass
one of those values via the partial's `size` argument; the icon's
own root applies `--icon-size` and the wrapper becomes that many
pixels square.

### Deriving `size` from nested Figma instances

When mapping a Figma control / icon slot into `{{> icon size=…}}`,
measure the layer that owns the **paint box**, not the parent
header or slot frame alone.

1. Walk the **nested Icon / Icon-mask / Control INSTANCE** inside
   the consumer's Figma tree (from cached `get_metadata` /
   `get_design_context`). Do **not** treat the outer auto-layout
   control frame's width as `size` by default.
2. `size` on `{{> icon}}` = that nested INSTANCE's width/height,
   snapped to the nearest canonical enum value. **Map by resolved
   pixel value**, never by Figma layer name or "looks like 24".
3. If the parent auto-layout frame has padding **and** a child icon
   INSTANCE, then **`size` ≠ parent frame width**. The outer frame
   is the control box; the INSTANCE is the glyph box.
4. **Double-count trap (control-pad + icon-size):** never apply
   consumer-slot padding in SCSS *and* pass an icon `size` equal to
   the padded outer control width. Choose exactly one model:
   - **Wrapper = control** — slot keeps pad (+ radius); icon
     `size` = inner INSTANCE px; **or**
   - **Icon owns the box** — `size` = outer control px plus optional
     `frame=` for inset; wrapper has **no** padding.
5. Secondary (mask invent): when sizing outside the enum or
   inventing mask boxes, check SVG path coverage vs viewBox; an
   icon's canvas size is not always its visual size. Document any
   coverage delta in the unit changelog.
6. **Past HBS args are not source of truth** on designer-driven /
   Figma-ahead revisits — re-measure the nested INSTANCE before
   trusting a shipped `size=`.
7. **Required inventory row before ship** (also the geometry
   translation manifest consumed by `f2p-build-unit`):

   `slot | outer px | pad | icon INSTANCE px | size= | frame= | wrapper pad?`

**How colors flow.** Colors come from the `color` argument
(`current` / `default` / `brand` / `accent` / `inverse` / `success` /
`critical`). When `color="current"`, the icon inherits
`currentColor` from its parent's text color — useful inside a
button or link whose own state-driven color cascades through.

**Enforcement.** The
[`f2p-audit-icon-composition`](../../../../.cursor/skills/f2p-audit-icon-composition/SKILL.md)
audit runs on every component / layout / page sync (Stage 6 of
[`f2p-sync-figma-code`](../../../../.cursor/skills/f2p-sync-figma-code/SKILL.md))
and is a hard blocker on fail — it scans `.hbs` for forbidden
patterns and `.scss` for forbidden declarations on icon-slot
selectors, and hard-fails nested INSTANCE `size` / pad double-count
mismatches when a geometry manifest or Figma cache is available.
Units that legitimately bypass the wrapper pipeline declare
`iconCompositionOptOut: true` (see carve-out above).

## Tokens consumed

**Structural** — `--icon-size` (component-local, set per `c-icon--size-*`
modifier), `--icon-source` (component-local, set inline from `name`),
`--icon-frame-padding-block` / `--icon-frame-padding-inline`
(component-local, set per `c-icon--frame-*` modifier via
`calc(var(--icon-size) * <ratio>)`; default to `0` so the no-frame case
paints edge-to-edge).

**Per-color color** — `--color-text-primary`, `--color-text-brand`,
`--color-text-accent`, `--color-text-inverse`,
`--color-signal-success`, `--color-signal-critical`.

See this package's Design System token galleries and themes/default/ for resolved values.

## Brand modes

The component reads the brand-themed semantic tokens declared in
`_tokens.scss` (`--color-text-*`, `--color-signal-*`). Switching the
Storybook **Brand** toolbar re-skins every icon in place — semantic
tokens are remapped by the per-brand `[data-brand]` blocks in
`_colors.scss` and `currentColor` follows. The `all`-brands toolbar
option stacks one copy per brand driven by the shared args panel; see
[`storybook-brand-modes.mdc`](../../../../.cursor/rules/storybook-brand-modes.mdc).

## Accessibility

- Decorative icons (`decorative=true`, the default) emit `aria-hidden="true"`
  so screen readers ignore them. Pair with adjacent visible text that
  carries the meaning.
- Meaningful icons (`decorative=false`) emit `role="img"` and require an
  `accessibleLabel`; the label is announced verbatim by screen readers.
  Always provide a label in the user's language; never rely on the icon
  alone to convey meaning.
- Icons inherit color from their parent context unless overridden via
  `c-icon--color-*`. Authors must verify the resulting foreground/background
  pair meets WCAG AA at the rendered size — the component does not enforce
  contrast.
- The mask pipeline preserves SVG aspect ratio via `mask-size: contain`;
  no transform is applied so icons honour `prefers-reduced-motion` by
  doing nothing motion-wise. Consumers that animate the icon must respect
  the user's motion preference themselves.

## Notes & open questions

- The CSS `mask-image` + `currentColor` pipeline is intentional and
  load-bearing — see `## Composition rules for consumers` above for
  the hard rule, the forbidden patterns in `.hbs` / `.scss`, the
  multi-color brand-artwork carve-out, and how sizes / colors flow
  through the partial.
- `simple-*` and `detailed-*` are presentation labels, not separate
  components — the size enum spans both. Authors should pair `simple-*`
  with 16 / 20 / 24 / 32 / 48 and `detailed-*` with 40 / 48 / 64 / 72 /
  80 / 96 / 144 to keep the design intent.
- Frame padding ratios (per side, computed against `--icon-size`) are:
  square → `0.125`, circle → `0.0833`, vertical-rectangle →
  `0.0833` block / `0.1667` inline, horizontal-rectangle → `0.1667`
  block / `0.0833` inline. The same `calc()` works at every size; at
  24 × 24 they resolve to 3 / 2 / 2-and-4 / 4-and-2 px inner padding
  and at 48 × 48 to 6 / 4 / 4-and-8 / 8-and-4 px (mirrors Figma
  `2:1318` Section 2 exactly). Below size 24 the rectangle frames
  produce sub-pixel inset values that browsers round inconsistently —
  authors should avoid `vertical-rectangle` / `horizontal-rectangle`
  at sizes < 24 px.
- The catalog automatically picks up new SVGs as they land at
  `storybook-lifelock/assets/icons/<category>/<simple|detailed>-<name>.svg`.
  No code changes are needed when extraction adds a new category
  folder or an existing folder grows.
- The canonical Color section on `990:1808` only ships five swatches
  (success-ink, default-ink, inverse-on-accent, inverse-on-brand,
  inverse-on-success). The `color` axis on this component exposes the
  full semantic palette (`current` / `default` / `brand` / `accent` /
  `inverse` / `success` / `critical`) for downstream consumers; sizes
  and surfaces beyond the five Figma swatches are valid usages that
  the sticker sheet simply does not picture.
