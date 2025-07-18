const CACHE_NAME = 'safe-crypto-vault-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/deposit.html',
  '/withdraw.html',
  '/history.html',
  '/team.html',
  '/affiliate.html',
  '/settings.html',
  '/security.html',
  '/admin.html',
  '/style.css',
  '/script.js',
  '/deposit.js',
  '/withdraw.js',
  '/history.js',
  '/team.js',
  '/admin.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.json'
];

// Instalare: cache inițial
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activare: curățare cache vechi
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', name);
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: servește din cache când e offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
