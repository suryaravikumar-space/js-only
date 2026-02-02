/**
 * CHALLENGE 08: Parallel vs Sequential Execution
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Sequential: await one by one (total time = sum of all)                     ║
 * ║   var a = await fetch1();                                                  ║
 * ║   var b = await fetch2();  // Waits for fetch1 to complete                 ║
 * ║                                                                            ║
 * ║ Parallel: start all, await together (total time = max of all)              ║
 * ║   var [a, b] = await Promise.all([fetch1(), fetch2()]);                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

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

/**
 * OUTPUT:
 *   C: caught
 *   B: parallel
 *   A: sequential
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Sequential execution (150ms+)                                           ║
 * ║ ────────────────────────────────                                           ║
 * ║   await delay(50) → wait → await delay(50) → wait → await delay(50)        ║
 * ║   Total: 50 + 50 + 50 = 150ms minimum                                      ║
 * ║   Time >= 150 → prints 'sequential'                                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: Parallel execution (~50ms)                                              ║
 * ║ ─────────────────────────────                                              ║
 * ║   All three delay() calls START at the same time                           ║
 * ║   Promise.all waits for slowest (all are 50ms)                             ║
 * ║   Total: ~50ms (not 150!)                                                  ║
 * ║   Time < 100 → prints 'parallel'                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: Safe parallel with .catch()                                             ║
 * ║ ─────────────────────────────────                                          ║
 * ║   Each promise has its own .catch()                                        ║
 * ║   Rejections are converted to resolved values                              ║
 * ║   Promise.all succeeds with ['ok1', 'caught', 'ok2']                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE EACH                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   SEQUENTIAL: When operations depend on each other                          │
 * │   - Get user → Get user's posts → Get comments                              │
 * │   - Login → Fetch profile → Load dashboard                                  │
 * │                                                                             │
 * │   PARALLEL: When operations are independent                                 │
 * │   - Fetch users AND products AND categories                                 │
 * │   - Load all images on a page                                               │
 * │   - Multiple API calls that don't depend on each other                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/10-promise-methods/08-promise-parallel.js
 */
