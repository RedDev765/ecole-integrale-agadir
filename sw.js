// Cache désactivé sur le site.
// Ce service worker ne sert qu'à nettoyer : il supprime tous les anciens
// caches (ex. ecole-integrale-v5) puis se désinstalle lui-même.
// Pas de listener 'fetch' => aucune mise en cache.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});
