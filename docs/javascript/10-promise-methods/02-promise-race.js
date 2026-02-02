/**
 * CHALLENGE 02: Promise.race()
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Promise.race([promises]) - First settled promise wins (resolve OR reject)  ║
 * ║                                                                            ║
 * ║ Use cases:                                                                 ║
 * ║   - Timeout patterns                                                       ║
 * ║   - First response wins                                                    ║
 * ║   - Cancel operations                                                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Race 1: First to resolve wins
constfast = new Promise(resolve => setTimeout(() => resolve('fast'), 50));
constslow = new Promise(resolve => setTimeout(() => resolve('slow'), 100));

Promise.race([fast, slow]).then(result => {
  console.log('A:', result);
});

// Race 2: First to reject wins
constwillResolve = new Promise(resolve => setTimeout(() => resolve('ok'), 100));
constwillReject = new Promise((_, reject) => setTimeout(() => reject(new Error('fail')), 50));

Promise.race([willResolve, willReject]).catch(err => {
  console.log('B:', err.message);
});

// Race 3: Timeout pattern
function fetchWithTimeout(url, timeout) {
  constfetchPromise = new Promise(resolve => {
    setTimeout(() => resolve('data from ' + url), 200);
  });

  consttimeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), timeout);
  });

  return Promise.race([fetchPromise, timeoutPromise]);
}

fetchWithTimeout('/api', 100).catch(err => {
  console.log('C:', err.message);
});

/**
 * OUTPUT:
 *   A: fast
 *   B: fail
 *   C: Timeout
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ PROMISE.RACE vs PROMISE.ANY                                                ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   race: First to SETTLE (resolve or reject) wins                           ║
 * ║   any:  First to FULFILL (resolve only) wins                               ║
 * ║                                                                            ║
 * ║   [reject(10ms), resolve(20ms)]                                            ║
 * ║   race → rejects (rejection came first)                                    ║
 * ║   any  → resolves (waits for first fulfillment)                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Promise.race returns a promise that settles with the outcome of the       │
 * │  first promise to settle, whether it resolves or rejects.                  │
 * │                                                                             │
 * │  Common use: Timeout patterns - race between fetch and timeout promise.    │
 * │  If timeout wins, the race rejects even if fetch would eventually succeed."│
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/10-promise-methods/02-promise-race.js
 */
