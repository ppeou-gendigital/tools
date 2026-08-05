import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,Z as n,n as r,nt as i,t as a,tt as o}from"./pretty-source-CA3IhMc4.js";import"./content-body-BGuR5ei1.js";import"./icon-D6wgK3Ul.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";import"./divider-CMa0ijyT.js";import{i as l,n as u}from"./logo-wrapper-DXmSS4Bz.js";import"./menu-list-D7nEnhjo.js";function d(e,t){let n=e||new Date().getFullYear();return t||`Copyright © ${n} Gen Digital Inc. All rights reserved. ${v}`}function f(e,t){return t||`${e||`[Brand]`} is part of Gen – a global company with a family of trusted brands.`}function p(e){let t=Array.isArray(e)&&e.length?e:_;return t.map((e,n)=>{let r=e.text||e.label||`Link ${n+1}`,i=n===t.length-1;return{text:r,href:e.href||`#`,showRightBorder:!i,rightIcon:!!e.rightIcon,rightIconName:e.rightIconName||``,role:`listitem`,edgePadding:!0}})}function m(e={}){let t=String(e.theme||`light`).toLowerCase()===`dark`?`dark`:`light`,n=e.brandName||`[Brand]`,r=e.copyrightYear||new Date().getFullYear();return{theme:t,showLowerLinks:e.showLowerLinks!==!1,logoSrc:e.logoSrc||u,logoAlt:e.logoAlt??`Gen`,brandName:n,statement:f(n,e.statement),copyrightYear:r,copyrightText:d(r,e.copyrightText),links:p(e.links),navLabel:e.navLabel||`Legal and company links`,dividerInverse:t===`dark`,className:e.className||``}}function h(e,t){return t(m(e))}var g,_,v,y;function b(){return(b=e((()=>{l(),g=[`light`,`dark`],_=[{label:`About Gen`,href:`#`},{label:`Newsroom`,href:`#`},{label:`Partner with us`,href:`#`},{label:`Careers`,href:`#`},{label:`Legal`,href:`#`},{label:`Security`,href:`#`},{label:`Terms of use`,href:`#`},{label:`Accessibility`,href:`#`},{label:`Your Privacy choice`,href:`#`},{label:`Privacy setting`,href:`#`}],v=`Gen trademarks or registered trademarks are property of Gen Digital Inc. or its affiliates. Firefox is a trademark of Mozilla Foundation. Android, Google Chrome, Google Play and the Google Play logo are trademarks of Google, LLC. Mac, iPhone, iPad, Apple and the Apple logo are trademarks of Apple Inc., registered in the U.S. and other countries. App Store is a service mark of Apple Inc. Alexa and all related logos are trademarks of Amazon.com, Inc. or its affiliates. Microsoft and the Window logo are trademarks of Microsoft Corporation in the U.S. and other countries. The Android robot is reproduced or modified from work created and shared by Google and used according to terms described in the Creative Commons 3.0 Attribution License. Other names may be trademarks of their respective owners.`,y={theme:`light`,showLowerLinks:!0,logoSrc:u,logoAlt:`Gen`,brandName:`[Brand]`,statement:``,copyrightYear:new Date().getFullYear(),copyrightText:``,links:_,navLabel:`Legal and company links`}})))()}var x,S,C,w,T;function E(){return(E=e((()=>{t(),o(),r(),s(),b(),x=n.default.compile(i),S={title:`Blocks/Lower footer`,tags:[`autodocs`,`shared-library`],render:e=>h(e,x),args:y,argTypes:{theme:{control:{type:`select`},options:g,name:`Theme`},showLowerLinks:{control:`boolean`,name:`Show lower links`},brandName:{control:`text`,name:`Brand name`},logoSrc:{control:`text`,name:`Logo src`},statement:{control:`text`,name:`Statement override`},copyrightYear:{control:`number`,name:`Copyright year`}},parameters:{badges:[`shared`],contentWidth:`fluid`,design:c([[`Lower Footer page — 3598:2174`,`3598:2174`],[`Component set — 2498:2022`,`2498:2022`],[`Spec — 4278:466`,`4278:466`]])}},C={parameters:a(h(y,x),{unit:`lower-footer`})},w={parameters:{design:c(`3598:2174`)},render:()=>`
      <div class="sbd-doc">
        <div class="sbd-doc__stack" style="display:flex;flex-direction:column;gap:32px;">
          ${g.map(e=>{let t=h({...y,theme:e,showLowerLinks:!0},x),n=h({...y,theme:e,showLowerLinks:!1},x);return`
        <div class="sbd-doc__stack-item-canvas" style="inline-size:100%;max-inline-size:1312px;${e===`dark`?`background:#2f303c;padding:24px;`:``}">
          <p class="sbd-doc__stack-item-label" style="${e===`dark`?`color:#fff;`:``}">theme = ${e} · links on</p>
          ${t}
          <p class="sbd-doc__stack-item-label" style="margin-block-start:32px;${e===`dark`?`color:#fff;`:``}">theme = ${e} · links off</p>
          ${n}
        </div>`}).join(``)}
          <div class="sbd-doc__stack-item-canvas" style="inline-size:343px;max-inline-size:100%;">
            <p class="sbd-doc__stack-item-label">mobile width (343px) — 2-up links</p>
            ${h(y,x)}
          </div>
        </div>
      </div>`},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileLowerFooterArgs(defaultLowerFooterArgs, compiled), {
    unit: 'lower-footer'
  })
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  parameters: {
    design: figmaDesign('3598:2174')
  },
  render: () => {
    const themes = THEME_OPTIONS.map(theme => {
      const withLinks = compileLowerFooterArgs({
        ...defaultLowerFooterArgs,
        theme,
        showLowerLinks: true
      }, compiled);
      const bare = compileLowerFooterArgs({
        ...defaultLowerFooterArgs,
        theme,
        showLowerLinks: false
      }, compiled);
      return \`
        <div class="sbd-doc__stack-item-canvas" style="inline-size:100%;max-inline-size:1312px;\${theme === 'dark' ? 'background:#2f303c;padding:24px;' : ''}">
          <p class="sbd-doc__stack-item-label" style="\${theme === 'dark' ? 'color:#fff;' : ''}">theme = \${theme} · links on</p>
          \${withLinks}
          <p class="sbd-doc__stack-item-label" style="margin-block-start:32px;\${theme === 'dark' ? 'color:#fff;' : ''}">theme = \${theme} · links off</p>
          \${bare}
        </div>\`;
    }).join('');
    const mobile = compileLowerFooterArgs(defaultLowerFooterArgs, compiled);
    return \`
      <div class="sbd-doc">
        <div class="sbd-doc__stack" style="display:flex;flex-direction:column;gap:32px;">
          \${themes}
          <div class="sbd-doc__stack-item-canvas" style="inline-size:343px;max-inline-size:100%;">
            <p class="sbd-doc__stack-item-label">mobile width (343px) — 2-up links</p>
            \${mobile}
          </div>
        </div>
      </div>\`;
  }
}`,...w.parameters?.docs?.source}}},T=[`Demo`,`AllStyles`]})))()}E();export{w as AllStyles,C as Demo,T as __namedExportsOrder,S as default};