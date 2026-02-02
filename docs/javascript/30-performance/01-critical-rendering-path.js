/**
 * PERFORMANCE: 01 - Critical Rendering Path
 *
 * ONE CONCEPT: How the browser turns HTML/CSS/JS into pixels on screen
 */


// =============================================================================
// WHAT IS THE CRITICAL RENDERING PATH?
// =============================================================================

console.log('=== Critical Rendering Path ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CRITICAL RENDERING PATH (CRP)                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  The sequence of steps the browser takes to convert                 │
 *   │  HTML, CSS, and JS into pixels on the screen.                      │
 *   │                                                                      │
 *   │  HTML ──▶ DOM                                                       │
 *   │              ╲                                                      │
 *   │               ╲──▶ Render Tree ──▶ Layout ──▶ Paint ──▶ Composite  │
 *   │              ╱                                                      │
 *   │  CSS ──▶ CSSOM                                                      │
 *   │                                                                      │
 *   │  JS can modify both DOM and CSSOM!                                 │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('HTML → DOM');
console.log('CSS → CSSOM');
console.log('DOM + CSSOM → Render Tree → Layout → Paint → Composite');


// =============================================================================
// STEP-BY-STEP BREAKDOWN
// =============================================================================

console.log('\n=== Step by Step ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CRP STEPS IN DETAIL                                                │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. PARSE HTML → Build DOM                                          │
 *   │     Bytes → Characters → Tokens → Nodes → DOM tree                 │
 *   │     <html> → <body> → <div> → <p> ...                             │
 *   │                                                                      │
 *   │  2. PARSE CSS → Build CSSOM                                         │
 *   │     Same process. CSS is render-blocking!                           │
 *   │     Browser won't render until CSSOM is complete                   │
 *   │                                                                      │
 *   │  3. EXECUTE JAVASCRIPT                                              │
 *   │     JS is parser-blocking by default!                               │
 *   │     <script> stops DOM parsing until JS downloads + executes       │
 *   │                                                                      │
 *   │  4. BUILD RENDER TREE                                               │
 *   │     DOM + CSSOM = Render Tree                                       │
 *   │     Only visible elements (no <head>, no display:none)             │
 *   │                                                                      │
 *   │  5. LAYOUT (Reflow)                                                 │
 *   │     Calculate exact position and size of each element              │
 *   │     "Where does each box go? How big is it?"                       │
 *   │                                                                      │
 *   │  6. PAINT                                                           │
 *   │     Fill in pixels: text, colors, images, borders, shadows         │
 *   │     Creates paint layers                                            │
 *   │                                                                      │
 *   │  7. COMPOSITE                                                       │
 *   │     Combine layers in correct order (z-index)                       │
 *   │     GPU-accelerated                                                 │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const steps = [
  '1. Parse HTML     → DOM tree',
  '2. Parse CSS      → CSSOM tree',
  '3. Execute JS     → May modify DOM/CSSOM',
  '4. Render Tree    → DOM + CSSOM (visible elements only)',
  '5. Layout         → Calculate positions and sizes',
  '6. Paint          → Fill in pixels (colors, text, images)',
  '7. Composite      → Combine layers, send to GPU',
];
steps.forEach(s => console.log(`  ${s}`));


// =============================================================================
// RENDER-BLOCKING vs PARSER-BLOCKING
// =============================================================================

console.log('\n=== Blocking Resources ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BLOCKING RESOURCES                                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  CSS = RENDER-BLOCKING                                               │
 *   │  Browser won't paint until ALL CSS is downloaded + parsed           │
 *   │  Why? Wrong styles → flash of unstyled content (FOUC)              │
 *   │                                                                      │
 *   │  JS = PARSER-BLOCKING (by default)                                  │
 *   │  <script src="app.js">                                              │
 *   │     │                                                               │
 *   │     ├─ Pauses HTML parsing                                          │
 *   │     ├─ Downloads JS file                                            │
 *   │     ├─ Executes JS                                                  │
 *   │     └─ Resumes HTML parsing                                         │
 *   │                                                                      │
 *   │  ┌─────────────────────────────────────────────────────────────┐    │
 *   │  │  <script>           → Block parse + execute immediately    │    │
 *   │  │  <script async>     → Download parallel, execute ASAP      │    │
 *   │  │  <script defer>     → Download parallel, execute after DOM │    │
 *   │  └─────────────────────────────────────────────────────────────┘    │
 *   │                                                                      │
 *   │  Timeline:                                                          │
 *   │  HTML: ████████░░░░░░░░████████████                                 │
 *   │  sync: ─────────████████            (blocks parsing)               │
 *   │                                                                      │
 *   │  HTML: ████████████████████████████                                 │
 *   │  async:─────────████                (downloads parallel)           │
 *   │                  ↑ executes when ready (any order)                  │
 *   │                                                                      │
 *   │  HTML: ████████████████████████████                                 │
 *   │  defer:─────────████               (downloads parallel)            │
 *   │                              ↑ executes after DOM ready (in order) │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('CSS → render-blocking (no paint until CSSOM ready)');
console.log('JS  → parser-blocking (stops DOM parsing)');
console.log('');
console.log('<script>       — blocks parsing, executes immediately');
console.log('<script async> — parallel download, execute ASAP (any order)');
console.log('<script defer> — parallel download, execute after DOM (in order)');


// =============================================================================
// OPTIMIZING THE CRITICAL PATH
// =============================================================================

console.log('\n=== Optimizations ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CRP OPTIMIZATIONS                                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. MINIMIZE CRITICAL RESOURCES                                     │
 *   │     • Inline critical CSS (above-the-fold styles)                  │
 *   │     • Defer non-critical CSS with media queries                    │
 *   │     • <link rel="stylesheet" media="print" onload="this.media='all'"> │
 *   │                                                                      │
 *   │  2. MINIMIZE CRITICAL BYTES                                         │
 *   │     • Minify CSS/JS                                                 │
 *   │     • Compress (gzip/brotli)                                        │
 *   │     • Remove unused CSS (PurgeCSS)                                 │
 *   │                                                                      │
 *   │  3. MINIMIZE CRITICAL PATH LENGTH                                   │
 *   │     • Use defer/async for JS                                        │
 *   │     • Preload critical resources: <link rel="preload">             │
 *   │     • Preconnect: <link rel="preconnect" href="https://api.com">  │
 *   │     • DNS prefetch: <link rel="dns-prefetch">                      │
 *   │                                                                      │
 *   │  4. OPTIMIZE RESOURCE ORDER                                         │
 *   │     • CSS in <head> (discover early)                               │
 *   │     • JS at end of <body> or use defer                             │
 *   │     • Preload fonts: <link rel="preload" as="font">               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('1. Inline critical CSS, defer non-critical');
console.log('2. Minify + compress (gzip/brotli)');
console.log('3. defer/async scripts, preload/preconnect');
console.log('4. CSS in <head>, JS defer at end');


// =============================================================================
// RESOURCE HINTS
// =============================================================================

console.log('\n=== Resource Hints ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  RESOURCE HINTS                                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  dns-prefetch  → Resolve DNS early                                  │
 *   │  preconnect    → DNS + TCP + TLS early                              │
 *   │  preload       → Download this resource NOW (high priority)         │
 *   │  prefetch      → Download this resource LATER (low priority, idle) │
 *   │  prerender     → Load and render entire page in background          │
 *   │                                                                      │
 *   │  <link rel="dns-prefetch" href="//api.example.com">               │
 *   │  <link rel="preconnect" href="https://fonts.googleapis.com">      │
 *   │  <link rel="preload" href="/font.woff2" as="font" crossorigin>   │
 *   │  <link rel="prefetch" href="/next-page.js">                       │
 *   │                                                                      │
 *   │  Priority:                                                          │
 *   │  preload > prefetch > dns-prefetch                                  │
 *   │  preload = "I need this NOW for this page"                         │
 *   │  prefetch = "I might need this for the NEXT page"                  │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('preload:       "Need NOW for current page"');
console.log('prefetch:      "Might need for next page"');
console.log('preconnect:    "Will connect to this origin soon"');
console.log('dns-prefetch:  "Resolve DNS early"');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "The Critical Rendering Path is the sequence the browser follows to
 * convert HTML, CSS, and JS into pixels: parse HTML into DOM, parse CSS
 * into CSSOM, combine them into a Render Tree, then Layout, Paint, and
 * Composite.
 *
 * CSS is render-blocking — the browser won't paint until all CSS is parsed
 * to avoid flashes of unstyled content. JavaScript is parser-blocking by
 * default — it stops DOM construction until downloaded and executed.
 *
 * To optimize: I inline critical CSS for above-the-fold content, defer
 * non-critical CSS, use defer or async for scripts, minify and compress
 * everything, and use resource hints like preconnect for third-party
 * origins and preload for critical assets like fonts. The goal is to
 * minimize the number of critical resources, their byte size, and the
 * number of round trips needed before first paint."
 */


// RUN: node docs/30-performance/01-critical-rendering-path.js
