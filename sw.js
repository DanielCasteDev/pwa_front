const CACHE_NAME = 'app-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/vite.svg',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/src/components/Login.tsx',
  '/src/components/Sidebar.tsx',
  '/src/pages/Dashboard.tsx',
  '/src/pages/TasksPage.tsx',
  '/src/pages/AnalyticsPage.tsx',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // Offline fallbacks
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          // Intentar servir el recurso ignorando el query string (?t=... de Vite)
          return caches.match(event.request, { ignoreSearch: true }).then((res) => {
            return res || caches.match('/vite.svg');
          });
        });
    })
  );
});