import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Nt as t,Pt as n,i as r,n as i,r as a,t as o}from"./pretty-source-PtImQSP_.js";import"./icon-D6wgK3Ul.js";import{i as s,n as c,r as l}from"./_icon-catalog-D0pmKtbu.js";var u;function d(){return(d=e((()=>{u=`/**
 * Icon — mask-image + currentColor primitive.
 *
 * Mirrors the canonical Icon mask wrapper on Web-ODS Shared Library
 * (\`984:863\` / sticker \`984:2871\`). The SVG is used as
 * an alpha mask; the background paints the silhouette in
 * \`currentColor\`, which is then overridden per \`c-icon--<color>\`
 * modifier. Consumers can also wrap the icon in any text-color
 * context and use \`c-icon--current\` to inherit.
 */

.c-icon {
  display: inline-block;
  box-sizing: border-box;
  flex-shrink: 0;
  width: var(--icon-size, 24px);
  height: var(--icon-size, 24px);
  padding-block: var(--icon-frame-padding-block, 0);
  padding-inline: var(--icon-frame-padding-inline, 0);
  background-color: currentcolor;
  background-clip: content-box;
  mask-image: var(--icon-source);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-clip: content-box;
  mask-origin: content-box;
  vertical-align: middle;
}

.c-icon--16  { --icon-size: 16px; }
.c-icon--20  { --icon-size: 20px; }
.c-icon--24  { --icon-size: 24px; }
.c-icon--32  { --icon-size: 32px; }
.c-icon--40  { --icon-size: 40px; }
.c-icon--48  { --icon-size: 48px; }
.c-icon--64  { --icon-size: 64px; }
.c-icon--72  { --icon-size: 72px; }
.c-icon--80  { --icon-size: 80px; }
.c-icon--96  { --icon-size: 96px; }
.c-icon--144 { --icon-size: 144px; }

.c-icon--current  { color: currentcolor; }
.c-icon--default  { color: var(--color-text-primary); }
.c-icon--brand    { color: var(--color-text-brand); }
.c-icon--accent   { color: var(--color-text-accent); }
.c-icon--inverse  { color: var(--color-text-inverse); }
.c-icon--success  { color: var(--color-signal-success); }
.c-icon--critical { color: var(--color-signal-critical); }

/* Frame envelopes — transparent positioning shells (no border, no fill).
 * Each shrinks the painted glyph to a smaller inner shape via
 * \`mask-clip: content-box\` + computed padding. Ratios mirror Figma
 * \`Web-ODS-Icons / 2:1318\` Section 2 "Shapes and Layouts" exactly. */
.c-icon--square {
  --icon-frame-padding-block:  calc(var(--icon-size) * 0.125);
  --icon-frame-padding-inline: calc(var(--icon-size) * 0.125);
}

.c-icon--circle {
  --icon-frame-padding-block:  calc(var(--icon-size) * 0.0833);
  --icon-frame-padding-inline: calc(var(--icon-size) * 0.0833);
}

.c-icon--vertical-rectangle {
  --icon-frame-padding-block:  calc(var(--icon-size) * 0.0833);
  --icon-frame-padding-inline: calc(var(--icon-size) * 0.1667);
}

.c-icon--horizontal-rectangle {
  --icon-frame-padding-block:  calc(var(--icon-size) * 0.1667);
  --icon-frame-padding-inline: calc(var(--icon-size) * 0.0833);
}
`})))()}function f(e){return m({name:e.name||x,size:e.size||`24`,color:e.color||`current`,frame:e.frame||`none`,decorative:e.decorative!==!1,accessibleLabel:e.accessibleLabel||``})}function p(e,t){return`<div style="${e?`background:var(--color-bg-inverse-strong,#2f303c);color:var(--color-text-inverse,#fff);padding:12px;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;`:`padding:12px;display:inline-flex;align-items:center;justify-content:center;`}">${t}</div>`}var m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{r(),i(),d(),n(),s(),a.default.registerHelper(`iconUrl`,l),m=a.default.compile(t),h=[`16`,`20`,`24`,`32`,`40`,`48`,`64`,`72`,`80`,`96`,`144`],g=[`16`,`20`,`24`,`32`,`48`],_=[`40`,`48`,`64`,`72`,`80`,`96`,`144`],v=[`current`,`default`,`brand`,`accent`,`inverse`,`success`,`critical`],y=[`none`,`square`,`circle`,`vertical-rectangle`,`horizontal-rectangle`],b=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=984-863&m=dev`,x=c.find(e=>e===`actions/simple-add`)||c.find(e=>e.includes(`/simple-`))||c[0]||`actions/simple-add`,S=c.find(e=>e.includes(`/detailed-`))||x,C={name:x,size:`24`,color:`default`,frame:`none`,decorative:!0,accessibleLabel:``},w={title:`Molecules/Icon`,tags:[`autodocs`],parameters:{docs:{description:{component:`Icon mask wrapper inherited from core. Glyphs from this package's \`assets/icons/\`. [Figma](${b}).`}}},argTypes:{name:{control:`select`,options:c,name:`Name`},size:{control:`select`,options:h,name:`Size`},color:{control:`select`,options:v,name:`Color`},frame:{control:`select`,options:y,name:`Frame`},decorative:{control:`boolean`,name:`Decorative`},accessibleLabel:{control:`text`,name:`Accessible label`,if:{arg:`decorative`,truthy:!1}}},args:C},T={name:`Demo`,render:e=>f(e),parameters:o(f(C),{unit:`icon`,scss:u})},E={name:`AllStyles`,render:()=>`
      <div style="display:flex;flex-direction:column;gap:40px;padding:16px;">
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Size ladder (11)</h2>
          <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end;">${h.map(e=>`
      <div style="min-inline-size:72px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">${e}</div>
        ${p(!1,f({...C,size:e,color:`default`}))}
      </div>`).join(`
`)}</div>
        </section>
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Color roles</h2>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">${v.map(e=>`
      <div style="min-inline-size:88px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">${e}</div>
        ${p(e===`inverse`,f({...C,size:`32`,color:e}))}
      </div>`).join(`
`)}</div>
        </section>
        <section>
          <h2 style="font:600 14px/20px ui-sans-serif,system-ui;margin:0 0 12px;">Frame axis @ 48</h2>
          <div style="display:flex;flex-wrap:wrap;gap:24px;">${y.map(e=>`
      <div style="min-inline-size:100px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);margin-block-end:4px;">${e}</div>
        <div style="outline:1px dashed var(--color-border-strong,#2f303c);display:inline-block;">
          ${f({...C,size:`48`,color:`default`,frame:e})}
        </div>
      </div>`).join(`
`)}</div>
        </section>
        <p style="font:12px/16px ui-sans-serif,system-ui;color:var(--color-text-secondary,#555);margin:0;">Full catalog: Design System / Iconography (${c.length} keys).</p>
      </div>`},D={name:`SimpleBand`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:16px;padding:16px;">${g.map(e=>`
      <div style="min-inline-size:72px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;margin-block-end:4px;">${e}</div>
        ${f({name:x,size:e,color:`default`,frame:`none`,decorative:!0})}
      </div>`).join(`
`)}</div>`},O={name:`DetailedBand`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:16px;padding:16px;">${_.map(e=>`
      <div style="min-inline-size:88px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;margin-block-end:4px;">${e}</div>
        ${f({name:S,size:e,color:`default`,frame:`none`,decorative:!0})}
      </div>`).join(`
`)}</div>`},k={name:`ColorRoles`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:16px;padding:16px;">${v.map(e=>`
      <div style="min-inline-size:88px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;margin-block-end:4px;">${e}</div>
        ${p(e===`inverse`,f({name:x,size:`32`,color:e,frame:`none`,decorative:!0}))}
      </div>`).join(`
`)}</div>`},A={name:`Frames`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;">${y.filter(e=>e!==`none`).flatMap(e=>[`24`,`48`].map(t=>`
      <div style="min-inline-size:100px;text-align:center;">
        <div style="font:11px/14px ui-monospace,Menlo,monospace;margin-block-end:4px;">${e} · ${t}</div>
        <div style="outline:1px dashed var(--color-border-strong,#2f303c);display:inline-block;">
          ${f({name:x,size:t,color:`default`,frame:e,decorative:!0})}
        </div>
      </div>`)).join(`
`)}</div>`},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render(defaultArgs), {
    unit: 'icon',
    scss: scssSource
  })
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
        <p style="font:12px/16px ui-sans-serif,system-ui;color:var(--color-text-secondary,#555);margin:0;">Full catalog: Design System / Iconography (\${ICON_NAMES.length} keys).</p>
      </div>\`;
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j=[`Demo`,`AllStyles`,`SimpleBand`,`DetailedBand`,`ColorRoles`,`Frames`]})))()}M();export{E as AllStyles,k as ColorRoles,T as Demo,O as DetailedBand,A as Frames,D as SimpleBand,j as __namedExportsOrder,w as default};