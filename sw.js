importScripts('./sw-cache-polyfill.js'); 

var CACHE_NAME = 'my-site-cache-v5';
var urlsToCache = [
    '/',
    '/js/index.js',
    'https://u.alicdn.com/mobile/g/common/apollo/1.2.3/??apollo.css?t=5593144b_95c2cf954'
];

// example usage:
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      //return cache.put('./js/index.js', new Response("From the cache!"));
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch",function(event){
    event.respondWith(
        caches.match(event.request).then(function(response){
            //缓存响应
            if(response)
                return response;
            return fetch(event.request);
        })
    )
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