/**
 * CHALLENGE 05: Async/Await
 *
 * What is the output?
 */

async function foo() {
  console.log('A');
  await Promise.resolve();
  console.log('B');
}

console.log('C');
foo();
console.log('D');

// OUTPUT:
//   ?
//   ?
//   ?
//   ?
