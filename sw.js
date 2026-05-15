var CACHE = 'fc-v2';
var URLS = ['/', '/index.html'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) {
    return c.addAll(URLS);
  }));
  self.skipWaiting();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request).then(function(res) {
        return caches.open(CACHE).then(function(c) {
          if (e.request.url.indexOf('supabase') < 0) {
            c.put(e.request, res.clone());
          }
          return res;
        });
      });
    }).catch(function() {
      return caches.match('/index.html');
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(ks) {
    return Promise.all(ks.filter(function(k) {
      return k !== CACHE;
    }).map(function(k) {
      return caches.delete(k);
    }));
  }));
  self.clients.claim();
});
