/**
 * TOPIC: Implement Debounce and Throttle with Leading/Trailing Options
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  GOLDEN RULE:                                               ║
 * ║  Debounce = wait until calls STOP, then fire once.          ║
 * ║  Throttle = fire at most once per interval, drop extras.    ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  STORY: Debounce is an elevator door — keeps resetting      │
 * │  the close timer each time someone walks in. Throttle is    │
 * │  a machine gun — fires at a fixed rate no matter how fast   │
 * │  you pull the trigger.                                      │
 * └──────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  TIMING DIAGRAMS (calls at times shown):                    │
 * │                                                             │
 * │  Calls:    |--X--X--X--X--------X--|   (X = call)           │
 * │  Debounce: |---------------------F-|   (F = fire, trailing) │
 * │  Throttle: |--F--------F--------F--|   (F = fire, leading)  │
 * │                                                             │
 * │  Leading debounce:  fires on FIRST call, then waits.        │
 * │  Trailing throttle: fires at END of interval too.           │
 * └──────────────────────────────────────────────────────────────┘
 *
 * APPROACH:
 *  Debounce: clearTimeout + setTimeout each call. Leading = fire if no timer.
 *  Throttle: track lastRun time. Leading = fire immediately. Trailing = schedule.
 */

// ===================== IMPLEMENTATION =====================

function debounce(fn, delay, { leading = false, trailing = true } = {}) {
  let timerId = null;
  let lastArgs = null;

  return function (...args) {
    const callNow = leading && timerId === null;

    // Always save latest args for trailing call
    lastArgs = args;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = null;
      if (trailing && lastArgs) {
        fn.apply(this, lastArgs);
        lastArgs = null;
      }
    }, delay);

    if (callNow) {
      fn.apply(this, args);
      lastArgs = null; // don't fire trailing for this one
    }
  };
}

function throttle(fn, delay, { leading = true, trailing = true } = {}) {
  let lastRun = 0;
  let timerId = null;
  let lastArgs = null;

  return function (...args) {
    const now = Date.now();
    const elapsed = now - lastRun;

    lastArgs = args;

    if (elapsed >= delay && leading) {
      lastRun = now;
      fn.apply(this, args);
      lastArgs = null;
    } else if (!timerId && trailing) {
      const remaining = delay - elapsed;
      timerId = setTimeout(() => {
        lastRun = Date.now();
        timerId = null;
        if (lastArgs) {
          fn.apply(this, lastArgs);
          lastArgs = null;
        }
      }, leading ? remaining : delay);
    }
  };
}

// ===================== TEST CASES =====================

console.log("=== Debounce & Throttle Machine Coding ===\n");

// Helper: simulate rapid calls at specific offsets
function simulateCalls(fn, offsets, label) {
  offsets.forEach((ms) => {
    setTimeout(() => fn(label, ms), ms);
  });
}

// A: Debounce trailing (default) — only last call fires after quiet period
const debouncedA = debounce((label, t) => {
  console.log(`${label}: fired at offset ~${t}ms`);
}, 100);

simulateCalls(debouncedA, [0, 30, 60, 90], "A(debounce-trailing)");
// Expected: fires once ~190ms (90 + 100 delay)

// B: Debounce leading — fires on first call immediately
const debouncedB = debounce(
  (label, t) => {
    console.log(`${label}: fired at offset ~${t}ms`);
  },
  100,
  { leading: true, trailing: false }
);

setTimeout(() => {
  simulateCalls(debouncedB, [0, 30, 60, 90], "B(debounce-leading)");
  // Expected: fires once immediately at 0
}, 300);

// C: Throttle leading (default) — fires first, then at intervals
const throttledC = throttle((label, t) => {
  console.log(`${label}: fired at offset ~${t}ms`);
}, 100);

setTimeout(() => {
  simulateCalls(throttledC, [0, 20, 40, 60, 80, 150, 170], "C(throttle)");
  // Expected: fires at ~0, then trailing at ~100, then ~150, trailing ~250
}, 600);

// D: Throttle trailing only
const throttledD = throttle(
  (label, t) => {
    console.log(`${label}: fired at offset ~${t}ms`);
  },
  100,
  { leading: false, trailing: true }
);

setTimeout(() => {
  simulateCalls(throttledD, [0, 30, 60], "D(throttle-trailing)");
  // Expected: fires once after 100ms
}, 1100);

// E: Debounce with single call
const debouncedE = debounce((label) => {
  console.log(`${label}: single call fired`);
}, 50);

setTimeout(() => {
  debouncedE("E(single)");
  // Expected: fires after 50ms
}, 1400);

// F: Verify debounce resets timer
let fCount = 0;
const debouncedF = debounce(() => {
  fCount++;
  console.log(`F: debounce call count = ${fCount}`);
}, 50);

setTimeout(() => {
  debouncedF();
  setTimeout(() => debouncedF(), 30); // resets
  setTimeout(() => debouncedF(), 60); // resets again
  // Should fire once, 50ms after the last call (at ~110ms from start)
  setTimeout(() => console.log(`F: total calls = ${fCount} (should be 1)`), 200);
}, 1600);

// Print completion message
setTimeout(() => {
  console.log("\n=== All tests complete ===");
}, 2200);

/**
 * FOLLOW-UP QUESTIONS:
 * 1. How would you add a cancel() method to debounce?
 * 2. How would you add a flush() method that fires immediately?
 * 3. What is requestAnimationFrame throttle and when to use it?
 * 4. How does Lodash handle leading+trailing together?
 * 5. When would you use debounce vs throttle for scroll events?
 */

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  INTERVIEW ANSWER:                                         ║
 * ║  Debounce: clear+reset timer on each call. Fire after       ║
 * ║  quiet period. Leading fires immediately if no active timer.║
 * ║  Throttle: fire at most once per interval. Track lastRun    ║
 * ║  time. Leading fires if enough time passed. Trailing        ║
 * ║  schedules a delayed call for remaining time.               ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// RUN: node docs/javascript/29-machine-coding/03-debounce-throttle.js
