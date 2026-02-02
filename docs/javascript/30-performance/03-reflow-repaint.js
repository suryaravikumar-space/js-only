/**
 * PERFORMANCE: 03 - Reflow & Repaint
 *
 * ONE CONCEPT: How DOM changes trigger expensive layout and paint operations
 */


// =============================================================================
// REFLOW vs REPAINT
// =============================================================================

console.log('=== Reflow vs Repaint ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  REFLOW vs REPAINT                                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  REFLOW (Layout):                                                   │
 *   │  Recalculate position + size of elements                           │
 *   │  EXPENSIVE — affects other elements (cascading)                    │
 *   │  Triggers: repaint + composite too                                 │
 *   │                                                                      │
 *   │  REPAINT:                                                           │
 *   │  Redraw visual appearance (color, shadow, visibility)              │
 *   │  CHEAPER — no geometry change                                      │
 *   │  Does NOT trigger reflow                                           │
 *   │                                                                      │
 *   │  COMPOSITE ONLY:                                                    │
 *   │  GPU handles it (transform, opacity)                               │
 *   │  CHEAPEST — no layout, no paint                                    │
 *   │                                                                      │
 *   │  Cost hierarchy:                                                    │
 *   │  Reflow > Repaint > Composite                                      │
 *   │                                                                      │
 *   │  ┌──────────┐    ┌──────────┐    ┌──────────┐                      │
 *   │  │ Reflow   │──▶│ Repaint  │──▶│Composite │                      │
 *   │  │(Layout)  │    │(Paint)   │    │(GPU)     │                      │
 *   │  └──────────┘    └──────────┘    └──────────┘                      │
 *   │  width,height    color,shadow    transform,opacity                 │
 *   │  margin,padding  background      will-change                       │
 *   │  display,position border-radius  filter                            │
 *   │  font-size       outline                                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Reflow:    geometry change → most expensive');
console.log('Repaint:   visual change → moderate');
console.log('Composite: transform/opacity → cheapest (GPU)');


// =============================================================================
// WHAT TRIGGERS REFLOW
// =============================================================================

console.log('\n=== Reflow Triggers ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  REFLOW TRIGGERS                                                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  CSS PROPERTIES:                                                    │
 *   │  width, height, margin, padding, border                            │
 *   │  display, position, float, clear                                   │
 *   │  top, left, right, bottom                                          │
 *   │  font-size, font-family, line-height                               │
 *   │  overflow, text-align                                               │
 *   │                                                                      │
 *   │  DOM OPERATIONS:                                                    │
 *   │  Adding/removing elements                                           │
 *   │  Changing text content                                              │
 *   │  Moving elements                                                    │
 *   │  Resizing window                                                    │
 *   │  Changing class/style                                               │
 *   │                                                                      │
 *   │  READING LAYOUT PROPERTIES (forces sync reflow!):                  │
 *   │  offsetTop, offsetLeft, offsetWidth, offsetHeight                  │
 *   │  scrollTop, scrollLeft, scrollWidth, scrollHeight                  │
 *   │  clientTop, clientLeft, clientWidth, clientHeight                  │
 *   │  getComputedStyle()                                                 │
 *   │  getBoundingClientRect()                                            │
 *   │                                                                      │
 *   │  ⚠ Reading layout after writing = FORCED SYNCHRONOUS REFLOW       │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('CSS: width, height, margin, padding, display, position, font-size');
console.log('DOM: add/remove elements, change text, resize window');
console.log('Reading: offsetHeight, getBoundingClientRect() → forces sync reflow!');


// =============================================================================
// LAYOUT THRASHING
// =============================================================================

console.log('\n=== Layout Thrashing ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  LAYOUT THRASHING: Read-Write-Read-Write in a loop                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  BAD (thrashing — forces reflow on EVERY iteration):               │
 *   │  for (let i = 0; i < elements.length; i++) {                       │
 *   │    const height = elements[i].offsetHeight; // READ → force reflow │
 *   │    elements[i].style.height = height * 2 + 'px'; // WRITE         │
 *   │  }                                                                  │
 *   │  // N elements = N reflows!                                        │
 *   │                                                                      │
 *   │  GOOD (batch reads, then batch writes):                            │
 *   │  const heights = elements.map(el => el.offsetHeight); // READ all │
 *   │  elements.forEach((el, i) => {                                     │
 *   │    el.style.height = heights[i] * 2 + 'px';         // WRITE all │
 *   │  });                                                                │
 *   │  // Only 1 reflow!                                                 │
 *   │                                                                      │
 *   │  Why? Browser batches style changes and reflows at end of frame.   │
 *   │  But reading layout props FORCES an immediate reflow to return     │
 *   │  up-to-date values.                                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulating layout thrashing concept
console.log('BAD:  read → write → read → write (N reflows)');
console.log('GOOD: read all → write all (1 reflow)');
console.log('Reading layout property after writing forces sync reflow');


// =============================================================================
// OPTIMIZATION TECHNIQUES
// =============================================================================

console.log('\n=== How to Avoid Expensive Reflows ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  REFLOW OPTIMIZATION TECHNIQUES                                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. USE TRANSFORM/OPACITY for animations                           │
 *   │     ✗ element.style.left = x + 'px';   → reflow                   │
 *   │     ✓ element.style.transform = `translateX(${x}px)`; → composite │
 *   │                                                                      │
 *   │  2. BATCH DOM CHANGES                                               │
 *   │     • Use documentFragment for multiple additions                  │
 *   │     • Use classList.add() instead of multiple style changes        │
 *   │     • Use requestAnimationFrame for visual updates                 │
 *   │                                                                      │
 *   │  3. TAKE ELEMENT OUT OF FLOW                                       │
 *   │     display: none → make changes → display: block                  │
 *   │     (only 2 reflows instead of many)                               │
 *   │                                                                      │
 *   │  4. USE CSS CONTAINMENT                                            │
 *   │     contain: layout;  → reflows don't cascade to parent           │
 *   │     contain: paint;   → repaints don't cascade                    │
 *   │     contain: strict;  → layout + paint + size                     │
 *   │                                                                      │
 *   │  5. USE will-change SPARINGLY                                       │
 *   │     will-change: transform;  → promotes to own layer              │
 *   │     Overuse = memory bloat!                                        │
 *   │                                                                      │
 *   │  6. VIRTUALIZE LONG LISTS                                          │
 *   │     Only render visible items (react-virtuoso, tanstack-virtual)  │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('1. Use transform/opacity (composite only, no reflow)');
console.log('2. Batch DOM changes (documentFragment, classList)');
console.log('3. display:none → change → display:block');
console.log('4. CSS containment (contain: layout)');
console.log('5. will-change sparingly (own GPU layer)');
console.log('6. Virtualize long lists');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Reflow recalculates element positions and sizes — it's the most
 * expensive operation because it cascades through the layout tree.
 * Repaint redraws visual properties like color and shadow without
 * changing geometry. Composite-only changes like transform and opacity
 * are cheapest because the GPU handles them without touching layout
 * or paint.
 *
 * The biggest performance killer is layout thrashing — reading layout
 * properties like offsetHeight after writing styles in a loop. Each
 * read forces a synchronous reflow. The fix is to batch all reads first,
 * then batch all writes.
 *
 * For animations, I always use transform and opacity instead of top/left
 * or width/height. I use CSS containment to isolate reflows to specific
 * subtrees, and requestAnimationFrame to batch visual updates. For large
 * lists, I use virtualization so only visible items are in the DOM."
 */


// RUN: node docs/30-performance/03-reflow-repaint.js
