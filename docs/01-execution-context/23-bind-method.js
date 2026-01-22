/**
 * CHALLENGE 23: The bind() Method
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE MOST IMPORTANT RULE ABOUT bind()                                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   bind() is PERMANENT!                                                     ║
 * ║                                                                            ║
 * ║   Once a function is bound, `this` CANNOT be changed by:                   ║
 * ║     ✗ call()          - will be ignored                                    ║
 * ║     ✗ apply()         - will be ignored                                    ║
 * ║     ✗ another bind()  - will be ignored                                    ║
 * ║     ✗ method call     - will be ignored                                    ║
 * ║                                                                            ║
 * ║   The ONLY thing that can override bind() is the `new` keyword!            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var person = {
  name: 'Alice',
  greet: function(greeting) {
    return greeting + ', ' + this.name;
  }
};

var bob = { name: 'Bob' };
var charlie = { name: 'Charlie' };

var boundToBob = person.greet.bind(bob);

console.log('A:', boundToBob('Hello'));
console.log('B:', boundToBob.call(charlie, 'Hi'));
console.log('C:', boundToBob.apply(person, ['Hey']));

var doubleBound = boundToBob.bind(charlie);
console.log('D:', doubleBound('Yo'));

var boundWithArg = person.greet.bind(bob, 'Fixed');
console.log('E:', boundWithArg());
console.log('F:', boundWithArg('Ignored'));

/**
 * OUTPUT:
 *   A: Hello, Bob
 *   B: Hi, Bob
 *   C: Hey, Bob
 *   D: Yo, Bob
 *   E: Fixed, Bob
 *   F: Fixed, Bob
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ SETUP:                                                                     ║
 * ║   var boundToBob = person.greet.bind(bob);                                 ║
 * ║                                                                            ║
 * ║   This creates a NEW function where this is PERMANENTLY locked to bob.     ║
 * ║   No matter what happens later, boundToBob will ALWAYS use bob as this.    ║
 * ║                                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: boundToBob('Hello')                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   • this = bob (bound)                                                     ║
 * ║   • greeting = 'Hello'                                                     ║
 * ║   • Result: 'Hello, Bob'                                                   ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: boundToBob.call(charlie, 'Hi')                                          ║
 * ║ ─────────────────────────────────                                          ║
 * ║   • Trying to use call() to change this to charlie                         ║
 * ║   • BUT bind() is permanent!                                               ║
 * ║   • call() is IGNORED for bound functions                                  ║
 * ║   • this = bob (still!)                                                    ║
 * ║   • Result: 'Hi, Bob' (NOT 'Hi, Charlie'!)                                 ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: boundToBob.apply(person, ['Hey'])                                       ║
 * ║ ────────────────────────────────────                                       ║
 * ║   • Trying to use apply() to change this to person                         ║
 * ║   • BUT bind() is permanent!                                               ║
 * ║   • apply() is IGNORED for bound functions                                 ║
 * ║   • this = bob (still!)                                                    ║
 * ║   • Result: 'Hey, Bob' (NOT 'Hey, Alice'!)                                 ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: doubleBound('Yo')                                                       ║
 * ║ ────────────────────                                                       ║
 * ║   • doubleBound = boundToBob.bind(charlie)                                 ║
 * ║   • Trying to bind again to charlie                                        ║
 * ║   • BUT boundToBob is already bound to bob!                                ║
 * ║   • Second bind() CANNOT override first bind()                             ║
 * ║   • this = bob (still!)                                                    ║
 * ║   • Result: 'Yo, Bob' (NOT 'Yo, Charlie'!)                                 ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: boundWithArg()                                                          ║
 * ║ ─────────────────                                                          ║
 * ║   • boundWithArg = person.greet.bind(bob, 'Fixed')                         ║
 * ║   • bind() can PRE-FILL arguments too!                                     ║
 * ║   • 'Fixed' is permanently set as the first argument                       ║
 * ║   • Even with no arguments, greeting = 'Fixed'                             ║
 * ║   • this = bob                                                             ║
 * ║   • Result: 'Fixed, Bob'                                                   ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ F: boundWithArg('Ignored')                                                 ║
 * ║ ──────────────────────────                                                 ║
 * ║   • First argument is already pre-filled as 'Fixed'                        ║
 * ║   • 'Ignored' becomes the SECOND argument                                  ║
 * ║   • But greet() only uses the first argument!                              ║
 * ║   • greeting = 'Fixed' (pre-filled, not 'Ignored')                         ║
 * ║   • Result: 'Fixed, Bob'                                                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: bind() IS PERMANENT                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   var boundToBob = person.greet.bind(bob);                                  │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────┐       │
 * │   │ boundToBob                                                      │       │
 * │   │                                                                 │       │
 * │   │   ┌─────────────────────────────────────────────────────────┐   │       │
 * │   │   │ this = bob  ← LOCKED FOREVER                            │   │       │
 * │   │   │                                                         │   │       │
 * │   │   │ function(greeting) {                                    │   │       │
 * │   │   │   return greeting + ', ' + this.name;                   │   │       │
 * │   │   │ }                                                       │   │       │
 * │   │   └─────────────────────────────────────────────────────────┘   │       │
 * │   │                                                                 │       │
 * │   └─────────────────────────────────────────────────────────────────┘       │
 * │                                                                             │
 * │   Attempts to change this:                                                  │
 * │                                                                             │
 * │   boundToBob.call(charlie)   →  ❌ Ignored! this = bob                      │
 * │   boundToBob.apply(person)   →  ❌ Ignored! this = bob                      │
 * │   boundToBob.bind(charlie)   →  ❌ Ignored! this = bob                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: PARTIAL APPLICATION (Pre-filling Arguments)                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   var boundWithArg = person.greet.bind(bob, 'Fixed');                       │
 * │                                           ───────                           │
 * │                                              │                              │
 * │                                              └── Pre-filled argument        │
 * │                                                                             │
 * │   When you call:                                                            │
 * │                                                                             │
 * │   boundWithArg()           →  greet('Fixed')         →  'Fixed, Bob'        │
 * │   boundWithArg('Ignored')  →  greet('Fixed', 'Ignored') → 'Fixed, Bob'      │
 * │                                      ↑                                      │
 * │                                      │                                      │
 * │                           'Ignored' becomes 2nd arg, not used               │
 * │                                                                             │
 * │                                                                             │
 * │   MORE USEFUL EXAMPLE:                                                      │
 * │                                                                             │
 * │   function multiply(a, b) { return a * b; }                                 │
 * │                                                                             │
 * │   var double = multiply.bind(null, 2);  // a is locked to 2                 │
 * │   var triple = multiply.bind(null, 3);  // a is locked to 3                 │
 * │                                                                             │
 * │   double(5)  →  multiply(2, 5)  →  10                                       │
 * │   triple(5)  →  multiply(3, 5)  →  15                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON: call() vs apply() vs bind()                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ┌──────────┬─────────────────┬───────────────────┬────────────────────────┐ │
 * │ │ Method   │ Executes?       │ Returns           │ this changeable later? │ │
 * │ ├──────────┼─────────────────┼───────────────────┼────────────────────────┤ │
 * │ │ call()   │ YES, immediately│ Function's result │ N/A (already executed) │ │
 * │ │ apply()  │ YES, immediately│ Function's result │ N/A (already executed) │ │
 * │ │ bind()   │ NO              │ NEW function      │ NO (permanent!)        │ │
 * │ └──────────┴─────────────────┴───────────────────┴────────────────────────┘ │
 * │                                                                             │
 * │ SYNTAX:                                                                     │
 * │   func.call(thisArg, arg1, arg2)       // Executes now                      │
 * │   func.apply(thisArg, [arg1, arg2])    // Executes now                      │
 * │   func.bind(thisArg, arg1, arg2)       // Returns new function              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON MISTAKE: Thinking call/apply can override bind                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ WRONG THINKING:                                                             │
 * │   "call() explicitly sets this, so it should override bind()"               │
 * │                                                                             │
 * │ CORRECT THINKING:                                                           │
 * │   "bind() creates a special function where this is LOCKED.                  │
 * │    It's like a contract that can't be broken."                              │
 * │                                                                             │
 * │ WHY?                                                                        │
 * │   bind() returns a new "exotic" function that internally ignores            │
 * │   any attempts to change this. This is BY DESIGN - it's the whole           │
 * │   point of bind()! You want a function that ALWAYS uses a specific this.    │
 * │                                                                             │
 * │ ANALOGY:                                                                    │
 * │   bind() is like a loyal employee who only reports to one boss.             │
 * │   Even if another manager (call/apply) tries to give them orders,           │
 * │   they only listen to their original boss.                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE ONE EXCEPTION: new OVERRIDES bind()                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function Person(name) {                                                   │
 * │     this.name = name;                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │   var BoundPerson = Person.bind({ name: 'Bound' });                         │
 * │                                                                             │
 * │   // Normal call - uses bound this                                          │
 * │   // BoundPerson('John');  // { name: 'Bound' }.name = 'John'               │
 * │                                                                             │
 * │   // With new - IGNORES bound this!                                         │
 * │   var p = new BoundPerson('John');                                          │
 * │   console.log(p.name);  // 'John' (not 'Bound'!)                            │
 * │                                                                             │
 * │   The `new` keyword creates a fresh object and uses that as this,           │
 * │   completely ignoring what bind() set.                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The key thing about bind() is that it's PERMANENT. Once you bind a         │
 * │  function to a specific `this` value, that binding cannot be changed        │
 * │  by call(), apply(), or even another bind().                                │
 * │                                                                             │
 * │  In this challenge:                                                         │
 * │  - boundToBob.call(charlie) still uses bob, not charlie                     │
 * │  - boundToBob.apply(person) still uses bob, not person                      │
 * │  - boundToBob.bind(charlie) still uses bob, not charlie                     │
 * │                                                                             │
 * │  bind() also supports partial application - you can pre-fill arguments.    │
 * │  boundWithArg = greet.bind(bob, 'Fixed') means the first argument is        │
 * │  always 'Fixed', regardless of what you pass when calling.                  │
 * │                                                                             │
 * │  The only thing that can override bind() is the `new` keyword, which        │
 * │  creates a new object and uses that as `this` instead."                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/01-execution-context/23-bind-method.js
 */
