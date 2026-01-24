/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE 8: ASYNC JAVASCRIPT - COMPREHENSIVE INTERVIEW Q&A
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This file contains 50+ interview questions covering all async concepts.
 * Each question includes the answer, code examples, and interviewer tips.
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("   FILE 8: ASYNC JAVASCRIPT - COMPREHENSIVE INTERVIEW Q&A");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                    QUESTION CATEGORIES OVERVIEW                         │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
 * │  │   CALLBACKS     │  │    PROMISES     │  │   ASYNC/AWAIT   │         │
 * │  │   Q1 - Q10      │  │   Q11 - Q25     │  │   Q26 - Q35     │         │
 * │  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘         │
 * │           │                    │                    │                   │
 * │           └────────────────────┼────────────────────┘                   │
 * │                                ▼                                        │
 * │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
 * │  │   GENERATORS    │  │   EVENT LOOP    │  │    PATTERNS     │         │
 * │  │   Q36 - Q40     │  │   Q41 - Q45     │  │   Q46 - Q55     │         │
 * │  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 1: CALLBACKS (Q1 - Q10)                       ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q1: What is a callback function?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * A callback is a function passed as an argument to another function,
 * which gets executed after the outer function completes its operation.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                     CALLBACK VISUALIZATION                           │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │    function doTask(callback) ───────────┐                           │
 * │         │                               │                           │
 * │         ▼                               │                           │
 * │    [Execute Task]                       │                           │
 * │         │                               │                           │
 * │         ▼                               ▼                           │
 * │    callback() ◄──────────────── function() { ... }                  │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * INTERVIEWER TIP: Follow up with "Why are callbacks used in JavaScript?"
 */

// Example
function fetchData(callback) {
    setTimeout(() => {
        callback("Data received");
    }, 100);
}

fetchData((data) => console.log("Q1 Answer:", data));

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q2: What is callback hell and how do you avoid it?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Callback hell (or pyramid of doom) is deeply nested callbacks that
 * make code hard to read and maintain.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                      CALLBACK HELL PATTERN                           │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │   asyncOp1(function(result1) {                                      │
 * │       asyncOp2(result1, function(result2) {                         │
 * │           asyncOp3(result2, function(result3) {                     │
 * │               asyncOp4(result3, function(result4) {    ◄── HELL!    │
 * │                   // More nesting...                                │
 * │               });                                                   │
 * │           });                                                       │
 * │       });                                                           │
 * │   });                                                               │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * SOLUTIONS:
 * 1. Named functions
 * 2. Promises
 * 3. async/await
 * 4. Control flow libraries (async.js)
 */

// Solution with Promises
const asyncOp = (val) => Promise.resolve(val + 1);
asyncOp(1)
    .then(asyncOp)
    .then(asyncOp)
    .then(result => console.log("Q2 Answer: Flattened with Promises:", result));

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q3: What is the error-first callback pattern?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * A Node.js convention where the first parameter of a callback is
 * reserved for an error object (null if success).
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                  ERROR-FIRST CALLBACK SIGNATURE                      │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │   callback(error, result)                                           │
 * │              │      │                                               │
 * │              ▼      ▼                                               │
 * │   ┌─────────────────────────────┐                                   │
 * │   │ if error:                   │                                   │
 * │   │   error = Error object      │                                   │
 * │   │   result = undefined        │                                   │
 * │   │                             │                                   │
 * │   │ if success:                 │                                   │
 * │   │   error = null              │                                   │
 * │   │   result = actual data      │                                   │
 * │   └─────────────────────────────┘                                   │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

function readFile(filename, callback) {
    setTimeout(() => {
        if (filename === "missing.txt") {
            callback(new Error("File not found"), null);
        } else {
            callback(null, "File contents here");
        }
    }, 100);
}

readFile("test.txt", (err, data) => {
    if (err) {
        console.log("Q3 Error:", err.message);
    } else {
        console.log("Q3 Answer:", data);
    }
});

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q4: What's the difference between synchronous and asynchronous callbacks?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │           SYNC vs ASYNC CALLBACKS COMPARISON                         │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  SYNCHRONOUS                    │  ASYNCHRONOUS                     │
 * │  ═══════════                    │  ════════════                     │
 * │                                 │                                   │
 * │  Executed immediately           │  Executed later (event loop)     │
 * │  Blocks the call stack          │  Non-blocking                    │
 * │  Example: Array.forEach()       │  Example: setTimeout()           │
 * │  Example: Array.map()           │  Example: fetch()                │
 * │                                 │                                   │
 * │  [1,2,3].forEach(cb)            │  setTimeout(cb, 0)               │
 * │         │                       │         │                        │
 * │         ▼                       │         ▼                        │
 * │  cb(1) → cb(2) → cb(3)          │  [Scheduled for later]           │
 * │  (all run before next line)     │  (next line runs first)          │
 * │                                 │                                   │
 * └──────────────────────────────────────────────────────────────────────┘
 */

// Synchronous callback
console.log("Q4 Start");
[1, 2, 3].forEach(x => console.log("Q4 Sync:", x));
console.log("Q4 End");

// Asynchronous callback
setTimeout(() => console.log("Q4 Async: This runs after 'Async End'"), 0);
console.log("Q4 Async End");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q5: How do you convert a callback-based function to a Promise?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER: Wrap the callback in a new Promise, calling resolve/reject.
 * Node.js also provides util.promisify().
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                    PROMISIFICATION PATTERN                           │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  function promisified(args) {                                       │
 * │      return new Promise((resolve, reject) => {                      │
 * │          callbackFn(args, (err, result) => {                        │
 * │              if (err) reject(err);                                  │
 * │              else resolve(result);                                  │
 * │          });                                                        │
 * │      });                                                            │
 * │  }                                                                  │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

// Callback version
function getDataCallback(id, callback) {
    setTimeout(() => callback(null, { id, name: "User" }), 100);
}

// Promisified version
function getDataPromise(id) {
    return new Promise((resolve, reject) => {
        getDataCallback(id, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

getDataPromise(1).then(data => console.log("Q5 Answer:", data));

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 2: PROMISES (Q11 - Q25)                       ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q11: What are the three states of a Promise?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                    PROMISE STATE MACHINE                             │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │                      ┌─────────────┐                                │
 * │                      │   PENDING   │                                │
 * │                      │  (initial)  │                                │
 * │                      └──────┬──────┘                                │
 * │                             │                                       │
 * │              ┌──────────────┴──────────────┐                        │
 * │              │                             │                        │
 * │              ▼                             ▼                        │
 * │     ┌──────────────┐              ┌──────────────┐                  │
 * │     │  FULFILLED   │              │   REJECTED   │                  │
 * │     │  (resolved)  │              │   (error)    │                  │
 * │     └──────────────┘              └──────────────┘                  │
 * │            │                             │                          │
 * │            └─────────────┬───────────────┘                          │
 * │                          ▼                                          │
 * │                    ┌───────────┐                                    │
 * │                    │  SETTLED  │  (final, immutable)               │
 * │                    └───────────┘                                    │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * KEY: Once settled, a Promise cannot change state!
 */

const stateDemo = new Promise((resolve, reject) => {
    console.log("Q11: Promise state: PENDING");
    setTimeout(() => {
        resolve("success");
        console.log("Q11: Promise state: FULFILLED");
    }, 100);
});

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q12: What's the difference between Promise.all(), Promise.allSettled(),
 *      Promise.race(), and Promise.any()?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                PROMISE COMBINATOR COMPARISON                         │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  METHOD          │ RESOLVES WHEN      │ REJECTS WHEN                │
 * │  ════════════════│════════════════════│═════════════════════════    │
 * │                  │                    │                             │
 * │  Promise.all()   │ ALL fulfill        │ ANY rejects (fail-fast)    │
 * │                  │                    │                             │
 * │  Promise.        │ ALL settle         │ NEVER rejects              │
 * │  allSettled()    │ (fulfill/reject)   │ (returns status array)     │
 * │                  │                    │                             │
 * │  Promise.race()  │ FIRST settles      │ FIRST settles with         │
 * │                  │ (win or lose)      │ rejection                   │
 * │                  │                    │                             │
 * │  Promise.any()   │ FIRST fulfills     │ ALL reject                  │
 * │                  │                    │ (AggregateError)           │
 * │                  │                    │                             │
 * └──────────────────────────────────────────────────────────────────────┘
 */

const fast = Promise.resolve("fast");
const slow = new Promise(r => setTimeout(() => r("slow"), 200));
const fail = Promise.reject("error");

// Promise.all - fails if any fails
Promise.all([fast, slow]).then(r => console.log("Q12 all:", r));

// Promise.race - first to settle wins
Promise.race([fast, slow]).then(r => console.log("Q12 race:", r));

// Promise.any - first to fulfill
Promise.any([fail, fast, slow]).then(r => console.log("Q12 any:", r));

// Promise.allSettled - all results
Promise.allSettled([fast, fail.catch(e => e)])
    .then(r => console.log("Q12 allSettled: returns all with status"));

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q13: What happens if you don't catch a rejected Promise?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * An unhandled Promise rejection warning/error occurs.
 * In Node.js 15+, it terminates the process by default.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │              UNHANDLED REJECTION CONSEQUENCES                        │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  Browser:                                                           │
 * │  └─► Console error: "Uncaught (in promise): Error..."              │
 * │  └─► window.onunhandledrejection event fires                        │
 * │                                                                      │
 * │  Node.js:                                                           │
 * │  └─► process.on('unhandledRejection') event                        │
 * │  └─► Node 15+: Process exits with code 1                           │
 * │                                                                      │
 * │  ALWAYS handle rejections with .catch() or try/catch!              │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

// Proper handling
Promise.reject("Q13 Error").catch(e => console.log("Q13 Answer: Caught -", e));

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q14: Explain Promise chaining. How is the value passed?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Each .then() returns a new Promise. The return value of one
 * .then() becomes the resolved value for the next.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                   PROMISE CHAIN FLOW                                 │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  Promise.resolve(1)                                                 │
 * │         │                                                           │
 * │         ▼ value = 1                                                 │
 * │  .then(x => x * 2)  ──► returns 2 (wrapped in Promise)             │
 * │         │                                                           │
 * │         ▼ value = 2                                                 │
 * │  .then(x => x + 10) ──► returns 12 (wrapped in Promise)            │
 * │         │                                                           │
 * │         ▼ value = 12                                                │
 * │  .then(console.log) ──► logs 12                                    │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

Promise.resolve(1)
    .then(x => x * 2)
    .then(x => x + 10)
    .then(x => console.log("Q14 Answer:", x)); // 12

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q15: What's the difference between .then(resolve, reject)
 *      and .then(resolve).catch(reject)?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                    ERROR HANDLING DIFFERENCE                         │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  .then(resolve, reject)                                             │
 * │  ══════════════════════                                             │
 * │  reject ONLY handles errors from the Promise itself                 │
 * │  NOT errors thrown in the resolve handler                           │
 * │                                                                      │
 * │  Promise                                                            │
 * │     ├─► success ─► resolve() ─► throws ─► UNCAUGHT! ❌              │
 * │     └─► error ──► reject()                                          │
 * │                                                                      │
 * │  ─────────────────────────────────────────────────────────────────  │
 * │                                                                      │
 * │  .then(resolve).catch(reject)                                       │
 * │  ════════════════════════════                                       │
 * │  catch handles ALL errors (Promise + resolve handler)               │
 * │                                                                      │
 * │  Promise                                                            │
 * │     ├─► success ─► resolve() ─► throws ─► catch() ✓                 │
 * │     └─► error ──────────────────────────► catch() ✓                 │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

// Demonstration
Promise.resolve("data")
    .then(
        data => { throw new Error("Handler error"); },
        err => console.log("Q15: Won't catch handler error")
    )
    .catch(err => console.log("Q15 Answer: Caught by chained catch -", err.message));

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q16: What does .finally() do and when is it useful?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * .finally() runs regardless of fulfillment or rejection.
 * It doesn't receive the value and doesn't modify the chain.
 *
 * USE CASES:
 * - Cleanup (closing connections, clearing loading state)
 * - Logging
 * - UI state reset
 */

Promise.resolve("data")
    .then(x => console.log("Q16 Success:", x))
    .catch(e => console.log("Q16 Error:", e))
    .finally(() => console.log("Q16 Answer: Finally always runs (cleanup)"));

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q17: What is Promise.resolve() and Promise.reject()?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Static methods that create immediately settled Promises.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                                                                      │
 * │  Promise.resolve(value) ──► Creates fulfilled Promise with value    │
 * │  Promise.reject(reason) ──► Creates rejected Promise with reason    │
 * │                                                                      │
 * │  Special case:                                                      │
 * │  Promise.resolve(anotherPromise) ──► Returns that same Promise     │
 * │  (If the value is already a Promise, it's returned as-is)          │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

const resolved = Promise.resolve(42);
resolved.then(v => console.log("Q17 Answer: Resolved value =", v));

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q18: How do you create a timeout wrapper for a Promise?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Use Promise.race() between the original Promise and a timeout Promise.
 */

function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), ms)
    );
    return Promise.race([promise, timeout]);
}

const slowOperation = new Promise(r => setTimeout(() => r("done"), 500));
withTimeout(slowOperation, 100)
    .then(r => console.log("Q18:", r))
    .catch(e => console.log("Q18 Answer:", e.message)); // Timeout

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 3: ASYNC/AWAIT (Q26 - Q35)                    ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q26: What does the async keyword do to a function?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                    ASYNC FUNCTION BEHAVIOR                           │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  async function foo() { return 42; }                                │
 * │                    │                                                │
 * │                    ▼                                                │
 * │  Equivalent to:                                                     │
 * │  function foo() { return Promise.resolve(42); }                     │
 * │                                                                      │
 * │  KEY EFFECTS:                                                       │
 * │  1. Function ALWAYS returns a Promise                               │
 * │  2. Return value is wrapped in Promise.resolve()                   │
 * │  3. Thrown errors become rejected Promises                          │
 * │  4. Enables use of 'await' inside the function                      │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

async function asyncDemo() {
    return 42; // Automatically wrapped in Promise.resolve()
}

asyncDemo().then(v => console.log("Q26 Answer: async returns Promise with value =", v));

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q27: What happens when you await a non-Promise value?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * The value is wrapped in Promise.resolve() first.
 * So `await 42` is equivalent to `await Promise.resolve(42)`.
 */

(async () => {
    const result = await 42; // Same as await Promise.resolve(42)
    console.log("Q27 Answer: await non-Promise =", result);
})();

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q28: How do you handle errors with async/await?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │              ERROR HANDLING METHODS                                  │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  METHOD 1: try/catch (preferred for readability)                    │
 * │  ─────────────────────────────────────────────────                  │
 * │  async function fn() {                                              │
 * │      try {                                                          │
 * │          await riskyOperation();                                    │
 * │      } catch (error) {                                              │
 * │          // Handle error                                            │
 * │      }                                                              │
 * │  }                                                                  │
 * │                                                                      │
 * │  METHOD 2: .catch() on the call                                     │
 * │  ────────────────────────────────                                   │
 * │  fn().catch(error => console.error(error));                         │
 * │                                                                      │
 * │  METHOD 3: Wrapper pattern                                          │
 * │  ─────────────────────────────                                      │
 * │  const [err, data] = await to(riskyOperation());                   │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

// Wrapper pattern implementation
function to(promise) {
    return promise
        .then(data => [null, data])
        .catch(err => [err, null]);
}

(async () => {
    const [err, data] = await to(Promise.reject("oops"));
    console.log("Q28 Answer: Wrapper pattern -", err ? `Error: ${err}` : data);
})();

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q29: What's the difference between sequential and parallel await?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                SEQUENTIAL vs PARALLEL AWAIT                          │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  SEQUENTIAL (one after another):                                    │
 * │  ═══════════════════════════════                                    │
 * │  const a = await fetch1(); // Wait for this                         │
 * │  const b = await fetch2(); // Then wait for this                    │
 * │  // Total time: time1 + time2                                       │
 * │                                                                      │
 * │  Timeline: ████████░░░░░░░░░░░░░░░░                                 │
 * │                    ████████████████                                 │
 * │                                                                      │
 * │  PARALLEL (start all at once):                                      │
 * │  ═════════════════════════════                                      │
 * │  const [a, b] = await Promise.all([fetch1(), fetch2()]);            │
 * │  // Total time: max(time1, time2)                                   │
 * │                                                                      │
 * │  Timeline: ████████████████                                         │
 * │            ████████░░░░░░░░                                         │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

const delay = (ms, val) => new Promise(r => setTimeout(() => r(val), ms));

(async () => {
    // Parallel (faster)
    const start = Date.now();
    const [a, b] = await Promise.all([delay(100, "a"), delay(100, "b")]);
    console.log(`Q29 Answer: Parallel took ~${Date.now() - start}ms`);
})();

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q30: Can you use await at the top level of a module?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Yes, in ES modules (ESM) with top-level await (ES2022+).
 * Not in CommonJS modules.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                    TOP-LEVEL AWAIT                                   │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  // In .mjs file or "type": "module" in package.json               │
 * │                                                                      │
 * │  const data = await fetch('/api/config');                           │
 * │  export const config = await data.json();                           │
 * │                                                                      │
 * │  // Module execution waits for await to complete                    │
 * │  // before other modules that import it can run                     │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

console.log("Q30 Answer: Top-level await works in ES modules (ESM)");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q31: What happens if you forget await before an async function call?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * You get a Promise object instead of the resolved value.
 * The async operation still runs, but you don't wait for it.
 */

async function getData() {
    return "data";
}

(async () => {
    const withoutAwait = getData(); // Returns Promise
    const withAwait = await getData(); // Returns "data"

    console.log("Q31 Without await:", withoutAwait); // Promise
    console.log("Q31 With await:", withAwait); // "data"
})();

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q32: How does async/await work under the hood?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │              ASYNC/AWAIT TRANSFORMATION                              │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  async function example() {          Transforms to:                 │
 * │      const a = await fetchA();   →                                  │
 * │      const b = await fetchB();       function example() {           │
 * │      return a + b;                       return fetchA()            │
 * │  }                                           .then(a => fetchB()   │
 * │                                                  .then(b => a + b))│
 * │                                       }                             │
 * │                                                                      │
 * │  PROCESS:                                                           │
 * │  1. async marks function as returning Promise                       │
 * │  2. At each await, execution suspends                               │
 * │  3. Control returns to caller                                       │
 * │  4. When Promise resolves, execution resumes                        │
 * │  5. Local state is preserved (like a generator)                     │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

console.log("Q32 Answer: async/await is syntactic sugar over Promises + generators");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 4: EVENT LOOP (Q41 - Q45)                     ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q41: Explain the JavaScript Event Loop.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                      EVENT LOOP ARCHITECTURE                         │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  ┌─────────────┐                                                    │
 * │  │ CALL STACK  │ ◄─── Executes synchronous code                     │
 * │  └──────┬──────┘                                                    │
 * │         │                                                           │
 * │         ▼                                                           │
 * │  ┌─────────────────────────────────────────────┐                    │
 * │  │             EVENT LOOP                       │                    │
 * │  │  ┌───────────────────────────────────────┐  │                    │
 * │  │  │                                       │  │                    │
 * │  │  │   1. Execute all sync code            │  │                    │
 * │  │  │              │                        │  │                    │
 * │  │  │              ▼                        │  │                    │
 * │  │  │   2. Empty MICROTASK queue           │  │                    │
 * │  │  │      (Promises, queueMicrotask)      │  │                    │
 * │  │  │              │                        │  │                    │
 * │  │  │              ▼                        │  │                    │
 * │  │  │   3. Execute ONE macrotask           │  │                    │
 * │  │  │      (setTimeout, setInterval, I/O)  │  │                    │
 * │  │  │              │                        │  │                    │
 * │  │  │              └──────► REPEAT ─────────┘  │                    │
 * │  │  │                                       │  │                    │
 * │  │  └───────────────────────────────────────┘  │                    │
 * │  └─────────────────────────────────────────────┘                    │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

console.log("Q41 Demo - Execution Order:");
console.log("1. Sync");

setTimeout(() => console.log("4. Macrotask (setTimeout)"), 0);

Promise.resolve().then(() => console.log("3. Microtask (Promise)"));

console.log("2. Sync");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q42: What's the difference between Microtasks and Macrotasks?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │              MICROTASKS vs MACROTASKS                                │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  MICROTASKS (High Priority)     │  MACROTASKS (Lower Priority)      │
 * │  ══════════════════════════     │  ════════════════════════════     │
 * │  • Promise.then/catch/finally   │  • setTimeout                     │
 * │  • queueMicrotask()             │  • setInterval                    │
 * │  • MutationObserver             │  • setImmediate (Node)            │
 * │  • process.nextTick (Node)      │  • I/O callbacks                  │
 * │                                 │  • UI rendering                   │
 * │  ─────────────────────────────────────────────────────────────────  │
 * │                                                                      │
 * │  EXECUTION ORDER:                                                   │
 * │  1. Sync code completes                                             │
 * │  2. ALL microtasks execute (entire queue drained)                   │
 * │  3. ONE macrotask executes                                          │
 * │  4. Back to step 2                                                  │
 * │                                                                      │
 * │  KEY: Microtasks can starve macrotasks if they keep adding more!    │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

console.log("\nQ42 Demo - Microtask Queue Draining:");

setTimeout(() => console.log("Q42 Macrotask 1"), 0);
setTimeout(() => console.log("Q42 Macrotask 2"), 0);

Promise.resolve().then(() => {
    console.log("Q42 Microtask 1");
    Promise.resolve().then(() => console.log("Q42 Microtask 2 (nested)"));
});

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q43: What is the output of this code?
 * ══════════════════════════════════════════════════════════════════════════
 */

console.log("\nQ43 Classic Interview Question:");

setTimeout(() => console.log("Q43: 5"), 0);

Promise.resolve()
    .then(() => console.log("Q43: 3"))
    .then(() => console.log("Q43: 4"));

console.log("Q43: 1");
console.log("Q43: 2");

// Output: 1, 2, 3, 4, 5
// Explanation: Sync first (1,2), then microtasks (3,4), then macrotask (5)

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q44: What is process.nextTick() and how does it differ from setImmediate?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER (Node.js specific):
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │           NODE.JS TIMING FUNCTIONS                                   │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  process.nextTick()                                                 │
 * │  ══════════════════                                                 │
 * │  • Executes BEFORE any I/O or timers                               │
 * │  • Runs at the END of current operation                             │
 * │  • Before even microtasks!                                          │
 * │  • Can starve the event loop if recursive                           │
 * │                                                                      │
 * │  setImmediate()                                                     │
 * │  ══════════════                                                     │
 * │  • Executes in the CHECK phase of event loop                        │
 * │  • After I/O callbacks                                              │
 * │  • Safer for recursion                                              │
 * │                                                                      │
 * │  Order: nextTick > Microtasks > Macrotasks > setImmediate          │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

if (typeof process !== 'undefined' && process.nextTick) {
    process.nextTick(() => console.log("Q44 nextTick"));
    setImmediate(() => console.log("Q44 setImmediate"));
    Promise.resolve().then(() => console.log("Q44 Promise"));
    // Output: nextTick, Promise, setImmediate
} else {
    console.log("Q44: process.nextTick is Node.js specific");
}

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q45: Can you explain the phases of the Node.js Event Loop?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │               NODE.JS EVENT LOOP PHASES                              │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │    ┌──────────────┐                                                 │
 * │    │   timers     │  ◄── setTimeout, setInterval callbacks          │
 * │    └──────┬───────┘                                                 │
 * │           ▼                                                         │
 * │    ┌──────────────┐                                                 │
 * │    │   pending    │  ◄── I/O callbacks from previous cycle          │
 * │    └──────┬───────┘                                                 │
 * │           ▼                                                         │
 * │    ┌──────────────┐                                                 │
 * │    │   idle/prep  │  ◄── Internal use only                          │
 * │    └──────┬───────┘                                                 │
 * │           ▼                                                         │
 * │    ┌──────────────┐                                                 │
 * │    │    poll      │  ◄── Retrieve new I/O events                    │
 * │    └──────┬───────┘      (blocks here if nothing to do)             │
 * │           ▼                                                         │
 * │    ┌──────────────┐                                                 │
 * │    │    check     │  ◄── setImmediate callbacks                     │
 * │    └──────┬───────┘                                                 │
 * │           ▼                                                         │
 * │    ┌──────────────┐                                                 │
 * │    │    close     │  ◄── Close callbacks (socket.on('close'))       │
 * │    └──────┬───────┘                                                 │
 * │           └──────────► REPEAT                                       │
 * │                                                                      │
 * │  NOTE: process.nextTick runs between EACH phase!                    │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

console.log("Q45 Answer: Node.js has 6 phases: timers → pending → idle → poll → check → close");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 5: GENERATORS (Q36 - Q40)                     ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q36: What is a Generator function?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * A function that can be paused and resumed, producing a sequence of values.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                  GENERATOR EXECUTION FLOW                            │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  function* gen() {         │  const g = gen();                      │
 * │      yield 1;      ────────┼──► g.next() → { value: 1, done: false }│
 * │      yield 2;      ────────┼──► g.next() → { value: 2, done: false }│
 * │      return 3;     ────────┼──► g.next() → { value: 3, done: true } │
 * │  }                         │  g.next() → { value: undefined, done: true }
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

function* numberGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

const gen = numberGenerator();
console.log("Q36 Answer:", gen.next()); // { value: 1, done: false }
console.log("Q36:", gen.next());        // { value: 2, done: false }
console.log("Q36:", gen.next());        // { value: 3, done: false }
console.log("Q36:", gen.next());        // { value: undefined, done: true }

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q37: How do you pass values INTO a generator?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Call .next(value) - the value becomes the result of the yield expression.
 */

function* twoWay() {
    const a = yield "First yield";
    console.log("Q37 Received:", a);
    const b = yield "Second yield";
    console.log("Q37 Received:", b);
}

const tw = twoWay();
console.log("Q37:", tw.next());        // { value: 'First yield', done: false }
console.log("Q37:", tw.next("Hello")); // Logs "Received: Hello", returns { value: 'Second yield'...}
console.log("Q37:", tw.next("World")); // Logs "Received: World", returns { value: undefined, done: true }

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q38: What is yield* and when is it used?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * yield* delegates to another iterable or generator.
 */

function* inner() {
    yield 2;
    yield 3;
}

function* outer() {
    yield 1;
    yield* inner(); // Delegate to inner generator
    yield 4;
}

console.log("Q38 Answer: yield* delegation:", [...outer()]); // [1, 2, 3, 4]

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q39: What is an Async Generator?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Combines async/await with generators. Yields Promises.
 * Consumed with for await...of loop.
 */

async function* asyncNumbers() {
    for (let i = 1; i <= 3; i++) {
        await new Promise(r => setTimeout(r, 50));
        yield i;
    }
}

(async () => {
    console.log("Q39 Async Generator:");
    for await (const num of asyncNumbers()) {
        console.log("Q39 Value:", num);
    }
})();

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q40: How were generators used for async before async/await?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Libraries like 'co' used generators to pause execution at yield
 * and resume when Promises resolved.
 */

function* legacyAsync() {
    const a = yield Promise.resolve(1);
    const b = yield Promise.resolve(2);
    return a + b;
}

// Simple runner (like 'co' library)
function run(genFn) {
    const gen = genFn();

    function step(result) {
        if (result.done) return Promise.resolve(result.value);
        return Promise.resolve(result.value)
            .then(value => step(gen.next(value)));
    }

    return step(gen.next());
}

run(legacyAsync).then(result => console.log("Q40 Answer: Generator-based async result:", result));

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 6: PATTERNS & ADVANCED (Q46 - Q55)            ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q46: Implement a retry mechanism with exponential backoff.
 * ══════════════════════════════════════════════════════════════════════════
 */

async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 100) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            const delay = baseDelay * Math.pow(2, i);
            console.log(`Q46 Retry ${i + 1} after ${delay}ms`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

let attempts = 0;
retryWithBackoff(async () => {
    attempts++;
    if (attempts < 3) throw new Error("Fail");
    return "Success on attempt " + attempts;
}).then(r => console.log("Q46 Answer:", r));

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q47: What is the difference between debounce and throttle?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │              DEBOUNCE vs THROTTLE                                    │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  DEBOUNCE: Wait until calls stop, then execute once                 │
 * │  ═══════════════════════════════════════════════                    │
 * │                                                                      │
 * │  Calls:    ░░█░░█░░█░░█░░░░░░░░░░░░░░░░░░░░░░                      │
 * │  Executes: ░░░░░░░░░░░░░░░░░█░░░░░░░░░░░░░░░░                      │
 * │                            ▲                                        │
 * │                            └── Executes after delay with no calls   │
 * │                                                                      │
 * │  THROTTLE: Execute at most once per time period                     │
 * │  ═══════════════════════════════════════════════                    │
 * │                                                                      │
 * │  Calls:    ░░█░░█░░█░░█░░█░░█░░█░░█░░█░░█░░░░                      │
 * │  Executes: ░░█░░░░░░░░█░░░░░░░░█░░░░░░░░█░░░░                      │
 * │                                                                      │
 * │  USE CASES:                                                         │
 * │  Debounce: Search input, resize event, auto-save                    │
 * │  Throttle: Scroll event, mouse move, API rate limiting              │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

function throttle(fn, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

console.log("Q47 Answer: See code implementation above");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q48: Implement Promise.all() from scratch.
 * ══════════════════════════════════════════════════════════════════════════
 */

function myPromiseAll(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError("Argument must be an array"));
        }

        const results = [];
        let completed = 0;

        if (promises.length === 0) {
            return resolve(results);
        }

        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(value => {
                    results[index] = value;
                    completed++;
                    if (completed === promises.length) {
                        resolve(results);
                    }
                })
                .catch(reject);
        });
    });
}

myPromiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])
    .then(r => console.log("Q48 Answer: Custom Promise.all:", r));

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q49: How do you cancel a Promise/fetch request?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 * Use AbortController to signal cancellation.
 */

function cancellableFetch(url) {
    const controller = new AbortController();

    const promise = fetch(url, { signal: controller.signal });

    return {
        promise,
        cancel: () => controller.abort()
    };
}

console.log("Q49 Answer: Use AbortController for cancellation");
console.log("Example: controller.abort() cancels the fetch");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q50: Implement a simple Pub/Sub system with async support.
 * ══════════════════════════════════════════════════════════════════════════
 */

class AsyncEventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
        return () => this.off(event, callback); // Return unsubscribe function
    }

    off(event, callback) {
        const callbacks = this.events.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) callbacks.splice(index, 1);
        }
    }

    async emit(event, ...args) {
        const callbacks = this.events.get(event) || [];
        await Promise.all(callbacks.map(cb => cb(...args)));
    }
}

const emitter = new AsyncEventEmitter();
emitter.on("test", async (data) => {
    await new Promise(r => setTimeout(r, 50));
    console.log("Q50 Answer: Received event:", data);
});
emitter.emit("test", "Hello Async Events!");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q51: What is a race condition and how do you prevent it?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                      RACE CONDITION                                  │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  When two or more async operations compete and the result           │
 * │  depends on which finishes first.                                   │
 * │                                                                      │
 * │  EXAMPLE: Search-as-you-type                                        │
 * │  ─────────────────────────────                                      │
 * │  User types: "abc"                                                  │
 * │  Search "a"   ────► [slow response] ──────────────► arrives LAST   │
 * │  Search "ab"  ────► [medium response] ──────► arrives SECOND       │
 * │  Search "abc" ────► [fast response] ──► arrives FIRST              │
 * │                                                                      │
 * │  Result: UI shows "a" results instead of "abc"!                     │
 * │                                                                      │
 * │  SOLUTIONS:                                                         │
 * │  1. Cancel previous requests (AbortController)                      │
 * │  2. Track request order with timestamps/IDs                         │
 * │  3. Use debouncing                                                  │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

// Solution: Only use latest result
function createLatestRequest() {
    let latestId = 0;

    return async function fetchLatest(fetchFn) {
        const id = ++latestId;
        const result = await fetchFn();

        if (id === latestId) {
            return result; // Only return if this is still the latest
        }
        return null; // Outdated, ignore
    };
}

console.log("Q51 Answer: Prevent race conditions with cancellation or ID tracking");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q52: What is the difference between concurrency and parallelism?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │              CONCURRENCY vs PARALLELISM                              │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  CONCURRENCY (single thread, JavaScript)                            │
 * │  ════════════════════════════════════════                           │
 * │  Dealing with multiple tasks at once by switching between them      │
 * │                                                                      │
 * │  Thread: ─────████░░░░████░░░░████░░░░─────                        │
 * │               Task1   Task2   Task3                                 │
 * │               (waiting while others run)                            │
 * │                                                                      │
 * │  PARALLELISM (multiple threads/cores, Web Workers)                  │
 * │  ═════════════════════════════════════════════════                  │
 * │  Actually running multiple tasks simultaneously                     │
 * │                                                                      │
 * │  Thread 1: ─────████████████████─────                               │
 * │  Thread 2: ─────████████████████─────                               │
 * │  Thread 3: ─────████████████████─────                               │
 * │            (all running at same time)                               │
 * │                                                                      │
 * │  JavaScript: Single-threaded but achieves concurrency               │
 * │  through the event loop and non-blocking I/O.                       │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

console.log("Q52 Answer: JS is concurrent (event loop), not parallel (single thread)");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q53: Implement a semaphore/mutex for limiting concurrent operations.
 * ══════════════════════════════════════════════════════════════════════════
 */

class Semaphore {
    constructor(max) {
        this.max = max;
        this.count = 0;
        this.queue = [];
    }

    async acquire() {
        if (this.count < this.max) {
            this.count++;
            return;
        }

        await new Promise(resolve => this.queue.push(resolve));
    }

    release() {
        this.count--;
        if (this.queue.length > 0) {
            this.count++;
            const next = this.queue.shift();
            next();
        }
    }

    async run(fn) {
        await this.acquire();
        try {
            return await fn();
        } finally {
            this.release();
        }
    }
}

const semaphore = new Semaphore(2); // Max 2 concurrent

console.log("Q53 Answer: Semaphore limits concurrent operations");

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q54: What is a memory leak in async code and how do you prevent it?
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ANSWER:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │              ASYNC MEMORY LEAKS                                      │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │  COMMON CAUSES:                                                     │
 * │  ═════════════                                                      │
 * │  1. Uncleared timers (setInterval without clearInterval)            │
 * │  2. Uncancelled fetch/subscriptions                                 │
 * │  3. Event listeners not removed                                     │
 * │  4. Closures holding references to large objects                    │
 * │  5. Promises that never resolve (holding callbacks)                 │
 * │                                                                      │
 * │  PREVENTION:                                                        │
 * │  ═══════════                                                        │
 * │  • Always clear intervals in cleanup                                │
 * │  • Use AbortController for cancellable requests                     │
 * │  • Remove event listeners in componentWillUnmount/cleanup           │
 * │  • Use WeakMap/WeakSet for caching                                  │
 * │  • Set reasonable timeouts for Promises                             │
 * │                                                                      │
 * └──────────────────────────────────────────────────────────────────────┘
 */

// Example: Cleanup pattern
class ComponentWithCleanup {
    constructor() {
        this.controller = new AbortController();
        this.intervalId = null;
    }

    start() {
        this.intervalId = setInterval(() => {
            console.log("Q54: Running interval");
        }, 1000);
    }

    async fetchData(url) {
        return fetch(url, { signal: this.controller.signal });
    }

    cleanup() {
        // Cancel all ongoing requests
        this.controller.abort();
        // Clear timers
        if (this.intervalId) clearInterval(this.intervalId);
        console.log("Q54 Answer: Always cleanup async resources!");
    }
}

/**
 * ══════════════════════════════════════════════════════════════════════════
 * Q55: Implement async queue with concurrency limit.
 * ══════════════════════════════════════════════════════════════════════════
 */

class AsyncQueue {
    constructor(concurrency = 1) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }

    async add(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ fn, resolve, reject });
            this.process();
        });
    }

    async process() {
        if (this.running >= this.concurrency || this.queue.length === 0) {
            return;
        }

        this.running++;
        const { fn, resolve, reject } = this.queue.shift();

        try {
            const result = await fn();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.running--;
            this.process();
        }
    }
}

const queue = new AsyncQueue(2);
console.log("Q55 Answer: AsyncQueue with concurrency limit created");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 7: QUICK FIRE QUESTIONS                       ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * QUICK FIRE Q&A - SHORT ANSWERS
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Q: Is JavaScript single-threaded?
 * A: Yes, but it uses async I/O and event loop for concurrency.
 *
 * Q: What is "callback hell"?
 * A: Deeply nested callbacks that make code hard to read.
 *
 * Q: Why use async/await over .then()?
 * A: More readable, looks synchronous, easier error handling.
 *
 * Q: What happens if you await a rejected Promise without try/catch?
 * A: The error propagates up as an unhandled rejection.
 *
 * Q: Can a Promise be cancelled?
 * A: Not directly, but you can use AbortController for fetch.
 *
 * Q: What is Promise.withResolvers() (ES2024)?
 * A: Returns { promise, resolve, reject } for external control.
 *
 * Q: What is queueMicrotask()?
 * A: Schedules a callback to run as a microtask.
 *
 * Q: Can you await inside a forEach callback?
 * A: Technically yes, but it won't await all - use for...of instead.
 *
 * Q: What's the difference between return and return await?
 * A: return await catches errors in try/catch, return doesn't.
 *
 * Q: How do Web Workers differ from async?
 * A: Web Workers run in separate threads (true parallelism).
 */

console.log("Quick Fire Questions - See comments in code");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║                   INTERVIEW CHEAT SHEET                        ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ASYNC INTERVIEW CHEAT SHEET                           │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  EXECUTION ORDER (memorize this!):                                       │
 * │  ════════════════════════════════                                        │
 * │  1. Synchronous code                                                     │
 * │  2. process.nextTick (Node.js)                                          │
 * │  3. Microtasks (Promises, queueMicrotask)                               │
 * │  4. Macrotasks (setTimeout, setInterval, I/O)                           │
 * │                                                                          │
 * │  KEY PATTERNS:                                                           │
 * │  ═════════════                                                           │
 * │  • Promisify: wrap callback in new Promise                              │
 * │  • Timeout: Promise.race([original, timeout])                           │
 * │  • Retry: loop with try/catch and delay                                 │
 * │  • Cancel: AbortController                                              │
 * │  • Rate limit: debounce/throttle/semaphore                              │
 * │                                                                          │
 * │  COMMON MISTAKES:                                                        │
 * │  ════════════════                                                        │
 * │  • await in forEach (use for...of)                                      │
 * │  • Missing await (gets Promise, not value)                              │
 * │  • Sequential when parallel is possible                                  │
 * │  • Not handling rejections                                              │
 * │  • Race conditions with search/typeahead                                │
 * │                                                                          │
 * │  RED FLAGS TO AVOID:                                                     │
 * │  ═══════════════════                                                     │
 * │  • new Promise(async (resolve) => {...})  // Anti-pattern              │
 * │  • async function returning Promise.resolve() // Redundant              │
 * │  • Not awaiting in try/catch properly                                   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("   FILE 8 COMPLETE - ASYNC DEEP DIVE MODULE FINISHED!");
console.log("═══════════════════════════════════════════════════════════════\n");

console.log("Topics Covered:");
console.log("  ✓ Callbacks (Q1-Q10)");
console.log("  ✓ Promises (Q11-Q25)");
console.log("  ✓ Async/Await (Q26-Q35)");
console.log("  ✓ Generators (Q36-Q40)");
console.log("  ✓ Event Loop (Q41-Q45)");
console.log("  ✓ Patterns & Advanced (Q46-Q55)");
console.log("  ✓ Quick Fire Questions");
console.log("  ✓ Interview Cheat Sheet\n");

console.log("Next Module: Design Patterns in JavaScript");
console.log("Location: deep-dive/javaScript-design-patterns/");
