import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,Z as n,at as r,n as i,ot as a,t as o}from"./pretty-source-CA3IhMc4.js";import"./discount-label-B_xZkyNW.js";import"./content-title-BvltFXQ5.js";import"./content-body-BGuR5ei1.js";import"./text-link-DG6iA3DR.js";import"./icon-D6wgK3Ul.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";import{n as l,t as u}from"./sample-image-Dtm7bd3B.js";function d(e={}){let t=String(e.ratio||`16-9`).toLowerCase().replace(`:`,`-`);return p.includes(t)||(t=`16-9`),{ratio:t,alignment:String(e.alignment||`bottom-left`).toLowerCase(),imageSrc:e.imageSrc||u,imageAlt:e.imageAlt||``,label:e.label||`label`,showLabel:e.showLabel!==!1,title:e.title||`Your identity, secured`,body:e.body||`We detect changes to your SSN, address, and personal info, and remove your data from broker sites.`,category:e.category||`Identity theft protection`,showCategory:e.showCategory!==!1,footerLabel:e.footerLabel||`2 min read`,footerHref:e.footerHref||`#`,showFooter:e.showFooter!==!1,className:e.className||``}}function f(e,t){return t(d(e))}var p,m,h;function g(){return(g=e((()=>{l(),p=[`16-9`,`4-3`,`1-1`,`3-4`,`2-1`],m=[`top-left`,`top-right`,`bottom-left`,`bottom-right`],h={ratio:`16-9`,alignment:`bottom-left`,imageSrc:u,imageAlt:``,label:`label`,showLabel:!0,title:`Your identity, secured`,body:`We detect changes to your SSN, address, and personal info, and remove your data from broker sites.`,category:`Identity theft protection`,showCategory:!0,footerLabel:`2 min read`,footerHref:`#`,showFooter:!0}})))()}var _,v,y,b,x;function S(){return(S=e((()=>{t(),a(),i(),s(),g(),_=n.default.compile(r),v={title:`Patterns/Card`,tags:[`autodocs`,`shared-library`],render:e=>f(e,_),args:h,argTypes:{ratio:{control:{type:`select`},options:p,name:`Ratio`},alignment:{control:{type:`select`},options:m,name:`Alignment`},imageSrc:{control:`text`,name:`Image src`},label:{control:`text`,name:`Label`},showLabel:{control:`boolean`,name:`Show label`},title:{control:`text`,name:`Title`},body:{control:`text`,name:`Body`},category:{control:`text`,name:`Category`},showCategory:{control:`boolean`,name:`Show category`},footerLabel:{control:`text`,name:`Footer label`},showFooter:{control:`boolean`,name:`Show footer`}},parameters:{badges:[`shared`],contentWidth:`fluid`,design:c([[`Card page — 4695:31653`,`4695:31653`],[`Master — 4695:33460`,`4695:33460`],[`Spec — 5664:296`,`5664:296`]])}},y={parameters:o(f(h,_),{unit:`card`})},b={parameters:{design:c(`4695:31653`)},render:()=>`
      <div class="sbd-doc">
        <h3 class="sbd-doc__group-title">Ratio</h3>
        <div class="sbd-doc__stack" style="display:flex;flex-wrap:wrap;gap:16px;">${p.map(e=>`
      <div class="sbd-doc__stack-item-canvas" style="min-inline-size:220px;">
        <p class="sbd-doc__stack-item-label">ratio = ${e}</p>
        ${f({...h,ratio:e,alignment:`bottom-left`},_)}
      </div>`).join(``)}</div>
        <h3 class="sbd-doc__group-title">Alignment (Simple)</h3>
        <div class="sbd-doc__stack" style="display:flex;flex-wrap:wrap;gap:16px;">${m.map(e=>`
      <div class="sbd-doc__stack-item-canvas" style="min-inline-size:220px;">
        <p class="sbd-doc__stack-item-label">align = ${e}</p>
        ${f({...h,ratio:`1-1`,alignment:e},_)}
      </div>`).join(``)}</div>
      </div>`},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileCardArgs(defaultCardArgs, compiled), {
    unit: 'card'
  })
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    design: figmaDesign('4695:31653')
  },
  render: () => {
    const ratios = RATIO_OPTIONS.map(ratio => \`
      <div class="sbd-doc__stack-item-canvas" style="min-inline-size:220px;">
        <p class="sbd-doc__stack-item-label">ratio = \${ratio}</p>
        \${compileCardArgs({
      ...defaultCardArgs,
      ratio,
      alignment: 'bottom-left'
    }, compiled)}
      </div>\`).join('');
    const aligns = ALIGNMENT_OPTIONS.map(alignment => \`
      <div class="sbd-doc__stack-item-canvas" style="min-inline-size:220px;">
        <p class="sbd-doc__stack-item-label">align = \${alignment}</p>
        \${compileCardArgs({
      ...defaultCardArgs,
      ratio: '1-1',
      alignment
    }, compiled)}
      </div>\`).join('');
    return \`
      <div class="sbd-doc">
        <h3 class="sbd-doc__group-title">Ratio</h3>
        <div class="sbd-doc__stack" style="display:flex;flex-wrap:wrap;gap:16px;">\${ratios}</div>
        <h3 class="sbd-doc__group-title">Alignment (Simple)</h3>
        <div class="sbd-doc__stack" style="display:flex;flex-wrap:wrap;gap:16px;">\${aligns}</div>
      </div>\`;
  }
}`,...b.parameters?.docs?.source}}},x=[`Demo`,`AllStyles`]})))()}S();export{b as AllStyles,y as Demo,x as __namedExportsOrder,v as default};