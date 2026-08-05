import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{An as t,D as n,O as r,Q as i,Z as a,kn as o,n as s,t as c}from"./pretty-source-CA3IhMc4.js";import{i as l,n as u}from"./_icon-catalog-hmO93ib8.js";import"./icon-D6wgK3Ul.js";function d(e){return p({name:e.name||b,size:e.size||`24`,color:e.color||`current`,frame:e.frame||`none`,decorative:e.decorative!==!1,accessibleLabel:e.accessibleLabel||``})}function f(e,t){return`<div style="${e?`background:var(--color-bg-inverse-strong,#2f303c);color:var(--color-text-inverse,#fff);padding:12px;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;`:`padding:12px;display:inline-flex;align-items:center;justify-content:center;`}">${t}</div>`}var p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{i(),s(),r(),t(),l(),p=a.default.compile(o),m=[`16`,`20`,`24`,`32`,`40`,`48`,`64`,`72`,`80`,`96`,`144`],h=[`16`,`20`,`24`,`32`,`48`],g=[`40`,`48`,`64`,`72`,`80`,`96`,`144`],_=[`current`,`default`,`brand`,`accent`,`inverse`,`success`,`critical`],v=[`none`,`square`,`circle`,`vertical-rectangle`,`horizontal-rectangle`],y=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=984-863&m=dev`,b=u.find(e=>e===`actions/simple-add`)||u.find(e=>e.includes(`/simple-`))||u[0]||`actions/simple-add`,x=u.find(e=>e.includes(`/detailed-`))||b,S={name:b,size:`24`,color:`default`,frame:`none`,decorative:!0,accessibleLabel:``},C={title:`Molecules/Icon`,tags:[`autodocs`],parameters:{docs:{description:{component:`Icon mask wrapper (\`mask-image\` + \`currentColor\`). Size × Color × Frame. Package-local SVG catalog. [Figma](${y}).`}}},argTypes:{name:{control:`select`,options:u,name:`Name`},size:{control:`select`,options:m,name:`Size`},color:{control:`select`,options:_,name:`Color`},frame:{control:`select`,options:v,name:`Frame`},decorative:{control:`boolean`,name:`Decorative`},accessibleLabel:{control:`text`,name:`Accessible label`,if:{arg:`decorative`,truthy:!1}}},args:S},w={name:`Demo`,render:e=>d(e),parameters:c(d(S),{unit:`icon`,scss:n})},T={name:`AllStyles`,render:()=>{let e=m.map(e=>`
      <div style="min-inline-size:72px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">${e}</div>
        ${f(!1,d({...S,size:e,color:`default`}))}
      </div>`).join(`
`),t=_.map(e=>`
      <div style="min-inline-size:88px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">${e}</div>
        ${f(e===`inverse`,d({...S,size:`32`,color:e}))}
      </div>`).join(`
`),n=v.map(e=>`
      <div style="min-inline-size:100px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">${e}</div>
        <div style="outline:1px dashed var(--color-border-strong,#2f303c);display:inline-block;">
          ${d({...S,size:`48`,color:`default`,frame:e})}
        </div>
      </div>`).join(`
`),r=u.slice(0,48).map(e=>`
      <div style="min-inline-size:120px;max-inline-size:140px;">
        <div style="font:10px/12px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;word-break:break-all;">${e}</div>
        ${f(!1,d({name:e,size:e.includes(`/detailed-`)?`48`:`24`,color:`default`,frame:`none`,decorative:!0}))}
      </div>`).join(`
`);return`
      <div style="display:flex;flex-direction:column;gap:40px;padding:16px;">
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Size ladder (11)</h2>
          <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end;">${e}</div>
        </section>
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Color roles</h2>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">${t}</div>
        </section>
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Frame axis @ 48</h2>
          <div style="display:flex;flex-wrap:wrap;gap:24px;">${n}</div>
        </section>
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Catalog sample (first 48)</h2>
          <p style="font:12px/16px ui-sans-serif,system-ui;color:var(--color-text-secondary,#555);margin:0 0 12px;">Full catalog lives under Design System / Iconography. ${u.length} keys in this package.</p>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">${r}</div>
        </section>
      </div>`}},E={name:`SimpleBand`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:16px;padding:16px;">${h.map(e=>`
      <div style="min-inline-size:72px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;margin-block-end:4px;">${e}</div>
        ${d({name:b,size:e,color:`default`,frame:`none`,decorative:!0})}
      </div>`).join(`
`)}</div>`},D={name:`DetailedBand`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:16px;padding:16px;">${g.map(e=>`
      <div style="min-inline-size:88px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;margin-block-end:4px;">${e}</div>
        ${d({name:x,size:e,color:`default`,frame:`none`,decorative:!0})}
      </div>`).join(`
`)}</div>`},O={name:`ColorRoles`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:16px;padding:16px;">${_.map(e=>`
      <div style="min-inline-size:88px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;margin-block-end:4px;">${e}</div>
        ${f(e===`inverse`,d({name:b,size:`32`,color:e,frame:`none`,decorative:!0}))}
      </div>`).join(`
`)}</div>`},k={name:`Frames`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;">${v.filter(e=>e!==`none`).flatMap(e=>[`24`,`48`].map(t=>`
      <div style="min-inline-size:100px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;margin-block-end:4px;">${e} · ${t}</div>
        <div style="outline:1px dashed var(--color-border-strong,#2f303c);display:inline-block;">
          ${d({name:b,size:t,color:`default`,frame:e,decorative:!0})}
        </div>
      </div>`)).join(`
`)}</div>`},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render(defaultArgs), {
    unit: 'icon',
    scss: scssSource
  })
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => {
    const sizeRow = SIZE_OPTIONS.map(size => \`
      <div style="min-inline-size:72px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">\${size}</div>
        \${cellSurface(false, render({
      ...defaultArgs,
      size,
      color: 'default'
    }))}
      </div>\`).join('\\n');
    const colorRow = COLOR_OPTIONS.map(color => \`
      <div style="min-inline-size:88px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">\${color}</div>
        \${cellSurface(color === 'inverse', render({
      ...defaultArgs,
      size: '32',
      color
    }))}
      </div>\`).join('\\n');
    const frameRow = FRAME_OPTIONS.map(frame => \`
      <div style="min-inline-size:100px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">\${frame}</div>
        <div style="outline:1px dashed var(--color-border-strong,#2f303c);display:inline-block;">
          \${render({
      ...defaultArgs,
      size: '48',
      color: 'default',
      frame
    })}
        </div>
      </div>\`).join('\\n');
    const catalogSample = ICON_NAMES.slice(0, 48).map(name => \`
      <div style="min-inline-size:120px;max-inline-size:140px;">
        <div style="font:10px/12px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;word-break:break-all;">\${name}</div>
        \${cellSurface(false, render({
      name,
      size: name.includes('/detailed-') ? '48' : '24',
      color: 'default',
      frame: 'none',
      decorative: true
    }))}
      </div>\`).join('\\n');
    return \`
      <div style="display:flex;flex-direction:column;gap:40px;padding:16px;">
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Size ladder (11)</h2>
          <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end;">\${sizeRow}</div>
        </section>
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Color roles</h2>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">\${colorRow}</div>
        </section>
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Frame axis @ 48</h2>
          <div style="display:flex;flex-wrap:wrap;gap:24px;">\${frameRow}</div>
        </section>
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Catalog sample (first 48)</h2>
          <p style="font:12px/16px ui-sans-serif,system-ui;color:var(--color-text-secondary,#555);margin:0 0 12px;">Full catalog lives under Design System / Iconography. \${ICON_NAMES.length} keys in this package.</p>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">\${catalogSample}</div>
        </section>
      </div>\`;
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: 'SimpleBand',
  render: () => {
    const cells = SIMPLE_SIZES.map(size => \`
      <div style="min-inline-size:72px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;margin-block-end:4px;">\${size}</div>
        \${render({
      name: SAMPLE_SIMPLE,
      size,
      color: 'default',
      frame: 'none',
      decorative: true
    })}
      </div>\`).join('\\n');
    return \`<div style="display:flex;flex-wrap:wrap;gap:16px;padding:16px;">\${cells}</div>\`;
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  name: 'DetailedBand',
  render: () => {
    const cells = DETAILED_SIZES.map(size => \`
      <div style="min-inline-size:88px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;margin-block-end:4px;">\${size}</div>
        \${render({
      name: SAMPLE_DETAILED,
      size,
      color: 'default',
      frame: 'none',
      decorative: true
    })}
      </div>\`).join('\\n');
    return \`<div style="display:flex;flex-wrap:wrap;gap:16px;padding:16px;">\${cells}</div>\`;
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: 'ColorRoles',
  render: () => {
    const cells = COLOR_OPTIONS.map(color => \`
      <div style="min-inline-size:88px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;margin-block-end:4px;">\${color}</div>
        \${cellSurface(color === 'inverse', render({
      name: SAMPLE_SIMPLE,
      size: '32',
      color,
      frame: 'none',
      decorative: true
    }))}
      </div>\`).join('\\n');
    return \`<div style="display:flex;flex-wrap:wrap;gap:16px;padding:16px;">\${cells}</div>\`;
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: 'Frames',
  render: () => {
    const cells = FRAME_OPTIONS.filter(f => f !== 'none').flatMap(frame => ['24', '48'].map(size => \`
      <div style="min-inline-size:100px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;margin-block-end:4px;">\${frame} · \${size}</div>
        <div style="outline:1px dashed var(--color-border-strong,#2f303c);display:inline-block;">
          \${render({
      name: SAMPLE_SIMPLE,
      size,
      color: 'default',
      frame,
      decorative: true
    })}
        </div>
      </div>\`)).join('\\n');
    return \`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;">\${cells}</div>\`;
  }
}`,...k.parameters?.docs?.source}}},A=[`Demo`,`AllStyles`,`SimpleBand`,`DetailedBand`,`ColorRoles`,`Frames`]})))()}j();export{T as AllStyles,O as ColorRoles,w as Demo,D as DetailedBand,k as Frames,E as SimpleBand,A as __namedExportsOrder,C as default};