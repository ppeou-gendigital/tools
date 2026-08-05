import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,Q as n,T as r,Z as i,gn as a,hn as o,n as s,t as c}from"./pretty-source-C_TZ5wEY.js";function l(e){return u({ratio:e.ratio||`16-9`,fit:e.fit||`cover`,src:e.src!==void 0&&e.src!==null?e.src:m,alt:e.alt??``,className:e.className||``})}var u,d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{n(),s(),t(),a(),u=i.default.compile(o),d=[`2-1`,`16-9`,`4-3`,`1-1`,`3-4`,`landscape`,`portrait`,`1-2`,`9-16`],f=[`contain`,`cover`],p=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5428-53699&m=dev`,m=`/assets/images/sample.jpg`,h={ratio:`16-9`,fit:`cover`,src:m,alt:`Sample editorial still`,className:``},g={title:`Molecules/Image Wrapper`,tags:[`autodocs`],parameters:{docs:{description:{component:`Aspect-locked image viewport (Ratio × Fit). Native \`<img>\` + \`object-fit\`. [Figma](${p}).`}}},argTypes:{ratio:{control:{type:`select`},options:d,name:`Ratio`},fit:{control:{type:`inline-radio`},options:f,name:`Fit`},src:{control:`text`,name:`src`},alt:{control:`text`,name:`alt`},className:{control:`text`,name:`className`}},args:h},_={name:`Demo`,render:e=>l(e),parameters:c(l(h),{unit:`image-wrapper`,scss:r})},v={name:`AllRatios`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${d.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Ratio=${e} · Fit=cover
        </figcaption>
        ${l({ratio:e,fit:`cover`,src:m,alt:`Sample · ${e}`})}
      </figure>`).join(`
`)}
      </div>`},y={name:`FitCompare`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${f.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Ratio=16-9 · Fit=${e}
        </figcaption>
        ${l({ratio:`16-9`,fit:e,src:m,alt:`Sample · ${e}`})}
      </figure>`).join(`
`)}
      </div>`},b={name:`Placeholders`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${[`16-9`,`1-1`,`9-16`].map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Ratio=${e} (no src)
        </figcaption>
        ${l({ratio:e,fit:`cover`,src:``,alt:``})}
      </figure>`).join(`
`)}
      </div>`},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render(defaultArgs), {
    unit: 'image-wrapper',
    scss: scssSource
  })
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
      alt: \`Sample · \${ratio}\`
    })}
      </figure>\`).join('\\n');
    return \`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        \${cards}
      </div>\`;
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
      alt: \`Sample · \${fit}\`
    })}
      </figure>\`).join('\\n');
    return \`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        \${cards}
      </div>\`;
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x=[`Demo`,`AllRatios`,`FitCompare`,`Placeholders`]})))()}S();export{v as AllRatios,_ as Demo,y as FitCompare,b as Placeholders,x as __namedExportsOrder,g as default};