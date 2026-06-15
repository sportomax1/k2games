/*
 * K2 Games PWA Service Worker v9
 * 
 * Strategy:
 * - HTML files: Network-first with fallback to cache. Prevents stale game pages.
 * - Static assets: Cache-first with fallback to network. Enables offline play.
 * 
 * Benefits:
 * - Normal refresh shows updates without Ctrl+Shift+R or clearing history
 * - Offline users still see cached game pages and assets
 * - Static resources cache aggressively for speed
 * - Clients notified when SW updates so they can optionally refresh
 */

var CACHE_NAME = 'k2-games-v10';

// Core app shell and key files to precache
var CORE_ASSETS = [
  './',
  './index.html'
];

// Static assets that rarely change; precached for offline availability
var STATIC_ASSETS = [
  './puzzles.js',
  './football-mobile.png',
  './football-desktop.png',
  './cul-de-sac-sluggers-mobile.png',
  './cul-de-sac-sluggers-desktop.png',
  './manifest.json'
];

var PRECACHE_URLS = CORE_ASSETS.concat(STATIC_ASSETS);

/**
 * Notify all connected clients of a message.
 * Used for SW lifecycle events and update alerts.
 */
function notifyClients(message) {
  return self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage(message);
    });
  });
}

/**
 * Check if request is for HTML (navigations or .html files).
 * These use network-first strategy to avoid stale content.
 */
function isHtmlRequest(request) {
  var url = new URL(request.url);
  var pathname = url.pathname;
  return request.mode === 'navigate' || 
         pathname.endsWith('.html') || 
         pathname === '/' || 
         pathname.endsWith('/');
}

function isLiveDataRequest(request) {
  var url = new URL(request.url);
  return url.pathname.endsWith('/games-data.js') || url.pathname === '/games-data.js';
}

/**
 * Check if request is for a static asset.
 * These use cache-first strategy for offline speed.
 */
function isStaticAsset(request) {
  var url = new URL(request.url);
  var pathname = url.pathname;
  // Images, fonts, styles, audio, manifests
  return /\.(png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|css|json|mp3|wav|ogg)$/i.test(pathname) ||
         pathname.includes('/assets/') ||
         pathname.includes('/static/');
}

// ============================================================================
// Service Worker Lifecycle Events
// ============================================================================

self.addEventListener('install', function (event) {
  console.log('[SW] Install: precaching core assets and static files');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(function () {
        console.log('[SW] Install: skipWaiting');
        return self.skipWaiting();
      })
      .catch(function (err) {
        console.error('[SW] Install error:', err);
      })
  );
});

self.addEventListener('activate', function (event) {
  console.log('[SW] Activate: claiming clients and cleaning old caches');
  event.waitUntil(
    // Clean up old cache versions
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
      .then(function () {
        return self.clients.claim();
      })
      .then(function () {
        console.log('[SW] Activation complete. Notifying clients.');
        return notifyClients({ 
          type: 'SW_UPDATED', 
          cache: CACHE_NAME,
          message: 'Service Worker updated. Games will load fresh versions.'
        });
      })
      .catch(function (err) {
        console.error('[SW] Activate error:', err);
      })
  );
});

// ============================================================================
// Fetch Event Handler
// ============================================================================

self.addEventListener('fetch', function (event) {
  var request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Only handle same-origin requests
  var requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  // ======== NETWORK-FIRST FOR HTML ========
  if (isHtmlRequest(request)) {
    event.respondWith(
      fetch(request, { cache: 'reload' })
        .then(function (networkResponse) {
          // Successful network fetch: cache it and return it
          if (networkResponse && networkResponse.status === 200) {
            var responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(function (networkError) {
          // Network failed (offline): try cache
          console.log('[SW] Network fetch failed, trying cache:', request.url);
          return caches.match(request)
            .then(function (cachedResponse) {
              if (cachedResponse) {
                console.log('[SW] Found in cache:', request.url);
                return cachedResponse;
              }
              // Not in cache either, try index.html as fallback
              console.log('[SW] Not in cache, trying index.html fallback');
              return caches.match('./index.html');
            })
            .catch(function (cacheError) {
              console.error('[SW] Cache match error:', cacheError);
              // Last resort: return a simple offline page or error response
              return new Response(
                '<html><body><h1>Offline</h1><p>Unable to load. Please check your connection.</p></body></html>',
                { headers: { 'Content-Type': 'text/html' } }
              );
            });
        })
    );
    return;
  }

  // ======== NETWORK-FIRST FOR LIVE DATA ========
  if (isLiveDataRequest(request)) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(function (networkResponse) {
          if (networkResponse && networkResponse.status === 200) {
            var responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(function () {
          return caches.match(request);
        })
    );
    return;
  }

  // ======== CACHE-FIRST FOR STATIC ASSETS ========
  if (isStaticAsset(request)) {
    event.respondWith(
      caches.match(request)
        .then(function (cachedResponse) {
          if (cachedResponse) {
            // Return cached, but refresh in background if online
            if (request.url.indexOf('/dynamic/') === -1) {
              fetch(request).then(function (networkResponse) {
                if (networkResponse && networkResponse.status === 200) {
                  var responseToCache = networkResponse.clone();
                  caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(request, responseToCache);
                  });
                }
              }).catch(function () {
                // Network error, but we already have cached version
              });
            }
            return cachedResponse;
          }
          // Not cached, fetch from network and cache if successful
          return fetch(request)
            .then(function (networkResponse) {
              if (networkResponse && networkResponse.status === 200) {
                var responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(function (cache) {
                  cache.put(request, responseToCache);
                });
              }
              return networkResponse;
            })
            .catch(function (err) {
              console.error('[SW] Fetch failed for static asset:', request.url, err);
              // Could return a placeholder image or empty response here
              return new Response('', { status: 404 });
            });
        })
    );
    return;
  }

  // ======== DEFAULT: NETWORK-FIRST FOR OTHER REQUESTS ========
  // (e.g., API calls, data files, etc.)
  event.respondWith(
    fetch(request)
      .then(function (networkResponse) {
        if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 304)) {
          var responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(function () {
        return caches.match(request)
          .catch(function () {
            return new Response('Offline', { status: 503 });
          });
      })
  );
});
