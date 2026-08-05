import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{C as t,Q as n,Z as r,bn as i,n as a,t as o,w as s,yn as c}from"./pretty-source-CA3IhMc4.js";import{i as l,r as u}from"./logo-wrapper-DXmSS4Bz.js";function d(e){let t=e.lockUp||`horizontal`,n=e.src!==void 0&&e.src!==null?e.src:u[t]||``;return f({lockUp:t,src:n,alt:e.alt??``,className:e.className||``})}var f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{n(),a(),l(),t(),c(),f=r.default.compile(i),p=[`horizontal`,`stacked`,`checkmark`],m=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3768-2718&m=dev`,h={lockUp:`horizontal`,src:u.horizontal,alt:`Brand logo`,className:``},g={title:`Molecules/Logo Wrapper`,tags:[`autodocs`],parameters:{docs:{description:{component:`Aspect-locked brand logo frame (LockUp horizontal / stacked / checkmark). Multi-color \`<img>\` slot — not the Icon mask. [Figma](${m}).`}}},argTypes:{lockUp:{control:{type:`inline-radio`},options:p,name:`LockUp`,description:`Pins the box aspect: Horizontal ≈1040:237, Stacked ≈265:237, Checkmark ≈238:237.`},src:{control:`text`,name:`src`,description:`Logo asset URL. Empty → documentation placeholder.`},alt:{control:`text`,name:`alt`,description:`Accessible brand name, or empty when named nearby.`},className:{control:`text`,name:`className`,description:`Optional class on the outer box only.`}},args:h},_={name:`Demo`,render:e=>{let t=e.lockUp||`horizontal`,n=Object.values(u).includes(e.src);return d({...e,src:n||!e.src?u[t]:e.src})},parameters:o(d(h),{unit:`logo-wrapper`,scss:s})},v={name:`AllLockUps`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${p.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          LockUp=${e}
        </figcaption>
        ${d({lockUp:e,src:u[e],alt:`Brand logo · ${e}`})}
      </figure>`).join(`
`)}
      </div>`},y={name:`Placeholders`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${p.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          LockUp=${e} (no src)
        </figcaption>
        ${d({lockUp:e,src:``,alt:``})}
      </figure>`).join(`
`)}
      </div>`},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b=[`Demo`,`AllLockUps`,`Placeholders`]})))()}x();export{v as AllLockUps,_ as Demo,y as Placeholders,b as __namedExportsOrder,g as default};