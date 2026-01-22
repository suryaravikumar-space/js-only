/**
 * CHALLENGE 04: Nested Promises
 *
 * What is the output?
 */

Promise.resolve().then(function() {
  console.log('A');
  Promise.resolve().then(function() {
    console.log('B');
  });
}).then(function() {
  console.log('C');
});

console.log('D');

// OUTPUT:
//   ?
//   ?
//   ?
//   ?
