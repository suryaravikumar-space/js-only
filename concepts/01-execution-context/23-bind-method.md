# Concept 23: The `bind()` Method - Permanent this Binding

## What is `bind()`?

`bind()` creates a **NEW FUNCTION** with `this` **permanently locked**.

```
SYNTAX: const boundFunc = func.bind(thisArg, arg1, arg2, ...)
```

## Critical Difference from call()/apply()

| Method | Behavior |
|--------|----------|
| `call()` | **IMMEDIATELY** executes the function |
| `apply()` | **IMMEDIATELY** executes the function |
| `bind()` | **RETURNS** a new function (doesn't execute) |

---

## Example 1: bind() Basics

```javascript
var person = {
  name: 'Alice',
  greet: function(greeting) {
    console.log(greeting + ', ' + this.name);
  }
};

// Normal method call
person.greet('Hello');  // Hello, Alice

// Get reference - loses this!
var greetFunc = person.greet;
greetFunc('Hi');  // Hi, undefined

// Create a bound function
var boundGreet = person.greet.bind(person);
boundGreet('Hi');  // Hi, Alice - works!

// bind is PERMANENT - can't be changed
var anotherObj = { name: 'Bob', sayHi: boundGreet };
anotherObj.sayHi('Hey');  // Hey, Alice - STILL Alice!
```

### Key Insight

`anotherObj.sayHi('Hey')` prints "Hey, **Alice**" NOT "Hey, Bob"

Why? Because `boundGreet` was created with `bind(person)`. Once bound, the `this` value is **LOCKED FOREVER**.

Even these won't change it:
```javascript
boundGreet.call({name: 'Charlie'}, 'Yo')   // Still Alice!
boundGreet.apply({name: 'Dave'}, ['Sup'])  // Still Alice!
```

---

## Example 2: Comparison Summary

```javascript
function introduce(greeting, punctuation) {
  console.log(greeting + ', I am ' + this.name + punctuation);
}

var user = { name: 'John' };

// call() - executes immediately, comma-separated args
introduce.call(user, 'Hello', '!');
// Hello, I am John!

// apply() - executes immediately, array of args
introduce.apply(user, ['Hi', '...']);
// Hi, I am John...

// bind() - returns NEW function, doesn't execute
var boundIntroduce = introduce.bind(user, 'Hey');
boundIntroduce('?');  // Hey, I am John?
// Note: 'Hey' was pre-filled, only '?' was passed
```

### Summary Table

| Method | Executes? | Arguments |
|--------|-----------|-----------|
| `call()` | Immediately | Individual (comma-separated) |
| `apply()` | Immediately | Array |
| `bind()` | NO (returns fn) | Individual (can pre-fill some) |

---

## Example 3: Partial Application (Currying)

```javascript
function multiply(a, b) {
  return a * b;
}

// Create specialized functions by pre-filling arguments
var double = multiply.bind(null, 2);     // a is locked to 2
var triple = multiply.bind(null, 3);     // a is locked to 3
var quadruple = multiply.bind(null, 4);

console.log(double(5));     // 10  (2 * 5)
console.log(triple(5));     // 15  (3 * 5)
console.log(quadruple(5));  // 20  (4 * 5)
```

### Partial Application Explained

```javascript
multiply.bind(null, 2)
             │     │
             │     └── First argument (a) is PRE-FILLED with 2
             │
             └── null because multiply doesn't use `this`
```

`double(5)` is like calling `multiply(2, 5)`

> This pattern is called "partial application" or "currying"

---

## Example 4: Event Handlers (MOST COMMON USE CASE)

```javascript
var button = {
  label: 'Submit',
  handleClick: function() {
    console.log('Clicked: ' + this.label);
  }
};

function simulateClick(handler) {
  handler();  // Standalone call - loses this!
}

// Problem: this is lost
simulateClick(button.handleClick);
// Clicked: undefined

// Solution: bind()
simulateClick(button.handleClick.bind(button));
// Clicked: Submit
```

### Real React Example

```javascript
// React Class Component (before hooks)
class MyComponent extends React.Component {
  constructor() {
    super();
    // Must bind methods to use `this` in event handlers
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(this.state);  // Works because of bind()
  }

  render() {
    return <button onClick={this.handleClick}>Click</button>;
  }
}
```

Without bind(), `this.state` would be undefined because event handlers are called as standalone functions.

---

## Example 5: bind() Cannot be Overridden

```javascript
var obj1 = { name: 'Object 1' };
var obj2 = { name: 'Object 2' };
var obj3 = { name: 'Object 3' };

function getName() {
  return this.name;
}

// Bind to obj1
var boundToObj1 = getName.bind(obj1);
console.log(boundToObj1());              // Object 1

// Try to override with call()
console.log(boundToObj1.call(obj2));     // Object 1 (still!)

// Try to override with apply()
console.log(boundToObj1.apply(obj3));    // Object 1 (still!)

// Try to bind again
var rebind = boundToObj1.bind(obj2);
console.log(rebind());                   // Object 1 (STILL!)
```

### bind() is Permanent

| Attempt to Override | Result |
|--------------------|--------|
| `boundFunc.call(otherObj)` | Original `this` |
| `boundFunc.apply(otherObj)` | Original `this` |
| `boundFunc.bind(otherObj)` | Original `this` |
| `otherObj.method = boundFunc` | Original `this` |

> **Exception**: The `new` keyword CAN override bind()

---

## Example 6: bind() with `new` (Special Case)

```javascript
function Person(name) {
  this.name = name;
}

var boundPerson = Person.bind({ name: 'Ignored' });

// When using `new`, the bound `this` is IGNORED
var john = new boundPerson('John');
console.log(john.name);  // John (not 'Ignored'!)
```

### Special Case: new OVERRIDES bind()

The `new` keyword is the **ONLY** thing that can override bind():
- The bound `this` is ignored
- A new object is created as usual
- `this` inside the function = the new object
- Pre-filled arguments from bind() are **STILL used** though!

---

## Visual: call() vs apply() vs bind()

```
┌────────────────────────────────────────────────────────────────────┐
│ call()                                                             │
│ ──────                                                             │
│                                                                    │
│   func.call(obj, a, b)  ──►  func executes NOW with this=obj       │
│                              Returns: function's return value      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ apply()                                                            │
│ ───────                                                            │
│                                                                    │
│   func.apply(obj, [a,b]) ──► func executes NOW with this=obj       │
│                              Returns: function's return value      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ bind()                                                             │
│ ──────                                                             │
│                                                                    │
│   func.bind(obj, a)  ──►  Returns NEW FUNCTION                     │
│                           (doesn't execute yet!)                   │
│                                                                    │
│   boundFunc(b)  ──►  NOW it executes with this=obj                 │
│                      Arguments: a (pre-filled) + b (new)           │
└────────────────────────────────────────────────────────────────────┘
```

---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Purpose** | Create a new function with `this` permanently bound |
| **Syntax** | `const boundFunc = func.bind(thisArg, arg1, arg2)` |
| **Execution** | Does NOT execute (returns new function) |
| **Permanence** | `this` is locked forever (except with `new`) |

### Key Differences from call/apply

| Feature | call/apply | bind |
|---------|------------|------|
| Executes immediately | ✅ Yes | ❌ No |
| Returns | Function's return value | New function |
| `this` changeable later | N/A | ❌ No (permanent) |
| Partial application | ❌ No | ✅ Yes |

### Common Use Cases

| Use Case | Example |
|----------|---------|
| Event handlers | `this.handleClick.bind(this)` |
| setTimeout callbacks | `setTimeout(obj.method.bind(obj), 100)` |
| Passing methods as callbacks | `arr.map(obj.transform.bind(obj))` |
| Partial application | `multiply.bind(null, 2)` |

---

## Interview Answer

> "bind() creates a new function with `this` permanently bound to a specific object. Unlike call() and apply() which execute immediately, bind() returns a new function that you can call later.
>
> The most common use case is event handlers. When you pass a method as a callback, `this` gets lost. Using bind(), you can lock `this` to the correct object.
>
> bind() also supports partial application - you can pre-fill some arguments when binding. This is useful for creating specialized functions from generic ones.
>
> Once bound, `this` cannot be changed by call(), apply(), or another bind(). The only exception is the `new` keyword, which can override the bound `this` when using a bound function as a constructor."

---

## Run Example

```bash
node concepts/01-execution-context/23-bind-method.js
```
