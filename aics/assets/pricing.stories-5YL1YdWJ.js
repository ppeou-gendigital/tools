import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,Z as n,d as r,f as i,mn as a,n as o,pn as s,t as c}from"./pretty-source-CA3IhMc4.js";function l(e){return u({amount:e.amount??`0`,currency:e.currency||`$`,currencyPosition:e.currencyPosition||`first`,size:e.size||`l`,theme:e.theme||`default`,period:e.period??`/mo`,showPeriod:e.showPeriod!==!1,stackPeriod:!!e.stackPeriod,ariaLabel:e.ariaLabel||``,className:e.className||``})}var u,d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{t(),o(),r(),s(),u=n.default.compile(a),d=[`l`,`m`,`s`,`xs`],f=[`default`,`inverse`],p=[`first`,`last`],m=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4070-2426&m=dev`,h={amount:`16.67`,currency:`$`,currencyPosition:`first`,size:`l`,theme:`default`,period:`/mo`,showPeriod:!0,stackPeriod:!1,ariaLabel:`16 dollars and 67 cents per month`,className:``},g={title:`Molecules/Pricing`,tags:[`autodocs`],parameters:{docs:{description:{component:`Typography-only price triplet (currency · amount · period). 32 variants: Size × Theme × Currency position × Stack period. [Figma](${m}).`}}},argTypes:{amount:{control:`text`,name:`amount`},currency:{control:`text`,name:`currency`},currencyPosition:{control:{type:`inline-radio`},options:p,name:`Currency position`},size:{control:{type:`inline-radio`},options:d,name:`Size`},theme:{control:{type:`inline-radio`},options:f,name:`Theme`},period:{control:`text`,name:`period`},showPeriod:{control:`boolean`,name:`showPeriod`},stackPeriod:{control:`boolean`,name:`stackPeriod`},ariaLabel:{control:`text`,name:`ariaLabel`},className:{control:`text`,name:`className`}},args:h},_={name:`Demo`,render:e=>l(e),parameters:c(l(h),{unit:`pricing`,scss:i})},v={name:`AllSizes`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-end;padding:16px;">${d.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Size=${e}
        </figcaption>
        ${l({...h,size:e})}
      </figure>`).join(`
`)}</div>`},y={name:`ThemeMatrix`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;">${f.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;padding:16px;${e===`inverse`?`background:#2f303c;`:``}">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:${e===`inverse`?`#fff`:`var(--color-text-secondary,#555)`};">
          Theme=${e}
        </figcaption>
        ${l({...h,theme:e,size:`m`})}
      </figure>`).join(`
`)}</div>`},b={name:`StackCompare`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-end;padding:16px;">${[!1,!0].map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          stackPeriod=${e}
        </figcaption>
        ${l({...h,stackPeriod:e,size:`l`})}
      </figure>`).join(`
`)}</div>`},x={name:`CurrencyPositions`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-end;padding:16px;">${p.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          currencyPosition=${e}
        </figcaption>
        ${l({...h,currencyPosition:e,size:`m`})}
      </figure>`).join(`
`)}</div>`},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render(defaultArgs), {
    unit: 'pricing',
    scss: scssSource
  })
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'AllSizes',
  render: () => {
    const cards = SIZE_OPTIONS.map(size => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Size=\${size}
        </figcaption>
        \${render({
      ...defaultArgs,
      size
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-end;padding:16px;">\${cards}</div>\`;
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'ThemeMatrix',
  render: () => {
    const cards = THEME_OPTIONS.map(theme => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;padding:16px;\${theme === 'inverse' ? 'background:#2f303c;' : ''}">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:\${theme === 'inverse' ? '#fff' : 'var(--color-text-secondary,#555)'};">
          Theme=\${theme}
        </figcaption>
        \${render({
      ...defaultArgs,
      theme,
      size: 'm'
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;">\${cards}</div>\`;
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'StackCompare',
  render: () => {
    const cards = [false, true].map(stackPeriod => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          stackPeriod=\${stackPeriod}
        </figcaption>
        \${render({
      ...defaultArgs,
      stackPeriod,
      size: 'l'
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-end;padding:16px;">\${cards}</div>\`;
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'CurrencyPositions',
  render: () => {
    const cards = CURRENCY_POS.map(currencyPosition => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          currencyPosition=\${currencyPosition}
        </figcaption>
        \${render({
      ...defaultArgs,
      currencyPosition,
      size: 'm'
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-end;padding:16px;">\${cards}</div>\`;
  }
}`,...x.parameters?.docs?.source}}},S=[`Demo`,`AllSizes`,`ThemeMatrix`,`StackCompare`,`CurrencyPositions`]})))()}C();export{v as AllSizes,x as CurrencyPositions,_ as Demo,b as StackCompare,y as ThemeMatrix,S as __namedExportsOrder,g as default};