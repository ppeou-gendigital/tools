import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,r as n}from"./figma-links-DrHwXaYQ.js";import{a as r,c as i,i as a,l as o,n as s,o as c,r as l,s as u}from"./_spec-md-xTOD2TWI.js";var d;function f(){return(f=e((()=>{d='---\ntype: token\nname: borders\nfigmaFileKey: Nshd9ukxIzpeUnzOXiWxUP\nfigmaNodeId: 18014:752\nstatus: published\nlastSyncedAt: "2026-07-31T00:00:00Z"\nlastSyncedFigmaFingerprint: ""\nlastSyncedSpecFingerprint: ""\nbrand: LifeLock\n---\n\n# Border tokens\n\n## Figma source\n\n- Canonical design-system Figma (Web-ODS-Theme — Borders): https://www.figma.com/design/Nshd9ukxIzpeUnzOXiWxUP/Web-ODS-Theme?node-id=18014-752&m=dev\n\n## Summary\n\nBorder foundation covering **two families** (radius + width). The canonical CSS surface matches the Figma Foundations size scale on Web-ODS-Theme node `18014:752` — `border-radius-{0,xs,s,m,l,xl,xxl,xxxl}` and `border-width-{0,xs,s,m,l,xl}`. Values are shared across brands via `themes/default/_borders.scss` and the multi-brand contract.\n\nCounts at a glance:\n\n- **8 radius scale tokens** — `0 / xs / s / m / l / xl / xxl / xxxl`\n- **6 width scale tokens** — `0 / xs / s / m / l / xl`\n- **14 contract tokens total**\n- Plus **compat role aliases** (not in contract) for older component CSS: `control` / `card` / `dialog` / `pill` and `none` / `hairline` / `default` / `emphasis` / `focus`\n\n## Layered model\n\n```mermaid\ngraph LR\n  figmaScale["Figma Foundations table 18014:752"]\n  cssScale["CSS --border-radius-* / --border-width-* scale"]\n  roleAlias["Compat role aliases → scale"]\n  figmaScale --> cssScale\n  cssScale --> roleAlias\n```\n\n## Token values\n\n### Border radius — size scale (8)\n\n| Figma name | Value | CSS custom property | Notes |\n|---|---|---|---|\n| `border-radius-0` | `0` | `--border-radius-0` | sharp corners |\n| `border-radius-xs` | `2px` | `--border-radius-xs` | |\n| `border-radius-s` | `4px` | `--border-radius-s` | |\n| `border-radius-m` | `6px` | `--border-radius-m` | |\n| `border-radius-l` | `8px` | `--border-radius-l` | |\n| `border-radius-xl` | `16px` | `--border-radius-xl` | |\n| `border-radius-xxl` | `24px` | `--border-radius-xxl` | |\n| `border-radius-xxxl` | `30px` | `--border-radius-xxxl` | Used for button focus state only (Figma note) |\n\n### Border width — size scale (6)\n\n| Figma name | Value | CSS custom property | Notes |\n|---|---|---|---|\n| `border-width-0` | `0` | `--border-width-0` | |\n| `border-width-xs` | `1px` | `--border-width-xs` | |\n| `border-width-s` | `2px` | `--border-width-s` | |\n| `border-width-m` | `4px` | `--border-width-m` | |\n| `border-width-l` | `6px` | `--border-width-l` | |\n| `border-width-xl` | `8px` | `--border-width-xl` | |\n\n### Compat role aliases (theme-only, not in contract)\n\n| Alias | Resolves to |\n|---|---|\n| `--border-radius-control` | `var(--border-radius-s)` |\n| `--border-radius-card` | `var(--border-radius-l)` |\n| `--border-radius-dialog` | `var(--border-radius-xl)` |\n| `--border-radius-pill` | `9999px` |\n| `--border-width-none` | `var(--border-width-0)` |\n| `--border-width-hairline` | `var(--border-width-xs)` |\n| `--border-width-default` | `var(--border-width-s)` |\n| `--border-width-emphasis` | `var(--border-width-m)` |\n| `--border-width-focus` | `var(--border-width-m)` |\n\n## CSS implementation pattern\n\n```css\n:root {\n  --border-radius-0: 0;\n  --border-radius-xs: 2px;\n  --border-radius-s: 4px;\n  --border-radius-m: 6px;\n  --border-radius-l: 8px;\n  --border-radius-xl: 16px;\n  --border-radius-xxl: 24px;\n  --border-radius-xxxl: 30px;\n\n  --border-width-0: 0;\n  --border-width-xs: 1px;\n  --border-width-s: 2px;\n  --border-width-m: 4px;\n  --border-width-l: 6px;\n  --border-width-xl: 8px;\n}\n```\n\nCanonical source on disk: `themes/default/_borders.scss` (re-exported by `src/tokens/borders/_borders.scss`).\n\n## Design decisions\n\n1. **Figma Foundations table is canonical** — CSS token names match the doc-page captions (`border-radius-s`, not a separate role vocabulary).\n2. **Radius ramp `0 → 2 → 4 → 6 → 8 → 16 → 24 → 30`** preserved verbatim from Figma, including the uneven 8 → 16 jump and `xxxl = 30` (button focus only).\n3. **Width ramp `0 → 1 → 2 → 4 → 6 → 8`** preserved verbatim; odd-px steps are not in Figma.\n4. **Role aliases kept as compat** — older LifeLock components still reference `--border-radius-control` etc.; those alias onto the Figma scale (or `9999px` for pill).\n5. **Shared across brands** — white-label / Norton / AVG / LifeLock ship the same scale values.\n6. **All tokens single-value** — no per-mode overrides.\n'})))()}function p(e,t){let n=h(e,t,`Value`),r=h(e,t,`CSS custom property`),s=h(e,t,`Notes`),u=h(e,t,`Figma name`),d=i(r),f=d?l(d):null,p=f&&f!==`0`?f:o(n)||`—`;return`
    <figure class="borders-figure">
      <div class="borders-figure__demo borders-figure__demo--radius" style="border-radius: ${p};"></div>
      <div class="borders-figure__token">${c(r||u)}</div>
      <div class="borders-figure__value">${a(p)}</div>
      ${s?`<div class="borders-figure__notes">${c(s)}</div>`:``}
    </figure>
  `}function m(e,t){let n=h(e,t,`Value`),r=h(e,t,`CSS custom property`),s=h(e,t,`Notes`),u=h(e,t,`Figma name`),d=i(r),f=(d?l(d):null)||o(n)||`0`;return`
    <figure class="borders-figure">
      <div class="borders-figure__demo borders-figure__demo--width" style="border-width: ${f===`0`||f===`0px`?`0`:f}; ${f===`0`||f===`0px`?`outline: 1px dashed var(--color-border-subtle, rgba(0,0,0,0.30)); outline-offset: -1px;`:``}"></div>
      <div class="borders-figure__token">${c(r||u)}</div>
      <div class="borders-figure__value">${a(f)}</div>
      ${s?`<div class="borders-figure__notes">${c(s)}</div>`:``}
    </figure>
  `}function h(e,t,n){let r=t.findIndex(e=>e.trim()===n);return r===-1?null:e[r]}function g({subsection:e,table:t}){return e?/^Border radius/i.test(e)?`
      ${v}
      <div class="borders-grid">
        ${t.rows.map(e=>p(e,t.headers)).join(``)}
      </div>
    `:/^Border width/i.test(e)?`
      ${v}
      <div class="borders-grid">
        ${t.rows.map(e=>m(e,t.headers)).join(``)}
      </div>
    `:null:null}var _,v,y,b,x;function S(){return(S=e((()=>{r(),t(),f(),_=s(d),v=`
<style>
.borders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}
.borders-figure {
  margin: 0;
  border: 1px solid var(--color-border-subtle, rgba(0,0,0,0.10));
  border-radius: 8px;
  padding: 16px;
  background: var(--color-canvas-default, #fff);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}
.borders-figure__demo {
  width: 96px;
  height: 96px;
  background: var(--color-bg-subtle, #eef);
}
.borders-figure__demo--radius {
  background: var(--color-mist-blue, #cce5e7);
  border: 1px solid var(--color-border-brand, #108389);
}
.borders-figure__demo--width {
  background: var(--color-canvas-default, #fff);
  border-style: solid;
  border-color: var(--color-border-brand, #108389);
}
.borders-figure__token {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-text-primary, #181818);
  word-break: break-all;
}
.borders-figure__value {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-secondary, rgba(0,0,0,0.55));
}
.borders-figure__notes {
  font-size: 12px;
  color: var(--color-text-secondary, rgba(0,0,0,0.55));
  line-height: 1.4;
}
</style>
`,y={title:`Design System/Borders`,parameters:{contentWidth:`fluid`,design:n(_.frontmatter.figmaNodeId||`18014:752`),docs:{description:{component:"Border foundation (radii + widths) sourced from `storybook-lifelock/src/tokens/borders/spec.md`. The gallery walks every required H2 section in spec order; each `## Token values` sub-table renders as a visual swatch grid, every other section renders as authored."}}}},b={name:`Borders`,render:()=>u({storySpec:_,tableHook:g})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'Borders',
  render: () => renderSpecGallery({
    storySpec: SPEC,
    tableHook
  })
}`,...b.parameters?.docs?.source}}},x=[`Default`]})))()}S();export{b as Default,x as __namedExportsOrder,y as default};