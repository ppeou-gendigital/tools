import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,Q as n,T as r,Z as i,_n as a,n as o,t as s,vn as c}from"./pretty-source-CA3IhMc4.js";import{n as l,t as u}from"./sample-image-Dtm7bd3B.js";function d(e){return f({ratio:e.ratio||`16-9`,fit:e.fit||`cover`,src:e.src!==void 0&&e.src!==null?e.src:u,alt:e.alt??``,className:e.className||``})}var f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{n(),o(),t(),c(),l(),f=i.default.compile(a),p=[`2-1`,`16-9`,`4-3`,`1-1`,`3-4`,`landscape`,`portrait`,`1-2`,`9-16`],m=[`contain`,`cover`],h=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=5428-53699&m=dev`,g={ratio:`16-9`,fit:`cover`,src:u,alt:`Sample editorial still`,className:``},_={title:`Molecules/Image Wrapper`,tags:[`autodocs`],parameters:{docs:{description:{component:`Aspect-locked image viewport (Ratio × Fit). Native \`<img>\` + \`object-fit\`. [Figma](${h}).`}}},argTypes:{ratio:{control:{type:`select`},options:p,name:`Ratio`},fit:{control:{type:`inline-radio`},options:m,name:`Fit`},src:{control:`text`,name:`src`},alt:{control:`text`,name:`alt`},className:{control:`text`,name:`className`}},args:g},v={name:`Demo`,render:e=>d(e),parameters:s(d(g),{unit:`image-wrapper`,scss:r})},y={name:`AllRatios`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${p.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Ratio=${e} · Fit=cover
        </figcaption>
        ${d({ratio:e,fit:`cover`,src:u,alt:`Sample · ${e}`})}
      </figure>`).join(`
`)}
      </div>`},b={name:`FitCompare`,render:()=>`
      <div style="display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end;padding:16px;">
        ${m.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Ratio=16-9 · Fit=${e}
        </figcaption>
        ${d({ratio:`16-9`,fit:e,src:u,alt:`Sample · ${e}`})}
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
      alt: \`Sample · \${ratio}\`
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
      alt: \`Sample · \${fit}\`
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