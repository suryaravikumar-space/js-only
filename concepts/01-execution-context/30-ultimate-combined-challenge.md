# Concept 30: Ultimate Combined Challenge

## The Ultimate Execution Context Test

This challenge combines **ALL concepts** from the Execution Context module:
- `this` binding rules
- call, apply, bind
- Arrow functions
- Hoisting (var, let, function)
- Strict mode
- TDZ
- Closures (preview)

---

## Challenge 1: The this Gauntlet

```javascript
var name = 'Global';

var obj = {
  name: 'Object',

  regular: function() {
    console.log('A:', this.name);
  },

  arrow: () => {
    console.log('B:', this.name);
  },

  nested: {
    name: 'Nested',

    getNameRegular: function() {
      console.log('C:', this.name);
    },

    getNameArrow: () => {
      console.log('D:', this.name);
    }
  },

  delayed: function() {
    setTimeout(function() {
      console.log('E:', this.name);
    }, 0);

    setTimeout(() => {
      console.log('F:', this.name);
    }, 0);
  }
};

obj.regular();
obj.arrow();
obj.nested.getNameRegular();
obj.nested.getNameArrow();
obj.delayed();
```

### Answers

| Log | Value | Explanation |
|-----|-------|-------------|
| A | `'Object'` | Method call → `this` = `obj` |
| B | `undefined` (Node) / `'Global'` (Browser) | Arrow in object literal → `this` = global |
| C | `'Nested'` | Method call → `this` = `nested` |
| D | `undefined` / `'Global'` | Arrow in object literal → `this` = global |
| E | `undefined` / `'Global'` | Callback → standalone call → `this` = global |
| F | `'Object'` | Arrow in method → inherits `obj` from `delayed` |

---

## Challenge 2: call/apply/bind Chaos

```javascript
var person = {
  name: 'Alice',
  greet: function(greeting, punctuation) {
    return greeting + ', ' + this.name + punctuation;
  }
};

var bob = { name: 'Bob' };

console.log('A:', person.greet('Hello', '!'));
console.log('B:', person.greet.call(bob, 'Hi', '...'));
console.log('C:', person.greet.apply(bob, ['Hey', '?']));

var boundGreet = person.greet.bind(bob, 'Yo');
console.log('D:', boundGreet('!!!'));
console.log('E:', boundGreet.call(person, '???'));

var doubleBound = boundGreet.bind(person, 'Nope');
console.log('F:', doubleBound('###'));
```

### Answers

| Log | Value | Explanation |
|-----|-------|-------------|
| A | `'Hello, Alice!'` | Normal method call |
| B | `'Hi, Bob...'` | call() sets `this` = bob |
| C | `'Hey, Bob?'` | apply() sets `this` = bob |
| D | `'Yo, Bob!!!'` | bind() locked `this` to bob, pre-filled 'Yo' |
| E | `'Yo, Bob???'` | call() CANNOT override bind()! |
| F | `'Yo, Bob###'` | Second bind() CANNOT override first bind()! |

---

## Challenge 3: Hoisting Havoc

```javascript
console.log('A:', x);
console.log('B:', typeof y);
// console.log('C:', z);  // Uncomment = ReferenceError

var x = 10;
let y = 20;
const z = 30;

console.log('D:', x);
console.log('E:', y);
console.log('F:', z);

foo();
// bar();  // Uncomment = TypeError

function foo() {
  console.log('G: foo function declaration');
}

var bar = function() {
  console.log('H: bar function expression');
};

bar();
```

### Answers

| Log | Value | Explanation |
|-----|-------|-------------|
| A | `undefined` | `var x` hoisted, initialized to undefined |
| B | `'undefined'` | `typeof` on TDZ variable... wait, this is a trick! |
| C | ReferenceError | `const z` in TDZ |
| D | `10` | After declaration |
| E | `20` | After declaration |
| F | `30` | After declaration |
| G | `'foo function declaration'` | Function declaration hoisted completely |
| bar() before | TypeError | `var bar` hoisted as undefined, can't call undefined() |
| H | `'H: bar function expression'` | After assignment |

**Wait!** Line B is tricky:
- If `y` were undeclared: `typeof y` = `'undefined'`
- But `y` IS declared with `let`, so it's in TDZ
- `typeof` on TDZ variable = **ReferenceError!**

The code would actually crash at line B!

---

## Challenge 4: The new Keyword Test

```javascript
function Person(name) {
  this.name = name;
  console.log('A:', this);
}

var p1 = Person('John');
console.log('B:', p1);
console.log('C:', name);

var p2 = new Person('Jane');
console.log('D:', p2);

var BoundPerson = Person.bind({ name: 'Bound' });
var p3 = new BoundPerson('Override');
console.log('E:', p3.name);
```

### Answers

| Log | Value | Explanation |
|-----|-------|-------------|
| A (first) | global object | Without `new` → `this` = global |
| B | `undefined` | No return, so p1 = undefined |
| C | `'John'` | `this.name = 'John'` polluted global! |
| A (second) | `Person { name: 'Jane' }` | With `new` → `this` = new object |
| D | `Person { name: 'Jane' }` | Correct constructor usage |
| E | `'Override'` | `new` overrides bind()! |

---

## Challenge 5: Arrow Functions Deep Dive

```javascript
var name = 'Global';

var outer = {
  name: 'Outer',

  getArrowInMethod: function() {
    var arrow = () => {
      console.log('A:', this.name);
    };
    return arrow;
  },

  getArrowDirect: () => {
    console.log('B:', this.name);
  },

  getNestedArrows: function() {
    var arrow1 = () => {
      var arrow2 = () => {
        console.log('C:', this.name);
      };
      return arrow2;
    };
    return arrow1;
  }
};

var arrowFromMethod = outer.getArrowInMethod();
arrowFromMethod();

outer.getArrowDirect();

var nestedArrow = outer.getNestedArrows()();
nestedArrow();

var detachedMethod = outer.getArrowInMethod;
var arrowFromDetached = detachedMethod();
arrowFromDetached();
```

### Answers

| Log | Value | Explanation |
|-----|-------|-------------|
| A | `'Outer'` | Arrow inside method inherits `this` from `getArrowInMethod` |
| B | `undefined` / `'Global'` | Arrow on object literal → `this` = global |
| C | `'Outer'` | Nested arrows all inherit from `getNestedArrows` |
| D | `undefined` / `'Global'` | `detachedMethod()` is standalone → `this` = global, arrow inherits that |

---

## Challenge 6: Mixed Modes

```javascript
function outer() {
  console.log('A:', this);

  function inner() {
    console.log('B:', this);
  }

  var arrowInner = () => {
    console.log('C:', this);
  };

  inner();
  arrowInner();
}

outer();
outer.call({ name: 'Custom' });

// Strict mode version
function outerStrict() {
  'use strict';
  console.log('D:', this);

  function innerStrict() {
    console.log('E:', this);
  }

  innerStrict();
}

outerStrict();
outerStrict.call({ name: 'Custom' });
```

### Answers

| Call | Log | Value | Explanation |
|------|-----|-------|-------------|
| `outer()` | A | global | Standalone call, non-strict |
| `outer()` | B | global | Nested function, standalone, non-strict |
| `outer()` | C | global | Arrow inherits from outer |
| `outer.call({...})` | A | `{ name: 'Custom' }` | call() sets this |
| `outer.call({...})` | B | global | Inner is still standalone |
| `outer.call({...})` | C | `{ name: 'Custom' }` | Arrow inherits custom this |
| `outerStrict()` | D | `undefined` | Standalone, strict mode |
| `outerStrict()` | E | `undefined` | Nested standalone, strict mode |
| `outerStrict.call({...})` | D | `{ name: 'Custom' }` | call() still works |
| `outerStrict.call({...})` | E | `undefined` | Inner is still standalone |

---

## Challenge 7: Method Borrowing Master

```javascript
var logger = {
  prefix: '[LOG]',
  log: function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.prefix);
    console.log.apply(console, args);
  }
};

var errorLogger = { prefix: '[ERROR]' };
var warnLogger = { prefix: '[WARN]' };

logger.log('System', 'ready');
logger.log.call(errorLogger, 'File', 'not', 'found');
logger.log.apply(warnLogger, ['Low', 'memory']);

var boundError = logger.log.bind(errorLogger);
boundError('Connection', 'failed');
boundError.call(warnLogger, 'Override', 'attempt');
```

### Answers

| Output |
|--------|
| `[LOG] System ready` |
| `[ERROR] File not found` |
| `[WARN] Low memory` |
| `[ERROR] Connection failed` |
| `[ERROR] Override attempt` (bind cannot be overridden!) |

---

## Summary: All `this` Rules in One Table

| Rule | Priority | Example | `this` = |
|------|----------|---------|----------|
| 1. `new` | Highest | `new Func()` | New object |
| 2. Explicit bind | High | `func.bind(obj)()` | obj (permanent) |
| 3. Explicit call/apply | High | `func.call(obj)` | obj |
| 4. Method call | Medium | `obj.method()` | obj |
| 5. Arrow function | Lexical | `() => {}` | Inherited from parent |
| 6. Standalone (strict) | Low | `func()` | undefined |
| 7. Standalone (non-strict) | Lowest | `func()` | global |

---

## Execution Context Checklist

Before determining `this`, ask yourself:

```
1. Is it an arrow function?
   YES → this = parent scope's this (at definition time)
   NO  → continue

2. Is it called with new?
   YES → this = new empty object
   NO  → continue

3. Is it called with call/apply/bind?
   YES → this = first argument (bind is permanent)
   NO  → continue

4. Is it called as a method (obj.func)?
   YES → this = object before the dot
   NO  → continue

5. Standalone call
   STRICT → this = undefined
   NON-STRICT → this = global object
```

---

## Interview Answer (Comprehensive)

> "JavaScript's execution context determines the value of `this`. The rules in order of precedence are:
>
> 1. **Arrow functions** - lexically bound, inherit `this` from where they're defined, cannot be changed
>
> 2. **new keyword** - creates a new object and binds `this` to it, can even override bind()
>
> 3. **Explicit binding (call/apply/bind)** - bind() is permanent, call/apply are one-time
>
> 4. **Method call** - `this` is the object immediately before the dot
>
> 5. **Standalone call** - `this` is undefined (strict) or global (non-strict)
>
> Common pitfalls include: losing `this` in callbacks (use bind or arrow functions), arrow functions as methods (they inherit global `this`), and forgetting `new` (pollutes global scope).
>
> Hoisting affects `var` (initialized to undefined) and function declarations (fully hoisted), while `let`/`const` have a Temporal Dead Zone. Strict mode makes `this` undefined in standalone calls and throws errors for common mistakes."

---

## Run Example

```bash
node concepts/01-execution-context/30-ultimate-combined-challenge.js
```
