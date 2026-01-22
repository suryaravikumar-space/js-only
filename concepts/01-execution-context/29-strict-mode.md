# Concept 29: Strict Mode

## What is Strict Mode?

Strict mode is a way to opt into a **restricted variant of JavaScript** that:
- Catches common coding mistakes
- Prevents unsafe actions
- Disables confusing features
- Makes debugging easier

```javascript
'use strict';  // Enable strict mode

// Now JavaScript is stricter about errors
```

---

## How to Enable Strict Mode

### For Entire Script

```javascript
'use strict';

// Entire file is in strict mode
function foo() {
  // strict mode
}
```

### For Single Function

```javascript
function strictFunction() {
  'use strict';
  // Only this function is strict
}

function normalFunction() {
  // Not strict
}
```

### ES6 Modules are Automatically Strict

```javascript
// In .mjs files or <script type="module">
// Strict mode is AUTOMATIC - no need for 'use strict'

export function myFunc() {
  // Already strict!
}
```

---

## Key Differences: Strict vs Non-Strict

| Feature | Non-Strict | Strict |
|---------|------------|--------|
| Undeclared variables | Creates global | **ReferenceError** |
| `this` in standalone function | `global` object | `undefined` |
| Assigning to read-only | Silent fail | **TypeError** |
| Deleting undeletable | Silent fail | **TypeError** |
| Duplicate parameters | Allowed | **SyntaxError** |
| Octal literals (0777) | Allowed | **SyntaxError** |
| `with` statement | Allowed | **SyntaxError** |
| `eval` creates variables | Yes | No (own scope) |

---

## Example 1: Undeclared Variables

```javascript
// NON-STRICT: Creates global variable (dangerous!)
function nonStrict() {
  mistake = 'oops';  // Creates global.mistake
}
nonStrict();
console.log(mistake);  // 'oops' (global pollution!)


// STRICT: Throws error (catches the bug!)
function strict() {
  'use strict';
  mistake = 'oops';  // ReferenceError: mistake is not defined
}
strict();
```

### Why This Matters

| Mode | Result | Problem |
|------|--------|---------|
| Non-strict | Creates global | Typos create hard-to-find bugs |
| Strict | ReferenceError | Catches typos immediately |

```javascript
'use strict';

var userCount = 10;
userCuont = 20;  // ReferenceError! (typo caught)
```

---

## Example 2: `this` in Functions (CRITICAL!)

```javascript
// NON-STRICT: this = global object
function nonStrictThis() {
  console.log(this);  // global object (window/global)
}
nonStrictThis();


// STRICT: this = undefined
function strictThis() {
  'use strict';
  console.log(this);  // undefined
}
strictThis();
```

### this Binding Comparison

| Call Pattern | Non-Strict `this` | Strict `this` |
|--------------|-------------------|---------------|
| `func()` | global object | `undefined` |
| `obj.method()` | obj | obj |
| `new func()` | new object | new object |
| `func.call(null)` | global | `null` |
| `func.call(undefined)` | global | `undefined` |

---

## Example 3: Assigning to Read-Only Properties

```javascript
'use strict';

// Assigning to non-writable property
var obj = {};
Object.defineProperty(obj, 'x', { value: 10, writable: false });

obj.x = 20;  // TypeError: Cannot assign to read only property

// Assigning to getter-only property
var obj2 = {
  get name() { return 'fixed'; }
};

obj2.name = 'new';  // TypeError: Cannot set property which has only a getter
```

### Non-Strict Behavior

```javascript
// Non-strict: Silent failure (very confusing!)
var obj = {};
Object.defineProperty(obj, 'x', { value: 10, writable: false });

obj.x = 20;  // Silently fails
console.log(obj.x);  // Still 10, no error
```

---

## Example 4: Deleting Undeletable Properties

```javascript
'use strict';

// Can't delete non-configurable properties
delete Object.prototype;  // TypeError!

// Can't delete variables
var x = 10;
delete x;  // SyntaxError!

// Can't delete function
function foo() {}
delete foo;  // SyntaxError!
```

---

## Example 5: Duplicate Parameter Names

```javascript
// NON-STRICT: Allowed (confusing!)
function nonStrict(a, a, b) {  // Second 'a' shadows first
  return a + b;  // Uses second 'a'
}
console.log(nonStrict(1, 2, 3));  // 5 (2 + 3)


// STRICT: SyntaxError
function strict(a, a, b) {  // SyntaxError: Duplicate parameter name
  'use strict';
  return a + b;
}
```

---

## Example 6: Octal Literals

```javascript
// NON-STRICT: 0-prefixed numbers are octal
var x = 0755;
console.log(x);  // 493 (octal to decimal)


// STRICT: Octal literals are forbidden
'use strict';
var x = 0755;  // SyntaxError: Octal literals are not allowed

// Use 0o prefix for octal in strict mode (ES6)
var y = 0o755;  // 493 (explicit octal)
```

---

## Example 7: The `with` Statement

```javascript
// NON-STRICT: with is allowed (but confusing!)
var obj = { a: 1, b: 2 };
with (obj) {
  console.log(a);  // 1
  console.log(b);  // 2
}


// STRICT: with is forbidden
'use strict';
with (obj) {  // SyntaxError: Strict mode code may not include a with statement
  console.log(a);
}
```

### Why `with` is Bad

```javascript
var obj = { a: 1 };

with (obj) {
  a = 10;  // obj.a or global a? Depends on obj!
  b = 20;  // Creates global b (accident!)
}
```

> `with` makes it impossible to know which variable you're accessing.

---

## Example 8: eval in Strict Mode

```javascript
// NON-STRICT: eval can create variables in surrounding scope
eval('var x = 10');
console.log(x);  // 10 (leaked into outer scope!)


// STRICT: eval has its own scope
'use strict';
eval('var x = 10');
console.log(x);  // ReferenceError: x is not defined
```

---

## Example 9: Reserved Words

```javascript
// STRICT: More reserved words
'use strict';

var implements = 1;  // SyntaxError
var interface = 2;   // SyntaxError
var package = 3;     // SyntaxError
var private = 4;     // SyntaxError
var protected = 5;   // SyntaxError
var public = 6;      // SyntaxError
var static = 7;      // SyntaxError
var yield = 8;       // SyntaxError
```

### Reserved for Future Use

| Keywords |
|----------|
| `implements`, `interface`, `let`, `package` |
| `private`, `protected`, `public`, `static`, `yield` |

---

## Example 10: Preventing Constructor Without `new`

```javascript
function Person(name) {
  'use strict';
  this.name = name;  // TypeError if called without new!
}

// Non-strict: this = global, pollutes global
// Strict: this = undefined, throws error

Person('John');  // TypeError: Cannot set property 'name' of undefined
new Person('John');  // Works correctly
```

---

## Strict Mode with `call`, `apply`, `bind`

```javascript
'use strict';

function showThis() {
  console.log(this);
}

// In non-strict: null/undefined → global object
// In strict: null/undefined → stays null/undefined

showThis.call(null);       // null (not global!)
showThis.call(undefined);  // undefined (not global!)
showThis.call(42);         // 42 (not Number object!)
```

### Primitive Coercion

| Mode | `this` passed | `this` received |
|------|---------------|-----------------|
| Non-strict | `null` | global object |
| Non-strict | `42` | `Number(42)` object |
| **Strict** | `null` | `null` |
| **Strict** | `42` | `42` (primitive) |

---

## When to Use Strict Mode

### Always Use Strict Mode ✅

| Context | How |
|---------|-----|
| New projects | Add `'use strict';` at top |
| ES6 modules | Automatic |
| Classes | Automatic (inside class body) |
| Node.js | `--use-strict` flag or per-file |

### Be Careful With

| Context | Concern |
|---------|---------|
| Legacy codebases | May break existing code |
| Third-party scripts | Don't apply to them |
| Concatenated files | May affect non-strict code |

---

## Summary Table

| What Strict Mode Does | Example |
|----------------------|---------|
| Prevents accidental globals | `x = 10` → ReferenceError |
| Makes `this` undefined in functions | `function() { this }` → undefined |
| Throws on read-only assignment | `obj.readOnly = x` → TypeError |
| Throws on invalid delete | `delete x` → SyntaxError |
| Forbids duplicate params | `function(a, a)` → SyntaxError |
| Forbids octal literals | `0755` → SyntaxError |
| Forbids `with` | `with(obj)` → SyntaxError |
| Isolates eval | `eval('var x')` → own scope |

### Benefits of Strict Mode

| Benefit | Explanation |
|---------|-------------|
| **Catches bugs** | Turns silent errors into thrown errors |
| **Prevents globals** | Typos don't create global variables |
| **Safer this** | Undefined instead of global object |
| **Optimization** | JS engines can optimize strict code better |
| **Future-proof** | Reserved words prevent conflicts |

---

## Interview Answer

> "Strict mode is a restricted variant of JavaScript enabled by adding `'use strict';` at the top of a file or function. ES6 modules and classes are strict by default.
>
> Key changes in strict mode:
>
> 1. **Undeclared variables throw ReferenceError** instead of creating globals - this catches typos immediately
>
> 2. **`this` is undefined in standalone function calls** instead of the global object - this makes the behavior more predictable and catches bugs where you forget to bind `this`
>
> 3. **Silent failures become errors** - assigning to read-only properties, deleting undeletable properties, duplicate parameters all throw errors
>
> 4. **eval has its own scope** - variables declared in eval don't leak into surrounding code
>
> I always use strict mode in new code because it catches bugs early and enables better engine optimization."

---

## Run Example

```bash
node concepts/01-execution-context/29-strict-mode.js
```
