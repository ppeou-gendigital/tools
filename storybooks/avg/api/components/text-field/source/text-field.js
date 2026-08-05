/**
 * Patterns/Inputs/Text field behaviour layer.
 *
 * Progressive enhancement on top of the native `<input>` / `<select>`
 * the template emits. Every paint (border, hover, focus ring, error,
 * disabled) is already CSS-driven; this layer's only job is the
 * password reveal toggle:
 *
 *   1. Flip the input's `type` between `password` and `text`.
 *   2. Mirror the revealed state onto the root's `is-revealed` modifier
 *      (the SCSS swaps the eye / eye-off glyph) plus `aria-pressed` and
 *      `aria-label` on the toggle button.
 *   3. Dispatch the namespaced `lifelock:text-field:reveal` CustomEvent.
 *
 * `type=select` ships no behaviour — the native control is fully
 * functional without JS. Public API documented in `./spec.md`
 * § "JavaScript API".
 */

/**
 * @typedef {Object} TextFieldInitOptions
 * @property {boolean} [revealed=false] Start the password field revealed.
 */

/**
 * @typedef {Object} TextFieldInstance
 * @property {() => boolean} getRevealed
 * @property {(next: boolean) => void} setRevealed
 * @property {(disabled: boolean) => void} setDisabled
 * @property {() => void} destroy
 */

function dispatch(root, name, detail) {
  root.dispatchEvent(
    new CustomEvent(name, { detail, bubbles: true, composed: true }),
  );
}

const NOOP_INSTANCE = {
  getRevealed: () => false,
  setRevealed: () => {},
  setDisabled: () => {},
  destroy: () => {},
};

/**
 * Initialise one text-field root.
 *
 * @param {HTMLElement} root
 * @param {TextFieldInitOptions} [options]
 * @returns {TextFieldInstance}
 */
export function initTextField(root, options = {}) {
  if (!root || root.dataset.textFieldInitialised === "true") {
    return /** @type {TextFieldInstance} */ ({ ...NOOP_INSTANCE });
  }
  root.dataset.textFieldInitialised = "true";

  /** @type {HTMLInputElement | null} */
  const input = root.querySelector(".c-text-field__field");
  /** @type {HTMLButtonElement | null} */
  const reveal = root.querySelector(".c-text-field__reveal");

  // No reveal button (non-password types) → nothing to wire.
  if (!input || !reveal) {
    return /** @type {TextFieldInstance} */ ({
      ...NOOP_INSTANCE,
      destroy() {
        delete root.dataset.textFieldInitialised;
      },
    });
  }

  function paint(revealed, source) {
    root.classList.toggle("is-revealed", revealed);
    input.type = revealed ? "text" : "password";
    reveal.setAttribute("aria-pressed", revealed ? "true" : "false");
    reveal.setAttribute(
      "aria-label",
      revealed ? "Hide password" : "Show password",
    );
    dispatch(root, "lifelock:text-field:reveal", { revealed, source });
  }

  function onClick() {
    paint(!root.classList.contains("is-revealed"), "pointer");
  }

  reveal.addEventListener("click", onClick);

  if (options.revealed) paint(true, "api");

  return {
    getRevealed() {
      return root.classList.contains("is-revealed");
    },
    setRevealed(next) {
      paint(Boolean(next), "api");
    },
    setDisabled(disabled) {
      if (disabled) {
        root.classList.add("is-disabled");
        input.disabled = true;
        reveal.disabled = true;
      } else {
        root.classList.remove("is-disabled");
        input.disabled = false;
        reveal.disabled = false;
      }
    },
    destroy() {
      reveal.removeEventListener("click", onClick);
      delete root.dataset.textFieldInitialised;
    },
  };
}

/**
 * Initialise every text-field inside a scope.
 *
 * @param {ParentNode} [scope]
 * @param {TextFieldInitOptions} [options]
 * @returns {TextFieldInstance[]}
 */
export function initTextFields(scope, options) {
  const root =
    scope && typeof scope.querySelectorAll === "function"
      ? scope
      : typeof document !== "undefined"
        ? document
        : null;
  if (!root) return [];
  return Array.from(root.querySelectorAll(".c-text-field")).map((el) =>
    initTextField(/** @type {HTMLElement} */ (el), options),
  );
}
