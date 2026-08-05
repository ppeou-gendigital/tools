import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{_t as t,i as n,n as r,r as i,t as a,vt as o}from"./pretty-source-BpcPhKjD.js";var s;function c(){return(c=e((()=>{s=`/**
 * Pricing — core molecule (.c-pricing).
 * Figma Web-ODS Shared Library page 4070:2426 / Spec 4313:48.
 *
 * Typography-only price triplet: currency + amount + optional period.
 */

.c-pricing {
  display: inline-flex;
  box-sizing: border-box;
  align-items: flex-end;
  gap: var(--space-2, 4px);
  padding: var(--space-0, 0);
  font-family: var(--font-family-primary);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.c-pricing--theme-inverse {
  color: var(--color-text-inverse);
  background-color: var(--color-bg-inverse);
}

.c-pricing--stack-period {
  flex-direction: column;
  align-items: flex-end;
}

.c-pricing__value {
  display: inline-flex;
  align-items: flex-end;
  gap: var(--space-1, 2px);
  overflow: clip;
}

.c-pricing__currency,
.c-pricing__amount,
.c-pricing__period {
  margin: 0;
  font-style: normal;
}

.c-pricing__currency,
.c-pricing__period {
  font-weight: var(--font-weight-regular, 400);
}

.c-pricing__amount {
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-semibold, 600);
}

/* Size L — amount H3, currency Body-2xl, period Body-sm, outer gap space-2 */
.c-pricing--size-l {
  gap: var(--space-2, 4px);
}

.c-pricing--size-l .c-pricing__amount {
  font-size: var(--font-size-h3);
  line-height: var(--lineheight-h3);
  letter-spacing: var(--letterspacing-h3);
}

.c-pricing--size-l .c-pricing__currency {
  font-size: var(--font-size-body-2xl);
  line-height: var(--lineheight-body-2xl);
  letter-spacing: var(--letterspacing-body-2xl);
  padding-block-end: var(--space-2, 4px);
}

.c-pricing--size-l .c-pricing__period {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  padding-block-end: var(--space-2, 4px);
}

.c-pricing--size-l.c-pricing--stack-period .c-pricing__period {
  padding-block-end: 0;
}

/* Size M — amount H4, currency Body-xl */
.c-pricing--size-m {
  gap: var(--space-2, 4px);
}

.c-pricing--size-m .c-pricing__amount {
  font-size: var(--font-size-h4);
  line-height: var(--lineheight-h4);
  letter-spacing: var(--letterspacing-h4);
}

.c-pricing--size-m .c-pricing__currency {
  font-size: var(--font-size-body-xl);
  line-height: var(--lineheight-body-xl);
  letter-spacing: var(--letterspacing-body-xl);
  padding-block-end: var(--space-2, 4px);
}

.c-pricing--size-m .c-pricing__period {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  padding-block-end: var(--space-2, 4px);
}

.c-pricing--size-m.c-pricing--stack-period .c-pricing__period {
  padding-block-end: 0;
}

/* Size S — amount H5, currency Body-base, outer gap space-1 */
.c-pricing--size-s {
  gap: var(--space-1, 2px);
}

.c-pricing--size-s .c-pricing__amount {
  font-size: var(--font-size-h5);
  line-height: var(--lineheight-h5);
  letter-spacing: var(--letterspacing-h5);
}

.c-pricing--size-s .c-pricing__currency {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  letter-spacing: var(--letterspacing-body-base);
  padding-block-end: var(--space-1, 2px);
}

.c-pricing--size-s .c-pricing__period {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  padding-block-end: var(--space-1, 2px);
}

.c-pricing--size-s.c-pricing--stack-period .c-pricing__period {
  padding-block-end: 0;
}

/* Size XS — amount H6, currency Body-sm */
.c-pricing--size-xs {
  gap: var(--space-1, 2px);
}

.c-pricing--size-xs .c-pricing__amount {
  font-size: var(--font-size-h6);
  line-height: var(--lineheight-h6);
  letter-spacing: var(--letterspacing-h6);
}

.c-pricing--size-xs .c-pricing__currency {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  padding-block-end: var(--space-1, 2px);
}

.c-pricing--size-xs .c-pricing__period {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  padding-block-end: var(--space-1, 2px);
}

.c-pricing--size-xs.c-pricing--stack-period .c-pricing__period {
  padding-block-end: 0;
}
`})))()}function l(e){return u({amount:e.amount??`0`,currency:e.currency||`$`,currencyPosition:e.currencyPosition||`first`,size:e.size||`l`,theme:e.theme||`default`,period:e.period??`/mo`,showPeriod:e.showPeriod!==!1,stackPeriod:!!e.stackPeriod,ariaLabel:e.ariaLabel||``,className:e.className||``})}var u,d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{n(),r(),c(),t(),u=i.default.compile(o),d=[`l`,`m`,`s`,`xs`],f=[`default`,`inverse`],p=[`first`,`last`],m=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4070-2426&m=dev`,h={amount:`16.67`,currency:`$`,currencyPosition:`first`,size:`l`,theme:`default`,period:`/mo`,showPeriod:!0,stackPeriod:!1,ariaLabel:`16 dollars and 67 cents per month`,className:``},g={title:`Molecules/Pricing`,tags:[`autodocs`],parameters:{docs:{description:{component:`Typography-only price triplet inherited from core. 32 variants: Size × Theme × Currency position × Stack period. [Figma](${m}).`}}},argTypes:{amount:{control:`text`,name:`amount`},currency:{control:`text`,name:`currency`},currencyPosition:{control:{type:`inline-radio`},options:p,name:`Currency position`},size:{control:{type:`inline-radio`},options:d,name:`Size`},theme:{control:{type:`inline-radio`},options:f,name:`Theme`},period:{control:`text`,name:`period`},showPeriod:{control:`boolean`,name:`showPeriod`},stackPeriod:{control:`boolean`,name:`stackPeriod`},ariaLabel:{control:`text`,name:`ariaLabel`},className:{control:`text`,name:`className`}},args:h},_={name:`Demo`,render:e=>l(e),parameters:a(l(h),{unit:`pricing`,scss:s})},v={name:`AllSizes`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-end;padding:16px;">${d.map(e=>`
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