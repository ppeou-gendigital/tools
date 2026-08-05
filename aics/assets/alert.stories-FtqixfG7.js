import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{J as t,Q as n,Z as r,ln as i,n as a,q as o,t as s,un as c}from"./pretty-source-C_TZ5wEY.js";function l(e){if(!e||e.dataset.alertInitialized===`true`)return null;let t=e.querySelector(`[data-alert-dismiss]`);if(!t)return null;e.dataset.alertInitialized=`true`;let n=()=>{e.dispatchEvent(new CustomEvent(`lifelock:alert:dismiss`,{bubbles:!0,composed:!0,detail:{root:e}})),e.remove()};return t.addEventListener(`click`,n),{destroy(){t.removeEventListener(`click`,n),delete e.dataset.alertInitialized}}}function u(e){return f({tone:e.tone||`info`,hierarchy:e.hierarchy||`low`,width:e.width||`in-grid`,showIcon:e.showIcon!==!1,showBody:e.showBody!==!1,showButton:!!e.showButton,dismissible:!!e.dismissible,elevation:!!e.elevation,title:e.title||``,description:e.description||``,ctaLabel:e.ctaLabel||`Action`,ctaHref:e.ctaHref||``,icon:e.icon||``,dismissLabel:e.dismissLabel||`Dismiss`,className:e.className||``})}function d(e){let t=document.createElement(`div`);t.innerHTML=e;let n=t.firstElementChild;return n&&l(n),t}var f,p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{n(),a(),t(),c(),f=r.default.compile(i),p=[`info`,`critical`,`attention`,`success`,`dark`,`brand`],m=[`low`,`high`],h=[`in-grid`,`full-bleed`],g=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=537-28056&m=dev`,_={tone:`info`,hierarchy:`low`,width:`in-grid`,showIcon:!0,showBody:!0,showButton:!0,dismissible:!1,elevation:!1,title:`Your trial expires in 3 days`,description:`Upgrade now to keep full protection across every device.`,ctaLabel:`Upgrade`,ctaHref:``,icon:``,dismissLabel:`Dismiss`,className:``},v={default:{showIcon:!0,showBody:!0,showButton:!0,dismissible:!1,elevation:!1},toast:{showIcon:!0,showBody:!0,showButton:!1,dismissible:!0,elevation:!0},passive:{showIcon:!0,showBody:!0,showButton:!1,dismissible:!1,elevation:!1}},y={title:`Patterns/Alert`,tags:[`autodocs`],parameters:{docs:{description:{component:`Unified alert surface (replaces Banner / Toast / Passive). Tone × Hierarchy × Width plus boolean anatomy toggles. [Figma](${g}).`}},contentWidth:`fluid`},argTypes:{tone:{control:{type:`inline-radio`},options:p,name:`Tone`},hierarchy:{control:{type:`inline-radio`},options:m,name:`Hierarchy`},width:{control:{type:`inline-radio`},options:h,name:`Width`},showIcon:{control:`boolean`,name:`Show icon`},showBody:{control:`boolean`,name:`Show body`},showButton:{control:`boolean`,name:`Show button`},dismissible:{control:`boolean`,name:`Dismissible`},elevation:{control:`boolean`,name:`Elevation`},title:{control:`text`,name:`Title`},description:{control:`text`,name:`Description`},ctaLabel:{control:`text`,name:`CTA label`},ctaHref:{control:`text`,name:`CTA href`},icon:{control:`text`,name:`Icon override`},dismissLabel:{control:`text`,name:`Dismiss label`},className:{control:`text`,name:`className`}},args:_},b={name:`Demo`,render:e=>d(u(e)),parameters:s(u(_),{unit:`alert`,scss:o})},x={name:`ToneMatrix`,render:()=>`<div style="display:flex;flex-direction:column;gap:16px;padding:16px;">${p.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Tone=${e} · Hierarchy=low · Width=in-grid
        </figcaption>
        ${u({..._,tone:e,hierarchy:`low`,width:`in-grid`,...v.default})}
      </figure>`).join(`
`)}</div>`},S={name:`HierarchyCompare`,render:()=>`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px;">${[`info`,`critical`,`attention`,`success`].flatMap(e=>m.map(t=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Tone=${e} · Hierarchy=${t}
        </figcaption>
        ${u({..._,tone:e,hierarchy:t,...v.default})}
      </figure>`)).join(`
`)}</div>`},C={name:`WidthCompare`,render:()=>`<div style="display:flex;flex-direction:column;gap:24px;padding:0;">${h.map(e=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;inline-size:100%;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Width=${e} · Tone=info · Hierarchy=low
        </figcaption>
        ${u({..._,width:e,tone:`info`,hierarchy:`low`,...v.default})}
      </figure>`).join(`
`)}</div>`,parameters:{contentWidth:!1}},w={name:`Presets`,render:()=>`<div style="display:flex;flex-direction:column;gap:24px;padding:16px;">${[[`Default (banner)`,v.default],[`Toast`,v.toast],[`Passive`,v.passive]].map(([e,t])=>`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;max-inline-size:480px;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          ${e}
        </figcaption>
        ${u({..._,...t})}
      </figure>`).join(`
`)}</div>`},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => mount(render(args)),
  parameters: htmlStoryParameters(render(defaultArgs), {
    unit: 'alert',
    scss: scssSource
  })
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'ToneMatrix',
  render: () => {
    const cards = TONE_OPTIONS.map(tone => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Tone=\${tone} · Hierarchy=low · Width=in-grid
        </figcaption>
        \${render({
      ...defaultArgs,
      tone,
      hierarchy: 'low',
      width: 'in-grid',
      ...PRESETS.default
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-direction:column;gap:16px;padding:16px;">\${cards}</div>\`;
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'HierarchyCompare',
  render: () => {
    const tones = ['info', 'critical', 'attention', 'success'];
    const cards = tones.flatMap(tone => HIERARCHY_OPTIONS.map(hierarchy => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Tone=\${tone} · Hierarchy=\${hierarchy}
        </figcaption>
        \${render({
      ...defaultArgs,
      tone,
      hierarchy,
      ...PRESETS.default
    })}
      </figure>\`)).join('\\n');
    return \`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px;">\${cards}</div>\`;
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'WidthCompare',
  render: () => {
    const cards = WIDTH_OPTIONS.map(width => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;inline-size:100%;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          Width=\${width} · Tone=info · Hierarchy=low
        </figcaption>
        \${render({
      ...defaultArgs,
      width,
      tone: 'info',
      hierarchy: 'low',
      ...PRESETS.default
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-direction:column;gap:24px;padding:0;">\${cards}</div>\`;
  },
  parameters: {
    contentWidth: false
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'Presets',
  render: () => {
    const rows = [['Default (banner)', PRESETS.default], ['Toast', PRESETS.toast], ['Passive', PRESETS.passive]].map(([label, preset]) => \`
      <figure style="margin:0;display:flex;flex-direction:column;gap:8px;max-inline-size:480px;">
        <figcaption style="font:12px/16px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">
          \${label}
        </figcaption>
        \${render({
      ...defaultArgs,
      ...preset
    })}
      </figure>\`).join('\\n');
    return \`<div style="display:flex;flex-direction:column;gap:24px;padding:16px;">\${rows}</div>\`;
  }
}`,...w.parameters?.docs?.source}}},T=[`Demo`,`ToneMatrix`,`HierarchyCompare`,`WidthCompare`,`Presets`]})))()}E();export{b as Demo,S as HierarchyCompare,w as Presets,x as ToneMatrix,C as WidthCompare,T as __namedExportsOrder,y as default};