/**
 * CHALLENGE 10: Error Handling Interview Q&A
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW QUESTIONS - ERROR HANDLING                                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Master these questions to ace error handling interviews!                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q1: What's the output? Why?
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Q1: try-catch with setTimeout ═══\n");

try {
  setTimeout(() => {
    console.log('A: Inside setTimeout');
    // throw new Error('Async error');  // Would crash if uncommented
  }, 100);
  console.log('B: After setTimeout');
} catch (e) {
  console.log('C: Error caught:', e.message);
}
console.log('D: After try-catch\n');

/**
 * OUTPUT: B, D, A (C never runs)
 *
 * WHY: setTimeout callback runs in a different execution context.
 * The try-catch has already finished by the time the callback executes.
 * To catch async errors, use try-catch INSIDE the callback, or use Promises.
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q2: What's the output?
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ Q2: Promise .then error ═══\n");

  Promise.resolve('start')
    .then(val => {
      console.log('E:', val);
      throw new Error('Error in then');
    })
    .then(val => {
      console.log('F:', val);  // Skipped!
    })
    .catch(e => {
      console.log('G: Caught:', e.message);
      return 'recovered';
    })
    .then(val => {
      console.log('H:', val);
    });

  setTimeout(() => console.log(''), 50);

}, 200);

/**
 * OUTPUT: E: start, G: Caught: Error in then, H: recovered
 *
 * WHY: Error in .then() skips to nearest .catch().
 * .catch() returns a value, so chain continues with 'recovered'.
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q3: What happens when you don't handle a rejected Promise?
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ Q3: Unhandled Promise Rejection ═══\n");

  console.log(`
  // This code:
  Promise.reject(new Error('Unhandled!'));

  // In Node.js < 15: Warning printed, process continues
  // In Node.js >= 15: Process crashes with unhandledRejection

  // Best practice: Always add .catch() or use process.on('unhandledRejection')
  `);

}, 350);


// ═══════════════════════════════════════════════════════════════════════════════
// Q4: Difference between throw and reject?
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ Q4: throw vs reject ═══\n");

  // In async function, they're equivalent
  async function withThrow() {
    throw new Error('throw');
  }

  async function withReject() {
    return Promise.reject(new Error('reject'));
  }

  Promise.all([
    withThrow().catch(e => console.log('I: throw caught:', e.message)),
    withReject().catch(e => console.log('J: reject caught:', e.message))
  ]).then(() => console.log(''));

}, 450);

/**
 * ANSWER: In async functions, throw and return Promise.reject() are equivalent.
 * Both result in the async function returning a rejected Promise.
 *
 * DIFFERENCE: In regular Promise constructor with setTimeout:
 * - throw after async operation doesn't work (error is uncaught)
 * - reject() works correctly
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q5: finally return value
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ Q5: finally return ═══\n");

  function test1() {
    try {
      return 'try';
    } finally {
      console.log('K: finally runs');
    }
  }

  function test2() {
    try {
      return 'try';
    } finally {
      return 'finally';
    }
  }

  function test3() {
    try {
      throw new Error('error');
    } catch (e) {
      return 'catch';
    } finally {
      return 'finally';
    }
  }

  console.log('L: test1():', test1());
  console.log('M: test2():', test2());
  console.log('N: test3():', test3());
  console.log('');

}, 550);

/**
 * ANSWERS:
 * test1(): finally runs, returns 'try' (finally runs but doesn't override)
 * test2(): returns 'finally' (finally return OVERRIDES try return)
 * test3(): returns 'finally' (finally return OVERRIDES catch return AND hides error!)
 *
 * RULE: Never use return in finally - it causes confusing behavior!
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q6: Error types
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ Q6: Name the error type ═══\n");

  const scenarios = [
    ['undeclaredVar', () => console.log(undeclaredVar)],
    ['null.property', () => null.foo],
    ['JSON.parse bad', () => JSON.parse('{invalid}')],
    ['Array(-1)', () => new Array(-1)],
    ['(42)()', () => (42)()],
    ['decodeURI bad', () => decodeURIComponent('%')]
  ];

  scenarios.forEach(([name, fn]) => {
    try {
      fn();
    } catch (e) {
      console.log(`O: ${name.padEnd(15)} → ${e.name}`);
    }
  });

  console.log('');

}, 650);

/**
 * ANSWERS:
 * undeclaredVar   → ReferenceError (variable doesn't exist)
 * null.property   → TypeError (can't access property of null)
 * JSON.parse bad  → SyntaxError (invalid JSON syntax)
 * Array(-1)       → RangeError (invalid array length)
 * (42)()          → TypeError (number is not a function)
 * decodeURI bad   → URIError (malformed URI sequence)
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q7: fetch error handling
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ Q7: fetch doesn't throw on 404 ═══\n");

  console.log(`
  // WRONG - 404 goes to .then, not .catch!
  fetch('/api/users/999')
    .then(res => res.json())  // 404 response arrives here!
    .catch(err => console.log(err));

  // CORRECT - Check response.ok
  fetch('/api/users/999')
    .then(res => {
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      return res.json();
    })
    .catch(err => console.log(err));
  `);
  console.log('');

}, 750);

/**
 * KEY POINT: fetch only rejects on network failure, not HTTP errors.
 * Always check response.ok or response.status!
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q8: Custom Error class
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ Q8: Write a Custom Error ═══\n");

  // Best practice custom error
  class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
      super(message);
      this.name = this.constructor.name;  // Important!
      this.statusCode = statusCode;
      this.code = code;
      this.isOperational = true;

      // Capture stack trace (Node.js)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }

  class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
      super(`${resource} not found`, 404, 'NOT_FOUND');
    }
  }

  // Test
  const err = new NotFoundError('User');
  console.log('P: name:', err.name);
  console.log('Q: message:', err.message);
  console.log('R: statusCode:', err.statusCode);
  console.log('S: code:', err.code);
  console.log('T: instanceof Error:', err instanceof Error);
  console.log('U: instanceof AppError:', err instanceof AppError);
  console.log('');

}, 850);


// ═══════════════════════════════════════════════════════════════════════════════
// Q9: Promise.all vs Promise.allSettled
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(async () => {
  console.log("═══ Q9: Promise.all vs allSettled ═══\n");

  const p1 = Promise.resolve('A');
  const p2 = Promise.reject(new Error('B'));
  const p3 = Promise.resolve('C');

  // Promise.all - fails fast
  console.log('V: Promise.all:');
  try {
    const results = await Promise.all([p1, p2, p3]);
    console.log('   Results:', results);
  } catch (e) {
    console.log('   Error:', e.message, '(other results lost)');
  }

  // Promise.allSettled - waits for all
  console.log('W: Promise.allSettled:');
  const settled = await Promise.allSettled([
    Promise.resolve('A'),
    Promise.reject(new Error('B')),
    Promise.resolve('C')
  ]);
  console.log('   Results:', settled.map(r =>
    r.status === 'fulfilled' ? r.value : `ERR:${r.reason.message}`
  ));

  console.log('');

}, 950);

/**
 * ANSWER:
 * Promise.all: Rejects immediately when ANY promise rejects. Fast-fail.
 * Promise.allSettled: Waits for ALL to complete. Returns status for each.
 *
 * Use all() when you need ALL to succeed.
 * Use allSettled() when you want results regardless of individual failures.
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q10: Global error handling in Node.js
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("═══ Q10: Global Error Handling ═══\n");

  console.log(`
  // For uncaught synchronous errors:
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Log error, close connections, then:
    process.exit(1);  // Exit! App state is undefined
  });

  // For unhandled Promise rejections:
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    // In Node 15+, this throws and crashes by default
  });

  // For graceful shutdown:
  process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await server.close();
    await db.disconnect();
    process.exit(0);
  });
  `);

  console.log('');

}, 1050);


// ═══════════════════════════════════════════════════════════════════════════════
// QUICK REFERENCE CHEAT SHEET
// ═══════════════════════════════════════════════════════════════════════════════

setTimeout(() => {
  console.log("╔══════════════════════════════════════════════════════════════════╗");
  console.log("║               ERROR HANDLING CHEAT SHEET                         ║");
  console.log("╠══════════════════════════════════════════════════════════════════╣");
  console.log("║                                                                  ║");
  console.log("║ SYNC ERRORS:                                                     ║");
  console.log("║   try { } catch (e) { } finally { }                             ║");
  console.log("║                                                                  ║");
  console.log("║ ASYNC ERRORS:                                                    ║");
  console.log("║   Promises:  .catch(e => { })                                   ║");
  console.log("║   async/await: try { await x } catch { }                        ║");
  console.log("║                                                                  ║");
  console.log("║ ERROR TYPES:                                                     ║");
  console.log("║   ReferenceError - variable not found                           ║");
  console.log("║   TypeError      - wrong type (null.foo, 42())                  ║");
  console.log("║   SyntaxError    - bad JSON/eval                                ║");
  console.log("║   RangeError     - out of bounds (Array(-1))                    ║");
  console.log("║                                                                  ║");
  console.log("║ GOTCHAS:                                                         ║");
  console.log("║   • try-catch doesn't catch async errors                        ║");
  console.log("║   • fetch doesn't throw on 404/500                              ║");
  console.log("║   • finally return overrides try/catch                          ║");
  console.log("║   • forEach doesn't await async callbacks                       ║");
  console.log("║                                                                  ║");
  console.log("║ PATTERNS:                                                        ║");
  console.log("║   Retry     - exponential backoff for transient errors          ║");
  console.log("║   Fallback  - backup when primary fails                         ║");
  console.log("║   Circuit   - fail fast when service is down                    ║");
  console.log("║   Timeout   - Promise.race with timeout promise                 ║");
  console.log("║                                                                  ║");
  console.log("║ CUSTOM ERROR:                                                    ║");
  console.log("║   class MyError extends Error {                                 ║");
  console.log("║     constructor(msg) {                                          ║");
  console.log("║       super(msg);                                               ║");
  console.log("║       this.name = this.constructor.name;                        ║");
  console.log("║     }                                                           ║");
  console.log("║   }                                                             ║");
  console.log("║                                                                  ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝\n");

  console.log("═══════════════════════════════════════════════════════════════════");
  console.log("    Completed: docs/13-error-handling/");
  console.log("    Next: docs/14-destructuring-spread/");
  console.log("═══════════════════════════════════════════════════════════════════\n");

}, 1150);


/**
 * RUN: node docs/13-error-handling/10-interview-qa.js
 */
