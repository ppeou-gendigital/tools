import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{C as t,Q as n,Z as r,_n as i,n as a,t as o,vn as s,w as c}from"./pretty-source-C_TZ5wEY.js";import"./logo-wrapper-CAPZ8XUd.js";function l(e){let t=e.lockUp||`horizontal`,n=e.src!==void 0&&e.src!==null?e.src:p[t]||``;return u({lockUp:t,src:n,alt:e.alt??``,className:e.className||``})}var u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{n(),a(),t(),i(),u=r.default.compile(s),d=[`horizontal`,`stacked`,`checkmark`],f=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3768-2718&m=dev`,p={horizontal:`/assets/logos/horizontal.svg`,stacked:`/assets/logos/stacked.svg`,checkmark:`/assets/logos/checkmark.svg`},m={lockUp:`horizontal`,src:p.horizontal,alt:`Brand logo`,className:``},h={title:`Molecules/Logo Wrapper`,tags:[`autodocs`],parameters:{docs:{description:{component:`Aspect-locked brand logo frame (LockUp horizontal / stacked / checkmark). Multi-color \`<img>\` slot — not the Icon mask. [Figma](${f}).`}}},argTypes:{lockUp:{control:{type:`inline-radio`},options:d,name:`LockUp`,description:`Pins the box aspect: Horizontal ≈1040:237, Stacked ≈265:237, Checkmark ≈238:237.`},src:{control:`text`,name:`src`,description:`Logo asset URL. Empty → documentation placeholder.`},alt:{control:`text`,name:`alt`,description:`Accessible brand name, or empty when named nearby.`},className:{control:`text`,name:`className`,description:`Optional class on the outer box only.`}},args:m},g={name:`Demo`,render:e=>{let t=e.lockUp||`horizontal`,n=Object.values(p).includes(e.src);return l({...e,src:n||!e.src?p[t]:e.src})},parameters:o(l(m),{unit:`logo-wrapper`,scss:c})},_={name:`AllLockUps`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${d.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          LockUp=${e}
        </figcaption>
        ${l({lockUp:e,src:p[e],alt:`Brand logo · ${e}`})}
      </figure>`).join(`
`)}
      </div>`},v={name:`Placeholders`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${d.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          LockUp=${e} (no src)
        </figcaption>
        ${l({lockUp:e,src:``,alt:``})}
      </figure>`).join(`
`)}
      </div>`},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => {
    const lockUp = args.lockUp || 'horizontal';
    // Keep fixture in sync when LockUp changes and src still points at a fixture.
    const srcIsFixture = Object.values(FIXTURE).includes(args.src);
    const next = {
      ...args,
      src: srcIsFixture || !args.src ? FIXTURE[lockUp] : args.src
    };
    return render(next);
  },
  parameters: htmlStoryParameters(render(defaultArgs), {
    unit: 'logo-wrapper',
    scss: scssSource
  })
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'AllLockUps',
  render: () => {
    const cards = LOCKUP_OPTIONS.map(lockUp => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          LockUp=\${lockUp}
        </figcaption>
        \${render({
      lockUp,
      src: FIXTURE[lockUp],
      alt: \`Brand logo · \${lockUp}\`
    })}
      </figure>\`).join('\\n');
    return \`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        \${cards}
      </div>\`;
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'Placeholders',
  render: () => {
    const cards = LOCKUP_OPTIONS.map(lockUp => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          LockUp=\${lockUp} (no src)
        </figcaption>
        \${render({
      lockUp,
      src: '',
      alt: ''
    })}
      </figure>\`).join('\\n');
    return \`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        \${cards}
      </div>\`;
  }
}`,...v.parameters?.docs?.source}}},y=[`Demo`,`AllLockUps`,`Placeholders`]})))()}b();export{_ as AllLockUps,g as Demo,v as Placeholders,y as __namedExportsOrder,h as default};