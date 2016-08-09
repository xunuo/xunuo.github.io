importScripts('/js/sw-cache-polyfill.js'); 

var CACHE_NAME = 'my-site-cache-v2';
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