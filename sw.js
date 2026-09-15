const CACHE = 'ecole-integrale-v5';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hors connexion</title>
  <style>
    body{font-family:system-ui,sans-serif;background:#0A1628;color:#fff;display:flex;min-height:100vh;margin:0;align-items:center;justify-content:center;text-align:center;padding:24px}
    h1{color:#C9A84C;font-size:2rem;margin-bottom:8px}
    p{opacity:.8;max-width:420px;line-height:1.6}
    a{color:#C9A84C}
  </style>
</head>
<body>
  <div>
    <h1>📡 Hors connexion</h1>
    <p>Cette page n'a pas pu être chargée et n'est pas encore en cache. Vérifiez votre connexion puis <a href="/">réessayez</a>.</p>
  </div>
</body>
</html>`;

self.addEventListener('fetch', (e) => {
  const isNavigation = e.request.mode === 'navigate';
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(r =>
        r || (isNavigation
          ? new Response(OFFLINE_HTML, { status: 503, statusText: 'Service Unavailable', headers: { 'Content-Type': 'text/html; charset=utf-8' } })
          : new Response('', { status: 404, statusText: 'Not Found' }))
      ))
  );
});
