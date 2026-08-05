import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Jt as t,M as n,Q as r,Z as i,j as a,n as o,qt as s,t as c}from"./pretty-source-CA3IhMc4.js";import"./discount-label-B_xZkyNW.js";import"./icon-D6wgK3Ul.js";import{r as l,t as u}from"./figma-links-B0HkTJ7d.js";function d(e){let t=e.fill||`solid`,n=e.strength||`base`;return t===`solid`&&(n=`base`),t!==`solid`&&n===`base`&&(n=`50`),f({background:e.background||`primary`,fill:t,strength:n,size:e.size||`small`,text:e.text??`label`,showIcon:!!e.showIcon,icon:e.icon||`actions/simple-add`})}var f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{r(),o(),l(),n(),t(),f=i.default.compile(s),p=[`primary`,`secondary`,`brand`,`brand-soft`,`accent`,`alpha`,`beta`,`gamma`,`delta`,`inverse-primary`,`inverse-secondary`,`success`],m=[`solid`,`transparent`,`tint`],h=[`base`,`30`,`50`,`80`],g=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28415&m=dev`,_={title:`Molecules/Discount label`,tags:[`autodocs`],parameters:{docs:{description:{component:`Compact pill for discount / promo metadata. [Pattern / DiscountLabel](${g}). See \`spec.md\`.`}},design:u(`1408:443`)},argTypes:{background:{control:{type:`select`},options:p,name:`background`},fill:{control:{type:`inline-radio`},options:m,name:`fill`},strength:{control:{type:`inline-radio`},options:h,name:`strength`},text:{control:`text`,name:`text`},showIcon:{control:`boolean`,name:`showIcon`},icon:{control:`text`,name:`icon`}},args:{background:`primary`,fill:`solid`,strength:`base`,text:`label`,showIcon:!1,icon:`actions/simple-add`}},v={name:`Demo`,render:e=>d(e),parameters:c(d({}),{unit:`discount-label`,scss:a})},y={name:`AllStyles`,render:()=>{let e=[[`solid`,`base`],[`transparent`,`30`],[`transparent`,`50`],[`transparent`,`80`],[`tint`,`30`],[`tint`,`50`],[`tint`,`80`]],t=p.map(t=>`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">${t}</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">${e.map(([e,n])=>`
          <div class="sbd-doc__stack-item-canvas" style="min-inline-size:64px;">
            ${d({background:t,fill:e,strength:n,text:`label`})}
          </div>`).join(``)}</div>
        </div>`).join(`
`);return`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma"><a class="sbd-doc__figma-link" href="${g}">Pattern / DiscountLabel — 539:28415 ↗</a></p>
        <section>
          <h2 class="sbd-doc__section-title">Background × Fill × Strength</h2>
          <div class="sbd-doc__stack">${t}</div>
        </section>
      </div>`}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render({}), {
    unit: 'discount-label',
    scss: scssSource
  })
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => {
    const fills = [['solid', 'base'], ['transparent', '30'], ['transparent', '50'], ['transparent', '80'], ['tint', '30'], ['tint', '50'], ['tint', '80']];
    const rows = BACKGROUND_OPTIONS.map(background => {
      const cells = fills.map(([fill, strength]) => \`
          <div class="sbd-doc__stack-item-canvas" style="min-inline-size:64px;">
            \${render({
        background,
        fill,
        strength,
        text: 'label'
      })}
          </div>\`).join('');
      return \`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">\${background}</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">\${cells}</div>
        </div>\`;
    }).join('\\n');
    return \`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma"><a class="sbd-doc__figma-link" href="\${FIGMA_URL}">Pattern / DiscountLabel — 539:28415 ↗</a></p>
        <section>
          <h2 class="sbd-doc__section-title">Background × Fill × Strength</h2>
          <div class="sbd-doc__stack">\${rows}</div>
        </section>
      </div>\`;
  }
}`,...y.parameters?.docs?.source}}},b=[`Demo`,`AllStyles`]})))()}x();export{y as AllStyles,v as Demo,b as __namedExportsOrder,_ as default};