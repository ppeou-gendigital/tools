---
type: component
name: pricing
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "4070:2426"
status: published
composes: []
tokensConsumed:
  - --font-family-primary
  - --font-weight-regular
  - --font-weight-semibold
  - --font-size-h3
  - --lineheight-h3
  - --letterspacing-h3
  - --font-size-h4
  - --lineheight-h4
  - --letterspacing-h4
  - --font-size-h5
  - --lineheight-h5
  - --letterspacing-h5
  - --font-size-h6
  - --lineheight-h6
  - --letterspacing-h6
  - --font-size-body-2xl
  - --lineheight-body-2xl
  - --letterspacing-body-2xl
  - --font-size-body-xl
  - --lineheight-body-xl
  - --letterspacing-body-xl
  - --font-size-body-base
  - --lineheight-body-base
  - --letterspacing-body-base
  - --font-size-body-sm
  - --lineheight-body-sm
  - --letterspacing-body-sm
  - --color-text-secondary
  - --color-text-inverse
  - --color-bg-inverse
  - --space-0
  - --space-1
  - --space-2
---

# Pricing

Typography-only price triplet (currency glyph, amount, optional billing period). Figma: [Molecule / Pricing](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4070-2426&m=dev) (`4070:2426`). Spec Frame [`4313:48`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4313-48&m=dev). Board `4318:1788`.

## Summary

One anatomy, four sizes (L / M / S / XS), two themes (Default / Inverse), two currency positions, and optional stack-period — 32 published variants. Owns no chrome on Default (Inverse fills `--color-bg-inverse`). Amount is pre-formatted; the molecule does not localise.

## Composes

Composes: none.

## Variant axes

| Axis | Values |
|---|---|
| Size | `l`, `m`, `s`, `xs` |
| Theme | `default`, `inverse` |
| Currency position | `first`, `last` |
| Stack period | `false` (inline), `true` (stacked below) |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | — | text | `amount` | yes | — | Pre-formatted numeric string |
| 2 | — | text | `currency` | no | `$` | Glyph |
| 3 | Currency position | enum | `currencyPosition` | no | `first` | `first` \| `last` |
| 4 | Size | enum | `size` | no | `l` | `l` \| `m` \| `s` \| `xs` |
| 5 | Theme | enum | `theme` | no | `default` | `default` \| `inverse` |
| 6 | — | text | `period` | no | `/mo` | Billing suffix |
| 7 | — | boolean | `showPeriod` | no | `true` | Hide period when false |
| 8 | Stack period | boolean | `stackPeriod` | no | `false` | Stack period below amount |
| 9 | — | text | `ariaLabel` | no | `""` | Accessible phrase |
| 10 | — | text | `className` | no | `""` | Outer root |

## Tokens consumed

**Type ramp (Size)** — L: H3 + Body-2xl; M: H4 + Body-xl; S: H5 + Body-base; XS: H6 + Body-sm. Period uses Body-sm. Amount weight `--font-weight-semibold`.

**Colour** — Default `--color-text-secondary`; Inverse `--color-text-inverse` on `--color-bg-inverse`.

**Spacing** — L/M outer `--space-2`; S/XS outer `--space-1`; currency↔amount `--space-1`.

## Responsive behaviour

Intrinsic inline size. Parent owns wrapping and layout density.

## States

Non-interactive — no hover / focus / disabled. One resting presentation per Size × Theme × Currency position × Stack period tuple.

## Accessibility

- Root `role="text"` so assistive tech reads one phrase.
- Prefer `ariaLabel` spelling out the value (e.g. “16 dollars and 67 cents per month”).
- Contrast: Default secondary text and Inverse inverse-primary meet WCAG AA on their surfaces.

## Design intent

Merchandising price display for cards, plan cells, hero rails, comparison tables. Do not use for in-paragraph price mentions, strike-through / badge chrome (compose richer wrappers), or interactive controls.

## Purpose

- Use when a surface needs a typographically deliberate single monetary amount.
- Do not use for inline body copy prices or decorated price chrome.
