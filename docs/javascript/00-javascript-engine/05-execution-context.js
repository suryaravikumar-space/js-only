/**
 * LESSON 05: Execution Context - THE HEART OF JAVASCRIPT EXECUTION
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STORY: THE OFFICE MEETING ROOM                                             ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Imagine every function call is like booking a meeting room.                ║
 * ║ When you book one (function call), you get:                                ║
 * ║   - A whiteboard with your local notes (Variable Environment)              ║
 * ║   - Access to the hallway bulletin board (Scope Chain to outer variables)  ║
 * ║   - A name badge saying who called the meeting (this binding)              ║
 * ║                                                                            ║
 * ║ When the meeting ends, the room is cleared (context destroyed) — unless    ║
 * ║ someone took a photo of the whiteboard (closure).                          ║
 * ║                                                                            ║
 * ║ An EXECUTION CONTEXT is an abstract concept that holds all the information ║
 * ║ about the environment in which code is being executed.                     ║
 * ║                                                                            ║
 * ║ It contains:                                      ║
 * ║   1. Variable Environment - All variables, functions declared here         ║
 * ║   2. Lexical Environment  - Scope chain (access to outer variables)        ║
 * ║   3. this Binding         - What "this" refers to                          ║
 * ║                                                                            ║
 * ║ Every time JavaScript runs code, it creates an Execution Context.          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THREE TYPES OF EXECUTION CONTEXTS                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. GLOBAL EXECUTION CONTEXT (GEC)                                          ║
 * ║ ───────────────────────────────────                                        ║
 * ║    • Created when JavaScript file starts executing                         ║
 * ║    • Only ONE global context per program                                   ║
 * ║    • Creates the global object (window in browser, global in Node.js)      ║
 * ║    • Sets "this" to the global object                                      ║
 * ║    • Stays in memory until program terminates                              ║
 * ║                                                                            ║
 * ║    In Node.js:                                                             ║
 * ║    ┌────────────────────────────────────────────────────────────────────┐  ║
 * ║    │ GLOBAL EXECUTION CONTEXT                                           │  ║
 * ║    │                                                                    │  ║
 * ║    │  Variable Environment:                                             │  ║
 * ║    │    • All top-level var declarations                                │  ║
 * ║    │    • All function declarations                                     │  ║
 * ║    │    • NOT let/const (they're in a separate "declarative env")       │  ║
 * ║    │                                                                    │  ║
 * ║    │  this: global object (globalThis)                                  │  ║
 * ║    │                                                                    │  ║
 * ║    │  Outer Environment: null (no outer scope)                          │  ║
 * ║    │                                                                    │  ║
 * ║    └────────────────────────────────────────────────────────────────────┘  ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 2. FUNCTION EXECUTION CONTEXT (FEC)                                        ║
 * ║ ────────────────────────────────────                                       ║
 * ║    • Created every time a function is CALLED (not declared)                ║
 * ║    • Can have MANY function contexts (one per function call)               ║
 * ║    • Contains function's local variables and parameters                    ║
 * ║    • Has reference to outer (lexical) environment                          ║
 * ║    • Destroyed after function returns (unless closures keep it alive)      ║
 * ║                                                                            ║
 * ║    ┌────────────────────────────────────────────────────────────────────┐  ║
 * ║    │ FUNCTION EXECUTION CONTEXT                                         │  ║
 * ║    │                                                                    │  ║
 * ║    │  Variable Environment:                                             │  ║
 * ║    │    • Function parameters (a, b, c...)                              │  ║
 * ║    │    • arguments object                                              │  ║
 * ║    │    • Local var declarations                                        │  ║
 * ║    │    • Local function declarations                                   │  ║
 * ║    │                                                                    │  ║
 * ║    │  this: depends on how function was called                          │  ║
 * ║    │    • Regular call: global/undefined                                │  ║
 * ║    │    • Method call: the object                                       │  ║
 * ║    │    • new: the new object                                           │  ║
 * ║    │    • call/apply/bind: whatever you pass                            │  ║
 * ║    │                                                                    │  ║
 * ║    │  Outer Environment: where function was DEFINED (not called!)       │  ║
 * ║    │                                                                    │  ║
 * ║    └────────────────────────────────────────────────────────────────────┘  ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 3. EVAL EXECUTION CONTEXT                                                  ║
 * ║ ─────────────────────────────                                              ║
 * ║    • Created when eval() is called                                         ║
 * ║    • Similar to function context                                           ║
 * ║    • Avoid eval() - security and performance issues                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE TWO PHASES OF EXECUTION CONTEXT                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Every Execution Context goes through TWO PHASES:                           ║
 * ║                                                                            ║
 * ║ ┌────────────────────────────────────────────────────────────────────────┐ ║
 * ║ │                       PHASE 1: CREATION                                │ ║
 * ║ │                    (Memory Allocation Phase)                           │ ║
 * ║ ├────────────────────────────────────────────────────────────────────────┤ ║
 * ║ │                                                                        │ ║
 * ║ │  This happens BEFORE any code executes!                                │ ║
 * ║ │                                                                        │ ║
 * ║ │  Step 1: Create the Variable Object (VO)                               │ ║
 * ║ │  ──────────────────────────────────────                                │ ║
 * ║ │    a) Create the arguments object (for functions)                      │ ║
 * ║ │    b) Scan for function declarations                                   │ ║
 * ║ │       → Store function NAME with FULL function reference               │ ║
 * ║ │       → This is why functions can be called before declaration!        │ ║
 * ║ │    c) Scan for var declarations                                        │ ║
 * ║ │       → Store variable NAME with value UNDEFINED                       │ ║
 * ║ │       → This is HOISTING!                                              │ ║
 * ║ │    d) let/const are hoisted but in "Temporal Dead Zone"                │ ║
 * ║ │                                                                        │ ║
 * ║ │  Step 2: Create the Scope Chain                                        │ ║
 * ║ │  ────────────────────────────────                                      │ ║
 * ║ │    → Link to outer environment (where code was defined)                │ ║
 * ║ │    → This enables closures!                                            │ ║
 * ║ │                                                                        │ ║
 * ║ │  Step 3: Determine "this" binding                                      │ ║
 * ║ │  ────────────────────────────────                                      │ ║
 * ║ │    → Based on how the function is called                               │ ║
 * ║ │                                                                        │ ║
 * ║ └────────────────────────────────────────────────────────────────────────┘ ║
 * ║                                                                            ║
 * ║                              ↓                                             ║
 * ║                              ↓                                             ║
 * ║                              ↓                                             ║
 * ║                                                                            ║
 * ║ ┌────────────────────────────────────────────────────────────────────────┐ ║
 * ║ │                      PHASE 2: EXECUTION                                │ ║
 * ║ │                   (Code Execution Phase)                               │ ║
 * ║ ├────────────────────────────────────────────────────────────────────────┤ ║
 * ║ │                                                                        │ ║
 * ║ │  Code runs LINE BY LINE:                                               │ ║
 * ║ │                                                                        │ ║
 * ║ │    • Variable assignments happen (values replace undefined)            │ ║
 * ║ │    • Function calls create new execution contexts                      │ ║
 * ║ │    • Expressions are evaluated                                         │ ║
 * ║ │    • Statements are executed                                           │ ║
 * ║ │                                                                        │ ║
 * ║ └────────────────────────────────────────────────────────────────────────┘ ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMPLETE WALKTHROUGH: Understanding Both Phases                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Consider this code:                                                        ║
 * ║                                                                            ║
 * ║    var name = "Surya";                                                     ║
 * ║                                                                            ║
 * ║    function greet() {                                                      ║
 * ║      var message = "Hello";                                                ║
 * ║      console.log(message + " " + name);                                    ║
 * ║    }                                                                       ║
 * ║                                                                            ║
 * ║    greet();                                                                ║
 * ║                                                                            ║
 * ║ ════════════════════════════════════════════════════════════════════════   ║
 * ║ STEP 1: GLOBAL CONTEXT - CREATION PHASE                                    ║
 * ║ ════════════════════════════════════════════════════════════════════════   ║
 * ║                                                                            ║
 * ║ Before ANY code runs, V8 scans the entire script:                          ║
 * ║                                                                            ║
 * ║ ┌──────────────────────────────────────────────────────────────────────┐   ║
 * ║ │ GLOBAL EXECUTION CONTEXT (after Creation Phase)                      │   ║
 * ║ │                                                                      │   ║
 * ║ │  Variable Environment:                                               │   ║
 * ║ │  ┌────────────────────────────────────────────────────────────────┐  │   ║
 * ║ │  │  name:  undefined        ← var is hoisted, value not yet       │  │   ║
 * ║ │  │  greet: function() {...} ← function is FULLY hoisted           │  │   ║
 * ║ │  └────────────────────────────────────────────────────────────────┘  │   ║
 * ║ │                                                                      │   ║
 * ║ │  Scope Chain: [Global]                                               │   ║
 * ║ │  this: global object                                                 │   ║
 * ║ │                                                                      │   ║
 * ║ └──────────────────────────────────────────────────────────────────────┘   ║
 * ║                                                                            ║
 * ║ KEY INSIGHT: At this point, name is undefined but greet is the             ║
 * ║ full function! This is why:                                                ║
 * ║   console.log(name);  // undefined (hoisted but no value)                  ║
 * ║   greet();            // works! (function fully hoisted)                   ║
 * ║                                                                            ║
 * ║ ════════════════════════════════════════════════════════════════════════   ║
 * ║ STEP 2: GLOBAL CONTEXT - EXECUTION PHASE                                   ║
 * ║ ════════════════════════════════════════════════════════════════════════   ║
 * ║                                                                            ║
 * ║ Now code executes line by line:                                            ║
 * ║                                                                            ║
 * ║ Line 1: var name = "Surya";                                                ║
 * ║ ┌──────────────────────────────────────────────────────────────────────┐   ║
 * ║ │  Variable Environment:                                               │   ║
 * ║ │  ┌────────────────────────────────────────────────────────────────┐  │   ║
 * ║ │  │  name:  "Surya"          ← NOW has value!                      │  │   ║
 * ║ │  │  greet: function() {...}                                       │  │   ║
 * ║ │  └────────────────────────────────────────────────────────────────┘  │   ║
 * ║ └──────────────────────────────────────────────────────────────────────┘   ║
 * ║                                                                            ║
 * ║ Lines 3-6: Function declaration - already handled in creation phase        ║
 * ║                                                                            ║
 * ║ Line 8: greet();  ← FUNCTION CALL - Creates NEW execution context!         ║
 * ║                                                                            ║
 * ║ ════════════════════════════════════════════════════════════════════════   ║
 * ║ STEP 3: FUNCTION CONTEXT - CREATION PHASE                                  ║
 * ║ ════════════════════════════════════════════════════════════════════════   ║
 * ║                                                                            ║
 * ║ When greet() is called, new context is created:                            ║
 * ║                                                                            ║
 * ║ ┌──────────────────────────────────────────────────────────────────────┐   ║
 * ║ │ FUNCTION EXECUTION CONTEXT: greet (after Creation Phase)             │   ║
 * ║ │                                                                      │   ║
 * ║ │  Variable Environment:                                               │   ║
 * ║ │  ┌────────────────────────────────────────────────────────────────┐  │   ║
 * ║ │  │  message: undefined      ← var hoisted with undefined          │  │   ║
 * ║ │  │  arguments: { length: 0 } ← arguments object created           │  │   ║
 * ║ │  └────────────────────────────────────────────────────────────────┘  │   ║
 * ║ │                                                                      │   ║
 * ║ │  Scope Chain: [greet's local → Global]                               │   ║
 * ║ │               (Can access both local and global variables!)          │   ║
 * ║ │                                                                      │   ║
 * ║ │  this: global (regular function call)                                │   ║
 * ║ │                                                                      │   ║
 * ║ └──────────────────────────────────────────────────────────────────────┘   ║
 * ║                                                                            ║
 * ║ ════════════════════════════════════════════════════════════════════════   ║
 * ║ STEP 4: FUNCTION CONTEXT - EXECUTION PHASE                                 ║
 * ║ ════════════════════════════════════════════════════════════════════════   ║
 * ║                                                                            ║
 * ║ Line 4: var message = "Hello";                                             ║
 * ║ ┌──────────────────────────────────────────────────────────────────────┐   ║
 * ║ │  Variable Environment:                                               │   ║
 * ║ │  ┌────────────────────────────────────────────────────────────────┐  │   ║
 * ║ │  │  message: "Hello"        ← NOW has value!                      │  │   ║
 * ║ │  └────────────────────────────────────────────────────────────────┘  │   ║
 * ║ └──────────────────────────────────────────────────────────────────────┘   ║
 * ║                                                                            ║
 * ║ Line 5: console.log(message + " " + name);                                 ║
 * ║                                                                            ║
 * ║   → Look for "message" in local scope → Found: "Hello"                     ║
 * ║   → Look for "name" in local scope → Not found                             ║
 * ║   → Look for "name" in outer (Global) scope → Found: "Surya"               ║
 * ║   → Output: "Hello Surya"                                                  ║
 * ║                                                                            ║
 * ║ Function returns → Function context is DESTROYED                           ║
 * ║ (Unless closures keep it alive!)                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE LEXICAL ENVIRONMENT (ECMA-262 Specification)                           ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ In modern ECMAScript, the Execution Context contains:                      ║
 * ║                                                                            ║
 * ║ ┌────────────────────────────────────────────────────────────────────────┐ ║
 * ║ │                      EXECUTION CONTEXT                                 │ ║
 * ║ │                                                                        │ ║
 * ║ │  ┌──────────────────────────────────────────────────────────────────┐  │ ║
 * ║ │  │            LEXICAL ENVIRONMENT                                   │  │ ║
 * ║ │  │                                                                  │  │ ║
 * ║ │  │  ┌────────────────────────────────────────────────────────────┐  │  │ ║
 * ║ │  │  │  Environment Record:                                       │  │  │ ║
 * ║ │  │  │    • Stores let, const, class declarations                 │  │  │ ║
 * ║ │  │  │    • Stores function declarations                          │  │  │ ║
 * ║ │  │  │    • For functions: stores parameters                      │  │  │ ║
 * ║ │  │  └────────────────────────────────────────────────────────────┘  │  │ ║
 * ║ │  │                                                                  │  │ ║
 * ║ │  │  outer: Reference to parent Lexical Environment                  │  │ ║
 * ║ │  │         (This creates the SCOPE CHAIN!)                          │  │ ║
 * ║ │  │                                                                  │  │ ║
 * ║ │  └──────────────────────────────────────────────────────────────────┘  │ ║
 * ║ │                                                                        │ ║
 * ║ │  ┌──────────────────────────────────────────────────────────────────┐  │ ║
 * ║ │  │           VARIABLE ENVIRONMENT                                   │  │ ║
 * ║ │  │                                                                  │  │ ║
 * ║ │  │  ┌────────────────────────────────────────────────────────────┐  │  │ ║
 * ║ │  │  │  Environment Record:                                       │  │  │ ║
 * ║ │  │  │    • Stores var declarations                               │  │  │ ║
 * ║ │  │  └────────────────────────────────────────────────────────────┘  │  │ ║
 * ║ │  │                                                                  │  │ ║
 * ║ │  │  outer: Same as Lexical Environment's outer                      │  │ ║
 * ║ │  │                                                                  │  │ ║
 * ║ │  └──────────────────────────────────────────────────────────────────┘  │ ║
 * ║ │                                                                        │ ║
 * ║ │  ThisBinding: The value of "this"                                      │ ║
 * ║ │                                                                        │ ║
 * ║ └────────────────────────────────────────────────────────────────────────┘ ║
 * ║                                                                            ║
 * ║ WHY TWO ENVIRONMENTS?                                                      ║
 * ║ ─────────────────────                                                      ║
 * ║                                                                            ║
 * ║ var is FUNCTION-SCOPED:  Stored in Variable Environment                    ║
 * ║ let/const are BLOCK-SCOPED: Stored in Lexical Environment                  ║
 * ║                                                                            ║
 * ║ This is why let/const work differently in blocks:                          ║
 * ║                                                                            ║
 * ║   if (true) {                                                              ║
 * ║     var x = 1;    // Goes to Variable Environment (function/global scope)  ║
 * ║     let y = 2;    // Goes to new block's Lexical Environment               ║
 * ║   }                                                                        ║
 * ║   console.log(x); // 1 - var is visible outside block                      ║
 * ║   console.log(y); // Error - let is block-scoped                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ HOISTING: THE RESULT OF CREATION PHASE                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ "Hoisting" is not moving code - it's the EFFECT of the Creation Phase.     ║
 * ║                                                                            ║
 * ║ ┌────────────────────────────────────────────────────────────────────────┐ ║
 * ║ │                        VAR HOISTING                                    │ ║
 * ║ │                                                                        │ ║
 * ║ │  What you write:              What V8 sees (conceptually):             │ ║
 * ║ │                                                                        │ ║
 * ║ │  console.log(x);              // Creation: x = undefined               │ ║
 * ║ │  var x = 10;                  console.log(x);  // undefined            │ ║
 * ║ │                               x = 10;          // Execution            │ ║
 * ║ │                                                                        │ ║
 * ║ │  Behavior: No error, but x is undefined (not 10)                       │ ║
 * ║ │                                                                        │ ║
 * ║ └────────────────────────────────────────────────────────────────────────┘ ║
 * ║                                                                            ║
 * ║ ┌────────────────────────────────────────────────────────────────────────┐ ║
 * ║ │                      FUNCTION HOISTING                                 │ ║
 * ║ │                                                                        │ ║
 * ║ │  What you write:              What V8 sees (conceptually):             │ ║
 * ║ │                                                                        │ ║
 * ║ │  greet();                     // Creation: greet = function() {...}    │ ║
 * ║ │                               greet();       // Works!                 │ ║
 * ║ │  function greet() {                                                    │ ║
 * ║ │    console.log("Hi");                                                  │ ║
 * ║ │  }                                                                     │ ║
 * ║ │                                                                        │ ║
 * ║ │  Behavior: Works! Function is FULLY available before declaration.      │ ║
 * ║ │                                                                        │ ║
 * ║ └────────────────────────────────────────────────────────────────────────┘ ║
 * ║                                                                            ║
 * ║ ┌────────────────────────────────────────────────────────────────────────┐ ║
 * ║ │                    LET/CONST HOISTING (TDZ)                            │ ║
 * ║ │                                                                        │ ║
 * ║ │  What you write:              What V8 sees (conceptually):             │ ║
 * ║ │                                                                        │ ║
 * ║ │  console.log(x);              // Creation: x exists but UNINITIALIZED  │ ║
 * ║ │  let x = 10;                  console.log(x);  // ERROR: TDZ           │ ║
 * ║ │                               x = 10;          // Now initialized      │ ║
 * ║ │                                                                        │ ║
 * ║ │  Behavior: ReferenceError! Variable is in "Temporal Dead Zone"         │ ║
 * ║ │                                                                        │ ║
 * ║ │  TEMPORAL DEAD ZONE (TDZ):                                             │ ║
 * ║ │  The time between when the scope is entered and when the variable      │ ║
 * ║ │  is declared. Accessing the variable in TDZ throws an error.           │ ║
 * ║ │                                                                        │ ║
 * ║ └────────────────────────────────────────────────────────────────────────┘ ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ SCOPE CHAIN: HOW VARIABLE LOOKUP WORKS                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ When JavaScript needs to find a variable, it follows the SCOPE CHAIN:      ║
 * ║                                                                            ║
 * ║    1. Look in current Execution Context's environment                      ║
 * ║    2. If not found, look in outer environment                              ║
 * ║    3. Continue until found or reach global (then ReferenceError)           ║
 * ║                                                                            ║
 * ║ CRITICAL: The scope chain is determined by WHERE code is WRITTEN           ║
 * ║           (lexical/static scoping), NOT where it's called from!            ║
 * ║                                                                            ║
 * ║    var x = "global";                                                       ║
 * ║                                                                            ║
 * ║    function outer() {                                                      ║
 * ║      var x = "outer";                                                      ║
 * ║                                                                            ║
 * ║      function inner() {                                                    ║
 * ║        console.log(x);  // "outer" - looks up scope chain                  ║
 * ║      }                                                                     ║
 * ║                                                                            ║
 * ║      return inner;                                                         ║
 * ║    }                                                                       ║
 * ║                                                                            ║
 * ║    var innerFn = outer();                                                  ║
 * ║    innerFn();  // "outer" - NOT "global"!                                  ║
 * ║                                                                            ║
 * ║ Scope Chain Visualization:                                                 ║
 * ║                                                                            ║
 * ║    ┌─────────────────────┐                                                 ║
 * ║    │  inner() context    │                                                 ║
 * ║    │  x: not found       │                                                 ║
 * ║    │  outer: ────────────┼──┐                                              ║
 * ║    └─────────────────────┘  │                                              ║
 * ║                             ▼                                              ║
 * ║    ┌─────────────────────┐                                                 ║
 * ║    │  outer() context    │                                                 ║
 * ║    │  x: "outer" ◄───────│── FOUND!                                        ║
 * ║    │  outer: ────────────┼──┐                                              ║
 * ║    └─────────────────────┘  │                                              ║
 * ║                             ▼                                              ║
 * ║    ┌─────────────────────┐                                                 ║
 * ║    │  Global context     │                                                 ║
 * ║    │  x: "global"        │  (Not reached - found in outer)                 ║
 * ║    │  outer: null        │                                                 ║
 * ║    └─────────────────────┘                                                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THIS BINDING                                                               ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ The value of "this" is determined during the CREATION PHASE based on       ║
 * ║ HOW the function is called (not where it's defined):                       ║
 * ║                                                                            ║
 * ║ ┌────────────────────────────────────────────────────────────────────────┐ ║
 * ║ │ Call Type             │ this Value                                     │ ║
 * ║ ├────────────────────────────────────────────────────────────────────────┤ ║
 * ║ │ Regular function call │ global object (non-strict)                     │ ║
 * ║ │ func()                │ undefined (strict mode)                        │ ║
 * ║ ├────────────────────────────────────────────────────────────────────────┤ ║
 * ║ │ Method call           │ The object before the dot                      │ ║
 * ║ │ obj.method()          │ (obj is "this")                                │ ║
 * ║ ├────────────────────────────────────────────────────────────────────────┤ ║
 * ║ │ Constructor call      │ The newly created object                       │ ║
 * ║ │ new Func()            │                                                │ ║
 * ║ ├────────────────────────────────────────────────────────────────────────┤ ║
 * ║ │ Explicit binding      │ Whatever you pass as first argument            │ ║
 * ║ │ func.call(ctx)        │ (ctx is "this")                                │ ║
 * ║ │ func.apply(ctx)       │                                                │ ║
 * ║ │ func.bind(ctx)        │                                                │ ║
 * ║ ├────────────────────────────────────────────────────────────────────────┤ ║
 * ║ │ Arrow function        │ Inherits "this" from enclosing scope           │ ║
 * ║ │ () => {}              │ (lexical "this" - determined at definition)    │ ║
 * ║ └────────────────────────────────────────────────────────────────────────┘ ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: What is an Execution Context?                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ "An Execution Context is an internal construct that JavaScript engines     ║
 * ║  use to track the execution of code. It contains three main components:    ║
 * ║                                                                            ║
 * ║  1. Variable Environment - stores var declarations and function            ║
 * ║     declarations                                                           ║
 * ║                                                                            ║
 * ║  2. Lexical Environment - stores let/const declarations and maintains      ║
 * ║     the scope chain through a reference to the outer environment           ║
 * ║                                                                            ║
 * ║  3. This Binding - the value of 'this' keyword                             ║
 * ║                                                                            ║
 * ║  Each context goes through two phases:                                     ║
 * ║  - Creation Phase: Memory is allocated, variables are hoisted              ║
 * ║  - Execution Phase: Code runs line by line, values are assigned            ║
 * ║                                                                            ║
 * ║  There are three types: Global (one per program), Function (one per        ║
 * ║  function call), and Eval. Understanding execution contexts is key         ║
 * ║  to understanding hoisting, scope, closures, and the 'this' keyword."      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ MORE INTERVIEW QUESTIONS                                                  ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Q: "What is the difference between Variable Environment and Lexical       ║
 * ║     Environment?"                                                         ║
 * ║                                                                            ║
 * ║ A: Variable Environment stores `var` declarations (function-scoped).      ║
 * ║    Lexical Environment stores `let`, `const`, and `class` declarations    ║
 * ║    (block-scoped). Both have an outer reference for scope chain lookups.  ║
 * ║    When you enter a new block `{}`, a new Lexical Environment is created  ║
 * ║    but the Variable Environment stays the same — this is why `var` leaks  ║
 * ║    out of blocks but `let`/`const` don't.                                 ║
 * ║                                                                            ║
 * ║ Q: "What are the two phases of an Execution Context?"                     ║
 * ║                                                                            ║
 * ║ A: Creation Phase — memory is allocated. `var` gets `undefined`, function ║
 * ║    declarations get the full function body, `let`/`const` are hoisted but ║
 * ║    put in the Temporal Dead Zone. Scope chain and `this` are set up.      ║
 * ║    Execution Phase — code runs line by line, variables get their actual    ║
 * ║    values, function calls create new execution contexts on the call stack.║
 * ║                                                                            ║
 * ║ Q: "Why can you call a function before its declaration in JavaScript?"    ║
 * ║                                                                            ║
 * ║ A: During the Creation Phase, function declarations are fully hoisted —   ║
 * ║    the entire function body is stored in memory before any code runs.     ║
 * ║    This only works with function declarations (`function foo() {}`),      ║
 * ║    NOT function expressions (`const foo = function() {}`) or arrow        ║
 * ║    functions (`const foo = () => {}`), which follow `const`/`let` rules.  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/00-javascript-engine/05-execution-context.js
 */

// Simple demonstration
console.log('Execution Context Demo:');
console.log('─'.repeat(50));

console.log('\n1. Hoisting demonstration:');
console.log('   Value of x before declaration:', typeof x === 'undefined' ? 'undefined' : x);
var x = 10; // intentionally using var here to demonstrate hoisting (var gets undefined, let/const would throw ReferenceError)
console.log('   Value of x after declaration:', x);

console.log('\n2. Function hoisting:');
console.log('   Can call greet before declaration:', typeof greet);
greet();
function greet() {
  console.log('   Hello from greet()!');
}

console.log('\n3. Scope chain:');
const outerVar = 'outer';
function outer() {
  const innerVar = 'inner';
  function inner() {
    console.log(`   Accessing outerVar from inner: ${outerVar}`);
    console.log(`   Accessing innerVar from inner: ${innerVar}`);
  }
  inner();
}
outer();

console.log('\n4. This binding:');
const obj = {
  name: 'myObject',
  showThis() {
    console.log(`   this.name in method call: ${this.name}`);
  }
};
obj.showThis();

console.log('\nEnd of demonstration.');
