/**
 * CHALLENGE 06: Memoization Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Memoization caches function results based on arguments.                    ║
 * ║                                                                            ║
 * ║   Same inputs → Cached result (no recomputation)                           ║
 * ║   New inputs  → Compute and cache                                          ║
 * ║                                                                            ║
 * ║ Trade-off: Memory vs CPU                                                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function memoize(fn) {
  var cache = {};
  
  return function(...args) {
    var key = JSON.stringify(args);
    
    if (key in cache) {
      console.log('Cache hit for:', key);
      return cache[key];
    }
    
    console.log('Computing for:', key);
    var result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

var expensiveAdd = memoize((a, b) => {
  return a + b;
});

console.log('A:', expensiveAdd(1, 2));
console.log('B:', expensiveAdd(1, 2));
console.log('C:', expensiveAdd(2, 3));

/**
 * OUTPUT:
 *   Computing for: [1,2]
 *   A: 3
 *   Cache hit for: [1,2]
 *   B: 3
 *   Computing for: [2,3]
 *   C: 5
 *
 * RUN: node docs/12-debounce-throttle-memoize/06-memoize-basics.js
 */
