/**
 * Campus Calories v2.0 - Service Worker
 * PWA offline functionality
 */

const CACHE_NAME = 'campus-calories-v2.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/admin.html',
  '/manifest.json',
  '/css/variables.css',
  '/css/base.css',
  '/css/components.css',
  '/css/dashboard.css',
  '/css/mess-plate.css',
  '/css/onboarding.css',
  '/css/admin.css',
  '/css/analytics.css',
  '/js/database.js',
  '/js/nutrition-data.js',
  '/js/mess-menu.js',
  '/js/anc-menu.js',
  '/js/app.js',
  '/js/auth.js',
  '/js/supabase-config.js',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => console.error('Cache failed:', err))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Network-first strategy for API calls (Supabase, OpenFoodFacts, AI estimator)
  if (request.url.includes('openfoodfacts.org') || 
      request.url.includes('supabase') || 
      request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(request))
    );
    return;
  }
  
  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            // Clone response for caching
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            
            // Return offline fallback for HTML requests
            if (request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/index.html');
            }
            
            throw error;
          });
      })
  );
});

// Background sync for offline entries
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-food-entries') {
    event.waitUntil(syncFoodEntries());
  }
});

async function syncFoodEntries() {
  // Sync any pending entries when back online
  console.log('Syncing food entries...');
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Campus Calories reminder',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    tag: 'campus-calories-reminder'
  };
  
  event.waitUntil(
    self.registration.showNotification('Campus Calories', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
