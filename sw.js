// Offline shell cache. App files are served from cache first and refreshed in the background; api.php is always network.
const VER = 'kl-v17e';
const SHELL = ['./', 'index.html', 'app.css?v=86', 'app.js?v=86', 'manifest.json', 'icon-192.png?v=2', 'icon-512.png?v=2', 'apple-touch-icon.png?v=2', 'favicon.svg?v=2', 'favicon-32.png?v=2', 'icon-maskable-192.png?v=2',
  'fonts/sora-latin-600-normal.woff2', 'fonts/sora-latin-700-normal.woff2', 'fonts/manrope-latin-500-normal.woff2', 'fonts/manrope-latin-600-normal.woff2', 'fonts/manrope-latin-700-normal.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VER).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.endsWith('api.php') || url.searchParams.has('fresh')) return;
  const isPage = e.request.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname);
  if (isPage) {   // v17.3: the page itself is network-first, so a new deploy (and its splash and icon links) is seen on the next open; cache only when offline
    e.respondWith(fetch(e.request).then(r => { if (r.ok) caches.open(VER).then(c => c.put(e.request, r.clone())); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: false }).then(hit => {
    const net = fetch(e.request).then(r => { if (r.ok) caches.open(VER).then(c => c.put(e.request, r.clone())); return r; }).catch(() => hit);
    return hit || net;
  }));
});
