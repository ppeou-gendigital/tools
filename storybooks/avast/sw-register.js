/* aics storybook SW register — Viaggio-style autoUpdate */
(function () {
  if (!('serviceWorker' in navigator)) return;

  var UPDATE_CHECK_MS = 1800000;

  function register() {
    navigator.serviceWorker
      .register('./sw.js', { updateViaCache: 'none' })
      .then(function (registration) {
        if (!registration) return;

        var checkForUpdate = function () {
          registration.update().catch(function () {});
        };

        document.addEventListener('visibilitychange', function () {
          if (document.visibilityState === 'visible') checkForUpdate();
        });
        window.addEventListener('focus', checkForUpdate);
        setInterval(checkForUpdate, UPDATE_CHECK_MS);

        // New worker installed while a controller exists → activate now.
        registration.addEventListener('updatefound', function () {
          var installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', function () {
            if (
              installing.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // skipWaiting already ran in sw.js; controllerchange reloads.
            }
          });
        });
      })
      .catch(function () {});
  }

  var refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register);
})();
