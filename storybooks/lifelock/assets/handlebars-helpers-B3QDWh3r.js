import{a as e,n as t}from"./rolldown-runtime-DkW27tQK.js";import{_ as n,a as r,b as i,c as a,d as o,f as s,g as c,h as l,i as u,l as d,m as f,o as p,r as m,s as h,u as g,v as _,x as v,y}from"./pretty-source-Cg2Lp3N_.js";import{i as b,r as x}from"./_icon-catalog-CFuVgluW.js";var S;function C(){return(C=t((()=>{S=`<span
  class="c-icon c-icon--{{size}} c-icon--{{color}}{{#if frame}}{{#unless (eq frame "none")}} c-icon--{{frame}}{{/unless}}{{/if}}"
  style="--icon-source: url('{{iconUrl name}}');"
  {{#if decorative}}
    aria-hidden="true"
  {{else}}
    role="img"
    aria-label="{{accessibleLabel}}"
  {{/if}}
></span>
`})))()}var w;function T(){return(T=t((()=>{w=`{{!--
  Components/Alert template — one template, three structural layouts
  (banner / toast / passive) authored per the spec.md § Variant axes.
  Layout / Hierarchy / Tone all collapse to BEM modifiers on the root
  so the template stays a single render tree; per-layout structural
  branches are limited to the wrapping element (\`<a>\` for
  \`wholeClickable\`, \`<div>\` otherwise) and the inner slot order
  (status icon · content · cta · dismiss is identical across all
  three).

  CTA composes the registered \`button\` partial via \`{{> button}}\`
  whenever \`ctaHref\` is unset — \`Size=S\`, \`Style\` resolved from
  \`hierarchy\` via the \`alertCtaStyle\` helper (low → primary, high →
  secondary; mirrors the Figma source's per-hierarchy Button instance
  pairing). When \`ctaHref\` is set, the CTA renders as an anchor
  element with the canonical Button classes applied directly
  (\`btn btn--{style} btn--s\`) so the Button paints / paddings /
  focus ring are reused without forcing the button element on a
  navigation target (the button partial only emits a button tag).

  Defaults:
    - layout     → banner
    - hierarchy  → low
    - tone       → info
    - dismissLabel → "Dismiss"

  Per-tone default status icon resolution lives in
  helpers/handlebars-helpers.js → \`alertStatusIcon\` helper.
  Per-hierarchy default CTA style resolution lives in the sibling
  \`alertCtaStyle\` helper.
--}}
{{#if wholeClickable}}
<a
  class="c-alert c-alert--{{#if layout}}{{layout}}{{else}}banner{{/if}} c-alert--{{#if hierarchy}}{{hierarchy}}{{else}}low{{/if}} c-alert--{{#if tone}}{{tone}}{{else}}info{{/if}} c-alert--whole-clickable"
  href="{{#if href}}{{href}}{{else}}#{{/if}}"
  role="{{#if (eq hierarchy "high")}}{{#if (eq tone "critical")}}alert{{else}}status{{/if}}{{else}}status{{/if}}"
  aria-live="{{#if (eq hierarchy "high")}}{{#if (eq tone "critical")}}assertive{{else}}polite{{/if}}{{else}}polite{{/if}}"
>
{{else}}
<div
  class="c-alert c-alert--{{#if layout}}{{layout}}{{else}}banner{{/if}} c-alert--{{#if hierarchy}}{{hierarchy}}{{else}}low{{/if}} c-alert--{{#if tone}}{{tone}}{{else}}info{{/if}}"
  role="{{#if (eq hierarchy "high")}}{{#if (eq tone "critical")}}alert{{else}}status{{/if}}{{else}}status{{/if}}"
  aria-live="{{#if (eq hierarchy "high")}}{{#if (eq tone "critical")}}assertive{{else}}polite{{/if}}{{else}}polite{{/if}}"
>
{{/if}}
  <span class="c-alert__status-icon" aria-hidden="true">
    {{> icon
      name=(alertStatusIcon tone icon)
      size="20"
      color="current"
      decorative=true
    }}
  </span>

  <div class="c-alert__content">
    {{#if title}}
      <p class="c-alert__title">{{title}}</p>
    {{/if}}
    {{#if description}}
      <p class="c-alert__description">{{description}}</p>
    {{/if}}
  </div>

  {{#if showButton}}
    {{#if ctaHref}}
      <a class="btn btn--{{alertCtaStyle hierarchy}} btn--s" href="{{ctaHref}}">
        <span class="btn__label">{{#if ctaLabel}}{{ctaLabel}}{{else}}Action{{/if}}</span>
      </a>
    {{else}}
      {{> button
        label=ctaLabel
        style=(alertCtaStyle hierarchy)
        size="s"
      }}
    {{/if}}
  {{/if}}

  {{#if dismissible}}
    <button
      type="button"
      class="c-alert__dismiss"
      aria-label="{{#if dismissLabel}}{{dismissLabel}}{{else}}Dismiss{{/if}}"
    >
      {{> icon
        name="actions/simple-close"
        size="20"
        color="current"
        decorative=true
      }}
    </button>
  {{/if}}
{{#if wholeClickable}}
</a>
{{else}}
</div>
{{/if}}
`})))()}var E;function D(){return(D=t((()=>{E=`{{!--
  Patterns/Breadcrumb template — single BEM root (.c-breadcrumb)
  covering the Figma master variant set on Web-ODS Shared Library
  \`1260:8373\` (LifeLock theme mode; LifeLock-mode re-bake tracked as
  a Designer Follow-Up in spec.md § "Notes & open questions").

  Variant axes (mirror Figma's master + spec.md § "Variant axes"):
    firstAsIcon  false | true   [.c-breadcrumb--first-as-icon-{no|yes}]
    collapsed    false | true   [.c-breadcrumb--collapsed-{no|yes}]
    truncation   false | true   [.c-breadcrumb--truncation-{no|yes}]

  First-crumb rendering matrix (verified against the eight master
  variants on \`1260:8373\`):

    | firstAsIcon | collapsed | First crumb shape                                |
    |-------------|-----------|--------------------------------------------------|
    | false       | false     | plain text-link  ("Home")                        |
    | false       | true      | text-link with LEADING home icon ("🏠 Home")     |
    | true        | false     | icon-only home anchor (label → aria-label)       |
    | true        | true      | icon-only home anchor (label → aria-label)       |

  Collapsed=true folds every middle item into ONE static placeholder
  (a span carrying the \`c-breadcrumb__ellipsis\` class) — not an
  expand button. The placeholder carries a \`title\` (tooltip) AND \`aria-label\`
  listing the labels of the items it stands in for, so keyboard
  users hear "Products, Cloud solutions, Acme cloud platform" and
  pointer users see the same in the native browser tooltip on hover.
  There is no JS — this is a pure presentation aid.

  Composes (per spec.md § "Composes"):
    text-link — every intermediate crumb at \`Size = sm, Weight = regular\`.
    icon      — chevron-right separators (16 px), home glyph for the
                icon-only and leading-home shapes (16 px), more-horiz
                ellipsis glyph inside the static placeholder (20 px).
                All composed with \`color="current"\` so each tracks the
                containing crumb's paint via \`currentColor\`.

  Defaults (mirror spec.md § "Properties"):
    items            → []
    firstAsIcon      → false
    collapsed        → false
    truncation       → false
    ariaLabel        → "Breadcrumb"
    iconType         → "objects/simple-home"

  The template iterates the enriched \`items\` array (pre-rendered by
  the Storybook helper \`compileBreadcrumbArgs\` via
  \`buildCrumbsFromItems\`) where each entry is one of:
    { kind: "link",      label, href, homeIconOnly?, leadingHomeIcon?, ariaLabel? }
    { kind: "current",   label }
    { kind: "separator" }
    { kind: "ellipsis",  hiddenLabels, hiddenPagesLabel? }
--}}
<nav
  class="c-breadcrumb c-breadcrumb--first-as-icon-{{#if firstAsIcon}}yes{{else}}no{{/if}} c-breadcrumb--collapsed-{{#if collapsed}}yes{{else}}no{{/if}} c-breadcrumb--truncation-{{#if truncation}}yes{{else}}no{{/if}}"
  aria-label="{{#if ariaLabel}}{{ariaLabel}}{{else}}Breadcrumb{{/if}}"
>
  <ol class="c-breadcrumb__list">
    {{#each items}}
      {{#if (eq kind "link")}}
        <li class="c-breadcrumb__item c-breadcrumb__item--link">
          {{#if homeIconOnly}}
            <a
              class="c-breadcrumb__home"
              href="{{href}}"
              aria-label="{{#if ariaLabel}}{{ariaLabel}}{{else}}{{label}}{{/if}}"
            >
              {{#if ../iconType}}
                {{> icon name=../iconType size="16" color="current" decorative=true}}
              {{else}}
                {{> icon name="objects/simple-home" size="16" color="current" decorative=true}}
              {{/if}}
            </a>
          {{else}}
            {{#if leadingHomeIcon}}
              {{#if ../iconType}}
                {{> text-link
                    href=href
                    size="sm"
                    weight="regular"
                    label=label
                    iconTreatment="inline"
                    iconName=../iconType
                    iconPosition="leading"}}
              {{else}}
                {{> text-link
                    href=href
                    size="sm"
                    weight="regular"
                    label=label
                    iconTreatment="inline"
                    iconName="objects/simple-home"
                    iconPosition="leading"}}
              {{/if}}
            {{else}}
              {{> text-link
                  href=href
                  size="sm"
                  weight="regular"
                  label=label}}
            {{/if}}
          {{/if}}
        </li>
      {{else}}
        {{#if (eq kind "current")}}
          <li class="c-breadcrumb__item c-breadcrumb__item--current">
            <span class="c-breadcrumb__current" aria-current="page">{{label}}</span>
          </li>
        {{else}}
          {{#if (eq kind "separator")}}
            <li class="c-breadcrumb__item c-breadcrumb__item--separator" aria-hidden="true">
              {{> icon name="arrows-navigation/simple-chevron-right" size="16" color="current" decorative=true}}
            </li>
          {{else}}
            {{#if (eq kind "ellipsis")}}
              <li class="c-breadcrumb__item c-breadcrumb__item--ellipsis">
                <span
                  class="c-breadcrumb__ellipsis"
                  role="text"
                  title="{{hiddenLabels}}"
                  aria-label="{{#if hiddenPagesLabel}}{{hiddenPagesLabel}}: {{/if}}{{hiddenLabels}}"
                >
                  {{> icon name="arrows-navigation/simple-more-horiz" size="16" color="current" decorative=true}}
                </span>
              </li>
            {{/if}}
          {{/if}}
        {{/if}}
      {{/if}}
    {{/each}}
  </ol>
</nav>
`})))()}var O;function k(){return(k=t((()=>{O=`{{!--
  Components/Divider template — single BEM root (.c-divider) covering
  the three Figma sibling variant sets on Web-ODS-Shared-Library —
  \`Divider / Horizontal\` (1344:2031), \`Divider / Vertical\`
  (1344:2052), and \`Divider / Label\` (1344:2073) — folded onto one
  orthogonal four-axis collapse per spec.md § "Variant axes".

  Variant axes (mirror Figma's masters + spec.md § "Variant axes"):
    layout     horizontal | vertical | label        [.c-divider--$layout]
    size       xs | s | m | l                       [.c-divider--$size]
    inverse    true | false                         [.c-divider--inverse when true]
    typography body-sm-regular | body-sm-semibold |
               body-base-regular | body-base-semibold |
               body-lg-regular | body-lg-bold |
               h6-medium | h5-bold                  [.c-divider--$typography]

  Divider is stateless — no \`:hover\` / \`:focus-visible\` / \`:active\`
  paints and no JavaScript. The root element is a \`<div>\` carrying
  \`role="separator"\` so screen readers announce the rule as a
  semantic divider.

  Content slots:
    - layout=horizontal → no content slot. Root paints as a
      block-level rule via \`border-block-start\`.
    - layout=vertical   → no content slot. Root paints as an
      inline-block rule via \`border-inline-start\`; consumers size
      the parent's cross axis (typically a flex row with
      \`align-items: stretch\`).
    - layout=label      → nested three-span flex row:
        <span class="c-divider__rule c-divider__rule--start"></span>
        <span class="c-divider__label">{{label}}</span>
        <span class="c-divider__rule c-divider__rule--end"></span>
      Default label text = "Or".

  Defaults:
    layout     → "horizontal"
    size       → "s"
    inverse    → false
    typography → "body-sm-regular"
    label      → "Or" (only renders when layout=label)
--}}
{{!--
  Resolve every axis once so the rendered BEM modifiers and the
  \`aria-orientation\` attribute always agree — when a prop is unset
  the class fallback and the aria attribute fallback never drift.
--}}
<div
  class="c-divider c-divider--{{#if layout}}{{lower layout}}{{else}}horizontal{{/if}} c-divider--{{#if size}}{{lower size}}{{else}}s{{/if}}{{#if inverse}} c-divider--inverse{{/if}} c-divider--{{#if typography}}{{lower typography}}{{else}}body-sm-regular{{/if}}"
  role="separator"
  aria-orientation="{{#if (eq (lower layout) "vertical")}}vertical{{else}}horizontal{{/if}}"
  {{#if accessibleLabel}}aria-label="{{accessibleLabel}}"{{/if}}
>
  {{#if (eq (lower layout) "label")}}
    <span class="c-divider__rule c-divider__rule--start" aria-hidden="true"></span>
    <span class="c-divider__label">{{#if label}}{{label}}{{else}}Or{{/if}}</span>
    <span class="c-divider__rule c-divider__rule--end" aria-hidden="true"></span>
  {{/if}}
</div>
`})))()}var A;function j(){return(j=t((()=>{A=`{{!--
  Components/Label template — single BEM root (.c-label) covering the
  Figma master variant set on Web-ODS Shared Library \`1408:443\`
  (LifeLock theme mode).

  Variant axes (mirror Figma's master + spec.md § "Variant axes"):
    background  primary | secondary | brand | brand-soft | accent |
                alpha | beta | gamma | delta | inverse-primary |
                inverse-secondary               [.c-label--$background]
    variant     solid | transparent-30 | transparent-50 |
                transparent-80                   [.c-label--$variant]

  Label is stateless — no \`:hover\` / \`:focus-visible\` / \`:active\`
  paints and no JavaScript. The root element is a \`<span>\` so the
  label nests cleanly inline alongside text without spawning a new
  block-formatting context.

  Content slots:
    - leading icon (optional, when \`showIcon=true\`) — composed via the
      registered \`icon\` partial at 16 × 16 px with \`color="current"\` so
      it inherits the label's content paint via \`currentColor\`. Always
      decorative (the text carries the meaning).
    - text — the visible pill content, rendered inside \`.c-label__text\`.

  Defaults:
    background → "primary"
    variant    → "solid"
    text       → "label"
    showIcon   → false
    icon       → "actions/simple-add"
--}}
<span
  class="c-label c-label--{{#if background}}{{lower background}}{{else}}primary{{/if}} c-label--{{#if variant}}{{lower variant}}{{else}}solid{{/if}}"
>
  {{#if showIcon}}
    {{#if icon}}
      {{> icon name=icon size="16" color="current" decorative=true}}
    {{else}}
      {{> icon name="actions/simple-add" size="16" color="current" decorative=true}}
    {{/if}}
  {{/if}}
  <span class="c-label__text">{{#if text}}{{text}}{{else}}label{{/if}}</span>
</span>
`})))()}var M;function N(){return(N=t((()=>{M=`{{!--
  Components/Slider template — single BEM root (.c-slider) covering
  the Figma master variant set on Web-ODS Shared Library \`1336:2939\`
  (LifeLock theme mode), as published on the Sliders 🟢 canvas at
  \`539:28421\`.

  Variant axes (mirror Figma's master + spec.md \`## Variant axes\`):
    variant   continuous | discrete                 [.c-slider--$variant]
    selection single-value | range                  [.c-slider--$selection]

  Interaction state (default / hover / focused / active) paints via
  CSS pseudo-classes on the underlying \`<input type="range">\` and the
  visible thumb — NEVER as a BEM modifier. \`disabled\` is the only
  persistent state — sets \`aria-disabled="true"\` on the root and the
  native \`disabled\` attribute on each input. A \`data-state\` hook on
  the root lets the AllStyles gallery freeze each transient state for
  visual regression.

  Defaults:
    variant         → "continuous"
    selection       → "single-value"
    min             → 0
    max             → 100
    step            → 1
    value           → min            (single-value)
    valueMin        → min            (range)
    valueMax        → max            (range)
    showValueLabel  → true

  Required:
    selection="range" → both valueMin and valueMax.
    selection="single-value" → value.
--}}
{{#with this as |s|}}
  {{!-- Defaults --}}
  {{#unless s.variant}}{{!-- continuous default --}}{{/unless}}
  {{!-- Compute thumb offsets as percentages of (max - min). --}}
  {{!-- Pre-computed by the .stories.js render layer to keep the
       Handlebars surface free of math helpers. --}}
<div
  class="c-slider c-slider--{{#if s.variant}}{{s.variant}}{{else}}continuous{{/if}} c-slider--{{#if s.selection}}{{s.selection}}{{else}}single-value{{/if}}{{#if s.disabled}} is-disabled{{/if}}"
  data-component="slider"
  data-variant="{{#if s.variant}}{{s.variant}}{{else}}continuous{{/if}}"
  data-selection="{{#if s.selection}}{{s.selection}}{{else}}single-value{{/if}}"
  {{#if s.state}}data-state="{{s.state}}"{{/if}}
  role="group"
  {{#if s.label}}aria-label="{{s.label}}"{{/if}}
  {{#if s.disabled}}aria-disabled="true"{{/if}}
  data-min="{{#if s.min}}{{s.min}}{{else}}0{{/if}}"
  data-max="{{#if s.max}}{{s.max}}{{else}}100{{/if}}"
  data-step="{{#if s.step}}{{s.step}}{{else}}1{{/if}}"
>
  {{#unless (eq s.showValueLabel false)}}
    <div class="c-slider__value-label-area">
      {{#if (eq s.selection "range")}}
        <span class="c-slider__value-label c-slider__value-label--start" data-role="value-min" aria-live="polite">{{s.valueMin}}</span>
        <span class="c-slider__value-label-separator" aria-hidden="true">–</span>
        <span class="c-slider__value-label c-slider__value-label--end" data-role="value-max" aria-live="polite">{{s.valueMax}}</span>
      {{else}}
        <span class="c-slider__value-label" data-role="value" aria-live="polite">{{s.value}}</span>
      {{/if}}
    </div>
  {{/unless}}

  <div class="c-slider__track-area">
    <div class="c-slider__track" aria-hidden="true"></div>

    <div
      class="c-slider__active-fill"
      aria-hidden="true"
      style="--slider-fill-start: {{#if s.fillStartPct}}{{s.fillStartPct}}{{else}}0{{/if}}%; --slider-fill-end: {{#if s.fillEndPct}}{{s.fillEndPct}}{{else}}{{s.valuePct}}{{/if}}%;"
    ></div>

    {{#if (eq s.variant "discrete")}}
      {{#each s.tickOffsets as |offset|}}
        <span class="c-slider__tick" aria-hidden="true" style="--slider-tick-offset: {{offset}}%;"></span>
      {{/each}}
    {{/if}}

    {{#if (eq s.selection "range")}}
      <input
        type="range"
        class="c-slider__input c-slider__input--start"
        min="{{#if s.min}}{{s.min}}{{else}}0{{/if}}"
        max="{{#if s.max}}{{s.max}}{{else}}100{{/if}}"
        step="{{#if s.step}}{{s.step}}{{else}}1{{/if}}"
        value="{{s.valueMin}}"
        {{#if s.name}}name="{{s.name}}-min"{{/if}}
        {{#if s.disabled}}disabled{{/if}}
        aria-label="{{#if s.label}}{{s.label}} (minimum){{else}}Minimum{{/if}}"
      >
      <input
        type="range"
        class="c-slider__input c-slider__input--end"
        min="{{#if s.min}}{{s.min}}{{else}}0{{/if}}"
        max="{{#if s.max}}{{s.max}}{{else}}100{{/if}}"
        step="{{#if s.step}}{{s.step}}{{else}}1{{/if}}"
        value="{{s.valueMax}}"
        {{#if s.name}}name="{{s.name}}-max"{{/if}}
        {{#if s.disabled}}disabled{{/if}}
        aria-label="{{#if s.label}}{{s.label}} (maximum){{else}}Maximum{{/if}}"
      >
      <span
        class="c-slider__thumb c-slider__thumb--start"
        aria-hidden="true"
        style="--slider-thumb-offset: {{s.startPct}}%;"
      ></span>
      <span
        class="c-slider__thumb c-slider__thumb--end"
        aria-hidden="true"
        style="--slider-thumb-offset: {{s.endPct}}%;"
      ></span>
    {{else}}
      <input
        type="range"
        class="c-slider__input"
        min="{{#if s.min}}{{s.min}}{{else}}0{{/if}}"
        max="{{#if s.max}}{{s.max}}{{else}}100{{/if}}"
        step="{{#if s.step}}{{s.step}}{{else}}1{{/if}}"
        value="{{s.value}}"
        {{#if s.name}}name="{{s.name}}"{{/if}}
        {{#if s.disabled}}disabled{{/if}}
        aria-label="{{#if s.label}}{{s.label}}{{else}}Value{{/if}}"
      >
      <span
        class="c-slider__thumb"
        aria-hidden="true"
        style="--slider-thumb-offset: {{s.valuePct}}%;"
      ></span>
    {{/if}}
  </div>
</div>
{{/with}}
`})))()}var P;function F(){return(F=t((()=>{P=`{{!--
  Components/Stepper template — single BEM root (.c-stepper) covering the
  Figma master variant set on Web-ODS Shared Library \`1386:867\` (LifeLock
  theme mode) composed of up to six Step instances (\`1386:803\`).

  Variant axes (mirror Figma's master + spec.md § "Variant axes"):
    direction   horizontal | vertical          [.c-stepper--direction-$direction]

  Each list item carries a persistent state modifier:
    state       default | active | complete     [.c-stepper__step--state-$state]

  The stories layer passes a pre-built \`steps\` array. Each step object:
    number, state, showLabel, label, showConnector, isActive

  Composes (per spec.md § "Composes"):
    icon partial — Complete state renders \`status/simple-checkmark\` at 24 px
    via the registered icon partial (\`currentColor\` → inverse on the dark fill).

  Semantic structure:
    <ol> / <li> with aria-current="step" on the active item; connector lines
    are aria-hidden decorative spans.
--}}
<ol
  class="c-stepper c-stepper--direction-{{#if direction}}{{lower direction}}{{else}}horizontal{{/if}}"
  {{#if ariaLabel}}aria-label="{{ariaLabel}}"{{/if}}
>
  {{#each steps}}
  <li
    class="c-stepper__step c-stepper__step--state-{{#if state}}{{lower state}}{{else}}default{{/if}}{{#if isActive}} c-stepper__step--current{{/if}}"
    {{#if isActive}}aria-current="step"{{/if}}
  >
    {{#if (eq (lower ../direction) "vertical")}}
    <div class="c-stepper__indicator-row">
      <div class="c-stepper__indicator">
        {{#if (eq (lower state) "complete")}}
          {{> icon name="status/simple-checkmark" size="24" color="inverse" decorative=true}}
        {{else}}
          <span class="c-stepper__number">{{number}}</span>
        {{/if}}
      </div>
      {{#if showLabel}}
        <span class="c-stepper__label">{{#if label}}{{label}}{{else}}Label{{/if}}</span>
      {{/if}}
    </div>
    {{else}}
    <div class="c-stepper__indicator-column">
      <div class="c-stepper__indicator">
        {{#if (eq (lower state) "complete")}}
          {{> icon name="status/simple-checkmark" size="24" color="inverse" decorative=true}}
        {{else}}
          <span class="c-stepper__number">{{number}}</span>
        {{/if}}
      </div>
      {{#if showLabel}}
        <span class="c-stepper__label">{{#if label}}{{label}}{{else}}Label{{/if}}</span>
      {{/if}}
    </div>
    {{/if}}
    {{#if showConnector}}
    <div class="c-stepper__connector" aria-hidden="true">
      <span class="c-stepper__connector-line"></span>
    </div>
    {{/if}}
  </li>
  {{/each}}
</ol>
`})))()}var I;function L(){return(L=t((()=>{I=`{{!--
  Components/Text link template — single BEM root (.c-text-link)
  covering the Figma master variant set on Web-ODS Shared Library
  \`1332:54878\` (LifeLock theme mode).

  Variant axes (mirror Figma's master + spec.md § "Variant axes"):
    background  light | dark                       [.c-text-link--$bg]
    size        xs | sm | base | lg | xl |
                2xl | 3xl                          [.c-text-link--$size]
    weight      regular | medium | semibold |
                bold                               [.c-text-link--$weight]
    state       default | hover | focus | pressed |
                disabled | visited                  pseudo-classes only

  Persistent runtime states the markup carries:
    disabled    → aria-disabled="true" + tabindex="-1" + drops \`href\`
    visited     → :visited pseudo-class (browser-managed); the
                   \`forceVisited\` arg paints \`is-visited\` for the
                   AllStyles gallery only.

  Composes (per spec.md § "Composes"):
    icon partial — when \`iconTreatment="external"\` the canonical
    \`arrows-navigation/simple-link-external\` glyph trails the label;
    when \`iconTreatment="inline"\` a consumer-supplied \`iconName\`
    catalog key resolves through the partial. Icon paints in
    \`currentColor\` so it tracks every state without per-state
    overrides.

  Defaults (mirror spec.md § "Properties"):
    background    → "light"
    size          → "base"
    weight        → "regular"
    iconTreatment → "none"
    iconPosition  → "trailing"
    disabled      → false
--}}
<a
  class="c-text-link c-text-link--{{#if background}}{{lower background}}{{else}}light{{/if}} c-text-link--{{#if size}}{{lower size}}{{else}}base{{/if}} c-text-link--{{#if weight}}{{lower weight}}{{else}}regular{{/if}}{{#if (eq (lower iconTreatment) "external")}} c-text-link--has-icon c-text-link--has-icon-{{#if iconPosition}}{{lower iconPosition}}{{else}}trailing{{/if}}{{/if}}{{#if (eq (lower iconTreatment) "inline")}} c-text-link--has-icon c-text-link--has-icon-{{#if iconPosition}}{{lower iconPosition}}{{else}}trailing{{/if}}{{/if}}{{#if forceVisited}} is-visited{{/if}}"
  {{#if disabled}}
    role="link"
    aria-disabled="true"
    tabindex="-1"
  {{else}}
    href="{{href}}"
    {{#if target}}target="{{target}}"{{/if}}
    {{#if (eq target "_blank")}}rel="noopener noreferrer{{#if rel}} {{rel}}{{/if}}"{{else}}{{#if rel}}rel="{{rel}}"{{/if}}{{/if}}
  {{/if}}
  {{#if id}}id="{{id}}"{{/if}}
  {{#if ariaLabel}}aria-label="{{ariaLabel}}"{{/if}}
>
  {{#if (eq (lower iconPosition) "leading")}}
    {{#if (eq (lower iconTreatment) "external")}}
      {{> icon name="arrows-navigation/simple-link-external" size="20" color="current" decorative=true}}
    {{/if}}
    {{#if (eq (lower iconTreatment) "inline")}}
      {{#if iconName}}{{> icon name=iconName size="20" color="current" decorative=true}}{{/if}}
    {{/if}}
  {{/if}}
  <span class="c-text-link__label">{{label}}</span>
  {{#unless (eq (lower iconPosition) "leading")}}
    {{#if (eq (lower iconTreatment) "external")}}
      {{> icon name="arrows-navigation/simple-link-external" size="20" color="current" decorative=true}}
    {{/if}}
    {{#if (eq (lower iconTreatment) "inline")}}
      {{#if iconName}}{{> icon name=iconName size="20" color="current" decorative=true}}{{/if}}
    {{/if}}
  {{/unless}}
</a>
`})))()}var R;function z(){return(z=t((()=>{R=`{{!--
  Patterns/Inputs/Text field template — one BEM root, five \`type\`
  structures branched with \`{{#if (eq type …)}}\`:

    text | password → native <input>
    select          → native <select> (UA arrow in fallback; the
                      ::picker(select) menu is styled only under
                      \`appearance: base-select\` in Chromium 135+)
    combined        → <select> + <input> inside one focus-within border
    split           → separate <select> box + <input> box

  The field title is a real <label for> and the helper message is wired
  via aria-describedby. \`error\` adds \`is-error\` + \`aria-invalid\` and
  recolours the helper. Password reveal renders BOTH eye glyphs (icon
  partial) and toggles them with the \`is-revealed\` class so the JS layer
  never injects icon markup.

  \`id\` defaults to "text-field" so a bare partial render still wires the
  label; consumers SHOULD pass a unique id when more than one field is on
  a page.
--}}
<div
  class="c-text-field c-text-field--type-{{#if type}}{{lower type}}{{else}}text{{/if}}{{#if error}} is-error{{/if}}{{#if disabled}} is-disabled{{/if}}"
  data-component="text-field"
  data-type="{{#if type}}{{lower type}}{{else}}text{{/if}}"
>
  {{#if label}}
    <label class="c-text-field__title" for="{{#if id}}{{id}}{{else}}text-field{{/if}}">
      <span class="c-text-field__title-text">{{label}}</span>
      {{#if required}}<span class="c-text-field__required" aria-hidden="true">*</span>{{/if}}
    </label>
  {{/if}}

  {{#if (eq type "select")}}
    <div class="c-text-field__control">
      <select
        class="c-text-field__field c-text-field__select"
        id="{{#if id}}{{id}}{{else}}text-field{{/if}}"
        {{#if name}}name="{{name}}"{{/if}}
        {{#if disabled}}disabled{{/if}}
        {{#if error}}aria-invalid="true"{{/if}}
        {{#if helperText}}aria-describedby="{{#if id}}{{id}}{{else}}text-field{{/if}}-helper"{{/if}}
      >
        {{#each selectOptions}}
          <option value="{{this.value}}"{{#if this.selected}} selected{{/if}}>{{this.label}}</option>
        {{/each}}
      </select>
    </div>
  {{else if (eq type "combined")}}
    <div class="c-text-field__control c-text-field__control--combined">
      <select
        class="c-text-field__select c-text-field__prefix"
        aria-label="{{#if prefixLabel}}{{prefixLabel}}{{else}}Prefix{{/if}}"
        {{#if disabled}}disabled{{/if}}
      >
        {{#each prefixOptions}}<option value="{{this.value}}"{{#if this.selected}} selected{{/if}}>{{this.label}}</option>{{/each}}
      </select>
      <span class="c-text-field__seam" aria-hidden="true"></span>
      <input
        class="c-text-field__field"
        id="{{#if id}}{{id}}{{else}}text-field{{/if}}"
        type="text"
        {{#if name}}name="{{name}}"{{/if}}
        {{#if value}}value="{{value}}"{{/if}}
        placeholder="{{placeholder}}"
        {{#if disabled}}disabled{{/if}}
        {{#if error}}aria-invalid="true"{{/if}}
        {{#if helperText}}aria-describedby="{{#if id}}{{id}}{{else}}text-field{{/if}}-helper"{{/if}}
      >
    </div>
  {{else if (eq type "split")}}
    <div class="c-text-field__control c-text-field__control--split">
      <div class="c-text-field__box c-text-field__box--prefix">
        <select
          class="c-text-field__select"
          aria-label="{{#if prefixLabel}}{{prefixLabel}}{{else}}Prefix{{/if}}"
          {{#if disabled}}disabled{{/if}}
        >
          {{#each prefixOptions}}<option value="{{this.value}}"{{#if this.selected}} selected{{/if}}>{{this.label}}</option>{{/each}}
        </select>
      </div>
      <div class="c-text-field__box">
        <input
          class="c-text-field__field"
          id="{{#if id}}{{id}}{{else}}text-field{{/if}}"
          type="text"
          {{#if name}}name="{{name}}"{{/if}}
          {{#if value}}value="{{value}}"{{/if}}
          placeholder="{{placeholder}}"
          {{#if disabled}}disabled{{/if}}
          {{#if error}}aria-invalid="true"{{/if}}
          {{#if helperText}}aria-describedby="{{#if id}}{{id}}{{else}}text-field{{/if}}-helper"{{/if}}
        >
      </div>
    </div>
  {{else}}
    <div class="c-text-field__control{{#if (eq type "password")}} c-text-field__control--password{{/if}}">
      <input
        class="c-text-field__field"
        id="{{#if id}}{{id}}{{else}}text-field{{/if}}"
        type="{{#if (eq type "password")}}password{{else}}text{{/if}}"
        {{#if name}}name="{{name}}"{{/if}}
        {{#if value}}value="{{value}}"{{/if}}
        placeholder="{{placeholder}}"
        {{#if (eq type "password")}}autocomplete="current-password"{{/if}}
        {{#if disabled}}disabled{{/if}}
        {{#if error}}aria-invalid="true"{{/if}}
        {{#if helperText}}aria-describedby="{{#if id}}{{id}}{{else}}text-field{{/if}}-helper"{{/if}}
      >
      {{#if (eq type "password")}}
        <button
          type="button"
          class="c-text-field__reveal"
          aria-label="Show password"
          aria-pressed="false"
          {{#if disabled}}disabled{{/if}}
        >
          <span class="c-text-field__reveal-icon c-text-field__reveal-icon--show">{{> icon name="generic/simple-visibility-on" size="20" color="current" decorative=true}}</span>
          <span class="c-text-field__reveal-icon c-text-field__reveal-icon--hide">{{> icon name="generic/simple-visibility-off" size="20" color="current" decorative=true}}</span>
        </button>
      {{/if}}
    </div>
  {{/if}}

  {{#if helperText}}
    <p class="c-text-field__helper" id="{{#if id}}{{id}}{{else}}text-field{{/if}}-helper">{{helperText}}</p>
  {{/if}}
</div>
`})))()}var B;function V(){return(V=t((()=>{B=`{{!--
  Patterns/Inputs/Search box template — one bordered :focus-within
  control around a native <input type="search">. A search glyph + a
  vertical separator lead the input (or trail it when iconFirst=false),
  and a clear (×) button shows at the inline-end once the field is
  filled. The native UA search-cancel button is suppressed in SCSS; the
  clear button is a real <button> so it is reachable + styleable
  cross-browser.

  Defaults: size → m, iconFirst → true, accessibleLabel → "Search".
--}}
<div
  class="c-search-box c-search-box--{{#if size}}{{lower size}}{{else}}m{{/if}}{{#unless iconFirst}} c-search-box--icon-last{{/unless}}{{#if value}} is-filled{{/if}}{{#if disabled}} is-disabled{{/if}}"
  data-component="search-box"
  data-size="{{#if size}}{{lower size}}{{else}}m{{/if}}"
>
  {{#if iconFirst}}
    <span class="c-search-box__icon" aria-hidden="true">{{> icon name="actions/simple-search" size="24" color="current" decorative=true}}</span>
    <span class="c-search-box__separator" aria-hidden="true"></span>
  {{/if}}

  <input
    class="c-search-box__input"
    type="search"
    {{#if name}}name="{{name}}"{{/if}}
    {{#if value}}value="{{value}}"{{/if}}
    placeholder="{{#if placeholder}}{{placeholder}}{{else}}Search{{/if}}"
    aria-label="{{#if accessibleLabel}}{{accessibleLabel}}{{else}}Search{{/if}}"
    autocomplete="off"
    {{#if disabled}}disabled{{/if}}
  >

  <button
    type="button"
    class="c-search-box__clear"
    aria-label="{{#if clearLabel}}{{clearLabel}}{{else}}Clear search{{/if}}"
    {{#if disabled}}disabled{{/if}}
  >
    {{> icon name="actions/simple-close" size="24" color="current" decorative=true}}
  </button>

  {{#unless iconFirst}}
    <span class="c-search-box__separator" aria-hidden="true"></span>
    <span class="c-search-box__icon" aria-hidden="true">{{> icon name="actions/simple-search" size="24" color="current" decorative=true}}</span>
  {{/unless}}
</div>
`})))()}var H;function U(){return(U=t((()=>{H=`{{!--
  Patterns/Inputs/Code entry template — a segmented one-time-code (OTP)
  field: \`length\` single-character native <input> boxes wrapped in a
  labelled role="group", with an optional helper message. The per-box
  descriptors come from the \`codeBoxes\` helper (index / position / total
  / char); \`value\` is distributed one character per box. The JS layer
  adds auto-advance, backspace-to-previous, and paste-spread.

  Defaults: length → 6, group label → "Verification code".
--}}
<div
  class="c-code-entry{{#if error}} is-error{{/if}}{{#if disabled}} is-disabled{{/if}}"
  data-component="code-entry"
  data-length="{{#if length}}{{length}}{{else}}6{{/if}}"
  role="group"
  aria-label="{{#if label}}{{label}}{{else}}Verification code{{/if}}"
  {{#if helperText}}aria-describedby="{{#if groupId}}{{groupId}}{{else}}code-entry{{/if}}-helper"{{/if}}
>
  {{#if label}}
    <span class="c-code-entry__label">{{label}}</span>
  {{/if}}

  <div class="c-code-entry__boxes">
    {{#each (codeBoxes length value)}}
      <input
        class="c-code-entry__box{{#if this.char}} is-filled{{/if}}"
        type="text"
        inputmode="numeric"
        autocomplete="{{#if this.index}}off{{else}}one-time-code{{/if}}"
        maxlength="1"
        pattern="[0-9]*"
        aria-label="Digit {{this.position}} of {{this.total}}"
        data-index="{{this.index}}"
        {{#if this.char}}value="{{this.char}}"{{/if}}
        {{#if ../error}}aria-invalid="true"{{/if}}
        {{#if ../disabled}}disabled{{/if}}
      >
    {{/each}}
  </div>

  {{#if helperText}}
    <p class="c-code-entry__helper" id="{{#if groupId}}{{groupId}}{{else}}code-entry{{/if}}-helper">{{helperText}}</p>
  {{/if}}
</div>
`})))()}var W;function G(){return(G=t((()=>{W=e(v(),1),C(),b(),i(),n(),T(),D(),c(),s(),g(),k(),j(),h(),r(),N(),F(),m(),L(),z(),V(),U(),W.default.registerHelper(`eq`,(e,t)=>e===t),W.default.registerHelper(`unless-eq`,(e,t,n)=>e===t?n.inverse(void 0):n.fn(void 0)),W.default.registerHelper(`lower`,e=>String(e??``).toLowerCase()),W.default.registerHelper(`codeBoxes`,(e,t)=>{let n=Math.max(1,Number.parseInt(e,10)||6),r=String(t??``);return Array.from({length:n},(e,t)=>({index:t,position:t+1,total:n,char:r[t]??``}))}),W.default.registerHelper(`iconUrl`,e=>x(e)),_(W.default),W.default.registerPartial(`icon`,S),W.default.registerPartial(`accordion`,y),W.default.registerHelper(`alertStatusIcon`,(e,t)=>{if(t)return t;let n={info:`status/simple-status-info`,critical:`status/simple-status-critical`,attention:`status/simple-status-attention`,success:`status/simple-status-ok`,dark:`status/simple-info`};return n[e]||n.info}),W.default.registerHelper(`alertCtaStyle`,e=>e===`high`?`secondary`:`primary`),W.default.registerPartial(`alert`,w),f(W.default),W.default.registerPartial(`button`,l),W.default.registerPartial(`badge`,o),W.default.registerPartial(`divider`,O),W.default.registerPartial(`label`,A),W.default.registerPartial(`slider`,M),W.default.registerPartial(`stepper`,P),W.default.registerPartial(`switch`,u),W.default.registerPartial(`checkbox`,d),W.default.registerPartial(`radio`,p),W.default.registerPartial(`pagination-dots`,a),W.default.registerPartial(`text-link`,I),W.default.registerPartial(`breadcrumb`,E),W.default.registerPartial(`text-field`,R),W.default.registerPartial(`search-box`,B),W.default.registerPartial(`code-entry`,H)})))()}export{S as C,T as S,O as _,V as a,D as b,R as c,F as d,P as f,A as g,j as h,U as i,L as l,M as m,G as n,B as o,N as p,H as r,z as s,W as t,I as u,k as v,C as w,w as x,E as y};