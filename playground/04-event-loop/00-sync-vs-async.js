/**
 * CHALLENGE 00: Synchronous vs Asynchronous
 *
 * What is the output?
 */

console.log('A');

setTimeout(function() {
  console.log('B');
}, 0);

console.log('C');

// OUTPUT:
//   A: ?
//   B: ?
//   C: ?
