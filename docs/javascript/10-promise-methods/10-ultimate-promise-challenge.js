/**
 * CHALLENGE 10: Ultimate Promise Methods Challenge
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Promise.all vs Promise.allSettled vs Promise.race vs Promise.any:          ║
 * ║                                                                            ║
 * ║   all:        First rejection OR all fulfilled                             ║
 * ║   allSettled: Wait for all (never rejects)                                 ║
 * ║   race:       First to settle (fulfill OR reject)                          ║
 * ║   any:        First to fulfill (ignores rejections)                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

console.log('A:', 'sync start');

// Challenge 1: Promise.all vs Promise.allSettled
Promise.all([
  Promise.resolve(1),
  Promise.reject('fail'),
  Promise.resolve(3)
]).catch(e => console.log('B:', e));

Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('fail'),
  Promise.resolve(3)
]).then(results => {
  console.log('C:', results.filter(r => r.status === 'fulfilled').length);
});

// Challenge 2: race vs any
Promise.race([
  new Promise((_, r) => setTimeout(() => r('race-fail'), 10)),
  new Promise(res => setTimeout(() => res('race-success'), 20))
]).catch(e => console.log('D:', e));

Promise.any([
  new Promise((_, r) => setTimeout(() => r('any-fail'), 10)),
  new Promise(res => setTimeout(() => res('any-success'), 20))
]).then(v => console.log('E:', v));

// Challenge 3: Execution order
Promise.resolve()
  .then(() => console.log('F:', 'then 1'))
  .then(() => console.log('F:', 'then 2'));

console.log('G:', 'sync end');

/**
 * OUTPUT:
 *   A: sync start
 *   G: sync end
 *   B: fail
 *   C: 2
 *   F: then 1
 *   F: then 2
 *   D: race-fail
 *   E: any-success
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A & G: Sync code runs first                                                ║
 * ║ ──────────────────────────────                                             ║
 * ║   All synchronous code executes before any promises                        ║
 * ║                                                                            ║
 * ║ B: Promise.all rejects on first failure                                    ║
 * ║ ────────────────────────────────────────                                   ║
 * ║   Second promise rejects → entire Promise.all rejects                      ║
 * ║   Third promise result is ignored                                          ║
 * ║                                                                            ║
 * ║ C: Promise.allSettled waits for all                                        ║
 * ║ ──────────────────────────────────────                                     ║
 * ║   Returns [{status:'fulfilled',value:1},                                   ║
 * ║            {status:'rejected',reason:'fail'},                              ║
 * ║            {status:'fulfilled',value:3}]                                   ║
 * ║   2 fulfilled promises                                                     ║
 * ║                                                                            ║
 * ║ D: Promise.race returns first settled                                      ║
 * ║ ─────────────────────────────────────                                      ║
 * ║   Rejection at 10ms wins over success at 20ms                              ║
 * ║   Returns 'race-fail'                                                      ║
 * ║                                                                            ║
 * ║ E: Promise.any returns first fulfilled                                     ║
 * ║ ─────────────────────────────────────────                                  ║
 * ║   Ignores rejection at 10ms                                                ║
 * ║   Waits for success at 20ms → 'any-success'                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PROMISE METHODS CHEAT SHEET                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────┬─────────────────────┬────────────────────────────────┐    │
 * │   │ Method      │ Resolves when       │ Rejects when                   │    │
 * │   ├─────────────┼─────────────────────┼────────────────────────────────┤    │
 * │   │ all         │ All fulfill         │ Any one rejects                │    │
 * │   │ allSettled  │ All settle          │ Never rejects                  │    │
 * │   │ race        │ First settles       │ First settles (if rejection)   │    │
 * │   │ any         │ First fulfills      │ All reject (AggregateError)    │    │
 * │   └─────────────┴─────────────────────┴────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/10-promise-methods/10-ultimate-promise-challenge.js
 */
