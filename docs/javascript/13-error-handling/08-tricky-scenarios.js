/**
 * CHALLENGE 08: Tricky Error Handling Scenarios
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMMON INTERVIEW TRAPS                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ These scenarios trip up even experienced developers.                       ║
 * ║ Understand these, and you'll ace error handling questions!                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 1: Error in catch block
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Scenario 1: Error in catch block ═══\n");

// What happens if catch block throws?

try {
  throw new Error('Original error');
} catch (e) {
  console.log('A: Caught:', e.message);
  // throw new Error('Error in catch!');  // This would be UNCAUGHT!
}

console.log('B: After try-catch\n');

// Safer pattern: nested try-catch
try {
  throw new Error('Original error');
} catch (e) {
  try {
    // Risky logging operation
    throw new Error('Logging failed');
  } catch (logError) {
    console.log('C: Logging error caught:', logError.message);
  }
}

console.log('D: Safe after nested try-catch\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LESSON: Errors in catch blocks are NOT caught by the same try-catch        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   try {                                                                     │
 * │     throw new Error('A');        ──────►  catch                            │
 * │   } catch (e) {                                                             │
 * │     throw new Error('B');        ──────►  UNCAUGHT! (no outer catch)       │
 * │   }                                                                         │
 * │                                                                             │
 * │   SOLUTION: Wrap risky catch code in its own try-catch                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 2: finally return overrides
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Scenario 2: finally return ═══\n");

function trickyReturn() {
  try {
    return 'from try';
  } finally {
    return 'from finally';  // This wins!
  }
}

function trickyThrow() {
  try {
    throw new Error('try error');
  } catch (e) {
    return 'from catch';
  } finally {
    return 'from finally';  // This wins and SWALLOWS the error!
  }
}

console.log('E: trickyReturn():', trickyReturn());
console.log('F: trickyThrow():', trickyThrow());  // Error is gone!
console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LESSON: return in finally OVERRIDES try/catch return                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   try { return 'A'; } finally { return 'B'; }  →  returns 'B'              │
 * │                                                                             │
 * │   try { throw Error('A'); }                                                │
 * │   catch { return 'B'; }                                                     │
 * │   finally { return 'C'; }                      →  returns 'C' (error lost!)│
 * │                                                                             │
 * │   ╔═══════════════════════════════════════════════════════════════════╗     │
 * │   ║ NEVER use return in finally - it hides errors and confuses!      ║     │
 * │   ╚═══════════════════════════════════════════════════════════════════╝     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 3: async/await in forEach
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Scenario 3: async/await in forEach ═══\n");

async function wrongForEach() {
  const items = [1, 2, 3];

  // This does NOT wait!
  items.forEach(async (item) => {
    await new Promise(r => setTimeout(r, 10));
    console.log('G: Item:', item);
  });

  console.log('H: Done (but items not processed yet!)');
}

async function correctForOf() {
  const items = [1, 2, 3];

  // This waits properly
  for (const item of items) {
    await new Promise(r => setTimeout(r, 10));
    console.log('I: Item:', item);
  }

  console.log('J: Actually done');
}

wrongForEach();

setTimeout(() => {
  console.log('');
  correctForOf().then(() => console.log(''));
}, 100);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LESSON: forEach doesn't wait for async callbacks                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // WRONG - fires all at once, doesn't wait                               │
 * │   array.forEach(async (item) => {                                          │
 * │     await something(item);                                                  │
 * │   });                                                                       │
 * │                                                                             │
 * │   // CORRECT - sequential, waits each iteration                            │
 * │   for (const item of array) {                                              │
 * │     await something(item);                                                  │
 * │   }                                                                         │
 * │                                                                             │
 * │   // CORRECT - parallel, waits for all                                      │
 * │   await Promise.all(array.map(async (item) => {                            │
 * │     await something(item);                                                  │
 * │   }));                                                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 4: Swallowed errors in Promise chains
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ Scenario 4: Swallowed Promise errors ═══\n");

  // Error is swallowed!
  Promise.resolve()
    .then(() => {
      throw new Error('Oops!');
    })
    .then(() => {
      console.log('K: This never runs');
    });
  // No .catch() - error is lost!

  // Fixed version
  Promise.resolve()
    .then(() => {
      throw new Error('Oops!');
    })
    .then(() => {
      console.log('L: This never runs');
    })
    .catch(e => {
      console.log('M: Caught:', e.message);
    });

  setTimeout(() => console.log(''), 50);

}, 300);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LESSON: Always end Promise chains with .catch()                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // DANGEROUS - errors disappear!                                          │
 * │   fetch(url).then(r => r.json()).then(doSomething);                        │
 * │                                                                             │
 * │   // SAFE - errors are caught                                               │
 * │   fetch(url).then(r => r.json()).then(doSomething).catch(handleError);     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 5: Error in Promise constructor
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ Scenario 5: Error in Promise constructor ═══\n");

  // Sync error in Promise constructor is caught
  new Promise((resolve, reject) => {
    throw new Error('Sync error in constructor');
  }).catch(e => {
    console.log('N: Caught sync error:', e.message);
  });

  // But async error is NOT caught!
  new Promise((resolve, reject) => {
    setTimeout(() => {
      // This throws OUTSIDE the Promise!
      // throw new Error('Async error in constructor');  // UNCAUGHT!
      reject(new Error('Async error - must use reject!'));  // Correct
    }, 10);
  }).catch(e => {
    console.log('O: Caught async error:', e.message);
  });

  setTimeout(() => console.log(''), 50);

}, 400);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LESSON: Use reject() for async errors in Promise constructor               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   new Promise((resolve, reject) => {                                        │
 * │     throw new Error('X');  // ← Caught by Promise                          │
 * │   });                                                                       │
 * │                                                                             │
 * │   new Promise((resolve, reject) => {                                        │
 * │     setTimeout(() => {                                                      │
 * │       throw new Error('X');  // ← NOT caught! Crashes!                     │
 * │       reject(new Error('X')); // ← Use this instead                        │
 * │     });                                                                     │
 * │   });                                                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 6: throw vs reject
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ Scenario 6: throw vs reject ═══\n");

  // In async function, throw and reject are the same
  async function usingThrow() {
    throw new Error('Using throw');
  }

  async function usingReject() {
    return Promise.reject(new Error('Using reject'));
  }

  usingThrow().catch(e => console.log('P: throw:', e.message));
  usingReject().catch(e => console.log('Q: reject:', e.message));

  // But in regular Promise, throw after async operation doesn't work!
  function brokenPromise() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          throw new Error('Async throw');
        } catch (e) {
          reject(e);  // Must manually catch and reject
        }
      }, 10);
    });
  }

  brokenPromise().catch(e => console.log('R: Manual catch-reject:', e.message));

  setTimeout(() => console.log(''), 50);

}, 500);


// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 7: Multiple catch blocks
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ Scenario 7: Multiple catches ═══\n");

  // Each .catch returns a new resolved promise!
  Promise.reject(new Error('First'))
    .catch(e => {
      console.log('S: First catch:', e.message);
      throw new Error('Second');  // Throw new error
    })
    .catch(e => {
      console.log('T: Second catch:', e.message);
      return 'recovered';  // Recover
    })
    .then(x => {
      console.log('U: After catches:', x);
    })
    .catch(e => {
      console.log('V: Final catch:', e.message);
    });

  setTimeout(() => console.log(''), 50);

}, 600);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LESSON: .catch() returns a new Promise                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   .catch(e => value)     →  Returns Promise.resolve(value)                 │
 * │   .catch(e => throw e)   →  Returns Promise.reject(e)                      │
 * │                                                                             │
 * │   Chain can recover after catch by returning a value!                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 8: typeof and instanceof with errors
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ Scenario 8: Error type checking ═══\n");

  try {
    throw 'string error';  // Non-Error throw
  } catch (e) {
    console.log('W: typeof:', typeof e);           // 'string'
    console.log('X: instanceof Error:', e instanceof Error);  // false
    console.log('Y: Has message?:', e.message);    // undefined
    console.log('Z: Has stack?:', e.stack);        // undefined
  }

  console.log('');

  // Safe error handling
  function safeHandle(e) {
    if (e instanceof Error) {
      return { message: e.message, stack: e.stack };
    }
    return { message: String(e), stack: null };
  }

  try {
    throw 'weird error';
  } catch (e) {
    const info = safeHandle(e);
    console.log('AA: Safe handled:', info);
  }

  console.log('');

}, 700);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LESSON: Catch block can receive non-Error values                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   throw 'string';   → e is string, no .message, no .stack                  │
 * │   throw 42;         → e is number                                           │
 * │   throw null;       → e is null, e.message crashes!                        │
 * │                                                                             │
 * │   Always check: if (e instanceof Error) before accessing properties        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO 9: Promise.all vs Promise.allSettled
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(async () => {
  console.log("═══ Scenario 9: Promise.all short-circuits ═══\n");

  const delay = (ms, val, fail = false) =>
    new Promise((res, rej) =>
      setTimeout(() => fail ? rej(new Error(val)) : res(val), ms)
    );

  // Promise.all - one failure = all fail
  console.log('AB: Promise.all with one failure:');
  try {
    const results = await Promise.all([
      delay(10, 'A'),
      delay(20, 'B', true),  // Fails!
      delay(30, 'C')
    ]);
    console.log('   Results:', results);
  } catch (e) {
    console.log('   Error:', e.message, '(other results lost!)');
  }

  // Promise.allSettled - all complete, no throw
  console.log('AC: Promise.allSettled:');
  const settled = await Promise.allSettled([
    delay(10, 'A'),
    delay(20, 'B', true),
    delay(30, 'C')
  ]);
  console.log('   Results:', settled.map(r =>
    r.status === 'fulfilled' ? r.value : `ERR: ${r.reason.message}`
  ));

  console.log('');

}, 800);


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW SUMMARY                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Catch block errors are NOT caught by same try-catch                     │
 * │ 2. Return in finally OVERRIDES try/catch returns                           │
 * │ 3. forEach doesn't wait for async callbacks                                 │
 * │ 4. Always end Promise chains with .catch()                                  │
 * │ 5. Use reject() for async errors in Promise constructor                     │
 * │ 6. .catch() returns a new Promise (can recover)                             │
 * │ 7. Catch can receive non-Error values (check instanceof)                    │
 * │ 8. Promise.all fails fast, Promise.allSettled waits for all                │
 * │ 9. fetch doesn't throw on 404/500 (check response.ok)                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/13-error-handling/08-tricky-scenarios.js
 */
