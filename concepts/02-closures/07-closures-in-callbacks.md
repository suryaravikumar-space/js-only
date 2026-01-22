# Challenge 07: Closures in Callbacks

## The Golden Rule

```
Callbacks execute LATER but still access their closure variables.
The closure "freezes" access to the scope, not the values!
```

## The Challenge

```javascript
function setupDelayedLogs() {
  for (var i = 1; i <= 3; i++) {
    setTimeout(function() {
      console.log('var:', i);
    }, i * 100);
  }

  for (let j = 1; j <= 3; j++) {
    setTimeout(function() {
      console.log('let:', j);
    }, j * 100 + 500);
  }
}

setupDelayedLogs();

// What prints and in what order?
// (Assume A, B, C, D, E, F for the 6 outputs)
```

**What are the 6 outputs in order?**

---

## Key Concepts

| Loop Type | Closure Behavior | Result |
|-----------|------------------|--------|
| var loop | All callbacks share ONE i | All print 4 |
| let loop | Each callback has OWN j | Prints 1, 2, 3 |

## Timeline

```
Time 0ms:    Loop runs, schedules all timeouts
             var i = 4 (after loop)

Time 100ms:  First var callback runs → prints 4
Time 200ms:  Second var callback runs → prints 4
Time 300ms:  Third var callback runs → prints 4

Time 600ms:  First let callback runs → prints 1
Time 700ms:  Second let callback runs → prints 2
Time 800ms:  Third let callback runs → prints 3
```

## Visual: var vs let in Async

```
VAR:
┌─────────────────────────────────────────┐
│  var i = 4 (final value)               │
│                                         │
│  callback 1 ────┐                       │
│  callback 2 ────┼──► all see i = 4     │
│  callback 3 ────┘                       │
└─────────────────────────────────────────┘

LET:
┌─ Iteration 1 ─┐  ┌─ Iteration 2 ─┐  ┌─ Iteration 3 ─┐
│  let j = 1    │  │  let j = 2    │  │  let j = 3    │
│  callback ────┼  │  callback ────┼  │  callback ────┼
│  sees j = 1   │  │  sees j = 2   │  │  sees j = 3   │
└───────────────┘  └───────────────┘  └───────────────┘
```

## Common Async Patterns

```javascript
// Event listeners
buttons.forEach(function(btn, index) {
  btn.onclick = function() {
    console.log('Button', index, 'clicked');
    // index is captured per iteration
  };
});

// API calls in loop
urls.forEach(function(url, i) {
  fetch(url).then(function(response) {
    console.log('Response', i, 'received');
    // i is captured correctly
  });
});
```
