import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,K as n,i as r,n as i,r as a,t as o}from"./pretty-source-CIqFBFpl.js";import"./icon-D6wgK3Ul.js";import{n as s,r as c,t as l}from"./figma-links-B0HkTJ7d.js";import"./menu-list-D7nEnhjo.js";var u;function d(){return(d=e((()=>{u=`/**
 * Molecules/Menu list — core (.c-menu-list).
 * Figma: MenuList 1396:5517 / Spec 4646:265.
 *
 * Type → --row | --divider | --caption
 * Size → --size-large (40px) | --size-small (38px)
 * Hover → :hover on .c-menu-list__control (Figma Hover axis is design-only)
 * Selected → .is-selected
 */

.c-menu-list {
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  margin-block: 0;
  margin-inline: 0;
  padding-block: 0;
  padding-inline: 0;
  list-style: none;
  inline-size: 100%;
  position: relative;
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
}

.c-menu-list--size-large {
  min-block-size: 40px;
}

.c-menu-list--size-small {
  min-block-size: 38px;
}

.c-menu-list--edge-pad .c-menu-list__control,
.c-menu-list--edge-pad .c-menu-list__caption {
  padding-inline: var(--space-4);
}

.c-menu-list--divider-above::before {
  content: '';
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  border-block-start: var(--border-width-xs, 1px) solid var(--color-border-subtle);
}

.c-menu-list--right-border::after {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0;
  inline-size: var(--border-width-xs, 1px);
  background-color: var(--color-border-strong-alt);
}

/* —— Divider —— */
.c-menu-list--divider {
  min-block-size: auto;
  align-items: center;
  padding-block: var(--space-2);
  pointer-events: none;
}

.c-menu-list__rule {
  box-sizing: border-box;
  margin-block: 0;
  margin-inline: 0;
  border: 0;
  border-block-start: var(--border-width-xs, 1px) solid var(--color-border-subtle);
  inline-size: 100%;
}

/* —— Caption —— */
.c-menu-list--caption {
  pointer-events: none;
}

.c-menu-list__caption {
  display: flex;
  align-items: center;
  inline-size: 100%;
  padding-block: var(--space-3);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  color: var(--color-neutral-60);
}

/* —— Row —— */
.c-menu-list__control {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  inline-size: 100%;
  min-block-size: inherit;
  margin: 0;
  padding-block: var(--space-3);
  padding-inline: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: start;
  text-decoration: none;
  cursor: pointer;
  appearance: none;
}

.c-menu-list__control:hover {
  background-color: var(--color-bg-subtle);
}

.c-menu-list__control:focus-visible {
  outline: var(--border-width-s, 2px) solid var(--color-border-focus);
  outline-offset: 2px;
}

.c-menu-list.is-selected .c-menu-list__control {
  background-color: var(--color-bg-muted);
}

.c-menu-list.is-disabled .c-menu-list__control,
.c-menu-list.is-disabled .c-menu-list__control:hover {
  color: var(--color-text-disabled);
  background-color: transparent;
  cursor: not-allowed;
}

.c-menu-list__label {
  flex: 1 1 auto;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-size-body-base);
  font-weight: var(--font-weight-regular);
  line-height: var(--lineheight-body-base);
  letter-spacing: var(--letterspacing-body-base);
}

.c-menu-list--size-small .c-menu-list__label {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
}

.c-menu-list__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

.c-menu-list--size-large .c-menu-list__icon {
  inline-size: 24px;
  block-size: 24px;
}

.c-menu-list--size-small .c-menu-list__icon {
  inline-size: 16px;
  block-size: 16px;
}

.c-menu-list__icon--loading {
  animation: c-menu-list-spin 0.8s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .c-menu-list__icon--loading {
    animation: none;
  }
}

@keyframes c-menu-list-spin {
  to {
    transform: rotate(360deg);
  }
}
`})))()}function f(e={}){return{type:e.type||`row`,size:e.size||`large`,text:e.text??`Menu item`,selected:!!e.selected,leftIcon:!!e.leftIcon,rightIcon:!!e.rightIcon,loadingIcon:!!e.loadingIcon,showRightBorder:!!e.showRightBorder,showDividerAbove:!!e.showDividerAbove,edgePadding:e.edgePadding!==!1,disabled:!!e.disabled,href:e.href||``,leftIconName:e.leftIconName||``,rightIconName:e.rightIconName||``,loadingIconName:e.loadingIconName||``,selectionMode:e.selectionMode||`choice`,role:e.role||`menuitem`,className:e.className||``}}function p(e){return h(f(e))}function m(e,t=`menu`){return`<ul class="sbd-menu-list-demo" role="${t}" style="list-style:none;margin:0;padding:0;max-inline-size:280px;background:var(--color-bg-default);">${e}</ul>`}var h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{r(),i(),c(),d(),t(),h=a.default.compile(n),g=[`row`,`divider`,`caption`],_=[`large`,`small`],v=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4298-1925&m=dev`,y={title:`Molecules/Menu list`,tags:[`autodocs`],parameters:{docs:{description:{component:`Atomic menu row inherited from core. [Pattern / MenuList](${v}). See \`spec.md\`.`}},design:l(`1396:5517`)},argTypes:{type:{control:{type:`inline-radio`},options:g,name:`Type`},size:{control:{type:`inline-radio`},options:_,name:`Size`},text:{control:`text`,name:`Text`},selected:{control:`boolean`,name:`Selected`},leftIcon:{control:`boolean`,name:`Left icon`},rightIcon:{control:`boolean`,name:`Right icon`},loadingIcon:{control:`boolean`,name:`Loading icon`},showRightBorder:{control:`boolean`,name:`Show right border`},showDividerAbove:{control:`boolean`,name:`Show divider above`},edgePadding:{control:`boolean`,name:`Edge padding`},disabled:{control:`boolean`,name:`Disabled`}},args:{type:`row`,size:`large`,text:`Menu item`,selected:!1,leftIcon:!0,rightIcon:!1,loadingIcon:!1,showRightBorder:!1,showDividerAbove:!1,edgePadding:!0,disabled:!1}},b={name:`Demo`,render:e=>m(p(e)),parameters:o(m(p({})),{unit:`menu-list`,scss:u})},x={name:`AllStyles`,render:()=>{let e=[{label:`Row — default`,args:{type:`row`,text:`Menu item`,leftIcon:!0}},{label:`Row — selected`,args:{type:`row`,text:`Menu item`,leftIcon:!0,selected:!0}},{label:`Row — right icon`,args:{type:`row`,text:`Menu item`,rightIcon:!0}},{label:`Row — loading`,args:{type:`row`,text:`Menu item`,loadingIcon:!0}},{label:`Row — small`,args:{type:`row`,size:`small`,text:`Menu item`,leftIcon:!0}},{label:`Caption`,args:{type:`caption`,text:`Account`}},{label:`Divider`,args:{type:`divider`}},{label:`Right border`,args:{type:`row`,text:`Menu item`,showRightBorder:!0}}].map(({label:e,args:t})=>`
        <div class="l-col l-col--sm--6 l-col--md--4 l-col--lg--3 sbd-doc__card" style="padding:16px;gap:12px;">
          <div class="sbd-doc__card-canvas">${m(p(t))}</div>
          <p class="sbd-doc__card-label">${e}</p>
        </div>`).join(``);return`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma">${s(`1396:5517`,`Menu list`)}</p>
        <section class="sbd-doc__section">
          <h2 class="sbd-doc__section-title">Type × state × chrome</h2>
          <div class="l-row">${e}</div>
        </section>
      </div>`}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => wrapList(renderItem(args)),
  parameters: htmlStoryParameters(wrapList(renderItem({})), {
    unit: 'menu-list',
    scss: scssSource
  })
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => {
    const cards = [{
      label: 'Row — default',
      args: {
        type: 'row',
        text: 'Menu item',
        leftIcon: true
      }
    }, {
      label: 'Row — selected',
      args: {
        type: 'row',
        text: 'Menu item',
        leftIcon: true,
        selected: true
      }
    }, {
      label: 'Row — right icon',
      args: {
        type: 'row',
        text: 'Menu item',
        rightIcon: true
      }
    }, {
      label: 'Row — loading',
      args: {
        type: 'row',
        text: 'Menu item',
        loadingIcon: true
      }
    }, {
      label: 'Row — small',
      args: {
        type: 'row',
        size: 'small',
        text: 'Menu item',
        leftIcon: true
      }
    }, {
      label: 'Caption',
      args: {
        type: 'caption',
        text: 'Account'
      }
    }, {
      label: 'Divider',
      args: {
        type: 'divider'
      }
    }, {
      label: 'Right border',
      args: {
        type: 'row',
        text: 'Menu item',
        showRightBorder: true
      }
    }].map(({
      label,
      args
    }) => \`
        <div class="l-col l-col--sm--6 l-col--md--4 l-col--lg--3 sbd-doc__card" style="padding:16px;gap:12px;">
          <div class="sbd-doc__card-canvas">\${wrapList(renderItem(args))}</div>
          <p class="sbd-doc__card-label">\${label}</p>
        </div>\`).join('');
    return \`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma">\${figmaFrameLink('1396:5517', 'Menu list')}</p>
        <section class="sbd-doc__section">
          <h2 class="sbd-doc__section-title">Type × state × chrome</h2>
          <div class="l-row">\${cards}</div>
        </section>
      </div>\`;
  }
}`,...x.parameters?.docs?.source}}},S=[`Demo`,`AllStyles`]})))()}C();export{x as AllStyles,b as Demo,S as __namedExportsOrder,y as default};