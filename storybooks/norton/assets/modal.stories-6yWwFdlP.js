import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{L as t,R as n,i as r,n as i,r as a,t as o}from"./pretty-source-PtImQSP_.js";import"./button-DPO6711n.js";import"./icon-D6wgK3Ul.js";import{n as s,r as c,t as l}from"./figma-links-B0HkTJ7d.js";var u;function d(){return(d=e((()=>{u=`/**
 * Patterns/Modal — .c-modal
 * Figma: 1344:18518 / Overview 1359:21341.
 *
 * Size card widths: sm 320 / md 440 / lg 480.
 * Backdrop: --color-bg-primary at 70% opacity.
 * Card radius: --border-radius-dialog.
 * Card shadow: Spec 0 / 8px / 12px / 0.18 (component literal).
 */

.c-modal {
  box-sizing: border-box;
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
}

.c-modal[hidden] {
  display: none;
}

.c-modal__backdrop {
  position: absolute;
  inset: 0;
  background-color: color-mix(in srgb, var(--color-bg-primary) 70%, transparent);
}

.c-modal__card {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  inline-size: 100%;
  max-inline-size: 440px;
  max-block-size: min(90dvh, 100%);
  padding: var(--space-7);
  background-color: var(--color-bg-default);
  border-radius: var(--border-radius-dialog);
  box-shadow: 0 8px 12px 0 rgb(0 0 0 / 18%);
  color: var(--color-text-primary);
}

.c-modal--sm .c-modal__card {
  max-inline-size: 320px;
}

.c-modal--md .c-modal__card {
  max-inline-size: 440px;
}

.c-modal--lg .c-modal__card {
  max-inline-size: 480px;
}

.c-modal__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  inline-size: 100%;
}

.c-modal__title {
  flex: 1 1 auto;
  margin: 0;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-h6);
  line-height: var(--lineheight-h6);
  letter-spacing: var(--letterspacing-h6);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.c-modal__close {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  margin: 0;
  padding: var(--space-1);
  border: 0;
  border-radius: var(--border-radius-s);
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
}

.c-modal__close:focus-visible {
  outline: var(--border-width-s) solid var(--color-border-focus);
  outline-offset: 2px;
}

.c-modal__body {
  inline-size: 100%;
}

.c-modal__body--scroll {
  overflow-y: auto;
  max-block-size: 240px;
}

.c-modal__description {
  margin: 0;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  letter-spacing: var(--letterspacing-body-base);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
}

.c-modal__media {
  inline-size: 100%;
  overflow: clip;
  border-radius: var(--border-radius-s);
}

.c-modal__media-placeholder {
  block-size: 160px;
  background-color: var(--color-bg-subtle);
}

.c-modal__media img,
.c-modal__media video {
  display: block;
  inline-size: 100%;
  block-size: auto;
}

.c-modal__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  inline-size: 100%;
}

.c-modal--scrollable .c-modal__body--scroll {
  max-block-size: 280px;
}
`})))()}function f(e,t,n){e.dispatchEvent(new CustomEvent(`lifelock:modal:${t}`,{bubbles:!0,composed:!0,detail:n}))}function p(e){let t=e.id;return!t||typeof document>`u`?null:document.querySelector(`[aria-controls="${t}"]`)||document.querySelector(`[data-modal-trigger="${t}"]`)}function m(e){return Array.from(e.querySelectorAll(_)).filter(e=>!e.hasAttribute(`disabled`)&&e.getAttribute(`aria-hidden`)!==`true`)}function h(e,t={}){if(!e||e.dataset.modalInitialized===`true`)return null;e.dataset.modalInitialized=`true`;let n=e.querySelector(`[data-modal-card]`)||e.querySelector(`.c-modal__card`),r=e.querySelector(`[data-modal-backdrop]`),i=e.querySelector(`[data-modal-close]`),a=t.trigger||p(e),o=null;function s(){return!e.hasAttribute(`hidden`)}function c(r=`api`){o=document.activeElement,e.removeAttribute(`hidden`),a&&a.setAttribute(`aria-expanded`,`true`);let s=n?m(n):[],c=t.initialFocus||n&&n.querySelector(`[data-modal-initial-focus]`)||i||s[0];c&&typeof c.focus==`function`&&c.focus(),f(e,`open`,{source:r,root:e})}function l(t=`api`){e.setAttribute(`hidden`,``),a&&a.setAttribute(`aria-expanded`,`false`),f(e,`close`,{source:t,root:e});let n=o||a;n&&typeof n.focus==`function`&&t!==`api`&&n.focus()}function u(e){if(!s())return;if(e.key===`Escape`){e.preventDefault(),l(`keyboard`);return}if(e.key!==`Tab`||!n)return;let t=m(n);if(!t.length)return;let r=t[0],i=t[t.length-1];e.shiftKey&&document.activeElement===r?(e.preventDefault(),i.focus()):!e.shiftKey&&document.activeElement===i&&(e.preventDefault(),r.focus())}function d(e){e.target===r&&l(`backdrop`)}function h(e){e.preventDefault(),l(`close-button`)}function g(e){e.preventDefault(),s()?l(`trigger`):c(`trigger`)}return a&&(a.setAttribute(`aria-haspopup`,`dialog`),a.setAttribute(`aria-expanded`,s()?`true`:`false`),e.id&&a.setAttribute(`aria-controls`,e.id),a.addEventListener(`click`,g)),r&&r.addEventListener(`click`,d),i&&i.addEventListener(`click`,h),e.addEventListener(`keydown`,u),{open:c,close:l,destroy(){a&&a.removeEventListener(`click`,g),r&&r.removeEventListener(`click`,d),i&&i.removeEventListener(`click`,h),e.removeEventListener(`keydown`,u),delete e.dataset.modalInitialized}}}function g(e=document){let t=e.querySelectorAll?.(`[data-component="modal"]`);return t?Array.from(t).map(e=>h(e)).filter(Boolean):[]}var _;function v(){return(v=e((()=>{_=`a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])`})))()}function y(){if(b||typeof document>`u`)return;b=!0;let e=()=>g(document);document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,e,{once:!0}):e(),new MutationObserver(()=>e()).observe(document.documentElement,{childList:!0,subtree:!0})}var b;function x(){return(x=e((()=>{v(),b=!1})))()}function S(e={}){return{variant:e.variant||`standard`,size:e.size||`md`,title:e.title??`Modal title`,body:e.body??`Supporting description text.`,mediaHtml:e.mediaHtml||``,primaryLabel:e.primaryLabel||`Continue`,secondaryLabel:e.secondaryLabel||`Cancel`,showSecondary:e.showSecondary!==!1,showClose:e.showClose!==!1,open:!!e.open,id:e.id||`modal-demo`,className:e.className||``}}function C(e){return w(S(e))}var w,T,E,D,O,k,A,j,M,N;function P(){return(P=e((()=>{r(),i(),c(),d(),t(),v(),x(),y(),w=a.default.compile(n),T=[`standard`,`scrollable`,`media`],E=[`sm`,`md`,`lg`],D=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28427&m=dev`,O=async({canvasElement:e})=>{g(e)},k={title:`Patterns/Modal`,tags:[`autodocs`],parameters:{docs:{description:{component:`Interruptive dialog with backdrop, focus trap, and primary + text footer. [Pattern / Modal](${D}). See \`spec.md\`.`}},design:l(`1344:18518`)},argTypes:{variant:{control:{type:`inline-radio`},options:T,name:`Variant`},size:{control:{type:`inline-radio`},options:E,name:`Size`},title:{control:`text`,name:`Title`},body:{control:`text`,name:`Body`},primaryLabel:{control:`text`,name:`Primary label`},secondaryLabel:{control:`text`,name:`Secondary label`},showSecondary:{control:`boolean`,name:`Show secondary`},showClose:{control:`boolean`,name:`Show close`},open:{control:`boolean`,name:`Open`}},args:{variant:`standard`,size:`md`,title:`Modal title`,body:`Supporting description text.`,primaryLabel:`Continue`,secondaryLabel:`Cancel`,showSecondary:!0,showClose:!0,open:!0,id:`modal-demo`}},A={name:`Demo`,render:e=>C({...e,open:!0}),parameters:o(C({open:!0}),{unit:`modal`,scss:u})},j={name:`WithTrigger`,render:()=>`
      <div>
        <button type="button" class="btn btn--primary btn--m" aria-controls="modal-trigger-demo" aria-haspopup="dialog" aria-expanded="false">
          Open modal
        </button>
        ${C({id:`modal-trigger-demo`,open:!1,title:`Continue?`,body:`Confirm to proceed with this action. You can cancel and come back later.`})}
      </div>`,play:O},M={name:`AllStyles`,render:()=>{let e=T.flatMap(e=>E.map(t=>`
        <div class="l-col l-col--sm--12 l-col--md--6 sbd-doc__card" style="padding:16px;gap:12px;min-block-size:280px;">
          <div class="sbd-doc__card-canvas" style="position:relative;min-block-size:220px;background:var(--color-bg-subtle);">
            <div style="position:absolute;inset:12px;display:flex;align-items:center;justify-content:center;">
              ${C({variant:e,size:t,open:!0,id:`modal-${e}-${t}`,title:`${e} · ${t}`,body:e===`scrollable`?`Scrollable body. `.repeat(12).trim():`Supporting description text.`}).replace(`class="c-modal`,`class="c-modal" style="position:relative;inset:auto;padding:0;min-block-size:200px;"`)}
            </div>
          </div>
          <p class="sbd-doc__card-label">${e} · ${t}</p>
        </div>`)).join(``);return`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma">${s(`1344:18518`,`Modal`)}</p>
        <section class="sbd-doc__section">
          <h2 class="sbd-doc__section-title">Variant × Size</h2>
          <div class="l-row">${e}</div>
        </section>
      </div>`}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render({
    ...args,
    open: true
  }),
  parameters: htmlStoryParameters(render({
    open: true
  }), {
    unit: 'modal',
    scss: scssSource
  })
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  name: 'WithTrigger',
  render: () => {
    const modal = render({
      id: 'modal-trigger-demo',
      open: false,
      title: 'Continue?',
      body: 'Confirm to proceed with this action. You can cancel and come back later.'
    });
    return \`
      <div>
        <button type="button" class="btn btn--primary btn--m" aria-controls="modal-trigger-demo" aria-haspopup="dialog" aria-expanded="false">
          Open modal
        </button>
        \${modal}
      </div>\`;
  },
  play: playInit
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => {
    const cards = VARIANT_OPTIONS.flatMap(variant => SIZE_OPTIONS.map(size => \`
        <div class="l-col l-col--sm--12 l-col--md--6 sbd-doc__card" style="padding:16px;gap:12px;min-block-size:280px;">
          <div class="sbd-doc__card-canvas" style="position:relative;min-block-size:220px;background:var(--color-bg-subtle);">
            <div style="position:absolute;inset:12px;display:flex;align-items:center;justify-content:center;">
              \${render({
      variant,
      size,
      open: true,
      id: \`modal-\${variant}-\${size}\`,
      title: \`\${variant} · \${size}\`,
      body: variant === 'scrollable' ? 'Scrollable body. '.repeat(12).trim() : 'Supporting description text.'
    }).replace('class="c-modal', 'class="c-modal" style="position:relative;inset:auto;padding:0;min-block-size:200px;"')}
            </div>
          </div>
          <p class="sbd-doc__card-label">\${variant} · \${size}</p>
        </div>\`)).join('');
    return \`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma">\${figmaFrameLink('1344:18518', 'Modal')}</p>
        <section class="sbd-doc__section">
          <h2 class="sbd-doc__section-title">Variant × Size</h2>
          <div class="l-row">\${cards}</div>
        </section>
      </div>\`;
  }
}`,...M.parameters?.docs?.source}}},N=[`Demo`,`WithTrigger`,`AllStyles`]})))()}P();export{M as AllStyles,A as Demo,j as WithTrigger,N as __namedExportsOrder,k as default};