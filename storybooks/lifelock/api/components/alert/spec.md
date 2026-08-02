---
type: component
name: alert
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1284:11542"
status: draft
composes:
  - icon
  - button
tokensConsumed:
  - --border-radius-card
  - --space-3
  - --space-4
  - --space-5
  - --color-signal-info
  - --color-signal-info-subtle
  - --color-signal-critical
  - --color-signal-critical-subtle
  - --color-signal-warning
  - --color-signal-warning-subtle
  - --color-signal-success
  - --color-signal-success-subtle
  - --color-bg-muted
  - --color-bg-inverse-strong
  - --color-text-primary
  - --color-text-inverse
  - --color-border-strong
  - --color-border-focus
  - --color-canvas-default
  - --font-family-primary
  - --font-size-body-base
  - --lineheight-body-base
  - --font-size-body-sm
  - --lineheight-body-sm
  - --font-weight-semibold
  - --font-weight-regular
  - --shadow-default
  - --border-width-default
---

# Alert

Inline messaging primitive — banner, toast, or passive surface — that
carries a tone-coded leading status icon, an optional title /
description pair, and opt-in CTA + dismiss affordances. Renders the
canonical [Web-ODS Shared Library → Alerts and
Notifications](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=537-28056&m=dev)
canvas, which publishes three sibling component sets — `DS · Alert /
Banner` ([`1284:11542`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11542&m=dev),
40 variants), `DS · Alert / Toast`
([`1284:11906`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11906&m=dev),
40 variants), `DS · Alert / Passive`
([`1284:12270`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-12270&m=dev),
40 variants) — and one `Alert — Overview` documentation frame
([`1284:13821`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-13821&m=dev))
that documents the unified properties / tones / tokens / composition
across all three sets. The component is wired identically across the
three layouts (same property table, same tone system, same tokens) so
the code mirror lands as one folder with `Layout` exposed as a
variant axis.

## Summary

`Components/Alert` is the canonical messaging surface for LifeLock —
one component, three layouts (Banner / Toast / Passive), five tones
(Info / Critical / Attention / Success / Dark), and two hierarchies
(Low → subtle tinted surface with primary content / High → strong
tone fill with inverse content). 120 Figma variants across the three
sibling component sets collapse onto a single `.c-alert` BEM block
with `--layout` / `--{low,high}` / per-tone modifiers. The CTA is an
INSTANCE of the canonical Web-ODS Shared Library Button on the Figma side
and composes the registered `{{> button}}` partial in the code
mirror (Size=S, Style per hierarchy: `low → primary` / `high →
secondary`, resolved via the `alertCtaStyle` Handlebars helper).
When `ctaHref` is set, the CTA renders as `<a class="btn
btn--<style> btn--s">` so navigation targets reuse the
canonical Button paint without forcing the `<button>` element.
Linked Figma node: [`1284:11542`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11542&m=dev).

## Composes

Composes: icon (leading status icon + dismiss `×`, rendered via the
registered `icon` partial at `size=20`), button (CTA, rendered via
the registered `button` partial at `size=s` with `style` resolved
from `hierarchy` via the `alertCtaStyle` helper — see § "Composition
rules for consumers").

## Variant axes

| Axis | Values |
|---|---|
| `layout` | `banner` (default — persistent inline alert, spans the full width of its container, CTA visible by default with dismiss collapsed) / `toast` (floating ephemeral alert with `--shadow-default`, dismiss visible by default with CTA optional, width capped before reaching the container) / `passive` (compact informational alert with neither CTA nor dismiss in the default state). Drives the `.c-alert--<layout>` BEM modifier. |
| `hierarchy` | `low` (default — subtle tinted surface in `--color-signal-<tone>-subtle`, content in `--color-text-primary`) / `high` (strong tone fill in `--color-signal-<tone>`, content in `--color-text-inverse` for Info / Critical / Success / Dark; `--color-text-primary` for Attention so the high-contrast yellow surface still meets WCAG AA). Drives the `.c-alert--<hierarchy>` BEM modifier. |
| `tone` | `info` (default — General system information; statusInfo icon) / `critical` (Destructive or blocking error; statusCritical icon) / `attention` (Cautionary state; statusAttention icon) / `success` (Positive confirmation; statusOk icon) / `dark` (Neutral emphasis when the tone shouldn't suggest semantic state; info icon). Drives the `.c-alert--<tone>` BEM modifier. |
| `breakpoint` | `Mobile 375` / `Tablet 768` / `SmDesktop 1024` / `LgDesktop 1280` — Figma-only axis surfacing the breakpoint variant set; the code mirror handles responsive behaviour through Storybook's viewport toolbar + the LifeLock band mixins from [`tokens/breakpoints/_breakpoints.scss`](../../tokens/breakpoints/_breakpoints.scss), not through a code-side argType (per [`component-anatomy.mdc`](../../../../.cursor/rules/component-anatomy.mdc) Rule 3). |

Combinations multiply: `hierarchy × tone × breakpoint = 2 × 5 × 4 =
40` Figma variants per layout, `× 3 layouts = 120` total. The code
mirror's BEM matrix is `layout × hierarchy × tone = 3 × 2 × 5 = 30`
class combinations (breakpoint reflows via media queries instead of
class permutations).

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Title | TEXT | `title` | yes | `"Alert title"` | Main message line. Bound to `--font-size-body-base` (16/24) + `--font-weight-semibold` + `--font-family-primary` on the SemiBold-aware brand fallback. Optional in code — when omitted, the description fills the slot at the same typography to preserve hit-area. |
| 2 | Description | TEXT | `description` | no | `"Short description."` | Sub-text under the title. Bound to `--font-size-body-sm` (14/22) + `--font-weight-regular` + `--font-family-primary`. Stays 14 px across every breakpoint per the Spec Frame's `Description type` row. |
| 3 | Show button | BOOLEAN | `showButton` | no | Banner: `true` · Toast: `true` · Passive: `false` | Toggles the CTA. The CTA composes the registered `{{> button}}` partial (Size=S; `Style=Primary` on Low, `Style=Secondary` on High — resolved automatically via the `alertCtaStyle` Handlebars helper, **verified against live Figma — see § "Composition rules for consumers" for the per-variant sample table**). When `ctaHref` is set, the same paint surfaces as `<a class="btn btn--<style> btn--s">` so the canonical Button paint / padding / focus ring are reused without forcing the `<button>` element on a navigation target. |
| 4 | Dismissible | BOOLEAN | `dismissible` | no | Banner: `false` · Toast: `true` · Passive: `false` | Toggles the dismiss frame holding the `actions/simple-close` icon. The dismiss button carries `aria-label="Dismiss"` and emits a `click` event the consumer wires up — the alert itself is a presentational primitive and does NOT ship a `<name>.js` runtime. Dismiss behaviour is the host's responsibility. |
| 5 | Whole clickable | BOOLEAN | `wholeClickable` | no | `false` (on all 3) | Reserved for the "entire surface is the action" pattern. When `true`, the alert renders inside a wrapping `<a class="c-alert__shell">` (rather than a `<div>`) so the whole surface becomes the link target; consumers must pass `href` alongside. Today this is a placeholder — the Figma side flags it as informational and no Banner / Toast / Passive variant currently exercises the wrap. |
| 6 | Icon | INSTANCE_SWAP | `icon` | no | Per-tone defaults: `status/simple-status-info` (Info) / `status/simple-status-critical` (Critical) / `status/simple-status-attention` (Attention) / `status/simple-status-ok` (Success) / `status/simple-info` (Dark) | Leading status icon. The Figma source pulls from Web-ODS-Icons; the LifeLock code mirror resolves the per-tone catalog key automatically when omitted and accepts any valid catalog key from `storybook-lifelock/src/components/icon/_icon-catalog.js` when overridden. |
| — | Href | String | `href` | no | `null` | Required when `wholeClickable=true`; ignored otherwise. The whole-clickable wrap renders `<a href="{{href}}">`; the link target is the consumer's responsibility. |
| — | CTA label | String | `ctaLabel` | no | `"Action"` | Visible label on the CTA when `showButton=true`. Forwarded to the `{{> button}}` partial as its `label` argument (the partial paints it inside `.btn__label`). |
| — | CTA href | String | `ctaHref` | no | `null` | When set, the CTA renders as `<a class="btn btn--<style> btn--s" href="{{ctaHref}}">` instead of composing the `{{> button}}` partial (the partial only emits `<button>`, so anchor variants apply the canonical Button classes directly to the `<a>` element). Otherwise the CTA composes `{{> button}}` and renders as `<button type="button">`. |
| — | Dismiss label | String | `dismissLabel` | no | `"Dismiss"` | Bound to the dismiss button's `aria-label`. Always provide a localized value when shipping. |

## Fixture keys → BEM

| Fixture key | Binds to |
|---|---|
| `layout` | Always emits as `c-alert--<layout>` modifier on the root (banner / toast / passive). |
| `hierarchy` | Always emits as `c-alert--<hierarchy>` modifier on the root (low / high). |
| `tone` | Always emits as `c-alert--<tone>` modifier on the root (info / critical / attention / success / dark). |
| `title` | Title text inside `.c-alert__title`. When omitted, the title slot collapses (the description takes the main message role). |
| `description` | Description text inside `.c-alert__description`. When omitted, the slot collapses. |
| `showButton` | When `true`, renders the CTA — composes the `{{> button label=ctaLabel style=(alertCtaStyle hierarchy) size="s"}}` partial when `ctaHref` is unset, or emits an `<a class="btn btn--<style> btn--s" href="{{ctaHref}}">` anchor when `ctaHref` is set. When `false`, the slot collapses. |
| `dismissible` | When `true`, renders the `.c-alert__dismiss` button holding the `{{> icon name="actions/simple-close" size="20" color="current" decorative=false accessibleLabel=dismissLabel}}` partial. When `false`, the slot collapses. |
| `wholeClickable` | When `true`, the root element is rendered as `<a class="c-alert ... c-alert--whole-clickable" href="{{href}}">` instead of `<div>`. When `false`, the root is a `<div role="status">` (Low) or `<div role="alert">` (High Critical) — see § Accessibility. |
| `icon` | The leading status-icon catalog key passed verbatim to the `{{> icon}}` partial at `size=20`. Resolves to a per-tone default via the `alertStatusIcon` Handlebars helper when omitted: `info → status/simple-status-info`, `critical → status/simple-status-critical`, `attention → status/simple-status-attention`, `success → status/simple-status-ok`, `dark → status/simple-info`. |
| `ctaLabel` | Forwarded to the `{{> button}}` partial as its `label` argument (or rendered inside the anchor's `.btn__label` span when `ctaHref` is set). |
| `ctaHref` | When set, the CTA renders as `<a class="btn btn--<style> btn--s" href="{{ctaHref}}">` (Button classes applied directly to the anchor since the `{{> button}}` partial only emits `<button>`). Otherwise composes `{{> button}}` and renders as `<button type="button">`. |
| `dismissLabel` | Bound to the dismiss button's `aria-label`. |

## Composition rules for consumers

The alert renders icons through the registered `icon` partial per
[`src/components/icon/spec.md`](../icon/spec.md) § "Composition rules
for consumers" — no inline `<svg>`, no hand-rolled `mask-image`. The
status icon and the dismiss `×` are both partial calls.

The CTA composes the registered `button` partial per
[`component sources.md`](../../../component sources.md) § "Composition
rules for consumers". The alert's template invokes the partial with
three arguments: `label=ctaLabel`, `style=(alertCtaStyle hierarchy)`,
and `size="s"`. The `alertCtaStyle` Handlebars helper (in
[`src/helpers/handlebars-helpers.js`](../../helpers/handlebars-helpers.js))
maps the alert's `hierarchy` to the canonical Button `Style` axis
verbatim: `low → primary`, `high → secondary`.

**The Low → Primary / High → Secondary mapping is verified against
the live canonical Figma source** — not inferred from the
deprecated local `.c-alert__cta` styling. Seven `(layout × hierarchy
× tone)` combinations were sampled via the Figma MCP
`get_design_context` and every Low variant's nested CTA INSTANCE
binds `--button/primary/*` tokens while every High variant binds
`--button/secondary/*`. The token *names* (`primary` vs `secondary`)
are brand-mode-agnostic Figma properties on the canonical Master
Button (`2434:14483`) — what changes per brand mode is the *values*
those Variables resolve to (LifeLock resolves them through the
Layer 3b CTA color extension in
[`src/tokens/colors/spec.md`](../../tokens/colors/spec.md), per the
mapping in [`src/tokens/button/spec.md`](../../tokens/button/spec.md)
§ "Token values"). The Style mapping below therefore holds for
every brand mode of the LifeLock Storybook even though the sampled
Figma values are the default theme-mode resolutions:

| Variant | Figma node | Button tokens on cta INSTANCE | Style |
|---|---|---|---|
| Banner Low / Info | [`1284:11546`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11546&m=dev) | `--button/primary/bg-default` (`#0009ec`), `--button/primary/content-default` (white), `--button/border-weight/primary` (0px) | Primary |
| Banner Low / Attention | [`1284:11564`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11564&m=dev) | same `--button/primary/*` triplet | Primary |
| Banner Low / Dark | [`1284:11582`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11582&m=dev) | same `--button/primary/*` triplet | Primary |
| Banner High / Info | [`1284:11591`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11591&m=dev) | `--button/secondary/bg-default` (`#fafafc`), `--button/secondary/content-default` (`#2f303c`), `--button/border-weight/secondary` (2 px), `--button/secondary/border` (`#2f303c`) | Secondary |
| Banner High / Attention | [`1284:11609`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11609&m=dev) | same `--button/secondary/*` quad | Secondary |
| Banner High / Dark | [`1284:11627`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11627&m=dev) | same `--button/secondary/*` quad | Secondary |
| Toast High / Critical | [`1284:11964`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11964&m=dev) | same `--button/secondary/*` quad | Secondary |

Tone never overrides Style — Attention's high-contrast yellow
surface still pairs with the same Secondary (white bg + 2 px dark
border + dark text) on High; the prior local CTA's per-tone yellow
override is no longer needed. The Alert Overview Spec Frame
([`1284:13821`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-13821&m=dev))
documents the same mapping in two regions: § "Design tokens" →
`CTA` row → `Web-ODS Shared Library Button · Size=S · Type=Primary (Low)
| Secondary (High)`, and § "Composition" → `cta (child 3)` →
`INSTANCE of Web-ODS Shared Library Button (Size=S, Type=Primary on Low
/ Secondary on High). Label override = "Action".`. The Spec Frame's
own rationale for picking Secondary (not Inverse) on High lives in
Designer Follow-Up 4 below.

The composed Button partial paints every CTA visual surface —
background, text color, radius, padding, focus ring, and the hover
/ active state ladder. The Alert owns exactly one layout-level rule
on the CTA — `.c-alert > .btn { align-self: center; }` in
[`alert.scss`](alert.hbs) — and applies the same per-child centering
to its own dismiss button (`.c-alert__dismiss { align-self: center; }`).
Both rules vertically center their target on the cross axis of the
Alert's flex row regardless of how many lines the description wraps
to, mirroring the Figma source's `items-center` alignment on the
outer Alert wrapper (verified live on Banner Low/Info
[`1284:11552`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11552&m=dev)
and Toast Low/Info [`1284:11916`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11916&m=dev)
— both nested CTA INSTANCE nodes, and the dismiss `×` frame in every
dismissible variant, sit inside an Alert wrapper whose flex alignment
is `items-center`). The CTA rule is **layout-level**, not paint-level
— it positions the CTA in the row, it does not override any
Button-side token. Every other CTA visual remains owned by the
Button partial. The CTA selector covers both the `{{> button}}`-rendered
`<button class="btn …">` form and the `ctaHref`-rendered
`<a class="btn …">` form because both emit the canonical `.btn` BEM
root as a top-level child of `.c-alert`. The icon and content stay
top-aligned (`align-items: flex-start` on the parent) so a multi-line
description does not push the leading status icon down into the
middle of the message — the icon, title, and first line of the
description remain visually grouped, while the CTA and dismiss opt
into centering individually rather than flipping the parent's
alignment.

Anchor-target CTAs (when `ctaHref` is set) bypass the partial and
apply the canonical Button classes directly to an `<a>` element —
`<a class="btn btn--<style> btn--s">` — because the Button
partial always renders a `<button>` element and HTML5 forbids
swapping `<button>` for `<a>` at the partial boundary. The visual
outcome is identical (same paint, same paddings, same focus ring,
same hover / active ladder); only the underlying tag differs.

## Tokens consumed

**Structural** — `--border-radius-card` (8 px outer radius; the
Figma source binds to `border radius/border-radius-l` which has no
direct LifeLock counterpart — `--border-radius-card` is the closest
match at the same 8 px value, see § "Notes & open questions"),
`--space-3` (8 px outer vertical padding), `--space-4` (12 px gap
between icon / content / cta / dismiss; a project-reserved index per
[`tokens/spacing/spec.md`](../../tokens/spacing/spec.md)), `--space-5`
(16 px outer horizontal padding), `--border-width-default` (2 px
focus outline on the dismiss button).

The CTA's structural tokens (radius, paddings, border-width) all live
inside the composed `{{> button}}` partial and resolve via
[`src/tokens/button/_button.scss`](../../tokens/button/_button.scss)
(`--button-radius-default`, `--button-padding-inline-s`,
`--button-padding-block-s`, `--button-border-width-default`). They
are not listed in this unit's `tokensConsumed` because the alert's
own SCSS never references them.

**Typography** — `--font-family-primary`, title pair
`--font-size-body-base` / `--lineheight-body-base` (16 / 24 LG; 14 /
22 SM band per [`tokens/typography/spec.md`](../../tokens/typography/spec.md))
+ `--font-weight-semibold`, description pair
`--font-size-body-sm` / `--lineheight-body-sm` (14 / 22 — fixed
across breakpoints per the Spec Frame's `Description type` row) +
`--font-weight-regular`.

**Per-tone Low (subtle tint surface)** —
`--color-signal-info-subtle` / `-critical-subtle` /
`-warning-subtle` (= Attention; the LifeLock semantic family is
named `warning` while Figma documents it as `attention`,
preserved verbatim per [`tokens/colors/spec.md`](../../tokens/colors/spec.md)
§ Notes) / `-success-subtle`, plus `--color-bg-muted` for `dark`
Low (no `--color-signal-dark-subtle` exists; the closest neutral
surface mirrors the Spec Frame's "Neutral emphasis" intent).

**Per-tone High (strong fill surface)** —
`--color-signal-info` / `-critical` / `-warning` (= Attention) /
`-success`, plus `--color-bg-inverse-strong` for `dark` High.

**Content** — `--color-text-primary` (default on Low + High Attention)
/ `--color-text-inverse` (default on High Info / Critical / Success /
Dark). The High Attention exception mirrors the Spec Frame's `Content
fill` row — Attention's yellow / orange surface keeps primary text
for legibility.

**Elevation (Toast only)** — `--shadow-default` (the canonical
24 px-blur drop shadow from [`tokens/shadow/spec.md`](../../tokens/shadow/spec.md)).

**Focus** — `--color-border-focus` (semantic focus ring on the
dismiss button and the whole-clickable surface) + `--border-width-default`
(2 px outline). The CTA's focus ring comes from the composed `{{>
button}}` partial and resolves to the same `--color-border-focus`
token via [`src/tokens/button/_button.scss`](../../tokens/button/_button.scss).

See this package's Design System token galleries and themes/default/ for resolved values.

## Responsive behaviour

The alert is fully fluid within its parent container; the three
layouts differ only in width-capping behaviour and shadow:

- **Banner** — `inline-size: 100%`. Always fills its container at
  every breakpoint. Wrap text within using normal block-level reflow.
- **Toast** — `max-inline-size: 400px` at LgDesktop / SmDesktop bands
  (1024+ px), `max-inline-size: 343px` at Mobile / Tablet bands
  (< 1024 px). `box-shadow: var(--shadow-default)` is always present.
  When the container is narrower than the cap, the toast inherits the
  container width.
- **Passive** — `inline-size: 100%`. Compact padding (`--space-3`
  vertical, `--space-5` horizontal, same as Banner / Toast).

At all breakpoints the inner row is a HORIZONTAL auto-layout: status
icon · content (title + description stacked) · CTA · dismiss. On
narrow viewports (Mobile 375 / Tablet 768) the CTA can wrap to its
own row below the content via flex-wrap when the combined inline
width exceeds the container; the icon stays pinned to the top-start
corner so the message + CTA reflow together.

Title typography binds to `--font-size-body-base` (16 / 24 LG; 14 / 22
SM band per the typography breakpoint switch). Description stays at
14 / 22 across every breakpoint per the Spec Frame's `Description
type` row.

## States

- **Default** — surface paints per `(hierarchy × tone)`; icon paints
  per tone; content paints per the High Attention exception rule.
- **CTA state ladder (hover / focus / active / disabled)** — owned
  by the composed `{{> button}}` partial. See
  [`component sources.md`](../../../component sources.md) § "States"
  for the canonical ladder per `Style`. The alert does not override
  any CTA state — the partial's per-`Style` paint reads correctly on
  every `(hierarchy × tone)` surface (low → primary, high →
  secondary; the secondary neutral surface + 2 px keyline reads on
  every saturated High tone, including the Attention yellow that
  previously needed an alert-side override).
- **Focus (dismiss)** — receives a 2 px outline in
  `--color-border-focus` offset 2 px from the box. CSS pseudo-class
  `:focus-visible` on `.c-alert__dismiss`.
- **Hover (dismiss)** — opacity dial-down on the `×` mark; CSS
  `:hover` on `.c-alert__dismiss`.
- **Hover (whole-clickable)** — when `wholeClickable=true`, the
  surface gains a `box-shadow: var(--shadow-default)` (matching the
  Toast affordance) on `:hover`; cursor is `pointer`.
- **Reduced motion** — there are no motion-driven states on the
  static alert. The Button's own transitions are honored under
  `prefers-reduced-motion: reduce` via the Button's SCSS. Future
  Toast auto-dismiss timing logic must honour `prefers-reduced-motion:
  reduce` as well.

## Accessibility

- The alert root carries `role="status"` (Low) or `role="alert"`
  (High Critical only) so screen readers announce the message
  appropriately. Other High tones use `role="status"` because they
  are informational rather than blocking.
- `aria-live="polite"` is set on every alert; High Critical overrides
  to `aria-live="assertive"` so blocking-error messages interrupt the
  current speech.
- The dismiss button carries an `aria-label` (default `"Dismiss"`)
  that consumers must localize. When dismissed, the consumer is
  responsible for removing the element from the DOM and emitting any
  required focus-restore behaviour.
- The CTA button / anchor inherits standard `<button>` / `<a>`
  semantics — keyboard focusable, `Enter` / `Space` activates.
- The leading status icon is decorative by default (`aria-hidden="true"`)
  because the tone is communicated through both the surface color and
  the message text; the icon is redundant from a screen-reader
  standpoint.
- When `wholeClickable=true`, the entire surface becomes a single
  focusable target via the wrapping `<a>`. The inner CTA / dismiss
  buttons are NOT nested inside that anchor (nested interactive
  elements is an HTML5 spec violation) — consumers should pick one or
  the other: a whole-clickable surface with no inner CTA / dismiss,
  OR an outer `<div>` with inner CTA / dismiss buttons.
- Color contrast: every `(hierarchy × tone)` combination meets WCAG
  AA 4.5:1 for the title and 4.5:1 for the description against the
  surface fill. Attention High keeps primary text on the yellow /
  orange surface specifically because inverse white text on yellow
  would fail contrast.
- Focus outline: 2 px `--color-border-focus` offset 2 px meets the
  3:1 non-text contrast bar against every surface paint, including
  the High variants where the surface itself is a saturated color.

## Brand modes

LifeLock is the only theme. The component reads semantic tokens from
`_colors.scss` (signal / content / canvas families) and stays in sync
with the active theme automatically. Future brand modes ride for
free via the per-brand `[data-brand]` blocks that the multi-brand
sibling package implements.

## Design intent

The Alert exists as the canonical messaging surface for any sustained
or transient system message that needs the user's attention without
blocking the rest of the page. The three layouts each occupy a
specific role:

- **Banner** — page-level, persistent. Use for sustained system
  messages anchored to the page or a region (top-of-page maintenance
  notice, "trial expiring in 3 days" inline reminder, "card on file
  expiring next month" callout above the billing form).
- **Toast** — float-level, transient. Use for ephemeral feedback that
  should auto-dismiss within a few seconds ("File uploaded",
  "Settings saved", "Password copied to clipboard"). The drop shadow
  reads as "floating above the canvas".
- **Passive** — inline-level, compact. Use for status badges, in-context
  tips, and read-only system messages that need to coexist with body
  text without dominating the row. Default has neither CTA nor
  dismiss — opt either in by the matching boolean.

Hierarchy follows urgency: Low (subtle tint) for routine messages,
High (strong fill) for messages that must read at a glance from
across the room. Tone follows semantic intent: Info / Success
communicate state, Critical communicates blocking-error, Attention
communicates caution-without-error, Dark communicates neutral
emphasis (marketing announcements, system-level messages that
shouldn't suggest a semantic state).

The component deliberately does NOT try to become:

- A **modal dialog** — that's its own primitive with focus-trapping,
  backdrop, and dismiss-on-Esc behaviour the Alert does not
  implement.
- A **toast-notification queue manager** — the Alert renders one
  toast; queueing, positioning, and auto-dismiss timing are the
  consumer's responsibility (or a future Toast container primitive).
- A **system snackbar with primary + secondary actions** — the Alert
  carries one CTA at most. Multi-action surfaces use the Modal or
  Drawer primitives.

## Sibling layouts

Each sibling component set in Figma resolves to one `Layout` value
in the unified code mirror.

### Banner

Persistent inline alert anchored to a page region. The default
surface for any sustained system message.

- CTA frame visible by default; dismiss collapsed unless the message is dismissible.
- Spans the full width of its container at every breakpoint.
- Uses Low → subtle tone tint and High → strong tone fill the same way Toast / Passive do.

Figma component set: [`1284:11542`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11542&m=dev).

### Toast

Floating ephemeral alert with elevation. Use for transient feedback
that should auto-dismiss.

- Carries the `--shadow-default` drop shadow to read as floating above the canvas.
- Dismiss visible by default, CTA optional.
- Width caps before reaching the full container so it feels like a card, not a banner.

Figma component set: [`1284:11906`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11906&m=dev).

### Passive

Compact informational alert with neither CTA nor dismiss in the
default state.

- CTA and dismiss frames exist as opt-in elements (`Show button` / `Dismissible` BOOLEAN, both default `false`).
- Sized to sit inline next to body text without dominating the row.
- Best for status badges, in-context tips, and read-only system messages.

Figma component set: [`1284:12270`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-12270&m=dev).

## Tone semantics

Five tones bind every surface, content, and icon colour through the
LifeLock Signal scale. The same tone reskins Low (subtle tint) and
High (strong fill) on the same family.

### Info

General system information that doesn't require urgent action.

**When to use:** Onboarding hints, feature announcements, neutral
status updates.

### Critical

Destructive or blocking error states that the user must reconcile.

**When to use:** Failed payments, API failures, irreversible
destructive actions.

### Attention

Cautionary state that needs awareness but isn't a hard error.

**When to use:** Trial expiring, plan downgrade pending, slow-network
mode.

### Success

Positive confirmation that an action completed.

**When to use:** Save succeeded, plan upgraded, file uploaded, MFA
verified.

### Dark

Neutral emphasis when the tone shouldn't suggest semantic state.

**When to use:** Marketing announcements, neutral system messages on
light pages.

## Composition

Top-to-bottom anatomy of a single variant. Every child has bound
paints, radii, and typography.

| Layer | Role |
|---|---|
| Outer frame | HORIZONTAL auto-layout, HUG height, FILL width (Banner / Passive) or capped width (Toast). Cross-axis alignment splits per child: the icon + content column anchor to the top of the row (`align-items: flex-start` on the parent) so the leading status icon stays visually grouped with the title + first line of description, while the CTA and dismiss both center vertically on the cross axis via per-child `align-self: center` on `.c-alert > .btn` and `.c-alert__dismiss` respectively — all three behaviours mirror the Figma source's `items-center` outer wrapper paired with the icon-content sub-block's `items-start` (see Banner Low/Info [`1284:11546`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11546&m=dev)). Fill bound to Signal tone, radius to `--border-radius-card`, padding `--space-3` vertical / `--space-5` horizontal. Toast adds `box-shadow: var(--shadow-default)`. |
| icon (child 1) | INSTANCE of `Components/Icon` painting the tone-specific status glyph. Low variants paint in the tone color; High variants override to `--color-text-inverse` (or `--color-text-primary` on High Attention). |
| content (child 2) | VERTICAL auto-layout. Two TEXT nodes — Title (`body-base`, SemiBold) and Description (`body-sm`, Regular). Background cleared so the parent tone bleeds through. |
| cta (child 3) | Composes the registered `{{> button}}` partial (Size=S; `Style=Primary` on Low, `Style=Secondary` on High — resolved via the `alertCtaStyle` helper; mapping verified against live Figma per § "Composition rules for consumers"). When `ctaHref` is set, renders as `<a class="btn btn--<style> btn--s">` instead. Visibility wired to the `showButton` BOOLEAN. Every paint / padding / radius / focus / state token comes from [`component sources.scss`](../../../component sources.scss), which mirrors the canonical Master Button (`2434:14483`) resolved at the LifeLock brand mode — pill radius, `--space-3` inline padding on Size=S, SemiBold label, etc. — per [`src/tokens/button/spec.md`](../../tokens/button/spec.md). |
| dismiss (child 4) | 20×20 frame holding the `actions/simple-close` icon. Recoloured per variant to match the leading status icon hue. Visibility wired to the `dismissible` BOOLEAN. |

## Designer follow-ups

Non-blocking design-system improvements identified during the build.
Each is filed against a specific Figma node for the design team to
action.

1. **Publish an Inverse THEME variant on every `icon / simple / status*` icon.** High-hierarchy variants currently rely on instance-level fill + stroke overrides to recolour the leading status icon and the dismiss `×`. A published `Inverse` theme axis on the Icons library would make these durable across `INSTANCE_SWAP`. In Figma: Web-ODS-Icons / `icon/simple/status*` ([fileKey `7NjgRv0ac9SNpgwEO7wmfe`](https://www.figma.com/design/7NjgRv0ac9SNpgwEO7wmfe/Web-ODS-Icons?node-id=2-2583&m=dev)).
2. **Add a `Label` TEXT property to the canonical Web-ODS Shared Library Button COMPONENT_SET.** The code mirror's Button partial already exposes a `label` argument (the alert forwards `ctaLabel` to it directly via `{{> button label=ctaLabel ...}}`). The Figma source's Button has no matching `Label` TEXT property, so the Alert's Figma side currently cannot bind a per-variant CTA label without diving into the nested Button instance. Adding the property in Molecules would close the loop. In Figma: Web-ODS Shared Library / Button (canonical component set).
3. **Republish `font/weight/*` Variables as exact font-style strings, OR expose canonical `PRIMARY/Body/*` Text Styles.** `font/weight/semibold` currently resolves to lowercase `"semibold"` which doesn't match Figma's style names (`SemiBold` for Lexend, `Medium` for Roboto). Title fontStyle is left as a direct value as a workaround; a brand-aware Variable or shared TextStyle would close the loop. In Figma: Web-ODS-Theme / Typography ([`Nshd9ukxIzpeUnzOXiWxUP`](https://www.figma.com/design/Nshd9ukxIzpeUnzOXiWxUP/Web-ODS-Theme?node-id=18014-751&m=dev)).
4. **Confirm the Hierarchy=High CTA type should be `Secondary` instead of `Inverse`.** `Inverse` was the first pick but in this DS it resolves to a dark-navy button intended for light surfaces — it clashes on coloured High alerts. `Secondary` (white bg + dark border + dark text) reads on every tone. If a future `Type=OnColor` is published, swap to that. In Figma: Web-ODS Shared Library / Button (canonical component set).
5. **Decide whether the Mobile breakpoint should re-bind Title type to `body-sm`.** Today every breakpoint variant uses `body-base`. The mode-driven mobile size is only triggered when the active brand mode is a Mobile sub-mode. If we want the Mobile variant to render at 14/22 regardless of mode, the Title fontSize should be bound to `body-sm` on Mobile variants only. In Figma: Web-ODS Shared Library / Alert / Banner | Toast | Passive (every Breakpoint=Mobile variant — [`1284:11542`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1284-11542&m=dev) and sibling sets).
6. **Publish `Stacked / Size=M` and `Stacked / Size=S` on the canonical Button set if Alert should scale CTA per breakpoint.** Currently every Alert CTA is fixed at Size=S. If the design intent is to grow CTA on wider breakpoints (S → M → L), the Molecules Button already has the variants — we just need a confirmation to wire the swap. In Figma: Web-ODS Shared Library / Button (canonical component set).

## Notes & open questions

- The Figma source binds the outer corner radius to `border radius/border-radius-l` (8 px). LifeLock's role-keyed radius family doesn't ship an `-l` token; the component consumes `--border-radius-card` (8 px, same value) — a name drift, not a value drift. A future rename to `--border-radius-card` ≡ `--border-radius-l` (or vice versa) would close the loop without any code change.
- The CTA composes the canonical `{{> button}}` partial (Size=S; `Style=Primary` on Low / `Style=Secondary` on High via the `alertCtaStyle` Handlebars helper). The historical "swap once `Components/Button` ships" migration has landed — no local `.c-alert__cta` selectors live in `alert.scss` anymore, and every paint / padding / radius / focus / state token comes from [`component sources.scss`](../../../component sources.scss). One ergonomics gap remains: the Button partial only emits `<button>`, so anchor-target CTAs (when `ctaHref` is set) bypass the partial and apply the canonical Button classes directly to an `<a>` element. A future enhancement to the Button partial — e.g. an `as="a"` / `href` opt-in that renders the same paint as `<a class="btn ...">` — would let the alert template drop its `ctaHref` branch entirely and route every CTA through the partial. Tracked separately from the spec.md flip because it's a Button-side change.
- `Components/Alert` does NOT ship a `<name>.js` runtime. The dismiss button emits a standard `click` event the consumer wires up; the Toast layout's auto-dismiss behaviour and the Banner / Passive layouts' analytics hooks are the consumer's responsibility. If a future use case demands a behaviour layer (e.g. a `lifelock:alert:dismiss` event suite mirroring the accordion's pattern), add it via the [`storybook-lifelock-js-contract.mdc`](../../../../.cursor/rules/storybook-lifelock-js-contract.mdc) shape.
- The `Whole clickable` BOOLEAN is wired as a structural prop today but no Banner / Toast / Passive Figma variant currently exercises the wrap — designers flagged it as informational on the Spec Frame. The code mirror keeps the prop so the contract is forward-compatible; consumers using it today should pair it with `showButton=false` + `dismissible=false` to avoid nesting interactive elements inside the wrapping `<a>`.
- The `Dark` tone has no `--color-signal-dark` / `-subtle` token (the Signal family covers Info / Critical / Warning / Success only). The code mirror substitutes `--color-bg-muted` (neutral-10) for Low and `--color-bg-inverse-strong` (off-black) for High, both of which read as "neutral emphasis on a light page" per the Spec Frame's Dark tone intent. If a future Signal-Dark token lands (`--color-signal-dark` / `-subtle`), the alert's `tone-dark` block in `alert.scss` swaps to consume it.
- The `Attention` tone surfaces in the LifeLock Signal family as `--color-signal-warning` / `-warning-subtle` (the `warning ↔ attention` name mismatch is preserved verbatim per [`tokens/colors/spec.md`](../../tokens/colors/spec.md) § Notes). The Figma side keeps the `Attention` label; the code side keeps the `warning` token name — `.c-alert--attention` consumes the `warning` family.
