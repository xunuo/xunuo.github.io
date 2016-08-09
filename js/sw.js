/**
 * Created by snow on 16/8/10.
 */

const cacheUrl = [
  '/js/index.js'
];
const cacheName = 'my-site-cache';

// install阶段
self.addEventListener('install', (event) => {
  console.log('sw event: install');
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('open cache');
      return cache.addAll(cacheUrl);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then(res => {
    if (res) {
      console.log('match');
      return res;
    }
    return fetch(event.request);
  }));
});