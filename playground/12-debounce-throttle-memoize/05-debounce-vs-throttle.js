// CHALLENGE 05: Debounce vs Throttle Comparison
//
// Visual comparison of debounce vs throttle

function debounce(fn, delay) {
  var timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

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

var debounceResults = [];
var throttleResults = [];

var debouncedFn = debounce((t) => debounceResults.push(t), 50);
var throttledFn = throttle((t) => throttleResults.push(t), 50);

// Simulate rapid events at 0, 20, 40, 60, 80, 100ms
[0, 20, 40, 60, 80, 100].forEach((t, i) => {
  setTimeout(() => {
    debouncedFn(t);
    throttledFn(t);
  }, t);
});

setTimeout(() => {
  console.log('A: Debounce calls:', debounceResults.length);  // Only last one
  console.log('B: Throttle calls:', throttleResults.length);  // Multiple
  console.log('C: Debounce values:', debounceResults);
  console.log('D: Throttle values:', throttleResults);
}, 200);

/*
 * DEBOUNCE: Waits for pause in events
 * ────────────────────────────────────
 * Events:    A----B----C----D----E
 * Debounce:  ─────────────────────X  (only executes after pause)
 * 
 * Use: Search input, resize handler, save draft
 *
 * THROTTLE: Executes at regular intervals
 * ────────────────────────────────────────
 * Events:    A----B----C----D----E
 * Throttle:  X─────────X─────────X  (executes every N ms)
 * 
 * Use: Scroll handler, mousemove, game loop
 */
