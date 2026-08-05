import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{F as t,I as n,Q as r,Z as i,n as a,nn as o,t as s,tn as c}from"./pretty-source-CA3IhMc4.js";import"./icon-D6wgK3Ul.js";import{r as l,t as u}from"./figma-links-B0HkTJ7d.js";import"./checkbox-Cy2_W4xa.js";import"./content-list-GWcfKIhA.js";import"./switch-CDuQsX3O.js";import"./radio-CO5cRz9t.js";function d(e){return Array.isArray(e)?e.map(e=>({...e,childrenListType:e.childrenListType||`unordered`,children:Array.isArray(e.children)?d(e.children):void 0})):_}function f(e){return p({listType:e.listType||`unordered`,marker:e.marker||`bullet`,iconName:e.iconName||`status/simple-checkmark-small`,surfaced:!!e.surfaced,items:d(e.items),className:e.className||``})}var p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{r(),a(),l(),n(),o(),p=i.default.compile(c),m=[`unordered`,`ordered`,`nested`],h=[`bullet`,`icon`],g=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3483-3503&m=dev`,_=[{text:`List item body text`},{text:`List item body text`},{text:`List item body text`},{text:`List item body text`}],v={title:`Patterns/Content list`,tags:[`autodocs`],parameters:{docs:{description:{component:`Semantic list pattern (unordered / ordered / nested) with bullet, icon-marker, and Surfaced treatments. Item rows may compose Switch, Checkbox, or Radio. [Web-ODS Shared Library : Pattern / ContentList](${g}). See \`spec.md\`.`}},design:u(`3483:3503`)},argTypes:{listType:{control:{type:`inline-radio`},options:m,name:`listType`},marker:{control:{type:`inline-radio`},options:h,name:`marker`},iconName:{control:`text`,name:`iconName`},surfaced:{control:`boolean`,name:`surfaced`},items:{control:`object`,name:`items`},className:{control:`text`,name:`className`}},args:{listType:`unordered`,marker:`bullet`,iconName:`status/simple-checkmark-small`,surfaced:!1,items:_,className:``}},y={name:`Demo`,render:e=>f(e),parameters:s(f({listType:`unordered`,marker:`bullet`,surfaced:!1,items:_}),{unit:`content-list`,scss:t})},b={name:`UnorderedDefault`,render:()=>f({listType:`unordered`,marker:`bullet`,surfaced:!1,items:_})},x={name:`UnorderedIconMarker`,render:()=>f({listType:`unordered`,marker:`icon`,iconName:`status/simple-checkmark-small`,surfaced:!1,items:_})},S={name:`UnorderedSurfaced`,render:()=>f({listType:`unordered`,marker:`bullet`,surfaced:!0,items:_})},C={name:`OrderedDefault`,render:()=>f({listType:`ordered`,marker:`bullet`,surfaced:!1,items:_})},w={name:`OrderedSurfaced`,render:()=>f({listType:`ordered`,marker:`bullet`,surfaced:!0,items:_})},T={name:`NestedUlInUl`,render:()=>f({listType:`nested`,marker:`bullet`,surfaced:!1,items:[{text:`List item body text`},{text:`List item body text`},{text:`List item body text`,childrenListType:`unordered`,children:[{text:`Nested list item`},{text:`Nested list item`}]},{text:`List item body text`}]})},E={name:`NestedOlInOl`,render:()=>f({listType:`ordered`,marker:`bullet`,surfaced:!1,items:[{text:`List item body text`},{text:`List item body text`},{text:`List item body text`,childrenListType:`ordered`,children:[{text:`Nested list item`},{text:`Nested list item`}]},{text:`List item body text`}]})},D={name:`ControlItems`,render:()=>f({listType:`unordered`,marker:`bullet`,surfaced:!1,items:[{text:`List item body text`,type:`switch`,checked:!1},{text:`List item body text`,type:`checkbox`,checked:!1},{text:`List item body text`,type:`radio`,checked:!1,name:`content-list-radio-demo`}]})},O={name:`AllStyles`,render:()=>{let e=[[`Unordered · Default`,{listType:`unordered`,marker:`bullet`}],[`Unordered · Icon marker`,{listType:`unordered`,marker:`icon`}],[`Unordered · Surfaced`,{listType:`unordered`,marker:`bullet`,surfaced:!0}],[`Ordered · Default`,{listType:`ordered`}],[`Ordered · Surfaced`,{listType:`ordered`,surfaced:!0}]].map(([e,t])=>`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">${e}</p>
          <div class="sbd-doc__stack-item-canvas">${f({...t,items:_})}</div>
        </div>`).join(`
`);return`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma"><a class="sbd-doc__figma-link" href="${g}">Pattern / ContentList — 3483:3503 ↗</a></p>
        <section>
          <h2 class="sbd-doc__section-title">List treatments</h2>
          <div class="sbd-doc__stack">${e}</div>
        </section>
      </div>`}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render({
    listType: 'unordered',
    marker: 'bullet',
    surfaced: false,
    items: DEFAULT_ITEMS
  }), {
    unit: 'content-list',
    scss: scssSource
  })
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'UnorderedDefault',
  render: () => render({
    listType: 'unordered',
    marker: 'bullet',
    surfaced: false,
    items: DEFAULT_ITEMS
  })
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'UnorderedIconMarker',
  render: () => render({
    listType: 'unordered',
    marker: 'icon',
    iconName: 'status/simple-checkmark-small',
    surfaced: false,
    items: DEFAULT_ITEMS
  })
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'UnorderedSurfaced',
  render: () => render({
    listType: 'unordered',
    marker: 'bullet',
    surfaced: true,
    items: DEFAULT_ITEMS
  })
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'OrderedDefault',
  render: () => render({
    listType: 'ordered',
    marker: 'bullet',
    surfaced: false,
    items: DEFAULT_ITEMS
  })
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'OrderedSurfaced',
  render: () => render({
    listType: 'ordered',
    marker: 'bullet',
    surfaced: true,
    items: DEFAULT_ITEMS
  })
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: 'NestedUlInUl',
  render: () => render({
    listType: 'nested',
    marker: 'bullet',
    surfaced: false,
    items: [{
      text: 'List item body text'
    }, {
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
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: 'NestedOlInOl',
  render: () => render({
    listType: 'ordered',
    marker: 'bullet',
    surfaced: false,
    items: [{
      text: 'List item body text'
    }, {
      text: 'List item body text'
    }, {
      text: 'List item body text',
      childrenListType: 'ordered',
      children: [{
        text: 'Nested list item'
      }, {
        text: 'Nested list item'
      }]
    }, {
      text: 'List item body text'
    }]
  })
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  name: 'ControlItems',
  render: () => render({
    listType: 'unordered',
    marker: 'bullet',
    surfaced: false,
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
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => {
    const cells = [['Unordered · Default', {
      listType: 'unordered',
      marker: 'bullet'
    }], ['Unordered · Icon marker', {
      listType: 'unordered',
      marker: 'icon'
    }], ['Unordered · Surfaced', {
      listType: 'unordered',
      marker: 'bullet',
      surfaced: true
    }], ['Ordered · Default', {
      listType: 'ordered'
    }], ['Ordered · Surfaced', {
      listType: 'ordered',
      surfaced: true
    }]].map(([label, opts]) => \`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">\${label}</p>
          <div class="sbd-doc__stack-item-canvas">\${render({
      ...opts,
      items: DEFAULT_ITEMS
    })}</div>
        </div>\`).join('\\n');
    return \`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma"><a class="sbd-doc__figma-link" href="\${FIGMA_URL}">Pattern / ContentList — 3483:3503 ↗</a></p>
        <section>
          <h2 class="sbd-doc__section-title">List treatments</h2>
          <div class="sbd-doc__stack">\${cells}</div>
        </section>
      </div>\`;
  }
}`,...O.parameters?.docs?.source}}},k=[`Demo`,`UnorderedDefault`,`UnorderedIconMarker`,`UnorderedSurfaced`,`OrderedDefault`,`OrderedSurfaced`,`NestedUlInUl`,`NestedOlInOl`,`ControlItems`,`AllStyles`]})))()}A();export{O as AllStyles,D as ControlItems,y as Demo,E as NestedOlInOl,T as NestedUlInUl,C as OrderedDefault,w as OrderedSurfaced,b as UnorderedDefault,x as UnorderedIconMarker,S as UnorderedSurfaced,k as __namedExportsOrder,v as default};