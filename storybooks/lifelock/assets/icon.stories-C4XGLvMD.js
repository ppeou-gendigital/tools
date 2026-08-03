import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./pretty-source-Cg2Lp3N_.js";import{C as r,n as i,t as a,w as o}from"./handlebars-helpers-B3QDWh3r.js";import{i as s,n as c}from"./_icon-catalog-CFuVgluW.js";import{a as l,n as u,t as d}from"./figma-links-DrHwXaYQ.js";function f(e){return(e.split(`/`).pop()||``).startsWith(`detailed-`)?`48`:`24`}function p({name:e,color:t}){return`
    <div class="${t===`inverse`?`${O} sbd-doc__card sbd-doc__card--dark`:`${O} sbd-doc__card`}">
      <div class="sbd-doc__card-canvas">${v({name:e,size:f(e),color:t,frame:`none`,decorative:!0,accessibleLabel:``})}</div>
      <p class="sbd-doc__card-label">${e}</p>
    </div>
  `}function m(e){return`
    <div class="${k} sbd-doc__card">
      <div class="sbd-doc__card-canvas">${v(e)}</div>
      <p class="sbd-doc__card-label">size-${e.size}</p>
    </div>
  `}function h(e){return`
    <div class="${I.has(e)?`${k} sbd-doc__card sbd-doc__card--dark`:`${k} sbd-doc__card`}">
      <div class="sbd-doc__card-canvas">${v({name:M,size:`32`,color:e,frame:`none`,decorative:!0,accessibleLabel:``})}</div>
      <p class="sbd-doc__card-label">${e}</p>
    </div>
  `}function g(e,t){let n=B[e]??`actions/simple-add`,r=v({name:n,size:t,color:`default`,frame:e,decorative:!0,accessibleLabel:``}),i=V[e]?.[t]??``;return`
    <div class="${k} sbd-doc__card">
      <div class="sbd-doc__card-canvas">
        <span class="sbd-doc__bbox">${r}</span>
      </div>
      <p class="sbd-doc__card-label">${e} — ${t}px</p>
      <p class="sbd-doc__card-meta">${i}</p>
    </div>
  `}function _(e){let t=B[e]??A,n=v({name:t,size:`48`,color:`default`,frame:e,decorative:!0,accessibleLabel:``});return`
    <div class="${k} sbd-doc__card">
      <div class="sbd-doc__card-canvas">
        <span class="sbd-doc__bbox">${n}</span>
      </div>
      <p class="sbd-doc__card-label">${e}</p>
    </div>
  `}var v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{i(),o(),s(),t(),l(),v=a.default.compile(r),y=[`16`,`20`,`24`,`32`,`48`],b=[`40`,`48`,`64`,`72`,`80`,`96`,`144`],x=[`16`,`20`,`24`,`32`,`40`,`48`,`64`,`72`,`80`,`96`,`144`],S=[`current`,`default`,`brand`,`accent`,`inverse`,`success`,`critical`],C=[`none`,`square`,`circle`,`vertical-rectangle`,`horizontal-rectangle`],w={name:{control:`select`,options:c,name:`Name`,description:"Catalog key — `<category>/<simple|detailed>-<name>`."},size:{control:`select`,options:x,name:`Size`,description:"Pixel-fit sizes: `simple-*` → 16 / 20 / 24 / 32 / 48; `detailed-*` → 40 / 48 / 64 / 72 / 80 / 96 / 144. `48` is shared between the two bands."},color:{control:`select`,options:S,name:`Color`,description:"`current` inherits from the parent context; the rest pin to a semantic token."},frame:{control:`select`,options:C,name:`Frame`,description:"Transparent positioning envelope that shrinks the painted glyph to a smaller inner shape via `mask-clip: content-box`. `none` paints edge-to-edge."},decorative:{control:`boolean`,name:`Decorative`,description:'`true` adds `aria-hidden="true"`. `false` adds `role="img"` + `aria-label` and requires Accessible label.'},accessibleLabel:{control:`text`,name:`Accessible label`,description:`Required when Decorative is unchecked.`,if:{arg:`decorative`,truthy:!1}}},T={name:`actions/simple-add`,size:`24`,color:`current`,frame:`none`,decorative:!0,accessibleLabel:``},E={title:`Molecules/Icon`,tags:[`autodocs`,`shared-library`],render:e=>v(e),args:T,argTypes:w,parameters:{badges:[`shared`],contentWidth:`fluid`,design:d(`990:1808`),docs:{description:{component:["Icon — mask-image + currentColor primitive mirrored from [Web-ODS Shared Library : `.Sticker Sheet / Icon mask wrapper`](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=990-1808&m=dev). The catalog of SVG assets the component paints is the separate iconography token (Web-ODS-Icons / `2:2583`); only the `THEME=LifeLock` symbol of each icon is extracted into `storybook-lifelock/assets/icons/`. See `./spec.md` for the full property contract, accessibility notes, and consumer guidance.",``,`### Meaningful vs decorative`,``,"Two accessibility postures, controlled by the `decorative` prop:",``,'- **`decorative=true` (default)** — emits `aria-hidden="true"`. Use this whenever the icon is paired with adjacent visible text that already names it (e.g. a "Search" button where the word "Search" is in the DOM). Assistive tech skips the icon so the announcement stays single-voiced.','- **`decorative=false`** — emits `role="img"` + `aria-label="<accessibleLabel>"`. Use this only when the icon is the sole carrier of meaning (e.g. an icon-only button). `accessibleLabel` is required.',``,"The args panel hides the `Accessible label` field unless `Decorative` is unchecked; consumers integrating Icon directly must enforce this constraint themselves."].join(`
`)}}}},D={parameters:n(v(T),{unit:`icon`,extra:{design:d(`990:1808`),docs:{description:{story:`Interactive playground — toggle the controls in the args panel to preview any cell of the variant matrix. Defaults match the spec's first canonical example.`}}}})},O=`l-col l-col--sm--2 l-col--md--2 l-col--lg--2 l-col--xl--2`,k=`l-col l-col--sm--2 l-col--md--3 l-col--lg--3 l-col--xl--3`,A=`actions/simple-add`,j={parameters:{docs:{description:{story:'Canonical gallery per the AllStyles convention (`.cursor/rules/storybook-conventions.mdc` § "AllStyles story"). Walks every catalog entry × `color` role at a representative pixel-fit size (`24` for `simple-*` glyphs, `48` for `detailed-*` glyphs), plus the full `frame` axis on a single sample glyph. The LifeLock / Desktop slice of the Web-ODS Shared Library + Web-ODS-Icons matrix; sibling brand modes are dropped at scour time. Icons are stateless presentation primitives (no hover / focus / pressed / disabled paint of their own), so the band-2 interaction-state freezes are skipped per the per-component-type firing rules in `storybook-conventions.mdc`. Single canonical Figma frame (`990:1808`) — the link sits at the top of the rendered chrome rather than per section.'}},design:d(`990:1808`)},render:()=>`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">${u(`990:1808`,`Icon mask wrapper`)}</p>
      ${S.map(e=>`
          <section class="sbd-doc__section">
            <h2 class="sbd-doc__section-title">Color role — ${e}</h2>
            <p class="sbd-doc__section-lede">Every catalog entry rendered with <code>color=${e}</code> at its representative pixel-fit size. <code>simple-*</code> glyphs render at <code>24px</code>; <code>detailed-*</code> glyphs render at <code>48px</code>.${e===`inverse`?` Cards switch to a dark surface so the inverse mask is legible.`:``}${e===`current`?` <code>current</code> inherits from the parent card text colour — here, the card label's muted slate.`:``}</p>
            <div class="l-row">
              ${c.map(t=>p({name:t,color:e})).join(``)}
            </div>
          </section>
        `).join(``)}

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Frame axis — sample glyph at 48 × 48</h2>
        <p class="sbd-doc__section-lede">The full <code>frame</code> axis (<code>none</code> · <code>square</code> · <code>circle</code> · <code>vertical-rectangle</code> · <code>horizontal-rectangle</code>) on a representative glyph per frame shape. Frame shrinks the painted glyph to a smaller inner shape via <code>mask-clip: content-box</code>; the outer <code>--icon-size</code> box stays fixed at 48 × 48. The tinted box traces the outer box so the envelope gap reads clearly.</p>
        <div class="l-row">
          ${C.map(_).join(``)}
        </div>
      </section>
    </div>
  `},M=`actions/simple-add`,N=`help-support/detailed-help`,P={parameters:{docs:{description:{story:"Simple-band icons are pixel-fit at 16 / 20 / 24 / 32 / 48. Pair `simple-*` ids with these sizes to preserve the design intent (mixing bands works but loses the pixel grid). 48 is the shared rung with the detailed band."}}},render:()=>`
    <div class="sbd-doc">
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Simple band — 16 / 20 / 24 / 32 / 48</h2>
        <p class="sbd-doc__section-lede">Renders <code>${M}</code> at each pixel-fit size in the simple band.</p>
        <div class="l-row">
          ${y.map(e=>m({name:M,size:e,color:`default`,frame:`none`,decorative:!0,accessibleLabel:``})).join(``)}
        </div>
      </section>
    </div>
  `},F={parameters:{docs:{description:{story:"Detailed-band icons carry more line work and are pixel-fit at 40 / 48 / 64 / 72 / 80 / 96 / 144. Pair `detailed-*` ids with these sizes."}}},render:()=>`
    <div class="sbd-doc">
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Detailed band — 40 / 48 / 64 / 72 / 80 / 96 / 144</h2>
        <p class="sbd-doc__section-lede">Renders <code>${N}</code> at each pixel-fit size in the detailed band.</p>
        <div class="l-row">
          ${b.map(e=>m({name:N,size:e,color:`default`,frame:`none`,decorative:!0,accessibleLabel:``})).join(``)}
        </div>
      </section>
    </div>
  `},I=new Set([`inverse`]),L={parameters:{docs:{description:{story:"Every Color role from the Color axis. `current` inherits from the parent (here the gallery card text), `inverse` only makes sense on a dark surface — shown on a dark card to match."}}},render:()=>`
    <div class="sbd-doc">
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Color roles</h2>
        <p class="sbd-doc__section-lede">Seven roles, paired with the same glyph at size 32 so only the colour changes.</p>
        <div class="l-row">
          ${S.map(h).join(``)}
        </div>
      </section>
    </div>
  `},R=C.filter(e=>e!==`none`),z=[`24`,`48`],B={square:`generic/simple-view-grid`,circle:`status/simple-info`,"vertical-rectangle":`devices-hardware/simple-device-phone`,"horizontal-rectangle":`finance/simple-credit-card`},V={square:{24:`18 × 18 inner`,48:`36 × 36 inner`},circle:{24:`20 × 20 inner`,48:`40 × 40 inner`},"vertical-rectangle":{24:`20 × 16 inner`,48:`40 × 32 inner`},"horizontal-rectangle":{24:`16 × 20 inner`,48:`32 × 40 inner`}},H={parameters:{docs:{description:{story:"Four transparent positioning envelopes (square / circle / vertical-rectangle / horizontal-rectangle) at 24 × 24 and 48 × 48, mirroring Figma `Web-ODS-Icons / 2:1318` Section 2. Each frame shrinks the painted glyph to a smaller inner shape via `mask-clip: content-box`; the outer box stays at `--icon-size`. Glyph choice is intentional: a grid for `square`, an info circle for `circle`, a portrait phone for `vertical-rectangle`, and a landscape credit card for `horizontal-rectangle` — each silhouette echoes the conceptual frame shape. The tinted box traces the outer `--icon-size` box so the gap between the painted glyph and the envelope edges is visible; in production no such background exists — the frame is layout only."}}},render:()=>`
    <div class="sbd-doc">
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Frame envelopes — 24 × 24 and 48 × 48</h2>
        <p class="sbd-doc__section-lede">Each card pairs the frame with a glyph chosen to echo its shape. The tinted box traces the outer <code>--icon-size</code> box; the gap between glyph and box is the frame envelope.</p>
        <div class="l-row">
          ${R.flatMap(e=>z.map(t=>g(e,t))).join(``)}
        </div>
      </section>
    </div>
  `},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compiled(defaultArgs), {
    unit: 'icon',
    extra: {
      design: figmaDesign('990:1808'),
      docs: {
        description: {
          story: 'Interactive playground — toggle the controls in the args panel to preview any cell of the variant matrix. Defaults match the spec\\'s first canonical example.'
        }
      }
    }
  })
}`,...D.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  parameters: {
    // Documentation gallery — inherits the meta's \`contentWidth: 'fluid'\`
    // so the \`.l-fluid-width\` parent (supplied by \`contentWidthDecorator\`)
    // paints the same band-aware outer padding + XL cap as production
    // layouts. Card grids below use the project's \`.l-row\` + \`.l-col\`
    // quartet, not Storybook-specific chrome.
    docs: {
      description: {
        story: 'Canonical gallery per the AllStyles convention (\`.cursor/rules/storybook-conventions.mdc\` § "AllStyles story"). Walks every catalog entry × \`color\` role at a representative pixel-fit size (\`24\` for \`simple-*\` glyphs, \`48\` for \`detailed-*\` glyphs), plus the full \`frame\` axis on a single sample glyph. The LifeLock / Desktop slice of the Web-ODS Shared Library + Web-ODS-Icons matrix; sibling brand modes are dropped at scour time. Icons are stateless presentation primitives (no hover / focus / pressed / disabled paint of their own), so the band-2 interaction-state freezes are skipped per the per-component-type firing rules in \`storybook-conventions.mdc\`. Single canonical Figma frame (\`990:1808\`) — the link sits at the top of the rendered chrome rather than per section.'
      }
    },
    design: figmaDesign('990:1808')
  },
  render: () => \`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">\${figmaFrameLink('990:1808', 'Icon mask wrapper')}</p>
      \${COLOR_OPTIONS.map(color => \`
          <section class="sbd-doc__section">
            <h2 class="sbd-doc__section-title">Color role — \${color}</h2>
            <p class="sbd-doc__section-lede">Every catalog entry rendered with <code>color=\${color}</code> at its representative pixel-fit size. <code>simple-*</code> glyphs render at <code>24px</code>; <code>detailed-*</code> glyphs render at <code>48px</code>.\${color === 'inverse' ? ' Cards switch to a dark surface so the inverse mask is legible.' : ''}\${color === 'current' ? ' <code>current</code> inherits from the parent card text colour — here, the card label\\'s muted slate.' : ''}</p>
            <div class="l-row">
              \${ICON_NAMES.map(name => allStylesIconCard({
    name,
    color
  })).join('')}
            </div>
          </section>
        \`).join('')}

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Frame axis — sample glyph at 48 × 48</h2>
        <p class="sbd-doc__section-lede">The full <code>frame</code> axis (<code>none</code> · <code>square</code> · <code>circle</code> · <code>vertical-rectangle</code> · <code>horizontal-rectangle</code>) on a representative glyph per frame shape. Frame shrinks the painted glyph to a smaller inner shape via <code>mask-clip: content-box</code>; the outer <code>--icon-size</code> box stays fixed at 48 × 48. The tinted box traces the outer box so the envelope gap reads clearly.</p>
        <div class="l-row">
          \${FRAME_OPTIONS.map(allStylesFrameCard).join('')}
        </div>
      </section>
    </div>
  \`
}`,...j.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  parameters: {
    // Inherits the meta's \`contentWidth: 'fluid'\`; outer chrome from
    // \`.l-fluid-width\`, inner card grid from \`.l-row\` + \`.l-col\`.
    docs: {
      description: {
        story: 'Simple-band icons are pixel-fit at 16 / 20 / 24 / 32 / 48. Pair \`simple-*\` ids with these sizes to preserve the design intent (mixing bands works but loses the pixel grid). 48 is the shared rung with the detailed band.'
      }
    }
  },
  render: () => \`
    <div class="sbd-doc">
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Simple band — 16 / 20 / 24 / 32 / 48</h2>
        <p class="sbd-doc__section-lede">Renders <code>\${PLAYGROUND_SIMPLE_NAME}</code> at each pixel-fit size in the simple band.</p>
        <div class="l-row">
          \${SIMPLE_SIZES.map(size => sizeCard({
    name: PLAYGROUND_SIMPLE_NAME,
    size,
    color: 'default',
    frame: 'none',
    decorative: true,
    accessibleLabel: ''
  })).join('')}
        </div>
      </section>
    </div>
  \`
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  parameters: {
    // Inherits the meta's \`contentWidth: 'fluid'\`; outer chrome from
    // \`.l-fluid-width\`, inner card grid from \`.l-row\` + \`.l-col\`.
    docs: {
      description: {
        story: 'Detailed-band icons carry more line work and are pixel-fit at 40 / 48 / 64 / 72 / 80 / 96 / 144. Pair \`detailed-*\` ids with these sizes.'
      }
    }
  },
  render: () => \`
    <div class="sbd-doc">
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Detailed band — 40 / 48 / 64 / 72 / 80 / 96 / 144</h2>
        <p class="sbd-doc__section-lede">Renders <code>\${PLAYGROUND_DETAILED_NAME}</code> at each pixel-fit size in the detailed band.</p>
        <div class="l-row">
          \${DETAILED_SIZES.map(size => sizeCard({
    name: PLAYGROUND_DETAILED_NAME,
    size,
    color: 'default',
    frame: 'none',
    decorative: true,
    accessibleLabel: ''
  })).join('')}
        </div>
      </section>
    </div>
  \`
}`,...F.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  parameters: {
    // Inherits the meta's \`contentWidth: 'fluid'\`; outer chrome from
    // \`.l-fluid-width\`, inner card grid from \`.l-row\` + \`.l-col\`.
    docs: {
      description: {
        story: 'Every Color role from the Color axis. \`current\` inherits from the parent (here the gallery card text), \`inverse\` only makes sense on a dark surface — shown on a dark card to match.'
      }
    }
  },
  render: () => \`
    <div class="sbd-doc">
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Color roles</h2>
        <p class="sbd-doc__section-lede">Seven roles, paired with the same glyph at size 32 so only the colour changes.</p>
        <div class="l-row">
          \${COLOR_OPTIONS.map(colorCard).join('')}
        </div>
      </section>
    </div>
  \`
}`,...L.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  parameters: {
    // Inherits the meta's \`contentWidth: 'fluid'\`; outer chrome from
    // \`.l-fluid-width\`, inner card grid from \`.l-row\` + \`.l-col\`.
    docs: {
      description: {
        story: 'Four transparent positioning envelopes (square / circle / vertical-rectangle / horizontal-rectangle) at 24 × 24 and 48 × 48, mirroring Figma \`Web-ODS-Icons / 2:1318\` Section 2. Each frame shrinks the painted glyph to a smaller inner shape via \`mask-clip: content-box\`; the outer box stays at \`--icon-size\`. Glyph choice is intentional: a grid for \`square\`, an info circle for \`circle\`, a portrait phone for \`vertical-rectangle\`, and a landscape credit card for \`horizontal-rectangle\` — each silhouette echoes the conceptual frame shape. The tinted box traces the outer \`--icon-size\` box so the gap between the painted glyph and the envelope edges is visible; in production no such background exists — the frame is layout only.'
      }
    }
  },
  render: () => \`
    <div class="sbd-doc">
      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Frame envelopes — 24 × 24 and 48 × 48</h2>
        <p class="sbd-doc__section-lede">Each card pairs the frame with a glyph chosen to echo its shape. The tinted box traces the outer <code>--icon-size</code> box; the gap between glyph and box is the frame envelope.</p>
        <div class="l-row">
          \${FRAME_BAND.flatMap(frame => FRAME_SAMPLE_SIZES.map(size => frameCard(frame, size))).join('')}
        </div>
      </section>
    </div>
  \`
}`,...H.parameters?.docs?.source}}},U=[`Demo`,`AllStyles`,`SimpleBand`,`DetailedBand`,`ColorRoles`,`Frames`]})))()}W();export{j as AllStyles,L as ColorRoles,D as Demo,F as DetailedBand,H as Frames,P as SimpleBand,U as __namedExportsOrder,E as default};