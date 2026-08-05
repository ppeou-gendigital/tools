import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,Z as n,it as r,n as i,rt as a,t as o}from"./pretty-source-C_TZ5wEY.js";import"./discount-label-B_xZkyNW.js";import"./content-title-BvltFXQ5.js";import"./content-body-BGuR5ei1.js";import"./text-link-DG6iA3DR.js";import"./icon-D6wgK3Ul.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";function l(e={}){let t=String(e.ratio||`16-9`).toLowerCase().replace(`:`,`-`);return d.includes(t)||(t=`16-9`),{ratio:t,alignment:String(e.alignment||`bottom-left`).toLowerCase(),imageSrc:e.imageSrc||`/assets/images/sample.jpg`,imageAlt:e.imageAlt||``,label:e.label||`label`,showLabel:e.showLabel!==!1,title:e.title||`Your identity, secured`,body:e.body||`We detect changes to your SSN, address, and personal info, and remove your data from broker sites.`,category:e.category||`Identity theft protection`,showCategory:e.showCategory!==!1,footerLabel:e.footerLabel||`2 min read`,footerHref:e.footerHref||`#`,showFooter:e.showFooter!==!1,className:e.className||``}}function u(e,t){return t(l(e))}var d,f,p;function m(){return(m=e((()=>{d=[`16-9`,`4-3`,`1-1`,`3-4`,`2-1`],f=[`top-left`,`top-right`,`bottom-left`,`bottom-right`],p={ratio:`16-9`,alignment:`bottom-left`,imageSrc:`/assets/images/sample.jpg`,imageAlt:``,label:`label`,showLabel:!0,title:`Your identity, secured`,body:`We detect changes to your SSN, address, and personal info, and remove your data from broker sites.`,category:`Identity theft protection`,showCategory:!0,footerLabel:`2 min read`,footerHref:`#`,showFooter:!0}})))()}var h,g,_,v,y;function b(){return(b=e((()=>{t(),r(),i(),s(),m(),h=n.default.compile(a),g={title:`Patterns/Card`,tags:[`autodocs`,`shared-library`],render:e=>u(e,h),args:p,argTypes:{ratio:{control:{type:`select`},options:d,name:`Ratio`},alignment:{control:{type:`select`},options:f,name:`Alignment`},imageSrc:{control:`text`,name:`Image src`},label:{control:`text`,name:`Label`},showLabel:{control:`boolean`,name:`Show label`},title:{control:`text`,name:`Title`},body:{control:`text`,name:`Body`},category:{control:`text`,name:`Category`},showCategory:{control:`boolean`,name:`Show category`},footerLabel:{control:`text`,name:`Footer label`},showFooter:{control:`boolean`,name:`Show footer`}},parameters:{badges:[`shared`],contentWidth:`fluid`,design:c([[`Card page — 4695:31653`,`4695:31653`],[`Master — 4695:33460`,`4695:33460`],[`Spec — 5664:296`,`5664:296`]])}},_={parameters:o(u(p,h),{unit:`card`})},v={parameters:{design:c(`4695:31653`)},render:()=>`
      <div class="sbd-doc">
        <h3 class="sbd-doc__group-title">Ratio</h3>
        <div class="sbd-doc__stack" style="display:flex;flex-wrap:wrap;gap:16px;">${d.map(e=>`
      <div class="sbd-doc__stack-item-canvas" style="min-inline-size:220px;">
        <p class="sbd-doc__stack-item-label">ratio = ${e}</p>
        ${u({...p,ratio:e,alignment:`bottom-left`},h)}
      </div>`).join(``)}</div>
        <h3 class="sbd-doc__group-title">Alignment (Simple)</h3>
        <div class="sbd-doc__stack" style="display:flex;flex-wrap:wrap;gap:16px;">${f.map(e=>`
      <div class="sbd-doc__stack-item-canvas" style="min-inline-size:220px;">
        <p class="sbd-doc__stack-item-label">align = ${e}</p>
        ${u({...p,ratio:`1-1`,alignment:e},h)}
      </div>`).join(``)}</div>
      </div>`},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileCardArgs(defaultCardArgs, compiled), {
    unit: 'card'
  })
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y=[`Demo`,`AllStyles`]})))()}b();export{v as AllStyles,_ as Demo,y as __namedExportsOrder,g as default};