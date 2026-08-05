import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{S as t,i as n,n as r,r as i,t as a,x as o}from"./pretty-source-BkPpK8QA.js";import"./content-title-BvltFXQ5.js";import"./content-body-BGuR5ei1.js";import"./icon-D6wgK3Ul.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";import{n as l,o as u}from"./table-cell-story-helpers-CpVPwPPQ.js";function d(e={}){return{type:`body`,align:`left`,background:!0,borders:!0,topBorder:!0,rightBorder:!0,bottomBorder:!0,leftBorder:!0,leadingIcon:!1,trailingIcon:!1,leadingIconName:l,trailingIconName:l,label:`Cell text`,contentHtml:``,width:`220px`,className:``,...e}}function f(){return[{cells:[d({type:`header`,label:`Header`,leadingIcon:!1}),d({type:`header`,label:`Header`,leadingIcon:!1}),d({type:`header`,label:`Header`,leadingIcon:!1})]},{cells:[d({type:`body`,leadingIcon:!0}),d({type:`body`,leadingIcon:!0}),d({type:`body`,leadingIcon:!0})]},{cells:[d({type:`body`,leadingIcon:!0}),d({type:`body`,leadingIcon:!0}),d({type:`body`,leadingIcon:!0})]},{cells:[d({type:`body`,leadingIcon:!0}),d({type:`body`,leadingIcon:!0}),d({type:`body`,leadingIcon:!0})]}]}function p(e={}){return{rows:e.rows&&e.rows.length?e.rows:f(),slotHtml:e.slotHtml||``,className:e.className||``}}function m(e,t){return t(p(e))}var h;function g(){return(g=e((()=>{u(),h={rows:f(),slotHtml:``,className:``}})))()}var _,v,y,b,x;function S(){return(S=e((()=>{n(),o(),r(),s(),g(),_=i.default.compile(t),v={title:`Patterns/Table block`,tags:[`autodocs`,`shared-library`],render:e=>m(e,_),args:h,argTypes:{rows:{control:`object`,name:`Rows`}},parameters:{badges:[`shared`],contentWidth:`fluid`,design:c([[`Table block · content slot — 5914:53`,`5914:53`],[`Spec — 6032:729`,`6032:729`]])}},y={parameters:a(m(h,_),{unit:`table-block`})},b={parameters:{design:c(`5914:53`)},render:()=>`
    <div class="sbd-doc">
      <div class="sbd-doc__stack">
        <div class="sbd-doc__stack-item">
          <div class="sbd-doc__stack-item-canvas">${m({rows:f()},_)}</div>
        </div>
      </div>
    </div>
  `},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileTableBlockArgs(defaultTableBlockArgs, compiled), {
    unit: 'table-block'
  })
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    design: figmaDesign('5914:53')
  },
  render: () => \`
    <div class="sbd-doc">
      <div class="sbd-doc__stack">
        <div class="sbd-doc__stack-item">
          <div class="sbd-doc__stack-item-canvas">\${compileTableBlockArgs({
    rows: defaultDemoRows()
  }, compiled)}</div>
        </div>
      </div>
    </div>
  \`
}`,...b.parameters?.docs?.source}}},x=[`Demo`,`AllStyles`]})))()}S();export{b as AllStyles,y as Demo,x as __namedExportsOrder,v as default};