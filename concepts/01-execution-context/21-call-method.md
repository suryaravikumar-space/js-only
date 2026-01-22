# Concept 21: The `call()` Method - Explicit this Binding

## What is `call()`?

`call()` lets you **BORROW a function** and tell it exactly what `this` should be. Instead of relying on how a function is called, **YOU decide**.

```
SYNTAX: function.call(thisArg, arg1, arg2, ...)
```

| Parameter | Description |
|-----------|-------------|
| `thisArg` | The object to use as `this` |
| `arg1, arg2, ...` | Arguments passed to the function (comma-separated) |

---

## Example 1: Basic call() Usage

```javascript
var person1 = {
  name: 'Alice',
  greet: function(greeting, punctuation) {
    console.log(greeting + ', ' + this.name + punctuation);
  }
};

var person2 = {
  name: 'Bob'
};

person1.greet('Hello', '!');                          // Hello, Alice!
person1.greet.call(person2, 'Hi', '...');             // Hi, Bob...
person1.greet.call({ name: 'Charlie' }, 'Hey', '?');  // Hey, Charlie?
```

### Breakdown

| Call | `this` becomes | Output |
|------|---------------|--------|
| `person1.greet('Hello', '!')` | `person1` (normal method call) | Hello, Alice! |
| `person1.greet.call(person2, 'Hi', '...')` | `person2` (explicitly set) | Hi, Bob... |
| `person1.greet.call({ name: 'Charlie' }, 'Hey', '?')` | inline object | Hey, Charlie? |

---

## Example 2: Function Reuse (Why call() is Useful)

```javascript
// Standalone function (not attached to any object)
function introduce(hobby, years) {
  console.log(`I'm ${this.name}, ${this.age} years old.`);
  console.log(`I've been doing ${hobby} for ${years} years.`);
}

var developer = { name: 'Surya', age: 28 };
var designer = { name: 'Priya', age: 25 };

introduce.call(developer, 'coding', 5);
// I'm Surya, 28 years old.
// I've been doing coding for 5 years.

introduce.call(designer, 'design', 3);
// I'm Priya, 25 years old.
// I've been doing design for 3 years.
```

> **KEY INSIGHT**: The function `introduce` doesn't belong to any object. Using call(), we can run it with ANY object as `this`. This is **FUNCTION REUSE** - write once, use with many objects.

---

## Example 3: call() with Primitives

```javascript
function showThis() {
  console.log('this =', this);
  console.log('typeof this =', typeof this);
}

showThis.call('hello');     // this = [String: 'hello'], typeof = object
showThis.call(42);          // this = [Number: 42], typeof = object
showThis.call(null);        // this = global (non-strict) or null (strict)
```

### Primitive Coercion Rules

| Mode | Primitive (string, number, boolean) | null/undefined |
|------|-------------------------------------|----------------|
| Non-strict | Wrapped in object | Replaced with global object |
| Strict | Stay as primitives | Stay as null/undefined |

---

## Example 4: Constructor Chaining (Inheritance)

```javascript
function Animal(name) {
  this.name = name;
  this.isAlive = true;
}

function Dog(name, breed) {
  // Call Animal constructor with `this` = the new Dog object
  Animal.call(this, name);
  this.breed = breed;
}

var myDog = new Dog('Buddy', 'Golden Retriever');
console.log(myDog);
// { name: 'Buddy', isAlive: true, breed: 'Golden Retriever' }
```

### How Constructor Chaining Works

```
new Dog('Buddy', 'Golden Retriever')
  │
  ├─► `new` creates empty object: {}
  ├─► `new` sets this = that object
  │
  └─► Inside Dog:
        │
        ├─► Animal.call(this, name)
        │     → Calls Animal with this = the new Dog object
        │     → Animal adds: this.name = 'Buddy', this.isAlive = true
        │
        └─► this.breed = 'Golden Retriever'
              → Dog adds its own property

Result: { name: 'Buddy', isAlive: true, breed: 'Golden Retriever' }
```

> This is how you achieve **INHERITANCE** before ES6 classes!

---

## Example 5: Array-like Objects to Arrays

```javascript
function listArgs() {
  // `arguments` is array-like but NOT a real array
  // It doesn't have .map(), .filter(), etc.

  // TRICK: Borrow Array's slice method!
  var argsArray = Array.prototype.slice.call(arguments);

  console.log('arguments:', arguments);  // [Arguments] { '0': 'a', '1': 'b', '2': 'c' }
  console.log('argsArray:', argsArray);  // [ 'a', 'b', 'c' ]
  console.log('Is array?', Array.isArray(argsArray));  // true
}

listArgs('a', 'b', 'c');
```

### Classic Interview Pattern

```javascript
Array.prototype.slice.call(arguments)
```

| Step | What Happens |
|------|--------------|
| 1 | Get the slice method from Array.prototype |
| 2 | Call it with `this` = arguments |
| 3 | slice() works on anything with length and indexes |
| 4 | Returns a REAL array |

**Modern alternative**: `Array.from(arguments)` or `[...arguments]`

---

## Visual: How call() Works

```
NORMAL CALL: obj.method(arg1, arg2)
─────────────────────────────────────

  ┌──────────────────────────────────────────────────────────┐
  │  method executes with:                                   │
  │    this = obj (object before dot)                        │
  │    arguments = [arg1, arg2]                              │
  └──────────────────────────────────────────────────────────┘


CALL(): obj.method.call(customThis, arg1, arg2)
───────────────────────────────────────────────

  ┌──────────────────────────────────────────────────────────┐
  │  method executes with:                                   │
  │    this = customThis (YOU decide!)                       │
  │    arguments = [arg1, arg2]                              │
  └──────────────────────────────────────────────────────────┘
```

---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Purpose** | Execute a function with a specific `this` value |
| **Syntax** | `func.call(thisArg, arg1, arg2, arg3, ...)` |
| **Execution** | IMMEDIATELY executes the function |
| **Arguments** | Comma-separated (individual) |

### Common Use Cases

| Use Case | Example |
|----------|---------|
| Borrow methods | `person1.greet.call(person2, 'Hi')` |
| Constructor chaining | `Parent.call(this, arg)` |
| Array-like to array | `Array.prototype.slice.call(arguments)` |
| Type checking | `Object.prototype.toString.call(value)` |

---

## Interview Answer

> "call() is a method available on all functions that lets you invoke the function with a specific `this` value. The first argument becomes `this`, and subsequent arguments are passed to the function.
>
> Common use cases include:
> - Borrowing methods from other objects
> - Constructor chaining for inheritance
> - Converting arguments or NodeLists to real arrays
>
> The key difference from apply() is that call() takes arguments individually (comma-separated), while apply() takes them as an array."

---

## Run Example

```bash
node concepts/01-execution-context/21-call-method.js
```
