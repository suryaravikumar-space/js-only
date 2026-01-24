/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNCTIONAL PROGRAMMING - FILE 3: CURRYING & PARTIAL APPLICATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Currying and partial application transform functions to be more flexible
 * and composable by controlling how arguments are applied.
 */

console.log("═══════════════════════════════════════════════════════════════════");
console.log("       CURRYING & PARTIAL APPLICATION - ARGUMENT MANIPULATION      ");
console.log("═══════════════════════════════════════════════════════════════════\n");

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                        WHAT IS CURRYING?                                   ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  Currying transforms a function with multiple arguments into a            ║
 * ║  sequence of functions, each taking a single argument.                     ║
 * ║                                                                            ║
 * ║  ┌─────────────────────────────────────────────────────────────────────┐  ║
 * ║  │                                                                      │  ║
 * ║  │  NORMAL FUNCTION:                                                    │  ║
 * ║  │  add(a, b, c) ──────────────► result                                │  ║
 * ║  │  add(1, 2, 3) = 6                                                   │  ║
 * ║  │                                                                      │  ║
 * ║  │  CURRIED FUNCTION:                                                   │  ║
 * ║  │  add(a) ──► add(b) ──► add(c) ──► result                            │  ║
 * ║  │  add(1)(2)(3) = 6                                                   │  ║
 * ║  │                                                                      │  ║
 * ║  │  Each function returns a new function that takes the next argument. │  ║
 * ║  │  Named after Haskell Curry (mathematician).                         │  ║
 * ║  │                                                                      │  ║
 * ║  └─────────────────────────────────────────────────────────────────────┘  ║
 * ║                                                                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("1️⃣  CURRYING BASICS\n");

// Normal function
function addNormal(a, b, c) {
  return a + b + c;
}

// Manually curried version
function addCurried(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

// Arrow function syntax (more concise)
const addCurriedArrow = a => b => c => a + b + c;

console.log("Normal: add(1, 2, 3) =", addNormal(1, 2, 3));
console.log("Curried: add(1)(2)(3) =", addCurried(1)(2)(3));
console.log("Arrow curried: add(1)(2)(3) =", addCurriedArrow(1)(2)(3));

// Partial application through currying
const add1 = addCurriedArrow(1);      // Returns b => c => 1 + b + c
const add1and2 = add1(2);             // Returns c => 1 + 2 + c
const result = add1and2(3);           // Returns 6

console.log("\nPartial application:");
console.log("  const add1 = add(1)");
console.log("  const add1and2 = add1(2)");
console.log("  add1and2(3) =", result);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    WHY USE CURRYING?
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("2️⃣  WHY USE CURRYING?\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                    BENEFITS OF CURRYING                                    │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  1. REUSABLE SPECIALIZED FUNCTIONS                                        │
 * │     Create specific versions of general functions                        │
 * │                                                                            │
 * │  2. CONFIGURATION THEN USE                                                 │
 * │     Configure once, use many times                                        │
 * │                                                                            │
 * │  3. FUNCTION COMPOSITION                                                   │
 * │     Single-argument functions compose better                              │
 * │                                                                            │
 * │  4. POINT-FREE STYLE                                                       │
 * │     Write cleaner code without explicit parameters                        │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Example 1: Reusable specialized functions
console.log("=== Reusable Specialized Functions ===\n");

const multiply = a => b => a * b;

const double = multiply(2);
const triple = multiply(3);
const quadruple = multiply(4);

console.log("double(5) =", double(5));
console.log("triple(5) =", triple(5));
console.log("quadruple(5) =", quadruple(5));

// Use with map
const numbers = [1, 2, 3, 4, 5];
console.log("numbers.map(double):", numbers.map(double));


// Example 2: Configuration then use
console.log("\n=== Configure Once, Use Many Times ===\n");

const createLogger = prefix => message => console.log(`[${prefix}] ${message}`);

const logInfo = createLogger('INFO');
const logError = createLogger('ERROR');
const logDebug = createLogger('DEBUG');

logInfo('Application started');
logError('Something went wrong');
logDebug('Variable value: 42');


// Example 3: API request factory
console.log("\n=== API Request Factory ===\n");

const createFetcher = baseUrl => endpoint => options =>
  `Fetching ${baseUrl}${endpoint} with ${JSON.stringify(options)}`;

const apiV1 = createFetcher('https://api.example.com/v1');
const getUsers = apiV1('/users');
const getPosts = apiV1('/posts');

console.log(getUsers({ limit: 10 }));
console.log(getPosts({ sort: 'date' }));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    AUTOMATIC CURRYING
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("3️⃣  AUTOMATIC CURRYING UTILITY\n");

// Generic curry function
function curry(fn) {
  return function curried(...args) {
    // If we have enough arguments, call the original function
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    // Otherwise, return a function that collects more arguments
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// Alternative with arrow functions
const curryArrow = fn =>
  function curried(...args) {
    return args.length >= fn.length
      ? fn(...args)
      : (...more) => curried(...args, ...more);
  };

// Test the curry utility
function add3(a, b, c) {
  return a + b + c;
}

const curriedAdd3 = curry(add3);

console.log("Original: add3(1, 2, 3) =", add3(1, 2, 3));
console.log("\nCurried can be called in multiple ways:");
console.log("  curriedAdd3(1, 2, 3) =", curriedAdd3(1, 2, 3));
console.log("  curriedAdd3(1)(2)(3) =", curriedAdd3(1)(2)(3));
console.log("  curriedAdd3(1, 2)(3) =", curriedAdd3(1, 2)(3));
console.log("  curriedAdd3(1)(2, 3) =", curriedAdd3(1)(2, 3));


// Practical example with curry
console.log("\n=== Practical Curry Example ===\n");

function formatDate(format, locale, date) {
  // Simplified implementation
  const options = {
    'short': { year: 'numeric', month: 'short', day: 'numeric' },
    'long': { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
  };
  return new Intl.DateTimeFormat(locale, options[format]).format(date);
}

const curriedFormatDate = curry(formatDate);

// Create specialized formatters
const formatShortUS = curriedFormatDate('short', 'en-US');
const formatLongUS = curriedFormatDate('long', 'en-US');
const formatShortDE = curriedFormatDate('short', 'de-DE');

const today = new Date();
console.log("Short US:", formatShortUS(today));
console.log("Long US:", formatLongUS(today));
console.log("Short DE:", formatShortDE(today));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    PARTIAL APPLICATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("4️⃣  PARTIAL APPLICATION\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                CURRYING vs PARTIAL APPLICATION                             │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  CURRYING:                                                                 │
 * │  • Transforms function to take ONE argument at a time                     │
 * │  • f(a, b, c) → f(a)(b)(c)                                               │
 * │  • Always unary (single argument) functions                               │
 * │                                                                            │
 * │  PARTIAL APPLICATION:                                                      │
 * │  • Fixes SOME arguments, returns function for the rest                    │
 * │  • f(a, b, c) with a fixed → f(b, c)                                     │
 * │  • Remaining function can take multiple arguments                         │
 * │                                                                            │
 * │  Both create specialized functions from general ones!                     │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Simple partial application
function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

function greet(greeting, punctuation, name) {
  return `${greeting}, ${name}${punctuation}`;
}

console.log("=== Partial Application ===\n");

const sayHello = partial(greet, 'Hello', '!');
const askQuestion = partial(greet, 'Hey', '?');

console.log(sayHello('Alice'));
console.log(sayHello('Bob'));
console.log(askQuestion('Charlie'));


// Partial with placeholders
const _ = Symbol('placeholder');

function partialWithPlaceholders(fn, ...partialArgs) {
  return function(...args) {
    const finalArgs = partialArgs.map(arg =>
      arg === _ ? args.shift() : arg
    );
    return fn(...finalArgs, ...args);
  };
}

console.log("\n=== Partial with Placeholders ===\n");

const greetBob = partialWithPlaceholders(greet, _, '!', 'Bob');
console.log(greetBob('Hello'));    // Hello, Bob!
console.log(greetBob('Goodbye'));  // Goodbye, Bob!


// Built-in Function.prototype.bind for partial application
console.log("\n=== Using bind() for Partial Application ===\n");

function multiply3(a, b, c) {
  return a * b * c;
}

const multiplyBy10 = multiply3.bind(null, 10);
const multiplyBy10And2 = multiply3.bind(null, 10, 2);

console.log("multiplyBy10(2, 3) =", multiplyBy10(2, 3));  // 10 * 2 * 3 = 60
console.log("multiplyBy10And2(3) =", multiplyBy10And2(3)); // 10 * 2 * 3 = 60


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    PRACTICAL EXAMPLES
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("5️⃣  PRACTICAL CURRYING EXAMPLES\n");

// Example 1: Filtering with curried predicates
console.log("=== Curried Predicates ===\n");

const filter = predicate => array => array.filter(predicate);
const greaterThan = min => value => value > min;
const lessThan = max => value => value < max;

const data = [1, 5, 10, 15, 20, 25, 30];

const filterGreaterThan10 = filter(greaterThan(10));
const filterLessThan20 = filter(lessThan(20));

console.log("Original:", data);
console.log("Greater than 10:", filterGreaterThan10(data));
console.log("Less than 20:", filterLessThan20(data));


// Example 2: Event handler factory
console.log("\n=== Event Handler Factory ===\n");

const handleEvent = eventType => handler => element => {
  console.log(`Adding ${eventType} handler to ${element}`);
  // element.addEventListener(eventType, handler);
  return { element, eventType, handler };
};

const onClick = handleEvent('click');
const onSubmit = handleEvent('submit');

const logClick = onClick(e => console.log('Clicked!'));

console.log(logClick('button#submit'));
console.log(logClick('a.link'));


// Example 3: String manipulation
console.log("\n=== String Manipulation ===\n");

const split = separator => str => str.split(separator);
const join = separator => arr => arr.join(separator);
const map = fn => arr => arr.map(fn);
const toLowerCase = str => str.toLowerCase();
const trim = str => str.trim();

// Compose into useful utilities
const words = split(' ');
const unwords = join(' ');
const lines = split('\n');
const unlines = join('\n');

const sentence = "  Hello   World  ";
console.log("words(sentence):", words(sentence));

const normalizeWords = str =>
  unwords(map(trim)(words(str)).filter(w => w.length > 0));

console.log("normalizeWords:", normalizeWords(sentence));


// Example 4: Validation
console.log("\n=== Curried Validation ===\n");

const validate = rules => value =>
  rules.every(rule => rule(value));

const minLength = min => str => str.length >= min;
const maxLength = max => str => str.length <= max;
const matches = regex => str => regex.test(str);
const isEmail = matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

const validatePassword = validate([
  minLength(8),
  maxLength(20),
  matches(/[A-Z]/),  // Has uppercase
  matches(/[a-z]/),  // Has lowercase
  matches(/[0-9]/)   // Has number
]);

console.log("validatePassword('Abc12345'):", validatePassword('Abc12345'));
console.log("validatePassword('abc'):", validatePassword('abc'));
console.log("validatePassword('ABCdefgh1'):", validatePassword('ABCdefgh1'));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    CURRYING WITH COMPOSITION
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("6️⃣  CURRYING ENABLES COMPOSITION\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                    POINT-FREE STYLE                                        │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  "Tacit programming" - define functions without mentioning arguments       │
 * │                                                                            │
 * │  // With explicit argument (pointed)                                       │
 * │  const double = x => multiply(2, x);                                      │
 * │                                                                            │
 * │  // Point-free (tacit)                                                     │
 * │  const double = multiply(2);                                              │
 * │                                                                            │
 * │  Curried functions make point-free style natural!                         │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Compose and pipe helpers
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

// Curried array operations
const mapC = fn => arr => arr.map(fn);
const filterC = pred => arr => arr.filter(pred);
const reduceC = (fn, init) => arr => arr.reduce(fn, init);

// Point-free data processing
const processNumbers = pipe(
  filterC(n => n > 0),           // Keep positive
  mapC(n => n * 2),              // Double
  filterC(n => n < 50),          // Keep under 50
  reduceC((a, b) => a + b, 0)    // Sum
);

const nums = [-5, 10, 15, 20, 25, 30, -10, 5];
console.log("Input:", nums);
console.log("Processed (positive → double → <50 → sum):", processNumbers(nums));


// String processing pipeline
console.log("\n=== String Processing Pipeline ===\n");

const toUpperCase = str => str.toUpperCase();
const exclaim = str => `${str}!`;
const repeat = n => str => str.repeat(n);

const shout = pipe(
  toUpperCase,
  exclaim,
  repeat(3)
);

console.log(shout("hello"));  // "HELLO!HELLO!HELLO!"


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    ADVANCED CURRYING PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("7️⃣  ADVANCED CURRYING PATTERNS\n");

// Right-to-left currying (flip)
const flip = fn => a => b => fn(b)(a);

const divide = a => b => a / b;
const divideBy = flip(divide);

console.log("=== Flip ===");
console.log("divide(10)(2) =", divide(10)(2));     // 10 / 2 = 5
console.log("divideBy(2)(10) =", divideBy(2)(10)); // 10 / 2 = 5


// Uncurry - convert curried back to normal
const uncurry = fn => (...args) => args.reduce((acc, arg) => acc(arg), fn);

console.log("\n=== Uncurry ===");
const curriedAdd = a => b => c => a + b + c;
const normalAdd = uncurry(curriedAdd);

console.log("curriedAdd(1)(2)(3) =", curriedAdd(1)(2)(3));
console.log("normalAdd(1, 2, 3) =", normalAdd(1, 2, 3));


// Curry with arity specification
function curryN(n, fn) {
  return function curried(...args) {
    if (args.length >= n) {
      return fn(...args);
    }
    return (...more) => curried(...args, ...more);
  };
}

console.log("\n=== CurryN (specified arity) ===");
function variadicAdd(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}

const add4 = curryN(4, variadicAdd);
console.log("add4(1)(2)(3)(4) =", add4(1)(2)(3)(4));


// Thunk - delayed computation
console.log("\n=== Thunks (Delayed Computation) ===");

const thunk = fn => (...args) => () => fn(...args);
const force = thunk => thunk();

const delayedLog = thunk(console.log);
const greetingThunk = delayedLog("  Hello from thunk!");

console.log("Thunk created but not executed yet...");
force(greetingThunk);  // Now it executes


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        INTERVIEW QUESTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("📋  CURRYING - INTERVIEW QUESTIONS\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q1: What is currying?                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Currying transforms a function with multiple arguments into a sequence  │
│    of unary (single-argument) functions.                                    │
│                                                                              │
│    f(a, b, c) becomes f(a)(b)(c)                                            │
│                                                                              │
│    Named after mathematician Haskell Curry.                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q2: What's the difference between currying and partial application?        │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Currying:                                                                │
│    • Always returns unary functions                                         │
│    • f(a, b, c) → f(a)(b)(c)                                               │
│    • All-or-nothing transformation                                         │
│                                                                              │
│    Partial Application:                                                      │
│    • Fixes some arguments, can return multi-arg function                    │
│    • f(a, b, c) with a fixed → f(b, c)                                     │
│    • More flexible                                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q3: Implement a curry function.                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: function curry(fn) {                                                     │
│      return function curried(...args) {                                     │
│        if (args.length >= fn.length) {                                      │
│          return fn(...args);                                                │
│        }                                                                     │
│        return (...more) => curried(...args, ...more);                       │
│      };                                                                      │
│    }                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q4: What is fn.length and why does curry use it?                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: fn.length returns the number of formal parameters the function expects. │
│                                                                              │
│    function add(a, b, c) {} // length = 3                                   │
│    function variadic(...args) {} // length = 0                              │
│                                                                              │
│    curry uses it to know when enough arguments have been collected          │
│    to call the original function.                                           │
│                                                                              │
│    Note: Default params and rest params affect length.                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q5: What is point-free style?                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Defining functions without explicitly mentioning their arguments.        │
│                                                                              │
│    // Pointed (explicit argument)                                           │
│    const double = x => multiply(2)(x);                                      │
│                                                                              │
│    // Point-free                                                            │
│    const double = multiply(2);                                              │
│                                                                              │
│    Currying enables point-free style by returning configured functions.    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q6: How does currying enable function composition?                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Compose works with unary functions (single input → single output).      │
│    Curried functions produce unary functions, making them composable.       │
│                                                                              │
│    // Curried operations                                                    │
│    const add = a => b => a + b;                                             │
│    const multiply = a => b => a * b;                                        │
│                                                                              │
│    // Compose unary functions                                               │
│    const add5ThenDouble = compose(multiply(2), add(5));                     │
│    add5ThenDouble(10) // (10 + 5) * 2 = 30                                  │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                           CHEAT SHEET
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("📝  CURRYING CHEAT SHEET\n");

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                       CURRYING QUICK REFERENCE                             ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  MANUAL CURRYING:                                                          ║
║    const add = a => b => c => a + b + c;                                  ║
║    add(1)(2)(3) // 6                                                      ║
║                                                                            ║
║  CURRY UTILITY:                                                            ║
║    const curry = fn =>                                                     ║
║      function curried(...args) {                                           ║
║        return args.length >= fn.length                                     ║
║          ? fn(...args)                                                     ║
║          : (...more) => curried(...args, ...more);                        ║
║      };                                                                    ║
║                                                                            ║
║  PARTIAL APPLICATION:                                                      ║
║    const partial = (fn, ...fixed) =>                                       ║
║      (...rest) => fn(...fixed, ...rest);                                  ║
║                                                                            ║
║    // Or use bind:                                                         ║
║    const greetHello = greet.bind(null, 'Hello');                          ║
║                                                                            ║
║  COMMON PATTERNS:                                                          ║
║    // Configuration                                                        ║
║    const fetch = baseUrl => endpoint => options => ...                    ║
║    const api = fetch('https://api.com');                                  ║
║    const users = api('/users');                                           ║
║                                                                            ║
║    // Specialization                                                       ║
║    const multiply = a => b => a * b;                                      ║
║    const double = multiply(2);                                            ║
║                                                                            ║
║    // Point-free with arrays                                               ║
║    numbers.map(multiply(2))  // Instead of n => n * 2                     ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

console.log("\n═══ FILE 3 COMPLETE ═══");
console.log("Run: node 04-composition-pipe.js");
