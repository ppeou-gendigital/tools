import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{ct as t,i as n,n as r,r as i,st as a,t as o}from"./pretty-source-CS7MQ53Z.js";import"./icon-D6wgK3Ul.js";import"./checkbox-Cy2_W4xa.js";import"./content-list-GWcfKIhA.js";import"./switch-CDuQsX3O.js";import"./radio-CO5cRz9t.js";var s;function c(){return(c=e((()=>{s=`/**
 * Patterns/Content list — core (.c-content-list).
 * Figma: Web-ODS Shared Library Pattern / ContentList 3483:3503.
 *
 * Axes → BEM:
 *   listType → .c-content-list--unordered | --ordered | --nested
 *   marker   → .c-content-list--marker-bullet | --marker-icon
 *   surfaced → .c-content-list--surfaced
 */

.c-content-list {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-block: 0;
  margin-inline: 0;
  padding-block: 0;
  padding-inline: 0;
  inline-size: 100%;
  max-inline-size: 100%;
  list-style: none;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-regular);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  color: var(--color-text-primary);
}

.c-content-list--surfaced {
  padding-block: var(--space-7);
  padding-inline: var(--space-7);
  background-color: var(--color-bg-subtle);
  border-radius: var(--border-radius-l);
}

.c-content-list__item {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-3);
  margin-block: 0;
  margin-inline: 0;
  padding-block: 0;
  padding-inline: 0;
}

.c-content-list__marker {
  flex-shrink: 0;
  box-sizing: border-box;
}

.c-content-list__marker--text {
  min-inline-size: 1em;
  color: var(--color-text-primary);
}

.c-content-list__marker--icon {
  inline-size: 20px;
  block-size: 20px;
  color: var(--color-text-primary);
}

.c-content-list__body {
  flex: 1 1 0;
  min-inline-size: 0;
  overflow-wrap: break-word;
}

.c-content-list__child {
  flex: 1 0 100%;
  margin-block-start: 0;
  padding-inline-start: var(--space-7);
}

.c-content-list__item--switch,
.c-content-list__item--checkbox,
.c-content-list__item--radio {
  align-items: center;
}

.c-content-list__item--switch .c-switch,
.c-content-list__item--checkbox .c-checkbox,
.c-content-list__item--radio .c-radio {
  flex: 1 1 auto;
  min-inline-size: 0;
}
`})))()}function l(e){return Array.isArray(e)?e.map(e=>({...e,childrenListType:e.childrenListType||`unordered`,children:Array.isArray(e.children)?l(e.children):void 0})):h}function u(e){return d({listType:e.listType||`unordered`,marker:e.marker||`bullet`,iconName:e.iconName||`status/simple-checkmark-small`,surfaced:!!e.surfaced,items:l(e.items),className:e.className||``})}var d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{n(),r(),c(),t(),d=i.default.compile(a),f=[`unordered`,`ordered`,`nested`],p=[`bullet`,`icon`],m=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3483-3503&m=dev`,h=[{text:`List item body text`},{text:`List item body text`},{text:`List item body text`},{text:`List item body text`}],g={title:`Patterns/Content list`,tags:[`autodocs`],parameters:{docs:{description:{component:`Semantic list pattern inherited from core. [Figma](${m}).`}}},argTypes:{listType:{control:{type:`inline-radio`},options:f,name:`listType`},marker:{control:{type:`inline-radio`},options:p,name:`marker`},iconName:{control:`text`,name:`iconName`},surfaced:{control:`boolean`,name:`surfaced`},items:{control:`object`,name:`items`},className:{control:`text`,name:`className`}},args:{listType:`unordered`,marker:`bullet`,iconName:`status/simple-checkmark-small`,surfaced:!1,items:h,className:``}},_={name:`Demo`,render:e=>u(e),parameters:o(u({}),{unit:`content-list`,scss:s})},v={name:`UnorderedIconMarker`,render:()=>u({listType:`unordered`,marker:`icon`,items:h})},y={name:`OrderedDefault`,render:()=>u({listType:`ordered`,items:h})},b={name:`NestedUlInUl`,render:()=>u({listType:`nested`,items:[{text:`List item body text`},{text:`List item body text`,childrenListType:`unordered`,children:[{text:`Nested list item`},{text:`Nested list item`}]},{text:`List item body text`}]})},x={name:`ControlItems`,render:()=>u({items:[{text:`List item body text`,type:`switch`,checked:!1},{text:`List item body text`,type:`checkbox`,checked:!1},{text:`List item body text`,type:`radio`,checked:!1,name:`content-list-radio-demo`}]})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render({}), {
    unit: 'content-list',
    scss: scssSource
  })
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'UnorderedIconMarker',
  render: () => render({
    listType: 'unordered',
    marker: 'icon',
    items: DEFAULT_ITEMS
  })
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'OrderedDefault',
  render: () => render({
    listType: 'ordered',
    items: DEFAULT_ITEMS
  })
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'NestedUlInUl',
  render: () => render({
    listType: 'nested',
    items: [{
      text: 'List item body text'
    }, {
      text: 'List item body text',
      childrenListType: 'unordered',
      children: [{
        text: 'Nested list item'
      }, {
        text: 'Nested list item'
      }]
    }, {
      text: 'List item body text'
    }]
  })
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'ControlItems',
  render: () => render({
    items: [{
      text: 'List item body text',
      type: 'switch',
      checked: false
    }, {
      text: 'List item body text',
      type: 'checkbox',
      checked: false
    }, {
      text: 'List item body text',
      type: 'radio',
      checked: false,
      name: 'content-list-radio-demo'
    }]
  })
}`,...x.parameters?.docs?.source}}},S=[`Demo`,`UnorderedIconMarker`,`OrderedDefault`,`NestedUlInUl`,`ControlItems`]})))()}C();export{x as ControlItems,_ as Demo,b as NestedUlInUl,y as OrderedDefault,v as UnorderedIconMarker,S as __namedExportsOrder,g as default};