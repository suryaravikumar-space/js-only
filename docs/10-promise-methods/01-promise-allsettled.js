/**
 * CHALLENGE 01: Promise.allSettled() - All Results Regardless of Status
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Promise.allSettled() waits for ALL promises to settle (fulfill OR reject) ║
 * ║ and NEVER short-circuits. You get results for every promise.              ║
 * ║                                                                            ║
 * ║   • Returns array of objects: { status, value } or { status, reason }     ║
 * ║   • status is either 'fulfilled' or 'rejected'                            ║
 * ║   • NEVER rejects - always returns fulfilled promise with all results     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

console.log('A');

var p1 = Promise.resolve('success');

var p2 = Promise.reject('error');

var p3 = new Promise(function(resolve) {
  setTimeout(function() {
    console.log('B');
    resolve('delayed');
  }, 50);
});

Promise.allSettled([p1, p2, p3]).then(function(results) {
  console.log('C:', results.length);
  results.forEach(function(result, i) {
    console.log('D' + i + ':', result.status);
  });
});

console.log('E');

/**
 * OUTPUT:
 *   A
 *   E
 *   B
 *   C: 3
 *   D0: fulfilled
 *   D1: rejected
 *   D2: fulfilled
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. console.log('A')                                                        ║
 * ║ ───────────────────                                                        ║
 * ║    • Synchronous - executes immediately                                    ║
 * ║    • Output: A                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 2. Creating promises                                                       ║
 * ║ ────────────────────                                                       ║
 * ║    • p1: Already resolved with 'success'                                   ║
 * ║    • p2: Already rejected with 'error'                                     ║
 * ║    • p3: setTimeout scheduled for 50ms                                     ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 3. Promise.allSettled([p1, p2, p3])                                        ║
 * ║ ─────────────────────────────────────                                      ║
 * ║    • Waits for ALL to settle (not just fulfill)                            ║
 * ║    • p2's rejection does NOT cause early exit                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 4. console.log('E')                                                        ║
 * ║ ───────────────────                                                        ║
 * ║    • Synchronous - executes immediately                                    ║
 * ║    • Output: E                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 5. After 50ms: p3's setTimeout fires                                       ║
 * ║ ────────────────────────────────────                                       ║
 * ║    • Output: B                                                             ║
 * ║    • p3 resolves with 'delayed'                                            ║
 * ║    • ALL promises now settled!                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 6. allSettled .then callback runs                                          ║
 * ║ ──────────────────────────────────                                         ║
 * ║    • results = [                                                           ║
 * ║        { status: 'fulfilled', value: 'success' },                          ║
 * ║        { status: 'rejected', reason: 'error' },                            ║
 * ║        { status: 'fulfilled', value: 'delayed' }                           ║
 * ║      ]                                                                     ║
 * ║    • Output: C: 3, D0: fulfilled, D1: rejected, D2: fulfilled              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: allSettled Result Format                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Promise.allSettled([p1, p2, p3]) returns:                                 │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────┐       │
 * │   │ [                                                               │       │
 * │   │   { status: 'fulfilled', value: 'success' },    // p1 resolved │       │
 * │   │   { status: 'rejected', reason: 'error' },      // p2 rejected │       │
 * │   │   { status: 'fulfilled', value: 'delayed' }     // p3 resolved │       │
 * │   │ ]                                                               │       │
 * │   └─────────────────────────────────────────────────────────────────┘       │
 * │                                                                             │
 * │   Fulfilled: { status: 'fulfilled', value: <result> }                       │
 * │   Rejected:  { status: 'rejected', reason: <error> }                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PROMISE.ALL VS PROMISE.ALLSETTLED                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌──────────────────┬────────────────────┬────────────────────────┐        │
 * │   │                  │ Promise.all        │ Promise.allSettled     │        │
 * │   ├──────────────────┼────────────────────┼────────────────────────┤        │
 * │   │ If one rejects   │ Immediately fails  │ Waits for all          │        │
 * │   │ Result format    │ Array of values    │ Array of {status,...}  │        │
 * │   │ Can reject?      │ Yes                │ Never                  │        │
 * │   │ Short-circuits?  │ Yes (on reject)    │ No                     │        │
 * │   │ Use when         │ All must succeed   │ Need all results       │        │
 * │   └──────────────────┴────────────────────┴────────────────────────┘        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Promise.allSettled() waits for all promises to settle - either fulfill    │
 * │  or reject - and returns an array describing the outcome of each promise.  │
 * │                                                                             │
 * │  Unlike Promise.all(), it NEVER short-circuits on rejection.               │
 * │                                                                             │
 * │  Each result object has:                                                    │
 * │  - status: 'fulfilled' or 'rejected'                                       │
 * │  - value: the fulfilled value (only if fulfilled)                          │
 * │  - reason: the rejection reason (only if rejected)                         │
 * │                                                                             │
 * │  Use cases:                                                                 │
 * │  - When you need results from all operations regardless of failure         │
 * │  - Batch operations where partial success is acceptable                    │
 * │  - Logging/reporting on multiple async operations                          │
 * │  - Graceful degradation when some services are unavailable                 │
 * │                                                                             │
 * │  Added in ES2020, so check browser support for older environments."        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-promise-methods/01-promise-allsettled.js
 */
