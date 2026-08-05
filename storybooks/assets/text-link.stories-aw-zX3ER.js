import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,Z as n,a as r,in as i,n as a,o,rn as s,t as c}from"./pretty-source-C_TZ5wEY.js";import"./text-link-DG6iA3DR.js";function l(e){return u({label:e.label??``,href:e.href??`#`,target:e.target||``,rel:e.rel||``,background:e.background||`light`,size:e.size||`base`,weight:e.weight||`regular`,iconTreatment:e.iconTreatment||`none`,iconName:e.iconName||``,iconPosition:e.iconPosition||`trailing`,disabled:!!e.disabled,ariaLabel:e.ariaLabel||``,id:e.id||``,forceVisited:!!e.forceVisited})}var u,d,f,p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{t(),a(),r(),s(),u=n.default.compile(i),d=[`light`,`dark`],f=[`xs`,`sm`,`base`,`lg`,`xl`,`2xl`,`3xl`],p=[`regular`,`medium`,`semibold`,`bold`],m=[`none`,`external`,`inline`],h=[`leading`,`trailing`],g=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-54878&m=dev`,_={label:`Read more about protection`,href:`https://example.com/learn`,target:``,rel:``,background:`light`,size:`base`,weight:`regular`,iconTreatment:`none`,iconName:``,iconPosition:`trailing`,disabled:!1,ariaLabel:``,id:``,forceVisited:!1},v={title:`Molecules/Text link`,tags:[`autodocs`],parameters:{docs:{description:{component:`Inline text link. Background × Size × Weight; states via CSS. Optional icon slot. [Figma](${g}).`}},contentWidth:`fluid`},argTypes:{label:{control:`text`,name:`Label`},href:{control:`text`,name:`href`},target:{control:{type:`inline-radio`},options:[``,`_self`,`_blank`],name:`target`},rel:{control:`text`,name:`rel`},background:{control:{type:`inline-radio`},options:d,name:`Background`},size:{control:{type:`select`},options:f,name:`Size`},weight:{control:{type:`inline-radio`},options:p,name:`Weight`},iconTreatment:{control:{type:`inline-radio`},options:m,name:`Icon treatment`},iconName:{control:`text`,name:`Icon name`},iconPosition:{control:{type:`inline-radio`},options:h,name:`Icon position`},disabled:{control:`boolean`,name:`Disabled`},ariaLabel:{control:`text`,name:`Aria label`},id:{control:`text`,name:`id`}},args:_},y={name:`Demo`,render:e=>l(e),parameters:c(l(_),{unit:`text-link`,scss:o})},b={name:`SizeLadder`,render:()=>`<div style="display:flex;flex-direction:column;gap:12px;padding:16px;">${f.map(e=>`
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e}</figcaption>
        ${l({..._,size:e,label:`Size ${e}`})}
      </figure>`).join(`
`)}</div>`},x={name:`WeightCompare`,render:()=>`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;">${p.map(e=>`
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e}</figcaption>
        ${l({..._,weight:e,label:`Weight ${e}`})}
      </figure>`).join(`
`)}</div>`},S={name:`BackgroundCompare`,render:()=>`
    <div style="display:flex;gap:24px;padding:16px;">
      <div style="padding:16px;background:var(--color-bg-primary,#fff);">
        ${l({..._,background:`light`,label:`Light background`})}
      </div>
      <div style="padding:16px;background:var(--color-bg-inverse-strong,#2f303c);">
        ${l({..._,background:`dark`,label:`Dark background`})}
      </div>
    </div>`},C={name:`IconTreatments`,render:()=>`
    <div style="display:flex;flex-direction:column;gap:16px;padding:16px;">
      ${l({..._,iconTreatment:`external`,label:`External link`,target:`_blank`})}
      ${l({..._,iconTreatment:`inline`,iconName:`arrows-navigation/simple-arrow-forward`,iconPosition:`trailing`,label:`Continue`})}
      ${l({..._,iconTreatment:`inline`,iconName:`arrows-navigation/simple-arrow-back`,iconPosition:`leading`,label:`Back`})}
      ${l({..._,disabled:!0,label:`Disabled link`})}
    </div>`},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render(defaultArgs), {
    unit: 'text-link',
    scss: scssSource
  })
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'SizeLadder',
  render: () => {
    const cards = SIZE_OPTIONS.map(size => \`
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">\${size}</figcaption>
        \${render({
      ...defaultArgs,
      size,
      label: \`Size \${size}\`
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-direction:column;gap:12px;padding:16px;">\${cards}</div>\`;
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'WeightCompare',
  render: () => {
    const cards = WEIGHT_OPTIONS.map(weight => \`
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">\${weight}</figcaption>
        \${render({
      ...defaultArgs,
      weight,
      label: \`Weight \${weight}\`
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;">\${cards}</div>\`;
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'BackgroundCompare',
  render: () => \`
    <div style="display:flex;gap:24px;padding:16px;">
      <div style="padding:16px;background:var(--color-bg-primary,#fff);">
        \${render({
    ...defaultArgs,
    background: 'light',
    label: 'Light background'
  })}
      </div>
      <div style="padding:16px;background:var(--color-bg-inverse-strong,#2f303c);">
        \${render({
    ...defaultArgs,
    background: 'dark',
    label: 'Dark background'
  })}
      </div>
    </div>\`
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'IconTreatments',
  render: () => \`
    <div style="display:flex;flex-direction:column;gap:16px;padding:16px;">
      \${render({
    ...defaultArgs,
    iconTreatment: 'external',
    label: 'External link',
    target: '_blank'
  })}
      \${render({
    ...defaultArgs,
    iconTreatment: 'inline',
    iconName: 'arrows-navigation/simple-arrow-forward',
    iconPosition: 'trailing',
    label: 'Continue'
  })}
      \${render({
    ...defaultArgs,
    iconTreatment: 'inline',
    iconName: 'arrows-navigation/simple-arrow-back',
    iconPosition: 'leading',
    label: 'Back'
  })}
      \${render({
    ...defaultArgs,
    disabled: true,
    label: 'Disabled link'
  })}
    </div>\`
}`,...C.parameters?.docs?.source}}},w=[`Demo`,`SizeLadder`,`WeightCompare`,`BackgroundCompare`,`IconTreatments`]})))()}T();export{S as BackgroundCompare,y as Demo,C as IconTreatments,b as SizeLadder,x as WeightCompare,w as __namedExportsOrder,v as default};