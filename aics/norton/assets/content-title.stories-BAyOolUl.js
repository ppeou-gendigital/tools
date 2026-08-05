import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,nt as r,r as i,t as a,tt as o}from"./pretty-source-PtImQSP_.js";import"./content-title-BvltFXQ5.js";var s;function c(){return(c=e((()=>{s=`/**
 * Molecules/Content title — core (.c-content-title).
 * Figma: Web-ODS Shared Library 3483:3436 / canvas 3598:7174 / Spec 3637:48.
 *
 * Axes → BEM:
 *   style  → .c-content-title--h0 … --h7
 *   weight → .c-content-title--weight-subtle | --weight-base |
 *            --weight-prominent | --weight-emphasis | --weight-strong
 *
 * Default Weight = emphasis (SemiBold) per Spec Frame.
 */

.c-content-title {
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

.c-content-title--h0 {
  font-size: var(--font-size-h0);
  line-height: var(--lineheight-h0);
  letter-spacing: var(--letterspacing-h0);
}

.c-content-title--h1 {
  font-size: var(--font-size-h1);
  line-height: var(--lineheight-h1);
  letter-spacing: var(--letterspacing-h1);
}

.c-content-title--h2 {
  font-size: var(--font-size-h2);
  line-height: var(--lineheight-h2);
  letter-spacing: var(--letterspacing-h2);
}

.c-content-title--h3 {
  font-size: var(--font-size-h3);
  line-height: var(--lineheight-h3);
  letter-spacing: var(--letterspacing-h3);
}

.c-content-title--h4 {
  font-size: var(--font-size-h4);
  line-height: var(--lineheight-h4);
  letter-spacing: var(--letterspacing-h4);
}

.c-content-title--h5 {
  font-size: var(--font-size-h5);
  line-height: var(--lineheight-h5);
  letter-spacing: var(--letterspacing-h5);
}

.c-content-title--h6 {
  font-size: var(--font-size-h6);
  line-height: var(--lineheight-h6);
  letter-spacing: var(--letterspacing-h6);
}

.c-content-title--h7 {
  font-size: var(--font-size-h7);
  line-height: var(--lineheight-h7);
  letter-spacing: var(--letterspacing-h7);
}

// --- Weight -----------------------------------------------------------------

.c-content-title--weight-subtle {
  font-weight: var(--font-weight-light);
}

.c-content-title--weight-base {
  font-weight: var(--font-weight-regular);
}

.c-content-title--weight-prominent {
  font-weight: var(--font-weight-medium);
}

.c-content-title--weight-emphasis {
  font-weight: var(--font-weight-semibold);
}

.c-content-title--weight-strong {
  font-weight: var(--font-weight-bold);
}
`})))()}function l(e){return g.has(e)?e:`h2`}function u(e){return d({style:e.style||`h0`,weight:e.weight||`emphasis`,text:e.text??`Heading`,tag:l(e.tag||`h2`),className:e.className||``})}var d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{t(),n(),c(),r(),d=i.default.compile(o),f=[`h0`,`h1`,`h2`,`h3`,`h4`,`h5`,`h6`,`h7`],p=[`subtle`,`base`,`prominent`,`emphasis`,`strong`],m=[`h1`,`h2`,`h3`,`h4`,`h5`,`h6`,`p`],h=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3598-7174&m=dev`,g=new Set(m),_={title:`Molecules/Content title`,tags:[`autodocs`],parameters:{docs:{description:{component:`Heading typography molecule (Style × Weight = 8 × 5). Inherited from core. Default Weight=emphasis. [Figma](${h}).`}}},argTypes:{style:{control:{type:`inline-radio`},options:f,name:`Style`},weight:{control:{type:`inline-radio`},options:p,name:`Weight`},tag:{control:{type:`inline-radio`},options:m,name:`tag (semantic)`},text:{control:`text`,name:`Text`},className:{control:`text`,name:`className`}},args:{style:`h0`,weight:`emphasis`,tag:`h2`,text:`Heading`,className:``}},v={name:`Demo`,render:e=>u(e),parameters:a(u({style:`h0`,weight:`emphasis`,tag:`h2`,text:`Heading`,className:``}),{scss:s})},y={name:`AllStyles`,render:()=>`
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