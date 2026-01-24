/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNCTIONAL PROGRAMMING - FILE 8: INTERVIEW Q&A
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Comprehensive interview questions and answers covering all functional
 * programming concepts. 50+ questions from basic to advanced.
 */

console.log("═══════════════════════════════════════════════════════════════════");
console.log("       FUNCTIONAL PROGRAMMING - INTERVIEW Q&A (50+ Questions)      ");
console.log("═══════════════════════════════════════════════════════════════════\n");

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    SECTION 1: FP FUNDAMENTALS                              ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("═══════════════════════════════════════════════════════════════════");
console.log("              SECTION 1: FP FUNDAMENTALS (10 Questions)            ");
console.log("═══════════════════════════════════════════════════════════════════\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q1: What is functional programming?                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Functional programming is a programming paradigm that:                   │
│                                                                              │
│    • Treats computation as evaluation of mathematical functions             │
│    • Avoids changing state and mutable data                                 │
│    • Emphasizes declarative over imperative code                            │
│    • Uses pure functions as building blocks                                 │
│    • Relies on function composition                                         │
│                                                                              │
│    Core principles:                                                          │
│    1. Pure functions (no side effects)                                      │
│    2. Immutability (never mutate data)                                      │
│    3. First-class functions (functions as values)                           │
│    4. Higher-order functions (functions that use functions)                 │
│    5. Declarative style (what, not how)                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q2: What is a pure function?                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A pure function has two properties:                                      │
│                                                                              │
│    1. DETERMINISTIC                                                         │
│       Same inputs ALWAYS produce same outputs                               │
│                                                                              │
│    2. NO SIDE EFFECTS                                                        │
│       • Doesn't modify external state                                       │
│       • Doesn't mutate input arguments                                      │
│       • Doesn't perform I/O                                                 │
│                                                                              │
│    // Pure                                                                  │
│    const add = (a, b) => a + b;                                             │
│                                                                              │
│    // Impure - modifies external state                                      │
│    let counter = 0;                                                         │
│    const increment = () => ++counter;                                       │
│                                                                              │
│    // Impure - performs I/O                                                 │
│    const log = x => { console.log(x); return x; };                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q3: What are the benefits of pure functions?                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: 1. TESTABLE                                                              │
│       No mocking needed, just test input → output                           │
│                                                                              │
│    2. CACHEABLE (Memoization)                                               │
│       Same input = same output, can cache safely                            │
│                                                                              │
│    3. PARALLELIZABLE                                                        │
│       No shared state = no race conditions                                  │
│                                                                              │
│    4. PREDICTABLE                                                           │
│       Output depends only on input, easier to reason about                  │
│                                                                              │
│    5. REUSABLE                                                              │
│       No hidden dependencies, can use anywhere                              │
│                                                                              │
│    6. REFERENTIALLY TRANSPARENT                                              │
│       Can replace function call with its result                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q4: What is immutability and why is it important?                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Immutability means data cannot be changed after creation.                │
│                                                                              │
│    // Mutable (bad)                                                         │
│    const arr = [1, 2, 3];                                                   │
│    arr.push(4);  // Mutates original                                        │
│                                                                              │
│    // Immutable (good)                                                      │
│    const arr = [1, 2, 3];                                                   │
│    const newArr = [...arr, 4];  // Creates new array                        │
│                                                                              │
│    Benefits:                                                                 │
│    • No unexpected mutations from other code                                │
│    • Enables safe memoization                                               │
│    • Simplifies debugging (data history)                                    │
│    • Enables undo/redo (time-travel debugging)                              │
│    • Thread-safe by default                                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q5: What is a higher-order function (HOF)?                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A function that either:                                                  │
│    1. Takes one or more functions as arguments, OR                          │
│    2. Returns a function as its result                                      │
│                                                                              │
│    // Takes function as argument                                            │
│    const map = (fn, arr) => arr.map(fn);                                    │
│                                                                              │
│    // Returns function                                                      │
│    const multiply = a => b => a * b;                                        │
│    const double = multiply(2);                                              │
│                                                                              │
│    Built-in HOFs: map, filter, reduce, forEach, sort, find                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q6: What is first-class function?                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Functions are "first-class citizens" when they can be:                   │
│                                                                              │
│    • Assigned to variables                                                  │
│      const greet = function(name) { return \`Hello, \${name}\`; };          │
│                                                                              │
│    • Passed as arguments                                                    │
│      arr.map(x => x * 2);                                                   │
│                                                                              │
│    • Returned from functions                                                │
│      const createAdder = n => x => n + x;                                   │
│                                                                              │
│    • Stored in data structures                                              │
│      const ops = { add: (a, b) => a + b, sub: (a, b) => a - b };           │
│                                                                              │
│    JavaScript functions are first-class!                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q7: What is a closure?                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A closure is when a function "remembers" variables from its outer       │
│    scope even after the outer function has returned.                        │
│                                                                              │
│    function createCounter() {                                               │
│      let count = 0;  // Private via closure                                │
│      return {                                                               │
│        increment() { return ++count; },                                     │
│        getCount() { return count; }                                         │
│      };                                                                      │
│    }                                                                         │
│                                                                              │
│    const counter = createCounter();                                         │
│    counter.increment(); // 1                                                │
│    counter.increment(); // 2                                                │
│    // 'count' is still accessible inside increment                          │
│                                                                              │
│    Closures enable: data privacy, function factories, currying              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q8: What is referential transparency?                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: An expression is referentially transparent if it can be replaced        │
│    with its value without changing program behavior.                        │
│                                                                              │
│    // Referentially transparent                                             │
│    add(2, 3) can always be replaced with 5                                  │
│                                                                              │
│    // NOT referentially transparent                                         │
│    Math.random()  // Different value each time                              │
│    Date.now()     // Changes with time                                      │
│    readFile()     // Depends on external state                              │
│                                                                              │
│    Pure functions are always referentially transparent.                     │
│    This enables optimizations like common subexpression elimination.        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q9: What is declarative vs imperative programming?                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: IMPERATIVE: Describes HOW to do something (step by step)                │
│    DECLARATIVE: Describes WHAT you want (the result)                       │
│                                                                              │
│    // Imperative                                                            │
│    const doubled = [];                                                      │
│    for (let i = 0; i < numbers.length; i++) {                               │
│      doubled.push(numbers[i] * 2);                                          │
│    }                                                                         │
│                                                                              │
│    // Declarative                                                           │
│    const doubled = numbers.map(n => n * 2);                                 │
│                                                                              │
│    FP favors declarative style:                                             │
│    • More readable (intent is clear)                                        │
│    • Less error-prone (no manual loop management)                           │
│    • More composable                                                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q10: What are side effects and how do you handle them in FP?                │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Side effects are any observable change outside the function:            │
│    • Modifying external state                                               │
│    • I/O operations (console, network, files)                               │
│    • DOM manipulation                                                       │
│                                                                              │
│    Handling in FP:                                                          │
│    1. Push to edges of the system                                          │
│       Pure core, impure shell pattern                                       │
│                                                                              │
│    2. Make them explicit                                                    │
│       Use IO monad or similar wrappers                                      │
│                                                                              │
│    3. Separate pure and impure                                              │
│       Pure: data transformation                                             │
│       Impure: I/O, side effects                                             │
│                                                                              │
│    // Pure transformation                                                   │
│    const formatUser = user => \`Name: \${user.name}\`;                       │
│    // Impure I/O at boundary                                                │
│    console.log(formatUser(user));                                           │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    SECTION 2: CURRYING & COMPOSITION                       ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("\n" + "═".repeat(70));
console.log("         SECTION 2: CURRYING & COMPOSITION (10 Questions)         ");
console.log("═══════════════════════════════════════════════════════════════════\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q11: What is currying?                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Currying transforms a function with multiple arguments into a sequence  │
│    of unary (single-argument) functions.                                    │
│                                                                              │
│    // Normal function                                                       │
│    const add = (a, b, c) => a + b + c;                                      │
│    add(1, 2, 3); // 6                                                       │
│                                                                              │
│    // Curried version                                                       │
│    const addCurried = a => b => c => a + b + c;                             │
│    addCurried(1)(2)(3); // 6                                                │
│                                                                              │
│    Benefits:                                                                 │
│    • Partial application                                                    │
│    • Create specialized functions                                           │
│    • Enable point-free style                                                │
│    • Better function composition                                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q12: Implement a curry function.                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: function curry(fn) {                                                     │
│      return function curried(...args) {                                     │
│        if (args.length >= fn.length) {                                      │
│          return fn(...args);                                                │
│        }                                                                     │
│        return (...more) => curried(...args, ...more);                       │
│      };                                                                      │
│    }                                                                         │
│                                                                              │
│    // Usage                                                                 │
│    const add = (a, b, c) => a + b + c;                                      │
│    const curriedAdd = curry(add);                                           │
│                                                                              │
│    curriedAdd(1, 2, 3);    // 6                                             │
│    curriedAdd(1)(2)(3);    // 6                                             │
│    curriedAdd(1, 2)(3);    // 6                                             │
│    curriedAdd(1)(2, 3);    // 6                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q13: What is partial application?                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Partial application fixes some arguments of a function, returning       │
│    a new function that takes the remaining arguments.                       │
│                                                                              │
│    const partial = (fn, ...fixed) => (...rest) => fn(...fixed, ...rest);   │
│                                                                              │
│    const greet = (greeting, name) => \`\${greeting}, \${name}!\`;             │
│    const sayHello = partial(greet, 'Hello');                                │
│    sayHello('World'); // "Hello, World!"                                    │
│                                                                              │
│    Difference from currying:                                                │
│    • Currying: Always returns unary functions                               │
│    • Partial: Can fix any number of arguments                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q14: What is function composition?                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Combining two or more functions to create a new function.               │
│    The output of one function becomes the input of the next.                │
│                                                                              │
│    // Mathematical notation: (f ∘ g)(x) = f(g(x))                           │
│                                                                              │
│    const compose = (f, g) => x => f(g(x));                                  │
│                                                                              │
│    const addOne = x => x + 1;                                               │
│    const double = x => x * 2;                                               │
│                                                                              │
│    const addOneThenDouble = compose(double, addOne);                        │
│    addOneThenDouble(5); // double(addOne(5)) = double(6) = 12               │
│                                                                              │
│    Compose applies RIGHT to LEFT                                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q15: What is pipe and how does it differ from compose?                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Pipe is composition from LEFT to RIGHT (more intuitive reading order).  │
│                                                                              │
│    const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);    │
│    const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);            │
│                                                                              │
│    // Same result, different order                                          │
│    compose(h, g, f)(x) === pipe(f, g, h)(x)                                 │
│                                                                              │
│    // Pipe reads left-to-right                                              │
│    const process = pipe(                                                    │
│      parse,      // First                                                   │
│      validate,   // Second                                                  │
│      transform,  // Third                                                   │
│      save        // Last                                                    │
│    );                                                                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q16: What is point-free style?                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Defining functions without explicitly mentioning their arguments.       │
│                                                                              │
│    // Pointed (explicit argument)                                           │
│    const double = x => multiply(2)(x);                                      │
│                                                                              │
│    // Point-free (no argument)                                              │
│    const double = multiply(2);                                              │
│                                                                              │
│    // Pointed                                                               │
│    const getNames = users => users.map(u => u.name);                        │
│                                                                              │
│    // Point-free                                                            │
│    const getNames = map(prop('name'));                                      │
│                                                                              │
│    Currying enables point-free style by returning configured functions.    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q17: Implement map, filter, and reduce using reduce.                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: // map with reduce                                                       │
│    const map = (fn, arr) =>                                                 │
│      arr.reduce((acc, x) => [...acc, fn(x)], []);                          │
│                                                                              │
│    // filter with reduce                                                    │
│    const filter = (pred, arr) =>                                            │
│      arr.reduce((acc, x) => pred(x) ? [...acc, x] : acc, []);              │
│                                                                              │
│    // reduce IS the most fundamental - can't implement with others         │
│                                                                              │
│    This shows reduce is the most powerful array operation.                  │
│    All other operations can be expressed as reduce.                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q18: What is memoization?                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Caching function results based on arguments.                             │
│    Only works for pure functions (same input = same output).                │
│                                                                              │
│    function memoize(fn) {                                                   │
│      const cache = new Map();                                               │
│      return function(...args) {                                             │
│        const key = JSON.stringify(args);                                    │
│        if (!cache.has(key)) {                                               │
│          cache.set(key, fn.apply(this, args));                              │
│        }                                                                     │
│        return cache.get(key);                                               │
│      };                                                                      │
│    }                                                                         │
│                                                                              │
│    const fib = memoize(n => n <= 1 ? n : fib(n-1) + fib(n-2));             │
│    fib(100); // Instant! (would take forever without memoization)           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q19: Implement debounce and throttle.                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: // Debounce - wait for pause in calls                                    │
│    function debounce(fn, delay) {                                           │
│      let timeoutId;                                                         │
│      return function(...args) {                                             │
│        clearTimeout(timeoutId);                                             │
│        timeoutId = setTimeout(() => fn.apply(this, args), delay);          │
│      };                                                                      │
│    }                                                                         │
│                                                                              │
│    // Throttle - limit execution rate                                       │
│    function throttle(fn, limit) {                                           │
│      let inThrottle = false;                                                │
│      return function(...args) {                                             │
│        if (!inThrottle) {                                                   │
│          fn.apply(this, args);                                              │
│          inThrottle = true;                                                 │
│          setTimeout(() => inThrottle = false, limit);                       │
│        }                                                                     │
│      };                                                                      │
│    }                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q20: What is fn.length and why does curry use it?                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: fn.length returns the number of formal parameters the function expects. │
│                                                                              │
│    function add(a, b, c) {}  // length = 3                                  │
│    function rest(...args) {} // length = 0 (rest param)                     │
│    function def(a, b = 1) {} // length = 1 (default param)                  │
│                                                                              │
│    curry() uses fn.length to know when enough arguments have been          │
│    collected to call the original function.                                 │
│                                                                              │
│    Note: Default and rest parameters affect length!                         │
│    This is why currying variadic functions requires curryN().               │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    SECTION 3: FUNCTORS & MONADS                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("\n" + "═".repeat(70));
console.log("            SECTION 3: FUNCTORS & MONADS (10 Questions)            ");
console.log("═══════════════════════════════════════════════════════════════════\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q21: What is a Functor?                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A Functor is a container type that:                                      │
│    1. Holds a value                                                         │
│    2. Implements a map method                                               │
│    3. map applies a function to the value, returns new Functor             │
│                                                                              │
│    class Box {                                                              │
│      constructor(value) { this.value = value; }                             │
│      map(fn) { return new Box(fn(this.value)); }                            │
│    }                                                                         │
│                                                                              │
│    new Box(5).map(x => x * 2).map(x => x + 1); // Box(11)                   │
│                                                                              │
│    Array is a Functor! [1,2,3].map(x => x * 2) = [2,4,6]                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q22: What are the Functor laws?                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: 1. IDENTITY LAW                                                          │
│       functor.map(x => x) ≡ functor                                        │
│       Mapping identity function returns equivalent functor                  │
│                                                                              │
│    2. COMPOSITION LAW                                                        │
│       functor.map(f).map(g) ≡ functor.map(x => g(f(x)))                    │
│       Mapping f then g equals mapping their composition                     │
│                                                                              │
│    These laws ensure map behaves predictably.                               │
│    If a type breaks these laws, it's not a proper Functor.                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q23: What is a Monad?                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A Monad is a Functor with additional capabilities:                       │
│                                                                              │
│    1. Has map (it's a Functor)                                              │
│    2. Has flatMap/chain/bind - map + flatten                                │
│    3. Has of/unit - wraps value in Monad                                    │
│                                                                              │
│    Problem with just map:                                                   │
│    Maybe(5).map(x => Maybe(x + 1)) → Maybe(Maybe(6)) // Nested!            │
│                                                                              │
│    flatMap flattens:                                                        │
│    Maybe(5).flatMap(x => Maybe(x + 1)) → Maybe(6) // Flat!                 │
│                                                                              │
│    "A monad is just a monoid in the category of endofunctors"              │
│    (Famous joke - not helpful for understanding!)                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q24: What are the Monad laws?                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: 1. LEFT IDENTITY                                                         │
│       M.of(a).flatMap(f) ≡ f(a)                                            │
│       Wrapping then flatMapping = just calling function                     │
│                                                                              │
│    2. RIGHT IDENTITY                                                         │
│       m.flatMap(M.of) ≡ m                                                  │
│       flatMapping with of = same monad                                      │
│                                                                              │
│    3. ASSOCIATIVITY                                                          │
│       m.flatMap(f).flatMap(g) ≡ m.flatMap(x => f(x).flatMap(g))           │
│       Chaining order doesn't matter                                         │
│                                                                              │
│    These laws ensure monads compose correctly.                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q25: Explain Maybe monad and its use case.                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Maybe handles potentially null/undefined values safely.                  │
│                                                                              │
│    class Maybe {                                                            │
│      static of(value) { return new Maybe(value); }                          │
│      isNothing() { return this.value == null; }                             │
│      map(fn) { return this.isNothing() ? this : Maybe.of(fn(this.value)); }│
│      flatMap(fn) { return this.isNothing() ? this : fn(this.value); }      │
│      getOrElse(def) { return this.isNothing() ? def : this.value; }        │
│    }                                                                         │
│                                                                              │
│    // Without Maybe                                                         │
│    if (user && user.address && user.address.city) { ... }                  │
│                                                                              │
│    // With Maybe                                                            │
│    Maybe.of(user).map(u => u.address).map(a => a.city).getOrElse('N/A');   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q26: Explain Either monad and its use case.                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Either represents a value that is one of two types:                      │
│    Left (typically error) or Right (typically success).                     │
│                                                                              │
│    Right: map/flatMap applies function                                      │
│    Left: map/flatMap passes through unchanged                               │
│                                                                              │
│    const divide = (a, b) =>                                                 │
│      b === 0 ? Left('Cannot divide by zero') : Right(a / b);               │
│                                                                              │
│    divide(10, 2)                                                            │
│      .map(x => x + 1)                                                       │
│      .fold(err => \`Error: \${err}\`, val => \`Result: \${val}\`);            │
│                                                                              │
│    Either enables railway-oriented programming:                             │
│    Success path continues, errors short-circuit.                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q27: Is Promise a Monad?                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Almost! Promise is monad-like but doesn't strictly follow the laws.     │
│                                                                              │
│    Promise.resolve(x) is like 'of'                                          │
│    .then() is like map AND flatMap (auto-flattens)                         │
│                                                                              │
│    Differences from true Monad:                                              │
│    • Eager evaluation (not lazy)                                            │
│    • .then() combines map and flatMap                                       │
│    • Some edge cases with Promise.resolve                                   │
│                                                                              │
│    For practical purposes, treat it like a monad.                           │
│    Libraries like fp-ts provide Task for a true lazy async monad.          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q28: What's the difference between map and flatMap?                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: map: Applies function to value, wraps result in container               │
│    Container(a).map(a => b) → Container(b)                                 │
│                                                                              │
│    flatMap: Applies function that returns container, flattens              │
│    Container(a).flatMap(a => Container(b)) → Container(b)                  │
│                                                                              │
│    // map - function returns plain value                                    │
│    Maybe(5).map(x => x * 2)              → Maybe(10)                       │
│                                                                              │
│    // flatMap - function returns Maybe                                      │
│    Maybe(5).flatMap(x => Maybe(x * 2))   → Maybe(10)                       │
│    Maybe(5).map(x => Maybe(x * 2))       → Maybe(Maybe(10)) // Wrong!      │
│                                                                              │
│    Use flatMap when your function returns a container type.                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q29: What is the IO Monad?                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: IO wraps side effects, making them explicit and composable.             │
│                                                                              │
│    class IO {                                                               │
│      constructor(effect) { this.effect = effect; }                          │
│      static of(value) { return new IO(() => value); }                       │
│      map(fn) { return new IO(() => fn(this.effect())); }                    │
│      flatMap(fn) { return new IO(() => fn(this.effect()).run()); }         │
│      run() { return this.effect(); }                                        │
│    }                                                                         │
│                                                                              │
│    const readFile = path => new IO(() => fs.readFileSync(path));           │
│    const log = x => new IO(() => { console.log(x); return x; });           │
│                                                                              │
│    // Side effects don't happen until .run()                                │
│    const program = readFile('config.json').map(JSON.parse).flatMap(log);   │
│    program.run(); // NOW the effects happen                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q30: Explain the fold method on functors/monads.                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: fold "extracts" the value from the container by applying functions.     │
│                                                                              │
│    // Maybe fold - handle both cases                                        │
│    maybe.fold(                                                              │
│      () => 'default value',    // If Nothing                               │
│      value => \`Got: \${value}\`  // If Just                                 │
│    );                                                                        │
│                                                                              │
│    // Either fold - handle Left and Right                                   │
│    either.fold(                                                             │
│      err => \`Error: \${err}\`,   // If Left                                 │
│      val => \`Value: \${val}\`    // If Right                                │
│    );                                                                        │
│                                                                              │
│    fold is the "exit point" from the container.                             │
│    It lets you transform the containerized value back to plain value.      │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    SECTION 4: RECURSION                                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("\n" + "═".repeat(70));
console.log("                SECTION 4: RECURSION (10 Questions)                ");
console.log("═══════════════════════════════════════════════════════════════════\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q31: What are the two parts of every recursive function?                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: 1. BASE CASE                                                             │
│       The terminating condition that stops recursion                        │
│       Without it: infinite recursion → stack overflow                       │
│                                                                              │
│    2. RECURSIVE CASE                                                         │
│       Where the function calls itself with a smaller/simpler input          │
│       Must make progress toward base case                                   │
│                                                                              │
│    function factorial(n) {                                                  │
│      if (n <= 1) return 1;           // Base case                           │
│      return n * factorial(n - 1);    // Recursive case                      │
│    }                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q32: What is tail recursion?                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A recursive call is in "tail position" when it's the last operation     │
│    in the function - nothing needs to be done after it returns.             │
│                                                                              │
│    // NOT tail recursive                                                    │
│    function factorial(n) {                                                  │
│      if (n <= 1) return 1;                                                  │
│      return n * factorial(n - 1);  // Must multiply after call             │
│    }                                                                         │
│                                                                              │
│    // Tail recursive (uses accumulator)                                     │
│    function factorial(n, acc = 1) {                                         │
│      if (n <= 1) return acc;                                                │
│      return factorial(n - 1, n * acc);  // Nothing after call              │
│    }                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q33: What is Tail Call Optimization (TCO)?                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: An optimization where the runtime reuses the current stack frame        │
│    for a tail call instead of creating a new one.                           │
│                                                                              │
│    Benefits:                                                                 │
│    • O(n) stack space → O(1) stack space                                   │
│    • Prevents stack overflow                                                │
│    • Recursion as efficient as loops                                        │
│                                                                              │
│    JavaScript status:                                                        │
│    • TCO is in ES6 spec                                                     │
│    • Only Safari implements it!                                             │
│    • Node.js/Chrome/Firefox do NOT support it                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q34: What is trampolining?                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A technique to achieve constant stack space without TCO.                 │
│                                                                              │
│    function trampoline(fn) {                                                │
│      return (...args) => {                                                  │
│        let result = fn(...args);                                            │
│        while (typeof result === 'function') {                               │
│          result = result();  // Execute thunk                               │
│        }                                                                     │
│        return result;                                                       │
│      };                                                                      │
│    }                                                                         │
│                                                                              │
│    function factorial(n, acc = 1) {                                         │
│      if (n <= 1) return acc;                                                │
│      return () => factorial(n - 1, n * acc);  // Return thunk              │
│    }                                                                         │
│                                                                              │
│    const safeFact = trampoline(factorial);                                  │
│    safeFact(100000);  // No stack overflow!                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q35: Convert this to tail recursion: sum([1,2,3,4,5])                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: // Non-tail recursive                                                    │
│    function sum(arr) {                                                      │
│      if (arr.length === 0) return 0;                                        │
│      return arr[0] + sum(arr.slice(1));  // + after call                   │
│    }                                                                         │
│                                                                              │
│    // Tail recursive (with accumulator)                                     │
│    function sum(arr, acc = 0) {                                             │
│      if (arr.length === 0) return acc;                                      │
│      return sum(arr.slice(1), acc + arr[0]);  // Nothing after             │
│    }                                                                         │
│                                                                              │
│    Pattern: Move computation into accumulator parameter                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q36: Why is naive Fibonacci slow? How do you fix it?                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Naive fib is exponential O(2^n) because it recalculates same values:   │
│                                                                              │
│    fib(5) calls fib(4) and fib(3)                                           │
│    fib(4) calls fib(3) and fib(2)  ← fib(3) calculated twice!              │
│                                                                              │
│    Fixes:                                                                    │
│                                                                              │
│    1. Memoization - cache results                                           │
│       const fib = memoize(n => n <= 1 ? n : fib(n-1) + fib(n-2));          │
│                                                                              │
│    2. Iterative with two variables - O(n) time, O(1) space                 │
│                                                                              │
│    3. Tail recursive with two accumulators                                  │
│       function fib(n, a = 0, b = 1) {                                       │
│         if (n === 0) return a;                                              │
│         return fib(n - 1, b, a + b);                                        │
│       }                                                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q37: What is mutual recursion?                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Two or more functions that call each other.                              │
│                                                                              │
│    function isEven(n) {                                                     │
│      if (n === 0) return true;                                              │
│      return isOdd(n - 1);                                                   │
│    }                                                                         │
│                                                                              │
│    function isOdd(n) {                                                      │
│      if (n === 0) return false;                                             │
│      return isEven(n - 1);                                                  │
│    }                                                                         │
│                                                                              │
│    isEven(4) → isOdd(3) → isEven(2) → isOdd(1) → isEven(0) → true         │
│                                                                              │
│    Can also be trampolined for stack safety.                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q38: When should you use recursion vs loops?                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: USE RECURSION:                                                           │
│    • Tree/graph traversal                                                   │
│    • Divide and conquer algorithms                                          │
│    • When the problem is naturally recursive                                │
│    • Functional programming style                                           │
│                                                                              │
│    USE LOOPS:                                                                │
│    • Simple iteration                                                       │
│    • Performance critical code                                              │
│    • When stack space is a concern                                          │
│    • Language doesn't support TCO                                           │
│                                                                              │
│    In JS without TCO, consider trampolining or converting to loops         │
│    for deep recursion.                                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q39: Implement recursive map function.                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: // Basic recursive map                                                   │
│    function map(fn, arr) {                                                  │
│      if (arr.length === 0) return [];                                       │
│      const [head, ...tail] = arr;                                           │
│      return [fn(head), ...map(fn, tail)];                                   │
│    }                                                                         │
│                                                                              │
│    // Tail recursive map (using accumulator)                                │
│    function map(fn, arr, acc = []) {                                        │
│      if (arr.length === 0) return acc;                                      │
│      const [head, ...tail] = arr;                                           │
│      return map(fn, tail, [...acc, fn(head)]);                              │
│    }                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q40: What is tree recursion?                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: When a function makes multiple recursive calls, creating a tree.        │
│                                                                              │
│                    fib(5)                                                   │
│                   /      \\                                                  │
│               fib(4)      fib(3)                                            │
│              /    \\       /    \\                                           │
│          fib(3)  fib(2) fib(2) fib(1)                                       │
│                                                                              │
│    Common in:                                                                │
│    • Fibonacci (without memoization)                                        │
│    • Tree traversal (visit left AND right)                                  │
│    • Divide and conquer (merge sort, quick sort)                            │
│                                                                              │
│    Often exponential time unless optimized with memoization.                │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    SECTION 5: QUICK FIRE                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("\n" + "═".repeat(70));
console.log("               SECTION 5: QUICK FIRE (10+ Questions)               ");
console.log("═══════════════════════════════════════════════════════════════════\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q41: What is the difference between mutation and reassignment?              │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Mutation: Changing the contents of an existing object                    │
│    obj.prop = newValue;  arr.push(item);                                   │
│                                                                              │
│    Reassignment: Making a variable point to a different value              │
│    let x = 1; x = 2;  // Reassignment                                      │
│                                                                              │
│    In FP, avoid both! Use const and create new objects.                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q42: What is Object.freeze and its limitation?                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Object.freeze prevents modification of object properties.                │
│                                                                              │
│    Limitation: It's SHALLOW!                                                │
│    const obj = Object.freeze({ nested: { prop: 1 } });                      │
│    obj.nested.prop = 2;  // This works! Nested objects aren't frozen       │
│                                                                              │
│    For deep freeze, recurse through all nested objects.                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q43: How do you remove a property from an object immutably?                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Use destructuring with rest:                                             │
│                                                                              │
│    const { propToRemove, ...rest } = obj;                                   │
│    // 'rest' has all properties except 'propToRemove'                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q44: What does Array.prototype.flat do?                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Flattens nested arrays by specified depth (default 1).                   │
│                                                                              │
│    [1, [2, [3, [4]]]].flat()     // [1, 2, [3, [4]]]                       │
│    [1, [2, [3, [4]]]].flat(2)    // [1, 2, 3, [4]]                         │
│    [1, [2, [3, [4]]]].flat(Infinity) // [1, 2, 3, 4]                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q45: What is flatMap?                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: map + flat(1). Maps then flattens one level.                             │
│                                                                              │
│    [1, 2, 3].flatMap(x => [x, x * 2])                                       │
│    // [1, 2, 2, 4, 3, 6]                                                    │
│                                                                              │
│    Equivalent to: arr.map(fn).flat()                                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q46: What is a thunk?                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A function that wraps an expression to delay its evaluation.             │
│                                                                              │
│    // Immediate evaluation                                                  │
│    const x = 1 + 2;                                                         │
│                                                                              │
│    // Thunk - delayed evaluation                                            │
│    const xThunk = () => 1 + 2;                                              │
│    xThunk();  // Evaluates when called                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q47: Name some popular FP libraries for JavaScript.                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: • Ramda - Pure FP utility library (curried by default)                   │
│    • Lodash/fp - FP version of Lodash                                       │
│    • fp-ts - TypeScript FP library with monads                              │
│    • Immutable.js - Immutable data structures                               │
│    • Immer - Immutable updates with mutable syntax                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q48: What is lazy evaluation?                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Delaying evaluation until the value is actually needed.                  │
│                                                                              │
│    Benefits:                                                                 │
│    • Avoid unnecessary computation                                          │
│    • Work with infinite data structures                                     │
│    • Better performance in some cases                                       │
│                                                                              │
│    Generators provide lazy evaluation in JS.                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q49: What is a lens?                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A composable pair of get/set functions for focusing on nested data.     │
│                                                                              │
│    const lens = (getter, setter) => ({                                      │
│      get: obj => getter(obj),                                               │
│      set: (val, obj) => setter(val, obj)                                    │
│    });                                                                       │
│                                                                              │
│    Great for immutable nested updates without spread operator chains.       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q50: What is a transducer?                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A composable transformation that works without intermediate arrays.     │
│                                                                              │
│    // Normal chaining - creates intermediate arrays                         │
│    arr.filter(f).map(g).filter(h)                                          │
│                                                                              │
│    // Transducer - single pass, no intermediate arrays                     │
│    transduce(compose(filterT(f), mapT(g), filterT(h)), arr)                │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                           CHEAT SHEET
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("📝  FUNCTIONAL PROGRAMMING MASTER CHEAT SHEET");
console.log("═══════════════════════════════════════════════════════════════════\n");

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                      FP CORE CONCEPTS                                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  PURE FUNCTIONS                                                            ║
║  • Same input → Same output                                               ║
║  • No side effects                                                        ║
║                                                                            ║
║  IMMUTABILITY                                                              ║
║  • Never mutate, create new                                               ║
║  • [...arr, item], {...obj, key: val}                                     ║
║                                                                            ║
║  HIGHER-ORDER FUNCTIONS                                                    ║
║  • Functions as arguments/return values                                   ║
║  • map, filter, reduce, compose, curry                                    ║
║                                                                            ║
║  COMPOSITION                                                               ║
║  • pipe(...fns)(x) - left to right                                        ║
║  • compose(...fns)(x) - right to left                                     ║
║                                                                            ║
║  CURRYING                                                                  ║
║  • f(a, b, c) → f(a)(b)(c)                                               ║
║  • Enables partial application                                            ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                    FUNCTORS & MONADS                                       ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  FUNCTOR: Container with map                                               ║
║  MONAD: Functor with flatMap and of                                       ║
║                                                                            ║
║  map:     Container(a).map(f) → Container(f(a))                           ║
║  flatMap: Container(a).flatMap(f) → f(a)  (f returns Container)          ║
║                                                                            ║
║  Maybe: Handles null/undefined                                             ║
║  Either: Handles errors (Left/Right)                                       ║
║  IO: Wraps side effects                                                    ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                       RECURSION                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  BASE CASE + RECURSIVE CASE                                                ║
║                                                                            ║
║  TAIL RECURSION: Nothing after recursive call                             ║
║  • Use accumulator parameter                                              ║
║  • Only Safari has TCO                                                    ║
║                                                                            ║
║  TRAMPOLINING: Return thunks, loop executes them                          ║
║  MEMOIZATION: Cache pure function results                                 ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

console.log("\n═══ FUNCTIONAL PROGRAMMING MODULE COMPLETE! ═══");
console.log("All 8 files covering FP concepts created.");
console.log("\nNext module: JavaScript Security");
console.log("Run: node deep-dive/javaScript-security/01-xss-prevention.js");
