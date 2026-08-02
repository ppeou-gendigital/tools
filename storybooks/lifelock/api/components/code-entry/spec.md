---
type: component
name: code-entry
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "698:47604"
status: draft
behavior: true
composes: []
tokensConsumed:
  - --color-bg-default
  - --color-bg-subtle
  - --color-bg-muted
  - --color-border-subtle
  - --color-signal-info
  - --color-signal-critical
  - --color-text-primary
  - --color-text-secondary
  - --color-text-disabled
  - --color-text-error
  - --space-2
  - --space-3
  - --space-5
  - --border-radius-card
  - --border-width-hairline
  - --font-family-primary
  - --font-size-h4
  - --lineheight-h4
  - --letterspacing-h4
  - --font-weight-semibold
  - --font-size-label
  - --lineheight-label
  - --letterspacing-label
  - --font-weight-regular
---

# Code Entry

A segmented one-time-code (OTP) pattern built from a row of native
single-character `<input>` boxes. Mirrors the
[Web-ODS Shared Library → Code entry](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=698-47604&m=dev)
(`698:47604`) under the LifeLock mode pick. The native HTML
intentionally diverges from the Figma div tree — visual + token fidelity
is the bar.

## Summary

The code entry stacks a label, a row of `length` single-character boxes
(default 6), and an optional helper message, wrapped in a
`role="group"`. Each box is a native `<input>` with `maxlength="1"`,
`inputmode="numeric"`, and `autocomplete="one-time-code"` (on the first
box) so mobile keyboards show a numeric pad and SMS-delivered codes
autofill. Each box is a fixed 40×56 tile with an 8px radius; the digit
is the `PRIMARY/H4/SemiBold` heading style (Inter Tight 36/44, weight
600) in `--color-text-primary`. The active box takes a subtle grey fill
(`--color-bg-subtle`) + an info-blue border and caret
(`--color-signal-info`); resting, filled, error, and disabled paints
follow the matching Figma state. The JS layer adds the OTP
interaction model — auto-advance, backspace-to-previous, arrow
navigation, and paste-spread. Linked Figma:
[`698:47604`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=698-47604&m=dev).

## Composes

Composes: none. The boxes are bare native `<input>` elements with no
nested units.

## Variant axes

| Axis | Values |
|---|---|
| `length` | Integer count of boxes (default `6`; e.g. `4` for a PIN). |
| `state` (transient + persistent) | per-box `default` / `hover` / `focused` / `filled`; group-level `error` and `disabled`. Per-box transient states are pseudo-class driven (`:hover` / `:focus-visible`); `filled` is the `is-filled` modifier; `error` / `disabled` are persistent props. |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Length | Number | `length` | no | `6` | Number of single-character boxes. Expanded by the `codeBoxes` helper. |
| 2 | Label | Text | `label` | no | `"Verification code"` | Group label rendered above the boxes; also the group `aria-label`. |
| 3 | Helper text | Text | `helperText` | no | `""` | Instructional message below the boxes, wired via `aria-describedby`. Recolours to `--color-text-error` when `error` is set. |
| 4 | Value | Text | `value` | no | `""` | Initial code; distributed one character per box (left to right). |
| 5 | Error | Boolean | `error` | no | `false` | Adds `is-error` + per-box `aria-invalid="true"`, paints every box with the critical border. |
| 6 | Disabled | Boolean | `disabled` | no | `false` | Disables every box and paints the disabled surface. |
| 7 | — | Text | `groupId` | no | `"code-entry"` | Code-only. Wires the `role="group"` wrapper `id` + the helper `aria-describedby` (`{groupId}-helper`). No Figma component-property counterpart — an accessibility id, not a designer-set value. Pass a unique value per page when multiple code-entry groups share a document. |

## Tokens consumed

**Structural** — `--space-2` (label / boxes / helper column gap),
`--space-5` (inter-box gap; `--space-3` on small devices),
`--border-radius-card` (8px box radius), `--border-width-hairline`
(1px box border).

**Surface** — `--color-bg-default` (resting box fill),
`--color-bg-subtle` (active box fill), `--color-bg-muted` (disabled box
fill + border), `--color-border-subtle` (resting + filled border),
`--color-signal-info` (active border + caret + active label),
`--color-signal-critical` (error border).

**Content** — `--color-text-primary` (digit), `--color-text-secondary`
(label + helper), `--color-text-disabled` (disabled digit + label),
`--color-text-error` (error helper).

**Typography** — `--font-family-primary`; digit is the H4/SemiBold
heading style (`--font-size-h4` / `--lineheight-h4` /
`--letterspacing-h4` + `--font-weight-semibold`); label + helper are the
label style (`--font-size-label` / `--lineheight-label` /
`--letterspacing-label` + `--font-weight-regular`).

These map 1:1 onto the Figma node's bound Variables — `Color/Content/primary`,
`Color/Background/primary` + `secondary`, `Color/Border/tertiary`,
`Color/Signal/info`, `Color/Signal/critical`, `PRIMARY/H4/SemiBold`,
`PRIMARY/Label/Regular`, `border-radius-l`, `border-width-xs`,
`space/space-5`. See
`storybook-lifelock/.storybook/preview.scss` for the surfaced
custom-property values.

## Responsive behaviour

The boxes lay out in a flex row with `flex-wrap: wrap` so a long code
(e.g. 8+ boxes) wraps to a second line on narrow viewports rather than
overflowing. Each box is a fixed `2.5rem` × `3.5rem` (40×56) tile at
every LifeLock breakpoint. The inter-box gap is `--space-5` (16px),
tightening to `--space-3` (8px) in the `sm` band (≤ 767px) per the Figma
guidance. The digit uses the responsive `--font-size-h4` (36px in the
`lg`/`xl` bands, 28px below 1024px). The label and helper stack above /
below at full width with a `--space-2` (4px) gap.

## States

- `default` — resting `--color-border-subtle` border on `--color-bg-default` (white).
- `focused` (active box) — `:focus` paints a `--color-signal-info` border + `--color-bg-subtle` fill, with a `--color-signal-info` caret. No glow ring (Figma uses the fill + border as the focus affordance). The group label also recolours to `--color-signal-info` via `:focus-within`.
- `filled` — the `is-filled` modifier (set in the template for SSR and kept in sync by JS) marks a box holding a digit. Filled boxes keep the resting `--color-border-subtle` border per Figma — the centred digit is the only distinction.
- `error` — `is-error` + per-box `aria-invalid="true"`; every box border becomes `--color-signal-critical`, helper recolours.
- `disabled` — native `disabled` on every box; paints `--color-bg-muted` fill + same-colour border + `--color-text-disabled` digit and label.

## Accessibility

- The boxes are wrapped in a `role="group"` with an `aria-label` (the label) so assistive tech announces the field as one unit; the helper is referenced via `aria-describedby`.
- Each box carries a positional `aria-label` ("Digit 1 of 6", …) so a screen-reader user always knows which position has focus.
- `error` sets `aria-invalid="true"` on every box; the helper carries the human-readable reason.
- The active box uses `:focus` (not `:focus-visible`) so the box you are on is always visibly highlighted — by keyboard, click, or the JS auto-advance focus move — which is the expected affordance for a segmented OTP field.
- Keyboard model: typing a digit auto-advances; Backspace on an empty box steps back and clears the previous; ArrowLeft / ArrowRight move focus.
- `autocomplete="one-time-code"` on the first box lets the platform offer an SMS code for one-tap fill. WCAG: the active box pairs an info-blue border with a grey fill for a clearly visible focus state; resting box borders meet AA non-text contrast against `--color-bg-default`. Per the Figma guidance frame (`984:2201`), keep the field on the primary background where border contrast is guaranteed.

## Design intent

Code entry is the dedicated control for short, fixed-length numeric
codes (verification codes, PINs). Splitting the value into discrete
boxes communicates the expected length at a glance and makes per-digit
correction easy. It leans on native inputs so numeric keyboards, SMS
autofill, and paste all work; the JS layer only adds the
box-to-box choreography users expect from an OTP field.

## JavaScript API

### Init signature

_No init options._

### Instance shape

```ts
type CodeEntryInstance = {
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
| `lifelock:code-entry:input` | `{ value: string }` | Any box changes (type / backspace / paste / `setValue` / `clear`). |
| `lifelock:code-entry:complete` | `{ value: string }` | Every box is filled (the code reaches full `length`). |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `data-component` | `"code-entry"` | Always on the root. |
| `data-length` | integer string | Always on the root. |
| `data-index` | `"0"` … `"n-1"` | On each box, identifying its position. |
| `is-filled` | (class) | On each box that holds a digit. |
| `aria-invalid` | `"true"` | On each box when `error=true`. |

### Keyboard

| key | behavior |
|---|---|
| digit | Fills the box and advances focus to the next box. |
| `Backspace` | Clears the box; if already empty, clears + focuses the previous box. |
| `ArrowLeft` / `ArrowRight` | Move focus to the previous / next box. |
| paste | Spreads the pasted digits across boxes from the focused position. |

### SSR fallback

Every box is a native `<input>` that ships in the template, so digits
can be entered, pasted, and submitted without JS. Without the JS layer,
auto-advance, backspace-to-previous, and paste-spread are inert — each
box behaves as an independent single-character input — but the field
still works.
