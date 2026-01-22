# Challenge 00: What is a Closure?

## The Golden Rule

```
A CLOSURE is a function that REMEMBERS the variables from its
lexical scope even when executed OUTSIDE that scope.
```

## The Challenge

```javascript
function outer() {
  var secret = 'I am hidden';

  function inner() {
    return secret;
  }

  return inner;
}

var getSecret = outer();

console.log('A:', getSecret());
console.log('B:', typeof secret);
```

**What prints for A and B?**

---

## Key Concepts

| Term | Definition |
|------|------------|
| Lexical Scope | Where a function is WRITTEN determines what variables it can access |
| Closure | Function + its lexical environment (the variables it closed over) |
| Closed Over | Variables that a function "remembers" from outer scope |

## Why This Matters

```
Without closures:
- outer() finishes
- secret should be garbage collected
- inner() shouldn't be able to access secret

With closures:
- inner() keeps a REFERENCE to secret
- secret survives as long as inner() exists
- This is THE foundation of JavaScript patterns
```

## Common Misconception

```
WRONG: "Closures copy the values"
RIGHT: "Closures keep a REFERENCE to the variables"

This distinction is CRITICAL for understanding loops!
```
