import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{b as t,i as n,n as r,r as i,t as a,y as o}from"./pretty-source-PtImQSP_.js";import"./icon-D6wgK3Ul.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";function l(e={}){let t=String(e.fill||`solid`).toLowerCase(),n=String(e.strength||`base`).toLowerCase();return t===`solid`&&(n=`base`),t!==`solid`&&n===`base`&&(n=`50`),{background:String(e.background||`primary`).toLowerCase(),fill:t,strength:n,text:e.text??`Tag`,showIcon:e.showIcon!==!1,iconName:e.iconName||`objects/simple-device-vehicle`}}function u(e,t){return t(l(e))}var d,f,p,m,h;function g(){return(g=e((()=>{d=[`primary`,`secondary`,`brand`,`brand-soft`,`accent`,`alpha`,`beta`,`gamma`,`delta`,`inverse-primary`,`inverse-secondary`],f=[`solid`,`transparent`,`tint`],p=[`base`,`30`,`50`,`80`],m=`objects/simple-device-vehicle`,h={background:`primary`,fill:`solid`,strength:`base`,text:`Tag`,showIcon:!0,iconName:m}})))()}var _,v,y,b,x;function S(){return(S=e((()=>{n(),o(),r(),s(),g(),_=i.default.compile(t),v={title:`Molecules/Tag`,tags:[`autodocs`,`shared-library`],render:e=>u(e,_),args:h,argTypes:{background:{control:{type:`select`},options:d,name:`Background`},fill:{control:{type:`inline-radio`},options:f,name:`Fill`},strength:{control:{type:`inline-radio`},options:p,name:`Strength`},text:{control:`text`,name:`Text`},showIcon:{control:`boolean`,name:`Show icon`},iconName:{control:`text`,name:`Icon name`}},parameters:{badges:[`shared`],contentWidth:`fluid`,design:c([[`Tag set — 6114:53`,`6114:53`],[`Spec — 6328:54273`,`6328:54273`]])}},y={parameters:a(u(h,_),{unit:`tag`})},b={parameters:{design:c(`6114:53`)},render:()=>{let e=[[`solid`,`base`],[`tint`,`30`],[`tint`,`50`],[`tint`,`80`],[`transparent`,`30`],[`transparent`,`50`],[`transparent`,`80`]];return`<div class="sbd-doc"><div class="sbd-doc__stack">${d.map(t=>`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">${t}</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">${e.map(([e,n])=>`
          <div class="sbd-doc__stack-item-canvas" style="min-inline-size:64px;">
            ${u({background:t,fill:e,strength:n,text:`Tag`},_)}
          </div>`).join(``)}</div>
        </div>`).join(``)}</div></div>`}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileTagArgs(defaultTagArgs, compiled), {
    unit: 'tag'
  })
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    design: figmaDesign('6114:53')
  },
  render: () => {
    const fills = [['solid', 'base'], ['tint', '30'], ['tint', '50'], ['tint', '80'], ['transparent', '30'], ['transparent', '50'], ['transparent', '80']];
    const rows = BACKGROUND_OPTIONS.map(background => {
      const cells = fills.map(([fill, strength]) => \`
          <div class="sbd-doc__stack-item-canvas" style="min-inline-size:64px;">
            \${compileTagArgs({
        background,
        fill,
        strength,
        text: 'Tag'
      }, compiled)}
          </div>\`).join('');
      return \`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">\${background}</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">\${cells}</div>
        </div>\`;
    }).join('');
    return \`<div class="sbd-doc"><div class="sbd-doc__stack">\${rows}</div></div>\`;
  }
}`,...b.parameters?.docs?.source}}},x=[`Demo`,`AllStyles`]})))()}S();export{b as AllStyles,y as Demo,x as __namedExportsOrder,v as default};