/**
 * FUNCTIONAL PROGRAMMING: 06 - Partial Application
 *
 * ONE CONCEPT: Fix some arguments of a function, producing a new function
 *              with fewer parameters
 */


// =============================================================================
// WHAT IS PARTIAL APPLICATION?
// =============================================================================

console.log('=== Partial Application ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  PARTIAL APPLICATION                                                │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Original:   fn(a, b, c, d)                                          │
 *   │                   │                                                  │
 *   │                   │ fix a, b                                         │
 *   │                   ▼                                                  │
 *   │  Partial:    fn(c, d)     ← New function with fewer args             │
 *   │                                                                      │
 *   │                                                                      │
 *   │  EXAMPLE:                                                            │
 *   │  ─────────                                                           │
 *   │  greet(greeting, name) → "Hello, Alice"                              │
 *   │                                                                      │
 *   │  Fix first argument:                                                 │
 *   │  sayHello = partial(greet, "Hello")                                  │
 *   │  sayHello("Alice") → "Hello, Alice"                                  │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BUILT-IN: Function.prototype.bind
// =============================================================================

console.log('=== Using bind() ===\n');

function greet(greeting, name, punctuation) {
  return `${greeting}, ${name}${punctuation}`;
}

// bind() partially applies arguments from the left
const sayHello = greet.bind(null, 'Hello');
const sayHelloWorld = greet.bind(null, 'Hello', 'World');

console.log('greet("Hi", "Alice", "!"):', greet('Hi', 'Alice', '!'));
console.log('sayHello("Bob", "."):', sayHello('Bob', '.'));
console.log('sayHelloWorld("?"):', sayHelloWorld('?'));

// Note: First argument to bind is `this` context
const obj = {
  prefix: '>>',
  format(msg) {
    return `${this.prefix} ${msg}`;
  }
};

const boundFormat = obj.format.bind(obj);  // Preserve `this`
console.log('boundFormat("test"):', boundFormat('test'));


// =============================================================================
// CUSTOM PARTIAL FUNCTION
// =============================================================================

console.log('\n=== Custom partial() Function ===\n');

function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

// Usage
function log(level, category, message) {
  console.log(`[${level}] [${category}] ${message}`);
}

const errorLog = partial(log, 'ERROR');
const dbError = partial(log, 'ERROR', 'Database');

errorLog('API', 'Request failed');
dbError('Connection timeout');


// =============================================================================
// PARTIAL WITH PLACEHOLDERS
// =============================================================================

console.log('\n=== Partial with Placeholders ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  PLACEHOLDER PATTERN                                               │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Sometimes you want to fix arguments in the MIDDLE:                 │
 *   │                                                                     │
 *   │  divide(a, b) → a / b                                               │
 *   │                                                                     │
 *   │  Regular partial: partial(divide, 10) → divideFrom10(b) → 10/b      │
 *   │                                                                     │
 *   │  With placeholder: partial(divide, _, 2) → divideBy2(a) → a/2       │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Placeholder symbol
const _ = Symbol('placeholder');

function partialWithPlaceholders(fn, ...partialArgs) {
  return function(...laterArgs) {
    const args = [];
    let laterIndex = 0;

    // Fill in placeholders with later arguments
    for (const arg of partialArgs) {
      if (arg === _) {
        args.push(laterArgs[laterIndex++]);
      } else {
        args.push(arg);
      }
    }

    // Add remaining arguments
    while (laterIndex < laterArgs.length) {
      args.push(laterArgs[laterIndex++]);
    }

    return fn(...args);
  };
}

function divide(a, b) {
  return a / b;
}

const divideBy2 = partialWithPlaceholders(divide, _, 2);  // Fix second arg
const divide10By = partialWithPlaceholders(divide, 10, _);  // Fix first arg

console.log('divideBy2(10):', divideBy2(10));    // 10 / 2 = 5
console.log('divide10By(2):', divide10By(2));    // 10 / 2 = 5


// =============================================================================
// CURRYING VS PARTIAL APPLICATION
// =============================================================================

console.log('\n=== Currying vs Partial Application ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  COMPARISON                                                        │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  CURRYING                                                           │
 *   │  • One argument at a time                                           │
 *   │  • f(a, b, c) → f(a)(b)(c)                                          │
 *   │  • Always returns unary functions                                   │
 *   │  • Arguments in order (left to right)                               │
 *   │                                                                     │
 *   │  PARTIAL APPLICATION                                                │
 *   │  • Fix some arguments now                                           │
 *   │  • f(a, b, c) with a fixed → f(b, c)                                │
 *   │  • Returns function with fewer arguments                            │
 *   │  • Can fix arguments at any position (with placeholders)            │
 *   │                                                                     │
 *   │                                                                     │
 *   │  CURRYING:    add(1)(2)(3)                                          │
 *   │  PARTIAL:     partial(add, 1, 2)(3)                                  │
 *   │               partial(add, 1)(2, 3)                                  │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Curry
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...more) => curried(...args, ...more);
  };
}

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
const partialAdd = partial(add, 1, 2);

console.log('Curried: curriedAdd(1)(2)(3):', curriedAdd(1)(2)(3));
console.log('Partial: partialAdd(3):', partialAdd(3));

// Both achieve similar results but differently
console.log('Curried: curriedAdd(1, 2)(3):', curriedAdd(1, 2)(3));
console.log('Partial: partial(add, 1)(2, 3):', partial(add, 1)(2, 3));


// =============================================================================
// REAL-WORLD: API CONFIGURATION
// =============================================================================

console.log('\n=== Real-World: API Configuration ===\n');

function fetchData(baseUrl, headers, method, endpoint, body = null) {
  console.log(`${method} ${baseUrl}${endpoint}`);
  console.log('Headers:', headers);
  if (body) console.log('Body:', body);
  return `Response from ${endpoint}`;
}

// Create configured API client
const apiClient = partial(fetchData,
  'https://api.example.com',
  { 'Authorization': 'Bearer token123' }
);

// Create method-specific functions
const apiGet = partial(apiClient, 'GET');
const apiPost = partial(apiClient, 'POST');
const apiDelete = partial(apiClient, 'DELETE');

console.log('GET request:');
apiGet('/users');

console.log('\nPOST request:');
apiPost('/users', { name: 'Alice' });


// =============================================================================
// REAL-WORLD: EVENT HANDLERS
// =============================================================================

console.log('\n=== Real-World: Event Handlers ===\n');

function handleClick(config, analytics, event) {
  console.log(`Click on: ${event.target}`);
  console.log(`Config: ${JSON.stringify(config)}`);
  console.log(`Analytics: ${analytics}`);
}

// Pre-configure with app settings
const appConfig = { theme: 'dark', debug: true };
const analyticsId = 'UA-12345';

const configuredHandler = partial(handleClick, appConfig, analyticsId);

// In React: onClick={configuredHandler}
// The event is passed automatically
configuredHandler({ target: 'button#submit' });


// =============================================================================
// REAL-WORLD: VALIDATION
// =============================================================================

console.log('\n=== Real-World: Validation ===\n');

function validate(rules, value) {
  for (const [ruleName, rule] of Object.entries(rules)) {
    if (!rule.test(value)) {
      return { valid: false, error: rule.message };
    }
  }
  return { valid: true };
}

// Pre-configured validators
const emailRules = {
  required: {
    test: v => v && v.length > 0,
    message: 'Email is required'
  },
  format: {
    test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: 'Invalid email format'
  }
};

const passwordRules = {
  required: {
    test: v => v && v.length > 0,
    message: 'Password is required'
  },
  minLength: {
    test: v => v && v.length >= 8,
    message: 'Password must be at least 8 characters'
  }
};

const validateEmail = partial(validate, emailRules);
const validatePassword = partial(validate, passwordRules);

console.log('validateEmail("test@example.com"):', validateEmail('test@example.com'));
console.log('validateEmail(""):', validateEmail(''));
console.log('validatePassword("short"):', validatePassword('short'));
console.log('validatePassword("longenough"):', validatePassword('longenough'));


// =============================================================================
// PARTIALRIGHT - FIX ARGUMENTS FROM THE RIGHT
// =============================================================================

console.log('\n=== partialRight ===\n');

function partialRight(fn, ...fixedArgs) {
  return function(...prependedArgs) {
    return fn(...prependedArgs, ...fixedArgs);
  };
}

function format(template, ...values) {
  return values.reduce((t, v, i) => t.replace(`{${i}}`, v), template);
}

const greetTemplate = partialRight(format, 'World', '!');
console.log('greetTemplate("Hello, {0}{1}"):', greetTemplate('Hello, {0}{1}'));


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Partial application is fixing some arguments of a function, producing
 * a new function with fewer parameters. It's different from currying -
 * currying transforms a function to take one argument at a time, while
 * partial application fixes some arguments immediately.
 *
 * In JavaScript, bind() does partial application from the left. You can
 * also write a custom partial function that's more flexible, supporting
 * placeholders to fix arguments at any position.
 *
 * I use partial application for configuration. For example, creating an
 * API client where I partially apply the base URL and auth headers, then
 * create get, post, delete functions that only need the endpoint and body.
 *
 * It's also great for event handlers in React - I can partially apply
 * configuration, and the event object gets passed as the last argument.
 *
 * The key benefit is creating specialized, reusable functions from
 * general ones without repeating configuration everywhere."
 */


// RUN: node docs/28-functional-programming/06-partial-application.js
