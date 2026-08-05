/**
 * Patterns/Alert — progressive-enhancement dismiss behaviour.
 *
 * Presentational by default. When `initAlert` runs, dismiss buttons
 * unmount the root and fire `lifelock:alert:dismiss`.
 */

/**
 * @param {HTMLElement} root
 * @returns {{ destroy: () => void } | null}
 */
export function initAlert(root) {
  if (!root || root.dataset.alertInitialized === 'true') return null;

  const dismissBtn = root.querySelector('[data-alert-dismiss]');
  if (!dismissBtn) return null;

  root.dataset.alertInitialized = 'true';

  const onDismiss = () => {
    root.dispatchEvent(
      new CustomEvent('lifelock:alert:dismiss', {
        bubbles: true,
        composed: true,
        detail: { root },
      }),
    );
    root.remove();
  };

  dismissBtn.addEventListener('click', onDismiss);

  return {
    destroy() {
      dismissBtn.removeEventListener('click', onDismiss);
      delete root.dataset.alertInitialized;
    },
  };
}

/**
 * @param {ParentNode} [scope=document]
 * @returns {Array<{ destroy: () => void }>}
 */
export function initAlerts(scope = document) {
  return Array.from(scope.querySelectorAll('.c-alert')).map((el) => initAlert(el)).filter(Boolean);
}
