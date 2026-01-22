/**
 * CHALLENGE 04: Throttle with Leading/Trailing Options
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ leading:  Execute on first call (default: true)                            ║
 * ║ trailing: Execute after wait ends (default: true)                          ║
 * ║                                                                            ║
 * ║   { leading: true, trailing: false }  → Only first call                    ║
 * ║   { leading: false, trailing: true }  → Only after delay                   ║
 * ║   { leading: true, trailing: true }   → Both (default)                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function throttle(fn, limit, options = {}) {
  var lastCall = 0;
  var timeoutId = null;
  var lastArgs = null;
  var leading = options.leading !== false;
  var trailing = options.trailing !== false;
  
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

/**
 * OUTPUT:
 *   Trailing only: [ 'C' ]
 *
 * RUN: node docs/12-debounce-throttle-memoize/04-throttle-trailing.js
 */
