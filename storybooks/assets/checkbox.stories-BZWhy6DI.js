import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{En as t,Q as n,Tn as r,Z as i,n as a,t as o}from"./pretty-source-CA3IhMc4.js";import"./checkbox-Cy2_W4xa.js";function s(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0}))}function c(e,t={}){if(!e||e.dataset.checkboxInitialised===`true`)return{getSelection:()=>`unchecked`,setSelection:()=>{},setDisabled:()=>{},destroy:()=>{}};e.dataset.checkboxInitialised=`true`;let n=t.commitOn===`input`?`input`:`change`,r=e.querySelector(`.c-checkbox__input`);if(!r)return{getSelection:()=>`unchecked`,setSelection:()=>{},setDisabled:()=>{},destroy:()=>{}};e.classList.contains(`is-indeterminate`)&&(r.indeterminate=!0);function i(t){let n=r.checked;e.classList.toggle(`is-checked`,n),e.classList.remove(`is-indeterminate`),r.indeterminate=!1,s(e,`lifelock:checkbox:change`,{selection:n?`checked`:`unchecked`,source:t})}function a(t){i(`pointer`),(n===`change`||n===`input`)&&s(e,`lifelock:checkbox:commit`,{selection:r.checked?`checked`:`unchecked`,source:`pointer`})}function o(t){(t.key===` `||t.key===`Enter`)&&s(e,`lifelock:checkbox:commit`,{selection:r.checked?`checked`:`unchecked`,source:`keyboard`})}return r.addEventListener(`change`,a),r.addEventListener(`keyup`,o),{getSelection(){return r.indeterminate?`indeterminate`:r.checked?`checked`:`unchecked`},setSelection(t){t===`indeterminate`?(r.checked=!1,r.indeterminate=!0,e.classList.remove(`is-checked`),e.classList.add(`is-indeterminate`)):t===`checked`?(r.checked=!0,r.indeterminate=!1,e.classList.add(`is-checked`),e.classList.remove(`is-indeterminate`)):(r.checked=!1,r.indeterminate=!1,e.classList.remove(`is-checked`),e.classList.remove(`is-indeterminate`)),s(e,`lifelock:checkbox:commit`,{selection:t===`indeterminate`?`unchecked`:t,source:`api`})},setDisabled(t){t?(e.setAttribute(`aria-disabled`,`true`),e.classList.add(`is-disabled`),r.disabled=!0):(e.removeAttribute(`aria-disabled`),e.classList.remove(`is-disabled`),r.disabled=!1)},destroy(){r.removeEventListener(`change`,a),r.removeEventListener(`keyup`,o),delete e.dataset.checkboxInitialised}}}function l(e,t){let n=e&&typeof e.querySelectorAll==`function`?e:typeof document<`u`?document:null;return n?Array.from(n.querySelectorAll(`.c-checkbox`)).map(e=>c(e,t)):[]}function u(){if(d||typeof document>`u`||typeof MutationObserver>`u`)return;d=!0;let e=e=>{!e||e.nodeType!==1||(e.classList?.contains(`c-checkbox`)&&!e.dataset?.checkboxInitialised&&c(e),e.querySelectorAll?.(`.c-checkbox:not([data-checkbox-initialised])`).forEach(e=>{c(e)}))},t=()=>{document.body&&(f=new MutationObserver(t=>{for(let n of t)n.addedNodes.forEach(e)}),f.observe(document.body,{childList:!0,subtree:!0}))};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,t,{once:!0}):t()}var d,f;function p(){return(p=e((()=>{d=!1,f=null})))()}function m(e){return{...e}}function h({tone:e,selection:t,label:n}){let r=m({...x,tone:e,selection:t,label:n});return`
    <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;min-inline-size:140px;">
      <div>${_(r)}</div>
      <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e} · ${t}</figcaption>
    </figure>
  `}function g(e){let t=m({...x,tone:`default`,selection:`checked`,state:e===`disabled`?`default`:e,disabled:e===`disabled`,label:`State = ${e}`});return`
    <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;min-inline-size:140px;">
      <div>${_(t)}</div>
      <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e}</figcaption>
    </figure>
  `}var _,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{n(),a(),t(),p(),u(),_=i.default.compile(r),v=[`default`,`accent`,`critical`],y=[`unchecked`,`checked`,`indeterminate`],b=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=665-36315&m=dev`,x={tone:`default`,selection:`unchecked`,disabled:!1,label:`I agree to the terms`,accessibleLabel:``,name:`agree`,value:`yes`},S=async({canvasElement:e})=>{l(e)},C={title:`Molecules/Controls/Checkbox`,tags:[`autodocs`],parameters:{docs:{description:{component:`Checkbox — 24 × 24 px box with checkmark / indeterminate dash via Icon. [Figma](${b}).`}}},argTypes:{tone:{control:{type:`inline-radio`},options:v,name:`Tone`},selection:{control:{type:`inline-radio`},options:y,name:`Selection`},disabled:{control:`boolean`,name:`Disabled`},label:{control:`text`,name:`Label`},accessibleLabel:{control:`text`,name:`Accessible label`},name:{control:`text`,name:`Name`},value:{control:`text`,name:`Value`}},args:x,render:e=>_(m(e))},w={name:`Demo`,play:S,parameters:o(_(m(x)),{unit:`checkbox`})},T={name:`AllStyles`,play:S,render:()=>`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Tone × Selection</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          ${v.flatMap(e=>y.map(t=>h({tone:e,selection:t,label:`${e} · ${t}`}))).join(``)}
        </div>
      </section>
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Interaction states (default · checked)</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          ${[`default`,`hover`,`focused`,`pressed`,`disabled`].map(e=>g(e)).join(``)}
        </div>
      </section>
    </div>
  `},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  play: playInitCheckboxes,
  parameters: htmlStoryParameters(compiled(buildArgs(defaultArgs)), {
    unit: 'checkbox'
  })
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  play: playInitCheckboxes,
  render: () => \`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Tone × Selection</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          \${TONE_OPTIONS.flatMap(tone => SELECTION_OPTIONS.map(selection => toneCard({
    tone,
    selection,
    label: \`\${tone} · \${selection}\`
  }))).join('')}
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
}`,...T.parameters?.docs?.source}}},E=[`Demo`,`AllStyles`]})))()}D();export{T as AllStyles,w as Demo,E as __namedExportsOrder,C as default};