# Concept 22: The `apply()` Method - call() with Arrays

## What is `apply()`?

`apply()` is **IDENTICAL to call()**, except arguments are passed as an **ARRAY**.

```
SYNTAX: function.apply(thisArg, [arg1, arg2, ...])
```

| Parameter | Description |
|-----------|-------------|
| `thisArg` | The object to use as `this` |
| `[args]` | Arguments as an **ARRAY** (or array-like object) |

### Memory Trick 🧠

| Method | Mnemonic | Arguments |
|--------|----------|-----------|
| **c**all | **C**omma | Comma-separated |
| **a**pply | **A**rray | Array |

---

## Example 1: call() vs apply() - The Only Difference

```javascript
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
}

var person = { name: 'Alice' };

// Using call() - arguments are COMMA separated
greet.call(person, 'Hello', '!');      // Hello, Alice!

// Using apply() - arguments are in an ARRAY
greet.apply(person, ['Hello', '!']);   // Hello, Alice!
```

### The Only Difference

| Method | Syntax | Arguments |
|--------|--------|-----------|
| `call()` | `call(thisArg, arg1, arg2, arg3)` | Individual |
| `apply()` | `apply(thisArg, [arg1, arg2, arg3])` | Array |

> That's it! Everything else is identical.

---

## Example 2: When apply() is BETTER - Dynamic Arguments

```javascript
var numbers = [5, 6, 2, 3, 7];

// Problem: Math.max doesn't accept an array directly
console.log(Math.max(numbers));  // NaN - doesn't work!

// Solution 1: apply() to spread the array as individual arguments
console.log(Math.max.apply(null, numbers));  // 7

// Solution 2: Modern spread operator (ES6)
console.log(Math.max(...numbers));           // 7
```

### Why `null` as First Argument?

```javascript
Math.max.apply(null, numbers)
              ^^^^
```

`Math.max` doesn't use `this` at all. It just compares numbers. So we pass `null` (or anything) as the first argument - it's ignored.

> When a function doesn't need `this`, pass `null` or `undefined`.

---

## Example 3: Array Concatenation (Push Multiple Elements)

```javascript
var array1 = [1, 2, 3];
var array2 = [4, 5, 6];

// Problem: array1.push(array2) pushes the ARRAY itself, not elements!
// array1.push(array2) → [1, 2, 3, [4, 5, 6]] - nested array!

// Solution: apply() to push multiple elements
Array.prototype.push.apply(array1, array2);
console.log(array1);  // [1, 2, 3, 4, 5, 6]

// Modern ES6 equivalent
arr1.push(...arr2);
```

### Breakdown

| Without apply() | With apply() |
|-----------------|--------------|
| `array1.push(array2)` | `Array.prototype.push.apply(array1, array2)` |
| `[1, 2, 3, [4, 5, 6]]` (nested!) | `[1, 2, 3, 4, 5, 6]` (flat) |

> `apply()` spreads `array2` into individual arguments: `push(4, 5, 6)`

---

## Example 4: Argument Forwarding

```javascript
function logger(level) {
  // Get all arguments after 'level'
  var args = Array.prototype.slice.call(arguments, 1);

  // Forward all remaining arguments to console.log
  console.log.apply(console, ['[' + level + ']'].concat(args));
}

logger('INFO', 'Server started on port', 3000);
// [INFO] Server started on port 3000

logger('ERROR', 'Connection failed:', 'timeout', 'after', 30, 'seconds');
// [ERROR] Connection failed: timeout after 30 seconds
```

### Argument Forwarding Pattern

This pattern is useful when:
1. You want to wrap a function
2. You don't know how many arguments will be passed
3. You want to add something then forward the rest

**Modern ES6 equivalent:**
```javascript
function logger(level, ...args) {
  console.log(`[${level}]`, ...args);
}
```

---

## Visual: call() vs apply()

```
func.call(obj,  'a',  'b',  'c')
          │     │     │     │
          │     └─────┴─────┴── individual args
          │
          └── this value


func.apply(obj, ['a', 'b', 'c'])
           │    └──────────────── array of args
           │
           └── this value
```

---

## When to Use Which?

| Use | When | Example |
|-----|------|---------|
| **call()** | You know exact arguments at coding time | `greet.call(person, 'Hello', '!')` |
| **apply()** | Arguments are already in an array | `Math.max.apply(null, numbers)` |
| **apply()** | Number of arguments is dynamic/unknown | Forwarding arguments |
| **spread (...)** | Writing modern ES6+ code | `Math.max(...numbers)` |

---

## Summary Table

| Aspect | call() | apply() |
|--------|--------|---------|
| **Syntax** | `func.call(this, a, b, c)` | `func.apply(this, [a, b, c])` |
| **Arguments** | Comma-separated | Array |
| **Execution** | Immediate | Immediate |
| **Memory trick** | **C**omma | **A**rray |

### Common Use Cases for apply()

| Use Case | Example |
|----------|---------|
| Math with arrays | `Math.max.apply(null, numbers)` |
| Push multiple elements | `Array.prototype.push.apply(arr1, arr2)` |
| Forward unknown arguments | `console.log.apply(console, args)` |
| Constructor with dynamic args | `new (Func.bind.apply(Func, [null].concat(args)))` |

---

## Interview Answer

> "apply() is nearly identical to call() - both invoke a function with a specific `this` value. The only difference is how you pass arguments:
>
> - call() takes arguments individually: `func.call(obj, a, b, c)`
> - apply() takes arguments as an array: `func.apply(obj, [a, b, c])`
>
> A common use case is using apply() with Math.max on an array of numbers, since Math.max doesn't accept arrays directly. However, in modern ES6+ code, the spread operator (...) is often preferred: `Math.max(...numbers)`
>
> The memory trick I use: **A** in Apply = **A**rray, **C** in Call = **C**omma."

---

## Run Example

```bash
node concepts/01-execution-context/22-apply-method.js
```
