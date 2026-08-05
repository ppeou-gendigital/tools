import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{C as t,i as n,n as r,r as i,t as a,w as o}from"./pretty-source-BkPpK8QA.js";import"./content-title-BvltFXQ5.js";import"./content-body-BGuR5ei1.js";import"./icon-D6wgK3Ul.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";import{a as l,i as u,o as d,r as f,t as p}from"./table-cell-story-helpers-CpVPwPPQ.js";var m,h,g,_,v;function y(){return(y=e((()=>{n(),t(),r(),s(),d(),m=i.default.compile(o),h={title:`Molecules/Table cell`,tags:[`autodocs`,`shared-library`],render:e=>u(e,m),args:l,argTypes:{type:{control:{type:`inline-radio`},options:f,name:`Type`},align:{control:{type:`inline-radio`},options:p,name:`Align`},background:{control:`boolean`,name:`Background`},borders:{control:`boolean`,name:`Borders`},leadingIcon:{control:`boolean`,name:`Leading icon`},trailingIcon:{control:`boolean`,name:`Trailing icon`},label:{control:`text`,name:`Label`},width:{control:`text`,name:`Width`}},parameters:{badges:[`shared`],contentWidth:`fluid`,design:c([[`Table cell · content slot — 5957:257`,`5957:257`],[`Spec — 5960:299`,`5960:299`]])}},g={parameters:a(u(l,m),{unit:`table-cell`})},_={parameters:{design:c(`5957:257`)},render:()=>`<div class="sbd-doc"><div class="sbd-doc__stack">${f.flatMap(e=>p.map(t=>`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">type = ${e} · align = ${t}</p>
          <div class="sbd-doc__stack-item-canvas">${u({type:e,align:t,leadingIcon:!0,label:e===`header`?`Header`:`Cell text`,width:`220px`},m)}</div>
        </div>`)).join(``)}</div></div>`},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileTableCellArgs(defaultTableCellArgs, compiled), {
    unit: 'table-cell'
  })
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  parameters: {
    design: figmaDesign('5957:257')
  },
  render: () => {
    const matrix = TYPE_OPTIONS.flatMap(type => ALIGN_OPTIONS.map(align => \`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">type = \${type} · align = \${align}</p>
          <div class="sbd-doc__stack-item-canvas">\${compileTableCellArgs({
      type,
      align,
      leadingIcon: true,
      label: type === 'header' ? 'Header' : 'Cell text',
      width: '220px'
    }, compiled)}</div>
        </div>\`)).join('');
    return \`<div class="sbd-doc"><div class="sbd-doc__stack">\${matrix}</div></div>\`;
  }
}`,..._.parameters?.docs?.source}}},v=[`Demo`,`AllStyles`]})))()}y();export{_ as AllStyles,g as Demo,v as __namedExportsOrder,h as default};