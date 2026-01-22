// CHALLENGE 05: Promise.prototype.finally()
//
// What prints for A, B, C, D, E, F, G?

// finally runs regardless of outcome
Promise.resolve('success')
  .then(val => {
    console.log('A:', val);
    return 'modified';
  })
  .finally(() => {
    console.log('B:', 'cleanup');
    return 'ignored';  // Return value is ignored!
  })
  .then(val => console.log('C:', val));

// finally also runs on rejection
Promise.reject('error')
  .catch(err => {
    console.log('D:', err);
    return 'recovered';
  })
  .finally(() => {
    console.log('E:', 'always runs');
  })
  .then(val => console.log('F:', val));

// finally passes through the value
Promise.resolve('original')
  .finally(() => {})
  .then(val => console.log('G:', val));
