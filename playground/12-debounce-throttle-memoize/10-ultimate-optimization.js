// CHALLENGE 10: Ultimate Optimization Challenge
//
// What prints for A, B, C, D, E?

// Combined debounce + memoize
function debounce(fn, delay) {
  var timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    return new Promise(resolve => {
      timeoutId = setTimeout(() => {
        resolve(fn.apply(this, args));
      }, delay);
    });
  };
}

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

function throttle(fn, limit) {
  var lastCall = 0;
  return function(...args) {
    var now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

// Challenge 1: Memoized factorial
var factorial = memoize(function f(n) {
  return n <= 1 ? 1 : n * f(n - 1);
});

console.log('A:', factorial(5));
console.log('B:', factorial(6));  // Uses cached factorial(5)

// Challenge 2: Compose optimizations
var compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

var optimizedPipeline = compose(
  x => x * 2,
  x => x + 10,
  x => x * 3
);

console.log('C:', optimizedPipeline(5));  // ((5 * 3) + 10) * 2 = 50

// Challenge 3: RequestAnimationFrame throttle
var rafThrottle = (fn) => {
  var scheduled = false;
  return function(...args) {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame ? 
        requestAnimationFrame(() => {
          fn.apply(this, args);
          scheduled = false;
        }) :
        setTimeout(() => {
          fn.apply(this, args);
          scheduled = false;
        }, 16);
    }
  };
};

console.log('D:', typeof rafThrottle(() => {}));

// Challenge 4: Auto-retry with memoize
var attempts = 0;
var fetchWithRetry = memoize(async function(url) {
  attempts++;
  if (attempts < 3) throw new Error('Fail');
  return 'Success';
});

console.log('E: Memoize returns:', typeof memoize);
