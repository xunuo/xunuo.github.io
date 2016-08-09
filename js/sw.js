//importScripts('/js/sw-cache-polyfill.js'); 
//
//var CACHE_NAME = 'my-site-cache-v2';
//var urlsToCache = [
//  '/js/index.js'
//];
//
//self.addEventListener('install', function(event) {
//  // Perform install steps
//  event.waitUntil(
//    caches.open(CACHE_NAME)
//      .then(function(cache) {
//        console.log('Opened cache');
//        return cache.addAll(urlsToCache);
//      })
//  );
//}); 


var cacheVersion = 0;
var currentCache = {
  offline: 'offline-cache' + cacheVersion
};
const offlineUrl = 'index.html';

this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
      return cache.addAll([
          './js/index.js',
          offlineUrl
      ]);
    })
  );
});

this.addEventListener('fetch', event => {

  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
          fetch(event.request.url).catch(error => {
              // Return the offline page
              return caches.match(offlineUrl);
        })
     );
  }
  else{
        event.respondWith(caches.match(event.request)
                        .then(function (response) {
                        return response || fetch(event.request);
                    })
            );
      }
});