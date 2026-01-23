/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║         JAVASCRIPT V8 ENGINE - PART 8: INTERVIEW Q&A                         ║
 * ║                                                                              ║
 * ║                    TOP 20 INTERVIEW QUESTIONS & ANSWERS                      ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  🎤 MASTER 2-MINUTE INTERVIEW EXPLANATION (Full V8 Pipeline)                 ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                              ║
 * ║  "Let me walk you through exactly what happens when you run `node file.js`: ║
 * ║                                                                              ║
 * ║  STARTUP:                                                                    ║
 * ║  Node.js initializes V8 (the JavaScript engine) and libuv (for async I/O).  ║
 * ║  Your code is read as a string and wrapped in a function that provides      ║
 * ║  exports, require, module, __filename, and __dirname.                        ║
 * ║                                                                              ║
 * ║  PARSING:                                                                    ║
 * ║  The Lexer tokenizes code into keywords, identifiers, operators.             ║
 * ║  The Parser builds an Abstract Syntax Tree representing code structure.      ║
 * ║                                                                              ║
 * ║  COMPILATION (JIT):                                                          ║
 * ║  Ignition interpreter converts AST to bytecode for fast startup.             ║
 * ║  While running, it collects type feedback - 'this function gets numbers'.   ║
 * ║  Hot code (called 1000+ times) is optimized by TurboFan into machine code.   ║
 * ║  If type assumptions break, code deoptimizes back to bytecode.               ║
 * ║                                                                              ║
 * ║  EXECUTION:                                                                  ║
 * ║  Code runs in execution contexts with hoisting, scope chain, this binding.   ║
 * ║  Call stack tracks function calls. Each call pushes a new context.           ║
 * ║                                                                              ║
 * ║  MEMORY:                                                                     ║
 * ║  Stack holds primitives and references. Heap holds objects.                  ║
 * ║  Garbage collector uses Scavenger for young objects, Mark-Sweep for old.     ║
 * ║                                                                              ║
 * ║  ASYNC (Event Loop):                                                         ║
 * ║  Single-threaded but non-blocking via event loop.                            ║
 * ║  Microtasks (Promises) have priority over macrotasks (setTimeout).           ║
 * ║  Process exits when event loop queue is empty.                               ║
 * ║                                                                              ║
 * ║  OPTIMIZATION:                                                               ║
 * ║  Hidden classes enable fast property access. Inline caching remembers        ║
 * ║  object shapes. Keep types consistent for best performance."                 ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q1: What is V8?                                                              │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   V8 is Google's open-source JavaScript engine written in C++. It powers
 *   Chrome, Node.js, Deno, and Electron. V8 compiles JavaScript to machine
 *   code using JIT compilation with two compilers: Ignition (interpreter)
 *   and TurboFan (optimizing compiler).
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q2: What happens when you run "node file.js"?                                │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   1. Node.js starts and initializes V8 and libuv
 *   2. File is read from disk as a string
 *   3. Code is wrapped in a function (providing exports, require, module, etc.)
 *   4. Lexer tokenizes the code
 *   5. Parser builds an AST
 *   6. Ignition compiles AST to bytecode
 *   7. Code executes (hot code may be optimized by TurboFan)
 *   8. Event loop processes async callbacks
 *   9. Process exits when event loop is empty
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q3: What is JIT compilation?                                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   JIT (Just-In-Time) compilation compiles code during execution rather
 *   than before. V8 uses JIT to:
 *   - Start fast with Ignition (interpreter/bytecode)
 *   - Optimize hot code with TurboFan (machine code)
 *   - Adapt optimizations based on actual runtime behavior
 *   - Deoptimize if assumptions are violated
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q4: What is the difference between Ignition and TurboFan?                    │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   IGNITION: V8's interpreter. Converts AST to bytecode. Fast startup,
 *   slower execution. Collects type feedback for TurboFan.
 *
 *   TURBOFAN: V8's optimizing compiler. Converts hot bytecode to optimized
 *   machine code. Slow compilation, very fast execution. Uses type feedback
 *   to make optimization assumptions.
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q5: What is an Execution Context?                                            │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   An execution context is an abstract container holding all information
 *   about the environment where code executes:
 *   - Variable Environment (var declarations, functions)
 *   - Lexical Environment (let/const, scope chain)
 *   - This binding
 *
 *   It has two phases: Creation (hoisting) and Execution (running code).
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q6: Explain hoisting.                                                        │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   Hoisting is the effect of the Creation Phase. Before code runs:
 *   - Function declarations are fully hoisted (can call before declaration)
 *   - var declarations are hoisted with value undefined
 *   - let/const are hoisted but in Temporal Dead Zone (ReferenceError if accessed)
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q7: What is the Temporal Dead Zone (TDZ)?                                    │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   TDZ is the period between entering a scope and the let/const declaration.
 *   Variables exist but are uninitialized. Accessing them throws ReferenceError.
 *   This helps catch bugs from using variables before declaration.
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q8: How does the scope chain work?                                           │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   When V8 looks up a variable:
 *   1. Check current scope
 *   2. Check outer scope
 *   3. Continue up until global scope
 *   4. If not found, ReferenceError
 *
 *   The chain is determined by WHERE code is written (lexical scoping),
 *   not where it's called from.
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q9: Explain "this" binding rules.                                            │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   "this" is determined by HOW a function is called:
 *   - Regular call: global (non-strict) or undefined (strict)
 *   - Method call (obj.method()): the object
 *   - Constructor (new Func()): the new object
 *   - call/apply/bind: explicitly set
 *   - Arrow function: inherits from enclosing scope (lexical this)
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q10: What is the event loop?                                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   The event loop enables async,even JavaScript despite being single-threaded:
 *   1. Execute synchronous code (call stack)
 *   2. Process ALL microtasks (Promise.then, queueMicrotask)
 *   3. Process ONE macrotask (setTimeout, I/O)
 *   4. Repeat
 *
 *   Async operations run in separate threads (browser/libuv), and their
 *   callbacks are queued for the event loop.
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q11: Microtasks vs Macrotasks?                                               │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   MICROTASKS (high priority): Promise callbacks, queueMicrotask,
 *   process.nextTick. ALL processed before next macrotask.
 *
 *   MACROTASKS (normal priority): setTimeout, setInterval, I/O.
 *   ONE processed per event loop iteration.
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q12: Stack vs Heap memory?                                                   │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   STACK: Primitives, references, call frames. Fixed size, fast, LIFO.
 *   HEAP: Objects, arrays, functions. Dynamic size, garbage collected.
 *
 *   Variables store primitives directly but only references to heap objects.
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q13: How does garbage collection work?                                       │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   V8 uses generational GC:
 *   - New Space: Young objects, Scavenger (fast, frequent)
 *   - Old Space: Long-lived objects, Mark-Sweep (slower, less frequent)
 *
 *   Mark-Sweep: Mark reachable objects from roots, sweep unmarked objects.
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q14: What are Hidden Classes?                                                │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   V8 creates hidden classes (Maps) to optimize property access. Objects
 *   with the same property structure share the same hidden class. This
 *   enables fast property access via offsets instead of hash table lookups.
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q15: What is Inline Caching?                                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   V8 caches property access information at call sites:
 *   - Monomorphic: Always same shape (fastest)
 *   - Polymorphic: 2-4 shapes (slower)
 *   - Megamorphic: Many shapes (slowest, falls back to hash table)
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q16: What causes deoptimization?                                             │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   TurboFan makes type assumptions. When violated, code deoptimizes:
 *   - Type changes (number → string)
 *   - Hidden class changes (adding/deleting properties)
 *   - Unexpected undefined/null
 *   - Using eval() or with
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q17: What is an AST?                                                         │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   Abstract Syntax Tree - a tree representation of code structure.
 *   Parser builds AST from tokens. AST captures meaning, handles operator
 *   precedence, and is used by Ignition to generate bytecode.
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q18: What are closures?                                                      │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   A closure is a function that remembers its lexical scope even when
 *   executed outside that scope. The function keeps a reference to its
 *   outer environment, keeping those variables alive in memory.
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q19: Why is JavaScript single-threaded?                                      │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   Simplicity and avoiding race conditions. Originally designed for DOM
 *   manipulation where multi-threading would cause conflicts. The event
 *   loop + async APIs provide concurrency without threading complexity.
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ Q20: How to write V8-optimized code?                                         │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ANSWER:
 *   - Keep function arguments same types (type stability)
 *   - Initialize all object properties in constructor
 *   - Don't delete properties or add after creation
 *   - Don't change variable types
 *   - Avoid eval() and with
 *   - Use consistent object shapes
 *   - Prefer object literals over incremental assignment
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ QUICK REFERENCE CHEAT SHEET                                                  │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌───────────────────────────────────────────────────────────────────────────┐
 *   │ COMPONENT          │ PURPOSE                                             │
 *   ├───────────────────────────────────────────────────────────────────────────┤
 *   │ Lexer              │ Source code → Tokens                                │
 *   │ Parser             │ Tokens → AST                                        │
 *   │ Ignition           │ AST → Bytecode (interpreter)                        │
 *   │ TurboFan           │ Bytecode → Machine code (hot code)                  │
 *   │ Stack              │ Primitives, call frames (fast, ordered)             │
 *   │ Heap               │ Objects, arrays (dynamic, GC)                       │
 *   │ Call Stack         │ Tracks current execution context                    │
 *   │ Event Loop         │ Processes async callbacks                           │
 *   │ Microtask Queue    │ Promises (high priority)                            │
 *   │ Macrotask Queue    │ setTimeout, I/O (normal priority)                   │
 *   │ Hidden Class       │ Object shape for fast property access               │
 *   │ Inline Cache       │ Cached property lookups                             │
 *   │ Scavenger          │ GC for young objects (fast)                         │
 *   │ Mark-Sweep         │ GC for old objects (thorough)                       │
 *   └───────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node javaScript-v8-architecture-flow/08-interview-qa.js
 */

// ═══════════════════════════════════════════════════════════════════════════════
//                         QUICK TEST YOURSELF
// ═══════════════════════════════════════════════════════════════════════════════

console.log('═'.repeat(70));
console.log('       PART 8: INTERVIEW Q&A - TEST YOURSELF');
console.log('═'.repeat(70));

console.log('\nQUICK QUIZ - Predict the output:\n');

// Quiz 1
console.log('QUIZ 1: Hoisting');
console.log('─'.repeat(40));
console.log('   Code: console.log(x); var x = 10;');
console.log('   Your answer: ___________');
console.log('   Actual:', (function() { console.log = function(){}; var x; return typeof x; })());
console.log('   Answer: undefined (var hoisted with undefined)\n');

// Quiz 2
console.log('QUIZ 2: Event Loop');
console.log('─'.repeat(40));
console.log('   Code:');
console.log('   console.log("A");');
console.log('   setTimeout(() => console.log("B"), 0);');
console.log('   Promise.resolve().then(() => console.log("C"));');
console.log('   console.log("D");');
console.log('   Answer: A, D, C, B (sync, sync, microtask, macrotask)\n');

// Quiz 3
console.log('QUIZ 3: This Binding');
console.log('─'.repeat(40));
var quizObj = {
  name: 'quiz',
  regular: function() { return this.name; },
  arrow: () => this.name
};
console.log('   obj.regular():', quizObj.regular());
console.log('   obj.arrow():', quizObj.arrow() || 'undefined');
console.log('   Explanation: Arrow function inherits "this" from outer scope\n');

// Quiz 4
console.log('QUIZ 4: Closure');
console.log('─'.repeat(40));
function createAdder(x) {
  return function(y) {
    return x + y;
  };
}
var add5 = createAdder(5);
console.log('   createAdder(5)(10):', add5(10));
console.log('   Explanation: Closure remembers x = 5\n');

// Quiz 5
console.log('QUIZ 5: Reference vs Value');
console.log('─'.repeat(40));
var arr1 = [1, 2, 3];
var arr2 = arr1;
arr2.push(4);
console.log('   arr1:', arr1);
console.log('   arr2:', arr2);
console.log('   Explanation: Arrays are reference types, both point to same object\n');

console.log('═'.repeat(70));
console.log('       Study the comments above to ace your interview!');
console.log('═'.repeat(70));

console.log('\n\nFILE INDEX:');
console.log('─'.repeat(40));
console.log('   01-big-picture.js      - V8 overview, mind map');
console.log('   02-parsing-phase.js    - Tokenization, AST');
console.log('   03-compilation-phase.js - Ignition, TurboFan');
console.log('   04-execution-phase.js  - Context, stack, scope');
console.log('   05-memory-management.js - Stack, heap, GC');
console.log('   06-event-loop.js       - Async, event loop');
console.log('   07-optimization.js     - Hidden classes, IC');
console.log('   08-interview-qa.js     - Interview questions\n');
