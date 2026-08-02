/**
 * Components/Radio behaviour layer.
 *
 * Progressive enhancement on top of the native
 * `<input type="radio">` the template emits. The browser owns
 * single-select group enforcement (any radio with the same `name`)
 * and the arrow-key navigation between members of the group; this
 * layer's only jobs are:
 *
 *   1. Mirror the input's `checked` state onto the root's
 *      `is-checked` modifier so the visible dot + fill can paint
 *      via the modifier class.
 *   2. Dispatch namespaced `lifelock:radio:change` and
 *      `lifelock:radio:commit` CustomEvents.
 *   3. Listen for change events on *sibling* radios in the same
 *      group so the unchecked radios in the group repaint when one
 *      of them becomes selected.
 *
 * Public API documented in `./spec.md` § "JavaScript API".
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
  // don't fire `change` on the radios being unchecked, so we
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
