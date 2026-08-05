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
`})))()}var f,p,m,h,g,_,v;function y(){return(y=e((()=>{f=`White Label`,p=`21307:626`,m=`Nshd9ukxIzpeUnzOXiWxUP`,h=`2026-08-01T04:26:31.496Z`,g={Primary:[`--color-oxygen-blue`,`--color-oxygen-grey-900`,`--color-oxygen-red`,`--color-oxygen-green`,`--color-oxygen-yellow`,`--color-oxygen-white`],Secondary:`--color-oxygen-grey-800.--color-oxygen-grey-700.--color-oxygen-grey-600.--color-oxygen-grey-500.--color-oxygen-grey-400.--color-oxygen-grey-300.--color-oxygen-grey-200.--color-oxygen-grey-100.--color-oxygen-grey-50.--color-oxygen-grey-10.--color-oxygen-red-500.--color-oxygen-red-400.--color-oxygen-blue-700.--color-oxygen-blue-600.--color-oxygen-blue-500.--color-oxygen-blue-400.--color-oxygen-blue-300.--color-oxygen-blue-200.--color-oxygen-blue-100.--color-oxygen-blue-50.--color-oxygen-blue-20.--color-oxygen-blue-10.--color-oxygen-green-800.--color-oxygen-green-700.--color-oxygen-green-600.--color-oxygen-green-500.--color-oxygen-green-400.--color-oxygen-green-300.--color-oxygen-green-200.--color-oxygen-green-100.--color-oxygen-green-50.--color-oxygen-cyan-900.--color-oxygen-cyan-800.--color-oxygen-cyan-700.--color-oxygen-cyan-600.--color-oxygen-cyan-500.--color-oxygen-cyan-400.--color-oxygen-cyan-300.--color-oxygen-cyan-200.--color-oxygen-cyan-100.--color-oxygen-cyan-50.--color-oxygen-yellow-400.--color-oxygen-yellow-300`.split(`.`),Functional:[`--color-oxygen-critical`,`--color-oxygen-attention`,`--color-oxygen-success`,`--color-oxygen-info`],Neutral:[`--color-oxygen-neutral-50`,`--color-oxygen-neutral-100`,`--color-oxygen-neutral-200`,`--color-oxygen-neutral-300`,`--color-oxygen-neutral-400`,`--color-oxygen-neutral-500`,`--color-oxygen-neutral-600`,`--color-oxygen-neutral-700`,`--color-oxygen-neutral-800`,`--color-oxygen-neutral-900`],Tints:[`--color-oxygen-blue-tint-80`,`--color-oxygen-blue-tint-60`,`--color-oxygen-blue-tint-40`,`--color-oxygen-blue-tint-20`,`--color-oxygen-grey-700-80`,`--color-oxygen-grey-700-60`,`--color-oxygen-grey-700-40`,`--color-oxygen-grey-700-20`,`--color-oxygen-grey-100-80`,`--color-oxygen-grey-100-60`,`--color-oxygen-grey-100-40`,`--color-oxygen-grey-100-20`,`--color-oxygen-cyan-50-80`,`--color-oxygen-cyan-50-60`,`--color-oxygen-cyan-50-40`,`--color-oxygen-cyan-50-20`,`--color-oxygen-yellow-300-80`,`--color-oxygen-yellow-300-60`,`--color-oxygen-yellow-300-40`,`--color-oxygen-yellow-300-20`]},_=[{name:`--color-oxygen-blue`,value:`#0009ec`,group:`Primary`},{name:`--color-oxygen-grey-900`,value:`#2f303c`,group:`Primary`},{name:`--color-oxygen-red`,value:`#d93511`,group:`Primary`},{name:`--color-oxygen-green`,value:`#0d4137`,group:`Primary`},{name:`--color-oxygen-yellow`,value:`#ffbf00`,group:`Primary`},{name:`--color-oxygen-white`,value:`#ffffff`,group:`Primary`},{name:`--color-oxygen-grey-800`,value:`#3e3f4e`,group:`Secondary`},{name:`--color-oxygen-grey-700`,value:`#505165`,group:`Secondary`},{name:`--color-oxygen-grey-600`,value:`#676881`,group:`Secondary`},{name:`--color-oxygen-grey-500`,value:`#71728e`,group:`Secondary`},{name:`--color-oxygen-grey-400`,value:`#8d8ea5`,group:`Secondary`},{name:`--color-oxygen-grey-300`,value:`#a0a1b3`,group:`Secondary`},{name:`--color-oxygen-grey-200`,value:`#bebecb`,group:`Secondary`},{name:`--color-oxygen-grey-100`,value:`#d3d3dc`,group:`Secondary`},{name:`--color-oxygen-grey-50`,value:`#f1f1f4`,group:`Secondary`},{name:`--color-oxygen-grey-10`,value:`#fafafc`,group:`Secondary`},{name:`--color-oxygen-red-500`,value:`#aa2a0d`,group:`Secondary`},{name:`--color-oxygen-red-400`,value:`#b82d0f`,group:`Secondary`},{name:`--color-oxygen-blue-700`,value:`#000463`,group:`Secondary`},{name:`--color-oxygen-blue-600`,value:`#0006a8`,group:`Secondary`},{name:`--color-oxygen-blue-500`,value:`#0008d7`,group:`Secondary`},{name:`--color-oxygen-blue-400`,value:`#333af0`,group:`Secondary`},{name:`--color-oxygen-blue-300`,value:`#545af2`,group:`Secondary`},{name:`--color-oxygen-blue-200`,value:`#8a8ef6`,group:`Secondary`},{name:`--color-oxygen-blue-100`,value:`#b0b3f9`,group:`Secondary`},{name:`--color-oxygen-blue-50`,value:`#e6e6fd`,group:`Secondary`},{name:`--color-oxygen-blue-20`,value:`#f7f7ff`,group:`Secondary`},{name:`--color-oxygen-blue-10`,value:`#fbfaff`,group:`Secondary`},{name:`--color-oxygen-green-800`,value:`#125548`,group:`Secondary`},{name:`--color-oxygen-green-700`,value:`#176d5d`,group:`Secondary`},{name:`--color-oxygen-green-600`,value:`#1d8c77`,group:`Secondary`},{name:`--color-oxygen-green-500`,value:`#209a83`,group:`Secondary`},{name:`--color-oxygen-green-400`,value:`#4dae9c`,group:`Secondary`},{name:`--color-oxygen-green-300`,value:`#6abbac`,group:`Secondary`},{name:`--color-oxygen-green-200`,value:`#98d1c6`,group:`Secondary`},{name:`--color-oxygen-green-100`,value:`#bae0d9`,group:`Secondary`},{name:`--color-oxygen-green-50`,value:`#e9f5f3`,group:`Secondary`},{name:`--color-oxygen-cyan-900`,value:`#144f5e`,group:`Secondary`},{name:`--color-oxygen-cyan-800`,value:`#1a687b`,group:`Secondary`},{name:`--color-oxygen-cyan-700`,value:`#22869f`,group:`Secondary`},{name:`--color-oxygen-cyan-600`,value:`#2caccc`,group:`Secondary`},{name:`--color-oxygen-cyan-500`,value:`#30bde0`,group:`Secondary`},{name:`--color-oxygen-cyan-400`,value:`#59cae6`,group:`Secondary`},{name:`--color-oxygen-cyan-300`,value:`#74d3ea`,group:`Secondary`},{name:`--color-oxygen-cyan-200`,value:`#a0e1f1`,group:`Secondary`},{name:`--color-oxygen-cyan-100`,value:`#bfebf5`,group:`Secondary`},{name:`--color-oxygen-cyan-50`,value:`#eaf8fc`,group:`Secondary`},{name:`--color-oxygen-yellow-400`,value:`#ffcd38`,group:`Secondary`},{name:`--color-oxygen-yellow-300`,value:`#ffd966`,group:`Secondary`},{name:`--color-oxygen-critical`,value:`#d93511`,group:`Functional`},{name:`--color-oxygen-attention`,value:`#ffbf00`,group:`Functional`},{name:`--color-oxygen-success`,value:`#0d4137`,group:`Functional`},{name:`--color-oxygen-info`,value:`#0009ec`,group:`Functional`},{name:`--color-oxygen-neutral-50`,value:`#f2f2f2`,group:`Neutral`},{name:`--color-oxygen-neutral-100`,value:`#e6e6e6`,group:`Neutral`},{name:`--color-oxygen-neutral-200`,value:`#cccccc`,group:`Neutral`},{name:`--color-oxygen-neutral-300`,value:`#b3b3b3`,group:`Neutral`},{name:`--color-oxygen-neutral-400`,value:`#999999`,group:`Neutral`},{name:`--color-oxygen-neutral-500`,value:`#808080`,group:`Neutral`},{name:`--color-oxygen-neutral-600`,value:`#666666`,group:`Neutral`},{name:`--color-oxygen-neutral-700`,value:`#4d4d4d`,group:`Neutral`},{name:`--color-oxygen-neutral-800`,value:`#333333`,group:`Neutral`},{name:`--color-oxygen-neutral-900`,value:`#1a1a1a`,group:`Neutral`},{name:`--color-oxygen-blue-tint-80`,value:`#333af0`,group:`Tints`},{name:`--color-oxygen-blue-tint-60`,value:`#666bf4`,group:`Tints`},{name:`--color-oxygen-blue-tint-40`,value:`#999df7`,group:`Tints`},{name:`--color-oxygen-blue-tint-20`,value:`#cccefb`,group:`Tints`},{name:`--color-oxygen-grey-700-80`,value:`#737484`,group:`Tints`},{name:`--color-oxygen-grey-700-60`,value:`#9697a3`,group:`Tints`},{name:`--color-oxygen-grey-700-40`,value:`#b9b9c1`,group:`Tints`},{name:`--color-oxygen-grey-700-20`,value:`#dcdce0`,group:`Tints`},{name:`--color-oxygen-grey-100-80`,value:`#dcdce3`,group:`Tints`},{name:`--color-oxygen-grey-100-60`,value:`#e5e5ea`,group:`Tints`},{name:`--color-oxygen-grey-100-40`,value:`#ededf1`,group:`Tints`},{name:`--color-oxygen-grey-100-20`,value:`#f6f6f8`,group:`Tints`},{name:`--color-oxygen-cyan-50-80`,value:`#eef9fd`,group:`Tints`},{name:`--color-oxygen-cyan-50-60`,value:`#f2fbfd`,group:`Tints`},{name:`--color-oxygen-cyan-50-40`,value:`#f7fcfe`,group:`Tints`},{name:`--color-oxygen-cyan-50-20`,value:`#fbfefe`,group:`Tints`},{name:`--color-oxygen-yellow-300-80`,value:`#ffe185`,group:`Tints`},{name:`--color-oxygen-yellow-300-60`,value:`#ffe8a3`,group:`Tints`},{name:`--color-oxygen-yellow-300-40`,value:`#fff0c2`,group:`Tints`},{name:`--color-oxygen-yellow-300-20`,value:`#fff7e0`,group:`Tints`}],v={brand:f,figmaNode:p,fileKey:m,checkedAt:h,groups:g,primitives:_}})))()}var b,x,S;function C(){return(C=e((()=>{d(),y(),b={title:`Design System/Colors`,parameters:{docs:{description:{component:"White Label color gallery — full Core Primitive Colours (Figma 21307:626) plus contract semantics from `themes/contract.yaml`. Values from `themes/default/_colors.scss`. Brand packages re-use the same renderer under their own theme."}}}},x={name:`Colors`,render:()=>c({brandLabel:`White Label`,brandPrimitives:v})},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Colors',
  render: () => renderColorsGallery({
    brandLabel: 'White Label',
    brandPrimitives
  })
}`,...x.parameters?.docs?.source}}},S=[`Default`]})))()}C();export{x as Default,S as __namedExportsOrder,b as default};