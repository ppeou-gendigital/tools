import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,mt as n,n as r,pt as i,r as a,t as o}from"./pretty-source-BkPpK8QA.js";import"./award-wrapper-CnnXzk4H.js";var s;function c(){return(c=e((()=>{s=`/**
 * Award Wrapper — core molecule (.c-award-wrapper).
 * Figma Web-ODS Shared Library node 3762:246.
 * Image ratio locks a fixed box; surface is transparent; overflow clipped.
 */

.c-award-wrapper {
  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: clip;
  background-color: transparent;
  border-radius: var(--border-radius-0, 0);
  inline-size: fit-content;
  max-inline-size: 100%;
}

.c-award-wrapper--ratio-1-1 {
  inline-size: 88px;
  block-size: 88px;
}

.c-award-wrapper--ratio-16-9 {
  inline-size: 246px;
  block-size: 138px;
}

.c-award-wrapper--ratio-9-16 {
  inline-size: 90px;
  block-size: 160px;
}

.c-award-wrapper__image {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
  object-position: center;
}

.c-award-wrapper__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* Figma Color/Disabled/secondary — theme alias is --color-disabled-border */
  background-color: var(--color-disabled-border, #b3b3b3);
  padding: var(--space-0, 0);
}

.c-award-wrapper__placeholder-label {
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-regular, 400);
  font-size: var(--font-size-label, 12px);
  line-height: var(--lineheight-label, 16px);
  letter-spacing: var(--letterspacing-label, 0.24px);
  color: var(--color-text-inverse, #fff);
  text-align: center;
  word-break: break-word;
}
`})))()}function l(e){return u({imageRatio:e.imageRatio||`1:1`,src:e.src||``,alt:e.alt??``,className:e.className||``})}var u,d,f,p,m,h,g;function _(){return(_=e((()=>{t(),r(),c(),n(),u=a.default.compile(i),d=[`1:1`,`16:9`,`9:16`],f=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3721-3904&m=dev`,p={title:`Molecules/Award Wrapper`,tags:[`autodocs`],parameters:{docs:{description:{component:`Fixed-aspect award logo frame (Image ratio 1:1 / 16:9 / 9:16). Inherited from core. [Figma](${f}).`}}},argTypes:{imageRatio:{control:{type:`inline-radio`},options:d,name:`Image ratio`,description:`Locks the fixed box size: 88×88, 246×138, or 90×160.`},src:{control:`text`,name:`src`,description:`Award logo URL. Empty → documentation placeholder.`},alt:{control:`text`,name:`alt`,description:`Descriptive alt naming the award, or empty when named nearby.`},className:{control:`text`,name:`className`,description:`Optional class on the outer box only.`}},args:{imageRatio:`1:1`,src:``,alt:``,className:``}},m={name:`Demo`,render:e=>l(e),parameters:o(l({imageRatio:`1:1`,src:``,alt:``,className:``}),{scss:s})},h={name:`AllRatios`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${d.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Image ratio=${e}
        </figcaption>
        ${l({imageRatio:e,src:``,alt:``})}
      </figure>`).join(`
`)}
      </div>`},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render({
    imageRatio: '1:1',
    src: '',
    alt: '',
    className: ''
  }), {
    scss: scssSource
  })
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'AllRatios',
  render: () => {
    const cards = RATIO_OPTIONS.map(imageRatio => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Image ratio=\${imageRatio}
        </figcaption>
        \${render({
      imageRatio,
      src: '',
      alt: ''
    })}
      </figure>\`).join('\\n');
    return \`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        \${cards}
      </div>\`;
  }
}`,...h.parameters?.docs?.source}}},g=[`Demo`,`AllRatios`]})))()}_();export{h as AllRatios,m as Demo,g as __namedExportsOrder,p as default};