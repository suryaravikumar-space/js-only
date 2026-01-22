/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║         JAVASCRIPT V8 ENGINE - PART 4: EXECUTION PHASE                       ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ EXECUTION CONTEXT                                                            │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   An EXECUTION CONTEXT is an abstract container holding all information
 *   about the environment where code executes.
 *
 *   ┌────────────────────────────────────────────────────────────────────────────┐
 *   │                        EXECUTION CONTEXT                                   │
 *   ├────────────────────────────────────────────────────────────────────────────┤
 *   │                                                                            │
 *   │  ┌─────────────────────────────────────────────────────────────────────┐   │
 *   │  │                    VARIABLE ENVIRONMENT                             │   │
 *   │  │  Stores: var declarations, function declarations                    │   │
 *   │  │  Example: var x = 10; → x: undefined (creation), 10 (execution)     │   │
 *   │  └─────────────────────────────────────────────────────────────────────┘   │
 *   │                                                                            │
 *   │  ┌─────────────────────────────────────────────────────────────────────┐   │
 *   │  │                    LEXICAL ENVIRONMENT                              │   │
 *   │  │  Stores: let/const declarations, block scopes                       │   │
 *   │  │  Contains: Reference to OUTER environment (scope chain!)            │   │
 *   │  └─────────────────────────────────────────────────────────────────────┘   │
 *   │                                                                            │
 *   │  ┌─────────────────────────────────────────────────────────────────────┐   │
 *   │  │                    THIS BINDING                                     │   │
 *   │  │  The value of "this" keyword                                        │   │
 *   │  │  Determined by HOW function is called                               │   │
 *   │  └─────────────────────────────────────────────────────────────────────┘   │
 *   │                                                                            │
 *   └────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ TWO PHASES OF EXECUTION CONTEXT                                              │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌──────────────────────────────────┐    ┌──────────────────────────────────┐
 *   │     PHASE 1: CREATION            │    │     PHASE 2: EXECUTION           │
 *   │     (Memory Allocation)          │    │     (Code Execution)             │
 *   ├──────────────────────────────────┤    ├──────────────────────────────────┤
 *   │                                  │    │                                  │
 *   │  Happens BEFORE code runs!       │    │  Code runs LINE BY LINE          │
 *   │                                  │    │                                  │
 *   │  1. Create Variable Environment  │    │  1. Assign values to variables   │
 *   │                                  │    │                                  │
 *   │  2. Hoist function declarations  │    │  2. Execute expressions          │
 *   │     → Full function available!   │    │                                  │
 *   │                                  │    │  3. Function calls create new    │
 *   │  3. Hoist var declarations       │    │     execution contexts           │
 *   │     → Set to undefined           │    │                                  │
 *   │                                  │    │  4. Return destroys context      │
 *   │  4. let/const in TDZ             │    │     (unless closures)            │
 *   │     → Exist but uninitialized    │    │                                  │
 *   │                                  │    │                                  │
 *   │  5. Set up scope chain           │    │                                  │
 *   │                                  │    │                                  │
 *   │  6. Determine "this"             │    │                                  │
 *   │                                  │    │                                  │
 *   └──────────────────────────────────┘    └──────────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ CALL STACK                                                                   │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   The CALL STACK tracks which execution context is currently running.
 *   It's a LIFO (Last In, First Out) data structure.
 *
 *
 *   function multiply(a, b) { return a * b; }
 *   function square(n) { return multiply(n, n); }
 *   function printSquare(n) { console.log(square(n)); }
 *   printSquare(5);
 *
 *
 *   TIME ────────────────────────────────────────────────────────────────────▶
 *
 *   STEP 1       STEP 2       STEP 3       STEP 4       STEP 5       STEP 6
 *
 *                                          ┌──────────┐
 *                                          │multiply()│
 *                             ┌──────────┐ ├──────────┤ ┌──────────┐
 *                             │ square() │ │ square() │ │ square() │
 *                ┌──────────┐ ├──────────┤ ├──────────┤ ├──────────┤ ┌──────────┐
 *                │printSqr()│ │printSqr()│ │printSqr()│ │printSqr()│ │printSqr()│
 *   ┌──────────┐ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤
 *   │ Global() │ │ Global() │ │ Global() │ │ Global() │ │ Global() │ │ Global() │
 *   └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
 *
 *        │            │            │            │            │            │
 *        ▼            ▼            ▼            ▼            ▼            ▼
 *     start        push         push         push          pop          pop
 *                printSqr      square      multiply     multiply      square
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ HOISTING EXPLAINED                                                           │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │                         VAR HOISTING                                    │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │   WHAT YOU WRITE:              WHAT V8 SEES:                            │
 *   │                                                                         │
 *   │   console.log(x);              // CREATION: x = undefined               │
 *   │   var x = 10;                  console.log(x);  // undefined            │
 *   │   console.log(x);              x = 10;          // EXECUTION            │
 *   │                                console.log(x);  // 10                   │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │                      FUNCTION HOISTING                                  │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │   WHAT YOU WRITE:              WHAT V8 SEES:                            │
 *   │                                                                         │
 *   │   greet();                     // CREATION: greet = function() {...}    │
 *   │                                greet();  // WORKS!                      │
 *   │   function greet() {                                                    │
 *   │     console.log("Hi!");                                                 │
 *   │   }                                                                     │
 *   │                                                                         │
 *   │   Function declarations are FULLY hoisted!                              │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │                    LET/CONST - TEMPORAL DEAD ZONE                       │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │                                                                         │
 *   │   console.log(x);  // ReferenceError: Cannot access 'x' before init     │
 *   │   let x = 10;                                                           │
 *   │                                                                         │
 *   │   {  ◄───────── Scope starts here                                       │
 *   │      │                                                                  │
 *   │      │  TEMPORAL DEAD ZONE (TDZ)                                        │
 *   │      │  x exists but is UNINITIALIZED                                   │
 *   │      │  Accessing x here = ReferenceError                               │
 *   │      │                                                                  │
 *   │      ▼                                                                  │
 *   │   let x = 10;  ◄─── TDZ ends, x is now initialized                      │
 *   │   }                                                                     │
 *   │                                                                         │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ SCOPE CHAIN                                                                  │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   When V8 looks up a variable:
 *   Current Scope → Outer Scope → ... → Global Scope → ReferenceError
 *
 *   var global = "I'm global";
 *
 *   function outer() {
 *     var outerVar = "I'm outer";
 *     function inner() {
 *       var innerVar = "I'm inner";
 *       console.log(innerVar);   // Found in inner scope
 *       console.log(outerVar);   // Found in outer scope
 *       console.log(global);     // Found in global scope
 *     }
 *     inner();
 *   }
 *
 *   ┌─────────────────────────────┐
 *   │ inner() Execution Context   │
 *   │  innerVar: "I'm inner"      │
 *   │  outer: ────────────────────┼──┐
 *   └─────────────────────────────┘  │
 *                                    ▼
 *   ┌─────────────────────────────┐
 *   │ outer() Execution Context   │
 *   │  outerVar: "I'm outer"      │
 *   │  outer: ────────────────────┼──┐
 *   └─────────────────────────────┘  │
 *                                    ▼
 *   ┌─────────────────────────────┐
 *   │ Global Execution Context    │
 *   │  global: "I'm global"       │
 *   │  outer: null                │
 *   └─────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ THIS BINDING TABLE                                                           │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────┬──────────────────────────────────────────────────────┐
 *   │ HOW CALLED          │ VALUE OF "this"                                      │
 *   ├─────────────────────┼──────────────────────────────────────────────────────┤
 *   │ REGULAR FUNCTION    │ Non-strict: global object (window/global)            │
 *   │ func()              │ Strict mode: undefined                               │
 *   ├─────────────────────┼──────────────────────────────────────────────────────┤
 *   │ METHOD CALL         │ The object before the dot                            │
 *   │ obj.method()        │ Example: obj.greet() → this = obj                    │
 *   ├─────────────────────┼──────────────────────────────────────────────────────┤
 *   │ CONSTRUCTOR         │ The newly created object                             │
 *   │ new Func()          │ Example: new Person() → this = new object            │
 *   ├─────────────────────┼──────────────────────────────────────────────────────┤
 *   │ EXPLICIT BINDING    │ Whatever you pass as first argument                  │
 *   │ call/apply/bind     │ Example: func.call(obj) → this = obj                 │
 *   ├─────────────────────┼──────────────────────────────────────────────────────┤
 *   │ ARROW FUNCTION      │ Inherits "this" from enclosing scope                 │
 *   │ () => {}            │ (Lexical this - determined at definition!)           │
 *   └─────────────────────┴──────────────────────────────────────────────────────┘
 *
 *
 * RUN: node javaScript-v8-architecture-flow/04-execution-phase.js
 */

// ═══════════════════════════════════════════════════════════════════════════════
//                         EXECUTABLE EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('═'.repeat(70));
console.log('       PART 4: EXECUTION PHASE - CONTEXT, STACK, SCOPE');
console.log('═'.repeat(70));

// 1. Hoisting Demo
console.log('\n1. HOISTING DEMO:');
console.log('─'.repeat(40));
console.log('   x before declaration:', typeof hoistedVar === 'undefined' ? 'undefined' : hoistedVar);
var hoistedVar = 'now defined';
console.log('   x after declaration:', hoistedVar);
console.log('   greet() before declaration works:', typeof greet === 'function');
greet();
function greet() { console.log('   Hello from hoisted function!'); }

// 2. Scope Chain Demo
console.log('\n2. SCOPE CHAIN DEMO:');
console.log('─'.repeat(40));
var globalVar = 'global';
function outer() {
  var outerVar = 'outer';
  function inner() {
    var innerVar = 'inner';
    console.log('   From inner - innerVar:', innerVar);
    console.log('   From inner - outerVar:', outerVar);
    console.log('   From inner - globalVar:', globalVar);
  }
  inner();
}
outer();

// 3. This Binding Demo
console.log('\n3. THIS BINDING DEMO:');
console.log('─'.repeat(40));
var obj = {
  name: 'myObject',
  regularMethod: function() { return this.name; },
  arrowMethod: () => typeof this
};
console.log('   Method call this.name:', obj.regularMethod());
console.log('   Arrow function this:', obj.arrowMethod(), '(inherits from outer scope)');

// 4. Call Stack Demo
console.log('\n4. CALL STACK DEMO:');
console.log('─'.repeat(40));
function first() {
  console.log('   first() called');
  second();
  console.log('   first() done');
}
function second() {
  console.log('   second() called');
  third();
  console.log('   second() done');
}
function third() {
  console.log('   third() called');
  console.log('   Stack: third → second → first → Global');
  console.log('   third() done');
}
first();

// 5. Closure Demo (scope chain preserved)
console.log('\n5. CLOSURE DEMO:');
console.log('─'.repeat(40));
function createCounter() {
  var count = 0;  // Stays alive via closure!
  return function() {
    count++;
    return count;
  };
}
var counter = createCounter();
console.log('   counter():', counter());
console.log('   counter():', counter());
console.log('   counter():', counter());
console.log('   (count persists via closure!)');

console.log('\n' + '═'.repeat(70));
console.log('       Read the comments above for complete execution details!');
console.log('═'.repeat(70) + '\n');
