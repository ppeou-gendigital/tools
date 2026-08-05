import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ft as t,It as n,i as r,n as i,r as a,t as o}from"./pretty-source-CvP1BtiP.js";import"./button-DPO6711n.js";var s;function c(){return(c=e((()=>{s=`/**
 * Molecules/Button — \`.btn\` BEM root. Figma master \`2434:14483\`.
 *
 * Paints / geometry consume \`--button-*\` from \`themes/default/_button.scss\`
 * (or LifeLock \`src/tokens/button/\` when that brand theme is active).
 */

// ============================================================================
// BLOCK — .btn (canonical short root permitted per code-conventions.mdc § 1)
// ============================================================================

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--button-gap);
  inline-size: fit-content;
  min-inline-size: var(--button-min-inline-size);
  box-sizing: border-box;
  border-radius: var(--button-radius);
  border: var(--button-border-width-primary) solid transparent;
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-semibold);
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  appearance: none;
  transition:
    background-color 150ms ease,
    color 150ms ease,
    border-color 150ms ease;

  // font-size / line-height / block-size / padding all live on the
  // per-size modifiers below — every \`.btn\` consumer ships exactly one
  // \`.btn--*\` modifier (default \`l\` if unset by the template).
}

// ============================================================================
// ELEMENTS — label + icon slots + spinner
// ============================================================================

.btn__label {
  // Wrap rather than overflow so long labels stay readable inside
  // their host surface. Hosts that want single-line behaviour can
  // clip the overflow themselves via \`max-inline-size\` on a parent.
  white-space: normal;
  word-break: normal;
  overflow-wrap: anywhere;
}

.btn__icon {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

// Spinner — CSS-only rotating ring shown in place of the leading icon
// when \`.is-loading\` is set on the block. Sized to the same per-size
// \`--button-icon-size-*\` ladder the icon slots use, so the geometry
// stays identical between Default and Loading.
.btn__spinner {
  flex: 0 0 auto;
  display: inline-block;
  inline-size: var(--button-icon-size-l);
  block-size: var(--button-icon-size-l);
  border-radius: 50%;
  border: 2px solid var(--button-spinner-track);
  border-block-start-color: var(--button-spinner-fill);
  animation: btn-spinner-rotate 700ms linear infinite;
}

@keyframes btn-spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}

// ============================================================================
// SIZE MODIFIERS — geometry only (label font + icon slot size scale here)
// ============================================================================

.btn--s {
  block-size: var(--button-block-size-s);
  padding-block: var(--button-padding-block-s);
  padding-inline: var(--button-padding-inline-s);
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);

  .btn__spinner {
    inline-size: var(--button-icon-size-s);
    block-size: var(--button-icon-size-s);
  }
}

.btn--m {
  block-size: var(--button-block-size-m);
  padding-block: var(--button-padding-block-m);
  padding-inline: var(--button-padding-inline-m);
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);

  .btn__spinner {
    inline-size: var(--button-icon-size-m);
    block-size: var(--button-icon-size-m);
  }
}

.btn--l {
  block-size: var(--button-block-size-l);
  padding-block: var(--button-padding-block-l);
  padding-inline: var(--button-padding-inline-l);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);

  .btn__spinner {
    inline-size: var(--button-icon-size-l);
    block-size: var(--button-icon-size-l);
  }
}

.btn--xl {
  block-size: var(--button-block-size-xl);
  padding-block: var(--button-padding-block-xl);
  padding-inline: var(--button-padding-inline-xl);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);

  .btn__spinner {
    inline-size: var(--button-icon-size-xl);
    block-size: var(--button-icon-size-xl);
  }
}

// ============================================================================
// ICON-ONLY MODIFIER — square geometry, label suppressed at template layer
// ============================================================================

.btn--icon-button {
  // Force a true square hit-area at every size by pinning
  // \`inline-size\` to the matching \`--button-block-size-<size>\` token
  // and suppressing the label-bearing min-inline-size + padding-inline.
  // The label slot is suppressed at the template layer (no
  // \`.btn__label\` rendered).
  min-inline-size: 0;
  padding-inline: 0;

  &.btn--s {
    inline-size: var(--button-block-size-s);
  }

  &.btn--m {
    inline-size: var(--button-block-size-m);
  }

  &.btn--l {
    inline-size: var(--button-block-size-l);
  }

  &.btn--xl {
    inline-size: var(--button-block-size-xl);
  }
}

// ============================================================================
// STYLE MODIFIERS — per-type surface paints + per-type keyline weight
// ============================================================================

// -- Primary ----------------------------------------------------------------

.btn--primary {
  background-color: var(--button-primary-bg-default);
  color: var(--button-primary-content-default);
  border-color: var(--button-primary-border);
  border-width: var(--button-border-width-primary);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-color: var(--button-primary-bg-hover);
    color: var(--button-primary-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-color: var(--button-primary-bg-pressed);
    color: var(--button-primary-content-pressed);
  }
}

// -- Secondary --------------------------------------------------------------

.btn--secondary {
  background-color: var(--button-secondary-bg-default);
  color: var(--button-secondary-content-default);
  border-color: var(--button-secondary-border);
  border-width: var(--button-border-width-secondary);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-color: var(--button-secondary-bg-hover);
    color: var(--button-secondary-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-color: var(--button-secondary-bg-pressed);
    color: var(--button-secondary-content-pressed);
  }
}

// -- Tertiary ---------------------------------------------------------------

.btn--tertiary {
  background-color: var(--button-tertiary-bg-default);
  color: var(--button-tertiary-content-default);
  border-color: var(--button-tertiary-border);
  border-width: var(--button-border-width-primary);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-color: var(--button-tertiary-bg-hover);
    color: var(--button-tertiary-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-color: var(--button-tertiary-bg-pressed);
    color: var(--button-tertiary-content-pressed);
  }
}

// -- Inverse ----------------------------------------------------------------

.btn--inverse {
  background-color: var(--button-inverse-bg-default);
  color: var(--button-inverse-content-default);
  border-color: var(--button-inverse-border);
  border-width: var(--button-border-width-primary);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-color: var(--button-inverse-bg-hover);
    color: var(--button-inverse-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-color: var(--button-inverse-bg-pressed);
    color: var(--button-inverse-content-pressed);
  }
}

// -- Text (transparent surface; identity-coloured label only) ---------------

.btn--text {
  background-color: var(--button-text-bg-default);
  color: var(--button-text-content-default);
  border-color: transparent;
  border-width: var(--button-border-width-primary);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-color: var(--button-text-bg-hover);
    color: var(--button-text-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-color: var(--button-text-bg-pressed);
    color: var(--button-text-content-pressed);
  }
}

// -- Primary ghost (transparent surface + identity-coloured 2px keyline) ----

.btn--primary-ghost {
  background-color: var(--button-primary-ghost-bg-default);
  color: var(--button-primary-ghost-content-default);
  border-color: var(--button-primary-ghost-border);
  border-width: var(--button-border-width-ghost);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-color: var(--button-primary-ghost-bg-hover);
    color: var(--button-primary-ghost-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-color: var(--button-primary-ghost-bg-pressed);
    color: var(--button-primary-ghost-content-pressed);
  }
}

// -- Secondary ghost --------------------------------------------------------

.btn--secondary-ghost {
  background-color: var(--button-secondary-ghost-bg-default);
  color: var(--button-secondary-ghost-content-default);
  border-color: var(--button-secondary-ghost-border);
  border-width: var(--button-border-width-ghost);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-color: var(--button-secondary-ghost-bg-hover);
    color: var(--button-secondary-ghost-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-color: var(--button-secondary-ghost-bg-pressed);
    color: var(--button-secondary-ghost-content-pressed);
  }
}

// -- Gradient (premium-emphasis CTA; gradient surface, white label) ---------
// The surface is a \`background-image\` linear gradient rather than a flat
// \`background-color\`, so the per-state paints swap \`background-image\`. The
// universal \`.btn:disabled\` rule only sets \`background-color\`, so gradient
// clears its own \`background-image\` on \`:disabled\` to let the flat
// disabled surface show through (Figma: no gradient affordance when
// disabled). Keyline weight + focus overlay match Type=Primary.

.btn--gradient {
  background-image: var(--button-gradient-bg-default);
  color: var(--button-gradient-content-default);
  border-color: var(--button-gradient-border);
  border-width: var(--button-border-width-primary);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-image: var(--button-gradient-bg-hover);
    color: var(--button-gradient-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-image: var(--button-gradient-bg-pressed);
    color: var(--button-gradient-content-pressed);
  }

  &:disabled {
    background-image: none;
  }
}

// ============================================================================
// UNIVERSAL STATES — focus / disabled / loading
// ============================================================================

// -- Focus (keyboard-only via :focus-visible per WCAG 2.4.7) -----------------
// All seven types collapse to the same focus treatment: a 2 px outline
// painted with \`--button-focus-ring\` at \`outline-offset: 2px\`, sharing
// the pill \`--button-radius-focus\` corner shape. \`:focus-visible\` (not
// \`:focus\`) so mouse clicks don't surface the ring — keyboard
// navigation still does.

.btn:focus-visible,
.btn[data-state="focus"] {
  outline: var(--button-border-width-focus) solid var(--button-focus-ring);
  outline-offset: 2px;
  border-radius: var(--button-radius-focus);
}

// -- Disabled (universal paint, regardless of style) -------------------------
// Native \`disabled\` attribute is the source of truth — the template
// also mirrors \`aria-disabled="true"\` defensively for custom-element
// compositions that may swallow the native attribute. Paints the
// universal \`--button-disabled-*\` trio regardless of the active
// style. \`:not(.is-loading)\` excludes the loading state — loading +
// disabled is a defensible combo (consumers passing both) where
// disabled paints win.

.btn:disabled {
  background-color: var(--button-disabled-bg);
  color: var(--button-disabled-content);
  border-color: var(--button-disabled-border);
  cursor: not-allowed;
}

// -- Loading (paint stays unchanged; geometry stable; clicks blocked) --------
// \`.is-loading\` is a runtime-only class. The leading icon slot is
// swapped for \`.btn__spinner\` at the template layer; the rest of the
// surface paint stays exactly as the active \`(style, state)\` would
// otherwise render. \`pointer-events: none\` suppresses the click
// target without removing the button from the tab order (consumers
// wanting full keyboard lockout should pair \`loading={{true}}\` with
// \`disabled={{true}}\`).

.btn.is-loading {
  cursor: progress;
  pointer-events: none;
}

// ============================================================================
// REDUCED MOTION — strip the spinner rotation but keep the busy semantics
// ============================================================================

@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }

  .btn__spinner {
    animation: none;
  }
}
`})))()}var l,u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{r(),i(),c(),n(),l=a.default.compile(t),u=[`primary`,`secondary`,`tertiary`,`inverse`,`text`,`primary-ghost`,`secondary-ghost`,`gradient`],d=[`s`,`m`,`l`,`xl`],f=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=2434-14483&m=dev`,p={label:`Continue`,style:`primary`,size:`l`,type:`button`,iconButton:!1,loading:!1,disabled:!1,showLeadingIcon:!1,leadingIcon:`actions/simple-add`,showTrailingIcon:!1,trailingIcon:`arrows-navigation/simple-arrow-forward`,accessibleLabel:``},m={title:`Molecules/Button`,tags:[`autodocs`],render:e=>l(e),args:p,argTypes:{label:{control:`text`,name:`Label`},style:{control:{type:`select`},options:u,name:`Style`},size:{control:{type:`inline-radio`},options:d,name:`Size`},type:{control:{type:`inline-radio`},options:[`button`,`submit`,`reset`],name:`HTML type`},iconButton:{control:`boolean`,name:`Icon button`},loading:{control:`boolean`,name:`Loading`},disabled:{control:`boolean`,name:`Disabled`},showLeadingIcon:{control:`boolean`,name:`Show leading icon`},leadingIcon:{control:`text`,name:`Leading icon`},showTrailingIcon:{control:`boolean`,name:`Show trailing icon`},trailingIcon:{control:`text`,name:`Trailing icon`},accessibleLabel:{control:`text`,name:`Accessible label`}},parameters:{contentWidth:`fluid`,docs:{description:{component:`Button — call-to-action control. [Figma](${f}).`}}}},h={name:`Demo`,parameters:o(l(p),{scss:s})},g={...p,showLeadingIcon:!0,showTrailingIcon:!0},_={name:`WithIcons`,args:g,parameters:o(l(g),{scss:s})},v={name:`Primary`,args:{...p,style:`primary`},parameters:o(l({...p,style:`primary`}),{scss:s})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  parameters: htmlStoryParameters(compiled(defaultArgs), {
    scss: scssSource
  })
}`,...h.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'WithIcons',
  args: withIconsArgs,
  parameters: htmlStoryParameters(compiled(withIconsArgs), {
    scss: scssSource
  })
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'Primary',
  args: {
    ...defaultArgs,
    style: 'primary'
  },
  parameters: htmlStoryParameters(compiled({
    ...defaultArgs,
    style: 'primary'
  }), {
    scss: scssSource
  })
}`,...v.parameters?.docs?.source}}},y=[`Demo`,`WithIcons`,`Primary`]})))()}b();export{h as Demo,v as Primary,_ as WithIcons,y as __namedExportsOrder,m as default};