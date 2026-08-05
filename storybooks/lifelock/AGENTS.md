# Agent instructions — LifeLock Design System

Package: `@aics/storybook-lifelock`. Self-contained library — consume this brand alone.

Storybook Docs are for humans. The **implementation contract** is the
machine-readable `/api` surface linked below.

## Brand base URL

Canonical absolute base for this library: `http://localhost:4173/lifelock/`

If you opened this file on a host, you may also derive the base by taking
the URL of `AGENTS.md` and stripping the trailing `AGENTS.md`. Prefer the
canonical base above when they differ.

## Mandatory flow

1. Read this file (`AGENTS.md`).
2. Fetch [`llms.txt`](./llms.txt)
   Absolute: `http://localhost:4173/lifelock/llms.txt`
3. Fetch [`/api/index.json`](./api/index.json), find the unit, then fetch
   `/api/<type>/<name>.json`
   (example: `http://localhost:4173/lifelock/api/components/accordion.json`).
4. **Copy source URLs only from that JSON.** Use the exact strings in
   `sourceFiles` and `specUrl`. Prefix each relative path (starting with
   `/`) with the brand base. Do **not** invent paths or extensions.
5. Implement from those files. Resolve token values from
   [`/api/tokens.json`](./api/tokens.json).
6. Serve icons from `/assets/icons/…` when the unit references them.

## Worked example — accordion `sourceFiles`

After fetching `http://localhost:4173/lifelock/api/components/accordion.json`, the manifest lists paths like
`/api/components/accordion/source/accordion.scss`. Absolute fetches:

- http://localhost:4173/lifelock/api/components/accordion/spec.md
- http://localhost:4173/lifelock/api/components/accordion/source/accordion.hbs
- http://localhost:4173/lifelock/api/components/accordion/source/accordion.scss
- http://localhost:4173/lifelock/api/components/accordion/source/accordion.js

Props / options are fields on the unit JSON itself — there is **no**
`source/*.config.json`.

## Hard rules

- **Never invent source URLs.** Forbidden guesses include `*.css` (styles
  are published as `.scss`), `*.config.json`, alternate folder layouts, or
  Docs “Show code” HTML as the implementation source.
- **Keep published BEM class names.** Do not rename (`__item-header` stays
  `__item-header`; never invent `__summary` / `__title` / `__icon`).
- **Match the HBS DOM tree.** Frameworks (React, etc.) may render the same
  markup; do not wrap items in shells that break `:scope > .c-*` selectors
  used by `init*` factories.
- **Behavior from published JS.** Call `init*` / `init*s` from `source/*.js`
  when that key exists in `sourceFiles`. Do not invent a parallel open-state
  machine from Docs prose.
- **Styles from published SCSS + tokens.** Do not hand-roll competing hex
  palettes or alternate class systems.
- **Docs / Show code are not enough.** Thin HTML in Docs is for preview;
  agents must open the files listed in `sourceFiles`.

## Quick links

- [README.md](./README.md)
- [llms.txt](./llms.txt)
- [api/index.json](./api/index.json)
- [api/tokens.json](./api/tokens.json)
- [llms-full.txt](./llms-full.txt)
- Storybook UI: http://localhost:4173/lifelock/
