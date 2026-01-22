// CHALLENGE 00: Debounce Basics
//
// What prints and WHEN? (Timing matters!)

function debounce(fn, delay) {
  var timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

var log = debounce(function(msg) {
  console.log('Logged:', msg);
}, 100);

console.log('A: Start');

log('first');
log('second');
log('third');

console.log('B: After all calls');

setTimeout(function() {
  console.log('C: After 150ms');
}, 150);
