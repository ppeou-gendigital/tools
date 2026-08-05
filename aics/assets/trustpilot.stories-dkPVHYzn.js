import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{$t as t,Et as n,Q as r,Qt as i,Tt as a,Z as o,Zt as s,ct as c,en as l,n as u,st as d,t as f}from"./pretty-source-CA3IhMc4.js";import"./content-title-BvltFXQ5.js";import"./content-body-BGuR5ei1.js";import"./text-link-DG6iA3DR.js";import"./icon-D6wgK3Ul.js";import{r as p,t as m}from"./figma-links-B0HkTJ7d.js";import{a as h,i as g,n as _,r as v}from"./rating-helpers-54t41rDt.js";function y(e={}){let t=Number(e.value??5),n=v(t);return{title:e.title||`Quote title`,productLabel:e.productLabel||`Product`,quoteBody:e.quoteBody||`Customer quote body text goes here.`,reviewerLine:e.reviewerLine||`Reviewer · Date`,verifiedLabel:e.verifiedLabel||`Verified purchaser`,showProductLabel:e.showProductLabel!==!1,showVerified:e.showVerified!==!1,showQuote:e.showQuote!==!1,value:t,className:e.className||``,ratingArgs:{type:`trustpilot`,value:t,device:`desktop`,showScore:!1,showCount:!1,stars:_(t),scoreLabel:n,iconSize:`24`,countSize:`lg`,isTeaserFamily:!1,isTrustpilotFamily:!0,trustpilotColor:h(t),accessibleLabel:e.accessibleLabel||`Rated ${n} out of 5 on Trustpilot`,className:``}}}function b(e,t){return t(y(e))}var x;function S(){return(S=e((()=>{g(),x={title:`Best identity protection I've used`,productLabel:`LifeLock Standard`,quoteBody:`Customer quote body text goes here.`,reviewerLine:`Reviewer · Date`,verifiedLabel:`Verified purchaser`,showProductLabel:!0,showVerified:!0,showQuote:!0,value:5}})))()}function C(e=4.5,t=`(4,464)`){let n=v(e);return D({type:`trustpilot-teaser`,value:e,device:`desktop`,showScore:!0,showCount:!0,countLabel:t,countHref:`#`,countBackground:`light`,stars:_(e),scoreLabel:n,iconSize:`24`,countSize:`lg`,isTeaserFamily:!0,isTrustpilotFamily:!0,trustpilotColor:h(e),accessibleLabel:`${n} out of 5 · ${t} reviews`})}var w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{r(),d(),i(),l(),a(),u(),p(),g(),S(),w=o.default.compile(c),T=o.default.compile(s),E=o.default.compile(t),D=o.default.compile(n),O={title:`Patterns/Trustpilot`,tags:[`autodocs`,`shared-library`],render:e=>b(e,w),args:x,argTypes:{title:{control:`text`,name:`Title`},productLabel:{control:`text`,name:`Product label`},quoteBody:{control:`text`,name:`Quote`},reviewerLine:{control:`text`,name:`Reviewer line`},verifiedLabel:{control:`text`,name:`Verified label`},showProductLabel:{control:`boolean`,name:`Show product`},showVerified:{control:`boolean`,name:`Show verified`},showQuote:{control:`boolean`,name:`Show quote`},value:{control:{type:`number`,min:0,max:5,step:.5},name:`Rating value`}},parameters:{badges:[`shared`],contentWidth:`fluid`,design:m([[`Trustpilot page — 2356:19641`,`2356:19641`],[`Review cell — 2500:4244`,`2500:4244`],[`Spec — 3969:12883`,`3969:12883`]])}},k={parameters:f(b(x,w),{unit:`trustpilot`})},A={parameters:{design:m(`2500:4244`)},render:()=>`
      <div class="sbd-doc">
        <h3 class="sbd-doc__group-title">Review cell variants</h3>
        <div class="sbd-doc__stack" style="display:flex;flex-wrap:wrap;gap:16px;">${[{title:`Best identity protection`,value:5,showProductLabel:!0,showVerified:!0},{title:`Solid coverage`,value:4.5,showProductLabel:!0,showVerified:!1},{title:`Worth the subscription`,value:4,showProductLabel:!1,showVerified:!0},{title:`Useful but UI could be cleaner`,value:3.5,showQuote:!0}].map(e=>`
        <div class="sbd-doc__stack-item-canvas">
          ${b({...x,...e},w)}
        </div>`).join(``)}</div>
        <h3 class="sbd-doc__group-title">Composed section</h3>
        <div class="sbd-doc__stack">${`
      <div class="sbd-doc__stack-item" style="max-inline-size:1328px;">
        <p class="sbd-doc__stack-item-label">Composed review section (story demo)</p>
        <div style="display:flex;flex-direction:column;gap:24px;padding:24px;background:var(--color-bg-default);border-radius:8px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;">
            <div>
              ${T({style:`h3`,weight:`emphasis`,tag:`h2`,text:`User Reviews`})}
              ${E({style:`body-base`,weight:`base`,text:`Real customer voice from verified subscribers.`})}
            </div>
            <div>${C(4.65)}</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px;">
            ${b({...x,title:`Best identity protection`},w)}
            ${b({...x,title:`Solid coverage, easy to set up`,value:4.5},w)}
            ${b({...x,title:`Worth every penny`,value:5},w)}
          </div>
        </div>
      </div>`}</div>
      </div>`},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileTrustpilotArgs(defaultTrustpilotArgs, compiled), {
    unit: 'trustpilot'
  })
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  parameters: {
    design: figmaDesign('2500:4244')
  },
  render: () => {
    const cells = [{
      title: 'Best identity protection',
      value: 5,
      showProductLabel: true,
      showVerified: true
    }, {
      title: 'Solid coverage',
      value: 4.5,
      showProductLabel: true,
      showVerified: false
    }, {
      title: 'Worth the subscription',
      value: 4,
      showProductLabel: false,
      showVerified: true
    }, {
      title: 'Useful but UI could be cleaner',
      value: 3.5,
      showQuote: true
    }].map(args => \`
        <div class="sbd-doc__stack-item-canvas">
          \${compileTrustpilotArgs({
      ...defaultTrustpilotArgs,
      ...args
    }, compiled)}
        </div>\`).join('');
    const section = \`
      <div class="sbd-doc__stack-item" style="max-inline-size:1328px;">
        <p class="sbd-doc__stack-item-label">Composed review section (story demo)</p>
        <div style="display:flex;flex-direction:column;gap:24px;padding:24px;background:var(--color-bg-default);border-radius:8px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;">
            <div>
              \${compileTitle({
      style: 'h3',
      weight: 'emphasis',
      tag: 'h2',
      text: 'User Reviews'
    })}
              \${compileBody({
      style: 'body-base',
      weight: 'base',
      text: 'Real customer voice from verified subscribers.'
    })}
            </div>
            <div>\${teaserRating(4.65)}</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px;">
            \${compileTrustpilotArgs({
      ...defaultTrustpilotArgs,
      title: 'Best identity protection'
    }, compiled)}
            \${compileTrustpilotArgs({
      ...defaultTrustpilotArgs,
      title: 'Solid coverage, easy to set up',
      value: 4.5
    }, compiled)}
            \${compileTrustpilotArgs({
      ...defaultTrustpilotArgs,
      title: 'Worth every penny',
      value: 5
    }, compiled)}
          </div>
        </div>
      </div>\`;
    return \`
      <div class="sbd-doc">
        <h3 class="sbd-doc__group-title">Review cell variants</h3>
        <div class="sbd-doc__stack" style="display:flex;flex-wrap:wrap;gap:16px;">\${cells}</div>
        <h3 class="sbd-doc__group-title">Composed section</h3>
        <div class="sbd-doc__stack">\${section}</div>
      </div>\`;
  }
}`,...A.parameters?.docs?.source}}},j=[`Demo`,`AllStyles`]})))()}M();export{A as AllStyles,k as Demo,j as __namedExportsOrder,O as default};