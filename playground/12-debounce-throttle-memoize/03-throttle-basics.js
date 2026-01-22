// CHALLENGE 03: Throttle Basics
//
// What's the difference between debounce and throttle?

// Throttle: Execute at most once per interval
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

// Simulation
var calls = [];

var throttled = throttle((val) => {
  calls.push(val);
}, 100);

// Rapid calls
throttled('A');  // Executes immediately
throttled('B');  // Ignored (within 100ms)
throttled('C');  // Ignored

setTimeout(() => throttled('D'), 150);  // Executes (after 100ms gap)
setTimeout(() => throttled('E'), 160);  // Ignored
setTimeout(() => throttled('F'), 300);  // Executes

setTimeout(() => {
  console.log('Result:', calls);
}, 400);
