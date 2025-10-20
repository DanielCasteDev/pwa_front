const CACHE_NAME = 'pwa-daniel-v6';
const RUNTIME_CACHE = 'runtime-cache-v6';

// Base de la API (puede ser actualizada vía postMessage desde la app)
let API_BASE_URL = 'http://localhost:3001';

// IndexedDB  
const IDB_NAME = 'pwa-cart-db';
const IDB_VERSION = 1;
const IDB_STORE = 'cartQueue';

function openCartDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_NAME, IDB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbAddCartRecord(record) {
  const db = await openCartDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(IDB_STORE).add({ ...record, createdAt: Date.now() });
  });
}

async function idbGetAllCartRecords() {
  const db = await openCartDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function idbClearCartStore() {
  const db = await openCartDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const req = tx.objectStore(IDB_STORE).clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Procesar la cola del carrito cuando haya internet
async function processCartQueue() {
  try {
    const items = await idbGetAllCartRecords();
    if (!items.length) {
      console.log('[SW] 🧺 Cola vacía, nada que sincronizar');
      return;
    }

    if (self.navigator && self.navigator.onLine === false) {
      console.log('[SW] 📡 Sin conexión, no se procesa la cola');
      return;
    }

    // Construir endpoint a partir de la base de la API
    let endpoint = '/api/cart/sync';
    try {
      endpoint = new URL('/api/cart/sync', API_BASE_URL).toString();
    } catch (_) {
      endpoint = `${API_BASE_URL.replace(/\/$/, '')}/api/cart/sync`;
    }

    console.log('[SW] 🔄 Enviando cola del carrito:', items.length, 'elementos');
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });

    if (!res.ok) {
      throw new Error('Respuesta no OK al sincronizar: ' + res.status);
    }

    await idbClearCartStore();
    console.log('[SW] ✅ Cola sincronizada y limpiada');

    // Notificar a los clientes que la sincronización terminó
    const allClients = await self.clients.matchAll({ includeUncontrolled: true });
    allClients.forEach((client) => {
      client.postMessage({ type: 'CART_SYNCED' });
    });
  } catch (err) {
    console.warn('[SW] ⚠️ No se pudo sincronizar la cola:', err && err.message);
    // Se reintentará en el próximo evento 'sync' o cuando vuelva el internet
  }
}

// URLs críticas para cachear
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/index.js',
  '/assets/index.css',
  '/iphone.png',
  '/samsung.webp',
  '/google.png',
  '/oneplus.png',
  '/airpod.png',
  '/sony.png',
  '/mac.png',
  '/dell.png',
  '/watch.png',
  '/reloj_samsu.png'
];

// Patrones de recursos que deben ser cacheados automáticamente
const CACHE_PATTERNS = [
  /\/assets\/.*\.(js|css)$/,
  /\.(png|jpg|jpeg|gif|webp|svg|ico)$/,
  /\/manifest\.json$/
];

// Función para verificar si un recurso debe ser cacheado automáticamente
function shouldAutoCache(url) {
  return CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// Instalar el service worker
self.addEventListener('install', (event) => {
  console.log('[SW] 🔧 Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] 📦 Abriendo cache:', CACHE_NAME);
        
        // Intentar cachear cada URL individualmente
        const cachePromises = PRECACHE_URLS.map(url => {
          return fetch(url)
            .then(response => {
              if (response.ok) {
                console.log('[SW] ✅ Cacheado:', url);
                return cache.put(url, response);
              } else {
                console.warn('[SW] ⚠️ No se pudo cachear (status ' + response.status + '):', url);
                return null; // No fallar la instalación por un recurso
              }
            })
            .catch(err => {
              console.warn('[SW] ⚠️ Error cacheando (continuando):', url, err.message);
              return null; // No fallar la instalación por un error de red
            });
        });
        
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('[SW] ⚡ Activando inmediatamente...');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] 💥 Error en instalación:', error);
      })
  );
});

// Activar el service worker
self.addEventListener('activate', (event) => {
  console.log('[SW] 🚀 Activando Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches viejos
      caches.keys().then((cacheNames) => {
        const deletePromises = cacheNames
          .filter(cacheName => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map(cacheName => {
            console.log('[SW] 🗑️ Eliminando cache viejo:', cacheName);
            return caches.delete(cacheName);
          });
        return Promise.all(deletePromises);
      }),
      // Tomar control inmediatamente
      self.clients.claim().then(() => {
        console.log('[SW] 👍 Tomando control de las páginas');
      })
    ]).then(() => {
      console.log('[SW] ✨ Service Worker activado y listo');
    })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar requests del mismo origen
  if (url.origin !== location.origin) {
    return;
  }

  // Ignorar requests que no sean GET
  if (request.method !== 'GET') {
    return;
  }

  console.log('[SW] 🌐 Fetch:', url.pathname);

  event.respondWith(
    // 1. Primero intentar desde cache
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] 📂 Desde cache:', url.pathname);
          
          // Actualizar cache en background (stale-while-revalidate) solo si hay conexión
          if (navigator.onLine !== false) {
            fetch(request)
              .then((networkResponse) => {
                if (networkResponse && networkResponse.ok) {
                  caches.open(RUNTIME_CACHE).then((cache) => {
                    console.log('[SW] 🔄 Actualizando cache:', url.pathname);
                    cache.put(request, networkResponse);
                  }).catch((err) => {
                    console.warn('[SW] ⚠️ Error actualizando cache:', err);
                  });
                }
              })
              .catch((error) => {
                // Silenciar errores de actualización en background cuando no hay red
                console.log('[SW] 📡 Sin conexión para actualizar cache:', url.pathname);
              });
          }
          
          return cachedResponse;
        }

        // 2. Si no está en cache, intentar ir a la red
        if (navigator.onLine === false) {
          console.log('[SW] 📡 Sin conexión, buscando fallback para:', url.pathname);
          
          // Para la ruta raíz o rutas de navegación, servir index.html
          if (url.pathname === '/' || request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html').then((fallback) => {
              if (fallback) {
                console.log('[SW] 🏠 Sirviendo fallback: /index.html para', url.pathname);
                return fallback;
              }
              // Si no hay index.html en cache, crear una respuesta básica
              return new Response('Sin conexión - Recurso no disponible', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'text/plain' }
              });
            });
          }
          
          // Para otros recursos, devolver error controlado
          return new Response('Recurso no disponible sin conexión', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
          });
        }

        console.log('[SW] 🌍 Desde red:', url.pathname);
        return fetch(request)
          .then((networkResponse) => {
            // Verificar que sea una respuesta válida
            if (!networkResponse || networkResponse.status !== 200) {
              console.warn('[SW] ⚠️ Respuesta no válida:', url.pathname, networkResponse?.status);
              return networkResponse;
            }

            // Cachear la respuesta solo si es un recurso que debe ser cacheado
            if (shouldAutoCache(url)) {
              const responseToCache = networkResponse.clone();
              
              caches.open(RUNTIME_CACHE)
                .then((cache) => {
                  console.log('[SW] 💾 Guardando en cache:', url.pathname);
                  cache.put(request, responseToCache);
                })
                .catch((err) => {
                  console.error('[SW] ❌ Error guardando en cache:', err);
                });
            }

            return networkResponse;
          })
          .catch((error) => {
            console.error('[SW] 💥 Error de red:', url.pathname, error.message);
            
            // Intentar servir index.html para la ruta raíz o rutas de navegación
            if (url.pathname === '/' || request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/index.html').then((fallback) => {
                if (fallback) {
                  console.log('[SW] 🏠 Sirviendo fallback: /index.html para', url.pathname);
                  return fallback;
                }
                // Crear respuesta de error controlada
                return new Response('Sin conexión - Página no disponible', {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'text/html' }
                });
              });
            }
            
            // Para otros recursos, devolver error controlado
            return new Response('Recurso no disponible', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  console.log('[SW] 📨 Mensaje recibido:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    caches.open(RUNTIME_CACHE).then(cache => {
      urls.forEach(url => {
        fetch(url).then(response => {
          if (response.ok) {
            cache.put(url, response);
            console.log('[SW] 📥 Cacheado bajo demanda:', url);
          }
        });
      });
    });
  }

  if (event.data && event.data.type === 'QUEUE_CART_ITEM') {
    const payload = event.data.payload || {};
    const record = {
      action: payload.action || 'add',
      product: payload.product || null,
      quantity: payload.quantity || 1
    };
    idbAddCartRecord(record)
      .then(() => {
        console.log('[SW] 🧾 Item agregado a la cola offline');
      })
      .catch((e) => console.warn('[SW] ❌ Error guardando en IDB:', e && e.message));
  }

  if (event.data && event.data.type === 'SET_API_BASE_URL') {
    const base = event.data.baseUrl;
    if (typeof base === 'string' && base.length > 0) {
      API_BASE_URL = base;
      console.log('[SW] 🔧 API_BASE_URL seteada a:', API_BASE_URL);
    }
  }

  if (event.data && event.data.type === 'PROCESS_CART_QUEUE') {
    event.waitUntil(processCartQueue());
  }
});

// Detectar cambios en el estado de la conexión
self.addEventListener('online', () => {
  console.log('[SW] 🌐 Conexión restaurada');
  // Fallback si no hay Background Sync
  processCartQueue();
});

self.addEventListener('offline', () => {
  console.log('[SW] 📡 Sin conexión');
});

// Background Sync para subir el carrito cuando vuelva internet
self.addEventListener('sync', (event) => {
  if (!event.tag) return;
  if (event.tag === 'sync-cart') {
    console.log('[SW] 🔁 Evento Background Sync: sync-cart');
    event.waitUntil(processCartQueue());
  }
});

// 🔔 Manejar notificaciones push
self.addEventListener('push', (event) => {
  console.log('[SW] 🔔 Push recibido:', event);

  const data = event.data ? event.data.json() : {};
  const title = data.title || 'TechStore Notificación';
  const options = {
    body: data.body || 'Tienes una nueva notificación',
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'Ver',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/favicon.ico'
      }
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 🔔 Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] 🔔 Notificación clickeada:', event);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Si es una notificación de carrito, abrir el carrito directamente
  const notificationData = event.notification.data;
  let targetUrl = '/';
  
  if (notificationData && notificationData.type === 'cart') {
    targetUrl = '/?openCart=true';
    console.log('[SW] 🛒 Abriendo carrito desde notificación');
  }

  // Abrir o enfocar la aplicación
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla y enviar mensaje
        for (const client of clientList) {
          if (client.url === self.location.origin && 'focus' in client) {
            client.focus();
            // Enviar mensaje para abrir el carrito si es necesario
            if (notificationData && notificationData.type === 'cart') {
              client.postMessage({ type: 'OPEN_CART' });
            }
            return;
          }
        }
        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// Log cuando el SW se inicia
console.log('[SW] 🎬 Service Worker cargado');