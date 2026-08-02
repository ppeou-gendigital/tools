---
type: component
name: radio
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "666:36462"
status: published
behavior: true
composes: []
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
  - --border-radius-pill
  - --border-width-default
  - --border-width-emphasis
  - --font-family-primary
  - --font-size-body-base
  - --lineheight-body-base
  - --font-weight-regular
---

# Radio

Single-select choice from a group of mutually-exclusive options.
Mirrors the canonical
[Web-ODS Shared Library → Radio master](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=666-36462&m=dev)
(`666:36462`). Visual architecture and state-circle mechanics mirror
the sibling Checkbox component; the only differences are the circular
geometry (no corners) and the centred dot glyph in the checked state.
Core default theme unit; brand packages supply theme token values.

## Summary

A radio is a 24 × 24 px circle that progressively enhances a native
`<input type="radio">`. Two persistent states paint the circle:
`unchecked` (hollow outline) and `checked` (solid fill with a centred
white dot). Three tone variants (`default` / `accent` / `critical`)
repaint the checked fill. The 32 × 32 px state-circle wash on hover /
focus / pressed mirrors the Checkbox's state mechanics verbatim — see
`src/components/checkbox/spec.md` § "Summary" for the token
substitution rationale. Linked Figma:
[`666:36462`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=666-36462&m=dev).

## Composes

Composes: none. The centred dot glyph is rendered as a CSS pseudo-element
on the box, not as a composed icon partial.

## Variant axes

| Axis | Values |
|---|---|
| `tone` | `default` / `accent` / `critical`. Affects the checked-state fill paint. Unchecked stays neutral in every tone. |
| `state` (transient) | `default` / `hover` / `focused` / `pressed`. Pseudo-class driven on the native input. State-circle wash paints behind the box for all three transient paints. |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Tone | Enum (`default` / `accent` / `critical`) | `tone` | yes | `"default"` | Drives the checked fill. |
| 2 | Checked | Boolean | `checked` | no | `false` | Persistent. Sets native `checked` + `aria-checked="true"`. |
| 3 | Disabled | Boolean | `disabled` | no | `false` | Persistent. Paints the `--color-disabled-*` trio, sets `aria-disabled="true"`, sets native `disabled`. |
| 4 | Name | Text | `name` | yes | `""` | Required for grouping — all radios with the same `name` participate in the same mutually-exclusive set. |
| 5 | Value | Text | `value` | yes | `""` | The value posted when this radio is selected within its `name` group. |
| 6 | Label | Text | `label` | no | `""` | Visible label rendered after the box. Wrapped inside the root `<label>`. |
| 7 | Accessible label | Text | `accessibleLabel` | when no `label` is set | `""` | Bound to the native input's `aria-label`. Required when no visible label is present. |

## Tokens consumed

**Structural** — `--border-radius-pill` (circular box + state-circle corners), `--space-1` (focus offset), `--space-3` (label gap), `--border-width-default` (focus ring weight), `--border-width-emphasis` (box outline weight).

**Surface** — `--color-bg-default` (unchecked box fill), `--color-border-strong` (unchecked outline), `--color-signal-info` (checked fill, tone `default`), `--color-signal-success` (checked fill, tone `accent`), `--color-signal-critical` (checked fill, tone `critical`).

**State circle** — `--color-text-secondary` mixed at 20 % / 30 % opacity via `color-mix()`, same as the Checkbox state-wash substitution.

**Content** — `--color-text-primary` (visible label), `--color-text-inverse` (centred dot), `--color-border-focus` (focus ring).

**Disabled** — `--color-disabled-bg` (box fill), `--color-disabled-border` (box outline), `--color-disabled-text` (dot + label).

**Typography** — `--font-family-primary`, `--font-size-body-base`, `--lineheight-body-base`, `--font-weight-regular` (label).

## Responsive behaviour

24 × 24 px footprint across every breakpoint (32 × 32 px state-circle
hit area). The optional label flows inline after the box and wraps if
the container narrows; `flex-shrink: 0` on the box keeps it at canonical
size.

## States

- `unchecked` — hollow 2 px outline using `--color-border-strong`. Box fill is `--color-bg-default`. No dot.
- `checked` — solid fill using the tone color, white 8 × 8 px dot centred.
- `hover` / `focused` / `pressed` — paint the 32 × 32 px state-circle wash behind the box (same mechanics as Checkbox).
- `disabled` — paints the `--color-disabled-*` trio.

The `[data-state]` hook on the root paints `hover` / `focused` /
`pressed` freezes for visual regression.

## Accessibility

- Uses native `<input type="radio">`; screen readers announce "Radio button, checked" / "Radio button, not checked" directly.
- `name` is required so the browser enforces single-selection across the group automatically.
- Keyboard: `Arrow` keys move selection within the group; `Tab` / `Shift+Tab` jump in/out of the group.
- Focus ring via `:focus-visible` only on keyboard navigation.
- WCAG: every (tone × state) combination meets AA non-text contrast.

## Design intent

Use a radio when the user must pick exactly one from a set of 2-7
mutually-exclusive options. For 8+ options, switch to a Select. For
multi-select, use a Checkbox.

## JavaScript API

### Init signature

| option | type | default | description |
|---|---|---|---|
| `commitOn` | `"input" \| "change"` | `"change"` | Which native event fires `other brand:radio:commit`. |

### Instance shape

```ts
type RadioInstance = {
  getChecked(): boolean;
  setChecked(next: boolean): void;
  setDisabled(disabled: boolean): void;
  destroy(): void;
};
```

### Events

| name | detail | when fired |
|---|---|---|
| `other brand:radio:change` | `{ checked: boolean, name: string, value: string }` | Native `change` on the input. |
| `other brand:radio:commit` | `{ checked: boolean, name: string, value: string, source: "pointer" \| "keyboard" \| "api" }` | After commit per the `commitOn` option. |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `data-component` | `"radio"` | Always on the root `<label>`. |
| `data-tone` | `"default" \| "accent" \| "critical"` | Always on the root. |
| `data-state` | `"hover" \| "focused" \| "pressed"` | Story-only freeze hook. |
| `aria-disabled` | `"true"` | On the root when `disabled=true`. |

### Keyboard

| key | behavior |
|---|---|
| `Arrow Up` / `Arrow Down` / `Arrow Left` / `Arrow Right` | Move selection within the radio group. |
| `Tab` / `Shift+Tab` | Move focus in / out of the group. |

### SSR fallback

Native `<input type="radio">` ships in the template, so single-select
group enforcement, keyboard navigation, and screen-reader semantics
all work without JS. The JS layer's only jobs are mirroring the
input's `checked` state to the root's `is-checked` modifier and
dispatching the namespaced `other brand:radio:*` CustomEvents.
