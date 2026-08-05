import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ht as t,Q as n,Vt as r,Z as i,n as a,t as o}from"./pretty-source-C_TZ5wEY.js";import"./icon-D6wgK3Ul.js";import{n as s,r as c,t as l}from"./figma-links-B0HkTJ7d.js";function u(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0}))}function d(e){if(!e||e.dataset.searchBoxInitialised===`true`)return{...p};e.dataset.searchBoxInitialised=`true`;let t=e.querySelector(`.c-search-box__input`),n=e.querySelector(`.c-search-box__clear`);if(!t)return{...p,destroy(){delete e.dataset.searchBoxInitialised}};function r(){e.classList.toggle(`is-filled`,t.value.length>0)}function i(){r(),u(e,`lifelock:search-box:input`,{value:t.value})}function a(){t.value=``,r(),t.focus(),u(e,`lifelock:search-box:clear`,{}),u(e,`lifelock:search-box:input`,{value:``})}return t.addEventListener(`input`,i),n&&n.addEventListener(`click`,a),r(),{getValue(){return t.value},setValue(n){t.value=String(n??``),r(),u(e,`lifelock:search-box:input`,{value:t.value})},clear(){a()},setDisabled(r){t.disabled=!!r,n&&(n.disabled=!!r),e.classList.toggle(`is-disabled`,!!r)},destroy(){t.removeEventListener(`input`,i),n&&n.removeEventListener(`click`,a),delete e.dataset.searchBoxInitialised}}}function f(e){let t=e&&typeof e.querySelectorAll==`function`?e:typeof document<`u`?document:null;return t?Array.from(t.querySelectorAll(`.c-search-box`)).map(e=>d(e)):[]}var p;function m(){return(m=e((()=>{p={getValue:()=>``,setValue:()=>{},clear:()=>{},setDisabled:()=>{},destroy:()=>{}}})))()}function h(){if(g||typeof document>`u`||typeof MutationObserver>`u`)return;g=!0;let e=e=>{!e||e.nodeType!==1||(e.classList?.contains(`c-search-box`)&&!e.dataset?.searchBoxInitialised&&d(e),e.querySelectorAll?.(`.c-search-box:not([data-search-box-initialised])`).forEach(e=>{d(e)}))},t=()=>{document.body&&(_=new MutationObserver(t=>{for(let n of t)n.addedNodes.forEach(e)}),_.observe(document.body,{childList:!0,subtree:!0}))};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,t,{once:!0}):t()}var g,_;function v(){return(v=e((()=>{m(),g=!1,_=null})))()}function y(e){return{...e}}function b(e,t){return`
    <div class="${O} sbd-doc__card" style="${k}">
      <div class="sbd-doc__card-canvas" style="${A}">${x(y(e))}</div>
      <p class="sbd-doc__card-label">${t}</p>
    </div>
  `}var x,S,C,w,T,E,D,O,k,A,j,M;function N(){return(N=e((()=>{n(),r(),m(),v(),a(),c(),h(),x=i.default.compile(t),S=[`m`,`l`],C={size:{control:{type:`inline-radio`},options:S,name:`Size`,description:"`m` = 32px control; `l` = 40px control (larger input text)."},iconFirst:{control:`boolean`,name:`Icon first`,description:`Lead with the search glyph + separator (true) or trail them after the input (false).`},placeholder:{control:`text`,name:`Placeholder`,description:`Native placeholder text.`},value:{control:`text`,name:`Value`,description:`Initial value; a non-empty value reveals the clear button.`},accessibleLabel:{control:`text`,name:`Accessible label`,description:"Bound to the input's `aria-label` (the search box has no visible `<label>`)."},disabled:{control:`boolean`,name:`Disabled`,description:`Disables the input + clear button and paints the disabled surface.`},name:{control:`text`,name:`Name`,description:"Bound to the input `name` (form submission)."},clearLabel:{control:`text`,name:`Clear label`,description:'Accessible name for the clear button (`aria-label`). Defaults to `"Clear search"`.'}},w={size:`m`,iconFirst:!0,placeholder:`Search`,value:``,accessibleLabel:`Search`,disabled:!1,name:`q`,clearLabel:`Clear search`},T=async({canvasElement:e})=>{f(e)},E={title:`Patterns/Inputs/Search box`,tags:[`autodocs`],render:e=>x(y(e)),args:w,argTypes:C,parameters:{contentWidth:`fluid`,design:l(`698:47669`),docs:{description:{component:'Search box — native `<input type="search">` inside a bordered `:focus-within` control with a leading search glyph, a vertical separator, and a JS-driven clear (×) button that shows once the field is filled. Two sizes (`m` = 32px, `l` = 40px). Mirrors Figma `698:47669` under the LifeLock mode pick. The native UA search-cancel button is suppressed so the clear affordance is consistent across Chrome / Firefox / Safari. See [`./spec.md`](./spec.md) for the property contract and the `## JavaScript API` for the `lifelock:search-box:*` events.'}}}},D={parameters:o(x(y(w)),{unit:`search-box`,extra:{docs:{description:{story:`Interactive playground — type to reveal the clear button, press it to empty + refocus, switch Size, or flip Icon first to trail the glyph after the input.`}}}}),play:T},O=`l-col l-col--sm--4 l-col--md--6 l-col--lg--4 l-col--xl--4`,k=`padding: 16px; gap: 12px; align-items: stretch;`,A=`padding: 0; width: 100%;`,j={parameters:{docs:{description:{story:"**Band 1** — both sizes (`m` / `l`) and the `iconFirst` flip. **Band 2** — empty / filled / disabled states. Hover + focus remain runtime CSS pseudo-classes."}},design:l(`698:47669`)},render:()=>`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">${s(`698:47669`,`Search box`)}</p>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Size &amp; icon placement</h2>
        <p class="sbd-doc__section-lede">Medium (32px) and large (40px), with the search glyph leading or trailing.</p>
        <div class="l-row">
          ${b({...w,size:`m`,iconFirst:!0},`m · icon first`)}
          ${b({...w,size:`l`,iconFirst:!0},`l · icon first`)}
          ${b({...w,size:`m`,iconFirst:!1},`m · icon last`)}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">States</h2>
        <p class="sbd-doc__section-lede">Empty, filled (clear button visible), and disabled.</p>
        <div class="l-row">
          ${b({...w,value:``},`empty`)}
          ${b({...w,value:`identity theft`},`filled`)}
          ${b({...w,value:`identity theft`,disabled:!0},`disabled`)}
        </div>
      </section>
    </div>
  `,play:T},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compiled(buildArgs(defaultArgs)), {
    unit: 'search-box',
    extra: {
      docs: {
        description: {
          story: 'Interactive playground — type to reveal the clear button, press it to empty + refocus, switch Size, or flip Icon first to trail the glyph after the input.'
        }
      }
    }
  }),
  play: playInit
}`,...D.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: '**Band 1** — both sizes (\`m\` / \`l\`) and the \`iconFirst\` flip. **Band 2** — empty / filled / disabled states. Hover + focus remain runtime CSS pseudo-classes.'
      }
    },
    design: figmaDesign('698:47669')
  },
  render: () => \`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">\${figmaFrameLink('698:47669', 'Search box')}</p>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Size &amp; icon placement</h2>
        <p class="sbd-doc__section-lede">Medium (32px) and large (40px), with the search glyph leading or trailing.</p>
        <div class="l-row">
          \${card({
    ...defaultArgs,
    size: 'm',
    iconFirst: true
  }, 'm · icon first')}
          \${card({
    ...defaultArgs,
    size: 'l',
    iconFirst: true
  }, 'l · icon first')}
          \${card({
    ...defaultArgs,
    size: 'm',
    iconFirst: false
  }, 'm · icon last')}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">States</h2>
        <p class="sbd-doc__section-lede">Empty, filled (clear button visible), and disabled.</p>
        <div class="l-row">
          \${card({
    ...defaultArgs,
    value: ''
  }, 'empty')}
          \${card({
    ...defaultArgs,
    value: 'identity theft'
  }, 'filled')}
          \${card({
    ...defaultArgs,
    value: 'identity theft',
    disabled: true
  }, 'disabled')}
        </div>
      </section>
    </div>
  \`,
  play: playInit
}`,...j.parameters?.docs?.source}}},M=[`Demo`,`AllStyles`]})))()}N();export{j as AllStyles,D as Demo,M as __namedExportsOrder,E as default};