import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,Z as n,_t as r,n as i,t as a,vt as o}from"./pretty-source-C_TZ5wEY.js";import"./content-title-BvltFXQ5.js";import"./content-body-BGuR5ei1.js";import"./icon-D6wgK3Ul.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";import{a as l,i as u,o as d,r as f,t as p}from"./table-cell-story-helpers-CpVPwPPQ.js";function m(e,t){return`
    <div class="sbd-doc__stack-item">
      <p class="sbd-doc__stack-item-label">${e}</p>
      <div class="sbd-doc__stack-item-canvas">${u(t,h)}</div>
    </div>
  `}var h,g,_,v,y,b,x;function S(){return(S=e((()=>{t(),r(),i(),s(),d(),h=n.default.compile(o),g={type:{control:{type:`inline-radio`},options:f,name:`Type`},align:{control:{type:`inline-radio`},options:p,name:`Align`},background:{control:`boolean`,name:`Background`},borders:{control:`boolean`,name:`Borders`},topBorder:{control:`boolean`,name:`Top border`,if:{arg:`borders`,truthy:!0}},rightBorder:{control:`boolean`,name:`Right border`,if:{arg:`borders`,truthy:!0}},bottomBorder:{control:`boolean`,name:`Bottom border`,if:{arg:`borders`,truthy:!0}},leftBorder:{control:`boolean`,name:`Left border`,if:{arg:`borders`,truthy:!0}},leadingIcon:{control:`boolean`,name:`Leading icon`},trailingIcon:{control:`boolean`,name:`Trailing icon`},leadingIconName:{control:`text`,name:`Leading icon name`,if:{arg:`leadingIcon`,truthy:!0}},trailingIconName:{control:`text`,name:`Trailing icon name`,if:{arg:`trailingIcon`,truthy:!0}},label:{control:`text`,name:`Label`},width:{control:`text`,name:`Width`}},_={title:`Molecules/Table cell`,tags:[`autodocs`,`shared-library`],render:e=>u(e,h),args:l,argTypes:g,parameters:{badges:[`shared`],contentWidth:`fluid`,design:c([[`Table cell · content slot — 5957:257`,`5957:257`],[`Spec — 5960:299`,`5960:299`]]),docs:{description:{component:"Slot-driven table cell from [Table cell · content slot](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5957-257&m=dev) (Spec [`5960:299`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5960-299&m=dev)). Type × Align; optional icons; per-side borders. Deprecated boards are out of scope."}}}},v={parameters:a(u(l,h),{unit:`table-cell`,extra:{design:c(`5957:257`)}})},y=e=>`<h3 class="sbd-doc__group-title">${e}</h3>`,b={parameters:{contentWidth:`fluid`,design:c(`5957:257`),docs:{description:{story:`Type × Align matrix (Header / Body × Left / Center / Right) matching the content-slot set defaults (leading icon on, borders on).`}}},render:()=>{let e=f.flatMap(e=>p.map(t=>m(`type = ${e} · align = ${t}`,{type:e,align:t,leadingIcon:!0,label:e===`header`?`Header`:`Cell text`,width:`220px`}))).join(``);return`
      <div class="sbd-doc">
        ${y(`Type × Align`)}
        <div class="sbd-doc__stack">${e}</div>
      </div>
    `}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileTableCellArgs(defaultTableCellArgs, compiled), {
    unit: 'table-cell',
    extra: {
      design: figmaDesign('5957:257')
    }
  })
}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    contentWidth: 'fluid',
    design: figmaDesign('5957:257'),
    docs: {
      description: {
        story: 'Type × Align matrix (Header / Body × Left / Center / Right) matching the content-slot set defaults (leading icon on, borders on).'
      }
    }
  },
  render: () => {
    const matrix = TYPE_OPTIONS.flatMap(type => ALIGN_OPTIONS.map(align => cellCard(\`type = \${type} · align = \${align}\`, {
      type,
      align,
      leadingIcon: true,
      label: type === 'header' ? 'Header' : 'Cell text',
      width: '220px'
    }))).join('');
    return \`
      <div class="sbd-doc">
        \${STACK_TITLE('Type × Align')}
        <div class="sbd-doc__stack">\${matrix}</div>
      </div>
    \`;
  }
}`,...b.parameters?.docs?.source}}},x=[`Demo`,`AllStyles`]})))()}S();export{b as AllStyles,v as Demo,x as __namedExportsOrder,_ as default};