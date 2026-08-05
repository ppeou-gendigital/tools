/**
 * Patterns/Modal — progressive-enhancement open/close + focus trap.
 *
 * Wire a trigger with `aria-controls="<modal id>"` (or
 * `data-modal-trigger="<id>"`). Events: `lifelock:modal:{open,close}`.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function dispatch(root, type, detail) {
  root.dispatchEvent(
    new CustomEvent(`lifelock:modal:${type}`, {
      bubbles: true,
      composed: true,
      detail,
    }),
  );
}

function findTrigger(root) {
  const id = root.id;
  if (!id || typeof document === 'undefined') return null;
  return (
    document.querySelector(`[aria-controls="${id}"]`) ||
    document.querySelector(`[data-modal-trigger="${id}"]`)
  );
}

function focusables(card) {
  return Array.from(card.querySelectorAll(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
  );
}

/**
 * @param {HTMLElement} root
 * @param {{ trigger?: HTMLElement | null, initialFocus?: HTMLElement | null }} [options]
 */
export function initModal(root, options = {}) {
  if (!root || root.dataset.modalInitialized === 'true') return null;
  root.dataset.modalInitialized = 'true';

  const card = root.querySelector('[data-modal-card]') || root.querySelector('.c-modal__card');
  const backdrop = root.querySelector('[data-modal-backdrop]');
  const closeBtn = root.querySelector('[data-modal-close]');
  const trigger = options.trigger || findTrigger(root);
  let lastFocus = null;

  function isOpen() {
    return !root.hasAttribute('hidden');
  }

  function open(source = 'api') {
    lastFocus = document.activeElement;
    root.removeAttribute('hidden');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    const nodes = card ? focusables(card) : [];
    const initial =
      options.initialFocus ||
      (card && card.querySelector('[data-modal-initial-focus]')) ||
      closeBtn ||
      nodes[0];
    if (initial && typeof initial.focus === 'function') initial.focus();
    dispatch(root, 'open', { source, root });
  }

  function close(source = 'api') {
    root.setAttribute('hidden', '');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    dispatch(root, 'close', { source, root });
    const restore = lastFocus || trigger;
    if (restore && typeof restore.focus === 'function' && source !== 'api') {
      restore.focus();
    }
  }

  function onKeydown(event) {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close('keyboard');
      return;
    }
    if (event.key !== 'Tab' || !card) return;
    const nodes = focusables(card);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function onBackdropClick(event) {
    if (event.target === backdrop) close('backdrop');
  }

  function onCloseClick(event) {
    event.preventDefault();
    close('close-button');
  }

  function onTriggerClick(event) {
    event.preventDefault();
    if (isOpen()) close('trigger');
    else open('trigger');
  }

  if (trigger) {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', isOpen() ? 'true' : 'false');
    if (root.id) trigger.setAttribute('aria-controls', root.id);
    trigger.addEventListener('click', onTriggerClick);
  }
  if (backdrop) backdrop.addEventListener('click', onBackdropClick);
  if (closeBtn) closeBtn.addEventListener('click', onCloseClick);
  root.addEventListener('keydown', onKeydown);

  return {
    open,
    close,
    destroy() {
      if (trigger) trigger.removeEventListener('click', onTriggerClick);
      if (backdrop) backdrop.removeEventListener('click', onBackdropClick);
      if (closeBtn) closeBtn.removeEventListener('click', onCloseClick);
      root.removeEventListener('keydown', onKeydown);
      delete root.dataset.modalInitialized;
    },
  };
}

/**
 * @param {ParentNode} [scope]
 */
export function initModals(scope = document) {
  const roots = scope.querySelectorAll?.('[data-component="modal"]');
  if (!roots) return [];
  return Array.from(roots)
    .map((root) => initModal(root))
    .filter(Boolean);
}
