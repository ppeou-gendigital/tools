import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./contract-Ds37F3hF.js";function r(e){return typeof document>`u`?``:getComputedStyle(document.documentElement).getPropertyValue(e).trim()}function i(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function a(){return(n.tokens||[]).filter(e=>e?.category===`opacity`&&typeof e.name==`string`).map(e=>e.name).sort((e,t)=>Number(e.replace(`--opacity-`,``))-Number(t.replace(`--opacity-`,``)))}function o(e){let t=r(e)||`—`;return`
    <figure class="opacity-card">
      <div class="opacity-card__demo">
        <div class="opacity-card__swatch" style="opacity: var(${i(e)});"></div>
      </div>
      <figcaption class="opacity-card__meta">
        <span class="opacity-card__token">${i(e)}</span>
        <span class="opacity-card__value">${i(t)}</span>
      </figcaption>
    </figure>`}function s(e={}){let t=e.brandLabel||`White Label`,n=a();return`
${c}
<section class="opacity-gallery">
  <p class="opacity-gallery__intro">
    <strong>${i(t)} opacity</strong> — percent scale from
    <code>themes/contract.yaml</code> (Web-ODS-Theme <code>18014:753</code>).
    Values from this package’s <code>themes/default/_opacity.scss</code>.
  </p>
  <div class="opacity-grid">
    ${n.map(o).join(`
`)}
  </div>
</section>`}var c;function l(){return(l=e((()=>{t(),c=`
<style>
.opacity-gallery { padding: 24px; color: var(--color-text-primary, #1a1a1a); background: var(--color-bg-subtle, #f8f8f7); }
.opacity-gallery__intro { margin: 0 0 24px; max-width: 64ch; line-height: 1.5; }
.opacity-gallery__intro code { font-size: 0.9em; }
.opacity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}
.opacity-card {
  border: 1px solid var(--color-border-subtle, rgba(0,0,0,0.12));
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.opacity-card__demo {
  min-height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background:
    linear-gradient(45deg, #ddd 25%, transparent 25%),
    linear-gradient(-45deg, #ddd 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ddd 75%),
    linear-gradient(-45deg, transparent 75%, #ddd 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0;
}
.opacity-card__swatch {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: var(--color-text-primary, #1a1a1a);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.08);
}
.opacity-card__meta {
  padding: 10px 12px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
  border-top: 1px solid rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.opacity-card__token { font-weight: 600; word-break: break-all; color: #181818; }
.opacity-card__value { font-variant-numeric: tabular-nums; color: rgba(0,0,0,0.65); }
</style>
`})))()}var u,d,f;function p(){return(p=e((()=>{l(),u={title:`Design System/Opacity`,parameters:{docs:{description:{component:"Contract-driven opacity gallery (Figma Web-ODS-Theme 18014:753). Percent scale from `themes/contract.yaml`; values from `themes/default/_opacity.scss`."}}}},d={name:`Opacity`,render:()=>s({brandLabel:`White Label`})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Opacity',
  render: () => renderOpacityGallery({
    brandLabel: 'White Label'
  })
}`,...d.parameters?.docs?.source}}},f=[`Default`]})))()}p();export{d as Default,f as __namedExportsOrder,u as default};