import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{d as t,f as n,i as r,n as i,r as a,t as o}from"./pretty-source-PtImQSP_.js";import"./text-link-DG6iA3DR.js";import"./icon-D6wgK3Ul.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";import{a as l,i as u,n as d,r as f}from"./rating-helpers-54t41rDt.js";function p(e={}){let t=Number(e.value??5),n=f(t);return{title:e.title||`Quote title`,productLabel:e.productLabel||`Product`,quoteBody:e.quoteBody||`Customer quote body text goes here.`,reviewerLine:e.reviewerLine||`Reviewer · Date`,verifiedLabel:e.verifiedLabel||`Verified purchaser`,showProductLabel:e.showProductLabel!==!1,showVerified:e.showVerified!==!1,showQuote:e.showQuote!==!1,value:t,className:e.className||``,ratingArgs:{type:`trustpilot`,value:t,device:`desktop`,showScore:!1,showCount:!1,stars:d(t),scoreLabel:n,iconSize:`24`,countSize:`lg`,isTeaserFamily:!1,isTrustpilotFamily:!0,trustpilotColor:l(t),accessibleLabel:e.accessibleLabel||`Rated ${n} out of 5 on Trustpilot`,className:``}}}function m(e,t){return t(p(e))}var h;function g(){return(g=e((()=>{u(),h={title:`Best identity protection I've used`,productLabel:`LifeLock Standard`,quoteBody:`Customer quote body text goes here.`,reviewerLine:`Reviewer · Date`,verifiedLabel:`Verified purchaser`,showProductLabel:!0,showVerified:!0,showQuote:!0,value:5}})))()}var _,v,y,b,x;function S(){return(S=e((()=>{r(),t(),i(),s(),g(),_=a.default.compile(n),v={title:`Patterns/Trustpilot`,tags:[`autodocs`,`shared-library`],render:e=>m(e,_),args:h,argTypes:{title:{control:`text`,name:`Title`},productLabel:{control:`text`,name:`Product label`},quoteBody:{control:`text`,name:`Quote`},value:{control:{type:`number`,min:0,max:5,step:.5},name:`Rating value`},showProductLabel:{control:`boolean`,name:`Show product`},showVerified:{control:`boolean`,name:`Show verified`}},parameters:{badges:[`shared`],contentWidth:`fluid`,design:c([[`Trustpilot page — 2356:19641`,`2356:19641`],[`Spec — 3969:12883`,`3969:12883`]])}},y={parameters:o(m(h,_),{unit:`trustpilot`})},b={parameters:{design:c(`2500:4244`)},render:()=>`<div class="sbd-doc"><div class="sbd-doc__stack" style="display:flex;flex-wrap:wrap;gap:16px;">${[5,4.5,4,3.5].map(e=>`
      <div class="sbd-doc__stack-item-canvas">
        ${m({...h,value:e},_)}
      </div>`).join(``)}</div></div>`},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileTrustpilotArgs(defaultTrustpilotArgs, compiled), {
    unit: 'trustpilot'
  })
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    design: figmaDesign('2500:4244')
  },
  render: () => {
    const cells = [5, 4.5, 4, 3.5].map(value => \`
      <div class="sbd-doc__stack-item-canvas">
        \${compileTrustpilotArgs({
      ...defaultTrustpilotArgs,
      value
    }, compiled)}
      </div>\`).join('');
    return \`<div class="sbd-doc"><div class="sbd-doc__stack" style="display:flex;flex-wrap:wrap;gap:16px;">\${cells}</div></div>\`;
  }
}`,...b.parameters?.docs?.source}}},x=[`Demo`,`AllStyles`]})))()}S();export{b as AllStyles,y as Demo,x as __namedExportsOrder,v as default};