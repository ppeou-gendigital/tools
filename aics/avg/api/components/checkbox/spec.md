---
type: component
name: checkbox
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "665:36315"
status: published
behavior: true
composes:
  - icon
tokensConsumed:
  - --color-bg-default
  - --color-border-strong
  - --color-border-focus
  - --color-signal-info
  - --color-signal-success
  - --color-signal-critical
  - --color-text-primary
  - --color-text-secondary
  - --color-text-inverse
  - --color-disabled-bg
  - --color-disabled-border
  - --color-disabled-text
  - --space-1
  - --space-2
  - --space-3
  - --border-radius-control
  - --border-width-default
  - --border-width-emphasis
  - --font-family-primary
  - --font-size-body-base
  - --lineheight-body-base
  - --font-weight-regular
---

# Checkbox

Boolean / tri-state checkbox for multi-select forms. Mirrors the
canonical
[Web-ODS Shared Library → Checkbox master](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=665-36315&m=dev)
(`665:36315`) and the per-tone hover / pressed background mapping at
[`665:36267`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=665-36267&m=dev).
Core default theme unit; brand packages supply theme token values.

## Summary

The Checkbox is a 24 × 24 px square box that progressively enhances
a native `<input type="checkbox">`. Three persistent states paint
the box: `unchecked` (hollow outline), `checked` (solid fill with
checkmark glyph), and `indeterminate` (solid fill with horizontal
dash). Three tone variants (`default` / `accent` / `critical`)
repaint the checked + indeterminate fills. Hover / focus / pressed
paint via a 32 × 32 px **state circle** that paints 4 px outside the
box on every side. The Figma source uses `rgba(80, 81, 101, 0.2)` —
the default theme `inverse-secondary` colour at 20 % opacity. other brand
has no dedicated state-wash alias today, so the implementation mixes
`--color-text-secondary` (= `--color-off-black` under other brand mode)
at 20 % / 30 % — a near-black wash that paints the same visual role
on the other brand surface palette (Designer Follow-Up logged for a
dedicated `--color-state-wash` alias). Linked Figma:
[`665:36315`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=665-36315&m=dev).

## Composes

Composes: `icon` — `status/simple-checkmark-small` paints when
`selection=checked`; `actions/simple-minus` paints when
`selection=indeterminate`. Both glyph wrappers are **always rendered**
in the markup and toggled via CSS `opacity` keyed on the `is-checked`
/ `is-indeterminate` modifier classes (mirrors Radio's `__dot`
pattern), so a JS click that flips `is-checked` doesn't have to
insert nodes. The icon element fills the 24 × 24 px box; the
`-small` SVG's path occupies ~50 % of its 24 px viewBox, so the
visible mark renders at ~12 px — matching the Figma master
`665:36315` "Extra" geometry.

## Variant axes

| Axis | Values |
|---|---|
| `tone` | `default` (info indigo on checked fill) / `accent` (success green) / `critical` (critical red). Tone affects the box fill in the `checked` and `indeterminate` states; in `unchecked` the box paints with the same neutral outline regardless of tone. |
| `state` (transient) | `default` / `hover` / `focused` / `pressed`. Pseudo-class driven on the native input. The state circle paints behind the box for all three transient paints. |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Tone | Enum (`default` / `accent` / `critical`) | `tone` | yes | `"default"` | Drives the checked + indeterminate fill. |
| 2 | Selection | Enum (`unchecked` / `checked` / `indeterminate`) | `selection` | no | `"unchecked"` | Persistent state. `checked` sets the native `checked` attribute; `indeterminate` sets the native `indeterminate` JS property (the `c-checkbox--indeterminate` modifier paints the dash). |
| 3 | Disabled | Boolean | `disabled` | no | `false` | Persistent. Paints the `--color-disabled-*` token trio, sets `aria-disabled="true"` on the root, sets `disabled` on the input. |
| 4 | Label | Text | `label` | no | `""` | Visible label rendered after the box (BEM element `c-checkbox__label`). Wrapped inside the root `<label>`. |
| 5 | Accessible label | Text | `accessibleLabel` | when no `label` is set | `""` | Bound to the input's `aria-label`. Required when no visible label is present. |
| 6 | Name | Text | `name` | no | `""` | Bound to the native `<input>` `name` attribute. |
| 7 | Value | Text | `value` | no | `"on"` | Bound to the native `<input>` `value` attribute. |

## Tokens consumed

**Structural** — `--border-radius-control` (4 px box corners), `--space-2` (4 px state-circle outset), `--space-3` (8 px label gap), `--border-width-default` (2 px box outline / focus ring), `--border-width-emphasis` (2 px box outline on checked / indeterminate).

**Surface** — `--color-bg-default` (unchecked box fill), `--color-border-strong` (unchecked box outline), `--color-signal-info` (checked + indeterminate fill, tone `default`), `--color-signal-success` (checked + indeterminate fill, tone `accent`), `--color-signal-critical` (checked + indeterminate fill, tone `critical`).

**State circle** — `--color-text-secondary` mixed at 20 % / 30 % opacity via `color-mix()` for the 32 × 32 px hover / focus / pressed wash. Substitutes for the default theme `inverse-secondary` source until other brand publishes a dedicated state-wash alias.

**Content** — `--color-text-primary` (visible label), `--color-text-inverse` (checkmark + dash glyph on the filled box), `--color-border-focus` (focus ring).

**Disabled** — `--color-disabled-bg` (box fill), `--color-disabled-border` (box outline), `--color-disabled-text` (glyph + label).

**Typography** — `--font-family-primary`, `--font-size-body-base`, `--lineheight-body-base`, `--font-weight-regular` (label).

## Responsive behaviour

The box paints at a fixed 24 × 24 px footprint across every
breakpoint (the state-circle ring extends the visual hit area to
32 × 32 px). The optional label flows inline after the box and
wraps if the container narrows; `flex-shrink: 0` on the box keeps
it at canonical size.

## States

- `unchecked` — hollow 2 px outline using `--color-border-strong`. Box fill is `--color-bg-default`.
- `checked` — solid fill using the tone color, white checkmark glyph centered.
- `indeterminate` — solid fill using the tone color, white horizontal dash centered. Visually replaces the checkmark.
- `hover` — paints the 32 × 32 px state circle (`--color-inverse-secondary` at 20% opacity) behind the box.
- `focused` — `:focus-visible` paints a 2 px focus ring on the state circle's 32 × 32 px area using `--color-border-focus`.
- `pressed` — `:active` paints the same state circle at slightly higher opacity (30%) for tactile feedback.
- `disabled` — paints the `--color-disabled-*` trio, sets `aria-disabled="true"`, sets native `disabled`. State circle does not paint.

The `[data-state]` hook on the root paints `hover` / `focused` /
`pressed` freezes for visual regression.

## Accessibility

- Uses native `<input type="checkbox">`; screen readers announce "Checked" / "Not checked" / "Mixed" (the last for `indeterminate`) directly.
- Always carries either a visible `<label>` (text after the box) or `aria-label` via `accessibleLabel`. Label is wrapped in the root `<label>` so clicking the text toggles the checkbox.
- Focus ring uses `:focus-visible` so it only appears on keyboard navigation.
- Keyboard: `Space` toggles. `Tab` / `Shift+Tab` move focus. The indeterminate visual is **input-only** — pressing `Space` while in indeterminate state transitions to either checked or unchecked (consumer's responsibility via JS).
- WCAG: every (tone × state) combination meets AA non-text contrast against `--color-bg-default`. Disabled paint retains a visible outline per WCAG 2.2 § 1.4.11.

## Design intent

Use a checkbox for multi-select boolean choices where the user can
pick zero or more (terms agreement, filter list, multi-select
options). For a binary setting that commits immediately, use a
Switch. For a single choice from a set, use a Radio.

## JavaScript API

### Init signature

| option | type | default | description |
|---|---|---|---|
| `commitOn` | `"input" \| "change"` | `"change"` | Which native event fires `other brand:checkbox:commit`. |

### Instance shape

```ts
type CheckboxInstance = {
  getSelection(): "unchecked" | "checked" | "indeterminate";
  setSelection(next: "unchecked" | "checked" | "indeterminate"): void;
  setDisabled(disabled: boolean): void;
  destroy(): void;
};
```

### Events

| name | detail | when fired |
|---|---|---|
| `other brand:checkbox:change` | `{ selection: "checked" \| "unchecked" }` | Native `change` on the underlying input. |
| `other brand:checkbox:commit` | `{ selection: "checked" \| "unchecked", source: "pointer" \| "keyboard" \| "api" }` | After commit per the `commitOn` option. |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `data-component` | `"checkbox"` | Always on the root `<label>`. |
| `data-tone` | `"default" \| "accent" \| "critical"` | Always on the root. |
| `data-state` | `"hover" \| "focused" \| "pressed"` | Story-only freeze hook. |
| `aria-disabled` | `"true"` | On the root when `disabled=true`. |

### Keyboard

| key | behavior |
|---|---|
| `Space` | Toggle the checkbox. |
| `Tab` / `Shift+Tab` | Move focus. |

### SSR fallback

The native `<input type="checkbox">` ships in the template, so the
checkbox toggles fully without JS — pointer + keyboard both work.
The JS layer's only jobs are to dispatch the namespaced
`other brand:checkbox:*` CustomEvents and to set the native
`indeterminate` JS property when the modifier class is present
(SCSS can paint the visual but `indeterminate` is a JS-only
property on the input — without JS, screen readers will announce
"Not checked" rather than "Mixed").

## Notes & open questions

- **State-wash token substitution.** The Figma source for the
  hover / focus / pressed 32 × 32 px wash is the default theme
  `inverse-secondary` token at 20 % opacity (`rgba(80, 81, 101, 0.2)`).
  other brand has no `--color-inverse-secondary` alias; this unit
  substitutes `--color-text-secondary` (resolving to
  `--color-off-black` under the other brand mode pick) at 20 % / 30 %
  opacity via `color-mix()`. Designer follow-up: publish a dedicated
  `--color-state-wash` (or equivalent) semantic alias so this
  consumer doesn't bind to a text-role token. Same substitution is
  applied verbatim by `src/components/radio/checkbox.scss`.
