# Agent instructions — Storybook hub

This URL is the **multi-brand compose hub** (`storybook-core`). It is **not**
a design-system consumption surface for implementing UI.

## What to do

1. Pick **one** brand library below.
2. Open that brand’s **`AGENTS.md`** and follow it end-to-end.
3. Implement from that brand’s `/api/.../source/*` + `/api/tokens.json`.

Do **not** invent components from this hub’s Docs alone, and do **not** mix
tokens or sources across brands.

## Brand libraries (agent entrypoints)

Relative paths work on the composed preview (`/` + brand segment). Prefer
absolute URLs when your workspace is not already on this host.

| Brand | AGENTS.md | llms.txt | API index |
|---|---|---|---|
| LifeLock | [lifelock/AGENTS.md](./lifelock/AGENTS.md) | [lifelock/llms.txt](./lifelock/llms.txt) | [lifelock/api/index.json](./lifelock/api/index.json) |
| Norton | [norton/AGENTS.md](./norton/AGENTS.md) | [norton/llms.txt](./norton/llms.txt) | [norton/api/index.json](./norton/api/index.json) |
| AVG | [avg/AGENTS.md](./avg/AGENTS.md) | [avg/llms.txt](./avg/llms.txt) | [avg/api/index.json](./avg/api/index.json) |
| Avast | [avast/AGENTS.md](./avast/AGENTS.md) | [avast/llms.txt](./avast/llms.txt) | [avast/api/index.json](./avast/api/index.json) |

Also see [README.md](./README.md) on this hub.
