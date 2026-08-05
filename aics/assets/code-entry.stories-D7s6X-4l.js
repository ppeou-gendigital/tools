import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Bt as t,Q as n,Z as r,n as i,t as a,zt as o}from"./pretty-source-C_TZ5wEY.js";import"./icon-D6wgK3Ul.js";import{n as s,r as c,t as l}from"./figma-links-B0HkTJ7d.js";function u(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0}))}function d(e){if(!e||e.dataset.codeEntryInitialised===`true`)return{...p};e.dataset.codeEntryInitialised=`true`;let t=Array.from(e.querySelectorAll(`.c-code-entry__box`));if(t.length===0)return{...p,destroy(){delete e.dataset.codeEntryInitialised}};function n(){return t.map(e=>e.value).join(``)}function r(e){e.classList.toggle(`is-filled`,e.value.length>0)}function i(){let r=n();u(e,`lifelock:code-entry:input`,{value:r}),r.length===t.length&&u(e,`lifelock:code-entry:complete`,{value:r})}function a(e){let n=t[e];n&&(n.focus(),n.select())}function o(e){let n=e.target,o=Number(n.dataset.index);n.value=n.value.replace(/\D/g,``).slice(-1),r(n),n.value&&o<t.length-1&&a(o+1),i()}function s(e){let n=e.target,o=Number(n.dataset.index);if(e.key===`Backspace`&&!n.value&&o>0){e.preventDefault();let n=t[o-1];n.value=``,r(n),a(o-1),i()}else e.key===`ArrowLeft`&&o>0?(e.preventDefault(),a(o-1)):e.key===`ArrowRight`&&o<t.length-1&&(e.preventDefault(),a(o+1))}function c(e){e.preventDefault();let n=e.target,o=Number(n.dataset.index),s=(e.clipboardData?e.clipboardData.getData(`text`):``).replace(/\D/g,``);if(!s)return;let c=o;for(let e of s){if(c>=t.length)break;t[c].value=e,r(t[c]),c+=1}a(Math.min(c,t.length-1)),i()}for(let e of t)e.addEventListener(`input`,o),e.addEventListener(`keydown`,s),e.addEventListener(`paste`,c),r(e);return{getValue(){return n()},setValue(e){let n=String(e??``).replace(/\D/g,``);t.forEach((e,t)=>{e.value=n[t]??``,r(e)}),i()},clear(){for(let e of t)e.value=``,r(e);a(0),i()},setDisabled(n){let r=!!n;for(let e of t)e.disabled=r;e.classList.toggle(`is-disabled`,r)},destroy(){for(let e of t)e.removeEventListener(`input`,o),e.removeEventListener(`keydown`,s),e.removeEventListener(`paste`,c);delete e.dataset.codeEntryInitialised}}}function f(e){let t=e&&typeof e.querySelectorAll==`function`?e:typeof document<`u`?document:null;return t?Array.from(t.querySelectorAll(`.c-code-entry`)).map(e=>d(e)):[]}var p;function m(){return(m=e((()=>{p={getValue:()=>``,setValue:()=>{},clear:()=>{},setDisabled:()=>{},destroy:()=>{}}})))()}function h(){if(g||typeof document>`u`||typeof MutationObserver>`u`)return;g=!0;let e=e=>{!e||e.nodeType!==1||(e.classList?.contains(`c-code-entry`)&&!e.dataset?.codeEntryInitialised&&d(e),e.querySelectorAll?.(`.c-code-entry:not([data-code-entry-initialised])`).forEach(e=>{d(e)}))},t=()=>{document.body&&(_=new MutationObserver(t=>{for(let n of t)n.addedNodes.forEach(e)}),_.observe(document.body,{childList:!0,subtree:!0}))};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,t,{once:!0}):t()}var g,_;function v(){return(v=e((()=>{m(),g=!1,_=null})))()}function y(e){return{...e}}function b(e,t){return`
    <div class="${D} sbd-doc__card" style="${O}">
      <div class="sbd-doc__card-canvas" style="${k}">${x(y(e))}</div>
      <p class="sbd-doc__card-label">${t}</p>
    </div>
  `}var x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{n(),t(),m(),v(),i(),c(),h(),x=r.default.compile(o),S={length:{control:{type:`number`,min:2,max:10,step:1},name:`Length`,description:`Number of single-character boxes (default 6).`},label:{control:`text`,name:`Label`,description:"Group label rendered above the boxes (also the group `aria-label`)."},helperText:{control:`text`,name:`Helper text`,description:"Instructional message below the boxes; recolours to critical when `error` is set."},value:{control:`text`,name:`Value`,description:`Initial code; distributed one character per box.`},error:{control:`boolean`,name:`Error`,description:"Adds `is-error` + `aria-invalid` and paints every box with the critical border."},disabled:{control:`boolean`,name:`Disabled`,description:`Disables every box and paints the disabled surface.`},groupId:{control:`text`,name:`Group id`,description:"Wires the helper `aria-describedby`. Use a unique value per page."}},C={length:6,label:`Verification code`,helperText:`Enter the 6-digit code we sent to your email.`,value:``,error:!1,disabled:!1,groupId:`code-entry-demo`},w=async({canvasElement:e})=>{f(e)},T={title:`Patterns/Inputs/Code entry`,tags:[`autodocs`],render:e=>x(y(e)),args:C,argTypes:S,parameters:{contentWidth:`fluid`,design:l(`698:47604`),docs:{description:{component:'Code entry — a segmented one-time-code (OTP) field built from `length` single-character native `<input>` boxes inside a labelled `role="group"`. Mirrors Figma `698:47604` under the LifeLock mode pick. The JS layer adds auto-advance, backspace-to-previous, arrow-key navigation, and paste-spread; the boxes are `inputmode="numeric"` + `autocomplete="one-time-code"` so mobile keyboards and SMS autofill work. See [`./spec.md`](./spec.md) for the property contract and the `## JavaScript API` for the `lifelock:code-entry:*` events.'}}}},E={parameters:a(x(y(C)),{unit:`code-entry`,extra:{docs:{description:{story:`Interactive playground — type a digit to auto-advance, Backspace on an empty box to step back, or paste a full code to spread it across the boxes. Change Length to add or remove boxes.`}}}}),play:w},D=`l-col l-col--sm--4 l-col--md--6 l-col--lg--6 l-col--xl--6`,O=`padding: 16px; gap: 12px; align-items: flex-start;`,k=`padding: 0;`,A={parameters:{docs:{description:{story:`**Band 1** — 4-box and 6-box lengths. **Band 2** — empty / filled / error / disabled states on a 6-box code. Per-box hover + focus remain runtime CSS pseudo-classes.`}},design:l(`698:47604`)},render:()=>`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">${s(`698:47604`,`Code entry`)}</p>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Length</h2>
        <p class="sbd-doc__section-lede">A four-box PIN and the canonical six-box verification code.</p>
        <div class="l-row">
          ${b({...C,groupId:`ce-4`,length:4,label:`4-digit PIN`,helperText:`Enter your 4-digit PIN.`},`length = 4`)}
          ${b({...C,groupId:`ce-6`,length:6,label:`6-digit code`},`length = 6`)}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">States</h2>
        <p class="sbd-doc__section-lede">Empty, filled, error, and disabled on a six-box code.</p>
        <div class="l-row">
          ${b({...C,groupId:`ce-empty`,value:``,label:`Empty`},`empty`)}
          ${b({...C,groupId:`ce-filled`,value:`123456`,label:`Filled`},`filled`)}
          ${b({...C,groupId:`ce-error`,value:`120`,label:`Error`,error:!0,helperText:`That code is incorrect or expired.`},`error`)}
          ${b({...C,groupId:`ce-disabled`,value:`123456`,label:`Disabled`,disabled:!0},`disabled`)}
        </div>
      </section>
    </div>
  `,play:w},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compiled(buildArgs(defaultArgs)), {
    unit: 'code-entry',
    extra: {
      docs: {
        description: {
          story: 'Interactive playground — type a digit to auto-advance, Backspace on an empty box to step back, or paste a full code to spread it across the boxes. Change Length to add or remove boxes.'
        }
      }
    }
  }),
  play: playInit
}`,...E.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: '**Band 1** — 4-box and 6-box lengths. **Band 2** — empty / filled / error / disabled states on a 6-box code. Per-box hover + focus remain runtime CSS pseudo-classes.'
      }
    },
    design: figmaDesign('698:47604')
  },
  render: () => \`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">\${figmaFrameLink('698:47604', 'Code entry')}</p>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Length</h2>
        <p class="sbd-doc__section-lede">A four-box PIN and the canonical six-box verification code.</p>
        <div class="l-row">
          \${card({
    ...defaultArgs,
    groupId: 'ce-4',
    length: 4,
    label: '4-digit PIN',
    helperText: 'Enter your 4-digit PIN.'
  }, 'length = 4')}
          \${card({
    ...defaultArgs,
    groupId: 'ce-6',
    length: 6,
    label: '6-digit code'
  }, 'length = 6')}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">States</h2>
        <p class="sbd-doc__section-lede">Empty, filled, error, and disabled on a six-box code.</p>
        <div class="l-row">
          \${card({
    ...defaultArgs,
    groupId: 'ce-empty',
    value: '',
    label: 'Empty'
  }, 'empty')}
          \${card({
    ...defaultArgs,
    groupId: 'ce-filled',
    value: '123456',
    label: 'Filled'
  }, 'filled')}
          \${card({
    ...defaultArgs,
    groupId: 'ce-error',
    value: '120',
    label: 'Error',
    error: true,
    helperText: 'That code is incorrect or expired.'
  }, 'error')}
          \${card({
    ...defaultArgs,
    groupId: 'ce-disabled',
    value: '123456',
    label: 'Disabled',
    disabled: true
  }, 'disabled')}
        </div>
      </section>
    </div>
  \`,
  play: playInit
}`,...A.parameters?.docs?.source}}},j=[`Demo`,`AllStyles`]})))()}M();export{A as AllStyles,E as Demo,j as __namedExportsOrder,T as default};