# Challenge 01: Closure Scope Chain

## The Golden Rule

```
Closures can access variables from ALL outer scopes, not just
the immediate parent. They traverse the entire scope chain.
```

## The Challenge

```javascript
var global = 'G';

function outer() {
  var outerVar = 'O';

  function middle() {
    var middleVar = 'M';

    function inner() {
      var innerVar = 'I';
      return global + outerVar + middleVar + innerVar;
    }

    return inner;
  }

  return middle;
}

var getMiddle = outer();
var getInner = getMiddle();

console.log('A:', getInner());

var outerVar = 'GLOBAL-O';
console.log('B:', getInner());
```

**What prints for A and B?**

---

## Key Concepts

| Scope Level | Variables Accessible |
|-------------|---------------------|
| inner | innerVar + middleVar + outerVar + global |
| middle | middleVar + outerVar + global |
| outer | outerVar + global |
| global | global |

## The Scope Chain

```
inner() looks for a variable:
  1. Check inner's local scope
  2. Check middle's scope (closure)
  3. Check outer's scope (closure)
  4. Check global scope
  5. ReferenceError if not found
```

## Critical Insight

```
The closure captures the ORIGINAL outerVar from outer()
NOT any later global variable with the same name!

Lexical scope = where the function was WRITTEN
Not where it's called from
```
