/**
 * Patterns/Menu block — progressive-enhancement for popup mode.
 *
 * Static / anchored usage needs no JS. When `data-mode="popup"`, wire a
 * trigger (`[aria-controls="<id>"]` or `data-menu-block-trigger` pointing
 * at the block id) for open/close, focus first Row, Arrow/Home/End,
 * Escape, and Tab wrap among row controls.
 *
 * Events: `lifelock:menu-block:{open,close,select}`
 */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  try {
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  } catch {
    return false;
  }
}

function rowControls(root) {
  return Array.from(
    root.querySelectorAll(
      '.c-menu-list--row:not(.is-disabled) .c-menu-list__control',
    ),
  );
}

function dispatch(root, type, detail) {
  root.dispatchEvent(
    new CustomEvent(`lifelock:menu-block:${type}`, {
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
    document.querySelector(`[data-menu-block-trigger="${id}"]`)
  );
}

/**
 * @param {HTMLElement} root
 * @param {{ trigger?: HTMLElement | null }} [options]
 */
export function initMenuBlock(root, options = {}) {
  if (!root || root.dataset.menuBlockInitialized === 'true') {
    return null;
  }
  if (root.getAttribute('data-mode') !== 'popup') {
    return null;
  }
  root.dataset.menuBlockInitialized = 'true';

  const trigger =
    options.trigger ||
    findTrigger(root) ||
    null;

  function isOpen() {
    return !root.hasAttribute('hidden');
  }

  function open(source = 'api') {
    root.removeAttribute('hidden');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'true');
      trigger.setAttribute('aria-haspopup', 'menu');
    }
    const rows = rowControls(root);
    if (rows[0]) rows[0].focus();
    dispatch(root, 'open', { source });
  }

  function close(source = 'api') {
    root.setAttribute('hidden', '');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      if (source !== 'api') trigger.focus();
    }
    dispatch(root, 'close', { source });
  }

  function toggle(source = 'api') {
    if (isOpen()) close(source);
    else open(source);
  }

  function onTriggerClick(event) {
    event.preventDefault();
    toggle('trigger');
  }

  function onKeydown(event) {
    if (!isOpen()) return;
    const rows = rowControls(root);
    if (!rows.length) return;
    const current = document.activeElement;
    const index = rows.indexOf(current);

    if (event.key === 'Escape') {
      event.preventDefault();
      close('keyboard');
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = index < 0 ? 0 : (index + 1) % rows.length;
      rows[next].focus();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = index < 0 ? rows.length - 1 : (index - 1 + rows.length) % rows.length;
      rows[next].focus();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      rows[0].focus();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      rows[rows.length - 1].focus();
      return;
    }

    if (event.key === 'Tab' && rows.length) {
      if (event.shiftKey && current === rows[0]) {
        event.preventDefault();
        rows[rows.length - 1].focus();
      } else if (!event.shiftKey && current === rows[rows.length - 1]) {
        event.preventDefault();
        rows[0].focus();
      }
    }
  }

  function onSelect(event) {
    const control = event.target.closest?.('.c-menu-list__control');
    if (!control || !root.contains(control)) return;
    const item = control.closest('.c-menu-list--row');
    dispatch(root, 'select', {
      text: item?.querySelector('.c-menu-list__label')?.textContent?.trim() || '',
      source: 'pointer',
    });
  }

  if (trigger) {
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', isOpen() ? 'true' : 'false');
    if (root.id) trigger.setAttribute('aria-controls', root.id);
    trigger.addEventListener('click', onTriggerClick);
  }

  root.addEventListener('keydown', onKeydown);
  root.addEventListener('click', onSelect);

  return {
    open,
    close,
    toggle,
    destroy() {
      if (trigger) trigger.removeEventListener('click', onTriggerClick);
      root.removeEventListener('keydown', onKeydown);
      root.removeEventListener('click', onSelect);
      delete root.dataset.menuBlockInitialized;
    },
  };
}

/**
 * @param {ParentNode} [scope]
 */
export function initMenuBlocks(scope = document) {
  const roots = scope.querySelectorAll?.(
    '[data-component="menu-block"][data-mode="popup"]',
  );
  if (!roots) return [];
  return Array.from(roots)
    .map((root) => initMenuBlock(root))
    .filter(Boolean);
}

export { prefersReducedMotion };
