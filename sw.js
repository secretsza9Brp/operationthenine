// Service worker: เปิดแอปได้แม้ออฟไลน์ (แคชหน้าแอป) — ไม่แคชข้อมูล /api และคำขอข้ามโดเมน (Google Apps Script)
const CACHE = 'thenine-shell-v2';
const BASE = self.registration.scope; // ใช้ได้ทั้งโดเมนหลักและโฟลเดอร์ย่อย (เช่น GitHub Pages)
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll([BASE, BASE + 'manifest.webmanifest', BASE + 'icons/icon-192.png'])).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.includes('/api/') || u.pathname.endsWith('/config.js')) return;
  const key = r.mode === 'navigate' ? BASE : r;
  e.respondWith(fetch(r).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(key, copy)); } return res; }).catch(() => caches.match(key)));
});
