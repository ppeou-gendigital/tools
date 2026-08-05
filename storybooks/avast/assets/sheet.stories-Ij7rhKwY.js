import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{A as t,i as n,k as r,n as i,r as a,t as o}from"./pretty-source-CIqFBFpl.js";import"./button-DPO6711n.js";import"./icon-D6wgK3Ul.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";function l(e,t,n){e.dispatchEvent(new CustomEvent(`lifelock:sheet:${t}`,{bubbles:!0,composed:!0,detail:n}))}function u(e){let t=e.id;return!t||typeof document>`u`?null:document.querySelector(`[aria-controls="${t}"]`)||document.querySelector(`[data-sheet-trigger="${t}"]`)}function d(e){return Array.from(e.querySelectorAll(m)).filter(e=>!e.hasAttribute(`disabled`)&&e.getAttribute(`aria-hidden`)!==`true`)}function f(e,t={}){if(!e||e.dataset.sheetInitialized===`true`)return null;e.dataset.sheetInitialized=`true`;let n=(e.dataset.mode||`modal`)!==`non-modal`,r=e.querySelector(`[data-sheet-card]`)||e.querySelector(`.c-sheet__card`),i=e.querySelector(`[data-sheet-backdrop]`),a=e.querySelector(`[data-sheet-close]`),o=t.trigger||u(e),s=null;function c(){return!e.hasAttribute(`hidden`)}function f(i=`api`){if(s=document.activeElement,e.removeAttribute(`hidden`),o&&o.setAttribute(`aria-expanded`,`true`),n&&r){let e=d(r),n=t.initialFocus||r.querySelector(`[data-sheet-initial-focus]`)||a||e[0];n&&typeof n.focus==`function`&&n.focus()}l(e,`open`,{source:i,root:e})}function p(t=`api`){e.setAttribute(`hidden`,``),o&&o.setAttribute(`aria-expanded`,`false`),l(e,`close`,{source:t,root:e});let n=s||o;n&&typeof n.focus==`function`&&t!==`api`&&n.focus()}function m(e){if(!c())return;if(e.key===`Escape`){e.preventDefault(),p(`keyboard`);return}if(!n||e.key!==`Tab`||!r)return;let t=d(r);if(!t.length)return;let i=t[0],a=t[t.length-1];e.shiftKey&&document.activeElement===i?(e.preventDefault(),a.focus()):!e.shiftKey&&document.activeElement===a&&(e.preventDefault(),i.focus())}function h(e){n&&e.target===i&&p(`backdrop`)}function g(e){e.preventDefault(),p(`close-button`)}function _(e){e.preventDefault(),c()?p(`trigger`):f(`trigger`)}return o&&(o.setAttribute(`aria-haspopup`,`dialog`),o.setAttribute(`aria-expanded`,c()?`true`:`false`),e.id&&o.setAttribute(`aria-controls`,e.id),o.addEventListener(`click`,_)),i&&i.addEventListener(`click`,h),a&&a.addEventListener(`click`,g),e.addEventListener(`keydown`,m),{open:f,close:p,destroy(){o&&o.removeEventListener(`click`,_),i&&i.removeEventListener(`click`,h),a&&a.removeEventListener(`click`,g),e.removeEventListener(`keydown`,m),delete e.dataset.sheetInitialized}}}function p(e=document){let t=e.querySelectorAll?.(`[data-component="sheet"]`);return t?Array.from(t).map(e=>f(e)).filter(Boolean):[]}var m;function h(){return(h=e((()=>{m=`a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])`})))()}function g(){if(_||typeof document>`u`)return;_=!0;let e=()=>p(document);document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,e,{once:!0}):e(),new MutationObserver(()=>e()).observe(document.documentElement,{childList:!0,subtree:!0})}var _;function v(){return(v=e((()=>{h(),_=!1})))()}function y(e={}){return{layout:e.layout||`left`,mode:e.mode||`modal`,size:e.size||`compact`,cta:e.cta||`two`,buttonLayout:e.buttonLayout||`inline`,title:e.title??`Sheet title`,body:e.body??`Sheet body content for filters, details, or secondary tasks.`,primaryLabel:e.primaryLabel||`Apply`,secondaryLabel:e.secondaryLabel||`Cancel`,showClose:e.showClose!==!1,showDragHandle:!!e.showDragHandle,open:!!e.open,id:e.id||`sheet-demo`,className:e.className||``}}var b,x,S,C,w,T;function E(){return(E=e((()=>{n(),r(),i(),s(),h(),v(),g(),b=a.default.compile(t),x=async({canvasElement:e})=>{p(e)},S={title:`Patterns/Sheet`,tags:[`autodocs`,`shared-library`],render:e=>b(y(e)),args:{layout:`left`,mode:`modal`,size:`compact`,cta:`two`,buttonLayout:`inline`,title:`Sheet title`,body:`Sheet body content for filters, details, or secondary tasks.`,primaryLabel:`Apply`,secondaryLabel:`Cancel`,showClose:!0,open:!0,id:`sheet-demo`},argTypes:{layout:{control:{type:`inline-radio`},options:[`left`,`right`,`bottom`],name:`Layout`},mode:{control:{type:`inline-radio`},options:[`modal`,`non-modal`],name:`Mode`},size:{control:{type:`inline-radio`},options:[`compact`,`medium`,`large`],name:`Size`},cta:{control:{type:`inline-radio`},options:[`two`,`one`,`none`],name:`CTA`},open:{control:`boolean`,name:`Open`}},parameters:{badges:[`shared`],design:c(`539:28430`)}},C={render:e=>b(y({...e,open:!0})),parameters:o(b(y({open:!0})),{unit:`sheet`})},w={render:()=>`
      <div>
        <button type="button" class="btn btn--primary btn--m" aria-controls="sheet-trigger-demo" aria-haspopup="dialog" aria-expanded="false">
          Open sheet
        </button>
        ${b(y({id:`sheet-trigger-demo`,open:!1,layout:`right`,title:`Filters`,body:`Adjust filters, then apply.`}))}
      </div>`,play:x},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => compiled(normalize({
    ...args,
    open: true
  })),
  parameters: htmlStoryParameters(compiled(normalize({
    open: true
  })), {
    unit: 'sheet'
  })
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => {
    const sheet = compiled(normalize({
      id: 'sheet-trigger-demo',
      open: false,
      layout: 'right',
      title: 'Filters',
      body: 'Adjust filters, then apply.'
    }));
    return \`
      <div>
        <button type="button" class="btn btn--primary btn--m" aria-controls="sheet-trigger-demo" aria-haspopup="dialog" aria-expanded="false">
          Open sheet
        </button>
        \${sheet}
      </div>\`;
  },
  play: playInit
}`,...w.parameters?.docs?.source}}},T=[`Demo`,`WithTrigger`]})))()}E();export{C as Demo,w as WithTrigger,T as __namedExportsOrder,S as default};