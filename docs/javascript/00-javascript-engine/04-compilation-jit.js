/**
 * LESSON 04: JIT Compilation (Ignition + TurboFan) - DEEP DIVE
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STORY: THE SMART CHEF                                                      ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A chef (V8) starts cooking immediately with basic recipes (Ignition        ║
 * ║ interpreter). When the chef notices a dish is ordered 1000 times           ║
 * ║ (hot code), they create a specialized efficient process for it             ║
 * ║ (TurboFan optimized code). If someone orders the same dish but with       ║
 * ║ a weird substitution (type change), the chef has to go back to the        ║
 * ║ basic recipe (deoptimization).                                            ║
 * ║                                                                            ║
 * ║ That's JIT (Just-In-Time) Compilation - a hybrid approach:                ║
 * ║                                                                            ║
 * ║   INTERPRETER (Ignition): Fast startup, slower execution                   ║
 * ║   COMPILER (TurboFan):    Slow startup, faster execution                   ║
 * ║                                                                            ║
 * ║ V8's Pipeline:                                                             ║
 * ║   Source → Parser → AST → Ignition (Bytecode) → [Hot?] → TurboFan (Native) ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERPRETER vs COMPILER vs JIT                                             ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ PURE INTERPRETER (Old JavaScript engines):                                 ║
 * ║ ──────────────────────────────────────────                                 ║
 * ║   Source → Parse → Execute line by line                                    ║
 * ║   ✓ Fast startup (no compilation wait)                                     ║
 * ║   ✗ Slow execution (re-parses code each time)                              ║
 * ║   ✗ No optimizations                                                       ║
 * ║                                                                            ║
 * ║ PURE COMPILER (C, C++, Rust):                                              ║
 * ║ ─────────────────────────────                                              ║
 * ║   Source → Parse → Compile ALL → Execute                                   ║
 * ║   ✓ Very fast execution                                                    ║
 * ║   ✓ Many optimizations                                                     ║
 * ║   ✗ Slow startup (must compile everything first)                           ║
 * ║   ✗ Can't adapt to runtime behavior                                        ║
 * ║                                                                            ║
 * ║ JIT COMPILER (V8, SpiderMonkey, JavaScriptCore):                           ║
 * ║ ────────────────────────────────────────────────                           ║
 * ║   Source → Parse → Interpret → [Hot Code] → Compile → Execute              ║
 * ║   ✓ Fast startup (interprets immediately)                                  ║
 * ║   ✓ Fast execution for hot code (gets compiled)                            ║
 * ║   ✓ Can optimize based on ACTUAL runtime behavior                          ║
 * ║   ✗ More complex implementation                                            ║
 * ║   ✗ Memory overhead (stores both bytecode and machine code)                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ V8's COMPILATION PIPELINE                                                  ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║                         ┌──────────────┐                                   ║
 * ║                         │ Source Code  │                                   ║
 * ║                         └──────┬───────┘                                   ║
 * ║                                │                                           ║
 * ║                                ▼                                           ║
 * ║                         ┌──────────────┐                                   ║
 * ║                         │   Parser     │                                   ║
 * ║                         │  (Creates    │                                   ║
 * ║                         │    AST)      │                                   ║
 * ║                         └──────┬───────┘                                   ║
 * ║                                │                                           ║
 * ║                                ▼                                           ║
 * ║  ┌────────────────────────────────────────────────────────────────────┐   ║
 * ║  │                        IGNITION                                     │   ║
 * ║  │                    (Interpreter)                                    │   ║
 * ║  │                                                                     │   ║
 * ║  │  • Compiles AST to BYTECODE                                         │   ║
 * ║  │  • Bytecode is compact (smaller than AST)                           │   ║
 * ║  │  • Executes bytecode immediately                                    │   ║
 * ║  │  • Collects type feedback (profiling data)                          │   ║
 * ║  │                                                                     │   ║
 * ║  │  Example bytecode:                                                  │   ║
 * ║  │    LdaSmi [10]      // Load small integer 10                        │   ║
 * ║  │    Star r0          // Store in register 0                          │   ║
 * ║  │    LdaSmi [20]      // Load small integer 20                        │   ║
 * ║  │    Add r0, [0]      // Add register 0                               │   ║
 * ║  │    Return           // Return result                                │   ║
 * ║  │                                                                     │   ║
 * ║  └─────────────────────────────┬──────────────────────────────────────┘   ║
 * ║                                │                                           ║
 * ║                                │ Is this code HOT?                         ║
 * ║                                │ (Called many times)                       ║
 * ║                                │                                           ║
 * ║              ┌─────────────────┴─────────────────┐                         ║
 * ║              │                                   │                         ║
 * ║             NO                                  YES                        ║
 * ║              │                                   │                         ║
 * ║              ▼                                   ▼                         ║
 * ║  ┌───────────────────┐          ┌────────────────────────────────────┐    ║
 * ║  │ Continue with     │          │            TURBOFAN                │    ║
 * ║  │ Bytecode          │          │       (Optimizing Compiler)        │    ║
 * ║  │                   │          │                                    │    ║
 * ║  │ Most code stays   │          │ • Uses type feedback from Ignition │    ║
 * ║  │ at this level     │          │ • Generates optimized machine code │    ║
 * ║  │                   │          │ • Inlines small functions          │    ║
 * ║  └───────────────────┘          │ • Eliminates dead code             │    ║
 * ║                                 │ • Speculates on types              │    ║
 * ║                                 │                                    │    ║
 * ║                                 └─────────────────┬──────────────────┘    ║
 * ║                                                   │                        ║
 * ║                                                   │ Type assumption        ║
 * ║                                                   │ violated?              ║
 * ║                                                   │                        ║
 * ║                                                   ▼                        ║
 * ║                                 ┌────────────────────────────────────┐    ║
 * ║                                 │         DEOPTIMIZATION             │    ║
 * ║                                 │                                    │    ║
 * ║                                 │ If optimized code's assumptions    │    ║
 * ║                                 │ are wrong, BAIL OUT to bytecode    │    ║
 * ║                                 │                                    │    ║
 * ║                                 │ Example: Function was optimized    │    ║
 * ║                                 │ for numbers, but string passed     │    ║
 * ║                                 │                                    │    ║
 * ║                                 └────────────────────────────────────┘    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
//                    DEMONSTRATING JIT BEHAVIOR
// ═══════════════════════════════════════════════════════════════════════════════

console.log('═'.repeat(70));
console.log('DEMO A: Cold vs Hot Code Performance');
console.log('═'.repeat(70));

function addNumbers(a, b) {
  return a + b;
}

// First call - Code is "cold" - runs in interpreter (Ignition)
console.log('First call (cold):', addNumbers(1, 2));

// After many calls, V8 considers it "hot" and optimizes
console.log('Running 100,000 iterations to make code "hot"...');

const start = Date.now();
for (let i = 0; i < 100000; i++) {
  addNumbers(i, i + 1);
}
const hotTime = Date.now() - start;
console.log(`Hot code execution time: ${hotTime} ms`);

// Note: In real V8, optimization happens after ~1000-10000 calls
// The exact threshold depends on many factors

console.log();
console.log('═'.repeat(70));
console.log('DEMO B: Type Stability and Optimization');
console.log('═'.repeat(70));

// This function is TYPE STABLE - always receives numbers
function addNumbersStable(a, b) {
  return a + b;
}

// This function is TYPE UNSTABLE - receives different types
function addAnything(a, b) {
  return a + b;
}

// Warm up both functions with consistent types
for (let i = 0; i < 10000; i++) {
  addNumbersStable(i, i);
  addAnything(i, i);
}

// Now test stable function
const startStable = Date.now();
let sumStable = 0;
for (let i = 0; i < 1000000; i++) {
  sumStable = addNumbersStable(i, 1);
}
const timeStable = Date.now() - startStable;
console.log(`Type-stable function (always numbers): ${timeStable} ms`);

// Now BREAK the optimization by passing different types
addAnything('hello', ' world');  // String concatenation!
addAnything([1], [2]);           // Array concatenation!

const startUnstable = Date.now();
let sumUnstable = 0;
for (let i = 0; i < 1000000; i++) {
  sumUnstable = addAnything(i, 1);
}
const timeUnstable = Date.now() - startUnstable;
console.log(`Type-unstable function (mixed types): ${timeUnstable} ms`);
console.log(`Difference: ${timeUnstable - timeStable} ms slower`);

console.log();
console.log('═'.repeat(70));
console.log('DEMO C: Deoptimization in Action');
console.log('═'.repeat(70));

function processValue(x) {
  // V8 will optimize this assuming x is always a number
  return x * 2 + 1;
}

// Train V8 to expect numbers
console.log('Training with numbers...');
for (let i = 0; i < 10000; i++) {
  processValue(i);
}
console.log('Function is now optimized for numbers');

// Measure optimized performance
const startOpt = Date.now();
for (let i = 0; i < 1000000; i++) {
  processValue(i);
}
console.log(`Optimized (numbers): ${Date.now() - startOpt} ms`);

// Now pass a string - this will cause DEOPTIMIZATION
console.log('\nPassing a string to trigger deoptimization...');
console.log('Result with string:', processValue('5'));  // NaN or "52" + 1 = "521"

// After deopt, V8 has to re-optimize or use slower path
const startDeopt = Date.now();
for (let i = 0; i < 1000000; i++) {
  processValue(i);
}
console.log(`After deoptimization: ${Date.now() - startDeopt} ms`);

console.log();
console.log('═'.repeat(70));
console.log('DEMO D: Hidden Classes and Object Shape');
console.log('═'.repeat(70));

/**
 * V8 creates "Hidden Classes" (also called "Maps" or "Shapes") for objects.
 * Objects with the same structure share the same hidden class.
 * This enables fast property access.
 */

// GOOD: Objects with consistent shape
function createPointGood(x, y) {
  const point = {};
  point.x = x;
  point.y = y;
  return point;
}

// BAD: Objects with inconsistent property order
function createPointBad(x, y) {
  const point = {};
  if (x > 0) {
    point.x = x;
    point.y = y;
  } else {
    point.y = y;  // Different order!
    point.x = x;
  }
  return point;
}

// BEST: Initialize all properties at once
function createPointBest(x, y) {
  return { x: x, y: y };  // Always same shape
}

// Benchmark
console.log('Creating 100,000 points with each method...');

const startGood = Date.now();
const pointsGood = [];
for (let i = 0; i < 100000; i++) {
  pointsGood.push(createPointGood(i, i));
}
console.log(`Consistent shape (good): ${Date.now() - startGood} ms`);

const startBad = Date.now();
const pointsBad = [];
for (let i = 0; i < 100000; i++) {
  pointsBad.push(createPointBad(i - 50000, i));  // Mix of positive/negative
}
console.log(`Inconsistent shape (bad): ${Date.now() - startBad} ms`);

const startBest = Date.now();
const pointsBest = [];
for (let i = 0; i < 100000; i++) {
  pointsBest.push(createPointBest(i, i));
}
console.log(`Object literal (best): ${Date.now() - startBest} ms`);

console.log();
console.log('═'.repeat(70));
console.log('DEMO E: Inline Caching');
console.log('═'.repeat(70));

/**
 * V8 uses Inline Caching (IC) to speed up property access.
 * 
 * MONOMORPHIC: Always same object shape - FASTEST
 * POLYMORPHIC: 2-4 different shapes - SLOWER
 * MEGAMORPHIC: Many different shapes - SLOWEST
 */

// All these objects have the SAME shape
const obj1 = { a: 1, b: 2 };
const obj2 = { a: 3, b: 4 };
const obj3 = { a: 5, b: 6 };

// These objects have DIFFERENT shapes
const objA = { a: 1, b: 2 };
const objB = { x: 1, y: 2 };
const objC = { foo: 1, bar: 2 };

function getProperty(obj) {
  return obj.a || obj.x || obj.foo;
}

// Monomorphic access (same shape)
console.log('Monomorphic (same shape):');
const startMono = Date.now();
for (let i = 0; i < 1000000; i++) {
  getProperty(obj1);
  getProperty(obj2);
  getProperty(obj3);
}
console.log(`  Time: ${Date.now() - startMono} ms`);

// Create a NEW function for megamorphic test
function getPropertyMega(obj) {
  return obj.a || obj.x || obj.foo;
}

// Megamorphic access (different shapes)
console.log('Megamorphic (different shapes):');
const startMega = Date.now();
for (let i = 0; i < 1000000; i++) {
  getPropertyMega(objA);
  getPropertyMega(objB);
  getPropertyMega(objC);
}
console.log(`  Time: ${Date.now() - startMega} ms`);

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ V8 BYTECODE INSTRUCTIONS                                                   ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Common Ignition bytecodes:                                                 ║
 * ║                                                                            ║
 * ║ LOADING VALUES:                                                            ║
 * ║ ───────────────                                                            ║
 * ║   LdaSmi [n]       Load Small Integer into accumulator                     ║
 * ║   LdaConstant [i]  Load constant from constant pool                        ║
 * ║   LdaZero          Load 0                                                  ║
 * ║   LdaUndefined     Load undefined                                          ║
 * ║   LdaNull          Load null                                               ║
 * ║   LdaTrue          Load true                                               ║
 * ║   LdaFalse         Load false                                              ║
 * ║                                                                            ║
 * ║ STORING VALUES:                                                            ║
 * ║ ───────────────                                                            ║
 * ║   Star r0          Store accumulator to register r0                        ║
 * ║   Mov r0, r1       Move r0 to r1                                           ║
 * ║                                                                            ║
 * ║ ARITHMETIC:                                                                ║
 * ║ ───────────                                                                ║
 * ║   Add r0, [i]      Add r0 to accumulator                                   ║
 * ║   Sub r0, [i]      Subtract r0 from accumulator                            ║
 * ║   Mul r0, [i]      Multiply accumulator by r0                              ║
 * ║   Div r0, [i]      Divide accumulator by r0                                ║
 * ║                                                                            ║
 * ║ CONTROL FLOW:                                                              ║
 * ║ ─────────────                                                              ║
 * ║   Jump [offset]    Unconditional jump                                      ║
 * ║   JumpIfTrue [off] Jump if accumulator is true                             ║
 * ║   JumpIfFalse [off]Jump if accumulator is false                            ║
 * ║   Return           Return from function                                    ║
 * ║                                                                            ║
 * ║ FUNCTION CALLS:                                                            ║
 * ║ ───────────────                                                            ║
 * ║   Call r0, r1-r2   Call function in r0 with args r1-r2                     ║
 * ║   CallProperty     Call method on object                                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ TURBOFAN OPTIMIZATIONS                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. FUNCTION INLINING                                                       ║
 * ║ ─────────────────────                                                      ║
 * ║    Before:  function double(x) { return x * 2; }                           ║
 * ║             for (i = 0; i < 100; i++) result = double(i);                   ║
 * ║                                                                            ║
 * ║    After:   for (i = 0; i < 100; i++) result = i * 2;                       ║
 * ║             (No function call overhead!)                                   ║
 * ║                                                                            ║
 * ║ 2. DEAD CODE ELIMINATION                                                   ║
 * ║ ─────────────────────────                                                  ║
 * ║    Before:  var x = 10; var y = 20; return x;                              ║
 * ║    After:   return 10;  (y is never used, removed)                         ║
 * ║                                                                            ║
 * ║ 3. CONSTANT FOLDING                                                        ║
 * ║ ────────────────────                                                       ║
 * ║    Before:  var x = 2 + 3;                                                 ║
 * ║    After:   var x = 5;  (computed at compile time)                         ║
 * ║                                                                            ║
 * ║ 4. LOOP UNROLLING                                                          ║
 * ║ ──────────────────                                                         ║
 * ║    Before:  for (i = 0; i < 4; i++) sum += arr[i];                         ║
 * ║    After:   sum += arr[0] + arr[1] + arr[2] + arr[3];                      ║
 * ║                                                                            ║
 * ║ 5. TYPE SPECIALIZATION                                                     ║
 * ║ ───────────────────────                                                    ║
 * ║    If function always receives numbers, generate code                      ║
 * ║    that assumes numbers (no type checks needed)                            ║
 * ║                                                                            ║
 * ║ 6. ESCAPE ANALYSIS                                                         ║
 * ║ ────────────────────                                                       ║
 * ║    If an object never leaves a function, allocate it                       ║
 * ║    on the stack instead of heap (faster!)                                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ OPTIMIZATION KILLERS - WHAT TO AVOID                                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. EVAL and WITH                                                           ║
 * ║    eval("var x = 10");  // Prevents many optimizations                     ║
 * ║    with (obj) { }       // Deprecated, prevents optimization               ║
 * ║                                                                            ║
 * ║ 2. ARGUMENTS OBJECT LEAKING                                                ║
 * ║    function bad() {                                                        ║
 * ║      return arguments;  // Prevents optimization                           ║
 * ║    }                                                                       ║
 * ║    function good(...args) {                                                ║
 * ║      return args;       // OK - rest parameters are optimizable            ║
 * ║    }                                                                       ║
 * ║                                                                            ║
 * ║ 3. TYPE CHANGES                                                            ║
 * ║    var x = 10;                                                             ║
 * ║    x = "hello";  // Type change - may deoptimize                           ║
 * ║                                                                            ║
 * ║ 4. OBJECT SHAPE CHANGES                                                    ║
 * ║    var obj = { a: 1 };                                                     ║
 * ║    delete obj.a;       // Changes shape - deoptimizes                      ║
 * ║    obj.b = 2;          // Adding after creation - shape change             ║
 * ║                                                                            ║
 * ║ 5. TRY-CATCH IN PERFORMANCE CRITICAL CODE                                  ║
 * ║    // Before V8 6.0, try-catch prevented optimization                      ║
 * ║    // Now it's better, but still has overhead                              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW QUESTION: What is JIT compilation and why does V8 use it?        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ ANSWER:                                                                    ║
 * ║                                                                            ║
 * ║ JIT (Just-In-Time) compilation is a technique where code is compiled       ║
 * ║ to machine code DURING execution rather than before.                       ║
 * ║                                                                            ║
 * ║ V8 uses JIT because:                                                       ║
 * ║                                                                            ║
 * ║ 1. FAST STARTUP: Interprets code immediately with Ignition                 ║
 * ║    (User doesn't wait for entire app to compile)                           ║
 * ║                                                                            ║
 * ║ 2. RUNTIME OPTIMIZATION: TurboFan can observe actual types                 ║
 * ║    (Knows that add(a, b) always receives numbers)                          ║
 * ║                                                                            ║
 * ║ 3. ADAPTIVE: Only compiles HOT code                                        ║
 * ║    (90% of time is spent in 10% of code - optimize that!)                  ║
 * ║                                                                            ║
 * ║ 4. DEOPTIMIZATION: Can bail out if assumptions are wrong                   ║
 * ║    (Function was optimized for numbers but received string? No problem!)   ║
 * ║                                                                            ║
 * ║ The two-tier system (Ignition + TurboFan) provides the best                ║
 * ║ balance of startup time and peak performance.                              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ MORE INTERVIEW QUESTIONS                                                  ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Q: "What are hidden classes in V8?"                                       ║
 * ║                                                                            ║
 * ║ A: Hidden classes (also called Maps or Shapes) are internal structures    ║
 * ║    V8 creates to track object property layouts. Objects with the same     ║
 * ║    properties added in the same order share a hidden class, enabling      ║
 * ║    fast property access via inline caching. Adding properties in          ║
 * ║    different orders creates different hidden classes, slowing down        ║
 * ║    property access from monomorphic to megamorphic.                       ║
 * ║                                                                            ║
 * ║ Q: "How can you write V8-friendly JavaScript?"                            ║
 * ║                                                                            ║
 * ║ A: Keep types consistent — don't pass numbers then strings to the same    ║
 * ║    function. Initialize all object properties upfront in constructors.    ║
 * ║    Avoid `delete` on objects (changes hidden class). Avoid `eval` and     ║
 * ║    `with`. Use TypedArrays for number-heavy work. Prefer `const`/`let`   ║
 * ║    over `var` — they're easier for the engine to reason about.            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/00-javascript-engine/04-compilation-jit.js
 */
