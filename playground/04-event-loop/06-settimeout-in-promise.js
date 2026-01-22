/**
 * CHALLENGE 06: setTimeout Inside Promise
 *
 * What is the output?
 */

Promise.resolve().then(function() {
  console.log('A');
  setTimeout(function() {
    console.log('B');
  }, 0);
});

setTimeout(function() {
  console.log('C');
  Promise.resolve().then(function() {
    console.log('D');
  });
}, 0);

console.log('E');

// OUTPUT:
//   ?
//   ?
//   ?
//   ?
//   ?
