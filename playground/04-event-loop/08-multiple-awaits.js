/**
 * CHALLENGE 08: Multiple Awaits
 *
 * What is the output?
 */

async function first() {
  console.log('A');
  await second();
  console.log('B');
}

async function second() {
  console.log('C');
  await Promise.resolve();
  console.log('D');
}

console.log('E');
first();
console.log('F');

// OUTPUT:
//   ?
//   ?
//   ?
//   ?
//   ?
//   ?
