/**
 * TOPIC 01: Try-Catch with Sync and Async Code
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ try-catch ONLY catches SYNCHRONOUS errors by default.                     ║
 * ║ For Promises: use .catch() or try-catch with async/await.                ║
 * ║ Errors PROPAGATE up the call stack until someone catches them.           ║
 * ║                                                                            ║
 * ║   Sync error   → try { } catch (e) { }                                  ║
 * ║   Promise      → promise.catch(err => { })                               ║
 * ║   Async/Await  → try { await promise } catch (e) { }                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of a CIRCUS with SAFETY NETS:                                       │
 * │                                                                             │
 * │  Synchronous acts (tightrope walker):                                      │
 * │    - One safety net below catches them immediately                         │
 * │    - try-catch works perfectly — the net is RIGHT THERE                    │
 * │                                                                             │
 * │  Asynchronous acts (trapeze artist flying to another platform):            │
 * │    - They leave the current net's coverage area                            │
 * │    - They need their OWN net at the destination (.catch)                   │
 * │    - OR you wait for them to land, THEN catch (await + try-catch)         │
 * │                                                                             │
 * │  If a trapeze artist falls with NO net → crash (unhandled rejection)      │
 * │                                                                             │
 * │  "Sync = net below you. Async = net at the destination."                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Error Flow - Sync vs Async                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  SYNC ERROR FLOW:                                                          │
 * │  ┌─────────┐    throw    ┌─────────┐   caught!   ┌─────────┐             │
 * │  │  Code   │ ──────────▶ │  catch  │ ──────────▶ │ Handle  │             │
 * │  └─────────┘             └─────────┘             └─────────┘             │
 * │       Same call stack — immediate catch                                    │
 * │                                                                             │
 * │  ASYNC ERROR FLOW (Promise without catch):                                 │
 * │  ┌─────────┐   reject   ┌─────────┐   no .catch  ┌─────────┐            │
 * │  │ Promise │ ──────────▶ │ ??? ... │ ──────────▶  │  CRASH  │            │
 * │  └─────────┘             └─────────┘              └─────────┘            │
 * │       try-catch CANNOT see this — different tick!                          │
 * │                                                                             │
 * │  ASYNC ERROR FLOW (with .catch or await):                                  │
 * │  ┌─────────┐   reject   ┌─────────┐   caught!   ┌─────────┐             │
 * │  │ Promise │ ──────────▶ │ .catch()│ ──────────▶ │ Handle  │             │
 * │  └─────────┘             └─────────┘             └─────────┘             │
 * │                    OR                                                      │
 * │  ┌──────────────┐  reject  ┌─────────┐  caught!  ┌─────────┐            │
 * │  │ await in try │ ───────▶ │  catch  │ ────────▶  │ Handle  │            │
 * │  └──────────────┘          └─────────┘            └─────────┘            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ─── 1. try-catch with synchronous code ───
console.log('=== 1. Sync try-catch ===');

const parseJSON = (str) => {
  try {
    const data = JSON.parse(str);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

console.log('A:', parseJSON('{"name":"Alice"}'));  // success
console.log('B:', parseJSON('not json'));           // error caught

// ─── 2. try-catch CANNOT catch async errors ───
console.log('\n=== 2. try-catch CANNOT catch Promise rejections ===');

const failAsync = () => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Async failure')), 10);
  });
};

// This try-catch will NOT catch the promise rejection
try {
  const promise = failAsync();
  // The error happens LATER, outside this try block
  promise.catch((err) => {
    console.log('C:', `Caught with .catch(): ${err.message}`);
  });
} catch (err) {
  // This will NEVER execute for async errors
  console.log('C:', 'This never runs for async');
}

// ─── 3. .catch() on promises ───
console.log('\n=== 3. Promise .catch() ===');

const fetchUser = (id) => {
  return new Promise((resolve, reject) => {
    if (id <= 0) {
      reject(new Error(`Invalid user id: ${id}`));
    } else {
      resolve({ id, name: 'Alice' });
    }
  });
};

fetchUser(1)
  .then((user) => console.log('D:', user.name))
  .catch((err) => console.log('D:', err.message));

fetchUser(-1)
  .then((user) => console.log('E:', user.name))
  .catch((err) => console.log('E:', err.message));

// ─── 4. Chained .catch() — errors propagate down ───
console.log('\n=== 4. Error propagation in chains ===');

Promise.resolve(10)
  .then((val) => {
    if (val < 20) throw new Error('Too small');
    return val;
  })
  .then((val) => {
    console.log('F:', 'This is skipped');
    return val * 2;
  })
  .catch((err) => {
    console.log('F:', `Caught in chain: ${err.message}`);
    return 99; // recovery value
  })
  .then((val) => {
    console.log('G:', `Recovered with: ${val}`);
  });

// ─── 5. async/await with try-catch ───
console.log('\n=== 5. async/await + try-catch ===');

const fetchData = async (shouldFail) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      shouldFail
        ? reject(new Error('Network timeout'))
        : resolve({ status: 200, data: 'OK' });
    }, 10);
  });
};

const loadData = async () => {
  // Success case
  try {
    const result = await fetchData(false);
    console.log('H:', `Success: ${result.data}`);
  } catch (err) {
    console.log('H:', err.message);
  }

  // Failure case
  try {
    const result = await fetchData(true);
    console.log('I:', result.data); // never reached
  } catch (err) {
    console.log('I:', `Caught: ${err.message}`);
  }
};

// ─── 6. finally block — runs no matter what ───
const withCleanup = async () => {
  let connection = null;
  try {
    connection = 'OPEN';
    console.log('J:', `Connection: ${connection}`);
    throw new Error('Query failed');
  } catch (err) {
    console.log('K:', `Error: ${err.message}`);
  } finally {
    connection = 'CLOSED';
    console.log('L:', `Connection: ${connection} (finally always runs)`);
  }
};

// ─── 7. Error propagation up the call stack ───
const level3 = () => { throw new Error('Deep error'); };
const level2 = () => level3();
const level1 = () => level2();

const testPropagation = () => {
  try {
    level1(); // error bubbles up from level3 → level2 → level1 → here
  } catch (err) {
    console.log('M:', `Caught at top: ${err.message}`);
    const frames = err.stack.split('\n').length;
    console.log('N:', `Stack has ${frames} frames (error bubbled up)`);
  }
};

// ─── 8. Wrapping callbacks in promises for try-catch ───
const readFileAsync = (path) => {
  const fs = require('fs');
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const testCallbackWrapping = async () => {
  try {
    await readFileAsync('/nonexistent/file.txt');
  } catch (err) {
    console.log('O:', `Callback error as await: ${err.code}`);
  }
};

// Run all async examples in order
const main = async () => {
  await loadData();
  await withCleanup();
  testPropagation();
  await testCallbackWrapping();
};

// Small delay to let promise logs from section 3-4 print first
setTimeout(() => {
  main();
}, 50);

/**
 * OUTPUT:
 *   === 1. Sync try-catch ===
 *   A: { success: true, data: { name: 'Alice' } }
 *   B: { success: false, error: 'Unexpected token ...' }
 *
 *   === 2. try-catch CANNOT catch Promise rejections ===
 *
 *   === 3. Promise .catch() ===
 *
 *   === 4. Error propagation in chains ===
 *
 *   === 5. async/await + try-catch ===
 *   C: Caught with .catch(): Async failure
 *   D: Alice
 *   E: Invalid user id: -1
 *   F: Caught in chain: Too small
 *   G: Recovered with: 99
 *   H: Success: OK
 *   I: Caught: Network timeout
 *   J: Connection: OPEN
 *   K: Error: Query failed
 *   L: Connection: CLOSED (finally always runs)
 *   M: Caught at top: Deep error
 *   N: Stack has ~7 frames (error bubbled up)
 *   O: Callback error as await: ENOENT
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "try-catch only works for synchronous errors. For Promises, you need      │
 * │  .catch() or you can use try-catch with async/await since await unwraps   │
 * │  the promise and re-throws the rejection as a catchable error. Errors     │
 * │  propagate up the call stack until caught. The finally block always runs  │
 * │  regardless of success or failure, making it perfect for cleanup like     │
 * │  closing database connections. In promise chains, a single .catch() at   │
 * │  the end catches errors from any .then() above it."                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/07-error-handling/01-try-catch-async.js
 */
