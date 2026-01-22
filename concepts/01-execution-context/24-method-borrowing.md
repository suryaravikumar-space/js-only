# Concept 24: Method Borrowing

## What is Method Borrowing?

Method borrowing is **using a method from one object on another object** using `call()`, `apply()`, or `bind()`.

### Why Borrow?

| Reason | Example |
|--------|---------|
| Reuse functionality | Use `introduce` from person1 on person2 |
| Use Array methods on array-like objects | `Array.prototype.slice.call(arguments)` |
| Share methods between similar objects | Common logger across managers |

---

## Example 1: Basic Method Borrowing

```javascript
var person1 = {
  name: 'Alice',
  age: 25,
  introduce: function() {
    console.log(`Hi, I'm ${this.name} and I'm ${this.age} years old.`);
  }
};

var person2 = {
  name: 'Bob',
  age: 30
  // No introduce method!
};

// person2 doesn't have introduce(), but we can BORROW it
person1.introduce.call(person2);
// Hi, I'm Bob and I'm 30 years old.
```

### What Happened?

| Step | Action |
|------|--------|
| 1 | Took the `introduce` method from `person1` |
| 2 | Called it with `this = person2` |
| 3 | Inside `introduce`, `this.name = 'Bob'`, `this.age = 30` |

> `person2` now has access to functionality it doesn't own!

---

## Example 2: Array Methods on Array-like Objects (MOST COMMON)

```javascript
function sumAll() {
  // `arguments` is array-like but NOT an array
  console.log('Is array?', Array.isArray(arguments));  // false

  // Can't use: arguments.reduce(...) - doesn't exist!

  // Solution: Borrow Array.prototype.reduce
  var sum = Array.prototype.reduce.call(arguments, function(acc, num) {
    return acc + num;
  }, 0);

  console.log('Sum:', sum);
}

sumAll(1, 2, 3, 4, 5);  // Sum: 15
```

### Why Array.prototype.method.call() Works

Array methods like `reduce()`, `map()`, `filter()` are designed to work on **ANY object** that has:

| Requirement | Example |
|-------------|---------|
| A `.length` property | `arguments.length = 5` |
| Numeric indexes | `arguments[0]`, `arguments[1]`, etc. |

They access elements using: `this[0]`, `this[1]`, `this.length`, etc.

---

## Example 3: Converting Array-like to Real Array

```javascript
function showArgs() {
  // Method 1: slice (ES5)
  var args1 = Array.prototype.slice.call(arguments);

  // Method 2: Array.from (ES6)
  var args2 = Array.from(arguments);

  // Method 3: Spread operator (ES6)
  var args3 = [...arguments];

  // Now we can use ALL array methods
  console.log('mapped:', args1.map(x => x * 2));
}

showArgs(1, 2, 3);  // mapped: [2, 4, 6]
```

### Common Conversions

| Source | ES5 Method | ES6 Method |
|--------|------------|------------|
| `arguments` | `Array.prototype.slice.call(arguments)` | `[...arguments]` |
| NodeList (DOM) | `Array.prototype.slice.call(nodeList)` | `[...nodeList]` |
| String | `Array.prototype.slice.call('hello')` | `[...'hello']` |

---

## Example 4: Safe hasOwnProperty

```javascript
// Problem: Objects can override hasOwnProperty
var sketchy = {
  hasOwnProperty: function() {
    return true;  // Always returns true - FAKE!
  },
  foo: 'bar'
};

console.log(sketchy.hasOwnProperty('anything'));  // true (fake!)

// Solution: Borrow from Object.prototype
var hasOwn = Object.prototype.hasOwnProperty;
console.log(hasOwn.call(sketchy, 'foo'));       // true (real)
console.log(hasOwn.call(sketchy, 'missing'));   // false (real)
```

### Why This Matters

When iterating with `for...in`:
```javascript
// Unsafe
if (obj.hasOwnProperty(key)) { ... }

// Safe
if (Object.prototype.hasOwnProperty.call(obj, key)) { ... }

// ES6+ Safe
if (Object.hasOwn(obj, key)) { ... }
```

---

## Example 5: Type Checking with toString

```javascript
Object.prototype.toString.call([])           // "[object Array]"
Object.prototype.toString.call({})           // "[object Object]"
Object.prototype.toString.call(null)         // "[object Null]"
Object.prototype.toString.call(undefined)    // "[object Undefined]"
Object.prototype.toString.call(42)           // "[object Number]"
Object.prototype.toString.call('str')        // "[object String]"
Object.prototype.toString.call(true)         // "[object Boolean]"
Object.prototype.toString.call(function(){}) // "[object Function]"
Object.prototype.toString.call(/regex/)      // "[object RegExp]"
Object.prototype.toString.call(new Date())   // "[object Date]"
```

> More reliable than `typeof` for distinguishing arrays from objects!

---

## Example 6: Math Functions with apply()

```javascript
var numbers = [5, 6, 2, 3, 7];

// Math.max doesn't take arrays, but we can use apply
var max = Math.max.apply(null, numbers);  // 7
var min = Math.min.apply(null, numbers);  // 2

// ES6 equivalent
Math.max(...numbers);  // 7
```

---

## Common Method Borrowing Patterns

| Pattern | Code | Purpose |
|---------|------|---------|
| Array on arguments | `Array.prototype.slice.call(arguments)` | Convert to array |
| Array on NodeList | `Array.prototype.map.call(nodeList, fn)` | Use array methods |
| Array on strings | `Array.prototype.join.call('hello', '-')` | Returns `'h-e-l-l-o'` |
| Safe hasOwnProperty | `Object.prototype.hasOwnProperty.call(obj, key)` | Property check |
| Type checking | `Object.prototype.toString.call(value)` | Reliable type |
| Math with arrays | `Math.max.apply(null, numbers)` | Find max/min |

---

## Modern Alternatives (ES6+)

| Old Pattern | Modern Alternative |
|-------------|-------------------|
| `Array.prototype.slice.call(arguments)` | `Array.from(arguments)` or `[...arguments]` |
| `Object.prototype.hasOwnProperty.call(obj, key)` | `Object.hasOwn(obj, key)` |
| `Math.max.apply(null, numbers)` | `Math.max(...numbers)` |

---

## Summary Table

| Aspect | Details |
|--------|---------|
| **What** | Using a method from one object on another |
| **How** | Using `call()`, `apply()`, or `bind()` |
| **Why** | Reuse code without inheritance |

### Most Common Patterns

| Rank | Pattern | Frequency |
|------|---------|-----------|
| 1 | `Array.prototype.slice.call(arguments)` | Very Common |
| 2 | `Object.prototype.hasOwnProperty.call(obj, key)` | Common |
| 3 | `Object.prototype.toString.call(value)` | Common |
| 4 | `Math.max.apply(null, numbers)` | Moderate |

---

## Interview Answer

> "Method borrowing is a pattern where you use a method from one object on another object using call(), apply(), or bind(). The most common use case is borrowing Array methods for array-like objects.
>
> For example, the `arguments` object in functions looks like an array (has length and indexes) but isn't a real array - it doesn't have methods like map() or filter(). We can borrow these:
>
> ```javascript
> Array.prototype.slice.call(arguments)
> ```
>
> This works because Array methods are designed to work on any object with length and numeric indexes.
>
> Other common borrowing patterns include:
> - `Object.prototype.hasOwnProperty.call()` for safe property checking
> - `Object.prototype.toString.call()` for reliable type detection
>
> In modern ES6+, spread operator and Array.from() often replace these patterns, but understanding method borrowing is still important."

---

## Run Example

```bash
node concepts/01-execution-context/24-method-borrowing.js
```
