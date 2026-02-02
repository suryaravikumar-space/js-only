/**
 * PERFORMANCE: 04 - JavaScript Performance
 *
 * ONE CONCEPT: Keeping the main thread free and JS execution fast
 */


// =============================================================================
// THE MAIN THREAD PROBLEM
// =============================================================================

console.log('=== The Main Thread Problem ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  EVERYTHING RUNS ON ONE THREAD                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Main Thread handles:                                               │
 *   │  • JavaScript execution                                             │
 *   │  • DOM parsing                                                      │
 *   │  • Style calculation                                                │
 *   │  • Layout                                                           │
 *   │  • Paint                                                            │
 *   │  • Event handling                                                   │
 *   │  • User input                                                       │
 *   │                                                                      │
 *   │  If JS runs for 200ms:                                              │
 *   │  ┌──────────────────────────────────────┐                           │
 *   │  │████████████ JS TASK (200ms) █████████│                           │
 *   │  └──────────────────────────────────────┘                           │
 *   │       ↑ User clicks here                                           │
 *   │       └─ BLOCKED! Event can't fire until JS finishes              │
 *   │                                                                      │
 *   │  LONG TASK: Any task > 50ms                                         │
 *   │  ┌──────────────────────────────────────┐                           │
 *   │  │████████████ 200ms task ██████████████│ ← Long task!             │
 *   │  └──────────────────────────────────────┘                           │
 *   │  ┌────┐┌────┐┌────┐┌────┐               ← Broken into chunks     │
 *   │  │25ms││25ms││25ms││25ms│                  (yielding between)     │
 *   │  └────┘└────┘└────┘└────┘                                          │
 *   │       ↑ Input can be handled between chunks                        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Main thread = JS + DOM + Layout + Paint + Input');
console.log('Long task (> 50ms) blocks everything');
console.log('Solution: break into smaller chunks, yield between');


// =============================================================================
// BREAKING UP LONG TASKS
// =============================================================================

console.log('\n=== Breaking Long Tasks ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  YIELDING TO THE MAIN THREAD                                        │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. setTimeout(fn, 0) — yield after each chunk                     │
 *   │  2. requestIdleCallback — run when browser is idle                 │
 *   │  3. scheduler.yield() — yield and resume with same priority       │
 *   │  4. queueMicrotask — doesn't actually yield (same task!)          │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Pattern: Process large array in chunks
function processInChunks(items, chunkSize, processFn) {
  let index = 0;

  function processChunk() {
    const end = Math.min(index + chunkSize, items.length);
    for (let i = index; i < end; i++) {
      processFn(items[i]);
    }
    index = end;
    if (index < items.length) {
      setTimeout(processChunk, 0); // Yield to main thread
    }
  }

  processChunk();
}

// Example usage
const largeArray = Array.from({ length: 10000 }, (_, i) => i);
let sum = 0;
processInChunks(largeArray, 1000, (item) => { sum += item; });
console.log('Processing 10,000 items in chunks of 1,000');
console.log('Each chunk yields to main thread via setTimeout(fn, 0)');

// requestIdleCallback pattern
console.log('\nrequestIdleCallback:');
console.log('  Run low-priority work when browser is idle');
console.log('  requestIdleCallback((deadline) => {');
console.log('    while (deadline.timeRemaining() > 0 && tasks.length > 0) {');
console.log('      doTask(tasks.pop());');
console.log('    }');
console.log('  });');


// =============================================================================
// MEMORY & GARBAGE COLLECTION
// =============================================================================

console.log('\n=== Memory Performance ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MEMORY-EFFICIENT PATTERNS                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  AVOID:                                                              │
 *   │  • Global variables (never garbage collected)                       │
 *   │  • Closures holding large objects unnecessarily                    │
 *   │  • Forgotten timers: setInterval without clearInterval             │
 *   │  • Detached DOM nodes (JS reference to removed element)            │
 *   │  • Event listeners not removed                                      │
 *   │                                                                      │
 *   │  USE:                                                                │
 *   │  • WeakMap/WeakSet for object caches                               │
 *   │  • Object pooling for frequent allocations                         │
 *   │  • Streams for large data processing                               │
 *   │  • AbortController to cancel unused requests                       │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Object pooling example
class ObjectPool {
  constructor(createFn, initialSize = 10) {
    this.createFn = createFn;
    this.pool = Array.from({ length: initialSize }, () => createFn());
  }

  acquire() {
    return this.pool.length > 0 ? this.pool.pop() : this.createFn();
  }

  release(obj) {
    this.pool.push(obj); // Return to pool instead of GC
  }
}

const pool = new ObjectPool(() => ({ x: 0, y: 0 }), 5);
const obj = pool.acquire();
obj.x = 100;
obj.y = 200;
console.log('Object pool: reuse objects instead of creating/GC-ing');
pool.release(obj); // Back to pool


// =============================================================================
// EFFICIENT DATA STRUCTURES
// =============================================================================

console.log('\n=== Data Structure Performance ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CHOOSING THE RIGHT DATA STRUCTURE                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Lookup by key:                                                     │
 *   │    Object: O(1) but prototype chain overhead                       │
 *   │    Map:    O(1) cleaner, any key type                              │
 *   │    → Use Map for frequent add/delete of key-value pairs            │
 *   │                                                                      │
 *   │  Check existence:                                                   │
 *   │    Array.includes(): O(n)                                           │
 *   │    Set.has():        O(1)                                           │
 *   │    → Use Set for frequent lookups                                  │
 *   │                                                                      │
 *   │  Array operations:                                                  │
 *   │    push/pop:    O(1)                                                │
 *   │    shift/unshift: O(n) — avoids these on large arrays             │
 *   │    splice:      O(n)                                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Set vs Array lookup
const arr = Array.from({ length: 100000 }, (_, i) => i);
const set = new Set(arr);

console.log('Array.includes(99999): O(n) — scans entire array');
console.log('Set.has(99999):        O(1) — instant hash lookup');
console.log('Use Set for "does this exist?" checks');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "JavaScript runs on a single main thread alongside DOM updates, layout,
 * paint, and user input handling. Any task over 50ms is a 'long task'
 * that blocks the thread and makes the page feel unresponsive.
 *
 * I break long tasks into smaller chunks using setTimeout(fn, 0) to yield
 * back to the main thread between chunks, or requestIdleCallback for
 * low-priority work. For heavy computation, I move it to a Web Worker
 * which runs on a separate thread entirely.
 *
 * For memory, I avoid common leaks: forgotten timers, detached DOM nodes
 * with lingering references, and closures accidentally holding large
 * objects. I use WeakMap for caches so entries are garbage collected when
 * keys are no longer referenced. I also choose the right data structure:
 * Set for existence checks (O(1) vs Array's O(n)), Map for frequent
 * key-value operations, and avoid shift/unshift on large arrays."
 */


// RUN: node docs/30-performance/04-javascript-performance.js
