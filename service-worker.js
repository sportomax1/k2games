/*
 * K2 Games PWA Service Worker
 * Network-first for HTML so users get updates without clearing history.
 * Cache-first for static assets so offline play still works.
 */

var CACHE_NAME = 'k2-games-v8';
var CORE_ASSETS = [
  './',
  './index.html'
];

var LOCAL_ASSET_FILES = [
  './puzzles.js',
  './football-mobile.png',
  './football-desktop.png',
  './cul-de-sac-sluggers-mobile.png',
  './cul-de-sac-sluggers-desktop.png',
  './manifest.json',
  './pixel-and-slide.html'
];

var PRECACHE_URLS = CORE_ASSETS.concat(LOCAL_ASSET_FILES);

function notifyClients(message) {
  return self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(function (clients) {
    clients.forEach(function (client) { client.postMessage(message); });
  });
}

function cacheBust(request) {
  var url = new URL(request.url);
  url.searchParams.set('__k2sw', CACHE_NAME + '-' + Date.now());
  return new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    mode: request.mode,
    credentials: request.credentials,
    redirect: request.redirect,
    referrer: request.referrer,
    cache: 'no-store'
  });
}

function isHtmlRequest(request) {
  var url = new URL(request.url);
  return request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/');
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(PRECACHE_URLS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(function () { return self.clients.claim(); })
      .then(function () { return notifyClients({ type: 'PRECACHE_COMPLETE', cache: CACHE_NAME }); })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  var request = event.request;
  if (new URL(request.url).origin !== self.location.origin) return;

  if (isHtmlRequest(request)) {
    event.respondWith(
      fetch(cacheBust(request)).then(function (networkResponse) {
        var cleanResponse = networkResponse.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(request, cleanResponse); });
        return networkResponse;
      }).catch(function () {
        return caches.match(request).then(function (cached) {
          return cached || caches.match('./index.html');
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function (cachedResponse) {
      if (cachedResponse) return cachedResponse;
      return fetch(request).then(function (networkResponse) {
        var responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(request, responseToCache); });
        return networkResponse;
      });
    })
  );
});
