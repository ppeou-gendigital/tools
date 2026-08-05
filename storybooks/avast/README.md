# Avast Design System

Standalone component and token library (`@aics/storybook-avast`).

## For AI agents

Start with **[AGENTS.md](./AGENTS.md)** (mandatory rules), then:

1. [llms.txt](./llms.txt)
2. [api/index.json](./api/index.json)
3. Per-unit `/api/<type>/<name>.json` — copy **only** `sourceFiles` / `specUrl`
   (do not invent `.css` or `*.config.json` paths)
4. [api/tokens.json](./api/tokens.json)

Absolute brand base: `https://ppeou-gendigital.github.io/tools/aics/avast/`

## For humans

- Open the Storybook UI: https://ppeou-gendigital.github.io/tools/aics/avast/
- Browse **Introduction**, **Design System**, and **Molecules / Patterns**.
- Machine-readable sources stay under `/api/` and `/llms.txt`.
