/**
 * Patterns/Sheet — open/close + focus trap (modal mode).
 * Events: lifelock:sheet:{open,close}
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function dispatch(root, type, detail) {
  root.dispatchEvent(
    new CustomEvent(`lifelock:sheet:${type}`, {
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
    document.querySelector(`[data-sheet-trigger="${id}"]`)
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
export function initSheet(root, options = {}) {
  if (!root || root.dataset.sheetInitialized === 'true') return null;
  root.dataset.sheetInitialized = 'true';

  const mode = root.dataset.mode || 'modal';
  const isModal = mode !== 'non-modal';
  const card = root.querySelector('[data-sheet-card]') || root.querySelector('.c-sheet__card');
  const backdrop = root.querySelector('[data-sheet-backdrop]');
  const closeBtn = root.querySelector('[data-sheet-close]');
  const trigger = options.trigger || findTrigger(root);
  let lastFocus = null;

  function isOpen() {
    return !root.hasAttribute('hidden');
  }

  function open(source = 'api') {
    lastFocus = document.activeElement;
    root.removeAttribute('hidden');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (isModal && card) {
      const nodes = focusables(card);
      const initial =
        options.initialFocus ||
        card.querySelector('[data-sheet-initial-focus]') ||
        closeBtn ||
        nodes[0];
      if (initial && typeof initial.focus === 'function') initial.focus();
    }
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
    if (!isModal || event.key !== 'Tab' || !card) return;
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
    if (!isModal) return;
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
      delete root.dataset.sheetInitialized;
    },
  };
}

/**
 * @param {ParentNode} [scope]
 */
export function initSheets(scope = document) {
  const roots = scope.querySelectorAll?.('[data-component="sheet"]');
  if (!roots) return [];
  return Array.from(roots)
    .map((root) => initSheet(root))
    .filter(Boolean);
}
