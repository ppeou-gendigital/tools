import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Lt as t,Q as n,Rt as r,Z as i,_ as a,n as o,t as s,v as c}from"./pretty-source-C_TZ5wEY.js";import"./icon-D6wgK3Ul.js";import{n as l,r as u,t as d}from"./figma-links-B0HkTJ7d.js";import"./menu-list-D7nEnhjo.js";function f(e={}){return{type:e.type||`row`,size:e.size||`large`,text:e.text??`Menu item`,selected:!!e.selected,leftIcon:!!e.leftIcon,rightIcon:!!e.rightIcon,loadingIcon:!!e.loadingIcon,showRightBorder:!!e.showRightBorder,showDividerAbove:!!e.showDividerAbove,edgePadding:e.edgePadding!==!1,disabled:!!e.disabled,href:e.href||``,leftIconName:e.leftIconName||``,rightIconName:e.rightIconName||``,loadingIconName:e.loadingIconName||``,selectionMode:e.selectionMode||`choice`,role:e.role||`menuitem`,className:e.className||``}}function p(e){return h(f(e))}function m(e,t=`menu`){return`<ul class="sbd-menu-list-demo" role="${t}" style="list-style:none;margin:0;padding:0;max-inline-size:280px;background:var(--color-bg-default);">${e}</ul>`}var h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{n(),o(),u(),a(),t(),h=i.default.compile(r),g=[`row`,`divider`,`caption`],_=[`large`,`small`],v=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=4298-1925&m=dev`,y={title:`Molecules/Menu list`,tags:[`autodocs`],parameters:{docs:{description:{component:`Atomic menu row primitive (Row / Divider / Caption). [Pattern / MenuList](${v}). See \`spec.md\`.`}},design:d(`1396:5517`)},argTypes:{type:{control:{type:`inline-radio`},options:g,name:`Type`},size:{control:{type:`inline-radio`},options:_,name:`Size`},text:{control:`text`,name:`Text`},selected:{control:`boolean`,name:`Selected`},leftIcon:{control:`boolean`,name:`Left icon`},rightIcon:{control:`boolean`,name:`Right icon`},loadingIcon:{control:`boolean`,name:`Loading icon`},showRightBorder:{control:`boolean`,name:`Show right border`},showDividerAbove:{control:`boolean`,name:`Show divider above`},edgePadding:{control:`boolean`,name:`Edge padding`},disabled:{control:`boolean`,name:`Disabled`}},args:{type:`row`,size:`large`,text:`Menu item`,selected:!1,leftIcon:!0,rightIcon:!1,loadingIcon:!1,showRightBorder:!1,showDividerAbove:!1,edgePadding:!0,disabled:!1}},b={name:`Demo`,render:e=>m(p(e)),parameters:s(m(p({})),{unit:`menu-list`,scss:c})},x={name:`AllStyles`,render:()=>{let e=[{label:`Row — default`,args:{type:`row`,text:`Menu item`,leftIcon:!0}},{label:`Row — selected`,args:{type:`row`,text:`Menu item`,leftIcon:!0,selected:!0}},{label:`Row — right icon`,args:{type:`row`,text:`Menu item`,rightIcon:!0}},{label:`Row — loading`,args:{type:`row`,text:`Menu item`,loadingIcon:!0}},{label:`Row — small`,args:{type:`row`,size:`small`,text:`Menu item`,leftIcon:!0}},{label:`Caption`,args:{type:`caption`,text:`Account`}},{label:`Divider`,args:{type:`divider`}},{label:`Right border`,args:{type:`row`,text:`Menu item`,showRightBorder:!0}}].map(({label:e,args:t})=>`
        <div class="l-col l-col--sm--6 l-col--md--4 l-col--lg--3 sbd-doc__card" style="padding:16px;gap:12px;">
          <div class="sbd-doc__card-canvas">${m(p(t))}</div>
          <p class="sbd-doc__card-label">${e}</p>
        </div>`).join(``);return`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma">${l(`1396:5517`,`Menu list`)}</p>
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