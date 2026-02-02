/**
 * WEB APIS: 17 - Interview Cheat Sheet
 *
 * Quick reference for all Web APIs - what to say in 30 seconds each
 */


// =============================================================================
// STORAGE COMPARISON (Most Asked!)
// =============================================================================

console.log('=== Storage Comparison (Most Asked!) ===\n');

console.log(`
┌────────────────┬──────────────────────┬───────────────────────────────────┐
│ Storage        │ When to Use          │ Key Points                        │
├────────────────┼──────────────────────┼───────────────────────────────────┤
│ Cookies        │ Authentication       │ Sent with EVERY request           │
│                │ Server needs data    │ HttpOnly for security             │
│                │                      │ ~4KB limit                        │
├────────────────┼──────────────────────┼───────────────────────────────────┤
│ localStorage   │ Preferences          │ Persistent, all tabs share        │
│                │ Cart, cache          │ ~5-10MB, JS accessible            │
│                │                      │ NOT for sensitive data!           │
├────────────────┼──────────────────────┼───────────────────────────────────┤
│ sessionStorage │ Form wizard          │ Tab-specific, clears on close     │
│                │ Temp state           │ Survives refresh                  │
├────────────────┼──────────────────────┼───────────────────────────────────┤
│ IndexedDB      │ Offline apps         │ Real database, large data         │
│                │ Large datasets       │ Complex queries, transactions     │
└────────────────┴──────────────────────┴───────────────────────────────────┘
`);


// =============================================================================
// FETCH API
// =============================================================================

console.log('=== Fetch API ===\n');

console.log(`
CRITICAL: Fetch doesn't reject on HTTP errors!
Always check response.ok

// Basic Pattern
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('HTTP ' + response.status);
  return response.json();
}

// POST with JSON
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

// With credentials (cookies)
fetch(url, { credentials: 'include' });

// Abort request
const controller = new AbortController();
fetch(url, { signal: controller.signal });
controller.abort();
`);


// =============================================================================
// COOKIES SECURITY
// =============================================================================

console.log('=== Cookies Security ===\n');

console.log(`
THE SECURITY TRINITY:
─────────────────────
HttpOnly  → Prevents XSS (JS can't read)
Secure    → HTTPS only
SameSite  → Prevents CSRF

// Secure cookie (server-side)
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax'
});
`);


// =============================================================================
// WEB WORKERS
// =============================================================================

console.log('=== Web Workers ===\n');

console.log(`
PURPOSE: Heavy computation without blocking UI

// Main thread
const worker = new Worker('worker.js');
worker.postMessage(data);
worker.onmessage = (e) => console.log(e.data);

// worker.js
self.onmessage = (e) => {
  const result = heavyCalculation(e.data);
  self.postMessage(result);
};

CAN'T ACCESS: DOM, window, parent variables
CAN USE: fetch, IndexedDB, WebSocket
`);


// =============================================================================
// SERVICE WORKERS
// =============================================================================

console.log('=== Service Workers ===\n');

console.log(`
PURPOSE: Offline support, caching, push notifications

LIFECYCLE: Install → Activate → Fetch

CACHING STRATEGIES:
• Cache First - Static assets
• Network First - API calls
• Stale-While-Revalidate - News feeds

// Register
navigator.serviceWorker.register('/sw.js');

// In sw.js
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request) || fetch(e.request)
  );
});
`);


// =============================================================================
// WEBSOCKETS
// =============================================================================

console.log('=== WebSockets ===\n');

console.log(`
PURPOSE: Real-time bidirectional communication

USE FOR: Chat, notifications, live updates, games

const socket = new WebSocket('wss://server.com');

socket.onopen = () => socket.send('Hello');
socket.onmessage = (e) => console.log(e.data);
socket.onclose = () => attemptReconnect();

// Always implement reconnection with exponential backoff!
`);


// =============================================================================
// INTERSECTION OBSERVER
// =============================================================================

console.log('=== Intersection Observer ===\n');

console.log(`
PURPOSE: Detect when elements enter/exit viewport

BETTER THAN: scroll event (async, no layout thrashing)

USE FOR: Lazy loading, infinite scroll, animations

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadImage(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { rootMargin: '50px' });

document.querySelectorAll('img[data-src]')
  .forEach(img => observer.observe(img));
`);


// =============================================================================
// HISTORY API
// =============================================================================

console.log('=== History API ===\n');

console.log(`
PURPOSE: SPA routing without page reloads

// Navigate (adds to history)
history.pushState({ page: 'about' }, '', '/about');

// Update URL without history entry (filters)
history.replaceState(null, '', '/products?sort=price');

// Handle back/forward
window.addEventListener('popstate', (e) => {
  loadPage(location.pathname);
});
`);


// =============================================================================
// QUICK REFERENCE: WHEN TO USE WHAT
// =============================================================================

console.log('=== Quick Reference ===\n');

console.log(`
NEED                          │ USE
──────────────────────────────┼────────────────────────────────
HTTP requests                 │ Fetch API
Real-time updates             │ WebSocket
Authentication storage        │ Cookies (HttpOnly)
User preferences              │ localStorage
Tab-specific data             │ sessionStorage
Large offline data            │ IndexedDB
Background computation        │ Web Workers
Offline support               │ Service Workers
Lazy loading images           │ Intersection Observer
SPA routing                   │ History API
User location                 │ Geolocation API
System notifications          │ Notification API
`);


// =============================================================================
// COMMON INTERVIEW QUESTIONS
// =============================================================================

console.log('=== Common Interview Questions ===\n');

const questions = [
  {
    q: 'Difference between localStorage and cookies?',
    a: 'Cookies sent to server, localStorage not. Cookies ~4KB, localStorage ~5MB. Cookies can be HttpOnly.'
  },
  {
    q: 'How to make Fetch handle errors properly?',
    a: 'Check response.ok - Fetch only rejects on network errors, not HTTP errors like 404 or 500.'
  },
  {
    q: 'Where to store JWT tokens?',
    a: 'HttpOnly cookies for security. NOT localStorage - vulnerable to XSS.'
  },
  {
    q: 'What are Web Workers for?',
    a: 'Heavy computation in background thread. Keeps UI responsive. Can\'t access DOM.'
  },
  {
    q: 'How to implement lazy loading?',
    a: 'Intersection Observer. Better than scroll events - async, no layout thrashing.'
  },
  {
    q: 'sessionStorage vs localStorage?',
    a: 'sessionStorage is tab-specific and clears on close. localStorage is permanent and shared.'
  },
  {
    q: 'How to implement offline support?',
    a: 'Service Workers. Cache assets during install, serve from cache in fetch event.'
  }
];

questions.forEach(({ q, a }) => {
  console.log(`Q: ${q}`);
  console.log(`A: ${a}\n`);
});


// =============================================================================
// FILES IN THIS MODULE
// =============================================================================

console.log('=== Files Reference ===\n');

const files = [
  '00-web-apis-overview.js      - Overview of all Web APIs',
  '01-fetch-api-basics.js       - Basic fetch usage',
  '02-fetch-advanced.js         - Headers, methods, options',
  '03-fetch-real-world.js       - Production patterns',
  '04-localstorage.js           - Persistent storage',
  '05-sessionstorage.js         - Tab-specific storage',
  '06-cookies-basics.js         - Cookie fundamentals',
  '07-cookies-security.js       - HttpOnly, Secure, SameSite',
  '08-storage-comparison.js     - When to use what',
  '09-indexeddb.js              - Client-side database',
  '10-web-workers.js            - Background threads',
  '11-service-workers.js        - Offline & caching',
  '12-websockets.js             - Real-time communication',
  '13-intersection-observer.js  - Viewport detection',
  '14-history-api.js            - SPA routing',
  '15-geolocation-api.js        - User location',
  '16-notification-api.js       - System notifications',
  '17-interview-cheatsheet.js   - This file!'
];

files.forEach(f => console.log('  ' + f));


// RUN: node docs/27-web-apis/17-interview-cheatsheet.js
