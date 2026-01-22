// CHALLENGE 09: Object Patterns (Module, Singleton, Builder)
//
// What prints for A, B, C, D, E?

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
