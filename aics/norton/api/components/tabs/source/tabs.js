/**
 * Patterns/Tabs — selection + mobile dropdown.
 * Events: `lifelock:tabs:change` detail `{ index, root, source }`
 */

function dispatchChange(root, index, source) {
  root.dispatchEvent(
    new CustomEvent('lifelock:tabs:change', {
      bubbles: true,
      composed: true,
      detail: { index, root, source },
    }),
  );
}

function getTabButtons(root) {
  return Array.from(root.querySelectorAll('[data-tabs-list-wrap] [role="tab"]'));
}

function getMobileOptions(root) {
  return Array.from(root.querySelectorAll('[data-tabs-mobile-menu] [role="option"]'));
}

function setActive(root, index, source) {
  const tabs = getTabButtons(root);
  const options = getMobileOptions(root);
  const target = tabs[index];
  if (!target || target.disabled) return;

  tabs.forEach((tab, i) => {
    const active = i === index;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
    tab.tabIndex = active ? 0 : -1;
  });

  options.forEach((opt, i) => {
    const active = i === index;
    opt.classList.toggle('is-active', active);
    opt.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  root.dataset.activeIndex = String(index);
  const valueEl = root.querySelector('[data-tabs-mobile-value]');
  if (valueEl) valueEl.textContent = target.textContent?.trim() || '';

  if (typeof source === 'string') dispatchChange(root, index, source);
}

function closeMobile(root) {
  root.classList.remove('is-mobile-open');
  const trigger = root.querySelector('[data-tabs-mobile-trigger]');
  const menu = root.querySelector('[data-tabs-mobile-menu]');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
  if (menu) menu.hidden = true;
}

function openMobile(root) {
  root.classList.add('is-mobile-open');
  const trigger = root.querySelector('[data-tabs-mobile-trigger]');
  const menu = root.querySelector('[data-tabs-mobile-menu]');
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
  if (menu) menu.hidden = false;
}

/**
 * @param {HTMLElement} root
 * @param {{ activeIndex?: number, onChange?: (index:number)=>void }} [options]
 */
export function initTabs(root, options = {}) {
  if (!root || root.dataset.tabsInitialized === 'true') return null;
  root.dataset.tabsInitialized = 'true';

  const initial = Number(
    options.activeIndex ?? root.dataset.activeIndex ?? 0,
  );
  setActive(root, initial, null);

  function selectIndex(index, source) {
    setActive(root, index, source);
    if (typeof options.onChange === 'function') options.onChange(index);
    closeMobile(root);
  }

  function onTabClick(event) {
    const tab = event.target.closest?.('[role="tab"]');
    if (!tab || !root.contains(tab) || tab.disabled) return;
    const index = Number(tab.getAttribute('data-tabs-index'));
    if (!Number.isFinite(index)) return;
    selectIndex(index, 'tab');
  }

  function onTabKeydown(event) {
    const tab = event.target.closest?.('[role="tab"]');
    if (!tab || !root.contains(tab)) return;
    const tabs = getTabButtons(root).filter((t) => !t.disabled);
    if (!tabs.length) return;
    const current = tabs.indexOf(tab);
    if (current < 0) return;

    let next = current;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (current + 1) % tabs.length;
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (current - 1 + tabs.length) % tabs.length;
      event.preventDefault();
    } else if (event.key === 'Home') {
      next = 0;
      event.preventDefault();
    } else if (event.key === 'End') {
      next = tabs.length - 1;
      event.preventDefault();
    } else {
      return;
    }
    const index = Number(tabs[next].getAttribute('data-tabs-index'));
    selectIndex(index, 'keyboard');
    tabs[next].focus();
  }

  function onMobileTrigger(event) {
    event.preventDefault();
    if (root.classList.contains('is-mobile-open')) closeMobile(root);
    else openMobile(root);
  }

  function onMobileOption(event) {
    const opt = event.target.closest?.('[role="option"]');
    if (!opt || !root.contains(opt) || opt.disabled) return;
    const index = Number(opt.getAttribute('data-tabs-index'));
    if (!Number.isFinite(index)) return;
    selectIndex(index, 'mobile');
  }

  function onDocClick(event) {
    if (!root.classList.contains('is-mobile-open')) return;
    if (root.contains(event.target)) return;
    closeMobile(root);
  }

  const list = root.querySelector('[data-tabs-list-wrap]');
  if (list) {
    list.addEventListener('click', onTabClick);
    list.addEventListener('keydown', onTabKeydown);
  }
  const trigger = root.querySelector('[data-tabs-mobile-trigger]');
  if (trigger) trigger.addEventListener('click', onMobileTrigger);
  const menu = root.querySelector('[data-tabs-mobile-menu]');
  if (menu) menu.addEventListener('click', onMobileOption);
  document.addEventListener('click', onDocClick);

  return {
    setActiveIndex: (index) => selectIndex(index, 'api'),
    getActiveIndex: () => Number(root.dataset.activeIndex || 0),
    destroy() {
      if (list) {
        list.removeEventListener('click', onTabClick);
        list.removeEventListener('keydown', onTabKeydown);
      }
      if (trigger) trigger.removeEventListener('click', onMobileTrigger);
      if (menu) menu.removeEventListener('click', onMobileOption);
      document.removeEventListener('click', onDocClick);
      delete root.dataset.tabsInitialized;
    },
  };
}

export function initTabsAll(scope = document) {
  const roots = scope.querySelectorAll?.('[data-component="tabs"]');
  if (!roots) return [];
  return Array.from(roots)
    .map((root) => initTabs(root))
    .filter(Boolean);
}
