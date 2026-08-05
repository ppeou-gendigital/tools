import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{B as t,i as n,n as r,r as i,t as a,z as o}from"./pretty-source-BkPpK8QA.js";import{n as s,r as c,t as l}from"./figma-links-B0HkTJ7d.js";function u(e){return e===`dark`?`sbd-doc__stack-item-canvas sbd-doc__stack-item-canvas--inverse`:`sbd-doc__stack-item-canvas`}function d({layout:e,theme:t,value:n,showLabel:r=!0}){let i={...b,layout:e,theme:t,value:n,showLabel:r,label:r?`${n}%`:``,accessibleLabel:r?``:`${n} percent`},a=p(i);return`
    <div class="sbd-doc__stack-item">
      <p class="sbd-doc__stack-item-label">layout = ${e} · theme = ${t} · value = ${n}%${r?``:` · showLabel = false`}</p>
      <div class="${u(t)}">${a}</div>
    </div>
  `}function f({size:e,theme:t,value:n,showLabel:r=!0}){let i={...b,layout:`circular`,size:e,theme:t,value:n,showLabel:r,label:``,accessibleLabel:`${n} percent`},a=p(i);return`
    <div class="sbd-doc__stack-item">
      <p class="sbd-doc__stack-item-label">size = ${e} · theme = ${t} · value = ${n}%${r?``:` · showLabel = false`}</p>
      <div class="${u(t)}" style="display: flex; align-items: center; justify-content: center; min-block-size: 288px;">${a}</div>
    </div>
  `}var p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{n(),o(),r(),c(),p=i.default.compile(t),m=[`inline`,`stacked`,`circular`],h=[`inline`,`stacked`],g=[`light`,`dark`],_=[0,25,50,75,100],v=[`xs`,`sm`,`md`,`lg`,`xxl`],y={layout:{control:{type:`inline-radio`},options:m,name:`Layout`,description:"`inline` — *linear*. Label sits to the inline-start of the track on one row, separated by `var(--space-4)` (12 px). `stacked` (default, *linear*) — label sits above the track on its own row, separated by `var(--space-2)` (4 px). `circular` — a ring drawn with two SVG circles; the optional inner value text renders `<n>%` at the centre. The `Size` axis kicks in for the circular layout."},size:{control:{type:`inline-radio`},options:v,name:`Size (circular only)`,description:"`xs` 16 px / `sm` 24 px / `md` (default) 48 px / `lg` 96 px / `xxl` 256 px. Mirrors the LifeLock sticker sheet stamps verbatim. Ignored when `layout` is `inline` or `stacked` (linear layouts are fluid `inline-size: 100%`). At `xs` the inner value text is hidden regardless of `Show label`; at `sm` the digits show but the `%` unit is hidden — both mirror the Figma sticker sheet.",table:{category:`Circular layout`},if:{arg:`layout`,eq:`circular`}},theme:{control:{type:`inline-radio`},options:g,name:`Theme`,description:'`light` (default) — label paints `var(--color-text-primary)` (LifeLock dark-green); intended for use on neutral / light surfaces. `dark` — label paints `var(--color-text-inverse)` (white); intended for use on dark page surfaces. Track + fill paint values are identical across both themes today; see `./spec.md` § "Notes & open questions" for the dark-surface paint Designer Follow-Up.'},value:{control:{type:`range`,min:0,max:100,step:1},name:`Progress`,description:"`0`-`100` inclusive (clamped). Written into the inline `--progress-indicator-value` custom property on the root; the SCSS sizes `.c-progress-indicator__fill` via `flex-basis: calc(var(--progress-indicator-value) * 1%)`."},label:{control:`text`,name:`Label`,description:'Plain text rendered inside `.c-progress-indicator__label`. The SCSS applies `text-transform: uppercase` so mixed-case input still renders as ALL CAPS. Authors should keep this short (typical: a single word like "UPLOADING" or "STEP 2 OF 4").'},showLabel:{control:`boolean`,name:`Show label`,description:"When `false` (or `label` is empty), the `.c-progress-indicator__label` slot is omitted entirely so the layout gap collapses and the track paints alone. Useful for compact contexts where surrounding UI already names the operation."},accessibleLabel:{control:`text`,name:`Accessible label`,description:"Optional `aria-label` attached to the root when `showLabel=false`. When the visible label is shown, the label node carries an `id` and the root carries `aria-labelledby` instead — no `accessibleLabel` is needed."},valueMin:{control:{type:`number`},name:`aria-valuemin`,description:`ARIA value-min; defaults to 0.`},valueMax:{control:{type:`number`},name:`aria-valuemax`,description:`ARIA value-max; defaults to 100.`}},b={layout:`stacked`,size:`md`,theme:`light`,value:50,label:`Label`,showLabel:!0,accessibleLabel:``,valueMin:0,valueMax:100},x={title:`Molecules/Progress indicator`,tags:[`autodocs`,`shared-library`],render:e=>p(e),args:b,argTypes:y,parameters:{badges:[`shared`],contentWidth:`fluid`,design:l(`1380:1255`),docs:{description:{component:'Progress indicator — determinate progress affordance with three layouts that share one BEM root (`.c-progress-indicator`). The two **linear** layouts (`inline` / `stacked`) mirror the [Web-ODS Shared Library Linear master variant set](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1380-1255&m=dev) and its [`Progress indicator — Overview`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1380-1478&m=dev) Spec Frame at `1380:1478`; the **circular** layout mirrors the [LifeLock-mode `.Sticker Sheets/progress-indicator/LifeLock`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=615-80630&m=dev) sibling at `615:80630` (five discrete sizes: xs / sm / md / lg / xxl). Two themes overlay every layout (`light` / `dark`). The track / ring track paints `var(--color-neutral-30)`; the fill / ring fill paints `var(--color-off-black)`. The fill sizes via a CSS custom property the consumer writes to the root (`--progress-indicator-value`, 0-100); the circular ring-fill\'s `<circle>` ships `pathLength="100"` so the same property feeds `stroke-dasharray` directly with no JavaScript. The component is **stateless** — no `:hover` / `:focus-visible` / `:active` paints, no JavaScript — and exposes the live value to assistive technologies via `role="progressbar"` + `aria-valuenow/min/max`. See `./spec.md` § "Notes & open questions" for the Designer Follow-Ups documenting the LifeLock-mode mismatch on the canonical Linear Figma source.'}}}},S={parameters:a(p(b),{unit:`progress-indicator`,extra:{design:l(`1380:1255`),docs:{description:{story:"Interactive playground — toggle Layout / Theme / Progress / Show label / Label in the args panel to preview every combination. The Progress slider drives the inline `--progress-indicator-value` custom property on the root; the fill resizes continuously."}}}})},C=e=>`<h3 class="sbd-doc__group-title">${e}</h3>`,w={parameters:{contentWidth:`fluid`,docs:{description:{story:"Canonical gallery enumerating the persistent variant axes for both layout families. **Linear band** — `Layout × Theme × {Progress 0/25/50/75/100}` plus a sibling label-omitted row, mirrored from the LifeLock / Desktop slice of the Figma Linear master variant set (`1380:1255`). **Circular band** — `Size × Theme × {Progress 25/75}` plus a sibling `showLabel=false` row, mirrored from the LifeLock-mode sticker sheet (`615:80630`). **No interaction-state band** — Progress indicator is presentation-only (no `:hover` / `:focus-visible` / `:active` paints, no JavaScript). Dark-theme cells render on a `--color-bg-inverse-strong` card so the label / value paint is visible against a representative surface."}},design:l(`1380:1255`)},render:()=>`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">${s(`1380:1255`,`Progress indicator — Linear master`)} · ${s(`615:80630`,`Progress indicator — Circular (LifeLock sticker sheet)`)}</p>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Linear — Layout × Theme × Progress</h2>
        <p class="sbd-doc__section-lede">Cartesian of the Figma Linear master variant set. Progress is a continuous 0-100 axis; this gallery samples the same five stamps the Figma master previews (0 / 25 / 50 / 75 / 100). Each cell stretches to the full stack-item inline-size — the linear layouts are fluid.</p>

        ${h.flatMap(e=>g.map(t=>`
              ${C(`Layout = ${e} · Theme = ${t}`)}
              <div class="sbd-doc__stack">
                ${_.map(n=>d({layout:e,theme:t,value:n})).join(``)}
              </div>
            `)).join(``)}

        ${C(`Label omitted (showLabel = false)`)}
        <div class="sbd-doc__stack">
          ${h.flatMap(e=>g.map(t=>d({layout:e,theme:t,value:70,showLabel:!1}))).join(``)}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Circular — Size × Theme × Progress</h2>
        <p class="sbd-doc__section-lede">Cartesian of the LifeLock-mode Circular sticker sheet. Sizes mirror the five Figma stamps (XS 16 px · SM 24 px · MD 48 px · LG 96 px · XXL 256 px). Two progress stamps (25 / 75) mirror the same Figma sticker sheet (full-circle 0 / 100 are corner cases that read as an empty ring or a full ring respectively). The XS size renders without inner text; the SM size renders the digits but hides the <code>%</code> unit — both per the Figma sticker sheet.</p>

        ${g.map(e=>`
            ${C(`Theme = ${e} · value = 25 %`)}
            <div class="sbd-doc__stack">
              ${v.map(t=>f({size:t,theme:e,value:25})).join(``)}
            </div>

            ${C(`Theme = ${e} · value = 75 %`)}
            <div class="sbd-doc__stack">
              ${v.map(t=>f({size:t,theme:e,value:75})).join(``)}
            </div>
          `).join(``)}

        ${C(`Label omitted (showLabel = false)`)}
        <div class="sbd-doc__stack">
          ${g.flatMap(e=>[`sm`,`md`,`lg`].map(t=>f({size:t,theme:e,value:60,showLabel:!1}))).join(``)}
        </div>
      </section>
    </div>
  `},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compiled(defaultArgs), {
    unit: 'progress-indicator',
    extra: {
      design: figmaDesign('1380:1255'),
      docs: {
        description: {
          story: 'Interactive playground — toggle Layout / Theme / Progress / Show label / Label in the args panel to preview every combination. The Progress slider drives the inline \`--progress-indicator-value\` custom property on the root; the fill resizes continuously.'
        }
      }
    }
  })
}`,...S.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  parameters: {
    contentWidth: 'fluid',
    docs: {
      description: {
        story: 'Canonical gallery enumerating the persistent variant axes for both layout families. **Linear band** — \`Layout × Theme × {Progress 0/25/50/75/100}\` plus a sibling label-omitted row, mirrored from the LifeLock / Desktop slice of the Figma Linear master variant set (\`1380:1255\`). **Circular band** — \`Size × Theme × {Progress 25/75}\` plus a sibling \`showLabel=false\` row, mirrored from the LifeLock-mode sticker sheet (\`615:80630\`). **No interaction-state band** — Progress indicator is presentation-only (no \`:hover\` / \`:focus-visible\` / \`:active\` paints, no JavaScript). Dark-theme cells render on a \`--color-bg-inverse-strong\` card so the label / value paint is visible against a representative surface.'
      }
    },
    design: figmaDesign('1380:1255')
  },
  render: () => \`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">\${figmaFrameLink('1380:1255', 'Progress indicator — Linear master')} · \${figmaFrameLink('615:80630', 'Progress indicator — Circular (LifeLock sticker sheet)')}</p>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Linear — Layout × Theme × Progress</h2>
        <p class="sbd-doc__section-lede">Cartesian of the Figma Linear master variant set. Progress is a continuous 0-100 axis; this gallery samples the same five stamps the Figma master previews (0 / 25 / 50 / 75 / 100). Each cell stretches to the full stack-item inline-size — the linear layouts are fluid.</p>

        \${LINEAR_LAYOUTS.flatMap(layout => THEME_OPTIONS.map(theme => \`
              \${STACK_GROUP_TITLE(\`Layout = \${layout} · Theme = \${theme}\`)}
              <div class="sbd-doc__stack">
                \${PROGRESS_STAMPS.map(value => progressStackItem({
    layout,
    theme,
    value
  })).join('')}
              </div>
            \`)).join('')}

        \${STACK_GROUP_TITLE('Label omitted (showLabel = false)')}
        <div class="sbd-doc__stack">
          \${LINEAR_LAYOUTS.flatMap(layout => THEME_OPTIONS.map(theme => progressStackItem({
    layout,
    theme,
    value: 70,
    showLabel: false
  }))).join('')}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Circular — Size × Theme × Progress</h2>
        <p class="sbd-doc__section-lede">Cartesian of the LifeLock-mode Circular sticker sheet. Sizes mirror the five Figma stamps (XS 16 px · SM 24 px · MD 48 px · LG 96 px · XXL 256 px). Two progress stamps (25 / 75) mirror the same Figma sticker sheet (full-circle 0 / 100 are corner cases that read as an empty ring or a full ring respectively). The XS size renders without inner text; the SM size renders the digits but hides the <code>%</code> unit — both per the Figma sticker sheet.</p>

        \${THEME_OPTIONS.map(theme => \`
            \${STACK_GROUP_TITLE(\`Theme = \${theme} · value = 25 %\`)}
            <div class="sbd-doc__stack">
              \${CIRCULAR_SIZE_OPTIONS.map(size => circularStackItem({
    size,
    theme,
    value: 25
  })).join('')}
            </div>

            \${STACK_GROUP_TITLE(\`Theme = \${theme} · value = 75 %\`)}
            <div class="sbd-doc__stack">
              \${CIRCULAR_SIZE_OPTIONS.map(size => circularStackItem({
    size,
    theme,
    value: 75
  })).join('')}
            </div>
          \`).join('')}

        \${STACK_GROUP_TITLE('Label omitted (showLabel = false)')}
        <div class="sbd-doc__stack">
          \${THEME_OPTIONS.flatMap(theme => ['sm', 'md', 'lg'].map(size => circularStackItem({
    size,
    theme,
    value: 60,
    showLabel: false
  }))).join('')}
        </div>
      </section>
    </div>
  \`
}`,...w.parameters?.docs?.source}}},T=[`Demo`,`AllStyles`]})))()}E();export{w as AllStyles,S as Demo,T as __namedExportsOrder,x as default};