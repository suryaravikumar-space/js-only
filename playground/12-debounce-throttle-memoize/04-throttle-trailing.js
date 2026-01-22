// CHALLENGE 04: Throttle with Leading/Trailing Options
//
// Implement throttle with options

function throttle(fn, limit, options = {}) {
  var lastCall = 0;
  var timeoutId = null;
  var lastArgs = null;
  var leading = options.leading !== false;  // default true
  var trailing = options.trailing !== false; // default true
  
  return function(...args) {
    var now = Date.now();
    var remaining = limit - (now - lastCall);
    lastArgs = args;
    
    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (leading) {
        lastCall = now;
        fn.apply(this, args);
      }
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn.apply(this, lastArgs);
      }, remaining);
    }
  };
}

// Test: Trailing edge
var trailingCalls = [];
var trailingThrottle = throttle(
  (v) => trailingCalls.push(v),
  100,
  { leading: false, trailing: true }
);

trailingThrottle('A');
trailingThrottle('B');
trailingThrottle('C');

setTimeout(() => {
  console.log('Trailing only:', trailingCalls);
}, 200);
