/**
 * PERFORMANCE: 09 - Virtual Scrolling
 *
 * ONE CONCEPT: Render only visible items in large lists
 */


// =============================================================================
// THE PROBLEM WITH LARGE LISTS
// =============================================================================

console.log('=== Virtual Scrolling ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  THE PROBLEM: 10,000 items in a list                               │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  WITHOUT virtualization:                                            │
 *   │  ┌──────────────────────┐                                           │
 *   │  │ Item 1               │ ← Rendered (visible)                     │
 *   │  │ Item 2               │ ← Rendered (visible)                     │
 *   │  │ Item 3               │ ← Rendered (visible)                     │
 *   │  ├──────────────────────┤ ← viewport bottom                        │
 *   │  │ Item 4               │ ← Rendered (NOT visible!)               │
 *   │  │ Item 5               │ ← Rendered (NOT visible!)               │
 *   │  │ ...                  │                                           │
 *   │  │ Item 10,000          │ ← Rendered (NOT visible!)               │
 *   │  └──────────────────────┘                                           │
 *   │  10,000 DOM nodes! Slow render, slow scroll, high memory          │
 *   │                                                                      │
 *   │  WITH virtualization:                                               │
 *   │  ┌──────────────────────┐                                           │
 *   │  │ (padding top)        │ ← Empty space (spacer)                  │
 *   │  │ Item 47              │ ← Rendered (visible)                     │
 *   │  │ Item 48              │ ← Rendered (visible)                     │
 *   │  │ Item 49              │ ← Rendered (visible)                     │
 *   │  │ (padding bottom)     │ ← Empty space (spacer)                  │
 *   │  └──────────────────────┘                                           │
 *   │  Only ~20 DOM nodes! Fast render, smooth scroll                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('10,000 items without virtualization = 10,000 DOM nodes');
console.log('With virtualization = ~20 DOM nodes (only visible ones)');
console.log('Spacer divs simulate full scroll height');


// =============================================================================
// HOW IT WORKS
// =============================================================================

console.log('\n=== How Virtual Scrolling Works ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  VIRTUAL SCROLLING INTERNALS                                        │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. Container has fixed height with overflow: auto                  │
 *   │  2. Inner div has total height (itemCount × itemHeight)            │
 *   │  3. On scroll:                                                      │
 *   │     a. Calculate startIndex = Math.floor(scrollTop / itemHeight)   │
 *   │     b. Calculate endIndex = startIndex + visibleCount              │
 *   │     c. Render only items[startIndex..endIndex]                     │
 *   │     d. Position items with transform: translateY()                 │
 *   │                                                                      │
 *   │  ┌───────────────────────────────────┐                              │
 *   │  │ Container (height: 500px)         │                              │
 *   │  │ ┌─────────────────────────────┐   │                              │
 *   │  │ │ Inner (height: 500,000px)   │   │                              │
 *   │  │ │                             │   │                              │
 *   │  │ │ ← scrollTop: 2350px        │   │                              │
 *   │  │ │ ┌─────────────────────┐     │   │                              │
 *   │  │ │ │ Item 47 (visible)   │     │   │ ← Only these exist          │
 *   │  │ │ │ Item 48 (visible)   │     │   │    in the DOM               │
 *   │  │ │ │ Item 49 (visible)   │     │   │                              │
 *   │  │ │ └─────────────────────┘     │   │                              │
 *   │  │ │                             │   │                              │
 *   │  │ └─────────────────────────────┘   │                              │
 *   │  └───────────────────────────────────┘                              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Simplified virtual scroll calculation
function getVisibleRange(scrollTop, viewportHeight, itemHeight, totalItems) {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(viewportHeight / itemHeight);
  const overscan = 3; // Render extra items above/below for smooth scroll
  const start = Math.max(0, startIndex - overscan);
  const end = Math.min(totalItems - 1, startIndex + visibleCount + overscan);
  return { start, end, totalHeight: totalItems * itemHeight };
}

const range = getVisibleRange(2350, 500, 50, 10000);
console.log(`scrollTop: 2350px, viewport: 500px, itemHeight: 50px`);
console.log(`Visible range: items ${range.start}-${range.end}`);
console.log(`Total scroll height: ${range.totalHeight}px`);
console.log(`DOM nodes: ${range.end - range.start + 1} (instead of 10,000)`);


// =============================================================================
// LIBRARIES
// =============================================================================

console.log('\n=== Libraries ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  VIRTUAL SCROLLING LIBRARIES                                        │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  React:                                                             │
 *   │  • @tanstack/react-virtual (TanStack Virtual)                      │
 *   │  • react-virtuoso (auto-sizing, grouped)                           │
 *   │  • react-window (lightweight, by react-virtualized author)        │
 *   │                                                                      │
 *   │  Variable height items:                                             │
 *   │  • Measure items after render                                       │
 *   │  • react-virtuoso handles this automatically                       │
 *   │  • TanStack Virtual: measureElement callback                       │
 *   │                                                                      │
 *   │  When to virtualize:                                                │
 *   │  • > 100 items in a scrollable list                                │
 *   │  • Each item has moderate DOM complexity                           │
 *   │  • Users scroll frequently                                         │
 *   │                                                                      │
 *   │  When NOT to:                                                       │
 *   │  • < 50 simple items (overhead not worth it)                       │
 *   │  • Items need to be searchable by browser Cmd+F                   │
 *   │  • SEO-critical content                                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('TanStack Virtual: flexible, framework-agnostic');
console.log('react-virtuoso: auto-sizing, variable heights');
console.log('react-window: lightweight, fixed/variable sizes');
console.log('Virtualize when > 100 items in a scrollable list');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Virtual scrolling renders only the items currently visible in the
 * viewport, plus a small overscan buffer. Instead of 10,000 DOM nodes,
 * you might have 20-30. A container div with overflow scroll holds an
 * inner div sized to the total list height. On scroll, we calculate
 * which items are visible based on scrollTop and item height, and only
 * render those items positioned with CSS transforms.
 *
 * I use TanStack Virtual or react-virtuoso in React. Virtuoso is great
 * for variable-height items since it measures them dynamically.
 *
 * I virtualize when a list exceeds ~100 items with moderate DOM
 * complexity. Below that, the virtualization overhead isn't worth it.
 * I also avoid it when browser-native search (Cmd+F) is important,
 * since non-rendered items can't be found."
 */


// RUN: node docs/30-performance/09-virtual-scrolling.js
