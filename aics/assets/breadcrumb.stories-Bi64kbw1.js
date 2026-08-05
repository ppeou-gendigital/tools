import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,U as n,W as r,Z as i,in as a,n as o,rn as s,t as c}from"./pretty-source-CA3IhMc4.js";function l(e,t={}){let n=[];if(!Array.isArray(e)||e.length===0)return n;let r=t.firstAsIcon!==!1,i=t.collapsed===!0,a=t.showCurrentPage!==!1,o=t.hiddenPagesLabel||d,s=e.length-1,c=i&&e.length>=3,l=c?1:-1,u=c?s-1:-1,f=c?e.slice(l,u+1).map(e=>e&&e.label||``).filter(Boolean).join(`, `):``;for(let t=0;t<=s;t+=1){let i=e[t]||{},d=t===s,p=t===0;c&&t>=l&&t<=u||(p||n.push({kind:`separator`}),c&&d&&(n.push({kind:`ellipsis`,hiddenLabels:f,hiddenPagesLabel:o}),n.push({kind:`separator`})),d?a&&n.push({kind:`current`,label:i.label??`Current page`,truncate:i.truncate===!0}):p&&r?n.push({kind:`link`,label:i.label??``,href:i.href??`#`,homeIconOnly:!0,ariaLabel:i.ariaLabel||i.label||`Home`,truncate:i.truncate===!0}):n.push({kind:`link`,label:i.label??``,href:i.href??`#`,truncate:i.truncate===!0}))}return n}function u(e,t,n){let r={...p,...e},i=n??r.items??f,a={firstAsIcon:r.firstAsIcon!==!1,showCurrentPage:r.showCurrentPage!==!1,hiddenPagesLabel:r.hiddenPagesLabel},o=l(i,{...a,collapsed:!1}),s=l(i,{...a,collapsed:!0}),c=r.collapsed===!0;return t({firstAsIcon:a.firstAsIcon,collapsed:c,showCurrentPage:a.showCurrentPage,ariaLabel:r.ariaLabel,hiddenPagesLabel:r.hiddenPagesLabel,iconType:r.iconType,items:c?s:o,itemsCollapsed:c?null:s,dualList:!c&&i.length>=3})}var d,f,p;function m(){return(m=e((()=>{d=`Hidden pages`,f=[{label:`Home`,href:`/`,ariaLabel:`Home`},{label:`Products`,href:`/products`},{label:`Software`,href:`/products/software`},{label:`Antivirus`}],p={items:f,firstAsIcon:!0,collapsed:!1,showCurrentPage:!0,ariaLabel:`Breadcrumb`,hiddenPagesLabel:d,iconType:`objects/simple-home`}})))()}var h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{t(),o(),r(),a(),m(),h=i.default.compile(s),g=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4560-48&m=dev`,_=[{label:`Home`,href:`/`,ariaLabel:`Home`},{label:`Security Products Catalog`,href:`/products`,truncate:!0},{label:`Cloud Solutions Platform`,href:`/products/cloud`,truncate:!0},{label:`Antivirus & Threat Protection`,truncate:!0}],v={title:`Patterns/Breadcrumb`,tags:[`autodocs`],render:e=>u(e,h),args:p,argTypes:{items:{control:`object`,name:`Items`,description:"Trail `{ label, href?, truncate?, ariaLabel? }[]`. Last entry is current page unless showCurrentPage=false."},firstAsIcon:{control:`boolean`,name:`First as icon`,description:`Default true — first crumb is icon-only home.`},collapsed:{control:`boolean`,name:`Collapsed`,description:`first + … + last. SM dual-list also forces compact.`},showCurrentPage:{control:`boolean`,name:`Show current page`,description:`When false, omit the terminal aria-current crumb.`},ariaLabel:{control:`text`,name:`Accessible name`},hiddenPagesLabel:{control:`text`,name:`Hidden-pages label`},iconType:{control:`text`,name:`Home icon catalog key`}},parameters:{docs:{description:{component:`Semantic \`<nav><ol>\` wayfinding. Composes text-link + icon. Spec Frame [4560:48](${g}).`}},contentWidth:`fluid`}},y={name:`Demo`,parameters:c(u(p,h),{unit:`breadcrumb`,scss:n})},b={name:`CollapsedCompare`,render:()=>`
    <div style="display:flex;flex-direction:column;gap:24px;padding:16px;">
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">collapsed=false</figcaption>
        ${u({collapsed:!1},h)}
      </figure>
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">collapsed=true (first + … + last)</figcaption>
        ${u({collapsed:!0},h)}
      </figure>
    </div>`},x={name:`FirstAsIconCompare`,render:()=>`
    <div style="display:flex;flex-direction:column;gap:24px;padding:16px;">
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">firstAsIcon=true (default)</figcaption>
        ${u({firstAsIcon:!0,collapsed:!1},h)}
      </figure>
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">firstAsIcon=false</figcaption>
        ${u({firstAsIcon:!1,collapsed:!1},h)}
      </figure>
    </div>`},S={name:`TruncationDemo`,render:()=>u({items:_,firstAsIcon:!0,collapsed:!1},h,_)},C={name:`Placeholders`,render:()=>`
    <div style="display:flex;flex-direction:column;gap:24px;padding:16px;">
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">showCurrentPage=false</figcaption>
        ${u({showCurrentPage:!1,items:f},h)}
      </figure>
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">Two crumbs</figcaption>
        ${u({items:[{label:`Home`,href:`/`,ariaLabel:`Home`},{label:`Account`}]},h,[{label:`Home`,href:`/`,ariaLabel:`Home`},{label:`Account`}])}
      </figure>
    </div>`},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  parameters: htmlStoryParameters(compileBreadcrumbArgs(defaultBreadcrumbArgs, compiled), {
    unit: 'breadcrumb',
    scss: scssSource
  })
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'CollapsedCompare',
  render: () => \`
    <div style="display:flex;flex-direction:column;gap:24px;padding:16px;">
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">collapsed=false</figcaption>
        \${compileBreadcrumbArgs({
    collapsed: false
  }, compiled)}
      </figure>
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">collapsed=true (first + … + last)</figcaption>
        \${compileBreadcrumbArgs({
    collapsed: true
  }, compiled)}
      </figure>
    </div>\`
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'FirstAsIconCompare',
  render: () => \`
    <div style="display:flex;flex-direction:column;gap:24px;padding:16px;">
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">firstAsIcon=true (default)</figcaption>
        \${compileBreadcrumbArgs({
    firstAsIcon: true,
    collapsed: false
  }, compiled)}
      </figure>
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">firstAsIcon=false</figcaption>
        \${compileBreadcrumbArgs({
    firstAsIcon: false,
    collapsed: false
  }, compiled)}
      </figure>
    </div>\`
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'TruncationDemo',
  render: () => compileBreadcrumbArgs({
    items: LONG_ITEMS,
    firstAsIcon: true,
    collapsed: false
  }, compiled, LONG_ITEMS)
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'Placeholders',
  render: () => \`
    <div style="display:flex;flex-direction:column;gap:24px;padding:16px;">
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">showCurrentPage=false</figcaption>
        \${compileBreadcrumbArgs({
    showCurrentPage: false,
    items: defaultBreadcrumbItems
  }, compiled)}
      </figure>
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">Two crumbs</figcaption>
        \${compileBreadcrumbArgs({
    items: [{
      label: 'Home',
      href: '/',
      ariaLabel: 'Home'
    }, {
      label: 'Account'
    }]
  }, compiled, [{
    label: 'Home',
    href: '/',
    ariaLabel: 'Home'
  }, {
    label: 'Account'
  }])}
      </figure>
    </div>\`
}`,...C.parameters?.docs?.source}}},w=[`Demo`,`CollapsedCompare`,`FirstAsIconCompare`,`TruncationDemo`,`Placeholders`]})))()}T();export{b as CollapsedCompare,y as Demo,x as FirstAsIconCompare,C as Placeholders,S as TruncationDemo,w as __namedExportsOrder,v as default};