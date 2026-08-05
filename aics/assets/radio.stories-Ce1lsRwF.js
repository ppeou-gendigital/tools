import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{En as t,Q as n,Tn as r,Z as i,n as a,t as o}from"./pretty-source-C_TZ5wEY.js";import"./radio-CO5cRz9t.js";function s(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0}))}function c(e,t){e.classList.toggle(`is-checked`,t.checked)}function l(e,t={}){if(!e||e.dataset.radioInitialised===`true`)return{getChecked:()=>!1,setChecked:()=>{},setDisabled:()=>{},destroy:()=>{}};e.dataset.radioInitialised=`true`;let n=t.commitOn===`input`?`input`:`change`,r=e.querySelector(`.c-radio__input`);if(!r)return{getChecked:()=>!1,setChecked:()=>{},setDisabled:()=>{},destroy:()=>{}};c(e,r);function i(t){c(e,r),s(e,`lifelock:radio:change`,{checked:r.checked,name:r.name,value:r.value}),(n===`change`||n===`input`)&&s(e,`lifelock:radio:commit`,{checked:r.checked,name:r.name,value:r.value,source:`pointer`})}function a(t){(t.key===` `||t.key===`Enter`||t.key===`ArrowUp`||t.key===`ArrowDown`||t.key===`ArrowLeft`||t.key===`ArrowRight`)&&s(e,`lifelock:radio:commit`,{checked:r.checked,name:r.name,value:r.value,source:`keyboard`})}function o(t){let n=t.target;n instanceof HTMLInputElement&&n!==r&&n.type===`radio`&&n.name===r.name&&c(e,r)}return r.addEventListener(`change`,i),r.addEventListener(`keyup`,a),typeof document<`u`&&document.addEventListener(`change`,o,!0),{getChecked(){return r.checked},setChecked(t){r.checked=!!t,c(e,r),s(e,`lifelock:radio:commit`,{checked:r.checked,name:r.name,value:r.value,source:`api`})},setDisabled(t){t?(e.setAttribute(`aria-disabled`,`true`),e.classList.add(`is-disabled`),r.disabled=!0):(e.removeAttribute(`aria-disabled`),e.classList.remove(`is-disabled`),r.disabled=!1)},destroy(){r.removeEventListener(`change`,i),r.removeEventListener(`keyup`,a),typeof document<`u`&&document.removeEventListener(`change`,o,!0),delete e.dataset.radioInitialised}}}function u(e,t){let n=e&&typeof e.querySelectorAll==`function`?e:typeof document<`u`?document:null;return n?Array.from(n.querySelectorAll(`.c-radio`)).map(e=>l(e,t)):[]}function d(){if(f||typeof document>`u`||typeof MutationObserver>`u`)return;f=!0;let e=e=>{!e||e.nodeType!==1||(e.classList?.contains(`c-radio`)&&!e.dataset?.radioInitialised&&l(e),e.querySelectorAll?.(`.c-radio:not([data-radio-initialised])`).forEach(e=>{l(e)}))},t=()=>{document.body&&(p=new MutationObserver(t=>{for(let n of t)n.addedNodes.forEach(e)}),p.observe(document.body,{childList:!0,subtree:!0}))};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,t,{once:!0}):t()}var f,p;function m(){return(m=e((()=>{f=!1,p=null})))()}function h(e){return{...e}}function g(e){return E+=1,`${e}-${E}`}function _({tone:e,checked:t,label:n}){let r=h({...S,tone:e,checked:t,label:n,name:g(`radio-${e}`),value:t?`on`:`off`});return`
    <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;min-inline-size:120px;">
      <div>${y(r)}</div>
      <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e} · ${t?`on`:`off`}</figcaption>
    </figure>
  `}function v(e){let t=h({...S,tone:`default`,checked:!0,state:e===`disabled`?`default`:e,disabled:e===`disabled`,label:`State = ${e}`,name:g(`radio-state`),value:`on`});return`
    <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;min-inline-size:120px;">
      <div>${y(t)}</div>
      <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e}</figcaption>
    </figure>
  `}var y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{n(),a(),r(),m(),d(),y=i.default.compile(t),b=[`default`,`accent`,`critical`],x=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=666-36462&m=dev`,S={tone:`default`,checked:!1,disabled:!1,name:`demo-group`,value:`option-1`,label:`Option one`,accessibleLabel:``},C=async({canvasElement:e})=>{u(e)},w={title:`Molecules/Controls/Radio`,tags:[`autodocs`],parameters:{docs:{description:{component:`Radio — 24 × 24 px circle for single-select choice. Progressive-enhanced over a native \`<input type="radio">\`. [Figma](${x}).`}}},argTypes:{tone:{control:{type:`inline-radio`},options:b,name:`Tone`},checked:{control:`boolean`,name:`Checked`},disabled:{control:`boolean`,name:`Disabled`},name:{control:`text`,name:`Name`},value:{control:`text`,name:`Value`},label:{control:`text`,name:`Label`},accessibleLabel:{control:`text`,name:`Accessible label`}},args:S,render:e=>y(h(e))},T={name:`Demo`,play:C,parameters:o(y(h(S)),{unit:`radio`})},E=0,D={name:`AllStyles`,play:C,render:()=>`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Tone × Checked</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          ${_({tone:`default`,checked:!1,label:`Default · Off`})}
          ${_({tone:`default`,checked:!0,label:`Default · On`})}
          ${_({tone:`accent`,checked:!1,label:`Accent · Off`})}
          ${_({tone:`accent`,checked:!0,label:`Accent · On`})}
          ${_({tone:`critical`,checked:!1,label:`Critical · Off`})}
          ${_({tone:`critical`,checked:!0,label:`Critical · On`})}
        </div>
      </section>
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Interaction states (default · checked)</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          ${[`default`,`hover`,`focused`,`pressed`,`disabled`].map(e=>v(e)).join(``)}
        </div>
      </section>
    </div>
  `},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  play: playInitRadios,
  parameters: htmlStoryParameters(compiled(buildArgs(defaultArgs)), {
    unit: 'radio'
  })
}`,...T.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  play: playInitRadios,
  render: () => \`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Tone × Checked</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          \${toneCard({
    tone: 'default',
    checked: false,
    label: 'Default · Off'
  })}
          \${toneCard({
    tone: 'default',
    checked: true,
    label: 'Default · On'
  })}
          \${toneCard({
    tone: 'accent',
    checked: false,
    label: 'Accent · Off'
  })}
          \${toneCard({
    tone: 'accent',
    checked: true,
    label: 'Accent · On'
  })}
          \${toneCard({
    tone: 'critical',
    checked: false,
    label: 'Critical · Off'
  })}
          \${toneCard({
    tone: 'critical',
    checked: true,
    label: 'Critical · On'
  })}
        </div>
      </section>
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Interaction states (default · checked)</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          \${['default', 'hover', 'focused', 'pressed', 'disabled'].map(s => stateCard(s)).join('')}
        </div>
      </section>
    </div>
  \`
}`,...D.parameters?.docs?.source}}},O=[`Demo`,`AllStyles`]})))()}k();export{D as AllStyles,T as Demo,O as __namedExportsOrder,w as default};