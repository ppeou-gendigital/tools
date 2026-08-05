/**
 * Patterns/Inputs/Code entry behaviour layer.
 *
 * Progressive enhancement on top of the row of native single-character
 * `<input>` boxes the template emits. The SCSS paints every state; this
 * layer adds the OTP interaction model:
 *
 *   1. Auto-advance to the next box after a digit is entered.
 *   2. Backspace-to-previous when a box is already empty.
 *   3. Arrow-left / arrow-right move focus across boxes.
 *   4. Paste spreads the clipboard digits across the boxes from the
 *      caret position.
 *   5. Keep each box's `is-filled` modifier in sync and dispatch the
 *      namespaced `lifelock:code-entry:input` (every change) and
 *      `lifelock:code-entry:complete` (every box filled) CustomEvents.
 *
 * Only digits are accepted (the boxes are `inputmode="numeric"`).
 * Public API documented in `./spec.md` § "JavaScript API".
 */

/**
 * @typedef {Object} CodeEntryInstance
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
 * Initialise one code-entry root.
 *
 * @param {HTMLElement} root
 * @returns {CodeEntryInstance}
 */
export function initCodeEntry(root) {
  if (!root || root.dataset.codeEntryInitialised === "true") {
    return /** @type {CodeEntryInstance} */ ({ ...NOOP_INSTANCE });
  }
  root.dataset.codeEntryInitialised = "true";

  /** @type {HTMLInputElement[]} */
  const boxes = Array.from(root.querySelectorAll(".c-code-entry__box"));
  if (boxes.length === 0) {
    return /** @type {CodeEntryInstance} */ ({
      ...NOOP_INSTANCE,
      destroy() {
        delete root.dataset.codeEntryInitialised;
      },
    });
  }

  function value() {
    return boxes.map((b) => b.value).join("");
  }

  function syncFilled(box) {
    box.classList.toggle("is-filled", box.value.length > 0);
  }

  function emit() {
    const v = value();
    dispatch(root, "lifelock:code-entry:input", { value: v });
    if (v.length === boxes.length) {
      dispatch(root, "lifelock:code-entry:complete", { value: v });
    }
  }

  function focusBox(index) {
    const box = boxes[index];
    if (!box) return;
    box.focus();
    box.select();
  }

  /** @param {InputEvent} e */
  function onInput(e) {
    const box = /** @type {HTMLInputElement} */ (e.target);
    const index = Number(box.dataset.index);
    const digits = box.value.replace(/\D/g, "");
    box.value = digits.slice(-1);
    syncFilled(box);
    if (box.value && index < boxes.length - 1) focusBox(index + 1);
    emit();
  }

  /** @param {KeyboardEvent} e */
  function onKeydown(e) {
    const box = /** @type {HTMLInputElement} */ (e.target);
    const index = Number(box.dataset.index);
    if (e.key === "Backspace" && !box.value && index > 0) {
      e.preventDefault();
      const prev = boxes[index - 1];
      prev.value = "";
      syncFilled(prev);
      focusBox(index - 1);
      emit();
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusBox(index - 1);
    } else if (e.key === "ArrowRight" && index < boxes.length - 1) {
      e.preventDefault();
      focusBox(index + 1);
    }
  }

  /** @param {ClipboardEvent} e */
  function onPaste(e) {
    e.preventDefault();
    const box = /** @type {HTMLInputElement} */ (e.target);
    const startIndex = Number(box.dataset.index);
    const clip = e.clipboardData ? e.clipboardData.getData("text") : "";
    const digits = clip.replace(/\D/g, "");
    if (!digits) return;
    let cursor = startIndex;
    for (const char of digits) {
      if (cursor >= boxes.length) break;
      boxes[cursor].value = char;
      syncFilled(boxes[cursor]);
      cursor += 1;
    }
    focusBox(Math.min(cursor, boxes.length - 1));
    emit();
  }

  for (const box of boxes) {
    box.addEventListener("input", onInput);
    box.addEventListener("keydown", onKeydown);
    box.addEventListener("paste", onPaste);
    syncFilled(box);
  }

  return {
    getValue() {
      return value();
    },
    setValue(next) {
      const digits = String(next ?? "").replace(/\D/g, "");
      boxes.forEach((box, i) => {
        box.value = digits[i] ?? "";
        syncFilled(box);
      });
      emit();
    },
    clear() {
      for (const box of boxes) {
        box.value = "";
        syncFilled(box);
      }
      focusBox(0);
      emit();
    },
    setDisabled(disabled) {
      const next = Boolean(disabled);
      for (const box of boxes) box.disabled = next;
      root.classList.toggle("is-disabled", next);
    },
    destroy() {
      for (const box of boxes) {
        box.removeEventListener("input", onInput);
        box.removeEventListener("keydown", onKeydown);
        box.removeEventListener("paste", onPaste);
      }
      delete root.dataset.codeEntryInitialised;
    },
  };
}

/**
 * Initialise every code-entry inside a scope.
 *
 * @param {ParentNode} [scope]
 * @returns {CodeEntryInstance[]}
 */
export function initCodeEntries(scope) {
  const root =
    scope && typeof scope.querySelectorAll === "function"
      ? scope
      : typeof document !== "undefined"
        ? document
        : null;
  if (!root) return [];
  return Array.from(root.querySelectorAll(".c-code-entry")).map((el) =>
    initCodeEntry(/** @type {HTMLElement} */ (el)),
  );
}
