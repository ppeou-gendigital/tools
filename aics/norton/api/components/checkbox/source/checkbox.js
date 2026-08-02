/**
 * Components/Checkbox behaviour layer.
 *
 * Progressive enhancement on top of the native
 * `<input type="checkbox">` the template emits. The SCSS paints
 * every persistent + transient state from class modifiers + CSS
 * pseudo-classes; this layer's only jobs are:
 *
 *   1. Keep the native `indeterminate` JS property in sync with the
 *      `is-indeterminate` modifier class. (`indeterminate` is a
 *      JS-only DOM property; HTML attributes alone cannot set it.)
 *   2. Toggle `is-checked` / `is-indeterminate` based on the input's
 *      `checked` state on change.
 *   3. Dispatch namespaced `lifelock:checkbox:change` and
 *      `lifelock:checkbox:commit` CustomEvents.
 *
 * Public API documented in `./spec.md` § "JavaScript API".
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
