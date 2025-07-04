// sw.js - Service Worker

const CACHE_NAME = 'calfnote-cache-v2'; // キャッシュのバージョンを更新
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './cow-icon-192.png',
  './cow-icon-512.png'
];

// インストール時にアプリのファイルをキャッシュする
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 新しいバージョンがあれば古いキャッシュを削除する
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


// オフライン時にキャッシュからデータを返す
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // キャッシュがあればそれを返す
        }
        return fetch(event.request); // なければ通常通り通信する
      })
  );
});