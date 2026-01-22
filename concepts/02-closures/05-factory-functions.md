# Challenge 05: Factory Functions

## The Golden Rule

```
Factory functions use closures to create multiple independent
instances, each with their own private state.
```

## The Challenge

```javascript
function createCounter(start) {
  var count = start || 0;

  return {
    increment: function() { return ++count; },
    decrement: function() { return --count; },
    getCount: function() { return count; }
  };
}

var counter1 = createCounter(0);
var counter2 = createCounter(100);

console.log('A:', counter1.increment());
console.log('B:', counter1.increment());
console.log('C:', counter2.increment());
console.log('D:', counter1.getCount());
console.log('E:', counter2.getCount());

counter1.count = 999;
console.log('F:', counter1.getCount());
```

**What prints for A, B, C, D, E, F?**

---

## Key Concepts

| Concept | Explanation |
|---------|-------------|
| Factory | Function that creates and returns objects |
| Independent Instances | Each call creates NEW closure with OWN variables |
| No Shared State | counter1 and counter2 have separate `count` variables |

## Visual: Independent Closures

```
createCounter(0) creates:
┌────────────────────────┐
│  Closure 1             │
│  count = 0             │
│  increment/decrement   │
└────────────────────────┘

createCounter(100) creates:
┌────────────────────────┐
│  Closure 2             │
│  count = 100           │
│  increment/decrement   │
└────────────────────────┘

Two SEPARATE count variables!
```

## Factory vs Constructor

```javascript
// Factory Function (uses closures)
function createPerson(name) {
  return {
    getName: function() { return name; }
  };
}

// Constructor Function (uses this)
function Person(name) {
  this.name = name;
}
Person.prototype.getName = function() {
  return this.name;
};

// Factory: Privacy via closure
// Constructor: Shared methods via prototype (more memory efficient)
```

## When to Use Factory Functions

| Use Factory When | Use Constructor When |
|------------------|---------------------|
| Need private variables | Need prototype inheritance |
| Don't need `instanceof` | Need `instanceof` checks |
| Simple objects | Complex hierarchies |
| Functional style | OOP style |
