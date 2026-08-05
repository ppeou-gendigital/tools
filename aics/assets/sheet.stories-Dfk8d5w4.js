import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,St as n,Z as r,c as i,n as a,s as o,t as s,xt as c}from"./pretty-source-C_TZ5wEY.js";import"./button-DPO6711n.js";import"./icon-D6wgK3Ul.js";import{n as l,r as u,t as d}from"./figma-links-B0HkTJ7d.js";function f(e,t,n){e.dispatchEvent(new CustomEvent(`lifelock:sheet:${t}`,{bubbles:!0,composed:!0,detail:n}))}function p(e){let t=e.id;return!t||typeof document>`u`?null:document.querySelector(`[aria-controls="${t}"]`)||document.querySelector(`[data-sheet-trigger="${t}"]`)}function m(e){return Array.from(e.querySelectorAll(_)).filter(e=>!e.hasAttribute(`disabled`)&&e.getAttribute(`aria-hidden`)!==`true`)}function h(e,t={}){if(!e||e.dataset.sheetInitialized===`true`)return null;e.dataset.sheetInitialized=`true`;let n=(e.dataset.mode||`modal`)!==`non-modal`,r=e.querySelector(`[data-sheet-card]`)||e.querySelector(`.c-sheet__card`),i=e.querySelector(`[data-sheet-backdrop]`),a=e.querySelector(`[data-sheet-close]`),o=t.trigger||p(e),s=null;function c(){return!e.hasAttribute(`hidden`)}function l(i=`api`){if(s=document.activeElement,e.removeAttribute(`hidden`),o&&o.setAttribute(`aria-expanded`,`true`),n&&r){let e=m(r),n=t.initialFocus||r.querySelector(`[data-sheet-initial-focus]`)||a||e[0];n&&typeof n.focus==`function`&&n.focus()}f(e,`open`,{source:i,root:e})}function u(t=`api`){e.setAttribute(`hidden`,``),o&&o.setAttribute(`aria-expanded`,`false`),f(e,`close`,{source:t,root:e});let n=s||o;n&&typeof n.focus==`function`&&t!==`api`&&n.focus()}function d(e){if(!c())return;if(e.key===`Escape`){e.preventDefault(),u(`keyboard`);return}if(!n||e.key!==`Tab`||!r)return;let t=m(r);if(!t.length)return;let i=t[0],a=t[t.length-1];e.shiftKey&&document.activeElement===i?(e.preventDefault(),a.focus()):!e.shiftKey&&document.activeElement===a&&(e.preventDefault(),i.focus())}function h(e){n&&e.target===i&&u(`backdrop`)}function g(e){e.preventDefault(),u(`close-button`)}function _(e){e.preventDefault(),c()?u(`trigger`):l(`trigger`)}return o&&(o.setAttribute(`aria-haspopup`,`dialog`),o.setAttribute(`aria-expanded`,c()?`true`:`false`),e.id&&o.setAttribute(`aria-controls`,e.id),o.addEventListener(`click`,_)),i&&i.addEventListener(`click`,h),a&&a.addEventListener(`click`,g),e.addEventListener(`keydown`,d),{open:l,close:u,destroy(){o&&o.removeEventListener(`click`,_),i&&i.removeEventListener(`click`,h),a&&a.removeEventListener(`click`,g),e.removeEventListener(`keydown`,d),delete e.dataset.sheetInitialized}}}function g(e=document){let t=e.querySelectorAll?.(`[data-component="sheet"]`);return t?Array.from(t).map(e=>h(e)).filter(Boolean):[]}var _;function v(){return(v=e((()=>{_=`a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])`})))()}function y(){if(b||typeof document>`u`)return;b=!0;let e=()=>g(document);document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,e,{once:!0}):e(),new MutationObserver(()=>e()).observe(document.documentElement,{childList:!0,subtree:!0})}var b;function x(){return(x=e((()=>{v(),b=!1})))()}function S(e={}){return{layout:e.layout||`left`,mode:e.mode||`modal`,size:e.size||`compact`,cta:e.cta||`two`,buttonLayout:e.buttonLayout||`inline`,title:e.title??`Sheet title`,body:e.body??`Sheet body content for filters, details, or secondary tasks.`,bodyHtml:e.bodyHtml||``,supportingText:e.supportingText||``,primaryLabel:e.primaryLabel||`Apply`,secondaryLabel:e.secondaryLabel||`Cancel`,showClose:e.showClose!==!1,showDragHandle:!!e.showDragHandle,open:!!e.open,id:e.id||`sheet-demo`,className:e.className||``}}function C(e){return w(S(e))}var w,T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{t(),a(),u(),o(),c(),v(),x(),y(),w=r.default.compile(n),T=[`left`,`right`,`bottom`],E=[`modal`,`non-modal`],D=[`compact`,`medium`,`large`],O=[`two`,`one`,`none`],k=[`inline`,`stacked`],A=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28430&m=dev`,j=async({canvasElement:e})=>{g(e)},M={title:`Patterns/Sheet`,tags:[`autodocs`],parameters:{docs:{description:{component:`Edge sheet / bottom drawer with modal and non-modal modes. [Pattern / Sheets + Drawer](${A}). See \`spec.md\`.`}},design:d(`539:28430`)},argTypes:{layout:{control:{type:`inline-radio`},options:T,name:`Layout`},mode:{control:{type:`inline-radio`},options:E,name:`Mode`},size:{control:{type:`inline-radio`},options:D,name:`Size`},cta:{control:{type:`inline-radio`},options:O,name:`CTA`},buttonLayout:{control:{type:`inline-radio`},options:k,name:`Button layout`},title:{control:`text`,name:`Title`},body:{control:`text`,name:`Body`},primaryLabel:{control:`text`,name:`Primary label`},secondaryLabel:{control:`text`,name:`Secondary label`},showClose:{control:`boolean`,name:`Show close`},showDragHandle:{control:`boolean`,name:`Show drag handle`},open:{control:`boolean`,name:`Open`}},args:{layout:`left`,mode:`modal`,size:`compact`,cta:`two`,buttonLayout:`inline`,title:`Sheet title`,body:`Sheet body content for filters, details, or secondary tasks.`,primaryLabel:`Apply`,secondaryLabel:`Cancel`,showClose:!0,showDragHandle:!1,open:!0,id:`sheet-demo`}},N={name:`Demo`,render:e=>C({...e,open:!0}),parameters:s(C({open:!0}),{unit:`sheet`,scss:i})},P={name:`WithTrigger`,render:()=>`
      <div>
        <button type="button" class="btn btn--primary btn--m" aria-controls="sheet-trigger-demo" aria-haspopup="dialog" aria-expanded="false">
          Open sheet
        </button>
        ${C({id:`sheet-trigger-demo`,open:!1,layout:`right`,title:`Filters`,body:`Adjust filters, then apply. Escape or backdrop dismisses in modal mode.`})}
      </div>`,play:j},F={name:`AllStyles`,render:()=>{let e=[{layout:`left`,mode:`modal`,size:`compact`,cta:`two`},{layout:`right`,mode:`modal`,size:`medium`,cta:`one`},{layout:`bottom`,mode:`modal`,size:`compact`,cta:`two`,buttonLayout:`inline`},{layout:`bottom`,mode:`modal`,size:`compact`,cta:`two`,buttonLayout:`stacked`},{layout:`left`,mode:`non-modal`,size:`compact`,cta:`none`}].map(e=>`
        <div class="l-col l-col--sm--12 l-col--md--6 sbd-doc__card" style="padding:16px;gap:12px;">
          <div class="sbd-doc__card-canvas" style="position:relative;min-block-size:300px;background:var(--color-bg-subtle);overflow:hidden;">
            ${C({...e,open:!0,id:`sheet-${e.layout}-${e.mode}-${e.size}-${e.cta}-${e.buttonLayout||`inline`}`,title:`${e.layout} · ${e.size}`}).replace(`class="c-sheet`,`class="c-sheet" style="position:relative;inset:auto;min-block-size:320px;"`)}
          </div>
          <p class="sbd-doc__card-label">${e.layout} · ${e.mode} · ${e.size} · cta=${e.cta}${e.buttonLayout?` · ${e.buttonLayout}`:``}</p>
        </div>`).join(``);return`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma">${l(`539:28430`,`Sheets + Drawer`)} · ${l(`4522:67`,`Sheet · spec`)}</p>
        <section class="sbd-doc__section">
          <h2 class="sbd-doc__section-title">Layout × Mode samples</h2>
          <div class="l-row">${e}</div>
        </section>
      </div>`}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render({
    ...args,
    open: true
  }),
  parameters: htmlStoryParameters(render({
    open: true
  }), {
    unit: 'sheet',
    scss: scssSource
  })
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  name: 'WithTrigger',
  render: () => {
    const sheet = render({
      id: 'sheet-trigger-demo',
      open: false,
      layout: 'right',
      title: 'Filters',
      body: 'Adjust filters, then apply. Escape or backdrop dismisses in modal mode.'
    });
    return \`
      <div>
        <button type="button" class="btn btn--primary btn--m" aria-controls="sheet-trigger-demo" aria-haspopup="dialog" aria-expanded="false">
          Open sheet
        </button>
        \${sheet}
      </div>\`;
  },
  play: playInit
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => {
    const samples = [{
      layout: 'left',
      mode: 'modal',
      size: 'compact',
      cta: 'two'
    }, {
      layout: 'right',
      mode: 'modal',
      size: 'medium',
      cta: 'one'
    }, {
      layout: 'bottom',
      mode: 'modal',
      size: 'compact',
      cta: 'two',
      buttonLayout: 'inline'
    }, {
      layout: 'bottom',
      mode: 'modal',
      size: 'compact',
      cta: 'two',
      buttonLayout: 'stacked'
    }, {
      layout: 'left',
      mode: 'non-modal',
      size: 'compact',
      cta: 'none'
    }];
    const cards = samples.map(s => {
      const html = render({
        ...s,
        open: true,
        id: \`sheet-\${s.layout}-\${s.mode}-\${s.size}-\${s.cta}-\${s.buttonLayout || 'inline'}\`,
        title: \`\${s.layout} · \${s.size}\`
      }).replace('class="c-sheet', 'class="c-sheet" style="position:relative;inset:auto;min-block-size:320px;"');
      return \`
        <div class="l-col l-col--sm--12 l-col--md--6 sbd-doc__card" style="padding:16px;gap:12px;">
          <div class="sbd-doc__card-canvas" style="position:relative;min-block-size:300px;background:var(--color-bg-subtle);overflow:hidden;">
            \${html}
          </div>
          <p class="sbd-doc__card-label">\${s.layout} · \${s.mode} · \${s.size} · cta=\${s.cta}\${s.buttonLayout ? \` · \${s.buttonLayout}\` : ''}</p>
        </div>\`;
    }).join('');
    return \`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma">\${figmaFrameLink('539:28430', 'Sheets + Drawer')} · \${figmaFrameLink('4522:67', 'Sheet · spec')}</p>
        <section class="sbd-doc__section">
          <h2 class="sbd-doc__section-title">Layout × Mode samples</h2>
          <div class="l-row">\${cards}</div>
        </section>
      </div>\`;
  }
}`,...F.parameters?.docs?.source}}},I=[`Demo`,`WithTrigger`,`AllStyles`]})))()}L();export{F as AllStyles,N as Demo,P as WithTrigger,I as __namedExportsOrder,M as default};