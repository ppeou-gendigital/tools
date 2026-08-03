---
type: component
name: text-field
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "698:47055"
status: draft
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
  - --color-border-input-error
  - --color-border-input-error-glow
  - --color-border-input-disabled
  - --color-border-input-divider
  - --color-text-placeholder
  - --color-text-default
  - --color-text-disabled
  - --color-text-error
  - --color-text-primary
  - --color-text-secondary
  - --space-1
  - --space-2
  - --space-3
  - --space-5
  - --space-9
  - --space-11
  - --border-radius-card
  - --border-radius-control
  - --border-width-hairline
  - --border-width-default
  - --font-family-primary
  - --font-size-body-base
  - --lineheight-body-base
  - --font-size-label
  - --lineheight-label
  - --font-weight-medium
  - --font-size-body-xs
  - --lineheight-body-xs
---

# Text Field

A labelled text-entry pattern built on native `<input>` and `<select>`
elements. Mirrors the
[Web-ODS Shared Library → Text field](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=698-47055&m=dev)
(`698:47055`) under the LifeLock mode pick. The native HTML
intentionally diverges from the Figma div / instance tree —
visual + token fidelity is the bar, not structural fidelity.

## Summary

The text field stacks three rows: a field title (`<label>`), a control
surface, and an optional helper message wired via `aria-describedby`.
Five `type` structures cover the Figma `Type` axis — `text` and
`password` render a native `<input>`; `select` a native `<select>`;
`combined` a prefix `<select>` and `<input>` inside one bordered
`:focus-within` wrapper; `split` two separate bordered boxes. The Figma
`State` axis (default / hover / filled / focused / error / disabled)
collapses onto native CSS pseudo-classes (`:hover`, `:focus-visible`,
`:disabled`) plus the `is-error` modifier, so a 4 × 8 Figma matrix
becomes a handful of props. Every paint reads from the LifeLock Layer 3c
`--color-*-input-*` tokens. Linked Figma:
[`698:47055`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=698-47055&m=dev).

## Composes

Composes: `icon` — the `generic/simple-visibility-on` and
`generic/simple-visibility-off` glyphs rendered inside the password
reveal button. Both glyphs are always present in the markup; the
`is-revealed` modifier toggles which one shows, so the JS layer never
injects icon nodes. The standalone `select` chevron is the **native UA
arrow** (not the icon partial) so the closed control still works in
Firefox / Safari — see `## Accessibility`.

### Geometry inventory (icon slots)

Figma password reveal Icon mask wrapper is **20×20** (`4084:69`) with
no control pad.

| slot | outer px | pad | icon INSTANCE px | size= | frame= | wrapper pad? |
|---|---|---|---|---|---|---|
| `__reveal` | 20×20 | none | 20×20 | `20` | none | no (`padding: 0`) |

## Variant axes

| Axis | Values |
|---|---|
| `type` | `text` (native `<input type="text">`) / `password` (native `<input type="password">` + reveal button) / `select` (native `<select>`) / `combined` (prefix `<select>` + `<input>` in one bordered wrapper) / `split` (separate prefix box + input box). |
| `state` (transient) | `default` / `hover` / `focused` — pseudo-class driven (`:hover` / `:focus-visible` on the native control). No `[data-state]` freeze hook; the AllStyles gallery shows the prop-driven states instead. |

`error` and `disabled` are persistent boolean props, not part of the
`state` axis. `filled` is just a non-empty `value`.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Type | Enum (`text` / `password` / `select` / `combined` / `split`) | `type` | yes | `"text"` | Drives the control structure. Mirrors the Figma `Type` property (`Default` → `text`, `Dropdown` → `select`, `Combined`, `Splited` → `split`). |
| 2 | Label | Text | `label` | no | `""` | Field title rendered as a `<label for>`. Omit for a label-less field (supply an `aria-label` upstream). |
| 3 | Helper text | Text | `helperText` | no | `""` | Instructional message below the control, wired via `aria-describedby`. Recolours to `--color-text-error` when `error` is set. |
| 4 | Placeholder | Text | `placeholder` | no | `""` | Native placeholder (text / password / combined / split). |
| 5 | Value | Text | `value` | no | `""` | Initial value bound to the native input. |
| 6 | Required | Boolean | `required` | no | `false` | Appends a `*` marker to the field title. |
| 7 | Error | Boolean | `error` | no | `false` | Adds `is-error` + `aria-invalid="true"`, paints the critical border, recolours the helper. |
| 8 | Disabled | Boolean | `disabled` | no | `false` | Sets the native `disabled` attribute and paints the disabled trio. |
| 9 | Select options | Array of `{ value, label, selected }` | `selectOptions` | when `type=select` | `[]` | Native `<option>` rows for the standalone select. |
| 10 | Prefix options | Array of `{ value, label, selected }` | `prefixOptions` | when `type=combined\|split` | `[]` | Native `<option>` rows for the prefix select. |
| 11 | Prefix label | Text | `prefixLabel` | no | `"Prefix"` | `aria-label` for the prefix select in combined / split. |
| 12 | — | Text | `id` | no | `"text-field"` | Code-only. Wires the control `id` + `<label for>` + `aria-describedby`. No Figma component-property counterpart — an accessibility id, not a designer-set value. Pass a unique value per page. |
| 13 | Name | Text | `name` | no | `""` | Bound to the native control `name` (form submission). |
| — | — | Text | `selectOptions[].value` | yes | — | Consumer-set. Bound to the `<option value>`. |
| — | — | Text | `selectOptions[].label` | yes | — | Consumer-set. Visible `<option>` text. |
| — | — | Boolean | `selectOptions[].selected` | no | `false` | Consumer-set. Pre-selects the row (`<option selected>`). |
| — | — | Text | `prefixOptions[].value` | yes | — | Consumer-set. Bound to the prefix `<option value>`. |
| — | — | Text | `prefixOptions[].label` | yes | — | Consumer-set. Visible prefix `<option>` text. |
| — | — | Boolean | `prefixOptions[].selected` | no | `false` | Consumer-set. Pre-selects the prefix row (`<option selected>`). |

## Tokens consumed

**Structural** — `--space-1` (focus glow offset), `--space-2`
(base-select menu padding), `--space-3` (row gap, padding-block),
`--space-5` (padding-inline), `--space-9` (select arrow gutter),
`--space-11` (reveal-button gutter), `--border-radius-card` (control
radius), `--border-radius-control` (reveal-button + option radius),
`--border-width-hairline` (resting border), `--border-width-default`
(reveal focus ring).

**Surface** — `--color-bg-input` (control fill),
`--color-bg-input-disabled` (disabled fill),
`--color-border-input-default` (resting border),
`--color-border-input-hover` (hover border),
`--color-border-input-focus` + `--color-border-input-focus-glow` (focus
ring), `--color-border-input-error` + `--color-border-input-error-glow`
(error ring), `--color-border-input-disabled` (disabled border),
`--color-border-input-divider` (combined seam + option hover wash).

**Content** — `--color-text-default` (input text),
`--color-text-placeholder` (placeholder), `--color-text-primary` (field
title + reveal hover), `--color-text-secondary` (helper),
`--color-text-disabled` (disabled text), `--color-text-error` (error
helper + required marker).

**Typography** — `--font-family-primary`, `--font-size-body-base` /
`--lineheight-body-base` (input text), `--font-size-label` /
`--lineheight-label` + `--font-weight-medium` (field title),
`--font-size-body-xs` / `--lineheight-body-xs` (helper).

See `storybook-lifelock/.storybook/preview.scss` for the surfaced
custom-property values.

## Responsive behaviour

The field fills its container's inline size up to a `22rem` max so it
sits comfortably in a form column at every LifeLock breakpoint
(SM / MD / LG / XL). The control's block size is a fixed `40px` minimum.
Combined / split lay their prefix and input out with `flex` — the prefix
hugs its content (`flex: 0 0 auto`) and the input grows
(`flex: 1 1 auto`). All inline-axis sizing uses logical properties
(`padding-inline`, `inset-inline-end`, `text-align: start`) so the field,
the reveal button, and the select arrow gutter all flip under
`dir="rtl"`.

## States

- `default` — resting `--color-border-input-default` hairline border on `--color-bg-input`.
- `hover` — `:hover` shifts the border to `--color-border-input-hover`.
- `focused` — `:focus-visible` paints `--color-border-input-focus` plus a `--space-1` `--color-border-input-focus-glow` box-shadow ring. Combined / split move the ring to the wrapper via `:focus-within`.
- `filled` — purely a non-empty `value`; no distinct paint.
- `error` — `is-error` + `aria-invalid="true"`; border becomes `--color-border-input-error`, focus glow becomes `--color-border-input-error-glow`, helper recolours to `--color-text-error`.
- `disabled` — native `disabled`; paints `--color-bg-input-disabled` + `--color-border-input-disabled` + `--color-text-disabled` and sets `cursor: not-allowed`.
- `revealed` (password only) — `is-revealed` flips the input `type` to `text` and swaps the eye glyph for eye-off.

## Accessibility

- The field title is a real `<label for>` bound to the control `id`; the helper is referenced from the control via `aria-describedby`.
- `error` sets `aria-invalid="true"` so assistive tech announces the invalid state; the helper carries the human-readable reason.
- Focus ring uses `:focus-visible` so it only paints on keyboard navigation; pointer focus stays quiet.
- The password reveal is a real `<button type="button">` with `aria-pressed` and a state-accurate `aria-label` ("Show password" / "Hide password").
- The standalone `select` uses the **native UA arrow** in Firefox / Safari (no icon-partial child, which would require the experimental `<button>`-in-`<select>` markup that breaks the native control). Chromium 135+ styles the `::picker(select)` menu via `appearance: base-select`; every other browser keeps the fully-functional native popup.
- WCAG: resting + focus borders meet AA non-text contrast against `--color-bg-input`; disabled paint retains a visible outline per WCAG 2.2 § 1.4.11. Per the Figma guidance frame (`984:2201`), inputs should sit on the primary background — avoid placing them on accent / status surfaces where the border contrast is not guaranteed.

## Design intent

The text field is the workhorse form control: one labelled,
helper-annotated entry surface with a small set of structural variants
for the common "value plus prefix" cases (scheme + host, country code +
number). It deliberately leans on native elements so keyboard, IME,
autofill, and form submission all work without JavaScript — the only
scripted affordance is the password reveal.

## JavaScript API

### Init signature

| option | type | default | description |
|---|---|---|---|
| `revealed` | `boolean` | `false` | Start a password field revealed (input `type=text`). |

### Instance shape

```ts
type TextFieldInstance = {
  getRevealed(): boolean;
  setRevealed(next: boolean): void;
  setDisabled(disabled: boolean): void;
  destroy(): void;
};
```

### Events

| name | detail | when fired |
|---|---|---|
| `lifelock:text-field:reveal` | `{ revealed: boolean, source: "pointer" \| "api" }` | The reveal button toggles, or `setRevealed()` is called. |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `data-component` | `"text-field"` | Always on the root. |
| `data-type` | `"text" \| "password" \| "select" \| "combined" \| "split"` | Always on the root. |
| `aria-invalid` | `"true"` | On the control when `error=true`. |
| `aria-pressed` | `"true" \| "false"` | On the reveal button (password only). |

### Keyboard

| key | behavior |
|---|---|
| `Tab` / `Shift+Tab` | Move focus across the control (and the reveal button). |
| `Space` / `Enter` | Activate the focused reveal button. |

### SSR fallback

Every control is a native element that ships in the template, so text
entry, selection, autofill, and form submission all work without JS. The
JS layer's only job is the password reveal toggle; without it the field
stays a standard password input.
