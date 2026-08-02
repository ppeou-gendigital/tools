import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./contract-Ds37F3hF.js";function r(e){if(typeof document>`u`)return``;let t=e.startsWith(`--`)?e:`--${e}`;return getComputedStyle(document.documentElement).getPropertyValue(t).trim()}function i(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function a(e){let t=e.replace(/^--border-(?:radius|width)-/,``),n=d.indexOf(t);return n===-1?999:n}function o(e){return(n.tokens||[]).filter(t=>t?.category===e&&typeof t.name==`string`).map(e=>e.name).sort((e,t)=>a(e)-a(t))}function s(e){let t=r(e)||`—`;return`
    <figure class="borders-card">
      <div class="borders-card__demo">
        <div class="borders-card__demo-box" style="border-radius: var(${i(e)});"></div>
      </div>
      <figcaption class="borders-card__meta">
        <span class="borders-card__token">${i(e)}</span>
        <span class="borders-card__value">${i(t)}</span>
      </figcaption>
    </figure>`}function c(e){let t=r(e)||`—`;return`
    <figure class="borders-card">
      <div class="borders-card__demo">
        <div class="borders-card__demo-bar" style="border-width: ${i(t===`0`||t===`0px`?`0`:`var(${e})`)};"></div>
      </div>
      <figcaption class="borders-card__meta">
        <span class="borders-card__token">${i(e)}</span>
        <span class="borders-card__value">${i(t)}</span>
      </figcaption>
    </figure>`}function l(e={}){let t=e.brandLabel||`White Label`,n=o(`radius`),r=o(`width`);return`
${u}
<section class="borders-gallery">
  <p class="borders-gallery__intro">
    <strong>${i(t)} borders</strong> — Figma Foundations
    size scale from <code>themes/contract.yaml</code> (Web-ODS-Theme
    <code>18014:752</code>). Values from this package’s
    <code>themes/default/_borders.scss</code>.
  </p>
  <div class="borders-gallery__section">
    <h3>Border radius · ${n.length}</h3>
    <div class="borders-grid">
      ${n.map(s).join(`
`)}
    </div>
  </div>
  <div class="borders-gallery__section">
    <h3>Border width · ${r.length}</h3>
    <div class="borders-grid">
      ${r.map(c).join(`
`)}
    </div>
  </div>
</section>`}var u,d;function f(){return(f=e((()=>{t(),u=`
<style>
.borders-gallery { padding: 24px; color: var(--color-text-primary, #1a1a1a); background: var(--color-bg-subtle, #f8f8f7); }
.borders-gallery__intro { margin: 0 0 24px; max-width: 64ch; line-height: 1.5; }
.borders-gallery__intro code { font-size: 0.9em; }
.borders-gallery__section { margin: 0 0 28px; }
.borders-gallery__section h3 {
  margin: 0 0 12px; font-size: 14px; font-weight: 600;
  letter-spacing: 0.02em; text-transform: uppercase; opacity: 0.7;
}
.borders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}
.borders-card {
  border: 1px solid var(--color-border-subtle, rgba(0,0,0,0.12));
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.borders-card__demo {
  min-height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: var(--color-bg-subtle, #f8f8f7);
}
.borders-card__demo-box {
  width: 72px;
  height: 72px;
  background: var(--color-bg-primary, #fff);
  border: 2px solid var(--color-border-strong, #1a1a1a);
  box-sizing: border-box;
}
.borders-card__demo-bar {
  width: 100%;
  max-width: 120px;
  height: 48px;
  background: var(--color-bg-primary, #fff);
  border-style: solid;
  border-color: var(--color-border-strong, #1a1a1a);
  border-radius: 4px;
  box-sizing: border-box;
}
.borders-card__meta {
  padding: 10px 12px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
  border-top: 1px solid rgba(0,0,0,0.08);
  color: rgba(0,0,0,0.75);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.borders-card__token { font-weight: 600; word-break: break-all; color: #181818; }
.borders-card__value { font-variant-numeric: tabular-nums; }
</style>
`,d=[`0`,`xs`,`s`,`m`,`l`,`xl`,`xxl`,`xxxl`]})))()}var p,m,h;function g(){return(g=e((()=>{f(),p={title:`Design System/Borders`,parameters:{docs:{description:{component:"Contract-driven borders gallery (Figma Web-ODS-Theme 18014:752). Size-scale radius + width from `themes/contract.yaml`; values from `themes/default/_borders.scss`. Brand packages re-use the same renderer under their own theme."}}}},m={name:`Borders`,render:()=>l({brandLabel:`White Label`})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Borders',
  render: () => renderBordersGallery({
    brandLabel: 'White Label'
  })
}`,...m.parameters?.docs?.source}}},h=[`Default`]})))()}g();export{m as Default,h as __namedExportsOrder,p as default};