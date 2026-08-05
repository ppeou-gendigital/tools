import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,i as n,n as r,r as i,t as a,wt as o}from"./pretty-source-PtImQSP_.js";import"./logo-wrapper-CAPZ8XUd.js";var s;function c(){return(c=e((()=>{s=`/**
 * Logo Wrapper — core molecule (.c-logo-wrapper).
 * Figma Web-ODS Shared Library page 3768:2718 / Spec 3846:98.
 *
 * LockUp pins a fixed aspect ratio; surface is transparent; overflow clipped.
 * Default block-size matches the sticker board (88px); consumers override
 * height via CSS on the root.
 */

.c-logo-wrapper {
  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: clip;
  background-color: transparent;
  border-radius: var(--border-radius-0, 0);
  block-size: var(--logo-wrapper-height, 88px);
  inline-size: auto;
  max-inline-size: 100%;
}

.c-logo-wrapper--horizontal {
  aspect-ratio: 1040 / 237;
}

.c-logo-wrapper--stacked {
  aspect-ratio: 265 / 237;
}

.c-logo-wrapper--checkmark {
  aspect-ratio: 238 / 237;
}

.c-logo-wrapper__image {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
  object-position: center;
}

.c-logo-wrapper__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-disabled-border, #b3b3b3);
  padding: var(--space-0, 0);
}

.c-logo-wrapper__placeholder-label {
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-regular, 400);
  font-size: var(--font-size-label, 12px);
  line-height: var(--lineheight-label, 16px);
  letter-spacing: var(--letterspacing-label, 0.24px);
  color: var(--color-text-inverse, #fff);
  text-align: center;
  word-break: break-word;
}
`})))()}function l(e){let t=e.lockUp||`horizontal`,n=e.src!==void 0&&e.src!==null?e.src:p[t]||``;return u({lockUp:t,src:n,alt:e.alt??``,className:e.className||``})}var u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),r(),c(),t(),u=i.default.compile(o),d=[`horizontal`,`stacked`,`checkmark`],f=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3768-2718&m=dev`,p={horizontal:`/assets/logos/horizontal.svg`,stacked:`/assets/logos/stacked.svg`,checkmark:`/assets/logos/checkmark.svg`},m={lockUp:`horizontal`,src:p.horizontal,alt:`Brand logo`,className:``},h={title:`Molecules/Logo Wrapper`,tags:[`autodocs`],parameters:{docs:{description:{component:`Aspect-locked brand logo frame inherited from core. Fixtures from this package's \`assets/logos/\`. [Figma](${f}).`}}},argTypes:{lockUp:{control:{type:`inline-radio`},options:d,name:`LockUp`},src:{control:`text`,name:`src`},alt:{control:`text`,name:`alt`},className:{control:`text`,name:`className`}},args:m},g={name:`Demo`,render:e=>{let t=e.lockUp||`horizontal`,n=Object.values(p).includes(e.src);return l({...e,src:n||!e.src?p[t]:e.src})},parameters:a(l(m),{unit:`logo-wrapper`,scss:s})},_={name:`AllLockUps`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${d.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          LockUp=${e}
        </figcaption>
        ${l({lockUp:e,src:p[e],alt:`Brand logo · ${e}`})}
      </figure>`).join(`
`)}
      </div>`},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => {
    const lockUp = args.lockUp || 'horizontal';
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
}`,..._.parameters?.docs?.source}}},v=[`Demo`,`AllLockUps`]})))()}y();export{_ as AllLockUps,g as Demo,v as __namedExportsOrder,h as default};