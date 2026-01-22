/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║         JAVASCRIPT V8 ENGINE - PART 5: MEMORY MANAGEMENT                     ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ STACK vs HEAP                                                                │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌────────────────────────────────┬────────────────────────────────────────┐
 *   │           STACK                │               HEAP                     │
 *   ├────────────────────────────────┼────────────────────────────────────────┤
 *   │                                │                                        │
 *   │ STORES:                        │ STORES:                                │
 *   │ • Primitive values             │ • Objects { }                          │
 *   │   (number, string, boolean,    │ • Arrays [ ]                           │
 *   │    null, undefined, symbol,    │ • Functions                            │
 *   │    bigint)                     │ • Closures                             │
 *   │ • References (pointers to      │ • Strings (large ones)                 │
 *   │   heap objects)                │                                        │
 *   │ • Function call frames         │                                        │
 *   │                                │                                        │
 *   │ CHARACTERISTICS:               │ CHARACTERISTICS:                       │
 *   │ • Fixed size (~1MB)            │ • Dynamic size                         │
 *   │ • Very fast access             │ • Slower access                        │
 *   │ • LIFO (auto cleanup)          │ • Garbage collected                    │
 *   │ • Ordered                      │ • Unordered                            │
 *   │                                │                                        │
 *   └────────────────────────────────┴────────────────────────────────────────┘
 *
 *
 *   MEMORY VISUALIZATION:
 *   ═════════════════════
 *
 *   var num = 42;                    // Stack: num = 42
 *   var str = "hi";                  // Stack: str = "hi"
 *   var obj = { name: "Surya" };     // Stack: obj = 0x7f2a (reference)
 *                                    // Heap:  { name: "Surya" } at 0x7f2a
 *   var arr = [1, 2, 3];             // Stack: arr = 0x8b3c (reference)
 *                                    // Heap:  [1, 2, 3] at 0x8b3c
 *
 *
 *   ┌─────────────────────────────┐     ┌─────────────────────────────────────┐
 *   │          STACK              │     │               HEAP                  │
 *   ├─────────────────────────────┤     ├─────────────────────────────────────┤
 *   │                             │     │                                     │
 *   │  num: 42                    │     │  0x7f2a: { name: "Surya" }          │
 *   │  str: "hi"                  │     │                                     │
 *   │  obj: 0x7f2a ───────────────┼────▶│                                     │
 *   │  arr: 0x8b3c ───────────────┼────▶│  0x8b3c: [1, 2, 3]                  │
 *   │                             │     │                                     │
 *   └─────────────────────────────┘     └─────────────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ V8 HEAP STRUCTURE                                                            │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────────┐
 *   │                              HEAP MEMORY                                    │
 *   ├─────────────────────────────────────────────────────────────────────────────┤
 *   │                                                                             │
 *   │  ┌─────────────────────────────────────────────────────────────────────┐   │
 *   │  │                    NEW SPACE (Young Generation)                     │   │
 *   │  │                                                                     │   │
 *   │  │  ┌─────────────────┐     ┌─────────────────┐                        │   │
 *   │  │  │   FROM SPACE    │     │    TO SPACE     │                        │   │
 *   │  │  │                 │     │                 │                        │   │
 *   │  │  │ New objects     │────▶│  Survivors      │                        │   │
 *   │  │  │ created here    │     │  copied here    │                        │   │
 *   │  │  │                 │     │                 │                        │   │
 *   │  │  └─────────────────┘     └─────────────────┘                        │   │
 *   │  │                                                                     │   │
 *   │  │  SCAVENGER (Minor GC): Fast (1-2ms), frequent                       │   │
 *   │  └─────────────────────────────────────────────────────────────────────┘   │
 *   │                              │                                             │
 *   │                   Objects that survive 2+ scavenges                        │
 *   │                              │                                             │
 *   │                              ▼                                             │
 *   │  ┌─────────────────────────────────────────────────────────────────────┐   │
 *   │  │                   OLD SPACE (Old Generation)                        │   │
 *   │  │                                                                     │   │
 *   │  │  Long-lived objects                                                 │   │
 *   │  │                                                                     │   │
 *   │  │  MARK-SWEEP (Major GC): Slower (50-200ms), less frequent            │   │
 *   │  │  MARK-COMPACT: Defragments memory                                   │   │
 *   │  │                                                                     │   │
 *   │  └─────────────────────────────────────────────────────────────────────┘   │
 *   │                                                                             │
 *   │  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────────┐   │
 *   │  │   LARGE OBJECT    │  │    CODE SPACE     │  │     MAP SPACE         │   │
 *   │  │     SPACE         │  │                   │  │                       │   │
 *   │  │ Objects > 1MB     │  │ Compiled code     │  │ Hidden classes        │   │
 *   │  └───────────────────┘  └───────────────────┘  └───────────────────────┘   │
 *   │                                                                             │
 *   └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ GARBAGE COLLECTION ALGORITHMS                                                │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   GENERATIONAL HYPOTHESIS:
 *   ════════════════════════
 *   "Most objects die young" - V8 optimizes for this observation
 *
 *
 *   1. SCAVENGER (Minor GC) - For New Space
 *   ═══════════════════════════════════════
 *
 *   ┌─────────────────┐     ┌─────────────────┐
 *   │   FROM SPACE    │     │    TO SPACE     │
 *   │                 │     │                 │
 *   │  A  B  C  D     │     │                 │
 *   │  ▲     ▲        │     │                 │
 *   │  │     │        │     │                 │
 *   │ live  live      │     │                 │
 *   └─────────────────┘     └─────────────────┘
 *            │
 *            │ Copy survivors
 *            ▼
 *   ┌─────────────────┐     ┌─────────────────┐
 *   │   FROM SPACE    │     │    TO SPACE     │
 *   │                 │     │                 │
 *   │   (empty)       │     │   A     C       │
 *   │                 │     │                 │
 *   │                 │     │                 │
 *   └─────────────────┘     └─────────────────┘
 *            │
 *            │ Swap spaces
 *            ▼
 *        (Continue)
 *
 *
 *   2. MARK-SWEEP (Major GC) - For Old Space
 *   ════════════════════════════════════════
 *
 *   BEFORE GC:                           AFTER MARK:
 *   ══════════                           ═══════════
 *
 *         ROOT                                 ROOT
 *          │                                    │
 *          ▼                                    ▼
 *     ┌─────────┐      ┌─────────┐         ┌─────────┐      ┌─────────┐
 *     │ Obj A   │─────▶│ Obj B   │         │ Obj A ✓ │─────▶│ Obj B ✓ │
 *     └─────────┘      └─────────┘         └─────────┘      └─────────┘
 *          │                                    │
 *          ▼                                    ▼
 *     ┌─────────┐      ┌─────────┐         ┌─────────┐      ┌─────────┐
 *     │ Obj C   │      │ Obj D   │         │ Obj C ✓ │      │ Obj D   │
 *     └─────────┘      └─────────┘         └─────────┘      └─────────┘
 *                      (unreachable)                        (unmarked)
 *
 *   AFTER SWEEP:
 *   ════════════
 *         ROOT
 *          │
 *          ▼
 *     ┌─────────┐      ┌─────────┐
 *     │ Obj A   │─────▶│ Obj B   │
 *     └─────────┘      └─────────┘
 *          │
 *          ▼
 *     ┌─────────┐      ┌ ─ ─ ─ ─┐
 *     │ Obj C   │         FREED   ◄── Obj D unreachable, memory freed!
 *     └─────────┘      └ ─ ─ ─ ─┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ GARBAGE COLLECTION TABLE                                                     │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────┬─────────────────┬─────────────────┬─────────────────────┐
 *   │ GC TYPE         │ TARGET          │ SPEED           │ FREQUENCY           │
 *   ├─────────────────┼─────────────────┼─────────────────┼─────────────────────┤
 *   │ Scavenger       │ New Space       │ 1-2ms           │ Very frequent       │
 *   │ (Minor GC)      │ (Young Gen)     │ (very fast)     │                     │
 *   ├─────────────────┼─────────────────┼─────────────────┼─────────────────────┤
 *   │ Mark-Sweep      │ Old Space       │ 50-200ms        │ Less frequent       │
 *   │ (Major GC)      │ (Old Gen)       │ (slower)        │                     │
 *   ├─────────────────┼─────────────────┼─────────────────┼─────────────────────┤
 *   │ Mark-Compact    │ Old Space       │ Slowest         │ When fragmented     │
 *   │                 │ (fragmented)    │                 │                     │
 *   └─────────────────┴─────────────────┴─────────────────┴─────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ MEMORY LEAKS - COMMON CAUSES                                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────┬───────────────────────────────────────────────────┐
 *   │ LEAK TYPE           │ EXAMPLE                                           │
 *   ├─────────────────────┼───────────────────────────────────────────────────┤
 *   │ Global variables    │ function leak() { data = []; } // No var/let!    │
 *   │                     │ // Creates global, never garbage collected       │
 *   ├─────────────────────┼───────────────────────────────────────────────────┤
 *   │ Forgotten timers    │ setInterval(() => { ... }, 1000);                 │
 *   │                     │ // Never cleared, keeps references alive          │
 *   ├─────────────────────┼───────────────────────────────────────────────────┤
 *   │ Closures holding    │ function outer() {                                │
 *   │ references          │   var bigData = new Array(1000000);               │
 *   │                     │   return function() { console.log(bigData[0]); }  │
 *   │                     │ } // bigData stays in memory                      │
 *   ├─────────────────────┼───────────────────────────────────────────────────┤
 *   │ Event listeners     │ element.addEventListener('click', handler);       │
 *   │ not removed         │ // Element removed but listener keeps references  │
 *   ├─────────────────────┼───────────────────────────────────────────────────┤
 *   │ Detached DOM        │ var div = document.createElement('div');          │
 *   │                     │ // Never attached or reference kept               │
 *   └─────────────────────┴───────────────────────────────────────────────────┘
 *
 *
 * RUN: node javaScript-v8-architecture-flow/05-memory-management.js
 */

// ═══════════════════════════════════════════════════════════════════════════════
//                         EXECUTABLE EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('═'.repeat(70));
console.log('       PART 5: MEMORY MANAGEMENT - STACK, HEAP, GC');
console.log('═'.repeat(70));

// 1. Stack vs Heap Demo
console.log('\n1. STACK vs HEAP DEMO:');
console.log('─'.repeat(40));

var num = 42;                    // Stack
var str = "hello";               // Stack (small string)
var obj = { name: "Surya" };     // Stack: reference, Heap: object
var arr = [1, 2, 3];             // Stack: reference, Heap: array

console.log('   num (primitive):', num, '→ stored in Stack');
console.log('   str (primitive):', str, '→ stored in Stack');
console.log('   obj (object):', obj, '→ reference in Stack, data in Heap');
console.log('   arr (array):', arr, '→ reference in Stack, data in Heap');

// 2. Reference vs Value Demo
console.log('\n2. REFERENCE vs VALUE DEMO:');
console.log('─'.repeat(40));

// Primitives are copied by VALUE
var a = 10;
var b = a;
b = 20;
console.log('   Primitives (copy by value):');
console.log('   a = 10, b = a, b = 20');
console.log('   a:', a, ', b:', b, '(a unchanged!)');

// Objects are copied by REFERENCE
var obj1 = { x: 10 };
var obj2 = obj1;
obj2.x = 20;
console.log('\n   Objects (copy by reference):');
console.log('   obj1 = {x:10}, obj2 = obj1, obj2.x = 20');
console.log('   obj1.x:', obj1.x, ', obj2.x:', obj2.x, '(both changed!)');

// 3. Memory Usage Demo
console.log('\n3. MEMORY USAGE DEMO:');
console.log('─'.repeat(40));

var before = process.memoryUsage().heapUsed;
var bigArray = new Array(100000).fill('data');
var after = process.memoryUsage().heapUsed;
console.log('   Created array with 100,000 elements');
console.log('   Memory before:', Math.round(before / 1024), 'KB');
console.log('   Memory after:', Math.round(after / 1024), 'KB');
console.log('   Difference:', Math.round((after - before) / 1024), 'KB');

// 4. Garbage Collection Demo
console.log('\n4. GARBAGE COLLECTION DEMO:');
console.log('─'.repeat(40));

function createGarbage() {
  var temp = new Array(10000).fill('garbage');
  // temp goes out of scope, becomes eligible for GC
  return 'done';
}

var memBefore = process.memoryUsage().heapUsed;
for (var i = 0; i < 100; i++) {
  createGarbage();
}
// Force GC if available (Node.js with --expose-gc flag)
if (global.gc) {
  global.gc();
  console.log('   Forced GC');
} else {
  console.log('   (Run with --expose-gc to force GC)');
}
var memAfter = process.memoryUsage().heapUsed;
console.log('   Created and discarded 100 large arrays');
console.log('   Memory change:', Math.round((memAfter - memBefore) / 1024), 'KB');
console.log('   (GC cleans up unreachable objects)');

// 5. Closure Memory Demo
console.log('\n5. CLOSURE MEMORY DEMO:');
console.log('─'.repeat(40));

function createClosure() {
  var capturedData = new Array(1000).fill('captured');
  return function() {
    return capturedData.length;
  };
}

var closure = createClosure();
console.log('   Closure created, accessing captured data:', closure());
console.log('   The 1000-element array stays in memory (closure reference)');
console.log('   Setting closure = null would allow GC to free it');

console.log('\n' + '═'.repeat(70));
console.log('       Read the comments above for complete memory details!');
console.log('═'.repeat(70) + '\n');
