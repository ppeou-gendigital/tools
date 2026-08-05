import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{$t as t,B as n,Jt as r,Q as i,Qt as a,Z as o,Zt as s,en as c,n as l,qt as u,t as d,z as f}from"./pretty-source-C_TZ5wEY.js";import"./button-DPO6711n.js";import"./content-title-BvltFXQ5.js";import"./content-body-BGuR5ei1.js";import"./text-link-DG6iA3DR.js";import"./icon-D6wgK3Ul.js";import{r as p,t as m}from"./figma-links-B0HkTJ7d.js";import"./content-list-GWcfKIhA.js";function h(e){let t=!!e.showLink,n=!t&&!!e.showButton;return{title:e.title||`Section title`,titleStyle:e.titleStyle||`h3`,titleTag:e.titleTag||`h2`,bodyText:e.bodyText??`Optional supporting copy sits under the title row at Body 3xl.`,showBody:e.showBody!==!1,showLink:t,linkLabel:e.linkLabel||`View all`,linkHref:e.linkHref||`#`,showButton:n,buttonIcon:e.buttonIcon||`arrows-navigation/simple-more`,buttonAccessibleLabel:e.buttonAccessibleLabel||`More options`,slotHtml:e.slotHtml??x,className:e.className||``}}function g(e){return _(h(e))}var _,v,y,b,x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{i(),l(),p(),n(),r(),c(),a(),_=o.default.compile(u),v=o.default.compile(t),y=o.default.compile(s),b=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3483-3418&m=dev`,x=[y({text:`Supporting paragraph in the content slot.`,style:`body-base`,weight:`base`}),v({listType:`unordered`,marker:`bullet`,surfaced:!1,items:[{text:`List item body text`},{text:`List item body text`},{text:`List item body text`}],className:``})].join(`
`),S={title:`Patterns/Content block`,tags:[`autodocs`],parameters:{docs:{description:{component:`Section container pairing Content title with optional Text link / Button, Body 3xl lead, and a flexible content slot. [Web-ODS Shared Library : Pattern / ContentBlock](${b}). See \`spec.md\`.`}},design:m(`3483:3418`)},argTypes:{title:{control:`text`,name:`title`},titleStyle:{control:{type:`inline-radio`},options:[`h3`,`h0`],name:`titleStyle`},titleTag:{control:{type:`select`},options:[`h1`,`h2`,`h3`,`h4`,`h5`,`h6`],name:`titleTag`},bodyText:{control:`text`,name:`bodyText`},showBody:{control:`boolean`,name:`showBody`},showLink:{control:`boolean`,name:`showLink`},linkLabel:{control:`text`,name:`linkLabel`},linkHref:{control:`text`,name:`linkHref`},showButton:{control:`boolean`,name:`showButton`},buttonIcon:{control:`text`,name:`buttonIcon`},buttonAccessibleLabel:{control:`text`,name:`buttonAccessibleLabel`},slotHtml:{control:`text`,name:`slotHtml`},className:{control:`text`,name:`className`}},args:{title:`Section title`,titleStyle:`h3`,titleTag:`h2`,bodyText:`Optional supporting copy sits under the title row at Body 3xl.`,showBody:!0,showLink:!1,linkLabel:`View all`,linkHref:`#`,showButton:!1,buttonIcon:`arrows-navigation/simple-more`,buttonAccessibleLabel:`More options`,slotHtml:x,className:``}},C={name:`Demo`,render:e=>g(e),parameters:d(g({}),{unit:`content-block`,scss:f})},w={name:`WithLink`,render:()=>g({title:`Section title`,showLink:!0,linkLabel:`View all`})},T={name:`WithButton`,render:()=>g({title:`Section title`,showButton:!0})},E={name:`DisplayTitle`,render:()=>g({title:`Display section title`,titleStyle:`h0`,showLink:!1,showButton:!1})},D={name:`TitleOnly`,render:()=>g({title:`Section title`,showBody:!1,slotHtml:``})},O={name:`AllStyles`,render:()=>{let e=[[`Default`,{}],[`With link`,{showLink:!0}],[`With button`,{showButton:!0}],[`H0 title`,{titleStyle:`h0`,title:`Display section title`}]].map(([e,t])=>`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">${e}</p>
          <div class="sbd-doc__stack-item-canvas">${g(t)}</div>
        </div>`).join(`
`);return`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma"><a class="sbd-doc__figma-link" href="${b}">Pattern / ContentBlock — 3483:3418 ↗</a></p>
        <section>
          <h2 class="sbd-doc__section-title">Content block expressions</h2>
          <div class="sbd-doc__stack">${e}</div>
        </section>
      </div>`}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render({}), {
    unit: 'content-block',
    scss: scssSource
  })
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'WithLink',
  render: () => render({
    title: 'Section title',
    showLink: true,
    linkLabel: 'View all'
  })
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: 'WithButton',
  render: () => render({
    title: 'Section title',
    showButton: true
  })
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  name: 'DisplayTitle',
  render: () => render({
    title: 'Display section title',
    titleStyle: 'h0',
    showLink: false,
    showButton: false
  })
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  name: 'TitleOnly',
  render: () => render({
    title: 'Section title',
    showBody: false,
    slotHtml: ''
  })
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => {
    const cells = [['Default', {}], ['With link', {
      showLink: true
    }], ['With button', {
      showButton: true
    }], ['H0 title', {
      titleStyle: 'h0',
      title: 'Display section title'
    }]].map(([label, opts]) => \`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">\${label}</p>
          <div class="sbd-doc__stack-item-canvas">\${render(opts)}</div>
        </div>\`).join('\\n');
    return \`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma"><a class="sbd-doc__figma-link" href="\${FIGMA_URL}">Pattern / ContentBlock — 3483:3418 ↗</a></p>
        <section>
          <h2 class="sbd-doc__section-title">Content block expressions</h2>
          <div class="sbd-doc__stack">\${cells}</div>
        </section>
      </div>\`;
  }
}`,...O.parameters?.docs?.source}}},k=[`Demo`,`WithLink`,`WithButton`,`DisplayTitle`,`TitleOnly`,`AllStyles`]})))()}A();export{O as AllStyles,C as Demo,E as DisplayTitle,D as TitleOnly,T as WithButton,w as WithLink,k as __namedExportsOrder,S as default};