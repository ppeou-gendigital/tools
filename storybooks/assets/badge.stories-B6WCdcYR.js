import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Mn as t,Q as n,Z as r,jn as i,n as a,t as o}from"./pretty-source-C_TZ5wEY.js";function s(e){return c({variant:e.variant||`dot`,color:e.color||`info`,emphasis:e.emphasis||`low`,countValue:e.countValue??`3`,label:e.label??`NEW`,accessibleLabel:e.accessibleLabel||``})}var c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),a(),t(),c=r.default.compile(i),l=[`dot`,`count`,`text`],u=[`info`,`success`,`warning`,`error`,`brand`,`inverse`],d=[`low`,`high`],f=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28416&m=dev`,p={title:`Molecules/Badge`,tags:[`autodocs`],parameters:{docs:{description:{component:`Compact status / count / text badge (3 × 6 × 2 = 36 variants). Color axis: Info / Success / Warning / Error / Brand / Inverse. [Figma](${f}).`}}},argTypes:{variant:{control:{type:`inline-radio`},options:l,name:`Variant`},color:{control:{type:`inline-radio`},options:u,name:`Color`},emphasis:{control:{type:`inline-radio`},options:d,name:`Emphasis`},countValue:{control:`text`,name:`Count value`},label:{control:`text`,name:`Label`},accessibleLabel:{control:`text`,name:`Accessible label`}},args:{variant:`dot`,color:`info`,emphasis:`low`,countValue:`3`,label:`NEW`,accessibleLabel:``}},m={name:`Demo`,render:e=>s(e),parameters:o(s({variant:`dot`,color:`info`,emphasis:`low`,countValue:`3`,label:`NEW`,accessibleLabel:``}),{unit:`badge`})},h={name:`AllStyles`,render:()=>`<div style="padding:16px;">${l.flatMap(e=>d.map(t=>`
          <section style="margin-block-end:24px;">
            <h3 style="margin:0 0 12px;font:600 13px/18px system-ui,sans-serif;">
              Variant = ${e} · Emphasis = ${t}
            </h3>
            <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end;">
              ${u.map(n=>`
            <figure style="margin:0;display:flex;flex-direction:column;gap:6px;align-items:flex-start;min-inline-size:72px;">
              <div>${s({variant:e,color:n,emphasis:t,countValue:`3`,label:`NEW`,accessibleLabel:e===`dot`?`${n} status`:``})}</div>
              <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${n}</figcaption>
            </figure>`).join(`
`)}
            </div>
          </section>`)).join(`
`)}</div>`},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render({
    variant: 'dot',
    color: 'info',
    emphasis: 'low',
    countValue: '3',
    label: 'NEW',
    accessibleLabel: ''
  }), {
    unit: 'badge'
  })
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => {
    const sections = VARIANT_OPTIONS.flatMap(variant => EMPHASIS_OPTIONS.map(emphasis => {
      const cards = COLOR_OPTIONS.map(color => {
        const html = render({
          variant,
          color,
          emphasis,
          countValue: '3',
          label: 'NEW',
          accessibleLabel: variant === 'dot' ? \`\${color} status\` : ''
        });
        return \`
            <figure style="margin:0;display:flex;flex-direction:column;gap:6px;align-items:flex-start;min-inline-size:72px;">
              <div>\${html}</div>
              <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">\${color}</figcaption>
            </figure>\`;
      }).join('\\n');
      return \`
          <section style="margin-block-end:24px;">
            <h3 style="margin:0 0 12px;font:600 13px/18px system-ui,sans-serif;">
              Variant = \${variant} · Emphasis = \${emphasis}
            </h3>
            <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end;">
              \${cards}
            </div>
          </section>\`;
    })).join('\\n');
    return \`<div style="padding:16px;">\${sections}</div>\`;
  }
}`,...h.parameters?.docs?.source}}},g=[`Demo`,`AllStyles`]})))()}_();export{h as AllStyles,m as Demo,g as __namedExportsOrder,p as default};