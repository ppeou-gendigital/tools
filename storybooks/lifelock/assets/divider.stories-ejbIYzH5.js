import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./pretty-source-Cg2Lp3N_.js";import{_ as r,n as i,t as a,v as o}from"./handlebars-helpers-B3QDWh3r.js";import{a as s,n as c,t as l}from"./figma-links-DrHwXaYQ.js";function u(e){return e?`sbd-doc__card-canvas sbd-doc__card-canvas--inverse`:`sbd-doc__card-canvas`}function d({size:e,inverse:t}){let n={...b,layout:`horizontal`,size:e,inverse:t},r=m(n);return`
    <div class="${C} sbd-doc__card">
      <div class="${u(t)}">${r}</div>
      <p class="sbd-doc__card-label">size = ${e}${t?` · inverse`:``}</p>
    </div>
  `}function f({size:e,inverse:t}){let n={...b,layout:`vertical`,size:e,inverse:t},r=m(n);return`
    <div class="${C} sbd-doc__card">
      <div class="${u(t)}" style="${T}">${r}</div>
      <p class="sbd-doc__card-label">size = ${e}${t?` · inverse`:``}</p>
    </div>
  `}function p({size:e,inverse:t,typography:n}){let r={...b,layout:`label`,size:e,inverse:t,typography:n,label:`Or`},i=m(r);return`
    <div class="${w} sbd-doc__card">
      <div class="${u(t)}">${i}</div>
      <p class="sbd-doc__card-label">size = ${e} · ${n}${t?` · inverse`:``}</p>
    </div>
  `}var m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{i(),o(),t(),s(),m=a.default.compile(r),h=[`horizontal`,`vertical`,`label`],g=[`xs`,`s`,`m`,`l`],_=[!1,!0],v=[`body-sm-regular`,`body-sm-semibold`,`body-base-regular`,`body-base-semibold`,`body-lg-regular`,`body-lg-bold`,`h6-medium`,`h5-bold`],y={layout:{control:{type:`inline-radio`},options:h,name:`Layout`,description:"`horizontal` (default) — full-width block rule between stacked content. `vertical` — inline rule sized to parent's cross axis (consumer wraps in a sized container). `label` — horizontal rule with centred text breaking the line."},size:{control:{type:`inline-radio`},options:g,name:`Size`,description:'Rule weight ladder. `xs` (1 px, `--border-width-hairline`) / `s` (2 px, `--border-width-default`, default) / `m` (3 px — literal pixel value, see `./spec.md` § "Notes & open questions") / `l` (4 px, `--border-width-emphasis`).'},inverse:{control:`boolean`,name:`Inverse`,description:"When `true`, swaps the rule paint from `--color-border-strong` (lifelock-green, default) to `--color-border-inverse` (white) for use on dark surfaces."},typography:{control:{type:`select`},options:v,name:`Typography`,description:"Label typography token. Combinatorial only when `layout=label`; inert on `horizontal` / `vertical`. Maps to one of eight LifeLock typography roles (`body-sm-regular` default; `body-sm-semibold`, `body-base-regular`, `body-base-semibold`, `body-lg-regular`, `body-lg-bold`, `h6-medium`, `h5-bold`)."},label:{control:`text`,name:`Label`,description:'Text rendered inside `.c-divider__label`. Default `"Or"` mirrors the most common Figma authoring (between two stacked input groups on a sign-in form). Authors keep this to ≤ 24 characters. Ignored when `layout ∈ {horizontal, vertical}`.'},accessibleLabel:{control:`text`,name:`Accessible label`,description:'Optional override for screen-reader announcement. When set, the root carries `aria-label="…"`; when unset (typical), the root carries `role="separator"` with no explicit name. For `layout=label`, the visible label text is the accessible name without needing this override.'}},b={layout:`horizontal`,size:`s`,inverse:!1,typography:`body-sm-regular`,label:`Or`,accessibleLabel:``},x={title:`Molecules/Divider`,tags:[`autodocs`,`shared-library`],render:e=>m(e),args:b,argTypes:y,parameters:{badges:[`shared`],contentWidth:`fluid`,design:l([[`Divider / Horizontal`,`1344:2031`],[`Divider / Vertical`,`1344:2052`],[`Divider / Label`,`1344:2073`],[`Spec frame`,`1344:2332`]]),docs:{description:{component:"Divider — visual rule molecule for separating sections of content. Mirrors the LifeLock-themed master variant sets on [Web-ODS-Shared-Library → Dividers](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=539-28432&m=dev). One `.c-divider` BEM block folds the three Figma sibling variant sets (`Divider / Horizontal` 8 variants + `Divider / Vertical` 8 variants + `Divider / Label` 64 variants = 80 buildable variants total) onto four orthogonal axes: `layout × size × inverse × typography`. Three layouts share one root: `horizontal` (full-width block rule), `vertical` (inline rule sized to parent's cross axis), and `label` (inline-flex row with centred text breaking the line). Four sizes ladder the rule weight from 1 px hairline to 4 px emphasis; the boolean `inverse` axis swaps the rule paint from `--color-border-strong` to `--color-border-inverse`; the `label` variant adds an eight-typography axis spanning `body-sm-regular` through `h5-bold`. Divider is **stateless** — no `:hover` / `:focus-visible` / `:active` paints and no JavaScript."}}}},S={parameters:n(m(b),{unit:`divider`,extra:{design:l([[`Divider / Horizontal`,`1344:2031`],[`Divider / Vertical`,`1344:2052`],[`Divider / Label`,`1344:2073`]]),docs:{description:{story:"Interactive playground — toggle Layout / Size / Inverse / Typography in the args panel to preview every combination. `label` only renders when `layout=label`; `typography` is inert on `horizontal` / `vertical`. Pick `inverse=true` to preview the dark-surface paint (the Storybook canvas stays light — preview against a dark band by checking the `AllStyles` gallery below)."}}}})},C=`l-col l-col--sm--4 l-col--md--3 l-col--lg--3 l-col--xl--3`,w=`l-col l-col--sm--4 l-col--md--4 l-col--lg--3 l-col--xl--3`,T=`display:flex;align-items:stretch;justify-content:center;block-size:64px;`,E={parameters:{contentWidth:!1,docs:{description:{story:"Canonical gallery enumerating every layout × size × inverse combination across all three Figma sibling sets (`1344:2031` horizontal, `1344:2052` vertical, `1344:2073` label). Three layout-keyed sections stack vertically: Horizontal (4 sizes × 2 inverse = 8 cells), Vertical (4 sizes × 2 inverse = 8 cells), Label (4 sizes × 8 typography = 32 cells, split into two `Inverse = off / on` bands for scannability). **No interaction-state band** — Divider is presentation-only (no `:hover` / `:focus-visible` / `:active` paints and no JavaScript)."}},design:l([[`Divider / Horizontal`,`1344:2031`],[`Divider / Vertical`,`1344:2052`],[`Divider / Label`,`1344:2073`]])},render:()=>`
    <div class="sbd-doc">
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Horizontal — Size × Inverse</h2>
        <p class="sbd-doc__section-figma">${c(`1344:2031`,`Divider / Horizontal`)}</p>
        <p class="sbd-doc__section-lede">Full-width block rule between stacked content. Paints <code>border-block-start</code> on the root, spanning <code>inline-size: 100%</code>.</p>
        <div class="l-row">
          ${_.flatMap(e=>g.map(t=>d({size:t,inverse:e}))).join(``)}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Vertical — Size × Inverse</h2>
        <p class="sbd-doc__section-figma">${c(`1344:2052`,`Divider / Vertical`)}</p>
        <p class="sbd-doc__section-lede">Inline rule sized to its parent's cross axis. Paints <code>border-inline-start</code> on an inline-block root; cards below give each cell an intrinsic 64 px height so the rule paints visibly.</p>
        <div class="l-row">
          ${_.flatMap(e=>g.map(t=>f({size:t,inverse:e}))).join(``)}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Label — Size × Typography (Inverse = off)</h2>
        <p class="sbd-doc__section-figma">${c(`1344:2073`,`Divider / Label`)}</p>
        <p class="sbd-doc__section-lede">Horizontal rule with centred text breaking the line. Two <code>__rule</code> flex children flank a <code>__label</code> span. Eight typography tokens span <code>body-sm-regular</code> through <code>h5-bold</code> — pick the one that matches the surrounding heading hierarchy.</p>
        <div class="l-row">
          ${v.flatMap(e=>g.map(t=>p({size:t,inverse:!1,typography:e}))).join(``)}
        </div>

        <h2 class="sbd-doc__section-title">Label — Size × Typography (Inverse = on)</h2>
        <p class="sbd-doc__section-lede">Same matrix, dark-surface paint. The label text colour inherits the surrounding context — when authoring on a dark surface, ensure the parent context paints content in <code>--color-text-inverse</code> (white) so the label clears WCAG contrast against the dark background.</p>
        <div class="l-row">
          ${v.flatMap(e=>g.map(t=>p({size:t,inverse:!0,typography:e}))).join(``)}
        </div>
      </section>
    </div>
  `},D={args:{layout:`horizontal`,size:`s`,inverse:!1},parameters:n(m({...b,layout:`horizontal`}),{unit:`divider`,extra:{design:l(`1344:2031`),docs:{description:{story:"`Horizontal` layout — full-width block-level horizontal rule between stacked content. Paints `border-block-start` on the root spanning `inline-size: 100%`. The canonical default: paired with `size=s` (2 px, `--border-width-default`) and `inverse=false` (paint = `--color-border-strong`)."}}}})},O={args:{layout:`vertical`,size:`s`,inverse:!1},render:e=>`
    <div style="display:flex;align-items:stretch;block-size:80px;gap:var(--space-4);">
      <div>Left column content</div>
      ${m(e)}
      <div>Right column content</div>
    </div>
  `,parameters:{design:l(`1344:2052`),docs:{description:{story:"`Vertical` layout — inline-block rule sized to its parent's cross axis. Paints `border-inline-start` on an inline-block root; consumers wrap in a flex row with `align-items: stretch` (and either a fixed `block-size` or content-driven intrinsic height) so the divider sizes correctly. This story's render wraps the divider in a fixed 80 px height row so the rule paints visibly between two placeholder columns."}}}},k={args:{layout:`label`,size:`s`,inverse:!1,typography:`body-sm-regular`,label:`Or`},parameters:n(m({...b,layout:`label`}),{unit:`divider`,extra:{design:l(`1344:2073`),docs:{description:{story:'`Label` layout — horizontal rule with centred text breaking the line. Two `.c-divider__rule` flex children flank `.c-divider__label`; the rule spans share remaining inline space symmetrically via `flex: 1 1 0`. Default label text `"Or"` mirrors the most common Figma authoring (between two stacked input groups on a sign-in form). Authors override the label via the `label` prop and the typography via the `typography` prop.'}}}})},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:"{\n  parameters: htmlStoryParameters(compiled(defaultArgs), {\n    unit: 'divider',\n    extra: {\n      design: figmaDesign([['Divider / Horizontal', '1344:2031'], ['Divider / Vertical', '1344:2052'], ['Divider / Label', '1344:2073']]),\n      docs: {\n        description: {\n          story: 'Interactive playground — toggle Layout / Size / Inverse / Typography in the args panel to preview every combination. `label` only renders when `layout=label`; `typography` is inert on `horizontal` / `vertical`. Pick `inverse=true` to preview the dark-surface paint (the Storybook canvas stays light — preview against a dark band by checking the `AllStyles` gallery below).'\n        }\n      }\n    }\n  })\n}",...S.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  parameters: {
    contentWidth: false,
    docs: {
      description: {
        story: 'Canonical gallery enumerating every layout × size × inverse combination across all three Figma sibling sets (\`1344:2031\` horizontal, \`1344:2052\` vertical, \`1344:2073\` label). Three layout-keyed sections stack vertically: Horizontal (4 sizes × 2 inverse = 8 cells), Vertical (4 sizes × 2 inverse = 8 cells), Label (4 sizes × 8 typography = 32 cells, split into two \`Inverse = off / on\` bands for scannability). **No interaction-state band** — Divider is presentation-only (no \`:hover\` / \`:focus-visible\` / \`:active\` paints and no JavaScript).'
      }
    },
    design: figmaDesign([['Divider / Horizontal', '1344:2031'], ['Divider / Vertical', '1344:2052'], ['Divider / Label', '1344:2073']])
  },
  render: () => \`
    <div class="sbd-doc">
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Horizontal — Size × Inverse</h2>
        <p class="sbd-doc__section-figma">\${figmaFrameLink('1344:2031', 'Divider / Horizontal')}</p>
        <p class="sbd-doc__section-lede">Full-width block rule between stacked content. Paints <code>border-block-start</code> on the root, spanning <code>inline-size: 100%</code>.</p>
        <div class="l-row">
          \${INVERSE_OPTIONS.flatMap(inverse => SIZE_OPTIONS.map(size => horizontalCard({
    size,
    inverse
  }))).join('')}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Vertical — Size × Inverse</h2>
        <p class="sbd-doc__section-figma">\${figmaFrameLink('1344:2052', 'Divider / Vertical')}</p>
        <p class="sbd-doc__section-lede">Inline rule sized to its parent's cross axis. Paints <code>border-inline-start</code> on an inline-block root; cards below give each cell an intrinsic 64 px height so the rule paints visibly.</p>
        <div class="l-row">
          \${INVERSE_OPTIONS.flatMap(inverse => SIZE_OPTIONS.map(size => verticalCard({
    size,
    inverse
  }))).join('')}
        </div>
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Label — Size × Typography (Inverse = off)</h2>
        <p class="sbd-doc__section-figma">\${figmaFrameLink('1344:2073', 'Divider / Label')}</p>
        <p class="sbd-doc__section-lede">Horizontal rule with centred text breaking the line. Two <code>__rule</code> flex children flank a <code>__label</code> span. Eight typography tokens span <code>body-sm-regular</code> through <code>h5-bold</code> — pick the one that matches the surrounding heading hierarchy.</p>
        <div class="l-row">
          \${TYPOGRAPHY_OPTIONS.flatMap(typography => SIZE_OPTIONS.map(size => labelCard({
    size,
    inverse: false,
    typography
  }))).join('')}
        </div>

        <h2 class="sbd-doc__section-title">Label — Size × Typography (Inverse = on)</h2>
        <p class="sbd-doc__section-lede">Same matrix, dark-surface paint. The label text colour inherits the surrounding context — when authoring on a dark surface, ensure the parent context paints content in <code>--color-text-inverse</code> (white) so the label clears WCAG contrast against the dark background.</p>
        <div class="l-row">
          \${TYPOGRAPHY_OPTIONS.flatMap(typography => SIZE_OPTIONS.map(size => labelCard({
    size,
    inverse: true,
    typography
  }))).join('')}
        </div>
      </section>
    </div>
  \`
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    layout: 'horizontal',
    size: 's',
    inverse: false
  },
  parameters: htmlStoryParameters(compiled({
    ...defaultArgs,
    layout: 'horizontal'
  }), {
    unit: 'divider',
    extra: {
      design: figmaDesign('1344:2031'),
      docs: {
        description: {
          story: '\`Horizontal\` layout — full-width block-level horizontal rule between stacked content. Paints \`border-block-start\` on the root spanning \`inline-size: 100%\`. The canonical default: paired with \`size=s\` (2 px, \`--border-width-default\`) and \`inverse=false\` (paint = \`--color-border-strong\`).'
        }
      }
    }
  })
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    layout: 'vertical',
    size: 's',
    inverse: false
  },
  render: args => \`
    <div style="display:flex;align-items:stretch;block-size:80px;gap:var(--space-4);">
      <div>Left column content</div>
      \${compiled(args)}
      <div>Right column content</div>
    </div>
  \`,
  parameters: {
    design: figmaDesign('1344:2052'),
    docs: {
      description: {
        story: '\`Vertical\` layout — inline-block rule sized to its parent\\'s cross axis. Paints \`border-inline-start\` on an inline-block root; consumers wrap in a flex row with \`align-items: stretch\` (and either a fixed \`block-size\` or content-driven intrinsic height) so the divider sizes correctly. This story\\'s render wraps the divider in a fixed 80 px height row so the rule paints visibly between two placeholder columns.'
      }
    }
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    layout: 'label',
    size: 's',
    inverse: false,
    typography: 'body-sm-regular',
    label: 'Or'
  },
  parameters: htmlStoryParameters(compiled({
    ...defaultArgs,
    layout: 'label'
  }), {
    unit: 'divider',
    extra: {
      design: figmaDesign('1344:2073'),
      docs: {
        description: {
          story: '\`Label\` layout — horizontal rule with centred text breaking the line. Two \`.c-divider__rule\` flex children flank \`.c-divider__label\`; the rule spans share remaining inline space symmetrically via \`flex: 1 1 0\`. Default label text \`"Or"\` mirrors the most common Figma authoring (between two stacked input groups on a sign-in form). Authors override the label via the \`label\` prop and the typography via the \`typography\` prop.'
        }
      }
    }
  })
}`,...k.parameters?.docs?.source}}},A=[`Demo`,`AllStyles`,`Horizontal`,`Vertical`,`Label`]})))()}j();export{E as AllStyles,S as Demo,D as Horizontal,k as Label,O as Vertical,A as __namedExportsOrder,x as default};