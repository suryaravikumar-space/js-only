// CHALLENGE 07: Memoize with Custom Cache
//
// Implement memoize with LRU cache

function memoizeWithLimit(fn, limit = 10) {
  var cache = new Map();
  
  return function(...args) {
    var key = JSON.stringify(args);
    
    if (cache.has(key)) {
      // Move to end (most recently used)
      var value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }
    
    var result = fn.apply(this, args);
    
    // Evict oldest if at limit
    if (cache.size >= limit) {
      var firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, result);
    return result;
  };
}

// Test
var compute = memoizeWithLimit((x) => x * 2, 3);

console.log('A:', compute(1));  // Cache: [1]
console.log('B:', compute(2));  // Cache: [1, 2]
console.log('C:', compute(3));  // Cache: [1, 2, 3]
console.log('D:', compute(4));  // Cache: [2, 3, 4] - evicted 1
console.log('E:', compute(1));  // Recomputes! Not in cache
