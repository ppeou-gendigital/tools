import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{$ as t,et as n,i as r,n as i,r as a,t as o}from"./pretty-source-CugIV0Wu.js";import"./discount-label-B_xZkyNW.js";import"./icon-D6wgK3Ul.js";import{r as s,t as c}from"./figma-links-B0HkTJ7d.js";var l;function u(){return(u=e((()=>{l=`/**
 * Molecules/Discount label — core (.c-discount-label).
 * Figma: Web-ODS Shared Library 1408:443 / Spec 3024:48.
 *
 * Fill × Strength:
 *   solid + base → 100% surface
 *   transparent + 30|50|80 → color-mix with transparent
 *   tint + 30|50|80 → color-mix with --color-bg-default (tinted wash)
 */

.c-discount-label {
  --c-discount-label-bg: var(--color-bg-default);
  --c-discount-label-content: var(--color-text-primary);
  --c-discount-label-mix: 100%;
  --c-discount-label-mix-with: transparent;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  inline-size: fit-content;
  box-sizing: border-box;
  padding-block: var(--space-1);
  padding-inline: var(--space-3);
  border-radius: var(--border-radius-xl);
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-label);
  line-height: var(--lineheight-label);
  letter-spacing: var(--letterspacing-label);
  background-color: color-mix(
    in srgb,
    var(--c-discount-label-bg) var(--c-discount-label-mix),
    var(--c-discount-label-mix-with)
  );
  color: var(--c-discount-label-content);
}

.c-discount-label__text {
  display: inline-block;
}

.c-discount-label__icon {
  display: inline-flex;
  flex-shrink: 0;
}

/* Fill */
.c-discount-label--fill-solid {
  --c-discount-label-mix-with: transparent;
}

.c-discount-label--fill-transparent {
  --c-discount-label-mix-with: transparent;
}

.c-discount-label--fill-tint {
  --c-discount-label-mix-with: var(--color-bg-default);
}

/* Strength */
.c-discount-label--strength-base {
  --c-discount-label-mix: 100%;
}

.c-discount-label--strength-30 {
  --c-discount-label-mix: 30%;
}

.c-discount-label--strength-50 {
  --c-discount-label-mix: 50%;
}

.c-discount-label--strength-80 {
  --c-discount-label-mix: 80%;
}

/* Background paint pairs */
.c-discount-label--primary {
  --c-discount-label-bg: var(--color-bg-default);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--secondary {
  --c-discount-label-bg: var(--color-bg-subtle);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--brand {
  --c-discount-label-bg: var(--color-bg-brand);
  --c-discount-label-content: var(--color-text-inverse);
}

.c-discount-label--brand-soft {
  --c-discount-label-bg: var(--color-bg-brand-soft);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--accent {
  --c-discount-label-bg: var(--color-bg-accent);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--alpha {
  --c-discount-label-bg: var(--color-bg-alpha);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--beta {
  --c-discount-label-bg: var(--color-bg-beta);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--gamma {
  --c-discount-label-bg: var(--color-bg-gamma);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--delta {
  --c-discount-label-bg: var(--color-bg-delta);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--inverse-primary {
  --c-discount-label-bg: var(--color-bg-inverse-strong);
  --c-discount-label-content: var(--color-text-inverse);
}

.c-discount-label--inverse-secondary {
  --c-discount-label-bg: var(--color-bg-inverse);
  --c-discount-label-content: var(--color-text-inverse);
}

.c-discount-label--success {
  --c-discount-label-bg: var(--color-signal-success);
  --c-discount-label-content: var(--color-text-inverse);
}

.c-discount-label--size-small {
  /* Figma Size=Small — geometry locked to space-1 / space-3 + label type */
}
`})))()}function d(e){let t=e.fill||`solid`,n=e.strength||`base`;return t===`solid`&&(n=`base`),t!==`solid`&&n===`base`&&(n=`50`),f({background:e.background||`primary`,fill:t,strength:n,size:e.size||`small`,text:e.text??`label`,showIcon:!!e.showIcon,icon:e.icon||`actions/simple-add`})}var f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{r(),i(),s(),u(),n(),f=a.default.compile(t),p=[`primary`,`secondary`,`brand`,`brand-soft`,`accent`,`alpha`,`beta`,`gamma`,`delta`,`inverse-primary`,`inverse-secondary`,`success`],m=[`solid`,`transparent`,`tint`],h=[`base`,`30`,`50`,`80`],g=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28415&m=dev`,_={title:`Molecules/Discount label`,tags:[`autodocs`],parameters:{docs:{description:{component:`Compact pill for discount / promo metadata. [Pattern / DiscountLabel](${g}). See \`spec.md\`.`}},design:c(`1408:443`)},argTypes:{background:{control:{type:`select`},options:p,name:`background`},fill:{control:{type:`inline-radio`},options:m,name:`fill`},strength:{control:{type:`inline-radio`},options:h,name:`strength`},text:{control:`text`,name:`text`},showIcon:{control:`boolean`,name:`showIcon`},icon:{control:`text`,name:`icon`}},args:{background:`primary`,fill:`solid`,strength:`base`,text:`label`,showIcon:!1,icon:`actions/simple-add`}},v={name:`Demo`,render:e=>d(e),parameters:o(d({}),{unit:`discount-label`,scss:l})},y={name:`AllStyles`,render:()=>{let e=[[`solid`,`base`],[`transparent`,`30`],[`transparent`,`50`],[`transparent`,`80`],[`tint`,`30`],[`tint`,`50`],[`tint`,`80`]],t=p.map(t=>`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">${t}</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">${e.map(([e,n])=>`
          <div class="sbd-doc__stack-item-canvas" style="min-inline-size:64px;">
            ${d({background:t,fill:e,strength:n,text:`label`})}
          </div>`).join(``)}</div>
        </div>`).join(`
`);return`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma"><a class="sbd-doc__figma-link" href="${g}">Pattern / DiscountLabel — 539:28415 ↗</a></p>
        <section>
          <h2 class="sbd-doc__section-title">Background × Fill × Strength</h2>
          <div class="sbd-doc__stack">${t}</div>
        </section>
      </div>`}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render({}), {
    unit: 'discount-label',
    scss: scssSource
  })
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  render: () => {
    const fills = [['solid', 'base'], ['transparent', '30'], ['transparent', '50'], ['transparent', '80'], ['tint', '30'], ['tint', '50'], ['tint', '80']];
    const rows = BACKGROUND_OPTIONS.map(background => {
      const cells = fills.map(([fill, strength]) => \`
          <div class="sbd-doc__stack-item-canvas" style="min-inline-size:64px;">
            \${render({
        background,
        fill,
        strength,
        text: 'label'
      })}
          </div>\`).join('');
      return \`
        <div class="sbd-doc__stack-item">
          <p class="sbd-doc__stack-item-label">\${background}</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">\${cells}</div>
        </div>\`;
    }).join('\\n');
    return \`
      <div class="sbd-doc">
        <p class="sbd-doc__section-figma"><a class="sbd-doc__figma-link" href="\${FIGMA_URL}">Pattern / DiscountLabel — 539:28415 ↗</a></p>
        <section>
          <h2 class="sbd-doc__section-title">Background × Fill × Strength</h2>
          <div class="sbd-doc__stack">\${rows}</div>
        </section>
      </div>\`;
  }
}`,...y.parameters?.docs?.source}}},b=[`Demo`,`AllStyles`]})))()}x();export{y as AllStyles,v as Demo,b as __namedExportsOrder,_ as default};