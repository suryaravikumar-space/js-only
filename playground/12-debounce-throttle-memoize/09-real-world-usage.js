// CHALLENGE 09: Real World Usage Patterns
//
// Practical examples of debounce, throttle, memoize

// 1. Search Input (debounce)
function debounce(fn, delay) {
  var timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

var searchAPI = debounce((query) => {
  console.log('A: Searching for:', query);
}, 300);

// Simulating user typing
searchAPI('h');
searchAPI('he');
searchAPI('hel');
searchAPI('hell');
searchAPI('hello');  // Only this one fires after 300ms

// 2. Scroll Handler (throttle)
function throttle(fn, limit) {
  var lastCall = 0;
  return function(...args) {
    var now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

var scrollCount = 0;
var handleScroll = throttle(() => {
  scrollCount++;
}, 100);

// Simulate many scroll events
for (var i = 0; i < 10; i++) {
  handleScroll();
}

// 3. API Response Cache (memoize)
function memoize(fn) {
  var cache = new Map();
  return async function(...args) {
    var key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('B: Cache hit');
      return cache.get(key);
    }
    var result = await fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

setTimeout(() => {
  console.log('C: Scroll handler called', scrollCount, 'times');
}, 100);
