/**
 * FUNCTIONAL PROGRAMMING: 08 - Pipe
 *
 * ONE CONCEPT: Combine multiple functions into one, executing left-to-right
 */


// =============================================================================
// WHAT IS PIPE?
// =============================================================================

console.log('=== Pipe ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  PIPE vs COMPOSE                                                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  COMPOSE (right to left):        PIPE (left to right):               │
 *   │  compose(f, g, h)(x)             pipe(h, g, f)(x)                    │
 *   │  = f(g(h(x)))                    = f(g(h(x)))                        │
 *   │                                                                      │
 *   │  Both produce same result, different reading order!                  │
 *   │                                                                      │
 *   │                                                                      │
 *   │  PIPE: Read like a recipe                                            │
 *   │  ─────────────────────────                                           │
 *   │       x                                                              │
 *   │       │                                                              │
 *   │       ▼                                                              │
 *   │    ┌─────┐                                                           │
 *   │    │  h  │  ← First (listed first)                                   │
 *   │    └──┬──┘                                                           │
 *   │       │                                                              │
 *   │       ▼                                                              │
 *   │    ┌─────┐                                                           │
 *   │    │  g  │  ← Second                                                 │
 *   │    └──┬──┘                                                           │
 *   │       │                                                              │
 *   │       ▼                                                              │
 *   │    ┌─────┐                                                           │
 *   │    │  f  │  ← Third (listed last)                                    │
 *   │    └──┬──┘                                                           │
 *   │       │                                                              │
 *   │       ▼                                                              │
 *   │    result                                                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// PIPE IMPLEMENTATION
// =============================================================================

console.log('=== Pipe Implementation ===\n');

// Using reduce (left to right)
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

// Compare with compose
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// Test functions
const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

// Same result, different order
const withCompose = compose(square, double, addOne);  // Read: square(double(addOne))
const withPipe = pipe(addOne, double, square);        // Read: addOne → double → square

console.log('compose(square, double, addOne)(5):', withCompose(5));
console.log('pipe(addOne, double, square)(5):', withPipe(5));

// Step by step for pipe:
console.log('\nPipe step by step:');
console.log('  5 → addOne → 6');
console.log('  6 → double → 12');
console.log('  12 → square → 144');


// =============================================================================
// WHY PIPE?
// =============================================================================

console.log('\n=== Why Pipe? ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  PIPE IS MORE INTUITIVE                                            │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Reads like instructions:                                           │
 *   │                                                                     │
 *   │  const processUser = pipe(                                          │
 *   │    validateInput,      // Step 1                                    │
 *   │    sanitizeData,       // Step 2                                    │
 *   │    saveToDatabase,     // Step 3                                    │
 *   │    sendConfirmation    // Step 4                                    │
 *   │  );                                                                 │
 *   │                                                                     │
 *   │  vs compose (reads bottom-to-top):                                  │
 *   │                                                                     │
 *   │  const processUser = compose(                                       │
 *   │    sendConfirmation,   // Step 4                                    │
 *   │    saveToDatabase,     // Step 3                                    │
 *   │    sanitizeData,       // Step 2                                    │
 *   │    validateInput       // Step 1                                    │
 *   │  );                                                                 │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// REAL-WORLD: TEXT PROCESSING PIPELINE
// =============================================================================

console.log('=== Real-World: Text Processing ===\n');

// Small, focused functions
const trim = s => s.trim();
const toLowerCase = s => s.toLowerCase();
const removeExtraSpaces = s => s.replace(/\s+/g, ' ');
const capitalizeWords = s => s.replace(/\b\w/g, c => c.toUpperCase());
const addPeriod = s => s.endsWith('.') ? s : s + '.';

// Readable pipeline
const formatSentence = pipe(
  trim,
  toLowerCase,
  removeExtraSpaces,
  capitalizeWords,
  addPeriod
);

const messy = '   hello    WORLD   how   ARE   you   ';
console.log('Input:', JSON.stringify(messy));
console.log('Output:', formatSentence(messy));


// =============================================================================
// REAL-WORLD: DATA TRANSFORMATION
// =============================================================================

console.log('\n=== Real-World: Data Transformation ===\n');

// Sample data
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true },
  { name: 'Diana', age: 28, active: true }
];

// Pipeline operations
const filterActive = users => users.filter(u => u.active);
const sortByAge = users => [...users].sort((a, b) => a.age - b.age);
const pluckNames = users => users.map(u => u.name);
const joinWithComma = arr => arr.join(', ');

// Build the pipeline
const getActiveUserNames = pipe(
  filterActive,
  sortByAge,
  pluckNames,
  joinWithComma
);

console.log('Users:', JSON.stringify(users));
console.log('Active users (sorted by age):', getActiveUserNames(users));


// =============================================================================
// ASYNC PIPE
// =============================================================================

console.log('\n=== Async Pipe ===\n');

// Pipe for async functions
const asyncPipe = (...fns) => x =>
  fns.reduce(
    (promise, fn) => promise.then(fn),
    Promise.resolve(x)
  );

// Simulated async operations
const fetchUser = async (id) => {
  console.log(`  Fetching user ${id}...`);
  return { id, name: 'Alice', email: 'alice@example.com' };
};

const validateUser = async (user) => {
  console.log(`  Validating user...`);
  if (!user.email) throw new Error('Email required');
  return user;
};

const enrichUser = async (user) => {
  console.log(`  Enriching user data...`);
  return { ...user, enriched: true, timestamp: Date.now() };
};

// Async pipeline
const processUser = asyncPipe(
  fetchUser,
  validateUser,
  enrichUser
);

console.log('Processing user:');
processUser(123).then(result => {
  console.log('Result:', result);
});


// =============================================================================
// PIPE WITH EARLY EXIT (Railway Oriented)
// =============================================================================

console.log('\n=== Pipe with Error Handling ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  RAILWAY ORIENTED PROGRAMMING                                      │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Success Track:  ────●────●────●────●──── Success                   │
 *   │                      │    │    │    │                               │
 *   │  Failure Track:  ────┴────┴────┴────┴──── Error                     │
 *   │                                                                     │
 *   │  If any step fails, skip to the failure track                       │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Result wrapper
const Result = {
  ok: value => ({ isOk: true, value }),
  err: error => ({ isOk: false, error }),

  map: fn => result =>
    result.isOk ? Result.ok(fn(result.value)) : result,

  chain: fn => result =>
    result.isOk ? fn(result.value) : result
};

// Railway pipe
const pipeResult = (...fns) => x =>
  fns.reduce(
    (result, fn) => Result.chain(fn)(result),
    Result.ok(x)
  );

// Validation pipeline
const validateEmail = email => {
  if (!email.includes('@')) return Result.err('Invalid email');
  return Result.ok(email);
};

const validateLength = str => {
  if (str.length < 5) return Result.err('Too short');
  return Result.ok(str);
};

const validateNoSpaces = str => {
  if (str.includes(' ')) return Result.err('Contains spaces');
  return Result.ok(str);
};

const validateEmailFull = pipeResult(
  validateLength,
  validateNoSpaces,
  validateEmail
);

console.log('Validate "test@example.com":',
  validateEmailFull('test@example.com'));
console.log('Validate "bad":',
  validateEmailFull('bad'));
console.log('Validate "has space@test.com":',
  validateEmailFull('has space@test.com'));


// =============================================================================
// PIPE OPERATOR (TC39 PROPOSAL)
// =============================================================================

console.log('\n=== Pipe Operator Proposal ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  FUTURE: |> PIPE OPERATOR (Stage 2)                                │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Current:                                                           │
 *   │  const result = pipe(                                               │
 *   │    addOne,                                                          │
 *   │    double,                                                          │
 *   │    square                                                           │
 *   │  )(5);                                                              │
 *   │                                                                     │
 *   │  With pipe operator:                                                │
 *   │  const result = 5                                                   │
 *   │    |> addOne                                                        │
 *   │    |> double                                                        │
 *   │    |> square;                                                       │
 *   │                                                                     │
 *   │  Even cleaner! (Not yet in JS, but proposed)                        │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulating pipe operator with a helper
const $ = (value) => ({
  pipe: (fn) => $(fn(value)),
  value: () => value
});

// Usage
const pipeOperatorStyle = $(5)
  .pipe(addOne)
  .pipe(double)
  .pipe(square)
  .value();

console.log('Simulated pipe operator style:', pipeOperatorStyle);


// =============================================================================
// COMPOSE VS PIPE: WHEN TO USE WHICH?
// =============================================================================

console.log('\n=== When to Use Which? ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  COMPOSE vs PIPE                                                   │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Use PIPE when:                                                     │
 *   │  • Building data processing pipelines                               │
 *   │  • You want to read steps top-to-bottom                             │
 *   │  • Working with sequences/workflows                                 │
 *   │                                                                     │
 *   │  Use COMPOSE when:                                                  │
 *   │  • Mathematical function composition                                │
 *   │  • Wrapping/decorating (middleware)                                 │
 *   │  • Redux enhancers                                                  │
 *   │  • When inner-to-outer makes sense                                  │
 *   │                                                                     │
 *   │  Most modern FP prefers pipe for readability                        │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('PIPE: data flows through transformations');
console.log('COMPOSE: functions wrap each other');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Pipe is like compose but executes functions left-to-right instead of
 * right-to-left. pipe(f, g, h)(x) means: call f first, pass result to g,
 * then to h.
 *
 * I prefer pipe because it reads like a recipe or workflow - the first
 * function listed is the first one executed. It's more intuitive for
 * data transformation pipelines.
 *
 * I implement it with reduce instead of reduceRight. Each function's
 * output becomes the next function's input.
 *
 * For async operations, I create an asyncPipe that chains promises
 * instead of values.
 *
 * A common pattern is 'railway oriented programming' where the pipe
 * can short-circuit on errors. Each function returns either success
 * or failure, and failures skip the remaining steps.
 *
 * There's a TC39 proposal for a native pipe operator |> which would
 * make this even cleaner. Until then, libraries like Ramda and lodash/fp
 * provide pipe functions."
 */


// RUN: node docs/28-functional-programming/08-pipe.js
