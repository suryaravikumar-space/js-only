// CHALLENGE 10: Ultimate Promise Methods Challenge
//
// What prints for A, B, C, D, E, F in order?

console.log('A:', 'sync start');

// Challenge 1: Promise.all vs Promise.allSettled
Promise.all([
  Promise.resolve(1),
  Promise.reject('fail'),
  Promise.resolve(3)
]).catch(e => console.log('B:', e));

Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('fail'),
  Promise.resolve(3)
]).then(results => {
  console.log('C:', results.filter(r => r.status === 'fulfilled').length);
});

// Challenge 2: race vs any
Promise.race([
  new Promise((_, r) => setTimeout(() => r('race-fail'), 10)),
  new Promise(res => setTimeout(() => res('race-success'), 20))
]).catch(e => console.log('D:', e));

Promise.any([
  new Promise((_, r) => setTimeout(() => r('any-fail'), 10)),
  new Promise(res => setTimeout(() => res('any-success'), 20))
]).then(v => console.log('E:', v));

// Challenge 3: Execution order
Promise.resolve()
  .then(() => console.log('F:', 'then 1'))
  .then(() => console.log('F:', 'then 2'));

console.log('G:', 'sync end');
