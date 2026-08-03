# Agent instructions — Avast Design System

Package: `@aics/storybook-avast`. Self-contained library — consume this brand alone.

Storybook Docs are for humans. The **implementation contract** is the
machine-readable `/api` surface linked below.

## Mandatory flow

1. Read this file (`AGENTS.md`).
2. Fetch the registry pointer: [`llms.txt`](./llms.txt)
   Absolute: `http://localhost:4173/avast/llms.txt`
3. Fetch [`/api/index.json`](./api/index.json) then
   `/api/<type>/<name>.json` for the unit you need
   (example: `http://localhost:4173/avast/api/components/accordion.json`).
4. Implement from that manifest’s `sourceFiles`:
   - `source/<name>.hbs` — DOM structure and BEM classes
   - `source/<name>.scss` — styles (token-backed)
   - `source/<name>.js` — progressive-enhancement `init*` (when present)
5. Resolve values from [`/api/tokens.json`](./api/tokens.json).
6. Serve icons from `/assets/icons/…` when the unit references them.

## Hard rules

- **Keep published BEM class names.** Do not rename (`__item-header` stays
  `__item-header`; never invent `__summary` / `__title` / `__icon`).
- **Match the HBS DOM tree.** Frameworks (React, etc.) may render the same
  markup; do not wrap items in shells that break `:scope > .c-*` selectors
  used by `init*` factories.
- **Behavior from published JS.** Call `init*` / `init*s` from `source/*.js`.
  Do not invent a parallel open-state machine from Docs prose.
- **Styles from published SCSS + tokens.** Do not hand-roll competing hex
  palettes or alternate class systems.
- **Absolute URLs outside this host.** Relative `/api/...` only works on
  this Storybook origin. From a consumer app or another workspace, prefix
  with `http://localhost:4173/avast/`.
- **Docs / Show code are not enough.** Thin HTML in Docs is for preview;
  agents must open `source/*` files.

## Quick links

- [README.md](./README.md)
- [llms.txt](./llms.txt)
- [api/index.json](./api/index.json)
- [api/tokens.json](./api/tokens.json)
- [llms-full.txt](./llms-full.txt)
- Storybook UI: http://localhost:4173/avast/
