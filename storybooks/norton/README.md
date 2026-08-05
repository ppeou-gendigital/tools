# Norton Design System

Standalone component and token library (`@aics/storybook-norton`).

## For AI agents

Start with **[AGENTS.md](./AGENTS.md)** (mandatory rules), then:

1. [llms.txt](./llms.txt)
2. [api/index.json](./api/index.json)
3. Per-unit `/api/<type>/<name>.json` — copy **only** `sourceFiles` / `specUrl`
   (do not invent `.css` or `*.config.json` paths)
4. [api/tokens.json](./api/tokens.json)

Absolute brand base: `http://localhost:4173/norton/`

## For humans

- Open the Storybook UI: http://localhost:4173/norton/
- Browse **Introduction**, **Design System**, and **Molecules / Patterns**.
- Machine-readable sources stay under `/api/` and `/llms.txt`.
