/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNCTIONAL PROGRAMMING - FILE 7: PRACTICAL FP PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Real-world functional programming patterns and techniques for everyday
 * JavaScript development. Bridge the gap between theory and practice.
 */

console.log("═══════════════════════════════════════════════════════════════════");
console.log("       PRACTICAL FP PATTERNS - REAL-WORLD APPLICATIONS             ");
console.log("═══════════════════════════════════════════════════════════════════\n");

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    FP UTILITIES LIBRARY                                    ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  Common FP utilities you'll use daily. These form the foundation for     ║
 * ║  functional programming in JavaScript.                                     ║
 * ║                                                                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("1️⃣  FP UTILITIES LIBRARY\n");

// Core utilities
const identity = x => x;
const constant = x => () => x;
const always = constant;

// Function composition
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// Currying
const curry = fn => {
  const curried = (...args) =>
    args.length >= fn.length
      ? fn(...args)
      : (...more) => curried(...args, ...more);
  return curried;
};

// Partial application
const partial = (fn, ...fixed) => (...args) => fn(...fixed, ...args);

// Negation
const not = fn => (...args) => !fn(...args);
const complement = not;

// Property access
const prop = curry((key, obj) => obj[key]);
const path = curry((keys, obj) =>
  keys.reduce((acc, key) => (acc ? acc[key] : undefined), obj)
);

// Comparison
const eq = curry((a, b) => a === b);
const gt = curry((a, b) => b > a);
const lt = curry((a, b) => b < a);
const gte = curry((a, b) => b >= a);
const lte = curry((a, b) => b <= a);

// Array utilities
const head = arr => arr[0];
const tail = arr => arr.slice(1);
const last = arr => arr[arr.length - 1];
const init = arr => arr.slice(0, -1);
const take = curry((n, arr) => arr.slice(0, n));
const drop = curry((n, arr) => arr.slice(n));
const flatten = arr => arr.reduce((flat, item) =>
  flat.concat(Array.isArray(item) ? flatten(item) : item), []);

// Curried array methods
const map = curry((fn, arr) => arr.map(fn));
const filter = curry((pred, arr) => arr.filter(pred));
const reduce = curry((fn, init, arr) => arr.reduce(fn, init));
const find = curry((pred, arr) => arr.find(pred));
const some = curry((pred, arr) => arr.some(pred));
const every = curry((pred, arr) => arr.every(pred));
const includes = curry((item, arr) => arr.includes(item));
const sort = curry((compareFn, arr) => [...arr].sort(compareFn));

// Object utilities
const keys = obj => Object.keys(obj);
const values = obj => Object.values(obj);
const entries = obj => Object.entries(obj);
const fromEntries = arr => Object.fromEntries(arr);
const pick = curry((keys, obj) =>
  keys.reduce((acc, key) => (key in obj ? { ...acc, [key]: obj[key] } : acc), {}));
const omit = curry((keys, obj) =>
  Object.keys(obj).reduce((acc, key) =>
    keys.includes(key) ? acc : { ...acc, [key]: obj[key] }, {}));
const merge = curry((a, b) => ({ ...a, ...b }));

console.log("=== Utility Demonstrations ===\n");

const users = [
  { name: 'Alice', age: 30, role: 'admin' },
  { name: 'Bob', age: 25, role: 'user' },
  { name: 'Charlie', age: 35, role: 'admin' }
];

// Using curried utilities
const getName = prop('name');
const isAdmin = pipe(prop('role'), eq('admin'));
const isAdult = pipe(prop('age'), gte(18));

console.log("Names:", map(getName, users));
console.log("Admins:", filter(isAdmin, users).map(getName));
console.log("Over 30:", filter(pipe(prop('age'), gt(30)), users).map(getName));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    DATA TRANSFORMATION PIPELINES
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("2️⃣  DATA TRANSFORMATION PIPELINES\n");

// Sample data
const orders = [
  { id: 1, userId: 1, items: [{ product: 'Laptop', price: 1200, qty: 1 }], status: 'completed' },
  { id: 2, userId: 2, items: [{ product: 'Phone', price: 800, qty: 2 }], status: 'pending' },
  { id: 3, userId: 1, items: [{ product: 'Tablet', price: 500, qty: 1 }, { product: 'Case', price: 50, qty: 2 }], status: 'completed' },
  { id: 4, userId: 3, items: [{ product: 'Monitor', price: 400, qty: 2 }], status: 'cancelled' },
  { id: 5, userId: 2, items: [{ product: 'Keyboard', price: 100, qty: 1 }], status: 'completed' }
];

// Calculate order total
const orderTotal = order =>
  order.items.reduce((sum, item) => sum + item.price * item.qty, 0);

// Pipeline: Get completed orders total by user
const getCompletedOrderTotalsByUser = pipe(
  filter(pipe(prop('status'), eq('completed'))),
  reduce((acc, order) => {
    const userId = order.userId;
    acc[userId] = (acc[userId] || 0) + orderTotal(order);
    return acc;
  }, {})
);

console.log("=== Order Analytics ===\n");
console.log("Completed order totals by user:", getCompletedOrderTotalsByUser(orders));

// Pipeline: Get top products by revenue
const getProductRevenue = pipe(
  map(prop('items')),
  flatten,
  reduce((acc, item) => {
    acc[item.product] = (acc[item.product] || 0) + item.price * item.qty;
    return acc;
  }, {}),
  entries,
  sort((a, b) => b[1] - a[1]),
  take(3),
  fromEntries
);

console.log("Top 3 products by revenue:", getProductRevenue(orders));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    VALIDATION PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("3️⃣  VALIDATION PATTERNS\n");

// Validation result type
const Success = value => ({
  isSuccess: true,
  value,
  map: fn => Success(fn(value)),
  flatMap: fn => fn(value),
  fold: (onError, onSuccess) => onSuccess(value),
  concat: other => other.isSuccess ? Success(value) : other
});

const Failure = errors => ({
  isSuccess: false,
  errors: Array.isArray(errors) ? errors : [errors],
  map: fn => Failure(errors),
  flatMap: fn => Failure(errors),
  fold: (onError, onSuccess) => onError(errors),
  concat: other => other.isSuccess ? Failure(errors) : Failure([...errors, ...other.errors])
});

// Validation combinators
const validate = (predicate, errorMsg) => value =>
  predicate(value) ? Success(value) : Failure(errorMsg);

const validateAll = (...validators) => value =>
  validators.reduce(
    (result, validator) => result.concat(validator(value)),
    Success(value)
  );

// Validators
const isNotEmpty = validate(
  s => s && s.length > 0,
  'Cannot be empty'
);

const isEmail = validate(
  s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s),
  'Must be a valid email'
);

const minLength = min => validate(
  s => s && s.length >= min,
  `Must be at least ${min} characters`
);

const maxLength = max => validate(
  s => s && s.length <= max,
  `Must be at most ${max} characters`
);

const matches = (regex, msg) => validate(
  s => regex.test(s),
  msg
);

console.log("=== Validation Examples ===\n");

const validateEmail = value =>
  validateAll(isNotEmpty, isEmail)(value).fold(
    errors => ({ valid: false, errors }),
    value => ({ valid: true, value })
  );

console.log("validateEmail('test@example.com'):", validateEmail('test@example.com'));
console.log("validateEmail(''):", validateEmail(''));
console.log("validateEmail('invalid'):", validateEmail('invalid'));

// Password validation with multiple rules
const validatePassword = value =>
  validateAll(
    minLength(8),
    maxLength(50),
    matches(/[A-Z]/, 'Must contain uppercase'),
    matches(/[a-z]/, 'Must contain lowercase'),
    matches(/[0-9]/, 'Must contain number')
  )(value).fold(
    errors => ({ valid: false, errors }),
    value => ({ valid: true })
  );

console.log("\nvalidatePassword('abc'):", validatePassword('abc'));
console.log("validatePassword('Abcdefgh1'):", validatePassword('Abcdefgh1'));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    FUNCTION DECORATORS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("4️⃣  FUNCTION DECORATORS\n");

// Memoization with max cache size
function memoize(fn, maxSize = 100) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      // Move to end (LRU)
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    if (cache.size > maxSize) {
      // Remove oldest (first) entry
      cache.delete(cache.keys().next().value);
    }
    return result;
  };
}

// Debounce
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    return new Promise(resolve => {
      timeoutId = setTimeout(() => resolve(fn.apply(this, args)), delay);
    });
  };
}

// Throttle
function throttle(fn, limit) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

// Retry with exponential backoff
function retry(fn, maxRetries = 3, baseDelay = 1000) {
  return async function(...args) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, i)));
        }
      }
    }
    throw lastError;
  };
}

// Timeout wrapper
function withTimeout(fn, ms) {
  return async function(...args) {
    return Promise.race([
      fn.apply(this, args),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), ms)
      )
    ]);
  };
}

// Once - only execute once
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

// Before/After hooks
function before(fn, beforeFn) {
  return function(...args) {
    beforeFn.apply(this, args);
    return fn.apply(this, args);
  };
}

function after(fn, afterFn) {
  return function(...args) {
    const result = fn.apply(this, args);
    afterFn.call(this, result, ...args);
    return result;
  };
}

console.log("=== Decorator Examples ===\n");

// Memoized fibonacci
const fib = memoize(n => n <= 1 ? n : fib(n - 1) + fib(n - 2));

console.time("First fib(40)");
console.log("fib(40):", fib(40));
console.timeEnd("First fib(40)");

console.time("Second fib(40)");
console.log("fib(40) cached:", fib(40));
console.timeEnd("Second fib(40)");

// Once example
const initializeApp = once(() => {
  console.log("  App initialized!");
  return { ready: true };
});

console.log("\nCalling initializeApp 3 times:");
initializeApp();
initializeApp();
initializeApp();


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    LENS PATTERN
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("5️⃣  LENS PATTERN - IMMUTABLE NESTED UPDATES\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                        LENS PATTERN                                        │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  A Lens is a pair of functions:                                           │
 * │  • get: Extract a value from a structure                                  │
 * │  • set: Immutably update a value in a structure                           │
 * │                                                                            │
 * │  Perfect for deeply nested immutable updates!                             │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Simple lens implementation
const lens = (getter, setter) => ({
  get: obj => getter(obj),
  set: (value, obj) => setter(value, obj),
  modify: (fn, obj) => setter(fn(getter(obj)), obj)
});

// Lens combinators
const propLens = key => lens(
  obj => obj[key],
  (value, obj) => ({ ...obj, [key]: value })
);

const pathLens = (...keys) => lens(
  obj => keys.reduce((acc, key) => acc && acc[key], obj),
  (value, obj) => {
    if (keys.length === 0) return value;
    if (keys.length === 1) return { ...obj, [keys[0]]: value };

    const [first, ...rest] = keys;
    return {
      ...obj,
      [first]: pathLens(...rest).set(value, obj[first] || {})
    };
  }
);

// Compose lenses
const composeLens = (outer, inner) => lens(
  obj => inner.get(outer.get(obj)),
  (value, obj) => outer.set(inner.set(value, outer.get(obj)), obj)
);

console.log("=== Lens Examples ===\n");

const user = {
  name: 'Alice',
  address: {
    city: 'Seattle',
    country: 'USA',
    zip: '98101'
  },
  preferences: {
    theme: 'dark',
    notifications: true
  }
};

// Create lenses
const addressLens = propLens('address');
const cityLens = propLens('city');
const addressCityLens = composeLens(addressLens, cityLens);

// Or use path lens directly
const themeLens = pathLens('preferences', 'theme');

console.log("Original user:", JSON.stringify(user, null, 2));

// Get values
console.log("\nGet city:", addressCityLens.get(user));
console.log("Get theme:", themeLens.get(user));

// Set values (immutable!)
const userInPortland = addressCityLens.set('Portland', user);
console.log("\nAfter setting city to Portland:");
console.log("New user city:", addressCityLens.get(userInPortland));
console.log("Original user city:", addressCityLens.get(user)); // Unchanged!

// Modify values
const userWithLightTheme = themeLens.modify(
  theme => theme === 'dark' ? 'light' : 'dark',
  user
);
console.log("\nAfter toggling theme:", themeLens.get(userWithLightTheme));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    TRANSDUCERS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("6️⃣  TRANSDUCERS - EFFICIENT TRANSFORMATIONS\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                        TRANSDUCERS                                         │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Problem with chaining:                                                   │
 * │  [1,2,3,4,5]                                                              │
 * │    .filter(x => x > 2)   → Creates intermediate array [3,4,5]            │
 * │    .map(x => x * 2)      → Creates intermediate array [6,8,10]           │
 * │    .filter(x => x > 6)   → Creates final array [8,10]                    │
 * │                                                                            │
 * │  Transducers compose transformations without intermediate arrays!        │
 * │  Process each element through entire pipeline before moving to next.     │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Transducer helpers
const transducerMap = fn => reducer => (acc, val) => reducer(acc, fn(val));

const transducerFilter = pred => reducer => (acc, val) =>
  pred(val) ? reducer(acc, val) : acc;

const composeTransducers = (...xforms) =>
  xforms.reduce((acc, xform) => reducer => acc(xform(reducer)));

const transduce = (xform, reducer, init, arr) =>
  arr.reduce(xform(reducer), init);

// Array reducer
const arrayReducer = (acc, val) => { acc.push(val); return acc; };

console.log("=== Transducer Example ===\n");

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Traditional chaining (creates intermediate arrays)
const traditionalResult = data
  .filter(x => x > 3)
  .map(x => x * 2)
  .filter(x => x > 10);

// Using transducers (no intermediate arrays)
const xform = composeTransducers(
  transducerFilter(x => x > 3),
  transducerMap(x => x * 2),
  transducerFilter(x => x > 10)
);

const transducerResult = transduce(xform, arrayReducer, [], data);

console.log("Traditional result:", traditionalResult);
console.log("Transducer result:", transducerResult);
console.log("Results equal:", JSON.stringify(traditionalResult) === JSON.stringify(transducerResult));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    STATE MANAGEMENT PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("7️⃣  FUNCTIONAL STATE MANAGEMENT\n");

// Simple Redux-like store
function createStore(reducer, initialState) {
  let state = initialState;
  let listeners = [];

  return {
    getState: () => state,
    dispatch: action => {
      state = reducer(state, action);
      listeners.forEach(listener => listener(state));
      return action;
    },
    subscribe: listener => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(l => l !== listener);
      };
    }
  };
}

// Reducer combinators
const combineReducers = reducers => (state = {}, action) =>
  Object.keys(reducers).reduce((nextState, key) => {
    nextState[key] = reducers[key](state[key], action);
    return nextState;
  }, {});

console.log("=== Redux-like Store ===\n");

// Example reducers
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT': return state + 1;
    case 'DECREMENT': return state - 1;
    default: return state;
  }
};

const todosReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  counter: counterReducer,
  todos: todosReducer
});

const store = createStore(rootReducer, { counter: 0, todos: [] });

// Subscribe to changes
store.subscribe(state => console.log("  State updated:", state));

console.log("Initial state:", store.getState());
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'ADD_TODO', text: 'Learn FP' });
store.dispatch({ type: 'INCREMENT' });


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    ASYNC FP PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("8️⃣  ASYNC FP PATTERNS\n");

// Async pipe
const asyncPipe = (...fns) => x =>
  fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(x));

// Parallel execution
const parallel = (...fns) => x =>
  Promise.all(fns.map(fn => fn(x)));

// Sequential with results
const sequential = (...fns) => async x => {
  const results = [];
  for (const fn of fns) {
    results.push(await fn(x));
  }
  return results;
};

// Error handling wrapper
const tryCatch = (tryFn, catchFn) => async (...args) => {
  try {
    return await tryFn(...args);
  } catch (error) {
    return catchFn(error);
  }
};

console.log("=== Async Patterns ===\n");

// Simulate async operations
const fetchUserData = async (id) => {
  await new Promise(r => setTimeout(r, 50));
  return { id, name: `User ${id}` };
};

const enrichWithPosts = async (user) => {
  await new Promise(r => setTimeout(r, 30));
  return { ...user, posts: ['Post 1', 'Post 2'] };
};

const formatUser = (user) => ({
  displayName: user.name.toUpperCase(),
  postCount: user.posts.length
});

// Async pipeline
const getUserProfile = asyncPipe(
  fetchUserData,
  enrichWithPosts,
  formatUser
);

getUserProfile(1).then(profile => {
  console.log("User profile:", profile);
});

// Parallel operations
const getStats = parallel(
  async x => ({ sum: x.reduce((a, b) => a + b, 0) }),
  async x => ({ avg: x.reduce((a, b) => a + b, 0) / x.length }),
  async x => ({ max: Math.max(...x) })
);

getStats([1, 2, 3, 4, 5]).then(results => {
  console.log("Parallel stats:", results);
});


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        INTERVIEW QUESTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("📋  PRACTICAL FP - INTERVIEW QUESTIONS\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q1: How do you handle errors functionally?                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Use Either/Result types instead of exceptions:                           │
│                                                                              │
│    const divide = (a, b) =>                                                 │
│      b === 0 ? Failure('Cannot divide by zero') : Success(a / b);          │
│                                                                              │
│    divide(10, 2).map(x => x + 1).fold(err => err, val => val);             │
│                                                                              │
│    Errors propagate through the chain without try/catch.                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q2: What is a lens and when would you use it?                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A lens is a pair of get/set functions for focusing on a part of data.   │
│                                                                              │
│    Use lenses for:                                                          │
│    • Deeply nested immutable updates                                        │
│    • Reusable property accessors                                            │
│    • Separating structure from access logic                                 │
│                                                                              │
│    const nameLens = lens(obj => obj.name, (v, obj) => ({...obj, name: v}));│
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q3: What are transducers and why are they useful?                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Transducers are composable transformation functions that:               │
│    • Don't create intermediate collections                                  │
│    • Work with any data structure (arrays, streams, etc.)                  │
│    • Are more memory efficient for large datasets                          │
│                                                                              │
│    Instead of arr.filter().map().filter() creating arrays each time,       │
│    transducers process each element through the entire pipeline once.      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q4: How do you implement debounce functionally?                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: function debounce(fn, delay) {                                           │
│      let timeoutId;                                                         │
│      return function(...args) {                                             │
│        clearTimeout(timeoutId);                                             │
│        timeoutId = setTimeout(() => fn.apply(this, args), delay);          │
│      };                                                                      │
│    }                                                                         │
│                                                                              │
│    It's a higher-order function that transforms any function into one      │
│    that only executes after a pause in calls.                               │
└─────────────────────────────────────────────────────────────────────────────┘
`);


console.log("═".repeat(70));
console.log("📝  PRACTICAL FP CHEAT SHEET\n");

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                       PRACTICAL FP QUICK REFERENCE                         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  CORE UTILITIES:                                                           ║
║    pipe(...fns)(x)      - Left-to-right composition                       ║
║    compose(...fns)(x)   - Right-to-left composition                       ║
║    curry(fn)            - Transform to curried function                   ║
║    partial(fn, ...args) - Fix some arguments                              ║
║                                                                            ║
║  CURRIED ARRAY FUNCTIONS:                                                  ║
║    map(fn)(arr)         filter(pred)(arr)        reduce(fn, init)(arr)    ║
║    find(pred)(arr)      some(pred)(arr)          every(pred)(arr)         ║
║                                                                            ║
║  DECORATORS:                                                               ║
║    memoize(fn)          - Cache results                                   ║
║    debounce(fn, ms)     - Delay until pause                               ║
║    throttle(fn, ms)     - Limit call rate                                 ║
║    once(fn)             - Execute only first call                         ║
║    retry(fn, n, delay)  - Retry with backoff                              ║
║                                                                            ║
║  VALIDATION:                                                               ║
║    Success(value)       - Valid result                                    ║
║    Failure(errors)      - Invalid result                                  ║
║    validateAll(...)     - Combine validators                              ║
║                                                                            ║
║  LENSES:                                                                   ║
║    lens.get(obj)        - Extract value                                   ║
║    lens.set(val, obj)   - Set value (immutable)                           ║
║    lens.modify(fn, obj) - Transform value                                 ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

console.log("\n═══ FILE 7 COMPLETE ═══");
console.log("Run: node 08-interview-qa.js");
