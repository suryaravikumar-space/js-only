/**
 * PERFORMANCE: 07 - Caching Strategies
 *
 * ONE CONCEPT: Store data closer to the user to avoid repeat downloads
 */


// =============================================================================
// CACHING LAYERS
// =============================================================================

console.log('=== Caching Layers ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CACHING LAYERS (from fastest to slowest)                           │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  User Request                                                       │
 *   │    │                                                                │
 *   │    ▼                                                                │
 *   │  ┌─────────────────┐                                                │
 *   │  │ Memory Cache    │ ← In-memory (same session, ~instant)          │
 *   │  │ (browser RAM)   │                                                │
 *   │  └────────┬────────┘                                                │
 *   │           │ miss                                                    │
 *   │           ▼                                                         │
 *   │  ┌─────────────────┐                                                │
 *   │  │ Service Worker   │ ← Programmable cache (offline support)       │
 *   │  │ Cache            │                                               │
 *   │  └────────┬────────┘                                                │
 *   │           │ miss                                                    │
 *   │           ▼                                                         │
 *   │  ┌─────────────────┐                                                │
 *   │  │ Disk Cache      │ ← HTTP cache (Cache-Control headers)         │
 *   │  │ (browser disk)  │                                                │
 *   │  └────────┬────────┘                                                │
 *   │           │ miss                                                    │
 *   │           ▼                                                         │
 *   │  ┌─────────────────┐                                                │
 *   │  │ CDN Edge        │ ← Geographically close server                │
 *   │  └────────┬────────┘                                                │
 *   │           │ miss                                                    │
 *   │           ▼                                                         │
 *   │  ┌─────────────────┐                                                │
 *   │  │ Origin Server   │ ← Your actual server                         │
 *   │  └─────────────────┘                                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Memory → Service Worker → Disk → CDN → Origin');
console.log('Each layer reduces latency and server load');


// =============================================================================
// HTTP CACHE (Cache-Control)
// =============================================================================

console.log('\n=== HTTP Cache Headers ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CACHE-CONTROL HEADER                                               │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Cache-Control: max-age=31536000, immutable                        │
 *   │  └─ Cache for 1 year, never revalidate                            │
 *   │  → For hashed files: app.a1b2c3.js, style.d4e5f6.css             │
 *   │                                                                      │
 *   │  Cache-Control: no-cache                                            │
 *   │  └─ ALWAYS revalidate with server (can still use cached copy)    │
 *   │  → For HTML pages (need freshest version)                          │
 *   │                                                                      │
 *   │  Cache-Control: no-store                                            │
 *   │  └─ NEVER cache (sensitive data)                                   │
 *   │  → For authenticated/personal data                                 │
 *   │                                                                      │
 *   │  OPTIMAL STRATEGY:                                                  │
 *   │  ┌────────────────────┬──────────────────────────────────────────┐  │
 *   │  │ Resource           │ Cache-Control                            │  │
 *   │  ├────────────────────┼──────────────────────────────────────────┤  │
 *   │  │ HTML pages          │ no-cache (always check for updates)    │  │
 *   │  │ JS/CSS (hashed)    │ max-age=31536000, immutable            │  │
 *   │  │ Images (hashed)    │ max-age=31536000, immutable            │  │
 *   │  │ API responses      │ max-age=60 or no-cache                 │  │
 *   │  │ Fonts              │ max-age=31536000, immutable            │  │
 *   │  └────────────────────┴──────────────────────────────────────────┘  │
 *   │                                                                      │
 *   │  ETag: "abc123"  — server fingerprint for revalidation             │
 *   │  If-None-Match: "abc123" → 304 Not Modified (use cache)          │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Hashed files (app.abc123.js): max-age=1yr, immutable');
console.log('HTML pages: no-cache (always revalidate)');
console.log('Sensitive data: no-store');
console.log('ETag: server fingerprint → 304 Not Modified if unchanged');


// =============================================================================
// SERVICE WORKER CACHING
// =============================================================================

console.log('\n=== Service Worker Cache Strategies ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SERVICE WORKER CACHING STRATEGIES                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. CACHE FIRST (cache → network fallback)                         │
 *   │     Best for: static assets, fonts, images                         │
 *   │     Fast! Only hits network on cache miss                          │
 *   │                                                                      │
 *   │  2. NETWORK FIRST (network → cache fallback)                       │
 *   │     Best for: API calls, frequently updated content                │
 *   │     Always fresh, cache for offline                                │
 *   │                                                                      │
 *   │  3. STALE-WHILE-REVALIDATE                                         │
 *   │     Serve from cache immediately + fetch update in background      │
 *   │     Best for: content that can be slightly stale                   │
 *   │     Fast AND eventually fresh                                       │
 *   │                                                                      │
 *   │  4. CACHE ONLY                                                      │
 *   │     Only serve from cache (pre-cached during install)              │
 *   │     Best for: app shell, offline-first                             │
 *   │                                                                      │
 *   │  5. NETWORK ONLY                                                    │
 *   │     Never cache (sensitive/real-time data)                         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const strategies = [
  { name: 'Cache First',              use: 'Static assets, fonts, images' },
  { name: 'Network First',            use: 'API data, fresh content' },
  { name: 'Stale-While-Revalidate',   use: 'Semi-fresh content (blog, lists)' },
  { name: 'Cache Only',               use: 'App shell, offline core' },
  { name: 'Network Only',             use: 'Sensitive/real-time data' },
];
strategies.forEach(({ name, use }) => {
  console.log(`  ${name.padEnd(28)} → ${use}`);
});


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "I use a layered caching strategy. For static assets like JS, CSS, and
 * images with content hashes, I set Cache-Control: max-age=31536000,
 * immutable — they're cached for a year and never revalidated because
 * the hash changes when the content changes. HTML pages get no-cache so
 * the browser always checks for the latest version which points to the
 * new hashed assets.
 *
 * For offline support and more control, I use Service Workers with
 * strategy patterns: cache-first for static assets (instant), network-first
 * for API data (always fresh, cached for offline), and stale-while-
 * revalidate for content that can be slightly stale — it serves from
 * cache immediately while fetching an update in the background.
 *
 * On the infrastructure side, I use a CDN to serve assets from edge
 * locations close to users, which dramatically reduces latency. The
 * combination of CDN + content hashing + immutable caching means
 * returning users almost never re-download static assets."
 */


// RUN: node docs/30-performance/07-caching-strategies.js
