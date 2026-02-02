/**
 * FUNCTIONAL PROGRAMMING: 07 - Compose
 *
 * ONE CONCEPT: Combine multiple functions into one, executing right-to-left
 */


// =============================================================================
// WHAT IS COMPOSE?
// =============================================================================

console.log('=== Function Composition ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  COMPOSE                                                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  compose(f, g, h)(x)  =  f(g(h(x)))                                  │
 *   │                                                                      │
 *   │  RIGHT TO LEFT execution:                                            │
 *   │                                                                      │
 *   │       x                                                              │
 *   │       │                                                              │
 *   │       ▼                                                              │
 *   │    ┌─────┐                                                           │
 *   │    │  h  │  ← First                                                  │
 *   │    └──┬──┘                                                           │
 *   │       │                                                              │
 *   │       ▼                                                              │
 *   │    ┌─────┐                                                           │
 *   │    │  g  │  ← Second                                                 │
 *   │    └──┬──┘                                                           │
 *   │       │                                                              │
 *   │       ▼                                                              │
 *   │    ┌─────┐                                                           │
 *   │    │  f  │  ← Third (last)                                           │
 *   │    └──┬──┘                                                           │
 *   │       │                                                              │
 *   │       ▼                                                              │
 *   │    result                                                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BASIC COMPOSE
// =============================================================================

console.log('=== Basic Compose ===\n');

// Without compose (nested calls)
const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

// Messy: read inside-out
const manualResult = square(double(addOne(5)));
console.log('Manual: square(double(addOne(5))) =', manualResult);

// Simple compose for 2 functions
const compose2 = (f, g) => x => f(g(x));

const addOneThenDouble = compose2(double, addOne);  // double(addOne(x))
console.log('compose2(double, addOne)(5) =', addOneThenDouble(5));


// =============================================================================
// COMPOSE IMPLEMENTATION
// =============================================================================

console.log('\n=== Compose Implementation ===\n');

// Compose any number of functions
function compose(...fns) {
  return function(x) {
    return fns.reduceRight((value, fn) => fn(value), x);
  };
}

// Alternative: one-liner
const composeOneLiner = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// Usage
const transform = compose(square, double, addOne);
// Execution: addOne(5) → double(6) → square(12)
console.log('compose(square, double, addOne)(5) =', transform(5));

// Verify step by step
console.log('\nStep by step:');
console.log('  5 → addOne → 6');
console.log('  6 → double → 12');
console.log('  12 → square → 144');


// =============================================================================
// WHY COMPOSE?
// =============================================================================

console.log('\n=== Why Compose? ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  BENEFITS                                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. READABILITY                                                     │
 *   │     compose(format, validate, parse)                                │
 *   │     vs                                                              │
 *   │     format(validate(parse(x)))                                      │
 *   │                                                                     │
 *   │  2. REUSABILITY                                                     │
 *   │     Create new functions from existing ones                         │
 *   │     const process = compose(save, transform, load)                  │
 *   │                                                                     │
 *   │  3. TESTABILITY                                                     │
 *   │     Test small functions individually                               │
 *   │     Compose them with confidence                                    │
 *   │                                                                     │
 *   │  4. POINT-FREE STYLE                                                │
 *   │     Define functions without mentioning data                        │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// REAL-WORLD: DATA TRANSFORMATION
// =============================================================================

console.log('=== Real-World: Data Pipeline ===\n');

// Individual, testable functions
const trim = str => str.trim();
const toLowerCase = str => str.toLowerCase();
const replaceSpaces = str => str.replace(/\s+/g, '-');
const addPrefix = prefix => str => `${prefix}-${str}`;

// Compose into a slug generator
const createSlug = compose(
  addPrefix('blog'),
  replaceSpaces,
  toLowerCase,
  trim
);

console.log('createSlug("  Hello World  "):', createSlug('  Hello World  '));
console.log('createSlug(" FP is GREAT "):', createSlug(' FP is GREAT '));


// =============================================================================
// REAL-WORLD: FORM PROCESSING
// =============================================================================

console.log('\n=== Real-World: Form Processing ===\n');

const sanitize = str => str.replace(/<[^>]*>/g, '');
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
const truncate = max => str => str.length > max ? str.slice(0, max) + '...' : str;

// Process user bio
const processBio = compose(
  truncate(50),
  capitalize,
  trim,
  sanitize
);

const userBio = '  <script>alert("xss")</script>hello world this is a very long bio that needs to be truncated  ';
console.log('Original:', userBio);
console.log('Processed:', processBio(userBio));


// =============================================================================
// COMPOSE WITH MULTIPLE ARGUMENTS
// =============================================================================

console.log('\n=== Compose with Multiple Arguments ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  HANDLING MULTIPLE ARGUMENTS                                       │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  compose only passes ONE value between functions                    │
 *   │                                                                     │
 *   │  Solutions:                                                         │
 *   │  1. First function can take multiple args                           │
 *   │  2. Use currying                                                    │
 *   │  3. Pass an object/array                                            │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Solution 1: First function takes multiple args
function composeMulti(...fns) {
  return function(...args) {
    const last = fns[fns.length - 1];
    const rest = fns.slice(0, -1);

    return rest.reduceRight(
      (value, fn) => fn(value),
      last(...args)  // First function gets all args
    );
  };
}

const add = (a, b) => a + b;
const multiplyBy3 = x => x * 3;

const addThenTriple = composeMulti(multiplyBy3, add);
console.log('addThenTriple(2, 3):', addThenTriple(2, 3));  // (2+3)*3 = 15


// Solution 2: Use currying
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}

const curriedAdd = curry((a, b) => a + b);
const processNumbers = compose(multiplyBy3, curriedAdd(10));
console.log('compose(multiplyBy3, curriedAdd(10))(5):', processNumbers(5));


// =============================================================================
// DEBUGGING COMPOSE
// =============================================================================

console.log('\n=== Debugging Compose ===\n');

// Tap function - for debugging in the middle of a pipeline
const tap = fn => x => {
  fn(x);
  return x;
};

const debugPipeline = compose(
  square,
  tap(x => console.log('After double:', x)),
  double,
  tap(x => console.log('After addOne:', x)),
  addOne
);

console.log('Debug pipeline with 5:');
const debugResult = debugPipeline(5);
console.log('Final result:', debugResult);


// =============================================================================
// COMPOSE IN REDUX
// =============================================================================

console.log('\n=== Compose in Redux ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  REDUX ENHANCER COMPOSITION                                        │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  const store = createStore(                                         │
 *   │    reducer,                                                         │
 *   │    compose(                                                         │
 *   │      applyMiddleware(thunk, logger),                                │
 *   │      DevTools.instrument()                                          │
 *   │    )                                                                │
 *   │  );                                                                 │
 *   │                                                                     │
 *   │  Each enhancer wraps the store creator                              │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulated store enhancers
const withLogging = createStore => (...args) => {
  const store = createStore(...args);
  console.log('  Store created with logging');
  return {
    ...store,
    dispatch: action => {
      console.log('  Dispatching:', action.type);
      return store.dispatch(action);
    }
  };
};

const withDevTools = createStore => (...args) => {
  const store = createStore(...args);
  console.log('  Store created with DevTools');
  return store;
};

// Mock createStore
const mockCreateStore = (reducer) => ({
  getState: () => ({}),
  dispatch: (action) => console.log('  Base dispatch:', action.type)
});

// Compose enhancers
const enhancedCreateStore = compose(
  withLogging,
  withDevTools
)(mockCreateStore);

console.log('Creating enhanced store:');
const store = enhancedCreateStore(() => {});
console.log('\nDispatching action:');
store.dispatch({ type: 'TEST' });


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Compose combines multiple functions into one, executing them right-to-left.
 * compose(f, g, h)(x) equals f(g(h(x))). It's like mathematical function
 * composition.
 *
 * The main benefit is building complex transformations from simple, testable
 * functions. Instead of nesting calls like format(validate(parse(input))),
 * I write compose(format, validate, parse) which reads top-to-bottom.
 *
 * I implement compose using reduceRight - it iterates through the functions
 * from right to left, passing each result to the next function.
 *
 * In Redux, compose is used to combine store enhancers. In data processing,
 * I compose functions for validation, transformation, and formatting.
 *
 * For debugging composed pipelines, I use a tap function that logs intermediate
 * values without changing them.
 *
 * The main gotcha is that compose only passes one value between functions,
 * so either the first function takes multiple args, or I use currying."
 */


// RUN: node docs/28-functional-programming/07-compose.js
