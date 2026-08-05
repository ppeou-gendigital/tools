import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dt as t,ft as n,i as r,n as i,r as a,t as o}from"./pretty-source-BpcPhKjD.js";import"./award-wrapper-CnnXzk4H.js";var s;function c(){return(c=e((()=>{s=`/**
 * Patterns/Award item — .c-award-item
 * Figma Web-ODS Shared Library 2355:19639 / Spec 3882:473.
 *
 * Card: --color-bg-primary, --border-radius-s, --space-3 pad/gap.
 * Image slot sizes are hard-coded per Spec (override Award Wrapper box).
 */

.c-award-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  box-sizing: border-box;
  padding: var(--space-3);
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-s);
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
}

.c-award-item__media {
  flex: 0 0 auto;
}

/* Default slot sizes (non title-description) */
.c-award-item--ratio-1-1 .c-award-item__media .c-award-wrapper {
  inline-size: 56px;
  block-size: 56px;
}

.c-award-item--ratio-9-16 .c-award-item__media .c-award-wrapper {
  inline-size: 37px;
  block-size: 66px;
}

.c-award-item--ratio-16-9 .c-award-item__media .c-award-wrapper {
  inline-size: 88px;
  block-size: 50px;
}

/* Title-description featured slot */
.c-award-item--layout-title-description.c-award-item--ratio-1-1 .c-award-item__media .c-award-wrapper {
  inline-size: 136px;
  block-size: 136px;
}

.c-award-item--layout-title-description.c-award-item--ratio-9-16 .c-award-item__media .c-award-wrapper {
  inline-size: 77px;
  block-size: 136px;
}

.c-award-item--layout-title-description.c-award-item--ratio-16-9 .c-award-item__media .c-award-wrapper {
  inline-size: 136px;
  block-size: 77px;
}

.c-award-item--ratio-9-16 .c-award-wrapper__placeholder-label {
  font-size: 10px;
  line-height: 11px;
}

.c-award-item__content {
  flex: 1 1 0;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.c-award-item--layout-title-description .c-award-item__content {
  inline-size: 220px;
  flex: 0 0 220px;
}

.c-award-item__quote,
.c-award-item__source,
.c-award-item__year,
.c-award-item__title,
.c-award-item__description,
.c-award-item__score {
  margin: 0;
}

.c-award-item__quote,
.c-award-item__title {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letterspacing-body-sm);
  color: var(--color-text-primary);
}

.c-award-item--layout-title-description .c-award-item__title {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  letter-spacing: var(--letterspacing-body-base);
}

.c-award-item__source,
.c-award-item__year,
.c-award-item__description {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--letterspacing-body-sm);
  color: var(--color-text-secondary);
}

.c-award-item__rating {
  display: inline-flex;
  align-items: center;
  gap: var(--space-0);
  color: var(--color-text-primary);
}

.c-award-item__rating--inline {
  gap: var(--space-1);
}

.c-award-item__score {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  font-weight: var(--font-weight-semibold);
}

/* Layout direction */
.c-award-item--layout-compact-stacked,
.c-award-item--layout-rating-stacked {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.c-award-item--layout-compact-stacked .c-award-item__content,
.c-award-item--layout-rating-stacked .c-award-item__rating {
  align-items: center;
}

.c-award-item--layout-quote,
.c-award-item--layout-title-rating,
.c-award-item--layout-compact,
.c-award-item--layout-title-description {
  flex-direction: row;
  align-items: flex-start;
}
`})))()}function l(e){let t=e.layout||`quote`,n=t===`quote`||t===`title-rating`;return u({imageRatio:e.imageRatio||`1:1`,layout:t,src:e.src||``,alt:e.alt??``,quoteText:e.quoteText||``,source:e.source||``,year:e.year||``,title:e.title||``,description:e.description||``,showRating:e.showRating==null?n:!!e.showRating,ratingValue:e.ratingValue||`5.0`,className:e.className||``})}var u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{r(),i(),c(),n(),u=a.default.compile(t),d=[`1:1`,`9:16`,`16:9`],f=[`quote`,`title-rating`,`compact`,`compact-stacked`,`rating-stacked`,`title-description`],p=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2355-19639&m=dev`,m={imageRatio:`1:1`,layout:`quote`,src:``,alt:``,quoteText:`“Best overall protection for families.”`,source:`PCMag Editors’ Choice`,year:`2026`,title:`Best Overall Protection`,description:`Independent lab testing ranked this award for cross-device coverage and phishing defence.`,showRating:!0,ratingValue:`5.0`,className:``},h={title:`Patterns/Award item`,tags:[`autodocs`],parameters:{docs:{description:{component:`Award item inherited from core. Image ratio × Layout; composes Award Wrapper. Stars are inline icons until RatingTeaser / RatingInline onboard. [Figma](${p}).`}}},argTypes:{imageRatio:{control:{type:`inline-radio`},options:d,name:`Image ratio`},layout:{control:{type:`select`},options:f,name:`Layout`},src:{control:`text`,name:`src`},alt:{control:`text`,name:`alt`},quoteText:{control:`text`,name:`quoteText`},source:{control:`text`,name:`source`},year:{control:`text`,name:`year`},title:{control:`text`,name:`title`},description:{control:`text`,name:`description`},showRating:{control:`boolean`,name:`showRating`},ratingValue:{control:`text`,name:`ratingValue`},className:{control:`text`,name:`className`}},args:m},g={name:`Demo`,render:e=>l(e),parameters:o(l(m),{unit:`award-item`,scss:s})},_={name:`AllLayouts`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;align-items:flex-start;">${f.map(e=>`
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