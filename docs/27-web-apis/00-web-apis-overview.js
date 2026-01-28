/**
 * WEB APIS: 00 - Overview
 *
 * ONE CONCEPT: Browser APIs that extend JavaScript capabilities
 */


// =============================================================================
// WHAT ARE WEB APIS?
// =============================================================================

/**
 * Web APIs = Interfaces provided by the BROWSER (not JavaScript itself)
 *            that let you interact with the browser and system features.
 *
 * JavaScript (the language) + Web APIs (browser features) = Web Development
 *
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │                         YOUR WEB APP                                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │                      JavaScript Code                                 │
 *   │                           │                                          │
 *   │                           ▼                                          │
 *   │   ┌──────────────────────────────────────────────────────────────┐   │
 *   │   │                     WEB APIs                                 │   │
 *   │   │                                                              │   │
 *   │   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │   │
 *   │   │  │  DOM    │ │ Fetch   │ │ Storage │ │ Workers │            │   │
 *   │   │  │  API    │ │ API     │ │ APIs    │ │ API     │            │   │
 *   │   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘            │   │
 *   │   │                                                              │   │
 *   │   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │   │
 *   │   │  │WebSocket│ │ Geo-    │ │ History │ │Notific- │            │   │
 *   │   │  │  API    │ │ location│ │ API     │ │ ation   │            │   │
 *   │   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘            │   │
 *   │   │                                                              │   │
 *   │   └──────────────────────────────────────────────────────────────┘   │
 *   │                           │                                          │
 *   │                           ▼                                          │
 *   │   ┌──────────────────────────────────────────────────────────────┐   │
 *   │   │                     BROWSER                                  │   │
 *   │   │                                                              │   │
 *   │   │    Network    │   Storage   │   Hardware   │   System       │   │
 *   │   │                                                              │   │
 *   │   └──────────────────────────────────────────────────────────────┘   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// CATEGORIES OF WEB APIS
// =============================================================================

console.log('=== Web APIs Categories ===\n');

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  NETWORK & DATA                                                         │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  Fetch API         - HTTP requests (GET, POST, PUT, DELETE)             │
 *   │  XMLHttpRequest    - Legacy HTTP requests (avoid in new code)           │
 *   │  WebSocket         - Real-time bidirectional communication              │
 *   │  Server-Sent Events- One-way server → client streaming                  │
 *   │  Beacon API        - Send data on page unload (analytics)               │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  STORAGE                                                                │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  localStorage      - Persistent key-value storage (~5MB)                │
 *   │  sessionStorage    - Tab-specific key-value storage (~5MB)              │
 *   │  Cookies           - Small data sent with every request (~4KB)          │
 *   │  IndexedDB         - Client-side database (large data, offline)         │
 *   │  Cache API         - Store HTTP responses (Service Workers)             │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  BACKGROUND & PERFORMANCE                                               │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  Web Workers       - Run JS in background thread                        │
 *   │  Service Workers   - Offline support, push notifications                │
 *   │  requestAnimationFrame - Smooth animations (60fps)                      │
 *   │  requestIdleCallback   - Run code when browser is idle                  │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  BROWSER & NAVIGATION                                                   │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  History API       - Browser history, SPA routing                       │
 *   │  Location API      - URL manipulation                                   │
 *   │  Navigation API    - Modern navigation handling                         │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  DEVICE & HARDWARE                                                      │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  Geolocation       - User's location                                    │
 *   │  Media Devices     - Camera, microphone                                 │
 *   │  Battery Status    - Device battery info                                │
 *   │  Vibration         - Device vibration                                   │
 *   │  Bluetooth/USB     - Hardware communication                             │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  UI & INTERACTION                                                       │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  Notification API  - System notifications                               │
 *   │  Clipboard API     - Copy/paste                                         │
 *   │  Drag and Drop     - Drag interactions                                  │
 *   │  Fullscreen API    - Fullscreen mode                                    │
 *   │  Web Share         - Native share dialog                                │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  OBSERVERS (React to changes)                                           │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  IntersectionObserver - Element visibility (lazy loading)               │
 *   │  MutationObserver     - DOM changes                                     │
 *   │  ResizeObserver       - Element size changes                            │
 *   │  PerformanceObserver  - Performance metrics                             │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 */

const categories = [
  { name: 'Network', apis: ['Fetch', 'WebSocket', 'SSE', 'Beacon'] },
  { name: 'Storage', apis: ['localStorage', 'sessionStorage', 'Cookies', 'IndexedDB'] },
  { name: 'Background', apis: ['Web Workers', 'Service Workers'] },
  { name: 'Navigation', apis: ['History API', 'Location'] },
  { name: 'Device', apis: ['Geolocation', 'Camera', 'Notifications'] },
  { name: 'Observers', apis: ['Intersection', 'Mutation', 'Resize'] }
];

categories.forEach(cat => {
  console.log(`${cat.name}: ${cat.apis.join(', ')}`);
});


// =============================================================================
// REAL-WORLD USE CASES
// =============================================================================

console.log('\n=== Real-World Use Cases ===\n');

/**
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  E-COMMERCE WEBSITE                                                     │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  Fetch API         → Load products, submit orders                       │
 *   │  localStorage      → Shopping cart persistence                          │
 *   │  Cookies           → User authentication, tracking                      │
 *   │  IntersectionObserver → Lazy load product images                        │
 *   │  Service Worker    → Offline product catalog                            │
 *   │  History API       → Product page navigation without reload             │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  CHAT APPLICATION                                                       │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  WebSocket         → Real-time messages                                 │
 *   │  IndexedDB         → Message history (offline access)                   │
 *   │  Notification API  → New message alerts                                 │
 *   │  Service Worker    → Background sync, offline support                   │
 *   │  Web Workers       → Encrypt/decrypt messages                           │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  DASHBOARD / ANALYTICS                                                  │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  Fetch API         → Load data from APIs                                │
 *   │  Web Workers       → Process large datasets                             │
 *   │  sessionStorage    → Store filter preferences (tab-specific)            │
 *   │  ResizeObserver    → Responsive chart resizing                          │
 *   │  Beacon API        → Send analytics on page close                       │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  FOOD DELIVERY APP                                                      │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │  Geolocation       → User location for delivery                         │
 *   │  WebSocket         → Real-time order tracking                           │
 *   │  Notification API  → Order status updates                               │
 *   │  localStorage      → Saved addresses, preferences                       │
 *   │  Cookies           → Authentication token                               │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 */

const useCases = [
  { app: 'E-commerce', primary: 'Fetch, localStorage, Cookies, IntersectionObserver' },
  { app: 'Chat App', primary: 'WebSocket, IndexedDB, Notifications, Service Worker' },
  { app: 'Dashboard', primary: 'Fetch, Web Workers, sessionStorage, ResizeObserver' },
  { app: 'Delivery App', primary: 'Geolocation, WebSocket, Notifications, Cookies' }
];

useCases.forEach(uc => {
  console.log(`${uc.app}:`);
  console.log(`  ${uc.primary}\n`);
});


// =============================================================================
// TOPICS IN THIS MODULE
// =============================================================================

console.log('=== Topics Covered ===\n');

const topics = [
  '01-03: Fetch API (basics, advanced, real-world patterns)',
  '04: localStorage (persistent storage)',
  '05: sessionStorage (tab-specific storage)',
  '06-07: Cookies (basics, security)',
  '08: Storage Comparison (when to use what)',
  '09: IndexedDB (client-side database)',
  '10: Web Workers (background threads)',
  '11: Service Workers (offline, caching)',
  '12: WebSockets (real-time communication)',
  '13: Intersection Observer (lazy loading)',
  '14: History API (SPA routing)',
  '15: Geolocation API',
  '16: Notification API',
  '17: Interview Cheatsheet'
];

topics.forEach(t => console.log(`  ${t}`));


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "What Web APIs have you used?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "I've used many Web APIs in production applications. For network requests,
 * I use the Fetch API for REST calls and WebSockets for real-time features
 * like chat or live notifications.
 *
 * For storage, I use different options based on the need. Cookies for
 * authentication since they're sent with requests automatically. localStorage
 * for persistent user preferences. sessionStorage for tab-specific state
 * like form drafts. IndexedDB for larger offline data like cached content.
 *
 * For performance, I use Intersection Observer for lazy loading images - it's
 * much better than scroll event listeners. Web Workers for heavy computations
 * that would block the UI. Service Workers for offline support and caching.
 *
 * For navigation in SPAs, I use the History API to handle routing without
 * full page reloads. For features that need device access, I've used
 * Geolocation for location-based features and the Notification API for
 * alerts.
 *
 * The key is choosing the right API for the use case. For example, don't
 * use localStorage for sensitive data since it's accessible to any script.
 * Use Intersection Observer instead of scroll events for performance."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Fetch for HTTP, WebSocket for real-time
 * ✓ Different storage options for different needs
 * ✓ Intersection Observer for lazy loading
 * ✓ Service Workers for offline
 * ✓ History API for SPA routing
 *
 */


// RUN: node docs/27-web-apis/00-web-apis-overview.js
