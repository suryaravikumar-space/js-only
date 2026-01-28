/**
 * GARBAGE COLLECTION: 01 - GC Algorithms
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ HOW GARBAGE COLLECTION WORKS                                               ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Modern JS engines (V8, SpiderMonkey) use sophisticated algorithms:         ║
 * ║                                                                            ║
 * ║ • Mark-and-Sweep (primary algorithm)                                       ║
 * ║ • Generational Collection (optimization)                                   ║
 * ║ • Incremental/Concurrent GC (reduce pauses)                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// MARK-AND-SWEEP ALGORITHM
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Mark-and-Sweep Algorithm ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MARK-AND-SWEEP (The Primary Algorithm)                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   PHASE 1: MARK                                                             │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   Starting from roots, traverse all reachable objects and "mark" them.      │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   ROOT                                                             │    │
 * │   │     │                                                              │    │
 * │   │     ▼                                                              │    │
 * │   │   [A] ✓ ──────► [B] ✓ ──────► [C] ✓                                │    │
 * │   │                    │                                               │    │
 * │   │                    ▼                                               │    │
 * │   │                  [D] ✓                                             │    │
 * │   │                                                                    │    │
 * │   │                                                                    │    │
 * │   │   [X] ✗ ◄──────► [Y] ✗    (No path from root = unmarked)           │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * │                                                                             │
 * │   PHASE 2: SWEEP                                                            │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   Scan all memory, free objects that are NOT marked.                        │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   BEFORE:  [A✓] [B✓] [X✗] [C✓] [D✓] [Y✗]                           │    │
 * │   │                                                                    │    │
 * │   │   AFTER:   [A✓] [B✓] [  ] [C✓] [D✓] [  ]  ← X, Y freed             │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * │                                                                             │
 * │   WHY IT WORKS WITH CIRCULAR REFERENCES:                                    │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   X ──► Y                                                                   │
 * │   ▲     │                                                                   │
 * │   └─────┘  Both reference each other, but NO path from ROOT!               │
 * │            Both get collected.                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Demonstrating reachability
let root = {
  child: {
    name: 'Reachable',
    grandchild: { name: 'Also Reachable' }
  }
};

console.log('A: All objects reachable from root');

// Making part unreachable
root.child = null;  // grandchild is now unreachable too!
console.log('B: child and grandchild will be collected');


// ═══════════════════════════════════════════════════════════════════════════════
// REFERENCE COUNTING (OLD METHOD - NOT USED)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Reference Counting (Historical) ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REFERENCE COUNTING (Old, problematic approach)                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Each object has a count of references pointing to it.                     │
 * │   When count = 0, object is freed.                                          │
 * │                                                                             │
 * │   let obj = { };     // refCount = 1                                        │
 * │   let ref = obj;     // refCount = 2                                        │
 * │   obj = null;        // refCount = 1                                        │
 * │   ref = null;        // refCount = 0 → FREED                                │
 * │                                                                             │
 * │                                                                             │
 * │   PROBLEM: CIRCULAR REFERENCES                                              │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   let a = {};                                                      │    │
 * │   │   let b = {};                                                      │    │
 * │   │   a.ref = b;     // b's refCount = 2                               │    │
 * │   │   b.ref = a;     // a's refCount = 2                               │    │
 * │   │                                                                    │    │
 * │   │   a = null;      // a's refCount = 1 (b still references it)       │    │
 * │   │   b = null;      // b's refCount = 1 (a still references it)       │    │
 * │   │                                                                    │    │
 * │   │   MEMORY LEAK! Both have refCount > 0 but are unreachable!         │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * │   This was a real problem in old IE browsers!                               │
 * │   Mark-and-sweep solves this because it checks REACHABILITY from roots.     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// This would leak in reference counting, but not in mark-and-sweep
function createCircular() {
  let objA = {};
  let objB = {};
  objA.ref = objB;
  objB.ref = objA;
  // When function returns, objA and objB become unreachable
  // Mark-and-sweep will collect them despite circular refs
}

createCircular();
console.log('C: Circular references cleaned up (mark-and-sweep)');


// ═══════════════════════════════════════════════════════════════════════════════
// GENERATIONAL GARBAGE COLLECTION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Generational GC ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ GENERATIONAL COLLECTION (V8's Approach)                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   OBSERVATION: Most objects die young!                                      │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   • Temporary variables, function scope objects → Short-lived               │
 * │   • Global configs, caches → Long-lived                                     │
 * │                                                                             │
 * │                                                                             │
 * │   V8 HEAP STRUCTURE:                                                        │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   ┌─────────────────────────────────────────────────────────────┐  │    │
 * │   │   │              YOUNG GENERATION (Small)                       │  │    │
 * │   │   │  ┌─────────────────┐     ┌─────────────────┐                │  │    │
 * │   │   │  │   Nursery       │     │   Intermediate  │                │  │    │
 * │   │   │  │   (New objects) │ ──► │   (Survived 1x) │                │  │    │
 * │   │   │  └─────────────────┘     └────────┬────────┘                │  │    │
 * │   │   │                                   │                         │  │    │
 * │   │   │   Minor GC (Scavenge) - Fast, frequent                      │  │    │
 * │   │   └───────────────────────────────────┼─────────────────────────┘  │    │
 * │   │                                       │                            │    │
 * │   │                                       ▼ Promotion                  │    │
 * │   │   ┌─────────────────────────────────────────────────────────────┐  │    │
 * │   │   │              OLD GENERATION (Large)                         │  │    │
 * │   │   │                                                             │  │    │
 * │   │   │   Objects that survived multiple minor GCs                  │  │    │
 * │   │   │                                                             │  │    │
 * │   │   │   Major GC (Mark-Sweep-Compact) - Slower, less frequent     │  │    │
 * │   │   └─────────────────────────────────────────────────────────────┘  │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * │                                                                             │
 * │   MINOR GC (Scavenge):                                                      │
 * │   • Fast, runs frequently                                                   │
 * │   • Only scans young generation                                             │
 * │   • Copies survivors to intermediate/old                                    │
 * │   • Typical pause: 1-10ms                                                   │
 * │                                                                             │
 * │   MAJOR GC (Mark-Sweep-Compact):                                            │
 * │   • Slower, runs less often                                                 │
 * │   • Scans entire heap                                                       │
 * │   • Compacts memory (reduces fragmentation)                                 │
 * │   • Typical pause: 10-100ms                                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('D: V8 uses generational GC:');
console.log('   - Young generation: frequent, fast GC');
console.log('   - Old generation: infrequent, thorough GC');


// ═══════════════════════════════════════════════════════════════════════════════
// INCREMENTAL & CONCURRENT GC
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Incremental & Concurrent GC ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REDUCING GC PAUSES                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   STOP-THE-WORLD (Old approach):                                            │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   JS: ═══════════════╳═══════════╳═══════════════════════════════════       │
 * │   GC:                ███████████                                            │
 * │                         PAUSE!                                              │
 * │                                                                             │
 * │                                                                             │
 * │   INCREMENTAL MARKING (Modern):                                             │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   JS: ═══════╳══════╳══════╳══════╳══════╳══════════════════════════        │
 * │   GC:        █      █      █      █      █                                  │
 * │              small pauses, interleaved                                      │
 * │                                                                             │
 * │                                                                             │
 * │   CONCURRENT GC (Modern):                                                   │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   Main:  ════════════════════════════════════════════════════════════       │
 * │   GC:    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░                                        │
 * │          Runs on separate thread!                                           │
 * │                                                                             │
 * │                                                                             │
 * │   V8 OPTIMIZATIONS:                                                         │
 * │   • Orinoco: Parallel, incremental, concurrent GC                           │
 * │   • Idle-time GC: Runs during browser idle periods                          │
 * │   • Lazy sweeping: Delays sweeping until memory needed                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('E: Modern GC minimizes pauses:');
console.log('   - Incremental: small interleaved pauses');
console.log('   - Concurrent: runs on background thread');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "JavaScript engines use Mark-and-Sweep as the primary GC algorithm:         │
 * │                                                                             │
 * │ Mark-and-Sweep:                                                             │
 * │ 1. MARK: Start from roots, traverse and mark all reachable objects          │
 * │ 2. SWEEP: Free all unmarked (unreachable) objects                           │
 * │                                                                             │
 * │ This handles circular references correctly - if objects reference each      │
 * │ other but aren't reachable from roots, they get collected.                  │
 * │                                                                             │
 * │ V8 uses Generational GC:                                                    │
 * │ • Young generation: short-lived objects, fast minor GC                      │
 * │ • Old generation: long-lived objects, slower major GC                       │
 * │ Most objects die young, so this is efficient.                               │
 * │                                                                             │
 * │ Modern optimizations:                                                       │
 * │ • Incremental marking: small pauses instead of one big pause                │
 * │ • Concurrent: GC runs on background thread                                  │
 * │ • Idle-time: GC during browser idle periods                                 │
 * │                                                                             │
 * │ The old Reference Counting approach couldn't handle circular references     │
 * │ and is no longer used."                                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/22-garbage-collection/01-gc-algorithms.js
 */
