import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Q as t,St as n,Z as r,n as i,t as a,xt as o}from"./pretty-source-CA3IhMc4.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";function l(e){let t=[];for(let n=1;n<=6;n+=1){if(n!==1&&e[`showStep${n}`]===!1)continue;let r=String(e[`step${n}State`]??`default`).toLowerCase();t.push({number:e[`step${n}Number`]??n,state:r,showLabel:!!e[`step${n}ShowLabel`],label:e[`step${n}Label`]??`Label`,isActive:r===`active`})}return t.forEach((e,n)=>{e.showConnector=n<t.length-1}),t}function u(e,t){let n={...p,...e};return t({direction:n.direction,ariaLabel:n.ariaLabel,steps:l(n)})}var d,f,p;function m(){return(m=e((()=>{d=[`default`,`active`,`complete`],f=[`horizontal`,`vertical`],p={direction:`horizontal`,ariaLabel:`Checkout progress`,showStep2:!0,showStep3:!0,showStep4:!0,showStep5:!0,showStep6:!0,step1State:`active`,step1Number:1,step1ShowLabel:!1,step1Label:`Account`,step2State:`default`,step2Number:2,step2ShowLabel:!1,step2Label:`Shipping`,step3State:`default`,step3Number:3,step3ShowLabel:!1,step3Label:`Payment`,step4State:`default`,step4Number:4,step4ShowLabel:!1,step4Label:`Review`,step5State:`default`,step5Number:5,step5ShowLabel:!1,step5Label:`Confirm`,step6State:`default`,step6Number:6,step6ShowLabel:!1,step6Label:`Done`}})))()}function h(e){let t=`step${e}`;return{[`${t}State`]:{control:{type:`inline-radio`},options:d,name:`Step ${e} state`,table:{category:`Step ${e}`}},[`${t}Number`]:{control:{type:`number`,min:1,max:99},name:`Step ${e} number`,table:{category:`Step ${e}`}},[`${t}ShowLabel`]:{control:`boolean`,name:`Step ${e} show label`,table:{category:`Step ${e}`}},[`${t}Label`]:{control:`text`,name:`Step ${e} label`,table:{category:`Step ${e}`},if:{arg:`${t}ShowLabel`,truthy:!0}}}}function g(e,t){return`
    <div class="sbd-doc__stack-item">
      <p class="sbd-doc__stack-item-label">${e}</p>
      <div class="sbd-doc__stack-item-canvas">${u(t,v)}</div>
    </div>
  `}function _(e,t,n={}){let r={...p,direction:e,showStep4:n.showStep4??!1,showStep5:n.showStep5??!1,showStep6:n.showStep6??!1};if(t.forEach((e,t)=>{r[`step${t+1}State`]=e}),n.showLabels)for(let e=1;e<=t.length;e+=1)r[`step${e}ShowLabel`]=!0;return r}var v,y,b,x,S,C,w;function T(){return(T=e((()=>{t(),o(),i(),s(),m(),v=r.default.compile(n),y={direction:{control:{type:`inline-radio`},options:f,name:`Direction`},ariaLabel:{control:`text`,name:`Accessible name`,description:"Optional `aria-label` on the `<ol>` root when step labels are hidden."},showStep2:{control:`boolean`,name:`Show step 2`,table:{category:`Visibility`}},showStep3:{control:`boolean`,name:`Show step 3`,table:{category:`Visibility`}},showStep4:{control:`boolean`,name:`Show step 4`,table:{category:`Visibility`}},showStep5:{control:`boolean`,name:`Show step 5`,table:{category:`Visibility`}},showStep6:{control:`boolean`,name:`Show step 6`,table:{category:`Visibility`}},...h(1),...h(2),...h(3),...h(4),...h(5),...h(6)},b={title:`Molecules/Stepper`,tags:[`autodocs`,`shared-library`],render:e=>u(e,v),args:p,argTypes:y,parameters:{badges:[`shared`],contentWidth:`fluid`,design:c(`1386:867`),docs:{description:{component:'Stepper — ordered multi-step progress indicator with up to six steps. Mirrors the [Web-ODS Shared Library Stepper master](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1386-867&m=dev) and its [Spec Frame](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=3067-548&m=dev). Renders as a semantic `<ol>` / `<li>` list; the active step carries `aria-current="step"`. Complete steps compose the registered `icon` partial (`status/simple-checkmark`). Stateless — no JavaScript.'}}}},x={parameters:a(u(p,v),{unit:`stepper`,extra:{design:c(`1386:867`)}})},S=e=>`<h3 class="sbd-doc__group-title">${e}</h3>`,C={parameters:{contentWidth:`fluid`,design:c(`1386:867`),docs:{description:{story:`Canonical gallery — horizontal and vertical direction bands, a three-step checkout progression, and a single-step state matrix (Default / Active / Complete).`}}},render:()=>{let e=[g(`direction = horizontal · step 1 active · six steps`,p),g(`direction = horizontal · complete → active → default progression · three steps · labels on`,_(`horizontal`,[`complete`,`active`,`default`],{showLabels:!0,showStep4:!1,showStep5:!1,showStep6:!1})),g(`direction = vertical · step 1 active · six steps`,{...p,direction:`vertical`}),g(`direction = vertical · complete → active → default · three steps · labels on`,_(`vertical`,[`complete`,`active`,`default`],{showLabels:!0,showStep4:!1,showStep5:!1,showStep6:!1}))].join(``),t=d.map(e=>`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">state = ${e}</p>
          <div class="sbd-doc__stack-item-canvas">${u({...p,showStep2:!1,showStep3:!1,showStep4:!1,showStep5:!1,showStep6:!1,step1State:e,step1ShowLabel:!0,step1Label:e.charAt(0).toUpperCase()+e.slice(1)},v)}</div>
        </div>
      `).join(``);return`
      <div class="sbd-doc">
        ${S(`Direction bands`)}
        <div class="sbd-doc__stack">${e}</div>
        ${S(`Step states (horizontal · single step · label on)`)}
        <div class="sbd-doc__stack">${t}</div>
      </div>
    `}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compileStepperArgs(defaultStepperArgs, compiled), {
    unit: 'stepper',
    extra: {
      design: figmaDesign('1386:867')
    }
  })
}`,...x.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  parameters: {
    contentWidth: 'fluid',
    design: figmaDesign('1386:867'),
    docs: {
      description: {
        story: 'Canonical gallery — horizontal and vertical direction bands, a three-step checkout progression, and a single-step state matrix (Default / Active / Complete).'
      }
    }
  },
  render: () => {
    const bands = [renderStepperBand('direction = horizontal · step 1 active · six steps', defaultStepperArgs), renderStepperBand('direction = horizontal · complete → active → default progression · three steps · labels on', progressionArgs('horizontal', ['complete', 'active', 'default'], {
      showLabels: true,
      showStep4: false,
      showStep5: false,
      showStep6: false
    })), renderStepperBand('direction = vertical · step 1 active · six steps', {
      ...defaultStepperArgs,
      direction: 'vertical'
    }), renderStepperBand('direction = vertical · complete → active → default · three steps · labels on', progressionArgs('vertical', ['complete', 'active', 'default'], {
      showLabels: true,
      showStep4: false,
      showStep5: false,
      showStep6: false
    }))].join('');
    const stateMatrix = STEP_STATE_OPTIONS.map(state => {
      const args = {
        ...defaultStepperArgs,
        showStep2: false,
        showStep3: false,
        showStep4: false,
        showStep5: false,
        showStep6: false,
        step1State: state,
        step1ShowLabel: true,
        step1Label: state.charAt(0).toUpperCase() + state.slice(1)
      };
      return \`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">state = \${state}</p>
          <div class="sbd-doc__stack-item-canvas">\${compileStepperArgs(args, compiled)}</div>
        </div>
      \`;
    }).join('');
    return \`
      <div class="sbd-doc">
        \${STACK_TITLE('Direction bands')}
        <div class="sbd-doc__stack">\${bands}</div>
        \${STACK_TITLE('Step states (horizontal · single step · label on)')}
        <div class="sbd-doc__stack">\${stateMatrix}</div>
      </div>
    \`;
  }
}`,...C.parameters?.docs?.source}}},w=[`Demo`,`AllStyles`]})))()}T();export{C as AllStyles,x as Demo,w as __namedExportsOrder,b as default};