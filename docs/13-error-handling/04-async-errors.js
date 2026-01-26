/**
 * CHALLENGE 04: Async Error Handling - CRITICAL FOR INTERVIEWS
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ try-catch ONLY catches SYNCHRONOUS errors!                                 ║
 * ║ For async code, you need different strategies:                             ║
 * ║                                                                            ║
 * ║   Callbacks:    error-first pattern     fn((err, data) => {})             ║
 * ║   Promises:     .catch()                promise.catch(err => {})          ║
 * ║   Async/await:  try-catch inside async  try { await x } catch {}          ║
 * ║                                                                            ║
 * ║   ⚠️ THIS DOES NOT WORK:                                                   ║
 * ║   try {                                                                    ║
 * ║     setTimeout(() => { throw new Error('Async!'); }, 0);                   ║
 * ║   } catch (e) {                                                            ║
 * ║     // NEVER catches the error!                                            ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. The Problem: try-catch doesn't catch async errors
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 1. The Async Error Problem ═══\n");

// This FAILS silently!
try {
  setTimeout(() => {
    // This error is thrown AFTER try-catch finishes!
    // throw new Error('Async error'); // Uncomment to see crash
  }, 100);
  console.log('A: try block finished (setTimeout scheduled)');
} catch (e) {
  console.log('B: This NEVER runs for async errors');
}

console.log('C: Code continues, no error caught\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY try-catch FAILS FOR ASYNC                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   TIMELINE:                                                                 │
 * │                                                                             │
 * │   Time 0ms:                                                                 │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  TRY block starts                                                   │   │
 * │   │  setTimeout schedules callback for later                            │   │
 * │   │  TRY block ends ← No error yet!                                     │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │   Time 100ms:                                                               │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  Callback runs in a NEW execution context                           │   │
 * │   │  throw new Error('Async!')                                          │   │
 * │   │  ⚠️ The original try-catch is GONE!                                 │   │
 * │   │  ⚠️ No catch block to handle this!                                  │   │
 * │   │  ⚠️ UNCAUGHT ERROR - crashes the program!                           │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │   The try-catch and the callback run in DIFFERENT execution contexts.     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 2. Callback Pattern: Error-First
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 2. Error-First Callbacks ═══\n");

// Node.js style: callback(error, result)
function readFileAsync(path, callback) {
  setTimeout(() => {
    if (path === 'missing.txt') {
      callback(new Error('File not found: ' + path), null);
    } else {
      callback(null, 'File contents here');
    }
  }, 10);
}

// Usage
readFileAsync('data.txt', (err, data) => {
  if (err) {
    console.log('D: Error:', err.message);
    return;  // Important! Stop execution
  }
  console.log('E: Data:', data);
});

readFileAsync('missing.txt', (err, data) => {
  if (err) {
    console.log('F: Error:', err.message);
    return;
  }
  console.log('G: Data:', data);
});

// Wait for callbacks
setTimeout(() => console.log(''), 50);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR-FIRST CALLBACK PATTERN                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function asyncOp(callback) {                                              │
 * │     // On success:                                                          │
 * │     callback(null, result);     // Error is null                           │
 * │                                                                             │
 * │     // On failure:                                                          │
 * │     callback(error, null);      // Error comes first                       │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Caller MUST check error first:                                         │
 * │   asyncOp((err, data) => {                                                  │
 * │     if (err) {                                                              │
 * │       // Handle error                                                       │
 * │       return;  // ← CRITICAL: stop execution!                               │
 * │     }                                                                       │
 * │     // Use data safely                                                      │
 * │   });                                                                       │
 * │                                                                             │
 * │   COMMON MISTAKE: Forgetting to return after error!                        │
 * │   if (err) { log(err); }  // ← Bug! Code continues with bad data!          │
 * │   if (err) { log(err); return; }  // ← Correct!                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 3. Promise: .catch() handler
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ 3. Promise .catch() ═══\n");

  function fetchData(shouldFail) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error('Network request failed'));
        } else {
          resolve({ data: 'Success!' });
        }
      }, 10);
    });
  }

  // Method 1: .then().catch()
  fetchData(false)
    .then(result => console.log('H: Success:', result.data))
    .catch(err => console.log('I: Error:', err.message));

  fetchData(true)
    .then(result => console.log('J: Success:', result.data))
    .catch(err => console.log('K: Error:', err.message));

}, 100);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PROMISE ERROR HANDLING                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │                          PROMISE                                    │   │
 * │   │                                                                     │   │
 * │   │  resolve(value) ─────────► .then(value => {})                      │   │
 * │   │                                    │                                │   │
 * │   │                                    ▼                                │   │
 * │   │  reject(error) ──────────────► .catch(error => {})                 │   │
 * │   │                                                                     │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │   .catch() catches:                                                         │
 * │   • Errors from reject()                                                    │
 * │   • Thrown errors inside .then()                                            │
 * │   • Thrown errors inside previous .catch()                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 4. Promise chain error handling
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("\n═══ 4. Promise Chain Errors ═══\n");

  Promise.resolve(1)
    .then(x => {
      console.log('L: Step 1:', x);
      return x + 1;
    })
    .then(x => {
      console.log('M: Step 2:', x);
      throw new Error('Failed at step 2!');  // Error in chain
    })
    .then(x => {
      console.log('N: Step 3:', x);  // SKIPPED!
      return x + 1;
    })
    .catch(err => {
      console.log('O: Caught:', err.message);
      return 'recovered';  // Can recover and continue!
    })
    .then(x => {
      console.log('P: After catch:', x);  // Runs with 'recovered'
    });

}, 200);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PROMISE CHAIN ERROR FLOW                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   .then(1) ──────► .then(2) ─── throw ───► .then(3)                        │
 * │       │               │            │          │                             │
 * │       │               │            │    ┌─────┘                             │
 * │       │               │            │    │  SKIPPED!                        │
 * │       │               │            ▼    ▼                                   │
 * │       │               │        .catch() ──► .then(4)                       │
 * │       │               │            │           │                            │
 * │       │               │            │   ┌───────┘                            │
 * │       │               │            │   │  Runs with catch return value     │
 * │       │               │            ▼   ▼                                    │
 * │                                                                             │
 * │   IMPORTANT:                                                                │
 * │   • Error "jumps" to nearest .catch(), skipping .then()s                   │
 * │   • .catch() can recover by returning a value                              │
 * │   • Chain continues after .catch() if it doesn't throw                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 5. async/await with try-catch
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(async () => {
  console.log("═══ 5. async/await try-catch ═══\n");

  function fetchUser(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id === 0) reject(new Error('Invalid user ID'));
        else resolve({ id, name: 'User ' + id });
      }, 10);
    });
  }

  // try-catch works with await!
  async function getUser(id) {
    try {
      const user = await fetchUser(id);
      console.log('Q: User:', user.name);
      return user;
    } catch (error) {
      console.log('R: Error:', error.message);
      return null;
    }
  }

  await getUser(1);
  await getUser(0);

  console.log('');
}, 350);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ async/await ERROR HANDLING                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   async function example() {                                                │
 * │     try {                                                                   │
 * │       const a = await promiseA();  // If rejected, goes to catch           │
 * │       const b = await promiseB();  // If rejected, goes to catch           │
 * │       return { a, b };                                                      │
 * │     } catch (error) {                                                       │
 * │       // Catches rejections from ANY await above                            │
 * │       // Also catches any thrown errors                                     │
 * │       return null;                                                          │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │   WHY async/await is better for error handling:                            │
 * │   ✓ Looks like synchronous code                                             │
 * │   ✓ Single catch for multiple operations                                    │
 * │   ✓ Easy to add finally block                                               │
 * │   ✓ Stack traces are cleaner                                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 6. Multiple async operations
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(async () => {
  console.log("═══ 6. Multiple Async Errors ═══\n");

  const delay = (ms, value, fail = false) =>
    new Promise((resolve, reject) =>
      setTimeout(() => fail ? reject(new Error(`Failed: ${value}`)) : resolve(value), ms)
    );

  // Promise.all - fails fast on first error
  console.log('S: Testing Promise.all:');
  try {
    const results = await Promise.all([
      delay(10, 'A'),
      delay(20, 'B', true),  // This fails!
      delay(30, 'C')
    ]);
    console.log('   Results:', results);
  } catch (e) {
    console.log('   Error:', e.message);
  }

  // Promise.allSettled - never rejects, shows all results
  console.log('T: Testing Promise.allSettled:');
  const settled = await Promise.allSettled([
    delay(10, 'A'),
    delay(20, 'B', true),
    delay(30, 'C')
  ]);
  settled.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      console.log(`   [${i}] Success:`, result.value);
    } else {
      console.log(`   [${i}] Failed:`, result.reason.message);
    }
  });

  console.log('');
}, 450);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Promise.all vs Promise.allSettled                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Promise.all([p1, p2, p3])                                                 │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  • FAILS FAST: Rejects immediately when ANY promise rejects        │   │
 * │   │  • You only get the FIRST error                                    │   │
 * │   │  • Other promises continue (but results are lost)                  │   │
 * │   │  • Use when: All operations must succeed                           │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │   Promise.allSettled([p1, p2, p3])                                          │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  • NEVER rejects                                                   │   │
 * │   │  • Waits for ALL promises                                          │   │
 * │   │  • Returns: [{ status, value/reason }, ...]                        │   │
 * │   │  • Use when: Want results of all, even failures                    │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 7. Unhandled Promise Rejections
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ 7. Unhandled Rejections ═══\n");

  // Global handler for unhandled promise rejections (Node.js)
  process.on('unhandledRejection', (reason, promise) => {
    console.log('U: Unhandled Rejection:', reason.message);
  });

  // This promise has no .catch()!
  // Promise.reject(new Error('No handler!')); // Uncomment to test

  console.log('V: Set up unhandledRejection listener');
  console.log('   In production, log these and alert!\n');

}, 550);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ UNHANDLED REJECTION DANGER                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // These are DANGEROUS - silent failures!                                 │
 * │                                                                             │
 * │   fetch(url);                      // No .catch()                          │
 * │   asyncFunction();                 // No await, no .catch()                │
 * │   promise.then(x => use(x));       // No .catch() at end                   │
 * │                                                                             │
 * │   NODE.JS (>= 15): Unhandled rejections CRASH the process!                 │
 * │                                                                             │
 * │   ALWAYS:                                                                   │
 * │   • Add .catch() to promise chains                                          │
 * │   • Use try-catch with await                                                │
 * │   • Set up global unhandledRejection handler as safety net                 │
 * │                                                                             │
 * │   // Safety net:                                                            │
 * │   process.on('unhandledRejection', (reason) => {                           │
 * │     logger.error('Unhandled rejection', reason);                           │
 * │     // In production: alert, don't crash                                   │
 * │   });                                                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "try-catch only catches synchronous errors. For async code:                │
 * │                                                                             │
 * │  Callbacks: Use error-first pattern - callback(err, data). Always          │
 * │  check error first and return early to prevent using bad data.             │
 * │                                                                             │
 * │  Promises: Use .catch() at the end of chains. Errors propagate             │
 * │  through the chain until caught. .catch() can recover by returning         │
 * │  a value, allowing the chain to continue.                                   │
 * │                                                                             │
 * │  async/await: Wrap awaits in try-catch. This catches rejections            │
 * │  from any awaited promise. It reads like sync code and gives better        │
 * │  stack traces.                                                              │
 * │                                                                             │
 * │  For parallel operations:                                                   │
 * │  - Promise.all fails fast on first rejection                                │
 * │  - Promise.allSettled waits for all, never rejects                         │
 * │                                                                             │
 * │  Always set up a global unhandledRejection handler as a safety net.        │
 * │  In Node.js 15+, unhandled rejections crash the process!"                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/13-error-handling/04-async-errors.js
 */
