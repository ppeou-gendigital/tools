import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{U as t,W as n,i as r,n as i,r as a,t as o}from"./pretty-source-CIqFBFpl.js";import"./button-DPO6711n.js";import"./icon-D6wgK3Ul.js";import{n as s,r as c,t as l}from"./figma-links-B0HkTJ7d.js";import"./menu-list-D7nEnhjo.js";import"./menu-block-BaRfgLtl.js";var u;function d(){return(d=e((()=>{u=`/**
 * Patterns/Menu block — core (.c-menu-block).
 * Figma: MenuBlock 1396:4886 / Spec 4647:135.
 *
 * Type → --simple | --with-caption
 * Size → --size-large | --size-small
 * Chrome → --shadow | --keyline
 */

.c-menu-block {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  min-inline-size: 144px;
  max-inline-size: 100%;
  padding-block: var(--space-3);
  padding-inline: 0;
  background-color: var(--color-bg-default);
  border-radius: var(--border-radius-l);
  color: var(--color-text-primary);
}

.c-menu-block--with-caption {
  min-inline-size: 228px;
}

.c-menu-block--shadow {
  box-shadow: var(--shadow-menu-block);
}

.c-menu-block--keyline {
  border: var(--border-width-xs) solid var(--color-border-subtle);
}

.c-menu-block__items {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin-block: 0;
  margin-inline: 0;
  padding-block: 0;
  padding-inline: 0;
  list-style: none;
  inline-size: 100%;
}

.c-menu-block--popup {
  z-index: 20;
}

.c-menu-block--popup[hidden] {
  display: none;
}

/* With-caption: first Caption row gets Spec padding (space-4 inline already
   from edge-pad; reinforce block-start). */
.c-menu-block--with-caption .c-menu-list--caption:first-child .c-menu-list__caption {
  padding-block-start: var(--space-6);
  padding-block-end: var(--space-3);
}
`})))()}function f(e){return Array.from(e.querySelectorAll(`.c-menu-list--row:not(.is-disabled) .c-menu-list__control`))}function p(e,t,n){e.dispatchEvent(new CustomEvent(`lifelock:menu-block:${t}`,{bubbles:!0,composed:!0,detail:n}))}function m(e){let t=e.id;return!t||typeof document>`u`?null:document.querySelector(`[aria-controls="${t}"]`)||document.querySelector(`[data-menu-block-trigger="${t}"]`)}function h(e,t={}){if(!e||e.dataset.menuBlockInitialized===`true`||e.getAttribute(`data-mode`)!==`popup`)return null;e.dataset.menuBlockInitialized=`true`;let n=t.trigger||m(e)||null;function r(){return!e.hasAttribute(`hidden`)}function i(t=`api`){e.removeAttribute(`hidden`),n&&(n.setAttribute(`aria-expanded`,`true`),n.setAttribute(`aria-haspopup`,`menu`));let r=f(e);r[0]&&r[0].focus(),p(e,`open`,{source:t})}function a(t=`api`){e.setAttribute(`hidden`,``),n&&(n.setAttribute(`aria-expanded`,`false`),t!==`api`&&n.focus()),p(e,`close`,{source:t})}function o(e=`api`){r()?a(e):i(e)}function s(e){e.preventDefault(),o(`trigger`)}function c(t){if(!r())return;let n=f(e);if(!n.length)return;let i=document.activeElement,o=n.indexOf(i);if(t.key===`Escape`){t.preventDefault(),a(`keyboard`);return}if(t.key===`ArrowDown`){t.preventDefault(),n[o<0?0:(o+1)%n.length].focus();return}if(t.key===`ArrowUp`){t.preventDefault(),n[o<0?n.length-1:(o-1+n.length)%n.length].focus();return}if(t.key===`Home`){t.preventDefault(),n[0].focus();return}if(t.key===`End`){t.preventDefault(),n[n.length-1].focus();return}t.key===`Tab`&&n.length&&(t.shiftKey&&i===n[0]?(t.preventDefault(),n[n.length-1].focus()):!t.shiftKey&&i===n[n.length-1]&&(t.preventDefault(),n[0].focus()))}function l(t){let n=t.target.closest?.(`.c-menu-list__control`);!n||!e.contains(n)||p(e,`select`,{text:n.closest(`.c-menu-list--row`)?.querySelector(`.c-menu-list__label`)?.textContent?.trim()||``,source:`pointer`})}return n&&(n.setAttribute(`aria-haspopup`,`menu`),n.setAttribute(`aria-expanded`,r()?`true`:`false`),e.id&&n.setAttribute(`aria-controls`,e.id),n.addEventListener(`click`,s)),e.addEventListener(`keydown`,c),e.addEventListener(`click`,l),{open:i,close:a,toggle:o,destroy(){n&&n.removeEventListener(`click`,s),e.removeEventListener(`keydown`,c),e.removeEventListener(`click`,l),delete e.dataset.menuBlockInitialized}}}function g(e=document){let t=e.querySelectorAll?.(`[data-component="menu-block"][data-mode="popup"]`);return t?Array.from(t).map(e=>h(e)).filter(Boolean):[]}function _(){return(_=e((()=>{})))()}function v(){if(y||typeof window>`u`)return;y=!0;let e=()=>{g(document.querySelector(`#storybook-root`)||document.body)};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,e,{once:!0}):queueMicrotask(e),new MutationObserver(()=>{queueMicrotask(e)}).observe(document.documentElement,{childList:!0,subtree:!0})}var y;function b(){return(b=e((()=>{_(),y=!1})))()}function x(e,t){let n=t===`popup`?`menuitem`:`listitem`;return(e||[]).map(e=>e.type===`divider`?{...e}:e.type===`caption`?{...e,role:`presentation`}:{...e,role:e.role||n})}function S(e={}){let t=e.mode||`static`,n=e.type||`simple`,r=e.items||(n===`with-caption`?A:k);return{type:n,size:e.size||`large`,showDropShadow:e.showDropShadow!==!1,showKeyline:e.showKeyline!==!1,mode:t,listRole:e.listRole||(t===`popup`?`menu`:`list`),items:x(r,t),id:e.id||``,hidden:!!e.hidden,className:e.className||``}}function C(e){return w(S(e))}var w,T,E,D,O,k,A,j,M,N,P,F,I,L;function R(){return(R=e((()=>{r(),i(),c(),d(),t(),_(),b(),v(),w=a.default.compile(n),T=[`simple`,`with-caption`],E=[`large`,`small`],D=[`static`,`popup`],O=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28419&m=dev`,k=[{type:`row`,text:`Account`,leftIcon:!0,role:`listitem`},{type:`row`,text:`Preferences`,leftIcon:!0,role:`listitem`},{type:`divider`},{type:`row`,text:`Sign out`,leftIcon:!0,role:`listitem`}],A=[{type:`caption`,text:`Account`,role:`presentation`},{type:`row`,text:`Profile`,leftIcon:!0,role:`listitem`},{type:`row`,text:`Billing`,leftIcon:!0,role:`listitem`},{type:`divider`},{type:`row`,text:`Sign out`,leftIcon:!0,role:`listitem`}],j=async({canvasElement:e})=>{g(e)},M={title:`Patterns/Menu block`,tags:[`autodocs`],parameters:{docs:{description:{component:`Menu chrome inherited from core. [Pattern / MenuBlock](${O}). See \`spec.md\`.`}},design:l(`1396:4886`)},argTypes:{type:{control:{type:`inline-radio`},options:T,name:`Type`},size:{control:{type:`inline-radio`},options:E,name:`Size`},mode:{control:{type:`inline-radio`},options:D,name:`Mode`},showDropShadow:{control:`boolean`,name:`Show drop shadow`},showKeyline:{control:`boolean`,name:`Show keyline`},items:{control:`object`,name:`Items`}},args:{type:`simple`,size:`large`,mode:`static`,showDropShadow:!0,showKeyline:!0,items:k}},N={name:`Demo`,render:e=>C(e),parameters:o(C({}),{unit:`menu-block`,scss:u})},P={name:`WithCaption`,args:{type:`with-caption`,items:A},render:e=>C(e)},F={name:`Popup`,render:()=>`
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:12px;">
        <button type="button" class="btn btn--primary btn--l" aria-controls="menu-block-popup-demo" aria-haspopup="menu" aria-expanded="false">
          Open menu
        </button>
        ${C({type:`simple`,mode:`popup`,id:`menu-block-popup-demo`,hidden:!0,items:[{type:`row`,text:`Open settings`,leftIcon:!0},{type:`row`,text:`Copy link`,leftIcon:!0},{type:`divider`},{type:`row`,text:`Delete`,leftIcon:!0}]})}
      </div>`,play:j},I={name:`AllStyles`,render:()=>`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">${s(`1396:4886`,`Menu block`)}</p>
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Type × Size</h2>
        <div class="l-row">
          <div class="l-col l-col--sm--6 l-col--md--4 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">${C({type:`simple`,size:`large`})}</div>
            <p class="sbd-doc__card-label">Simple · Large</p>
          </div>
          <div class="l-col l-col--sm--6 l-col--md--4 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">${C({type:`simple`,size:`small`})}</div>
            <p class="sbd-doc__card-label">Simple · Small</p>
          </div>
          <div class="l-col l-col--sm--6 l-col--md--4 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">${C({type:`with-caption`,size:`large`,items:A})}</div>
            <p class="sbd-doc__card-label">With caption · Large</p>
          </div>
          <div class="l-col l-col--sm--6 l-col--md--4 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">${C({type:`simple`,showDropShadow:!1})}</div>
            <p class="sbd-doc__card-label">No shadow</p>
          </div>
        </div>
      </section>
    </div>
  `},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render({}), {
    unit: 'menu-block',
    scss: scssSource
  })
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  name: 'WithCaption',
  args: {
    type: 'with-caption',
    items: CAPTION_ITEMS
  },
  render: args => render(args)
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  name: 'Popup',
  render: () => {
    const block = render({
      type: 'simple',
      mode: 'popup',
      id: 'menu-block-popup-demo',
      hidden: true,
      items: [{
        type: 'row',
        text: 'Open settings',
        leftIcon: true
      }, {
        type: 'row',
        text: 'Copy link',
        leftIcon: true
      }, {
        type: 'divider'
      }, {
        type: 'row',
        text: 'Delete',
        leftIcon: true
      }]
    });
    return \`
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:12px;">
        <button type="button" class="btn btn--primary btn--l" aria-controls="menu-block-popup-demo" aria-haspopup="menu" aria-expanded="false">
          Open menu
        </button>
        \${block}
      </div>\`;
  },
  play: playInit
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => \`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">\${figmaFrameLink('1396:4886', 'Menu block')}</p>
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Type × Size</h2>
        <div class="l-row">
          <div class="l-col l-col--sm--6 l-col--md--4 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">\${render({
    type: 'simple',
    size: 'large'
  })}</div>
            <p class="sbd-doc__card-label">Simple · Large</p>
          </div>
          <div class="l-col l-col--sm--6 l-col--md--4 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">\${render({
    type: 'simple',
    size: 'small'
  })}</div>
            <p class="sbd-doc__card-label">Simple · Small</p>
          </div>
          <div class="l-col l-col--sm--6 l-col--md--4 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">\${render({
    type: 'with-caption',
    size: 'large',
    items: CAPTION_ITEMS
  })}</div>
            <p class="sbd-doc__card-label">With caption · Large</p>
          </div>
          <div class="l-col l-col--sm--6 l-col--md--4 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">\${render({
    type: 'simple',
    showDropShadow: false
  })}</div>
            <p class="sbd-doc__card-label">No shadow</p>
          </div>
        </div>
      </section>
    </div>
  \`
}`,...I.parameters?.docs?.source}}},L=[`Demo`,`WithCaption`,`Popup`,`AllStyles`]})))()}R();export{I as AllStyles,N as Demo,F as Popup,P as WithCaption,L as __namedExportsOrder,M as default};