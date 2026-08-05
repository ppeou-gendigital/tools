import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./contract-DD6QebcQ.js";function r(e){if(typeof document>`u`)return``;let t=e.startsWith(`--`)?e:`--${e}`;return getComputedStyle(document.documentElement).getPropertyValue(t).trim()}function i(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function a(e){return(n.tokens||[]).map(e=>e.name).filter(t=>typeof t==`string`&&t.startsWith(e))}function o(){return a(`--font-size-`).map(e=>e.slice(12))}function s(){return a(`--font-family-`).map(e=>{let t=r(e);return`
        <div class="type-row">
          <div class="type-row__token">${i(e)}</div>
          <div class="type-row__sample type-family-row__sample" style="font-family: var(${e});">
            ${i(d)}
          </div>
          <div class="type-row__meta">${i(t||`—`)}</div>
        </div>
      `}).join(``)}function c(){return a(`--font-weight-`).map(e=>{let t=r(e);return`
        <div class="type-row">
          <div class="type-row__token">${i(e)}</div>
          <div class="type-row__sample type-weight-row__sample"
               style="font-family: var(--font-family-primary); font-weight: var(${e});">
            ${i(f)}
          </div>
          <div class="type-row__meta">${i(t||`—`)}</div>
        </div>
      `}).join(``)}function l(){return o().map(e=>{let t=`--font-size-${e}`,n=`--lineheight-${e}`,a=`--letterspacing-${e}`,o=r(t),s=r(n),c=r(a);return`
        <div class="type-row">
          <div class="type-row__token">${i(e)}<br/><span style="font-weight:400;opacity:.75">${i(t)}</span></div>
          <div class="type-row__sample type-size-row__sample"
               style="font-family: var(--font-family-primary); font-size: var(${t}); line-height: var(${n}); letter-spacing: var(${a}); font-weight: var(--font-weight-medium);">
            ${i(d)}
          </div>
          <div class="type-row__meta">${i(o||`—`)} / ${i(s||`—`)}<br/>ls ${i(c||`—`)}</div>
        </div>
      `}).join(``)}function u(e={}){let t=e.brandLabel?i(e.brandLabel):`White Label`;return`
    ${p}
    <div class="typo-gallery">
      <p class="typo-gallery__intro">
        <strong>${t}</strong> typography — contract token names from
        <code>storybook-core/themes/contract.yaml</code>; values from this
        package’s <code>themes/default/_tokens.scss</code> (live CSS).
        Resize across 1024px to see the SM ↔ LG size/line-height flip.
      </p>
      <section class="typo-gallery__section">
        <h3>Families</h3>
        <div class="type-stack">${s()}</div>
      </section>
      <section class="typo-gallery__section">
        <h3>Weights</h3>
        <div class="type-stack">${c()}</div>
      </section>
      <section class="typo-gallery__section">
        <h3>Roles (size / line-height / letter-spacing)</h3>
        <div class="type-stack">${l()}</div>
      </section>
    </div>
  `}var d,f,p;function m(){return(m=e((()=>{t(),d=`The quick brown fox jumps over the lazy dog · 0123456789`,f=`Aa Bb Cc 123`,p=`
<style>
.typo-gallery { padding: 24px; color: var(--color-text-primary, #1a1a1a); background: var(--color-bg-primary, #fff); }
.typo-gallery__intro { margin: 0 0 24px; max-width: 64ch; line-height: 1.5; }
.typo-gallery__intro code { font-size: 0.9em; }
.typo-gallery__section { margin: 0 0 32px; }
.typo-gallery__section h3 { margin: 0 0 12px; font-size: 14px; font-weight: 600; letter-spacing: 0.02em; text-transform: uppercase; color: var(--color-text-primary, #1a1a1a); opacity: 0.7; }
.type-stack { display: flex; flex-direction: column; gap: 12px; }
.type-row {
  display: grid;
  grid-template-columns: 220px 1fr 220px;
  gap: 16px;
  align-items: baseline;
  padding: 12px 16px;
  border: 1px solid var(--color-border-subtle, rgba(0,0,0,0.10));
  border-radius: 8px;
  background: #fff;
}
.type-row__token {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-primary, #181818);
  word-break: break-all;
}
.type-row__sample {
  color: var(--color-text-primary, #181818);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.type-row__meta {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
  color: rgba(0,0,0,0.65);
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.type-family-row__sample,
.type-weight-row__sample { font-size: 24px; line-height: 1.3; }
.type-size-row__sample { line-height: 1.1; }
</style>
`})))()}var h,g,_;function v(){return(v=e((()=>{m(),h={title:`Design System/Typography`,parameters:{docs:{description:{component:"Contract-driven typography gallery. Token names from `themes/contract.yaml`; White Label / Lexend values from `themes/default/_tokens.scss` (live CSS). Brand packages re-use the same renderer under their own theme."}}}},g={name:`Typography`,render:()=>u({brandLabel:`White Label`})},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Typography',
  render: () => renderTypographyGallery({
    brandLabel: 'White Label'
  })
}`,...g.parameters?.docs?.source}}},_=[`Default`]})))()}v();export{g as Default,_ as __namedExportsOrder,h as default};