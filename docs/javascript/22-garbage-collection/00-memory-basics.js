/**
 * GARBAGE COLLECTION: 00 - Memory Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ JAVASCRIPT MEMORY MANAGEMENT                                               ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ JavaScript automatically manages memory through Garbage Collection (GC).   ║
 * ║ You don't manually allocate/free memory like in C/C++.                     ║
 * ║                                                                            ║
 * ║ BUT: Understanding memory helps avoid leaks and write efficient code!      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY LIFE CYCLE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Memory Life Cycle ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE MEMORY LIFE CYCLE                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
 * │   │   ALLOCATE   │ ──► │     USE      │ ──► │   RELEASE    │                │
 * │   │   (Automatic)│     │  (Your code) │     │  (Automatic) │                │
 * │   └──────────────┘     └──────────────┘     └──────────────┘                │
 * │                                                                             │
 * │   1. ALLOCATE: JavaScript allocates memory when you create:                 │
 * │      • Variables (primitives stored in stack)                               │
 * │      • Objects, arrays, functions (stored in heap)                          │
 * │                                                                             │
 * │   2. USE: Read from and write to memory                                     │
 * │      • Accessing object properties                                          │
 * │      • Calling functions                                                    │
 * │                                                                             │
 * │   3. RELEASE: Garbage collector frees unused memory                         │
 * │      • Automatic, but NOT immediate                                         │
 * │      • Based on "reachability"                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Allocation examples
let number = 42;                    // Allocates memory for a number
let string = "Hello";               // Allocates memory for a string
let object = { a: 1, b: 2 };        // Allocates memory for object + properties
let array = [1, 2, 3];              // Allocates memory for array + elements
let func = function() { return 1; }; // Allocates memory for function

console.log('A: Memory allocated for primitives and objects');


// ═══════════════════════════════════════════════════════════════════════════════
// STACK vs HEAP MEMORY
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Stack vs Heap ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STACK vs HEAP MEMORY                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌──────────────────────────┐    ┌──────────────────────────────────┐      │
 * │   │        STACK             │    │            HEAP                  │      │
 * │   │  (Fast, Limited Size)    │    │    (Slower, Dynamic Size)        │      │
 * │   ├──────────────────────────┤    ├──────────────────────────────────┤      │
 * │   │                          │    │                                  │      │
 * │   │  • Primitives            │    │  • Objects                       │      │
 * │   │    - number              │    │  • Arrays                        │      │
 * │   │    - string              │    │  • Functions                     │      │
 * │   │    - boolean             │    │  • Everything complex            │      │
 * │   │    - null                │    │                                  │      │
 * │   │    - undefined           │    │  Managed by Garbage Collector    │      │
 * │   │    - symbol              │    │                                  │      │
 * │   │    - bigint              │    │                                  │      │
 * │   │                          │    │                                  │      │
 * │   │  • References to heap    │    │                                  │      │
 * │   │                          │    │                                  │      │
 * │   │  Auto-managed (LIFO)     │    │                                  │      │
 * │   │                          │    │                                  │      │
 * │   └──────────────────────────┘    └──────────────────────────────────┘      │
 * │                                                                             │
 * │                                                                             │
 * │   EXAMPLE:                                                                  │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   let num = 42;                                                             │
 * │   let obj = { x: 1 };                                                       │
 * │                                                                             │
 * │   STACK:                          HEAP:                                     │
 * │   ┌─────────────┐                 ┌─────────────┐                           │
 * │   │ num: 42     │                 │ { x: 1 }    │                           │
 * │   │ obj: ───────┼─────────────────┼──►          │                           │
 * │   └─────────────┘                 └─────────────┘                           │
 * │                                                                             │
 * │   "num" holds actual value                                                  │
 * │   "obj" holds REFERENCE to heap object                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Primitives: value stored directly
let a = 10;
let b = a;  // b gets a COPY of the value
b = 20;
console.log('B: Primitives - a:', a, 'b:', b);  // a: 10, b: 20

// Objects: reference stored, actual object in heap
let objA = { value: 10 };
let objB = objA;  // objB gets REFERENCE to same object
objB.value = 20;
console.log('C: Objects - objA.value:', objA.value);  // 20 (same object!)


// ═══════════════════════════════════════════════════════════════════════════════
// WHAT IS GARBAGE COLLECTION?
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== What is Garbage Collection? ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ GARBAGE COLLECTION (GC)                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Garbage Collection is the process of finding memory that is no longer     │
 * │   used (unreachable) and freeing it automatically.                          │
 * │                                                                             │
 * │   THE CORE CONCEPT: REACHABILITY                                            │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   A value is "reachable" if it can be accessed somehow.                     │
 * │   Unreachable values are garbage collected.                                 │
 * │                                                                             │
 * │   ROOTS (Always Reachable):                                                 │
 * │   • Global variables                                                        │
 * │   • Currently executing function's local variables                          │
 * │   • Variables in the call stack                                             │
 * │   • Anything referenced by roots                                            │
 * │                                                                             │
 * │                                                                             │
 * │   REACHABILITY CHAIN:                                                       │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   ROOT ──► Object A ──► Object B ──► Object C                      │    │
 * │   │                            │                                       │    │
 * │   │                            ▼                                       │    │
 * │   │                        Object D                                    │    │
 * │   │                                                                    │    │
 * │   │   All objects A, B, C, D are REACHABLE (will not be collected)     │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * │                                                                             │
 * │   UNREACHABLE (Will be collected):                                          │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   ROOT ──► Object A                Object X ──► Object Y           │    │
 * │   │                                       ▲              │             │    │
 * │   │                                       └──────────────┘             │    │
 * │   │                                                                    │    │
 * │   │   Objects X, Y are UNREACHABLE - even though they reference        │    │
 * │   │   each other! No path from ROOT to them.                           │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Reachable example
let user = { name: 'Alice' };  // Object is reachable via 'user'
console.log('D: user is reachable:', user.name);

// Making object unreachable
user = null;  // Object { name: 'Alice' } is now unreachable - will be GC'd
console.log('E: user set to null - object will be garbage collected');


// ═══════════════════════════════════════════════════════════════════════════════
// WHEN DOES GC RUN?
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== When Does GC Run? ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ GC TIMING                                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   GC runs automatically. You CANNOT force it or know exactly when.         │
 * │                                                                             │
 * │   TYPICAL TRIGGERS:                                                         │
 * │   • Memory pressure (heap getting full)                                     │
 * │   • Idle time (browser/Node has spare cycles)                               │
 * │   • Allocation threshold reached                                            │
 * │                                                                             │
 * │   IMPORTANT:                                                                │
 * │   • GC is NOT instant - there's a delay                                     │
 * │   • GC can cause "pauses" (stop-the-world)                                  │
 * │   • Modern engines use incremental/concurrent GC to minimize pauses         │
 * │                                                                             │
 * │   You can REQUEST GC in Node.js (for debugging only):                       │
 * │   node --expose-gc script.js                                                │
 * │   global.gc();  // Hint to run GC                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('F: GC runs automatically - cannot be forced');
console.log('G: Use node --expose-gc for debugging only');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "JavaScript uses automatic garbage collection to manage memory.             │
 * │                                                                             │
 * │ Memory lifecycle:                                                           │
 * │ 1. Allocate - when variables/objects are created                            │
 * │ 2. Use - reading/writing values                                             │
 * │ 3. Release - GC frees unreachable memory                                    │
 * │                                                                             │
 * │ Stack vs Heap:                                                              │
 * │ • Stack: Primitives, fast, auto-managed                                     │
 * │ • Heap: Objects/arrays/functions, GC-managed                                │
 * │                                                                             │
 * │ The core concept is REACHABILITY:                                           │
 * │ • Values reachable from 'roots' (globals, stack) stay in memory             │
 * │ • Unreachable values are garbage collected                                  │
 * │ • Even circular references get collected if unreachable from roots          │
 * │                                                                             │
 * │ GC runs automatically - you can't force it (except for debugging).          │
 * │ Understanding GC helps avoid memory leaks."                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/22-garbage-collection/00-memory-basics.js
 */
