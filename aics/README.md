# Storybook hub (core / white-label)

Compose landing for active brand Storybooks. Core ships white-label units and
themes; **AI agents should consume a brand package**, not this hub.

## For AI agents

Start at **[AGENTS.md](./AGENTS.md)** — it routes you to the correct brand
`AGENTS.md` → `llms.txt` → `/api`.

## Brand libraries

| Brand | Local compose | GitHub Pages (example) |
|---|---|---|
| LifeLock | [lifelock/](./lifelock/) | `…/lifelock/` |
| Norton | [norton/](./norton/) | `…/norton/` |
| AVG | [avg/](./avg/) | `…/avg/` |
| Avast | [avast/](./avast/) | `…/avast/` |

Each brand serves `/AGENTS.md`, `/README.md`, `/llms.txt`, and `/api/*`.

## Humans

Open the Storybook UI for a brand (sidebar **Introduction**) or use the
composed hub links above after `npm run build:storybooks` +
`npm run preview:storybooks`.
