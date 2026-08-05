import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,lt as n,n as r,r as i,t as a,ut as o}from"./pretty-source-CS7MQ53Z.js";var s;function c(){return(c=e((()=>{s=`/**
 * Patterns/Breadcrumb — .c-breadcrumb
 * Spec Frame 4560:48 / visual set 1260:8373.
 *
 * Gap: --space-3 (8px). Truncate max: --bc-truncate-max (16ch).
 * SM (< 768): dual-list hosts swap to compact trail (force collapsed).
 */

.c-breadcrumb {
  --bc-truncate-max: 16ch;

  display: inline-flex;
  padding-block: var(--space-1);
  padding-inline: var(--space-2);
  color: var(--color-disabled-text);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
}

.c-breadcrumb__list {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Dual list: compact hidden on MD+; SM swaps (Spec force-collapsed). */
.c-breadcrumb--dual .c-breadcrumb__list--collapsed {
  display: none;
}

@media (max-width: 767px) {
  .c-breadcrumb--dual .c-breadcrumb__list--expanded {
    display: none;
  }

  .c-breadcrumb--dual .c-breadcrumb__list--collapsed {
    display: inline-flex;
  }
}

.c-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  min-block-size: 24px;
}

.c-breadcrumb__item--separator {
  color: var(--color-disabled-text);
}

[dir='rtl'] .c-breadcrumb__chevron {
  display: inline-flex;
  transform: scaleX(-1);
}

.c-breadcrumb__current {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
}

.c-breadcrumb__home {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 24px;
  min-block-size: 24px;
  padding: 0;
  color: var(--color-text-brand);
  text-decoration: none;
  border-radius: var(--border-radius-control);

  &:hover {
    color: var(--color-text-primary);
  }

  &:active {
    opacity: 0.85;
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: var(--space-1);
  }
}

.c-breadcrumb__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  inline-size: 20px;
  block-size: 20px;
  padding: var(--space-1);
  color: var(--color-text-primary);
  border-radius: var(--border-radius-control);
  cursor: help;
}

.c-breadcrumb__item--truncate .c-text-link__label,
.c-breadcrumb__item--truncate .c-breadcrumb__current {
  display: inline-block;
  max-inline-size: var(--bc-truncate-max);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
`})))()}function l(e,t={}){let n=[];if(!Array.isArray(e)||e.length===0)return n;let r=t.firstAsIcon!==!1,i=t.collapsed===!0,a=t.showCurrentPage!==!1,o=t.hiddenPagesLabel||d,s=e.length-1,c=i&&e.length>=3,l=c?1:-1,u=c?s-1:-1,f=c?e.slice(l,u+1).map(e=>e&&e.label||``).filter(Boolean).join(`, `):``;for(let t=0;t<=s;t+=1){let i=e[t]||{},d=t===s,p=t===0;c&&t>=l&&t<=u||(p||n.push({kind:`separator`}),c&&d&&(n.push({kind:`ellipsis`,hiddenLabels:f,hiddenPagesLabel:o}),n.push({kind:`separator`})),d?a&&n.push({kind:`current`,label:i.label??`Current page`,truncate:i.truncate===!0}):p&&r?n.push({kind:`link`,label:i.label??``,href:i.href??`#`,homeIconOnly:!0,ariaLabel:i.ariaLabel||i.label||`Home`,truncate:i.truncate===!0}):n.push({kind:`link`,label:i.label??``,href:i.href??`#`,truncate:i.truncate===!0}))}return n}function u(e,t,n){let r={...p,...e},i=n??r.items??f,a={firstAsIcon:r.firstAsIcon!==!1,showCurrentPage:r.showCurrentPage!==!1,hiddenPagesLabel:r.hiddenPagesLabel},o=l(i,{...a,collapsed:!1}),s=l(i,{...a,collapsed:!0}),c=r.collapsed===!0;return t({firstAsIcon:a.firstAsIcon,collapsed:c,showCurrentPage:a.showCurrentPage,ariaLabel:r.ariaLabel,hiddenPagesLabel:r.hiddenPagesLabel,iconType:r.iconType,items:c?s:o,itemsCollapsed:c?null:s,dualList:!c&&i.length>=3})}var d,f,p;function m(){return(m=e((()=>{d=`Hidden pages`,f=[{label:`Home`,href:`/`,ariaLabel:`Home`},{label:`Products`,href:`/products`},{label:`Software`,href:`/products/software`},{label:`Antivirus`}],p={items:f,firstAsIcon:!0,collapsed:!1,showCurrentPage:!0,ariaLabel:`Breadcrumb`,hiddenPagesLabel:d,iconType:`objects/simple-home`}})))()}var h,g,_,v,y,b;function x(){return(x=e((()=>{t(),r(),c(),o(),m(),h=i.default.compile(n),g=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4560-48&m=dev`,_={title:`Patterns/Breadcrumb`,tags:[`autodocs`],render:e=>u(e,h),args:p,argTypes:{items:{control:`object`,name:`Items`},firstAsIcon:{control:`boolean`,name:`First as icon`},collapsed:{control:`boolean`,name:`Collapsed`},showCurrentPage:{control:`boolean`,name:`Show current page`},ariaLabel:{control:`text`,name:`Accessible name`}},parameters:{docs:{description:{component:`Breadcrumb inherited from core (Spec Frame 4560:48). [Figma](${g}).`}},contentWidth:`fluid`}},v={name:`Demo`,parameters:a(u(p,h),{unit:`breadcrumb`,scss:s})},y={name:`CollapsedCompare`,render:()=>`
    <div style="display:flex;flex-direction:column;gap:24px;padding:16px;">
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">collapsed=false</figcaption>
        ${u({collapsed:!1},h)}
      </figure>
      <figure style="margin:0;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">collapsed=true</figcaption>
        ${u({collapsed:!0},h)}
      </figure>
    </div>`},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  parameters: htmlStoryParameters(compileBreadcrumbArgs(defaultBreadcrumbArgs, compiled), {
    unit: 'breadcrumb',
    scss: scssSource
  })
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">collapsed=true</figcaption>
        \${compileBreadcrumbArgs({
    collapsed: true
  }, compiled)}
      </figure>
    </div>\`
}`,...y.parameters?.docs?.source}}},b=[`Demo`,`CollapsedCompare`]})))()}x();export{y as CollapsedCompare,v as Demo,b as __namedExportsOrder,_ as default};