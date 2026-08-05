import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./contract-DD6QebcQ.js";function r(e){if(typeof document>`u`)return``;let t=e.startsWith(`--`)?e:`--${e}`;return getComputedStyle(document.documentElement).getPropertyValue(t).trim()}function i(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function a(e){if(typeof document>`u`)return 1;let t=document.createElement(`div`);t.style.color=e,document.body.appendChild(t);let n=getComputedStyle(t).color;document.body.removeChild(t);let r=n.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(!r)return 1;let[i,a,o]=[r[1],r[2],r[3]].map(e=>{let t=Number(e)/255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4});return .2126*i+.7152*a+.0722*o}function o(){return(n.tokens||[]).filter(e=>e.category===`color`).map(e=>e.name)}function s(e){let t=e.startsWith(`--gradient-`),n=r(e),o=`background: var(${e});`,s=`#000`;!t&&n&&(s=a(n)<.45?`#fff`:`#000`);let c=e.replace(/^--(?:color-|gradient-)/,``);return`
    <div class="swatch${t?` swatch--gradient`:``}" title="${i(e)}">
      <div class="swatch__face" style="${o} color: ${s};">${i(c)}</div>
      <div class="swatch__meta">${i(n||`—`)}</div>
    </div>
  `}function c(e={}){let t=e.brandLabel?i(e.brandLabel):`White Label`,n=e.brandPrimitives||null,r=n?.groups?Object.entries(n.groups).map(([e,t])=>t?.length?`
      <section class="color-gallery__section">
        <h3>Primitive — ${i(e)}</h3>
        <div class="swatch-grid">${t.map(s).join(``)}</div>
      </section>
    `:``).join(``):``,a=o(),c=new Set,d=l.map(e=>{let t=a.filter(t=>e.match(t));return t.forEach(e=>c.add(e)),t.length?`
      <section class="color-gallery__section">
        <h3>${i(e.title)}</h3>
        <div class="swatch-grid">${t.map(s).join(``)}</div>
      </section>
    `:``}).join(``),f=a.filter(e=>!c.has(e)),p=f.length?`<section class="color-gallery__section"><h3>Other</h3><div class="swatch-grid">${f.map(s).join(``)}</div></section>`:``,m=n?.figmaNode?` Brand primitives from Figma node <code>${i(n.figmaNode)}</code>.`:``;return`
    ${u}
    <div class="color-gallery">
      <p class="color-gallery__intro">
        <strong>${t}</strong> colors — brand-local primitives (not in
        contract) plus contract semantics from
        <code>storybook-core/themes/contract.yaml</code> (Figma
        <code>18014:48</code>). Values from this package’s
        <code>themes/default/_colors.scss</code> (live CSS).${m}
      </p>
      ${r}
      ${d}
      ${p}
    </div>
  `}var l,u;function d(){return(d=e((()=>{t(),l=[{id:`chrome`,title:`Chrome aliases`,match:e=>e===`--color-bg-primary`||e===`--color-white`},{id:`functional`,title:`Functional`,match:e=>e.startsWith(`--color-functional-`)},{id:`neutral`,title:`Neutral`,match:e=>e.startsWith(`--color-neutral-`)},{id:`bg`,title:`Background`,match:e=>e.startsWith(`--color-bg-`)&&e!==`--color-bg-primary`},{id:`text`,title:`Content (text)`,match:e=>e.startsWith(`--color-text-`)},{id:`border`,title:`Border`,match:e=>e.startsWith(`--color-border-`)},{id:`highlight`,title:`Highlight`,match:e=>e.startsWith(`--color-highlight-`)},{id:`signal`,title:`Signal`,match:e=>e.startsWith(`--color-signal-`)},{id:`disabled`,title:`Disabled`,match:e=>e.startsWith(`--color-disabled-`)},{id:`canvas`,title:`Canvas`,match:e=>e.startsWith(`--color-canvas-`)},{id:`shadow`,title:`Shadow`,match:e=>e.startsWith(`--color-shadow-`)},{id:`gradient`,title:`Gradients`,match:e=>e.startsWith(`--gradient-`)}],u=`
<style>
.color-gallery { padding: 24px; color: var(--color-text-primary, #1a1a1a); background: var(--color-bg-subtle, #f8f8f7); }
.color-gallery__intro { margin: 0 0 24px; max-width: 64ch; line-height: 1.5; }
.color-gallery__intro code { font-size: 0.9em; }
.color-gallery__section { margin: 0 0 28px; }
.color-gallery__section h3 {
  margin: 0 0 12px; font-size: 14px; font-weight: 600;
  letter-spacing: 0.02em; text-transform: uppercase; opacity: 0.7;
}
.swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}
.swatch {
  border: 1px solid #000;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  min-height: 112px;
  display: flex;
  flex-direction: column;
}
.swatch__face {
  flex: 1;
  min-height: 72px;
  padding: 12px;
  display: flex;
  align-items: flex-end;
  font-size: 12px;
  font-weight: 600;
  word-break: break-all;
}
.swatch__meta {
  padding: 8px 12px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px;
  border-top: 1px solid rgba(0,0,0,0.08);
  color: rgba(0,0,0,0.7);
}
.swatch--gradient .swatch__face { min-height: 88px; }
</style>
`})))()}var f,p,m,h,g,_,v;function y(){return(y=e((()=>{f=`Avast`,p=`23467:372`,m=`Nshd9ukxIzpeUnzOXiWxUP`,h=`2026-08-01T04:26:31.493Z`,g={Primary:[`--color-avast-dark-blue`,`--color-avast-white`],Secondary:[`--color-avast-bright-orange`,`--color-avast-light-orange`,`--color-avast-pale-orange`,`--color-avast-faint-orange`,`--color-avast-off-white-orange`,`--color-avast-bright-blue`,`--color-avast-light-blue`,`--color-avast-pale-blue`,`--color-avast-faint-blue`,`--color-avast-alt-bright-blue`,`--color-avast-bright-green`,`--color-avast-light-green`,`--color-avast-pale-green`,`--color-avast-faint-green`,`--color-avast-red`,`--color-avast-red-inverse`,`--color-avast-faint-red`,`--color-avast-yellow`,`--color-avast-yellow-inverse`],Functional:[`--color-avast-critical`,`--color-avast-attention`,`--color-avast-success`,`--color-avast-info`],Neutral:[`--color-avast-grey-1`,`--color-avast-grey-2`,`--color-avast-grey-3`,`--color-avast-grey-4`,`--color-avast-grey-5`,`--color-avast-grey-6`,`--color-avast-grey-7`,`--color-avast-grey-8`,`--color-avast-grey-9`,`--color-avast-grey-10`],Tints:[`--color-avast-bright-green-80`,`--color-avast-bright-green-60`,`--color-avast-bright-green-40`,`--color-avast-bright-green-20`,`--color-avast-grey-2-80`,`--color-avast-grey-2-60`,`--color-avast-grey-2-40`,`--color-avast-grey-2-20`,`--color-avast-pale-green-80`,`--color-avast-pale-green-60`,`--color-avast-pale-green-40`,`--color-avast-pale-green-20`,`--color-avast-light-green-80`,`--color-avast-light-green-60`,`--color-avast-light-green-40`,`--color-avast-light-green-20`,`--color-avast-faint-orange-80`,`--color-avast-faint-orange-60`,`--color-avast-faint-orange-40`,`--color-avast-faint-orange-20`,`--color-avast-pale-blue-80`,`--color-avast-pale-blue-60`,`--color-avast-pale-blue-40`,`--color-avast-pale-blue-20`]},_=[{name:`--color-avast-dark-blue`,value:`#071d2b`,group:`Primary`},{name:`--color-avast-white`,value:`#ffffff`,group:`Primary`},{name:`--color-avast-bright-orange`,value:`#ff7800`,group:`Secondary`},{name:`--color-avast-light-orange`,value:`#ffb370`,group:`Secondary`},{name:`--color-avast-pale-orange`,value:`#ffddbf`,group:`Secondary`},{name:`--color-avast-faint-orange`,value:`#fff1e5`,group:`Secondary`},{name:`--color-avast-off-white-orange`,value:`#fff9f5`,group:`Secondary`},{name:`--color-avast-bright-blue`,value:`#0070f6`,group:`Secondary`},{name:`--color-avast-light-blue`,value:`#7bb5fb`,group:`Secondary`},{name:`--color-avast-pale-blue`,value:`#d4e7ff`,group:`Secondary`},{name:`--color-avast-faint-blue`,value:`#f0f7ff`,group:`Secondary`},{name:`--color-avast-alt-bright-blue`,value:`#0067ed`,group:`Secondary`},{name:`--color-avast-bright-green`,value:`#9ae437`,group:`Secondary`},{name:`--color-avast-light-green`,value:`#b7eb6e`,group:`Secondary`},{name:`--color-avast-pale-green`,value:`#d5f2a5`,group:`Secondary`},{name:`--color-avast-faint-green`,value:`#effbdf`,group:`Secondary`},{name:`--color-avast-red`,value:`#d93511`,group:`Secondary`},{name:`--color-avast-red-inverse`,value:`#ff5833`,group:`Secondary`},{name:`--color-avast-faint-red`,value:`#ffaf9d`,group:`Secondary`},{name:`--color-avast-yellow`,value:`#ffbf00`,group:`Secondary`},{name:`--color-avast-yellow-inverse`,value:`#ffd900`,group:`Secondary`},{name:`--color-avast-critical`,value:`#d93511`,group:`Functional`},{name:`--color-avast-attention`,value:`#ffbf00`,group:`Functional`},{name:`--color-avast-success`,value:`#388700`,group:`Functional`},{name:`--color-avast-info`,value:`#0070f6`,group:`Functional`},{name:`--color-avast-grey-1`,value:`#0c2636`,group:`Neutral`},{name:`--color-avast-grey-2`,value:`#143347`,group:`Neutral`},{name:`--color-avast-grey-3`,value:`#21455c`,group:`Neutral`},{name:`--color-avast-grey-4`,value:`#345970`,group:`Neutral`},{name:`--color-avast-grey-5`,value:`#5c7a8c`,group:`Neutral`},{name:`--color-avast-grey-6`,value:`#88a2b2`,group:`Neutral`},{name:`--color-avast-grey-7`,value:`#c5d6e0`,group:`Neutral`},{name:`--color-avast-grey-8`,value:`#e1eaf0`,group:`Neutral`},{name:`--color-avast-grey-9`,value:`#ebf1f5`,group:`Neutral`},{name:`--color-avast-grey-10`,value:`#f7fafc`,group:`Neutral`},{name:`--color-avast-bright-green-80`,value:`#aee95f`,group:`Tints`},{name:`--color-avast-bright-green-60`,value:`#c2ef87`,group:`Tints`},{name:`--color-avast-bright-green-40`,value:`#d7f4af`,group:`Tints`},{name:`--color-avast-bright-green-20`,value:`#ebfad7`,group:`Tints`},{name:`--color-avast-grey-2-80`,value:`#435c6c`,group:`Tints`},{name:`--color-avast-grey-2-60`,value:`#728591`,group:`Tints`},{name:`--color-avast-grey-2-40`,value:`#a1adb5`,group:`Tints`},{name:`--color-avast-grey-2-20`,value:`#d0d6da`,group:`Tints`},{name:`--color-avast-pale-green-80`,value:`#ddf5b7`,group:`Tints`},{name:`--color-avast-pale-green-60`,value:`#e6f7c9`,group:`Tints`},{name:`--color-avast-pale-green-40`,value:`#eefadb`,group:`Tints`},{name:`--color-avast-pale-green-20`,value:`#f7fced`,group:`Tints`},{name:`--color-avast-light-green-80`,value:`#c5ef8b`,group:`Tints`},{name:`--color-avast-light-green-60`,value:`#d4f3a8`,group:`Tints`},{name:`--color-avast-light-green-40`,value:`#e2f7c5`,group:`Tints`},{name:`--color-avast-light-green-20`,value:`#f1fbe2`,group:`Tints`},{name:`--color-avast-faint-orange-80`,value:`#fff4ea`,group:`Tints`},{name:`--color-avast-faint-orange-60`,value:`#fff7ef`,group:`Tints`},{name:`--color-avast-faint-orange-40`,value:`#fff9f5`,group:`Tints`},{name:`--color-avast-faint-orange-20`,value:`#fffcfa`,group:`Tints`},{name:`--color-avast-pale-blue-80`,value:`#ddecff`,group:`Tints`},{name:`--color-avast-pale-blue-60`,value:`#e5f1ff`,group:`Tints`},{name:`--color-avast-pale-blue-40`,value:`#eef5ff`,group:`Tints`},{name:`--color-avast-pale-blue-20`,value:`#f6faff`,group:`Tints`}],v={brand:f,figmaNode:p,fileKey:m,checkedAt:h,groups:g,primitives:_}})))()}var b,x,S;function C(){return(C=e((()=>{d(),y(),b={title:`Design System/Colors`,parameters:{docs:{description:{component:"Avast color gallery — full Core Primitive Colours (Figma 23467:372) plus contract semantics. Shared renderer from `@aics/storybook-core`; values from `themes/default/_colors.scss`."}}}},x={name:`Colors`,render:()=>c({brandLabel:`Avast`,brandPrimitives:v})},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Colors',
  render: () => renderColorsGallery({
    brandLabel: 'Avast',
    brandPrimitives
  })
}`,...x.parameters?.docs?.source}}},S=[`Default`]})))()}C();export{x as Default,S as __namedExportsOrder,b as default};