/**
 * CHALLENGE 05: Debounce vs Throttle Comparison
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ DEBOUNCE vs THROTTLE                                                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ DEBOUNCE: Waits for pause in events                                        ║
 * ║ ────────────────────────────────────                                       ║
 * ║ Events:    A----B----C----D----E                                           ║
 * ║ Debounce:  ─────────────────────X  (only after pause)                      ║
 * ║                                                                            ║
 * ║ Use: Search input, resize end, auto-save                                   ║
 * ║                                                                            ║
 * ║ THROTTLE: Executes at regular intervals                                    ║
 * ║ ────────────────────────────────────────                                   ║
 * ║ Events:    A----B----C----D----E                                           ║
 * ║ Throttle:  X─────────X─────────X  (every N ms)                             ║
 * ║                                                                            ║
 * ║ Use: Scroll handler, mousemove, game loop                                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

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

[0, 20, 40, 60, 80, 100].forEach((t, i) => {
  setTimeout(() => {
    debouncedFn(t);
    throttledFn(t);
  }, t);
});

setTimeout(() => {
  console.log('A: Debounce calls:', debounceResults.length);
  console.log('B: Throttle calls:', throttleResults.length);
  console.log('C: Debounce values:', debounceResults);
  console.log('D: Throttle values:', throttleResults);
}, 200);

/**
 * OUTPUT:
 *   A: Debounce calls: 1
 *   B: Throttle calls: 3
 *   C: Debounce values: [ 100 ]
 *   D: Throttle values: [ 0, 60, 100 ]
 *
 * RUN: node docs/12-debounce-throttle-memoize/05-debounce-vs-throttle.js
 */
