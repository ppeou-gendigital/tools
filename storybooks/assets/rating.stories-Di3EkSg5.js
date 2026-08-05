import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,Q as n,Z as r,l as i,n as a,t as o,u as s,wt as c}from"./pretty-source-C_TZ5wEY.js";import"./text-link-DG6iA3DR.js";import"./icon-D6wgK3Ul.js";import{n as l,r as u,t as d}from"./figma-links-B0HkTJ7d.js";import{a as f,i as p,n as m,r as h,t as g}from"./rating-helpers-54t41rDt.js";function _(e={}){let t=(e.type||`teaser`).toLowerCase(),n=(e.device||`desktop`).toLowerCase(),r=Number(e.value??4.5),i=h(r),a=t===`trustpilot`||t===`trustpilot-teaser`,o=t===`teaser`||t===`trustpilot-teaser`,s=n===`mobile`?`16`:`24`,c=n===`mobile`?`base`:`lg`,l=(e.background||`light`).toLowerCase();return{type:t,value:r,device:n,showScore:e.showScore!==!1,showCount:e.showCount!==!1,countLabel:e.countLabel??`(2,486)`,countHref:e.countHref??`#`,countBackground:l===`dark`?`dark`:`light`,leadingText:e.leadingText??`Rated`,trailingText:e.trailingText??`by customers`,trailing:!!e.trailing,background:l,stars:m(r),scoreLabel:i,iconSize:s,countSize:c,isTeaserFamily:o,isTrustpilotFamily:a,trustpilotColor:f(r),accessibleLabel:e.accessibleLabel||``,className:e.className||``}}function v(e){return y(_(e))}var y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{n(),a(),u(),i(),t(),p(),y=r.default.compile(c),b=[`desktop`,`mobile`],x=[`light`,`dark`],S=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2355-19638&m=dev`,C={title:`Molecules/Rating`,tags:[`autodocs`],parameters:{docs:{description:{component:`Display-only rating molecule (teaser, inline, text-led, Trustpilot). [Pattern / Ratings](${S}). See \`spec.md\`.`}},design:d(`2355:19638`)},argTypes:{type:{control:{type:`select`},options:g,name:`Type`},value:{control:{type:`range`,min:0,max:5,step:.5},name:`Value`},device:{control:{type:`inline-radio`},options:b,name:`Device`},showScore:{control:`boolean`,name:`Show score`},showCount:{control:`boolean`,name:`Show count`},countLabel:{control:`text`,name:`Count label`},leadingText:{control:`text`,name:`Leading text`},trailing:{control:`boolean`,name:`Trailing`},trailingText:{control:`text`,name:`Trailing text`},background:{control:{type:`inline-radio`},options:x,name:`Background`}},args:{type:`teaser`,value:4.5,device:`desktop`,showScore:!0,showCount:!0,countLabel:`(2,486)`,leadingText:`Rated`,trailing:!0,trailingText:`by customers`,background:`light`}},w={name:`Demo`,render:e=>v(e),parameters:o(v({type:`teaser`,value:4.5}),{unit:`rating`,scss:s})},T={name:`AllStyles`,parameters:{design:d([[`Ratings page — 2355:19638`,`2355:19638`],[`Spec — 4630:2285`,`4630:2285`]])},render:()=>{let e=[0,.5,1,1.5,2,2.5,3,3.5,4,4.5,5],t=e=>e.map(e=>`
      <div class="sbd-doc__stack-item">
        <p class="sbd-doc__stack-item-label">${e.type} · ${e.value}${e.device?` · ${e.device}`:``}${e.background?` · ${e.background}`:``}</p>
        <div class="sbd-doc__stack-item-canvas${e.background===`dark`?` sbd-doc__stack-item-canvas--inverse`:``}">${v(e)}</div>
      </div>`).join(``);return`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">${l(`2355:19638`,`Ratings page`)} · ${l(`4630:2285`,`Rating · spec`)}</p>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Teaser — Value ladder (desktop)</h2>
        <div class="sbd-doc__stack">
          ${t(e.map(e=>({type:`teaser`,value:e,device:`desktop`})))}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Inline · Text-led</h2>
        <div class="sbd-doc__stack">
          ${t([{type:`inline`,value:4,device:`desktop`},{type:`inline`,value:5,device:`desktop`},{type:`text-led`,value:5,device:`desktop`,trailing:!1,leadingText:`Rated`},{type:`text-led`,value:5,device:`desktop`,trailing:!0,leadingText:`Rated`,trailingText:`excellent`}])}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Trustpilot · Trustpilot teaser</h2>
        <div class="sbd-doc__stack">
          ${t([{type:`trustpilot`,value:1,device:`desktop`},{type:`trustpilot`,value:3.5,device:`desktop`},{type:`trustpilot`,value:5,device:`desktop`},{type:`trustpilot-teaser`,value:4.5,device:`desktop`,background:`light`},{type:`trustpilot-teaser`,value:4.5,device:`desktop`,background:`dark`},{type:`trustpilot-teaser`,value:4.5,device:`mobile`,background:`light`}])}
        </div>
      </section>
    </div>`}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render({
    type: 'teaser',
    value: 4.5
  }), {
    unit: 'rating',
    scss: scssSource
  })
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  parameters: {
    design: figmaDesign([['Ratings page — 2355:19638', '2355:19638'], ['Spec — 4630:2285', '4630:2285']])
  },
  render: () => {
    const teaserValues = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    const cards = items => items.map(args => \`
      <div class="sbd-doc__stack-item">
        <p class="sbd-doc__stack-item-label">\${args.type} · \${args.value}\${args.device ? \` · \${args.device}\` : ''}\${args.background ? \` · \${args.background}\` : ''}</p>
        <div class="sbd-doc__stack-item-canvas\${args.background === 'dark' ? ' sbd-doc__stack-item-canvas--inverse' : ''}">\${render(args)}</div>
      </div>\`).join('');
    return \`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">\${figmaFrameLink('2355:19638', 'Ratings page')} · \${figmaFrameLink('4630:2285', 'Rating · spec')}</p>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Teaser — Value ladder (desktop)</h2>
        <div class="sbd-doc__stack">
          \${cards(teaserValues.map(value => ({
      type: 'teaser',
      value,
      device: 'desktop'
    })))}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Inline · Text-led</h2>
        <div class="sbd-doc__stack">
          \${cards([{
      type: 'inline',
      value: 4,
      device: 'desktop'
    }, {
      type: 'inline',
      value: 5,
      device: 'desktop'
    }, {
      type: 'text-led',
      value: 5,
      device: 'desktop',
      trailing: false,
      leadingText: 'Rated'
    }, {
      type: 'text-led',
      value: 5,
      device: 'desktop',
      trailing: true,
      leadingText: 'Rated',
      trailingText: 'excellent'
    }])}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Trustpilot · Trustpilot teaser</h2>
        <div class="sbd-doc__stack">
          \${cards([{
      type: 'trustpilot',
      value: 1,
      device: 'desktop'
    }, {
      type: 'trustpilot',
      value: 3.5,
      device: 'desktop'
    }, {
      type: 'trustpilot',
      value: 5,
      device: 'desktop'
    }, {
      type: 'trustpilot-teaser',
      value: 4.5,
      device: 'desktop',
      background: 'light'
    }, {
      type: 'trustpilot-teaser',
      value: 4.5,
      device: 'desktop',
      background: 'dark'
    }, {
      type: 'trustpilot-teaser',
      value: 4.5,
      device: 'mobile',
      background: 'light'
    }])}
        </div>
      </section>
    </div>\`;
  }
}`,...T.parameters?.docs?.source}}},E=[`Demo`,`AllStyles`]})))()}D();export{T as AllStyles,w as Demo,E as __namedExportsOrder,C as default};