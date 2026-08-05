import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Nt as t,Pt as n,i as r,n as i,r as a,t as o}from"./pretty-source-CqFWUhTp.js";import"./radio-CO5cRz9t.js";var s;function c(){return(c=e((()=>{s=`/**
 * Components/Radio — 24 × 24 px circle for single-select grouping,
 * progressive-enhanced over a native \`<input type="radio">\`.
 *
 * Mirrors Web-ODS Shared Library master \`666:36462\` under the
 * LifeLock mode pick. Visual architecture and state-wash mechanics
 * mirror the sibling Checkbox component verbatim — see
 * \`src/components/checkbox/checkbox.scss\` for the rationale. The
 * only differences are the circular geometry (no corners) and the
 * centred white dot in the checked state.
 *
 * Tokens consumed are listed in \`./spec.md\` § "Tokens consumed".
 */

.c-radio {
  --c-radio-box-size:        24px;
  --c-radio-dot-size:        8px;
  --c-radio-state-circle:    32px;
  --c-radio-outline-width:   var(--border-width-default);

  --c-radio-box-fill:        var(--color-bg-default);
  --c-radio-box-outline:     var(--color-border-strong);
  --c-radio-fill-color:      var(--color-signal-info);
  --c-radio-dot-color:       var(--color-text-inverse);
  --c-radio-focus-color:     var(--color-border-focus);
  --c-radio-label-color:     var(--color-text-primary);

  /* State-wash colour — see checkbox.scss for the substitution
     rationale (LifeLock has no \`inverse-secondary\` alias). */
  --c-radio-state-color:        color-mix(in srgb, var(--color-text-secondary) 20%, transparent);
  --c-radio-state-color-strong: color-mix(in srgb, var(--color-text-secondary) 30%, transparent);

  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  user-select: none;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  font-weight: var(--font-weight-regular);
  color: var(--c-radio-label-color);
}

/* --- Tone variants -------------------------------------------- */

.c-radio--accent {
  --c-radio-fill-color: var(--color-signal-success);
}

.c-radio--critical {
  --c-radio-fill-color: var(--color-signal-critical);
}

/* --- Control wrapper ------------------------------------------ */

.c-radio__control {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--c-radio-state-circle);
  block-size:  var(--c-radio-state-circle);
  flex-shrink: 0;
}

/* --- Native input -------------------------------------------- */

.c-radio__input {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  margin: 0;
  padding: 0;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--border-radius-pill);
  opacity: 0;
  cursor: inherit;
  z-index: 2;
}

/* --- State circle (hover / focus / pressed wash) -------------- */

.c-radio__state-circle {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  border-radius: var(--border-radius-pill);
  background-color: transparent;
  pointer-events: none;
  transition: background-color 120ms ease;
}

/* --- Visible box (circle) ------------------------------------- */

.c-radio__box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--c-radio-box-size);
  block-size:  var(--c-radio-box-size);
  background-color: var(--c-radio-box-fill);
  border: var(--c-radio-outline-width) solid var(--c-radio-box-outline);
  border-radius: var(--border-radius-pill);
  z-index: 1;
}

/* --- Centred dot ---------------------------------------------- */

.c-radio__dot {
  display: block;
  inline-size: var(--c-radio-dot-size);
  block-size:  var(--c-radio-dot-size);
  background-color: var(--c-radio-dot-color);
  border-radius: var(--border-radius-pill);
  opacity: 0;
  transition: opacity 120ms ease;
}

/* --- Checked state ------------------------------------------- */

.c-radio.is-checked .c-radio__box {
  background-color: var(--c-radio-fill-color);
  border-color: var(--c-radio-fill-color);
}

.c-radio.is-checked .c-radio__dot {
  opacity: 1;
}

/* --- Visible label ------------------------------------------- */

.c-radio__label {
  display: inline-block;
  color: var(--c-radio-label-color);
}

/* --- Hover / pressed (interaction states) --------------------- */

.c-radio__input:hover ~ .c-radio__state-circle {
  background-color: var(--c-radio-state-color);
}

.c-radio__input:active ~ .c-radio__state-circle {
  background-color: var(--c-radio-state-color-strong);
}

/* --- Focus ring (drawn on the state-circle area) ------------- */

.c-radio__input:focus-visible ~ .c-radio__state-circle {
  background-color: var(--c-radio-state-color);
  outline: var(--border-width-default) solid var(--c-radio-focus-color);
  outline-offset: 0;
}

/* --- [data-state] gallery freezes ----------------------------- */

.c-radio[data-state="hover"] .c-radio__state-circle {
  background-color: var(--c-radio-state-color);
}

.c-radio[data-state="pressed"] .c-radio__state-circle {
  background-color: var(--c-radio-state-color-strong);
}

.c-radio[data-state="focused"] .c-radio__state-circle {
  background-color: var(--c-radio-state-color);
  outline: var(--border-width-default) solid var(--c-radio-focus-color);
  outline-offset: 0;
}

/* --- Disabled state ------------------------------------------- */

.c-radio.is-disabled,
.c-radio[aria-disabled="true"] {
  --c-radio-box-fill:      var(--color-disabled-bg);
  --c-radio-box-outline:   var(--color-disabled-border);
  --c-radio-fill-color:    var(--color-disabled-border);
  --c-radio-dot-color:     var(--color-disabled-text);
  --c-radio-label-color:   var(--color-disabled-text);

  cursor: not-allowed;
}

.c-radio.is-disabled .c-radio__input,
.c-radio[aria-disabled="true"] .c-radio__input {
  cursor: not-allowed;
  pointer-events: none;
}

.c-radio.is-disabled .c-radio__state-circle,
.c-radio[aria-disabled="true"] .c-radio__state-circle {
  background-color: transparent;
}

/* --- Reduced motion ------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .c-radio__state-circle,
  .c-radio__dot {
    transition: none;
  }
}
`})))()}var l;function u(){return(u=e((()=>{l=`/**
 * Components/Radio behaviour layer.
 *
 * Progressive enhancement on top of the native
 * \`<input type="radio">\` the template emits. The browser owns
 * single-select group enforcement (any radio with the same \`name\`)
 * and the arrow-key navigation between members of the group; this
 * layer's only jobs are:
 *
 *   1. Mirror the input's \`checked\` state onto the root's
 *      \`is-checked\` modifier so the visible dot + fill can paint
 *      via the modifier class.
 *   2. Dispatch namespaced \`lifelock:radio:change\` and
 *      \`lifelock:radio:commit\` CustomEvents.
 *   3. Listen for change events on *sibling* radios in the same
 *      group so the unchecked radios in the group repaint when one
 *      of them becomes selected.
 *
 * Public API documented in \`./spec.md\` § "JavaScript API".
 */

/**
 * @typedef {Object} RadioInitOptions
 * @property {"input"|"change"} [commitOn="change"]
 */

/**
 * @typedef {Object} RadioInstance
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

function syncFromInput(root, input) {
  root.classList.toggle("is-checked", input.checked);
}

/**
 * Initialise one radio root.
 *
 * @param {HTMLElement} root
 * @param {RadioInitOptions} [options]
 * @returns {RadioInstance}
 */
export function initRadio(root, options = {}) {
  if (!root || root.dataset.radioInitialised === "true") {
    return /** @type {RadioInstance} */ ({
      getChecked: () => false,
      setChecked: () => {},
      setDisabled: () => {},
      destroy: () => {},
    });
  }
  root.dataset.radioInitialised = "true";

  const commitOn = options.commitOn === "input" ? "input" : "change";

  /** @type {HTMLInputElement | null} */
  const input = root.querySelector(".c-radio__input");
  if (!input) {
    return /** @type {RadioInstance} */ ({
      getChecked: () => false,
      setChecked: () => {},
      setDisabled: () => {},
      destroy: () => {},
    });
  }

  syncFromInput(root, input);

  /** @param {Event} _e */
  function onChange(_e) {
    syncFromInput(root, input);
    dispatch(root, "lifelock:radio:change", {
      checked: input.checked,
      name: input.name,
      value: input.value,
    });
    if (commitOn === "change" || commitOn === "input") {
      dispatch(root, "lifelock:radio:commit", {
        checked: input.checked,
        name: input.name,
        value: input.value,
        source: "pointer",
      });
    }
  }

  /** @param {KeyboardEvent} e */
  function onKeyUp(e) {
    if (e.key !== " " && e.key !== "Enter" &&
      e.key !== "ArrowUp" && e.key !== "ArrowDown" &&
      e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
      return;
    }
    dispatch(root, "lifelock:radio:commit", {
      checked: input.checked,
      name: input.name,
      value: input.value,
      source: "keyboard",
    });
  }

  // When a sibling radio in the same group changes, this radio
  // becomes unchecked — repaint to clear the dot. Native radios
  // don't fire \`change\` on the radios being unchecked, so we
  // listen on the document.
  function onDocChange(e) {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target === input) return;
    if (target.type !== "radio") return;
    if (target.name !== input.name) return;
    syncFromInput(root, input);
  }

  input.addEventListener("change", onChange);
  input.addEventListener("keyup", onKeyUp);
  if (typeof document !== "undefined") {
    document.addEventListener("change", onDocChange, true);
  }

  return {
    getChecked() {
      return input.checked;
    },
    setChecked(next) {
      input.checked = Boolean(next);
      syncFromInput(root, input);
      dispatch(root, "lifelock:radio:commit", {
        checked: input.checked,
        name: input.name,
        value: input.value,
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
      if (typeof document !== "undefined") {
        document.removeEventListener("change", onDocChange, true);
      }
      delete root.dataset.radioInitialised;
    },
  };
}

/**
 * Initialise every radio inside a scope.
 *
 * @param {ParentNode} [scope]
 * @param {RadioInitOptions} [options]
 * @returns {RadioInstance[]}
 */
export function initRadios(scope, options) {
  const root =
    scope && typeof scope.querySelectorAll === "function"
      ? scope
      : typeof document !== "undefined"
      ? document
      : null;
  if (!root) return [];
  return Array.from(root.querySelectorAll(".c-radio")).map((el) =>
    initRadio(/** @type {HTMLElement} */ (el), options),
  );
}
`})))()}function d(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0}))}function f(e,t){e.classList.toggle(`is-checked`,t.checked)}function p(e,t={}){if(!e||e.dataset.radioInitialised===`true`)return{getChecked:()=>!1,setChecked:()=>{},setDisabled:()=>{},destroy:()=>{}};e.dataset.radioInitialised=`true`;let n=t.commitOn===`input`?`input`:`change`,r=e.querySelector(`.c-radio__input`);if(!r)return{getChecked:()=>!1,setChecked:()=>{},setDisabled:()=>{},destroy:()=>{}};f(e,r);function i(t){f(e,r),d(e,`lifelock:radio:change`,{checked:r.checked,name:r.name,value:r.value}),(n===`change`||n===`input`)&&d(e,`lifelock:radio:commit`,{checked:r.checked,name:r.name,value:r.value,source:`pointer`})}function a(t){(t.key===` `||t.key===`Enter`||t.key===`ArrowUp`||t.key===`ArrowDown`||t.key===`ArrowLeft`||t.key===`ArrowRight`)&&d(e,`lifelock:radio:commit`,{checked:r.checked,name:r.name,value:r.value,source:`keyboard`})}function o(t){let n=t.target;n instanceof HTMLInputElement&&n!==r&&n.type===`radio`&&n.name===r.name&&f(e,r)}return r.addEventListener(`change`,i),r.addEventListener(`keyup`,a),typeof document<`u`&&document.addEventListener(`change`,o,!0),{getChecked(){return r.checked},setChecked(t){r.checked=!!t,f(e,r),d(e,`lifelock:radio:commit`,{checked:r.checked,name:r.name,value:r.value,source:`api`})},setDisabled(t){t?(e.setAttribute(`aria-disabled`,`true`),e.classList.add(`is-disabled`),r.disabled=!0):(e.removeAttribute(`aria-disabled`),e.classList.remove(`is-disabled`),r.disabled=!1)},destroy(){r.removeEventListener(`change`,i),r.removeEventListener(`keyup`,a),typeof document<`u`&&document.removeEventListener(`change`,o,!0),delete e.dataset.radioInitialised}}}function m(e,t){let n=e&&typeof e.querySelectorAll==`function`?e:typeof document<`u`?document:null;return n?Array.from(n.querySelectorAll(`.c-radio`)).map(e=>p(e,t)):[]}function h(){if(g||typeof document>`u`||typeof MutationObserver>`u`)return;g=!0;let e=e=>{!e||e.nodeType!==1||(e.classList?.contains(`c-radio`)&&!e.dataset?.radioInitialised&&p(e),e.querySelectorAll?.(`.c-radio:not([data-radio-initialised])`).forEach(e=>{p(e)}))},t=()=>{document.body&&(_=new MutationObserver(t=>{for(let n of t)n.addedNodes.forEach(e)}),_.observe(document.body,{childList:!0,subtree:!0}))};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,t,{once:!0}):t()}var g,_;function v(){return(v=e((()=>{g=!1,_=null})))()}function y(e){return{...e}}function b(e){return A+=1,`${e}-${A}`}function x({tone:e,checked:t,label:n}){let r=y({...E,tone:e,checked:t,label:n,name:b(`radio-${e}`),value:t?`on`:`off`});return`
    <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;min-inline-size:120px;">
      <div>${C(r)}</div>
      <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e} · ${t?`on`:`off`}</figcaption>
    </figure>
  `}function S(e){let t=y({...E,tone:`default`,checked:!0,state:e===`disabled`?`default`:e,disabled:e===`disabled`,label:`State = ${e}`,name:b(`radio-state`),value:`on`});return`
    <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;min-inline-size:120px;">
      <div>${C(t)}</div>
      <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e}</figcaption>
    </figure>
  `}var C,w,T,E,D,O,k,A,j,M;function N(){return(N=e((()=>{r(),i(),c(),u(),t(),v(),h(),C=a.default.compile(n),w=[`default`,`accent`,`critical`],T=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=666-36462&m=dev`,E={tone:`default`,checked:!1,disabled:!1,name:`demo-group`,value:`option-1`,label:`Option one`,accessibleLabel:``},D=async({canvasElement:e})=>{m(e)},O={title:`Molecules/Controls/Radio`,tags:[`autodocs`],parameters:{docs:{description:{component:`Radio — single-select control. Inherited from core. [Figma](${T}).`}}},argTypes:{tone:{control:{type:`inline-radio`},options:w,name:`Tone`},checked:{control:`boolean`,name:`Checked`},disabled:{control:`boolean`,name:`Disabled`},name:{control:`text`,name:`Name`},value:{control:`text`,name:`Value`},label:{control:`text`,name:`Label`},accessibleLabel:{control:`text`,name:`Accessible label`}},args:E,render:e=>C(y(e))},k={name:`Demo`,play:D,parameters:o(C(y(E)),{scss:s,js:l})},A=0,j={name:`AllStyles`,play:D,render:()=>`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Tone × Checked</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          ${x({tone:`default`,checked:!1,label:`Default · Off`})}
          ${x({tone:`default`,checked:!0,label:`Default · On`})}
          ${x({tone:`accent`,checked:!1,label:`Accent · Off`})}
          ${x({tone:`accent`,checked:!0,label:`Accent · On`})}
          ${x({tone:`critical`,checked:!1,label:`Critical · Off`})}
          ${x({tone:`critical`,checked:!0,label:`Critical · On`})}
        </div>
      </section>
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Interaction states (default · checked)</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          ${[`default`,`hover`,`focused`,`pressed`,`disabled`].map(e=>S(e)).join(``)}
        </div>
      </section>
    </div>
  `},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  play: playInitRadios,
  parameters: htmlStoryParameters(compiled(buildArgs(defaultArgs)), {
    scss: scssSource,
    js: jsSource
  })
}`,...k.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  play: playInitRadios,
  render: () => \`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Tone × Checked</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          \${toneCard({
    tone: 'default',
    checked: false,
    label: 'Default · Off'
  })}
          \${toneCard({
    tone: 'default',
    checked: true,
    label: 'Default · On'
  })}
          \${toneCard({
    tone: 'accent',
    checked: false,
    label: 'Accent · Off'
  })}
          \${toneCard({
    tone: 'accent',
    checked: true,
    label: 'Accent · On'
  })}
          \${toneCard({
    tone: 'critical',
    checked: false,
    label: 'Critical · Off'
  })}
          \${toneCard({
    tone: 'critical',
    checked: true,
    label: 'Critical · On'
  })}
        </div>
      </section>
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Interaction states (default · checked)</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          \${['default', 'hover', 'focused', 'pressed', 'disabled'].map(s => stateCard(s)).join('')}
        </div>
      </section>
    </div>
  \`
}`,...j.parameters?.docs?.source}}},M=[`Demo`,`AllStyles`]})))()}N();export{j as AllStyles,k as Demo,M as __namedExportsOrder,O as default};