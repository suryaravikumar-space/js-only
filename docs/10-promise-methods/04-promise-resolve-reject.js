/**
 * CHALLENGE 04: Promise.resolve() and Promise.reject()
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Promise.resolve(value) - Creates a resolved promise                        ║
 * ║ Promise.reject(reason) - Creates a rejected promise                        ║
 * ║                                                                            ║
 * ║ Special: If value is already a promise, resolve returns it unchanged       ║
 * ║ Special: If value is thenable, its then() is called                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW THE ENGINE SEES Promise.resolve()                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Promise.resolve() is a STATIC METHOD that creates promises differently     │
 * │ based on what you pass in. The engine follows this decision tree:          │
 * │                                                                             │
 * │                    Promise.resolve(value)                                   │
 * │                            │                                                │
 * │                            ▼                                                │
 * │                ┌───────────────────────┐                                    │
 * │                │ Is value a Promise?   │                                    │
 * │                └───────────┬───────────┘                                    │
 * │                    YES │       │ NO                                         │
 * │                        │       │                                            │
 * │                        ▼       ▼                                            │
 * │              ┌─────────────┐  ┌────────────────────────┐                    │
 * │              │ Return the  │  │ Is value a thenable?   │                    │
 * │              │ SAME promise│  │ (has .then method)     │                    │
 * │              │ unchanged   │  └────────────┬───────────┘                    │
 * │              └─────────────┘       YES │       │ NO                         │
 * │                                        │       │                            │
 * │                                        ▼       ▼                            │
 * │                             ┌─────────────┐  ┌─────────────────┐            │
 * │                             │ Create new  │  │ Create new      │            │
 * │                             │ promise and │  │ promise already │            │
 * │                             │ call        │  │ FULFILLED with  │            │
 * │                             │ value.then()│  │ the value       │            │
 * │                             └─────────────┘  └─────────────────┘            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 1: Promise.resolve with plain value
// ═══════════════════════════════════════════════════════════════════════════════

var resolved = Promise.resolve(42);
resolved.then(v => console.log('A:', v));

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ENGINE EXECUTION: Promise.resolve(42)                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ STEP 1: Call Stack executes Promise.resolve(42)                             │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   ┌─────────────────────────────────────┐                                   │
 * │   │         CALL STACK                  │                                   │
 * │   ├─────────────────────────────────────┤                                   │
 * │   │  Promise.resolve(42)                │ ← Engine checks: Is 42 a Promise? │
 * │   │  main()                             │   NO. Is 42 a thenable? NO.       │
 * │   └─────────────────────────────────────┘   → Create fulfilled promise      │
 * │                                                                             │
 * │                                                                             │
 * │ STEP 2: Engine creates Promise object                                       │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   ┌──────────────────────────────────────────┐                              │
 * │   │  Promise Object (in HEAP memory)         │                              │
 * │   ├──────────────────────────────────────────┤                              │
 * │   │  [[PromiseState]]: "fulfilled"           │ ← Already resolved!          │
 * │   │  [[PromiseResult]]: 42                   │                              │
 * │   │  [[PromiseFulfillReactions]]: []         │ ← Callbacks added later      │
 * │   │  [[PromiseRejectReactions]]: []          │                              │
 * │   └──────────────────────────────────────────┘                              │
 * │                                                                             │
 * │                                                                             │
 * │ STEP 3: .then() is called, callback queued to MICROTASK                     │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   ┌─────────────────────────────────────┐                                   │
 * │   │         CALL STACK                  │                                   │
 * │   ├─────────────────────────────────────┤                                   │
 * │   │  .then(v => console.log('A:', v))   │ ← Promise already fulfilled!      │
 * │   │  main()                             │   Schedule callback immediately   │
 * │   └─────────────────────────────────────┘                                   │
 * │                                                                             │
 * │   ┌─────────────────────────────────────┐                                   │
 * │   │       MICROTASK QUEUE               │                                   │
 * │   ├─────────────────────────────────────┤                                   │
 * │   │  [callback(42)]                     │ ← Queued for next tick            │
 * │   └─────────────────────────────────────┘                                   │
 * │                                                                             │
 * │                                                                             │
 * │ STEP 4: Call stack empties, microtask runs                                  │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   ┌─────────────────────────────────────┐   ┌──────────────────────────┐    │
 * │   │         CALL STACK                  │   │    MICROTASK QUEUE       │    │
 * │   ├─────────────────────────────────────┤   ├──────────────────────────┤    │
 * │   │  (empty)                            │ → │  [callback(42)]          │    │
 * │   └─────────────────────────────────────┘   └──────────────────────────┘    │
 * │                                                    │                        │
 * │                                                    ▼                        │
 * │   ┌─────────────────────────────────────┐                                   │
 * │   │         CALL STACK                  │                                   │
 * │   ├─────────────────────────────────────┤                                   │
 * │   │  console.log('A:', 42)              │ ← Callback executes!              │
 * │   └─────────────────────────────────────┘                                   │
 * │                                                                             │
 * │   OUTPUT: A: 42                                                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 2: Promise.resolve with thenable
// ═══════════════════════════════════════════════════════════════════════════════

var thenable = {
  then(resolve) {
    resolve('from thenable');
  }
};
Promise.resolve(thenable).then(v => console.log('B:', v));

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ENGINE EXECUTION: Promise.resolve(thenable)                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ WHAT IS A THENABLE?                                                         │
 * │ Any object with a .then() method. It's like a "duck-typed" promise.         │
 * │                                                                             │
 * │   thenable = {                                                              │
 * │     then(resolve) {        ← Has .then method = It's a thenable!            │
 * │       resolve('from thenable');                                             │
 * │     }                                                                       │
 * │   };                                                                        │
 * │                                                                             │
 * │                                                                             │
 * │ STEP 1: Engine checks what type of value                                    │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   Promise.resolve(thenable)                                                 │
 * │            │                                                                │
 * │            ▼                                                                │
 * │   ┌─────────────────────────────┐                                           │
 * │   │ Is thenable a Promise?      │ → NO (it's a plain object)                │
 * │   │ Does thenable have .then()? │ → YES! It's a thenable                    │
 * │   └─────────────────────────────┘                                           │
 * │                                                                             │
 * │                                                                             │
 * │ STEP 2: Engine creates PENDING promise and calls thenable.then()            │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   ┌──────────────────────────────────────────┐                              │
 * │   │  New Promise Object                      │                              │
 * │   ├──────────────────────────────────────────┤                              │
 * │   │  [[PromiseState]]: "pending"             │ ← Starts PENDING!            │
 * │   │  [[PromiseResult]]: undefined            │                              │
 * │   └──────────────────────────────────────────┘                              │
 * │                                                                             │
 * │   Engine then calls:                                                        │
 * │   thenable.then(                                                            │
 * │     (value) => resolvePromise(value),  ← Engine passes these                │
 * │     (reason) => rejectPromise(reason)                                       │
 * │   )                                                                         │
 * │                                                                             │
 * │                                                                             │
 * │ STEP 3: thenable.then() executes and calls resolve                          │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   then(resolve) {                                                           │
 * │     resolve('from thenable');  ← This resolves the new promise              │
 * │   }                                                                         │
 * │                                                                             │
 * │   ┌──────────────────────────────────────────┐                              │
 * │   │  Promise Object (UPDATED)                │                              │
 * │   ├──────────────────────────────────────────┤                              │
 * │   │  [[PromiseState]]: "fulfilled"           │ ← Now fulfilled!             │
 * │   │  [[PromiseResult]]: "from thenable"      │                              │
 * │   └──────────────────────────────────────────┘                              │
 * │                                                                             │
 * │                                                                             │
 * │ WHY THENABLES EXIST:                                                        │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │ • Interoperability between different Promise libraries                      │
 * │ • jQuery $.ajax() returns a thenable (not a real Promise)                   │
 * │ • Custom async objects can integrate with Promise system                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 3: Promise.resolve with another Promise
// ═══════════════════════════════════════════════════════════════════════════════

var original = new Promise(resolve => setTimeout(() => resolve('original'), 10));
var wrapped = Promise.resolve(original);
console.log('C:', original === wrapped);  // true!

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ENGINE EXECUTION: Promise.resolve(promise)                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ╔═══════════════════════════════════════════════════════════════════════╗   │
 * │ ║ KEY INSIGHT: If you pass a REAL Promise, you get the SAME object back ║   │
 * │ ║ No wrapping! No new promise! Just returns the input unchanged.        ║   │
 * │ ╚═══════════════════════════════════════════════════════════════════════╝   │
 * │                                                                             │
 * │                                                                             │
 * │ STEP 1: Create original promise                                             │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   var original = new Promise(...)                                           │
 * │                                                                             │
 * │   Memory Address: 0x1234                                                    │
 * │   ┌──────────────────────────────────────────┐                              │
 * │   │  Promise Object @ 0x1234                 │                              │
 * │   ├──────────────────────────────────────────┤                              │
 * │   │  [[PromiseState]]: "pending"             │                              │
 * │   │  [[PromiseResult]]: undefined            │                              │
 * │   └──────────────────────────────────────────┘                              │
 * │                                                                             │
 * │   original ──────────────────► [Promise @ 0x1234]                           │
 * │                                                                             │
 * │                                                                             │
 * │ STEP 2: Call Promise.resolve(original)                                      │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   Promise.resolve(original)                                                 │
 * │            │                                                                │
 * │            ▼                                                                │
 * │   ┌─────────────────────────────────────────┐                               │
 * │   │ Is original a Promise?                  │ → YES!                        │
 * │   │ Is original.constructor === Promise?    │ → YES!                        │
 * │   │                                         │                               │
 * │   │ RETURN THE SAME OBJECT (no wrapping!)   │                               │
 * │   └─────────────────────────────────────────┘                               │
 * │                                                                             │
 * │   wrapped = Promise.resolve(original)                                       │
 * │                                                                             │
 * │   original ──────────────────► [Promise @ 0x1234] ◄────────────── wrapped   │
 * │                                                                             │
 * │   BOTH POINT TO THE SAME OBJECT IN MEMORY!                                  │
 * │                                                                             │
 * │                                                                             │
 * │ STEP 3: Compare references                                                  │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   original === wrapped                                                      │
 * │       │            │                                                        │
 * │       ▼            ▼                                                        │
 * │    0x1234   ===  0x1234  →  TRUE                                            │
 * │                                                                             │
 * │                                                                             │
 * │ WHY THIS MATTERS:                                                           │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │ • Memory efficient: No extra promise objects created                        │
 * │ • Identity preserved: You can check if it's the same promise                │
 * │ • Idempotent: Promise.resolve(Promise.resolve(x)) === Promise.resolve(x)    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 4: Promise.reject()
// ═══════════════════════════════════════════════════════════════════════════════

var rejected = Promise.reject(new Error('oops'));
rejected.catch(e => console.log('D:', e.message));

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ENGINE EXECUTION: Promise.reject()                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ╔═══════════════════════════════════════════════════════════════════════╗   │
 * │ ║ KEY DIFFERENCE: Promise.reject() ALWAYS creates a new rejected promise║   │
 * │ ║ It does NOT check if the value is a promise or thenable!              ║   │
 * │ ╚═══════════════════════════════════════════════════════════════════════╝   │
 * │                                                                             │
 * │                                                                             │
 * │ STEP 1: Promise.reject(error) executes                                      │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   ┌─────────────────────────────────────┐                                   │
 * │   │         CALL STACK                  │                                   │
 * │   ├─────────────────────────────────────┤                                   │
 * │   │  Promise.reject(Error('oops'))      │ ← Creates rejected promise        │
 * │   │  main()                             │   immediately                     │
 * │   └─────────────────────────────────────┘                                   │
 * │                                                                             │
 * │   ┌──────────────────────────────────────────┐                              │
 * │   │  Promise Object                          │                              │
 * │   ├──────────────────────────────────────────┤                              │
 * │   │  [[PromiseState]]: "rejected"            │ ← Already REJECTED!          │
 * │   │  [[PromiseResult]]: Error('oops')        │                              │
 * │   │  [[PromiseRejectReactions]]: []          │ ← No handlers yet            │
 * │   └──────────────────────────────────────────┘                              │
 * │                                                                             │
 * │                                                                             │
 * │ STEP 2: .catch() adds rejection handler                                     │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   rejected.catch(e => console.log('D:', e.message))                         │
 * │                                                                             │
 * │   Since promise is ALREADY rejected, callback is queued to microtask:       │
 * │                                                                             │
 * │   ┌─────────────────────────────────────┐                                   │
 * │   │       MICROTASK QUEUE               │                                   │
 * │   ├─────────────────────────────────────┤                                   │
 * │   │  [catchCallback(Error('oops'))]     │ ← Queued immediately              │
 * │   └─────────────────────────────────────┘                                   │
 * │                                                                             │
 * │                                                                             │
 * │ STEP 3: Microtask executes                                                  │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   ┌─────────────────────────────────────┐                                   │
 * │   │         CALL STACK                  │                                   │
 * │   ├─────────────────────────────────────┤                                   │
 * │   │  console.log('D:', error.message)   │                                   │
 * │   └─────────────────────────────────────┘                                   │
 * │                                                                             │
 * │   OUTPUT: D: oops                                                           │
 * │                                                                             │
 * │                                                                             │
 * │ ⚠️  WARNING: UNHANDLED REJECTION                                            │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │ If you DON'T attach .catch() synchronously:                                 │
 * │                                                                             │
 * │   var rejected = Promise.reject(new Error('oops'));                         │
 * │   // No .catch() attached!                                                  │
 * │                                                                             │
 * │   Node.js will emit:                                                        │
 * │   "UnhandledPromiseRejectionWarning: Error: oops"                           │
 * │                                                                             │
 * │   Browser console will show:                                                │
 * │   "Uncaught (in promise) Error: oops"                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 5: Common Pattern - Unified Async Interface
// ═══════════════════════════════════════════════════════════════════════════════

function getData(useCache) {
  if (useCache) {
    return Promise.resolve({ cached: true });
  }
  return new Promise(resolve => {
    setTimeout(() => resolve({ cached: false }), 10);
  });
}

getData(true).then(data => console.log('E:', data.cached));

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY USE Promise.resolve() FOR SYNC VALUES?                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ╔═══════════════════════════════════════════════════════════════════════╗   │
 * │ ║ PATTERN: Always return a Promise for consistent API                   ║   │
 * │ ╚═══════════════════════════════════════════════════════════════════════╝   │
 * │                                                                             │
 * │ WITHOUT Promise.resolve():                                                  │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   function getData(useCache) {                                              │
 * │     if (useCache) {                                                         │
 * │       return { cached: true };  // ← Returns OBJECT                         │
 * │     }                                                                       │
 * │     return fetch('/api/data');  // ← Returns PROMISE                        │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Caller has inconsistent behavior:                                      │
 * │   const result = getData(true);                                             │
 * │   result.then(...)  // ← ERROR if useCache=true (not a promise!)            │
 * │                                                                             │
 * │                                                                             │
 * │ WITH Promise.resolve():                                                     │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   function getData(useCache) {                                              │
 * │     if (useCache) {                                                         │
 * │       return Promise.resolve({ cached: true });  // ← Returns PROMISE       │
 * │     }                                                                       │
 * │     return fetch('/api/data');  // ← Returns PROMISE                        │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Caller always gets a Promise:                                          │
 * │   getData(true).then(...)   // ✓ Works                                      │
 * │   getData(false).then(...)  // ✓ Works                                      │
 * │   await getData(true)       // ✓ Works                                      │
 * │   await getData(false)      // ✓ Works                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETE EXECUTION TIMELINE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPLETE EXECUTION TIMELINE                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ TIME  │ CALL STACK               │ MICROTASK QUEUE    │ OUTPUT             │
 * │ ──────┼──────────────────────────┼────────────────────┼──────────────────   │
 * │  T1   │ Promise.resolve(42)      │ (empty)            │                    │
 * │  T2   │ .then(A callback)        │ [A: 42]            │                    │
 * │  T3   │ Promise.resolve(thenable)│ [A: 42]            │                    │
 * │  T4   │ thenable.then() runs     │ [A:42, B:thenable] │                    │
 * │  T5   │ Promise.resolve(original)│ [A:42, B:thenable] │                    │
 * │  T6   │ console.log('C:')        │ [A:42, B:thenable] │ C: true            │
 * │  T7   │ Promise.reject(error)    │ [A:42, B, D:error] │                    │
 * │  T8   │ getData(true)            │ [A, B, D, E:cached]│                    │
 * │  T9   │ (stack empty)            │ [A, B, D, E]       │                    │
 * │  T10  │ A callback runs          │ [B, D, E]          │ A: 42              │
 * │  T11  │ B callback runs          │ [D, E]             │ B: from thenable   │
 * │  T12  │ D callback runs          │ [E]                │ D: oops            │
 * │  T13  │ E callback runs          │ (empty)            │ E: true            │
 * │                                                                             │
 * │                                                                             │
 * │ FINAL OUTPUT ORDER:                                                         │
 * │ ─────────────────────────────────────────────────────────────────────────   │
 * │                                                                             │
 * │   C: true           ← Sync (console.log runs immediately)                   │
 * │   A: 42             ← Microtask (Promise.resolve callback)                  │
 * │   B: from thenable  ← Microtask (thenable resolution)                       │
 * │   D: oops           ← Microtask (Promise.reject callback)                   │
 * │   E: true           ← Microtask (getData callback)                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ PROMISE.RESOLVE vs PROMISE.REJECT COMPARISON                               ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  ┌────────────────────────┬──────────────────────────────────────────────┐ ║
 * ║  │ Promise.resolve(x)     │ Promise.reject(x)                            │ ║
 * ║  ├────────────────────────┼──────────────────────────────────────────────┤ ║
 * ║  │ If x is Promise:       │ ALWAYS creates new rejected promise          │ ║
 * ║  │ Returns x unchanged    │ with x as the reason                         │ ║
 * ║  ├────────────────────────┼──────────────────────────────────────────────┤ ║
 * ║  │ If x is thenable:      │ x is used as-is (even if it's a promise!)    │ ║
 * ║  │ Calls x.then()         │                                              │ ║
 * ║  ├────────────────────────┼──────────────────────────────────────────────┤ ║
 * ║  │ Otherwise:             │                                              │ ║
 * ║  │ Creates fulfilled      │ Creates rejected promise                     │ ║
 * ║  │ promise with x         │ with x as reason                             │ ║
 * ║  └────────────────────────┴──────────────────────────────────────────────┘ ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Promise.resolve() and Promise.reject() are static factory methods:         │
 * │                                                                             │
 * │  Promise.resolve(value):                                                    │
 * │  • If value is a Promise → returns it UNCHANGED (same reference)            │
 * │  • If value is a thenable → calls value.then() to extract the value         │
 * │  • Otherwise → creates new fulfilled promise with the value                 │
 * │                                                                             │
 * │  Promise.reject(reason):                                                    │
 * │  • ALWAYS creates a new rejected promise                                    │
 * │  • Does NOT unwrap promises or thenables                                    │
 * │  • The reason is used as-is                                                 │
 * │                                                                             │
 * │  Common use case: Unified async interface - whether you have cached         │
 * │  data (sync) or need to fetch (async), always return a promise so           │
 * │  callers can use .then() or await consistently.                             │
 * │                                                                             │
 * │  The callbacks are ALWAYS executed asynchronously via the microtask         │
 * │  queue, even if the promise is already resolved when .then() is called."    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * OUTPUT:
 *   C: true
 *   A: 42
 *   B: from thenable
 *   D: oops
 *   E: true
 *
 *
 * RUN: node docs/10-promise-methods/04-promise-resolve-reject.js
 */
