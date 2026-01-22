/**
 * CHALLENGE 01: setTimeout Order
 *
 * What is the output?
 */

setTimeout(function() {
  console.log('A');
}, 100);

setTimeout(function() {
  console.log('B');
}, 0);

setTimeout(function() {
  console.log('C');
}, 50);

console.log('D');

// OUTPUT:
//   ?
//   ?
//   ?
//   ?
