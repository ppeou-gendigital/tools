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
`})))()}var f,p,m,h,g,_;function v(){return(v=e((()=>{f=`21387:2623`,p=`Nshd9ukxIzpeUnzOXiWxUP`,m=`2026-08-01T04:26:31.493Z`,h={Primary:[`--color-avg-black`,`--color-avg-white`,`--color-avg-green`,`--color-avg-blue`],Secondary:`--color-avg-green-inverse.--color-avg-mid-green.--color-avg-light-green.--color-avg-pale-green.--color-avg-faint-green.--color-avg-off-white-green.--color-avg-alt-green.--color-avg-blue-inverse.--color-avg-mid-blue.--color-avg-light-blue.--color-avg-pale-blue.--color-avg-faint-blue.--color-avg-off-white-blue.--color-avg-alt-blue.--color-avg-red.--color-avg-yellow.--color-avg-pale-yellow.--color-avg-faint-yellow.--color-avg-off-white-yellow.--color-avg-grey-1.--color-avg-grey-2.--color-avg-grey-3.--color-avg-grey-4.--color-avg-grey-5.--color-avg-grey-6.--color-avg-grey-7.--color-avg-grey-8`.split(`.`),Functional:[`--color-avg-critical`,`--color-avg-attention`,`--color-avg-success`,`--color-avg-info`],Neutral:[`--color-avg-neutral-50`,`--color-avg-neutral-100`,`--color-avg-neutral-200`,`--color-avg-neutral-300`,`--color-avg-neutral-400`,`--color-avg-neutral-500`,`--color-avg-neutral-600`,`--color-avg-neutral-700`,`--color-avg-neutral-800`,`--color-avg-neutral-900`]},g=[{name:`--color-avg-black`,value:`#1c222e`,group:`Primary`},{name:`--color-avg-white`,value:`#ffffff`,group:`Primary`},{name:`--color-avg-green`,value:`#008941`,group:`Primary`},{name:`--color-avg-blue`,value:`#2276d9`,group:`Primary`},{name:`--color-avg-green-inverse`,value:`#24aa63`,group:`Secondary`},{name:`--color-avg-mid-green`,value:`#7acca0`,group:`Secondary`},{name:`--color-avg-light-green`,value:`#a2dbbd`,group:`Secondary`},{name:`--color-avg-pale-green`,value:`#d1edde`,group:`Secondary`},{name:`--color-avg-faint-green`,value:`#e6f4ed`,group:`Secondary`},{name:`--color-avg-off-white-green`,value:`#f2faf6`,group:`Secondary`},{name:`--color-avg-alt-green`,value:`#00783b`,group:`Secondary`},{name:`--color-avg-blue-inverse`,value:`#4d99f0`,group:`Secondary`},{name:`--color-avg-mid-blue`,value:`#93c1f5`,group:`Secondary`},{name:`--color-avg-light-blue`,value:`#b6d5f7`,group:`Secondary`},{name:`--color-avg-pale-blue`,value:`#d9e8fa`,group:`Secondary`},{name:`--color-avg-faint-blue`,value:`#e9f1fb`,group:`Secondary`},{name:`--color-avg-off-white-blue`,value:`#f2f8ff`,group:`Secondary`},{name:`--color-avg-alt-blue`,value:`#1d67bf`,group:`Secondary`},{name:`--color-avg-red`,value:`#db3559`,group:`Secondary`},{name:`--color-avg-yellow`,value:`#ffb600`,group:`Secondary`},{name:`--color-avg-pale-yellow`,value:`#ffe29e`,group:`Secondary`},{name:`--color-avg-faint-yellow`,value:`#fff2d4`,group:`Secondary`},{name:`--color-avg-off-white-yellow`,value:`#fff9ed`,group:`Secondary`},{name:`--color-avg-grey-1`,value:`#2b323f`,group:`Secondary`},{name:`--color-avg-grey-2`,value:`#3a4252`,group:`Secondary`},{name:`--color-avg-grey-3`,value:`#697284`,group:`Secondary`},{name:`--color-avg-grey-4`,value:`#9aa3b5`,group:`Secondary`},{name:`--color-avg-grey-5`,value:`#ced4e0`,group:`Secondary`},{name:`--color-avg-grey-6`,value:`#e4e8f0`,group:`Secondary`},{name:`--color-avg-grey-7`,value:`#edf0f7`,group:`Secondary`},{name:`--color-avg-grey-8`,value:`#f7f9fc`,group:`Secondary`},{name:`--color-avg-critical`,value:`#db3559`,group:`Functional`},{name:`--color-avg-attention`,value:`#ffb600`,group:`Functional`},{name:`--color-avg-success`,value:`#00783b`,group:`Functional`},{name:`--color-avg-info`,value:`#1d67bf`,group:`Functional`},{name:`--color-avg-neutral-50`,value:`#f4f4f5`,group:`Neutral`},{name:`--color-avg-neutral-100`,value:`#e8e9ea`,group:`Neutral`},{name:`--color-avg-neutral-200`,value:`#d2d3d5`,group:`Neutral`},{name:`--color-avg-neutral-300`,value:`#bbbdc1`,group:`Neutral`},{name:`--color-avg-neutral-400`,value:`#a4a7ac`,group:`Neutral`},{name:`--color-avg-neutral-500`,value:`#8e9197`,group:`Neutral`},{name:`--color-avg-neutral-600`,value:`#777a83`,group:`Neutral`},{name:`--color-avg-neutral-700`,value:`#60646e`,group:`Neutral`},{name:`--color-avg-neutral-800`,value:`#494e59`,group:`Neutral`},{name:`--color-avg-neutral-900`,value:`#333844`,group:`Neutral`}],_={brand:`AVG`,figmaNode:f,fileKey:p,checkedAt:m,groups:h,primitives:g}})))()}var y,b,x;function S(){return(S=e((()=>{d(),v(),y={title:`Design System/Colors`,parameters:{docs:{description:{component:"AVG color gallery — full Core Primitive Colours (Figma 21387:2623) plus contract semantics. Shared renderer from `@aics/storybook-core`; values from `themes/default/_colors.scss`."}}}},b={name:`Colors`,render:()=>c({brandLabel:`AVG`,brandPrimitives:_})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'Colors',
  render: () => renderColorsGallery({
    brandLabel: 'AVG',
    brandPrimitives
  })
}`,...b.parameters?.docs?.source}}},x=[`Default`]})))()}S();export{b as Default,x as __namedExportsOrder,y as default};