# Challenge 09: Closures and `this` Interaction

## The Golden Rule

```
Closures capture VARIABLES, not `this`.
`this` is determined at call time, NOT closure time.
Arrow functions are the exception - they capture `this` lexically.
```

## The Challenge

```javascript
var obj = {
  name: 'Object',

  regularClosure: function() {
    var self = this;
    return function() {
      return self.name;
    };
  },

  brokenClosure: function() {
    return function() {
      return this.name;
    };
  },

  arrowClosure: function() {
    return () => {
      return this.name;
    };
  }
};

var getName1 = obj.regularClosure();
var getName2 = obj.brokenClosure();
var getName3 = obj.arrowClosure();

console.log('A:', getName1());
console.log('B:', getName2());
console.log('C:', getName3());

var detached = obj.arrowClosure;
var getName4 = detached();
console.log('D:', getName4());
```

**What prints for A, B, C, D?**

---

## Key Concepts

| Pattern | `this` Behavior | Result |
|---------|-----------------|--------|
| var self = this | Captures this in regular variable | Works |
| Inner function uses this | this = global (standalone call) | Broken |
| Arrow function | Inherits this from enclosing scope | Works (if outer has correct this) |

## Why Each Works/Fails

```javascript
// A: regularClosure - var self = this
// When obj.regularClosure() runs, this = obj
// self = obj (captured in closure)
// Inner function uses self (regular variable) → 'Object'

// B: brokenClosure - inner uses this
// When obj.brokenClosure() runs, this = obj (but not captured)
// Returns inner function
// getName2() is standalone call → this = global
// global.name = undefined

// C: arrowClosure - arrow function
// When obj.arrowClosure() runs, this = obj
// Arrow captures this lexically → obj
// getName3() still has this = obj → 'Object'

// D: detached arrowClosure
// detached() is standalone call → this = global in arrowClosure
// Arrow captures global's this
// getName4() has this = global → undefined
```

## The Three Solutions

```javascript
var obj = {
  name: 'Object',

  // Solution 1: var self = this (ES5)
  method1: function() {
    var self = this;
    setTimeout(function() {
      console.log(self.name);  // Works!
    }, 100);
  },

  // Solution 2: bind() (ES5)
  method2: function() {
    setTimeout(function() {
      console.log(this.name);  // Works!
    }.bind(this), 100);
  },

  // Solution 3: Arrow function (ES6) - PREFERRED
  method3: function() {
    setTimeout(() => {
      console.log(this.name);  // Works!
    }, 100);
  }
};
```

## Common Mistake

```javascript
// This looks like it should work...
var obj = {
  name: 'Object',
  method: () => {
    return this.name;  // WRONG! this = global/undefined
  }
};

// Arrow in object literal doesn't capture obj's this
// It captures the ENCLOSING scope's this (global)
```
