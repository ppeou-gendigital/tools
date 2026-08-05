import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{At as t,i as n,kt as r,n as i,r as a,t as o}from"./pretty-source-CIqFBFpl.js";import"./switch-CDuQsX3O.js";var s;function c(){return(c=e((()=>{s=`/**
 * Components/Switch — binary on/off toggle painted as a 42 × 26 px
 * pill, progressive-enhanced over a native
 * \`<input type="checkbox" role="switch">\`.
 *
 * Mirrors the canonical Web-ODS Shared Library master at \`717:48394\`.
 * Three persistent tone variants (\`default\` / \`success\` / \`critical\`)
 * repaint the ON-state track; the knob stays white. Interaction
 * states (\`hover\` / \`focus\` / \`pressed\`) paint via CSS pseudo-classes
 * on the underlying input. \`disabled\` and \`loading\` are persistent
 * (boolean props).
 *
 * All inline-axis sizing uses logical properties so the knob slides
 * to the inline-end edge under \`dir="rtl"\`.
 *
 * Tokens consumed are listed in \`./spec.md\` § "Tokens consumed".
 *
 * Composes Icon — the ON-state knob glyph is a \`{{> icon}}\` instance;
 * pull in \`.c-icon\` mask styles so brand Storybooks that only import
 * this partial still paint the glyph.
 */

@use '../icon/icon';

.c-switch {
  /* Per-instance dials so the body block below only rebinds parts
     that change per variant or state. Knob is 18 × 18 px with a 4 px
     inset on every side — mirrors the Figma master \`717:48394\`
     where the knob nestles 4 px from the track edge in both axes
     (track 42 × 26 px, knob 18 × 18 px, slide travel = 42 - 18 - 8
     = 16 px). */
  --c-switch-track-inline: 42px;
  --c-switch-track-block:  26px;
  --c-switch-knob-size:    18px;
  --c-switch-knob-inset:   4px;
  --c-switch-radius:       var(--border-radius-pill);

  /* Hoisted distance the knob travels in the ON state — single-line
     so stylelint's \`scss/operator-no-newline-before\` rule doesn't
     misinterpret the unary minus inside calc() as a SCSS operator. */
  --c-switch-knob-slide:   calc(var(--c-switch-track-inline) - var(--c-switch-knob-size) - (var(--c-switch-knob-inset) * 2));

  /* 32 × 32 px hover / pressed state-circle wash painted BEHIND the
     knob — Figma source is \`rgba(68, 68, 68, 0.2)\` on hover and
     \`rgba(68, 68, 68, 0.1)\` on pressed (the white-label
     \`inverse-secondary\` token at 20 % / 10 % opacity). LifeLock has
     no dedicated state-wash alias, so the implementation reuses the
     same \`--color-text-secondary\` substitution Checkbox / Radio use
     (Designer Follow-Up logged for a \`--color-state-wash\` alias). */
  --c-switch-state-circle:        32px;
  --c-switch-state-color:         color-mix(in srgb, var(--color-text-secondary) 20%, transparent);
  --c-switch-state-color-strong:  color-mix(in srgb, var(--color-text-secondary) 10%, transparent);

  --c-switch-track-off-color: var(--color-border-subtle);
  --c-switch-track-on-color:  var(--color-signal-info);
  --c-switch-knob-color:      var(--color-bg-default);
  --c-switch-knob-icon-color: var(--color-signal-info);
  --c-switch-focus-color:     var(--color-border-focus);
  --c-switch-label-color:     var(--color-text-primary);

  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  user-select: none;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  font-weight: var(--font-weight-regular);
  color: var(--c-switch-label-color);
}

/* --- Tone variants -------------------------------------------- */

.c-switch--success {
  --c-switch-track-on-color: var(--color-signal-success);
  --c-switch-knob-icon-color: var(--color-signal-success);
}

.c-switch--critical {
  --c-switch-track-on-color: var(--color-signal-critical);
  --c-switch-knob-icon-color: var(--color-signal-critical);
}

/* --- Native input (the source of truth) ----------------------- */

/* Layered visually over the entire track so pointer + keyboard
   activation both resolve against the native control. Opacity 0
   keeps the input invisible while still focus-ringable + clickable.
   \`z-index: 2\` lifts the input above every visible element (track,
   state-circle, knob) so :hover / :active fire whether the cursor
   sits over the bar or the knob. Mirrors the Checkbox pattern. */
.c-switch__input {
  position: absolute;
  inline-size: var(--c-switch-track-inline);
  block-size:  var(--c-switch-track-block);
  margin: 0;
  padding: 0;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--c-switch-radius);
  opacity: 0;
  cursor: inherit;
  z-index: 2;
}

/* --- Track + knob (visible paint) ----------------------------- */

.c-switch__track {
  position: relative;
  display: inline-flex;
  align-items: center;
  inline-size: var(--c-switch-track-inline);
  block-size:  var(--c-switch-track-block);
  flex-shrink: 0;
  background-color: var(--c-switch-track-off-color);
  border-radius: var(--c-switch-radius);
  transition: background-color 160ms ease;
}

/* Pure visual element — the input above handles all pointer +
   keyboard interaction. Without \`pointer-events: none\` the knob
   would intercept the cursor and swallow :hover / :active before
   they reach the input, so the halo never paints when the cursor
   is over the knob. */
.c-switch__knob {
  position: absolute;
  inset-inline-start: var(--c-switch-knob-inset);
  inset-block-start: var(--c-switch-knob-inset);
  inline-size: var(--c-switch-knob-size);
  block-size:  var(--c-switch-knob-size);
  background-color: var(--c-switch-knob-color);
  border-radius: var(--border-radius-pill);
  color: var(--c-switch-knob-icon-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 160ms ease, color 160ms ease;
  pointer-events: none;
  z-index: 1;
}

/* Glyph wrapper inside the knob — always rendered (gated only by the
   \`showIcon\` prop and \`loading\` state in the template). Visibility is
   CSS-driven via \`is-checked\` so click-driven toggles don't have to
   insert nodes. Figma Icon mask wrapper is 18×18 (\`717:48382\`); nearest
   enum is \`size="16"\` on the partial — do not re-size \`.c-icon\` here. */
.c-switch__glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 120ms ease;
  pointer-events: none;
}

.c-switch.is-checked .c-switch__glyph {
  opacity: 1;
}

/* --- State circle (hover / pressed wash) --------------------- */

/* 32 × 32 px wash painted BEHIND the knob, centered on it. Travels
   with the knob via the same \`translateX(--c-switch-knob-slide)\` that
   moves the knob under \`.is-checked\`, so the halo always sits behind
   the knob regardless of position. Same RTL polarity flip as the
   knob. Pointer-events disabled so it never intercepts the underlying
   input. */
.c-switch__state-circle {
  position: absolute;
  inset-inline-start: calc(var(--c-switch-knob-inset) + (var(--c-switch-knob-size) - var(--c-switch-state-circle)) / 2);
  inset-block-start:  calc((var(--c-switch-track-block) - var(--c-switch-state-circle)) / 2);
  inline-size: var(--c-switch-state-circle);
  block-size:  var(--c-switch-state-circle);
  border-radius: var(--border-radius-pill);
  background-color: transparent;
  pointer-events: none;
  transition: background-color 120ms ease, transform 160ms ease;
  z-index: 0;
}

.c-switch.is-checked .c-switch__state-circle {
  transform: translateX(var(--c-switch-knob-slide));
}

[dir="rtl"] .c-switch.is-checked .c-switch__state-circle {
  transform: translateX(calc(var(--c-switch-knob-slide) * -1));
}

/* --- Visible label -------------------------------------------- */

.c-switch__label {
  display: inline-block;
  min-inline-size: 0;
  color: var(--c-switch-label-color);
}

/* --- Checked state -------------------------------------------- */

.c-switch.is-checked .c-switch__track {
  background-color: var(--c-switch-track-on-color);
}

.c-switch.is-checked .c-switch__knob {
  transform: translateX(var(--c-switch-knob-slide));
}

/* RTL — slide the knob to the inline-end (left in LTR-mirrored,
   right in RTL) using the same \`translateX\` polarity flip the
   browser already applies to logical properties. The math above is
   inline-axis-positive, so a global \`[dir="rtl"]\` flip is enough. */
[dir="rtl"] .c-switch.is-checked .c-switch__knob {
  transform: translateX(calc(var(--c-switch-knob-slide) * -1));
}

/* --- Hover / pressed (interaction states) --------------------- */

/* Track tints + state-circle halo paint TOGETHER on hover; pressed
   keeps the same track tint but lowers the halo opacity to 10 %
   (Figma \`717:48394\` painting). */
.c-switch__input:hover ~ .c-switch__track {
  background-color: color-mix(in srgb, var(--c-switch-track-off-color) 80%, var(--color-text-primary) 20%);
}

.c-switch.is-checked .c-switch__input:hover ~ .c-switch__track {
  background-color: color-mix(in srgb, var(--c-switch-track-on-color) 85%, black 15%);
}

.c-switch__input:hover ~ .c-switch__track .c-switch__state-circle {
  background-color: var(--c-switch-state-color);
}

.c-switch__input:active ~ .c-switch__track .c-switch__state-circle {
  background-color: var(--c-switch-state-color-strong);
}

/* --- Focus ring ----------------------------------------------- */

.c-switch__input:focus-visible ~ .c-switch__track {
  outline: var(--border-width-default) solid var(--c-switch-focus-color);
  outline-offset: var(--space-1);
}

/* --- [data-state] gallery freezes ----------------------------- */

.c-switch[data-state="hover"] .c-switch__track {
  background-color: color-mix(in srgb, var(--c-switch-track-off-color) 80%, var(--color-text-primary) 20%);
}

.c-switch[data-state="hover"].is-checked .c-switch__track {
  background-color: color-mix(in srgb, var(--c-switch-track-on-color) 85%, black 15%);
}

.c-switch[data-state="hover"] .c-switch__state-circle {
  background-color: var(--c-switch-state-color);
}

.c-switch[data-state="focused"] .c-switch__track {
  outline: var(--border-width-default) solid var(--c-switch-focus-color);
  outline-offset: var(--space-1);
}

.c-switch[data-state="pressed"] .c-switch__state-circle {
  background-color: var(--c-switch-state-color-strong);
}

/* --- Disabled state ------------------------------------------- */

.c-switch.is-disabled,
.c-switch[aria-disabled="true"] {
  --c-switch-track-off-color: var(--color-disabled-bg);
  --c-switch-track-on-color:  var(--color-disabled-bg);
  --c-switch-knob-color:      var(--color-disabled-text);
  --c-switch-knob-icon-color: var(--color-disabled-text);
  --c-switch-label-color:     var(--color-disabled-text);

  cursor: not-allowed;
}

.c-switch.is-disabled .c-switch__track,
.c-switch[aria-disabled="true"] .c-switch__track {
  outline: var(--border-width-hairline) solid var(--color-disabled-border);
  outline-offset: 0;
}

.c-switch.is-disabled .c-switch__input,
.c-switch[aria-disabled="true"] .c-switch__input {
  cursor: not-allowed;
  pointer-events: none;
}

/* --- Loading state -------------------------------------------- */

.c-switch.is-loading {
  cursor: progress;
}

.c-switch.is-loading .c-switch__input {
  pointer-events: none;
}

.c-switch__spinner {
  display: inline-block;
  inline-size: 14px;
  block-size: 14px;
  border: 2px solid currentcolor;
  border-block-end-color: transparent;
  border-radius: var(--border-radius-pill);
  animation: c-switch-spin 800ms linear infinite;
}

@keyframes c-switch-spin {
  to { transform: rotate(360deg); }
}

/* --- Reduced motion ------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .c-switch__track,
  .c-switch__knob,
  .c-switch__state-circle,
  .c-switch__glyph {
    transition: none;
  }

  .c-switch__spinner {
    animation: none;
  }
}
`})))()}var l;function u(){return(u=e((()=>{l=`/**
 * Components/Switch behaviour layer.
 *
 * Progressive enhancement on top of the native
 * \`<input type="checkbox" role="switch">\` the template emits. The
 * SCSS already paints every visual state from the input's
 * \`:checked\` / \`:hover\` / \`:focus-visible\` / \`:active\` /
 * \`:disabled\` selectors; this layer's only jobs are:
 *
 *   1. Mirror the input's \`checked\` state onto the root's
 *      \`is-checked\` modifier + \`aria-checked\` attribute so the
 *      visible track + knob can paint via the modifier class.
 *   2. Dispatch namespaced \`lifelock:switch:change\` and
 *      \`lifelock:switch:commit\` CustomEvents.
 *   3. Refuse commits while \`aria-busy="true"\` (loading).
 *
 * Public API documented in \`./spec.md\` § "JavaScript API".
 */

/**
 * @typedef {Object} SwitchInitOptions
 * @property {"input"|"change"} [commitOn="change"]
 */

/**
 * @typedef {Object} SwitchInstance
 * @property {() => boolean} getChecked
 * @property {(next: boolean) => void} setChecked
 * @property {(disabled: boolean) => void} setDisabled
 * @property {() => void} destroy
 */

function dispatch(root, name, detail) {
  root.dispatchEvent(
    new CustomEvent(name, { detail, bubbles: true, composed: true }),
  );
}

/**
 * Initialise one switch root.
 *
 * @param {HTMLElement} root
 * @param {SwitchInitOptions} [options]
 * @returns {SwitchInstance}
 */
export function initSwitch(root, options = {}) {
  if (!root || root.dataset.switchInitialised === "true") {
    return /** @type {SwitchInstance} */ ({
      getChecked: () => false,
      setChecked: () => {},
      setDisabled: () => {},
      destroy: () => {},
    });
  }
  root.dataset.switchInitialised = "true";

  const commitOn = options.commitOn === "input" ? "input" : "change";

  /** @type {HTMLInputElement | null} */
  const input = root.querySelector(".c-switch__input");
  if (!input) {
    return /** @type {SwitchInstance} */ ({
      getChecked: () => false,
      setChecked: () => {},
      setDisabled: () => {},
      destroy: () => {},
    });
  }

  function paint(source) {
    const checked = input.checked;
    root.classList.toggle("is-checked", checked);
    input.setAttribute("aria-checked", checked ? "true" : "false");
    dispatch(root, "lifelock:switch:change", { checked, source });
  }

  /** @param {Event} _e */
  function onChange(_e) {
    if (root.getAttribute("aria-busy") === "true") {
      input.checked = !input.checked;
      return;
    }
    paint("pointer");
    if (commitOn === "change" || commitOn === "input") {
      dispatch(root, "lifelock:switch:commit", {
        checked: input.checked,
        source: "pointer",
      });
    }
  }

  /** @param {KeyboardEvent} e */
  function onKeyUp(e) {
    if (e.key !== " " && e.key !== "Enter") return;
    if (root.getAttribute("aria-busy") === "true") return;
    dispatch(root, "lifelock:switch:commit", {
      checked: input.checked,
      source: "keyboard",
    });
  }

  input.addEventListener("change", onChange);
  input.addEventListener("keyup", onKeyUp);

  root.classList.toggle("is-checked", input.checked);
  input.setAttribute("aria-checked", input.checked ? "true" : "false");

  return {
    getChecked() {
      return input.checked;
    },
    setChecked(next) {
      input.checked = Boolean(next);
      paint("api");
      dispatch(root, "lifelock:switch:commit", {
        checked: input.checked,
        source: "api",
      });
    },
    setDisabled(disabled) {
      if (disabled) {
        root.setAttribute("aria-disabled", "true");
        root.classList.add("is-disabled");
        input.disabled = true;
      } else {
        root.removeAttribute("aria-disabled");
        root.classList.remove("is-disabled");
        input.disabled = false;
      }
    },
    destroy() {
      input.removeEventListener("change", onChange);
      input.removeEventListener("keyup", onKeyUp);
      delete root.dataset.switchInitialised;
    },
  };
}

/**
 * Initialise every switch inside a scope.
 *
 * @param {ParentNode} [scope]
 * @param {SwitchInitOptions} [options]
 * @returns {SwitchInstance[]}
 */
export function initSwitches(scope, options) {
  const root =
    scope && typeof scope.querySelectorAll === "function"
      ? scope
      : typeof document !== "undefined"
      ? document
      : null;
  if (!root) return [];
  return Array.from(root.querySelectorAll(".c-switch")).map((el) =>
    initSwitch(/** @type {HTMLElement} */ (el), options),
  );
}
`})))()}function d(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0}))}function f(e,t={}){if(!e||e.dataset.switchInitialised===`true`)return{getChecked:()=>!1,setChecked:()=>{},setDisabled:()=>{},destroy:()=>{}};e.dataset.switchInitialised=`true`;let n=t.commitOn===`input`?`input`:`change`,r=e.querySelector(`.c-switch__input`);if(!r)return{getChecked:()=>!1,setChecked:()=>{},setDisabled:()=>{},destroy:()=>{}};function i(t){let n=r.checked;e.classList.toggle(`is-checked`,n),r.setAttribute(`aria-checked`,n?`true`:`false`),d(e,`lifelock:switch:change`,{checked:n,source:t})}function a(t){if(e.getAttribute(`aria-busy`)===`true`){r.checked=!r.checked;return}i(`pointer`),(n===`change`||n===`input`)&&d(e,`lifelock:switch:commit`,{checked:r.checked,source:`pointer`})}function o(t){(t.key===` `||t.key===`Enter`)&&e.getAttribute(`aria-busy`)!==`true`&&d(e,`lifelock:switch:commit`,{checked:r.checked,source:`keyboard`})}return r.addEventListener(`change`,a),r.addEventListener(`keyup`,o),e.classList.toggle(`is-checked`,r.checked),r.setAttribute(`aria-checked`,r.checked?`true`:`false`),{getChecked(){return r.checked},setChecked(t){r.checked=!!t,i(`api`),d(e,`lifelock:switch:commit`,{checked:r.checked,source:`api`})},setDisabled(t){t?(e.setAttribute(`aria-disabled`,`true`),e.classList.add(`is-disabled`),r.disabled=!0):(e.removeAttribute(`aria-disabled`),e.classList.remove(`is-disabled`),r.disabled=!1)},destroy(){r.removeEventListener(`change`,a),r.removeEventListener(`keyup`,o),delete e.dataset.switchInitialised}}}function p(e,t){let n=e&&typeof e.querySelectorAll==`function`?e:typeof document<`u`?document:null;return n?Array.from(n.querySelectorAll(`.c-switch`)).map(e=>f(e,t)):[]}function m(){if(h||typeof document>`u`||typeof MutationObserver>`u`)return;h=!0;let e=e=>{!e||e.nodeType!==1||(e.classList?.contains(`c-switch`)&&!e.dataset?.switchInitialised&&f(e),e.querySelectorAll?.(`.c-switch:not([data-switch-initialised])`).forEach(e=>{f(e)}))},t=()=>{document.body&&(g=new MutationObserver(t=>{for(let n of t)n.addedNodes.forEach(e)}),g.observe(document.body,{childList:!0,subtree:!0}))};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,t,{once:!0}):t()}var h,g;function _(){return(_=e((()=>{h=!1,g=null})))()}function v(e){return{...e}}function y({tone:e,checked:t,label:n}){let r=v({...w,tone:e,checked:t,label:n});return`
    <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;min-inline-size:140px;">
      <div>${x(r)}</div>
      <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e} · ${t?`on`:`off`}</figcaption>
    </figure>
  `}function b(e){let t=v({...w,tone:`default`,checked:!0,state:[`hover`,`focused`,`pressed`].includes(e)?e:`default`,disabled:e===`disabled`,loading:e===`loading`,label:`State = ${e}`});return`
    <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;min-inline-size:140px;">
      <div>${x(t)}</div>
      <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e}</figcaption>
    </figure>
  `}var x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{n(),i(),c(),u(),r(),_(),m(),x=a.default.compile(t),S=[`default`,`success`,`critical`],C=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=717-48394&m=dev`,w={tone:`default`,checked:!0,disabled:!1,loading:!1,showIcon:!0,label:`Notifications`,accessibleLabel:``,name:`notifications`,value:`on`},T=async({canvasElement:e})=>{p(e)},E={title:`Molecules/Controls/Switch`,tags:[`autodocs`],parameters:{docs:{description:{component:`Switch — binary toggle. Inherited from core. [Figma](${C}).`}}},argTypes:{tone:{control:{type:`inline-radio`},options:S,name:`Tone`},checked:{control:`boolean`,name:`Checked`},disabled:{control:`boolean`,name:`Disabled`},loading:{control:`boolean`,name:`Loading`},showIcon:{control:`boolean`,name:`Show icon`},label:{control:`text`,name:`Label`},accessibleLabel:{control:`text`,name:`Accessible label`},name:{control:`text`,name:`Name`},value:{control:`text`,name:`Value`}},args:w,render:e=>x(v(e))},D={name:`Demo`,play:T,parameters:o(x(v(w)),{scss:s,js:l})},O={name:`AllStyles`,play:T,render:()=>`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Tone × Checked</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          ${S.flatMap(e=>[y({tone:e,checked:!1,label:`${e} · Off`}),y({tone:e,checked:!0,label:`${e} · On`})]).join(``)}
        </div>
      </section>
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Interaction / persistent states</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          ${[`default`,`hover`,`focused`,`pressed`,`disabled`,`loading`].map(e=>b(e)).join(``)}
        </div>
      </section>
    </div>
  `},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  play: playInitSwitches,
  parameters: htmlStoryParameters(compiled(buildArgs(defaultArgs)), {
    scss: scssSource,
    js: jsSource
  })
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  play: playInitSwitches,
  render: () => \`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Tone × Checked</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          \${TONE_OPTIONS.flatMap(tone => [toneCard({
    tone,
    checked: false,
    label: \`\${tone} · Off\`
  }), toneCard({
    tone,
    checked: true,
    label: \`\${tone} · On\`
  })]).join('')}
        </div>
      </section>
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Interaction / persistent states</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          \${['default', 'hover', 'focused', 'pressed', 'disabled', 'loading'].map(s => stateCard(s)).join('')}
        </div>
      </section>
    </div>
  \`
}`,...O.parameters?.docs?.source}}},k=[`Demo`,`AllStyles`]})))()}A();export{O as AllStyles,D as Demo,k as __namedExportsOrder,E as default};