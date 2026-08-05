/**
 * Patterns/Toggle — Link / Segmented / Pill selection.
 * Event: `lifelock:toggle:change` detail `{ selected, root, source }`
 */

function dispatchChange(root, selected, source) {
  root.dispatchEvent(
    new CustomEvent('lifelock:toggle:change', {
      bubbles: true,
      composed: true,
      detail: { selected, root, source },
    }),
  );
}

function applySelected(root, selected) {
  const type = root.dataset.type || 'link';
  root.dataset.selected = selected;

  if (type === 'link') {
    const btn = root.querySelector('[data-toggle-control]');
    const on = selected === 'on';
    if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    root.querySelector('.c-toggle__label--start')?.classList.toggle('is-active', !on);
    root.querySelector('.c-toggle__label--end')?.classList.toggle('is-active', on);
    return;
  }

  root.querySelectorAll('[data-toggle-value]').forEach((el) => {
    const value = el.getAttribute('data-toggle-value');
    const active = value === selected;
    el.classList.toggle('is-selected', active);
    el.setAttribute('aria-checked', active ? 'true' : 'false');
  });
}

/**
 * @param {HTMLElement} root
 * @param {{ selected?: string, onChange?: (s:string)=>void }} [options]
 */
export function initToggle(root, options = {}) {
  if (!root || root.dataset.toggleInitialized === 'true') return null;
  root.dataset.toggleInitialized = 'true';

  const type = root.dataset.type || 'link';
  let selected =
    options.selected ||
    root.dataset.selected ||
    (type === 'link' ? 'off' : 'a');
  applySelected(root, selected);

  function setSelected(next, source) {
    if (root.classList.contains('is-disabled')) return;
    selected = next;
    applySelected(root, next);
    if (typeof options.onChange === 'function') options.onChange(next);
    if (source) dispatchChange(root, next, source);
  }

  function onClick(event) {
    if (type === 'link') {
      const control = event.target.closest?.('[data-toggle-control]');
      if (!control || !root.contains(control)) return;
      setSelected(selected === 'on' ? 'off' : 'on', 'click');
      return;
    }
    const opt = event.target.closest?.('[data-toggle-value]');
    if (!opt || !root.contains(opt) || opt.disabled) return;
    setSelected(opt.getAttribute('data-toggle-value'), 'click');
  }

  function onKeydown(event) {
    if (type === 'link') {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        setSelected(selected === 'on' ? 'off' : 'on', 'keyboard');
      }
      return;
    }
    const opts = Array.from(root.querySelectorAll('[data-toggle-value]:not(:disabled)'));
    if (!opts.length) return;
    const current = opts.findIndex((o) => o.getAttribute('data-toggle-value') === selected);
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = opts[(current + 1) % opts.length];
      setSelected(next.getAttribute('data-toggle-value'), 'keyboard');
      next.focus();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = opts[(current - 1 + opts.length) % opts.length];
      setSelected(next.getAttribute('data-toggle-value'), 'keyboard');
      next.focus();
    }
  }

  root.addEventListener('click', onClick);
  root.addEventListener('keydown', onKeydown);

  return {
    setSelected: (value) => setSelected(value, 'api'),
    getSelected: () => selected,
    destroy() {
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKeydown);
      delete root.dataset.toggleInitialized;
    },
  };
}

export function initToggles(scope = document) {
  const roots = scope.querySelectorAll?.('[data-component="toggle"]');
  if (!roots) return [];
  return Array.from(roots)
    .map((root) => initToggle(root))
    .filter(Boolean);
}
