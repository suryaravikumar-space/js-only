/**
 * CHALLENGE 10: Ultimate Optimization Challenge
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW CHEAT SHEET                                                      ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ ┌─────────────┬──────────────────────┬───────────────────────────────────┐ ║
 * ║ │ Technique   │ When                 │ Example Use Case                  │ ║
 * ║ ├─────────────┼──────────────────────┼───────────────────────────────────┤ ║
 * ║ │ Debounce    │ After activity stops │ Search input, form validation     │ ║
 * ║ │ Throttle    │ At regular intervals │ Scroll, resize, mousemove         │ ║
 * ║ │ Memoize     │ Same inputs repeated │ Expensive calculations, API cache │ ║
 * ║ └─────────────┴──────────────────────┴───────────────────────────────────┘ ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function memoize(fn) {
  var cache = new Map();
  return function(...args) {
    var key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    var result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Memoized factorial
var factorial = memoize(function f(n) {
  return n <= 1 ? 1 : n * f(n - 1);
});

console.log('A:', factorial(5));
console.log('B:', factorial(6));

// Compose optimizations
var compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

var pipeline = compose(
  x => x * 2,
  x => x + 10,
  x => x * 3
);

console.log('C:', pipeline(5));

// RAF throttle for animations
var rafThrottle = (fn) => {
  var scheduled = false;
  return function(...args) {
    if (!scheduled) {
      scheduled = true;
      (typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : setTimeout)(() => {
        fn.apply(this, args);
        scheduled = false;
      }, 16);
    }
  };
};

console.log('D:', typeof rafThrottle(() => {}));
console.log('E:', typeof memoize);

/**
 * OUTPUT:
 *   A: 120
 *   B: 720
 *   C: 50
 *   D: function
 *   E: function
 *
 * RUN: node docs/12-debounce-throttle-memoize/10-ultimate-optimization.js
 */
