/**
 * GARBAGE COLLECTION: 09 - Interview Questions & Answers
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMPLETE INTERVIEW GUIDE - Memory & Garbage Collection                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Everything you need to know about JS memory management for interviews      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q1: How does garbage collection work in JavaScript?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q1: How does garbage collection work in JavaScript?                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ JavaScript uses automatic garbage collection based on REACHABILITY.         │
 * │                                                                             │
 * │ The main algorithm is MARK-AND-SWEEP:                                       │
 * │                                                                             │
 * │ 1. MARK PHASE:                                                              │
 * │    Starting from "roots" (global object, stack variables),                  │
 * │    traverse all reachable objects and mark them.                            │
 * │                                                                             │
 * │ 2. SWEEP PHASE:                                                             │
 * │    Scan all memory, free anything that wasn't marked.                       │
 * │                                                                             │
 * │ This handles circular references correctly - if objects reference           │
 * │ each other but aren't reachable from roots, they're collected.              │
 * │                                                                             │
 * │ Modern engines (V8) also use:                                               │
 * │ • Generational GC: Young generation (frequent GC) + old generation          │
 * │ • Incremental marking: Small pauses instead of one big pause                │
 * │ • Concurrent GC: Runs on background thread                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q2: What causes memory leaks in JavaScript?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q2: What causes memory leaks in JavaScript?                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ Memory leaks occur when memory that's no longer needed is still             │
 * │ reachable (accidentally held reference).                                    │
 * │                                                                             │
 * │ COMMON CAUSES:                                                              │
 * │                                                                             │
 * │ 1. Accidental globals:                                                      │
 * │    data = value;  // Missing let/const → global!                            │
 * │                                                                             │
 * │ 2. Forgotten timers:                                                        │
 * │    setInterval(() => use(data), 1000);  // Never cleared                    │
 * │                                                                             │
 * │ 3. Closures holding references:                                             │
 * │    function outer() {                                                       │
 * │      const hugeData = [...];                                                │
 * │      return () => console.log('hi');  // May retain hugeData                │
 * │    }                                                                        │
 * │                                                                             │
 * │ 4. Detached DOM references:                                                 │
 * │    const button = document.getElementById('btn');                           │
 * │    array.push(button);                                                      │
 * │    button.remove();  // Button still in array!                              │
 * │                                                                             │
 * │ 5. Event listeners not removed:                                             │
 * │    element.addEventListener('click', handler);                              │
 * │    // Never removeEventListener                                             │
 * │                                                                             │
 * │ 6. Unbounded caches/arrays:                                                 │
 * │    cache[id] = data;  // Grows forever                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q3: Stack vs Heap?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q3: What's the difference between stack and heap memory?                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ STACK:                                                                      │
 * │ • Stores primitives (number, string, boolean, etc.)                         │
 * │ • Stores references to heap objects                                         │
 * │ • Fast allocation (LIFO)                                                    │
 * │ • Automatically managed (function scope)                                    │
 * │ • Limited size                                                              │
 * │                                                                             │
 * │ HEAP:                                                                       │
 * │ • Stores objects, arrays, functions                                         │
 * │ • Dynamic size allocation                                                   │
 * │ • Managed by garbage collector                                              │
 * │ • Slower than stack                                                         │
 * │                                                                             │
 * │ EXAMPLE:                                                                    │
 * │                                                                             │
 * │ let num = 42;           // Stack: holds value 42                            │
 * │ let obj = { x: 1 };     // Stack: holds reference                           │
 * │                         // Heap: holds { x: 1 }                             │
 * │                                                                             │
 * │ let num2 = num;         // Stack: copies value (separate 42)                │
 * │ let obj2 = obj;         // Stack: copies reference (same object)            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q4: WeakMap vs Map?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q4: What's the difference between WeakMap and Map?                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ Map:                                                                        │
 * │ • Keys can be any type                                                      │
 * │ • Strong references - prevents GC of keys                                   │
 * │ • Iterable (for...of, .keys(), .values())                                   │
 * │ • Has .size property                                                        │
 * │                                                                             │
 * │ WeakMap:                                                                    │
 * │ • Keys must be objects                                                      │
 * │ • Weak references - keys can be garbage collected                           │
 * │ • NOT iterable (can't know when GC runs)                                    │
 * │ • No .size property                                                         │
 * │ • Entries auto-removed when key is GC'd                                     │
 * │                                                                             │
 * │ USE CASES for WeakMap:                                                      │
 * │ • Private data for objects                                                  │
 * │ • Caching computed values                                                   │
 * │ • DOM element metadata                                                      │
 * │ • Any case where you want automatic cleanup                                 │
 * │                                                                             │
 * │ EXAMPLE:                                                                    │
 * │                                                                             │
 * │ let user = { name: 'Alice' };                                               │
 * │ const map = new Map();                                                      │
 * │ const weakMap = new WeakMap();                                              │
 * │                                                                             │
 * │ map.set(user, 'data');                                                      │
 * │ weakMap.set(user, 'data');                                                  │
 * │                                                                             │
 * │ user = null;                                                                │
 * │ // Map still has entry                                                      │
 * │ // WeakMap entry will be GC'd                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q5: How to detect memory leaks?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q5: How do you detect and debug memory leaks?                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ SYMPTOMS:                                                                   │
 * │ • Memory usage grows over time                                              │
 * │ • No sawtooth pattern (GC doesn't help)                                     │
 * │ • Eventually crashes with "heap out of memory"                              │
 * │                                                                             │
 * │ CHROME DEVTOOLS:                                                            │
 * │ 1. Open Memory tab                                                          │
 * │ 2. Take heap snapshot (baseline)                                            │
 * │ 3. Perform suspected leaking actions                                        │
 * │ 4. Take another snapshot                                                    │
 * │ 5. Compare snapshots - look for growing objects                             │
 * │ 6. Check "Retainers" to find what's holding references                      │
 * │                                                                             │
 * │ NODE.JS:                                                                    │
 * │ • process.memoryUsage() - track heapUsed over time                          │
 * │ • node --inspect - connect Chrome DevTools                                  │
 * │ • node --trace-gc - log GC events                                           │
 * │ • v8.writeHeapSnapshot() - create snapshot file                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CHEAT SHEET
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║              GARBAGE COLLECTION INTERVIEW CHEAT SHEET                      ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  MEMORY LIFECYCLE:                                                         ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  Allocate → Use → Release (automatic via GC)                               ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  STACK vs HEAP:                                                            ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  Stack: Primitives, references (fast, auto-managed)                        ║
 * ║  Heap: Objects, arrays, functions (GC-managed)                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  GC ALGORITHM (Mark-and-Sweep):                                            ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  1. Mark all reachable objects from roots                                  ║
 * ║  2. Sweep (free) all unmarked objects                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  REACHABILITY (Key Concept):                                               ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  Roots: globals, stack, closure variables                                  ║
 * ║  Anything reachable from roots survives GC                                 ║
 * ║  Circular references CAN be collected if unreachable from roots            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  COMMON MEMORY LEAKS:                                                      ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  1. Accidental globals       → Use strict mode, let/const                  ║
 * ║  2. Forgotten timers         → clearInterval/clearTimeout                  ║
 * ║  3. Closure references       → Null out large data                         ║
 * ║  4. DOM references           → Remove from arrays when DOM removed         ║
 * ║  5. Event listeners          → removeEventListener on cleanup              ║
 * ║  6. Unbounded caches         → Use LRU cache, WeakMap, TTL                 ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  WeakMap/WeakSet:                                                          ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  • Object keys only                                                        ║
 * ║  • Don't prevent GC                                                        ║
 * ║  • Auto-cleanup when keys GC'd                                             ║
 * ║  • Not iterable                                                            ║
 * ║  • Use for: caches, private data, metadata                                 ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  V8 OPTIMIZATIONS:                                                         ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  • Generational GC (young/old generation)                                  ║
 * ║  • Incremental marking (small pauses)                                      ║
 * ║  • Concurrent GC (background thread)                                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  DEBUGGING:                                                                ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  • process.memoryUsage() in Node.js                                        ║
 * ║  • Chrome DevTools Memory tab                                              ║
 * ║  • Heap snapshots + comparison                                             ║
 * ║  • node --inspect, --trace-gc                                              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/22-garbage-collection/09-interview-qa.js
 */

console.log('=== Garbage Collection Interview Q&A ===');
console.log('Review the detailed answers in the comments above');

// Quick demo
console.log('\n=== Quick Memory Demo ===\n');

function formatBytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

const mem = process.memoryUsage();
console.log('Current Memory:');
console.log(`  Heap Used: ${formatBytes(mem.heapUsed)}`);
console.log(`  Heap Total: ${formatBytes(mem.heapTotal)}`);
