# Concept 26: `this` in Nested Objects

## The Key Rule

> **`this` is ALWAYS the object IMMEDIATELY before the dot.**

For nested objects:
```javascript
outer.inner.method()  →  this = inner (NOT outer!)
```

Only the **LAST object** before the method call matters.

---

## Example 1: Basic Nested Object

```javascript
var company = {
  name: 'TechCorp',

  department: {
    name: 'Engineering',

    getName: function() {
      return this.name;
    }
  }
};

console.log(company.department.getName());
// Output: Engineering (NOT TechCorp!)
```

### Breakdown

```
company.department.getName()
        └────────┘
             │
             └── Object IMMEDIATELY before .getName()

this = company.department = { name: 'Engineering', getName: ... }
this.name = 'Engineering'
```

> `company.name` is **IGNORED** - only the immediate object matters!

---

## Example 2: Multiple Levels of Nesting

```javascript
var app = {
  name: 'MyApp',

  config: {
    name: 'Config',

    database: {
      name: 'Database',

      connection: {
        name: 'Connection',

        getName: function() {
          return this.name;
        }
      }
    }
  }
};

console.log(app.config.database.connection.getName());
// Output: Connection
```

### Chain Breakdown

```
app.config.database.connection.getName()
                    └────────┘
                         │
                         └── this = connection
```

It doesn't matter how deep the nesting is. Only the object **IMMEDIATELY** before the method matters.

---

## Example 3: Accessing Parent from Nested Object

```javascript
var outer = {
  name: 'Outer',

  inner: {
    name: 'Inner',

    getOwnName: function() {
      return this.name;  // 'Inner'
    }

    // Can't access outer.name with `this`!
    // There's NO way to get to outer via this
  }
};

console.log(outer.inner.getOwnName());  // Inner

// To access parent, you need a reference
outer.inner.parent = outer;
outer.inner.getParentName = function() {
  return this.parent.name;  // 'Outer'
};
```

> Nested objects **cannot** access their parent via `this`. You must store a reference!

---

## Example 4: Tricky Interview Question ⚠️

```javascript
var obj = {
  name: 'obj',

  nested: {
    name: 'nested',

    arrowMethod: () => {
      console.log('Arrow:', this.name);
    },

    regularMethod: function() {
      console.log('Regular:', this.name);
    }
  }
};

obj.nested.regularMethod();  // Regular: nested
obj.nested.arrowMethod();    // Arrow: undefined
```

### The Tricky Part: Arrow in Nested Object

| Method | `this` | `this.name` |
|--------|--------|-------------|
| `regularMethod` | `nested` (object before dot) | `'nested'` |
| `arrowMethod` | `global` (lexical scope) | `undefined` |

**Why arrow is global?**
- Arrow functions inherit `this` from **LEXICAL SCOPE**
- Object literal `{ }` is **NOT a scope!**
- The arrow was defined in the **global scope**

> **REMEMBER**: Object literals don't create scope for arrow functions!

---

## Example 5: Arrow Function Inside Method (Correct Use)

```javascript
var player = {
  name: 'Player',

  stats: {
    name: 'Stats',
    health: 100,

    showHealth: function() {
      // Regular method - this = stats
      console.log('Stats name:', this.name);  // Stats

      // Arrow inside method - inherits this from showHealth
      var logHealth = () => {
        console.log('Arrow this.name:', this.name);  // Stats (inherited!)
        console.log('Health:', this.health);          // 100
      };

      logHealth();
    }
  }
};

player.stats.showHealth();
```

| Location | Function Type | `this` |
|----------|--------------|--------|
| Object property | Arrow | ❌ Global (bad) |
| Inside method | Arrow | ✅ Parent method's `this` (good) |

---

## Example 6: Common Callback Mistake

```javascript
var store = {
  name: 'Main Store',

  cart: {
    name: 'Shopping Cart',
    items: ['apple', 'banana', 'orange'],

    // ❌ BROKEN: Regular function in forEach
    showItemsBroken: function() {
      this.items.forEach(function(item) {
        console.log(this.name + ':', item);  // undefined: apple
      });
    },

    // ✅ FIX 1: Arrow function
    showItemsArrow: function() {
      this.items.forEach((item) => {
        console.log(this.name + ':', item);  // Shopping Cart: apple
      });
    },

    // ✅ FIX 2: thisArg parameter
    showItemsThisArg: function() {
      this.items.forEach(function(item) {
        console.log(this.name + ':', item);
      }, this);  // <-- Pass this as second argument
    }
  }
};
```

---

## Visual: this in Nested Objects

```
var a = {
  name: 'A',
  b: {
    name: 'B',
    c: {
      name: 'C',
      getName: function() { return this.name; }
    }
  }
};

a.b.c.getName()
│ │ │
│ │ └── this = c (immediately before .getName)
│ │
│ └──── b is in the chain but doesn't affect this
│
└────── a is in the chain but doesn't affect this

Result: 'C'
```

---

## Summary Table

| Scenario | `this` Value |
|----------|--------------|
| `outer.inner.method()` | `inner` |
| `a.b.c.d.method()` | `d` |
| Arrow in object literal | Global (NOT the object!) |
| Arrow inside method | Parent method's `this` |

### Key Points

| Point | Explanation |
|-------|-------------|
| Only immediate object matters | Nesting depth is irrelevant |
| Can't access parent via `this` | Store reference if needed: `child.parent = parent` |
| Arrow in object = global | Object literals are NOT scopes |
| Arrow inside method = good | Inherits from method's `this` |

### Common Mistakes

| Mistake | Reality |
|---------|---------|
| Expecting `this` to be root object | `this` is only immediate object |
| Arrow functions as methods | Loses object reference |
| Forgetting callback context | Callbacks lose `this` |

---

## Interview Answer

> "In nested objects, `this` is always the object immediately before the dot when the method is called. For `outer.inner.method()`, `this` is `inner`, not `outer`.
>
> This means nested objects can't directly access their parent via `this`. If you need parent access, you have to explicitly store a reference.
>
> A common gotcha is using arrow functions as methods in nested objects. Object literals don't create scope, so the arrow inherits `this` from the global scope, not from the object. Regular functions should be used for methods, while arrow functions are better for callbacks inside those methods."

---

## Run Example

```bash
node concepts/01-execution-context/26-this-nested-objects.js
```
