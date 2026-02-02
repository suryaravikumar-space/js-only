/**
 * CHALLENGE 08: Memoized Fibonacci
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Classic example: Fibonacci                                                 ║
 * ║                                                                            ║
 * ║   Non-memoized: O(2^n) - exponential, very slow                            ║
 * ║   Memoized:     O(n)   - linear, fast                                      ║
 * ║                                                                            ║
 * ║   fib(40) without memo: billions of calls                                  ║
 * ║   fib(40) with memo:    ~40 calls                                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var normalCalls = 0;
var memoCalls = 0;

function fib(n) {
  normalCalls++;
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

var fibMemo = (function() {
  var cache = {};
  return function fib(n) {
    memoCalls++;
    if (n in cache) return cache[n];
    if (n <= 1) return cache[n] = n;
    return cache[n] = fib(n - 1) + fib(n - 2);
  };
})();

console.log('A:', fib(10));
console.log('B:', fibMemo(10));
console.log('C:', fibMemo(40));

fib(20);
fibMemo(20);

console.log('D: Normal calls:', normalCalls);
console.log('E: Memo calls:', memoCalls);

/**
 * OUTPUT:
 *   A: 55
 *   B: 55
 *   C: 102334155
 *   D: Normal calls: 21891
 *   E: Memo calls: 61
 *
 * RUN: node docs/12-debounce-throttle-memoize/08-memoize-fibonacci.js
 */
