// CHALLENGE 02: Asynchronous Callbacks
//
// What prints for A, B, C, D, E in order?

console.log('A:', 'Start');

// setTimeout - executes callback after delay
setTimeout(function() {
  console.log('B:', 'Timeout 1 (100ms)');
}, 100);

setTimeout(function() {
  console.log('C:', 'Timeout 2 (0ms)');
}, 0);

// setImmediate equivalent with setTimeout 0
setTimeout(function() {
  console.log('D:', 'Timeout 3 (0ms)');
}, 0);

console.log('E:', 'End');

// What's the execution order?
// Hint: Even 0ms timeouts are asynchronous!
