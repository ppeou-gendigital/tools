import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{At as t,Dt as n,Q as r,Z as i,kt as a,m as o,n as s,p as c,t as l}from"./pretty-source-C_TZ5wEY.js";import"./button-DPO6711n.js";import"./icon-D6wgK3Ul.js";import{n as u,r as d,t as f}from"./figma-links-B0HkTJ7d.js";import"./menu-list-D7nEnhjo.js";import"./menu-block-BaRfgLtl.js";function p(e,t,n){e.dispatchEvent(new CustomEvent(`lifelock:pagination:change`,{bubbles:!0,composed:!0,detail:{page:t,root:e,source:n}}))}function m(e,t){let n=Math.max(1,Number(t)||1);return Math.min(n,Math.max(1,Number(e)||1))}function h(e,t={}){if(!e||e.dataset.paginationInitialized===`true`)return null;e.dataset.paginationInitialized=`true`;let n=e.getAttribute(`data-pagination-type`)||`nav`,r=Number(t.currentPage||e.dataset.currentPage||1),i=Number(t.totalPages||e.dataset.totalPages||1);function a(n,a){r=m(n,i),e.dataset.currentPage=String(r),typeof t.onChange==`function`&&t.onChange(r),p(e,r,a)}function o(t){let n=t.target.closest?.(`[data-pagination-page], [data-pagination-step]`);if(!(!n||!e.contains(n)||n.disabled)){if(t.preventDefault(),n.hasAttribute(`data-pagination-step`)){let e=Number(n.getAttribute(`data-pagination-step`))||0;a(r+e,`nav`);return}a(n.getAttribute(`data-pagination-page`),`nav`)}}function s(t){t.preventDefault();let n=e.classList.toggle(`is-open`),r=e.querySelector(`[data-pagination-select-trigger]`);r&&r.setAttribute(`aria-expanded`,n?`true`:`false`)}function c(t){let n=t.target.closest?.(`.c-menu-list__control`);if(!n||!e.contains(n))return;let r=n.closest(`.c-menu-list--row`),i=Number(r?.getAttribute(`data-page`)||n.textContent);if(!Number.isFinite(i))return;e.classList.remove(`is-open`);let o=e.querySelector(`[data-pagination-select-trigger]`);o&&o.setAttribute(`aria-expanded`,`false`),a(i,`select`)}function l(t){t.preventDefault();let n=e.querySelector(`[data-pagination-jump-input]`);n&&a(n.value,`jump`)}function u(e){e.key===`Enter`&&l(e)}if(n===`nav`&&e.addEventListener(`click`,o),n===`select`){let t=e.querySelector(`[data-pagination-select-trigger]`);t&&t.addEventListener(`click`,s),e.addEventListener(`click`,c)}if(n===`jump`){let t=e.querySelector(`[data-pagination-jump-submit]`),n=e.querySelector(`[data-pagination-jump-input]`);t&&t.addEventListener(`click`,l),n&&n.addEventListener(`keydown`,u)}return{setPage:e=>a(e,`api`),getPage:()=>r,destroy(){e.removeEventListener(`click`,o),e.removeEventListener(`click`,c);let t=e.querySelector(`[data-pagination-select-trigger]`);t&&t.removeEventListener(`click`,s);let n=e.querySelector(`[data-pagination-jump-submit]`),r=e.querySelector(`[data-pagination-jump-input]`);n&&n.removeEventListener(`click`,l),r&&r.removeEventListener(`keydown`,u),delete e.dataset.paginationInitialized}}}function g(e=document){let t=e.querySelectorAll?.(`[data-component="pagination"]`);return t?Array.from(t).map(e=>h(e)).filter(Boolean):[]}function _(){if(v||typeof document>`u`)return;v=!0;let e=()=>g(document);document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,e,{once:!0}):e(),new MutationObserver(()=>e()).observe(document.documentElement,{childList:!0,subtree:!0})}var v;function y(){return(y=e((()=>{v=!1})))()}function b(e,t){return Array.from({length:e},(e,n)=>{let r=n+1;return{type:`row`,text:String(r),selected:r===t,role:`option`,className:``}})}function x(e={}){let t=e.type||`nav`,r=Number(e.currentPage)||1,i=Number(e.totalPages)||5;return{type:t,currentPage:r,totalPages:i,pages:e.pages||n({currentPage:r,totalPages:i,siblingCount:e.siblingCount??1,truncate:e.truncate!==!1}),selectItems:e.selectItems||b(i,r),showFirstLast:!!e.showFirstLast,disabled:!!e.disabled,error:!!e.error,errorMessage:e.errorMessage||``,size:e.size||`large`,jumpType:e.jumpType||`labelled`,jumpLabel:e.jumpLabel||`Go`,jumpValue:e.jumpValue??``,selectLabel:e.selectLabel||`Page ${r}`,open:!!e.open,id:e.id||``,accessibleLabel:e.accessibleLabel||`Pagination`,className:e.className||``}}function S(e){let t=x(e);return C(t).replace(`data-component="pagination"`,`data-component="pagination" data-current-page="${t.currentPage}" data-total-pages="${t.totalPages}"`)}var C,w,T,E,D,O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{r(),s(),d(),c(),a(),y(),_(),C=i.default.compile(t),w=[`nav`,`select`,`jump`],T=[`large`,`small`],E=[`labelled`,`icon-only`],D=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28422&m=dev`,O=async({canvasElement:e})=>{g(e)},k={title:`Patterns/Pagination`,tags:[`autodocs`],parameters:{docs:{description:{component:`Numbered pager with nav / select / jump types. [Pattern / Pagination](${D}). Distinct from Pagination dots.`}},design:f(`1332:52356`)},argTypes:{type:{control:{type:`inline-radio`},options:w,name:`Type`},currentPage:{control:{type:`number`},name:`Current page`},totalPages:{control:{type:`number`},name:`Total pages`},showFirstLast:{control:`boolean`,name:`Show first/last`},truncate:{control:`boolean`,name:`Truncate`},disabled:{control:`boolean`,name:`Disabled`},error:{control:`boolean`,name:`Error`},size:{control:{type:`inline-radio`},options:T,name:`Size (jump)`},jumpType:{control:{type:`inline-radio`},options:E,name:`Jump type`},open:{control:`boolean`,name:`Select open`}},args:{type:`nav`,currentPage:3,totalPages:5,showFirstLast:!1,truncate:!0,disabled:!1,error:!1,size:`large`,jumpType:`labelled`,open:!1}},A={name:`Demo`,render:e=>S(e),play:O,parameters:l(S({}),{unit:`pagination`,scss:o})},j={name:`Nav`,args:{type:`nav`,currentPage:3,totalPages:5},render:e=>S({...e,type:`nav`}),play:O},M={name:`Select`,args:{type:`select`,currentPage:2,totalPages:8,open:!0},render:e=>S({...e,type:`select`}),play:O},N={name:`Jump`,args:{type:`jump`,totalPages:100,jumpValue:``},render:e=>S({...e,type:`jump`}),play:O},P={name:`AllStyles`,render:()=>`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">
        ${u(`1332:52356`,`Pagination nav`)} ·
        ${u(`1332:52459`,`Page selector`)} ·
        ${u(`1332:52580`,`Page jump`)}
      </p>
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Types</h2>
        <div class="l-row">
          <div class="l-col l-col--sm--12 l-col--md--6 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">${S({type:`nav`,currentPage:3,totalPages:5})}</div>
            <p class="sbd-doc__card-label">Nav</p>
          </div>
          <div class="l-col l-col--sm--12 l-col--md--6 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">${S({type:`nav`,currentPage:8,totalPages:20,truncate:!0})}</div>
            <p class="sbd-doc__card-label">Nav truncated</p>
          </div>
          <div class="l-col l-col--sm--12 l-col--md--6 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">${S({type:`select`,currentPage:1,totalPages:6,open:!1})}</div>
            <p class="sbd-doc__card-label">Select closed</p>
          </div>
          <div class="l-col l-col--sm--12 l-col--md--6 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">${S({type:`jump`,size:`large`,jumpType:`labelled`,totalPages:50})}</div>
            <p class="sbd-doc__card-label">Jump labelled</p>
          </div>
          <div class="l-col l-col--sm--12 l-col--md--6 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">${S({type:`jump`,size:`small`,jumpType:`icon-only`,totalPages:50})}</div>
            <p class="sbd-doc__card-label">Jump icon-only · small</p>
          </div>
        </div>
      </section>
    </div>
  `},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  play: playInit,
  parameters: htmlStoryParameters(render({}), {
    unit: 'pagination',
    scss: scssSource
  })
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  name: 'Nav',
  args: {
    type: 'nav',
    currentPage: 3,
    totalPages: 5
  },
  render: args => render({
    ...args,
    type: 'nav'
  }),
  play: playInit
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  name: 'Select',
  args: {
    type: 'select',
    currentPage: 2,
    totalPages: 8,
    open: true
  },
  render: args => render({
    ...args,
    type: 'select'
  }),
  play: playInit
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  name: 'Jump',
  args: {
    type: 'jump',
    totalPages: 100,
    jumpValue: ''
  },
  render: args => render({
    ...args,
    type: 'jump'
  }),
  play: playInit
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => \`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">
        \${figmaFrameLink('1332:52356', 'Pagination nav')} ·
        \${figmaFrameLink('1332:52459', 'Page selector')} ·
        \${figmaFrameLink('1332:52580', 'Page jump')}
      </p>
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Types</h2>
        <div class="l-row">
          <div class="l-col l-col--sm--12 l-col--md--6 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">\${render({
    type: 'nav',
    currentPage: 3,
    totalPages: 5
  })}</div>
            <p class="sbd-doc__card-label">Nav</p>
          </div>
          <div class="l-col l-col--sm--12 l-col--md--6 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">\${render({
    type: 'nav',
    currentPage: 8,
    totalPages: 20,
    truncate: true
  })}</div>
            <p class="sbd-doc__card-label">Nav truncated</p>
          </div>
          <div class="l-col l-col--sm--12 l-col--md--6 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">\${render({
    type: 'select',
    currentPage: 1,
    totalPages: 6,
    open: false
  })}</div>
            <p class="sbd-doc__card-label">Select closed</p>
          </div>
          <div class="l-col l-col--sm--12 l-col--md--6 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">\${render({
    type: 'jump',
    size: 'large',
    jumpType: 'labelled',
    totalPages: 50
  })}</div>
            <p class="sbd-doc__card-label">Jump labelled</p>
          </div>
          <div class="l-col l-col--sm--12 l-col--md--6 sbd-doc__card" style="padding:16px;gap:12px;">
            <div class="sbd-doc__card-canvas">\${render({
    type: 'jump',
    size: 'small',
    jumpType: 'icon-only',
    totalPages: 50
  })}</div>
            <p class="sbd-doc__card-label">Jump icon-only · small</p>
          </div>
        </div>
      </section>
    </div>
  \`
}`,...P.parameters?.docs?.source}}},F=[`Demo`,`Nav`,`Select`,`Jump`,`AllStyles`]})))()}I();export{P as AllStyles,A as Demo,N as Jump,j as Nav,M as Select,F as __namedExportsOrder,k as default};