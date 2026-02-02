/**
 * PERFORMANCE: 02 - Core Web Vitals
 *
 * ONE CONCEPT: Google's 3 essential metrics for user experience
 */


// =============================================================================
// WHAT ARE CORE WEB VITALS?
// =============================================================================

console.log('=== Core Web Vitals ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CORE WEB VITALS (Google's Top 3 Metrics)                           │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
 *   │  │     LCP     │  │     INP     │  │     CLS     │                │
 *   │  │  Loading    │  │ Interaction │  │  Stability  │                │
 *   │  │  < 2.5s     │  │  < 200ms    │  │  < 0.1      │                │
 *   │  └─────────────┘  └─────────────┘  └─────────────┘                │
 *   │                                                                      │
 *   │  These are Google ranking signals since 2021.                       │
 *   │  Measured from REAL users (field data via CrUX).                   │
 *   │                                                                      │
 *   │  Score thresholds:                                                   │
 *   │  ┌──────────┬──────────┬──────────┬──────────┐                     │
 *   │  │ Metric   │  Good    │ Needs    │  Poor    │                     │
 *   │  │          │          │  Work    │          │                     │
 *   │  ├──────────┼──────────┼──────────┼──────────┤                     │
 *   │  │ LCP      │ ≤ 2.5s  │ ≤ 4.0s   │ > 4.0s   │                     │
 *   │  │ INP      │ ≤ 200ms │ ≤ 500ms  │ > 500ms  │                     │
 *   │  │ CLS      │ ≤ 0.1   │ ≤ 0.25   │ > 0.25   │                     │
 *   │  └──────────┴──────────┴──────────┴──────────┘                     │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('LCP (Largest Contentful Paint) — Loading    — < 2.5s');
console.log('INP (Interaction to Next Paint) — Interactivity — < 200ms');
console.log('CLS (Cumulative Layout Shift)  — Stability  — < 0.1');


// =============================================================================
// LCP — LARGEST CONTENTFUL PAINT
// =============================================================================

console.log('\n=== LCP: Loading Speed ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  LCP: When is the biggest content element painted?                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  What counts as LCP element:                                        │
 *   │  • <img> elements                                                   │
 *   │  • <video> poster image                                             │
 *   │  • Background image via url()                                       │
 *   │  • Block-level text elements (largest text block)                  │
 *   │                                                                      │
 *   │  Timeline:                                                          │
 *   │  ────┬──────┬──────────┬──────────────────                          │
 *   │      │ FCP  │  LCP     │                                            │
 *   │      │      │  ← The moment the hero image/text is visible         │
 *   │                                                                      │
 *   │  Common causes of SLOW LCP:                                         │
 *   │  1. Slow server response (high TTFB)                               │
 *   │  2. Render-blocking CSS/JS                                          │
 *   │  3. Large unoptimized images                                        │
 *   │  4. Client-side rendering (JS must execute before content)         │
 *   │                                                                      │
 *   │  How to FIX:                                                        │
 *   │  • Optimize server (TTFB < 800ms)                                  │
 *   │  • Preload LCP image: <link rel="preload" as="image">            │
 *   │  • Use modern formats (WebP, AVIF)                                 │
 *   │  • Inline critical CSS                                              │
 *   │  • SSR instead of CSR for main content                             │
 *   │  • Use CDN for static assets                                        │
 *   │  • Set fetchpriority="high" on LCP image                          │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('LCP = when largest visible element is painted');
console.log('Fix: preload hero image, optimize server, SSR, CDN');


// =============================================================================
// INP — INTERACTION TO NEXT PAINT
// =============================================================================

console.log('\n=== INP: Interactivity ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  INP: How fast does the page respond to user input?                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  User clicks button:                                                │
 *   │  ┌──────┬──────────────────┬───────┬──────────┐                    │
 *   │  │Input │  Processing      │Present│          │                    │
 *   │  │Delay │  (event handler) │ Delay │  Paint   │                    │
 *   │  └──────┴──────────────────┴───────┴──────────┘                    │
 *   │  ←─────────── INP ──────────────────→                               │
 *   │                                                                      │
 *   │  INP = Input Delay + Processing + Presentation Delay               │
 *   │                                                                      │
 *   │  Replaced FID (First Input Delay) in March 2024                    │
 *   │  FID only measured FIRST interaction's input delay                  │
 *   │  INP measures ALL interactions, reports worst (p75)                │
 *   │                                                                      │
 *   │  Common causes of SLOW INP:                                         │
 *   │  1. Long JavaScript tasks (> 50ms blocks main thread)              │
 *   │  2. Heavy event handlers                                            │
 *   │  3. Large DOM size (slow rendering)                                │
 *   │  4. Main thread contention                                          │
 *   │                                                                      │
 *   │  How to FIX:                                                        │
 *   │  • Break long tasks: yield to main thread (scheduler.yield())     │
 *   │  • Use requestIdleCallback for non-urgent work                     │
 *   │  • Debounce/throttle event handlers                                │
 *   │  • Move heavy work to Web Workers                                  │
 *   │  • Reduce DOM size (< 1400 elements ideal)                        │
 *   │  • Use CSS containment                                              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('INP = total time from user input to visual response');
console.log('Fix: break long tasks, use Web Workers, reduce DOM size');


// =============================================================================
// CLS — CUMULATIVE LAYOUT SHIFT
// =============================================================================

console.log('\n=== CLS: Visual Stability ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CLS: How much does the page layout jump around?                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  BEFORE (bad CLS):                                                  │
 *   │  ┌──────────────────┐     ┌──────────────────┐                     │
 *   │  │ Click here! btn  │     │ AD LOADED         │ ← pushed down!     │
 *   │  │                  │ →   │ Click here! btn   │                     │
 *   │  │                  │     │                   │                     │
 *   │  └──────────────────┘     └──────────────────┘                     │
 *   │  User clicks wrong thing because layout shifted!                   │
 *   │                                                                      │
 *   │  CLS = sum of (impact fraction × distance fraction)                │
 *   │                                                                      │
 *   │  Common causes of HIGH CLS:                                         │
 *   │  1. Images without width/height (dimensions unknown)               │
 *   │  2. Ads/embeds/iframes without reserved space                      │
 *   │  3. Dynamically injected content above existing content            │
 *   │  4. Web fonts causing FOUT (flash of unstyled text)               │
 *   │  5. Late-loading content pushing things down                       │
 *   │                                                                      │
 *   │  How to FIX:                                                        │
 *   │  • Always set width/height on images and videos                    │
 *   │  • Use aspect-ratio CSS property                                    │
 *   │  • Reserve space for ads/embeds (min-height)                       │
 *   │  • Use font-display: swap + preload fonts                          │
 *   │  • Avoid inserting content above existing content                  │
 *   │  • Use transform animations (not top/left)                         │
 *   │  • Use contain-intrinsic-size for lazy content                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('CLS = how much layout jumps unexpectedly');
console.log('Fix: explicit image sizes, reserve ad space, preload fonts');


// =============================================================================
// MEASURING WITH WEB-VITALS LIBRARY
// =============================================================================

console.log('\n=== Measuring in Code ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MEASURING CORE WEB VITALS IN CODE                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // npm install web-vitals                                          │
 *   │  import { onLCP, onINP, onCLS } from 'web-vitals';                │
 *   │                                                                      │
 *   │  onLCP(metric => {                                                  │
 *   │    console.log('LCP:', metric.value);                              │
 *   │    // Send to analytics                                             │
 *   │    sendToAnalytics({ name: 'LCP', value: metric.value });         │
 *   │  });                                                                │
 *   │                                                                      │
 *   │  onINP(metric => {                                                  │
 *   │    console.log('INP:', metric.value);                              │
 *   │  });                                                                │
 *   │                                                                      │
 *   │  onCLS(metric => {                                                  │
 *   │    console.log('CLS:', metric.value);                              │
 *   │  });                                                                │
 *   │                                                                      │
 *   │  // Also available: onFCP, onTTFB                                  │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('npm install web-vitals');
console.log('import { onLCP, onINP, onCLS } from "web-vitals"');
console.log('Send metrics to your analytics backend');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Core Web Vitals are Google's three essential UX metrics and ranking
 * signals. LCP measures loading — when the largest visible element is
 * painted, ideally under 2.5 seconds. I optimize it by preloading hero
 * images, using SSR, CDN, and modern image formats.
 *
 * INP replaced FID in 2024 and measures interactivity — the total time
 * from user input to visual update across ALL interactions. I keep it
 * under 200ms by breaking long JavaScript tasks, using Web Workers for
 * heavy computation, and keeping DOM size small.
 *
 * CLS measures visual stability — how much the layout shifts unexpectedly.
 * I keep it under 0.1 by always setting explicit dimensions on images
 * and videos, reserving space for ads, and preloading fonts with
 * font-display: swap.
 *
 * I measure with the web-vitals npm library in production and send
 * metrics to our analytics. For debugging, I use Lighthouse and
 * PageSpeed Insights which show both lab and field data."
 */


// RUN: node docs/30-performance/02-core-web-vitals.js
