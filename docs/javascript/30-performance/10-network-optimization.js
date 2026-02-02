/**
 * PERFORMANCE: 10 - Network Optimization
 *
 * ONE CONCEPT: Reduce bytes, requests, and latency over the network
 */


// =============================================================================
// COMPRESSION
// =============================================================================

console.log('=== Network Optimization ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  COMPRESSION: Reduce bytes over the wire                           │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  ┌──────────┬────────────┬──────────────────────────┐              │
 *   │  │ Method   │ Reduction  │ Notes                    │              │
 *   │  ├──────────┼────────────┼──────────────────────────┤              │
 *   │  │ Gzip     │ 60-80%     │ Universal support        │              │
 *   │  │ Brotli   │ 15-25%     │ Better than gzip, modern │              │
 *   │  │          │ better     │ browsers, HTTPS only     │              │
 *   │  └──────────┴────────────┴──────────────────────────┘              │
 *   │                                                                      │
 *   │  Example: 500KB JS → 120KB gzip → 95KB Brotli                     │
 *   │                                                                      │
 *   │  Minification: Remove whitespace, shorten names                    │
 *   │  500KB source → 200KB minified → 50KB gzip                        │
 *   │                                                                      │
 *   │  Minify + Compress = massive savings                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Brotli > Gzip (15-25% smaller)');
console.log('Minify + Compress: 500KB → 200KB → 50KB');


// =============================================================================
// HTTP/2 & HTTP/3
// =============================================================================

console.log('\n=== HTTP/2 and HTTP/3 ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  HTTP/2 vs HTTP/1.1                                                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  HTTP/1.1:                                                          │
 *   │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                        │
 *   │  │req1│→│res1│→│req2│→│res2│→│req3│→│res3│  Sequential!           │
 *   │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                        │
 *   │  6 connections max per domain (workaround: domain sharding)       │
 *   │                                                                      │
 *   │  HTTP/2:                                                            │
 *   │  ┌────┐ ┌────┐ ┌────┐                                              │
 *   │  │req1│ │req2│ │req3│   Multiplexed! (one connection)             │
 *   │  └────┘ └────┘ └────┘                                              │
 *   │  ┌────┐ ┌────┐ ┌────┐                                              │
 *   │  │res1│ │res2│ │res3│   All parallel on same connection           │
 *   │  └────┘ └────┘ └────┘                                              │
 *   │                                                                      │
 *   │  HTTP/2 also:                                                       │
 *   │  • Header compression (HPACK)                                       │
 *   │  • Server push (server sends resources before requested)           │
 *   │  • Stream prioritization                                            │
 *   │                                                                      │
 *   │  HTTP/3 (QUIC):                                                     │
 *   │  • UDP instead of TCP (faster handshake)                           │
 *   │  • No head-of-line blocking                                        │
 *   │  • Better on unreliable networks (mobile)                          │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('HTTP/1.1: sequential, 6 connections max per domain');
console.log('HTTP/2: multiplexed, single connection, parallel');
console.log('HTTP/3: QUIC/UDP, even faster handshake');


// =============================================================================
// CDN
// =============================================================================

console.log('\n=== CDN ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CDN: Serve from geographically close edge servers                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Without CDN:                                                       │
 *   │  User (India) → Origin (US) = 200ms latency                       │
 *   │                                                                      │
 *   │  With CDN:                                                          │
 *   │  User (India) → Edge (Mumbai) = 20ms latency                      │
 *   │                                                                      │
 *   │  CDN serves:                                                        │
 *   │  • Static assets (JS, CSS, images, fonts)                          │
 *   │  • Cached API responses                                             │
 *   │  • HTML pages (SSG/ISR)                                            │
 *   │                                                                      │
 *   │  Popular CDNs: Cloudflare, Vercel Edge, AWS CloudFront            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('CDN: 200ms → 20ms by serving from nearest edge');
console.log('Best for: static assets, cached HTML, API responses');


// =============================================================================
// BUNDLE SIZE REDUCTION
// =============================================================================

console.log('\n=== Reducing Bundle Size ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BUNDLE SIZE CHECKLIST                                               │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. Tree shaking (remove unused exports)                           │
 *   │  2. Code splitting (load routes on demand)                         │
 *   │  3. Dynamic import() for heavy libraries                           │
 *   │  4. Replace heavy deps:                                            │
 *   │     moment.js (300KB) → date-fns (tree-shakeable)                 │
 *   │     lodash (71KB) → lodash-es (tree-shakeable)                    │
 *   │  5. Analyze with BundleAnalyzerPlugin or source-map-explorer      │
 *   │  6. External large deps via CDN (externals config)                │
 *   │  7. Use lighter alternatives:                                      │
 *   │     axios → fetch (native)                                         │
 *   │     classnames → clsx (smaller)                                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Analyze: BundleAnalyzerPlugin shows what takes space');
console.log('Replace: moment→date-fns, lodash→lodash-es');
console.log('Split: dynamic import() for heavy features');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "I optimize network performance at multiple levels. First, I minify
 * all assets and enable Brotli compression on the server — this alone
 * reduces a 500KB bundle to about 50KB over the wire.
 *
 * I serve static assets through a CDN for low-latency delivery. With
 * HTTP/2, multiple requests are multiplexed over a single connection,
 * so I don't need to bundle everything into one file — I can split
 * freely without request overhead.
 *
 * For bundle size, I use tree shaking, code splitting, and analyze
 * with BundleAnalyzerPlugin to find bloated dependencies. Common wins:
 * replacing moment.js with date-fns, using lodash-es instead of lodash,
 * and dynamically importing heavy features like chart libraries.
 *
 * Resource hints like preconnect for third-party origins and preload
 * for critical assets eliminate connection setup delays."
 */


// RUN: node docs/30-performance/10-network-optimization.js
