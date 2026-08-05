import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,Z as n,dt as r,ft as i,n as a,t as o}from"./pretty-source-C_TZ5wEY.js";import"./icon-D6wgK3Ul.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";function l(e,t,n){e.dispatchEvent(new CustomEvent(`lifelock:tabs:change`,{bubbles:!0,composed:!0,detail:{index:t,root:e,source:n}}))}function u(e){return Array.from(e.querySelectorAll(`[data-tabs-list-wrap] [role="tab"]`))}function d(e){return Array.from(e.querySelectorAll(`[data-tabs-mobile-menu] [role="option"]`))}function f(e,t,n){let r=u(e),i=d(e),a=r[t];if(!a||a.disabled)return;r.forEach((e,n)=>{let r=n===t;e.classList.toggle(`is-active`,r),e.setAttribute(`aria-selected`,r?`true`:`false`),e.tabIndex=r?0:-1}),i.forEach((e,n)=>{let r=n===t;e.classList.toggle(`is-active`,r),e.setAttribute(`aria-selected`,r?`true`:`false`)}),e.dataset.activeIndex=String(t);let o=e.querySelector(`[data-tabs-mobile-value]`);o&&(o.textContent=a.textContent?.trim()||``),typeof n==`string`&&l(e,t,n)}function p(e){e.classList.remove(`is-mobile-open`);let t=e.querySelector(`[data-tabs-mobile-trigger]`),n=e.querySelector(`[data-tabs-mobile-menu]`);t&&t.setAttribute(`aria-expanded`,`false`),n&&(n.hidden=!0)}function m(e){e.classList.add(`is-mobile-open`);let t=e.querySelector(`[data-tabs-mobile-trigger]`),n=e.querySelector(`[data-tabs-mobile-menu]`);t&&t.setAttribute(`aria-expanded`,`true`),n&&(n.hidden=!1)}function h(e,t={}){if(!e||e.dataset.tabsInitialized===`true`)return null;e.dataset.tabsInitialized=`true`,f(e,Number(t.activeIndex??e.dataset.activeIndex??0),null);function n(n,r){f(e,n,r),typeof t.onChange==`function`&&t.onChange(n),p(e)}function r(t){let r=t.target.closest?.(`[role="tab"]`);if(!r||!e.contains(r)||r.disabled)return;let i=Number(r.getAttribute(`data-tabs-index`));Number.isFinite(i)&&n(i,`tab`)}function i(t){let r=t.target.closest?.(`[role="tab"]`);if(!r||!e.contains(r))return;let i=u(e).filter(e=>!e.disabled);if(!i.length)return;let a=i.indexOf(r);if(a<0)return;let o=a;if(t.key===`ArrowRight`||t.key===`ArrowDown`)o=(a+1)%i.length,t.preventDefault();else if(t.key===`ArrowLeft`||t.key===`ArrowUp`)o=(a-1+i.length)%i.length,t.preventDefault();else if(t.key===`Home`)o=0,t.preventDefault();else if(t.key===`End`)o=i.length-1,t.preventDefault();else return;n(Number(i[o].getAttribute(`data-tabs-index`)),`keyboard`),i[o].focus()}function a(t){t.preventDefault(),e.classList.contains(`is-mobile-open`)?p(e):m(e)}function o(t){let r=t.target.closest?.(`[role="option"]`);if(!r||!e.contains(r)||r.disabled)return;let i=Number(r.getAttribute(`data-tabs-index`));Number.isFinite(i)&&n(i,`mobile`)}function s(t){e.classList.contains(`is-mobile-open`)&&(e.contains(t.target)||p(e))}let c=e.querySelector(`[data-tabs-list-wrap]`);c&&(c.addEventListener(`click`,r),c.addEventListener(`keydown`,i));let l=e.querySelector(`[data-tabs-mobile-trigger]`);l&&l.addEventListener(`click`,a);let d=e.querySelector(`[data-tabs-mobile-menu]`);return d&&d.addEventListener(`click`,o),document.addEventListener(`click`,s),{setActiveIndex:e=>n(e,`api`),getActiveIndex:()=>Number(e.dataset.activeIndex||0),destroy(){c&&(c.removeEventListener(`click`,r),c.removeEventListener(`keydown`,i)),l&&l.removeEventListener(`click`,a),d&&d.removeEventListener(`click`,o),document.removeEventListener(`click`,s),delete e.dataset.tabsInitialized}}}function g(e=document){let t=e.querySelectorAll?.(`[data-component="tabs"]`);return t?Array.from(t).map(e=>h(e)).filter(Boolean):[]}function _(){if(v||typeof document>`u`)return;v=!0;let e=()=>g(document);document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,e,{once:!0}):e(),new MutationObserver(()=>e()).observe(document.body,{childList:!0,subtree:!0})}var v;function y(){return(y=e((()=>{v=!1})))()}function b(e=3){return Array.from({length:e},(e,t)=>({label:`Tab ${t+1}`,showIcon:!1,iconName:T,disabled:!1,panelId:`panel-${t}`,id:`tab-${t}`}))}function x(e={}){let t=!!e.lockActive,n=Number(e.activeIndex??0),r=(Array.isArray(e.tabs)&&e.tabs.length?e.tabs:b(3)).map((e,t)=>({label:e.label??`Tab ${t+1}`,showIcon:!!e.showIcon,iconName:e.iconName||`objects/simple-device-vehicle`,disabled:!!e.disabled,panelId:e.panelId||`panel-${t}`,id:e.id||`tab-${t}`,state:e.state||``,index:t,isActive:t===n&&!e.disabled}));if(!t&&!r.some(e=>e.isActive)){let e=r.findIndex(e=>!e.disabled);e>=0&&(r[e].isActive=!0)}let i=r.findIndex(e=>e.isActive);return{style:String(e.style||`solid`).toLowerCase(),activeIndex:i<0?0:i,forceMobile:!!e.forceMobile,showMobileFallback:r.length>3||!!e.forceMobile,label:e.label||`Section`,ariaLabel:e.ariaLabel||`Tabs`,id:e.id||``,className:e.className||``,tabs:r}}function S(e,t){return t(x(e))}var C,w,T,E;function D(){return(D=e((()=>{C=[`solid`,`subtle`],w=[`default`,`hover`,`focus`,`active`,`disabled`],T=`objects/simple-device-vehicle`,E={style:`solid`,activeIndex:0,forceMobile:!1,label:`Section`,ariaLabel:`Example tabs`,tabs:b(3)}})))()}var O,k,A,j,M,N;function P(){return(P=e((()=>{t(),r(),y(),a(),s(),D(),_(),O=n.default.compile(i),k=async({canvasElement:e})=>{h(e.querySelector(`[data-component="tabs"]`))},A={title:`Patterns/Tabs`,tags:[`autodocs`,`shared-library`],render:e=>S(e,O),args:E,argTypes:{style:{control:{type:`inline-radio`},options:C,name:`Style`},activeIndex:{control:{type:`number`,min:0,max:5},name:`Active index`},forceMobile:{control:`boolean`,name:`Force mobile dropdown`},label:{control:`text`,name:`Mobile field label`},tabs:{control:`object`,name:`Tabs`}},parameters:{badges:[`shared`],contentWidth:`fluid`,design:c([[`Tabs page — 539:28424`,`539:28424`],[`.Tab set — 1396:6950`,`1396:6950`],[`Spec — 4362:266`,`4362:266`]]),docs:{description:{component:"Tabs from [Pattern / Tabs](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28424&m=dev). Style Solid/Subtle; keyboard selection via `initTabs`; mobile dropdown when more than 3 tabs below MD."}}}},j={parameters:o(S(E,O),{unit:`tabs`}),play:k},M={parameters:{design:c(`539:28424`)},play:async({canvasElement:e})=>{e.querySelectorAll(`[data-component="tabs"]`).forEach(e=>h(e))},render:()=>`
      <div class="sbd-doc">
        <h3 class="sbd-doc__group-title">Style bands</h3>
        <div class="sbd-doc__stack">${C.map(e=>`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">style = ${e} · 4 tabs</p>
          <div class="sbd-doc__stack-item-canvas">${S({style:e,activeIndex:0,tabs:b(4)},O)}</div>
        </div>`).join(``)}</div>
        <h3 class="sbd-doc__group-title">Tab states (presentational data-state)</h3>
        <div class="sbd-doc__stack">${C.map(e=>`<div style="display:flex;flex-wrap:wrap;gap:12px;">${w.map(t=>`
          <div class="sbd-doc__stack-item-canvas" style="min-inline-size:140px;">
            <p class="sbd-doc__stack-item-label">${e} · ${t}</p>
            ${S({style:e,activeIndex:t===`active`?0:-1,lockActive:!0,tabs:[{label:t,showIcon:!0,state:t==="default"||t===`active`?``:t,disabled:t===`disabled`}],forceMobile:!1},O)}
          </div>`).join(``)}</div>`).join(``)}</div>
        <h3 class="sbd-doc__group-title">Mobile dropdown (&gt;3 tabs · forced)</h3>
        <div class="sbd-doc__stack">
          <div class="sbd-doc__stack-item">
            <div class="sbd-doc__stack-item-canvas">${S({style:`solid`,activeIndex:0,forceMobile:!0,label:`Section`,tabs:b(4)},O)}</div>
          </div>
        </div>
      </div>
    `},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileTabsArgs(defaultTabsArgs, compiled), {
    unit: 'tabs'
  }),
  play: playInit
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  parameters: {
    design: figmaDesign('539:28424')
  },
  play: async ({
    canvasElement
  }) => {
    canvasElement.querySelectorAll('[data-component="tabs"]').forEach(root => initTabs(root));
  },
  render: () => {
    const styleBands = STYLE_OPTIONS.map(style => {
      const html = compileTabsArgs({
        style,
        activeIndex: 0,
        tabs: defaultTabs(4)
      }, compiled);
      return \`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">style = \${style} · 4 tabs</p>
          <div class="sbd-doc__stack-item-canvas">\${html}</div>
        </div>\`;
    }).join('');
    const stateMatrix = STYLE_OPTIONS.map(style => {
      const cells = STATE_OPTIONS.map(state => {
        const tabs = [{
          label: state,
          showIcon: true,
          state: state === 'default' || state === 'active' ? '' : state,
          disabled: state === 'disabled'
        }];
        const html = compileTabsArgs({
          style,
          activeIndex: state === 'active' ? 0 : -1,
          lockActive: true,
          tabs,
          forceMobile: false
        }, compiled);
        return \`
          <div class="sbd-doc__stack-item-canvas" style="min-inline-size:140px;">
            <p class="sbd-doc__stack-item-label">\${style} · \${state}</p>
            \${html}
          </div>\`;
      }).join('');
      return \`<div style="display:flex;flex-wrap:wrap;gap:12px;">\${cells}</div>\`;
    }).join('');
    const mobile = compileTabsArgs({
      style: 'solid',
      activeIndex: 0,
      forceMobile: true,
      label: 'Section',
      tabs: defaultTabs(4)
    }, compiled);
    return \`
      <div class="sbd-doc">
        <h3 class="sbd-doc__group-title">Style bands</h3>
        <div class="sbd-doc__stack">\${styleBands}</div>
        <h3 class="sbd-doc__group-title">Tab states (presentational data-state)</h3>
        <div class="sbd-doc__stack">\${stateMatrix}</div>
        <h3 class="sbd-doc__group-title">Mobile dropdown (&gt;3 tabs · forced)</h3>
        <div class="sbd-doc__stack">
          <div class="sbd-doc__stack-item">
            <div class="sbd-doc__stack-item-canvas">\${mobile}</div>
          </div>
        </div>
      </div>
    \`;
  }
}`,...M.parameters?.docs?.source}}},N=[`Demo`,`AllStyles`]})))()}P();export{M as AllStyles,j as Demo,N as __namedExportsOrder,A as default};