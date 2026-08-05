---
type: component
name: search-box
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "698:47669"
status: published
behavior: true
composes:
  - icon
tokensConsumed:
  - --color-bg-input
  - --color-bg-input-disabled
  - --color-border-input-default
  - --color-border-input-hover
  - --color-border-input-focus
  - --color-border-input-focus-glow
  - --color-border-input-disabled
  - --color-border-input-divider
  - --color-text-placeholder
  - --color-text-default
  - --color-text-disabled
  - --color-text-primary
  - --space-1
  - --space-2
  - --space-3
  - --border-radius-card
  - --border-radius-control
  - --border-width-hairline
  - --border-width-default
  - --font-family-primary
  - --font-size-body-sm
  - --lineheight-body-sm
  - --font-size-body-base
  - --lineheight-body-base
---

# Search Box

A compact search-entry pattern built on a native `<input type="search">`.
Mirrors the
[Web-ODS Shared Library → Search box](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=698-47669&m=dev)
(`698:47669`) under the LifeLock mode pick. The native HTML
intentionally diverges from the Figma div tree — visual + token fidelity
is the bar.

## Summary

The search box is a single bordered `:focus-within` control wrapping a
native `<input type="search">`. A search glyph and a vertical separator
lead the input (or trail it when `iconFirst=false`), and a clear (×)
button appears at the inline-end once the field is filled. Two sizes
cover the Figma `Size` axis — `m` (32px) and `l` (40px). The Figma
`State` axis (empty / hover / focused / typing) collapses onto native
CSS pseudo-classes plus the `is-filled` modifier the JS layer keeps in
sync. The native UA search-cancel button is suppressed so the clear
affordance is consistent across Chrome / Firefox / Safari. Linked Figma:
[`698:47669`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=698-47669&m=dev).

## Composes

Composes: `icon` — `actions/simple-search` (the leading / trailing
search glyph) and `actions/simple-close` (the clear button). Both are
rendered in the template; the clear glyph's wrapper button shows / hides
via the `is-filled` modifier, so the JS layer never injects icon nodes.

### Geometry inventory (icon slots)

Figma Active `698:47768` — Icon mask wrappers are **24×24** with no
control pad (search `1258:1327`, clear `1258:1389`).

| slot | outer px | pad | icon INSTANCE px | size= | frame= | wrapper pad? |
|---|---|---|---|---|---|---|
| `__icon` (search) | 24×24 | none | 24×24 | `24` | none | no |
| `__clear` | 24×24 | none | 24×24 | `24` | none | no (`padding: 0`) |

## Variant axes

| Axis | Values |
|---|---|
| `size` | `m` (32px control, `body-sm` input text) / `l` (40px control, `body-base` input text). |
| `iconFirst` | `true` (search glyph + separator lead the input) / `false` (they trail it, via the `--icon-last` modifier). |
| `state` (transient) | `empty` / `hover` / `focused` / `typing` — pseudo-class driven (`:hover` / `:focus-within`) plus the `is-filled` modifier that reveals the clear button. |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Size | Enum (`m` / `l`) | `size` | yes | `"m"` | Drives the control min-block size + input text size. Mirrors the Figma `Size` property (M = 32, L = 40). |
| 2 | Icon first | Boolean | `iconFirst` | no | `true` | Lead with the search glyph + separator, or trail them after the input. Mirrors the Figma `Icon first` property. |
| 3 | Placeholder | Text | `placeholder` | no | `"Search"` | Native placeholder. |
| 4 | Value | Text | `value` | no | `""` | Initial value; a non-empty value reveals the clear button. |
| 5 | Accessible label | Text | `accessibleLabel` | no | `"Search"` | Bound to the input `aria-label` (the search box has no visible `<label>`). |
| 6 | Clear label | Text | `clearLabel` | no | `"Clear search"` | `aria-label` for the clear button. |
| 7 | Disabled | Boolean | `disabled` | no | `false` | Disables the input + clear button and paints the disabled surface. |
| 8 | Name | Text | `name` | no | `""` | Bound to the input `name` (form submission). |

## Tokens consumed

**Structural** — `--space-1` (focus glow / outline offset; not clear-button pad),
`--space-2` (separator inset, input padding-block), `--space-3` (control
gap + padding-inline), `--border-radius-card` (control radius),
`--border-radius-control` (clear-button radius),
`--border-width-hairline` (resting border + separator),
`--border-width-default` (clear focus ring).

**Surface** — `--color-bg-input` (control fill),
`--color-bg-input-disabled` (disabled fill),
`--color-border-input-default` (resting border),
`--color-border-input-hover` (hover border),
`--color-border-input-focus` + `--color-border-input-focus-glow` (focus
ring), `--color-border-input-disabled` (disabled border),
`--color-border-input-divider` (separator).

**Content** — `--color-text-default` (input text + glyphs),
`--color-text-placeholder` (placeholder), `--color-text-primary` (icon /
clear hover), `--color-text-disabled` (disabled text).

**Typography** — `--font-family-primary`, `--font-size-body-sm` /
`--lineheight-body-sm` (M input text), `--font-size-body-base` /
`--lineheight-body-base` (L input text).

See `storybook-lifelock/.storybook/preview.scss` for the surfaced
custom-property values.

## Responsive behaviour

The control fills its container's inline size up to a `22rem` max and
keeps a fixed block size per size variant. The input grows
(`flex: 1 1 auto`, `min-inline-size: 0`) while the glyph, separator, and
clear button hug their content. All inline-axis sizing uses logical
properties so the glyph / separator / clear order flips under
`dir="rtl"`.

## States

- `empty` — resting `--color-border-input-default` border; clear button hidden.
- `hover` — `:hover` shifts the border to `--color-border-input-hover`.
- `focused` — `:focus-within` paints `--color-border-input-focus` + a `--space-1` `--color-border-input-focus-glow` ring on the wrapper.
- `typing` / `filled` — the `is-filled` modifier reveals the clear button at the inline-end.
- `disabled` — native `disabled`; paints `--color-bg-input-disabled` + `--color-border-input-disabled` + `--color-text-disabled`.

## Accessibility

- The input carries an `aria-label` (default "Search") since the search box ships no visible `<label>`.
- The clear button is a real `<button type="button">` with an `aria-label` ("Clear search"); pressing it empties the field and returns focus to the input.
- The native UA search-cancel button (`::-webkit-search-cancel-button`) is suppressed; the styled clear button replaces it so the affordance exists and is reachable in Firefox too.
- Focus ring uses `:focus-within` on the wrapper so the whole control reads as one focus target; `:focus-visible` keeps the clear-button ring keyboard-only.
- WCAG: resting + focus borders meet AA non-text contrast against `--color-bg-input`; the glyph + separator are `aria-hidden`. Per the Figma guidance frame (`984:2201`), keep search boxes on the primary background where border contrast is guaranteed.

## Design intent

The search box is a focused, single-purpose entry control for filtering
or querying. It deliberately uses `type="search"` so the platform
contributes its semantics (history, IME, the Enter-to-search behaviour)
while the only scripted affordance is the clear button — which native
search inputs expose inconsistently across browsers.

## JavaScript API

### Init signature

_No init options._

### Instance shape

```ts
type SearchBoxInstance = {
  getValue(): string;
  setValue(next: string): void;
  clear(): void;
  setDisabled(disabled: boolean): void;
  destroy(): void;
};
```

### Events

| name | detail | when fired |
|---|---|---|
| `lifelock:search-box:input` | `{ value: string }` | Native `input` on the field, or `setValue()` / `clear()`. |
| `lifelock:search-box:clear` | `{}` | The clear button is pressed, or `clear()` is called. |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `data-component` | `"search-box"` | Always on the root. |
| `data-size` | `"m" \| "l"` | Always on the root. |
| `is-filled` | (class) | On the root while the input has a value (reveals the clear button). |
| `is-disabled` | (class) | On the root while disabled. |

### Keyboard

| key | behavior |
|---|---|
| `Tab` / `Shift+Tab` | Move focus across the input and the clear button. |
| `Space` / `Enter` | Activate the focused clear button. |
| `Esc` | Browser-native clear on `type=search` (where supported). |

### SSR fallback

The native `<input type="search">` ships in the template, so search
entry + submission work without JS. The clear button is present but
hidden until the JS layer adds `is-filled`; without JS, users clear via
the platform-native control. The JS layer adds the consistent clear
affordance and the namespaced events.
