/**
 * PERFORMANCE: 15 - Interview Cheatsheet
 *
 * Quick reference for all performance concepts
 */


// =============================================================================
// MASTER CHEATSHEET
// =============================================================================

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  PERFORMANCE CHEATSHEET                                             │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  CORE WEB VITALS                                                    │
 *   │  • LCP < 2.5s (loading: preload hero, SSR, CDN, WebP/AVIF)       │
 *   │  • INP < 200ms (interactivity: break long tasks, Web Workers)    │
 *   │  • CLS < 0.1 (stability: set img dimensions, preload fonts)      │
 *   │                                                                      │
 *   │  CRITICAL RENDERING PATH                                            │
 *   │  • HTML→DOM, CSS→CSSOM, DOM+CSSOM→Render Tree→Layout→Paint       │
 *   │  • CSS = render-blocking, JS = parser-blocking                    │
 *   │  • Use defer/async for scripts, inline critical CSS               │
 *   │  • Resource hints: preload, prefetch, preconnect                  │
 *   │                                                                      │
 *   │  REFLOW & REPAINT                                                   │
 *   │  • Reflow (layout) > Repaint (paint) > Composite (GPU)           │
 *   │  • Avoid layout thrashing: batch reads then writes                │
 *   │  • Animate with transform/opacity (composite only)                │
 *   │  • CSS containment to isolate reflows                              │
 *   │                                                                      │
 *   │  JAVASCRIPT                                                         │
 *   │  • Long task = > 50ms. Break with setTimeout(fn, 0)              │
 *   │  • requestIdleCallback for non-urgent work                        │
 *   │  • Web Workers for heavy computation                               │
 *   │  • Set > Array for existence checks (O(1) vs O(n))               │
 *   │                                                                      │
 *   │  LAZY LOADING                                                       │
 *   │  • loading="lazy" on below-fold images                            │
 *   │  • fetchpriority="high" on LCP image                              │
 *   │  • React.lazy + Suspense for routes                                │
 *   │  • IntersectionObserver for custom lazy loading                   │
 *   │                                                                      │
 *   │  IMAGES                                                             │
 *   │  • AVIF > WebP > JPEG, SVG for icons                              │
 *   │  • srcset + sizes for responsive images                            │
 *   │  • <picture> for format negotiation                                │
 *   │  • Always set width + height (CLS)                                │
 *   │                                                                      │
 *   │  CACHING                                                            │
 *   │  • Hashed files: max-age=1yr, immutable                           │
 *   │  • HTML: no-cache (always revalidate)                              │
 *   │  • SW: cache-first (static), network-first (API)                 │
 *   │  • stale-while-revalidate (fast + eventually fresh)               │
 *   │                                                                      │
 *   │  NETWORK                                                            │
 *   │  • Minify + Brotli compression                                     │
 *   │  • CDN for static assets                                           │
 *   │  • HTTP/2 multiplexing                                              │
 *   │  • Tree shaking + code splitting                                   │
 *   │                                                                      │
 *   │  FONTS                                                              │
 *   │  • font-display: swap, WOFF2 format, subset                       │
 *   │  • Preload critical fonts, self-host                               │
 *   │                                                                      │
 *   │  REACT                                                              │
 *   │  • React.memo + useMemo + useCallback                              │
 *   │  • Move state down, lift content up                                │
 *   │  • Virtualize long lists                                           │
 *   │  • Split context (fast vs slow updates)                           │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// TOP INTERVIEW Q&A
// =============================================================================

console.log('=== Top Interview Q&A ===\n');

const qa = [
  {
    q: 'What are Core Web Vitals?',
    a: 'Google\'s 3 key UX metrics: LCP (loading, <2.5s), INP (interactivity, <200ms), CLS (stability, <0.1). They\'re ranking signals measured from real users. I optimize LCP with preloading and SSR, INP by breaking long tasks, and CLS by setting image dimensions and preloading fonts.'
  },
  {
    q: 'What is the Critical Rendering Path?',
    a: 'Browser converts HTML→DOM, CSS→CSSOM, combines into Render Tree, then Layout, Paint, Composite. CSS is render-blocking (no paint until parsed). JS is parser-blocking by default. I optimize by inlining critical CSS, using defer for scripts, and preloading key resources.'
  },
  {
    q: 'What is layout thrashing?',
    a: 'Reading layout properties (offsetHeight) after writing styles in a loop forces synchronous reflow on each iteration. Fix: batch all reads first, then batch all writes. Use transform/opacity for animations instead of top/left to skip layout entirely.'
  },
  {
    q: 'How do you optimize React performance?',
    a: 'First, move state closer to where it\'s used. Use React.memo to skip re-renders when props are unchanged, stabilize references with useMemo/useCallback. Pass components as children (not re-created on parent render). Virtualize long lists. Split context to prevent unnecessary consumer re-renders.'
  },
  {
    q: 'Explain lazy loading strategies.',
    a: 'Images: loading="lazy" for below-fold, fetchpriority="high" for LCP. Code: React.lazy+Suspense for route splitting, dynamic import() for heavy components. Use IntersectionObserver for custom behavior. Never lazy load above-the-fold content.'
  },
  {
    q: 'How do you optimize images?',
    a: 'Use AVIF/WebP with JPEG fallback via <picture>. Serve responsive sizes with srcset. Compress at 80% quality. Set explicit width/height to prevent CLS. Preload LCP image. Use Next.js Image for automatic optimization.'
  },
  {
    q: 'Explain your caching strategy.',
    a: 'Hashed static assets (JS/CSS) get max-age=1yr, immutable. HTML pages get no-cache to always check for updates pointing to new hashes. Service Worker uses cache-first for static assets, network-first for API data, and stale-while-revalidate for semi-fresh content.'
  },
  {
    q: 'What is requestAnimationFrame?',
    a: 'Schedules callback before next browser repaint, synced to display refresh rate (~60fps). Better than setInterval for animations: syncs with repaint, pauses in background tabs. I use it for JS animations and batching DOM updates from high-frequency events like scroll.'
  },
];

qa.forEach(({ q, a }, i) => {
  console.log(`${i + 1}. Q: ${q}`);
  console.log(`   A: ${a}\n`);
});


// RUN: node docs/30-performance/15-interview-cheatsheet.js
