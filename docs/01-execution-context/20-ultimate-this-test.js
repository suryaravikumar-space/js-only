/**
 * TOPIC: The Ultimate `this` Test - Everything Combined
 *
 * CONCEPT:
 * This challenge combines ALL the `this` rules we've learned.
 * If you understand this, you understand `this` in JavaScript.
 *
 * This is the FINAL challenge of Execution Context topic.
 * Master this, and you've mastered one of JavaScript's trickiest concepts.
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ THE THREE SCENARIOS IN ONE                                    ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║  A: Method call         → this = the object                   ║
 * ║  B: Standalone function → this = global (or undefined strict) ║
 * ║  C: Arrow function      → this = inherited from parent scope  ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

var obj = {
  name: 'Object',

  regular: function() {
    console.log('A:', this.name);

    var inner = function() {
      console.log('B:', this.name);
    };
    inner();

    var arrow = () => {
      console.log('C:', this.name);
    };
    arrow();
  }
};

var name = 'Global';
obj.regular();

/**
 * OUTPUT:
 *   A: Object
 *   B: undefined
 *   C: Object
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ WAIT... WHY IS C "Object" AND NOT "Global"?                   ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║ This is where most people get confused!                       ║
 * ║                                                                ║
 * ║ WRONG THINKING:                                               ║
 * ║   "Arrow function is called standalone like inner(),          ║
 * ║    so it should also get global this"                         ║
 * ║                                                                ║
 * ║ CORRECT THINKING:                                             ║
 * ║   "Arrow function doesn't CARE how it's called.               ║
 * ║    It only cares WHERE it was WRITTEN (defined).              ║
 * ║    It was written inside regular(), where this = obj."        ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ============================================================
 *                    SUPER DETAILED EXPLANATION
 * ============================================================
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ STEP 1: UNDERSTAND THE CODE STRUCTURE                         │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ Let's first see what's INSIDE what:                           │
 * │                                                                │
 * │   GLOBAL LEVEL:                                                │
 * │   ├── var name = 'Global'                                      │
 * │   ├── var obj = { ... }                                        │
 * │   │   │                                                        │
 * │   │   └── INSIDE obj:                                          │
 * │   │       ├── name: 'Object'                                   │
 * │   │       └── regular: function() { ... }                      │
 * │   │           │                                                │
 * │   │           └── INSIDE regular():                            │
 * │   │               ├── var inner = function() { ... }           │
 * │   │               └── var arrow = () => { ... }                │
 * │   │                                                            │
 * │   └── obj.regular()  (the call)                                │
 * │                                                                │
 * │                                                                │
 * │ IMPORTANT OBSERVATION:                                         │
 * │   - inner() is defined INSIDE regular()                        │
 * │   - arrow() is defined INSIDE regular()                        │
 * │   - They are SIBLINGS, both inside regular()                   │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ STEP 2: WHAT HAPPENS WHEN obj.regular() IS CALLED?            │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │   obj.regular()                                                │
 * │   ^^^                                                          │
 * │   │                                                            │
 * │   └── Object before the dot = obj                              │
 * │       Therefore: this = obj                                    │
 * │                                                                │
 * │                                                                │
 * │ So when we enter regular(), we know:                           │
 * │   this = obj                                                   │
 * │   this.name = obj.name = 'Object'                              │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ STEP 3: CASE A - console.log('A:', this.name)                 │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │   regular: function() {                                        │
 * │     console.log('A:', this.name);  // ← We are here            │
 * │     ...                                                        │
 * │   }                                                            │
 * │                                                                │
 * │                                                                │
 * │ QUESTION: What is `this` here?                                 │
 * │                                                                │
 * │ ANSWER:                                                        │
 * │   - regular() was called as obj.regular()                      │
 * │   - Method call rule: this = object before dot                 │
 * │   - this = obj                                                 │
 * │   - this.name = obj.name = 'Object'                            │
 * │                                                                │
 * │ OUTPUT: A: Object                                              │
 * │                                                                │
 * │                                                                │
 * │ SIMPLE EXPLANATION:                                            │
 * │   "When you call obj.regular(), JavaScript says:               │
 * │    Hey regular function, your 'this' is obj because            │
 * │    that's who called you (the thing before the dot)."          │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ STEP 4: CASE B - inner() function                             │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │   regular: function() {                                        │
 * │     ...                                                        │
 * │     var inner = function() {                                   │
 * │       console.log('B:', this.name);  // ← What is this?        │
 * │     };                                                         │
 * │     inner();  // ← How is it called?                           │
 * │     ...                                                        │
 * │   }                                                            │
 * │                                                                │
 * │                                                                │
 * │ QUESTION: What is `this` inside inner()?                       │
 * │                                                                │
 * │ STEP-BY-STEP:                                                  │
 * │                                                                │
 * │   1. How is inner() called?                                    │
 * │      → inner()                                                 │
 * │      → Just the function name, nothing before it               │
 * │      → This is a STANDALONE call                               │
 * │                                                                │
 * │   2. What's the rule for standalone calls?                     │
 * │      → Non-strict mode: this = global object                   │
 * │      → Strict mode: this = undefined                           │
 * │                                                                │
 * │   3. We're in non-strict mode, so:                             │
 * │      → this = global object                                    │
 * │                                                                │
 * │   4. What is global.name in Node.js?                           │
 * │      → var name = 'Global' is MODULE-scoped in Node.js         │
 * │      → It does NOT create global.name                          │
 * │      → global.name = undefined                                 │
 * │                                                                │
 * │ OUTPUT: B: undefined                                           │
 * │                                                                │
 * │                                                                │
 * │ COMMON CONFUSION:                                              │
 * │   "But inner() is INSIDE regular() where this = obj.           │
 * │    Shouldn't inner() inherit that this?"                       │
 * │                                                                │
 * │ ANSWER: NO!                                                    │
 * │   Regular functions DON'T inherit this.                        │
 * │   They get their own this based on HOW they're CALLED.         │
 * │   inner() is called standalone → this = global                 │
 * │                                                                │
 * │                                                                │
 * │ SIMPLE EXPLANATION:                                            │
 * │   "inner() is a regular function. Regular functions are        │
 * │    like employees who only listen to whoever calls them        │
 * │    directly. inner() was called with just 'inner()' -          │
 * │    no object called it. So it defaults to the global object.   │
 * │    It doesn't care that it's written inside regular()."        │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ STEP 5: CASE C - arrow() function (THE TRICKY ONE!)           │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │   regular: function() {                                        │
 * │     // this = obj here                                         │
 * │     ...                                                        │
 * │     var arrow = () => {                                        │
 * │       console.log('C:', this.name);  // ← What is this?        │
 * │     };                                                         │
 * │     arrow();  // ← Called the same way as inner()              │
 * │     ...                                                        │
 * │   }                                                            │
 * │                                                                │
 * │                                                                │
 * │ QUESTION: What is `this` inside arrow()?                       │
 * │                                                                │
 * │ WRONG THINKING:                                                │
 * │   "arrow() is called standalone just like inner()              │
 * │    So this should also be global, right?"                      │
 * │                                                                │
 * │ CORRECT THINKING:                                              │
 * │   "Arrow functions are DIFFERENT. They don't care HOW          │
 * │    they're called. They only care WHERE they're written."      │
 * │                                                                │
 * │                                                                │
 * │ STEP-BY-STEP:                                                  │
 * │                                                                │
 * │   1. arrow() is an ARROW function (not regular)                │
 * │      → Arrow functions have NO OWN this                        │
 * │      → They INHERIT this from parent SCOPE                     │
 * │                                                                │
 * │   2. Where is arrow() DEFINED (written)?                       │
 * │      → Inside regular() function                               │
 * │                                                                │
 * │   3. What is `this` in regular()?                              │
 * │      → regular() was called as obj.regular()                   │
 * │      → So inside regular(), this = obj                         │
 * │                                                                │
 * │   4. Arrow inherits that this:                                 │
 * │      → arrow's this = regular's this = obj                     │
 * │      → this.name = obj.name = 'Object'                         │
 * │                                                                │
 * │ OUTPUT: C: Object                                              │
 * │                                                                │
 * │                                                                │
 * │ SIMPLE EXPLANATION:                                            │
 * │   "Arrow functions are like loyal employees who remember       │
 * │    their original boss forever. When arrow() was CREATED       │
 * │    (written) inside regular(), it looked around and said:      │
 * │    'Who is this here? It's obj. I'll remember that forever.'   │
 * │                                                                │
 * │    Later, no matter WHO calls arrow() or HOW it's called,      │
 * │    it still remembers: 'My this is obj, because that's what    │
 * │    this was when I was born (created).'"                       │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ THE BIG PICTURE: REGULAR vs ARROW                             │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │                                                                │
 * │   REGULAR FUNCTION (inner):                                    │
 * │   ─────────────────────────                                    │
 * │                                                                │
 * │   "I decide my 'this' when I'm CALLED."                        │
 * │                                                                │
 * │   inner() ← standalone call                                    │
 * │     │                                                          │
 * │     └── "No object before me? Then this = global."             │
 * │                                                                │
 * │   obj.inner() ← method call (if it were possible)              │
 * │     │                                                          │
 * │     └── "obj is before me? Then this = obj."                   │
 * │                                                                │
 * │                                                                │
 * │   ARROW FUNCTION (arrow):                                      │
 * │   ──────────────────────                                       │
 * │                                                                │
 * │   "I decide my 'this' when I'm CREATED."                       │
 * │                                                                │
 * │   var arrow = () => { ... }  ← created inside regular()        │
 * │     │                                                          │
 * │     └── "What's this right now? It's obj. That's my this."     │
 * │                                                                │
 * │   arrow() ← doesn't matter how it's called                     │
 * │     │                                                          │
 * │     └── "I don't care. My this is still obj."                  │
 * │                                                                │
 * │   someObj.arrow() ← still doesn't matter                       │
 * │     │                                                          │
 * │     └── "Nice try. My this is still obj."                      │
 * │                                                                │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ VISUAL: SCOPE AND this                                        │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ ┌─────────────────────────────────────────────────────────┐   │
 * │ │ GLOBAL SCOPE                                            │   │
 * │ │   var name = 'Global'                                   │   │
 * │ │   var obj = { name: 'Object', regular: ... }            │   │
 * │ │                                                         │   │
 * │ │   ┌─────────────────────────────────────────────────┐  │   │
 * │ │   │ regular() EXECUTION CONTEXT                     │  │   │
 * │ │   │                                                 │  │   │
 * │ │   │   this = obj  ← because obj.regular()           │  │   │
 * │ │   │                                                 │  │   │
 * │ │   │   ┌───────────────────────────────────────┐    │  │   │
 * │ │   │   │ inner() EXECUTION CONTEXT             │    │  │   │
 * │ │   │   │                                       │    │  │   │
 * │ │   │   │   this = global  ← standalone call    │    │  │   │
 * │ │   │   │   (gets its OWN this)                 │    │  │   │
 * │ │   │   │                                       │    │  │   │
 * │ │   │   └───────────────────────────────────────┘    │  │   │
 * │ │   │                                                 │  │   │
 * │ │   │   ┌───────────────────────────────────────┐    │  │   │
 * │ │   │   │ arrow() EXECUTION CONTEXT             │    │  │   │
 * │ │   │   │                                       │    │  │   │
 * │ │   │   │   this = obj  ← inherited from parent │    │  │   │
 * │ │   │   │   (NO own this, uses parent's)        │    │  │   │
 * │ │   │   │                                       │    │  │   │
 * │ │   │   └───────────────────────────────────────┘    │  │   │
 * │ │   │                                                 │  │   │
 * │ │   └─────────────────────────────────────────────────┘  │   │
 * │ │                                                         │   │
 * │ └─────────────────────────────────────────────────────────┘   │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ ANALOGY: THE EMPLOYEE STORY                                   │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ Think of functions as employees:                               │
 * │                                                                │
 * │                                                                │
 * │ REGULAR FUNCTION = "Freelancer"                               │
 * │                                                                │
 * │   A freelancer works for whoever hires them RIGHT NOW.         │
 * │                                                                │
 * │   - obj.regular() → "obj hired me, obj is my boss"            │
 * │   - inner() → "Nobody specific hired me, I work for global"   │
 * │                                                                │
 * │   They have no loyalty. They work for whoever calls them.      │
 * │                                                                │
 * │                                                                │
 * │ ARROW FUNCTION = "Loyal Employee"                             │
 * │                                                                │
 * │   A loyal employee remembers who hired them FIRST.             │
 * │                                                                │
 * │   - Created inside regular() where boss is obj                 │
 * │   - "obj was my first boss when I was hired"                  │
 * │   - "I will always work for obj, no matter who calls me"      │
 * │                                                                │
 * │   arrow() → "I work for obj, always"                          │
 * │   someoneElse.arrow() → "Still work for obj"                  │
 * │                                                                │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ SUMMARY TABLE                                                 │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ ┌──────┬──────────────┬─────────────────┬──────────────────┐  │
 * │ │ Case │ Function     │ this decided by │ this =           │  │
 * │ ├──────┼──────────────┼─────────────────┼──────────────────┤  │
 * │ │  A   │ regular()    │ How it's CALLED │ obj (method)     │  │
 * │ │      │ (method)     │ obj.regular()   │                  │  │
 * │ ├──────┼──────────────┼─────────────────┼──────────────────┤  │
 * │ │  B   │ inner()      │ How it's CALLED │ global           │  │
 * │ │      │ (regular fn) │ inner()         │ (standalone)     │  │
 * │ ├──────┼──────────────┼─────────────────┼──────────────────┤  │
 * │ │  C   │ arrow()      │ Where it's      │ obj              │  │
 * │ │      │ (arrow fn)   │ DEFINED         │ (from regular)   │  │
 * │ └──────┴──────────────┴─────────────────┴──────────────────┘  │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ THE ONE RULE TO REMEMBER                                      │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ ╔════════════════════════════════════════════════════════════╗│
 * │ ║                                                            ║│
 * │ ║  REGULAR FUNCTION: "this" depends on HOW you CALL me       ║│
 * │ ║                                                            ║│
 * │ ║  ARROW FUNCTION:   "this" depends on WHERE you WRITE me    ║│
 * │ ║                                                            ║│
 * │ ╚════════════════════════════════════════════════════════════╝│
 * │                                                                │
 * │ That's it. That's the whole rule.                              │
 * │                                                                │
 * │ Regular → CALL time                                            │
 * │ Arrow   → WRITE time (definition time)                         │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ COMPLETE this BINDING RULES (FINAL)                           │
 * ├─────────────────────┬──────────────────────────────────────────┤
 * │ Call Pattern        │ this =                                  │
 * ├─────────────────────┼──────────────────────────────────────────┤
 * │ func() non-strict   │ global object                           │
 * │ func() strict       │ undefined                               │
 * │ obj.func()          │ obj (object before the dot)             │
 * │ func.call(obj)      │ obj (explicitly set)                    │
 * │ func.apply(obj)     │ obj (explicitly set)                    │
 * │ func.bind(obj)()    │ obj (permanently bound)                 │
 * │ new func()          │ NEW empty object                        │
 * │ arrow function      │ inherited from WHERE it's DEFINED       │
 * └─────────────────────┴──────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                              │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ "A prints 'Object' because regular() is called as a method    │
 * │  (obj.regular()), so this = obj.                              │
 * │                                                                │
 * │  B prints 'undefined' because inner() is a regular function   │
 * │  called standalone. Regular functions get their this based    │
 * │  on HOW they're called. Standalone call means this = global,  │
 * │  and global.name is undefined in Node.js.                     │
 * │                                                                │
 * │  C prints 'Object' because arrow() is an arrow function.      │
 * │  Arrow functions don't have their own this - they inherit     │
 * │  it from the scope WHERE they're DEFINED. arrow() is          │
 * │  defined inside regular() where this = obj. So arrow's        │
 * │  this is also obj, regardless of how it's called.             │
 * │                                                                │
 * │  The key difference: regular functions decide this at CALL    │
 * │  time, arrow functions decide this at DEFINITION time."       │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ CONGRATULATIONS!                                              │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ You've completed all 20 Execution Context challenges!         │
 * │                                                                │
 * │ You now understand:                                            │
 * │   ✓ Hoisting (var, let, const, function)                      │
 * │   ✓ Creation Phase vs Execution Phase                         │
 * │   ✓ Temporal Dead Zone (TDZ)                                  │
 * │   ✓ Scope (block, function, global)                           │
 * │   ✓ Scope Chain                                               │
 * │   ✓ Call Stack                                                │
 * │   ✓ Lexical Scope                                             │
 * │   ✓ this Binding (all 8 rules!)                               │
 * │   ✓ Arrow Functions vs Regular Functions                      │
 * │   ✓ The new keyword                                           │
 * │   ✓ Strict mode effects                                       │
 * │                                                                │
 * │ Next topic: CLOSURES                                           │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/01-execution-context/20-ultimate-this-test.js
 */
