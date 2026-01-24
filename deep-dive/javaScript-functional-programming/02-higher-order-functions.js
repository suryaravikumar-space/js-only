/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNCTIONAL PROGRAMMING - FILE 2: HIGHER-ORDER FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Higher-order functions are functions that take functions as arguments
 * or return functions as results. They're the backbone of functional programming.
 */

console.log("═══════════════════════════════════════════════════════════════════");
console.log("       HIGHER-ORDER FUNCTIONS - FUNCTIONS AS FIRST-CLASS CITIZENS  ");
console.log("═══════════════════════════════════════════════════════════════════\n");

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    WHAT ARE HIGHER-ORDER FUNCTIONS?                        ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  A Higher-Order Function (HOF) is a function that:                         ║
 * ║                                                                            ║
 * ║  1. Takes one or more functions as arguments                               ║
 * ║     ┌────────────────────────────────────────────────────────────────┐    ║
 * ║     │  function doSomething(callback) {                              │    ║
 * ║     │    callback();  // Uses function as argument                   │    ║
 * ║     │  }                                                             │    ║
 * ║     └────────────────────────────────────────────────────────────────┘    ║
 * ║                                                                            ║
 * ║  2. Returns a function as its result                                       ║
 * ║     ┌────────────────────────────────────────────────────────────────┐    ║
 * ║     │  function createMultiplier(n) {                                │    ║
 * ║     │    return (x) => x * n;  // Returns function                   │    ║
 * ║     │  }                                                             │    ║
 * ║     └────────────────────────────────────────────────────────────────┘    ║
 * ║                                                                            ║
 * ║  Or BOTH!                                                                  ║
 * ║                                                                            ║
 * ║  This is possible because in JavaScript, functions are FIRST-CLASS        ║
 * ║  citizens - they can be:                                                   ║
 * ║  • Assigned to variables                                                  ║
 * ║  • Passed as arguments                                                    ║
 * ║  • Returned from functions                                                ║
 * ║  • Stored in data structures                                              ║
 * ║                                                                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("1️⃣  FUNCTIONS AS FIRST-CLASS CITIZENS\n");

// Functions can be assigned to variables
const greet = function(name) {
  return `Hello, ${name}!`;
};

// Functions can be stored in arrays
const operations = [
  (x) => x + 1,
  (x) => x * 2,
  (x) => x ** 2
];

// Functions can be stored in objects
const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b
};

console.log("Function in variable:", greet("World"));
console.log("Function from array:", operations[1](5));
console.log("Function from object:", calculator.add(2, 3));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    FUNCTIONS THAT TAKE FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("2️⃣  FUNCTIONS THAT TAKE FUNCTIONS AS ARGUMENTS\n");

// Custom forEach implementation
function myForEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i, array);
  }
}

console.log("=== Custom forEach ===");
myForEach([1, 2, 3], (item, index) => {
  console.log(`  Index ${index}: ${item}`);
});


// Custom map implementation
function myMap(array, transform) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(transform(array[i], i, array));
  }
  return result;
}

console.log("\n=== Custom map ===");
const doubled = myMap([1, 2, 3, 4], x => x * 2);
console.log("Doubled:", doubled);


// Custom filter implementation
function myFilter(array, predicate) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}

console.log("\n=== Custom filter ===");
const evens = myFilter([1, 2, 3, 4, 5, 6], x => x % 2 === 0);
console.log("Evens:", evens);


// Custom reduce implementation
function myReduce(array, reducer, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;

  if (accumulator === undefined) {
    accumulator = array[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < array.length; i++) {
    accumulator = reducer(accumulator, array[i], i, array);
  }

  return accumulator;
}

console.log("\n=== Custom reduce ===");
const sum = myReduce([1, 2, 3, 4, 5], (acc, curr) => acc + curr, 0);
console.log("Sum:", sum);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    FUNCTIONS THAT RETURN FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("3️⃣  FUNCTIONS THAT RETURN FUNCTIONS\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                    FUNCTION FACTORIES                                      │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  createMultiplier(3) ────► function(x) { return x * 3; }                  │
 * │                                                                            │
 * │  const triple = createMultiplier(3);                                       │
 * │  triple(5) → 15                                                           │
 * │  triple(10) → 30                                                          │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Basic function factory
function createMultiplier(multiplier) {
  return function(x) {
    return x * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const quadruple = createMultiplier(4);

console.log("=== Multiplier Factory ===");
console.log("double(5):", double(5));
console.log("triple(5):", triple(5));
console.log("quadruple(5):", quadruple(5));


// Greeting factory
function createGreeter(greeting) {
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}

const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");
const sayHola = createGreeter("Hola");

console.log("\n=== Greeter Factory ===");
console.log(sayHello("Alice"));
console.log(sayHi("Bob"));
console.log(sayHola("Carlos"));


// Power factory
function createPower(exponent) {
  return function(base) {
    return Math.pow(base, exponent);
  };
}

const square = createPower(2);
const cube = createPower(3);

console.log("\n=== Power Factory ===");
console.log("square(5):", square(5));
console.log("cube(5):", cube(5));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    CLOSURES IN HOFs
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("4️⃣  CLOSURES - REMEMBERING ENVIRONMENT\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                       CLOSURE VISUALIZATION                                │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  function outer(x) {                                                       │
 * │    // x is captured in closure                                            │
 * │    return function inner(y) {                                             │
 * │      return x + y;  // x still accessible!                               │
 * │    };                                                                      │
 * │  }                                                                         │
 * │                                                                            │
 * │  const add5 = outer(5);                                                   │
 * │  // add5 "closes over" x=5                                                │
 * │                                                                            │
 * │  ┌──────────────────────────────────────────┐                             │
 * │  │ add5                                      │                             │
 * │  │ ┌──────────────────────────────────────┐ │                             │
 * │  │ │ function(y) { return x + y; }        │ │                             │
 * │  │ └──────────────────────────────────────┘ │                             │
 * │  │ Closure Environment: { x: 5 }            │                             │
 * │  └──────────────────────────────────────────┘                             │
 * │                                                                            │
 * │  add5(3) → 8  (5 + 3)                                                     │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Counter with closure
function createCounter(initial = 0) {
  let count = initial;  // Private state via closure

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount() { return count; },
    reset() { count = initial; return count; }
  };
}

console.log("=== Counter with Closure ===");
const counter = createCounter(10);
console.log("Initial:", counter.getCount());
console.log("Increment:", counter.increment());
console.log("Increment:", counter.increment());
console.log("Decrement:", counter.decrement());
console.log("Reset:", counter.reset());


// Private data pattern
function createPerson(name, age) {
  // Private variables
  let _name = name;
  let _age = age;

  return {
    getName() { return _name; },
    getAge() { return _age; },
    haveBirthday() { _age++; return _age; },
    describe() { return `${_name} is ${_age} years old`; }
  };
}

console.log("\n=== Private Data Pattern ===");
const person = createPerson("Alice", 30);
console.log(person.describe());
console.log("Birthday:", person.haveBirthday());
console.log(person.describe());


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    BUILT-IN HIGHER-ORDER FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("5️⃣  BUILT-IN ARRAY HIGHER-ORDER FUNCTIONS\n");

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log("Original array:", numbers);

// map - transform each element
console.log("\n=== map ===");
const squares = numbers.map(n => n ** 2);
console.log("Squares:", squares);

// filter - keep elements that pass test
console.log("\n=== filter ===");
const evenNumbers = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evenNumbers);

// reduce - accumulate into single value
console.log("\n=== reduce ===");
const total = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", total);

const max = numbers.reduce((max, n) => n > max ? n : max, -Infinity);
console.log("Max:", max);

// find - first element matching condition
console.log("\n=== find ===");
const firstEven = numbers.find(n => n % 2 === 0);
console.log("First even:", firstEven);

// findIndex - index of first matching element
console.log("\n=== findIndex ===");
const firstEvenIndex = numbers.findIndex(n => n % 2 === 0);
console.log("First even index:", firstEvenIndex);

// some - at least one passes test
console.log("\n=== some ===");
const hasEven = numbers.some(n => n % 2 === 0);
console.log("Has even:", hasEven);

// every - all pass test
console.log("\n=== every ===");
const allPositive = numbers.every(n => n > 0);
console.log("All positive:", allPositive);

// forEach - side effects only (no return)
console.log("\n=== forEach ===");
numbers.slice(0, 3).forEach(n => console.log(`  Processing ${n}`));

// flatMap - map then flatten
console.log("\n=== flatMap ===");
const pairs = [1, 2, 3].flatMap(n => [n, n * 2]);
console.log("Pairs:", pairs);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    CHAINING HIGHER-ORDER FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("6️⃣  CHAINING HOFs - DATA PIPELINES\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                         CHAINING PATTERN                                   │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  data                                                                      │
 * │    .filter(...)  → Keep relevant items                                    │
 * │    .map(...)     → Transform items                                        │
 * │    .filter(...)  → More filtering if needed                               │
 * │    .reduce(...)  → Combine into result                                    │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

const products = [
  { name: 'Laptop', price: 1200, category: 'Electronics', inStock: true },
  { name: 'Phone', price: 800, category: 'Electronics', inStock: true },
  { name: 'Desk', price: 300, category: 'Furniture', inStock: false },
  { name: 'Chair', price: 150, category: 'Furniture', inStock: true },
  { name: 'Monitor', price: 400, category: 'Electronics', inStock: true },
  { name: 'Keyboard', price: 100, category: 'Electronics', inStock: false }
];

console.log("=== Product Pipeline ===\n");

// Get total value of in-stock electronics
const inStockElectronicsValue = products
  .filter(p => p.category === 'Electronics')
  .filter(p => p.inStock)
  .map(p => p.price)
  .reduce((sum, price) => sum + price, 0);

console.log("In-stock electronics value: $" + inStockElectronicsValue);

// Get names of affordable in-stock items
const affordableItems = products
  .filter(p => p.inStock)
  .filter(p => p.price < 500)
  .map(p => p.name)
  .sort();

console.log("Affordable in-stock items:", affordableItems);

// Create a summary
const summary = products
  .reduce((acc, p) => {
    const category = p.category;
    if (!acc[category]) {
      acc[category] = { count: 0, totalValue: 0 };
    }
    acc[category].count++;
    acc[category].totalValue += p.price;
    return acc;
  }, {});

console.log("Summary by category:", summary);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    PRACTICAL HOF PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("7️⃣  PRACTICAL HOF PATTERNS\n");

// Debounce - delay execution until pause in calls
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

console.log("=== Debounce ===");
console.log(`
const handleSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

// Only last call executes (after 300ms pause)
handleSearch('a');
handleSearch('ap');
handleSearch('app');
handleSearch('appl');
handleSearch('apple');  // ← Only this one runs
`);


// Throttle - limit execution rate
function throttle(fn, limit) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

console.log("=== Throttle ===");
console.log(`
const handleScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100);

// Executes at most once per 100ms during scrolling
window.addEventListener('scroll', handleScroll);
`);


// Once - execute only once
function once(fn) {
  let called = false;
  let result;
  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

console.log("=== Once ===");
const initialize = once(() => {
  console.log("  Initialized!");
  return { ready: true };
});

console.log("First call:", initialize());
console.log("Second call:", initialize()); // Same result, no re-execution
console.log("Third call:", initialize());  // Same result


// Memoize - cache results
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn.apply(this, args));
    }
    return cache.get(key);
  };
}

console.log("\n=== Memoize ===");
const expensiveFn = memoize((n) => {
  console.log(`  Computing for ${n}...`);
  return n * n;
});

console.log("expensiveFn(5):", expensiveFn(5));
console.log("expensiveFn(5):", expensiveFn(5)); // Cached
console.log("expensiveFn(6):", expensiveFn(6));


// After - execute after N calls
function after(n, fn) {
  let count = 0;
  return function(...args) {
    count++;
    if (count >= n) {
      return fn.apply(this, args);
    }
  };
}

console.log("\n=== After ===");
const afterThree = after(3, () => "Now I run!");
console.log("Call 1:", afterThree());
console.log("Call 2:", afterThree());
console.log("Call 3:", afterThree()); // Now executes


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    SORTING WITH COMPARATORS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("8️⃣  SORTING WITH COMPARATOR FUNCTIONS\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                     COMPARATOR FUNCTION                                    │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  comparator(a, b) returns:                                                │
 * │  • Negative: a comes before b                                             │
 * │  • Zero: a and b are equal (keep order)                                   │
 * │  • Positive: a comes after b                                              │
 * │                                                                            │
 * │  Ascending numbers:  (a, b) => a - b                                      │
 * │  Descending numbers: (a, b) => b - a                                      │
 * │  Ascending strings:  (a, b) => a.localeCompare(b)                         │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Sort numbers
const nums = [3, 1, 4, 1, 5, 9, 2, 6];
console.log("Original:", nums);
console.log("Ascending:", [...nums].sort((a, b) => a - b));
console.log("Descending:", [...nums].sort((a, b) => b - a));

// Sort objects
const people = [
  { name: 'Charlie', age: 35 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];

console.log("\nSort by age:");
const byAge = [...people].sort((a, b) => a.age - b.age);
byAge.forEach(p => console.log(`  ${p.name}: ${p.age}`));

console.log("\nSort by name:");
const byName = [...people].sort((a, b) => a.name.localeCompare(b.name));
byName.forEach(p => console.log(`  ${p.name}`));

// Comparator factory
function sortBy(key, descending = false) {
  return function(a, b) {
    const result = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
    return descending ? -result : result;
  };
}

console.log("\nUsing sortBy factory (age descending):");
const byAgeDesc = [...people].sort(sortBy('age', true));
byAgeDesc.forEach(p => console.log(`  ${p.name}: ${p.age}`));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        INTERVIEW QUESTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("📋  HIGHER-ORDER FUNCTIONS - INTERVIEW QUESTIONS\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q1: What is a higher-order function?                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A function that either:                                                  │
│    1. Takes one or more functions as arguments, OR                          │
│    2. Returns a function as its result                                      │
│                                                                              │
│    Examples: map, filter, reduce, setTimeout, addEventListener              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q2: Implement map using reduce.                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: function map(arr, fn) {                                                  │
│      return arr.reduce((acc, item, index) => {                              │
│        acc.push(fn(item, index, arr));                                      │
│        return acc;                                                          │
│      }, []);                                                                 │
│    }                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q3: Implement filter using reduce.                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: function filter(arr, predicate) {                                        │
│      return arr.reduce((acc, item, index) => {                              │
│        if (predicate(item, index, arr)) {                                   │
│          acc.push(item);                                                    │
│        }                                                                     │
│        return acc;                                                          │
│      }, []);                                                                 │
│    }                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q4: What's the difference between map and forEach?                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: map():                                                                   │
│    • Returns a NEW array with transformed elements                          │
│    • For transforming data                                                  │
│    • Pure (when callback is pure)                                           │
│                                                                              │
│    forEach():                                                                │
│    • Returns undefined                                                      │
│    • For side effects only                                                  │
│    • Inherently impure                                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q5: What is a closure and how does it relate to HOFs?                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A closure is when a function "remembers" variables from its outer       │
│    scope even after the outer function has returned.                        │
│                                                                              │
│    HOFs that return functions create closures - the returned function       │
│    captures variables from the outer function's scope.                      │
│                                                                              │
│    function multiplier(n) {                                                 │
│      return x => x * n;  // Closes over 'n'                                │
│    }                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q6: Implement debounce function.                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: function debounce(fn, delay) {                                           │
│      let timeoutId;                                                         │
│      return function(...args) {                                             │
│        clearTimeout(timeoutId);                                             │
│        timeoutId = setTimeout(() => fn.apply(this, args), delay);          │
│      };                                                                      │
│    }                                                                         │
│                                                                              │
│    // Usage: Wait until user stops typing                                   │
│    const search = debounce((query) => fetch(...), 300);                     │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                           CHEAT SHEET
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("📝  HIGHER-ORDER FUNCTIONS CHEAT SHEET\n");

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                    ARRAY HOFs QUICK REFERENCE                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  TRANSFORMING:                                                             ║
║  arr.map(x => x * 2)              → New array with transformed elements   ║
║  arr.flatMap(x => [x, x])         → Map + flatten one level               ║
║                                                                            ║
║  FILTERING:                                                                ║
║  arr.filter(x => x > 0)           → New array with matching elements      ║
║  arr.find(x => x > 0)             → First matching element (or undefined) ║
║  arr.findIndex(x => x > 0)        → Index of first match (or -1)          ║
║                                                                            ║
║  TESTING:                                                                  ║
║  arr.some(x => x > 0)             → true if ANY element passes            ║
║  arr.every(x => x > 0)            → true if ALL elements pass             ║
║                                                                            ║
║  REDUCING:                                                                 ║
║  arr.reduce((acc, x) => ..., init) → Single accumulated value             ║
║  arr.reduceRight(...)              → Same but from right to left          ║
║                                                                            ║
║  SIDE EFFECTS:                                                             ║
║  arr.forEach(x => console.log(x)) → Executes for each (returns undefined) ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                    COMMON PATTERNS                                         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Function factory:                                                         ║
║    const multiply = n => x => x * n;                                      ║
║    const double = multiply(2);                                             ║
║                                                                            ║
║  Debounce:                                                                 ║
║    Delay until pause in calls                                             ║
║                                                                            ║
║  Throttle:                                                                 ║
║    Limit to once per interval                                             ║
║                                                                            ║
║  Memoize:                                                                  ║
║    Cache results by arguments                                             ║
║                                                                            ║
║  Once:                                                                     ║
║    Execute only on first call                                             ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

console.log("\n═══ FILE 2 COMPLETE ═══");
console.log("Run: node 03-currying-partial.js");
