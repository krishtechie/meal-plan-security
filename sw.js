// Offline shell cache. App files are served from cache first and refreshed in the background; api.php is always network.
const VER = 'kl-v14a';
const SHELL = ['./', 'index.html', 'app.css?v=35', 'app.js?v=35', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png',
  'fonts/sora-latin-600-normal.woff2', 'fonts/sora-latin-700-normal.woff2', 'fonts/manrope-latin-500-normal.woff2', 'fonts/manrope-latin-600-normal.woff2', 'fonts/manrope-latin-700-normal.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VER).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.endsWith('api.php')) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: false }).then(hit => {
    const net = fetch(e.request).then(r => { if (r.ok) caches.open(VER).then(c => c.put(e.request, r.clone())); return r; }).catch(() => hit);
    return hit || net;
  }));
});
