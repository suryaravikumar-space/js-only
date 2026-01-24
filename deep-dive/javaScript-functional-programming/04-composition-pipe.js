/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNCTIONAL PROGRAMMING - FILE 4: COMPOSITION & PIPE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Function composition combines simple functions to build complex operations.
 * It's the cornerstone of functional programming - building software by
 * composing small, reusable pieces.
 */

console.log("═══════════════════════════════════════════════════════════════════");
console.log("       FUNCTION COMPOSITION & PIPE - BUILDING BLOCKS              ");
console.log("═══════════════════════════════════════════════════════════════════\n");

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    WHAT IS FUNCTION COMPOSITION?                           ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  Composition combines multiple functions into a single function.          ║
 * ║                                                                            ║
 * ║  Mathematical notation: (f ∘ g)(x) = f(g(x))                              ║
 * ║                                                                            ║
 * ║  ┌─────────────────────────────────────────────────────────────────────┐  ║
 * ║  │                                                                      │  ║
 * ║  │  WITHOUT COMPOSITION (nested calls):                                 │  ║
 * ║  │                                                                      │  ║
 * ║  │  result = h(g(f(x)))  ← Read inside-out (confusing)                 │  ║
 * ║  │                                                                      │  ║
 * ║  │  ───────────────────────────────────────────────────────────────    │  ║
 * ║  │                                                                      │  ║
 * ║  │  WITH COMPOSITION:                                                   │  ║
 * ║  │                                                                      │  ║
 * ║  │  const process = compose(h, g, f);                                  │  ║
 * ║  │  result = process(x);                                               │  ║
 * ║  │                                                                      │  ║
 * ║  │  Data flow: x → f → g → h → result                                 │  ║
 * ║  │                                                                      │  ║
 * ║  └─────────────────────────────────────────────────────────────────────┘  ║
 * ║                                                                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("1️⃣  BASIC COMPOSITION\n");

// Simple compose for two functions
const compose2 = (f, g) => x => f(g(x));

// Example functions
const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

// Compose them
const addOneThenDouble = compose2(double, addOne);
const doubleThenAddOne = compose2(addOne, double);

console.log("addOne(5) =", addOne(5));            // 6
console.log("double(5) =", double(5));            // 10
console.log("addOneThenDouble(5) =", addOneThenDouble(5));  // (5+1)*2 = 12
console.log("doubleThenAddOne(5) =", doubleThenAddOne(5));  // (5*2)+1 = 11

// Note: compose applies right-to-left
console.log("\ncompose applies RIGHT to LEFT:");
console.log("compose(double, addOne)(5) = double(addOne(5)) = double(6) = 12");


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    COMPOSE AND PIPE
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("2️⃣  COMPOSE vs PIPE\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                    COMPOSE vs PIPE                                         │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  COMPOSE (right-to-left):                                                 │
 * │  compose(h, g, f)(x) = h(g(f(x)))                                        │
 * │                                                                            │
 * │  Read: "h after g after f"                                                │
 * │  Mathematical style                                                        │
 * │                                                                            │
 * │  ───────────────────────────────────────────────────────────────────────  │
 * │                                                                            │
 * │  PIPE (left-to-right):                                                    │
 * │  pipe(f, g, h)(x) = h(g(f(x)))                                           │
 * │                                                                            │
 * │  Read: "f then g then h"                                                  │
 * │  Matches reading order                                                     │
 * │                                                                            │
 * │  Both produce the same result! Just different argument order.             │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Compose: right-to-left
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

// Pipe: left-to-right
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

// Same result, different order
const withCompose = compose(square, double, addOne);  // square(double(addOne(x)))
const withPipe = pipe(addOne, double, square);        // same result

console.log("Using compose(square, double, addOne)(5):", withCompose(5));
console.log("Using pipe(addOne, double, square)(5):", withPipe(5));

// (5 + 1) = 6, (6 * 2) = 12, (12 * 12) = 144

console.log("\nPipe is often preferred because it reads left-to-right,");
console.log("matching the order of execution.");


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    VISUALIZING DATA FLOW
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("3️⃣  VISUALIZING DATA FLOW\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                         DATA FLOW                                          │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  pipe(addOne, double, square)(5)                                          │
 * │                                                                            │
 * │       5                                                                    │
 * │       │                                                                    │
 * │       ▼                                                                    │
 * │  ┌─────────┐                                                              │
 * │  │ addOne  │  5 + 1 = 6                                                   │
 * │  └────┬────┘                                                              │
 * │       │                                                                    │
 * │       ▼                                                                    │
 * │  ┌─────────┐                                                              │
 * │  │ double  │  6 * 2 = 12                                                  │
 * │  └────┬────┘                                                              │
 * │       │                                                                    │
 * │       ▼                                                                    │
 * │  ┌─────────┐                                                              │
 * │  │ square  │  12 * 12 = 144                                               │
 * │  └────┬────┘                                                              │
 * │       │                                                                    │
 * │       ▼                                                                    │
 * │      144                                                                   │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Debug composition with trace
const trace = label => value => {
  console.log(`  ${label}:`, value);
  return value;
};

const debugPipeline = pipe(
  trace('Input'),
  addOne,
  trace('After addOne'),
  double,
  trace('After double'),
  square,
  trace('After square')
);

console.log("=== Debug Pipeline ===\n");
const finalResult = debugPipeline(5);
console.log("\n  Final result:", finalResult);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    PRACTICAL COMPOSITION
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("4️⃣  PRACTICAL COMPOSITION EXAMPLES\n");

// String processing pipeline
console.log("=== String Processing ===\n");

const trim = s => s.trim();
const toLowerCase = s => s.toLowerCase();
const split = sep => s => s.split(sep);
const join = sep => arr => arr.join(sep);
const map = fn => arr => arr.map(fn);
const filter = pred => arr => arr.filter(pred);
const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

// Create a slug from title
const slugify = pipe(
  trim,
  toLowerCase,
  split(/\s+/),
  filter(word => word.length > 0),
  join('-')
);

console.log("slugify('  Hello World  '):", slugify('  Hello World  '));
console.log("slugify('The Quick Brown Fox'):", slugify('The Quick Brown Fox'));

// Title case a sentence
const titleCase = pipe(
  trim,
  toLowerCase,
  split(' '),
  map(capitalize),
  join(' ')
);

console.log("titleCase('hello world'):", titleCase('hello world'));


// Number processing pipeline
console.log("\n=== Number Processing ===\n");

const numbers = [1, -2, 3, -4, 5, -6, 7, 8, 9, 10];

const processNumbers = pipe(
  filter(n => n > 0),      // Keep positive
  map(n => n * 2),         // Double
  filter(n => n > 5),      // Keep > 5
);

console.log("Original:", numbers);
console.log("Processed:", processNumbers(numbers));

// With reduce
const sum = arr => arr.reduce((a, b) => a + b, 0);
const average = arr => arr.length ? sum(arr) / arr.length : 0;

const getPositiveAverage = pipe(
  filter(n => n > 0),
  average
);

console.log("Positive average:", getPositiveAverage(numbers));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    COMPOSING WITH MULTIPLE ARGUMENTS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("5️⃣  COMPOSING FUNCTIONS WITH MULTIPLE ARGUMENTS\n");

// Problem: compose works with unary functions (single argument)
// Solution: Use currying!

const add = a => b => a + b;
const multiply = a => b => a * b;
const subtract = a => b => a - b;

// Create specialized unary functions
const add5 = add(5);
const multiplyBy3 = multiply(3);
const subtract10 = subtract(10);

const calculate = pipe(
  add5,         // x + 5
  multiplyBy3,  // (x + 5) * 3
  subtract10    // ((x + 5) * 3) - 10
);

console.log("calculate(10) = ((10 + 5) * 3) - 10 =", calculate(10)); // 35

// Another approach: wrapper for multi-arg functions
const applyTo = (...args) => fn => fn(...args);

// Use in composition
const process = value => pipe(
  add(5),
  multiply(value),
  subtract(10)
);

console.log("process(2)(10) = ((10 + 5) * 2) - 10 =", process(2)(10)); // 20


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    COMPOSITION UTILITIES
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("6️⃣  USEFUL COMPOSITION UTILITIES\n");

// Identity function - does nothing (useful for defaults)
const identity = x => x;

// Constant function - always returns the same value
const constant = x => () => x;

// Tap - execute side effect, return original value
const tap = fn => x => {
  fn(x);
  return x;
};

// When - conditional execution
const when = (predicate, fn) => x =>
  predicate(x) ? fn(x) : x;

// Unless - opposite of when
const unless = (predicate, fn) => x =>
  predicate(x) ? x : fn(x);

// IfElse - conditional branching
const ifElse = (predicate, onTrue, onFalse) => x =>
  predicate(x) ? onTrue(x) : onFalse(x);

// Examples
console.log("=== Utility Examples ===\n");

const isPositive = x => x > 0;
const negate = x => -x;
const abs = x => Math.abs(x);

// when: only apply function if condition is true
const makePositive = when(x => x < 0, negate);
console.log("makePositive(-5):", makePositive(-5)); // 5
console.log("makePositive(5):", makePositive(5));   // 5

// ifElse: choose between two transformations
const handleNumber = ifElse(
  isPositive,
  x => `+${x}`,
  x => `${x}`
);
console.log("handleNumber(5):", handleNumber(5));   // "+5"
console.log("handleNumber(-5):", handleNumber(-5)); // "-5"

// tap: for debugging
const processWithLog = pipe(
  tap(x => console.log("  Input:", x)),
  double,
  tap(x => console.log("  After double:", x)),
  addOne,
  tap(x => console.log("  After addOne:", x))
);

console.log("\nUsing tap for debugging:");
const result = processWithLog(5);
console.log("  Final:", result);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    ASYNC COMPOSITION
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("7️⃣  ASYNC COMPOSITION\n");

// Async pipe - works with promises
const asyncPipe = (...fns) => x =>
  fns.reduce(
    (promise, fn) => promise.then(fn),
    Promise.resolve(x)
  );

// Async compose
const asyncCompose = (...fns) =>
  asyncPipe(...fns.reverse());

// Example async functions
const fetchUser = async (id) => {
  // Simulated async operation
  await new Promise(r => setTimeout(r, 10));
  return { id, name: 'Alice', email: 'alice@example.com' };
};

const enrichWithPosts = async (user) => {
  await new Promise(r => setTimeout(r, 10));
  return { ...user, posts: ['Post 1', 'Post 2'] };
};

const formatUserData = (user) => ({
  displayName: user.name,
  contactEmail: user.email,
  postCount: user.posts.length
});

// Async pipeline
const getUserProfile = asyncPipe(
  fetchUser,
  enrichWithPosts,
  formatUserData
);

// Execute
console.log("=== Async Pipeline ===\n");

getUserProfile(1).then(profile => {
  console.log("User profile:", profile);
});

console.log(`
// Async pipe implementation:
const asyncPipe = (...fns) => x =>
  fns.reduce(
    (promise, fn) => promise.then(fn),
    Promise.resolve(x)
  );

// Usage:
const processUser = asyncPipe(
  fetchUser,
  validateUser,
  enrichUser,
  saveUser
);

await processUser(userId);
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    REAL-WORLD PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("8️⃣  REAL-WORLD COMPOSITION PATTERNS\n");

// Pattern 1: Validation pipeline
console.log("=== Validation Pipeline ===\n");

const createValidator = (predicate, errorMsg) => value =>
  predicate(value) ? { valid: true, value } : { valid: false, error: errorMsg, value };

const chainValidators = (...validators) => value =>
  validators.reduce(
    (result, validator) =>
      result.valid ? validator(result.value) : result,
    { valid: true, value }
  );

const isNotEmpty = createValidator(
  s => s.length > 0,
  'Value cannot be empty'
);

const isEmail = createValidator(
  s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s),
  'Invalid email format'
);

const maxLength = max => createValidator(
  s => s.length <= max,
  `Must be at most ${max} characters`
);

const validateEmail = chainValidators(
  isNotEmpty,
  maxLength(50),
  isEmail
);

console.log("validateEmail('test@example.com'):", validateEmail('test@example.com'));
console.log("validateEmail(''):", validateEmail(''));
console.log("validateEmail('invalid'):", validateEmail('invalid'));


// Pattern 2: Middleware-style composition
console.log("\n=== Middleware Pattern ===\n");

const createMiddleware = (...middlewares) => {
  return (context) => {
    let index = -1;

    const dispatch = (i) => {
      if (i <= index) throw new Error('next() called multiple times');
      index = i;

      const fn = middlewares[i];
      if (!fn) return context;

      return fn(context, () => dispatch(i + 1));
    };

    return dispatch(0);
  };
};

console.log(`
// Middleware pattern (like Express/Koa):
const app = createMiddleware(
  async (ctx, next) => {
    console.log('Start');
    await next();
    console.log('End');
  },
  async (ctx, next) => {
    ctx.user = await fetchUser(ctx.userId);
    await next();
  },
  (ctx, next) => {
    ctx.response = { user: ctx.user };
  }
);

await app({ userId: 1 });
`);


// Pattern 3: Redux-style reducer composition
console.log("=== Reducer Composition ===\n");

const combineReducers = reducers => (state, action) => {
  return Object.keys(reducers).reduce((nextState, key) => {
    nextState[key] = reducers[key](state[key], action);
    return nextState;
  }, {});
};

console.log(`
const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
  comments: commentsReducer
});

// Each reducer handles its slice of state
const nextState = rootReducer(currentState, action);
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        INTERVIEW QUESTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("📋  COMPOSITION - INTERVIEW QUESTIONS\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q1: What is function composition?                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Combining two or more functions to create a new function where the      │
│    output of one function becomes the input of the next.                    │
│                                                                              │
│    compose(f, g)(x) = f(g(x))                                               │
│                                                                              │
│    Benefits: Reusability, testability, readability, maintainability.       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q2: What's the difference between compose and pipe?                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Execution direction:                                                     │
│                                                                              │
│    compose(f, g, h)(x) → f(g(h(x))) — right-to-left                        │
│    pipe(f, g, h)(x) → h(g(f(x))) — left-to-right                           │
│                                                                              │
│    Same result, different argument order.                                   │
│    Pipe matches natural reading order (left-to-right).                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q3: Implement compose function.                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: const compose = (...fns) => x =>                                         │
│      fns.reduceRight((acc, fn) => fn(acc), x);                             │
│                                                                              │
│    // Or for two functions:                                                 │
│    const compose2 = (f, g) => x => f(g(x));                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q4: How does currying relate to composition?                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Composition works best with unary (single-argument) functions.          │
│    Currying transforms multi-arg functions into unary functions.            │
│                                                                              │
│    const add = a => b => a + b; // Curried                                  │
│    const add5 = add(5);         // Unary, composable                        │
│                                                                              │
│    const process = pipe(add5, double, square);                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q5: What is point-free style?                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Writing function definitions without explicitly mentioning arguments.   │
│                                                                              │
│    // Pointed:                                                              │
│    const process = x => pipe(addOne, double, square)(x);                   │
│                                                                              │
│    // Point-free:                                                           │
│    const process = pipe(addOne, double, square);                           │
│                                                                              │
│    Composition enables point-free style naturally.                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q6: How do you compose async functions?                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Use promise chaining:                                                    │
│                                                                              │
│    const asyncPipe = (...fns) => x =>                                       │
│      fns.reduce(                                                            │
│        (promise, fn) => promise.then(fn),                                   │
│        Promise.resolve(x)                                                   │
│      );                                                                      │
│                                                                              │
│    const process = asyncPipe(fetchUser, validate, save);                    │
│    await process(userId);                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                           CHEAT SHEET
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("📝  COMPOSITION CHEAT SHEET\n");

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                    COMPOSITION QUICK REFERENCE                             ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  COMPOSE (right-to-left):                                                  ║
║    const compose = (...fns) => x =>                                        ║
║      fns.reduceRight((acc, fn) => fn(acc), x);                            ║
║                                                                            ║
║  PIPE (left-to-right):                                                     ║
║    const pipe = (...fns) => x =>                                           ║
║      fns.reduce((acc, fn) => fn(acc), x);                                 ║
║                                                                            ║
║  ASYNC PIPE:                                                               ║
║    const asyncPipe = (...fns) => x =>                                      ║
║      fns.reduce((p, fn) => p.then(fn), Promise.resolve(x));               ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                         UTILITIES                                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  identity = x => x                 // Return unchanged                     ║
║  constant = x => () => x           // Always return same value            ║
║  tap = fn => x => { fn(x); return x; }  // Side effect + return          ║
║  when = (pred, fn) => x => pred(x) ? fn(x) : x                            ║
║  unless = (pred, fn) => x => pred(x) ? x : fn(x)                          ║
║  ifElse = (pred, t, f) => x => pred(x) ? t(x) : f(x)                      ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                      REMEMBER                                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  • Composition works with unary functions                                  ║
║  • Use currying to create unary functions from multi-arg                  ║
║  • Pipe reads left-to-right (more intuitive)                              ║
║  • Compose reads right-to-left (mathematical style)                       ║
║  • Use tap for debugging                                                  ║
║  • Keep functions pure for reliable composition                           ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

console.log("\n═══ FILE 4 COMPLETE ═══");
console.log("Run: node 05-functors-monads.js");
