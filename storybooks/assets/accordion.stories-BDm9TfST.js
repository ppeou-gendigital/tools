import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Fn as t,In as n,Q as r,X as i,Y as a,Z as o,i as s,n as c,r as l,t as u}from"./pretty-source-CA3IhMc4.js";function d(){if(typeof window>`u`||!window.matchMedia)return!1;try{return window.matchMedia(v).matches}catch{return!1}}function f(e){return e.querySelector(`:scope > .c-accordion__item-content`)}function p(e){return e.getAttribute(`data-disabled`)===`true`}function m(e,t,n){e.dispatchEvent(new CustomEvent(`lifelock:accordion:${t}`,{bubbles:!0,composed:!0,detail:n}))}function h(e){return e.id||e.getAttribute(`data-accordion-item-id`)||``}function g(e,t={}){if(!e||e.dataset.accordionInitialized===`true`)return null;e.dataset.accordionInitialized=`true`;let n=t.animate!==!1,r=typeof t.duration==`number`?t.duration:200,i=typeof t.singleOpen==`boolean`?t.singleOpen:e.getAttribute(`data-single-open`)===`true`,a=Array.from(e.querySelectorAll(`:scope > .c-accordion__item`));function o(e){return typeof e==`number`?a[e]||null:a.find(t=>h(t)===e)||null}function s(e,t,i){let a=f(e);if(a){if(!n||d()){e.open=t,m(e,`toggle`,{id:h(e),open:t,source:i}),m(e,t?`opened`:`closed`,{id:h(e),source:i});return}if(t){e.open=!0,e.dataset.animating=`opening`;let t=a.scrollHeight;a.style.maxBlockSize=`0px`,requestAnimationFrame(()=>{a.style.transition=`max-block-size ${r}ms ease`,a.style.maxBlockSize=`${t}px`});let n=()=>{a.style.transition=``,a.style.maxBlockSize=``,delete e.dataset.animating,a.removeEventListener(`transitionend`,n),m(e,`opened`,{id:h(e),source:i})};a.addEventListener(`transitionend`,n),m(e,`toggle`,{id:h(e),open:!0,source:i})}else{let t=a.scrollHeight;e.dataset.animating=`closing`,a.style.maxBlockSize=`${t}px`,requestAnimationFrame(()=>{a.style.transition=`max-block-size ${r}ms ease`,a.style.maxBlockSize=`0px`});let n=()=>{a.style.transition=``,a.style.maxBlockSize=``,delete e.dataset.animating,e.open=!1,a.removeEventListener(`transitionend`,n),m(e,`closed`,{id:h(e),source:i})};a.addEventListener(`transitionend`,n),m(e,`toggle`,{id:h(e),open:!1,source:i})}}}function c(e,t=`api`){let n=o(e);!n||p(n)||n.open||(i&&a.filter(e=>e!==n&&e.open&&!p(e)).forEach(e=>s(e,!1,`api`)),s(n,!0,t))}function l(e,t=`api`){let n=o(e);!n||!n.open||s(n,!1,t)}function u(e,t=`api`){let n=o(e);n&&(n.open?l(e,t):c(e,t))}function g(){return a.filter(e=>e.open).map(h)}function _(e){let t=e.target.closest(`.c-accordion__item-header`);if(!t)return;let n=t.parentElement;if(!n||!n.classList.contains(`c-accordion__item`))return;if(p(n)){e.preventDefault();return}e.preventDefault();let r=e.detail===0?`keyboard`:`click`;n.open?l(n.id||a.indexOf(n),r):c(n.id||a.indexOf(n),r)}a.forEach(e=>{let t=e.querySelector(`:scope > .c-accordion__item-header`);t&&t.addEventListener(`click`,_)});function v(){a.forEach(e=>{let t=e.querySelector(`:scope > .c-accordion__item-header`);t&&t.removeEventListener(`click`,_);let n=f(e);n&&(n.style.transition=``,n.style.maxBlockSize=``),delete e.dataset.animating}),delete e.dataset.accordionInitialized}return{open:c,close:l,toggle:u,getOpen:g,destroy:v}}function _(e,t){let n=e||(typeof document<`u`?document:null);return n?Array.from(n.querySelectorAll(`.c-accordion`)).map(e=>g(e,t)).filter(Boolean):[]}var v;function y(){return(y=e((()=>{v=`(prefers-reduced-motion: reduce)`})))()}function b(){if(x||typeof document>`u`||typeof MutationObserver>`u`)return;x=!0;let e=e=>{!e||e.nodeType!==1||(e.classList?.contains(`c-accordion`)&&e.dataset?.accordionInitialized!==`true`&&g(e),e.querySelectorAll?.(`.c-accordion:not([data-accordion-initialized])`).forEach(e=>{g(e)}))},t=()=>{document.body&&new MutationObserver(t=>{for(let n of t)n.addedNodes.forEach(e)}).observe(document.body,{childList:!0,subtree:!0})};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,t,{once:!0}):t()}var x;function S(){return(S=e((()=>{y(),x=!1})))()}function C({label:e,args:t}){return`
    <section style="margin:0 0 32px;">
      <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">${e}</h3>
      ${T(t)}
    </section>
  `}function w(e){let t=e===`disabled`,n=e===`expanded`,r=[`hover`,`focus`,`pressed`].includes(e)?e:void 0;return T({name:`state-${e}`,appearance:`default`,items:[{title:`State = ${e}`,body:D,expanded:n,disabled:t,state:r,showBody:!0,showDivider:!0,showIcon:!0}]})}var T,E,D,O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{r(),c(),n(),i(),s(),y(),S(),b(),T=o.default.compile(t),E=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28425&m=dev`,D=`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sodales massa in sapien tempor venenatis. Nam non ex rutrum, tincidunt leo vitae, interdum lorem.`,O=[{title:`Lorem ipsum dolor sit amet, consectetur adipiscing elit?`,body:D,expanded:!1,showBody:!0,showDivider:!0,showIcon:!0},{title:`Aenean ac eleifend lacus, in mollis lectus?`,body:D,expanded:!0,showBody:!0,showDivider:!0,showIcon:!0},{title:`Donec maximus, sapien id auctor consectetur?`,body:D,expanded:!1,showBody:!0,showDivider:!0,showIcon:!0}],k={name:`playground`,appearance:`default`,topDivider:!1,singleOpen:!1,groupTitle:null,items:O},A=async({canvasElement:e})=>{_(e)},j={title:`Patterns/Accordion`,tags:[`autodocs`],render:e=>T(e),args:k,argTypes:{name:{control:`text`,name:`Name`},appearance:{control:{type:`inline-radio`},options:[`default`,`card`],name:`Appearance`},topDivider:{control:`boolean`,name:`Top divider`},singleOpen:{control:`boolean`,name:`Single open`},groupTitle:{control:`text`,name:`Group title`},items:{control:`object`,name:`Items`}},parameters:{docs:{description:{component:`Accordion — vertical progressive-disclosure pattern. Appearance \`default\` (divider rows) or \`card\` (rounded surfaces). [Figma](${E}).`}}}},M={name:`Demo`,play:A,parameters:u(T(k),{scss:a,js:l})},N={name:`AllStyles`,play:A,render:()=>`
    <div style="display:flex;flex-direction:column;gap:8px;max-inline-size:720px;">
      ${C({label:`Default group`,args:{...k,name:`gallery-default`}})}
      ${C({label:`Top divider`,args:{...k,name:`gallery-top`,topDivider:!0}})}
      ${C({label:`Single open`,args:{...k,name:`gallery-single`,singleOpen:!0}})}
      ${C({label:`Card appearance`,args:{...k,name:`gallery-card`,appearance:`card`,items:O.map(e=>({...e,showDivider:!1}))}})}
      ${C({label:`Leading icon`,args:{...k,name:`gallery-leading`,items:O.map(e=>({...e,showLeadingIcon:!0,leadingIconName:`status/simple-status-info`}))}})}
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Interaction states</h3>
        <div style="display:flex;flex-direction:column;gap:0;max-inline-size:720px;">
          ${[`default`,`expanded`,`hover`,`focus`,`pressed`,`disabled`].map(e=>w(e)).join(``)}
        </div>
      </section>
    </div>
  `},P={name:`SlotShowcase`,play:A,render:()=>T({name:`slots`,appearance:`default`,items:[{title:`Body text`,body:D,expanded:!0,showBody:!0,showDivider:!0,showIcon:!0},{title:`Bulleted list`,showBody:!1,showList:!0,listItems:[`Lorem ipsum dolor sit amet`,`Consectetur adipiscing elit`,`Nulla sodales massa in sapien tempor venenatis`],expanded:!0,showDivider:!0,showIcon:!0},{title:`Body + learn more link`,body:D,showBody:!0,showLink:!0,linkLabel:`Learn more`,linkHref:`#`,expanded:!0,showDivider:!0,showIcon:!0}]})},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  play: playInit,
  parameters: htmlStoryParameters(compiled(defaultArgs), {
    scss: scssSource,
    js: jsSource
  })
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  play: playInit,
  render: () => \`
    <div style="display:flex;flex-direction:column;gap:8px;max-inline-size:720px;">
      \${groupCard({
    label: 'Default group',
    args: {
      ...defaultArgs,
      name: 'gallery-default'
    }
  })}
      \${groupCard({
    label: 'Top divider',
    args: {
      ...defaultArgs,
      name: 'gallery-top',
      topDivider: true
    }
  })}
      \${groupCard({
    label: 'Single open',
    args: {
      ...defaultArgs,
      name: 'gallery-single',
      singleOpen: true
    }
  })}
      \${groupCard({
    label: 'Card appearance',
    args: {
      ...defaultArgs,
      name: 'gallery-card',
      appearance: 'card',
      items: defaultItems.map(item => ({
        ...item,
        showDivider: false
      }))
    }
  })}
      \${groupCard({
    label: 'Leading icon',
    args: {
      ...defaultArgs,
      name: 'gallery-leading',
      items: defaultItems.map(item => ({
        ...item,
        showLeadingIcon: true,
        leadingIconName: 'status/simple-status-info'
      }))
    }
  })}
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Interaction states</h3>
        <div style="display:flex;flex-direction:column;gap:0;max-inline-size:720px;">
          \${['default', 'expanded', 'hover', 'focus', 'pressed', 'disabled'].map(s => stateRow(s)).join('')}
        </div>
      </section>
    </div>
  \`
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  name: 'SlotShowcase',
  play: playInit,
  render: () => compiled({
    name: 'slots',
    appearance: 'default',
    items: [{
      title: 'Body text',
      body: DEFAULT_BODY,
      expanded: true,
      showBody: true,
      showDivider: true,
      showIcon: true
    }, {
      title: 'Bulleted list',
      showBody: false,
      showList: true,
      listItems: ['Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Nulla sodales massa in sapien tempor venenatis'],
      expanded: true,
      showDivider: true,
      showIcon: true
    }, {
      title: 'Body + learn more link',
      body: DEFAULT_BODY,
      showBody: true,
      showLink: true,
      linkLabel: 'Learn more',
      linkHref: '#',
      expanded: true,
      showDivider: true,
      showIcon: true
    }]
  })
}`,...P.parameters?.docs?.source}}},F=[`Demo`,`AllStyles`,`SlotShowcase`]})))()}I();export{N as AllStyles,M as Demo,P as SlotShowcase,F as __namedExportsOrder,j as default};