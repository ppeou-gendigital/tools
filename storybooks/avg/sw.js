/* aics storybook service worker — build 1d935a74df6ef7e3
 *
 * Auto-update (Viaggio-style): skipWaiting + clientsClaim; page reloads
 * on controllerchange. Network-first for HTML/JSON so deploys show up
 * without a manual hard refresh; cache-first for hashed /assets/*.
 */
const BUILD_ID = "1d935a74df6ef7e3";
const CACHE = 'aics-sb-' + BUILD_ID;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(['./', './index.html']).catch(() => {})),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k.startsWith('aics-sb-') && k !== CACHE).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

function isNavigation(request) {
  return request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

function isShellMeta(url) {
  const path = url.pathname;
  return (
    path.endsWith('/index.json') ||
    path.endsWith('/index.html') ||
    path.endsWith('/project.json') ||
    path.endsWith('/iframe.html') ||
    path.endsWith('/sw.js') ||
    path.endsWith('/sw-register.js')
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Always network for SW itself (and ignore HTTP cache on update checks).
  if (url.pathname.endsWith('/sw.js')) {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }

  if (isNavigation(request) || isShellMeta(url)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match('./index.html'))),
    );
    return;
  }

  // Hashed Storybook assets — cache-first, revalidate in background.
  if (url.pathname.includes('/assets/') || url.pathname.includes('/sb-')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
  }
});
