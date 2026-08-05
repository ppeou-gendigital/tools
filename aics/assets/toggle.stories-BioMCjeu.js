import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,Z as n,ct as r,n as i,st as a,t as o}from"./pretty-source-C_TZ5wEY.js";import"./discount-label-B_xZkyNW.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";function l(e,t,n){e.dispatchEvent(new CustomEvent(`lifelock:toggle:change`,{bubbles:!0,composed:!0,detail:{selected:t,root:e,source:n}}))}function u(e,t){let n=e.dataset.type||`link`;if(e.dataset.selected=t,n===`link`){let n=e.querySelector(`[data-toggle-control]`),r=t===`on`;n&&n.setAttribute(`aria-pressed`,r?`true`:`false`),e.querySelector(`.c-toggle__label--start`)?.classList.toggle(`is-active`,!r),e.querySelector(`.c-toggle__label--end`)?.classList.toggle(`is-active`,r);return}e.querySelectorAll(`[data-toggle-value]`).forEach(e=>{let n=e.getAttribute(`data-toggle-value`)===t;e.classList.toggle(`is-selected`,n),e.setAttribute(`aria-checked`,n?`true`:`false`)})}function d(e,t={}){if(!e||e.dataset.toggleInitialized===`true`)return null;e.dataset.toggleInitialized=`true`;let n=e.dataset.type||`link`,r=t.selected||e.dataset.selected||(n===`link`?`off`:`a`);u(e,r);function i(n,i){e.classList.contains(`is-disabled`)||(r=n,u(e,n),typeof t.onChange==`function`&&t.onChange(n),i&&l(e,n,i))}function a(t){if(n===`link`){let n=t.target.closest?.(`[data-toggle-control]`);if(!n||!e.contains(n))return;i(r===`on`?`off`:`on`,`click`);return}let a=t.target.closest?.(`[data-toggle-value]`);!a||!e.contains(a)||a.disabled||i(a.getAttribute(`data-toggle-value`),`click`)}function o(t){if(n===`link`){(t.key===` `||t.key===`Enter`)&&(t.preventDefault(),i(r===`on`?`off`:`on`,`keyboard`));return}let a=Array.from(e.querySelectorAll(`[data-toggle-value]:not(:disabled)`));if(!a.length)return;let o=a.findIndex(e=>e.getAttribute(`data-toggle-value`)===r);if(t.key===`ArrowRight`||t.key===`ArrowDown`){t.preventDefault();let e=a[(o+1)%a.length];i(e.getAttribute(`data-toggle-value`),`keyboard`),e.focus()}else if(t.key===`ArrowLeft`||t.key===`ArrowUp`){t.preventDefault();let e=a[(o-1+a.length)%a.length];i(e.getAttribute(`data-toggle-value`),`keyboard`),e.focus()}}return e.addEventListener(`click`,a),e.addEventListener(`keydown`,o),{setSelected:e=>i(e,`api`),getSelected:()=>r,destroy(){e.removeEventListener(`click`,a),e.removeEventListener(`keydown`,o),delete e.dataset.toggleInitialized}}}function f(e=document){let t=e.querySelectorAll?.(`[data-component="toggle"]`);return t?Array.from(t).map(e=>d(e)).filter(Boolean):[]}function p(){if(m||typeof document>`u`)return;m=!0;let e=()=>f(document);document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,e,{once:!0}):e(),new MutationObserver(()=>e()).observe(document.documentElement,{childList:!0,subtree:!0})}var m;function h(){return(h=e((()=>{m=!1})))()}function g(e={}){let t=String(e.type||`link`).toLowerCase(),n=String(e.selected||(t===`link`?`off`:`a`)).toLowerCase();return t===`link`&&n!==`on`&&n!==`off`&&(n=`off`),t!==`link`&&n!==`a`&&n!==`b`&&(n=`a`),{type:t,selected:n,labelA:e.labelA||(t===`link`?`Off`:t===`pill`?`Annual`:`Free`),labelB:e.labelB||(t===`link`?`On`:t===`pill`?`Monthly`:`Premium`),showDiscountLabel:e.showDiscountLabel!==!1,discountText:e.discountText||`Save 40%`,disabled:!!e.disabled||String(e.state||``).toLowerCase()===`disabled`,state:String(e.state||`default`).toLowerCase(),ariaLabel:e.ariaLabel||`Toggle`,id:e.id||``,className:e.className||``}}function _(e,t){return t(g(e))}var v,y,b;function x(){return(x=e((()=>{v=[`link`,`segmented`,`pill`],y=[`default`,`hover`,`pressed`,`focus`,`disabled`],b={type:`link`,selected:`off`,labelA:`Off`,labelB:`On`,showDiscountLabel:!0,discountText:`Save 40%`,disabled:!1,state:`default`,ariaLabel:`Toggle`}})))()}var S,C,w,T,E,D;function O(){return(O=e((()=>{t(),a(),h(),i(),s(),x(),p(),S=n.default.compile(r),C=async({canvasElement:e})=>{e.querySelectorAll(`[data-component="toggle"]`).forEach(e=>d(e))},w={title:`Patterns/Toggle`,tags:[`autodocs`,`shared-library`],render:e=>_(e,S),args:b,argTypes:{type:{control:{type:`inline-radio`},options:v,name:`Type`},selected:{control:`text`,name:`Selected (off|on or a|b)`},labelA:{control:`text`,name:`Label A`},labelB:{control:`text`,name:`Label B`},showDiscountLabel:{control:`boolean`,name:`Show discount (pill)`},discountText:{control:`text`,name:`Discount text`},disabled:{control:`boolean`,name:`Disabled`},state:{control:{type:`select`},options:y,name:`State (gallery)`}},parameters:{badges:[`shared`],contentWidth:`fluid`,design:c([[`Toggle page — 539:28414`,`539:28414`],[`Spec — 4588:132`,`4588:132`]])}},T={parameters:o(_(b,S),{unit:`toggle`}),play:C},E={parameters:{design:c(`539:28414`)},play:C,render:()=>`<div class="sbd-doc"><div class="sbd-doc__stack">${v.map(e=>`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">type = ${e}</p>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">${(e===`link`?[`off`,`on`]:[`a`,`b`]).map(t=>`
          <div class="sbd-doc__stack-item-canvas">
            <p class="sbd-doc__stack-item-label">${e} · selected=${t}</p>
            ${_({type:e,selected:t,showDiscountLabel:e===`pill`,labelA:e===`link`?`Off`:e===`pill`?`Annual`:`Free`,labelB:e===`link`?`On`:e===`pill`?`Monthly`:`Premium`},S)}
          </div>`).join(``)}</div>
        </div>`).join(``)}</div></div>`},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileToggleArgs(defaultToggleArgs, compiled), {
    unit: 'toggle'
  }),
  play: playInit
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  parameters: {
    design: figmaDesign('539:28414')
  },
  play: playInit,
  render: () => {
    const bands = TYPE_OPTIONS.map(type => {
      const selectedOpts = type === 'link' ? ['off', 'on'] : ['a', 'b'];
      const cells = selectedOpts.map(selected => \`
          <div class="sbd-doc__stack-item-canvas">
            <p class="sbd-doc__stack-item-label">\${type} · selected=\${selected}</p>
            \${compileToggleArgs({
        type,
        selected,
        showDiscountLabel: type === 'pill',
        labelA: type === 'link' ? 'Off' : type === 'pill' ? 'Annual' : 'Free',
        labelB: type === 'link' ? 'On' : type === 'pill' ? 'Monthly' : 'Premium'
      }, compiled)}
          </div>\`).join('');
      return \`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">type = \${type}</p>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">\${cells}</div>
        </div>\`;
    }).join('');
    return \`<div class="sbd-doc"><div class="sbd-doc__stack">\${bands}</div></div>\`;
  }
}`,...E.parameters?.docs?.source}}},D=[`Demo`,`AllStyles`]})))()}O();export{E as AllStyles,T as Demo,D as __namedExportsOrder,w as default};