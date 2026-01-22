# Challenge 10: Ultimate Closure Challenge

## The Final Test

```
This challenge combines ALL closure concepts:
- Basic closure memory
- Loop closure problem
- Private variables
- Closure with this
- Callbacks and timing
```

## The Challenge

```javascript
function createTracker(name) {
  var count = 0;
  var history = [];

  return {
    name: name,

    track: function(event) {
      count++;
      history.push({ event: event, count: count });
      return this.name + ': ' + event + ' (#' + count + ')';
    },

    getHistory: function() {
      return history.slice();
    },

    createLogger: function() {
      var self = this;
      return function(msg) {
        return self.track('LOG: ' + msg);
      };
    }
  };
}

var tracker1 = createTracker('App');
var tracker2 = createTracker('DB');

console.log('A:', tracker1.track('start'));
console.log('B:', tracker1.track('process'));
console.log('C:', tracker2.track('connect'));

var logger = tracker1.createLogger();
console.log('D:', logger('user logged in'));

console.log('E:', tracker1.getHistory().length);
console.log('F:', tracker2.getHistory().length);

var trackMethod = tracker1.track;
try {
  console.log('G:', trackMethod('test'));
} catch(e) {
  console.log('G:', 'Error');
}
```

**What prints for A, B, C, D, E, F, G?**

---

## Concepts Tested

| Line | Concept Being Tested |
|------|---------------------|
| A, B | Basic closure (count persists) |
| C | Independent instances (tracker2 has own count) |
| D | Nested closure + var self = this |
| E, F | Private state isolation |
| G | Losing this when extracting method |

## Why Each Answer

```
A: tracker1.track('start')
   - this = tracker1, name = 'App'
   - count becomes 1
   - "App: start (#1)"

B: tracker1.track('process')
   - count is still in closure, becomes 2
   - "App: process (#2)"

C: tracker2.track('connect')
   - tracker2 has SEPARATE closure
   - Its own count = 1
   - "DB: connect (#1)"

D: logger('user logged in')
   - logger has closure over self = tracker1
   - Calls tracker1.track('LOG: user logged in')
   - count becomes 3
   - "App: LOG: user logged in (#3)"

E: tracker1.getHistory().length
   - History has 3 entries now
   - 3

F: tracker2.getHistory().length
   - tracker2's history has only 1 entry
   - 1

G: trackMethod('test')
   - trackMethod = tracker1.track (extracted)
   - trackMethod('test') is standalone call
   - this = global, global.name = undefined
   - "undefined: test (#4)" OR Error if strict mode
```

## The Complete Mental Model

```
┌─ createTracker('App') ────────────────────────────────┐
│                                                       │
│  var count = 0    ──────────────────┐                │
│  var history = [] ──────────────────┤                │
│                                     │                │
│  ┌─ returned object ───────────────┐│                │
│  │                                 ││                │
│  │  name: 'App'                    ││                │
│  │  track() ───────────────────────┼┼► count, history│
│  │  getHistory() ──────────────────┼┘                │
│  │  createLogger() ──────────────┐ │                 │
│  │                               │ │                 │
│  │    ┌─ returned logger ──────┐ │ │                 │
│  │    │ Closure: self=tracker1 │ │ │                 │
│  │    │ Calls self.track()     │◄┘ │                 │
│  │    └────────────────────────┘   │                 │
│  └─────────────────────────────────┘                 │
└───────────────────────────────────────────────────────┘
```
