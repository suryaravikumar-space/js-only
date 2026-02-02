/**
 * CHALLENGE 03: Throttle Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ THROTTLE: Execute at most once per interval                                ║
 * ║                                                                            ║
 * ║   Events:   A B C D E F                                                    ║
 * ║   Throttle: X─────X─────X (executes every N ms)                            ║
 * ║                                                                            ║
 * ║ Use for: scroll, resize, mousemove handlers                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

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

var calls = [];
var throttled = throttle((val) => {
  calls.push(val);
}, 100);

throttled('A');
throttled('B');
throttled('C');

setTimeout(() => throttled('D'), 150);
setTimeout(() => throttled('E'), 160);
setTimeout(() => throttled('F'), 300);

setTimeout(() => {
  console.log('Result:', calls);
}, 400);

/**
 * OUTPUT:
 *   Result: [ 'A', 'D', 'F' ]
 *
 * RUN: node docs/12-debounce-throttle-memoize/03-throttle-basics.js
 */
