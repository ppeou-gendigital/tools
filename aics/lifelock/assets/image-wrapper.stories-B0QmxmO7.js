import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,i as n,n as r,r as i,t as a,wt as o}from"./pretty-source-CugIV0Wu.js";import{n as s,t as c}from"./sample-image-rONQGWEA.js";var l;function u(){return(u=e((()=>{l=`/**
 * Image Wrapper — core molecule (.c-image-wrapper).
 * Figma Web-ODS Shared Library page 5428:53699 / Spec 5653:1197.
 *
 * Ratio pins viewport aspect-ratio; Fit maps to object-fit on the image.
 * Default demo width matches sticker cell (220px); consumers override width.
 */

.c-image-wrapper {
  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: clip;
  background-color: transparent;
  border-radius: var(--border-radius-0, 0);
  inline-size: var(--image-wrapper-width, 220px);
  max-inline-size: 100%;
  block-size: auto;
}

.c-image-wrapper--ratio-2-1 { aspect-ratio: 2 / 1; }
.c-image-wrapper--ratio-16-9 { aspect-ratio: 16 / 9; }
.c-image-wrapper--ratio-4-3 { aspect-ratio: 4 / 3; }
.c-image-wrapper--ratio-1-1 { aspect-ratio: 1 / 1; }
.c-image-wrapper--ratio-3-4 { aspect-ratio: 3 / 4; }
.c-image-wrapper--ratio-landscape { aspect-ratio: 3 / 2; }
.c-image-wrapper--ratio-portrait { aspect-ratio: 2 / 3; }
.c-image-wrapper--ratio-1-2 { aspect-ratio: 1 / 2; }
.c-image-wrapper--ratio-9-16 { aspect-ratio: 9 / 16; }

.c-image-wrapper__image {
  position: absolute;
  inset: 0;
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-position: center;
}

.c-image-wrapper--fit-contain .c-image-wrapper__image {
  object-fit: contain;
}

.c-image-wrapper--fit-cover .c-image-wrapper__image {
  object-fit: cover;
}

.c-image-wrapper__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-disabled-border, #b3b3b3);
  padding: var(--space-0, 0);
}

.c-image-wrapper__placeholder-label {
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-regular, 400);
  font-size: var(--font-size-label, 12px);
  line-height: var(--lineheight-label, 16px);
  letter-spacing: var(--letterspacing-label, 0.24px);
  color: var(--color-text-inverse, #fff);
  text-align: center;
  word-break: break-word;
}
`})))()}function d(e){return f({ratio:e.ratio||`16-9`,fit:e.fit||`cover`,src:e.src!==void 0&&e.src!==null?e.src:c,alt:e.alt??``,className:e.className||``})}var f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{n(),r(),u(),o(),s(),f=i.default.compile(t),p=[`2-1`,`16-9`,`4-3`,`1-1`,`3-4`,`landscape`,`portrait`,`1-2`,`9-16`],m=[`contain`,`cover`],h=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5428-53699&m=dev`,g={ratio:`16-9`,fit:`cover`,src:c,alt:`Sample editorial still`,className:``},_={title:`Molecules/Image Wrapper`,tags:[`autodocs`],parameters:{docs:{description:{component:`Aspect-locked image viewport inherited from core. Fixture from this package's \`assets/images/\`. [Figma](${h}).`}}},argTypes:{ratio:{control:{type:`select`},options:p,name:`Ratio`},fit:{control:{type:`inline-radio`},options:m,name:`Fit`},src:{control:`text`,name:`src`},alt:{control:`text`,name:`alt`},className:{control:`text`,name:`className`}},args:g},v={name:`Demo`,render:e=>d(e),parameters:a(d(g),{unit:`image-wrapper`,scss:l})},y={name:`AllRatios`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${p.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Ratio=${e} · Fit=cover
        </figcaption>
        ${d({ratio:e,fit:`cover`,src:c,alt:`Sample · `+e})}
      </figure>`).join(`
`)}
      </div>`},b={name:`FitCompare`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${m.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Ratio=16-9 · Fit=${e}
        </figcaption>
        ${d({ratio:`16-9`,fit:e,src:c,alt:`Sample · `+e})}
      </figure>`).join(`
`)}
      </div>`},x={name:`Placeholders`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${[`16-9`,`1-1`,`9-16`].map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Ratio=${e} (no src)
        </figcaption>
        ${d({ratio:e,fit:`cover`,src:``,alt:``})}
      </figure>`).join(`
`)}
      </div>`},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render(defaultArgs), {
    unit: 'image-wrapper',
    scss: scssSource
  })
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'AllRatios',
  render: () => {
    const cards = RATIO_OPTIONS.map(ratio => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Ratio=\${ratio} · Fit=cover
        </figcaption>
        \${render({
      ratio,
      fit: 'cover',
      src: SAMPLE,
      alt: 'Sample · ' + ratio
    })}
      </figure>\`).join('\\n');
    return \`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        \${cards}
      </div>\`;
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'FitCompare',
  render: () => {
    const cards = FIT_OPTIONS.map(fit => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Ratio=16-9 · Fit=\${fit}
        </figcaption>
        \${render({
      ratio: '16-9',
      fit,
      src: SAMPLE,
      alt: 'Sample · ' + fit
    })}
      </figure>\`).join('\\n');
    return \`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        \${cards}
      </div>\`;
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Placeholders',
  render: () => {
    const cards = ['16-9', '1-1', '9-16'].map(ratio => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Ratio=\${ratio} (no src)
        </figcaption>
        \${render({
      ratio,
      fit: 'cover',
      src: '',
      alt: ''
    })}
      </figure>\`).join('\\n');
    return \`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        \${cards}
      </div>\`;
  }
}`,...x.parameters?.docs?.source}}},S=[`Demo`,`AllRatios`,`FitCompare`,`Placeholders`]})))()}C();export{y as AllRatios,v as Demo,b as FitCompare,x as Placeholders,S as __namedExportsOrder,_ as default};