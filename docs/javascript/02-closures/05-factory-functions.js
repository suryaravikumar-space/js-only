/**
 * TOPIC: Factory Functions
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Factory functions use closures to create multiple independent              ║
 * ║ instances, each with their own private state.                              ║
 * ║                                                                            ║
 * ║   var counter1 = createCounter(0);   // Own closure with count=0           ║
 * ║   var counter2 = createCounter(100); // Own closure with count=100         ║
 * ║                                                                            ║
 * ║   counter1.increment();  // Affects only counter1's count                  ║
 * ║   counter2.increment();  // Affects only counter2's count                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function createCounter(start = 0) { // ES6: default parameter
  let count = start; // ES6: let

  return {
    increment() { return ++count; }, // ES6: shorthand methods
    decrement() { return --count; },
    getCount() { return count; }
  };
}

const counter1 = createCounter(0); // ES6: const
const counter2 = createCounter(100);

console.log('A:', counter1.increment());
console.log('B:', counter1.increment());
console.log('C:', counter2.increment());
console.log('D:', counter1.getCount());
console.log('E:', counter2.getCount());

counter1.count = 999;
console.log('F:', counter1.getCount());

/**
 * OUTPUT:
 *   A: 1
 *   B: 2
 *   C: 101
 *   D: 2
 *   E: 101
 *   F: 2
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ SETUP:                                                                     ║
 * ║   counter1 = createCounter(0)   → closure with count = 0                   ║
 * ║   counter2 = createCounter(100) → closure with count = 100                 ║
 * ║   These are SEPARATE closures with SEPARATE count variables!               ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ A: counter1.increment()                                                    ║
 * ║ ───────────────────────                                                    ║
 * ║   • counter1's count was 0                                                 ║
 * ║   • ++count makes it 1                                                     ║
 * ║   • Returns 1                                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: counter1.increment()                                                    ║
 * ║ ───────────────────────                                                    ║
 * ║   • counter1's count was 1                                                 ║
 * ║   • ++count makes it 2                                                     ║
 * ║   • Returns 2                                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: counter2.increment()                                                    ║
 * ║ ───────────────────────                                                    ║
 * ║   • counter2's count was 100 (SEPARATE from counter1!)                     ║
 * ║   • ++count makes it 101                                                   ║
 * ║   • Returns 101                                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: counter1.getCount()                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   • Returns counter1's count = 2                                           ║
 * ║   • Not affected by counter2's operations                                  ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: counter2.getCount()                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   • Returns counter2's count = 101                                         ║
 * ║   • Not affected by counter1's operations                                  ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ F: counter1.getCount() after counter1.count = 999                          ║
 * ║ ─────────────────────────────────────────────────                          ║
 * ║   • counter1.count = 999 creates a NEW property on the object              ║
 * ║   • It does NOT affect the private count in the closure                    ║
 * ║   • getCount() returns the closure's count = 2                             ║
 * ║   • The private variable is truly private!                                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Independent Closures                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   createCounter(0) creates:          createCounter(100) creates:            │
 * │   ┌────────────────────────┐         ┌────────────────────────┐             │
 * │   │  Closure 1             │         │  Closure 2             │             │
 * │   │                        │         │                        │             │
 * │   │  count = 2             │         │  count = 101           │             │
 * │   │       ↑                │         │       ↑                │             │
 * │   │  increment()───┘       │         │  increment()───┘       │             │
 * │   │  decrement()───┘       │         │  decrement()───┘       │             │
 * │   │  getCount()────┘       │         │  getCount()────┘       │             │
 * │   │                        │         │                        │             │
 * │   └────────────────────────┘         └────────────────────────┘             │
 * │          ↑                                   ↑                              │
 * │       counter1                            counter2                          │
 * │                                                                             │
 * │   TWO COMPLETELY SEPARATE count variables!                                  │
 * │   Operations on one don't affect the other.                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ FACTORY vs CONSTRUCTOR                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ FACTORY FUNCTION (closures):                                                │
 * │                                                                             │
 * │   function createCounter(start) {                                           │
 * │     var count = start;  // Private via closure                              │
 * │     return {                                                                │
 * │       increment: function() { return ++count; }                             │
 * │     };                                                                      │
 * │   }                                                                         │
 * │   var c = createCounter(0);  // No 'new' keyword                            │
 * │                                                                             │
 * │                                                                             │
 * │ CONSTRUCTOR FUNCTION (prototype):                                           │
 * │                                                                             │
 * │   function Counter(start) {                                                 │
 * │     this.count = start;  // Public on instance                              │
 * │   }                                                                         │
 * │   Counter.prototype.increment = function() { return ++this.count; };        │
 * │   var c = new Counter(0);  // Requires 'new' keyword                        │
 * │                                                                             │
 * │                                                                             │
 * │ ┌──────────────────┬─────────────────────┬─────────────────────────────┐    │
 * │ │ Aspect           │ Factory             │ Constructor                 │    │
 * │ ├──────────────────┼─────────────────────┼─────────────────────────────┤    │
 * │ │ Privacy          │ True privacy        │ Public properties           │    │
 * │ │ Memory           │ Methods per instance│ Methods shared on prototype │    │
 * │ │ instanceof       │ No                  │ Yes                         │    │
 * │ │ 'new' required   │ No                  │ Yes (or bugs!)              │    │
 * │ │ 'this' issues    │ No                  │ Yes                         │    │
 * │ └──────────────────┴─────────────────────┴─────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "What is a factory function and how does it use closures?"
 * A: A factory function creates and returns objects. Each call creates a new closure
 *    with its own private variables. counter1 and counter2 have completely separate
 *    `count` variables — incrementing one doesn't affect the other.
 *
 * Q: "What happens if you do `counter1.count = 999`?"
 * A: It creates a NEW property on the object, but doesn't affect the private `count`
 *    in the closure. `getCount()` still returns the real closure value (2). This
 *    proves the privacy is real — you can't cheat the closure.
 *
 * Q: "Factory functions vs constructors — when would you use each?"
 * A: Factories: true privacy via closures, no `new` keyword needed, no `this` bugs.
 *    Constructors: methods shared on prototype (more memory efficient), supports
 *    `instanceof`, works with inheritance chains. Use factories for privacy/functional
 *    style; constructors for prototype inheritance or type checking.
 *
 *
 * RUN: node docs/javascript/02-closures/05-factory-functions.js
 */
