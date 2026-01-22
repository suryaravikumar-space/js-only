// CHALLENGE 01: Leading Edge Debounce
//
// What prints and WHEN? (Timing matters!)

function debounceLeading(fn, delay) {
  var timeoutId;
  return function(...args) {
    var shouldCall = !timeoutId;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
    }, delay);
    if (shouldCall) {
      fn.apply(this, args);
    }
  };
}

var log = debounceLeading(function(msg) {
  console.log('Logged:', msg);
}, 100);

console.log('A: Start');

log('first');
log('second');
log('third');

console.log('B: After all calls');

setTimeout(function() {
  log('fourth');
  console.log('C: After 150ms');
}, 150);
