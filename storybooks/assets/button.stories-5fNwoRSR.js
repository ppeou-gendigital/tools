import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{H as t,Mn as n,Q as r,V as i,Z as a,jn as o,n as s,t as c}from"./pretty-source-CA3IhMc4.js";import"./button-DPO6711n.js";function l(e){return`<div style="display:flex;flex-wrap:wrap;gap:16px;margin-block-end:24px">${f.map(t=>{let n=u({...m,style:e,size:t,label:e===`secondary-ghost`?`Resume`:`Continue`});return`<div style="display:inline-flex;flex-direction:column;gap:8px;align-items:flex-start;padding:12px;${e===`secondary-ghost`?`background:#1a1a1a;border-radius:8px;`:``}">${n}<span style="font-size:12px;opacity:.7">${e} · ${t}</span></div>`}).join(``)}</div>`}var u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{r(),s(),n(),t(),u=a.default.compile(o),d=[`primary`,`secondary`,`tertiary`,`inverse`,`text`,`primary-ghost`,`secondary-ghost`,`gradient`],f=[`s`,`m`,`l`,`xl`],p=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2434-14483&m=dev`,m={label:`Continue`,style:`primary`,size:`l`,type:`button`,iconButton:!1,loading:!1,disabled:!1,showLeadingIcon:!1,leadingIcon:`actions/simple-add`,showTrailingIcon:!1,trailingIcon:`arrows-navigation/simple-arrow-forward`,accessibleLabel:``},h={title:`Molecules/Button`,tags:[`autodocs`],render:e=>u(e),args:m,argTypes:{label:{control:`text`,name:`Label`},style:{control:{type:`select`},options:d,name:`Style`},size:{control:{type:`inline-radio`},options:f,name:`Size`},type:{control:{type:`inline-radio`},options:[`button`,`submit`,`reset`],name:`HTML type`},iconButton:{control:`boolean`,name:`Icon button`},loading:{control:`boolean`,name:`Loading`},disabled:{control:`boolean`,name:`Disabled`},showLeadingIcon:{control:`boolean`,name:`Show leading icon`},leadingIcon:{control:`text`,name:`Leading icon`},showTrailingIcon:{control:`boolean`,name:`Show trailing icon`},trailingIcon:{control:`text`,name:`Trailing icon`},accessibleLabel:{control:`text`,name:`Accessible label`}},parameters:{contentWidth:`fluid`,docs:{description:{component:`Button — eight Type styles × four sizes × icon-button. [Figma](${p}).`}}}},g={name:`Demo`,parameters:c(u(m),{scss:i})},_={...m,showLeadingIcon:!0,showTrailingIcon:!0},v={name:`WithIcons`,args:_,parameters:c(u(_),{scss:i})},y={name:`AllStyles`,render:()=>`<div style="display:flex;flex-direction:column;gap:8px">${d.map(l).join(``)}</div>`,parameters:{docs:{description:{story:`Style × Size matrix (icon-button / loading covered in Demo controls).`}}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  parameters: htmlStoryParameters(compiled(defaultArgs), {
    scss: scssSource
  })
}`,...g.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'WithIcons',
  args: withIconsArgs,
  parameters: htmlStoryParameters(compiled(withIconsArgs), {
    scss: scssSource
  })
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => \`<div style="display:flex;flex-direction:column;gap:8px">\${STYLE_OPTIONS.map(styleRow).join('')}</div>\`,
  parameters: {
    docs: {
      description: {
        story: 'Style × Size matrix (icon-button / loading covered in Demo controls).'
      }
    }
  }
}`,...y.parameters?.docs?.source}}},b=[`Demo`,`WithIcons`,`AllStyles`]})))()}x();export{y as AllStyles,g as Demo,v as WithIcons,b as __namedExportsOrder,h as default};