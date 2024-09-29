const cacheName = 'chem-supplies-v1';
const assets = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/icon-sm.png',
  '/icon-big.png'
];

// Install event - caching files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service worker activated');
});

// Fetch event - Serving cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
