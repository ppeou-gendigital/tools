import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,K as n,Q as r,Z as i,cn as a,n as o,sn as s,t as c}from"./pretty-source-CA3IhMc4.js";import"./award-wrapper-CnnXzk4H.js";function l(e){let t=e.layout||`quote`,n=t===`quote`||t===`title-rating`;return u({imageRatio:e.imageRatio||`1:1`,layout:t,src:e.src||``,alt:e.alt??``,quoteText:e.quoteText||``,source:e.source||``,year:e.year||``,title:e.title||``,description:e.description||``,showRating:e.showRating==null?n:!!e.showRating,ratingValue:e.ratingValue||`5.0`,className:e.className||``})}var u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{r(),o(),n(),a(),u=i.default.compile(s),d=[`1:1`,`9:16`,`16:9`],f=[`quote`,`title-rating`,`compact`,`compact-stacked`,`rating-stacked`,`title-description`],p=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2355-19639&m=dev`,m={imageRatio:`1:1`,layout:`quote`,src:``,alt:``,quoteText:`“Best overall protection for families.”`,source:`PCMag Editors’ Choice`,year:`2026`,title:`Best Overall Protection`,description:`Independent lab testing ranked this award for cross-device coverage and phishing defence.`,showRating:!0,ratingValue:`5.0`,className:``},h={title:`Patterns/Award item`,tags:[`autodocs`],parameters:{docs:{description:{component:`Award logo + copy card. Image ratio × Layout (18 combinations). Composes Award Wrapper. Stars are inline icons until RatingTeaser / RatingInline onboard. [Figma](${p}).`}}},argTypes:{imageRatio:{control:{type:`inline-radio`},options:d,name:`Image ratio`},layout:{control:{type:`select`},options:f,name:`Layout`},src:{control:`text`,name:`src`},alt:{control:`text`,name:`alt`},quoteText:{control:`text`,name:`quoteText`},source:{control:`text`,name:`source`},year:{control:`text`,name:`year`},title:{control:`text`,name:`title`},description:{control:`text`,name:`description`},showRating:{control:`boolean`,name:`showRating`},ratingValue:{control:`text`,name:`ratingValue`},className:{control:`text`,name:`className`}},args:m},g={name:`Demo`,render:e=>l(e),parameters:c(l(m),{unit:`award-item`,scss:t})},_={name:`AllLayouts`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;align-items:flex-start;">${f.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Layout=${e} · Ratio=1:1
        </figcaption>
        ${l({...m,layout:e,imageRatio:`1:1`})}
      </figure>`).join(`
`)}</div>`},v={name:`RatioCompare`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;">${d.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Ratio=${e} · Layout=quote
        </figcaption>
        ${l({...m,imageRatio:e,layout:`quote`})}
      </figure>`).join(`
`)}</div>`},y={name:`Placeholders`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;align-items:flex-start;">${f.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Layout=${e} (no src)
        </figcaption>
        ${l({...m,layout:e,src:``,alt:``})}
      </figure>`).join(`
`)}</div>`},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render(defaultArgs), {
    unit: 'award-item',
    scss: scssSource
  })
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'AllLayouts',
  render: () => {
    const cards = LAYOUT_OPTIONS.map(layout => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Layout=\${layout} · Ratio=1:1
        </figcaption>
        \${render({
      ...defaultArgs,
      layout,
      imageRatio: '1:1'
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;align-items:flex-start;">\${cards}</div>\`;
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'RatioCompare',
  render: () => {
    const cards = RATIO_OPTIONS.map(imageRatio => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Ratio=\${imageRatio} · Layout=quote
        </figcaption>
        \${render({
      ...defaultArgs,
      imageRatio,
      layout: 'quote'
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;">\${cards}</div>\`;
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'Placeholders',
  render: () => {
    const cards = LAYOUT_OPTIONS.map(layout => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Layout=\${layout} (no src)
        </figcaption>
        \${render({
      ...defaultArgs,
      layout,
      src: '',
      alt: ''
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;align-items:flex-start;">\${cards}</div>\`;
  }
}`,...y.parameters?.docs?.source}}},b=[`Demo`,`AllLayouts`,`RatioCompare`,`Placeholders`]})))()}x();export{_ as AllLayouts,g as Demo,y as Placeholders,v as RatioCompare,b as __namedExportsOrder,h as default};