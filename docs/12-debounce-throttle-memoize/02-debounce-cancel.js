/**
 * CHALLENGE 02: Debounce with Cancel
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Enhanced debounce with:                                                    ║
 * ║   - cancel(): Cancel any pending execution                                 ║
 * ║   - flush():  Execute immediately if pending                               ║
 * ║                                                                            ║
 * ║ Useful for cleanup on component unmount or user navigation                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function debounce(fn, delay) {
  var timeoutId = null;
  
  function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }
  
  debounced.cancel = function() {
    clearTimeout(timeoutId);
    timeoutId = null;
  };
  
  debounced.flush = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      fn();
      timeoutId = null;
    }
  };
  
  return debounced;
}

var callCount = 0;
var log = debounce(() => {
  callCount++;
  console.log('A: Called', callCount, 'times');
}, 100);

log();
log();
log.cancel();
log();
log();

setTimeout(() => {
  console.log('B: Final count:', callCount);
}, 200);

/**
 * OUTPUT:
 *   A: Called 1 times
 *   B: Final count: 1
 *
 * RUN: node docs/12-debounce-throttle-memoize/02-debounce-cancel.js
 */
