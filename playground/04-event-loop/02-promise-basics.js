/**
 * CHALLENGE 02: Promise Basics
 *
 * What is the output?
 */

console.log('A');

Promise.resolve().then(function() {
  console.log('B');
});

console.log('C');

// OUTPUT:
//   ?
//   ?
//   ?
