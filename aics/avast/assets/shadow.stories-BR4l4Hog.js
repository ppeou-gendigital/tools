import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./contract-Ds37F3hF.js";function r(e){return typeof document>`u`?``:getComputedStyle(document.documentElement).getPropertyValue(e).trim()}function i(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function a(e){return(n.tokens||[]).filter(t=>t?.category===`shadow`&&typeof t.name==`string`&&e(t.name)).map(e=>e.name)}function o(e){let t=r(e)||`—`;return`
    <figure class="shadow-card">
      <div class="shadow-card__demo">
        <div class="shadow-card__box" style="box-shadow: var(${i(e)});"></div>
      </div>
      <figcaption class="shadow-card__meta">
        <span class="shadow-card__token">${i(e)}</span>
        <span class="shadow-card__value">${i(t)}</span>
      </figcaption>
    </figure>`}function s(e){let t=r(e)||`—`;return`
    <div class="shadow-atom">
      <span class="shadow-atom__name">${i(e)}</span>
      <span class="shadow-atom__value">${i(t)}</span>
    </div>`}function c(e={}){let t=e.brandLabel||`White Label`,n=a(e=>/^--shadow-(default|hover|pressed)$/.test(e)),r=a(e=>e.startsWith(`--shadow-raw-`));return`
${l}
<section class="shadow-gallery">
  <p class="shadow-gallery__intro">
    <strong>${i(t)} shadow</strong> — elevation composites +
    atoms from <code>themes/contract.yaml</code> (Web-ODS-Theme
    <code>18014:754</code>). Values from this package’s
    <code>themes/default/_shadow.scss</code>.
  </p>
  <div class="shadow-gallery__section">
    <h3>Elevation · ${n.length}</h3>
    <div class="shadow-grid">
      ${n.map(o).join(`
`)}
    </div>
  </div>
  <div class="shadow-gallery__section">
    <h3>Atoms · ${r.length}</h3>
    <div class="shadow-atoms">
      ${r.map(s).join(`
`)}
    </div>
  </div>
</section>`}var l;function u(){return(u=e((()=>{t(),l=`
<style>
.shadow-gallery { padding: 24px; color: var(--color-text-primary, #1a1a1a); background: var(--color-bg-subtle, #f8f8f7); }
.shadow-gallery__intro { margin: 0 0 24px; max-width: 64ch; line-height: 1.5; }
.shadow-gallery__intro code { font-size: 0.9em; }
.shadow-gallery__section { margin: 0 0 28px; }
.shadow-gallery__section h3 {
  margin: 0 0 12px; font-size: 14px; font-weight: 600;
  letter-spacing: 0.02em; text-transform: uppercase; opacity: 0.7;
}
.shadow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.shadow-card {
  border: 1px solid var(--color-border-subtle, rgba(0,0,0,0.12));
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.shadow-card__demo {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  background: var(--color-bg-subtle, #f0f0ef);
}
.shadow-card__box {
  width: 96px;
  height: 64px;
  border-radius: 8px;
  background: #fff;
}
.shadow-atoms {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 8px;
}
.shadow-atom {
  padding: 8px 10px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 6px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.shadow-atom__name { font-weight: 600; word-break: break-all; }
.shadow-atom__value { font-variant-numeric: tabular-nums; color: rgba(0,0,0,0.65); }
.shadow-card__meta {
  padding: 10px 12px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
  border-top: 1px solid rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.shadow-card__token { font-weight: 600; word-break: break-all; color: #181818; }
.shadow-card__value { font-variant-numeric: tabular-nums; color: rgba(0,0,0,0.65); word-break: break-all; }
</style>
`})))()}var d,f,p;function m(){return(m=e((()=>{u(),d={title:`Design System/Shadow`,parameters:{docs:{description:{component:"Avast shadow gallery. Shared renderer from `@aics/storybook-core`; values from `themes/default/_shadow.scss`."}}}},f={name:`Shadow`,render:()=>c({brandLabel:`Avast`})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Shadow',
  render: () => renderShadowGallery({
    brandLabel: 'Avast'
  })
}`,...f.parameters?.docs?.source}}},p=[`Default`]})))()}m();export{f as Default,p as __namedExportsOrder,d as default};