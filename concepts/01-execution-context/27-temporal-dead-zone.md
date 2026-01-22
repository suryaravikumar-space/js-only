# Concept 27: Temporal Dead Zone (TDZ)

## What is the Temporal Dead Zone?

The **Temporal Dead Zone (TDZ)** is the period between entering a scope and the point where a variable is declared with `let` or `const`.

During this period, accessing the variable throws a **ReferenceError**.

```
┌─────────────────────────────────────────────────────┐
│ {                                                   │
│   // ← TDZ starts here for `x`                      │
│   //                                                │
│   // x is in TDZ - cannot access!                   │
│   //                                                │
│   let x = 10;  // ← TDZ ends here                   │
│   //                                                │
│   // x is now accessible                            │
│ }                                                   │
└─────────────────────────────────────────────────────┘
```

---

## var vs let/const: The Key Difference

```javascript
// VAR - Hoisted and initialized to undefined
console.log(a);  // undefined (no error!)
var a = 10;

// LET - Hoisted but NOT initialized (TDZ)
console.log(b);  // ReferenceError: Cannot access 'b' before initialization
let b = 20;

// CONST - Same as let
console.log(c);  // ReferenceError: Cannot access 'c' before initialization
const c = 30;
```

### Comparison Table

| Keyword | Hoisted? | Initialized? | Access Before Declaration |
|---------|----------|--------------|---------------------------|
| `var` | ✅ Yes | ✅ To `undefined` | Returns `undefined` |
| `let` | ✅ Yes | ❌ No (TDZ) | ReferenceError |
| `const` | ✅ Yes | ❌ No (TDZ) | ReferenceError |

> **Key Point**: `let` and `const` ARE hoisted, but they're not initialized. That's the TDZ!

---

## Example 1: TDZ in Action

```javascript
function example() {
  // TDZ for `name` starts here

  console.log(name);  // ReferenceError!

  let name = 'John';  // TDZ ends here

  console.log(name);  // 'John' - works fine
}
```

### Visual Timeline

```
function example() {
  │
  │  ┌──────────────────────────────────┐
  │  │ TDZ for `name`                   │
  │  │                                  │
  │  │ console.log(name); // 💥 ERROR   │
  │  │                                  │
  │  └──────────────────────────────────┘
  │
  │  let name = 'John';  ← Declaration (TDZ ends)
  │
  │  console.log(name);  // ✅ 'John'
  │
}
```

---

## Example 2: TDZ with typeof

```javascript
// Undeclared variable - typeof returns 'undefined'
console.log(typeof undeclaredVar);  // 'undefined' (safe!)

// Variable in TDZ - typeof throws error!
console.log(typeof myLet);  // ReferenceError!
let myLet = 10;
```

### typeof Behavior

| Scenario | Result |
|----------|--------|
| Undeclared variable | `'undefined'` (safe) |
| Variable in TDZ | ReferenceError |
| After declaration | Actual type |

> **Gotcha**: `typeof` is NOT always safe with `let`/`const`!

---

## Example 3: TDZ in Loops

```javascript
// ❌ ERROR: TDZ inside loop
for (let i = 0; i < 3; i++) {
  console.log(i);     // 0, 1, 2 - works
  console.log(j);     // ReferenceError!
  let j = i * 2;
}

// ✅ CORRECT: Declare before use
for (let i = 0; i < 3; i++) {
  let j = i * 2;
  console.log(i, j);  // 0,0 | 1,2 | 2,4
}
```

---

## Example 4: TDZ in Default Parameters

```javascript
// ❌ ERROR: Parameter references itself in TDZ
function broken(a = a) {  // ReferenceError!
  return a;
}

// ❌ ERROR: Parameter references later parameter
function alsoBroken(a = b, b = 1) {  // ReferenceError!
  return a + b;
}

// ✅ CORRECT: Reference earlier parameter
function works(a = 1, b = a) {
  return a + b;
}
console.log(works());  // 2
```

### Default Parameter TDZ Rules

| Pattern | Result |
|---------|--------|
| `(a = a)` | ❌ Error - `a` in its own TDZ |
| `(a = b, b = 1)` | ❌ Error - `b` not yet declared |
| `(a = 1, b = a)` | ✅ Works - `a` already declared |

---

## Example 5: TDZ in Class Declarations

```javascript
// ❌ ERROR: Class in TDZ
const obj = new MyClass();  // ReferenceError!
class MyClass {}

// ✅ CORRECT: Use after declaration
class MyClass {}
const obj = new MyClass();  // Works!
```

> Classes are also subject to TDZ, just like `let` and `const`.

---

## Example 6: TDZ with Closures (Tricky!)

```javascript
let x = 'outer';

function test() {
  // TDZ for inner `x` starts at function body start!

  console.log(x);  // ReferenceError! (not 'outer')

  let x = 'inner';
}

test();
```

### Why This Happens

```
function test() {
  │
  │  JavaScript sees: "let x exists in this scope"
  │  So it creates TDZ for x from the start of the block
  │
  │  ┌─────────────────────────────────────────┐
  │  │ TDZ for local `x`                       │
  │  │                                         │
  │  │ console.log(x);  // 💥 ERROR            │
  │  │ (Does NOT access outer x!)              │
  │  │                                         │
  │  └─────────────────────────────────────────┘
  │
  │  let x = 'inner';
  │
}
```

> The inner `let x` **shadows** the outer `x` from the start of the function, even before declaration!

---

## Example 7: var vs let in Same Scope

```javascript
function compare() {
  console.log(varVariable);  // undefined
  console.log(letVariable);  // ReferenceError!

  var varVariable = 'var';
  let letVariable = 'let';
}
```

### Hoisting Visualization

```
// What JavaScript actually does:

function compare() {
  var varVariable = undefined;  // Hoisted AND initialized
  // letVariable is hoisted but NOT initialized (TDZ)

  console.log(varVariable);  // undefined
  console.log(letVariable);  // ReferenceError!

  varVariable = 'var';
  letVariable = 'let';  // TDZ ends here
}
```

---

## Example 8: TDZ Duration

```javascript
function tdz() {
  const start = Date.now();

  // Simulating time passing...
  for (let i = 0; i < 1000000; i++) {}

  // `x` is STILL in TDZ even after time passed
  // TDZ is about CODE POSITION, not time

  console.log(x);  // ReferenceError!

  let x = 10;
}
```

> TDZ is about **lexical position** in code, not actual time. The variable is in TDZ until the declaration line is **executed**.

---

## Why Does TDZ Exist?

| Reason | Explanation |
|--------|-------------|
| **Catch bugs early** | Accessing variables before declaration is usually a bug |
| **const semantics** | `const` must be assigned at declaration - TDZ enforces this |
| **Predictable behavior** | Variables behave consistently from declaration point |
| **Better error messages** | ReferenceError is clearer than silent `undefined` |

---

## Common TDZ Gotchas

### Gotcha 1: Conditional Declarations

```javascript
function gotcha(condition) {
  if (condition) {
    // TDZ for `x` exists in this block only
    console.log(x);  // ReferenceError!
    let x = 10;
  }
  // `x` doesn't exist here at all
}
```

### Gotcha 2: Switch Statements

```javascript
function switchGotcha(val) {
  switch (val) {
    case 1:
      let x = 'one';  // TDZ issue possible!
      break;
    case 2:
      console.log(x);  // ReferenceError! Same scope as case 1
      break;
  }
}

// Fix: Use blocks
function switchFixed(val) {
  switch (val) {
    case 1: {
      let x = 'one';
      break;
    }
    case 2: {
      let x = 'two';  // Different scope
      break;
    }
  }
}
```

### Gotcha 3: Function Hoisting vs let

```javascript
// ❌ This works (function hoisting)
greet();
function greet() { console.log('Hi'); }

// ❌ This fails (function expression with let)
greet();  // ReferenceError!
let greet = function() { console.log('Hi'); };
```

---

## Summary Table

| Aspect | `var` | `let`/`const` |
|--------|-------|---------------|
| Hoisted | ✅ Yes | ✅ Yes |
| Initialized when hoisted | ✅ To `undefined` | ❌ No |
| Has TDZ | ❌ No | ✅ Yes |
| Access before declaration | Returns `undefined` | ReferenceError |
| Block scoped | ❌ No (function scoped) | ✅ Yes |

### TDZ Key Points

| Point | Detail |
|-------|--------|
| **What** | Period between scope entry and declaration |
| **When** | Only with `let`, `const`, and `class` |
| **Error** | ReferenceError |
| **Duration** | Until the declaration line is executed |
| **typeof** | Also throws error in TDZ! |

---

## Interview Answer

> "The Temporal Dead Zone is the period between entering a scope and the point where a variable declared with `let` or `const` is initialized. During this time, accessing the variable throws a ReferenceError.
>
> Unlike `var`, which is hoisted and initialized to `undefined`, `let` and `const` are hoisted but NOT initialized. This means JavaScript knows the variable exists in that scope, but you can't access it until the declaration line.
>
> TDZ exists to catch bugs early - accessing a variable before declaration is usually a mistake. It also ensures `const` variables are always assigned a value at declaration.
>
> A common gotcha is that even `typeof` throws an error for variables in TDZ, unlike undeclared variables where `typeof` returns `'undefined'`."

---

## Run Example

```bash
node concepts/01-execution-context/27-temporal-dead-zone.js
```
