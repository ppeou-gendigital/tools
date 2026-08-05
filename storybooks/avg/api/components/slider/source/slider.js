/**
 * Components/Slider behaviour layer.
 *
 * Progressive enhancement on top of the native `<input type="range">`
 * pairs the template emits. The SCSS already paints every visual
 * state from the input's value via CSS custom properties; this
 * layer's only jobs are:
 *
 *   1. Bridge the native input's `value` into the visible thumb's
 *      `--slider-thumb-offset` and the active-fill's
 *      `--slider-fill-{start,end}` whenever the user moves a thumb.
 *   2. On `selection="range"`, constrain each input's domain against
 *      the other so the lower thumb can never exceed the upper.
 *   3. On `variant="discrete"`, snap to the nearest tick on commit
 *      (pointer-up / keyboard release) when `snapToTicks` is true.
 *   4. Dispatch `lifelock:slider:input` (every value change) and
 *      `lifelock:slider:commit` (on commit) custom events.
 *
 * Public API documented in `./spec.md` § "JavaScript API".
 */

/**
 * @typedef {Object} SliderInitOptions
 * @property {boolean} [snapToTicks]
 * @property {"input"|"change"} [commitOn="change"]
 */

/**
 * @typedef {number | { min: number, max: number }} SliderValue
 */

/**
 * @typedef {Object} SliderInstance
 * @property {() => SliderValue} getValue
 * @property {(next: SliderValue) => void} setValue
 * @property {(disabled: boolean) => void} setDisabled
 * @property {() => void} destroy
 */

function pct(value, min, max) {
  if (max === min) return 0;
  const clamped = Math.min(max, Math.max(min, value));
  return ((clamped - min) / (max - min)) * 100;
}

function dispatch(root, name, detail) {
  root.dispatchEvent(
    new CustomEvent(name, { detail, bubbles: true, composed: true }),
  );
}

/**
 * Initialise one slider root.
 *
 * @param {HTMLElement} root
 * @param {SliderInitOptions} [options]
 * @returns {SliderInstance}
 */
export function initSlider(root, options = {}) {
  if (!root || root.dataset.sliderInitialised === "true") {
    return /** @type {SliderInstance} */ ({
      getValue: () => 0,
      setValue: () => {},
      setDisabled: () => {},
      destroy: () => {},
    });
  }
  root.dataset.sliderInitialised = "true";

  const variant = root.dataset.variant || "continuous";
  const selection = root.dataset.selection || "single-value";
  const min = Number(root.dataset.min ?? 0);
  const max = Number(root.dataset.max ?? 100);
  const step = Number(root.dataset.step ?? 1);
  const snapToTicks =
    typeof options.snapToTicks === "boolean"
      ? options.snapToTicks
      : variant === "discrete";
  const commitOn = options.commitOn === "input" ? "input" : "change";

  /** @type {HTMLInputElement[]} */
  const inputs = Array.from(root.querySelectorAll(".c-slider__input"));
  /** @type {HTMLElement | null} */
  const thumbSingle = root.querySelector(
    ".c-slider__thumb:not(.c-slider__thumb--start):not(.c-slider__thumb--end)",
  );
  /** @type {HTMLElement | null} */
  const thumbStart = root.querySelector(".c-slider__thumb--start");
  /** @type {HTMLElement | null} */
  const thumbEnd = root.querySelector(".c-slider__thumb--end");
  /** @type {HTMLElement | null} */
  const fill = root.querySelector(".c-slider__active-fill");
  /** @type {HTMLElement | null} */
  const valueLabelSingle = root.querySelector(
    '.c-slider__value-label[data-role="value"]',
  );
  /** @type {HTMLElement | null} */
  const valueLabelMin = root.querySelector(
    '.c-slider__value-label[data-role="value-min"]',
  );
  /** @type {HTMLElement | null} */
  const valueLabelMax = root.querySelector(
    '.c-slider__value-label[data-role="value-max"]',
  );

  function paint(source) {
    if (selection === "range") {
      const a = Number(inputs[0]?.value ?? min);
      const b = Number(inputs[1]?.value ?? max);
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      const loPct = pct(lo, min, max);
      const hiPct = pct(hi, min, max);
      if (thumbStart) thumbStart.style.setProperty("--slider-thumb-offset", `${loPct}%`);
      if (thumbEnd) thumbEnd.style.setProperty("--slider-thumb-offset", `${hiPct}%`);
      if (fill) {
        fill.style.setProperty("--slider-fill-start", `${loPct}%`);
        fill.style.setProperty("--slider-fill-end", `${hiPct}%`);
      }
      if (valueLabelMin) valueLabelMin.textContent = String(lo);
      if (valueLabelMax) valueLabelMax.textContent = String(hi);
      dispatch(root, "lifelock:slider:input", {
        value: { min: lo, max: hi },
        source,
      });
    } else {
      const v = Number(inputs[0]?.value ?? min);
      const vPct = pct(v, min, max);
      if (thumbSingle) thumbSingle.style.setProperty("--slider-thumb-offset", `${vPct}%`);
      if (fill) {
        fill.style.setProperty("--slider-fill-start", "0%");
        fill.style.setProperty("--slider-fill-end", `${vPct}%`);
      }
      if (valueLabelSingle) valueLabelSingle.textContent = String(v);
      dispatch(root, "lifelock:slider:input", { value: v, source });
    }
  }

  function snap(input) {
    if (!snapToTicks) return;
    const v = Number(input.value);
    const stepped = Math.round((v - min) / step) * step + min;
    const clamped = Math.min(max, Math.max(min, stepped));
    if (clamped !== v) input.value = String(clamped);
  }

  // Quantise a numeric value to the slider's step grid regardless of
  // `snapToTicks`. Used by `setValue()` so programmatic API consumers
  // always land on a representable value — the native input itself
  // already snaps user-initiated drags via its `step` attribute.
  function quantise(value) {
    if (!Number.isFinite(step) || step <= 0) return value;
    const stepped = Math.round((value - min) / step) * step + min;
    return Math.min(max, Math.max(min, stepped));
  }

  /** @param {Event} e */
  function onInput(e) {
    if (root.getAttribute("aria-disabled") === "true") return;
    const target = /** @type {HTMLInputElement} */ (e.currentTarget);
    if (selection === "range" && inputs.length === 2) {
      const a = Number(inputs[0].value);
      const b = Number(inputs[1].value);
      if (target === inputs[0] && a > b) inputs[1].value = String(a);
      if (target === inputs[1] && b < a) inputs[0].value = String(b);
    }
    paint("pointer");
  }

  /** @param {Event} e */
  function onChange(e) {
    if (root.getAttribute("aria-disabled") === "true") return;
    const target = /** @type {HTMLInputElement} */ (e.currentTarget);
    snap(target);
    paint("pointer");
    const value =
      selection === "range"
        ? {
            min: Math.min(Number(inputs[0].value), Number(inputs[1].value)),
            max: Math.max(Number(inputs[0].value), Number(inputs[1].value)),
          }
        : Number(inputs[0].value);
    if (commitOn === "change" || commitOn === "input") {
      dispatch(root, "lifelock:slider:commit", { value, source: "pointer" });
    }
  }

  /** @param {KeyboardEvent} e */
  function onKeyUp(e) {
    if (root.getAttribute("aria-disabled") === "true") return;
    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "Home" ||
      e.key === "End" ||
      e.key === "PageUp" ||
      e.key === "PageDown"
    ) {
      const value =
        selection === "range"
          ? {
              min: Math.min(Number(inputs[0].value), Number(inputs[1].value)),
              max: Math.max(Number(inputs[0].value), Number(inputs[1].value)),
            }
          : Number(inputs[0].value);
      dispatch(root, "lifelock:slider:commit", { value, source: "keyboard" });
    }
  }

  inputs.forEach((input) => {
    input.addEventListener("input", onInput);
    input.addEventListener("change", onChange);
    input.addEventListener("keyup", onKeyUp);
  });

  paint("api");

  return {
    getValue() {
      if (selection === "range") {
        return {
          min: Math.min(Number(inputs[0].value), Number(inputs[1].value)),
          max: Math.max(Number(inputs[0].value), Number(inputs[1].value)),
        };
      }
      return Number(inputs[0].value);
    },
    setValue(next) {
      if (selection === "range" && typeof next === "object" && next !== null) {
        inputs[0].value = String(quantise(Number(next.min)));
        inputs[1].value = String(quantise(Number(next.max)));
      } else if (typeof next === "number") {
        inputs[0].value = String(quantise(next));
      }
      paint("api");
    },
    setDisabled(disabled) {
      if (disabled) {
        root.setAttribute("aria-disabled", "true");
        root.classList.add("is-disabled");
        inputs.forEach((i) => (i.disabled = true));
      } else {
        root.removeAttribute("aria-disabled");
        root.classList.remove("is-disabled");
        inputs.forEach((i) => (i.disabled = false));
      }
    },
    destroy() {
      inputs.forEach((input) => {
        input.removeEventListener("input", onInput);
        input.removeEventListener("change", onChange);
        input.removeEventListener("keyup", onKeyUp);
      });
      delete root.dataset.sliderInitialised;
    },
  };
}

/**
 * Initialise every slider inside a scope.
 *
 * @param {ParentNode} [scope]
 * @param {SliderInitOptions} [options]
 * @returns {SliderInstance[]}
 */
export function initSliders(scope, options) {
  const root =
    scope && typeof scope.querySelectorAll === "function"
      ? scope
      : typeof document !== "undefined"
      ? document
      : null;
  if (!root) return [];
  return Array.from(root.querySelectorAll(".c-slider")).map((el) =>
    initSlider(/** @type {HTMLElement} */ (el), options),
  );
}
