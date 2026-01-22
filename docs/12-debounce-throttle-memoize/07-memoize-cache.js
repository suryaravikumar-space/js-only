/**
 * CHALLENGE 07: Memoize with Custom Cache (LRU)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ LRU (Least Recently Used) Cache:                                           ║
 * ║   - Fixed size cache                                                       ║
 * ║   - Evicts oldest entry when full                                          ║
 * ║   - Prevents memory leaks                                                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function memoizeWithLimit(fn, limit = 10) {
  var cache = new Map();
  
  return function(...args) {
    var key = JSON.stringify(args);
    
    if (cache.has(key)) {
      var value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }
    
    var result = fn.apply(this, args);
    
    if (cache.size >= limit) {
      var firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, result);
    return result;
  };
}

var compute = memoizeWithLimit((x) => x * 2, 3);

console.log('A:', compute(1));
console.log('B:', compute(2));
console.log('C:', compute(3));
console.log('D:', compute(4));
console.log('E:', compute(1));

/**
 * OUTPUT:
 *   A: 2
 *   B: 4
 *   C: 6
 *   D: 8
 *   E: 2 (recomputed - evicted from cache)
 *
 * RUN: node docs/12-debounce-throttle-memoize/07-memoize-cache.js
 */
