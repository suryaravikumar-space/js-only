/**
 * PERFORMANCE: 12 - Performance API
 *
 * ONE CONCEPT: Browser-native APIs for measuring performance
 */


// =============================================================================
// PERFORMANCE API OVERVIEW
// =============================================================================

console.log('=== Performance API ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BROWSER PERFORMANCE APIs                                           │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  performance.now()          — High-resolution timestamp            │
 *   │  performance.mark()         — Create named timestamp               │
 *   │  performance.measure()      — Measure between marks               │
 *   │  performance.getEntries()   — All performance entries             │
 *   │  PerformanceObserver        — Watch for performance events         │
 *   │  navigation timing          — Page load metrics                    │
 *   │  resource timing            — Individual resource metrics          │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// MEASURING CODE PERFORMANCE
// =============================================================================

console.log('=== Measuring Code Performance ===\n');

// performance.now() — high-resolution timing
const { performance: perf } = require('perf_hooks');

const start = perf.now();
// Simulate work
let result = 0;
for (let i = 0; i < 1000000; i++) { result += i; }
const end = perf.now();
console.log(`Loop took: ${(end - start).toFixed(2)}ms`);

// performance.mark() + measure()
perf.mark('sort-start');
const arr = Array.from({ length: 10000 }, () => Math.random());
arr.sort();
perf.mark('sort-end');
perf.measure('sort-duration', 'sort-start', 'sort-end');

const [measure] = perf.getEntriesByName('sort-duration');
console.log(`Sort took: ${measure.duration.toFixed(2)}ms`);


// =============================================================================
// BROWSER PERFORMANCE APIS
// =============================================================================

console.log('\n=== Browser-Specific APIs ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  NAVIGATION TIMING (page load metrics)                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  const nav = performance.getEntriesByType('navigation')[0];       │
 *   │                                                                      │
 *   │  nav.domContentLoadedEventEnd - nav.startTime  → DOMContentLoaded │
 *   │  nav.loadEventEnd - nav.startTime              → Full page load   │
 *   │  nav.responseStart - nav.requestStart          → TTFB             │
 *   │  nav.domInteractive - nav.startTime            → DOM interactive  │
 *   │                                                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │  RESOURCE TIMING (individual resources)                             │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  const resources = performance.getEntriesByType('resource');       │
 *   │  resources.forEach(r => {                                           │
 *   │    console.log(r.name, r.duration, r.transferSize);               │
 *   │  });                                                                │
 *   │  → Shows every JS, CSS, image, font with timing + size            │
 *   │                                                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │  PERFORMANCE OBSERVER (real-time monitoring)                        │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  const observer = new PerformanceObserver((list) => {              │
 *   │    for (const entry of list.getEntries()) {                        │
 *   │      if (entry.duration > 50) {                                    │
 *   │        console.log('Long task!', entry.duration);                 │
 *   │      }                                                              │
 *   │    }                                                                │
 *   │  });                                                                │
 *   │  observer.observe({ type: 'longtask', buffered: true });          │
 *   │                                                                      │
 *   │  Entry types: 'paint', 'longtask', 'resource',                    │
 *   │    'largest-contentful-paint', 'layout-shift', 'first-input'      │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Navigation Timing: page load metrics (TTFB, DOMContentLoaded)');
console.log('Resource Timing: per-resource metrics (duration, transferSize)');
console.log('PerformanceObserver: real-time monitoring (long tasks, LCP)');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "The Performance API gives browser-native tools for measuring. I use
 * performance.mark() and performance.measure() to benchmark specific
 * code sections — it's more accurate than Date.now() because it uses
 * high-resolution timestamps.
 *
 * Navigation Timing tells me exactly how long each phase of page load
 * took: TTFB, DOM parsing, DOMContentLoaded, full load. Resource Timing
 * gives me the same detail for every individual resource — JS bundles,
 * CSS files, images, fonts — including transfer size and duration.
 *
 * PerformanceObserver lets me monitor in real-time. I observe 'longtask'
 * entries to detect when JavaScript blocks the main thread for over 50ms,
 * 'largest-contentful-paint' for LCP, and 'layout-shift' for CLS. I
 * combine this with the web-vitals library to send Core Web Vitals data
 * to our analytics backend for real-user monitoring."
 */


// RUN: node docs/30-performance/12-performance-api.js
