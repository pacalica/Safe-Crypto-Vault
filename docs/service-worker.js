const CACHE_NAME = 'safe-crypto-vault-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'dashboard.html',
  'deposit.html',
  'withdraw.html',
  'history.html',
  'team.html',
  'settings.html',
  'security.html',
  'admin.html',
  'css/styles.css',
  'js/script.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'images/robot-bg.jpg'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate and clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch assets from cache or network
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedRes => {
      return (
        cachedRes ||
        fetch(event.request).catch(() =>
          caches.match('index.html') // fallback
        )
      );
    })
  );
});
