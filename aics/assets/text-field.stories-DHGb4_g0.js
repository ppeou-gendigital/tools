import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Gt as t,Kt as n,Q as r,Z as i,n as a,t as o}from"./pretty-source-CA3IhMc4.js";import"./icon-D6wgK3Ul.js";import{n as s,r as c,t as l}from"./figma-links-B0HkTJ7d.js";function u(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0}))}function d(e,t={}){if(!e||e.dataset.textFieldInitialised===`true`)return{...p};e.dataset.textFieldInitialised=`true`;let n=e.querySelector(`.c-text-field__field`),r=e.querySelector(`.c-text-field__reveal`);if(!n||!r)return{...p,destroy(){delete e.dataset.textFieldInitialised}};function i(t,i){e.classList.toggle(`is-revealed`,t),n.type=t?`text`:`password`,r.setAttribute(`aria-pressed`,t?`true`:`false`),r.setAttribute(`aria-label`,t?`Hide password`:`Show password`),u(e,`lifelock:text-field:reveal`,{revealed:t,source:i})}function a(){i(!e.classList.contains(`is-revealed`),`pointer`)}return r.addEventListener(`click`,a),t.revealed&&i(!0,`api`),{getRevealed(){return e.classList.contains(`is-revealed`)},setRevealed(e){i(!!e,`api`)},setDisabled(t){t?(e.classList.add(`is-disabled`),n.disabled=!0,r.disabled=!0):(e.classList.remove(`is-disabled`),n.disabled=!1,r.disabled=!1)},destroy(){r.removeEventListener(`click`,a),delete e.dataset.textFieldInitialised}}}function f(e,t){let n=e&&typeof e.querySelectorAll==`function`?e:typeof document<`u`?document:null;return n?Array.from(n.querySelectorAll(`.c-text-field`)).map(e=>d(e,t)):[]}var p;function m(){return(m=e((()=>{p={getRevealed:()=>!1,setRevealed:()=>{},setDisabled:()=>{},destroy:()=>{}}})))()}function h(){if(g||typeof document>`u`||typeof MutationObserver>`u`)return;g=!0;let e=e=>{!e||e.nodeType!==1||(e.classList?.contains(`c-text-field`)&&!e.dataset?.textFieldInitialised&&d(e),e.querySelectorAll?.(`.c-text-field:not([data-text-field-initialised])`).forEach(e=>{d(e)}))},t=()=>{document.body&&(_=new MutationObserver(t=>{for(let n of t)n.addedNodes.forEach(e)}),_.observe(document.body,{childList:!0,subtree:!0}))};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,t,{once:!0}):t()}var g,_;function v(){return(v=e((()=>{m(),g=!1,_=null})))()}function y(e){return{...e,selectOptions:C,prefixOptions:w}}function b(e,t){return`
    <div class="${A} sbd-doc__card" style="${j}">
      <div class="sbd-doc__card-canvas" style="${M}">${x(y(e))}</div>
      <p class="sbd-doc__card-label">${t}</p>
    </div>
  `}var x,S,C,w,T,E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{r(),t(),m(),v(),a(),c(),h(),x=i.default.compile(n),S=[`text`,`password`,`select`,`combined`,`split`],C=[{value:`us`,label:`United States`,selected:!0},{value:`ca`,label:`Canada`},{value:`uk`,label:`United Kingdom`},{value:`au`,label:`Australia`}],w=[{value:`https`,label:`https://`,selected:!0},{value:`http`,label:`http://`}],T={type:{control:{type:`inline-radio`},options:S,name:`Type`,description:"`text` / `password` render a native `<input>`; `select` a native `<select>`; `combined` a prefix `<select>` + `<input>` in one bordered wrapper; `split` two separate boxes."},label:{control:`text`,name:`Label`,description:"Field title rendered as a `<label for>`."},helperText:{control:`text`,name:`Helper text`,description:"Instructional message below the control, wired via `aria-describedby`. Recolours to critical when `error` is set."},placeholder:{control:`text`,name:`Placeholder`,description:`Native placeholder (text / password / combined / split).`},value:{control:`text`,name:`Value`,description:`Initial input value.`},required:{control:`boolean`,name:`Required`,description:"Appends a `*` marker to the field title."},error:{control:`boolean`,name:`Error`,description:"Adds `is-error` + `aria-invalid`, paints the critical border, recolours the helper."},disabled:{control:`boolean`,name:`Disabled`,description:`Disables the native control and paints the disabled trio.`},id:{control:`text`,name:`Field id`,description:"Wires `<label for>` + `aria-describedby`. Use a unique value per page."},name:{control:`text`,name:`Name`,description:"Bound to the native control `name` (form submission)."},selectOptions:{control:`object`,name:`Select options`,description:"Native `<option>` rows for the standalone select (`type=select`). Each entry: `{ value: string, label: string, selected?: boolean }`."},prefixOptions:{control:`object`,name:`Prefix options`,description:"Native `<option>` rows for the prefix select (`type=combined|split`). Each entry: `{ value: string, label: string, selected?: boolean }`."},prefixLabel:{control:`text`,name:`Prefix label`,description:'`aria-label` for the prefix select in combined / split. Defaults to `"Prefix"`.'}},E={type:`text`,label:`Email address`,helperText:`We'll never share your email.`,placeholder:`you@example.com`,value:``,required:!1,error:!1,disabled:!1,id:`text-field-demo`,name:`email`},D=async({canvasElement:e})=>{f(e)},O={title:`Patterns/Inputs/Text field`,tags:[`autodocs`],render:e=>x(y(e)),args:E,argTypes:T,parameters:{contentWidth:`fluid`,design:l(`698:47055`),docs:{description:{component:"Text field — native `<input>` / `<select>` dressed with the LifeLock Layer 3c input tokens. Five `type` structures (text / password / select / combined / split) cover the Figma `698:47055` axes; CSS pseudo-classes collapse the Figma `State` axis (hover / focus / filled / error / disabled) to a handful of props. The open `<select>` menu is styled via `appearance: base-select` in Chromium 135+ and falls back to the native OS popup elsewhere. See [`./spec.md`](./spec.md) for the property contract and the `## JavaScript API` for the password-reveal `lifelock:text-field:reveal` event."}}}},k={parameters:o(x(y(E)),{unit:`text-field`,extra:{docs:{description:{story:`Interactive playground — switch Type to walk text / password / select / combined / split, toggle Error and Disabled, or set a Value to see the filled paint. The native control carries the source-of-truth value; password reveal is the only JS-driven affordance.`}}}}),play:D},A=`l-col l-col--sm--4 l-col--md--6 l-col--lg--4 l-col--xl--4`,j=`padding: 16px; gap: 12px; align-items: stretch;`,M=`padding: 0; width: 100%;`,N={parameters:{docs:{description:{story:"**Band 1** — the five `type` structures. **Band 2** — prop-driven states (default / filled / error / disabled) on a `type=text` field. Hover + focus remain runtime CSS pseudo-classes (`:hover` / `:focus-visible`), so they are not frozen here."}},design:l(`698:47055`)},render:()=>`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">${s(`698:47055`,`Text field`)}</p>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Structural variants — Type</h2>
        <p class="sbd-doc__section-lede">Each <code>type</code> maps to a native control. <code>select</code> keeps the UA arrow in Firefox / Safari and styles the open menu in Chromium 135+.</p>
        <div class="l-row">
          ${b({...E,id:`tf-text`,type:`text`,label:`Text`,value:`jane@lifelock.com`},`text`)}
          ${b({...E,id:`tf-pass`,type:`password`,label:`Password`,value:`hunter2`,helperText:`At least 8 characters.`},`password`)}
          ${b({...E,id:`tf-select`,type:`select`,label:`Country`,placeholder:``,helperText:`Choose your billing country.`},`select`)}
          ${b({...E,id:`tf-combined`,type:`combined`,label:`Website`,placeholder:`example.com`,helperText:`Pick a scheme, then type the host.`},`combined`)}
          ${b({...E,id:`tf-split`,type:`split`,label:`Website`,placeholder:`example.com`,helperText:`Scheme and host as separate boxes.`},`split`)}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">States — text</h2>
        <p class="sbd-doc__section-lede">Default, filled, error, and disabled on the canonical <code>type=text</code> field.</p>
        <div class="l-row">
          ${b({...E,id:`tf-st-default`,type:`text`,label:`Default`,value:``},`default`)}
          ${b({...E,id:`tf-st-filled`,type:`text`,label:`Filled`,value:`jane@lifelock.com`},`filled`)}
          ${b({...E,id:`tf-st-error`,type:`text`,label:`Error`,value:`not-an-email`,error:!0,helperText:`Enter a valid email address.`},`error`)}
          ${b({...E,id:`tf-st-disabled`,type:`text`,label:`Disabled`,value:`jane@lifelock.com`,disabled:!0},`disabled`)}
        </div>
      </section>
    </div>
  `,play:D},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compiled(buildArgs(defaultArgs)), {
    unit: 'text-field',
    extra: {
      docs: {
        description: {
          story: 'Interactive playground — switch Type to walk text / password / select / combined / split, toggle Error and Disabled, or set a Value to see the filled paint. The native control carries the source-of-truth value; password reveal is the only JS-driven affordance.'
        }
      }
    }
  }),
  play: playInit
}`,...k.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: '**Band 1** — the five \`type\` structures. **Band 2** — prop-driven states (default / filled / error / disabled) on a \`type=text\` field. Hover + focus remain runtime CSS pseudo-classes (\`:hover\` / \`:focus-visible\`), so they are not frozen here.'
      }
    },
    design: figmaDesign('698:47055')
  },
  render: () => \`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">\${figmaFrameLink('698:47055', 'Text field')}</p>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Structural variants — Type</h2>
        <p class="sbd-doc__section-lede">Each <code>type</code> maps to a native control. <code>select</code> keeps the UA arrow in Firefox / Safari and styles the open menu in Chromium 135+.</p>
        <div class="l-row">
          \${card({
    ...defaultArgs,
    id: 'tf-text',
    type: 'text',
    label: 'Text',
    value: 'jane@lifelock.com'
  }, 'text')}
          \${card({
    ...defaultArgs,
    id: 'tf-pass',
    type: 'password',
    label: 'Password',
    value: 'hunter2',
    helperText: 'At least 8 characters.'
  }, 'password')}
          \${card({
    ...defaultArgs,
    id: 'tf-select',
    type: 'select',
    label: 'Country',
    placeholder: '',
    helperText: 'Choose your billing country.'
  }, 'select')}
          \${card({
    ...defaultArgs,
    id: 'tf-combined',
    type: 'combined',
    label: 'Website',
    placeholder: 'example.com',
    helperText: 'Pick a scheme, then type the host.'
  }, 'combined')}
          \${card({
    ...defaultArgs,
    id: 'tf-split',
    type: 'split',
    label: 'Website',
    placeholder: 'example.com',
    helperText: 'Scheme and host as separate boxes.'
  }, 'split')}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">States — text</h2>
        <p class="sbd-doc__section-lede">Default, filled, error, and disabled on the canonical <code>type=text</code> field.</p>
        <div class="l-row">
          \${card({
    ...defaultArgs,
    id: 'tf-st-default',
    type: 'text',
    label: 'Default',
    value: ''
  }, 'default')}
          \${card({
    ...defaultArgs,
    id: 'tf-st-filled',
    type: 'text',
    label: 'Filled',
    value: 'jane@lifelock.com'
  }, 'filled')}
          \${card({
    ...defaultArgs,
    id: 'tf-st-error',
    type: 'text',
    label: 'Error',
    value: 'not-an-email',
    error: true,
    helperText: 'Enter a valid email address.'
  }, 'error')}
          \${card({
    ...defaultArgs,
    id: 'tf-st-disabled',
    type: 'text',
    label: 'Disabled',
    value: 'jane@lifelock.com',
    disabled: true
  }, 'disabled')}
        </div>
      </section>
    </div>
  \`,
  play: playInit
}`,...N.parameters?.docs?.source}}},P=[`Demo`,`AllStyles`]})))()}F();export{N as AllStyles,k as Demo,P as __namedExportsOrder,O as default};