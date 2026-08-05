import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{N as t,P as n,Q as r,Qt as i,Z as a,Zt as o,n as s,t as c}from"./pretty-source-CA3IhMc4.js";import"./content-title-BvltFXQ5.js";function l(e){return g.has(e)?e:`h2`}function u(e){return d({style:e.style||`h0`,weight:e.weight||`emphasis`,text:e.text??`Heading`,tag:l(e.tag||`h2`),className:e.className||``})}var d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{r(),s(),n(),i(),d=a.default.compile(o),f=[`h0`,`h1`,`h2`,`h3`,`h4`,`h5`,`h6`,`h7`],p=[`subtle`,`base`,`prominent`,`emphasis`,`strong`],m=[`h1`,`h2`,`h3`,`h4`,`h5`,`h6`,`p`],h=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3598-7174&m=dev`,g=new Set(m),_={title:`Molecules/Content title`,tags:[`autodocs`],parameters:{docs:{description:{component:`Heading typography molecule (Style × Weight = 8 × 5 = 40 variants). Default Weight=\`emphasis\` (SemiBold). Color: Content/content-title → \`--color-text-primary\`. Semantic \`tag\` is independent of Style. [Figma](${h}).`}}},argTypes:{style:{control:{type:`inline-radio`},options:f,name:`Style`},weight:{control:{type:`inline-radio`},options:p,name:`Weight`},tag:{control:{type:`inline-radio`},options:m,name:`tag (semantic)`},text:{control:`text`,name:`Text`},className:{control:`text`,name:`className`}},args:{style:`h0`,weight:`emphasis`,tag:`h2`,text:`Heading`,className:``}},v={name:`Demo`,render:e=>u(e),parameters:c(u({style:`h0`,weight:`emphasis`,tag:`h2`,text:`Heading`,className:``}),{unit:`content-title`,scss:t})},y={name:`AllStyles`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start;padding:16px;">
        ${p.map(e=>`
        <div style="display:flex;flex-direction:column;gap:16px;min-inline-size:180px;max-inline-size:280px;">
          <strong style="font:12px/16px ui-monospace,Menlo,monospace;">Weight=${e}</strong>
          ${f.map(t=>`
        <div style="margin:0;">
          <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">
            Style=${t} · Weight=${e}
          </div>
          ${u({style:t,weight:e,tag:`p`,text:`Heading`})}
        </div>`).join(`
`)}
        </div>`).join(`
`)}
      </div>`},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render({
    style: 'h0',
    weight: 'emphasis',
    tag: 'h2',
    text: 'Heading',
    className: ''
  }), {
    unit: 'content-title',
    scss: scssSource
  })
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
        tag: 'p',
        text: 'Heading'
      })}
        </div>\`).join('\\n');
      return \`
        <div style="display:flex;flex-direction:column;gap:16px;min-inline-size:180px;max-inline-size:280px;">
          <strong style="font:12px/16px ui-monospace,Menlo,monospace;">Weight=\${weight}</strong>
          \${rows}
        </div>\`;
    }).join('\\n');
    return \`
      <div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start;padding:16px;">
        \${columns}
      </div>\`;
  }
}`,...y.parameters?.docs?.source}}},b=[`Demo`,`AllStyles`]})))()}x();export{y as AllStyles,v as Demo,b as __namedExportsOrder,_ as default};