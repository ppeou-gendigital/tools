/**
 * Patterns/Accordion — progressive-enhancement behavior layer.
 *
 * Native `<details>` works without JS. This module adds height
 * animation, optional single-open enforcement, disabled short-circuit,
 * and `lifelock:accordion:*` CustomEvents (namespace matches core
 * Checkbox / Radio / Switch).
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

function getContentEl(details) {
  return details.querySelector(':scope > .c-accordion__item-content');
}

function isDisabled(details) {
  return details.getAttribute('data-disabled') === 'true';
}

function dispatch(details, type, detail) {
  details.dispatchEvent(
    new CustomEvent(`lifelock:accordion:${type}`, {
      bubbles: true,
      composed: true,
      detail,
    }),
  );
}

function getItemId(details) {
  return details.id || details.getAttribute('data-accordion-item-id') || '';
}

/**
 * @param {HTMLElement} root
 * @param {{ singleOpen?: boolean, animate?: boolean, duration?: number }} [options]
 */
export function initAccordion(root, options = {}) {
  if (!root || root.dataset.accordionInitialized === 'true') {
    return null;
  }
  root.dataset.accordionInitialized = 'true';

  const animate = options.animate !== false;
  const duration = typeof options.duration === 'number' ? options.duration : 200;
  const singleOpen =
    typeof options.singleOpen === 'boolean'
      ? options.singleOpen
      : root.getAttribute('data-single-open') === 'true';

  const items = Array.from(root.querySelectorAll(':scope > .c-accordion__item'));

  function findDetails(target) {
    if (typeof target === 'number') return items[target] || null;
    return items.find((d) => getItemId(d) === target) || null;
  }

  function animatePanel(details, opening, source) {
    const content = getContentEl(details);
    if (!content) return;

    if (!animate || prefersReducedMotion()) {
      details.open = opening;
      dispatch(details, 'toggle', { id: getItemId(details), open: opening, source });
      dispatch(details, opening ? 'opened' : 'closed', {
        id: getItemId(details),
        source,
      });
      return;
    }

    if (opening) {
      details.open = true;
      details.dataset.animating = 'opening';
      const target = content.scrollHeight;
      content.style.maxBlockSize = '0px';
      requestAnimationFrame(() => {
        content.style.transition = `max-block-size ${duration}ms ease`;
        content.style.maxBlockSize = `${target}px`;
      });
      const onEnd = () => {
        content.style.transition = '';
        content.style.maxBlockSize = '';
        delete details.dataset.animating;
        content.removeEventListener('transitionend', onEnd);
        dispatch(details, 'opened', { id: getItemId(details), source });
      };
      content.addEventListener('transitionend', onEnd);
      dispatch(details, 'toggle', { id: getItemId(details), open: true, source });
    } else {
      const startHeight = content.scrollHeight;
      details.dataset.animating = 'closing';
      content.style.maxBlockSize = `${startHeight}px`;
      requestAnimationFrame(() => {
        content.style.transition = `max-block-size ${duration}ms ease`;
        content.style.maxBlockSize = '0px';
      });
      const onEnd = () => {
        content.style.transition = '';
        content.style.maxBlockSize = '';
        delete details.dataset.animating;
        details.open = false;
        content.removeEventListener('transitionend', onEnd);
        dispatch(details, 'closed', { id: getItemId(details), source });
      };
      content.addEventListener('transitionend', onEnd);
      dispatch(details, 'toggle', { id: getItemId(details), open: false, source });
    }
  }

  function open(target, source = 'api') {
    const details = findDetails(target);
    if (!details || isDisabled(details) || details.open) return;
    if (singleOpen) {
      items
        .filter((d) => d !== details && d.open && !isDisabled(d))
        .forEach((sibling) => animatePanel(sibling, false, 'api'));
    }
    animatePanel(details, true, source);
  }

  function close(target, source = 'api') {
    const details = findDetails(target);
    if (!details || !details.open) return;
    animatePanel(details, false, source);
  }

  function toggle(target, source = 'api') {
    const details = findDetails(target);
    if (!details) return;
    if (details.open) close(target, source);
    else open(target, source);
  }

  function getOpen() {
    return items.filter((d) => d.open).map(getItemId);
  }

  function onSummaryClick(event) {
    const summary = event.target.closest('.c-accordion__item-header');
    if (!summary) return;
    const details = summary.parentElement;
    if (!details || !details.classList.contains('c-accordion__item')) return;
    if (isDisabled(details)) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    const source = event.detail === 0 ? 'keyboard' : 'click';
    if (details.open) {
      close(details.id || items.indexOf(details), source);
    } else {
      open(details.id || items.indexOf(details), source);
    }
  }

  items.forEach((details) => {
    const summary = details.querySelector(':scope > .c-accordion__item-header');
    if (summary) summary.addEventListener('click', onSummaryClick);
  });

  function destroy() {
    items.forEach((details) => {
      const summary = details.querySelector(':scope > .c-accordion__item-header');
      if (summary) summary.removeEventListener('click', onSummaryClick);
      const content = getContentEl(details);
      if (content) {
        content.style.transition = '';
        content.style.maxBlockSize = '';
      }
      delete details.dataset.animating;
    });
    delete root.dataset.accordionInitialized;
  }

  return { open, close, toggle, getOpen, destroy };
}

/**
 * @param {ParentNode} [scope]
 * @param {object} [options]
 */
export function initAccordions(scope, options) {
  const root = scope || (typeof document !== 'undefined' ? document : null);
  if (!root) return [];
  return Array.from(root.querySelectorAll('.c-accordion'))
    .map((node) => initAccordion(node, options))
    .filter(Boolean);
}

export default initAccordion;
