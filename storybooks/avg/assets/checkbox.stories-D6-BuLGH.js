import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,l as n,n as r,r as i,t as a,u as o}from"./pretty-source-DwGzqKJg.js";var s;function c(){return(c=e((()=>{s=`/**
 * Components/Checkbox — 24 × 24 px box with optional checkmark or
 * indeterminate-dash glyph, progressive-enhanced over a native
 * \`<input type="checkbox">\`.
 *
 * Mirrors Web-ODS Shared Library master \`665:36315\` + the per-tone
 * hover/pressed state-circle composition at \`665:36267\` under the
 * LifeLock mode pick. The state circle is a 32 × 32 px wash painted
 * 4 px outside the box on every side via \`--color-inverse-secondary\`
 * at 20% (\`color-mix()\`); it paints on hover / focus / pressed and
 * gives the focusable area a generous hit target without changing
 * the box's visual footprint.
 *
 * All inline-axis sizing uses logical properties.
 *
 * Tokens consumed are listed in \`./spec.md\` § "Tokens consumed".
 *
 * Composes Icon — the check / dash glyphs are \`{{> icon}}\` instances;
 * pull in \`.c-icon\` mask styles so brand Storybooks that only import
 * this partial still paint the glyphs.
 */

@use '../icon/icon';

.c-checkbox {
  /* Per-instance dials. */
  --c-checkbox-box-size:        24px;
  --c-checkbox-state-circle:    32px;
  --c-checkbox-state-outset:    4px;
  --c-checkbox-radius:          var(--border-radius-control);
  --c-checkbox-outline-width:   var(--border-width-default);

  --c-checkbox-box-fill:        var(--color-bg-default);
  --c-checkbox-box-outline:     var(--color-border-strong);
  --c-checkbox-fill-color:      var(--color-signal-info);
  --c-checkbox-glyph-color:     var(--color-text-inverse);
  --c-checkbox-focus-color:     var(--color-border-focus);
  --c-checkbox-label-color:     var(--color-text-primary);

  /* The state-circle wash. Figma source on the multi-brand master is
     \`rgba(80, 81, 101, 0.2)\` — the white-label \`inverse-secondary\`
     token at 20% opacity. LifeLock has no \`inverse-secondary\` alias
     today, so the wash mixes \`--color-text-secondary\`
     (= \`--color-off-black\` under LifeLock mode) at 20% / 30% — a
     near-black wash that paints the same visual role on the LifeLock
     surface palette. Designer follow-up: publish a dedicated
     \`--color-state-wash\` semantic alias so this consumer doesn't bind
     to a text-role token. */
  --c-checkbox-state-color:        color-mix(in srgb, var(--color-text-secondary) 20%, transparent);
  --c-checkbox-state-color-strong: color-mix(in srgb, var(--color-text-secondary) 30%, transparent);

  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  user-select: none;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  font-weight: var(--font-weight-regular);
  color: var(--c-checkbox-label-color);
}

/* --- Tone variants -------------------------------------------- */

.c-checkbox--accent {
  --c-checkbox-fill-color: var(--color-signal-success);
}

.c-checkbox--critical {
  --c-checkbox-fill-color: var(--color-signal-critical);
}

/* --- Control wrapper (positions the input + state-circle + box) - */

.c-checkbox__control {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--c-checkbox-state-circle);
  block-size:  var(--c-checkbox-state-circle);
  flex-shrink: 0;
}

/* --- Native input -------------------------------------------- */

/* Absolutely positioned to cover the 32×32 state-circle region so
   the entire ring is clickable + focus-ringable. Invisible. */
.c-checkbox__input {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  margin: 0;
  padding: 0;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--c-checkbox-radius);
  opacity: 0;
  cursor: inherit;
  z-index: 2;
}

/* --- State circle (hover / focus / pressed wash) -------------- */

.c-checkbox__state-circle {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  border-radius: var(--c-checkbox-radius);
  background-color: transparent;
  pointer-events: none;
  transition: background-color 120ms ease;
}

/* --- Visible box --------------------------------------------- */

.c-checkbox__box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--c-checkbox-box-size);
  block-size:  var(--c-checkbox-box-size);
  background-color: var(--c-checkbox-box-fill);
  border: var(--c-checkbox-outline-width) solid var(--c-checkbox-box-outline);
  border-radius: var(--c-checkbox-radius);
  color: var(--c-checkbox-glyph-color);
  z-index: 1;
}

/* --- Glyph wrappers (always rendered; CSS toggles opacity) ----- */

/* Both check + dash glyphs ship in the markup so a JS click-driven
   transition between unchecked → checked / indeterminate doesn't have
   to insert nodes. Visibility is purely CSS-driven via the \`is-checked\`
   / \`is-indeterminate\` modifier classes that \`checkbox.js\` (and the
   \`Selection\` Storybook control) toggle on the root. The wrappers are
   absolutely positioned so they stack inside the box without affecting
   layout when both are hidden. */
.c-checkbox__glyph {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 120ms ease;
  pointer-events: none;
}

.c-checkbox.is-checked .c-checkbox__glyph--check {
  opacity: 1;
}

.c-checkbox.is-indeterminate .c-checkbox__glyph--dash {
  opacity: 1;
}

/* Glyph element fills the 24 px box so the \`-small\` SVG (whose visible
   path occupies ~50 % of its 24 px viewBox) reproduces Figma's ~12 px
   visible checkmark. mask-image keeps the glyph crisp at any size. */
.c-checkbox__box .c-icon {
  display: inline-flex;
  inline-size: var(--c-checkbox-box-size);
  block-size:  var(--c-checkbox-box-size);
}

/* --- Checked + indeterminate (filled paint) ------------------- */

.c-checkbox.is-checked .c-checkbox__box,
.c-checkbox.is-indeterminate .c-checkbox__box {
  background-color: var(--c-checkbox-fill-color);
  border-color: var(--c-checkbox-fill-color);
}

/* --- Visible label ------------------------------------------- */

.c-checkbox__label {
  display: inline-block;
  color: var(--c-checkbox-label-color);
}

/* --- Hover / pressed (interaction states) --------------------- */

.c-checkbox__input:hover ~ .c-checkbox__state-circle {
  background-color: var(--c-checkbox-state-color);
}

.c-checkbox__input:active ~ .c-checkbox__state-circle {
  background-color: var(--c-checkbox-state-color-strong);
}

/* --- Focus ring (drawn on the state-circle area) ------------- */

.c-checkbox__input:focus-visible ~ .c-checkbox__state-circle {
  background-color: var(--c-checkbox-state-color);
  outline: var(--border-width-default) solid var(--c-checkbox-focus-color);
  outline-offset: 0;
}

/* --- [data-state] gallery freezes ----------------------------- */

.c-checkbox[data-state="hover"] .c-checkbox__state-circle {
  background-color: var(--c-checkbox-state-color);
}

.c-checkbox[data-state="pressed"] .c-checkbox__state-circle {
  background-color: var(--c-checkbox-state-color-strong);
}

.c-checkbox[data-state="focused"] .c-checkbox__state-circle {
  background-color: var(--c-checkbox-state-color);
  outline: var(--border-width-default) solid var(--c-checkbox-focus-color);
  outline-offset: 0;
}

/* --- Disabled state ------------------------------------------- */

.c-checkbox.is-disabled,
.c-checkbox[aria-disabled="true"] {
  --c-checkbox-box-fill:      var(--color-disabled-bg);
  --c-checkbox-box-outline:   var(--color-disabled-border);
  --c-checkbox-fill-color:    var(--color-disabled-bg);
  --c-checkbox-glyph-color:   var(--color-disabled-text);
  --c-checkbox-label-color:   var(--color-disabled-text);

  cursor: not-allowed;
}

.c-checkbox.is-disabled .c-checkbox__input,
.c-checkbox[aria-disabled="true"] .c-checkbox__input {
  cursor: not-allowed;
  pointer-events: none;
}

.c-checkbox.is-disabled .c-checkbox__state-circle,
.c-checkbox[aria-disabled="true"] .c-checkbox__state-circle {
  background-color: transparent;
}

/* Disabled + checked / indeterminate still paints the disabled fill,
   not the tone fill — explicit override since the modifier rules
   above set border-color to the tone color. */
.c-checkbox.is-disabled.is-checked .c-checkbox__box,
.c-checkbox.is-disabled.is-indeterminate .c-checkbox__box,
.c-checkbox[aria-disabled="true"].is-checked .c-checkbox__box,
.c-checkbox[aria-disabled="true"].is-indeterminate .c-checkbox__box {
  background-color: var(--color-disabled-border);
  border-color: var(--color-disabled-border);
}

/* --- Reduced motion ------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .c-checkbox__state-circle {
    transition: none;
  }
}
`})))()}var l;function u(){return(u=e((()=>{l=`/**
 * Components/Checkbox behaviour layer.
 *
 * Progressive enhancement on top of the native
 * \`<input type="checkbox">\` the template emits. The SCSS paints
 * every persistent + transient state from class modifiers + CSS
 * pseudo-classes; this layer's only jobs are:
 *
 *   1. Keep the native \`indeterminate\` JS property in sync with the
 *      \`is-indeterminate\` modifier class. (\`indeterminate\` is a
 *      JS-only DOM property; HTML attributes alone cannot set it.)
 *   2. Toggle \`is-checked\` / \`is-indeterminate\` based on the input's
 *      \`checked\` state on change.
 *   3. Dispatch namespaced \`lifelock:checkbox:change\` and
 *      \`lifelock:checkbox:commit\` CustomEvents.
 *
 * Public API documented in \`./spec.md\` § "JavaScript API".
 */

/**
 * @typedef {"unchecked" | "checked" | "indeterminate"} CheckboxSelection
 */

/**
 * @typedef {Object} CheckboxInitOptions
 * @property {"input"|"change"} [commitOn="change"]
 */

/**
 * @typedef {Object} CheckboxInstance
 * @property {() => CheckboxSelection} getSelection
 * @property {(next: CheckboxSelection) => void} setSelection
 * @property {(disabled: boolean) => void} setDisabled
 * @property {() => void} destroy
 */

function dispatch(root, name, detail) {
  root.dispatchEvent(
    new CustomEvent(name, { detail, bubbles: true, composed: true }),
  );
}

/**
 * Initialise one checkbox root.
 *
 * @param {HTMLElement} root
 * @param {CheckboxInitOptions} [options]
 * @returns {CheckboxInstance}
 */
export function initCheckbox(root, options = {}) {
  if (!root || root.dataset.checkboxInitialised === "true") {
    return /** @type {CheckboxInstance} */ ({
      getSelection: () => "unchecked",
      setSelection: () => {},
      setDisabled: () => {},
      destroy: () => {},
    });
  }
  root.dataset.checkboxInitialised = "true";

  const commitOn = options.commitOn === "input" ? "input" : "change";

  /** @type {HTMLInputElement | null} */
  const input = root.querySelector(".c-checkbox__input");
  if (!input) {
    return /** @type {CheckboxInstance} */ ({
      getSelection: () => "unchecked",
      setSelection: () => {},
      setDisabled: () => {},
      destroy: () => {},
    });
  }

  // Honor the initial indeterminate visual by setting the native JS
  // property so screen readers announce "Mixed".
  if (root.classList.contains("is-indeterminate")) {
    input.indeterminate = true;
  }

  function paint(source) {
    const checked = input.checked;
    root.classList.toggle("is-checked", checked);
    root.classList.remove("is-indeterminate");
    input.indeterminate = false;
    dispatch(root, "lifelock:checkbox:change", {
      selection: checked ? "checked" : "unchecked",
      source,
    });
  }

  /** @param {Event} _e */
  function onChange(_e) {
    paint("pointer");
    if (commitOn === "change" || commitOn === "input") {
      dispatch(root, "lifelock:checkbox:commit", {
        selection: input.checked ? "checked" : "unchecked",
        source: "pointer",
      });
    }
  }

  /** @param {KeyboardEvent} e */
  function onKeyUp(e) {
    if (e.key !== " " && e.key !== "Enter") return;
    dispatch(root, "lifelock:checkbox:commit", {
      selection: input.checked ? "checked" : "unchecked",
      source: "keyboard",
    });
  }

  input.addEventListener("change", onChange);
  input.addEventListener("keyup", onKeyUp);

  return {
    getSelection() {
      if (input.indeterminate) return "indeterminate";
      return input.checked ? "checked" : "unchecked";
    },
    setSelection(next) {
      if (next === "indeterminate") {
        input.checked = false;
        input.indeterminate = true;
        root.classList.remove("is-checked");
        root.classList.add("is-indeterminate");
      } else if (next === "checked") {
        input.checked = true;
        input.indeterminate = false;
        root.classList.add("is-checked");
        root.classList.remove("is-indeterminate");
      } else {
        input.checked = false;
        input.indeterminate = false;
        root.classList.remove("is-checked");
        root.classList.remove("is-indeterminate");
      }
      dispatch(root, "lifelock:checkbox:commit", {
        selection: next === "indeterminate" ? "unchecked" : next,
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
      delete root.dataset.checkboxInitialised;
    },
  };
}

/**
 * Initialise every checkbox inside a scope.
 *
 * @param {ParentNode} [scope]
 * @param {CheckboxInitOptions} [options]
 * @returns {CheckboxInstance[]}
 */
export function initCheckboxes(scope, options) {
  const root =
    scope && typeof scope.querySelectorAll === "function"
      ? scope
      : typeof document !== "undefined"
      ? document
      : null;
  if (!root) return [];
  return Array.from(root.querySelectorAll(".c-checkbox")).map((el) =>
    initCheckbox(/** @type {HTMLElement} */ (el), options),
  );
}
`})))()}function d(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0}))}function f(e,t={}){if(!e||e.dataset.checkboxInitialised===`true`)return{getSelection:()=>`unchecked`,setSelection:()=>{},setDisabled:()=>{},destroy:()=>{}};e.dataset.checkboxInitialised=`true`;let n=t.commitOn===`input`?`input`:`change`,r=e.querySelector(`.c-checkbox__input`);if(!r)return{getSelection:()=>`unchecked`,setSelection:()=>{},setDisabled:()=>{},destroy:()=>{}};e.classList.contains(`is-indeterminate`)&&(r.indeterminate=!0);function i(t){let n=r.checked;e.classList.toggle(`is-checked`,n),e.classList.remove(`is-indeterminate`),r.indeterminate=!1,d(e,`lifelock:checkbox:change`,{selection:n?`checked`:`unchecked`,source:t})}function a(t){i(`pointer`),(n===`change`||n===`input`)&&d(e,`lifelock:checkbox:commit`,{selection:r.checked?`checked`:`unchecked`,source:`pointer`})}function o(t){(t.key===` `||t.key===`Enter`)&&d(e,`lifelock:checkbox:commit`,{selection:r.checked?`checked`:`unchecked`,source:`keyboard`})}return r.addEventListener(`change`,a),r.addEventListener(`keyup`,o),{getSelection(){return r.indeterminate?`indeterminate`:r.checked?`checked`:`unchecked`},setSelection(t){t===`indeterminate`?(r.checked=!1,r.indeterminate=!0,e.classList.remove(`is-checked`),e.classList.add(`is-indeterminate`)):t===`checked`?(r.checked=!0,r.indeterminate=!1,e.classList.add(`is-checked`),e.classList.remove(`is-indeterminate`)):(r.checked=!1,r.indeterminate=!1,e.classList.remove(`is-checked`),e.classList.remove(`is-indeterminate`)),d(e,`lifelock:checkbox:commit`,{selection:t===`indeterminate`?`unchecked`:t,source:`api`})},setDisabled(t){t?(e.setAttribute(`aria-disabled`,`true`),e.classList.add(`is-disabled`),r.disabled=!0):(e.removeAttribute(`aria-disabled`),e.classList.remove(`is-disabled`),r.disabled=!1)},destroy(){r.removeEventListener(`change`,a),r.removeEventListener(`keyup`,o),delete e.dataset.checkboxInitialised}}}function p(e,t){let n=e&&typeof e.querySelectorAll==`function`?e:typeof document<`u`?document:null;return n?Array.from(n.querySelectorAll(`.c-checkbox`)).map(e=>f(e,t)):[]}function m(){if(h||typeof document>`u`||typeof MutationObserver>`u`)return;h=!0;let e=e=>{!e||e.nodeType!==1||(e.classList?.contains(`c-checkbox`)&&!e.dataset?.checkboxInitialised&&f(e),e.querySelectorAll?.(`.c-checkbox:not([data-checkbox-initialised])`).forEach(e=>{f(e)}))},t=()=>{document.body&&(g=new MutationObserver(t=>{for(let n of t)n.addedNodes.forEach(e)}),g.observe(document.body,{childList:!0,subtree:!0}))};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,t,{once:!0}):t()}var h,g;function _(){return(_=e((()=>{h=!1,g=null})))()}function v(e){return{...e}}function y({tone:e,selection:t,label:n}){let r=v({...T,tone:e,selection:t,label:n});return`
    <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;min-inline-size:140px;">
      <div>${x(r)}</div>
      <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e} · ${t}</figcaption>
    </figure>
  `}function b(e){let t=v({...T,tone:`default`,selection:`checked`,state:e===`disabled`?`default`:e,disabled:e===`disabled`,label:`State = ${e}`});return`
    <figure style="margin:0;display:flex;flex-direction:column;gap:8px;align-items:flex-start;min-inline-size:140px;">
      <div>${x(t)}</div>
      <figcaption style="font:11px/14px ui-monospace,Menlo,monospace;color:var(--color-text-secondary,#555);">${e}</figcaption>
    </figure>
  `}var x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{t(),r(),c(),u(),o(),_(),m(),x=i.default.compile(n),S=[`default`,`accent`,`critical`],C=[`unchecked`,`checked`,`indeterminate`],w=`https://www.figma.com/design/0o8SL5BEk8wHtgud00dRyg/Web-ODS-Shared-Library?node-id=665-36315&m=dev`,T={tone:`default`,selection:`unchecked`,disabled:!1,label:`I agree to the terms`,accessibleLabel:``,name:`agree`,value:`yes`},E=async({canvasElement:e})=>{p(e)},D={title:`Molecules/Controls/Checkbox`,tags:[`autodocs`],parameters:{docs:{description:{component:`Checkbox — multi-select control. Inherited from core. [Figma](${w}).`}}},argTypes:{tone:{control:{type:`inline-radio`},options:S,name:`Tone`},selection:{control:{type:`inline-radio`},options:C,name:`Selection`},disabled:{control:`boolean`,name:`Disabled`},label:{control:`text`,name:`Label`},accessibleLabel:{control:`text`,name:`Accessible label`},name:{control:`text`,name:`Name`},value:{control:`text`,name:`Value`}},args:T,render:e=>x(v(e))},O={name:`Demo`,play:E,parameters:a(x(v(T)),{scss:s,js:l})},k={name:`AllStyles`,play:E,render:()=>`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Tone × Selection</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          ${S.flatMap(e=>C.map(t=>y({tone:e,selection:t,label:`${e} · ${t}`}))).join(``)}
        </div>
      </section>
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Interaction states (default · checked)</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          ${[`default`,`hover`,`focused`,`pressed`,`disabled`].map(e=>b(e)).join(``)}
        </div>
      </section>
    </div>
  `},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: 'Demo',
  play: playInitCheckboxes,
  parameters: htmlStoryParameters(compiled(buildArgs(defaultArgs)), {
    scss: scssSource,
    js: jsSource
  })
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: 'AllStyles',
  play: playInitCheckboxes,
  render: () => \`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <section>
        <h3 style="margin:0 0 12px;font:600 14px/20px system-ui,sans-serif;">Tone × Selection</h3>
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          \${TONE_OPTIONS.flatMap(tone => SELECTION_OPTIONS.map(selection => toneCard({
    tone,
    selection,
    label: \`\${tone} · \${selection}\`
  }))).join('')}
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
}`,...k.parameters?.docs?.source}}},A=[`Demo`,`AllStyles`]})))()}j();export{k as AllStyles,O as Demo,A as __namedExportsOrder,D as default};