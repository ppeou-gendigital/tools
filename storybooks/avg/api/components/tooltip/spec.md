---
type: component
name: tooltip
subtype: molecule
librarySource: brand
figmaFileKey: 0o8SL5BEk8wHtgud00dRyg
figmaNodeId: "587:77893"
status: published
behavior: true
composes: []
tokensConsumed:
  - --space-1
  - --space-2
  - --space-3
  - --space-4
  - --space-5
  - --border-width-xs
  - --border-radius-m
  - --shadow-default
  - --color-bg-default
  - --color-border-subtle
  - --color-text-primary
  - --color-signal-info-subtle
  - --color-signal-success-subtle
  - --color-signal-warning-subtle
  - --color-signal-critical-subtle
  - --font-family-primary
  - --font-size-body-sm
  - --font-size-body-base
  - --font-weight-regular
  - --font-weight-semibold
---

# Tooltip

Floating non-actionable label for UI explanation. Mirrors
[Pattern / Tooltip `539:28418`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28418&m=dev)
and Spec Frame
[`.Tooltip · spec` `4601:164`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4601-164&m=dev).

## Summary

`.c-tooltip` paints Type × Tint with a CSS pointer arrow. `initTooltip` wires hover/focus show and Escape dismiss when a trigger references the tooltip via `aria-describedby`.

## Composes

Composes: none.

## Variant axes

| Axis | Values |
|---|---|
| type | `small`, `medium`, `rich` |
| tint | `default`, `main`, `success`, `attention`, `critical` |
| pointer | `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`, `left`, `right` |

## Properties

| # | Figma label | Content type | Code identifier | Required | Default | Notes |
|---|---|---|---|---|---|---|
| 1 | Type | VARIANT | `type` | no | `"small"` | |
| 2 | Tint | VARIANT | `tint` | no | `"default"` | |
| 3 | Pointer direction | VARIANT | `pointer` | no | `"top-center"` | |
| 4 | — | TEXT | `title` | no | `""` | Medium/Rich |
| 5 | — | TEXT | `body` | no | `"Tooltip text"` | |
| 6 | — | boolean | `open` | no | `true` in stories | |
| 7 | — | TEXT | `id` | no | — | For `aria-describedby` |

## Tokens consumed

**Surface** — tint backgrounds via signal-subtle; border; `--shadow-default`.

**Typography** — body-sm / body-base.

## Responsive behaviour

Inline-size capped (~280px); wraps content. Positioning relative to trigger is consumer-owned (CSS / layout).

## States

- Open via `.is-open` / absence of `hidden`
- Escape closes when JS initialized

## Accessibility

- Root `role="tooltip"`
- Trigger should set `aria-describedby` to the tooltip `id`
- Dismissible with Escape

## Design intent

Short contextual help on hover/focus — not for interactive content or critical errors.

## JavaScript API

### Init signature

| option | type | default | description |
|---|---|---|---|
| trigger | HTMLElement \| string | via `aria-describedby` | Trigger element or selector |
| open | boolean | from `.is-open` | Initial visibility |

### Instance shape

```ts
{
  open(): void;
  close(): void;
  toggle(): void;
  destroy(): void;
}
```

### Events

| name | detail | when fired |
|---|---|---|
| — | — | No custom events |

### State attributes

| attribute | values | when applied |
|---|---|---|
| `hidden` | present/absent | Closed / open |
| `.is-open` | class | Open |

### Keyboard

| key | behavior |
|---|---|
| Escape | Close |

### SSR fallback

With `open` true, the tooltip renders visible; without JS, hover/focus show does not run.

## Figma source

- [Pattern / Tooltip `539:28418`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28418&m=dev)
- [`.Tooltip · spec` `4601:164`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4601-164&m=dev)
