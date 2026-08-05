import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{_ as t,i as n,n as r,r as i,t as a,v as o}from"./pretty-source-CS7MQ53Z.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";function l(e,t){e.classList.toggle(`is-open`,t),t?e.removeAttribute(`hidden`):e.setAttribute(`hidden`,``)}function u(e,t={}){if(!e||e.dataset.tooltipInitialized===`true`)return null;e.dataset.tooltipInitialized=`true`;let n=null;t.trigger instanceof HTMLElement?n=t.trigger:typeof t.trigger==`string`?n=document.querySelector(t.trigger):e.id&&(n=document.querySelector(`[aria-describedby="${e.id}"]`)),l(e,!!(t.open??e.classList.contains(`is-open`)));function r(){l(e,!0)}function i(){l(e,!1)}function a(){l(e,!e.classList.contains(`is-open`))}function o(e){e.key===`Escape`&&i()}function s(){r()}function c(){i()}function u(){r()}function d(){i()}return n&&(n.addEventListener(`mouseenter`,s),n.addEventListener(`mouseleave`,c),n.addEventListener(`focus`,u),n.addEventListener(`blur`,d)),document.addEventListener(`keydown`,o),{open:r,close:i,toggle:a,destroy(){n&&(n.removeEventListener(`mouseenter`,s),n.removeEventListener(`mouseleave`,c),n.removeEventListener(`focus`,u),n.removeEventListener(`blur`,d)),document.removeEventListener(`keydown`,o),delete e.dataset.tooltipInitialized}}}function d(e=document){let t=e.querySelectorAll?.(`[data-component="tooltip"]`);return t?Array.from(t).map(e=>u(e)).filter(Boolean):[]}function f(){if(p||typeof document>`u`)return;p=!0;let e=()=>d(document);document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,e,{once:!0}):e(),new MutationObserver(()=>e()).observe(document.documentElement,{childList:!0,subtree:!0})}var p;function m(){return(m=e((()=>{p=!1})))()}function h(e={}){return{type:String(e.type||`small`).toLowerCase(),tint:String(e.tint||`default`).toLowerCase(),pointer:String(e.pointer||`top-center`).toLowerCase(),title:e.title||``,body:e.body||`Tooltip text`,open:e.open!==!1,id:e.id||``,className:e.className||``}}function g(e,t){return t(h(e))}var _,v,y,b;function x(){return(x=e((()=>{_=[`small`,`medium`,`rich`],v=[`default`,`main`,`success`,`attention`,`critical`],y=[`top-left`,`top-center`,`top-right`,`bottom-left`,`bottom-center`,`bottom-right`,`left`,`right`],b={type:`small`,tint:`main`,pointer:`top-center`,title:`Tooltip title`,body:`Tooltip text`,open:!0,id:`demo-tooltip`}})))()}var S,C,w,T,E;function D(){return(D=e((()=>{n(),t(),m(),r(),s(),x(),f(),S=i.default.compile(o),C={title:`Molecules/Tooltip`,tags:[`autodocs`,`shared-library`],render:e=>g(e,S),args:b,argTypes:{type:{control:{type:`inline-radio`},options:_,name:`Type`},tint:{control:{type:`select`},options:v,name:`Tint`},pointer:{control:{type:`select`},options:y,name:`Pointer`},title:{control:`text`,name:`Title`},body:{control:`text`,name:`Body`},open:{control:`boolean`,name:`Open`}},parameters:{badges:[`shared`],contentWidth:`fluid`,design:c([[`Tooltip page — 539:28418`,`539:28418`],[`Spec — 4601:164`,`4601:164`]])}},w={parameters:a(g(b,S),{unit:`tooltip`})},T={parameters:{design:c(`539:28418`)},render:()=>`<div class="sbd-doc"><div class="sbd-doc__stack">${_.map(e=>`<div style="display:flex;flex-wrap:wrap;gap:12px;">${v.map(t=>`
        <div class="sbd-doc__stack-item-canvas" style="min-inline-size:120px;padding:16px;">
          <p class="sbd-doc__stack-item-label">${e} · ${t}</p>
          ${g({type:e,tint:t,pointer:`top-center`,open:!0,title:e===`small`?``:`Title`,body:`Tooltip text`},S)}
        </div>`).join(``)}</div>`).join(``)}</div></div>`},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileTooltipArgs(defaultTooltipArgs, compiled), {
    unit: 'tooltip'
  })
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  parameters: {
    design: figmaDesign('539:28418')
  },
  render: () => {
    const matrix = TYPE_OPTIONS.map(type => {
      const cells = TINT_OPTIONS.map(tint => \`
        <div class="sbd-doc__stack-item-canvas" style="min-inline-size:120px;padding:16px;">
          <p class="sbd-doc__stack-item-label">\${type} · \${tint}</p>
          \${compileTooltipArgs({
        type,
        tint,
        pointer: 'top-center',
        open: true,
        title: type === 'small' ? '' : 'Title',
        body: 'Tooltip text'
      }, compiled)}
        </div>\`).join('');
      return \`<div style="display:flex;flex-wrap:wrap;gap:12px;">\${cells}</div>\`;
    }).join('');
    return \`<div class="sbd-doc"><div class="sbd-doc__stack">\${matrix}</div></div>\`;
  }
}`,...T.parameters?.docs?.source}}},E=[`Demo`,`AllStyles`]})))()}D();export{T as AllStyles,w as Demo,E as __namedExportsOrder,C as default};