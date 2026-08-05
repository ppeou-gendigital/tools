---
type: component
name: pagination
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "1332:52356"
status: published
subtype: pattern
librarySource: brand
composes:
  - icon
  - button
  - menu-list
  - menu-block
tokensConsumed:
  - --border-radius-s
  - --border-width-xs
  - --border-width-s
  - --color-bg-default
  - --color-bg-subtle
  - --color-border-focus
  - --color-border-subtle
  - --color-signal-info
  - --color-signal-info-subtle
  - --color-text-primary
  - --font-family-primary
  - --font-size-body-sm
  - --lineheight-body-sm
  - --letterspacing-body-sm
  - --font-weight-semibold
  - --space-2
  - --space-3
  - --space-4
behavior: true
---

# Pagination

Numbered result-set navigation with three sibling types. Mirrors [Pattern / Pagination](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28422&m=dev) (Overview `1332:53851`). Distinct from `pagination-dots`.

## Summary

One unit, three Types: **nav** (numbered pager), **select** (compact page listbox), **jump** (numeric entry). Current page paints `--color-signal-info-subtle` / `--color-signal-info`. `initPaginations` wires click / Enter and emits `other brand:pagination:change`.

## Composes

Composes: icon, button, menu-list, menu-block.

## Variant axes

| Axis | Values |
|---|---|
| Type | nav, select, jump |
| State | Default, Hover, Focus, Current/Selected/Filled, Disabled, Error (CSS + props) |
| Size | large, small (jump only) |
| Jump type | labelled, icon-only (jump only) |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Variant | enum | type | yes | nav | `nav` \| `select` \| `jump` |
| 2 | — | number | currentPage | no | 1 | |
| 3 | — | number | totalPages | no | 5 | |
| 4 | — | boolean | showFirstLast | no | false | Nav only |
| 5 | — | boolean | truncate | no | true | Nav only |
| 6 | — | number | siblingCount | no | 1 | Nav truncation window |
| 7 | — | boolean | disabled | no | false | |
| 8 | — | boolean | error | no | false | |
| 9 | Size | enum | size | no | large | Jump |
| 10 | Type | enum | jumpType | no | labelled | Jump `labelled` \| `icon-only` |
| 11 | — | boolean | open | no | false | Select menu open |
| 12 | — | array | pages | no | built | Nav items model |
| 13 | — | array | selectItems | no | built | menu-list args |

## Tokens consumed

**Structural** — `--space-2`, `--space-3`, `--space-4`, `--border-radius-s`, `--border-width-xs`, `--border-width-s`.

**Surface / content** — `--color-bg-default`, `--color-bg-subtle`, `--color-border-subtle`, `--color-border-focus`, `--color-signal-info`, `--color-signal-info-subtle`, `--color-text-primary`.

**Typography** — body-sm emphasis stack.

## Responsive behaviour

Nav wraps with flex. Select menu positions below the trigger. Jump row stays horizontal; no breakpoint axis.

## States

- Hover / focus via CSS
- Current (`aria-current="page"` + `.is-current`)
- Disabled / Error via props + classes
- Select open (`.is-open`)

## Accessibility

- Nav uses `<nav>` + labelled controls; current page `aria-current="page"`
- Select trigger `aria-haspopup="listbox"` + `aria-expanded`
- Jump: labelled input; submit on Enter or Go
- Touch targets 44×44 on nav controls

## Design intent

Match page-count and task: nav for short sets, select for mid-range, jump for very large sets.

## JavaScript API

### Init signature

| option | type | default | description |
|---|---|---|---|
| currentPage | number | from `data-current-page` | Initial page |
| totalPages | number | from `data-total-pages` | Upper bound |
| onChange | function | — | Optional callback |

### Instance shape

```ts
{
  setPage(page: number): void;
  getPage(): number;
  destroy(): void;
}
```

### Events

| name | detail | when fired |
|---|---|---|
| `other brand:pagination:change` | `{ page, root, source }` | Page changes |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `data-current-page` | number | After change |
| `aria-expanded` | true/false | Select trigger |
| `aria-current` | page | Current nav control |

### Keyboard

| key | behavior |
|---|---|
| Enter | Jump submit |
| (buttons) | Activate focused control |

### SSR fallback

Static markup shows the authored current page; without JS, controls do not update page state.

## Notes & open questions

- Spec Overview follow-up claiming COMPONENT_SETs “do not yet exist” is stale — sets exist on the page.
- Touch-target geometry for numbered links documented in Spec Follow-Ups — nav ships 44×44.

## Figma source

- [Pagination nav `1332:52356`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-52356&m=dev)
- [Page selector `1332:52459`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-52459&m=dev)
- [Page jump `1332:52580`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-52580&m=dev)
- [Pagination — Overview `1332:53851`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-53851&m=dev)
