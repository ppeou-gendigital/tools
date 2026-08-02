# AICS composed Storybooks (static)

Prebuilt static site from the aics-spike monorepo. No Node build on this branch.

## Live URLs

After Pages is enabled (Settings → Pages → Deploy from branch → **`gh-pages`** / root):

| Path | Contents |
|---|---|
| https://ppeou-gendigital.github.io/tools/aics/ | Core / white-label hub |
| https://ppeou-gendigital.github.io/tools/aics/norton/ | Norton brand Storybook |
| https://ppeou-gendigital.github.io/tools/aics/lifelock/ | LifeLock brand Storybook |
| https://ppeou-gendigital.github.io/tools/aics/avg/ | AVG brand Storybook |
| https://ppeou-gendigital.github.io/tools/aics/avast/ | Avast brand Storybook |

AI entry (per brand): `…/<brand>/llms.txt` → `…/<brand>/api/index.json`.

## Refresh from aics-spike

Asset bases are baked as `/tools/aics/`. Rebuild and re-copy whenever the spike changes:

```bash
# in aics-spike
STORYBOOK_SITE_BASE=/tools/aics/ npm run build:storybooks

rm -rf /Users/Piseth.Peou/gengit/aics/storybooks
mkdir -p /Users/Piseth.Peou/gengit/aics/storybooks
cp -R dist/storybooks/. /Users/Piseth.Peou/gengit/aics/storybooks/
# restore this README if the copy wiped it, or copy into a temp dir first
```

Then commit and push the `aics` branch. The workflow
[`.github/workflows/deploy-storybooks-pages.yml`](../.github/workflows/deploy-storybooks-pages.yml)
publishes `storybooks/` → `gh-pages/aics/`.
