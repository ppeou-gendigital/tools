import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{A as t,Q as n,Z as r,k as i,n as a,nt as o,t as s,tt as c}from"./pretty-source-C_TZ5wEY.js";import"./divider-CMa0ijyT.js";function l(e){return d({layout:e.layout||`horizontal`,size:e.size||`s`,inverse:!!e.inverse,typography:e.typography||`body-sm-regular`,label:e.label??`Or`,accessibleLabel:e.accessibleLabel||``,className:e.className||``})}function u(e,t,n=``){return`<div style="${e?`background:var(--color-bg-inverse-strong,#2f303c);color:var(--color-text-inverse,#fff);padding:12px;border-radius:4px;`:`padding:12px;`}${n}">${t}</div>`}var d,f,p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{n(),a(),t(),o(),d=r.default.compile(c),f=[`horizontal`,`vertical`,`label`],p=[`xs`,`s`,`m`,`l`],m=[!1,!0],h=[`body-sm-regular`,`body-sm-bold`,`body-base-regular`,`body-base-semibold`,`body-lg-regular`,`body-lg-bold`,`h6-medium`,`h5-bold`],g=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28432&m=dev`,_={layout:`horizontal`,size:`s`,inverse:!1,typography:`body-sm-regular`,label:`Or`,accessibleLabel:``,className:``},v={title:`Molecules/Divider`,tags:[`autodocs`],parameters:{docs:{description:{component:`Visual rule molecule (layout × size × inverse × typography). Three Figma sibling sets fold onto one \`.c-divider\`. [Figma](${g}).`}}},argTypes:{layout:{control:{type:`inline-radio`},options:f,name:`Layout`},size:{control:{type:`inline-radio`},options:p,name:`Size`},inverse:{control:`boolean`,name:`Inverse`},typography:{control:{type:`select`},options:h,name:`Typography`},label:{control:`text`,name:`Label`},accessibleLabel:{control:`text`,name:`Accessible label`},className:{control:`text`,name:`className`}},args:_},y={name:`Demo`,render:e=>e.layout===`vertical`?`
        <div style="display:flex;align-items:stretch;block-size:80px;gap:var(--space-4,16px);">
          <div>Left</div>
          ${l(e)}
          <div>Right</div>
        </div>`:l(e),parameters:s(l(_),{unit:`divider`,scss:i})},b={name:`AllStyles`,render:()=>`
      <div style="display:flex;flex-direction:column;gap:40px;padding:16px;">
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Horizontal — Size × Inverse</h2>
          <div style="display:flex;flex-direction:column;gap:24px;">${m.map(e=>`
        <div style="display:flex;flex-direction:column;gap:12px;">
          <strong style="font:12px/16px ui-monospace,Menlo,monospace;">Horizontal · Inverse=${e}</strong>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">${p.map(t=>`
        <div style="min-inline-size:140px;max-inline-size:200px;">
          <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">
            size=${t}${e?` · inverse`:``}
          </div>
          ${u(e,l({..._,layout:`horizontal`,size:t,inverse:e}))}
        </div>`).join(`
`)}</div>
        </div>`).join(`
`)}</div>
        </section>
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Vertical — Size × Inverse</h2>
          <div style="display:flex;flex-direction:column;gap:24px;">${m.map(e=>`
        <div style="display:flex;flex-direction:column;gap:12px;">
          <strong style="font:12px/16px ui-monospace,Menlo,monospace;">Vertical · Inverse=${e}</strong>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">${p.map(t=>`
        <div style="min-inline-size:80px;">
          <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">
            size=${t}${e?` · inverse`:``}
          </div>
          ${u(e,l({..._,layout:`vertical`,size:t,inverse:e}),`display:flex;align-items:stretch;justify-content:center;block-size:64px;`)}
        </div>`).join(`
`)}</div>
        </div>`).join(`
`)}</div>
        </section>
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Label — Size × Typography (Inverse = off)</h2>
          ${h.map(e=>`
        <div style="display:flex;flex-direction:column;gap:12px;margin-block-end:16px;">
          <strong style="font:12px/16px ui-monospace,Menlo,monospace;">Typography=${e}</strong>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">${p.map(t=>`
        <div style="min-inline-size:160px;max-inline-size:220px;">
          <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">
            size=${t} · ${e}
          </div>
          ${u(!1,l({..._,layout:`label`,size:t,inverse:!1,typography:e,label:`Or`}))}
        </div>`).join(`
`)}</div>
        </div>`).join(`
`)}
        </section>
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Label — Size spot-check (Inverse = on)</h2>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">${p.map(e=>`
      <div style="min-inline-size:160px;max-inline-size:220px;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">
          size=${e} · body-sm-regular · inverse
        </div>
        ${u(!0,l({..._,layout:`label`,size:e,inverse:!0,typography:`body-sm-regular`,label:`Or`}))}
      </div>`).join(`
`)}</div>
        </section>
      </div>`},x={name:`Horizontal`,args:{layout:`horizontal`,size:`s`,inverse:!1},render:e=>l(e),parameters:s(l({..._,layout:`horizontal`}),{unit:`divider`,scss:i})},S={name:`Vertical`,args:{layout:`vertical`,size:`s`,inverse:!1},render:e=>`
    <div style="display:flex;align-items:stretch;block-size:80px;gap:var(--space-4,16px);">
      <div>Left column content</div>
      ${l(e)}
      <div>Right column content</div>
    </div>`},C={name:`Label`,args:{layout:`label`,size:`s`,inverse:!1,typography:`body-sm-regular`,label:`Or`},render:e=>l(e),parameters:s(l({..._,layout:`label`}),{unit:`divider`,scss:i})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => {
    if (args.layout === 'vertical') {
      return \`
        <div style="display:flex;align-items:stretch;block-size:80px;gap:var(--space-4,16px);">
          <div>Left</div>
          \${render(args)}
          <div>Right</div>
        </div>\`;
    }
    return render(args);
  },
  parameters: htmlStoryParameters(render(defaultArgs), {
    unit: 'divider',
    scss: scssSource
  })
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => {
    const horizontal = INVERSE_OPTIONS.map(inverse => {
      const cells = SIZE_OPTIONS.map(size => \`
        <div style="min-inline-size:140px;max-inline-size:200px;">
          <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">
            size=\${size}\${inverse ? ' · inverse' : ''}
          </div>
          \${cellSurface(inverse, render({
        ...defaultArgs,
        layout: 'horizontal',
        size,
        inverse
      }))}
        </div>\`).join('\\n');
      return \`
        <div style="display:flex;flex-direction:column;gap:12px;">
          <strong style="font:12px/16px ui-monospace,Menlo,monospace;">Horizontal · Inverse=\${inverse}</strong>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">\${cells}</div>
        </div>\`;
    }).join('\\n');
    const vertical = INVERSE_OPTIONS.map(inverse => {
      const cells = SIZE_OPTIONS.map(size => \`
        <div style="min-inline-size:80px;">
          <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">
            size=\${size}\${inverse ? ' · inverse' : ''}
          </div>
          \${cellSurface(inverse, render({
        ...defaultArgs,
        layout: 'vertical',
        size,
        inverse
      }), 'display:flex;align-items:stretch;justify-content:center;block-size:64px;')}
        </div>\`).join('\\n');
      return \`
        <div style="display:flex;flex-direction:column;gap:12px;">
          <strong style="font:12px/16px ui-monospace,Menlo,monospace;">Vertical · Inverse=\${inverse}</strong>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">\${cells}</div>
        </div>\`;
    }).join('\\n');
    const labelOff = TYPOGRAPHY_OPTIONS.map(typography => {
      const cells = SIZE_OPTIONS.map(size => \`
        <div style="min-inline-size:160px;max-inline-size:220px;">
          <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">
            size=\${size} · \${typography}
          </div>
          \${cellSurface(false, render({
        ...defaultArgs,
        layout: 'label',
        size,
        inverse: false,
        typography,
        label: 'Or'
      }))}
        </div>\`).join('\\n');
      return \`
        <div style="display:flex;flex-direction:column;gap:12px;margin-block-end:16px;">
          <strong style="font:12px/16px ui-monospace,Menlo,monospace;">Typography=\${typography}</strong>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">\${cells}</div>
        </div>\`;
    }).join('\\n');
    const labelOn = SIZE_OPTIONS.map(size => \`
      <div style="min-inline-size:160px;max-inline-size:220px;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">
          size=\${size} · body-sm-regular · inverse
        </div>
        \${cellSurface(true, render({
      ...defaultArgs,
      layout: 'label',
      size,
      inverse: true,
      typography: 'body-sm-regular',
      label: 'Or'
    }))}
      </div>\`).join('\\n');
    return \`
      <div style="display:flex;flex-direction:column;gap:40px;padding:16px;">
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Horizontal — Size × Inverse</h2>
          <div style="display:flex;flex-direction:column;gap:24px;">\${horizontal}</div>
        </section>
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Vertical — Size × Inverse</h2>
          <div style="display:flex;flex-direction:column;gap:24px;">\${vertical}</div>
        </section>
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Label — Size × Typography (Inverse = off)</h2>
          \${labelOff}
        </section>
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Label — Size spot-check (Inverse = on)</h2>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">\${labelOn}</div>
        </section>
      </div>\`;
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Horizontal',
  args: {
    layout: 'horizontal',
    size: 's',
    inverse: false
  },
  render: args => render(args),
  parameters: htmlStoryParameters(render({
    ...defaultArgs,
    layout: 'horizontal'
  }), {
    unit: 'divider',
    scss: scssSource
  })
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'Vertical',
  args: {
    layout: 'vertical',
    size: 's',
    inverse: false
  },
  render: args => \`
    <div style="display:flex;align-items:stretch;block-size:80px;gap:var(--space-4,16px);">
      <div>Left column content</div>
      \${render(args)}
      <div>Right column content</div>
    </div>\`
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'Label',
  args: {
    layout: 'label',
    size: 's',
    inverse: false,
    typography: 'body-sm-regular',
    label: 'Or'
  },
  render: args => render(args),
  parameters: htmlStoryParameters(render({
    ...defaultArgs,
    layout: 'label'
  }), {
    unit: 'divider',
    scss: scssSource
  })
}`,...C.parameters?.docs?.source}}},w=[`Demo`,`AllStyles`,`Horizontal`,`Vertical`,`Label`]})))()}T();export{b as AllStyles,y as Demo,x as Horizontal,C as Label,S as Vertical,w as __namedExportsOrder,v as default};