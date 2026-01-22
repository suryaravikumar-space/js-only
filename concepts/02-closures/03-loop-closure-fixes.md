# Challenge 03: Loop Closure Fixes

## The Golden Rule

```
To fix the loop closure problem:
1. Use let (creates new binding each iteration)
2. Use IIFE (captures current value)
3. Use forEach (creates new scope per callback)
```

## The Challenge

```javascript
// Fix 1: IIFE
function createWithIIFE() {
  var result = [];
  for (var i = 0; i < 3; i++) {
    (function(j) {
      result.push(function() { return j; });
    })(i);
  }
  return result;
}

// Fix 2: let
function createWithLet() {
  var result = [];
  for (let i = 0; i < 3; i++) {
    result.push(function() { return i; });
  }
  return result;
}

var iifeFuncs = createWithIIFE();
var letFuncs = createWithLet();

console.log('A:', iifeFuncs[0](), iifeFuncs[1](), iifeFuncs[2]());
console.log('B:', letFuncs[0](), letFuncs[1](), letFuncs[2]());
```

**What prints for A and B?**

---

## How Each Fix Works

| Fix | How It Works |
|-----|--------------|
| IIFE | Creates new scope, `j` is a copy of current `i` |
| let | Creates new `i` binding for each iteration |
| forEach | Callback gets fresh scope each iteration |

## IIFE Visual

```
Iteration 0: (function(j=0) { ... })()  → j=0 captured
Iteration 1: (function(j=1) { ... })()  → j=1 captured
Iteration 2: (function(j=2) { ... })()  → j=2 captured

Each IIFE creates its own j variable!
```

## let Visual

```
for (let i = 0; ...) creates:

┌─ Iteration 0 scope ─┐  ┌─ Iteration 1 scope ─┐  ┌─ Iteration 2 scope ─┐
│  let i = 0          │  │  let i = 1          │  │  let i = 2          │
│  function → i       │  │  function → i       │  │  function → i       │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘

Three separate i variables!
```

## Modern Best Practice

```javascript
// Just use let - it's designed for this!
for (let i = 0; i < 3; i++) {
  // Each iteration gets its own i
}
```
