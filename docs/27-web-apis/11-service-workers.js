/**
 * WEB APIS: 11 - Service Workers
 *
 * ONE CONCEPT: Proxy between browser and network for offline support
 */


// =============================================================================
// WHAT ARE SERVICE WORKERS?
// =============================================================================

/**
 * Service Worker = A script that runs in the background, intercepts network
 *                  requests, and enables offline functionality.
 *
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  HOW SERVICE WORKERS WORK                                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  WITHOUT Service Worker:                                             │
 *   │                                                                      │
 *   │  Browser ───────────────────────────────────────────────► Server     │
 *   │          ◄───────────────────────────────────────────────            │
 *   │          (No network = FAIL)                                         │
 *   │                                                                      │
 *   │                                                                      │
 *   │  WITH Service Worker:                                                │
 *   │                                                                      │
 *   │  Browser ──► Service Worker ──► Cache (if available)                 │
 *   │                    │                                                 │
 *   │                    └──► Network (if cache miss)                      │
 *   │                    │                                                 │
 *   │                    └──► Store response in cache                      │
 *   │          ◄──────────────────────────────────────────                 │
 *   │          (Works offline!)                                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 *
 *   KEY FEATURES:
 *   • Intercepts ALL network requests
 *   • Runs even when page is closed (for push notifications)
 *   • Has own lifecycle (install, activate, fetch)
 *   • HTTPS required (security)
 *
 */


// =============================================================================
// SERVICE WORKER LIFECYCLE
// =============================================================================

console.log('=== Service Worker Lifecycle ===\n');

/**
 *
 *   ┌───────────────────────────────────────────────────────────────────────┐
 *   │  LIFECYCLE EVENTS                                                     │
 *   ├───────────────────────────────────────────────────────────────────────┤
 *   │                                                                       │
 *   │   REGISTER                                                            │
 *   │      │                                                                │
 *   │      ▼                                                                │
 *   │   INSTALL  ────► Pre-cache static assets                              │
 *   │      │           (HTML, CSS, JS, images)                              │
 *   │      ▼                                                                │
 *   │   WAITING  ────► If old SW is still active                            │
 *   │      │                                                                │
 *   │      ▼                                                                │
 *   │   ACTIVATE ────► Clean up old caches                                  │
 *   │      │                                                                │
 *   │      ▼                                                                │
 *   │   RUNNING  ────► Intercept fetch requests                             │
 *   │                                                                       │
 *   └───────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('1. INSTALL - Pre-cache assets');
console.log('2. ACTIVATE - Clean old caches');
console.log('3. FETCH - Intercept requests, serve from cache');


// =============================================================================
// BASIC IMPLEMENTATION
// =============================================================================

console.log('\n=== Basic Implementation ===\n');

const implementation = `
// ═══════════════════════════════════════════════════════════════════════
// REGISTERING (main.js)
// ═══════════════════════════════════════════════════════════════════════

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration.scope);
    } catch (error) {
      console.log('SW registration failed:', error);
    }
  });
}


// ═══════════════════════════════════════════════════════════════════════
// SERVICE WORKER (sw.js)
// ═══════════════════════════════════════════════════════════════════════

const CACHE_NAME = 'my-app-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/offline.html'
];

// INSTALL - Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// ACTIVATE - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// FETCH - Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;  // Serve from cache
        }
        return fetch(event.request);  // Fallback to network
      })
      .catch(() => {
        // If both fail, show offline page
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      })
  );
});
`;

console.log(implementation);


// =============================================================================
// CACHING STRATEGIES
// =============================================================================

console.log('\n=== Caching Strategies ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  CACHING STRATEGIES                                                 │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. CACHE FIRST (Offline-first)                                     │
 *   │     Check cache → if miss, fetch network                            │
 *   │     Best for: Static assets, fonts, images                          │
 *   │                                                                     │
 *   │  2. NETWORK FIRST                                                   │
 *   │     Try network → if fail, use cache                                │
 *   │     Best for: API calls, frequently updated content                 │
 *   │                                                                     │
 *   │  3. STALE-WHILE-REVALIDATE                                          │
 *   │     Serve cache immediately → update cache from network             │
 *   │     Best for: News, social feeds                                    │
 *   │                                                                     │
 *   │  4. CACHE ONLY                                                      │
 *   │     Only serve from cache (pre-cached during install)               │
 *   │     Best for: App shell, core assets                                │
 *   │                                                                     │
 *   │  5. NETWORK ONLY                                                    │
 *   │     Always fetch from network (no caching)                          │
 *   │     Best for: Analytics, non-GET requests                           │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const strategies = `
// STALE-WHILE-REVALIDATE (best for articles, feeds)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// NETWORK FIRST (best for API calls)
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
`;

console.log(strategies);


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "What are Service Workers?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "Service Workers are scripts that run in the background, separate from
 * the web page. They act as a proxy between the browser and network,
 * intercepting all network requests.
 *
 * The main use case is offline support. When the service worker installs,
 * I cache static assets like HTML, CSS, JavaScript, and images. Then when
 * the user makes a request, the service worker can serve it from cache
 * instead of the network. If the user is offline, they still get the
 * cached content.
 *
 * There are different caching strategies. Cache-first is great for static
 * assets that rarely change. Network-first is better for API calls where
 * you want fresh data but fall back to cache if offline. Stale-while-
 * revalidate serves cached content immediately for speed, then updates
 * the cache from the network in the background.
 *
 * Service workers have a lifecycle: install, activate, and fetch. During
 * install, I pre-cache assets. During activate, I clean up old caches.
 * The fetch event lets me intercept requests and decide how to handle them.
 *
 * They're also essential for PWAs - Progressive Web Apps. They enable
 * push notifications even when the page is closed, and make apps
 * installable. They require HTTPS for security, except on localhost."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Proxy between browser and network
 * ✓ Enables offline functionality
 * ✓ Caching strategies (cache-first, network-first, stale-while-revalidate)
 * ✓ Lifecycle: install, activate, fetch
 * ✓ Required for PWAs, push notifications
 * ✓ Requires HTTPS
 *
 */


// RUN: node docs/27-web-apis/11-service-workers.js
