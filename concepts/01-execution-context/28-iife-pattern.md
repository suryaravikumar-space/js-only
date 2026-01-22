# Concept 28: IIFE Pattern (Immediately Invoked Function Expression)

## What is an IIFE?

An **IIFE** (pronounced "iffy") is a function that **runs immediately** after it's defined.

```javascript
(function() {
  console.log('I run immediately!');
})();
```

### IIFE Anatomy

```
(function() {     ← Function wrapped in parentheses
  // code here
})();             ← Immediately invoked with ()
 ↑
 └── These parentheses call the function
```

---

## Why Use IIFE?

| Reason | Before ES6 | Now (ES6+) |
|--------|------------|------------|
| Create private scope | Only way with `var` | Use `let`/`const` with blocks |
| Avoid global pollution | Essential | Still useful |
| Module pattern | Very common | Use ES6 modules |
| One-time initialization | Common | Still useful |

> Before ES6, IIFE was the **only way** to create block-like scope for `var`.

---

## Example 1: Basic IIFE Syntax

```javascript
// Standard IIFE
(function() {
  var secret = 'hidden';
  console.log('IIFE executed!');
})();

// console.log(secret);  // ReferenceError! Not accessible

// Arrow function IIFE (ES6)
(() => {
  console.log('Arrow IIFE!');
})();

// IIFE with parameters
(function(name) {
  console.log('Hello, ' + name);
})('World');  // Hello, World

// Named IIFE (for stack traces)
(function myIIFE() {
  console.log('Named IIFE');
})();
```

### Syntax Variations

| Style | Syntax | Notes |
|-------|--------|-------|
| Standard | `(function() {})()` | Most common |
| Alternative | `(function() {}())` | Call inside parens |
| Arrow | `(() => {})()` | ES6+ |
| Unary operators | `!function() {}()` | Less common |
| | `+function() {}()` | |
| | `void function() {}()` | |

---

## Example 2: Private Variables (The Module Pattern)

```javascript
var counter = (function() {
  // Private variable - not accessible outside
  var count = 0;

  // Return public interface
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
})();

console.log(counter.increment());  // 1
console.log(counter.increment());  // 2
console.log(counter.decrement());  // 1
console.log(counter.getCount());   // 1
console.log(counter.count);        // undefined (private!)
```

### Module Pattern Visualization

```
┌─────────────────────────────────────────────────────┐
│ IIFE Scope (Private)                                │
│                                                     │
│   var count = 0;  ← Only accessible inside IIFE    │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │ Returned Object (Public Interface)          │   │
│   │                                             │   │
│   │   increment()  ← Can access count           │   │
│   │   decrement()  ← Can access count           │   │
│   │   getCount()   ← Can access count           │   │
│   │                                             │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘

Outside: Can only use the public methods, not count directly
```

---

## Example 3: Avoiding Global Pollution

```javascript
// ❌ BAD: Pollutes global scope
var config = { debug: true };
var helpers = { log: function() {} };
var state = { user: null };

// ✅ GOOD: IIFE keeps everything private
var myApp = (function() {
  // All these are private
  var config = { debug: true };
  var helpers = { log: function(msg) { console.log(msg); } };
  var state = { user: null };

  // Only expose what's needed
  return {
    init: function() {
      helpers.log('App initialized');
    },
    setUser: function(user) {
      state.user = user;
    }
  };
})();

myApp.init();  // App initialized
```

---

## Example 4: Loop Variable Problem (Classic!)

```javascript
// ❌ PROBLEM: var is function-scoped, not block-scoped
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);  // 3, 3, 3 (all same!)
  }, 100);
}

// ✅ FIX 1: IIFE captures each value
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j);  // 0, 1, 2 (correct!)
    }, 100);
  })(i);  // Pass current i value
}

// ✅ FIX 2: Use let (ES6) - much simpler!
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);  // 0, 1, 2 (correct!)
  }, 100);
}
```

### Why IIFE Fixes the Loop

```
Iteration 0: IIFE creates new scope, j = 0, captured by setTimeout
Iteration 1: IIFE creates new scope, j = 1, captured by setTimeout
Iteration 2: IIFE creates new scope, j = 2, captured by setTimeout

Each setTimeout has its own j value!
```

---

## Example 5: IIFE with Return Value

```javascript
// IIFE can return any value
var result = (function() {
  var a = 10;
  var b = 20;
  return a + b;
})();

console.log(result);  // 30

// IIFE returning a function
var greet = (function() {
  var greeting = 'Hello';

  return function(name) {
    return greeting + ', ' + name + '!';
  };
})();

console.log(greet('World'));  // Hello, World!
```

---

## Example 6: IIFE for One-Time Initialization

```javascript
var database = (function() {
  // This code runs ONCE when the script loads
  console.log('Initializing database connection...');

  var connection = {
    host: 'localhost',
    port: 5432,
    connected: false
  };

  // Simulate connection
  connection.connected = true;
  console.log('Database connected!');

  return {
    query: function(sql) {
      if (!connection.connected) {
        throw new Error('Not connected!');
      }
      console.log('Executing:', sql);
    },

    disconnect: function() {
      connection.connected = false;
      console.log('Disconnected');
    }
  };
})();

// Initialization already happened
database.query('SELECT * FROM users');
```

---

## Example 7: IIFE with Dependency Injection

```javascript
// Passing global objects as parameters
(function($, window, document, undefined) {
  // $ is guaranteed to be jQuery
  // undefined is guaranteed to be undefined (old JS could reassign it!)

  $(document).ready(function() {
    console.log('DOM ready!');
  });

})(jQuery, window, document);

// Modern equivalent with ES6 modules
// import $ from 'jquery';
```

### Why Inject Dependencies?

| Reason | Explanation |
|--------|-------------|
| Minification | Local vars can be minified: `$` → `a` |
| Performance | Local lookup is faster than global |
| Safety | Protects against global modifications |
| Clarity | Dependencies are explicit |

---

## Example 8: Revealing Module Pattern

```javascript
var calculator = (function() {
  // Private
  var result = 0;

  function add(x) {
    result += x;
    return result;
  }

  function subtract(x) {
    result -= x;
    return result;
  }

  function multiply(x) {
    result *= x;
    return result;
  }

  function reset() {
    result = 0;
    return result;
  }

  function getResult() {
    return result;
  }

  // Reveal public methods
  return {
    add: add,
    subtract: subtract,
    multiply: multiply,
    reset: reset,
    getResult: getResult
  };
})();

calculator.add(5);       // 5
calculator.multiply(2);  // 10
calculator.subtract(3);  // 7
console.log(calculator.getResult());  // 7
```

---

## IIFE vs ES6 Blocks

```javascript
// IIFE (ES5)
(function() {
  var x = 10;
  console.log(x);
})();

// Block with let/const (ES6) - Simpler!
{
  let x = 10;
  console.log(x);
}

// Both achieve the same: x is not accessible outside
```

### When to Still Use IIFE

| Scenario | Use IIFE? |
|----------|-----------|
| Supporting old browsers | ✅ Yes |
| Need to return a value | ✅ Yes |
| Module pattern (no ES6 modules) | ✅ Yes |
| Simple block scope | ❌ Use `{}` with `let`/`const` |

---

## Summary Table

| Aspect | Details |
|--------|---------|
| **What** | Function that executes immediately after definition |
| **Syntax** | `(function() {})()` or `(() => {})()` |
| **Purpose** | Create private scope, avoid global pollution |
| **Returns** | Can return any value |

### IIFE Use Cases

| Use Case | Example |
|----------|---------|
| Module pattern | Create objects with private state |
| Avoid globals | Wrap entire script in IIFE |
| Loop fix (var) | Capture loop variable |
| One-time init | Database connections, config |
| Dependency injection | Pass jQuery, window, etc. |

### Modern Alternatives

| IIFE Pattern | Modern Alternative |
|--------------|-------------------|
| Private scope | `{}` with `let`/`const` |
| Modules | ES6 `import`/`export` |
| Loop closure | `let` in for loop |

---

## Interview Answer

> "An IIFE (Immediately Invoked Function Expression) is a function that runs immediately after it's defined. The syntax wraps a function in parentheses and calls it: `(function() {})()`.
>
> Before ES6, IIFE was essential for creating private scope because `var` is function-scoped, not block-scoped. It's commonly used for:
>
> 1. **Module pattern**: Creating objects with private variables and public methods
> 2. **Avoiding global pollution**: Keeping variables out of global scope
> 3. **Loop closure fix**: Capturing loop variables for async callbacks
> 4. **One-time initialization**: Setting up configurations or connections
>
> In modern JavaScript, many IIFE use cases can be replaced with ES6 features: block scope with `let`/`const`, and ES6 modules. However, IIFE is still useful for browser scripts without module support and for the revealing module pattern."

---

## Run Example

```bash
node concepts/01-execution-context/28-iife-pattern.js
```
