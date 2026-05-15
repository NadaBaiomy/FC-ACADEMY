var CACHE = 'fc-v4';

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE));
  self.skipWaiting();
});

self.addEventListener('fetch', function(e) {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(function() {
      return caches.match('/index.html');
    }));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(ks) {
    return Promise.all(ks.map(function(k) {
      return caches.delete(k);
    }));
  }));
  self.clients.claim();
});
