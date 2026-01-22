// CHALLENGE 06: Promise Chaining Patterns
//
// What prints for A, B, C, D?

// Each .then returns a new promise

// Chain 1: Value transformation
Promise.resolve(1)
  .then(v => v + 1)
  .then(v => v * 2)
  .then(v => v + 10)
  .then(v => console.log('A:', v));  // ((1+1)*2)+10

// Chain 2: Returning promises
function double(n) {
  return new Promise(resolve => {
    setTimeout(() => resolve(n * 2), 10);
  });
}

Promise.resolve(5)
  .then(double)
  .then(double)
  .then(v => console.log('B:', v));

// Chain 3: Error propagation
Promise.resolve(1)
  .then(v => { throw new Error('oops'); })
  .then(v => console.log('C1:', v))  // Skipped
  .then(v => console.log('C2:', v))  // Skipped
  .catch(e => console.log('C:', e.message));

// Chain 4: Recovery from error
Promise.reject(new Error('initial error'))
  .catch(e => 'recovered')
  .then(v => console.log('D:', v));
