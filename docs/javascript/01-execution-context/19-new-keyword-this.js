/**
 * TOPIC: The `new` Keyword and `this` Binding
 *
 * CONCEPT:
 * The `new` keyword completely changes how `this` works.
 * Forgetting `new` when calling a constructor is a DANGEROUS bug
 * that silently pollutes the global object.
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ THE CRITICAL DIFFERENCE                                       ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║  WITHOUT new:  Person('John')                                  ║
 * ║    → this = global object                                      ║
 * ║    → Returns undefined                                         ║
 * ║    → POLLUTES global!                                          ║
 * ║                                                                ║
 * ║  WITH new:     new Person('John')                              ║
 * ║    → this = fresh empty object                                 ║
 * ║    → Returns that object automatically                         ║
 * ║    → CORRECT behavior                                          ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

function Person(name) {
  this.name = name;
  console.log(this);
}

var p1 = Person('John');      // WITHOUT new! // ES6: use `let` or `const`
var p2 = new Person('Jane');  // WITH new     // ES6: use `const`

console.log('p1:', p1);
console.log('p2:', p2);
console.log('name:', name);

/**
 * OUTPUT:
 *   <global object with name: 'John'>   ← Person('John')
 *   Person { name: 'Jane' }             ← new Person('Jane')
 *   p1: undefined
 *   p2: Person { name: 'Jane' }
 *   name: John                          ← global.name was set!
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ ORDER OF EXECUTION - STEP BY STEP                             ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║ STEP 1: Person('John') - WITHOUT new                          ║
 * ║ ─────────────────────────────────────                         ║
 * ║   1. Person('John') is called                                 ║
 * ║   2. No `new` keyword → this = global object                  ║
 * ║   3. this.name = 'John' → global.name = 'John'                ║
 * ║   4. console.log(this) → PRINTS global object                 ║
 * ║   5. Function returns nothing → p1 = undefined                ║
 * ║                                                                ║
 * ║   DANGER: Global object now has name = 'John'!                ║
 * ║                                                                ║
 * ║                                                                ║
 * ║ STEP 2: new Person('Jane') - WITH new                         ║
 * ║ ─────────────────────────────────────                         ║
 * ║   1. `new` creates empty object: {}                           ║
 * ║   2. `new` sets this = that empty object                      ║
 * ║   3. this.name = 'Jane' → { name: 'Jane' }                    ║
 * ║   4. console.log(this) → PRINTS { name: 'Jane' }              ║
 * ║   5. `new` automatically returns the object                   ║
 * ║      → p2 = Person { name: 'Jane' }                           ║
 * ║                                                                ║
 * ║   CORRECT: New object created and returned                    ║
 * ║                                                                ║
 * ║                                                                ║
 * ║ STEP 3: console.log('p1:', p1)                                ║
 * ║ ─────────────────────────────────────                         ║
 * ║   → PRINTS: p1: undefined                                     ║
 * ║   Because Person() without new returns nothing                ║
 * ║                                                                ║
 * ║                                                                ║
 * ║ STEP 4: console.log('p2:', p2)                                ║
 * ║ ─────────────────────────────────────                         ║
 * ║   → PRINTS: p2: Person { name: 'Jane' }                       ║
 * ║   Because new Person() returns the created object             ║
 * ║                                                                ║
 * ║                                                                ║
 * ║ STEP 5: console.log('name:', name)                            ║
 * ║ ─────────────────────────────────────                         ║
 * ║   → PRINTS: name: John                                        ║
 * ║   Why? In Step 1, Person('John') did:                         ║
 * ║   this.name = 'John' where this = global                      ║
 * ║   So global.name = 'John'                                     ║
 * ║   `name` looks in scope chain → finds global.name             ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHAT `new` DOES (4 STEPS)                                     │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ When you call: new Person('Jane')                              │
 * │                                                                │
 * │ JavaScript does these 4 things automatically:                  │
 * │                                                                │
 * │   1. CREATE:  Creates a new empty object {}                   │
 * │                                                                │
 * │   2. LINK:    Links the object to Person.prototype            │
 * │               (we'll cover prototypes later)                  │
 * │                                                                │
 * │   3. BIND:    Sets `this` = that new object                   │
 * │               Then runs the function code                     │
 * │                                                                │
 * │   4. RETURN:  Returns the object automatically                │
 * │               (unless function explicitly returns an object)  │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ VISUAL: WITHOUT new vs WITH new                               │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ WITHOUT new: Person('John')                                    │
 * │ ────────────────────────────                                   │
 * │                                                                │
 * │   ┌─────────────────────────────────────────────────────────┐ │
 * │   │ GLOBAL OBJECT                                           │ │
 * │   │                                                         │ │
 * │   │   ... other global stuff ...                            │ │
 * │   │   name: 'John'  ← POLLUTED!                             │ │
 * │   │                                                         │ │
 * │   └─────────────────────────────────────────────────────────┘ │
 * │                                                                │
 * │   p1 = undefined (nothing returned)                           │
 * │                                                                │
 * │                                                                │
 * │ WITH new: new Person('Jane')                                   │
 * │ ────────────────────────────                                   │
 * │                                                                │
 * │   ┌─────────────────────────────────────────────────────────┐ │
 * │   │ NEW OBJECT (created by `new`)                           │ │
 * │   │                                                         │ │
 * │   │   name: 'Jane'  ← CORRECT!                              │ │
 * │   │                                                         │ │
 * │   └─────────────────────────────────────────────────────────┘ │
 * │                                                                │
 * │   p2 = Person { name: 'Jane' } (object returned)              │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ COMMON CONFUSION: "Why does console.log(name) work?"          │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ QUESTION:                                                     │
 * │ "We never declared `var name`. Why doesn't it throw an error?"│
 * │                                                                │
 * │ ANSWER:                                                       │
 * │ When Person('John') ran:                                      │
 * │   - this = global object                                      │
 * │   - this.name = 'John' created global.name = 'John'           │
 * │                                                                │
 * │ In Node.js/Browser:                                           │
 * │   - Properties on global object are accessible as variables   │
 * │   - So `name` finds `global.name` which is 'John'             │
 * │                                                                │
 * │ This is the DANGER of forgetting `new`:                       │
 * │   - You accidentally create global variables                  │
 * │   - These can overwrite existing globals                      │
 * │   - Very hard to debug!                                       │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHY p1 IS undefined                                           │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ function Person(name) {                                        │
 * │   this.name = name;                                            │
 * │   console.log(this);                                           │
 * │   // NO return statement!                                      │
 * │ }                                                              │
 * │                                                                │
 * │ WITHOUT new:                                                   │
 * │   - Function has no return statement                          │
 * │   - Functions without return give undefined                   │
 * │   - p1 = undefined                                            │
 * │                                                                │
 * │ WITH new:                                                      │
 * │   - `new` automatically returns the created object            │
 * │   - Even though there's no return statement                   │
 * │   - p2 = the new object                                       │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ STRICT MODE SAVES YOU                                         │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ In strict mode, forgetting `new` throws an error:             │
 * │                                                                │
 * │   'use strict';                                                │
 * │                                                                │
 * │   function Person(name) {                                      │
 * │     this.name = name;  // TypeError!                          │
 * │   }                                                            │
 * │                                                                │
 * │   Person('John');  // ERROR: Cannot set property of undefined │
 * │                                                                │
 * │ Why? In strict mode:                                           │
 * │   - Standalone function call → this = undefined               │
 * │   - undefined.name = 'John' throws TypeError                  │
 * │                                                                │
 * │ This is why strict mode is SAFER!                              │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ MODERN SOLUTION: ES6 CLASSES                                  │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ ES6 classes FORCE you to use `new`:                            │
 * │                                                                │
 * │   class Person {                                               │
 * │     constructor(name) {                                        │
 * │       this.name = name;                                        │
 * │     }                                                          │
 * │   }                                                            │
 * │                                                                │
 * │   Person('John');      // TypeError: must use 'new'           │
 * │   new Person('John');  // Works correctly                     │
 * │                                                                │
 * │ Classes are syntactic sugar over constructor functions,        │
 * │ but they prevent the "forgot new" bug.                         │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ SUMMARY: this BINDING RULES (COMPLETE)                        │
 * ├─────────────────────┬──────────────────────────────────────────┤
 * │ Call Pattern        │ this =                                  │
 * ├─────────────────────┼──────────────────────────────────────────┤
 * │ func() non-strict   │ global object (window/global)           │
 * │ func() strict       │ undefined                               │
 * │ obj.func()          │ obj (object before the dot)             │
 * │ func.call(obj)      │ obj (explicitly set)                    │
 * │ func.apply(obj)     │ obj (explicitly set)                    │
 * │ func.bind(obj)()    │ obj (permanently bound)                 │
 * │ new func()          │ NEW empty object (created by new)       │
 * │ arrow function      │ inherits from parent SCOPE (lexical)    │
 * └─────────────────────┴──────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "What happens when you call a constructor function without `new`?"
 * A: Person('John') without `new` is a standalone function call. In non-strict
 *    mode, `this` is the global object. So this.name = 'John' actually sets
 *    global.name = 'John', polluting the global namespace. The function returns
 *    nothing, so p1 is undefined. With `new`, a fresh empty object is created,
 *    `this` is set to that object, the function runs, and the object is returned
 *    automatically. So p2 is { name: 'Jane' }. This is why forgetting `new` is
 *    dangerous. Strict mode catches this by making `this` undefined, causing an
 *    error. ES6 classes also prevent this by requiring `new`.
 *
 *
 * ES6 NOTE: Use ES6 `class` syntax instead of constructor functions. Classes
 *           enforce `new` usage and run in strict mode by default.
 *
 * RUN: node docs/javascript/01-execution-context/19-new-keyword-this.js
 */
