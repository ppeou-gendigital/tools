import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./contract-Ds37F3hF.js";function r(e){if(typeof document>`u`)return``;let t=e.startsWith(`--`)?e:`--${e}`;return getComputedStyle(document.documentElement).getPropertyValue(t).trim()}function i(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function a(e){if(typeof document>`u`)return 1;let t=document.createElement(`div`);t.style.color=e,document.body.appendChild(t);let n=getComputedStyle(t).color;document.body.removeChild(t);let r=n.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(!r)return 1;let[i,a,o]=[r[1],r[2],r[3]].map(e=>{let t=Number(e)/255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4});return .2126*i+.7152*a+.0722*o}function o(){return(n.tokens||[]).filter(e=>e.category===`color`).map(e=>e.name)}function s(e){let t=e.startsWith(`--gradient-`),n=r(e),o=`background: var(${e});`,s=`#000`;!t&&n&&(s=a(n)<.45?`#fff`:`#000`);let c=e.replace(/^--(?:color-|gradient-)/,``);return`
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
`})))()}var f,p,m,h,g,_,v;function y(){return(y=e((()=>{f=`Norton`,p=`18086:2050`,m=`Nshd9ukxIzpeUnzOXiWxUP`,h=`2026-08-01T04:26:31.490Z`,g={Primary:[`--color-norton-yellow`,`--color-off-black`,`--color-white`],Secondary:[`--color-blue-01`,`--color-blue-02`,`--color-blue-03`,`--color-blue-04`,`--color-salmon-01`,`--color-salmon-02`,`--color-salmon-03`,`--color-salmon-04`,`--color-plum-01`,`--color-plum-02`,`--color-plum-03`,`--color-plum-04`,`--color-teal-01`,`--color-teal-02`,`--color-teal-03`,`--color-teal-04`,`--color-green-04`,`--color-green-05`,`--color-yellow-02`,`--color-yellow-03`,`--color-yellow-04`],Extension:[`--color-orange-01`,`--color-lavender-01`,`--color-lime-01`,`--color-olive-01`],Functional:[`--color-norton-critical`,`--color-norton-attention`,`--color-norton-success`,`--color-norton-info`],Neutral:[`--color-norton-neutral-5`,`--color-norton-neutral-10`,`--color-norton-neutral-20`,`--color-norton-neutral-30`,`--color-norton-neutral-40`,`--color-norton-neutral-50`,`--color-norton-neutral-60`,`--color-norton-neutral-70`,`--color-norton-neutral-80`,`--color-norton-neutral-90`],Tints:[`--color-norton-yellow-80`,`--color-norton-yellow-60`,`--color-norton-yellow-40`,`--color-norton-yellow-20`,`--color-neutral-80-80`,`--color-neutral-80-60`,`--color-neutral-80-40`,`--color-neutral-80-20`,`--color-yellow-02-80`,`--color-yellow-02-60`,`--color-yellow-02-40`,`--color-yellow-02-20`,`--color-yellow-03-80`,`--color-yellow-03-60`,`--color-yellow-03-40`,`--color-yellow-03-20`,`--color-blue-04-80`,`--color-blue-04-60`,`--color-blue-04-40`,`--color-blue-04-20`,`--color-salmon-04-80`,`--color-salmon-04-60`,`--color-salmon-04-40`,`--color-salmon-04-20`]},_=[{name:`--color-norton-yellow`,value:`#feeb29`,group:`Primary`},{name:`--color-off-black`,value:`#242424`,group:`Primary`},{name:`--color-white`,value:`#ffffff`,group:`Primary`},{name:`--color-blue-01`,value:`#0f71f0`,group:`Secondary`},{name:`--color-blue-02`,value:`#3f8df3`,group:`Secondary`},{name:`--color-blue-03`,value:`#87b8f7`,group:`Secondary`},{name:`--color-blue-04`,value:`#cfe3fc`,group:`Secondary`},{name:`--color-salmon-01`,value:`#f48162`,group:`Secondary`},{name:`--color-salmon-02`,value:`#ff9176`,group:`Secondary`},{name:`--color-salmon-03`,value:`#ffbaa9`,group:`Secondary`},{name:`--color-salmon-04`,value:`#ffe4dd`,group:`Secondary`},{name:`--color-plum-01`,value:`#6a233f`,group:`Secondary`},{name:`--color-plum-02`,value:`#9e677d`,group:`Secondary`},{name:`--color-plum-03`,value:`#c3a1af`,group:`Secondary`},{name:`--color-plum-04`,value:`#e1d3d9`,group:`Secondary`},{name:`--color-teal-01`,value:`#108389`,group:`Secondary`},{name:`--color-teal-02`,value:`#3396a1`,group:`Secondary`},{name:`--color-teal-03`,value:`#80bdc4`,group:`Secondary`},{name:`--color-teal-04`,value:`#cce5e7`,group:`Secondary`},{name:`--color-green-04`,value:`#d2e9ca`,group:`Secondary`},{name:`--color-green-05`,value:`#e8f4e4`,group:`Secondary`},{name:`--color-yellow-02`,value:`#fbeeca`,group:`Secondary`},{name:`--color-yellow-03`,value:`#fdf6e4`,group:`Secondary`},{name:`--color-yellow-04`,value:`#fefaf1`,group:`Secondary`},{name:`--color-orange-01`,value:`#fd9523`,group:`Extension`},{name:`--color-lavender-01`,value:`#a778d0`,group:`Extension`},{name:`--color-lime-01`,value:`#c5c504`,group:`Extension`},{name:`--color-olive-01`,value:`#87923f`,group:`Extension`},{name:`--color-norton-critical`,value:`#d40404`,group:`Functional`},{name:`--color-norton-attention`,value:`#e07100`,group:`Functional`},{name:`--color-norton-success`,value:`#16a761`,group:`Functional`},{name:`--color-norton-info`,value:`#0f71f0`,group:`Functional`},{name:`--color-norton-neutral-5`,value:`#f8f8f7`,group:`Neutral`},{name:`--color-norton-neutral-10`,value:`#e9e9e7`,group:`Neutral`},{name:`--color-norton-neutral-20`,value:`#d3d3cf`,group:`Neutral`},{name:`--color-norton-neutral-30`,value:`#bdbdb9`,group:`Neutral`},{name:`--color-norton-neutral-40`,value:`#a7a7a2`,group:`Neutral`},{name:`--color-norton-neutral-50`,value:`#91918d`,group:`Neutral`},{name:`--color-norton-neutral-60`,value:`#7c7c78`,group:`Neutral`},{name:`--color-norton-neutral-70`,value:`#666662`,group:`Neutral`},{name:`--color-norton-neutral-80`,value:`#555551`,group:`Neutral`},{name:`--color-norton-neutral-90`,value:`#3a3a37`,group:`Neutral`},{name:`--color-norton-yellow-80`,value:`#feef54`,group:`Tints`},{name:`--color-norton-yellow-60`,value:`#fef37f`,group:`Tints`},{name:`--color-norton-yellow-40`,value:`#fff7a9`,group:`Tints`},{name:`--color-norton-yellow-20`,value:`#fffbd4`,group:`Tints`},{name:`--color-neutral-80-80`,value:`#777774`,group:`Tints`},{name:`--color-neutral-80-60`,value:`#999997`,group:`Tints`},{name:`--color-neutral-80-40`,value:`#bbbbb9`,group:`Tints`},{name:`--color-neutral-80-20`,value:`#dddddc`,group:`Tints`},{name:`--color-yellow-02-80`,value:`#fcf1d5`,group:`Tints`},{name:`--color-yellow-02-60`,value:`#fdf5df`,group:`Tints`},{name:`--color-yellow-02-40`,value:`#fdf8ea`,group:`Tints`},{name:`--color-yellow-02-20`,value:`#fefcf4`,group:`Tints`},{name:`--color-yellow-03-80`,value:`#fdf8e9`,group:`Tints`},{name:`--color-yellow-03-60`,value:`#fefaef`,group:`Tints`},{name:`--color-yellow-03-40`,value:`#fefbf4`,group:`Tints`},{name:`--color-yellow-03-20`,value:`#fffdfa`,group:`Tints`},{name:`--color-blue-04-80`,value:`#d9e9fd`,group:`Tints`},{name:`--color-blue-04-60`,value:`#e2eefd`,group:`Tints`},{name:`--color-blue-04-40`,value:`#ecf4fe`,group:`Tints`},{name:`--color-blue-04-20`,value:`#f5f9fe`,group:`Tints`},{name:`--color-salmon-04-80`,value:`#ffe9e4`,group:`Tints`},{name:`--color-salmon-04-60`,value:`#ffefeb`,group:`Tints`},{name:`--color-salmon-04-40`,value:`#fff4f1`,group:`Tints`},{name:`--color-salmon-04-20`,value:`#fffaf8`,group:`Tints`}],v={brand:f,figmaNode:p,fileKey:m,checkedAt:h,groups:g,primitives:_}})))()}var b,x,S;function C(){return(C=e((()=>{d(),y(),b={title:`Design System/Colors`,parameters:{docs:{description:{component:"Norton color gallery — full Core Primitive Colours (Figma 18086:2050) plus contract semantics. Shared renderer from `@aics/storybook-core`; values from `themes/default/_colors.scss`."}}}},x={name:`Colors`,render:()=>c({brandLabel:`Norton`,brandPrimitives:v})},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Colors',
  render: () => renderColorsGallery({
    brandLabel: 'Norton',
    brandPrimitives
  })
}`,...x.parameters?.docs?.source}}},S=[`Default`]})))()}C();export{x as Default,S as __namedExportsOrder,b as default};