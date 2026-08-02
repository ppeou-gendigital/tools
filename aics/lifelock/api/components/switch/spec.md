---
type: component
name: switch
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "717:48394"
status: published
behavior: true
composes:
  - icon
tokensConsumed:
  - --color-bg-default
  - --color-border-subtle
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
  - --border-radius-pill
  - --border-width-default
  - --font-family-primary
  - --font-size-body-base
  - --lineheight-body-base
  - --font-weight-regular
---

# Switch

Binary on/off toggle for committing a setting immediately when the
control changes. Mirrors the canonical
[Web-ODS Shared Library → Switch master](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=717-48394&m=dev)
(`717:48394`) and its text-label compositions (`732:49743`,
`732:49642`, `732:49755`, `732:49666`). Every visual binds to
LifeLock `THEME = LifeLock` + `PLATFORM = LifeLock / Desktop|Tablet|Mobile`
Variable resolutions — the multi-brand master is consumed under the
LifeLock mode pick per the contract in
[`storybook-lifelock-figma-modes.mdc`](../../../../.cursor/rules/storybook-lifelock-figma-modes.mdc).

## Summary

The Switch is a stateful checkbox dressed as a 42 × 26 px pill. It
progressively enhances a native `<input type="checkbox">` with
`role="switch"` + `aria-checked` semantics so screen readers
announce on/off state directly. The knob inside the track measures
18 × 18 px with a 4 px inset on every side (slide travel = 42 - 18 -
8 = 16 px). Three persistent tone variants
(`default` / `success` / `critical`) repaint the ON-state track
while leaving the knob white in every variant. Hover / pressed
paint a 32 × 32 px **state circle** behind the knob — Figma source
is the default theme `inverse-secondary` token at 20 % (hover) /
10 % (pressed) opacity; LifeLock has no `inverse-secondary` alias
today, so the implementation reuses the same `--color-text-secondary`
substitution Checkbox / Radio adopt. The halo travels with the knob
under `.is-checked` so it always sits centered behind it. Disabled
and loading are persistent and opt-in via boolean props.
Linked Figma:
[`717:48394`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=717-48394&m=dev).

## Composes

Composes: `icon` — the optional `status/simple-checkmark-small`
glyph that paints inside the knob when
`showIcon=true && checked=true`. The glyph wrapper is **always
rendered** when `showIcon !== false` (and `loading !== true`) and its
visibility is CSS-driven via `opacity` keyed on the `is-checked`
modifier class, so a JS click that flips `is-checked` doesn't have to
insert nodes. The icon element fills the 18 × 18 px knob; the
`-small` SVG's path occupies ~50 % of its 24 px viewBox, so the
visible mark renders at ~9 px — matching the Figma master
`717:48394` knob-icon geometry.

## Variant axes

| Axis | Values |
|---|---|
| `tone` | `default` (track paints `--color-signal-info` on ON) / `success` (track paints `--color-signal-success`) / `critical` (track paints `--color-signal-critical`). Tone only affects the ON paint; the OFF track is the neutral border-subtle fill in every tone. |
| `state` (transient) | `default` / `hover` / `focused` / `pressed`. Pseudo-class driven (`:hover` / `:focus-visible` / `:active` on the native input). The `[data-state]` hook on the root lets the AllStyles gallery freeze each paint for visual regression. |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Tone | Enum (`default` / `success` / `critical`) | `tone` | yes | `"default"` | Drives the ON-state track paint. Mirrors the Figma `Tone` property. |
| 2 | Checked | Boolean | `checked` | no | `false` | Persistent state. Sets the native `<input>` `checked` attribute and `aria-checked="true"` on the input; the knob slides right via the `is-checked` class on the root. |
| 3 | Disabled | Boolean | `disabled` | no | `false` | Persistent state. Paints the `--color-disabled-*` token trio, adds `aria-disabled="true"` on the root, and sets the native `disabled` attribute on the input (removes it from the tab order). |
| 4 | Loading | Boolean | `loading` | no | `false` | Persistent state. Replaces the knob's icon slot with a spinner and locks the input via `aria-busy="true"` on the root. Click commits are ignored while loading. |
| 5 | Show icon | Boolean | `showIcon` | no | `true` | Renders the checkmark glyph inside the knob when checked. When `false`, the knob paints as a solid circle. |
| 6 | Label | Text | `label` | no | `""` | Optional visible label rendered after the track (BEM element `c-switch__label`). When omitted, the switch is icon-only — consumers MUST supply an `aria-label` via the `accessibleLabel` prop. |
| 7 | Accessible label | Text | `accessibleLabel` | when no `label` is set | `""` | Bound to the native input's `aria-label`. Required when no visible label is present so the switch's purpose is announced. |
| 8 | Name | Text | `name` | no | `""` | Bound to the native `<input>` `name` attribute for form submission. |
| 9 | Value | Text | `value` | no | `"on"` | Bound to the native `<input>` `value` attribute (the value posted when checked). |

## Tokens consumed

**Structural** — `--space-1` (2px focus offset), `--space-2` (knob-track gap), `--space-3` (label gap), `--border-radius-pill` (track + knob), `--border-width-default` (focus ring weight).

**Surface** — `--color-bg-default` (knob fill), `--color-border-subtle` (OFF track fill), `--color-signal-info` (ON track, tone `default`), `--color-signal-success` (ON track, tone `success`), `--color-signal-critical` (ON track, tone `critical`).

**State circle** — `--color-text-secondary` mixed at 20 % / 10 % opacity via `color-mix()` for the 32 × 32 px hover / pressed halo painted behind the knob. Substitutes for the default theme `inverse-secondary` source until LifeLock publishes a dedicated state-wash alias (same substitution Checkbox + Radio apply).

**Content** — `--color-text-primary` (visible label), `--color-text-inverse` (knob icon on ON track), `--color-border-focus` (focus ring).

**Disabled** — `--color-disabled-bg` (track), `--color-disabled-border` (track outline), `--color-disabled-text` (knob).

**Typography** — `--font-family-primary`, `--font-size-body-base`, `--lineheight-body-base`, `--font-weight-regular` (label).

See `storybook-lifelock/.storybook/preview.scss` for the surfaced
custom-property values.

## Responsive behaviour

The switch paints at a fixed 42 × 26 px footprint across every
LifeLock breakpoint (SM / MD / LG / XL). The optional label flows
inline after the track and wraps if the container narrows;
`flex-shrink: 0` on the track keeps the pill at its canonical size.
The whole control is RTL-ready — all inline-axis sizing uses
logical properties (`padding-inline`, `inset-inline-start`) so the
knob slides toward the inline-end edge under `dir="rtl"`.

## States

- `default` — OFF: gray track + knob nestled inline-start. ON: tone-coloured track + knob nestled inline-end. Paint via the `is-checked` modifier.
- `hover` — track paint shifts slightly via CSS `:hover` on the native input AND a 32 × 32 px state circle paints behind the knob at 20 % opacity (the default theme `inverse-secondary` source, substituted with `--color-text-secondary` under LifeLock).
- `focused` — `:focus-visible` on the native input draws a 2 px ring on the track using `--color-border-focus` at `--space-1` offset.
- `pressed` — `:active` on the native input lowers the same state-circle halo to 10 % opacity behind the knob (matches the Figma `717:48394` pressed paint). The knob itself does not transform — the halo is the entire press feedback.
- `disabled` — paints the `--color-disabled-*` trio, sets `aria-disabled="true"` on the root, sets `disabled` on the input.
- `loading` — replaces the knob's icon slot with a spinner; the input remains in the tab order but click commits are ignored. Sets `aria-busy="true"` on the root.

The AllStyles gallery's `[data-state]` hook on the root paints
`hover` / `focused` / `pressed` freezes for visual regression
without requiring user input.

## Accessibility

- Uses native `<input type="checkbox">` with `role="switch"` + `aria-checked` for the binary state — screen readers announce "On" / "Off" directly.
- Always carries either a visible `<label>` (text after the track) or an `aria-label` via `accessibleLabel`. The label is wrapped in the root `<label>` element so clicking the text toggles the switch.
- Focus ring uses `:focus-visible` so it only appears on keyboard navigation; pointer focus stays quiet.
- Keyboard: `Space` toggles. `Tab` / `Shift+Tab` move focus.
- WCAG: track surfaces meet AA non-text contrast against `--color-bg-default` in every tone × state combination. Disabled paint meets WCAG 2.2 § 1.4.11 by retaining a visible outline.
- Reduced motion: the knob's slide transition is removed when `prefers-reduced-motion: reduce` is set.

## Design intent

A switch commits a change immediately when toggled — use it for
settings that take effect right away (notifications on/off, sync
toggle). For form inputs that submit later, use a Checkbox
instead.

## JavaScript API

### Init signature

| option | type | default | description |
|---|---|---|---|
| `commitOn` | `"input" \| "change"` | `"change"` | Which native event fires the `lifelock:switch:commit` CustomEvent. |

### Instance shape

```ts
type SwitchInstance = {
  getChecked(): boolean;
  setChecked(next: boolean): void;
  setDisabled(disabled: boolean): void;
  destroy(): void;
};
```

### Events

| name | detail | when fired |
|---|---|---|
| `lifelock:switch:change` | `{ checked: boolean }` | Native `change` on the underlying input. |
| `lifelock:switch:commit` | `{ checked: boolean, source: "pointer" \| "keyboard" \| "api" }` | After commit per the `commitOn` option. |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `data-component` | `"switch"` | Always on the root `<label>`. |
| `data-tone` | `"default" \| "success" \| "critical"` | Always on the root. |
| `data-state` | `"hover" \| "focused" \| "pressed"` | Story-only freeze hook for the AllStyles gallery. |
| `aria-disabled` | `"true"` | On the root when `disabled=true`. |
| `aria-busy` | `"true"` | On the root when `loading=true`. |

### Keyboard

| key | behavior |
|---|---|
| `Space` | Toggle the switch. |
| `Tab` / `Shift+Tab` | Move focus to / from the input. |

### SSR fallback

The native `<input type="checkbox" role="switch">` ships in the
template, so the switch toggles fully without JS — pointer + keyboard
both work. The JS layer's only jobs are to dispatch the namespaced
`lifelock:switch:*` CustomEvents and to enforce the no-op while
`loading=true`.
