import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{D as t,O as n,i as r,n as i,r as a,t as o}from"./pretty-source-CIqFBFpl.js";import"./icon-D6wgK3Ul.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";function l(e){let t=[];for(let n=1;n<=6;n+=1){if(n!==1&&e[`showStep${n}`]===!1)continue;let r=String(e[`step${n}State`]??`default`).toLowerCase();t.push({number:e[`step${n}Number`]??n,state:r,showLabel:!!e[`step${n}ShowLabel`],label:e[`step${n}Label`]??`Label`,isActive:r===`active`})}return t.forEach((e,n)=>{e.showConnector=n<t.length-1}),t}function u(e,t){let n={...p,...e};return t({direction:n.direction,ariaLabel:n.ariaLabel,steps:l(n)})}var d,f,p;function m(){return(m=e((()=>{d=[`default`,`active`,`complete`],f=[`horizontal`,`vertical`],p={direction:`horizontal`,ariaLabel:`Checkout progress`,showStep2:!0,showStep3:!0,showStep4:!0,showStep5:!0,showStep6:!0,step1State:`active`,step1Number:1,step1ShowLabel:!1,step1Label:`Account`,step2State:`default`,step2Number:2,step2ShowLabel:!1,step2Label:`Shipping`,step3State:`default`,step3Number:3,step3ShowLabel:!1,step3Label:`Payment`,step4State:`default`,step4Number:4,step4ShowLabel:!1,step4Label:`Review`,step5State:`default`,step5Number:5,step5ShowLabel:!1,step5Label:`Confirm`,step6State:`default`,step6Number:6,step6ShowLabel:!1,step6Label:`Done`}})))()}function h(e){let t=`step${e}`;return{[`${t}State`]:{control:{type:`inline-radio`},options:d,name:`Step ${e} state`,table:{category:`Step ${e}`}},[`${t}Number`]:{control:{type:`number`,min:1,max:99},name:`Step ${e} number`,table:{category:`Step ${e}`}},[`${t}ShowLabel`]:{control:`boolean`,name:`Step ${e} show label`,table:{category:`Step ${e}`}},[`${t}Label`]:{control:`text`,name:`Step ${e} label`,table:{category:`Step ${e}`},if:{arg:`${t}ShowLabel`,truthy:!0}}}}var g,_,v,y,b;function x(){return(x=e((()=>{r(),t(),i(),s(),m(),g=a.default.compile(n),_={title:`Molecules/Stepper`,tags:[`autodocs`,`shared-library`],render:e=>u(e,g),args:p,argTypes:{direction:{control:{type:`inline-radio`},options:f,name:`Direction`},ariaLabel:{control:`text`,name:`Accessible name`},showStep2:{control:`boolean`,name:`Show step 2`,table:{category:`Visibility`}},showStep3:{control:`boolean`,name:`Show step 3`,table:{category:`Visibility`}},showStep4:{control:`boolean`,name:`Show step 4`,table:{category:`Visibility`}},showStep5:{control:`boolean`,name:`Show step 5`,table:{category:`Visibility`}},showStep6:{control:`boolean`,name:`Show step 6`,table:{category:`Visibility`}},...h(1),...h(2),...h(3),...h(4),...h(5),...h(6)},parameters:{badges:[`shared`],contentWidth:`fluid`,design:c([[`Stepper master — 1386:867`,`1386:867`],[`Spec — 3067:548`,`3067:548`]])}},v={parameters:o(u(p,g),{unit:`stepper`})},y={parameters:{design:c(`1386:867`)},render:()=>`<div class="sbd-doc"><div class="sbd-doc__stack">${[[`horizontal · step 1 active`,p],[`vertical · step 1 active`,{...p,direction:`vertical`}]].map(([e,t])=>`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">${e}</p>
          <div class="sbd-doc__stack-item-canvas">${u(t,g)}</div>
        </div>`).join(``)}</div></div>`},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileStepperArgs(defaultStepperArgs, compiled), {
    unit: 'stepper'
  })
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  parameters: {
    design: figmaDesign('1386:867')
  },
  render: () => {
    const bands = [['horizontal · step 1 active', defaultStepperArgs], ['vertical · step 1 active', {
      ...defaultStepperArgs,
      direction: 'vertical'
    }]].map(([label, args]) => \`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">\${label}</p>
          <div class="sbd-doc__stack-item-canvas">\${compileStepperArgs(args, compiled)}</div>
        </div>\`).join('');
    return \`<div class="sbd-doc"><div class="sbd-doc__stack">\${bands}</div></div>\`;
  }
}`,...y.parameters?.docs?.source}}},b=[`Demo`,`AllStyles`]})))()}x();export{y as AllStyles,v as Demo,b as __namedExportsOrder,_ as default};