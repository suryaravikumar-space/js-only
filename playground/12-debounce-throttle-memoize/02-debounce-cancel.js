// CHALLENGE 02: Debounce with Cancel
//
// Implement debounce with cancel and flush functionality

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

// Test
var callCount = 0;
var log = debounce(() => {
  callCount++;
  console.log('A: Called', callCount, 'times');
}, 100);

log();
log();
log.cancel();  // Cancel pending call
log();
log();

setTimeout(() => {
  console.log('B: Final count:', callCount);
}, 200);
