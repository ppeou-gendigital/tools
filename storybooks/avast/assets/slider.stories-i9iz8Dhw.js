import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{M as t,i as n,j as r,n as i,r as a,t as o}from"./pretty-source-CvP1BtiP.js";import{n as s,r as c,t as l}from"./figma-links-B0HkTJ7d.js";function u(e,t,n){return n===t?0:(Math.min(n,Math.max(t,e))-t)/(n-t)*100}function d(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0}))}function f(e,t={}){if(!e||e.dataset.sliderInitialised===`true`)return{getValue:()=>0,setValue:()=>{},setDisabled:()=>{},destroy:()=>{}};e.dataset.sliderInitialised=`true`;let n=e.dataset.variant||`continuous`,r=e.dataset.selection||`single-value`,i=Number(e.dataset.min??0),a=Number(e.dataset.max??100),o=Number(e.dataset.step??1),s=typeof t.snapToTicks==`boolean`?t.snapToTicks:n===`discrete`,c=t.commitOn===`input`?`input`:`change`,l=Array.from(e.querySelectorAll(`.c-slider__input`)),f=e.querySelector(`.c-slider__thumb:not(.c-slider__thumb--start):not(.c-slider__thumb--end)`),p=e.querySelector(`.c-slider__thumb--start`),m=e.querySelector(`.c-slider__thumb--end`),h=e.querySelector(`.c-slider__active-fill`),g=e.querySelector(`.c-slider__value-label[data-role="value"]`),_=e.querySelector(`.c-slider__value-label[data-role="value-min"]`),v=e.querySelector(`.c-slider__value-label[data-role="value-max"]`);function y(t){if(r===`range`){let n=Number(l[0]?.value??i),r=Number(l[1]?.value??a),o=Math.min(n,r),s=Math.max(n,r),c=u(o,i,a),f=u(s,i,a);p&&p.style.setProperty(`--slider-thumb-offset`,`${c}%`),m&&m.style.setProperty(`--slider-thumb-offset`,`${f}%`),h&&(h.style.setProperty(`--slider-fill-start`,`${c}%`),h.style.setProperty(`--slider-fill-end`,`${f}%`)),_&&(_.textContent=String(o)),v&&(v.textContent=String(s)),d(e,`lifelock:slider:input`,{value:{min:o,max:s},source:t})}else{let n=Number(l[0]?.value??i),r=u(n,i,a);f&&f.style.setProperty(`--slider-thumb-offset`,`${r}%`),h&&(h.style.setProperty(`--slider-fill-start`,`0%`),h.style.setProperty(`--slider-fill-end`,`${r}%`)),g&&(g.textContent=String(n)),d(e,`lifelock:slider:input`,{value:n,source:t})}}function b(e){if(!s)return;let t=Number(e.value),n=Math.round((t-i)/o)*o+i,r=Math.min(a,Math.max(i,n));r!==t&&(e.value=String(r))}function x(e){if(!Number.isFinite(o)||o<=0)return e;let t=Math.round((e-i)/o)*o+i;return Math.min(a,Math.max(i,t))}function S(t){if(e.getAttribute(`aria-disabled`)===`true`)return;let n=t.currentTarget;if(r===`range`&&l.length===2){let e=Number(l[0].value),t=Number(l[1].value);n===l[0]&&e>t&&(l[1].value=String(e)),n===l[1]&&t<e&&(l[0].value=String(t))}y(`pointer`)}function C(t){if(e.getAttribute(`aria-disabled`)===`true`)return;let n=t.currentTarget;b(n),y(`pointer`);let i=r===`range`?{min:Math.min(Number(l[0].value),Number(l[1].value)),max:Math.max(Number(l[0].value),Number(l[1].value))}:Number(l[0].value);(c===`change`||c===`input`)&&d(e,`lifelock:slider:commit`,{value:i,source:`pointer`})}function w(t){e.getAttribute(`aria-disabled`)!==`true`&&(t.key===`ArrowLeft`||t.key===`ArrowRight`||t.key===`ArrowUp`||t.key===`ArrowDown`||t.key===`Home`||t.key===`End`||t.key===`PageUp`||t.key===`PageDown`)&&d(e,`lifelock:slider:commit`,{value:r===`range`?{min:Math.min(Number(l[0].value),Number(l[1].value)),max:Math.max(Number(l[0].value),Number(l[1].value))}:Number(l[0].value),source:`keyboard`})}return l.forEach(e=>{e.addEventListener(`input`,S),e.addEventListener(`change`,C),e.addEventListener(`keyup`,w)}),y(`api`),{getValue(){return r===`range`?{min:Math.min(Number(l[0].value),Number(l[1].value)),max:Math.max(Number(l[0].value),Number(l[1].value))}:Number(l[0].value)},setValue(e){r===`range`&&typeof e==`object`&&e?(l[0].value=String(x(Number(e.min))),l[1].value=String(x(Number(e.max)))):typeof e==`number`&&(l[0].value=String(x(e))),y(`api`)},setDisabled(t){t?(e.setAttribute(`aria-disabled`,`true`),e.classList.add(`is-disabled`),l.forEach(e=>e.disabled=!0)):(e.removeAttribute(`aria-disabled`),e.classList.remove(`is-disabled`),l.forEach(e=>e.disabled=!1))},destroy(){l.forEach(e=>{e.removeEventListener(`input`,S),e.removeEventListener(`change`,C),e.removeEventListener(`keyup`,w)}),delete e.dataset.sliderInitialised}}}function p(e,t){let n=e&&typeof e.querySelectorAll==`function`?e:typeof document<`u`?document:null;return n?Array.from(n.querySelectorAll(`.c-slider`)).map(e=>f(e,t)):[]}function m(){if(h||typeof document>`u`||typeof MutationObserver>`u`)return;h=!0;let e=e=>{!e||e.nodeType!==1||(e.classList?.contains(`c-slider`)&&!e.dataset?.sliderInitialised&&f(e),e.querySelectorAll?.(`.c-slider:not([data-slider-initialised])`).forEach(e=>{f(e)}))},t=()=>{document.body&&(g=new MutationObserver(t=>{for(let n of t)n.addedNodes.forEach(e)}),g.observe(document.body,{childList:!0,subtree:!0}))};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,t,{once:!0}):t()}var h,g;function _(){return(_=e((()=>{h=!1,g=null})))()}function v(e,t,n,r){if(!Number.isFinite(t)||t<=0)return e;let i=Math.round((e-n)/t)*t+n;return Math.min(r,Math.max(n,i))}function y(e){let t={...e},n=Number(t.min??0),r=Number(t.max??100),i=r-n||1,a=Number(t.step??1);if(t.step=a,t.selection===`range`){let e=Math.min(Math.max(Number(t.valueMin??n),n),Number(t.valueMax??r)),o=Math.max(Math.min(Number(t.valueMax??r),r),Number(t.valueMin??n)),s=v(e,a,n,r),c=v(o,a,n,r);t.valueMin=s,t.valueMax=c,t.startPct=(s-n)/i*100,t.endPct=(c-n)/i*100,t.fillStartPct=t.startPct,t.fillEndPct=t.endPct}else{let e=v(Math.min(Math.max(Number(t.value??n),n),r),a,n,r);t.value=e,t.valuePct=(e-n)/i*100,t.fillStartPct=0,t.fillEndPct=t.valuePct}return t.tickOffsets=t.variant===`discrete`?E:[],t}function b({variant:e,selection:t,label:n}){let r=y({...O,variant:e,selection:t,label:n});return`
    <div class="${M} sbd-doc__card" style="${N}">
      <div class="sbd-doc__card-canvas" style="${P}">${S(r)}</div>
      <p class="sbd-doc__card-label">${e} · ${t}</p>
    </div>
  `}function x(e){let t=y({...O,variant:`continuous`,selection:`single-value`,state:e===`disabled`?`default`:e,disabled:e===`disabled`,label:`State = ${e}`});return`
    <div class="${M} sbd-doc__card" style="${N}">
      <div class="sbd-doc__card-canvas" style="${P}">${S(t)}</div>
      <p class="sbd-doc__card-label">${e}</p>
    </div>
  `}var S,C,w,T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{n(),r(),_(),i(),c(),m(),S=a.default.compile(t),C=[`continuous`,`discrete`],w=[`single-value`,`range`],T=[`default`,`hover`,`focused`,`active`,`disabled`],E=Array.from({length:11},(e,t)=>t*10),D={variant:{control:{type:`inline-radio`},options:C,name:`Variant`},selection:{control:{type:`inline-radio`},options:w,name:`Selection`},min:{control:`number`,name:`Min`},max:{control:`number`,name:`Max`},step:{control:`number`,name:`Step`},value:{control:`number`,name:`Value`},valueMin:{control:`number`,name:`Value min`},valueMax:{control:`number`,name:`Value max`},showValueLabel:{control:`boolean`,name:`Show value label`},label:{control:`text`,name:`Label`},disabled:{control:`boolean`,name:`Disabled`},name:{control:`text`,name:`Name`},state:{control:{type:`inline-radio`},options:T,name:`Presentational state`}},O={variant:`continuous`,selection:`single-value`,min:0,max:100,step:1,value:40,valueMin:25,valueMax:75,showValueLabel:!0,label:`Volume`,disabled:!1,name:`volume`,state:`default`},k=async({canvasElement:e})=>{p(e)},A={title:`Molecules/Slider`,tags:[`autodocs`,`shared-library`],render:e=>S(y(e)),args:O,argTypes:D,parameters:{badges:[`shared`],contentWidth:`fluid`,design:l([[`Sliders canvas — 539:28421`,`539:28421`],[`Master · DS · Slider — 1336:2939`,`1336:2939`]])}},j={parameters:o(S(y(O)),{unit:`slider`}),play:k},M=`l-col l-col--sm--4 l-col--md--6 l-col--lg--6 l-col--xl--6`,N=`padding: 10px; gap: 8px;`,P=`align-self: stretch; inline-size: 100%; padding: 0;`,F={parameters:{design:l([[`Sliders canvas — 539:28421`,`539:28421`],[`Master · DS · Slider — 1336:2939`,`1336:2939`]])},render:()=>`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">${s(`539:28421`,`Sliders canvas`)} ${s(`1336:2939`,`Master · DS · Slider`)}</p>
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Persistent variants — Variant × Selection</h2>
        <div class="l-row">
          ${b({variant:`continuous`,selection:`single-value`,label:`Continuous · single-value`})}
          ${b({variant:`continuous`,selection:`range`,label:`Continuous · range`})}
          ${b({variant:`discrete`,selection:`single-value`,label:`Discrete · single-value`})}
          ${b({variant:`discrete`,selection:`range`,label:`Discrete · range`})}
        </div>
      </section>
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Interaction states — continuous · single-value</h2>
        <div class="l-row">
          ${T.map(e=>x(e)).join(``)}
        </div>
      </section>
    </div>
  `,play:k},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compiled(buildArgs(defaultArgs)), {
    unit: 'slider'
  }),
  play: playInitSliders
}`,...j.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  parameters: {
    design: figmaDesign([['Sliders canvas — 539:28421', '539:28421'], ['Master · DS · Slider — 1336:2939', '1336:2939']])
  },
  render: () => \`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">\${figmaFrameLink('539:28421', 'Sliders canvas')} \${figmaFrameLink('1336:2939', 'Master · DS · Slider')}</p>
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Persistent variants — Variant × Selection</h2>
        <div class="l-row">
          \${variantSelectionCard({
    variant: 'continuous',
    selection: 'single-value',
    label: 'Continuous · single-value'
  })}
          \${variantSelectionCard({
    variant: 'continuous',
    selection: 'range',
    label: 'Continuous · range'
  })}
          \${variantSelectionCard({
    variant: 'discrete',
    selection: 'single-value',
    label: 'Discrete · single-value'
  })}
          \${variantSelectionCard({
    variant: 'discrete',
    selection: 'range',
    label: 'Discrete · range'
  })}
        </div>
      </section>
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Interaction states — continuous · single-value</h2>
        <div class="l-row">
          \${STATE_OPTIONS.map(state => stateCard(state)).join('')}
        </div>
      </section>
    </div>
  \`,
  play: playInitSliders
}`,...F.parameters?.docs?.source}}},I=[`Demo`,`AllStyles`]})))()}L();export{F as AllStyles,j as Demo,I as __namedExportsOrder,A as default};