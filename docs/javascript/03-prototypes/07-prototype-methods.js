/**
 * CHALLENGE 07: Prototype Methods vs Instance Methods
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   Instance methods (this.method = fn):                                     ║
 * ║     • Created NEW for each instance                                        ║
 * ║     • Uses more memory                                                     ║
 * ║     • Can access private closure variables                                 ║
 * ║                                                                            ║
 * ║   Prototype methods (Constructor.prototype.method = fn):                   ║
 * ║     • SHARED by all instances                                              ║
 * ║     • Memory efficient                                                     ║
 * ║     • Preferred for most methods                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function Counter(start) {
  this.count = start;

  // Instance method - new function for each instance
  this.incrementInstance = function() {
    return ++this.count;
  };
}

// Prototype method - shared by all instances
Counter.prototype.incrementProto = function() {
  return ++this.count;
};

var c1 = new Counter(0);
var c2 = new Counter(100);

console.log('A:', c1.incrementInstance === c2.incrementInstance);
console.log('B:', c1.incrementProto === c2.incrementProto);
console.log('C:', c1.incrementProto());
console.log('D:', c2.incrementProto());
console.log('E:', c1.count);

/**
 * OUTPUT:
 *   A: false
 *   B: true
 *   C: 1
 *   D: 101
 *   E: 1
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: c1.incrementInstance === c2.incrementInstance                           ║
 * ║ ────────────────────────────────────────────────                           ║
 * ║   • incrementInstance is created inside constructor                        ║
 * ║   • Each new Counter() creates a NEW function                              ║
 * ║   • c1 and c2 have DIFFERENT function objects                              ║
 * ║   • Returns false                                                          ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: c1.incrementProto === c2.incrementProto                                 ║
 * ║ ──────────────────────────────────────────────                             ║
 * ║   • incrementProto is on Counter.prototype                                 ║
 * ║   • Both c1 and c2 inherit from same prototype                             ║
 * ║   • Both reference the SAME function                                       ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: c1.incrementProto()                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   • this = c1                                                              ║
 * ║   • this.count was 0, becomes 1                                            ║
 * ║   • Returns 1                                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: c2.incrementProto()                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   • this = c2                                                              ║
 * ║   • this.count was 100, becomes 101                                        ║
 * ║   • Returns 101                                                            ║
 * ║                                                                            ║
 * ║   Note: Same method, different this, operates on different counts!         ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: c1.count                                                                ║
 * ║ ──────────                                                                 ║
 * ║   • c1's count is 1 (incremented once)                                     ║
 * ║   • Returns 1                                                              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Instance vs Prototype Methods                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   INSTANCE METHODS (this.method = fn):                                      │
 * │                                                                             │
 * │   ┌─────────────────────┐    ┌─────────────────────┐                        │
 * │   │  c1                 │    │  c2                 │                        │
 * │   │                     │    │                     │                        │
 * │   │  count: 1           │    │  count: 101         │                        │
 * │   │  incrementInstance ─┼─►  │  incrementInstance ─┼─►                      │
 * │   │  [Function 1]       │    │  [Function 2]       │  ← Different functions!│
 * │   │                     │    │                     │                        │
 * │   └─────────────────────┘    └─────────────────────┘                        │
 * │                                                                             │
 * │                                                                             │
 * │   PROTOTYPE METHODS (Constructor.prototype.method = fn):                    │
 * │                                                                             │
 * │   ┌─────────────────────┐    ┌─────────────────────┐                        │
 * │   │  c1                 │    │  c2                 │                        │
 * │   │                     │    │                     │                        │
 * │   │  count: 1           │    │  count: 101         │                        │
 * │   │  __proto__ ─────────┼─┐  │  __proto__ ─────────┼─┐                      │
 * │   │                     │ │  │                     │ │                      │
 * │   └─────────────────────┘ │  └─────────────────────┘ │                      │
 * │                           │                          │                      │
 * │                           ▼                          ▼                      │
 * │                    ┌──────────────────────────────────────┐                 │
 * │                    │  Counter.prototype                   │                 │
 * │                    │                                      │                 │
 * │                    │  incrementProto: [Function] ◄────────┼── Same function!│
 * │                    │                                      │                 │
 * │                    └──────────────────────────────────────┘                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE EACH                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ USE PROTOTYPE METHODS (preferred):                                          │
 * │   • Most methods that operate on instance data                              │
 * │   • Memory efficient - shared by all instances                              │
 * │   • Can be overridden per-instance if needed                                │
 * │                                                                             │
 * │                                                                             │
 * │ USE INSTANCE METHODS when you need:                                         │
 * │   • Access to constructor's closure variables (private data)                │
 * │   • Each instance to have a truly unique function                           │
 * │   • Methods that won't change after construction                            │
 * │                                                                             │
 * │   function PrivateCounter() {                                               │
 * │     var privateCount = 0;  // Closure - truly private                       │
 * │                                                                             │
 * │     this.increment = function() {                                           │
 * │       return ++privateCount;  // Can access closure                         │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Prototype methods CAN'T access privateCount!                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Instance methods (this.method = fn) are created inside the constructor,    │
 * │  so each instance gets its own copy. This uses more memory but allows       │
 * │  access to closure variables for true privacy.                              │
 * │                                                                             │
 * │  Prototype methods (Constructor.prototype.method = fn) are shared by        │
 * │  all instances. They're more memory efficient and are the preferred         │
 * │  approach for most methods.                                                 │
 * │                                                                             │
 * │  In this example:                                                           │
 * │  - c1.incrementInstance !== c2.incrementInstance (different functions)      │
 * │  - c1.incrementProto === c2.incrementProto (same function)                  │
 * │                                                                             │
 * │  Both approaches work correctly - the prototype method still accesses       │
 * │  the correct count via 'this'. The key difference is memory usage           │
 * │  and the ability to access constructor closures."                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/03-prototypes/07-prototype-methods.js
 */
