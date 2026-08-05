import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,it as n,n as r,r as i,rt as a,t as o}from"./pretty-source-CvP1BtiP.js";import"./content-body-BGuR5ei1.js";var s;function c(){return(c=e((()=>{s=`/**
 * Molecules/Content body — core (.c-content-body).
 * Figma: Web-ODS Shared Library 3483:3453 / canvas 3598:7414.
 *
 * Axes → BEM:
 *   style  → .c-content-body--body-3xl | --body-2xl | --body-xl |
 *            --body-lg | --body-base | --body-sm | --body-xs
 *   weight → .c-content-body--weight-subtle | --weight-base |
 *            --weight-prominent | --weight-emphasis | --weight-strong
 */

.c-content-body {
  box-sizing: border-box;
  margin-block: 0;
  margin-inline: 0;
  inline-size: 100%;
  max-inline-size: 100%;
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
  overflow-wrap: break-word;
}

// --- Style (size / line-height / letter-spacing) -----------------------------

.c-content-body--body-3xl {
  font-size: var(--font-size-body-3xl);
  line-height: var(--lineheight-body-3xl);
  letter-spacing: var(--letterspacing-body-3xl);
}

.c-content-body--body-2xl {
  font-size: var(--font-size-body-2xl);
  line-height: var(--lineheight-body-2xl);
  letter-spacing: var(--letterspacing-body-2xl);
}

.c-content-body--body-xl {
  font-size: var(--font-size-body-xl);
  line-height: var(--lineheight-body-xl);
  letter-spacing: var(--letterspacing-body-xl);
}

.c-content-body--body-lg {
  font-size: var(--font-size-body-lg);
  line-height: var(--lineheight-body-lg);
  letter-spacing: var(--letterspacing-body-lg);
}

.c-content-body--body-base {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  letter-spacing: var(--letterspacing-body-base);
}

.c-content-body--body-sm {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
}

.c-content-body--body-xs {
  font-size: var(--font-size-body-xs);
  line-height: var(--lineheight-body-xs);
  letter-spacing: var(--letterspacing-body-xs);
}

// --- Weight -----------------------------------------------------------------

.c-content-body--weight-subtle {
  font-weight: var(--font-weight-light);
}

.c-content-body--weight-base {
  font-weight: var(--font-weight-regular);
}

.c-content-body--weight-prominent {
  font-weight: var(--font-weight-medium);
}

.c-content-body--weight-emphasis {
  font-weight: var(--font-weight-semibold);
}

.c-content-body--weight-strong {
  font-weight: var(--font-weight-bold);
}
`})))()}function l(e){return u({style:e.style||`body-3xl`,weight:e.weight||`base`,text:e.text??`Body text`,className:e.className||``})}var u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{t(),r(),c(),n(),u=i.default.compile(a),d=[`body-3xl`,`body-2xl`,`body-xl`,`body-lg`,`body-base`,`body-sm`,`body-xs`],f=[`subtle`,`base`,`prominent`,`emphasis`,`strong`],p=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3598-7414&m=dev`,m={title:`Molecules/Content body`,tags:[`autodocs`],parameters:{docs:{description:{component:`Primary body typography molecule (Style × Weight = 7 × 5). Inherited from core. [Figma](${p}).`}}},argTypes:{style:{control:{type:`inline-radio`},options:d,name:`Style`},weight:{control:{type:`inline-radio`},options:f,name:`Weight`},text:{control:`text`,name:`Text`},className:{control:`text`,name:`className`}},args:{style:`body-3xl`,weight:`base`,text:`Body text`,className:``}},h={name:`Demo`,render:e=>l(e),parameters:o(l({style:`body-3xl`,weight:`base`,text:`Body text`,className:``}),{scss:s})},g={name:`AllStyles`,render:()=>`
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