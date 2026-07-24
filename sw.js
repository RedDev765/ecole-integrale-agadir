const CACHE = 'ecole-integrale-v2';
const urls = [
  '/', '/about', '/programs', '/team',
  '/blog', '/parents', '/contact',
  '/css/style.css', '/js/main.js', '/js/chatbot.js',
  '/images/logo.jpg', '/images/campus.jpg',
  '/admin/index.html', '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(urls)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
