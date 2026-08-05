/**
 * Patterns/Pagination — nav / select / jump interactions.
 * Events: `lifelock:pagination:change` detail `{ page, root, source }`
 */

function dispatchChange(root, page, source) {
  root.dispatchEvent(
    new CustomEvent('lifelock:pagination:change', {
      bubbles: true,
      composed: true,
      detail: { page, root, source },
    }),
  );
}

function clampPage(page, total) {
  const max = Math.max(1, Number(total) || 1);
  return Math.min(max, Math.max(1, Number(page) || 1));
}

/**
 * @param {HTMLElement} root
 * @param {{ currentPage?: number, totalPages?: number, onChange?: (page:number)=>void }} [options]
 */
export function initPagination(root, options = {}) {
  if (!root || root.dataset.paginationInitialized === 'true') return null;
  root.dataset.paginationInitialized = 'true';

  const type = root.getAttribute('data-pagination-type') || 'nav';
  let currentPage = Number(options.currentPage || root.dataset.currentPage || 1);
  let totalPages = Number(options.totalPages || root.dataset.totalPages || 1);

  function setPage(page, source) {
    currentPage = clampPage(page, totalPages);
    root.dataset.currentPage = String(currentPage);
    if (typeof options.onChange === 'function') options.onChange(currentPage);
    dispatchChange(root, currentPage, source);
  }

  function onNavClick(event) {
    const btn = event.target.closest?.('[data-pagination-page], [data-pagination-step]');
    if (!btn || !root.contains(btn) || btn.disabled) return;
    event.preventDefault();
    if (btn.hasAttribute('data-pagination-step')) {
      const step = Number(btn.getAttribute('data-pagination-step')) || 0;
      setPage(currentPage + step, 'nav');
      return;
    }
    setPage(btn.getAttribute('data-pagination-page'), 'nav');
  }

  function onSelectTrigger(event) {
    event.preventDefault();
    const open = root.classList.toggle('is-open');
    const trigger = root.querySelector('[data-pagination-select-trigger]');
    if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function onSelectItem(event) {
    const control = event.target.closest?.('.c-menu-list__control');
    if (!control || !root.contains(control)) return;
    const row = control.closest('.c-menu-list--row');
    const page = Number(row?.getAttribute('data-page') || control.textContent);
    if (!Number.isFinite(page)) return;
    root.classList.remove('is-open');
    const trigger = root.querySelector('[data-pagination-select-trigger]');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    setPage(page, 'select');
  }

  function onJumpSubmit(event) {
    event.preventDefault();
    const input = root.querySelector('[data-pagination-jump-input]');
    if (!input) return;
    setPage(input.value, 'jump');
  }

  function onJumpKeydown(event) {
    if (event.key === 'Enter') onJumpSubmit(event);
  }

  if (type === 'nav') root.addEventListener('click', onNavClick);
  if (type === 'select') {
    const trigger = root.querySelector('[data-pagination-select-trigger]');
    if (trigger) trigger.addEventListener('click', onSelectTrigger);
    root.addEventListener('click', onSelectItem);
  }
  if (type === 'jump') {
    const submit = root.querySelector('[data-pagination-jump-submit]');
    const input = root.querySelector('[data-pagination-jump-input]');
    if (submit) submit.addEventListener('click', onJumpSubmit);
    if (input) input.addEventListener('keydown', onJumpKeydown);
  }

  return {
    setPage: (page) => setPage(page, 'api'),
    getPage: () => currentPage,
    destroy() {
      root.removeEventListener('click', onNavClick);
      root.removeEventListener('click', onSelectItem);
      const trigger = root.querySelector('[data-pagination-select-trigger]');
      if (trigger) trigger.removeEventListener('click', onSelectTrigger);
      const submit = root.querySelector('[data-pagination-jump-submit]');
      const input = root.querySelector('[data-pagination-jump-input]');
      if (submit) submit.removeEventListener('click', onJumpSubmit);
      if (input) input.removeEventListener('keydown', onJumpKeydown);
      delete root.dataset.paginationInitialized;
    },
  };
}

export function initPaginations(scope = document) {
  const roots = scope.querySelectorAll?.('[data-component="pagination"]');
  if (!roots) return [];
  return Array.from(roots)
    .map((root) => initPagination(root))
    .filter(Boolean);
}
