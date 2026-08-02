---
type: component
name: slider
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "539:28421"
status: published
behavior: true
composes: []
tokensConsumed:
  - --color-background-primary
  - --color-border-tertiary
  - --color-border-focus
  - --color-signal-info
  - --button-primary-bg-default
  - --button-primary-bg-hover
  - --button-primary-bg-pressed
  - --button-disabled-border
  - --button-disabled-content
  - --space-2
  - --space-3
  - --space-6
  - --border-radius-pill
  - --border-width-default
  - --font-family-primary
  - --font-size-body-sm
  - --font-size-body-base
  - --lineheight-body-sm
  - --lineheight-body-base
  - --font-weight-regular
  - --font-weight-semibold
---

# Slider

Continuous and discrete sliders for single-value and range selection.
Mirrors the canonical
[Web-ODS Shared Library → Sliders 🟢](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28421&m=dev)
canvas and its master component `DS · Slider`
([`1336:2939`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1336-2939&m=dev)).
Twenty Figma variants distribute across four `Variant × Selection`
combinations and five interaction states — every visual binds to
LifeLock `THEME = LifeLock` + `PLATFORM = LifeLock / Desktop|Tablet|Mobile`
Variable resolutions.

## Summary

The Slider is a horizontal scrubber for picking a value (or a range)
inside a numeric domain. Two persistent variant axes describe the
shape — `variant` selects whether the track is a continuous gradient
(`continuous`) or a discrete ladder of authored stops (`discrete`),
and `selection` selects whether the user picks one value
(`single-value`) or both ends of an interval (`range`). Five
interaction states (`default` / `hover` / `focused` / `active` /
`disabled`) paint through CSS pseudo-classes on the thumb element
plus an `aria-disabled="true"` short-circuit, mirroring the
five-dimension state taxonomy in
[`component-anatomy.mdc`](../../../../.cursor/rules/component-anatomy.mdc).
Linked Figma node:
[`539:28421`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28421&m=dev).

## Composes

Composes: none. The slider is a self-contained molecule — no nested
component partials are required to render any variant.

## Variant axes

| Axis | Values |
|---|---|
| `variant` | `continuous` (default — single gradient track with the thumb sliding freely) / `discrete` (track ships eleven evenly-spaced visible tick marks; the JS layer snaps the thumb to the nearest tick on commit). |
| `selection` | `single-value` (default — one thumb) / `range` (two thumbs and the active-fill paints only between them). |
| `state` | `default` / `hover` / `focused` / `active` / `disabled`. `default` / `hover` / `focused` / `active` paint via CSS pseudo-classes on the thumb (`:hover` / `:focus-visible` on the parent thumb container / `:active`); a `[data-state]` hook on the root lets the AllStyles gallery freeze each transient state for visual regression. `disabled` is the only persistent state — opt-in via the `disabled` prop, which sets `aria-disabled="true"` on the root and `disabled` on each underlying `<input type="range">`. |

The `discrete` variant always carries exactly **11 ticks** (the
domain split into 10 equal segments). Authors choosing a different
tick count must request a Figma update first — eleven is fixed in
the design source.

The `range` variant places the lower thumb at the value floor and
the upper thumb at the value ceiling. The active-fill paints only
the segment between the two thumbs. Range sliders accept overlap —
the consumer is responsible for enforcing `valueMin ≤ valueMax`.

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Variant | Enum (`continuous` / `discrete`) | `variant` | yes | `"continuous"` | Mirrors the Figma `Variant` property. `discrete` adds the tick layer + JS snap behaviour; `continuous` is a free-glide track. |
| 2 | Selection | Enum (`single-value` / `range`) | `selection` | yes | `"single-value"` | Mirrors the Figma `Selection` property. `range` doubles the input + thumb pair and constrains the active-fill to the interval. |
| 3 | Disabled | Boolean | `disabled` | no | `false` | Persistent state — paints the `--button-disabled-*` token trio, sets `aria-disabled="true"` on the root, and adds `disabled` on each underlying `<input type="range">` (removes the input from the tab order). |
| 4 | Min | Number | `min` | no | `0` | Lower bound of the value domain. Bound to the native `<input type="range">` `min` attribute. |
| 5 | Max | Number | `max` | no | `100` | Upper bound of the value domain. Bound to the native `<input type="range">` `max` attribute. |
| 6 | Step | Number | `step` | no | `1` on `continuous`, derived from `(max-min)/10` on `discrete` | Resolution of the slider. Bound to the native `<input type="range">` `step` attribute. On `discrete`, the JS layer additionally snaps to the nearest tick after pointer release. |
| 7 | Value | Number | `value` | yes when `selection="single-value"` | `min` | Current value. Bound to the native `<input type="range">` `value`. The visual thumb position is computed from `(value − min) / (max − min)` and surfaced as `--slider-thumb-offset` on the thumb. |
| 8 | Value min | Number | `valueMin` | yes when `selection="range"` | `min` | Lower bound of the selected range. Drives the start thumb's `--slider-thumb-offset` and the active-fill's `--slider-fill-start`. |
| 9 | Value max | Number | `valueMax` | yes when `selection="range"` | `max` | Upper bound of the selected range. Drives the end thumb's `--slider-thumb-offset` and the active-fill's `--slider-fill-end`. |
| 10 | Show value label | Boolean | `showValueLabel` | no | `true` | Renders the value readout area above the track. When `false`, the value-label area collapses and the track sits flush to the container top. The value text uses `--font-family-primary` + `--font-weight-semibold` at `--font-size-body-base` / `--lineheight-body-base`. |
| 11 | Label | String | `label` | no | `""` | Optional `aria-label` applied to the root `role="group"` element so screen readers announce the slider's semantic purpose ("Volume", "Price range", …). When omitted, the root carries no `aria-label` — the consumer is responsible for labelling externally via `aria-labelledby`. |
| 12 | Name | String | `name` | no | `null` | Optional `name=` attribute applied to each underlying `<input type="range">` so the slider participates in standard HTML form submission. On `range`, the JS layer suffixes `-min` and `-max` to the two inputs. |
| 13 | Presentational state | Enum | `state` | no | `"default"` | Story-only — paints `hover` / `focused` / `active` freezes via `[data-state]` on the root. Not consumed by JS; runtime state is observable via the standard CSS pseudo-classes. |

## Composition rules for consumers

The slider does not compose any sub-components — `composes: []`. The
visible track, active-fill, thumbs, and ticks are all painted by
`slider.scss` directly. Consumers wanting to label the slider use
an external `<label>` element bound to the input via
`aria-labelledby` (preferred) or supply the `label` prop to surface
an `aria-label`.

The `icon` partial is intentionally NOT composed — sliders
authored to date carry no icon glyphs. A future "stepper-style"
slider with `-` / `+` buttons would compose `{{> icon }}` and
`{{> button }}` partials, but ships as a distinct unit, not a
modifier on this one.

## Tokens consumed

**Structural** — `--space-2` (4 px gap between value-label area and
track area; track block-size), `--space-3` (8 px container inline +
block padding), `--space-6` (20 px thumb diameter),
`--border-radius-pill` (9999 px — pill rounding for track,
active-fill, and thumbs),
`--border-width-default` (2 px focus-visible outline on focused
state).

**Typography** — `--font-family-primary`, `--font-weight-regular`,
`--font-weight-semibold`, value-label pair `--font-size-body-base` /
`--lineheight-body-base` (16 / 24), helper text pair
`--font-size-body-sm` / `--lineheight-body-sm` (14 / 22).

**Color** — `--color-background-primary` (container surface),
`--color-border-tertiary` (track in default / hover / focused /
active states), `--color-signal-info` (active-fill in default /
hover / focused / active — the brand identity colour for the
filled portion of the track; resolves to `#0009ec` indigo under
LifeLock theme), `--color-border-focus` (focus-visible ring around
the thumb — the canonical theme focus signal, resolves to
`#108389` ocean-teal under LifeLock theme; consistent with the
default theme Figma binding `Color/Border/focus` and with the
sibling Accordion's focus-ring posture, so the focus cue reads
uniformly across the component library regardless of which brand
identity the unit's content paint expresses),
`--button-primary-bg-default` (thumb in default — aliases to the
same `#0009ec` resolution as `--color-signal-info`, kept distinct
so a future button-token rebrand doesn't drift the thumb paint),
`--button-primary-bg-hover` (thumb in hover state — `#505165`),
`--button-primary-bg-pressed` (thumb in active state — `#2f303c`),
`--button-disabled-border` (track in disabled — `#b3b3b3`),
`--button-disabled-content` (active-fill + thumb in disabled —
`#808080`).

See this package's Design System token galleries and themes/default/ for resolved values.

## Responsive behaviour

The slider is intrinsically full-width — it grows to fill its inline
container and never caps its own width. The Figma master ships a
canonical inline size of 240 px; in code the slider expands to
whatever inline-size the parent grid column allocates. Internal
layout uses `padding-inline: var(--space-3)` so the track footprint
always insets 8 px from the container edge — the thumb at the
extreme values never overflows because the thumb's outer-edge is
constrained inside the padding box via `transform: translateX(-50%)`
at offset 0 / `translateX(50%)` at offset 100%.

The 20 × 20 thumb diameter is fixed across all breakpoints; the
track block-size stays at 4 px (`--space-2`); the value-label area
reserves 24 px regardless of viewport. Reflow between SM / MD / LG /
XL is therefore a non-event — only the container inline-size
changes, which the percentage-based thumb-offset model handles
naturally. No container queries are required.

The component is responsible for filling its parent; placement on
the page grid belongs to the consumer per
[`grid-as-default-context.mdc`](../../../../.cursor/rules/grid-as-default-context.mdc).
The canonical layout pattern for a settings-row slider wraps it in
`<div class="l-fluid-width l-row"><div class="l-col l-col--md--6">…</div></div>` —
half-row at MD/LG/XL with stacked label sibling.

## States

- **Default** — track painted with `--color-border-tertiary`,
  active-fill + thumb both painted with `--color-signal-info`.
  Thumb cast carries no shadow. No focus indicator.
- **Hover** — track + active-fill unchanged; thumb fill swaps to
  `--button-primary-bg-hover` (`#505165`). CSS pseudo-class `:hover`
  on the thumb element.
- **Focused** — track + active-fill + thumb fill stay at default;
  a 2 px `--border-width-default` outline in `--color-border-focus`
  draws around the thumb at `outline-offset: 4px` so the ring sits
  outside the thumb circle. CSS pseudo-class `:focus-visible` on the
  underlying `<input type="range">` — pointer focus does not paint;
  keyboard focus does, mirroring native `<input>` behaviour. Same
  token Accordion's focus ring consumes, so the focus signal reads
  uniformly across the component library.
- **Active** (pressed) — track + active-fill unchanged; thumb fill
  swaps to `--button-primary-bg-pressed` (`#2f303c`). CSS
  pseudo-class `:active` on the thumb.
- **Disabled** — root carries `aria-disabled="true"`; track repaints
  with `--button-disabled-border`; active-fill + thumb repaint with
  `--button-disabled-content`; underlying `<input>`s receive the
  native `disabled` attribute (removes them from the tab order); the
  JS pointer-drag handler short-circuits on `aria-disabled="true"`.

## Accessibility

- Each thumb is backed by a native `<input type="range">` — the
  browser supplies `role="slider"`, `aria-valuemin`, `aria-valuemax`,
  `aria-valuenow`, and keyboard handling for free. The visible thumb
  is a pure presentational `<span>` positioned via
  `--slider-thumb-offset`; the `<input>` is layered visually behind
  the thumb at `opacity: 0` with the same hit area so pointer drags
  resolve against the native input directly. No custom keyboard
  handler is required.
- On `selection="range"`, two `<input type="range">` siblings handle
  the lower and upper thumbs. The JS layer constrains each input's
  `min` / `max` against the other so the lower thumb cannot exceed
  the upper and vice versa.
- The root carries `role="group"` and an optional `aria-label` /
  `aria-labelledby` so assistive tech announces the slider's
  semantic purpose ("Volume", "Price range") before reading the
  individual thumb values.
- `Tab` / `Shift+Tab` move focus between the thumb input(s) and
  surrounding controls. `Arrow keys` step the value (native).
  `Home` / `End` jump to the domain bounds (native). `Page Up` /
  `Page Down` step by `step × 10` on most browsers (native). No
  custom keyboard logic in the component.
- Focus is `:focus-visible` only — pointer drags do NOT paint the
  focus ring, only keyboard navigation does. This mirrors native
  `<button>` and `<input>` behaviour.
- The 2 px focus ring offset by 4 px from the 20 px thumb sits well
  clear of any sibling slider on the same surface — a sibling row
  ≥ 48 px tall is the recommended pairing density.
- Touch targets — the visible thumb is 20 × 20, but the underlying
  `<input type="range">` is sized to the **full track-area
  block-size of 32 px** so the touch hit area meets the WCAG 2.1 AA
  44 × 44 floor when the consumer's surface adds the recommended
  6 px block-padding above / below the slider's container.
  Consumers that need to ship the slider in a denser layout must
  enlarge the surrounding row, not the slider itself.
- The disabled state preserves the visible thumb so a screen reader
  user landing on the surrounding row still hears the slider's
  semantics — the input simply becomes non-interactive.
- The focus ring color (`--color-border-focus`, `#108389` ocean-teal
  under LifeLock) meets the 3:1 non-text contrast bar against
  `--color-background-primary` white. The active-fill
  (`--color-signal-info`, `#0009ec` indigo) meets the 3:1 non-text
  contrast bar against the track surface (`--color-border-tertiary`,
  `#d3d3dc`).
- Honours `prefers-reduced-motion: reduce` — the JS thumb-position
  update is instantaneous regardless; no transition CSS animates
  between values.

## JavaScript API

### Init signature

| option | type | default | description |
|---|---|---|---|
| `snapToTicks` | `boolean` | `true` on `discrete`, `false` on `continuous` | Force-enable / disable the snap-on-release behaviour. Overrides the variant default. |
| `commitOn` | `"input"` \| `"change"` | `"change"` | Which underlying event fires `lifelock:slider:commit`. `"input"` fires on every pointer move (high-frequency, useful for live previews); `"change"` fires only on pointer-up / keyboard commit (lower-frequency, suitable for analytics). |

### Instance shape

```ts
type SliderValue = number | { min: number; max: number };

type SliderInstance = {
  /** Read the current value. Returns a number on single-value sliders;
   *  `{ min, max }` on range sliders. */
  getValue(): SliderValue;
  /** Programmatically set the value. Triggers a re-paint and dispatches
   *  the `lifelock:slider:input` event but NOT `lifelock:slider:commit`
   *  (commit only fires on user-initiated interactions). */
  setValue(next: SliderValue): void;
  /** Enable / disable interactivity. Toggles `aria-disabled` on the
   *  root and the native `disabled` attribute on each input. */
  setDisabled(disabled: boolean): void;
  /** Detach all listeners; idempotent. */
  destroy(): void;
};

function initSlider(root: HTMLElement, options?: SliderInitOptions): SliderInstance;
function initSliders(scope?: ParentNode, options?: SliderInitOptions): SliderInstance[];
```

### Events

| name | detail | when fired |
|---|---|---|
| `lifelock:slider:input` | `{ value: SliderValue, source: 'pointer' \| 'keyboard' \| 'api' }` | Fires on the root on every value change — pointer drag, keyboard arrow, programmatic `setValue`. High-frequency. Bubbles. |
| `lifelock:slider:commit` | `{ value: SliderValue, source: 'pointer' \| 'keyboard' }` | Fires on the root on pointer-up or after a keyboard commit (`Enter` / `Tab`). Programmatic `setValue` does not fire this event. Bubbles. |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `data-state` | `default` \| `hover` \| `focused` \| `active` | Authored by the template for story freezes; JS does NOT toggle these at runtime. Runtime state is observable via the standard CSS pseudo-classes. |
| `aria-disabled` | `"true"` | Authored by the template when `disabled` is true; JS short-circuits the pointer handler when this attribute is present. |
| `data-variant` | `continuous` \| `discrete` | Authored by the template from the `variant` prop. JS reads this on init to wire the snap-on-release behaviour. |
| `data-selection` | `single-value` \| `range` | Authored by the template from the `selection` prop. JS reads this on init to wire the two-input range pairing. |
| `style="--slider-thumb-offset: <pct>%"` | `0%` – `100%` | Authored by the template at render time and updated by JS on every input event. Drives the thumb's `inset-inline-start`. On `range`, two custom properties — `--slider-thumb-offset-start` and `--slider-thumb-offset-end` — drive the two thumbs. |
| `style="--slider-fill-start / --slider-fill-end"` | `0%` – `100%` | Authored by the template + JS to drive the active-fill's `inset-inline-start` + `inset-inline-end`. On `single-value`, `--slider-fill-start` is fixed at `0%`. |

### Keyboard

| key | behavior |
|---|---|
| `Tab` | Move focus to / between thumb inputs. Native behaviour. |
| `Arrow Right` / `Arrow Up` | Increment value by `step`. Native `<input type="range">`. |
| `Arrow Left` / `Arrow Down` | Decrement value by `step`. Native. |
| `Page Up` / `Page Down` | Increment / decrement by `step × 10` (browser-dependent). Native. |
| `Home` / `End` | Jump to `min` / `max`. Native. |
| `Esc` | No-op — slider is not a modal surface. |

### SSR fallback

Without JS, the slider renders as a fully functional native
`<input type="range">` pair — keyboard navigation, pointer drag, and
form submission all work. The only behaviour the JS layer adds is
(a) the discrete snap-on-release that quantises a continuous-drag
input back to the nearest tick once the pointer is released, (b)
the cross-constraint on range sliders that prevents the lower thumb
from exceeding the upper, and (c) the custom event suite for
analytics. The visual presentation — track, fill, ticks, thumb —
all binds to the native input's `value` via CSS custom properties
authored at render time from the SSR-supplied initial value.

## Brand modes

LifeLock is the only theme. The component reads from the
semantic + button-component token layers in `_colors.scss` and
`_button.scss` and stays in sync with the active platform mode
(Desktop / Tablet / Mobile) automatically. No per-platform
overrides are needed — the Figma master ships identical paints
across the three platform modes.

## Design intent

The slider exists as the canonical numeric-range picker for value
selection inside settings, filters, and dashboards. Two structural
axes (`variant`, `selection`) cover the four meaningful shapes;
five interaction states paint the user feedback. The component
deliberately does NOT try to become:

- A **stepper** with `-` / `+` buttons flanking the value — that
  pattern composes a Button pair and a `<input type="number">` and
  ships as a separate unit. Mixing the patterns confuses
  affordance.
- A **dual-handle dial** or **circular slider** — those are
  fundamentally different interaction models (radial value
  sweep) and don't fit the linear-track metaphor this primitive
  publishes.
- A **rich filter** with named breakpoints inline on the track
  (e.g. "Low / Medium / High" labels under each tick) — the
  discrete variant ships visible tick marks but does not render
  per-tick labels; a label-bearing variant would compose the
  slider with a separate label row and would also ship as a
  distinct unit.

Discrete ships with exactly 11 ticks (10 equal segments) because
that division is the smallest count where each tick is
unambiguously distinguishable at the 240 px reference inline-size
while still offering enough granularity for typical product
controls (intensity, count, density). Authors needing a different
tick count must escalate to design — the count is a design
decision, not a code dial.

## Notes & open questions

- The Figma source binds the track + thumb pill-rounding to
  `border-radius/border-radius-xxxl` (30 px). LifeLock's authored
  border-radius family does not publish a 30 px step; the closest
  available is `--border-radius-pill` (9999 px). The component
  consumes `--border-radius-pill` — a visual no-op at the slider's
  small block-sizes (4 px track, 20 px thumb), since both 30 px and
  9999 px paint as a fully-rounded pill at those dimensions. If a
  new component variant ever ships at a larger track block-size
  where 30 px reads as a finite radius, a `--border-radius-xxxl`
  token should be added.
- The Figma source binds the focus-ring outline to the default theme
  semantic `Color/Border/focus` token — the same theme focus signal
  Accordion consumes. Under LifeLock theme this resolves to
  `#108389` ocean-teal; under default theme it resolves to the
  default theme focus colour. The slider consumes `--color-border-focus`
  to mirror that semantic binding so the focus cue reads uniformly
  across the component library and tracks the theme automatically as
  the brand swaps. The slider's identity colour
  (`--color-signal-info`, `#0009ec` indigo under LifeLock) is
  expressed in the active-fill of the track, where it carries the
  brand without competing with the focus signal.
- The discrete variant always ships **11 ticks** in the Figma
  source. The CSS authors the tick layer from a fixed eleven
  `--slider-tick-offset` declarations so the rendered output stays
  in lock-step with Figma; a future authored tick-count axis would
  require a designer-led Figma change first, then a spec update
  here.
- Range sliders ship with two overlapping `<input type="range">`
  siblings — the canonical "two-thumb range" HTML pattern. The JS
  layer constrains each input's domain against the other so the
  thumbs cannot cross. Browsers without JS will allow the thumbs to
  cross visually; the slider then reads as `{ min: <upper>, max:
  <lower> }` which the consumer can either normalise on submit or
  surface as an error. Documenting the no-JS behaviour as
  pragmatically acceptable; a future swap to a single-input + JS-
  driven visual model would lose the native semantic story (two
  separately announceable thumbs) and is rejected.
