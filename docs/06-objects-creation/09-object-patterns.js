/**
 * CHALLENGE 09: Object Patterns (Module, Singleton, Builder)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Key object creation patterns:                                              ║
 * ║                                                                            ║
 * ║ MODULE: IIFE that returns public API, hides private state                  ║
 * ║   var Module = (function() {                                               ║
 * ║     var private = ...;                                                     ║
 * ║     return { public: ... };                                                ║
 * ║   })();                                                                    ║
 * ║                                                                            ║
 * ║ SINGLETON: Ensures only one instance exists                                ║
 * ║                                                                            ║
 * ║ BUILDER: Method chaining to construct complex objects                      ║
 * ║   new Builder().setA(1).setB(2).build()                                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Module Pattern (IIFE)
var Counter = (function() {
  var count = 0;

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount() { return count; }
  };
})();

Counter.increment();
Counter.increment();
Counter.increment();

console.log('A:', Counter.getCount());
console.log('B:', Counter.count);

// Singleton Pattern
var Database = (function() {
  var instance;

  function createInstance() {
    return { connection: 'MongoDB', query: function(q) { return q; } };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

var db1 = Database.getInstance();
var db2 = Database.getInstance();

console.log('C:', db1 === db2);

// Builder Pattern
function QueryBuilder() {
  this.query = {};

  this.select = function(fields) {
    this.query.select = fields;
    return this;
  };

  this.from = function(table) {
    this.query.from = table;
    return this;
  };

  this.where = function(condition) {
    this.query.where = condition;
    return this;
  };

  this.build = function() {
    return this.query;
  };
}

var query = new QueryBuilder()
  .select(['name', 'age'])
  .from('users')
  .where('age > 18')
  .build();

console.log('D:', query.from);
console.log('E:', query.select.length);

/**
 * OUTPUT:
 *   A: 3
 *   B: undefined
 *   C: true
 *   D: users
 *   E: 2
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A & B: Module pattern with private state                                   ║
 * ║ ──────────────────────────────────────────                                 ║
 * ║   count is in IIFE closure, not on returned object                         ║
 * ║   increment() x3 → count = 3                                               ║
 * ║   Counter.getCount() → 3 (via closure)                                     ║
 * ║   Counter.count → undefined (not exposed)                                  ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: Singleton - same instance                                               ║
 * ║ ────────────────────────────────                                           ║
 * ║   First getInstance() → creates instance                                   ║
 * ║   Second getInstance() → returns same instance                             ║
 * ║   db1 === db2 → true (same object reference)                               ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D & E: Builder with method chaining                                        ║
 * ║ ──────────────────────────────────                                         ║
 * ║   Each method returns 'this' for chaining                                  ║
 * ║   .select(['name', 'age']) → query.select = ['name', 'age']                ║
 * ║   .from('users') → query.from = 'users'                                    ║
 * ║   .build() → returns { select: [...], from: 'users', where: '...' }        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PATTERN COMPARISON                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌──────────┬────────────────────────────────────────────────────────┐     │
 * │   │ Pattern  │ Use Case                                               │     │
 * │   ├──────────┼────────────────────────────────────────────────────────┤     │
 * │   │ Module   │ Encapsulation, private state, namespacing             │     │
 * │   │ Singleton│ Database connections, config, caches                   │     │
 * │   │ Builder  │ Complex object construction, fluent APIs               │     │
 * │   │ Factory  │ Creating objects without 'new', polymorphism           │     │
 * │   └──────────┴────────────────────────────────────────────────────────┘     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-objects-creation/09-object-patterns.js
 */
