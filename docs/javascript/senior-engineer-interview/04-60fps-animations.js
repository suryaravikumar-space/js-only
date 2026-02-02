/**
 * ================================================================
 * QUESTION: "Your app's animations are janky on mid-range Android
 *            phones. Users complain about lag. How do you fix it
 *            and ensure 60fps on low-end devices?"
 * ================================================================
 *
 * ASKED AT: Google (L5 — "browser rendering pipeline"), Meta (E5 — "performance"),
 *           Amazon (SDE2 — "optimize a slow product page"), Apple, Netflix
 * TYPE:     Performance + Browser internals
 *
 * Sources:
 *   - Chrome Rendering Pipeline: https://web.dev/articles/rendering-performance
 *   - Compositor properties: https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count
 *   - CSS Triggers: https://csstriggers.com (which properties trigger what)
 *   - content-visibility: https://web.dev/articles/content-visibility
 *   - Paul Lewis (Chrome team): https://aerotwist.com/blog/pixels-are-expensive/
 *   - Layout thrashing: https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing
 *
 * ================================================================
 * YOUR STORY TO THE INTERVIEWER:
 * ================================================================
 *
 * "We had a product listing page with card animations — hover effects,
 *  page transitions, infinite scroll. Looked great on MacBooks.
 *  Then we tested on a Samsung A13 (most popular phone in many markets).
 *  Scrolling was 15fps. Hover animations visibly stuttered.
 *
 *  I opened DevTools with 6x CPU throttle (simulates low-end phone).
 *  Immediately saw the problem in the Performance tab:
 *  - Purple bars (Layout) taking 12ms per frame
 *  - Green bars (Paint) taking 8ms per frame
 *  - Total: 20ms+ per frame. Budget is 16.67ms. No wonder it janked.
 *
 *  Root cause: We were animating `width` and `margin-left` on hover.
 *  These trigger Layout → Paint → Composite (the full pipeline).
 *
 *  Fix: Changed to `transform: scale()` and `transform: translateX()`.
 *  These skip Layout and Paint entirely — only Composite runs on GPU.
 *  Went from 15fps to 60fps on the same phone."
 *
 * ================================================================
 * VISUAL: THE BROWSER RENDERING PIPELINE
 * ================================================================
 *
 *   Every single frame (16.67ms at 60fps) the browser runs:
 *
 *   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌───────────┐
 *   │JavaScript│──▶│  Style   │──▶│  Layout  │──▶│  Paint   │──▶│ Composite │
 *   │ (run JS) │   │(CSS calc)│   │(geometry)│   │(pixels)  │   │(GPU merge)│
 *   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └───────────┘
 *      ~3ms            ~1ms          ~4ms           ~4ms            ~1ms
 *                                                                = 13ms total
 *
 *   If you animate `width`:     JS → Style → Layout → Paint → Composite (ALL 5)
 *   If you animate `color`:     JS → Style → Paint → Composite (skip Layout)
 *   If you animate `transform`: JS → Style → Composite (skip Layout AND Paint)
 *   If you animate `opacity`:   JS → Style → Composite (skip Layout AND Paint)
 *
 *   On a low-end phone where Layout = 8ms and Paint = 6ms:
 *   - Animating `width`:     8 + 6 + 1 = 15ms ← OVER BUDGET, JANK
 *   - Animating `transform`: 0 + 0 + 1 = 1ms  ← SMOOTH
 *
 * ================================================================
 * RULE 1: ONLY ANIMATE TRANSFORM AND OPACITY
 * ================================================================
 */

// ❌ BAD — animating properties that trigger Layout
/*
.card {
  transition: width 0.3s, margin-left 0.3s, height 0.3s;
}
.card:hover {
  width: 320px;        // ← triggers Layout (recalculate ALL element positions)
  margin-left: 20px;   // ← triggers Layout
  height: 400px;       // ← triggers Layout
}
*/
// Each frame: browser recalculates position of EVERY element on the page

// ✅ GOOD — only compositor properties
/*
.card {
  transition: transform 0.3s, opacity 0.3s;
}
.card:hover {
  transform: scale(1.05) translateX(20px);  // ← GPU only, no Layout
  opacity: 0.9;                              // ← GPU only, no Paint
}
*/
// Each frame: GPU shifts pixels. CPU does nothing. Smooth even on $100 phones.

/**
 * ================================================================
 * THE FULL LIST: WHAT TRIGGERS WHAT
 * ================================================================
 *
 * Source: https://csstriggers.com (you can verify every claim here)
 *
 * ┌──────────────────────┬────────┬───────┬───────────┐
 * │ Property             │Layout? │Paint? │Composite? │
 * ├──────────────────────┼────────┼───────┼───────────┤
 * │ transform            │   ✗    │   ✗   │    ✓      │ ✅ BEST
 * │ opacity              │   ✗    │   ✗   │    ✓      │ ✅ BEST
 * │ filter (blur etc)    │   ✗    │   ✗   │    ✓      │ ✅ GOOD
 * ├──────────────────────┼────────┼───────┼───────────┤
 * │ background-color     │   ✗    │   ✓   │    ✓      │ ⚠️ OK
 * │ color                │   ✗    │   ✓   │    ✓      │ ⚠️ OK
 * │ box-shadow           │   ✗    │   ✓   │    ✓      │ ⚠️ EXPENSIVE
 * │ border-radius        │   ✗    │   ✓   │    ✓      │ ⚠️ OK
 * ├──────────────────────┼────────┼───────┼───────────┤
 * │ width / height       │   ✓    │   ✓   │    ✓      │ ❌ AVOID
 * │ margin / padding     │   ✓    │   ✓   │    ✓      │ ❌ AVOID
 * │ top / left / right   │   ✓    │   ✓   │    ✓      │ ❌ AVOID
 * │ font-size            │   ✓    │   ✓   │    ✓      │ ❌ AVOID
 * │ border-width         │   ✓    │   ✓   │    ✓      │ ❌ AVOID
 * └──────────────────────┴────────┴───────┴───────────┘
 *
 * PATTERN: Want to move something? → transform: translate()
 *          Want to resize?         → transform: scale()
 *          Want to show/hide?      → opacity
 *          NEVER animate width, height, top, left, margin
 */

/**
 * ================================================================
 * RULE 2: AVOID LAYOUT THRASHING
 * ================================================================
 *
 * Layout thrashing = reading a layout property, then writing,
 * then reading again. Forces browser to recalculate layout
 * on EVERY read. Devastating in loops.
 */

// ❌ BAD — read/write/read/write in a loop
function layoutThrashing(boxes) {
  for (const box of boxes) {
    const width = box.offsetWidth;    // READ → forces layout calculation
    box.style.width = width + 10 + "px"; // WRITE → invalidates layout
    // Next iteration: READ → browser MUST recalculate EVERYTHING
  }
  // 100 boxes = 100 forced layouts = ~200ms on low-end = 12 DROPPED FRAMES
}

// ✅ GOOD — batch all reads, then batch all writes
function batchedOperations(boxes) {
  // Phase 1: Read everything (1 layout calculation)
  const widths = boxes.map(box => box.offsetWidth);

  // Phase 2: Write everything (1 layout invalidation, deferred)
  boxes.forEach((box, i) => {
    box.style.width = widths[i] + 10 + "px";
  });
  // 1 layout instead of 100. Same result, ~100x faster.
}

/**
 * ================================================================
 * RULE 3: will-change — USE IT RIGHT
 * ================================================================
 *
 * will-change tells the browser: "This element WILL animate soon.
 * Create a separate GPU layer for it NOW so the animation is instant."
 *
 * BUT: Each GPU layer costs memory. Low-end phones have ~512MB-1GB VRAM.
 */

// ❌ BAD — will-change on everything (seen in real codebases)
/*
* { will-change: transform; }
// Creates a GPU layer for EVERY element
// 500 elements × ~1-2MB per layer = 500MB-1GB VRAM = crashes low-end phones
*/

// ❌ BAD — will-change always on
/*
.card { will-change: transform; }
// GPU layer exists even when card is NOT animating
// Wastes VRAM 100% of the time
*/

// ✅ GOOD — apply before animation, remove after
function animateSmoothly(element) {
  element.style.willChange = "transform"; // promote to GPU layer

  requestAnimationFrame(() => {
    element.style.transform = "translateX(200px)";

    element.addEventListener("transitionend", () => {
      element.style.willChange = "auto"; // FREE the GPU memory
    }, { once: true });
  });
}

// ✅ ALSO GOOD — CSS-only approach
/*
.card:hover {
  will-change: transform;
}
.card:active {
  transform: scale(0.95);
}
// will-change applies only during hover (when animation is likely)
*/

/**
 * ================================================================
 * RULE 4: DETECT LOW-END DEVICES, ADAPT
 * ================================================================
 *
 * Real companies do this. Netflix reduces animation complexity
 * on low-end devices. Twitter disables some animations on slow connections.
 */

function getDeviceTier() {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4; // GB, Chrome only
  const connection = navigator.connection?.effectiveType || "4g";

  if (cores <= 2 || memory <= 1 || ["slow-2g", "2g"].includes(connection)) {
    return "low";     // Skip animations, reduce paint
  }
  if (cores <= 4 || memory <= 2 || connection === "3g") {
    return "mid";     // Shorter animations, simpler effects
  }
  return "high";       // Full animations
}

function getAnimationDuration() {
  // Always respect user preference first
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return 0;
  }

  const tier = getDeviceTier();
  switch (tier) {
    case "low":  return 0;     // no animations — just instant transitions
    case "mid":  return 150;   // shorter, simpler
    case "high": return 300;   // full experience
  }
}

// Usage in CSS via custom property:
// document.documentElement.style.setProperty('--anim-duration', getAnimationDuration() + 'ms');
// .card { transition: transform var(--anim-duration) ease; }

/**
 * ================================================================
 * RULE 5: content-visibility FOR LONG PAGES
 * ================================================================
 *
 * Chrome team measured: 7x rendering improvement on a large page.
 * Source: https://web.dev/articles/content-visibility
 *
 * Browser skips Layout AND Paint for off-screen elements entirely.
 */

/*
// 1000 product cards, but user sees ~10 at a time
.product-card {
  content-visibility: auto;
  contain-intrinsic-size: 0 350px;  // estimated height for scrollbar math
}

// Without: browser calculates layout for 1000 cards = ~50ms per frame
// With:    browser calculates layout for ~10 cards = ~0.5ms per frame
*/

/**
 * ================================================================
 * RULE 6: USE WEB ANIMATIONS API (not CSS transitions for complex sequences)
 * ================================================================
 */

function slideIn(element) {
  // Runs on compositor thread, same as CSS animation
  // But with JavaScript control (pause, reverse, cancel)
  const anim = element.animate(
    [
      { transform: "translateX(-100%)", opacity: 0 },
      { transform: "translateX(0)", opacity: 1 },
    ],
    {
      duration: getAnimationDuration(),
      easing: "cubic-bezier(0.22, 1, 0.36, 1)", // custom ease-out
      fill: "forwards",
    }
  );

  return anim.finished; // Promise — await it to chain animations
}

// Chain without callback hell:
// await slideIn(header);
// await slideIn(content);
// await slideIn(footer);

/**
 * ================================================================
 * HOW TO PROVE IT IN DEVTOOLS (your debugging story)
 * ================================================================
 *
 *  ┌──────────────────────────────────────────────────────┐
 *  │  1. Open DevTools → Performance tab                  │
 *  │                                                      │
 *  │  2. Click ⚙️ → "CPU throttling: 6x slowdown"       │
 *  │     (simulates a $100-200 Android phone)             │
 *  │                                                      │
 *  │  3. Click Record → interact with the page            │
 *  │                                                      │
 *  │  4. Look at the flame chart:                         │
 *  │     🟣 Purple blocks = Layout (geometry recalc)      │
 *  │     🟢 Green blocks  = Paint (pixel filling)         │
 *  │     🟡 Yellow blocks = JavaScript execution          │
 *  │                                                      │
 *  │  5. If purple or green > 8ms → that's your problem   │
 *  │     Check which CSS property triggered it             │
 *  │                                                      │
 *  │  6. Turn on "Paint flashing" (Rendering tab)         │
 *  │     Green overlay = areas being repainted             │
 *  │     Full-screen green flash = you're painting         │
 *  │     everything = bad                                 │
 *  │                                                      │
 *  │  7. Turn on "Layer borders" (Rendering tab)          │
 *  │     Orange borders = separate GPU layers              │
 *  │     Too many = too much VRAM                         │
 *  └──────────────────────────────────────────────────────┘
 *
 * ================================================================
 * CHEAT SHEET
 * ================================================================
 *
 * Interviewer says...                  │  You say...
 * ─────────────────────────────────────┼──────────────────────────────
 * "How do you get 60fps?"              │  Only animate transform & opacity.
 *                                      │  They run on GPU, skip Layout/Paint.
 * "What causes jank?"                  │  Layout thrashing (read/write loops),
 *                                      │  animating width/height/top/left,
 *                                      │  too many GPU layers.
 * "What is will-change?"               │  Hints browser to create GPU layer.
 *                                      │  Apply before animation, remove after.
 *                                      │  Overuse crashes low-end devices.
 * "How do you test on low-end?"        │  DevTools → 6x CPU throttle.
 *                                      │  Paint flashing + layer borders.
 *                                      │  Also test on real $150 Android.
 * "How do you handle low-end users?"   │  Detect with hardwareConcurrency +
 *                                      │  deviceMemory. Reduce/skip animations.
 *                                      │  Always respect prefers-reduced-motion.
 * "What's the 16.67ms budget?"         │  1000ms / 60fps = 16.67ms per frame.
 *                                      │  JS + Style + Layout + Paint +
 *                                      │  Composite must all fit in that.
 * "What's content-visibility?"         │  Browser skips rendering off-screen
 *                                      │  elements. Chrome team measured 7x gain.
 */
