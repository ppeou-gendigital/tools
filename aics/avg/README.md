# AVG Design System

Standalone component and token library (`@aics/storybook-avg`).

## For AI agents

Start with **[AGENTS.md](./AGENTS.md)** (mandatory rules), then:

1. [llms.txt](./llms.txt)
2. [api/index.json](./api/index.json)
3. Per-unit `/api/<type>/<name>.json` → `source/*` + [api/tokens.json](./api/tokens.json)

Absolute base (when not already on this host): `http://localhost:4173/avg/`

## For humans

- Open the Storybook UI: http://localhost:4173/avg/
- Browse **Introduction**, **Design System**, and **Molecules / Patterns**.
- Machine-readable sources stay under `/api/` and `/llms.txt`.
