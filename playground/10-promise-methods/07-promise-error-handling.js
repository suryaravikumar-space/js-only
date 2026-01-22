// CHALLENGE 07: Promise Error Handling
//
// What prints for A, B, C, D, E?

// Catch placement matters

// Error handling 1: Single catch at end
Promise.resolve()
  .then(() => { throw new Error('error1'); })
  .then(() => console.log('A1:', 'skipped'))
  .then(() => console.log('A2:', 'skipped'))
  .catch(e => console.log('A:', e.message));

// Error handling 2: Early catch allows continuation
Promise.resolve()
  .then(() => { throw new Error('error2'); })
  .catch(e => { console.log('B:', e.message); return 'recovered'; })
  .then(v => console.log('C:', v));

// Error handling 3: Unhandled in then with 2 args
Promise.reject(new Error('error3'))
  .then(
    v => console.log('D1:', v),
    e => { console.log('D:', e.message); return 'from handler'; }
  )
  .then(v => console.log('E:', v));

// Error handling 4: Re-throwing
Promise.reject(new Error('original'))
  .catch(e => {
    console.log('F:', 'caught original');
    throw new Error('new error');
  })
  .catch(e => console.log('G:', e.message));
