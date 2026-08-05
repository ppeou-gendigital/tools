import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./contract-DD6QebcQ.js";function r(e){return typeof document>`u`?``:getComputedStyle(document.documentElement).getPropertyValue(e).trim()}function i(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function a(){return(n.tokens||[]).filter(e=>e?.category===`space`&&typeof e.name==`string`).map(e=>e.name).sort((e,t)=>Number(e.replace(`--space-`,``))-Number(t.replace(`--space-`,``)))}function o(e){if(!e||e===`0`)return 0;let t=parseFloat(e);return Number.isFinite(t)?t:0}function s(e){let t=r(e)||`—`,n=o(t),a=Math.min(100,n/120*100);return`
    <div class="spacing-row">
      <span class="spacing-row__token">${i(e)}</span>
      <span class="spacing-row__value">${i(t)}</span>
      <div class="spacing-row__bar-wrap">
        <div class="spacing-row__bar" style="width: ${a}%;"></div>
      </div>
    </div>`}function c(e={}){let t=e.brandLabel||`White Label`,n=a();return`
${l}
<section class="spacing-gallery">
  <p class="spacing-gallery__intro">
    <strong>${i(t)} spacing</strong> — index ladder from
    <code>themes/contract.yaml</code> (Web-ODS-Theme <code>18014:755</code>).
    Values from this package’s <code>themes/default/_spacing.scss</code>.
  </p>
  <div class="spacing-list">
    ${n.map(s).join(`
`)}
  </div>
</section>`}var l;function u(){return(u=e((()=>{t(),l=`
<style>
.spacing-gallery { padding: 24px; color: var(--color-text-primary, #1a1a1a); background: var(--color-bg-subtle, #f8f8f7); }
.spacing-gallery__intro { margin: 0 0 24px; max-width: 64ch; line-height: 1.5; }
.spacing-gallery__intro code { font-size: 0.9em; }
.spacing-list { display: flex; flex-direction: column; gap: 8px; }
.spacing-row {
  display: grid;
  grid-template-columns: minmax(120px, 160px) 64px 1fr;
  gap: 12px;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 6px;
  background: #fff;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
}
.spacing-row__token { font-weight: 600; word-break: break-all; color: #181818; }
.spacing-row__value { font-variant-numeric: tabular-nums; color: rgba(0,0,0,0.65); }
.spacing-row__bar-wrap {
  height: 16px;
  background: var(--color-bg-subtle, #f0f0ef);
  border-radius: 4px;
  overflow: hidden;
}
.spacing-row__bar {
  height: 100%;
  background: var(--color-border-brand, #108389);
  min-width: 0;
}
</style>
`})))()}var d,f,p;function m(){return(m=e((()=>{u(),d={title:`Design System/Spacing`,parameters:{docs:{description:{component:"Contract-driven spacing gallery (Figma Web-ODS-Theme 18014:755). Index ladder `--space-0`…`--space-20` from `themes/contract.yaml`; values from `themes/default/_spacing.scss`."}}}},f={name:`Spacing`,render:()=>c({brandLabel:`White Label`})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Spacing',
  render: () => renderSpacingGallery({
    brandLabel: 'White Label'
  })
}`,...f.parameters?.docs?.source}}},p=[`Default`]})))()}m();export{f as Default,p as __namedExportsOrder,d as default};