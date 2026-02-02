/**
 * PERFORMANCE: 08 - requestAnimationFrame
 *
 * ONE CONCEPT: Sync visual updates with the browser's render cycle
 */


// =============================================================================
// WHAT IS requestAnimationFrame?
// =============================================================================

console.log('=== requestAnimationFrame ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  requestAnimationFrame (rAF)                                        │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Tells browser: "Run this callback before the next repaint"        │
 *   │  Fires at display refresh rate (usually 60fps = every ~16.6ms)     │
 *   │                                                                      │
 *   │  Browser render cycle:                                              │
 *   │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                     │
 *   │  │Frame │ │Frame │ │Frame │ │Frame │ │Frame │                     │
 *   │  │  1   │ │  2   │ │  3   │ │  4   │ │  5   │                     │
 *   │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                     │
 *   │  16.6ms   16.6ms   16.6ms   16.6ms   16.6ms                       │
 *   │                                                                      │
 *   │  rAF runs HERE ──▶ [JS callback] → Style → Layout → Paint         │
 *   │                                                                      │
 *   │  WHY NOT setInterval?                                               │
 *   │  setInterval(fn, 16) — doesn't sync with repaint                  │
 *   │    • May fire between frames (wasted work)                         │
 *   │    • May fire twice in one frame (dropped frame)                   │
 *   │    • Runs in background tabs (wasted CPU)                          │
 *   │                                                                      │
 *   │  rAF:                                                               │
 *   │    • Syncs perfectly with repaint                                   │
 *   │    • Pauses in background tabs (saves battery)                     │
 *   │    • Matches display refresh rate automatically                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('rAF = run code before next browser repaint');
console.log('60fps = callback every ~16.6ms');
console.log('Pauses in background tabs (saves resources)');


// =============================================================================
// ANIMATION PATTERN
// =============================================================================

console.log('\n=== Animation Pattern ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SMOOTH ANIMATION WITH rAF                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  function animate(timestamp) {                                      │
 *   │    // Calculate progress                                            │
 *   │    const elapsed = timestamp - startTime;                          │
 *   │    const progress = Math.min(elapsed / duration, 1);              │
 *   │                                                                      │
 *   │    // Update visual (use transform, not left/top!)                 │
 *   │    element.style.transform = `translateX(${progress * 300}px)`;   │
 *   │                                                                      │
 *   │    // Continue if not done                                          │
 *   │    if (progress < 1) {                                              │
 *   │      requestAnimationFrame(animate);                               │
 *   │    }                                                                │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  const startTime = performance.now();                              │
 *   │  const duration = 1000; // 1 second                                │
 *   │  requestAnimationFrame(animate);                                    │
 *   │                                                                      │
 *   │  // Cancel:                                                         │
 *   │  const id = requestAnimationFrame(animate);                        │
 *   │  cancelAnimationFrame(id);                                          │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulating rAF loop (Node.js doesn't have rAF)
function simulateAnimation() {
  const duration = 1000;
  const startTime = Date.now();

  function frame() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // In browser: element.style.transform = `translateX(${progress * 300}px)`;
    if (progress < 1) {
      // In browser: requestAnimationFrame(frame);
    }
  }
  frame();
}
simulateAnimation();
console.log('Pattern: rAF → calculate progress → update transform → repeat');
console.log('Always use transform (GPU) not left/top (reflow)');


// =============================================================================
// BATCHING DOM READS
// =============================================================================

console.log('\n=== Batching DOM Updates ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  USE rAF TO BATCH DOM WRITES                                        │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // Multiple scroll handlers updating DOM:                          │
 *   │  let ticking = false;                                               │
 *   │                                                                      │
 *   │  window.addEventListener('scroll', () => {                         │
 *   │    if (!ticking) {                                                  │
 *   │      requestAnimationFrame(() => {                                  │
 *   │        updateUI(window.scrollY);   // Batch to next frame          │
 *   │        ticking = false;                                             │
 *   │      });                                                            │
 *   │      ticking = true;                                                │
 *   │    }                                                                │
 *   │  });                                                                │
 *   │                                                                      │
 *   │  Without rAF: scroll fires 30+ times per frame                    │
 *   │  With rAF: DOM updates once per frame (smooth)                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Scroll handler fires 30+ times per frame');
console.log('rAF batches to 1 DOM update per frame');
console.log('Pattern: flag (ticking) + rAF = scroll debouncing');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "requestAnimationFrame schedules a callback to run right before the
 * browser's next repaint, synced to the display refresh rate — typically
 * 60fps. Unlike setInterval, it doesn't fire between frames or waste
 * cycles, and it pauses automatically in background tabs.
 *
 * I use it for smooth JavaScript animations: calculate progress based on
 * elapsed time, update transform properties (GPU-accelerated, no reflow),
 * and request the next frame if the animation isn't complete.
 *
 * Another key use is batching DOM updates from high-frequency events like
 * scroll. Without rAF, a scroll handler might update the DOM 30+ times
 * per frame. With rAF and a ticking flag, I ensure only one DOM update
 * per frame, keeping scrolling smooth.
 *
 * For most CSS animations, I prefer CSS transitions or the Web Animations
 * API. I reach for rAF when I need frame-by-frame control, physics-based
 * animations, or synchronizing multiple elements."
 */


// RUN: node docs/30-performance/08-requestanimationframe.js
