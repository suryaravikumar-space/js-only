# Challenge 06: Partial Application & Currying

## The Golden Rule

```
Partial Application: Fix some arguments, return function for the rest.
Currying: Transform f(a,b,c) into f(a)(b)(c).
Both rely on closures to "remember" the fixed arguments.
```

## The Challenge

```javascript
// Partial Application
function multiply(a, b) {
  return a * b;
}

function partial(fn, a) {
  return function(b) {
    return fn(a, b);
  };
}

var double = partial(multiply, 2);
var triple = partial(multiply, 3);

console.log('A:', double(5));
console.log('B:', triple(5));

// Currying
function curry(fn) {
  return function(a) {
    return function(b) {
      return fn(a, b);
    };
  };
}

var curriedMultiply = curry(multiply);
console.log('C:', curriedMultiply(4)(5));

var multiplyBy10 = curriedMultiply(10);
console.log('D:', multiplyBy10(7));
console.log('E:', multiplyBy10(3));
```

**What prints for A, B, C, D, E?**

---

## Key Concepts

| Pattern | What It Does | Example |
|---------|--------------|---------|
| Partial Application | Pre-fill SOME arguments | double = multiply.bind(null, 2) |
| Currying | Transform to single-arg chain | add(1,2) → add(1)(2) |

## How Closure Enables This

```javascript
function partial(fn, a) {
  // 'a' is captured in closure
  return function(b) {
    // When called later, 'a' is still accessible!
    return fn(a, b);
  };
}

var double = partial(multiply, 2);
// double has closure over: fn=multiply, a=2

double(5);
// Looks up a from closure (2)
// Calls multiply(2, 5)
// Returns 10
```

## Real World Examples

```javascript
// API calls with fixed base URL
var apiCall = partial(fetch, 'https://api.example.com');
apiCall('/users');   // fetch('https://api.example.com', '/users')

// Event handlers with context
var handleClick = partial(logEvent, 'click');
button.onclick = handleClick;

// Configuration
var log = partial(console.log, '[DEBUG]');
log('message');  // [DEBUG] message
```

## Curry vs Partial

```
Partial: multiply(2, _) → doubl(b)
         Fix first arg, call with second

Curry:   multiply(a, b) → multiply(a)(b)
         Transform ALL args to chain of single-arg functions
```
