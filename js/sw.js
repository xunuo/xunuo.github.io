/**
 * Created by snow on 16/8/10.
 */
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/js/index.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});