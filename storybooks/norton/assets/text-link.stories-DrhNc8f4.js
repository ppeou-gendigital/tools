import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dt as t,ft as n,i as r,n as i,r as a,t as o}from"./pretty-source-CqFWUhTp.js";import"./text-link-DG6iA3DR.js";var s;function c(){return(c=e((()=>{s=`/**
 * Components/Text link — single BEM root (.c-text-link) covering the
 * Figma master variant set on Web-ODS Shared Library \`1332:54878\`
 * (LifeLock theme mode).
 *
 * Variant axes → BEM modifiers:
 *   background → .c-text-link--light | --dark
 *   size       → .c-text-link--xs | --sm | --base
 *                | --lg | --xl | --2xl | --3xl
 *   weight     → .c-text-link--regular | --medium
 *                | --semibold | --bold
 *   icon-slot  → .c-text-link--has-icon (+ --has-icon-leading
 *                | --has-icon-trailing)
 *
 * Persistent runtime states:
 *   disabled   → [aria-disabled="true"]   (markup-driven)
 *   visited    → :visited                 (browser-managed)
 *   forced     → .is-visited              (gallery-only override)
 *
 * Transient interaction states:
 *   hover      → :hover
 *   focus      → :focus-visible
 *   pressed    → :active
 *
 * Per \`spec-driven-sync.mdc\`, every paint resolves to a \`var(--…)\`
 * token declared in \`tokens/colors\`, \`tokens/typography\`,
 * \`tokens/spacing\`, or \`tokens/borders\`. No hardcoded design values.
 *
 * Logical properties (\`text-decoration\` and the \`padding\`-shorthand
 * focus-ring metrics) keep the unit RTL-safe out of the box.
 */

// ============================================================================
// BLOCK — .c-text-link
// ============================================================================

.c-text-link {
  // \`inline-flex\` lets the optional icon slot ride alongside the label
  // as part of the link's intrinsic content box. \`align-items: center\`
  // (rather than \`baseline\`) is the right cross-axis pick for an
  // icon + text pair because an inline-block icon (the icon partial
  // ships \`display: inline-block\` with \`vertical-align: middle\`) has
  // its baseline at the bottom of its content box — \`align-items:
  // baseline\` would put the icon's bottom edge on the text baseline
  // and the icon would sit visually too low next to the text. Centring
  // the icon to the link's content box aligns its visual centre with
  // the text's x-height for the common single-line case.
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  box-sizing: border-box;
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);

  // Default paint — Background=Light. Light/Dark modifier blocks below
  // override every state-aware paint so a bare \`.c-text-link\` still
  // renders correctly during dev / authoring without modifiers.
  color: var(--color-text-brand);
  // Rest state is underlined — mirrors the THEME=LifeLock rendering of
  // the shared master (conflict resolved 2026-06-11: Figma wins; the
  // earlier underline-on-interaction-only treatment matched the White
  // Label mode, not LifeLock).
  text-decoration: underline;
  text-decoration-thickness: var(--border-width-default);
  text-underline-offset: 0.2em;

  // The icon paints in \`currentColor\` so it tracks every state without
  // per-state overrides.
  .c-icon {
    color: inherit;
  }

  // Hover + pressed keep the underline; pressed dims via opacity so
  // the cue is tactile, not chromatic.
  &:hover,
  &:active {
    text-decoration: underline;
    text-decoration-thickness: var(--border-width-default);
  }

  &:active {
    opacity: 0.85;
  }

  // Focus ring uses --color-border-focus offset by --space-1 so the
  // ring sits clear of the underline. \`:focus-visible\` only — the ring
  // never appears on mouse-down.
  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: var(--space-1);
    text-decoration: underline;
    text-decoration-thickness: var(--border-width-default);
  }
}

// ============================================================================
// ELEMENT — .c-text-link__label
// ============================================================================

.c-text-link__label {
  // Inline so the label sits on the same baseline as the icon slot.
  display: inline;
}

// ============================================================================
// MODIFIERS — Background = Light (default)
// ============================================================================

.c-text-link--light {
  color: var(--color-text-brand);

  &:hover,
  &:active,
  &:focus-visible {
    color: var(--color-text-brand);
  }

  // Visited paints --color-text-secondary — softer than brand so users
  // can quickly scan which links they have followed without losing the
  // link affordance entirely (the rest-state underline persists).
  // The \`is-visited\` class is the gallery-only override consumed by
  // the AllStyles state band.
  &:visited,
  &.is-visited {
    color: var(--color-text-secondary);
  }
}

// ============================================================================
// MODIFIERS — Background = Dark
// ============================================================================

.c-text-link--dark {
  color: var(--color-text-inverse);

  &:hover,
  &:active,
  &:focus-visible {
    color: var(--color-text-inverse);
  }

  // On dark canvases the visited treatment stays inverse; the
  // surrounding canvas already carries enough chromatic isolation
  // that a tonal shift would reduce contrast below WCAG AA.
  &:visited,
  &.is-visited {
    color: var(--color-text-inverse);
  }
}

// ============================================================================
// MODIFIERS — Size (typography ladder)
// ============================================================================

.c-text-link--xs {
  font-size: var(--font-size-body-xs);
  line-height: var(--lineheight-body-xs);
}

.c-text-link--sm {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
}

.c-text-link--base {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
}

.c-text-link--lg {
  font-size: var(--font-size-body-lg);
  line-height: var(--lineheight-body-lg);
}

.c-text-link--xl {
  font-size: var(--font-size-body-xl);
  line-height: var(--lineheight-body-xl);
}

.c-text-link--2xl {
  font-size: var(--font-size-body-2xl);
  line-height: var(--lineheight-body-2xl);
}

.c-text-link--3xl {
  font-size: var(--font-size-body-3xl);
  line-height: var(--lineheight-body-3xl);
}

// ============================================================================
// MODIFIERS — Weight
// ============================================================================

.c-text-link--regular {
  font-weight: var(--font-weight-regular);
}

.c-text-link--medium {
  font-weight: var(--font-weight-medium);
}

.c-text-link--semibold {
  font-weight: var(--font-weight-semibold);
}

.c-text-link--bold {
  font-weight: var(--font-weight-bold);
}

// ============================================================================
// MODIFIERS — Icon slot (orthogonal opt-in)
// ============================================================================

.c-text-link--has-icon {
  // Gap is already declared on the block; this modifier exists so
  // consumers can target icon-bearing links without re-running the
  // selector chain (e.g. for layout-side adjacent-sibling rules).
}

// \`--has-icon-leading\` and \`--has-icon-trailing\` are positional hints
// only; the actual layout flips by the order of children inside the
// \`<a>\` element. They exist so consumers and audits can tell which
// slot is in use without inspecting child markup.
.c-text-link--has-icon-leading,
.c-text-link--has-icon-trailing {
  // No additional styling — see comment above.
}

// ============================================================================
// PERSISTENT STATE — disabled
// ============================================================================

// Disabled is markup-driven via \`aria-disabled="true"\`. The attribute
// selector carries the disabled paint and blocks pointer events so
// click handlers fire-no-op even in browsers that ignore the missing
// \`href\`.
.c-text-link[aria-disabled='true'] {
  color: var(--color-disabled-text);
  cursor: not-allowed;
  pointer-events: none;
  text-decoration: none;

  &:hover,
  &:active,
  &:focus-visible {
    color: var(--color-disabled-text);
    text-decoration: none;
  }

  &:focus-visible {
    // Focus ring is suppressed because tabindex="-1" already removes
    // the disabled link from the keyboard tab order. Belt-and-braces.
    outline: none;
  }
}
`})))()}function l(e){return u({label:e.label??``,href:e.href??`#`,target:e.target||``,rel:e.rel||``,background:e.background||`light`,size:e.size||`base`,weight:e.weight||`regular`,iconTreatment:e.iconTreatment||`none`,iconName:e.iconName||``,iconPosition:e.iconPosition||`trailing`,disabled:!!e.disabled,ariaLabel:e.ariaLabel||``,id:e.id||``,forceVisited:!!e.forceVisited})}var u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{r(),i(),c(),t(),u=a.default.compile(n),d=[`light`,`dark`],f=[`xs`,`sm`,`base`,`lg`,`xl`,`2xl`,`3xl`],p=[`regular`,`medium`,`semibold`,`bold`],m=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=1332-54878&m=dev`,h={label:`Read more about protection`,href:`https://example.com/learn`,target:``,rel:``,background:`light`,size:`base`,weight:`regular`,iconTreatment:`none`,iconName:``,iconPosition:`trailing`,disabled:!1,ariaLabel:``,id:``,forceVisited:!1},g={title:`Molecules/Text link`,tags:[`autodocs`],parameters:{docs:{description:{component:`Inline text link inherited from core. [Figma](${m}).`}},contentWidth:`fluid`},argTypes:{label:{control:`text`,name:`Label`},href:{control:`text`,name:`href`},background:{control:{type:`inline-radio`},options:d,name:`Background`},size:{control:{type:`select`},options:f,name:`Size`},weight:{control:{type:`inline-radio`},options:p,name:`Weight`},iconTreatment:{control:{type:`inline-radio`},options:[`none`,`external`,`inline`],name:`Icon treatment`},disabled:{control:`boolean`,name:`Disabled`}},args:h},_={name:`Demo`,render:e=>l(e),parameters:o(l(h),{unit:`text-link`,scss:s})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  render: args => render(args),
  parameters: htmlStoryParameters(render(defaultArgs), {
    unit: 'text-link',
    scss: scssSource
  })
}`,..._.parameters?.docs?.source}}},v=[`Demo`]})))()}y();export{_ as Demo,v as __namedExportsOrder,g as default};