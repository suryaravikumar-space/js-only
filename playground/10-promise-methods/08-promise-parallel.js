// CHALLENGE 08: Parallel vs Sequential Execution
//
// What prints for A, B, C?

// Sequential: Each waits for previous
async function sequential() {
  var start = Date.now();

  var r1 = await delay(50, 'first');
  var r2 = await delay(50, 'second');
  var r3 = await delay(50, 'third');

  console.log('A:', Date.now() - start >= 150 ? 'sequential' : 'parallel');
}

// Parallel: All start at once
async function parallel() {
  var start = Date.now();

  var [r1, r2, r3] = await Promise.all([
    delay(50, 'first'),
    delay(50, 'second'),
    delay(50, 'third')
  ]);

  console.log('B:', Date.now() - start < 100 ? 'parallel' : 'sequential');
}

function delay(ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// Parallel with individual error handling
async function parallelSafe() {
  var results = await Promise.all([
    delay(10, 'ok1').catch(e => 'error1'),
    Promise.reject('fail').catch(e => 'caught'),
    delay(10, 'ok2').catch(e => 'error2')
  ]);
  console.log('C:', results[1]);
}

sequential();
parallel();
parallelSafe();
