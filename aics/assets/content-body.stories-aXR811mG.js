import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{$t as t,L as n,Q as r,R as i,Z as a,en as o,n as s,t as c}from"./pretty-source-CA3IhMc4.js";import"./content-body-BGuR5ei1.js";function l(e){return u({style:e.style||`body-3xl`,weight:e.weight||`base`,text:e.text??`Body text`,className:e.className||``})}var u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{r(),s(),i(),o(),u=a.default.compile(t),d=[`body-3xl`,`body-2xl`,`body-xl`,`body-lg`,`body-base`,`body-sm`,`body-xs`],f=[`subtle`,`base`,`prominent`,`emphasis`,`strong`],p=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3598-7414&m=dev`,m={title:`Molecules/Content body`,tags:[`autodocs`],parameters:{docs:{description:{component:`Primary body typography molecule (Style × Weight = 7 × 5 = 35 variants). Color: Content/content-body → \`--color-text-primary\`. [Figma](${p}).`}}},argTypes:{style:{control:{type:`inline-radio`},options:d,name:`Style`},weight:{control:{type:`inline-radio`},options:f,name:`Weight`},text:{control:`text`,name:`Text`},className:{control:`text`,name:`className`}},args:{style:`body-3xl`,weight:`base`,text:`Body text`,className:``}},h={name:`Demo`,render:e=>l(e),parameters:c(l({style:`body-3xl`,weight:`base`,text:`Body text`,className:``}),{unit:`content-body`,scss:n})},g={name:`AllStyles`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start;padding:16px;">
        ${f.map(e=>`
        <div style="display:flex;flex-direction:column;gap:16px;min-inline-size:160px;max-inline-size:220px;">
          <strong style="font:12px/16px ui-monospace,Menlo,monospace;">Weight=${e}</strong>
          ${d.map(t=>`
        <div style="margin:0;">
          <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">
            Style=${t} · Weight=${e}
          </div>
          ${l({style:t,weight:e,text:`Body text`})}
        </div>`).join(`
`)}
        </div>`).join(`
`)}
      </div>`},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render({
    style: 'body-3xl',
    weight: 'base',
    text: 'Body text',
    className: ''
  }), {
    unit: 'content-body',
    scss: scssSource
  })
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => {
    const columns = WEIGHT_OPTIONS.map(weight => {
      const rows = STYLE_OPTIONS.map(style => \`
        <div style="margin:0;">
          <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">
            Style=\${style} · Weight=\${weight}
          </div>
          \${render({
        style,
        weight,
        text: 'Body text'
      })}
        </div>\`).join('\\n');
      return \`
        <div style="display:flex;flex-direction:column;gap:16px;min-inline-size:160px;max-inline-size:220px;">
          <strong style="font:12px/16px ui-monospace,Menlo,monospace;">Weight=\${weight}</strong>
          \${rows}
        </div>\`;
    }).join('\\n');
    return \`
      <div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start;padding:16px;">
        \${columns}
      </div>\`;
  }
}`,...g.parameters?.docs?.source}}},_=[`Demo`,`AllStyles`]})))()}v();export{g as AllStyles,h as Demo,_ as __namedExportsOrder,m as default};