# Challenge 02: The Loop Closure Problem

## The Golden Rule

```
Closures capture REFERENCES to variables, not VALUES.
In a loop with var, all closures share the SAME variable!
```

## The Challenge

```javascript
function createFunctions() {
  var result = [];

  for (var i = 0; i < 3; i++) {
    result.push(function() {
      return i;
    });
  }

  return result;
}

var funcs = createFunctions();

console.log('A:', funcs[0]());
console.log('B:', funcs[1]());
console.log('C:', funcs[2]());
```

**What prints for A, B, C?**

---

## Key Concepts

| What You Expect | What Actually Happens |
|-----------------|----------------------|
| funcs[0]() → 0 | funcs[0]() → 3 |
| funcs[1]() → 1 | funcs[1]() → 3 |
| funcs[2]() → 2 | funcs[2]() → 3 |

## Why This Happens

```
Timeline:
1. i = 0: Create function that returns i (not 0!)
2. i = 1: Create function that returns i (not 1!)
3. i = 2: Create function that returns i (not 2!)
4. i = 3: Loop ends (i < 3 is false)
5. Call funcs[0]() → looks up i → finds 3

All three functions share the SAME i variable!
```

## Visual

```
┌─────────────────────────────────────────┐
│  createFunctions scope                   │
│                                         │
│  var i; ─────────────────┐              │
│                          │              │
│  funcs[0] ───────────────┼───► i        │
│  funcs[1] ───────────────┼───► i        │
│  funcs[2] ───────────────┘              │
│                                         │
│  After loop: i = 3                      │
│  All functions return 3!                │
└─────────────────────────────────────────┘
```

## This is THE Most Common Closure Bug!
