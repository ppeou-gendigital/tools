/**
 * Patterns/Inputs/Search box behaviour layer.
 *
 * Progressive enhancement on top of the native
 * `<input type="search">`. The SCSS paints every visual state; this
 * layer's only jobs are:
 *
 *   1. Mirror the input's filled / empty state onto the root's
 *      `is-filled` modifier so the clear button shows once there is
 *      text to clear.
 *   2. Empty + refocus the input when the clear button is pressed.
 *   3. Dispatch namespaced `lifelock:search-box:input` and
 *      `lifelock:search-box:clear` CustomEvents.
 *
 * Public API documented in `./spec.md` § "JavaScript API".
 */

/**
 * @typedef {Object} SearchBoxInstance
 * @property {() => string} getValue
 * @property {(next: string) => void} setValue
 * @property {() => void} clear
 * @property {(disabled: boolean) => void} setDisabled
 * @property {() => void} destroy
 */

function dispatch(root, name, detail) {
  root.dispatchEvent(
    new CustomEvent(name, { detail, bubbles: true, composed: true }),
  );
}

const NOOP_INSTANCE = {
  getValue: () => "",
  setValue: () => {},
  clear: () => {},
  setDisabled: () => {},
  destroy: () => {},
};

/**
 * Initialise one search-box root.
 *
 * @param {HTMLElement} root
 * @returns {SearchBoxInstance}
 */
export function initSearchBox(root) {
  if (!root || root.dataset.searchBoxInitialised === "true") {
    return /** @type {SearchBoxInstance} */ ({ ...NOOP_INSTANCE });
  }
  root.dataset.searchBoxInitialised = "true";

  /** @type {HTMLInputElement | null} */
  const input = root.querySelector(".c-search-box__input");
  /** @type {HTMLButtonElement | null} */
  const clearBtn = root.querySelector(".c-search-box__clear");

  if (!input) {
    return /** @type {SearchBoxInstance} */ ({
      ...NOOP_INSTANCE,
      destroy() {
        delete root.dataset.searchBoxInitialised;
      },
    });
  }

  function syncFilled() {
    root.classList.toggle("is-filled", input.value.length > 0);
  }

  function onInput() {
    syncFilled();
    dispatch(root, "lifelock:search-box:input", { value: input.value });
  }

  function onClear() {
    input.value = "";
    syncFilled();
    input.focus();
    dispatch(root, "lifelock:search-box:clear", {});
    dispatch(root, "lifelock:search-box:input", { value: "" });
  }

  input.addEventListener("input", onInput);
  if (clearBtn) clearBtn.addEventListener("click", onClear);

  syncFilled();

  return {
    getValue() {
      return input.value;
    },
    setValue(next) {
      input.value = String(next ?? "");
      syncFilled();
      dispatch(root, "lifelock:search-box:input", { value: input.value });
    },
    clear() {
      onClear();
    },
    setDisabled(disabled) {
      input.disabled = Boolean(disabled);
      if (clearBtn) clearBtn.disabled = Boolean(disabled);
      root.classList.toggle("is-disabled", Boolean(disabled));
    },
    destroy() {
      input.removeEventListener("input", onInput);
      if (clearBtn) clearBtn.removeEventListener("click", onClear);
      delete root.dataset.searchBoxInitialised;
    },
  };
}

/**
 * Initialise every search-box inside a scope.
 *
 * @param {ParentNode} [scope]
 * @returns {SearchBoxInstance[]}
 */
export function initSearchBoxes(scope) {
  const root =
    scope && typeof scope.querySelectorAll === "function"
      ? scope
      : typeof document !== "undefined"
        ? document
        : null;
  if (!root) return [];
  return Array.from(root.querySelectorAll(".c-search-box")).map((el) =>
    initSearchBox(/** @type {HTMLElement} */ (el)),
  );
}
