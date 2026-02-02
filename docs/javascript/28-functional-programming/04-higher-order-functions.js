/**
 * FUNCTIONAL PROGRAMMING: 04 - Higher-Order Functions
 *
 * ONE CONCEPT: Functions that take or return other functions
 */


// =============================================================================
// WHAT IS A HIGHER-ORDER FUNCTION?
// =============================================================================

console.log('=== Higher-Order Functions ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  DEFINITION                                                         │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  A higher-order function (HOF) either:                               │
 *   │                                                                      │
 *   │  1. Takes function(s) as argument(s)                                 │
 *   │     ┌─────────────┐                                                  │
 *   │     │    HOF      │ ← fn()                                           │
 *   │     └─────────────┘                                                  │
 *   │                                                                      │
 *   │  2. Returns a function                                               │
 *   │     ┌─────────────┐                                                  │
 *   │     │    HOF      │ → fn()                                           │
 *   │     └─────────────┘                                                  │
 *   │                                                                      │
 *   │  3. Both!                                                            │
 *   │     ┌─────────────┐                                                  │
 *   │     │    HOF      │ ← fn() → fn()                                    │
 *   │     └─────────────┘                                                  │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// TYPE 1: TAKES A FUNCTION (Callback Pattern)
// =============================================================================

console.log('=== Takes a Function ===\n');

// Built-in HOFs
const numbers = [1, 2, 3, 4, 5];

// map - transform each element
const doubled = numbers.map(x => x * 2);
console.log('map:', doubled);

// filter - keep elements that pass test
const evens = numbers.filter(x => x % 2 === 0);
console.log('filter:', evens);

// reduce - accumulate to single value
const sum = numbers.reduce((acc, x) => acc + x, 0);
console.log('reduce:', sum);

// find - first element that passes test
const firstBig = numbers.find(x => x > 3);
console.log('find:', firstBig);

// every - all elements pass test?
const allPositive = numbers.every(x => x > 0);
console.log('every:', allPositive);

// some - any element passes test?
const hasEven = numbers.some(x => x % 2 === 0);
console.log('some:', hasEven);


// Custom HOF that takes a function
function forEach(arr, fn) {
  for (let i = 0; i < arr.length; i++) {
    fn(arr[i], i, arr);
  }
}

console.log('\nCustom forEach:');
forEach(['a', 'b', 'c'], (item, i) => console.log(`  ${i}: ${item}`));


// =============================================================================
// TYPE 2: RETURNS A FUNCTION (Factory Pattern)
// =============================================================================

console.log('\n=== Returns a Function ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  FUNCTION FACTORY                                                  │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  multiplyBy(3)  →  returns function  →  fn(10) = 30                 │
 *   │       ↓                                                             │
 *   │  ┌───────────────────────────────┐                                  │
 *   │  │ function(x) { return x * 3; } │                                  │
 *   │  └───────────────────────────────┘                                  │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Factory function
function multiplyBy(factor) {
  return function(x) {
    return x * factor;
  };
}

const triple = multiplyBy(3);
const quadruple = multiplyBy(4);

console.log('triple(10):', triple(10));
console.log('quadruple(10):', quadruple(10));

// More examples
const greaterThan = (n) => (x) => x > n;
const isAdult = greaterThan(17);
const isSenior = greaterThan(64);

console.log('isAdult(25):', isAdult(25));
console.log('isSenior(25):', isSenior(25));


// =============================================================================
// TYPE 3: BOTH (Decorators/Wrappers)
// =============================================================================

console.log('\n=== Takes AND Returns Function ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  DECORATOR PATTERN                                                 │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  ┌────────────┐     ┌────────────────┐     ┌────────────┐           │
 *   │  │ Original   │ ──▶ │   Decorator    │ ──▶ │ Enhanced   │           │
 *   │  │ Function   │     │   (HOF)        │     │ Function   │           │
 *   │  └────────────┘     └────────────────┘     └────────────┘           │
 *   │                                                                     │
 *   │  The original function is wrapped, not modified                     │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Logging decorator
function withLogging(fn) {
  return function(...args) {
    console.log(`  → Calling with:`, args);
    const result = fn(...args);
    console.log(`  ← Returned:`, result);
    return result;
  };
}

function add(a, b) {
  return a + b;
}

const loggedAdd = withLogging(add);
console.log('loggedAdd(2, 3):');
loggedAdd(2, 3);

// Caching/Memoization decorator
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log('  (cache hit)');
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

function expensiveCalculation(n) {
  console.log(`  Computing for ${n}...`);
  return n * n;
}

const memoizedCalc = memoize(expensiveCalculation);

console.log('\nFirst call memoizedCalc(5):');
console.log('Result:', memoizedCalc(5));

console.log('\nSecond call memoizedCalc(5):');
console.log('Result:', memoizedCalc(5));


// =============================================================================
// COMMON HOF PATTERNS
// =============================================================================

console.log('\n=== Common HOF Patterns ===\n');

// 1. Once - only execute once
function once(fn) {
  let called = false;
  let result;

  return function(...args) {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

const initialize = once(() => {
  console.log('  Initializing...');
  return 'initialized';
});

console.log('once pattern:');
console.log('First:', initialize());
console.log('Second:', initialize());  // No log, returns cached result


// 2. Debounce - wait before executing
function debounce(fn, delay) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

console.log('\ndebounce: (used for search input, window resize)');


// 3. Throttle - limit execution rate
function throttle(fn, limit) {
  let lastRun = 0;

  return function(...args) {
    const now = Date.now();
    if (now - lastRun >= limit) {
      lastRun = now;
      fn(...args);
    }
  };
}

console.log('throttle: (used for scroll handlers, API calls)');


// 4. Retry - retry on failure
function withRetry(fn, maxAttempts) {
  return async function(...args) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        console.log(`  Attempt ${attempt} failed, retrying...`);
      }
    }
  };
}

console.log('withRetry: (used for network requests)');


// =============================================================================
// REAL-WORLD: Express Middleware
// =============================================================================

console.log('\n=== Real-World: Middleware Chain ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  EXPRESS-STYLE MIDDLEWARE                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Request → [Logger] → [Auth] → [Handler] → Response                 │
 *   │                                                                     │
 *   │  Each middleware is a HOF that decides to:                          │
 *   │  • Pass to next middleware                                          │
 *   │  • End the chain (error, response)                                  │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulated middleware
const logger = (req, res, next) => {
  console.log(`  [LOG] ${req.method} ${req.url}`);
  next();
};

const auth = (req, res, next) => {
  if (req.headers.token) {
    console.log('  [AUTH] Valid token');
    next();
  } else {
    console.log('  [AUTH] No token - blocked');
  }
};

const handler = (req, res) => {
  console.log('  [HANDLER] Processing request');
};

// Compose middleware
function compose(...middlewares) {
  return (req, res) => {
    let index = 0;

    function next() {
      if (index < middlewares.length) {
        const middleware = middlewares[index++];
        middleware(req, res, next);
      }
    }

    next();
  };
}

const app = compose(logger, auth, handler);

console.log('Request with token:');
app({ method: 'GET', url: '/api/data', headers: { token: 'abc' } }, {});

console.log('\nRequest without token:');
app({ method: 'GET', url: '/api/data', headers: {} }, {});


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "A higher-order function is a function that either takes a function
 * as an argument, returns a function, or both.
 *
 * The most common examples are array methods like map, filter, and reduce.
 * Map takes a transformation function and returns a new array. Filter
 * takes a predicate function and returns elements that pass the test.
 *
 * HOFs that return functions are useful for creating specialized versions
 * of functions - like a multiplyBy factory that creates multiplier
 * functions.
 *
 * HOFs that do both are decorators - they take a function and return
 * an enhanced version. Common examples are debounce, throttle, and
 * memoize. Debounce delays execution until user stops typing - great
 * for search inputs. Throttle limits how often a function can run -
 * useful for scroll handlers. Memoize caches results for expensive
 * calculations.
 *
 * In React, higher-order components follow this pattern - they take
 * a component and return an enhanced component."
 */


// RUN: node docs/28-functional-programming/04-higher-order-functions.js
