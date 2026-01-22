/**
 * CHALLENGE 10: Ultimate Event Loop Challenge
 *
 * What is the output?
 */

async function async1() {
  console.log('A');
  await async2();
  console.log('B');
}

async function async2() {
  console.log('C');
}

console.log('D');

setTimeout(function() {
  console.log('E');
}, 0);

async1();

new Promise(function(resolve) {
  console.log('F');
  resolve();
}).then(function() {
  console.log('G');
});

console.log('H');

// OUTPUT:
//   ?
//   ?
//   ?
//   ?
//   ?
//   ?
//   ?
//   ?
