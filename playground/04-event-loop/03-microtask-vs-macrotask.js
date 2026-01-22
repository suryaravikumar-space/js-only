/**
 * CHALLENGE 03: Microtask vs Macrotask
 *
 * What is the output?
 */

console.log('A');

setTimeout(function() {
  console.log('B');
}, 0);

Promise.resolve().then(function() {
  console.log('C');
});

console.log('D');

// OUTPUT:
//   ?
//   ?
//   ?
//   ?
