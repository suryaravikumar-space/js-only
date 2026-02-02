/**
 * DOM EVENTS: 09 - Event Listener Options (once, passive, capture)
 *
 * ONE CONCEPT: Fine-tune how event listeners behave
 */


// =============================================================================
// THE OPTIONS OBJECT
// =============================================================================

/**
 *   element.addEventListener(type, handler, options);
 *
 *   options = {
 *     capture: boolean,  // Run during capture phase?
 *     once: boolean,     // Auto-remove after first trigger?
 *     passive: boolean,  // Promise not to preventDefault?
 *     signal: AbortSignal // Remove via AbortController?
 *   }
 *
 */


// =============================================================================
// HOW THE ENGINE SEES IT
// =============================================================================

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  OPTIONS EXPLAINED                                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  capture: true                                                       │
 *   │  ─────────────                                                       │
 *   │    window ──► document ──► body ──► div ──► button                   │
 *   │                                          ↑                           │
 *   │                               Handler fires HERE (going DOWN)        │
 *   │                                                                      │
 *   │  capture: false (default)                                            │
 *   │  ────────────────────────                                            │
 *   │    button ──► div ──► body ──► document ──► window                   │
 *   │       ↑                                                              │
 *   │    Handler fires HERE (going UP)                                     │
 *   │                                                                      │
 *   │  ────────────────────────────────────────────────────────────────    │
 *   │                                                                      │
 *   │  once: true                                                          │
 *   │  ───────────                                                         │
 *   │    Click 1: Handler runs ✓                                           │
 *   │    Click 2: Handler gone (auto-removed after first run)              │
 *   │                                                                      │
 *   │  ────────────────────────────────────────────────────────────────    │
 *   │                                                                      │
 *   │  passive: true                                                       │
 *   │  ──────────────                                                      │
 *   │    Browser: "This handler WON'T call preventDefault()                │
 *   │             so I can start scrolling immediately without             │
 *   │             waiting for JavaScript to finish."                       │
 *   │                                                                      │
 *   │    Calling preventDefault() in a passive handler does NOTHING        │
 *   │    and logs a console warning.                                       │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// OPTION 1: capture
// =============================================================================

console.log('=== capture Option ===\n');

/**
 *   capture: true   → Handler runs during CAPTURE phase (window → target)
 *   capture: false  → Handler runs during BUBBLE phase (target → window)
 *
 *   Shorthand:
 *   addEventListener('click', fn, true)  = { capture: true }
 *   addEventListener('click', fn, false) = { capture: false }
 *
 */

const captureExample = `
// These are equivalent:
btn.addEventListener('click', handler, true);
btn.addEventListener('click', handler, { capture: true });

// Use case: Intercept events BEFORE they reach target
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('disabled')) {
    e.stopPropagation();  // Block event before it reaches element
  }
}, { capture: true });
`;

console.log(captureExample);


// =============================================================================
// OPTION 2: once
// =============================================================================

console.log('=== once Option ===\n');

/**
 *   once: true → Handler automatically removed after FIRST trigger
 *
 *   Equivalent to:
 *   btn.addEventListener('click', function handler(e) {
 *     btn.removeEventListener('click', handler);
 *     // ... rest of handler
 *   });
 *
 */

const onceExample = `
// Handler runs only once, then removed
btn.addEventListener('click', () => {
  console.log('This only runs ONCE');
}, { once: true });

// Click 1: "This only runs ONCE"
// Click 2: (nothing happens)
// Click 3: (nothing happens)

// USE CASES:
// ──────────
// 1. One-time initialization
window.addEventListener('load', initApp, { once: true });

// 2. Animation end callbacks
element.addEventListener('transitionend', () => {
  element.remove();  // Remove after animation
}, { once: true });

// 3. First interaction tracking
document.addEventListener('click', () => {
  analytics.track('first_interaction');
}, { once: true });

// 4. Welcome modals
document.addEventListener('mousemove', showWelcomeModal, { once: true });
`;

console.log(onceExample);


// =============================================================================
// OPTION 3: passive
// =============================================================================

console.log('=== passive Option ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  WHY passive MATTERS (Performance!)                                 │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Problem: When you scroll on touch devices                          │
 *   │                                                                     │
 *   │  1. User touches screen and moves finger                            │
 *   │  2. Browser fires touchmove event                                   │
 *   │  3. Browser WAITS for your handler to finish                        │
 *   │     (in case you call preventDefault to block scrolling)            │
 *   │  4. Handler finishes                                                │
 *   │  5. Browser checks: preventDefault called?                          │
 *   │     - Yes: Don't scroll                                             │
 *   │     - No: NOW scroll                                                │
 *   │                                                                     │
 *   │  This WAIT causes janky scrolling!                                  │
 *   │                                                                     │
 *   │                                                                     │
 *   │  Solution: passive: true                                            │
 *   │                                                                     │
 *   │  1. User touches screen and moves finger                            │
 *   │  2. Browser fires touchmove event                                   │
 *   │  3. Browser starts scrolling IMMEDIATELY                            │
 *   │     (knows handler won't block it)                                  │
 *   │  4. Handler runs in parallel                                        │
 *   │                                                                     │
 *   │  Result: Smooth 60fps scrolling!                                    │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const passiveExample = `
// GOOD: Passive scroll handler (smooth scrolling)
window.addEventListener('scroll', () => {
  updateScrollPosition();  // Can't call preventDefault anyway
}, { passive: true });

// GOOD: Passive touch handler (smooth scrolling)
document.addEventListener('touchmove', (e) => {
  trackTouchPosition(e);
}, { passive: true });

// BAD: Non-passive when you don't need it
document.addEventListener('touchmove', (e) => {
  trackTouchPosition(e);
});  // Browser must wait in case you call preventDefault

// WHEN YOU NEED NON-PASSIVE:
// Only use passive: false when you actually need to prevent scrolling
document.addEventListener('touchmove', (e) => {
  if (isOverDraggableElement(e)) {
    e.preventDefault();  // Block scroll for drag gesture
  }
}, { passive: false });

// NOTE: Chrome makes touchstart/touchmove passive by default!
// To use preventDefault, you must explicitly set passive: false
`;

console.log(passiveExample);


// =============================================================================
// OPTION 4: signal (AbortController)
// =============================================================================

console.log('=== signal Option ===\n');

const signalExample = `
// Create controller
const controller = new AbortController();

// Add multiple listeners with same signal
window.addEventListener('resize', handleResize, { signal: controller.signal });
window.addEventListener('scroll', handleScroll, { signal: controller.signal });
document.addEventListener('click', handleClick, { signal: controller.signal });

// Remove ALL of them at once
controller.abort();

// Perfect for component cleanup:
class InfiniteScroll {
  constructor() {
    this.controller = new AbortController();

    window.addEventListener('scroll', this.checkScroll.bind(this), {
      signal: this.controller.signal,
      passive: true  // Can combine options!
    });
  }

  destroy() {
    this.controller.abort();  // Clean removal
  }
}
`;

console.log(signalExample);


// =============================================================================
// COMBINING OPTIONS
// =============================================================================

console.log('=== Combining Options ===\n');

const combinedExample = `
// All options together
element.addEventListener('touchstart', handler, {
  capture: true,   // Run during capture phase
  once: true,      // Remove after first trigger
  passive: true,   // Won't call preventDefault
  signal: controller.signal  // Can abort
});

// Common combinations:
// ─────────────────────

// One-time passive touch handler
element.addEventListener('touchstart', initTouch, {
  once: true,
  passive: true
});

// Capturable one-time handler
document.addEventListener('click', logFirstClick, {
  capture: true,
  once: true
});

// Removable passive scroll
window.addEventListener('scroll', onScroll, {
  passive: true,
  signal: controller.signal
});
`;

console.log(combinedExample);


// =============================================================================
// BROWSER DEFAULTS
// =============================================================================

console.log('=== Browser Defaults ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  DEFAULT PASSIVE BEHAVIOR (Chrome 56+)                              │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  These events are PASSIVE by default on document-level:             │
 *   │  • touchstart                                                       │
 *   │  • touchmove                                                        │
 *   │  • wheel                                                            │
 *   │  • mousewheel                                                       │
 *   │                                                                     │
 *   │  To use preventDefault on these, you MUST set:                      │
 *   │  { passive: false }                                                 │
 *   │                                                                     │
 *   │  Otherwise, preventDefault does nothing and logs a warning.         │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Passive by default in Chrome:');
console.log('  touchstart, touchmove, wheel, mousewheel');
console.log('\nTo call preventDefault on these:');
console.log('  addEventListener("touchmove", fn, { passive: false })');


// =============================================================================
// INTERVIEW: What to Say (1-2 minutes)
// =============================================================================

/**
 * QUESTION: "What are the addEventListener options?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "addEventListener accepts an options object with four main properties:
 * capture, once, passive, and signal.
 *
 * Capture controls when the handler fires. True means it fires during the
 * capturing phase going down, false means during bubbling going up. Default
 * is false.
 *
 * Once automatically removes the listener after it fires once. It's cleaner
 * than manually calling removeEventListener inside the handler. I use it
 * for one-time initialization or first-interaction tracking.
 *
 * Passive is about scroll performance. When you set passive: true, you're
 * promising the browser you won't call preventDefault. This lets the browser
 * start scrolling immediately without waiting for your JavaScript. It's
 * really important for touch events and scroll listeners on mobile - without
 * it, you can get janky scrolling. Chrome actually makes some events passive
 * by default now.
 *
 * Signal takes an AbortController signal. When you call controller.abort(),
 * all listeners with that signal are removed. It's a clean way to remove
 * multiple listeners at once, especially useful for component cleanup.
 *
 * You can combine these - like a passive, once handler that removes itself
 * after the first touch event."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ capture: bubble vs capture phase
 * ✓ once: auto-remove after first trigger
 * ✓ passive: performance for scroll/touch
 * ✓ signal: AbortController for easy cleanup
 * ✓ Can combine multiple options
 *
 */


// RUN: node docs/26-dom-events/09-event-options.js
