---
type: component
name: tabs
subtype: pattern
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1396:6994"
status: published
behavior: true
composes:
  - icon
tokensConsumed:
  - --space-1
  - --space-2
  - --space-3
  - --space-5
  - --border-radius-s
  - --border-width-s
  - --border-width-xs
  - --color-bg-primary
  - --color-bg-inverse-strong
  - --color-bg-subtle
  - --color-text-primary
  - --color-text-inverse
  - --color-text-accent
  - --color-border-strong
  - --color-border-accent
  - --color-border-focus
  - --color-border-subtle
  - --color-disabled-text
  - --font-family-primary
  - --font-weight-regular
  - --font-weight-medium
  - --font-weight-semibold
  - --font-size-body-lg
  - --lineheight-body-lg
  - --letterspacing-body-lg
  - --font-size-body-sm
  - --lineheight-body-sm
  - --letterspacing-body-sm
  - --font-size-label
  - --lineheight-label
  - --letterspacing-label
---

# Tabs

Horizontal tablist with Solid / Subtle styles and a mobile dropdown fallback.
Mirrors [Pattern / Tabs `539:28424`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28424&m=dev)
(`.Tab` `1396:6950`, wrapper `1396:6994`, mobile `1396:7051`) and Spec Frame
[`.Tabs · spec` `4362:266`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4362-266&m=dev).

## Summary

`.c-tabs` wraps `.c-tabs__tab` items (one Spec Frame covers Tab + Tabs + mobile).
Style Solid fills the active tab; Subtle uses a bottom accent keyline. Weight ladder:
Default Regular → Hover Medium → Focus/Active SemiBold. `initTabs` wires selection,
roving tabindex, and the mobile dropdown when more than three tabs are present below MD.

## Composes

Composes: icon.

## Variant axes

| Axis | Values |
|---|---|
| style | `solid`, `subtle` |
| per-tab state | `default`, `hover`, `focus`, `active`, `disabled` (presentational `data-state` for galleries; live selection via JS) |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Style | VARIANT | `style` | no | `"solid"` | |
| 2 | — | array | `tabs` | yes | 3 sample tabs | `{ label, showIcon, iconName, disabled, panelId }` |
| 3 | — | number | `activeIndex` | no | `0` | 0-based initial selection |
| 4 | — | boolean | `showMobileFallback` | no | auto | true when `tabs.length > 3` |
| 5 | — | boolean | `forceMobile` | no | `false` | Story / demo force dropdown |
| 6 | — | TEXT | `label` | no | `"Section"` | Mobile field title |
| 7 | — | TEXT | `ariaLabel` | no | `"Tabs"` | tablist accessible name |
| 8 | tabs[].Show icon | BOOLEAN | `tabs[].showIcon` | no | `false` | |
| 9 | — | TEXT | `tabs[].iconName` | no | `objects/simple-device-vehicle` | |
| 10 | — | TEXT | `tabs[].label` | no | `"Tab N"` | |
| 11 | — | boolean | `tabs[].disabled` | no | `false` | |
| 12 | — | TEXT | `tabs[].panelId` | no | `panel-N` | `aria-controls` |

## Tokens consumed

**Structural** — `--space-1`…`--space-5`, `--border-radius-s`, `--border-width-xs` / `--border-width-s`.

**Surfaces / content** — Solid active `--color-bg-inverse-strong` / `--color-text-inverse`; Subtle active `--color-text-accent` / `--color-border-accent`; hover mix on primary; focus `--color-border-focus`; disabled `--color-disabled-text`.

**Typography** — body-lg on tabs; body-sm + label on mobile field.

## Responsive behaviour

Desktop/tablet: horizontal tablist. Below MD (`max-width: 767px`), when more than three tabs are authored, the list hides and the Closed/Open dropdown (`1396:7051`) shows. `forceMobile` / `.c-tabs--force-mobile` forces the dropdown for stories.

## States

- Hover / focus-visible via CSS; presentational `data-state` for AllStyles
- Active via `.is-active` + `aria-selected="true"` (JS)
- Disabled via `disabled` / `.is-disabled`
- Mobile open via `.is-mobile-open` + trigger `aria-expanded`

## Accessibility

- Root tablist uses `role="tablist"`; items are `role="tab"` with `aria-selected` and `aria-controls`
- Roving tabindex; Arrow / Home / End move selection
- Mobile trigger `aria-haspopup="listbox"` + `aria-expanded`; options `role="option"`
- Touch target ≥ 44px on mobile trigger

## Design intent

Primary wayfinding for peer content panels. Solid for strong chrome; Subtle for content-led surfaces. Collapse to a dropdown on small viewports when the tab count exceeds three so labels stay readable.

## JavaScript API

### Init signature

| option | type | default | description |
|---|---|---|---|
| activeIndex | number | from `data-active-index` | Initial selected tab |
| onChange | function | — | Optional callback `(index) => void` |

### Instance shape

```ts
{
  setActiveIndex(index: number): void;
  getActiveIndex(): number;
  destroy(): void;
}
```

### Events

| name | detail | when fired |
|---|---|---|
| `lifelock:tabs:change` | `{ index, root, source }` | Selection changes (`tab` / `keyboard` / `mobile` / `api`) |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `data-active-index` | number | After change |
| `aria-selected` | true/false | On each tab / option |
| `aria-expanded` | true/false | Mobile trigger |
| `.is-active` | class | Selected tab / option |
| `.is-mobile-open` | class | Dropdown open |

### Keyboard

| key | behavior |
|---|---|
| ArrowRight / ArrowDown | Next enabled tab |
| ArrowLeft / ArrowUp | Previous enabled tab |
| Home / End | First / last enabled tab |

### SSR fallback

Static markup shows the authored active tab; without JS, selection and mobile open/close do not update.

## Notes & open questions

- Tab items are `__tab` elements of this unit — not a separate `tab` package unit.
- Spec Frame sync / Sync Decisions stamps out of scope for this greenfield onboard.

## Figma source

- [Pattern / Tabs page `539:28424`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28424&m=dev)
- [`.Tab` set `1396:6950`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1396-6950&m=dev)
- [Tabs wrapper `1396:6994`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1396-6994&m=dev)
- [Mobile dropdown `1396:7051`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1396-7051&m=dev)
- [`.Tabs · spec` `4362:266`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4362-266&m=dev)
