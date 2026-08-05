import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,Sn as n,Z as r,n as i,t as a,xn as o}from"./pretty-source-C_TZ5wEY.js";import"./switch-CDuQsX3O.js";function s(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0}))}function c(e,t={}){if(!e||e.dataset.switchInitialised===`true`)return{getChecked:()=>!1,setChecked:()=>{},setDisabled:()=>{},destroy:()=>{}};e.dataset.switchInitialised=`true`;let n=t.commitOn===`input`?`input`:`change`,r=e.querySelector(`.c-switch__input`);if(!r)return{getChecked:()=>!1,setChecked:()=>{},setDisabled:()=>{},destroy:()=>{}};function i(t){let n=r.checked;e.classList.toggle(`is-checked`,n),r.setAttribute(`aria-checked`,n?`true`:`false`),s(e,`lifelock:switch:change`,{checked:n,source:t})}function a(t){if(e.getAttribute(`aria-busy`)===`true`){r.checked=!r.checked;return}i(`pointer`),(n===`change`||n===`input`)&&s(e,`lifelock:switch:commit`,{checked:r.checked,source:`pointer`})}function o(t){(t.key===` `||t.key===`Enter`)&&e.getAttribute(`aria-busy`)!==`true`&&s(e,`lifelock:switch:commit`,{checked:r.checked,source:`keyboard`})}return r.addEventListener(`change`,a),r.addEventListener(`keyup`,o),e.classList.toggle(`is-checked`,r.checked),r.setAttribute(`aria-checked`,r.checked?`true`:`false`),{getChecked(){return r.checked},setChecked(t){r.checked=!!t,i(`api`),s(e,`lifelock:switch:commit`,{checked:r.checked,source:`api`})},setDisabled(t){t?(e.setAttribute(`aria-disabled`,`true`),e.classList.add(`is-disabled`),r.disabled=!0):(e.removeAttribute(`aria-disabled`),e.classList.remove(`is-disabled`),r.disabled=!1)},destroy(){r.removeEventListener(`change`,a),r.removeEventListener(`keyup`,o),delete e.dataset.switchInitialised}}}function l(e,t){let n=e&&typeof e.querySelectorAll==`function`?e:typeof document<`u`?document:null;return n?Array.from(n.querySelectorAll(`.c-switch`)).map(e=>c(e,t)):[]}function u(){if(d||typeof document>`u`||typeof MutationObserver>`u`)return;d=!0;let e=e=>{!e||e.nodeType!==1||(e.classList?.contains(`c-switch`)&&!e.dataset?.switchInitialised&&c(e),e.querySelectorAll?.(`.c-switch:not([data-switch-initialised])`).forEach(e=>{c(e)}))},t=()=>{document.body&&(f=new MutationObserver(t=>{for(let n of t)n.addedNodes.forEach(e)}),f.observe(document.body,{childList:!0,subtree:!0}))};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,t,{once:!0}):t()}var d,f;function p(){return(p=e((()=>{d=!1,f=null})))()}function m(e){return{...e}}function h({tone:e,checked:t,label:n}){let r=m({...b,tone:e,checked:t,label:n});return`
    <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;min-inline-size:140px;">
      <div>${_(r)}</div>
      <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e} · ${t?`on`:`off`}</figcaption>
    </figure>
  `}function g(e){let t=m({...b,tone:`default`,checked:!0,state:[`hover`,`focused`,`pressed`].includes(e)?e:`default`,disabled:e===`disabled`,loading:e===`loading`,label:`State = ${e}`});return`
    <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;min-inline-size:140px;">
      <div>${_(t)}</div>
      <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e}</figcaption>
    </figure>
  `}var _,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{t(),i(),o(),p(),u(),_=r.default.compile(n),v=[`default`,`success`,`critical`],y=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=717-48394&m=dev`,b={tone:`default`,checked:!0,disabled:!1,loading:!1,showIcon:!0,label:`Notifications`,accessibleLabel:``,name:`notifications`,value:`on`},x=async({canvasElement:e})=>{l(e)},S={title:`Molecules/Controls/Switch`,tags:[`autodocs`],parameters:{docs:{description:{component:`Switch — 42 × 26 px binary toggle with optional checkmark Icon. [Figma](${y}).`}}},argTypes:{tone:{control:{type:`inline-radio`},options:v,name:`Tone`},checked:{control:`boolean`,name:`Checked`},disabled:{control:`boolean`,name:`Disabled`},loading:{control:`boolean`,name:`Loading`},showIcon:{control:`boolean`,name:`Show icon`},label:{control:`text`,name:`Label`},accessibleLabel:{control:`text`,name:`Accessible label`},name:{control:`text`,name:`Name`},value:{control:`text`,name:`Value`}},args:b,render:e=>_(m(e))},C={name:`Demo`,play:x,parameters:a(_(m(b)),{unit:`switch`})},w={name:`AllStyles`,play:x,render:()=>`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Tone × Checked</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          ${v.flatMap(e=>[h({tone:e,checked:!1,label:`${e} · Off`}),h({tone:e,checked:!0,label:`${e} · On`})]).join(``)}
        </div>
      </section>
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Interaction / persistent states</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          ${[`default`,`hover`,`focused`,`pressed`,`disabled`,`loading`].map(e=>g(e)).join(``)}
        </div>
      </section>
    </div>
  `},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  play: playInitSwitches,
  parameters: htmlStoryParameters(compiled(buildArgs(defaultArgs)), {
    unit: 'switch'
  })
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  play: playInitSwitches,
  render: () => \`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Tone × Checked</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          \${TONE_OPTIONS.flatMap(tone => [toneCard({
    tone,
    checked: false,
    label: \`\${tone} · Off\`
  }), toneCard({
    tone,
    checked: true,
    label: \`\${tone} · On\`
  })]).join('')}
        </div>
      </section>
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Interaction / persistent states</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          \${['default', 'hover', 'focused', 'pressed', 'disabled', 'loading'].map(s => stateCard(s)).join('')}
        </div>
      </section>
    </div>
  \`
}`,...w.parameters?.docs?.source}}},T=[`Demo`,`AllStyles`]})))()}E();export{w as AllStyles,C as Demo,T as __namedExportsOrder,S as default};