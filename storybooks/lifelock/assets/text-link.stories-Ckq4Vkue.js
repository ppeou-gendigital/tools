import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./pretty-source-BQFAze2y.js";import{l as r,n as i,t as a,u as o}from"./handlebars-helpers-tSVUrI1I.js";import{a as s,n as c,t as l}from"./figma-links-DrHwXaYQ.js";function u(e,t){let n={...b,label:`Sample link`,href:`#`,...e},r=f(n),i=t||e.label||`sample`;return`
    <div class="${C} sbd-doc__card">
      <div class="sbd-doc__card-canvas${n.background===`dark`?` sbd-doc__card-canvas--inverse`:``}">${r}</div>
      <p class="sbd-doc__card-label">${i}</p>
    </div>
  `}function d(e,t){let n={...b,label:`Sample link`,href:`#`,background:t,size:`base`,weight:`regular`};e===`disabled`&&(n.disabled=!0),e===`visited`&&(n.forceVisited=!0);let r=f(n);return`
    <div class="${C} sbd-doc__card">
      <div class="sbd-doc__card-canvas${t===`dark`?` sbd-doc__card-canvas--inverse`:``}">${r}</div>
      <p class="sbd-doc__card-label">${e}</p>
    </div>
  `}var f,p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{i(),r(),t(),s(),f=a.default.compile(o),p=[`light`,`dark`],m=[`xs`,`sm`,`base`,`lg`,`xl`,`2xl`,`3xl`],h=[`regular`,`medium`,`semibold`,`bold`],g=[`none`,`external`,`inline`],_=[`leading`,`trailing`],v=[`default`,`hover`,`focus`,`pressed`,`disabled`,`visited`],y={label:{control:`text`,name:`Label`,description:`Visible text the user reads. Required. Plain text only — HTML inside the label is forbidden.`},href:{control:`text`,name:`href`,description:"Standard `<a href>`. Required when not disabled. Dropped from the rendered markup when `disabled=true`."},target:{control:{type:`inline-radio`},options:[``,`_self`,`_blank`,`_parent`,`_top`],name:`target`,description:'Standard `<a target>`. When set to `_blank` the template auto-derives `rel="noopener noreferrer"`.'},rel:{control:`text`,name:`rel`,description:'Standard `<a rel>`. Consumer-supplied values are merged with the auto-derived `noopener noreferrer` for `target="_blank"`.'},background:{control:{type:`inline-radio`},options:p,name:`Background`,description:"`light` (default) — paints `--color-text-brand` against light canvases. `dark` — paints `--color-text-inverse` against `--color-bg-inverse-*` / `--color-bg-cta-*` surfaces."},size:{control:{type:`select`},options:m,name:`Size`,description:"One tier of the LifeLock body typography ramp. Maps to `--font-size-body-{size}` paired with `--lineheight-body-{size}`."},weight:{control:{type:`inline-radio`},options:h,name:`Weight`,description:"Inter Tight body weight. Maps to `--font-weight-{weight}`. Pick the value that matches the surrounding copy; do not use weight to imply emphasis on its own."},iconTreatment:{control:{type:`inline-radio`},options:g,name:`Icon treatment`,description:"`none` (default) renders text only. `external` renders the canonical `arrows-navigation/simple-link-external` glyph trailing the label. `inline` requires `iconName` and accepts `iconPosition`."},iconName:{control:`text`,name:`Icon name`,description:'Catalog key (e.g. `arrows-navigation/simple-arrow-right`). Honoured only when `iconTreatment="inline"`.'},iconPosition:{control:{type:`inline-radio`},options:_,name:`Icon position`,description:'`trailing` (default) places the icon after the label. `leading` places it before. `iconTreatment="external"` honours both positions even though Figma authors trailing as the standard.'},disabled:{control:`boolean`,name:`Disabled`,description:'When `true` the link paints in `--color-text-disabled`, drops `href`, sets `aria-disabled="true"` + `tabindex="-1"`, keeps `role="link"`, and blocks pointer events.'},ariaLabel:{control:`text`,name:`Aria label`,description:"Optional override of the accessible name. Required when the visible label is not self-describing (for example `Read more` adjacent to a card title)."},id:{control:`text`,name:`id`,description:"Optional `id` attribute for in-page anchors and JS hooks."}},b={label:`Read more about identity-theft protection`,href:`https://www.lifelock.com/learn`,target:``,rel:``,background:`light`,size:`base`,weight:`regular`,iconTreatment:`none`,iconName:``,iconPosition:`trailing`,disabled:!1,ariaLabel:``,id:``},x={title:`Molecules/Text link`,tags:[`autodocs`,`shared-library`],render:e=>f(e),args:b,argTypes:y,parameters:{badges:[`shared`],contentWidth:`fluid`,design:l(`1332:54772`),docs:{description:{component:'Text link — inline interactive primitive for navigating to related content from inside running text. Mirrored from [Web-ODS Shared Library → Text link](https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-54772&m=dev). One `.c-text-link` BEM block carries the Figma master variant set (2 Background × 6 State × 7 Size × 4 Weight = 336 published variants, reduced to 56 buildable code variants by collapsing interaction states onto CSS pseudo-classes). Always renders an `<a>` element; `disabled=true` drops the `href` and applies `aria-disabled="true"` + `tabindex="-1"` while keeping `role="link"` so assistive tech still announces the role. Optional icon slot composes the registered `icon` partial — `iconTreatment="external"` for the canonical `arrows-navigation/simple-link-external` glyph, or `iconTreatment="inline"` for any other catalog key. Sizes are intentionally not breakpoint-responsive; pick the value that matches the surrounding body copy at each breakpoint via the parent typographic scale.'}}}},S={parameters:n(f(b),{unit:`text-link`,extra:{design:l(`1332:54772`),docs:{description:{story:'Interactive playground — toggle Background / Size / Weight / Icon treatment in the args panel to preview every combination. Use `disabled` to verify the `aria-disabled="true"` + `tabindex="-1"` markup contract. The visited paint (`is-visited`) is presentational-only — see the AllStyles gallery for its freeze.'}}}})},C=`l-col l-col--sm--3 l-col--md--3 l-col--lg--2 l-col--xl--2`,w={parameters:{docs:{description:{story:"Canonical gallery enumerating the full `Background × Size × Weight` Cartesian (2 × 7 × 4 = 56 cells) plus a State band that stamps the five interaction states on the canonical `background=light, size=base, weight=regular` cell. Hover, focus, and active states are CSS pseudo-classes — interact with the cards to preview them; the `disabled` and `visited` cells render their persistent treatment. The whole gallery mirrors a single Figma master variant set, so the canonical link sits at the top of the rendered chrome."}},design:l(`1332:54772`)},render:()=>`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">${c(`1332:54772`,`Master text link`)}</p>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Persistent variants — Background × Size × Weight</h2>
        <p class="sbd-doc__section-lede">Cartesian product of every Figma persistent variant axis (2 × 7 × 4 = 56 cells). LifeLock / Desktop slice only — sibling Norton / AVG / White-Label duplicates are dropped at scour time. Rows are grouped by <code>Background · Weight</code> with the seven-size ladder running across.</p>
        ${p.flatMap(e=>h.map(t=>`
              <h3 class="sbd-doc__group-title">Background = ${e} · Weight = ${t}</h3>
              <div class="l-row">
                ${m.map(n=>u({background:e,size:n,weight:t},n)).join(``)}
              </div>
            `)).join(``)}
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Interaction states</h2>
        <p class="sbd-doc__section-lede">The five canonical interaction states plus the visited state. Hover / focus / pressed are CSS pseudo-classes — interact with each card to preview them. Disabled and visited render their persistent treatment via <code>aria-disabled="true"</code> and <code>.is-visited</code> respectively.</p>
        ${p.map(e=>`
            <h3 class="sbd-doc__group-title">Background = ${e}</h3>
            <div class="l-row">
              ${v.map(t=>d(t,e)).join(``)}
            </div>
          `).join(``)}
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Icon treatments</h2>
        <p class="sbd-doc__section-lede">Optional icon slot — <code>iconTreatment="external"</code> renders the canonical <code>arrows-navigation/simple-link-external</code> glyph; <code>iconTreatment="inline"</code> resolves a consumer-supplied catalog key. Both treatments accept <code>iconPosition="leading"</code> or <code>iconPosition="trailing"</code> (default).</p>
        <h3 class="sbd-doc__group-title">External link icon</h3>
        <div class="l-row">
          ${u({iconTreatment:`external`,iconPosition:`trailing`,label:`Open in a new tab`},`trailing`)}
          ${u({iconTreatment:`external`,iconPosition:`leading`,label:`Open in a new tab`},`leading`)}
        </div>
        <h3 class="sbd-doc__group-title">Inline icon</h3>
        <div class="l-row">
          ${u({iconTreatment:`inline`,iconName:`arrows-navigation/simple-arrow-forward`,iconPosition:`trailing`,label:`Continue to checkout`},`trailing`)}
          ${u({iconTreatment:`inline`,iconName:`arrows-navigation/simple-arrow-back`,iconPosition:`leading`,label:`Back to dashboard`},`leading`)}
        </div>
      </section>
    </div>
  `},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  parameters: htmlStoryParameters(compiled(defaultArgs), {
    unit: 'text-link',
    extra: {
      design: figmaDesign('1332:54772'),
      docs: {
        description: {
          story: 'Interactive playground — toggle Background / Size / Weight / Icon treatment in the args panel to preview every combination. Use \`disabled\` to verify the \`aria-disabled="true"\` + \`tabindex="-1"\` markup contract. The visited paint (\`is-visited\`) is presentational-only — see the AllStyles gallery for its freeze.'
        }
      }
    }
  })
}`,...S.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Canonical gallery enumerating the full \`Background × Size × Weight\` Cartesian (2 × 7 × 4 = 56 cells) plus a State band that stamps the five interaction states on the canonical \`background=light, size=base, weight=regular\` cell. Hover, focus, and active states are CSS pseudo-classes — interact with the cards to preview them; the \`disabled\` and \`visited\` cells render their persistent treatment. The whole gallery mirrors a single Figma master variant set, so the canonical link sits at the top of the rendered chrome.'
      }
    },
    design: figmaDesign('1332:54772')
  },
  render: () => \`
    <div class="sbd-doc">
      <p class="sbd-doc__section-figma">\${figmaFrameLink('1332:54772', 'Master text link')}</p>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Persistent variants — Background × Size × Weight</h2>
        <p class="sbd-doc__section-lede">Cartesian product of every Figma persistent variant axis (2 × 7 × 4 = 56 cells). LifeLock / Desktop slice only — sibling Norton / AVG / White-Label duplicates are dropped at scour time. Rows are grouped by <code>Background · Weight</code> with the seven-size ladder running across.</p>
        \${BACKGROUND_OPTIONS.flatMap(background => WEIGHT_OPTIONS.map(weight => \`
              <h3 class="sbd-doc__group-title">Background = \${background} · Weight = \${weight}</h3>
              <div class="l-row">
                \${SIZE_OPTIONS.map(size => linkCard({
    background,
    size,
    weight
  }, size)).join('')}
              </div>
            \`)).join('')}
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Interaction states</h2>
        <p class="sbd-doc__section-lede">The five canonical interaction states plus the visited state. Hover / focus / pressed are CSS pseudo-classes — interact with each card to preview them. Disabled and visited render their persistent treatment via <code>aria-disabled="true"</code> and <code>.is-visited</code> respectively.</p>
        \${BACKGROUND_OPTIONS.map(background => \`
            <h3 class="sbd-doc__group-title">Background = \${background}</h3>
            <div class="l-row">
              \${STATE_BAND.map(state => stateCard(state, background)).join('')}
            </div>
          \`).join('')}
      </section>

      <section class="sbd-doc__section">
        <h2 class="sbd-doc__section-title">Icon treatments</h2>
        <p class="sbd-doc__section-lede">Optional icon slot — <code>iconTreatment="external"</code> renders the canonical <code>arrows-navigation/simple-link-external</code> glyph; <code>iconTreatment="inline"</code> resolves a consumer-supplied catalog key. Both treatments accept <code>iconPosition="leading"</code> or <code>iconPosition="trailing"</code> (default).</p>
        <h3 class="sbd-doc__group-title">External link icon</h3>
        <div class="l-row">
          \${linkCard({
    iconTreatment: 'external',
    iconPosition: 'trailing',
    label: 'Open in a new tab'
  }, 'trailing')}
          \${linkCard({
    iconTreatment: 'external',
    iconPosition: 'leading',
    label: 'Open in a new tab'
  }, 'leading')}
        </div>
        <h3 class="sbd-doc__group-title">Inline icon</h3>
        <div class="l-row">
          \${linkCard({
    iconTreatment: 'inline',
    iconName: 'arrows-navigation/simple-arrow-forward',
    iconPosition: 'trailing',
    label: 'Continue to checkout'
  }, 'trailing')}
          \${linkCard({
    iconTreatment: 'inline',
    iconName: 'arrows-navigation/simple-arrow-back',
    iconPosition: 'leading',
    label: 'Back to dashboard'
  }, 'leading')}
        </div>
      </section>
    </div>
  \`
}`,...w.parameters?.docs?.source}}},T=[`Demo`,`AllStyles`]})))()}E();export{w as AllStyles,S as Demo,T as __namedExportsOrder,x as default};