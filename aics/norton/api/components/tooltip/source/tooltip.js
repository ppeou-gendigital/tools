/**
 * Molecules/Tooltip — show/hide + Escape.
 * Pair with a trigger via `aria-describedby` pointing at the tooltip id.
 */

function setOpen(root, open) {
  root.classList.toggle('is-open', open);
  if (open) root.removeAttribute('hidden');
  else root.setAttribute('hidden', '');
}

/**
 * @param {HTMLElement} root
 * @param {{ trigger?: HTMLElement|string, open?: boolean }} [options]
 */
export function initTooltip(root, options = {}) {
  if (!root || root.dataset.tooltipInitialized === 'true') return null;
  root.dataset.tooltipInitialized = 'true';

  let trigger = null;
  if (options.trigger instanceof HTMLElement) trigger = options.trigger;
  else if (typeof options.trigger === 'string') {
    trigger = document.querySelector(options.trigger);
  } else if (root.id) {
    trigger = document.querySelector(`[aria-describedby="${root.id}"]`);
  }

  const initial = options.open ?? root.classList.contains('is-open');
  setOpen(root, Boolean(initial));

  function open() {
    setOpen(root, true);
  }
  function close() {
    setOpen(root, false);
  }
  function toggle() {
    setOpen(root, !root.classList.contains('is-open'));
  }

  function onKeydown(event) {
    if (event.key === 'Escape') close();
  }

  function onTriggerEnter() {
    open();
  }
  function onTriggerLeave() {
    close();
  }
  function onTriggerFocus() {
    open();
  }
  function onTriggerBlur() {
    close();
  }

  if (trigger) {
    trigger.addEventListener('mouseenter', onTriggerEnter);
    trigger.addEventListener('mouseleave', onTriggerLeave);
    trigger.addEventListener('focus', onTriggerFocus);
    trigger.addEventListener('blur', onTriggerBlur);
  }
  document.addEventListener('keydown', onKeydown);

  return {
    open,
    close,
    toggle,
    destroy() {
      if (trigger) {
        trigger.removeEventListener('mouseenter', onTriggerEnter);
        trigger.removeEventListener('mouseleave', onTriggerLeave);
        trigger.removeEventListener('focus', onTriggerFocus);
        trigger.removeEventListener('blur', onTriggerBlur);
      }
      document.removeEventListener('keydown', onKeydown);
      delete root.dataset.tooltipInitialized;
    },
  };
}

export function initTooltips(scope = document) {
  const roots = scope.querySelectorAll?.('[data-component="tooltip"]');
  if (!roots) return [];
  return Array.from(roots)
    .map((root) => initTooltip(root))
    .filter(Boolean);
}
