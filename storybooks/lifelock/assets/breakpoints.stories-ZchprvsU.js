import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,r as n}from"./figma-links-DrHwXaYQ.js";import{a as r,c as i,i as a,l as o,n as s,o as c,r as l,s as u}from"./_spec-md-xTOD2TWI.js";import"./_grid-a75DW6jA.js";var d;function f(){return(f=e((()=>{d='---\ntype: token\nname: breakpoints\nfigmaFileKey: Nshd9ukxIzpeUnzOXiWxUP\nfigmaNodeId: 0:31\nstatus: published\nlastSyncedAt: ""\nlastSyncedFigmaFingerprint: ""\nlastSyncedSpecFingerprint: ""\nbrand: LifeLock\n---\n\n# Breakpoints tokens\n\n## Summary\n\nFour mutually-exclusive viewport bands — SM, MD, LG, XL — each owning a closed media-query range. The canonical viewport per band is the single representative width used by the Storybook viewport addon and Figma canvas frames. Encoded as primitive Figma `Number` Variables (`breakpoint/<bp>`) and CSS custom properties (`--breakpoint-<bp>`).\n\nThe breakpoints unit owns **only** the band thresholds and the four `--breakpoint-*` tokens. Every other responsive value (column counts, gutters, margins, container widths, derived column widths) lives in [`tokens/grid/spec.md`](../grid/spec.md).\n\n## Breakpoint bands and media queries\n\nRange-bounded, non-overlapping queries — each band targets exactly one viewport range, no cascading overrides between bands.\n\n| Band | Media query | Canonical viewport |\n|------|-------------|--------------------|\n| SM | `@media (max-width: 767px) {}` | 360 |\n| MD | `@media (min-width: 768px) and (max-width: 1023px) {}` | 768 |\n| LG | `@media (min-width: 1024px) and (max-width: 1439px) {}` | 1024 |\n| XL | `@media (min-width: 1440px) {}` | 1440 |\n\nBands are mutually exclusive — exactly one band matches at any given viewport. Each band declares its layout module from scratch; there is no mobile-first cascade between bands. The **canonical viewport** is the single representative width per band used by the Storybook viewport addon and Figma canvas frames. For MD/LG/XL it equals the band\'s lower threshold; for SM the canonical is 360 (the supported mobile floor) even though the SM band has no CSS lower bound.\n\n> **Mixin layer.** Component / layout SCSS never writes raw `@media (...)` queries. Use the breakpoint mixins from the sibling [`_breakpoints.scss`](./_breakpoints.scss) (`@include sm { ... }`, `@include md { ... }`, etc.) — mixin names map 1:1 to the bands above. The literal media queries above show the underlying spec.\n\n## Token values\n\n> **Figma type primer.** Stored as Figma `Number` Variables. Px-valued tokens carry a length, but Figma has no native length-with-unit type — the consumer (CSS layer / Figma constraint binding) treats the `Number` as px.\n\n### Breakpoint thresholds\n\n| Value | Figma name | Figma type | CSS custom property | Notes |\n|---|---|---|---|---|\n| 360 | `breakpoint/sm` (Primitive) | Number | `--breakpoint-sm` | dual-purpose: SM canonical viewport; SM band has no CSS lower bound (uses `max-width: 767px`) |\n| 768 | `breakpoint/md` (Primitive) | Number | `--breakpoint-md` | dual-purpose: MD media-query lower threshold AND canonical viewport |\n| 1024 | `breakpoint/lg` (Primitive) | Number | `--breakpoint-lg` | dual-purpose: LG media-query lower threshold AND canonical viewport |\n| 1440 | `breakpoint/xl` (Primitive) | Number | `--breakpoint-xl` | dual-purpose: XL media-query lower threshold AND canonical viewport |\n\n## CSS implementation pattern\n\n```css\n:root {\n  --breakpoint-sm: 360px;\n  --breakpoint-md: 768px;\n  --breakpoint-lg: 1024px;\n  --breakpoint-xl: 1440px;\n}\n```\n\nThe four `--breakpoint-*` custom properties are **documentation values** consumed by JavaScript / gallery code that needs to read the band thresholds (e.g. the Design System / Breakpoints gallery). CSS variables cannot be used inside `@media` conditions, so SCSS `_breakpoints.scss` mixins compile against literal Sass values that mirror these tokens 1:1.\n\n## Storybook canonical viewports\n\nFour named viewports register with the Storybook viewport addon (per [`storybook-conventions.mdc`](../../../../.cursor/rules/storybook-conventions.mdc) § "Viewport presets are mandatory"):\n\n- `sm` — 360 × 740\n- `md` — 768 × 1024\n- `lg` — 1024 × 768\n- `xl` — 1440 × 900\n\nWidths match the breakpoint token values. Adding `xs` / `xxl` requires updating the sibling [`_breakpoints.scss`](./_breakpoints.scss), the matching `--breakpoint-*` custom properties in [`../grid/_grid.scss`](../grid/_grid.scss), the band-range tables in this `spec.md`, and [`storybook-lifelock/.storybook/preview.js`](../../../.storybook/preview.js) in the same sync. The story consumes those values directly from this `spec.md` at render time.\n\n## Design decisions\n\n1. **Range-bounded media queries.** No mobile-first cascade. Each band is a self-contained `@media` block accessed via the breakpoint mixins in `_breakpoints.scss`.\n2. **Canonical viewport ≠ band lower bound for SM.** The SM band has no CSS lower bound (it uses `max-width: 767px`), but its canonical viewport is 360 px — the supported mobile floor. Below 360 px, behaviour is best-effort.\n3. **Mixin names map 1:1 to bands.** `@include sm` matches viewports ≤ 767 px **only** (not "≥ 360 px"). The cascading `min-width` style is intentionally not provided.\n'})))()}function p(e,t,n){let r=t.findIndex(e=>e.trim()===n);return r===-1?null:e[r]}function m(e){for(let[t,{min:n,max:r}]of Object.entries(x))if(e>=n&&e<=r)return t;return null}function h(e){if(!e)return null;let t=/--breakpoint-(sm|md|lg|xl)/.exec(e);return t?t[1]:null}function g(e){let t=typeof window>`u`?0:window.innerWidth,n=m(t),r=[`Band`,`Media query`,`Canonical viewport`,`CSS custom property`,`Live value`],s=e.rows.map(t=>{let r=p(t,e.headers,`CSS custom property`),s=p(t,e.headers,`Figma name`),u=p(t,e.headers,`Value`);p(t,e.headers,`Notes`);let d=i(r),f=h(d),m=d?l(d):null,g=f?_(f):`—`,v=f?f.toUpperCase():s||`—`,y=o(u)||`—`,b=m||`—`;return`
      <tr class="${f===n?`is-active`:``}">
        <td class="breakpoints-table__band">${a(v)}</td>
        <td class="breakpoints-table__media"><code>${a(g)}</code></td>
        <td class="breakpoints-table__value">${a(y)}</td>
        <td class="breakpoints-table__media">${c(r||s||`—`)}</td>
        <td class="breakpoints-table__value">${a(b)}</td>
      </tr>
    `}).join(``),u=t||`?`,d=n?n.toUpperCase():`unknown`;return`
    ${b}
    <div class="breakpoints-active">
      <span class="breakpoints-active__label">Active viewport:</span>
      <span class="breakpoints-active__value">${a(String(u))} px</span>
      <span class="breakpoints-active__label">→</span>
      <span class="breakpoints-active__value">${a(d)}</span>
    </div>
    <table class="breakpoints-table">
      <thead><tr>${r.map(e=>`<th>${e}</th>`).join(``)}</tr></thead>
      <tbody>${s}</tbody>
    </table>
  `}function _(e){switch(e){case`sm`:return`@media (max-width: 767px)`;case`md`:return`@media (min-width: 768px) and (max-width: 1023px)`;case`lg`:return`@media (min-width: 1024px) and (max-width: 1439px)`;case`xl`:return`@media (min-width: 1440px)`;default:return`—`}}function v({subsection:e,table:t}){return e&&/^Breakpoint thresholds/i.test(e)?g(t):null}var y,b,x,S,C,w;function T(){return(T=e((()=>{r(),t(),f(),y=s(d),b=`
<style>
.breakpoints-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-body-sm, 14px);
  line-height: 1.5;
}
.breakpoints-table th {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 2px solid var(--color-border-subtle, rgba(0,0,0,0.18));
  background: var(--color-bg-subtle, rgba(0,0,0,0.03));
  font-weight: var(--font-weight-bold, 700);
}
.breakpoints-table td {
  padding: 12px;
  border-bottom: 1px solid var(--color-border-subtle, rgba(0,0,0,0.10));
  vertical-align: top;
}
.breakpoints-table tbody tr.is-active td {
  background: var(--color-mist-blue, #cce5e7);
}
.breakpoints-table tbody tr.is-active td:first-child {
  border-left: 4px solid var(--color-text-brand, #108389);
  padding-left: 8px;
}
.breakpoints-table__band {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-weight: var(--font-weight-bold, 700);
}
.breakpoints-table__media {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
  color: var(--color-text-secondary, rgba(0,0,0,0.65));
}
.breakpoints-table__value {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-variant-numeric: tabular-nums;
}
.breakpoints-active {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  margin-bottom: 8px;
  background: var(--color-canvas-subtle, #f6f6f4);
  border: 1px dashed var(--color-border-subtle, rgba(0,0,0,0.20));
  border-radius: 6px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
}
.breakpoints-active__label {
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-text-secondary, rgba(0,0,0,0.65));
}
.breakpoints-active__value {
  color: var(--color-text-primary, #181818);
  font-variant-numeric: tabular-nums;
}
</style>
`,x={sm:{min:0,max:767},md:{min:768,max:1023},lg:{min:1024,max:1439},xl:{min:1440,max:1/0}},S={title:`Design System/Breakpoints`,parameters:{contentWidth:`fluid`,design:n(y.frontmatter.figmaNodeId||`0:31`),docs:{description:{component:"Breakpoint thresholds (4 mutually-exclusive bands) sourced from `storybook-lifelock/src/tokens/breakpoints/spec.md`. The `## Token values` table renders with the active band highlighted in brand colour based on the live Storybook viewport width."}}}},C={name:`Breakpoints`,render:()=>u({storySpec:y,tableHook:v})},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'Breakpoints',
  render: () => renderSpecGallery({
    storySpec: SPEC,
    tableHook
  })
}`,...C.parameters?.docs?.source}}},w=[`Default`]})))()}T();export{C as Default,w as __namedExportsOrder,S as default};