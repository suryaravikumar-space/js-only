/**
 * GARBAGE COLLECTION: 02 - Memory Leaks
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ MEMORY LEAKS IN JAVASCRIPT                                                 ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A memory leak occurs when memory that is no longer needed is not           ║
 * ║ released because it's still "reachable" (accidentally held reference).     ║
 * ║                                                                            ║
 * ║ Even with automatic GC, leaks can happen!                                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// LEAK 1: ACCIDENTAL GLOBALS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Leak 1: Accidental Globals ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ACCIDENTAL GLOBAL VARIABLES                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   PROBLEM:                                                                  │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   function leak() {                                                         │
 * │     data = hugeArray;  // Missing 'let'/'const' → creates global!           │
 * │     this.anotherLeak = moreData;  // In non-strict, 'this' is global        │
 * │   }                                                                         │
 * │                                                                             │
 * │   Globals are ROOTS - they're always reachable!                             │
 * │   The memory will NEVER be freed.                                           │
 * │                                                                             │
 * │                                                                             │
 * │   FIX:                                                                      │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   'use strict';  // Throws error on undeclared variables                    │
 * │   // OR                                                                     │
 * │   let data = hugeArray;  // Use let/const                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// BAD: Accidental global (in non-strict mode)
function badFunction() {
  // leakyData = new Array(10000);  // Would create global! (commented for safety)
}

// GOOD: Proper declaration
function goodFunction() {
  'use strict';
  let localData = new Array(10000);  // Local, will be GC'd after function
}

console.log('A: Always use "let" or "const" - enable strict mode');


// ═══════════════════════════════════════════════════════════════════════════════
// LEAK 2: FORGOTTEN TIMERS & CALLBACKS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Leak 2: Forgotten Timers ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ FORGOTTEN TIMERS AND CALLBACKS                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   PROBLEM:                                                                  │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   const data = loadHugeData();                                              │
 * │                                                                             │
 * │   setInterval(() => {                                                       │
 * │     processData(data);  // 'data' captured in closure forever!              │
 * │   }, 1000);                                                                 │
 * │                                                                             │
 * │   // If you never clearInterval, data is NEVER freed                        │
 * │                                                                             │
 * │                                                                             │
 * │   FIX:                                                                      │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   const timerId = setInterval(() => { ... }, 1000);                         │
 * │                                                                             │
 * │   // When done:                                                             │
 * │   clearInterval(timerId);                                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// BAD: Timer that's never cleared
let leakyTimer;
function startLeakyTimer() {
  const hugeData = new Array(100000).fill('data');

  leakyTimer = setInterval(() => {
    // hugeData is captured and can never be GC'd
    console.log('  Timer running, holding', hugeData.length, 'items');
  }, 10000);
}

// GOOD: Proper cleanup
function startProperTimer() {
  const data = new Array(1000).fill('data');

  const timerId = setInterval(() => {
    console.log('  Processing...');
  }, 1000);

  // Cleanup after 5 seconds
  setTimeout(() => {
    clearInterval(timerId);
    console.log('B: Timer cleaned up properly');
  }, 100);
}

startProperTimer();


// ═══════════════════════════════════════════════════════════════════════════════
// LEAK 3: CLOSURES HOLDING REFERENCES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Leak 3: Closure References ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CLOSURES HOLDING LARGE DATA                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   PROBLEM:                                                                  │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   function outer() {                                                        │
 * │     const hugeData = new Array(1000000);                                    │
 * │     const smallValue = 42;                                                  │
 * │                                                                             │
 * │     return function inner() {                                               │
 * │       return smallValue;  // Only uses smallValue                           │
 * │       // BUT hugeData might still be retained!                              │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   const fn = outer();  // hugeData may be kept in closure scope             │
 * │                                                                             │
 * │                                                                             │
 * │   NOTE: Modern engines are smart about this and often optimize it away.     │
 * │   But be aware of the pattern.                                              │
 * │                                                                             │
 * │                                                                             │
 * │   FIX:                                                                      │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   function outer() {                                                        │
 * │     let hugeData = new Array(1000000);                                      │
 * │     const smallValue = 42;                                                  │
 * │                                                                             │
 * │     // Process hugeData                                                     │
 * │     const result = processData(hugeData);                                   │
 * │                                                                             │
 * │     hugeData = null;  // Explicitly clear                                   │
 * │                                                                             │
 * │     return function inner() {                                               │
 * │       return smallValue;                                                    │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Better pattern: Clear unused references
function createProcessor() {
  let cache = new Map();

  return {
    process(data) {
      // Use cache
    },
    clearCache() {
      cache.clear();  // Explicitly clear when done
      console.log('C: Cache cleared');
    }
  };
}

const processor = createProcessor();
processor.clearCache();


// ═══════════════════════════════════════════════════════════════════════════════
// LEAK 4: DOM REFERENCES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Leak 4: Detached DOM References ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DETACHED DOM REFERENCES (Browser-specific)                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   PROBLEM:                                                                  │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   const elements = [];                                                      │
 * │   const button = document.getElementById('myButton');                       │
 * │   elements.push(button);                                                    │
 * │                                                                             │
 * │   // Later, remove button from DOM                                          │
 * │   button.parentNode.removeChild(button);                                    │
 * │                                                                             │
 * │   // Button is removed from DOM but still in 'elements' array!              │
 * │   // The DOM node and all its children are STILL IN MEMORY                  │
 * │                                                                             │
 * │                                                                             │
 * │   FIX:                                                                      │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   // Remove from array too                                                  │
 * │   const index = elements.indexOf(button);                                   │
 * │   elements.splice(index, 1);                                                │
 * │                                                                             │
 * │   // OR use WeakRef/WeakMap (don't prevent GC)                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('D: (Browser) Remove DOM refs when elements removed');


// ═══════════════════════════════════════════════════════════════════════════════
// LEAK 5: EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Leak 5: Event Listeners ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ FORGOTTEN EVENT LISTENERS (Browser-specific)                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   PROBLEM:                                                                  │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   function setup() {                                                        │
 * │     const data = loadHugeData();                                            │
 * │                                                                             │
 * │     document.addEventListener('click', () => {                              │
 * │       process(data);  // 'data' captured in listener closure                │
 * │     });                                                                     │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Listener stays forever, data is never freed                            │
 * │                                                                             │
 * │                                                                             │
 * │   FIX:                                                                      │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   function setup() {                                                        │
 * │     const data = loadHugeData();                                            │
 * │                                                                             │
 * │     const handler = () => { process(data); };                               │
 * │     document.addEventListener('click', handler);                            │
 * │                                                                             │
 * │     return () => {                                                          │
 * │       document.removeEventListener('click', handler);                       │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   const cleanup = setup();                                                  │
 * │   // When done:                                                             │
 * │   cleanup();                                                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Pattern: Return cleanup function
function setupWithCleanup() {
  const data = { important: 'data' };

  const handler = () => {
    console.log('  Handler called with data');
  };

  // Simulating addEventListener
  const listeners = [];
  listeners.push(handler);

  // Return cleanup function
  return function cleanup() {
    listeners.length = 0;  // Clear listeners
    console.log('E: Event listeners cleaned up');
  };
}

const cleanup = setupWithCleanup();
cleanup();


// ═══════════════════════════════════════════════════════════════════════════════
// LEAK 6: GROWING DATA STRUCTURES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Leak 6: Unbounded Growth ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ UNBOUNDED DATA STRUCTURE GROWTH                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   PROBLEM:                                                                  │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   const cache = {};                                                         │
 * │                                                                             │
 * │   function fetchData(id) {                                                  │
 * │     if (!cache[id]) {                                                       │
 * │       cache[id] = expensiveFetch(id);  // Cache grows forever!              │
 * │     }                                                                       │
 * │     return cache[id];                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │   // With millions of unique IDs, memory explodes                           │
 * │                                                                             │
 * │                                                                             │
 * │   FIX:                                                                      │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   // Use LRU cache with max size                                            │
 * │   const cache = new LRUCache({ maxSize: 1000 });                            │
 * │                                                                             │
 * │   // Or use WeakMap for object keys (auto-cleanup)                          │
 * │   const cache = new WeakMap();                                              │
 * │                                                                             │
 * │   // Or add TTL (time-to-live)                                              │
 * │   cache[id] = { data, expires: Date.now() + 60000 };                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Simple bounded cache example
class BoundedCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  get(key) {
    return this.cache.get(key);
  }
}

const cache = new BoundedCache(3);
cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);
cache.set('d', 4);  // 'a' gets evicted
console.log('F: Bounded cache size:', cache.cache.size);  // 3


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MEMORY LEAK SUMMARY                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   1. Accidental globals    → Use strict mode, let/const                     │
 * │   2. Forgotten timers      → clearInterval/clearTimeout                     │
 * │   3. Closure references    → Null out large data                            │
 * │   4. DOM references        → Remove from arrays when DOM removed            │
 * │   5. Event listeners       → removeEventListener on cleanup                 │
 * │   6. Unbounded growth      → Use bounded caches, WeakMap, TTL               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/22-garbage-collection/02-memory-leaks.js
 */
