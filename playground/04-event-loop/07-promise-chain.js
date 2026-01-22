/**
 * CHALLENGE 07: Promise Chain
 *
 * What is the output?
 */

Promise.resolve(1)
  .then(function(x) {
    console.log('A:', x);
    return x + 1;
  })
  .then(function(x) {
    console.log('B:', x);
    return Promise.resolve(x + 1);
  })
  .then(function(x) {
    console.log('C:', x);
  });

console.log('D');

// OUTPUT:
//   ?
//   ?
//   ?
//   ?
