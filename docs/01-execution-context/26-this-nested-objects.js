/**
 * CHALLENGE 26: `this` in Nested Objects
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE CRITICAL LESSON                                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ `this` is ALWAYS the object IMMEDIATELY before the dot!                    ║
 * ║                                                                            ║
 * ║   outer.inner.method()  →  this = inner (NOT outer!)                       ║
 * ║                                                                            ║
 * ║ Nesting doesn't create any special relationship.                           ║
 * ║ The method only knows about its IMMEDIATE caller.                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var outer = {
  name: 'Outer',
  inner: {
    name: 'Inner',
    getName: function() {
      return this.name;
    }
  },
  getInnerName: function() {
    return this.inner.getName();
  }
};

console.log('A:', outer.inner.getName());
console.log('B:', outer.getInnerName());

var getName = outer.inner.getName;
console.log('C:', getName());

var obj = {
  value: 100,
  nested: {
    value: 200,
    getValue: function() {
      return this.value;
    },
    getOuterValue: function() {
      var self = this;
      return function() {
        return self.value;
      };
    }
  }
};

console.log('D:', obj.nested.getValue());

var extracted = obj.nested.getValue;
console.log('E:', extracted());

console.log('F:', obj.nested.getOuterValue()());

/**
 * OUTPUT:
 *   A: Inner
 *   B: Inner
 *   C: undefined
 *   D: 200
 *   E: undefined
 *   F: 200
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: outer.inner.getName()                                                   ║
 * ║ ────────────────────────                                                   ║
 * ║   • Call: outer.inner.getName()                                            ║
 * ║   • What's immediately before the dot? → inner                             ║
 * ║   • this = inner (NOT outer!)                                              ║
 * ║   • this.name = 'Inner'                                                    ║
 * ║                                                                            ║
 * ║   COMMON MISTAKE:                                                          ║
 * ║   Thinking outer.inner means this = outer                                  ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: outer.getInnerName()                                                    ║
 * ║ ───────────────────────                                                    ║
 * ║   • This calls outer's method, so this = outer                             ║
 * ║   • Inside, it calls: this.inner.getName()                                 ║
 * ║   • Which is: outer.inner.getName()                                        ║
 * ║   • For getName(), this = inner                                            ║
 * ║   • Result: 'Inner'                                                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: getName()  ← THE CLASSIC TRAP                                           ║
 * ║ ────────────                                                               ║
 * ║   • getName = outer.inner.getName (just a reference)                       ║
 * ║   • getName() is a STANDALONE call                                         ║
 * ║   • this = global object                                                   ║
 * ║   • global.name = undefined                                                ║
 * ║   • Result: undefined                                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: obj.nested.getValue()                                                   ║
 * ║ ────────────────────────                                                   ║
 * ║   • What's immediately before the dot? → nested                            ║
 * ║   • this = nested                                                          ║
 * ║   • this.value = 200 (nested's value, not obj's 100)                       ║
 * ║   • Result: 200                                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: extracted()                                                             ║
 * ║ ──────────────                                                             ║
 * ║   • extracted = obj.nested.getValue (just a reference)                     ║
 * ║   • extracted() is a STANDALONE call                                       ║
 * ║   • this = global object                                                   ║
 * ║   • global.value = undefined                                               ║
 * ║   • Result: undefined                                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ F: obj.nested.getOuterValue()()                                            ║
 * ║ ───────────────────────────────                                            ║
 * ║   • First call: obj.nested.getOuterValue()                                 ║
 * ║   • this = nested, so self = nested                                        ║
 * ║   • Returns an inner function that captures self                           ║
 * ║   • Second call: ()  (invoke the returned function)                        ║
 * ║   • Inner function uses self.value (not this.value!)                       ║
 * ║   • self.value = 200                                                       ║
 * ║   • Result: 200                                                            ║
 * ║                                                                            ║
 * ║   This is the "var self = this" pattern to preserve context!               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Which Object is `this`?                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   outer.inner.getName()                                                     │
 * │   ─────────────────────                                                     │
 * │         ↑                                                                   │
 * │         │                                                                   │
 * │         └── IMMEDIATELY before dot = this                                   │
 * │                                                                             │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────┐       │
 * │   │                                                                 │       │
 * │   │   outer ──┬── name: 'Outer'                                     │       │
 * │   │           │                                                     │       │
 * │   │           └── inner ──┬── name: 'Inner'                         │       │
 * │   │                       │                                         │       │
 * │   │                       └── getName()  ← this = inner             │       │
 * │   │                                                                 │       │
 * │   └─────────────────────────────────────────────────────────────────┘       │
 * │                                                                             │
 * │   The method doesn't know it's "inside" outer.                              │
 * │   It only sees: inner.getName() → this = inner                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE "var self = this" PATTERN                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ PROBLEM:                                                                    │
 * │   Nested functions lose the outer `this`                                    │
 * │                                                                             │
 * │   var obj = {                                                               │
 * │     value: 42,                                                              │
 * │     process: function() {                                                   │
 * │       // this = obj here                                                    │
 * │       setTimeout(function() {                                               │
 * │         console.log(this.value);  // undefined! this = global               │
 * │       }, 100);                                                              │
 * │     }                                                                       │
 * │   };                                                                        │
 * │                                                                             │
 * │ SOLUTION 1: var self = this                                                 │
 * │   var obj = {                                                               │
 * │     value: 42,                                                              │
 * │     process: function() {                                                   │
 * │       var self = this;  // Capture this in a closure variable              │
 * │       setTimeout(function() {                                               │
 * │         console.log(self.value);  // 42! Uses closure, not this             │
 * │       }, 100);                                                              │
 * │     }                                                                       │
 * │   };                                                                        │
 * │                                                                             │
 * │ SOLUTION 2: Arrow function (ES6)                                            │
 * │   var obj = {                                                               │
 * │     value: 42,                                                              │
 * │     process: function() {                                                   │
 * │       setTimeout(() => {                                                    │
 * │         console.log(this.value);  // 42! Arrow inherits outer this          │
 * │       }, 100);                                                              │
 * │     }                                                                       │
 * │   };                                                                        │
 * │                                                                             │
 * │ SOLUTION 3: bind()                                                          │
 * │   var obj = {                                                               │
 * │     value: 42,                                                              │
 * │     process: function() {                                                   │
 * │       setTimeout(function() {                                               │
 * │         console.log(this.value);  // 42!                                    │
 * │       }.bind(this), 100);                                                   │
 * │     }                                                                       │
 * │   };                                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON MISTAKE: Assuming Nested = Access to Outer                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ WRONG THINKING:                                                             │
 * │   "inner is inside outer, so inner can access outer's properties            │
 * │    through this"                                                            │
 * │                                                                             │
 * │ CORRECT THINKING:                                                           │
 * │   "this is determined by HOW the function is called, not WHERE              │
 * │    it's defined. inner.getName() means this = inner, period."               │
 * │                                                                             │
 * │ IF YOU NEED TO ACCESS OUTER:                                                │
 * │                                                                             │
 * │   var outer = {                                                             │
 * │     name: 'Outer',                                                          │
 * │     inner: {                                                                │
 * │       name: 'Inner',                                                        │
 * │       getOuterName: function() {                                            │
 * │         return outer.name;  // Direct reference, not this!                  │
 * │       }                                                                     │
 * │     }                                                                       │
 * │   };                                                                        │
 * │                                                                             │
 * │   // Or pass reference explicitly:                                          │
 * │   inner.getOuterName.call(outer);                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "In nested objects, `this` always refers to the object IMMEDIATELY          │
 * │  before the dot when the method is called. So outer.inner.getName()         │
 * │  has this = inner, not outer. The nesting structure doesn't create          │
 * │  any special relationship - each method only sees its direct caller.        │
 * │                                                                             │
 * │  If you need to preserve `this` across nested function calls, you can:      │
 * │  1. Use var self = this; pattern to capture it in a closure                 │
 * │  2. Use arrow functions which inherit this lexically                        │
 * │  3. Use bind() to explicitly set this                                       │
 * │                                                                             │
 * │  The key insight is that `this` is always determined at call time,          │
 * │  not definition time, so looking at where a function is defined             │
 * │  won't tell you what `this` will be."                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/01-execution-context/26-this-nested-objects.js
 */
