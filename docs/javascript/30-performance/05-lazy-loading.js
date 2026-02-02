/**
 * PERFORMANCE: 05 - Lazy Loading
 *
 * ONE CONCEPT: Load resources only when they're needed
 */


// =============================================================================
// WHAT IS LAZY LOADING?
// =============================================================================

console.log('=== Lazy Loading ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  LAZY LOADING: Defer loading until resource is needed              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  WITHOUT lazy loading:                                              │
 *   │  Page loads → downloads ALL 50 images immediately                  │
 *   │  Initial payload: 10MB                                              │
 *   │                                                                      │
 *   │  WITH lazy loading:                                                 │
 *   │  Page loads → downloads only 3 visible images                     │
 *   │  User scrolls → downloads next images as needed                   │
 *   │  Initial payload: 500KB                                            │
 *   │                                                                      │
 *   │  What to lazy load:                                                 │
 *   │  • Images below the fold                                           │
 *   │  • Videos                                                           │
 *   │  • Iframes (ads, embeds)                                           │
 *   │  • JavaScript modules (code splitting)                             │
 *   │  • Components (React.lazy)                                         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Lazy loading = load on demand, not upfront');
console.log('Reduces initial page weight dramatically');


// =============================================================================
// NATIVE IMAGE LAZY LOADING
// =============================================================================

console.log('\n=== Native Image Lazy Loading ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  NATIVE: loading="lazy"                                             │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  <img src="photo.jpg" loading="lazy"                               │
 *   │       alt="Photo" width="800" height="600">                        │
 *   │                                                                      │
 *   │  loading values:                                                    │
 *   │  "lazy"  → Load when near viewport                                │
 *   │  "eager" → Load immediately (default)                              │
 *   │                                                                      │
 *   │  Also works on iframes:                                             │
 *   │  <iframe src="widget.html" loading="lazy"></iframe>                │
 *   │                                                                      │
 *   │  IMPORTANT:                                                         │
 *   │  • Do NOT lazy load above-the-fold images (LCP candidate!)        │
 *   │  • Always set width + height (prevents CLS)                        │
 *   │  • Hero image should use fetchpriority="high"                      │
 *   │                                                                      │
 *   │  <img src="hero.jpg"                                                │
 *   │       fetchpriority="high"                                          │
 *   │       alt="Hero">                    ← Above fold, load ASAP      │
 *   │                                                                      │
 *   │  <img src="footer.jpg"                                              │
 *   │       loading="lazy"                                                │
 *   │       alt="Footer">                  ← Below fold, lazy           │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('<img loading="lazy"> — native browser lazy loading');
console.log('Do NOT lazy load hero/LCP images!');
console.log('Always set width + height to prevent CLS');


// =============================================================================
// INTERSECTION OBSERVER
// =============================================================================

console.log('\n=== IntersectionObserver Approach ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  INTERSECTION OBSERVER FOR CUSTOM LAZY LOADING                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // HTML: <img data-src="photo.jpg" class="lazy">                  │
 *   │                                                                      │
 *   │  const observer = new IntersectionObserver((entries) => {          │
 *   │    entries.forEach(entry => {                                       │
 *   │      if (entry.isIntersecting) {                                    │
 *   │        const img = entry.target;                                    │
 *   │        img.src = img.dataset.src;    // Start loading             │
 *   │        img.classList.remove('lazy');                                │
 *   │        observer.unobserve(img);      // Stop watching             │
 *   │      }                                                              │
 *   │    });                                                              │
 *   │  }, {                                                               │
 *   │    rootMargin: '200px'  // Start loading 200px before visible    │
 *   │  });                                                                │
 *   │                                                                      │
 *   │  document.querySelectorAll('.lazy').forEach(img => {               │
 *   │    observer.observe(img);                                           │
 *   │  });                                                                │
 *   │                                                                      │
 *   │  Why use this over native?                                          │
 *   │  • More control over rootMargin (preload distance)                │
 *   │  • Can lazy load ANY element (not just img/iframe)                │
 *   │  • Trigger animations on scroll                                    │
 *   │  • Infinite scroll implementation                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('IntersectionObserver: custom control over lazy loading');
console.log('rootMargin: "200px" → preload before element is visible');
console.log('Use for: custom behavior, animations, infinite scroll');


// =============================================================================
// COMPONENT LAZY LOADING (REACT)
// =============================================================================

console.log('\n=== React Component Lazy Loading ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  REACT LAZY LOADING                                                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // Route-level lazy loading                                        │
 *   │  const Dashboard = React.lazy(() => import('./Dashboard'));        │
 *   │  const Settings  = React.lazy(() => import('./Settings'));         │
 *   │                                                                      │
 *   │  function App() {                                                   │
 *   │    return (                                                         │
 *   │      <Suspense fallback={<Spinner />}>                             │
 *   │        <Routes>                                                     │
 *   │          <Route path="/" element={<Home />} />                     │
 *   │          <Route path="/dash" element={<Dashboard />} />            │
 *   │          <Route path="/settings" element={<Settings />} />         │
 *   │        </Routes>                                                    │
 *   │      </Suspense>                                                    │
 *   │    );                                                               │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  // Component-level lazy loading                                    │
 *   │  const HeavyChart = React.lazy(() => import('./HeavyChart'));      │
 *   │                                                                      │
 *   │  function Dashboard() {                                             │
 *   │    const [showChart, setShowChart] = useState(false);              │
 *   │    return showChart ? (                                             │
 *   │      <Suspense fallback={<Loading />}>                             │
 *   │        <HeavyChart />                                               │
 *   │      </Suspense>                                                    │
 *   │    ) : (                                                            │
 *   │      <button onClick={() => setShowChart(true)}>Show Chart</button>│
 *   │    );                                                               │
 *   │  }                                                                  │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('React.lazy + Suspense for route and component splitting');
console.log('Each lazy component = separate JS chunk');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Lazy loading defers resource loading until it's actually needed. For
 * images, I use the native loading='lazy' attribute for below-the-fold
 * images — it's zero JavaScript and the browser handles it. I never
 * lazy load the hero image since it's the LCP element; instead I use
 * fetchpriority='high' on it.
 *
 * For more control, I use IntersectionObserver with a rootMargin to start
 * loading images slightly before they scroll into view. This also powers
 * infinite scroll and scroll-triggered animations.
 *
 * For JavaScript, I use React.lazy with Suspense for route-level code
 * splitting. Each route becomes a separate chunk that downloads only when
 * the user navigates there. I also lazy load heavy components like chart
 * libraries that aren't needed on initial render.
 *
 * The key rule: load critical content eagerly (above-fold images, main
 * JS bundle), and lazy load everything else."
 */


// RUN: node docs/30-performance/05-lazy-loading.js
