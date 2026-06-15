/*
 * K2 Games cleanup-only service worker.
 *
 * This worker exists only to remove stale caches once, unregister itself,
 * and then get out of the way. It does not precache or serve app assets.
 */

var RESET_VERSION = '2026-06-cleanup-only-1';

function notifyClients(message) {
  return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage(message);
    });
  });
}

self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    var cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(function (cacheName) {
      return caches.delete(cacheName);
    }));

    await self.clients.claim();

    await notifyClients({
      type: 'SW_CLEANUP_READY',
      resetVersion: RESET_VERSION
    });

    var allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    allClients.forEach(function (client) {
      client.postMessage({
        type: 'SW_CLEANUP_RELOAD',
        resetVersion: RESET_VERSION
      });
    });

    var registrations = await self.registration.unregister();
    return registrations;
  })());
});

// Intentionally no fetch handler: this worker never serves app assets.
