importScripts('/js/sw-cache-polyfill.js'); 

var CACHE_NAME = 'my-site-cache-v2';
var urlsToCache = [
  '/js/index.js'
];

// example usage:
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('demo-cache').then(function(cache) {
      return cache.put('/js/index.js', new Response("From the cache!"));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || new Response("Nothing in the cache for this request");
    })
  );
});





//var cacheVersion = 0;
//var currentCache = {
//  offline: 'offline-cache' + cacheVersion
//};
//const offlineUrl = '/index.html';
//
//this.addEventListener('install', event => {
//  event.waitUntil(
//    caches.open(currentCache.offline).then(function(cache) {
//      return cache.addAll([
//          '/js/index.js',
//          offlineUrl
//      ]);
//    })
//  );
//});
//
//this.addEventListener('fetch', event => {
//
//  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
//        event.respondWith(
//          fetch(event.request.url).catch(error => {
//              // Return the offline page
//              return caches.match(offlineUrl);
//        })
//     );
//  }
//  else{
//        event.respondWith(caches.match(event.request)
//                        .then(function (response) {
//                        return response || fetch(event.request);
//                    })
//            );
//      }
//});