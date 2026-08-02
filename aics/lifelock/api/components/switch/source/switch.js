/**
 * Components/Switch behaviour layer.
 *
 * Progressive enhancement on top of the native
 * `<input type="checkbox" role="switch">` the template emits. The
 * SCSS already paints every visual state from the input's
 * `:checked` / `:hover` / `:focus-visible` / `:active` /
 * `:disabled` selectors; this layer's only jobs are:
 *
 *   1. Mirror the input's `checked` state onto the root's
 *      `is-checked` modifier + `aria-checked` attribute so the
 *      visible track + knob can paint via the modifier class.
 *   2. Dispatch namespaced `lifelock:switch:change` and
 *      `lifelock:switch:commit` CustomEvents.
 *   3. Refuse commits while `aria-busy="true"` (loading).
 *
 * Public API documented in `./spec.md` § "JavaScript API".
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
