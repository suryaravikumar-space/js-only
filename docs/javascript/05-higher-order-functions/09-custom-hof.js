/**
 * CHALLENGE 09: Building Custom Higher-Order Functions
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Custom HOFs let you create reusable function behavior:                     ║
 * ║                                                                            ║
 * ║ once:   Function can only be called once                                   ║
 * ║ after:  Function only runs after N calls                                   ║
 * ║ limit:  Function can only be called N times                                ║
 * ║ delay:  Function is delayed by N milliseconds                              ║
 * ║                                                                            ║
 * ║ These use closures to maintain state between calls!                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Custom once - function can only be called once
function once(fn) {
  var called = false;
  var result;
  return function(...args) {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

var initializeOnce = once(function(name) {
  console.log('Initializing:', name);
  return 'Initialized ' + name;
});

console.log('A:', initializeOnce('App'));
console.log('B:', initializeOnce('Again'));  // Won't log "Initializing"

// Custom after - function only runs after n calls
function after(n, fn) {
  var count = 0;
  return function(...args) {
    count++;
    if (count >= n) {
      return fn(...args);
    }
  };
}

var runAfter3 = after(3, function() {
  return 'Finally running!';
});

console.log('C:', runAfter3());  // undefined
runAfter3();  // undefined
console.log('D:', runAfter3());  // 'Finally running!'

/**
 * OUTPUT:
 *   Initializing: App
 *   A: Initialized App
 *   B: Initialized App
 *   C: undefined
 *   D: Finally running!
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A & B: once() behavior                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   Call 1: called=false → run fn, set called=true, store result             ║
 * ║   Call 2: called=true → skip fn, return cached result                      ║
 * ║                                                                            ║
 * ║   This is why both A and B return "Initialized App"                        ║
 * ║   But "Initializing: App" only logs once!                                  ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C & D: after() behavior                                                    ║
 * ║ ──────────────────────                                                     ║
 * ║   Call 1: count=1, 1 < 3 → return undefined                                ║
 * ║   Call 2: count=2, 2 < 3 → return undefined                                ║
 * ║   Call 3: count=3, 3 >= 3 → run fn, return 'Finally running!'              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MORE USEFUL CUSTOM HOFS                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // limit: only call N times                                               │
 * │   function limit(n, fn) {                                                   │
 * │     var count = 0;                                                          │
 * │     return function(...args) {                                              │
 * │       if (count < n) {                                                      │
 * │         count++;                                                            │
 * │         return fn(...args);                                                 │
 * │       }                                                                     │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   var limitedLog = limit(3, console.log);                                   │
 * │   limitedLog('1');  // logs '1'                                             │
 * │   limitedLog('2');  // logs '2'                                             │
 * │   limitedLog('3');  // logs '3'                                             │
 * │   limitedLog('4');  // nothing (limit reached)                              │
 * │                                                                             │
 * │                                                                             │
 * │   // delay: wrap function with timeout                                      │
 * │   function delay(ms, fn) {                                                  │
 * │     return function(...args) {                                              │
 * │       setTimeout(() => fn(...args), ms);                                    │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   var delayedLog = delay(1000, console.log);                                │
 * │   delayedLog('Hello');  // logs 'Hello' after 1 second                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REAL-WORLD USE CASES                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // once: Initialize app only once                                         │
 * │   var initDB = once(function() {                                            │
 * │     console.log('Connecting to database...');                               │
 * │     return { connected: true };                                             │
 * │   });                                                                       │
 * │   // Safe to call multiple times - only connects once                       │
 * │                                                                             │
 * │                                                                             │
 * │   // after: Run after all async tasks complete                              │
 * │   var onAllComplete = after(3, function() {                                 │
 * │     console.log('All 3 tasks complete!');                                   │
 * │   });                                                                       │
 * │   fetchUser().then(onAllComplete);                                          │
 * │   fetchPosts().then(onAllComplete);                                         │
 * │   fetchComments().then(onAllComplete);                                      │
 * │                                                                             │
 * │                                                                             │
 * │   // limit: Rate limiting API calls                                         │
 * │   var apiCall = limit(100, function(endpoint) {                             │
 * │     return fetch(endpoint);                                                 │
 * │   });                                                                       │
 * │   // After 100 calls, stops making requests                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW CLOSURES ENABLE STATE                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function once(fn) {                                                       │
 * │     var called = false;  // ← Closure variable (state)                      │
 * │     var result;          // ← Closure variable (state)                      │
 * │                                                                             │
 * │     return function(...args) {                                              │
 * │       // This inner function has access to called & result                  │
 * │       // They persist between calls!                                        │
 * │       if (!called) {                                                        │
 * │         called = true;                                                      │
 * │         result = fn(...args);                                               │
 * │       }                                                                     │
 * │       return result;                                                        │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Each call to once() creates NEW closure with its own state             │
 * │   var fn1 = once(f);  // fn1 has its own called & result                    │
 * │   var fn2 = once(f);  // fn2 has its own called & result                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Custom higher-order functions let us create reusable patterns for          │
 * │  controlling function behavior. They use closures to maintain state         │
 * │  between function calls.                                                    │
 * │                                                                             │
 * │  Common patterns:                                                           │
 * │  - once: Ensures a function runs only once (initialization)                 │
 * │  - after: Function activates after N calls (coordination)                   │
 * │  - limit: Function stops after N calls (rate limiting)                      │
 * │  - memoize: Caches results (performance)                                    │
 * │  - debounce/throttle: Controls call frequency (performance)                 │
 * │                                                                             │
 * │  The key insight is that the returned function 'closes over' variables      │
 * │  from the outer function, allowing state to persist between calls.          │
 * │  Each call to the HOF creates a new closure with independent state."        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/05-higher-order-functions/09-custom-hof.js
 */
