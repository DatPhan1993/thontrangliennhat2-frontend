// Simple service worker for caching
const CACHE_NAME = 'thontrangliennhat-v1';
const urlsToCache = [
    '/',
    '/static/css/',
    '/static/js/',
    '/thontrangliennhat-logo.png',
    '/favicon.ico'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            }
        )
    );
});