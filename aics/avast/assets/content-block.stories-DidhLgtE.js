import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{$ as t,at as n,et as r,i,it as a,n as o,ot as s,r as c,rt as l,t as u}from"./pretty-source-CvP1BtiP.js";import"./button-DPO6711n.js";import"./content-title-BvltFXQ5.js";import"./content-body-BGuR5ei1.js";import"./text-link-DG6iA3DR.js";import"./icon-D6wgK3Ul.js";import"./content-list-GWcfKIhA.js";var d;function f(){return(f=e((()=>{d=`/**
 * Patterns/Content block — core (.c-content-block).
 * Figma: Web-ODS Shared Library Pattern / ContentBlock 3483:3418.
 *
 * Flat white section container — padding --space-7, gap --space-3.
 * Composes Content title, Content body, Text link, Button.
 */

.c-content-block {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-block: 0;
  margin-inline: 0;
  padding-block: var(--space-7);
  padding-inline: var(--space-7);
  inline-size: 100%;
  max-inline-size: 100%;
  background-color: var(--color-bg-primary);
}

.c-content-block__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  inline-size: 100%;
}

.c-content-block__title {
  flex: 1 1 0;
  min-inline-size: 0;
}

.c-content-block__action {
  flex-shrink: 0;
  align-self: center;
}

.c-content-block__body {
  inline-size: 100%;
}

.c-content-block__slot {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  inline-size: 100%;
  min-block-size: 0;
}
`})))()}function p(e){let t=!!e.showLink,n=!t&&!!e.showButton;return{title:e.title||`Section title`,titleStyle:e.titleStyle||`h3`,titleTag:e.titleTag||`h2`,bodyText:e.bodyText??`Optional supporting copy sits under the title row at Body 3xl.`,showBody:e.showBody!==!1,showLink:t,linkLabel:e.linkLabel||`View all`,linkHref:e.linkHref||`#`,showButton:n,buttonIcon:e.buttonIcon||`arrows-navigation/simple-more`,buttonAccessibleLabel:e.buttonAccessibleLabel||`More options`,slotHtml:e.slotHtml??y,className:e.className||``}}function m(e){return h(p(e))}var h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{i(),o(),f(),r(),s(),a(),h=c.default.compile(t),g=c.default.compile(n),_=c.default.compile(l),v=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3483-3418&m=dev`,y=[_({text:`Supporting paragraph in the content slot.`,style:`body-base`,weight:`base`}),g({listType:`unordered`,marker:`bullet`,surfaced:!1,items:[{text:`List item body text`},{text:`List item body text`},{text:`List item body text`}],className:``})].join(`
`),b={title:`Patterns/Content block`,tags:[`autodocs`],parameters:{docs:{description:{component:`Section container inherited from core. [Figma](${v}).`}}},argTypes:{title:{control:`text`,name:`title`},titleStyle:{control:{type:`inline-radio`},options:[`h3`,`h0`],name:`titleStyle`},showLink:{control:`boolean`,name:`showLink`},showButton:{control:`boolean`,name:`showButton`},bodyText:{control:`text`,name:`bodyText`},showBody:{control:`boolean`,name:`showBody`}},args:{title:`Section title`,titleStyle:`h3`,showLink:!1,showButton:!1,showBody:!0}},x={name:`Demo`,render:e=>m(e),parameters:u(m({}),{unit:`content-block`,scss:d})},S={name:`WithLink`,render:()=>m({title:`Section title`,showLink:!0})},C={name:`WithButton`,render:()=>m({title:`Section title`,showButton:!0})},w={name:`DisplayTitle`,render:()=>m({title:`Display section title`,titleStyle:`h0`})},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render({}), {
    unit: 'content-block',
    scss: scssSource
  })
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'WithLink',
  render: () => render({
    title: 'Section title',
    showLink: true
  })
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'WithButton',
  render: () => render({
    title: 'Section title',
    showButton: true
  })
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'DisplayTitle',
  render: () => render({
    title: 'Display section title',
    titleStyle: 'h0'
  })
}`,...w.parameters?.docs?.source}}},T=[`Demo`,`WithLink`,`WithButton`,`DisplayTitle`]})))()}E();export{x as Demo,w as DisplayTitle,C as WithButton,S as WithLink,T as __namedExportsOrder,b as default};