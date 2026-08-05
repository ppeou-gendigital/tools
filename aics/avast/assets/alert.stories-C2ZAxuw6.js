import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{gt as t,ht as n,i as r,n as i,r as a,t as o}from"./pretty-source-CvP1BtiP.js";var s;function c(){return(c=e((()=>{s=`/**
 * Patterns/Alert — unified master (.c-alert).
 * Figma Web-ODS Shared Library 537:28056 / Spec 5399:1816.
 *
 * Axes → BEM:
 *   tone       → .c-alert--{info|critical|attention|success|dark|brand}
 *   hierarchy  → .c-alert--{low|high}
 *   width      → .c-alert--{in-grid|full-bleed}
 *   elevation  → .c-alert--elevated
 *
 * Composes Button (Size S) + Icon. CTA paint lives in button.scss.
 */

.c-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  inline-size: 100%;
  box-sizing: border-box;
  padding-block: var(--space-5);
  padding-inline: var(--space-5);
  border-radius: var(--border-radius-l);
  font-family: var(--font-family-primary);
  text-decoration: none;
  flex-wrap: wrap;
}

.c-alert--full-bleed {
  border-radius: var(--border-radius-0);
  padding-inline: var(--space-5);

  @media (min-width: 768px) {
    padding-inline: var(--space-8);
  }

  @media (min-width: 1024px) {
    padding-inline: var(--space-10);
  }

  @media (min-width: 1440px) {
    padding-inline: var(--space-13);
  }
}

.c-alert--elevated {
  box-shadow: var(--shadow-default);
}

.c-alert__status-icon {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 20px;
  block-size: 20px;
  margin-block-start: 2px;
}

.c-alert__content {
  flex: 1 1 0;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.c-alert__title {
  margin: 0;
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letterspacing-body-base);
}

.c-alert__description {
  margin: 0;
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--letterspacing-body-sm);
}

.c-alert > .btn {
  align-self: center;
}

.c-alert__dismiss {
  align-self: center;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--space-7);
  block-size: var(--space-7);
  padding: 0;
  border: 0;
  border-radius: var(--border-radius-control);
  background-color: transparent;
  color: inherit;
  cursor: pointer;
  transition: background-color 150ms ease;
  margin-inline-start: auto;
}

.c-alert__dismiss:hover,
.c-alert[data-state='hover'] .c-alert__dismiss {
  background-color: rgb(0 0 0 / 8%);
}

.c-alert__dismiss:focus-visible,
.c-alert[data-state='focus'] .c-alert__dismiss {
  outline: var(--border-width-default) solid var(--color-border-focus);
  outline-offset: 2px;
}

/* Low — subtle tint + primary text -------------------------------------- */

.c-alert--low.c-alert--info {
  background-color: var(--color-signal-info-subtle);
  color: var(--color-text-primary);
}

.c-alert--low.c-alert--info .c-alert__status-icon {
  color: var(--color-signal-info);
}

.c-alert--low.c-alert--critical {
  background-color: var(--color-signal-critical-subtle);
  color: var(--color-text-primary);
}

.c-alert--low.c-alert--critical .c-alert__status-icon {
  color: var(--color-signal-critical);
}

.c-alert--low.c-alert--attention {
  background-color: var(--color-signal-warning-subtle);
  color: var(--color-text-primary);
}

.c-alert--low.c-alert--attention .c-alert__status-icon {
  color: var(--color-signal-warning);
}

.c-alert--low.c-alert--success {
  background-color: var(--color-signal-success-subtle);
  color: var(--color-text-primary);
}

.c-alert--low.c-alert--success .c-alert__status-icon {
  color: var(--color-signal-success);
}

.c-alert--low.c-alert--dark {
  background-color: var(--color-bg-muted);
  color: var(--color-text-primary);
}

.c-alert--low.c-alert--dark .c-alert__status-icon {
  color: var(--color-text-primary);
}

.c-alert--low.c-alert--brand {
  background-color: var(--color-bg-brand-soft);
  color: var(--color-text-primary);
}

.c-alert--low.c-alert--brand .c-alert__status-icon {
  color: var(--color-bg-brand);
}

/* High — solid signal + inverse (Attention keeps primary text) ---------- */

.c-alert--high.c-alert--info {
  background-color: var(--color-signal-info);
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--info .c-alert__status-icon {
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--critical {
  background-color: var(--color-signal-critical);
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--critical .c-alert__status-icon {
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--attention {
  background-color: var(--color-signal-warning);
  color: var(--color-text-primary);
}

.c-alert--high.c-alert--attention .c-alert__status-icon {
  color: var(--color-text-primary);
}

.c-alert--high.c-alert--success {
  background-color: var(--color-signal-success);
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--success .c-alert__status-icon {
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--dark {
  background-color: var(--color-bg-inverse-strong);
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--dark .c-alert__status-icon {
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--brand {
  background-color: var(--color-bg-brand);
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--brand .c-alert__status-icon {
  color: var(--color-text-inverse);
}

@media (prefers-reduced-motion: reduce) {
  .c-alert,
  .c-alert__dismiss {
    transition: none;
  }
}
`})))()}function l(e){if(!e||e.dataset.alertInitialized===`true`)return null;let t=e.querySelector(`[data-alert-dismiss]`);if(!t)return null;e.dataset.alertInitialized=`true`;let n=()=>{e.dispatchEvent(new CustomEvent(`lifelock:alert:dismiss`,{bubbles:!0,composed:!0,detail:{root:e}})),e.remove()};return t.addEventListener(`click`,n),{destroy(){t.removeEventListener(`click`,n),delete e.dataset.alertInitialized}}}function u(e){return f({tone:e.tone||`info`,hierarchy:e.hierarchy||`low`,width:e.width||`in-grid`,showIcon:e.showIcon!==!1,showBody:e.showBody!==!1,showButton:!!e.showButton,dismissible:!!e.dismissible,elevation:!!e.elevation,title:e.title||``,description:e.description||``,ctaLabel:e.ctaLabel||`Action`,ctaHref:e.ctaHref||``,icon:e.icon||``,dismissLabel:e.dismissLabel||`Dismiss`,className:e.className||``})}function d(e){let t=document.createElement(`div`);t.innerHTML=e;let n=t.firstElementChild;return n&&l(n),t}var f,p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{r(),i(),c(),t(),f=a.default.compile(n),p=[`info`,`critical`,`attention`,`success`,`dark`,`brand`],m=[`low`,`high`],h=[`in-grid`,`full-bleed`],g=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=537-28056&m=dev`,_={tone:`info`,hierarchy:`low`,width:`in-grid`,showIcon:!0,showBody:!0,showButton:!0,dismissible:!1,elevation:!1,title:`Your trial expires in 3 days`,description:`Upgrade now to keep full protection across every device.`,ctaLabel:`Upgrade`,ctaHref:``,icon:``,dismissLabel:`Dismiss`,className:``},v={default:{showIcon:!0,showBody:!0,showButton:!0,dismissible:!1,elevation:!1},toast:{showIcon:!0,showBody:!0,showButton:!1,dismissible:!0,elevation:!0},passive:{showIcon:!0,showBody:!0,showButton:!1,dismissible:!1,elevation:!1}},y={title:`Patterns/Alert`,tags:[`autodocs`],parameters:{docs:{description:{component:`Unified alert inherited from core. Tone × Hierarchy × Width plus boolean anatomy toggles. [Figma](${g}).`}},contentWidth:`fluid`},argTypes:{tone:{control:{type:`inline-radio`},options:p,name:`Tone`},hierarchy:{control:{type:`inline-radio`},options:m,name:`Hierarchy`},width:{control:{type:`inline-radio`},options:h,name:`Width`},showIcon:{control:`boolean`,name:`Show icon`},showBody:{control:`boolean`,name:`Show body`},showButton:{control:`boolean`,name:`Show button`},dismissible:{control:`boolean`,name:`Dismissible`},elevation:{control:`boolean`,name:`Elevation`},title:{control:`text`,name:`Title`},description:{control:`text`,name:`Description`},ctaLabel:{control:`text`,name:`CTA label`},ctaHref:{control:`text`,name:`CTA href`},icon:{control:`text`,name:`Icon override`},dismissLabel:{control:`text`,name:`Dismiss label`},className:{control:`text`,name:`className`}},args:_},b={name:`Demo`,render:e=>d(u(e)),parameters:o(u(_),{unit:`alert`,scss:s})},x={name:`ToneMatrix`,render:()=>`<div style="display:flex;flex-direction:column;gap:16px;padding:16px;">${p.map(e=>`
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