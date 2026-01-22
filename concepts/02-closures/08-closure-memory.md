# Challenge 08: Closure Memory & References

## The Golden Rule

```
Closures keep references to outer variables ALIVE.
The entire scope is retained, even unused variables!
This can cause memory leaks if not careful.
```

## The Challenge

```javascript
function createHeavyObject() {
  var heavyData = new Array(1000000).fill('data');
  var id = Math.random();

  return {
    getId: function() {
      return id;
    }
    // Note: heavyData is NOT used in returned object
  };
}

var obj1 = createHeavyObject();
console.log('A:', obj1.getId() > 0);

// Question: Is heavyData garbage collected?
console.log('B:', 'heavyData retained?');

function createOptimized() {
  var heavyData = new Array(1000000).fill('data');
  var id = Math.random();
  var length = heavyData.length; // Extract what we need

  heavyData = null; // Allow GC

  return {
    getId: function() { return id; },
    getLength: function() { return length; }
  };
}

var obj2 = createOptimized();
console.log('C:', obj2.getLength());
```

**For A, B, C - what's the output and memory behavior?**

---

## Key Concepts

| Scenario | Memory Impact |
|----------|---------------|
| Closure uses all variables | All retained (expected) |
| Closure uses some variables | ENTIRE scope often retained |
| Manually null unused | Allows garbage collection |

## Memory Leak Example

```javascript
// LEAK: heavyData kept alive unnecessarily
function createLeak() {
  var heavyData = loadHugeFile();  // 100MB

  return function() {
    return 'Hello';  // Doesn't use heavyData!
  };
  // But heavyData might still be retained in closure
}

// FIXED: Explicitly release
function createFixed() {
  var heavyData = loadHugeFile();
  var result = process(heavyData);

  heavyData = null;  // Release reference

  return function() {
    return result;
  };
}
```

## Modern Engine Optimization

```
Modern JS engines (V8, SpiderMonkey) are SMART:
- They analyze which variables the closure actually uses
- Unused variables MAY be garbage collected
- But this is NOT guaranteed!

Best Practice: Don't rely on engine optimization
              Explicitly null references you don't need
```

## Common Memory Leak Patterns

```javascript
// 1. Event listeners not removed
function setup() {
  var data = loadBigData();
  element.addEventListener('click', function() {
    console.log(data.length);
  });
  // data lives as long as listener exists!
}

// Fix: Remove listener when done
function setupFixed() {
  var data = loadBigData();
  function handler() {
    console.log(data.length);
  }
  element.addEventListener('click', handler);

  // Later:
  element.removeEventListener('click', handler);
}

// 2. Timers holding references
function startTimer() {
  var bigData = loadBigData();
  setInterval(function() {
    console.log(bigData[0]);
  }, 1000);
  // bigData lives FOREVER (until clearInterval)
}
```
