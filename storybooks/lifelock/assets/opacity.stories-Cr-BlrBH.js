import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,c as n,d as r,i,l as a,n as o,o as s,r as c,s as l,u}from"./_spec-md-wF1y7HFP.js";var d;function f(){return(f=e((()=>{d='---\ntype: token\nname: opacity\nfigmaFileKey: Nshd9ukxIzpeUnzOXiWxUP\nfigmaNodeId: 18014:753\nstatus: published\nlastSyncedAt: ""\nlastSyncedFigmaFingerprint: ""\nlastSyncedSpecFingerprint: ""\nbrand: LifeLock\n---\n\n# Opacity tokens\n\n## Figma source\n\n- Canonical Foundations table (Web-ODS-Theme — Opacity): https://www.figma.com/design/Nshd9ukxIzpeUnzOXiWxUP/Web-ODS-Theme?node-id=18014-753&m=dev\n\n## Summary\n\nOpacity foundation as a primitive layer only — 13 opacity scalars (`opacity/{0,5,10,20,25,30,40,50,60,70,75,80,90}`) typed as Figma `Number` Variables with display format `PERCENT`. CSS exposes them as `--opacity-N`, mirrored verbatim in the sibling [`_opacity.scss`](./_opacity.scss). No semantic alias layer: the project pattern is **color + opacity layering**, where consumers compose `rgba(0, 0, 0, var(--opacity-N))` inline at the call site (or apply a separate `opacity` property where the host CSS allows it). There is no `color/alpha/*` rgba primitive layer anywhere in the design system.\n\nThe Figma variable group/name shape is **normalized away from the legacy two-segment shape `Opacity/Opacity-N`** (capital `O`, redundant `Opacity-` prefix) to a clean one-segment lowercase `opacity/N`.\n\n## Layered model\n\n```mermaid\ngraph LR\n  primOpacity["Primitive (opacity/*)"]\n  shadowConsumer["box-shadow consumer (CSS)"]\n  opacityProp["opacity property consumer (CSS)"]\n\n  primOpacity -.->|"composed inline"| shadowConsumer\n  primOpacity -.->|"applied directly"| opacityProp\n```\n\nCounts at a glance:\n\n- **13 primitives** (single value each, no per-mode override)\n- **0 semantic aliases** (project pattern: inline composition at the consumer)\n\n## Token values\n\n> **Figma type primer.** Each opacity primitive is a Figma `Number` Variable with display format `PERCENT`. The underlying stored value is a **decimal** (e.g. `0.05`); designers see `5%` in the Variables panel; CSS expresses the value as a literal percentage to match the project\'s existing `--opacity-N` shape.\n\n### Primitive — Opacity scalars (13, namespace `opacity/*`)\n\n| Figma name | Figma type | Value | CSS custom property | Notes |\n|---|---|---|---|---|\n| `opacity/0` | Number (Percent) | `0` (= 0%) | `--opacity-0` | — |\n| `opacity/5` | Number (Percent) | `0.05` (= 5%) | `--opacity-5` | — |\n| `opacity/10` | Number (Percent) | `0.1` (= 10%) | `--opacity-10` | consumed by shadow inline rgba (`rgba(0, 0, 0, var(--opacity-10))`) |\n| `opacity/20` | Number (Percent) | `0.2` (= 20%) | `--opacity-20` | — |\n| `opacity/25` | Number (Percent) | `0.25` (= 25%) | `--opacity-25` | quartile mixed into decadal scale |\n| `opacity/30` | Number (Percent) | `0.3` (= 30%) | `--opacity-30` | — |\n| `opacity/40` | Number (Percent) | `0.4` (= 40%) | `--opacity-40` | — |\n| `opacity/50` | Number (Percent) | `0.5` (= 50%) | `--opacity-50` | — |\n| `opacity/60` | Number (Percent) | `0.6` (= 60%) | `--opacity-60` | — |\n| `opacity/70` | Number (Percent) | `0.7` (= 70%) | `--opacity-70` | — |\n| `opacity/75` | Number (Percent) | `0.75` (= 75%) | `--opacity-75` | quartile mixed into decadal scale |\n| `opacity/80` | Number (Percent) | `0.8` (= 80%) | `--opacity-80` | — |\n| `opacity/90` | Number (Percent) | `0.9` (= 90%) | `--opacity-90` | — |\n\n**Deferred** (open as separate tickets when a component asks):\n\n- `opacity/15`, `opacity/35`, `opacity/45`, `opacity/55`, `opacity/65`, `opacity/85`, `opacity/95` — gap-fills for the decadal ramp. Not present in legacy.\n- `opacity/100` — opaque endpoint; CSS default `opacity` is `1`, and the most common case is to omit the property entirely. Token would be redundant. Not present in legacy.\n\n## CSS implementation pattern\n\n```css\n:root {\n  --opacity-0:  0%;\n  --opacity-5:  5%;\n  --opacity-10: 10%;\n  --opacity-20: 20%;\n  --opacity-25: 25%;\n  --opacity-30: 30%;\n  --opacity-40: 40%;\n  --opacity-50: 50%;\n  --opacity-60: 60%;\n  --opacity-70: 70%;\n  --opacity-75: 75%;\n  --opacity-80: 80%;\n  --opacity-90: 90%;\n}\n\n/* Consumption pattern A: applied directly to the CSS opacity property */\n.muted-state { opacity: var(--opacity-50); }\n\n/* Consumption pattern B: composed inline as the alpha channel of rgba() */\n.elevated  { box-shadow: 0 2px 8px rgba(0, 0, 0, var(--opacity-10)); }\n.scrim     { background: rgba(0, 0, 0, var(--opacity-50)); }\n```\n\nCanonical source on disk: `themes/default/_opacity.scss` (re-exported by `src/tokens/opacity/_opacity.scss`). Single theme — no per-mode overrides.\n\n## Design decisions\n\n1. **Stored as `Number (Percent)` in Figma; emitted as `%` in CSS** — the Figma Variable subtype is `Number` with display format `PERCENT`; the underlying stored value is a decimal (`0.05`); designers see `5%` in the Variables panel. CSS uses the project\'s percent-literal style (`5%`) to match `_tokens.scss`.\n2. **Quartile steps `25` and `75` mixed into a decadal scale preserved verbatim** — legacy interleaves `25 / 75` into an otherwise-decadal `0 / 5 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 / 90` ramp. Removing the quartiles would break any consumer already referencing them.\n3. **`opacity/100` opaque endpoint dropped** — CSS default `opacity` is `1`; the most common "fully opaque" case is to omit the property entirely. A token for the opaque endpoint would be redundant for the most common case.\n4. **No `color/alpha/*` rgba primitive layer** — the project pattern is **color + opacity layering**, not pre-mixed rgba primitives. `box-shadow` consumers compose rgba inline at the call site: `rgba(0, 0, 0, var(--opacity-N))`. This decision is shared with `colors.md` and `shadow.md`.\n5. **No semantic alias layer** — opacity scalars don\'t carry role intent on their own; they\'re modulators applied to a base color or element. A `--opacity-disabled` style alias would just be a renamed primitive with no extra information.\n6. **All tokens single-value** — no per-mode overrides anywhere.\n7. **Figma variable group/name shape normalized: `Opacity/Opacity-N` → `opacity/N`** — legacy uses a two-segment shape with capital `O` and a redundant `Opacity-` prefix, plus internal inconsistency on the zero entry (variable name `Opacity-00` vs display label `Opacity-0`). Normalized to one-segment lowercase `opacity/N` because every other primitive group in the system is one-segment lowercase (`color/primary/<name>`, `radius/N`, `border-width/N`, `space/N`, `shadow/{x,y,blur,spread}/N`). The normalization automatically resolves the legacy zero-padding inconsistency.\n'})))()}function p(e,t,n){let r=t.findIndex(e=>e.trim()===n);return r===-1?null:e[r]}function m(e,t){let r=p(e,t,`CSS custom property`),o=p(e,t,`Value`),l=p(e,t,`Notes`),u=p(e,t,`Figma name`),d=n(r),f=(d?c(d):null)||a(o)||`0`;return`
    <figure class="opacity-figure">
      <div class="opacity-figure__swatch" style="opacity: ${f};"></div>
      <div class="opacity-figure__token">${s(r||u)}</div>
      <div class="opacity-figure__value">${i(f)}</div>
      ${l&&l!==`—`?`<div class="opacity-figure__notes">${s(l)}</div>`:``}
    </figure>
  `}function h({subsection:e,table:t}){return e&&/Opacity scalars/i.test(e)?`
      ${_}
      <div class="opacity-grid">
        ${t.rows.map(e=>m(e,t.headers)).join(``)}
      </div>
    `:null}var g,_,v,y,b;function x(){return(x=e((()=>{t(),r(),f(),g=o(d),_=`
<style>
.opacity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}
.opacity-figure {
  margin: 0;
  border: 1px solid var(--color-border-subtle, rgba(0,0,0,0.10));
  border-radius: 8px;
  padding: 12px;
  background:
    repeating-conic-gradient(rgba(0,0,0,0.06) 0% 25%, transparent 0% 50%) 0 0 / 16px 16px,
    var(--color-canvas-default, #fff);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}
.opacity-figure__swatch {
  width: 96px;
  height: 96px;
  border-radius: 8px;
  background-color: var(--color-text-brand, #108389);
}
.opacity-figure__token {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-text-primary, #181818);
}
.opacity-figure__value {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
  color: var(--color-text-secondary, rgba(0,0,0,0.60));
  font-variant-numeric: tabular-nums;
}
.opacity-figure__notes {
  font-size: 11px;
  color: var(--color-text-secondary, rgba(0,0,0,0.55));
  line-height: 1.4;
}
</style>
`,v={title:`Design System/Opacity`,parameters:{contentWidth:`fluid`,design:u(g.frontmatter.figmaNodeId||`18014:753`),docs:{description:{component:"Opacity primitives sourced from `storybook-lifelock/src/tokens/opacity/spec.md`. The `## Token values` table renders as a transparency-swatch grid (brand colour overlaid on a chequerboard); every other spec.md section renders as authored."}}}},y={name:`Opacity`,render:()=>l({storySpec:g,tableHook:h})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'Opacity',
  render: () => renderSpecGallery({
    storySpec: SPEC,
    tableHook
  })
}`,...y.parameters?.docs?.source}}},b=[`Default`]})))()}x();export{y as Default,b as __namedExportsOrder,v as default};