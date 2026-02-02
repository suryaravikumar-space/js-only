/**
 * PERFORMANCE: 00 - Performance Overview
 *
 * ONE CONCEPT: Why web performance matters and how to measure it
 */


// =============================================================================
// WHY PERFORMANCE MATTERS
// =============================================================================

console.log('=== Why Performance Matters ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  PERFORMANCE IMPACT ON BUSINESS                                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Amazon:   100ms latency = 1% sales drop                           │
 *   │  Google:   500ms slower = 20% fewer searches                        │
 *   │  Walmart:  1s faster = 2% conversion increase                       │
 *   │  Pinterest: 40% less wait = 15% more signups                        │
 *   │                                                                      │
 *   │  53% of mobile users leave if page takes > 3 seconds               │
 *   │  Every 100ms of latency costs ~1% of revenue                        │
 *   │                                                                      │
 *   │  Performance is:                                                     │
 *   │  • User experience (perceived speed)                                │
 *   │  • SEO ranking factor (Google)                                      │
 *   │  • Conversion rate driver                                           │
 *   │  • Accessibility (low-end devices, slow networks)                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('100ms latency = ~1% revenue loss');
console.log('53% users leave if load > 3 seconds');
console.log('Performance = UX + SEO + conversions + accessibility');


// =============================================================================
// PERFORMANCE METRICS LANDSCAPE
// =============================================================================

console.log('\n=== Key Metrics ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WEB PERFORMANCE METRICS                                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  LOADING:                                                           │
 *   │  ┌────┐  ┌────┐  ┌────┐  ┌────┐                                   │
 *   │  │TTFB│→ │FCP │→ │LCP │→ │Load│                                   │
 *   │  └────┘  └────┘  └────┘  └────┘                                   │
 *   │   │       │       │       │                                         │
 *   │   │       │       │       └─ All resources loaded                   │
 *   │   │       │       └─ Largest element painted                        │
 *   │   │       └─ First content visible                                  │
 *   │   └─ First byte from server                                         │
 *   │                                                                      │
 *   │  INTERACTIVITY:                                                     │
 *   │  INP (Interaction to Next Paint)                                    │
 *   │  └─ How fast the page responds to user input                       │
 *   │                                                                      │
 *   │  VISUAL STABILITY:                                                  │
 *   │  CLS (Cumulative Layout Shift)                                      │
 *   │  └─ How much the page layout jumps around                          │
 *   │                                                                      │
 *   │  CORE WEB VITALS (Google's top 3):                                  │
 *   │  ★ LCP  — Loading        (< 2.5s)                                  │
 *   │  ★ INP  — Interactivity  (< 200ms)                                 │
 *   │  ★ CLS  — Stability      (< 0.1)                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const metrics = [
  { metric: 'TTFB', fullName: 'Time to First Byte', measures: 'Server response time' },
  { metric: 'FCP',  fullName: 'First Contentful Paint', measures: 'First content visible' },
  { metric: 'LCP',  fullName: 'Largest Contentful Paint', measures: 'Main content loaded (Core Web Vital)' },
  { metric: 'INP',  fullName: 'Interaction to Next Paint', measures: 'Input responsiveness (Core Web Vital)' },
  { metric: 'CLS',  fullName: 'Cumulative Layout Shift', measures: 'Visual stability (Core Web Vital)' },
  { metric: 'TBT',  fullName: 'Total Blocking Time', measures: 'Main thread blocked time' },
];

metrics.forEach(({ metric, fullName, measures }) => {
  console.log(`  ${metric.padEnd(5)} — ${fullName.padEnd(30)} → ${measures}`);
});


// =============================================================================
// MEASUREMENT TOOLS
// =============================================================================

console.log('\n=== How to Measure ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MEASUREMENT TOOLS                                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  LAB DATA (synthetic, controlled):                                  │
 *   │  • Chrome DevTools → Performance tab                               │
 *   │  • Lighthouse (Chrome built-in)                                     │
 *   │  • WebPageTest.org                                                  │
 *   │  • Chrome DevTools → Network tab (throttling)                      │
 *   │                                                                      │
 *   │  FIELD DATA (real users):                                           │
 *   │  • Chrome User Experience Report (CrUX)                            │
 *   │  • PageSpeed Insights (shows both lab + field)                     │
 *   │  • web-vitals library (npm)                                        │
 *   │  • Performance API (browser-native)                                │
 *   │                                                                      │
 *   │  WHY BOTH?                                                          │
 *   │  Lab: reproducible, debug-friendly                                  │
 *   │  Field: real conditions (slow devices, bad networks)               │
 *   │  Lab might say "fast" but real users on 3G say "slow"              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Lab tools: Lighthouse, DevTools, WebPageTest');
console.log('Field tools: CrUX, PageSpeed Insights, web-vitals npm');
console.log('Always check BOTH — lab and field data');


// =============================================================================
// PERFORMANCE OPTIMIZATION CATEGORIES
// =============================================================================

console.log('\n=== Optimization Categories ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  PERFORMANCE OPTIMIZATION AREAS                                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. NETWORK                                                         │
 *   │     Reduce bytes: minify, compress, tree-shake                     │
 *   │     Reduce requests: bundle, sprite, inline critical               │
 *   │     Reduce latency: CDN, preconnect, HTTP/2                        │
 *   │                                                                      │
 *   │  2. RENDERING                                                       │
 *   │     Critical rendering path optimization                            │
 *   │     Avoid layout thrashing                                          │
 *   │     Use CSS containment, will-change                               │
 *   │                                                                      │
 *   │  3. JAVASCRIPT                                                      │
 *   │     Code splitting + lazy loading                                   │
 *   │     Web Workers for heavy computation                               │
 *   │     Avoid long tasks (> 50ms)                                      │
 *   │                                                                      │
 *   │  4. ASSETS                                                          │
 *   │     Image optimization (WebP, AVIF, lazy load)                     │
 *   │     Font optimization (font-display, subset)                       │
 *   │     Video optimization (poster, lazy)                              │
 *   │                                                                      │
 *   │  5. CACHING                                                         │
 *   │     Browser cache (Cache-Control headers)                           │
 *   │     Service Worker cache                                            │
 *   │     CDN edge caching                                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Network → reduce bytes, requests, latency');
console.log('Rendering → critical path, avoid layout thrashing');
console.log('JavaScript → split, lazy load, avoid long tasks');
console.log('Assets → optimize images, fonts, video');
console.log('Caching → browser, service worker, CDN');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Web performance directly impacts business metrics — every 100ms of
 * latency costs roughly 1% of revenue. Google uses Core Web Vitals as
 * ranking signals: LCP for loading speed (under 2.5s), INP for
 * interactivity (under 200ms), and CLS for visual stability (under 0.1).
 *
 * I approach optimization in categories: network (minify, compress, CDN),
 * rendering (critical path, avoid reflows), JavaScript (code splitting,
 * lazy loading, avoiding long tasks), assets (modern image formats,
 * font-display), and caching (Cache-Control, service workers).
 *
 * I measure with both lab tools (Lighthouse, DevTools) and field data
 * (CrUX, web-vitals library) because lab data alone misses real-world
 * conditions like slow devices and poor networks."
 */


// RUN: node docs/30-performance/00-performance-overview.js
