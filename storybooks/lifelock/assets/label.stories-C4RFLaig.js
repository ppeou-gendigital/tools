import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./pretty-source-BQFAze2y.js";import{g as r,h as i,n as a,t as o}from"./handlebars-helpers-tSVUrI1I.js";import{a as s,n as c,t as l}from"./figma-links-DrHwXaYQ.js";function u({background:e,variant:t}){let n={...g,background:e,variant:t,text:`label`},r=f(n);return`
    <div class="${y} sbd-doc__card">
      <div class="sbd-doc__card-canvas">${r}</div>
      <p class="sbd-doc__card-label">${t}</p>
    </div>
  `}function d(e){let t={...g,background:e,variant:`solid`,text:`label`,showIcon:!0,icon:`actions/simple-add`},n=f(t);return`
    <div class="${y} sbd-doc__card">
      <div class="sbd-doc__card-canvas">${n}</div>
      <p class="sbd-doc__card-label">solid · with icon</p>
    </div>
  `}var f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{a(),i(),t(),s(),f=o.default.compile(r),p=[`primary`,`secondary`,`brand`,`brand-soft`,`accent`,`alpha`,`beta`,`gamma`,`delta`,`inverse-primary`,`inverse-secondary`],m=[`solid`,`transparent-30`,`transparent-50`,`transparent-80`],h={background:{control:{type:`select`},options:p,name:`Background`,description:"Surface-role paint — 11 LifeLock surface tokens spanning brand / accent / neutral / inverse families. Drives the `.c-label--<background>` BEM modifier. Maps Figma's `Background` axis onto LifeLock's Layer 2 `--color-bg-*` surface-role tokens (see `./spec.md` § \"Tokens consumed\" for the per-Background paint table)."},variant:{control:{type:`inline-radio`},options:m,name:`Variant`,description:"Surface opacity — `solid` (100 %, default) / `transparent-30` / `transparent-50` / `transparent-80`. Implemented as `color-mix(in srgb, <bg> <stop>%, transparent)` so the surface dims while content paint stays at full opacity."},text:{control:`text`,name:`Text`,description:"The visible pill content. Authors should keep this short (1–3 words / ≤ 20 chars). Bound to `--font-family-primary` + `--font-weight-regular` + `--font-size-body-xs` (12 px) + `--lineheight-body-xs` (18 px)."},showIcon:{control:`boolean`,name:`Show icon`,description:"When true, renders a leading 16 × 16 px icon via the registered `icon` partial. When false (default), the icon slot is omitted entirely."},icon:{control:`text`,name:`Icon`,description:'Catalog key passed to `iconUrl()` (e.g. `"actions/simple-add"`, `"info/simple-info"`). The icon paints in `currentColor` so it inherits the label\'s content paint — no per-Background overrides. Ignored when `showIcon = false`.'}},g={background:`primary`,variant:`solid`,text:`label`,showIcon:!1,icon:`actions/simple-add`},_={title:`Molecules/Label`,tags:[`autodocs`,`shared-library`],render:e=>f(e),args:g,argTypes:h,parameters:{badges:[`shared`],contentWidth:`fluid`,design:l(`1408:443`),docs:{description:{component:"Label — compact pill for tagging, categorisation, and lightweight metadata mirrored from [Web-ODS Shared Library → Label](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1408-443&m=dev). One `.c-label` BEM block carries the Figma master variant set (11 `Background` × 4 `Variant` = 44 published variants). The 11-colour ladder maps onto LifeLock's Layer 2 surface-role tokens (`--color-bg-{default, subtle, brand, brand-soft, accent, alpha, beta, gamma, delta, inverse, inverse-strong}`) plus the LifeLock content / inverse text pair. The four `Variant` stops flip surface opacity from 100 % down to 30 / 50 / 80 % via `color-mix` while leaving content paint fully opaque — text + optional leading icon stay readable across every stop. Label is **stateless** — no `:hover` / `:focus-visible` / `:active` paints and no JavaScript. Consumers wanting a status / state affordance should compose `Components/Badge` (semantic Signal palette) instead; consumers wanting an interactive labelling affordance should compose a future `Components/Chip` or wrap the label inside a `Components/Button`. The Spec Frame for the full design intent (anatomy, behaviour, usage guidance, accessibility) lives at [`2331:287`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2331-287&m=dev)."}}}},v={parameters:n(f(g),{unit:`label`,extra:{design:l(`1408:443`),docs:{description:{story:"Interactive playground — toggle Background / Variant / Show icon / Icon in the args panel to preview every combination. `icon` only renders when `showIcon = true`."}}}})},y=`l-col l-col--sm--3 l-col--md--3 l-col--lg--3 l-col--xl--3`,b={parameters:{docs:{description:{story:"Canonical gallery enumerating the full `Background × Variant` Cartesian — the LifeLock / Desktop slice of the 44-variant Figma master variant set (`1408:443`). Cells are grouped per Background and stamp the four transparency stops across each row using the project's `.l-row` + `.l-col` quartet with `.sbd-doc__card` per cell — Label is a fit-content inline molecule and renders at its natural intrinsic width per cell. A trailing band stamps every Background once at `solid + showIcon=true` so the optional icon slot is visible across the full surface ladder. **No interaction-state band** — Label is presentation-only (no `:hover` / `:focus-visible` / `:active` paints and no JavaScript). The whole gallery mirrors a single Figma frame, so the canonical link sits at the top of the rendered chrome."}},design:l(`1408:443`)},render:()=>`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">${c(`1408:443`,`Master label`)}</p>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Persistent variants — Background × Variant</h2>
        <p class="sbd-doc__section-lede">Cartesian product of every Figma variant axis (11 × 4 = 44 cells). LifeLock / Desktop slice only — sibling Norton / AVG / White-Label duplicates are dropped at scour time. Each row stamps one Background across the four transparency stops; the surface dims while content paint stays opaque.</p>
        ${p.map(e=>`
            <h3 class="sbd-doc__group-title">Background = ${e}</h3>
            <div class="l-row">
              ${m.map(t=>u({background:e,variant:t})).join(``)}
            </div>
          `).join(``)}
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Leading icon slot — Solid across every Background</h2>
        <p class="sbd-doc__section-lede">Optional 16 × 16 px leading icon (composed via the registered <code>icon</code> partial) painted at <code>solid</code> across the full Background ladder. The icon inherits the label's content paint via <code>currentColor</code> — no per-Background icon-color overrides.</p>
        <div class="l-row">
          ${p.map(e=>d(e)).join(``)}
        </div>
      </section>
    </div>
  `},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compiled(defaultArgs), {
    unit: 'label',
    extra: {
      design: figmaDesign('1408:443'),
      docs: {
        description: {
          story: 'Interactive playground — toggle Background / Variant / Show icon / Icon in the args panel to preview every combination. \`icon\` only renders when \`showIcon = true\`.'
        }
      }
    }
  })
}`,...v.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Canonical gallery enumerating the full \`Background × Variant\` Cartesian — the LifeLock / Desktop slice of the 44-variant Figma master variant set (\`1408:443\`). Cells are grouped per Background and stamp the four transparency stops across each row using the project\\'s \`.l-row\` + \`.l-col\` quartet with \`.sbd-doc__card\` per cell — Label is a fit-content inline molecule and renders at its natural intrinsic width per cell. A trailing band stamps every Background once at \`solid + showIcon=true\` so the optional icon slot is visible across the full surface ladder. **No interaction-state band** — Label is presentation-only (no \`:hover\` / \`:focus-visible\` / \`:active\` paints and no JavaScript). The whole gallery mirrors a single Figma frame, so the canonical link sits at the top of the rendered chrome.'
      }
    },
    design: figmaDesign('1408:443')
  },
  render: () => \`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">\${figmaFrameLink('1408:443', 'Master label')}</p>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Persistent variants — Background × Variant</h2>
        <p class="sbd-doc__section-lede">Cartesian product of every Figma variant axis (11 × 4 = 44 cells). LifeLock / Desktop slice only — sibling Norton / AVG / White-Label duplicates are dropped at scour time. Each row stamps one Background across the four transparency stops; the surface dims while content paint stays opaque.</p>
        \${BACKGROUND_OPTIONS.map(background => \`
            <h3 class="sbd-doc__group-title">Background = \${background}</h3>
            <div class="l-row">
              \${VARIANT_OPTIONS.map(variant => labelCard({
    background,
    variant
  })).join('')}
            </div>
          \`).join('')}
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Leading icon slot — Solid across every Background</h2>
        <p class="sbd-doc__section-lede">Optional 16 × 16 px leading icon (composed via the registered <code>icon</code> partial) painted at <code>solid</code> across the full Background ladder. The icon inherits the label's content paint via <code>currentColor</code> — no per-Background icon-color overrides.</p>
        <div class="l-row">
          \${BACKGROUND_OPTIONS.map(background => labelIconRow(background)).join('')}
        </div>
      </section>
    </div>
  \`
}`,...b.parameters?.docs?.source}}},x=[`Demo`,`AllStyles`]})))()}S();export{b as AllStyles,v as Demo,x as __namedExportsOrder,_ as default};